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

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main, true);

    const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_01);
    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}
export async function endPhaseStandbyAsInnerWar(turnManager: Turns_Manager.Manager): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(Turns_Phases_Utils_ResetHasUnitOnBeginningTurn.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_HandleUnitBuffEffect.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_GetFund.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_ConsumeFuel.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_RecoverUnitByCo.runAsInnerWar(turnManager, CoSkills_Constants.AutoRecoveryTimingId.BeforeRegularRepair))
        .mergeFrom(Turns_Phases_Utils_RepairUnitByTile.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_DestroyUnitsOutOfFuel.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_RepairUnitByUnit.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_RecoverUnitByCo.runAsInnerWar(turnManager, CoSkills_Constants.AutoRecoveryTimingId.AfterRegularRepair))
        .mergeFrom(await Turns_Phases_Utils_ActivateMapWeapon.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_CheckAndUpdateUnitAiMode.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_Main.runAsInnerWar(turnManager));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main, true);

    return changedThings;
}
export async function endPhaseStandbyAsUnifiedWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(Turns_Phases_Utils_ResetHasUnitOnBeginningTurn.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_HandleUnitBuffEffect.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_GetFund.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ConsumeFuel.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_RecoverUnitByCo.runAsUnifiedWar(turnManager, CoSkills_Constants.AutoRecoveryTimingId.BeforeRegularRepair, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_RepairUnitByTile.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_DestroyUnitsOutOfFuel.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_RepairUnitByUnit.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_RecoverUnitByCo.runAsUnifiedWar(turnManager, CoSkills_Constants.AutoRecoveryTimingId.AfterRegularRepair, isFastExecute))
        .mergeFrom(await Turns_Phases_Utils_ActivateMapWeapon.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_CheckAndUpdateUnitAiMode.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_Main.runAsUnifiedWar(turnManager, isFastExecute));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main, true);

    return changedThings;
}

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

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn, true);

    const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_01);
    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}
export function endPhaseMainAsInnerWar(turnManager: Turns_Manager.Manager): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(Turns_Phases_Utils_RecoverUnitByCo.runAsInnerWar(turnManager, CoSkills_Constants.AutoRecoveryTimingId.BeforeEndTurn))
        .mergeFrom(Turns_Phases_Utils_ResetUnitState.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_ResetVisionForCurrentPlayer.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_HandleUnitBuffEffect2.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_TickTurnAndPlayerIndex.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_ResetSkillState.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_ResetVotesForDraw.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_UpdateWeatherAndForceFog.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_UpdateAllTileBuffArray.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_UpdateAllUnitBuffArray.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_ResetVisionForNextPlayer.runAsInnerWar(turnManager))
        .mergeFrom(Turns_Phases_Utils_WaitBeginTurn.runAsInnerWar(turnManager));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn, true);

    return changedThings;
}
export function endPhaseMainAsUnifiedWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(Turns_Phases_Utils_RecoverUnitByCo.runAsUnifiedWar(turnManager, CoSkills_Constants.AutoRecoveryTimingId.BeforeEndTurn, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetUnitState.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetVisionForCurrentPlayer.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_HandleUnitBuffEffect2.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_TickTurnAndPlayerIndex.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetSkillState.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetVotesForDraw.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_UpdateWeatherAndForceFog.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_UpdateAllTileBuffArray.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_UpdateAllUnitBuffArray.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_ResetVisionForNextPlayer.runAsUnifiedWar(turnManager, isFastExecute))
        .mergeFrom(Turns_Phases_Utils_WaitBeginTurn.runAsUnifiedWar(turnManager, isFastExecute));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn, true);

    return changedThings;
}
