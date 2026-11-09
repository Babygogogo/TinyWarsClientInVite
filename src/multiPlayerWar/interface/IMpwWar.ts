import {
    Players_Player,
    type BaseWar_Interface_IBwCommonSettingManager,
    type WarEvents_Manager,
    type BaseWar_Model_BwWarStatisticsManager,
    type BaseWar_Model_War,
} from "../../internal.ts";

export interface IMpwWar extends BaseWar_Model_War.War {
    getCommonSettingManager(): BaseWar_Interface_IBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): WarEvents_Manager.Manager;
    getWarStatisticsManager(): BaseWar_Model_BwWarStatisticsManager.BwWarStatisticsManager;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getBootRestTime(playerIndex: number): number | null;

    getIsExecuteActionsWithExtraData(): boolean;

    getPlayerIndexLoggedIn(): number | null;
    getPlayerLoggedIn(): Players_Player.Player | null;

    getVisionTeamIndex(): number | null;
    checkCanTickVisionTeamIndex(): boolean;
    tickVisionTeamIndex(): number | null;
}
