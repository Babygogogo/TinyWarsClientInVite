import {
    Players_Constants,
    WarOperations_Revisers_Utils_Common,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitCrushUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitCrushUnit.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitCrushUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`);
    }

    const rawPath       = rawAction.getPath();
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (rawPathNodes.length !== 1) {
        throw Helpers_Misc.newError(`Invalid path length.`);
    }

    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperations_Revisers_Utils_Common.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`);
    }

    const unitMap           = war.getUnitMap();
    const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    const destination       = rawPathNodes[rawPathNodes.length - 1];
    if ((targetGridIndex == null)                                   ||
        (!targetGridIndex.checkIsInsideMap(unitMap.getMapSize()))   ||
        (targetGridIndex.getDistance(destination) != 1)
    ) {
        throw Helpers_Misc.newError(`Invalid target gridIndex.`);
    }

    const focusUnit     = Helpers_Misc.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId));
    const targetUnit    = unitMap.getUnitOnMap(targetGridIndex);
    if ((!focusUnit.getTemplateCfg().getCanCrushAdjacentTargetUnit())                                           ||
        (war.getTileMap().getTile(targetGridIndex).getMoveCostByMoveType(focusUnit.getMoveTypeId()) == null)    ||
        (targetUnit == null)                                                                                    ||
        (targetUnit.getTeamIndex() === focusUnit.getTeamIndex())
    ) {
        throw Helpers_Misc.newError(`Invalid target.`);
    }

    return WoContainer.fromJson({
        WoUnitCrushUnit: {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
