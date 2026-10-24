import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitCrushUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitCrushUnit.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as WarOperationsRevisersUtilsCommon from "./Common.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoUnitCrushUnit.WoUnitCrushUnit, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive)) {
        throw HelpersMisc.newError(`Invalid aliveState.`);
    }

    const rawPath       = rawAction.getPath();
    const rawPathNodes  = rawPath?.getNodes().map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (rawPathNodes.length !== 1) {
        throw HelpersMisc.newError(`Invalid path length.`);
    }

    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperationsRevisersUtilsCommon.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    if (WarOperationsRevisersUtilsCommon.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw HelpersMisc.newError(`Destination occupied.`);
    }

    const unitMap           = war.getUnitMap();
    const targetGridIndex   = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    const destination       = rawPathNodes[rawPathNodes.length - 1];
    if ((targetGridIndex == null)                                   ||
        (!targetGridIndex.checkIsInsideMap(unitMap.getMapSize()))   ||
        (targetGridIndex.getDistance(destination) != 1)
    ) {
        throw HelpersMisc.newError(`Invalid target gridIndex.`);
    }

    const focusUnit     = HelpersMisc.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId));
    const targetUnit    = unitMap.getUnitOnMap(targetGridIndex);
    if ((!focusUnit.getTemplateCfg().getCanCrushAdjacentTargetUnit())                                           ||
        (war.getTileMap().getTile(targetGridIndex).getMoveCostByMoveType(focusUnit.getMoveTypeId()) == null)    ||
        (targetUnit == null)                                                                                    ||
        (targetUnit.getTeamIndex() === focusUnit.getTeamIndex())
    ) {
        throw HelpersMisc.newError(`Invalid target.`);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoUnitCrushUnit: {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
