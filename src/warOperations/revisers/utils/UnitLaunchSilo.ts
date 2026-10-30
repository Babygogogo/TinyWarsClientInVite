import {
    Players_Constants,
    WarOperations_Revisers_Utils_Common,
    Utils_ClientErrorCode,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitLaunchSilo } from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchSilo.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitLaunchSilo, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperations_Revisers_Utils_Common.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = Helpers_Misc.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_03);
    const mapSize   = unitMap.getMapSize();
    const tile      = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
    if ((tile == null) || (!focusUnit.checkCanLaunchSiloOnTile(tile))) {
        throw Helpers_Misc.newError(`Can not launch silo.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_04);
    }

    const targetGridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    if ((targetGridIndex == null)                                       ||
        (!targetGridIndex.checkIsInsideMap(mapSize))
    ) {
        throw Helpers_Misc.newError(`Invalid targetGridIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchSilo_05);
    }

    return WoContainer.fromJson({
        WoUnitLaunchSilo : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
