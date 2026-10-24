import * as TeamsConstants from "./Constants.ts";

export function checkIsValidTeamIndex(teamIndex: number, playersCountUnneutral: number): boolean {
    return (teamIndex >= TeamsConstants.TeamIndex.Neutral)
        && (teamIndex <= playersCountUnneutral);
}
export function checkIsValidTeamIndexSubset(teamIndexArray: number[], playersCountUnneutral: number): boolean {
    return ((new Set(teamIndexArray)).size === teamIndexArray.length)
        && (teamIndexArray.every(v => checkIsValidTeamIndex(v, playersCountUnneutral)));
}
