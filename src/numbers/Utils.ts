import { newError } from "../helpers/Misc.ts";
import {
    MinInt32,
    MaxInt32,
} from "./Constants.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";

export function getValueInRange({ minValue, maxValue, rawValue }: {
    minValue    : number;
    maxValue    : number;
    rawValue    : number;
}): number {
    if (minValue > maxValue) {
        throw newError(`Helpers.getValueInRange() invalid minValue and maxValue: ${minValue}, ${maxValue}`, ClientErrorCode.Helpers_GetValueInRange_00);
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
        minValue    : MinInt32,
        maxValue    : MaxInt32,
        rawValue    : Math.floor(rawValue),
    });
}
