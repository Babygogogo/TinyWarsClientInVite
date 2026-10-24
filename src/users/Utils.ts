import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as UsersConstants from "./Constants.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function checkIsAccountValid(str: AuxiliaryTypesAuxiliaryTypes.Undefinable<string>): boolean {
    return (typeof str === "string")
        && (str.length >= 6)
        && (str.length <= 20)
        && (str.search(/\W/) < 0);
}

export function checkIsPasswordValid(str: AuxiliaryTypesAuxiliaryTypes.Undefinable<string>): boolean {
    return (typeof str === "string")
        && (str.length >= 6)
        && (str.length <= 20)
        && (str.search(/\W/) < 0);
}

export function checkIsNicknameValid(str: AuxiliaryTypesAuxiliaryTypes.Undefinable<string>): boolean {
    return (typeof str === "string")
        && (str.length >= 4)
        && (str.length <= 20);
}

export function checkIsDiscordIdValid(str: string): boolean {
    return (str.length === 0)
        || ((str.length > 0) && (str.length <= 25));
}

export function checkIsDummy(userId: Undefinable<number>): boolean {
    return (userId != null)
        && (userId >= UsersConstants.Common.MinDummyUserId)
        && (userId <  UsersConstants.Common.MinDummyUserId + UsersConstants.Common.DummyUsersCount);
}
