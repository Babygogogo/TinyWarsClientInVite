import {
    Utils_ClientErrorCode,
    Numbers_Constants,
    Helpers_Misc,
} from "../internal.ts";

export function getValueInRange({ minValue, maxValue, rawValue }: {
    minValue    : number;
    maxValue    : number;
    rawValue    : number;
}): number {
    if (minValue > maxValue) {
        throw Helpers_Misc.newError(`Helpers.getValueInRange() invalid minValue and maxValue: ${minValue}, ${maxValue}`, Utils_ClientErrorCode.ClientErrorCode.Helpers_GetValueInRange_00);
    }

    if (rawValue > maxValue) {
        return maxValue;
    }
    if (rawValue < minValue) {
        return minValue;
    }
    return rawValue;
}
export function getValueInInt32(rawValue: number): number {
    return getValueInRange({
        minValue : Numbers_Constants.MinInt32,
        maxValue : Numbers_Constants.MaxInt32,
        rawValue : Math.floor(rawValue),
    });
}
