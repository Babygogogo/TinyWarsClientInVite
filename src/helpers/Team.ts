import {
    Helpers_Misc,
} from "../internal.ts";

export function decodeTeamIndex(encodedTeamIndex: number): number[] {
    const decodedTeamIndexList: number[] = [];
    for (let id = 0; id < 32; ++id) {
        if ((encodedTeamIndex & (1 << id)) > 0) {
            decodedTeamIndexList.push(id);
        }
    }
    return decodedTeamIndexList;
}
export function encodeTeamIndex(teamIndexList: number[]): number {
    let encodedTeamIndex = 0;
    for (const teamIndex of teamIndexList) {
        if ((teamIndex >= 32) || (teamIndex < 0) || (teamIndex !== Math.floor(teamIndex))) {
            throw Helpers_Misc.newError(`Invalid flag: ${teamIndex}`);
        }

        encodedTeamIndex |= 1 << teamIndex;
    }
    return encodedTeamIndex;
}
