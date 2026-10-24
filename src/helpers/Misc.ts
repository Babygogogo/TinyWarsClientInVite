import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

export function createLazyFunc<T>(func: () => T): () => T {
    let hasCalled   = false;
    let result      : T;
    return () => {
        if (!hasCalled) {
            hasCalled   = true;
            result      = func();
        }
        return result;
    };
}
export function createLazyFunc2<T1, T2>(func: (p: T1) => T2): (p: T1) => T2 {
    let cache: Map<T1, T2> | null = null;
    return (p: T1): T2 => {
        cache ??= new Map<T1, T2>();
        if (cache.has(p)) {
            return getExisted(cache.get(p));
        } else {
            const v = func(p);
            cache.set(p, v);
            return v;
        }
    };
}

export function assert(condition: boolean, errorCode: UtilsClientErrorCode.ClientErrorCode): asserts condition {
    if (!condition) {
        throw newError(`Assertion failed!`, errorCode);
    }
}

export function getDefined<T>(value: T | undefined, errorCode?: UtilsClientErrorCode.ClientErrorCode): T {
    if (value === undefined) {
        throw newError(`Undefined value.`, errorCode);
    }

    return value;
}
export function getExisted<T>(value: AuxiliaryTypesAuxiliaryTypes.Undefinable<T>, errorCode?: UtilsClientErrorCode.ClientErrorCode): T {
    if (value == null) {
        throw newError(`Empty value`, errorCode);
    }

    return value;
}

export function newError(msg: string, errorCode?: UtilsClientErrorCode.ClientErrorCode): AuxiliaryTypesAuxiliaryTypes.CustomError {
    const error     : AuxiliaryTypesAuxiliaryTypes.CustomError = new Error(msg);
    error.errorCode = errorCode;
    return error;
}

export async function checkIsAnyPromiseTrue(promiseArray: (Promise<boolean> | boolean)[]): Promise<boolean> {
    for (const promise of promiseArray) {
        if (await promise) {
            return true;
        }
    }
    return false;
}
