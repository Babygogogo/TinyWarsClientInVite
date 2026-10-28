import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { UndefinedError, TextType } from "../lang/Constants.ts";
import { getFormattedText } from "../lang/Utils.ts";
import type { ValueSetAndRelation } from "../proto/schema/CommonProto/Structure/ValueSetAndRelation.ts";
import { AllSetRelationIdArray, SetRelationId } from "./Constants.ts";

export function checkIsValidSetRelation(setRelation: Undefinable<number>): boolean {
    return (setRelation != null) && (AllSetRelationIdArray.includes(setRelation));
}
export function checkIsValid(data: ValueSetAndRelation): boolean {
    const arr = data.getValueArray();
    return (arr != null)
        && (arr.length > 0)
        && (arr.length === new Set(arr).size)
        && (checkIsValidSetRelation(data.getSetRelation()));
}

export function getDesc(data: ValueSetAndRelation, valueName: string, getValueText: (v: number) => Undefinable<string>): string {
    const textForValue = data.getValueArray()?.map(v => getValueText(v)).join(`, `);
    switch (data.getSetRelation()) {
        case SetRelationId.EqualTo          : return getFormattedText(TextType.F0237, valueName, textForValue);
        case SetRelationId.NotEqualTo       : return getFormattedText(TextType.F0238, valueName, textForValue);
        case SetRelationId.SupersetOf       : return getFormattedText(TextType.F0239, valueName, textForValue);
        case SetRelationId.NotSupersetOf    : return getFormattedText(TextType.F0240, valueName, textForValue);
        case SetRelationId.SubsetOf         : return getFormattedText(TextType.F0241, valueName, textForValue);
        case SetRelationId.NotSubsetOf      : return getFormattedText(TextType.F0242, valueName, textForValue);
        case SetRelationId.Intersection     : return getFormattedText(TextType.F0243, valueName, textForValue);
        case SetRelationId.NoIntersection   : return getFormattedText(TextType.F0244, valueName, textForValue);
        default                             : return UndefinedError;
    }
}

export function checkIsMeet(data: ValueSetAndRelation, targetValueArray: number[]): boolean {
    const setRelation   = data.getSetRelation();
    const conSet        = new Set(data.getValueArray());
    const targetSet     = new Set(targetValueArray);
    if (setRelation === SetRelationId.EqualTo) {
        return checkIsSetEqual(targetSet, conSet);
    } else if (setRelation === SetRelationId.NotEqualTo) {
        return !checkIsSetEqual(targetSet, conSet);
    } else if (setRelation === SetRelationId.SupersetOf) {
        return checkIsSupersetOf(targetSet, conSet);
    } else if (setRelation === SetRelationId.NotSupersetOf) {
        return !checkIsSupersetOf(targetSet, conSet);
    } else if (setRelation === SetRelationId.SubsetOf) {
        return checkIsSupersetOf(conSet, targetSet);
    } else if (setRelation === SetRelationId.NotSubsetOf) {
        return !checkIsSupersetOf(conSet, targetSet);
    } else if (setRelation === SetRelationId.Intersection) {
        return checkHasIntersection(targetSet, conSet);
    } else if (setRelation === SetRelationId.NoIntersection) {
        return !checkHasIntersection(targetSet, conSet);
    } else {
        return false;
    }
}

function checkIsSetEqual(conSet: Set<number>, targetSet: Set<number>): boolean {
    if (conSet.size !== targetSet.size) {
        return false;
    }
    for (const value of targetSet) {
        if (!conSet.has(value)) {
            return false;
        }
    }
    return true;
}
function checkIsSupersetOf(conSet: Set<number>, targetSet: Set<number>): boolean {
    if (conSet.size < targetSet.size) {
        return false;
    }
    for (const value of targetSet) {
        if (!conSet.has(value)) {
            return false;
        }
    }
    return true;
}
function checkHasIntersection(conSet: Set<number>, targetSet: Set<number>): boolean {
    for (const value of targetSet) {
        if (conSet.has(value)) {
            return true;
        }
    }
    return false;
}
