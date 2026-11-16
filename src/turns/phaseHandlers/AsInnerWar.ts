import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    CoSkills_Constants,
    Helpers_Misc,
    Turns_Constants,
    Turns_PhaseHandlers_ActivateMapWeapon,
    Turns_PhaseHandlers_CheckAndUpdateUnitAiMode,
    Turns_PhaseHandlers_ConsumeFuel,
    Turns_PhaseHandlers_DestroyUnitsOutOfFuel,
    Turns_PhaseHandlers_GetFund,
    Turns_PhaseHandlers_HandleUnitBuffEffect,
    Turns_PhaseHandlers_HandleUnitBuffEffect2,
    Turns_PhaseHandlers_Main,
    Turns_PhaseHandlers_RecoverUnitByCo,
    Turns_PhaseHandlers_RepairUnitByTile,
    Turns_PhaseHandlers_RepairUnitByUnit,
    Turns_PhaseHandlers_ResetHasUnitOnBeginningTurn,
    Turns_PhaseHandlers_ResetSkillState,
    Turns_PhaseHandlers_ResetUnitState,
    Turns_PhaseHandlers_ResetVisionForCurrentPlayer,
    Turns_PhaseHandlers_ResetVisionForNextPlayer,
    Turns_PhaseHandlers_ResetVotesForDraw,
    Turns_PhaseHandlers_TickTurnAndPlayerIndex,
    Turns_PhaseHandlers_UpdateAllTileBuffArray,
    Turns_PhaseHandlers_UpdateAllUnitBuffArray,
    Turns_PhaseHandlers_UpdateWeatherAndForceFog,
    Turns_PhaseHandlers_WaitBeginTurn,
    Utils_ClientErrorCode,
    type Turns_Manager,
} from "../../internal.ts";

export async function endPhaseStandby(turnManager: Turns_Manager.Manager, isFastExecute: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(Turns_PhaseHandlers_ResetHasUnitOnBeginningTurn.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_HandleUnitBuffEffect.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_GetFund.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_ConsumeFuel.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_RecoverUnitByCo.runAsInnerWar(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeRegularRepair))
        .mergeFrom(Turns_PhaseHandlers_RepairUnitByTile.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_DestroyUnitsOutOfFuel.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_RepairUnitByUnit.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_RecoverUnitByCo.runAsInnerWar(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.AfterRegularRepair))
        .mergeFrom(await Turns_PhaseHandlers_ActivateMapWeapon.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_CheckAndUpdateUnitAiMode.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_Main.runAsInnerWar(turnManager, isFastExecute));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main, true);

    return changedThings;
}

export function endPhaseMain(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithoutExtraData_00);
    }

    const changedThings = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation()
        .mergeFrom(Turns_PhaseHandlers_RecoverUnitByCo.runAsInnerWar(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeEndTurn))
        .mergeFrom(Turns_PhaseHandlers_ResetUnitState.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_ResetVisionForCurrentPlayer.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_HandleUnitBuffEffect2.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_TickTurnAndPlayerIndex.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_ResetSkillState.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_ResetVotesForDraw.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_UpdateWeatherAndForceFog.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_UpdateAllTileBuffArray.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_UpdateAllUnitBuffArray.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_ResetVisionForNextPlayer.runAsInnerWar(turnManager, isFastExecute))
        .mergeFrom(Turns_PhaseHandlers_WaitBeginTurn.runAsInnerWar(turnManager, isFastExecute));

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn, true);

    return changedThings;
}
