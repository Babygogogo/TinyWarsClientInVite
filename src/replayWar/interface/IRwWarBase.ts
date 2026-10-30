import {
    type BaseWar_Interface_IBwCommonSettingManager,
    type BaseWar_Interface_IBwWar,
    type BaseWar_Interface_IBwWarEventManager,
    type BaseWar_Interface_IBwWarStatisticsManager,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { SettingsForAtw } from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";
import type { SettingsForCcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import type { SettingsForMcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import type { SettingsForMfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";
import type { SettingsForMmw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";
import type { SettingsForMrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";
import type { SettingsForScw } from "../../proto/schema/CommonProto/WarSettings/SettingsForScw.ts";
import type { SettingsForSfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";
import type { SettingsForSrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";

export interface IRwWarBase extends BaseWar_Interface_IBwWar.IBwWar {
    serializeForCheckpoint(): AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointData;
    tickVisionTeamIndex(): number | null;

    getCommonSettingManager(): BaseWar_Interface_IBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager;
    getWarStatisticsManager(): BaseWar_Interface_IBwWarStatisticsManager.IBwWarStatisticsManager;

    getCanCheat(): boolean;
    getIsNeedExecutedOperations(): boolean;
    getBootRestTime(): number | null;
    getSettingsBootTimerParams(): number[];
    getNormalMapId(): number | null;
    getWarOperationDescSuffix(): string;

    getSettingsForMcw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMcw>;
    getSettingsForScw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForScw>;
    getSettingsForSfw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForSfw>;
    getSettingsForSrw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForSrw>;
    getSettingsForMrw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMrw>;
    getSettingsForMmw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMmw>;
    getSettingsForAtw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForAtw>;
    getSettingsForCcw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForCcw>;
    getSettingsForMfw(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<SettingsForMfw>;

    getGridMarkData(): GridMarkData;

    checkIsInBeginning(): boolean;
    checkIsInEnd(): boolean;

    getIsTickingReplay(): boolean;

    getIsBatchExecuteAction(): boolean;
    setIsBatchExecuteAction(isFast: boolean): void;

    getVisionTeamIndex(): number | null;

    getIsShowTurnStartPopUp(): boolean;
    setIsShowTurnStartPopUp(isShow: boolean): void;

    getIsAutoReplay(): boolean;
    setIsAutoReplay(isAuto: boolean): void;

    getNextOperationId(): number;
    setNextOperationId(nextOperationId: number): void;
    getNextAction(): WoContainer | null;

    getAllCheckpointInfoArray(): AuxiliaryTypes_AuxiliaryTypes.ReplayCheckpointInfo[];

    loadCheckpoint(checkpointId: number, floatText?: boolean): Promise<void>;
    loadPreviousCheckpoint(floatText?: boolean): Promise<void>;
    loadNextCheckpoint(): Promise<void>;

    loadPreviousAction(): Promise<void>;
    loadNextAction(): Promise<void>;
}
