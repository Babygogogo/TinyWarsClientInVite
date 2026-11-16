import {
    type Turns_Manager,
    AuxiliaryTypes_ChangedThingsForWarOperation,
} from "../../../internal.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function runAsOuterWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): void {
    turnManager.getWar().getDrawVoteManager().handleTurnPhaseResetVotesForDraw();
}

export function runAsInnerWar(turnManager: Turns_Manager.Manager): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return runAsLocalWar(turnManager, true);
}

export function runAsUnifiedWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return runAsLocalWar(turnManager, isFastExecute);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runAsLocalWar(turnManager: Turns_Manager.Manager, isFastExecute: boolean): AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation {
    return turnManager.getWar().getDrawVoteManager().handleTurnPhaseResetVotesForDraw();
}
