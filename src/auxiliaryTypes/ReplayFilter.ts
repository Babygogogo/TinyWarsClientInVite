import {
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

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
    public minPlayersCountUnneutral?   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public maxPlayersCountUnneutral?   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public minMapWidth?                : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public maxMapWidth?                : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public minMapHeight?               : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public maxMapHeight?               : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public minRankScore?               : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public maxRankScore?               : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public minTurnsCount?              : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public maxTurnsCount?              : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public minWarOperationsCount?      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    public maxWarOperationsCount?      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

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
