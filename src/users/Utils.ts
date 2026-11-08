import {
    Users_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export function checkIsAccountValid(str: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): boolean {
    return (typeof str === "string")
        && (str.length >= 6)
        && (str.length <= 20)
        && (str.search(/\W/) < 0);
}

export function checkIsPasswordValid(str: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): boolean {
    return (typeof str === "string")
        && (str.length >= 6)
        && (str.length <= 20)
        && (str.search(/\W/) < 0);
}

export function checkIsNicknameValid(str: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): boolean {
    return (typeof str === "string")
        && (str.length >= 4)
        && (str.length <= 20);
}

export function checkIsDiscordIdValid(str: string): boolean {
    return (str.length === 0)
        || ((str.length > 0) && (str.length <= 25));
}

export function checkIsDummy(userId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
    return (userId != null)
        && (userId >= Users_Constants.Common.MinDummyUserId)
        && (userId <  Users_Constants.Common.MinDummyUserId + Users_Constants.Common.DummyUsersCount);
}
