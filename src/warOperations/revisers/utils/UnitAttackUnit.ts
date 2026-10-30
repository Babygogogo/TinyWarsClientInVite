import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import {
    newError,
    getExisted,
} from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitAttackUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackUnit.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import {
    getRevisedPath,
    checkIsPathDestinationOccupiedByOtherVisibleUnit,
} from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitAttackUnit, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_01);
    }

    const unitMap           = war.getUnitMap();
    const mapSize           = unitMap.getMapSize();
    const targetGridIndex   = GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    if ((targetGridIndex == null) || (!targetGridIndex.checkIsInsideMap(mapSize))) {
        throw newError(`Invalid targetGridIndex.`, ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_02);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`, ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_03);
    }

    const attackerUnit = getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_04);
    if (!attackerUnit.checkCanAttackUnitAfterMovePath(rawPathNodes, targetGridIndex)) {
        throw newError(`Can not attack.`, ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_05);
    }

    return WoContainer.fromJson({
        WoUnitAttackUnit : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
