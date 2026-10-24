import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwCommonSettingManager from "../../baseWar/interface/IBwCommonSettingManager.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "../../baseWar/interface/IBwWarEventManager.ts";
import type * as BaseWarInterfaceIBwWarStatisticsManager from "../../baseWar/interface/IBwWarStatisticsManager.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import type * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as SinglePlayerWarInterfaceISpwRetractManager from "./ISpwRetractManager.ts";

type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type SpmWarSaveSlotExtraData    = ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData;

export interface ISpwWar extends BaseWarInterfaceIBwWar.IBwWar {
    serialize(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    getCommonSettingManager(): BaseWarInterfaceIBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager;
    getWarStatisticsManager(): BaseWarInterfaceIBwWarStatisticsManager.IBwWarStatisticsManager;
    getRetractManager(): SinglePlayerWarInterfaceISpwRetractManager.ISpwRetractManager;

    getIsExecuteActionsWithExtraData(): boolean;

    getIsAiPaused(): boolean;
    setIsAiPaused(isPaused: boolean): void;

    getBootRestTime(): number | null;

    setSaveSlotIndex(slotIndex: number | null): void;
    getSaveSlotIndex(): number | null;

    setSaveSlotExtraData(extraData: Undefinable<SpmWarSaveSlotExtraData>): void;
    getSaveSlotExtraData(): SpmWarSaveSlotExtraData;

    getHumanPlayerIndexes(): number[];
    getHumanPlayers(): PlayersIPlayer.IPlayer[];

    calculateTotalScore(): number;
}
