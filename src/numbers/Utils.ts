import * as HelpersMisc from "../helpers/Misc.ts";
import * as NumbersConstants from "./Constants.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

export function getValueInRange({ minValue, maxValue, rawValue }: {
    minValue    : number;
    maxValue    : number;
    rawValue    : number;
}): number {
    if (minValue > maxValue) {
        throw HelpersMisc.newError(`Helpers.getValueInRange() invalid minValue and maxValue: ${minValue}, ${maxValue}`, UtilsClientErrorCode.ClientErrorCode.Helpers_GetValueInRange_00);
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
        minValue    : NumbersConstants.MinInt32,
        maxValue    : NumbersConstants.MaxInt32,
        rawValue    : Math.floor(rawValue),
    });
}
