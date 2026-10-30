import {
    BaseWar_Model_BwWar,
    BaseWar_Model_BwWarEventManager,
    MapEditor_Model_MeDrawer,
    BootTimers_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWarEventManager,
    type AuxiliaryTypes_AuxiliaryTypes,
    WarRules_Utils_Template,
    MapEditor_Model_MeHelpers,
    WarEvents_Actions_Utils_Common,
    Helpers_Misc,
    PlayerRules_Utils,
    Users_Model,
    Timer_TimerModel,
    Helpers_Collection,
    Players_Constants,
    WarTypes_Constants,
    type MapEditor_Interface_IMeDrawer,
    type MapEditor_Interface_IMeWar,
} from "../../internal.ts";

import type { CampaignMapData } from "../../proto/schema/CommonProto/Map/CampaignMapData.ts";
import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { MapSimpleDialogue } from "../../proto/schema/CommonProto/Map/MapSimpleDialogue.ts";
import { GridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { TaskObjectiveFullData } from "../../proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { SerialDrawVoteManager } from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export class MeWar extends BaseWar_Model_BwWar.BwWar implements MapEditor_Interface_IMeWar.IMeWar {
    private readonly _drawer                = new MapEditor_Model_MeDrawer.MeDrawer();
    private readonly _warEventManager       = new BaseWar_Model_BwWarEventManager.BwWarEventManager();

    private _srcNormalMapIdForAddEvent      : number | null = null;
    private _mapModifiedTime?               : number;
    private _mapSlotIndex?                  : number;
    private _mapDesignerUserId?             : number;
    private _mapDesignerName?               : string;
    private _mapNameList?                   : LanguageText[];
    private _mapDescArray?                  : LanguageText[];
    private _isReviewingMap                 = false;
    private _templateWarRuleArray           : TemplateWarRule[] = [];
    private _isMapModified                  = false;
    private _groupedMapTagId                : number | null = null;
    private _mapSimpleDialogueArray         : MapSimpleDialogue[] = [];
    private _campaignMapData                : CampaignMapData | null = null;
    private _taskObjectiveFullData          : TaskObjectiveFullData | null = null;
    private readonly _gridMarkData          = new GridMarkData();

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, WarTypes_Constants.WarTypeId.Me);
        this.getDrawer().init();

        this._initView();
    }
    public async initWithMapRawData({ mapRawData, slotIndex, gameConfig, srcNormalMapIdForAddEvent, gridMarkData }: {
        mapRawData                  : MapRawData;
        slotIndex                   : number;
        gameConfig                  : GameConfigs_GameConfig.GameConfig;
        srcNormalMapIdForAddEvent   : number | null;
        gridMarkData                : AuxiliaryTypes_AuxiliaryTypes.Undefinable<GridMarkData>;
    }): Promise<void> {
        this.init((await MapEditor_Model_MeHelpers.createISerialWar(mapRawData)).clone(), gameConfig);

        this.setSrcNormalMapIdForAddEvent(srcNormalMapIdForAddEvent);
        this.setMapSlotIndex(slotIndex);
        this.setMapModifiedTime(mapRawData.getModifiedTime());
        this.setMapDesignerUserId(mapRawData.getDesignerUserId() ?? Users_Model.getSelfUserId() ?? 0);
        this.setMapDesignerName(mapRawData.getDesignerName() ?? `??`);
        this.setMapNameArray(mapRawData.getMapNameArray());
        this.setMapDescArray(mapRawData.getMapExtraText()?.getMapDescription() ?? []);
        this._setTemplateWarRuleArray(MapEditor_Model_MeHelpers.createRevisedTemplateWarRuleArrayForMeWar(mapRawData.getTemplateWarRuleArray(), gameConfig));
        this.setGroupedMapTagId(mapRawData.getMapTagIdFlags());
        this.setMapSimpleDialogueArray(mapRawData.getMapSimpleDialogueArray());
        this._setCampaignMapData(mapRawData.getCampaignMapData() ?? null);
        this.setTaskObjectiveFullData(mapRawData.getTaskObjectiveFullData() ?? null);
        this._setGridMarkData(gridMarkData);
    }

    public startRunning(): MapEditor_Interface_IMeWar.IMeWar {
        super.startRunning();

        this.getDrawer().startRunning(this);

        return this;
    }
    public stopRunning(): MapEditor_Interface_IMeWar.IMeWar {
        super.stopRunning();

        this.getDrawer().stopRunning();

        return this;
    }

    public serializeForCreateSfwWithTemplateWarRule(warRule: TemplateWarRule): SerialWar {
        const playerManagerData     = this.getPlayerManager().serializeForCreateSfw();
        const playerRuleDataArray   = warRule.getWarRuleCommonData()?.getPlayerRuleList();
        const gameConfig            = this.getGcData();
        for (const player of playerManagerData.getPlayers()) {
            const playerIndex   = player.getPlayerIndex();
            const playerRule    = playerRuleDataArray?.find(v => (v.getPlayerIndex()) === playerIndex);
            if (playerRule != null) {
                const campaignAiCoId = playerRule.getCampaignAiCoId();
                if (campaignAiCoId != null) {
                    player.setCoId(campaignAiCoId);
                } else {
                    const campaignHumanCoIdArray = playerRule.getCampaignHumanCoIdArray();
                    if (campaignHumanCoIdArray?.length) {
                        player.setCoId(Helpers_Collection.pickRandomElement(campaignHumanCoIdArray));
                    } else {
                        player.setCoId(Helpers_Collection.pickRandomElement([...PlayerRules_Utils.getFinalSfwHumanCoIdSet({
                            playerRule      : playerRule,
                            gameConfig      : gameConfig,
                            hasFogByDefault : !!warRule.getWarRuleCommonData()?.getHasFogByDefault(),
                            includeRandom   : false,
                        })]));
                    }
                }
            }
        }

        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().serializeForCreateSfwWithTemplateWarRule(warRule).toJson(),
            settingsForMcw    : null,
            settingsForMrw    : null,
            settingsForMmw    : null,
            settingsForAtw    : null,
            settingsForMfw    : null,
            settingsForCcw    : null,
            settingsForScw    : null,
            settingsForSfw    : null,

            warId                    : this.getWarId(),
            isEnded                  : false,
            seedRandomInitialState   : null,
            seedRandomCurrentState   : null,
            executedOperationManager : null,
            remainingVotesForDraw    : null,
            drawVoteManager          : new SerialDrawVoteManager().toJson(),
            weatherManager           : this.getWeatherManager().serializeForCreateSfw().toJson(),
            warEventManager          : this.getWarEventManager().serializeForCreateSfw().toJson(),
            playerManager            : playerManagerData.toJson(),
            turnManager              : this.getTurnManager().serializeForCreateSfw().toJson(),
            field                    : this.getField().serializeForCreateSfw().toJson(),
            warStatisticsManager     : this.getWarStatisticsManager().serializeForCreateSfw().toJson(),
            taskObjectiveManager     : this.getTaskObjectiveManager().serializeForCreateSfw().toJson(),
        });
    }
    public serializeForCreateMfrWithTemplateWarRule(warRule: TemplateWarRule): SerialWar {
        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().serializeForCreateMfwWithTemplateWarRule(warRule).toJson(),
            settingsForMcw    : null,
            settingsForMrw    : null,
            settingsForMmw    : null,
            settingsForAtw    : null,
            settingsForMfw    : null,
            settingsForCcw    : null,
            settingsForScw    : null,
            settingsForSfw    : null,

            warId                    : this.getWarId(),
            isEnded                  : false,
            seedRandomInitialState   : null,
            seedRandomCurrentState   : null,
            executedOperationManager : null,
            remainingVotesForDraw    : null,
            drawVoteManager          : new SerialDrawVoteManager().toJson(),
            weatherManager           : this.getWeatherManager().serializeForCreateMfr().toJson(),
            warEventManager          : this.getWarEventManager().serializeForCreateMfr().toJson(),
            playerManager            : this.getPlayerManager().serializeForCreateMfr().toJson(),
            turnManager              : this.getTurnManager().serializeForCreateMfr().toJson(),
            field                    : this.getField().serializeForCreateMfr().toJson(),
            warStatisticsManager     : this.getWarStatisticsManager().serializeForCreateMfr().toJson(),
            taskObjectiveManager     : this.getTaskObjectiveManager().serializeForCreateMfr().toJson(),
        });
    }
    public override async serializeForMap(): Promise<MapRawData> {
        const unitMap = this.getUnitMap();
        MapEditor_Model_MeHelpers.reviseAllUnitIds(unitMap);

        const mapSize               = unitMap.getMapSize();
        const playersCountUnneutral = this.getPlayersCountUnneutral();
        const serialTileMap         = this.getTileMap().serialize();
        const serialUnitMap         = unitMap.serialize();
        return MapRawData.fromJson({
            designerName           : this.getMapDesignerName(),
            designerUserId         : this.getMapDesignerUserId(),
            mapNameArray           : this.getMapNameArray().map(v => v.toJson()),
            mapWidth               : mapSize.getWidth(),
            mapHeight              : mapSize.getHeight(),
            playersCountUnneutral  : playersCountUnneutral,
            modifiedTime           : Timer_TimerModel.getServerTimestamp(),
            tileDataArray          : serialTileMap.getTiles().map(v => v.toJson()),
            unitDataArray          : serialUnitMap.getUnits().map(v => v.toJson()),
            templateWarRuleArray   : this.getRevisedTemplateWarRuleArray(playersCountUnneutral).map(v => v.toJson()),
            mapTagIdFlags          : this.getGroupedMapTagId(),
            warEventFullData       : this.getWarEventManager().getWarEventFullData()?.toJson(),
            mapSimpleDialogueArray : this.getMapSimpleDialogueArray().map(v => v.toJson()),
            campaignMapData        : this.getCampaignMapData()?.toJson(),
            taskObjectiveFullData  : this.getTaskObjectiveFullData()?.toJson(),
            mapExtraText           : {
                mapDescription : this.getMapDescArray().map(v => v.toJson()),
            },
            tileCustomNameArray : serialTileMap.getTileCustomNameArray().map(v => v.toJson()),
            unitCustomNameArray : serialUnitMap.getUnitCustomNameArray().map(v => v.toJson()),
        });
    }

    public getCanCheat(): boolean {
        return true;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return true;
    }

    public getIsNeedExecutedOperations(): boolean {
        return false;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }
    public getNormalMapId(): number | null {
        return null;
    }

    public getBootRestTime(): number | null {
        return null;
    }
    public getSettingsBootTimerParams(): number[] {
        return [BootTimers_Constants.TimerTypeId.NoBoot];
    }

    public getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager {
        return this._warEventManager;
    }

    public getIsExecuteActionsWithExtraData(): boolean {
        return false;
    }

    public updateTilesAndUnitsOnVisibilityChanged(): void {
        // nothing to do.
    }

    public getDrawer(): MapEditor_Interface_IMeDrawer.IMeDrawer {
        return this._drawer;
    }

    public setMapModifiedTime(time: number): void {
        this._mapModifiedTime = time;
    }
    public getMapModifiedTime(): number {
        return Helpers_Misc.getExisted(this._mapModifiedTime);
    }

    public getSrcNormalMapIdForAddEvent(): number | null {
        return this._srcNormalMapIdForAddEvent;
    }
    public setSrcNormalMapIdForAddEvent(normalMapId: number | null): void {
        this._srcNormalMapIdForAddEvent = normalMapId;
    }

    public getMapSlotIndex(): number {
        return Helpers_Misc.getExisted(this._mapSlotIndex);
    }
    public setMapSlotIndex(value: number): void {
        this._mapSlotIndex = value;
    }

    public getMapDesignerUserId(): number {
        return Helpers_Misc.getExisted(this._mapDesignerUserId);
    }
    public setMapDesignerUserId(value: number): void {
        this._mapDesignerUserId = value;
    }

    public getMapDesignerName(): string {
        return Helpers_Misc.getExisted(this._mapDesignerName);
    }
    public setMapDesignerName(value: string): void {
        this._mapDesignerName = value;
    }

    public getMapNameArray(): LanguageText[] {
        return Helpers_Misc.getExisted(this._mapNameList);
    }
    public setMapNameArray(value: LanguageText[]): void {
        this._mapNameList = value;
    }

    public getMapDescArray(): LanguageText[] {
        return Helpers_Misc.getExisted(this._mapDescArray);
    }
    public setMapDescArray(value: LanguageText[]): void {
        this._mapDescArray = value;
    }

    public getIsReviewingMap(): boolean {
        return this._isReviewingMap;
    }
    public setIsReviewingMap(value: boolean): void {
        this._isReviewingMap = value;
    }

    public getIsMapModified(): boolean {
        return this._isMapModified;
    }
    public setIsMapModified(hasSubmitted: boolean): void {
        this._isMapModified = hasSubmitted;
    }

    public getTemplateWarRuleArray(): TemplateWarRule[] {
        return this._templateWarRuleArray;
    }
    private _setTemplateWarRuleArray(value: TemplateWarRule[]): void {
        this._templateWarRuleArray = value;
    }
    private _getTemplateWarRule(ruleId: number): TemplateWarRule {
        return Helpers_Misc.getExisted(this.getTemplateWarRuleArray().find(v => v.getRuleId() === ruleId));
    }
    public getRevisedTemplateWarRuleArray(playersCountUnneutral: number): TemplateWarRule[] {
        const revisedTemplateWarRuleArray: TemplateWarRule[] = [];
        for (const templateWarRule of this.getTemplateWarRuleArray() || []) {
            const revisedRule       = templateWarRule.clone();
            const warRuleCommonData = revisedRule.createIfNotExistsWarRuleCommonData();
            warRuleCommonData.setPlayerRuleList(
                warRuleCommonData.getPlayerRuleList()
                    .filter(v => {
                        const playerIndex = v.getPlayerIndex();
                        return (playerIndex <= playersCountUnneutral)
                            && (playerIndex >= Players_Constants.PlayerIndex.First);
                    })
                    .sort((v1, v2) =>
                        v1.getPlayerIndex() - v2.getPlayerIndex(),
                    ),
            );
            revisedTemplateWarRuleArray.push(revisedRule);
        }

        return revisedTemplateWarRuleArray;
    }

    public addEmptyTemplateWarRule(): void {
        const templateWarRuleArray = this.getTemplateWarRuleArray();
        templateWarRuleArray.push(WarRules_Utils_Template.createDefault(templateWarRuleArray.length, Players_Constants.PlayerIndex.Max, this.getGcData()));
    }
    public addTemplateWarRule(rule: TemplateWarRule): void {
        const arr   = this.getTemplateWarRuleArray();
        rule.setRuleId(arr.length);
        arr.push(rule);
    }
    public deleteTemplateWarRule(templateWarRuleId: number): void {
        const templateWarRuleArray  = this.getTemplateWarRuleArray();
        const ruleIndex             = templateWarRuleArray.findIndex(v => v.getRuleId() === templateWarRuleId);
        if (ruleIndex >= 0) {
            templateWarRuleArray.splice(ruleIndex, 1);
            for (let i = ruleIndex; i < templateWarRuleArray.length; ++i) {
                templateWarRuleArray[i].setRuleId(i);
            }
        }
    }
    public setWarRuleNameList(ruleId: number, nameArray: LanguageText[]): void {
        const templateWarRule = this._getTemplateWarRule(ruleId);
        if (templateWarRule) {
            templateWarRule.setRuleNameArray(nameArray);
        }
    }

    public getGroupedMapTagId(): number | null {
        return this._groupedMapTagId ?? null;
    }
    public setGroupedMapTagId(mapTagIdFlags: number | null): void {
        this._groupedMapTagId = mapTagIdFlags;
    }

    public getMapSimpleDialogueArray(): MapSimpleDialogue[] {
        return this._mapSimpleDialogueArray;
    }
    public setMapSimpleDialogueArray(arr: MapSimpleDialogue[]): void {
        this._mapSimpleDialogueArray = arr;
    }
    public addDefaultMapSimpleDialogue(): number {
        const dialogueArray = this.getMapSimpleDialogueArray();
        for (let dialogueId = 1; ; ++dialogueId) {
            if (!dialogueArray.some(v => (v.getDialogueId()) === dialogueId)) {
                dialogueArray.push(MapSimpleDialogue.fromJson({
                    dialogueId        : dialogueId,
                    dialogueNameArray : [
                        // { languageType: LanguageType.Chinese, text: `${Lang.getText(LangTextType.B1097, LanguageType.Chinese)} #${dialogueId}` },
                        // { languageType: LanguageType.English, text: `${Lang.getText(LangTextType.B1097, LanguageType.English)} #${dialogueId}` },
                    ],
                    dataArray : [
                        WarEvents_Actions_Utils_Common.getDefaultSimpleCoDialogueData().toJson(),
                    ],
                }));
                dialogueArray.sort((v1, v2) => (v1.getDialogueId()) - (v2.getDialogueId()));

                return dialogueId;
            }
        }
    }
    public cloneMapSimpleDialogue(dialogueId: number): number | null {
        const dialogueArray = this.getMapSimpleDialogueArray();
        const srcDialogue   = dialogueArray.find(v => v.getDialogueId() === dialogueId);
        if (srcDialogue == null) {
            return null;
        }

        for (let newDialogueId = 1; ; ++newDialogueId) {
            if (!dialogueArray.some(v => (v.getDialogueId()) === newDialogueId)) {
                const dstDialogue = srcDialogue.clone();
                dstDialogue.setDialogueId(newDialogueId);
                dialogueArray.push(dstDialogue);
                dialogueArray.sort((v1, v2) => (v1.getDialogueId()) - (v2.getDialogueId()));
                return newDialogueId;
            }
        }
    }
    public deleteMapSimpleDialogues(dialogueIdArray: number[]): void {
        {
            const array = this.getMapSimpleDialogueArray();
            for (let i = 0; i < array.length; ++i) {
                if (dialogueIdArray.includes(array[i].getDialogueId())) {
                    array.splice(i--, 1);
                }
            }
        }

        {
            for (const rule of this.getTemplateWarRuleArray()) {
                const arr = rule.getMapSimpleDialogueIdArray().filter(v => !dialogueIdArray.includes(v));
                if (arr?.length) {
                    rule.setMapSimpleDialogueIdArray(arr);
                } else {
                    rule.setMapSimpleDialogueIdArray([]);
                }
            }
        }
    }
    public deleteAllMapSimpleDialogues(): void {
        this.getMapSimpleDialogueArray().length = 0;
    }

    private _setCampaignMapData(data: CampaignMapData | null): void {
        this._campaignMapData = data;
    }
    public getCampaignMapData(): CampaignMapData | null {
        return this._campaignMapData;
    }

    public setTaskObjectiveFullData(data: TaskObjectiveFullData | null): void {
        this._taskObjectiveFullData = data;
    }
    public getTaskObjectiveFullData(): TaskObjectiveFullData | null {
        return this._taskObjectiveFullData;
    }

    public getGridMarkData(): GridMarkData {
        return this._gridMarkData;
    }
    private _setGridMarkData(newData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<GridMarkData>): void {
        this.getGridMarkData().loadJson(newData?.toJson() ?? new GridMarkData().toJson());
    }

    public getPlayersCountUnneutral(): number {
        return this.getField().getMaxPlayerIndex();
    }
}
