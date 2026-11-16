import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    CoSkills_Constants,
    Helpers_Misc,
    Turns_Constants,
    Turns_Phases_Utils_ActivateMapWeapon,
    Turns_Phases_Utils_CheckAndUpdateUnitAiMode,
    Turns_Phases_Utils_ConsumeFuel,
    Turns_Phases_Utils_DestroyUnitsOutOfFuel,
    Turns_Phases_Utils_GetFund,
    Turns_Phases_Utils_HandleUnitBuffEffect,
    Turns_Phases_Utils_HandleUnitBuffEffect2,
    Turns_Phases_Utils_Main,
    Turns_Phases_Utils_RecoverUnitByCo,
    Turns_Phases_Utils_RepairUnitByTile,
    Turns_Phases_Utils_RepairUnitByUnit,
    Turns_Phases_Utils_ResetHasUnitOnBeginningTurn,
    Turns_Phases_Utils_ResetSkillState,
    Turns_Phases_Utils_ResetUnitState,
    Turns_Phases_Utils_ResetVisionForCurrentPlayer,
    Turns_Phases_Utils_ResetVisionForNextPlayer,
    Turns_Phases_Utils_ResetVotesForDraw,
    Turns_Phases_Utils_TickTurnAndPlayerIndex,
    Turns_Phases_Utils_UpdateAllTileBuffArray,
    Turns_Phases_Utils_UpdateAllUnitBuffArray,
    Turns_Phases_Utils_UpdateWeatherAndForceFog,
    Turns_Phases_Utils_WaitBeginTurn,
    Utils_ClientErrorCode,
    WarOperations_Executors_Utils_Common,
    type Turns_Manager,
} from "../../internal";
import type { WoPlayerEndTurn } from "../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn";
import type { WoSystemBeginTurn } from "../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn";
import type { WoSystemEndTurn } from "../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function endPhaseStandbyAsOuterWar(turnManager: Turns_Manager.Manager, action: WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_00);
    }

    Turns_Phases_Utils_ResetHasUnitOnBeginningTurn.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_HandleUnitBuffEffect.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_GetFund.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_ConsumeFuel.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_RecoverUnitByCo.runAsOuterWar(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeRegularRepair);
    Turns_Phases_Utils_RepairUnitByTile.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_DestroyUnitsOutOfFuel.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_RepairUnitByUnit.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_RecoverUnitByCo.runAsOuterWar(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.AfterRegularRepair);
    await Turns_Phases_Utils_ActivateMapWeapon.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_CheckAndUpdateUnitAiMode.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_Main.runAsOuterWar(turnManager, isFastExecute);

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main, !isFastExecute);

    const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_01);
    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : Helpers_Misc.getExisted(turnManager.getWar()),
        commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}
export function endPhaseStandbyAsInnerWar(turnManager: Turns_Manager.Manager): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    return endPhaseStandbyAsLocalWar(turnManager, true);
}
export function endPhaseStandbyAsUnifiedWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    return endPhaseStandbyAsLocalWar(turnManager, isFastExecute);
}
async function endPhaseStandbyAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(Turns_Phases_Utils_ResetHasUnitOnBeginningTurn.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_HandleUnitBuffEffect.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_GetFund.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ConsumeFuel.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_RecoverUnitByCo.runAsLocalWar(turnManager, CoSkills_Constants.AutoRecoveryTimingId.BeforeRegularRepair, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_RepairUnitByTile.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_DestroyUnitsOutOfFuel.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_RepairUnitByUnit.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_RecoverUnitByCo.runAsLocalWar(turnManager, CoSkills_Constants.AutoRecoveryTimingId.AfterRegularRepair, isFastExecute))
        .mergeFrom(await Turns_Phases_Utils_ActivateMapWeapon.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_CheckAndUpdateUnitAiMode.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_Main.runAsLocalWar(turnManager, isFastExecute));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main, !isFastExecute);

    return changedThings;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function endPhaseMainAsOuterWar(turnManager: Turns_Manager.Manager, action: WoPlayerEndTurn | WoSystemEndTurn, isFastExecute: boolean): void {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_00);
    }

    Turns_Phases_Utils_RecoverUnitByCo.runAsOuterWar(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeEndTurn);
    Turns_Phases_Utils_ResetUnitState.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_ResetVisionForCurrentPlayer.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_HandleUnitBuffEffect2.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_TickTurnAndPlayerIndex.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_ResetSkillState.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_ResetVotesForDraw.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_UpdateWeatherAndForceFog.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_UpdateAllTileBuffArray.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_UpdateAllUnitBuffArray.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_ResetVisionForNextPlayer.runAsOuterWar(turnManager, isFastExecute);
    Turns_Phases_Utils_WaitBeginTurn.runAsOuterWar(turnManager, isFastExecute);

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn, !isFastExecute);

    const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_01);
    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : Helpers_Misc.getExisted(turnManager.getWar()),
        commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}
export function endPhaseMainAsInnerWar(turnManager: Turns_Manager.Manager): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return endPhaseMainAsLocalWar(turnManager, true);
}
export function endPhaseMainAsUnifiedWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return endPhaseMainAsLocalWar(turnManager, isFastExecute);
}
function endPhaseMainAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(Turns_Phases_Utils_RecoverUnitByCo.runAsLocalWar(turnManager, CoSkills_Constants.AutoRecoveryTimingId.BeforeEndTurn, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetUnitState.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetVisionForCurrentPlayer.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_HandleUnitBuffEffect2.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_TickTurnAndPlayerIndex.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetSkillState.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetVotesForDraw.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_UpdateWeatherAndForceFog.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_UpdateAllTileBuffArray.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_UpdateAllUnitBuffArray.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetVisionForNextPlayer.runAsLocalWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_WaitBeginTurn.runAsLocalWar(turnManager, isFastExecute));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn, !isFastExecute);

    return changedThings;
}
