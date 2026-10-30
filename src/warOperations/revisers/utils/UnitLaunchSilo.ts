import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import {
    newError,
    getExisted,
} from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitLaunchSilo } from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchSilo.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import {
    getRevisedPath,
    checkIsPathDestinationOccupiedByOtherVisibleUnit,
} from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitLaunchSilo, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`, ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_03);
    const mapSize   = unitMap.getMapSize();
    const tile      = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
    if ((tile == null) || (!focusUnit.checkCanLaunchSiloOnTile(tile))) {
        throw newError(`Can not launch silo.`, ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_04);
    }

    const targetGridIndex = GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    if ((targetGridIndex == null)                                       ||
        (!targetGridIndex.checkIsInsideMap(mapSize))
    ) {
        throw newError(`Invalid targetGridIndex.`, ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_05);
    }

    return WoContainer.fromJson({
        WoUnitLaunchSilo : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
