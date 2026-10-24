import type * as BaseWarInterfaceIBwCommonSettingManager from "../../baseWar/interface/IBwCommonSettingManager.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "../../baseWar/interface/IBwWarEventManager.ts";
import type * as BaseWarInterfaceIBwWarStatisticsManager from "../../baseWar/interface/IBwWarStatisticsManager.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as PlayersIPlayerManager from "../../players/IPlayerManager.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import type * as WarTypesConstants from "../../warTypes/Constants.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type MapRawData         = ProtoSchemaCommonProtoMapMapRawData.MapRawData;
type GcData             = GameConfigGcData.GcData;

export interface ITwWar extends BaseWarInterfaceIBwWar.IBwWar {
    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;
    getPlayerManager(): PlayersIPlayerManager.IPlayerManager;
    getCommonSettingManager(): BaseWarInterfaceIBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager;
    getWarStatisticsManager(): BaseWarInterfaceIBwWarStatisticsManager.IBwWarStatisticsManager;

    getIsExecuteActionsWithExtraData(): boolean;
    updateTilesAndUnitsOnVisibilityChanged(): void;

    init(data: SerialWar, gameConfig: GcData, warType?: WarTypesConstants.WarTypeId): void;
    initByMapRawData(mapRawData: MapRawData, gameConfig: GcData): Promise<void>;

    getErrorCodeForInitForSfw(data: SerialWar, gameConfig: GcData): UtilsClientErrorCode.ClientErrorCode;
    getErrorCodeForInitForMfw(data: SerialWar, gameConfig: GcData): UtilsClientErrorCode.ClientErrorCode;
    getErrorCodeForInitByMapRawData(mapRawData: MapRawData, gameConfig: GcData): Promise<UtilsClientErrorCode.ClientErrorCode>;

    getNormalMapId(): number | null;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;

    getBootRestTime(): number | null;
    getSettingsBootTimerParams(): number[];
}
