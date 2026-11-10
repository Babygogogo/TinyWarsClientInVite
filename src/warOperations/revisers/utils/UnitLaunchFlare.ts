import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MovePath,
    Helpers_Misc,
    Players_Constants,
    Turns_Constants,
    Utils_ClientErrorCode,
    WarOperations_Revisers_Utils_Common,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitLaunchFlare } from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoUnitLaunchFlare, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_02);
    }

    const rawDestination    = rawPathNodes[rawPathNodes.length - 1];
    const unitMap           = war.getUnitMap();
    const focusUnit         = unitMap.getUnit(rawPathNodes[0], launchUnitId);
    if (focusUnit == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_03);
    }

    const mapSize           = unitMap.getMapSize();
    const flareMaxRange     = focusUnit.getFlareMaxRange(rawDestination);
    if (flareMaxRange == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_04);
    }

    const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    if (targetGridIndex == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_05);
    }

    if ((rawPathNodes.length !== 1)                                     ||
        (!focusUnit.getFlareCurrentAmmo())                              ||
        (!war.getFogMap().checkHasFogCurrently())                       ||
        (!targetGridIndex.checkIsInsideMap(mapSize))                    ||
        (targetGridIndex.getDistance(rawDestination) > flareMaxRange)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitLaunchFlare_06);
    }

    const revisedPath = AuxiliaryTypes_MovePath.MovePath.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId,
    });
    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoUnitLaunchFlare : {
            path            : revisedPath.toProtoMovePath().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }), revisedPath);
}
