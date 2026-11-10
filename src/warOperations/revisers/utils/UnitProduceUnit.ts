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
import type { WoUnitProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoUnitProduceUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = AuxiliaryTypes_MovePath.MovePath.getRevisedPath({
        war, rawPath, launchUnitId, requesterUserId,
    });
    const rawPathNodes  = rawPath?.getNodes()?.map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_02);
    }

    const focusUnit         = war.getUnitMap().getUnit(revisedPath.getNodes()[0].gridIndex, launchUnitId);
    if (focusUnit == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_03);
    }

    const produceUnitType   = focusUnit.getProduceUnitTypeId();
    if (produceUnitType == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_04);
    }

    const playerIndexInTurn = playerInTurn.getPlayerIndex();
    {
        const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndexInTurn, produceUnitType);
        if (canProduce === false) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_05);
        } else if (canProduce == null) {
            if (war.getCommonSettingManager().getPlayerRule(playerIndexInTurn).getBannedUnitTypeArray().includes(produceUnitType)) {
                return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_06);
            }
        }
    }

    {
        const maxUnitsCount = war.getCommonSettingManager()
            .getInstanceWarRule()
            .getWarRuleCommonData()
            ?.getPlayerRuleList()
            .find(v => v.getPlayerIndex() === playerIndexInTurn)
            ?.getMaxUnitsCount();
        if ((maxUnitsCount != null) &&
            (war.getUnitMap().countAllUnitsForPlayer(playerIndexInTurn) >= maxUnitsCount)
        ) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_07);
        }
    }

    const fund          = playerInTurn.getFund();
    const cost          = focusUnit.getProduceUnitCost();
    const maxLoadCount  = focusUnit.getMaxLoadUnitsCount();
    if ((launchUnitId != null)                          ||
        (rawPathNodes.length !== 1)                     ||
        (!focusUnit.getCurrentProduceMaterial())        ||
        (cost == null)                                  ||
        (cost > fund)                                   ||
        (maxLoadCount == null)                          ||
        (focusUnit.getLoadedUnitsCount() >= maxLoadCount)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_08);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoUnitProduceUnit : {
            path         : revisedPath.toProtoMovePath().toJson(),
            launchUnitId : launchUnitId,
        },
    }), revisedPath);
}
