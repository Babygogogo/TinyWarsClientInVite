import type { Undefinable } from "./AuxiliaryTypes.ts";

export class MapFilter {
    public mapName              : Undefinable<string>;
    public mapDesigner          : Undefinable<string>;
    public playersCountRange    : Undefinable<number[]>;
    public playedTimes          : Undefinable<number>;
    public globalRatingRange    : Undefinable<number[]>;
    public mapTagIdFlags        : Undefinable<number>;
    public minMapWidth          : Undefinable<number>;
    public maxMapWidth          : Undefinable<number>;
    public minMapHeight         : Undefinable<number>;
    public maxMapHeight         : Undefinable<number>;

    public checkIsEmpty(): boolean {
        return (this.mapName == null)
            && (this.mapDesigner == null)
            && (this.playersCountRange == null)
            && (this.playedTimes == null)
            && (this.globalRatingRange == null)
            && (this.maxMapHeight == null)
            && (this.maxMapWidth == null)
            && (this.mapTagIdFlags == null)
            && (this.minMapHeight == null)
            && (this.minMapWidth == null);
    }
    public clone(): MapFilter {
        const filter                = new MapFilter();
        filter.mapName              = this.mapName;
        filter.mapDesigner          = this.mapDesigner;
        filter.playersCountRange    = this.playersCountRange?.concat();
        filter.playedTimes          = this.playedTimes;
        filter.globalRatingRange    = this.globalRatingRange?.concat();
        filter.mapTagIdFlags        = this.mapTagIdFlags;
        filter.minMapWidth          = this.minMapWidth;
        filter.maxMapWidth          = this.maxMapWidth;
        filter.minMapHeight         = this.minMapHeight;
        filter.maxMapHeight         = this.maxMapHeight;
        return filter;
    }
}
