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
import type { WoUnitLaunchFlare } from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitLaunchFlare, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_02);
    }

    const rawDestination    = rawPathNodes[rawPathNodes.length - 1];
    const unitMap           = war.getUnitMap();
    const focusUnit         = Helpers_Misc.getExisted(unitMap.getUnit(rawPathNodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_03);
    const mapSize           = unitMap.getMapSize();
    const flareMaxRange     = Helpers_Misc.getExisted(focusUnit.getFlareMaxRange(rawDestination), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_04);
    const targetGridIndex   = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getTargetGridIndex()), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_05);
    if ((rawPathNodes.length !== 1)                                     ||
        (!focusUnit.getFlareCurrentAmmo())                              ||
        (!war.getFogMap().checkHasFogCurrently())                       ||
        (!targetGridIndex.checkIsInsideMap(mapSize))                    ||
        (targetGridIndex.getDistance(rawDestination) > flareMaxRange)
    ) {
        throw Helpers_Misc.newError(`Can not launch.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_06);
    }

    return WoContainer.fromJson({
        WoUnitLaunchFlare : {
            path : WarOperations_Revisers_Utils_Common.getRevisedPath({
                war, rawPath, launchUnitId, requesterUserId, 
            }).toProto().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    });
}
