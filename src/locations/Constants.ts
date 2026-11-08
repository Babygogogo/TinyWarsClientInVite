import {
    Helpers_Collection,
} from "../internal.ts";

export const GroupCount         = 3;
export const GroupSize          = 32;
export const MinId              = 1;
export const MaxId              = MinId - 1 + GroupSize * GroupCount;   // MinId - 1 + GroupSize * GroupCount
export const AllLocationsCount  = MaxId - MinId + 1;

export const AllLocationIdArray = Helpers_Collection.createRange(MinId, MaxId + 1, 1);
export const AllLocationIdSet   = new Set(AllLocationIdArray);
