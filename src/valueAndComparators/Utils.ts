import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureValueAndComparator from "../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import * as ValueAndComparatorsConstants from "./Constants.ts";

type ValueAndComparator     = ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator;

export function getDesc(data: ValueAndComparator, valueName: string): string {
    const value         = data.getValue();
    const comparator    = data.getComparator();
    return `${valueName} ${LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError} ${value}`;
}
export function getBriefDesc(data: ValueAndComparator): string {
    const value         = data.getValue();
    const comparator    = data.getComparator();
    return `${LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError} ${value}`;
}

export function tickComparator(data: ValueAndComparator): void {
    data.setComparator(getNextComparatorId(data.getComparator()));
}

export function checkIsValid(data: ValueAndComparator): boolean {
    return checkIsValidValueComparatorId(data.getComparator());
}

export function checkIsMeet(data: ValueAndComparator, value: number): boolean {
    return checkIsMeet1({
        comparator  : data.getComparator(),
        actualValue : value,
        targetValue : data.getValue(),
    });
}

export function checkIsValidValueComparatorId(comparator: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): boolean {
    return (comparator != null)
        && (ValueAndComparatorsConstants.AllComparatorIdArray.includes(comparator));
}

export function checkIsMeet1({ comparator, actualValue, targetValue }: {
    comparator  : ValueAndComparatorsConstants.ComparatorId;
    actualValue : number;
    targetValue : number;
}): boolean {
    return ((comparator === ValueAndComparatorsConstants.ComparatorId.EqualTo)          && (actualValue === targetValue))
        || ((comparator === ValueAndComparatorsConstants.ComparatorId.NotEqualTo)       && (actualValue !== targetValue))
        || ((comparator === ValueAndComparatorsConstants.ComparatorId.GreaterThan)      && (actualValue > targetValue))
        || ((comparator === ValueAndComparatorsConstants.ComparatorId.NotGreaterThan)   && (actualValue <= targetValue))
        || ((comparator === ValueAndComparatorsConstants.ComparatorId.LessThan)         && (actualValue < targetValue))
        || ((comparator === ValueAndComparatorsConstants.ComparatorId.NotLessThan)      && (actualValue >= targetValue));
}
export function getNextComparatorId(comparatorId: AuxiliaryTypesAuxiliaryTypes.Undefinable<ValueAndComparatorsConstants.ComparatorId>): ValueAndComparatorsConstants.ComparatorId {
    switch (comparatorId) {
        case ValueAndComparatorsConstants.ComparatorId.EqualTo          : return ValueAndComparatorsConstants.ComparatorId.NotEqualTo;
        case ValueAndComparatorsConstants.ComparatorId.NotEqualTo       : return ValueAndComparatorsConstants.ComparatorId.GreaterThan;
        case ValueAndComparatorsConstants.ComparatorId.GreaterThan      : return ValueAndComparatorsConstants.ComparatorId.NotLessThan;
        case ValueAndComparatorsConstants.ComparatorId.NotLessThan      : return ValueAndComparatorsConstants.ComparatorId.LessThan;
        case ValueAndComparatorsConstants.ComparatorId.LessThan         : return ValueAndComparatorsConstants.ComparatorId.NotGreaterThan;
        default                                 : return ValueAndComparatorsConstants.ComparatorId.EqualTo;
    }
}
