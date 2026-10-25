import type { Undefinable } from "./AuxiliaryTypes.ts";

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
    public minPlayersCountUnneutral?   : Undefinable<number>;
    public maxPlayersCountUnneutral?   : Undefinable<number>;
    public minMapWidth?                : Undefinable<number>;
    public maxMapWidth?                : Undefinable<number>;
    public minMapHeight?               : Undefinable<number>;
    public maxMapHeight?               : Undefinable<number>;
    public minRankScore?               : Undefinable<number>;
    public maxRankScore?               : Undefinable<number>;
    public minTurnsCount?              : Undefinable<number>;
    public maxTurnsCount?              : Undefinable<number>;
    public minWarOperationsCount?      : Undefinable<number>;
    public maxWarOperationsCount?      : Undefinable<number>;

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
