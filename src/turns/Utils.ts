import {
    PhaseCode,
    TurnIndex,
} from "./Constants.ts";

export function checkIsValidTurnPhaseCode(turnPhaseCode: PhaseCode): boolean {
    return (turnPhaseCode === PhaseCode.Main)
        || (turnPhaseCode === PhaseCode.WaitBeginTurn);
}

export function checkIsValidTurnsLimit(turnsLimit: number): boolean {
    return (turnsLimit >= TurnIndex.MinLimit)
        && (turnsLimit <= TurnIndex.MaxLimit);
}
