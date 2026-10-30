import {
    Helpers_Collection,
} from "../internal.ts";

// eslint-disable-next-line no-shadow
export const enum TypeId {
    MinMarkTypeId = 1,
    MaxMarkTypeId = 8,
}
export const AllGridMarkTypeId = Helpers_Collection.createRange(TypeId.MinMarkTypeId, TypeId.MaxMarkTypeId + 1, 1);
