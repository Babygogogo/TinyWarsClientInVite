import type { IBwCommonSettingManager } from "../../baseWar/interface/IBwCommonSettingManager.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { IBwWarEventManager } from "../../baseWar/interface/IBwWarEventManager.ts";
import type { IBwWarStatisticsManager } from "../../baseWar/interface/IBwWarStatisticsManager.ts";
import type { IPlayer } from "../../players/IPlayer.ts";

export interface IMpwWar extends IBwWar {
    getCommonSettingManager(): IBwCommonSettingManager;
    getWarEventManager(): IBwWarEventManager;
    getWarStatisticsManager(): IBwWarStatisticsManager;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getBootRestTime(playerIndex: number): number | null;

    getIsExecuteActionsWithExtraData(): boolean;

    getPlayerIndexLoggedIn(): number | null;
    getPlayerLoggedIn(): IPlayer | null;

    getVisionTeamIndex(): number | null;
    checkCanTickVisionTeamIndex(): boolean;
    tickVisionTeamIndex(): number | null;
}
