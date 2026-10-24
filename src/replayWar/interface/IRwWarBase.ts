import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwCommonSettingManager from "../../baseWar/interface/IBwCommonSettingManager.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "../../baseWar/interface/IBwWarEventManager.ts";
import type * as BaseWarInterfaceIBwWarStatisticsManager from "../../baseWar/interface/IBwWarStatisticsManager.ts";
import type * as ProtoSchemaCommonProtoStructureGridMarkData from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForAtw from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForCcw from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMcw from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMfw from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMmw from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMrw from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForScw from "../../proto/schema/CommonProto/WarSettings/SettingsForScw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForSfw from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForSrw from "../../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export interface IRwWarBase extends BaseWarInterfaceIBwWar.IBwWar {
    serializeForCheckpoint(): AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointData;
    tickVisionTeamIndex(): number | null;

    getCommonSettingManager(): BaseWarInterfaceIBwCommonSettingManager.IBwCommonSettingManager;
    getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager;
    getWarStatisticsManager(): BaseWarInterfaceIBwWarStatisticsManager.IBwWarStatisticsManager;

    getCanCheat(): boolean;
    getIsNeedExecutedOperations(): boolean;
    getBootRestTime(): number | null;
    getSettingsBootTimerParams(): number[];
    getNormalMapId(): number | null;
    getWarOperationDescSuffix(): string;

    getSettingsForMcw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMcw.SettingsForMcw>;
    getSettingsForScw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForScw.SettingsForScw>;
    getSettingsForSfw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForSfw.SettingsForSfw>;
    getSettingsForSrw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForSrw.SettingsForSrw>;
    getSettingsForMrw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMrw.SettingsForMrw>;
    getSettingsForMmw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMmw.SettingsForMmw>;
    getSettingsForAtw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForAtw.SettingsForAtw>;
    getSettingsForCcw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForCcw.SettingsForCcw>;
    getSettingsForMfw(): Undefinable<ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw>;

    getGridMarkData(): ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData;

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
    getNextAction(): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer | null;

    getAllCheckpointInfoArray(): AuxiliaryTypesAuxiliaryTypes.ReplayCheckpointInfo[];

    loadCheckpoint(checkpointId: number, floatText?: boolean): Promise<void>;
    loadPreviousCheckpoint(floatText?: boolean): Promise<void>;
    loadNextCheckpoint(): Promise<void>;

    loadPreviousAction(): Promise<void>;
    loadNextAction(): Promise<void>;
}
