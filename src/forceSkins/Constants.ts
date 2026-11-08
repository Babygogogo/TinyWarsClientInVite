import {
    Helpers_Collection,
} from "../internal.ts";

 
export const enum SkinId {
    Neutral   = 0,
    First     = 1,
    Last      = 8,
}
export const AllSkinIdArrayIncludeNeutral = Helpers_Collection.createRange(SkinId.Neutral, SkinId.Last + 1, 1);
export const AllSkinIdArrayExcludeNeutral = Helpers_Collection.createRange(SkinId.First, SkinId.Last + 1, 1);
