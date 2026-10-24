import type * as AuxiliaryTypesAuxiliaryTypes from "./AuxiliaryTypes.ts";

export class ReplayFilter {
    public replayId?                   : number | null;
    public normalMapId?                : number | null;
    public minMyRating?                : number | null;
    public globalRatingRange?          : number[] | null;
    public userId?                     : number | null;
    public coCategoryId?               : number | null;
    public hasFog?                     : boolean | null;
    public gameMode?                   : number | null;
    public isFavorite?                 : boolean | null;
    public minPlayersCountUnneutral?   : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public maxPlayersCountUnneutral?   : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public minMapWidth?                : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public maxMapWidth?                : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public minMapHeight?               : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public maxMapHeight?               : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public minRankScore?               : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public maxRankScore?               : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public minTurnsCount?              : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public maxTurnsCount?              : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public minWarOperationsCount?      : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    public maxWarOperationsCount?      : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;

    public constructor(obj: Partial<ReplayFilter> = {}) {
        Object.assign(this, obj);
    }

    public clone(): ReplayFilter {
        const filter = new ReplayFilter();
        filter.replayId                   = this.replayId;
        filter.normalMapId                = this.normalMapId;
        filter.minMyRating                = this.minMyRating;
        filter.globalRatingRange          = this.globalRatingRange?.concat() ?? [];
        filter.userId                     = this.userId;
        filter.coCategoryId               = this.coCategoryId;
        filter.hasFog                     = this.hasFog;
        filter.gameMode                   = this.gameMode;
        filter.isFavorite                 = this.isFavorite;
        filter.minPlayersCountUnneutral   = this.minPlayersCountUnneutral;
        filter.maxPlayersCountUnneutral   = this.maxPlayersCountUnneutral;
        filter.minMapWidth                = this.minMapWidth;
        filter.maxMapWidth                = this.maxMapWidth;
        filter.minMapHeight               = this.minMapHeight;
        filter.maxMapHeight               = this.maxMapHeight;
        filter.minRankScore               = this.minRankScore;
        filter.maxRankScore               = this.maxRankScore;
        filter.minTurnsCount              = this.minTurnsCount;
        filter.maxTurnsCount              = this.maxTurnsCount;
        filter.minWarOperationsCount      = this.minWarOperationsCount;
        filter.maxWarOperationsCount      = this.maxWarOperationsCount;

        return filter;
    }
}
