import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MovePath,
    Helpers_Misc,
    Players_Constants,
    Turns_Constants,
    WarOperations_Revisers_Utils_Common,
    Utils_ClientErrorCode,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitRepairUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitRepairUnit.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoUnitRepairUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitRepairUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitRepairUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = AuxiliaryTypes_MovePath.MovePath.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId,
    });
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitRepairUnit_02);
    }

    const unitMap           = war.getUnitMap();
    const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getTargetGridIndex());
    const destination       = rawPathNodes[rawPathNodes.length - 1];
    if ((targetGridIndex == null)                                   ||
        (!targetGridIndex.checkIsInsideMap(unitMap.getMapSize()))   ||
        (targetGridIndex.getDistance(destination) != 1)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitRepairUnit_03);
    }

    const focusUnit     = war.getUnitMap().getUnit(revisedPath.getNodes()[0].gridIndex, launchUnitId);
    if (focusUnit == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitRepairUnit_04);
    }

    const targetUnit    = unitMap.getUnitOnMap(targetGridIndex);
    if ((!focusUnit.getTemplateCfg().getCanRepairAdjacentTargetUnit())                                      ||
        (targetUnit == null)                                                                                ||
        (targetUnit == focusUnit)                                                                           ||
        (targetUnit.getPlayerIndex() !== focusUnit.getPlayerIndex())                                        ||
        ((targetUnit.getCurrentHp() === targetUnit.getMaxHp()) && (!targetUnit.checkCanBeSupplied()))
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitRepairUnit_05);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoUnitRepairUnit : {
            path            : revisedPath.toProtoMovePath().toJson(),
            launchUnitId    : launchUnitId,
            targetGridIndex : targetGridIndex.toProto().toJson(),
        },
    }), revisedPath);
}
