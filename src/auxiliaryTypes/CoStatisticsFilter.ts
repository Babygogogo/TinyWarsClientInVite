import type * as GameModesConstants from "../gameModes/Constants.ts";

export class CoStatisticsFilter {
    normalMapId?        : number | null;
    gameMode?           : GameModesConstants.ModeId | null;
    minTurnIndex?       : number | null;
    maxTurnIndex?       : number | null;
    minRankScore?       : number | null;
    maxRankScore?       : number | null;
    hasFog?             : boolean | null;
    includeMirrorGame?  : boolean | null;
    showDeprecatedCo?   : boolean | null;

    public clone(): CoStatisticsFilter {
        const filter = new CoStatisticsFilter();
        filter.normalMapId        = this.normalMapId;
        filter.gameMode           = this.gameMode;
        filter.minTurnIndex       = this.minTurnIndex;
        filter.maxTurnIndex       = this.maxTurnIndex;
        filter.minRankScore       = this.minRankScore;
        filter.maxRankScore       = this.maxRankScore;
        filter.hasFog             = this.hasFog;
        filter.includeMirrorGame  = this.includeMirrorGame;
        filter.showDeprecatedCo   = this.showDeprecatedCo;
        return filter;
    }
}
