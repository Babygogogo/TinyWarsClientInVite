import {
    Avatars_Constants,
} from "../internal.ts";

export function getAvailableUserAvatarIdArray(): number[] {
    return [...Avatars_Constants.CfgDict].sort((v1, v2) => v1[1].sortWeight - v2[1].sortWeight).map(v => v[0]);
}
