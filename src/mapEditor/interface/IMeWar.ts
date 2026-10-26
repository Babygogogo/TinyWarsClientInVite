import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import type { IBwWarEventManager } from "../../baseWar/interface/IBwWarEventManager.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import type { IMeDrawer } from "./IMeDrawer.ts";
import type { CampaignMapData } from "../../proto/schema/CommonProto/Map/CampaignMapData.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import type { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { TaskObjectiveFullData } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface IMeWar extends IBwWar {
    init(data: SerialWar, gameConfig: GcData): void;
    initWithMapRawData({ mapRawData, slotIndex, gameConfig, srcNormalMapIdForAddEvent, gridMarkData }: {
        mapRawData                  : MapRawData;
        slotIndex                   : number;
        gameConfig                  : GcData;
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

    getWarEventManager(): IBwWarEventManager;

    getIsExecuteActionsWithExtraData(): boolean;

    updateTilesAndUnitsOnVisibilityChanged(): void;

    getDrawer(): IMeDrawer;

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
