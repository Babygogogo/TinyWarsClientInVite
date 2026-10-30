import {
    ValueAndComparators_Constants,
    Lang_Utils,
    Lang_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { ValueAndComparator } from "../proto/schema/CommonProto/Structure/ValueAndComparator.ts";

export function getDesc(data: ValueAndComparator, valueName: string): string {
    const value         = data.getValue();
    const comparator    = data.getComparator();
    return `${valueName} ${Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError} ${value}`;
}
export function getBriefDesc(data: ValueAndComparator): string {
    const value         = data.getValue();
    const comparator    = data.getComparator();
    return `${Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError} ${value}`;
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

export function checkIsValidValueComparatorId(comparator: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
    return (comparator != null)
        && (ValueAndComparators_Constants.AllComparatorIdArray.includes(comparator));
}

export function checkIsMeet1({ comparator, actualValue, targetValue }: {
    comparator  : ValueAndComparators_Constants.ComparatorId;
    actualValue : number;
    targetValue : number;
}): boolean {
    return ((comparator === ValueAndComparators_Constants.ComparatorId.EqualTo)          && (actualValue === targetValue))
        || ((comparator === ValueAndComparators_Constants.ComparatorId.NotEqualTo)       && (actualValue !== targetValue))
        || ((comparator === ValueAndComparators_Constants.ComparatorId.GreaterThan)      && (actualValue > targetValue))
        || ((comparator === ValueAndComparators_Constants.ComparatorId.NotGreaterThan)   && (actualValue <= targetValue))
        || ((comparator === ValueAndComparators_Constants.ComparatorId.LessThan)         && (actualValue < targetValue))
        || ((comparator === ValueAndComparators_Constants.ComparatorId.NotLessThan)      && (actualValue >= targetValue));
}
export function getNextComparatorId(comparatorId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<ValueAndComparators_Constants.ComparatorId>): ValueAndComparators_Constants.ComparatorId {
    switch (comparatorId) {
        case ValueAndComparators_Constants.ComparatorId.EqualTo          : return ValueAndComparators_Constants.ComparatorId.NotEqualTo;
        case ValueAndComparators_Constants.ComparatorId.NotEqualTo       : return ValueAndComparators_Constants.ComparatorId.GreaterThan;
        case ValueAndComparators_Constants.ComparatorId.GreaterThan      : return ValueAndComparators_Constants.ComparatorId.NotLessThan;
        case ValueAndComparators_Constants.ComparatorId.NotLessThan      : return ValueAndComparators_Constants.ComparatorId.LessThan;
        case ValueAndComparators_Constants.ComparatorId.LessThan         : return ValueAndComparators_Constants.ComparatorId.NotGreaterThan;
        default                                 : return ValueAndComparators_Constants.ComparatorId.EqualTo;
    }
}
