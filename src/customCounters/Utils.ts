import * as CustomCountersConstants from "./Constants.ts";
import * as HelpersText from "../helpers/Text.ts";
import type * as ProtoSchemaCommonProtoWarSerializationCustomCounter from "../proto/schema/CommonProto/WarSerialization/CustomCounter.ts";

export function checkIsValidId(customCounterId: number): boolean {
    return (customCounterId >= CustomCountersConstants.Constants.MinId) && (customCounterId <= CustomCountersConstants.Constants.MaxId);
}
export function checkIsValidValue(customCounterValue: number): boolean {
    return isFinite(customCounterValue);
}
export function checkIsValidIdSubset(idArray: number[]): boolean {
    return (idArray.every(v => checkIsValidId(v)))
        && (new Set(idArray).size === idArray.length);
}

export function checkIsValidCustomCounterArray(customCounterArray: ProtoSchemaCommonProtoWarSerializationCustomCounter.CustomCounter[]): boolean {
    const counterIdSet = new Set<number>();
    for (const data of customCounterArray) {
        const counterId     = data.getCustomCounterId();
        const counterValue  = data.getValue() ?? 0;
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
    if (!HelpersText.checkIsCharInRange(tempName[0], `a`, `z`)) {
        return false;
    }
    for (let i = 1; i < length; ++i) {
        const char = tempName[i];
        if ((!HelpersText.checkIsCharInRange(char, `a`, `z`))   &&
            (!HelpersText.checkIsCharInRange(char, `0`, `9`))
        ) {
            return false;
        }
    }

    return true;
}
