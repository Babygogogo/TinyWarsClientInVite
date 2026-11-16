import {
    Helpers_Misc,
    Timer_TimerModel,
    Utils_ClientErrorCode,
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
    BootTimers_Constants,
} from "../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    const info = turnManager.getNextTurnAndPlayerIndex();
    turnManager.setTurnIndex(info.turnIndex);
    turnManager.setPlayerIndexInTurn(info.playerIndex, true);
    turnManager.setEnterTurnTime(Timer_TimerModel.getServerTimestamp());
    turnManager.getWar().getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsInnerWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    const playerIndex       = turnManager.getPlayerIndexInTurn();
    const war               = turnManager.getWar();
    const currTime          = Timer_TimerModel.getServerTimestamp();
    const changedThings     = new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation();
    const player            = war.getPlayer(playerIndex);
    const bootTimerParams   = war.getSettingsBootTimerParams();
    const timerType         : BootTimers_Constants.TimerTypeId = bootTimerParams[0];
    if (timerType === BootTimers_Constants.TimerTypeId.NoBoot) {
        player.setRestTimeToBoot(0);

    } else if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        player.setRestTimeToBoot(Helpers_Misc.getExisted(bootTimerParams[1], Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_00));

    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        const oldRestTimeToBoot         = player.getRestTimeToBoot();
        const enterTurnTime             = turnManager.getEnterTurnTime();
        const incrementalTimePerUnit    = Helpers_Misc.getExisted(bootTimerParams[2], Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_01);
        const incrementalTimePerTurn    = bootTimerParams[3] ?? 0;
        const restTimeToBoot            = Math.max(
            0,
            Math.min(
                BootTimers_Constants.Incremental.MaxLimit,
                oldRestTimeToBoot - (currTime - enterTurnTime) + incrementalTimePerUnit * war.getUnitMap().countAllUnitsForPlayer(playerIndex) + incrementalTimePerTurn,
            ),
        );
        player.setRestTimeToBoot(restTimeToBoot);

    } else {
        throw Helpers_Misc.newError(`Invalid timerType: ${timerType}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_RunPhaseTickTurnAndPlayerIndexWithoutExtraData_02);
    }

    player.setIsSkipTurn(false);
    changedThings.addPlayer(player);

    const info = turnManager.getNextTurnAndPlayerIndex();
    turnManager.setTurnIndex(info.turnIndex);
    turnManager.setPlayerIndexInTurn(info.playerIndex, true);
    turnManager.setEnterTurnTime(Timer_TimerModel.getServerTimestamp());
    war.getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();

    return changedThings;
}
