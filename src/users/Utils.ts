import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { Common } from "./Constants.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export function checkIsAccountValid(str: AuxiliaryTypesAuxiliaryTypesUndefinable<string>): boolean {
    return (typeof str === "string")
        && (str.length >= 6)
        && (str.length <= 20)
        && (str.search(/\W/) < 0);
}

export function checkIsPasswordValid(str: AuxiliaryTypesAuxiliaryTypesUndefinable<string>): boolean {
    return (typeof str === "string")
        && (str.length >= 6)
        && (str.length <= 20)
        && (str.search(/\W/) < 0);
}

export function checkIsNicknameValid(str: AuxiliaryTypesAuxiliaryTypesUndefinable<string>): boolean {
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
        && (userId >= Common.MinDummyUserId)
        && (userId <  Common.MinDummyUserId + Common.DummyUsersCount);
}
