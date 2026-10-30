import {
    MinId,
    MaxId,
    GroupCount,
    GroupSize,
} from "./Constants.ts";

export function checkIsValidLocationId(locationId: number): boolean {
    return (locationId >= MinId) && (locationId <= MaxId);
}
export function checkIsValidLocationIdSubset(locationIdArray: number[]): boolean {
    return (locationIdArray.length === new Set(locationIdArray).size)
        && (locationIdArray.every(v => checkIsValidLocationId(v)));
}

export function checkHasAnyOverlap(encodedLocationIdArray1: number[] | null, encodedLocationIdArray2: number[] | null): boolean {
    if ((encodedLocationIdArray1 == null) || (encodedLocationIdArray2 == null)) {
        return false;
    }

    const length = Math.min(encodedLocationIdArray1.length, encodedLocationIdArray2.length);
    for (let i = 0; i < length; ++i) {
        if (encodedLocationIdArray1[i] & encodedLocationIdArray2[i]) {
            return true;
        }
    }

    return false;
}

export function encode(locationIdArray: number[]): number[] {
    const groupedArray  = new Array<number>(GroupCount).fill(0);
    const groupSize     = GroupSize;
    for (const id of locationIdArray) {
        groupedArray[Math.floor((id - 1) / groupSize)] |= 1 << ((id - 1) % groupSize);
    }
    return groupedArray;
}

export function decode(encodedLocationIdArray: number[]): number[] {
    const locationIdArray: number[] = [];
    for (let i = 0; i < encodedLocationIdArray.length; ++i) {
        let groupedLocationId = encodedLocationIdArray[i];
        for (let j = 0; j < GroupSize; ++j) {
            if (groupedLocationId & 1) {
                locationIdArray.push(i * GroupSize + j + 1);
            }
            groupedLocationId = groupedLocationId >>> 1;
        }
    }
    return locationIdArray;
}
