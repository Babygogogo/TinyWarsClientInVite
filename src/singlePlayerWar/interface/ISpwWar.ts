import {
    type BaseWar_Interface_IBwCommonSettingManager,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Interface_IBwWarEventManager,
    type BaseWar_Interface_IBwWarStatisticsManager,
    type Players_IPlayer,
    type SinglePlayerWar_Interface_ISpwRetractManager,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface ISpwWar extends BaseWar_Interface_IBwWar.IBwWar {
    serialize(): SerialWar;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    getCommonSettingManager(): BaseWar_Interface_IBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager;
    getWarStatisticsManager(): BaseWar_Interface_IBwWarStatisticsManager.IBwWarStatisticsManager;
    getRetractManager(): SinglePlayerWar_Interface_ISpwRetractManager.ISpwRetractManager;

    getIsExecuteActionsWithExtraData(): boolean;

    getIsAiPaused(): boolean;
    setIsAiPaused(isPaused: boolean): void;

    getBootRestTime(): number | null;

    setSaveSlotIndex(slotIndex: number | null): void;
    getSaveSlotIndex(): number | null;

    setSaveSlotExtraData(extraData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SpmWarSaveSlotExtraData>): void;
    getSaveSlotExtraData(): SpmWarSaveSlotExtraData;

    getHumanPlayerIndexes(): number[];
    getHumanPlayers(): Players_IPlayer.IPlayer[];

    calculateTotalScore(): number;
}
