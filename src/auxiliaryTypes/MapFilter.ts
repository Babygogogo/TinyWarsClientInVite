import {
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export class MapFilter {
    public mapName              : AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;
    public mapDesigner          : AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;
    public playersCountRange    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>;
    public playedTimes          : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public globalRatingRange    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>;
    public mapTagIdFlags        : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public minMapWidth          : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public maxMapWidth          : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public minMapHeight         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public maxMapHeight         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

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
