import {
    Numbers_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export function checkIsSameList<T>(list1: T[], list2: T[]): boolean {
    const length = list1.length;
    if (length !== list2.length) {
        return false;
    }

    for (let i = 0; i < length; ++i) {
        if (list1[i] != list2[i]) {
            return false;
        }
    }

    return true;
}
export function checkIsSameSet(set1: Set<any>, set2: Set<any>): boolean {
    if (set1.size !== set2.size) {
        return false;
    }

    for (const element of set1) {
        if (!set2.has(element)) {
            return false;
        }
    }

    return true;
}

/** the param @stopBefore is not included in the result */
export function createRange(start: number, stopBefore: number, step: number): number[] {
    return Array(Math.ceil((stopBefore - start) / step)).fill(start).map((x, y) => x + y * step);
}
export function createEmptyMap<T>(mapWidth: number, mapHeight?: number, defaultValue?: T): T[][] {
    const map = new Array<T[]>(mapWidth);
    for (let i = 0; i < mapWidth; ++i) {
        if (!mapHeight) {
            map[i] = [];
        } else {
            map[i] = new Array(mapHeight);
            (defaultValue != null) && (map[i].fill(defaultValue));
        }
    }
    return map;
}

export function pickRandomElement<T>(list: T[], randomValue?: number): T {
    return list[Math.floor((randomValue ?? Math.random()) * list.length)];
}
export function deleteElementFromList<T>(arr: T[], element: T, maxDeleteCount = Numbers_Constants.MaxValue): number {
    let index       = 0;
    let deleteCount = 0;
    while ((index < arr.length) && (deleteCount < maxDeleteCount)) {
        if (arr[index] === element) {
            arr.splice(index, 1);
            ++deleteCount;
        } else {
            ++index;
        }
    }
    return deleteCount;
}
export function deleteElementFromList2<T>(arr: T[], predicate: (element: T) => boolean, maxDeleteCount = Numbers_Constants.MaxValue): number {
    let index       = 0;
    let deleteCount = 0;
    while ((index < arr.length) && (deleteCount < maxDeleteCount)) {
        if (predicate(arr[index])) {
            arr.splice(index, 1);
            ++deleteCount;
        } else {
            ++index;
        }
    }
    return deleteCount;
}
export function addElementToListIfNotExists<T>(arr: T[], element: T): void {
    if (!arr.includes(element)) {
        arr.push(element);
    }
}
export function getNonNullElements<T>(arr: AuxiliaryTypes_AuxiliaryTypes.Undefinable<T>[]): T[] {
    return arr.filter(v => v != null) as T[];
}
export function moveElementInList<T>(array: T[], element: T, deltaIndex: number): boolean {
    const currIndex = array.findIndex(v => v === element);
    if (currIndex < 0) {
        return false;
    }

    const newIndex = Math.max(0, Math.min(array.length - 1, currIndex + deltaIndex));
    if (currIndex === newIndex) {
        return false;
    } else {
        array.splice(currIndex, 1);
        array.splice(newIndex, 0, element);
        return true;
    }
}
export function moveElementInList2<T>(array: T[], predicate: (element: T) => boolean, deltaIndex: number): boolean {
    const currIndex = array.findIndex(v => predicate(v));
    if (currIndex < 0) {
        return false;
    }

    const newIndex = Math.max(0, Math.min(array.length - 1, currIndex + deltaIndex));
    if (currIndex === newIndex) {
        return false;
    } else {
        const element = array[currIndex];
        array.splice(currIndex, 1);
        array.splice(newIndex, 0, element);
        return true;
    }
}
