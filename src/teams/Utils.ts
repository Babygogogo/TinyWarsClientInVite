import { TeamIndex } from "./Constants.ts";

export function checkIsValidTeamIndex(teamIndex: number, playersCountUnneutral: number): boolean {
    return (teamIndex >= TeamIndex.Neutral)
        && (teamIndex <= playersCountUnneutral);
}
export function checkIsValidTeamIndexSubset(teamIndexArray: number[], playersCountUnneutral: number): boolean {
    return ((new Set(teamIndexArray)).size === teamIndexArray.length)
        && (teamIndexArray.every(v => checkIsValidTeamIndex(v, playersCountUnneutral)));
}
