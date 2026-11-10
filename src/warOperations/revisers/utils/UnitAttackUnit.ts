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
import type { WoUnitAttackUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitAttackUnit.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoUnitAttackUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_01);
    }

    const unitMap           = war.getUnitMap();
    const mapSize           = unitMap.getMapSize();
    const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    if ((targetGridIndex == null) || (!targetGridIndex.checkIsInsideMap(mapSize))) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_02);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = AuxiliaryTypes_MovePath.MovePath.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId,
    });
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_03);
    }

    const attackerUnit = unitMap.getUnit(revisedPath.getNodes()[0].gridIndex, launchUnitId);
    if (attackerUnit == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_04);
    }

    if (!attackerUnit.checkCanAttackUnitAfterMovePath(rawPathNodes, targetGridIndex)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitAttackUnit_05);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoUnitAttackUnit : {
            path            : revisedPath.toProtoMovePath().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }), revisedPath);
}
