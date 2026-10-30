import { ValueAndComparator } from "../proto/schema/CommonProto/Structure/ValueAndComparator.ts";

 
export const enum ComparatorId {
    EqualTo           = 1,
    NotEqualTo,
    GreaterThan,
    NotGreaterThan,
    LessThan,
    NotLessThan,
}
export const AllComparatorIdArray = [
    ComparatorId.EqualTo,
    ComparatorId.NotEqualTo,
    ComparatorId.GreaterThan,
    ComparatorId.NotGreaterThan,
    ComparatorId.LessThan,
    ComparatorId.NotLessThan,
];

export const Equal0 = ValueAndComparator.fromJson({
    value      : 0,
    comparator : ComparatorId.EqualTo,
});
