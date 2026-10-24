import type * as BaseWarInterfaceIBwCommonSettingManager from "../../baseWar/interface/IBwCommonSettingManager.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "../../baseWar/interface/IBwWarEventManager.ts";
import type * as BaseWarInterfaceIBwWarStatisticsManager from "../../baseWar/interface/IBwWarStatisticsManager.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";

export interface IMpwWar extends BaseWarInterfaceIBwWar.IBwWar {
    getCommonSettingManager(): BaseWarInterfaceIBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager;
    getWarStatisticsManager(): BaseWarInterfaceIBwWarStatisticsManager.IBwWarStatisticsManager;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getBootRestTime(playerIndex: number): number | null;

    getIsExecuteActionsWithExtraData(): boolean;

    getPlayerIndexLoggedIn(): number | null;
    getPlayerLoggedIn(): PlayersIPlayer.IPlayer | null;

    getVisionTeamIndex(): number | null;
    checkCanTickVisionTeamIndex(): boolean;
    tickVisionTeamIndex(): number | null;
}
