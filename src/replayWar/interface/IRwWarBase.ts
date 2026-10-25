import type {
    Undefinable,
    ReplayCheckpointData,
    ReplayCheckpointInfo,
} from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwCommonSettingManager } from "../../baseWar/interface/IBwCommonSettingManager.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { IBwWarEventManager } from "../../baseWar/interface/IBwWarEventManager.ts";
import type { IBwWarStatisticsManager } from "../../baseWar/interface/IBwWarStatisticsManager.ts";
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

export interface IRwWarBase extends IBwWar {
    serializeForCheckpoint(): ReplayCheckpointData;
    tickVisionTeamIndex(): number | null;

    getCommonSettingManager(): IBwCommonSettingManager;
    getWarEventManager(): IBwWarEventManager;
    getWarStatisticsManager(): IBwWarStatisticsManager;

    getCanCheat(): boolean;
    getIsNeedExecutedOperations(): boolean;
    getBootRestTime(): number | null;
    getSettingsBootTimerParams(): number[];
    getNormalMapId(): number | null;
    getWarOperationDescSuffix(): string;

    getSettingsForMcw(): Undefinable<SettingsForMcw>;
    getSettingsForScw(): Undefinable<SettingsForScw>;
    getSettingsForSfw(): Undefinable<SettingsForSfw>;
    getSettingsForSrw(): Undefinable<SettingsForSrw>;
    getSettingsForMrw(): Undefinable<SettingsForMrw>;
    getSettingsForMmw(): Undefinable<SettingsForMmw>;
    getSettingsForAtw(): Undefinable<SettingsForAtw>;
    getSettingsForCcw(): Undefinable<SettingsForCcw>;
    getSettingsForMfw(): Undefinable<SettingsForMfw>;

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

    getAllCheckpointInfoArray(): ReplayCheckpointInfo[];

    loadCheckpoint(checkpointId: number, floatText?: boolean): Promise<void>;
    loadPreviousCheckpoint(floatText?: boolean): Promise<void>;
    loadNextCheckpoint(): Promise<void>;

    loadPreviousAction(): Promise<void>;
    loadNextAction(): Promise<void>;
}
