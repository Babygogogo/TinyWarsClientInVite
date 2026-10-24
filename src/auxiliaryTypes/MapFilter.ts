import type * as AuxiliaryTypesAuxiliaryTypes from "./AuxiliaryTypes.ts";

export class MapFilter {
    public mapName              : AuxiliaryTypesAuxiliaryTypes.Undefinable<string>;
    public mapDesigner          : AuxiliaryTypesAuxiliaryTypes.Undefinable<string>;
    public playersCountRange    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>;
    public playedTimes          : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public globalRatingRange    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>;
    public mapTagIdFlags        : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public minMapWidth          : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public maxMapWidth          : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public minMapHeight         : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public maxMapHeight         : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;

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
