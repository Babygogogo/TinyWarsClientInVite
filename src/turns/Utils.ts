import * as TurnsConstants from "./Constants.ts";

export function checkIsValidTurnPhaseCode(turnPhaseCode: TurnsConstants.PhaseCode): boolean {
    return (turnPhaseCode === TurnsConstants.PhaseCode.Main)
        || (turnPhaseCode === TurnsConstants.PhaseCode.WaitBeginTurn);
}

export function checkIsValidTurnsLimit(turnsLimit: number): boolean {
    return (turnsLimit >= TurnsConstants.TurnIndex.MinLimit)
        && (turnsLimit <= TurnsConstants.TurnIndex.MaxLimit);
}
