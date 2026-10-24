import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "../../baseWar/interface/IBwWarEventManager.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import type * as MapEditorInterfaceIMeDrawer from "./IMeDrawer.ts";
import type * as ProtoSchemaCommonProtoMapCampaignMapData from "../../proto/schema/CommonProto/Map/CampaignMapData.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoMapMapSimpleDialogue from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type * as ProtoSchemaCommonProtoStructureGridMarkData from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

type SerialWar              = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type TemplateWarRule        = ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;
type MapRawData             = ProtoSchemaCommonProtoMapMapRawData.MapRawData;
type MapSimpleDialogue      = ProtoSchemaCommonProtoMapMapSimpleDialogue.MapSimpleDialogue;
type CampaignMapData        = ProtoSchemaCommonProtoMapCampaignMapData.CampaignMapData;
type LanguageText           = ProtoSchemaCommonProtoStructureLanguageText.LanguageText;
type TaskObjectiveFullData  = ProtoSchemaCommonProtoTaskObjectivesTaskObjectiveFullData.TaskObjectiveFullData;
type GridMarkData           = ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export interface IMeWar extends BaseWarInterfaceIBwWar.IBwWar {
    init(data: SerialWar, gameConfig: GameConfigGcData.GcData): void;
    initWithMapRawData({ mapRawData, slotIndex, gameConfig, srcNormalMapIdForAddEvent, gridMarkData }: {
        mapRawData                  : MapRawData;
        slotIndex                   : number;
        gameConfig                  : GameConfigGcData.GcData;
        srcNormalMapIdForAddEvent   : number | null;
        gridMarkData                : Undefinable<GridMarkData>;
    }): Promise<void>;

    startRunning(): IMeWar;
    stopRunning(): IMeWar;

    serializeForCreateSfwWithTemplateWarRule(warRule: TemplateWarRule): SerialWar;
    serializeForCreateMfrWithTemplateWarRule(warRule: TemplateWarRule): SerialWar;
    serializeForMap(): Promise<MapRawData>;

    getCanCheat(): boolean;
    getShouldSerializeFullInfoForFreeModeGames(): boolean;

    getIsNeedExecutedOperations(): boolean;
    getIsNeedSeedRandom(): boolean;
    getNormalMapId(): number | null;

    getBootRestTime(): number | null;
    getSettingsBootTimerParams(): number[];

    getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager;

    getIsExecuteActionsWithExtraData(): boolean;

    updateTilesAndUnitsOnVisibilityChanged(): void;

    getDrawer(): MapEditorInterfaceIMeDrawer.IMeDrawer;

    setMapModifiedTime(time: number): void;
    getMapModifiedTime(): number;

    getSrcNormalMapIdForAddEvent(): number | null;
    setSrcNormalMapIdForAddEvent(normalMapId: number | null): void;

    getMapSlotIndex(): number;
    setMapSlotIndex(value: number): void;

    getMapDesignerUserId(): number;
    setMapDesignerUserId(value: number): void;

    getMapDesignerName(): string;
    setMapDesignerName(value: string): void;

    getMapNameArray(): LanguageText[];
    setMapNameArray(value: LanguageText[]): void;

    getMapDescArray(): LanguageText[];
    setMapDescArray(value: LanguageText[]): void;

    getIsReviewingMap(): boolean;
    setIsReviewingMap(value: boolean): void;

    getIsMapModified(): boolean;
    setIsMapModified(hasSubmitted: boolean): void;

    getTemplateWarRuleArray(): TemplateWarRule[];
    getRevisedTemplateWarRuleArray(playersCountUnneutral: number): TemplateWarRule[];

    addEmptyTemplateWarRule(): void;
    addTemplateWarRule(rule: TemplateWarRule): void;
    deleteTemplateWarRule(templateWarRuleId: number): void;
    setWarRuleNameList(ruleId: number, nameArray: LanguageText[]): void;

    getGroupedMapTagId(): number | null;
    setGroupedMapTagId(mapTagIdFlags: number | null): void;

    getMapSimpleDialogueArray(): MapSimpleDialogue[];
    setMapSimpleDialogueArray(arr: MapSimpleDialogue[]): void;
    addDefaultMapSimpleDialogue(): number;
    cloneMapSimpleDialogue(dialogueId: number): number | null;
    deleteMapSimpleDialogues(dialogueIdArray: number[]): void;
    deleteAllMapSimpleDialogues(): void;

    getCampaignMapData(): CampaignMapData | null;

    setTaskObjectiveFullData(data: TaskObjectiveFullData | null): void;
    getTaskObjectiveFullData(): TaskObjectiveFullData | null;

    getGridMarkData(): GridMarkData;

    getPlayersCountUnneutral(): number;
}
