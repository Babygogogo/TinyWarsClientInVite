import {
    type BaseWar_Interface_IBwCommonSettingManager,
    type WarEvents_Manager,
    type BaseWar_Model_BwWarStatisticsManager,
    type BaseWar_Model_War,
    type GameConfigs_GameConfig,
    type Players_PlayerManager,
    type WarTypes_Constants,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface ITwWar extends BaseWar_Model_War.War {
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getPlayerManager(): Players_PlayerManager.PlayerManager;
    getCommonSettingManager(): BaseWar_Interface_IBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): WarEvents_Manager.Manager;
    getWarStatisticsManager(): BaseWar_Model_BwWarStatisticsManager.BwWarStatisticsManager;

    getIsExecuteActionsWithExtraData(): boolean;
    updateTilesAndUnitsOnVisibilityChanged(): void;

    init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig, warType?: WarTypes_Constants.WarTypeId): void;
    initByMapRawData(mapRawData: MapRawData, gameConfig: GameConfigs_GameConfig.GameConfig): Promise<void>;

    getNormalMapId(): number | null;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;

    getBootRestTime(): number | null;
    getSettingsBootTimerParams(): number[];
}
