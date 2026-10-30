import {
    Turns_Constants,
} from "../internal.ts";

export function checkIsValidTurnPhaseCode(turnPhaseCode: Turns_Constants.PhaseCode): boolean {
    return (turnPhaseCode === Turns_Constants.PhaseCode.Main)
        || (turnPhaseCode === Turns_Constants.PhaseCode.WaitBeginTurn);
}

export function checkIsValidTurnsLimit(turnsLimit: number): boolean {
    return (turnsLimit >= Turns_Constants.TurnIndex.MinLimit)
        && (turnsLimit <= Turns_Constants.TurnIndex.MaxLimit);
}
