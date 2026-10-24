import * as HelpersCollection from "../helpers/Collection.ts";

// eslint-disable-next-line no-shadow
export const enum SkinId {
    Neutral   = 0,
    First     = 1,
    Last      = 8,
}
export const AllSkinIdArrayIncludeNeutral = HelpersCollection.createRange(SkinId.Neutral, SkinId.Last + 1, 1);
export const AllSkinIdArrayExcludeNeutral = HelpersCollection.createRange(SkinId.First, SkinId.Last + 1, 1);
