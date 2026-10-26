import type { IBwCommonSettingManager } from "../../baseWar/interface/IBwCommonSettingManager.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { IBwWarEventManager } from "../../baseWar/interface/IBwWarEventManager.ts";
import type { IBwWarStatisticsManager } from "../../baseWar/interface/IBwWarStatisticsManager.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import type { IPlayerManager } from "../../players/IPlayerManager.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import type { WarTypeId } from "../../warTypes/Constants.ts";

export interface ITwWar extends IBwWar {
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getPlayerManager(): IPlayerManager;
    getCommonSettingManager(): IBwCommonSettingManager;
    getWarEventManager(): IBwWarEventManager;
    getWarStatisticsManager(): IBwWarStatisticsManager;

    getIsExecuteActionsWithExtraData(): boolean;
    updateTilesAndUnitsOnVisibilityChanged(): void;

    init(data: SerialWar, gameConfig: GcData, warType?: WarTypeId): void;
    initByMapRawData(mapRawData: MapRawData, gameConfig: GcData): Promise<void>;

    getErrorCodeForInitForSfw(data: SerialWar, gameConfig: GcData): ClientErrorCode;
    getErrorCodeForInitForMfw(data: SerialWar, gameConfig: GcData): ClientErrorCode;
    getErrorCodeForInitByMapRawData(mapRawData: MapRawData, gameConfig: GcData): Promise<ClientErrorCode>;

    getNormalMapId(): number | null;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;

    getBootRestTime(): number | null;
    getSettingsBootTimerParams(): number[];
}
