import {
    ValueSetAndRelations_Constants,
    Lang_Utils,
    Lang_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { ValueSetAndRelation } from "../proto/schema/CommonProto/Structure/ValueSetAndRelation.ts";

export function checkIsValidSetRelation(setRelation: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
    return (setRelation != null) && (ValueSetAndRelations_Constants.AllSetRelationIdArray.includes(setRelation));
}
export function checkIsValid(data: ValueSetAndRelation): boolean {
    const arr = data.getValueArray();
    return (arr != null)
        && (arr.length > 0)
        && (arr.length === new Set(arr).size)
        && (checkIsValidSetRelation(data.getSetRelation()));
}

export function getDesc(data: ValueSetAndRelation, valueName: string, getValueText: (v: number) => AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): string {
    const textForValue = data.getValueArray()?.map(v => getValueText(v)).join(`, `);
    switch (data.getSetRelation()) {
        case ValueSetAndRelations_Constants.SetRelationId.EqualTo          : return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0237, valueName, textForValue);
        case ValueSetAndRelations_Constants.SetRelationId.NotEqualTo       : return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0238, valueName, textForValue);
        case ValueSetAndRelations_Constants.SetRelationId.SupersetOf       : return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0239, valueName, textForValue);
        case ValueSetAndRelations_Constants.SetRelationId.NotSupersetOf    : return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0240, valueName, textForValue);
        case ValueSetAndRelations_Constants.SetRelationId.SubsetOf         : return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0241, valueName, textForValue);
        case ValueSetAndRelations_Constants.SetRelationId.NotSubsetOf      : return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0242, valueName, textForValue);
        case ValueSetAndRelations_Constants.SetRelationId.Intersection     : return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0243, valueName, textForValue);
        case ValueSetAndRelations_Constants.SetRelationId.NoIntersection   : return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0244, valueName, textForValue);
        default                             : return Lang_Constants.UndefinedError;
    }
}

export function checkIsMeet(data: ValueSetAndRelation, targetValueArray: number[]): boolean {
    const setRelation   = data.getSetRelation();
    const conSet        = new Set(data.getValueArray());
    const targetSet     = new Set(targetValueArray);
    if (setRelation === ValueSetAndRelations_Constants.SetRelationId.EqualTo) {
        return checkIsSetEqual(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelations_Constants.SetRelationId.NotEqualTo) {
        return !checkIsSetEqual(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelations_Constants.SetRelationId.SupersetOf) {
        return checkIsSupersetOf(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelations_Constants.SetRelationId.NotSupersetOf) {
        return !checkIsSupersetOf(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelations_Constants.SetRelationId.SubsetOf) {
        return checkIsSupersetOf(conSet, targetSet);
    } else if (setRelation === ValueSetAndRelations_Constants.SetRelationId.NotSubsetOf) {
        return !checkIsSupersetOf(conSet, targetSet);
    } else if (setRelation === ValueSetAndRelations_Constants.SetRelationId.Intersection) {
        return checkHasIntersection(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelations_Constants.SetRelationId.NoIntersection) {
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
