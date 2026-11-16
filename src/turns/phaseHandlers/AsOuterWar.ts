import {
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
    WarOperations_Executors_Utils_Common,
    type Turns_Manager,
} from "../../internal.ts";
import type { WoPlayerEndTurn } from "../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type { WoSystemBeginTurn } from "../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";
import type { WoSystemEndTurn } from "../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";

export async function endPhaseStandby(turnManager: Turns_Manager.Manager, action: WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_00);
    }

    Turns_PhaseHandlers_ResetHasUnitOnBeginningTurn.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_HandleUnitBuffEffect.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_GetFund.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_ConsumeFuel.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_RecoverUnitByCo.runAsOuterWar(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeRegularRepair);
    Turns_PhaseHandlers_RepairUnitByTile.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_DestroyUnitsOutOfFuel.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_RepairUnitByUnit.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_RecoverUnitByCo.runAsOuterWar(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.AfterRegularRepair);
    await Turns_PhaseHandlers_ActivateMapWeapon.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_CheckAndUpdateUnitAiMode.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_Main.runAsOuterWar(turnManager, isFastExecute);

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main, true);

    const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_01);
    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}

export function endPhaseMain(turnManager: Turns_Manager.Manager, action: WoPlayerEndTurn | WoSystemEndTurn, isFastExecute: boolean): void {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_00);
    }

    Turns_PhaseHandlers_RecoverUnitByCo.runAsOuterWar(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeEndTurn);
    Turns_PhaseHandlers_ResetUnitState.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_ResetVisionForCurrentPlayer.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_HandleUnitBuffEffect2.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_TickTurnAndPlayerIndex.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_ResetSkillState.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_ResetVotesForDraw.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_UpdateWeatherAndForceFog.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_UpdateAllTileBuffArray.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_UpdateAllUnitBuffArray.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_ResetVisionForNextPlayer.runAsOuterWar(turnManager, isFastExecute);
    Turns_PhaseHandlers_WaitBeginTurn.runAsOuterWar(turnManager, isFastExecute);

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn, true);

    const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_01);
    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}
