import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitRepairUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitRepairUnit.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { getRevisedPath, checkIsPathDestinationOccupiedByOtherVisibleUnit } from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitRepairUnit, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`);
    }

    const rawPath       = rawAction.getPath();
    const rawPathNodes  = rawPath?.getNodes().map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`);
    }

    const unitMap           = war.getUnitMap();
    const targetGridIndex   = GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    const destination       = rawPathNodes[rawPathNodes.length - 1];
    if ((targetGridIndex == null)                                   ||
        (!targetGridIndex.checkIsInsideMap(unitMap.getMapSize()))   ||
        (targetGridIndex.getDistance(destination) != 1)
    ) {
        throw newError(`Invalid target gridIndex.`);
    }

    const focusUnit     = getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId));
    const targetUnit    = unitMap.getUnitOnMap(targetGridIndex);
    if ((!focusUnit.getTemplateCfg().getCanRepairAdjacentTargetUnit())                                      ||
        (targetUnit == null)                                                                                ||
        (targetUnit == focusUnit)                                                                           ||
        (targetUnit.getPlayerIndex() !== focusUnit.getPlayerIndex())                                        ||
        ((targetUnit.getCurrentHp() === targetUnit.getMaxHp()) && (!targetUnit.checkCanBeSupplied()))
    ) {
        throw newError(`Invalid target.`);
    }

    return WoContainer.fromJson({
        WoUnitRepairUnit: {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
