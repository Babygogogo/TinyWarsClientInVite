import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { UndefinedError } from "../lang/Constants.ts";
import { getComparatorName } from "../lang/Utils.ts";
import type {
    ValueAndComparator as ProtoSchemaCommonProtoStructureValueAndComparator,
} from "../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import { AllComparatorIdArray, ComparatorId } from "./Constants.ts";

type ValueAndComparator     = ProtoSchemaCommonProtoStructureValueAndComparator;

export function getDesc(data: ValueAndComparator, valueName: string): string {
    const value         = data.getValue();
    const comparator    = data.getComparator();
    return `${valueName} ${getComparatorName(comparator) ?? UndefinedError} ${value}`;
}
export function getBriefDesc(data: ValueAndComparator): string {
    const value         = data.getValue();
    const comparator    = data.getComparator();
    return `${getComparatorName(comparator) ?? UndefinedError} ${value}`;
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

export function checkIsValidValueComparatorId(comparator: Undefinable<number>): boolean {
    return (comparator != null)
        && (AllComparatorIdArray.includes(comparator));
}

export function checkIsMeet1({ comparator, actualValue, targetValue }: {
    comparator  : ComparatorId;
    actualValue : number;
    targetValue : number;
}): boolean {
    return ((comparator === ComparatorId.EqualTo)          && (actualValue === targetValue))
        || ((comparator === ComparatorId.NotEqualTo)       && (actualValue !== targetValue))
        || ((comparator === ComparatorId.GreaterThan)      && (actualValue > targetValue))
        || ((comparator === ComparatorId.NotGreaterThan)   && (actualValue <= targetValue))
        || ((comparator === ComparatorId.LessThan)         && (actualValue < targetValue))
        || ((comparator === ComparatorId.NotLessThan)      && (actualValue >= targetValue));
}
export function getNextComparatorId(comparatorId: Undefinable<ComparatorId>): ComparatorId {
    switch (comparatorId) {
        case ComparatorId.EqualTo          : return ComparatorId.NotEqualTo;
        case ComparatorId.NotEqualTo       : return ComparatorId.GreaterThan;
        case ComparatorId.GreaterThan      : return ComparatorId.NotLessThan;
        case ComparatorId.NotLessThan      : return ComparatorId.LessThan;
        case ComparatorId.LessThan         : return ComparatorId.NotGreaterThan;
        default                                 : return ComparatorId.EqualTo;
    }
}
