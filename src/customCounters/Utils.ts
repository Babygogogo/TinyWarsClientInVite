import {
    Helpers_Text,
    CustomCounters_Constants,
} from "../internal.ts";
import type { CustomCounter } from "../proto/schema/CommonProto/WarSerialization/CustomCounter.ts";

export function checkIsValidId(customCounterId: number): boolean {
    return (customCounterId >= CustomCounters_Constants.Constants.MinId) && (customCounterId <= CustomCounters_Constants.Constants.MaxId);
}
export function checkIsValidValue(customCounterValue: number): boolean {
    return isFinite(customCounterValue);
}
export function checkIsValidIdSubset(idArray: number[]): boolean {
    return (idArray.every(v => checkIsValidId(v)))
        && (new Set(idArray).size === idArray.length);
}

export function checkIsValidCustomCounterArray(customCounterArray: CustomCounter[]): boolean {
    const counterIdSet = new Set<number>();
    for (const data of customCounterArray) {
        const counterId     = data.getCustomCounterId();
        const counterValue  = data.getValue();
        if ((counterId == null)                 ||
            (!checkIsValidId(counterId))        ||
            (!checkIsValidValue(counterValue))  ||
            (counterIdSet.has(counterId))
        ) {
            return false;
        }

        counterIdSet.add(counterId);
    }

    return true;
}

export function checkIsValidName(name: string): boolean {
    const length = name.length;
    if (!length) {
        return false;
    }

    const tempName = name.toLocaleLowerCase();
    if (!Helpers_Text.checkIsCharInRange(tempName[0], `a`, `z`)) {
        return false;
    }
    for (let i = 1; i < length; ++i) {
        const char = tempName[i];
        if ((!Helpers_Text.checkIsCharInRange(char, `a`, `z`))   &&
            (!Helpers_Text.checkIsCharInRange(char, `0`, `9`))
        ) {
            return false;
        }
    }

    return true;
}
