import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureValueSetAndRelation from "../proto/schema/CommonProto/Structure/ValueSetAndRelation.ts";
import * as ValueSetAndRelationsConstants from "./Constants.ts";

type ValueSetAndRelation    = ProtoSchemaCommonProtoStructureValueSetAndRelation.ValueSetAndRelation;

export function checkIsValidSetRelation(setRelation: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): boolean {
    return (setRelation != null) && (ValueSetAndRelationsConstants.AllSetRelationIdArray.includes(setRelation));
}
export function checkIsValid(data: ValueSetAndRelation): boolean {
    const arr = data.getValueArray();
    return (arr != null)
        && (arr.length > 0)
        && (arr.length === new Set(arr).size)
        && (checkIsValidSetRelation(data.getSetRelation()));
}

export function getDesc(data: ValueSetAndRelation, valueName: string, getValueText: (v: number) => AuxiliaryTypesAuxiliaryTypes.Undefinable<string>): string {
    const textForValue = data.getValueArray()?.map(v => getValueText(v)).join(`, `) ?? LangConstants.UndefinedError;
    switch (data.getSetRelation()) {
        case ValueSetAndRelationsConstants.SetRelationId.EqualTo          : return LangUtils.getFormattedText(LangConstants.TextType.F0237, valueName, textForValue);
        case ValueSetAndRelationsConstants.SetRelationId.NotEqualTo       : return LangUtils.getFormattedText(LangConstants.TextType.F0238, valueName, textForValue);
        case ValueSetAndRelationsConstants.SetRelationId.SupersetOf       : return LangUtils.getFormattedText(LangConstants.TextType.F0239, valueName, textForValue);
        case ValueSetAndRelationsConstants.SetRelationId.NotSupersetOf    : return LangUtils.getFormattedText(LangConstants.TextType.F0240, valueName, textForValue);
        case ValueSetAndRelationsConstants.SetRelationId.SubsetOf         : return LangUtils.getFormattedText(LangConstants.TextType.F0241, valueName, textForValue);
        case ValueSetAndRelationsConstants.SetRelationId.NotSubsetOf      : return LangUtils.getFormattedText(LangConstants.TextType.F0242, valueName, textForValue);
        case ValueSetAndRelationsConstants.SetRelationId.Intersection     : return LangUtils.getFormattedText(LangConstants.TextType.F0243, valueName, textForValue);
        case ValueSetAndRelationsConstants.SetRelationId.NoIntersection   : return LangUtils.getFormattedText(LangConstants.TextType.F0244, valueName, textForValue);
        default                             : return LangConstants.UndefinedError;
    }
}

export function checkIsMeet(data: ValueSetAndRelation, targetValueArray: number[]): boolean {
    const setRelation   = data.getSetRelation();
    const conSet        = new Set(data.getValueArray());
    const targetSet     = new Set(targetValueArray);
    if (setRelation === ValueSetAndRelationsConstants.SetRelationId.EqualTo) {
        return checkIsSetEqual(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelationsConstants.SetRelationId.NotEqualTo) {
        return !checkIsSetEqual(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelationsConstants.SetRelationId.SupersetOf) {
        return checkIsSupersetOf(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelationsConstants.SetRelationId.NotSupersetOf) {
        return !checkIsSupersetOf(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelationsConstants.SetRelationId.SubsetOf) {
        return checkIsSupersetOf(conSet, targetSet);
    } else if (setRelation === ValueSetAndRelationsConstants.SetRelationId.NotSubsetOf) {
        return !checkIsSupersetOf(conSet, targetSet);
    } else if (setRelation === ValueSetAndRelationsConstants.SetRelationId.Intersection) {
        return checkHasIntersection(targetSet, conSet);
    } else if (setRelation === ValueSetAndRelationsConstants.SetRelationId.NoIntersection) {
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
