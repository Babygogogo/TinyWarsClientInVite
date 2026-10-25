import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwCommonSettingManager } from "../../baseWar/interface/IBwCommonSettingManager.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { IBwWarEventManager } from "../../baseWar/interface/IBwWarEventManager.ts";
import type { IBwWarStatisticsManager } from "../../baseWar/interface/IBwWarStatisticsManager.ts";
import type { IPlayer } from "../../players/IPlayer.ts";
import type {
    SpmWarSaveSlotExtraData as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData,
} from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { ISpwRetractManager } from "./ISpwRetractManager.ts";

type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type SpmWarSaveSlotExtraData    = ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData;

export interface ISpwWar extends IBwWar {
    serialize(): SerialWar;

    updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void;

    getCommonSettingManager(): IBwCommonSettingManager;
    getWarEventManager(): IBwWarEventManager;
    getWarStatisticsManager(): IBwWarStatisticsManager;
    getRetractManager(): ISpwRetractManager;

    getIsExecuteActionsWithExtraData(): boolean;

    getIsAiPaused(): boolean;
    setIsAiPaused(isPaused: boolean): void;

    getBootRestTime(): number | null;

    setSaveSlotIndex(slotIndex: number | null): void;
    getSaveSlotIndex(): number | null;

    setSaveSlotExtraData(extraData: Undefinable<SpmWarSaveSlotExtraData>): void;
    getSaveSlotExtraData(): SpmWarSaveSlotExtraData;

    getHumanPlayerIndexes(): number[];
    getHumanPlayers(): IPlayer[];

    calculateTotalScore(): number;
}
