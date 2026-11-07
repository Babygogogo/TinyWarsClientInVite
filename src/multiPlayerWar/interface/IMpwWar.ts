import {
    type BaseWar_Interface_IBwCommonSettingManager,
    type BaseWar_Interface_IBwWarEventManager,
    type BaseWar_Interface_IBwWarStatisticsManager,
    type BaseWar_Model_War,
    type Players_IPlayer,
} from "../../internal.ts";

export interface IMpwWar extends BaseWar_Model_War.War {
    getCommonSettingManager(): BaseWar_Interface_IBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager;
    getWarStatisticsManager(): BaseWar_Interface_IBwWarStatisticsManager.IBwWarStatisticsManager;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getBootRestTime(playerIndex: number): number | null;

    getIsExecuteActionsWithExtraData(): boolean;

    getPlayerIndexLoggedIn(): number | null;
    getPlayerLoggedIn(): Players_IPlayer.IPlayer | null;

    getVisionTeamIndex(): number | null;
    checkCanTickVisionTeamIndex(): boolean;
    tickVisionTeamIndex(): number | null;
}
