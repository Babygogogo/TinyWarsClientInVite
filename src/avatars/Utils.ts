import * as AvatarsConstants from "./Constants.ts";

export function getAvailableUserAvatarIdArray(): number[] {
    return [...AvatarsConstants.CfgDict].sort((v1, v2) => v1[1].sortWeight - v2[1].sortWeight).map(v => v[0]);
}
