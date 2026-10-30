import {
    type Utils_ClientErrorCode,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwCommonSettingManager,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Interface_IBwWarEventManager,
    type BaseWar_Interface_IBwWarStatisticsManager,
    type Players_IPlayerManager,
    type WarTypes_Constants,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface ITwWar extends BaseWar_Interface_IBwWar.IBwWar {
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getPlayerManager(): Players_IPlayerManager.IPlayerManager;
    getCommonSettingManager(): BaseWar_Interface_IBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager;
    getWarStatisticsManager(): BaseWar_Interface_IBwWarStatisticsManager.IBwWarStatisticsManager;

    getIsExecuteActionsWithExtraData(): boolean;
    updateTilesAndUnitsOnVisibilityChanged(): void;

    init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig, warType?: WarTypes_Constants.WarTypeId): void;
    initByMapRawData(mapRawData: MapRawData, gameConfig: GameConfigs_GameConfig.GameConfig): Promise<void>;

    getErrorCodeForInitForSfw(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): Utils_ClientErrorCode.ClientErrorCode;
    getErrorCodeForInitForMfw(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): Utils_ClientErrorCode.ClientErrorCode;
    getErrorCodeForInitByMapRawData(mapRawData: MapRawData, gameConfig: GameConfigs_GameConfig.GameConfig): Promise<Utils_ClientErrorCode.ClientErrorCode>;

    getNormalMapId(): number | null;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;

    getBootRestTime(): number | null;
    getSettingsBootTimerParams(): number[];
}
