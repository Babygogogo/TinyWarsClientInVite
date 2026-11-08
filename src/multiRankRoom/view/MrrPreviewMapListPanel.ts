import {
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Interfaces_IUiTab,
    type Ui_Interfaces_IUiTabItemRenderer,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
    Wars_Constants,
    Utils_ClientErrorCode,
    WarOperations_Constants,
    WarRules_Utils_Instance,
    BootTimers_Constants,
    Tween_Executor,
    NormalMap_Model_NormalMapModel,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    GameModes_Constants,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Turns_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";

export interface OpenData {
    hasFog: boolean;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData>;

    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _layoutNavName!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRankMatch!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPreviewMap!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapType!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupBottomButton!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnBanMap!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitch!            : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupMapList!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _listMap!              : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForMapNameRenderer>;
    private readonly _labelNoMap!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelLoading!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _isTabInitialized = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnBanMap,      callback : this._onTouchedBtnBanMap },
            { ui : this._btnBack,        callback : this._onTouchedBtnBack },
            { ui : this._btnSwitch,      callback : this._onTouchedBtnSwitch },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listMap.setItemRendererClass(MapNameRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();
        this._updateAllPagesForTabSettings();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        await this._initGroupMapList();
        this.setAndReviseSelectedNormalMapId(-1, true);
    }
    protected override async _onClosed(): Promise<void> {
        this._isTabInitialized = false;
        await Promise.all([
            this._tabSettings.clear(),
            this._listMap.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async setAndReviseSelectedNormalMapId(normalMapId: number, needScroll: boolean): Promise<void> {
        const listMap   = this._listMap;
        const index     = listMap.getRevisedFirstIndex(v => v?.normalMapId === normalMapId);
        listMap.setSelectedItemIndex(index);

        if (needScroll) {
            listMap.scrollToItem(index);
        }
        await this._updateComponentsForTargetMapInfo();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnBanMap(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrBanMapPanel, void 0);
    }
    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrMainMenuPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
    }

    private _onTouchedBtnSwitch(): void {
        const hasFog = this.getOpenData()?.hasFog;
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrPreviewMapListPanel, { hasFog : !hasFog });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0298) },
                pageClass   : Common_View_CommonWarMapInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0002) },
                pageClass   : Common_View_CommonWarBasicSettingsPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0003) },
                pageClass   : Common_View_CommonWarAdvancedSettingsPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonMapInfoPage(),
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.setLangText(Lang_Constants.TextType.A0040);
        this._labelRankMatch.setLangText(Lang_Constants.TextType.B0404);
        this._labelPreviewMap.setLangText(Lang_Constants.TextType.B0594);
        this._labelMapType.setLangText(this.getOpenData()?.hasFog ? Lang_Constants.TextType.B0596 : Lang_Constants.TextType.B0595);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._labelNoMap.setLangText(Lang_Constants.TextType.B0582);
        this._btnBanMap.setLangText(Lang_Constants.TextType.B0084);
        this._btnSwitch.setLangText(Lang_Constants.TextType.B0520);

        this._layoutNavName.arrangeItems();
        this._groupNavigator.arrangeItems();
    }

    private async _initGroupMapList(): Promise<void> {
        const labelLoading  = this._labelLoading;
        const labelNoMap    = this._labelNoMap;
        const listMap       = this._listMap;
        labelNoMap.setIsVisible(false);

        const dataArray = await this._createDataForListMap();
        labelLoading.setIsVisible(false);
        labelNoMap.setIsVisible(!dataArray.length);
        await listMap.bindData(dataArray);
    }

    private async _updateComponentsForTargetMapInfo(): Promise<void> {
        const groupTab      = this._groupTab;
        const normalMapId   = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            groupTab.setIsVisible(false);
        } else {
            groupTab.setIsVisible(true);

            await this._updateAllPagesForTabSettings();
        }
    }

    private async _updateCommonMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, await this._createDataForCommonMapInfoPage());
        }
    }

    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, await this._createDataForCommonWarBasicSettingsPage());
        }
    }

    private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, await this._createDataForCommonWarAdvancedSettingsPage());
        }
    }

    private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
        const promiseArray: Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapRawData>>[] = [];
        for (const normalMapId of await NormalMap_Model_NormalMapModel.getEnabledNormalMapIdSet()) {
            promiseArray.push((async (): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<MapRawData>> => {
                const mapBriefData = await NormalMap_Model_NormalMapModel.getBriefData(normalMapId);
                if (mapBriefData == null) {
                    return null;
                }

                if ((mapBriefData.getNormalMapExtraData()?.getIsEnabled())  &&
                    (mapBriefData.getRuleAvailability()?.getCanMrw())
                ) {
                    return await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
                }

                return null;
            })());
        }

        const hasFog    = this.getOpenData()?.hasFog;
        const dataArray : DataForMapNameRenderer[] = [];
        for (const mapRawData of await Promise.all(promiseArray)) {
            if (mapRawData?.getTemplateWarRuleArray().some(v => {
                return (v.getRuleAvailability()?.getCanMrw()) && (hasFog === v.getWarRuleCommonData()?.getHasFogByDefault());
            })) {
                dataArray.push({
                    normalMapId : mapRawData.getNormalMapId(),
                    mapName     : Lang_Utils.getLanguageText({ textArray : mapRawData.getMapNameArray() }) || Lang_Constants.UndefinedError,
                    panel       : this,
                });
            }
        }

        return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
    }

    private async _createDataForCommonMapInfoPage(): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
        const normalMapId = this._getPreviewingNormalMapId();
        return normalMapId == null
            ? null
            : {
                mapInfo : {
                    hasFog            : !!this.getOpenData()?.hasFog,
                    mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                    gameConfig        : await GameConfigs_Provider.getLatestGameConfig(),
                    overridingPlayers : null,
                },
            };
    }

    private async _createDataForCommonWarBasicSettingsPage(): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
        const normalMapId = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            return null;
        }

        const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
        if (mapRawData == null) {
            return null;
        }

        const hasFog                = this.getOpenData()?.hasFog;
        const templateWarRuleArray  = mapRawData.getTemplateWarRuleArray().filter(v => {
            return (v.getRuleAvailability()?.getCanMrw()) && (hasFog === v.getWarRuleCommonData()?.getHasFogByDefault());
        });
        if ((templateWarRuleArray == null) || (!templateWarRuleArray.length)) {
            return null;
        }

        const instanceWarRule   = WarRules_Utils_Instance.create({
            templateWarRule           : templateWarRuleArray[0],
            warEventFullData          : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
        });
        const bootTimerParams   = BootTimers_Constants.DefaultParams.concat();
        const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
        const gameConfig        = await GameConfigs_Provider.getLatestGameConfig();
        const warEventFullData  = mapRawData.getWarEventFullData() ?? null;
        const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
            dataArrayForListSettings : [
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                    currentValue     : normalMapId,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                    currentValue     : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                    currentValue     : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                    currentValue     : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.TileTheme,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gameConfig,
                    warEventFullData : warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarEvent,
                    currentValue     : null,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                    currentValue     : `${Turns_Constants.TurnIndex.DefaultLimit}, ${WarOperations_Constants.Common.DefaultLimit}`,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.TimerType,
                    currentValue     : timerType,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : null,
                },
            ],
        };
        if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
                currentValue     : bootTimerParams[1],
                instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify : null,
            });
        } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
                    currentValue     : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify : null,
                },
            );
        } else {
            throw Helpers_Misc.newError(`Invalid timerType: ${timerType}`, Utils_ClientErrorCode.ClientErrorCode.MrrPreviewMapListPanel_CreateDataForCommonWarBasicSettingsPage_00);
        }

        return openData;
    }

    private async _createDataForCommonWarAdvancedSettingsPage(): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
        const normalMapId = this._getPreviewingNormalMapId();
        if (normalMapId == null) {
            return null;
        }

        const mapRawData            = Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId));
        const hasFog                = this.getOpenData()?.hasFog;
        const templateWarRuleArray  = mapRawData.getTemplateWarRuleArray().filter(v => {
            return (v.getRuleAvailability()?.getCanMrw()) && (hasFog === v.getWarRuleCommonData()?.getHasFogByDefault());
        });
        if ((templateWarRuleArray == null) || (!templateWarRuleArray.length)) {
            return null;
        }

        return {
            canModify       : false,
            gcData          : await GameConfigs_Provider.getLatestGameConfig(),
            instanceWarRule : WarRules_Utils_Instance.create({
                templateWarRule           : templateWarRuleArray[0],
                warEventFullData          : mapRawData.getWarEventFullData(),
                allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
                taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
            }),
            gameModeId : GameModes_Constants.ModeId.RankedMatch,
        };
    }

    private _getPreviewingNormalMapId(): number | null {
        return this._listMap.getFirstSelectedData()?.normalMapId ?? null;
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupMapList,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupBottomButton,
            beginProps : { customAlpha : 0, customX : -20 },
            endProps   : { customAlpha : 1, customX : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupMapList,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupBottomButton,
            beginProps : { customAlpha : 1, customX : 20 },
            endProps   : { customAlpha : 0, customX : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTab,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });

        await Timer_TimerModel.wait();
    }
}

interface DataForTabItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    name: string;
}
class TabItemRenderer
    extends     Ui_Components_UiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer>
    implements  Ui_Interfaces_IUiTabItemRenderer.IUiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? Lang_Constants.UndefinedError);
    }
}

interface DataForMapNameRenderer extends Ui_Types_UiListItemData.UiListItemData {
    normalMapId : number;
    mapName     : string;
    panel       : Panel;
}
class MapNameRenderer
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer>
    implements  Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForMapNameRenderer> {
    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelId!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDesigner!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setAndReviseSelectedNormalMapId(openData.normalMapId, false);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        const normalMapId = this.getOpenData()?.normalMapId;
        if (normalMapId == null) {
            return;
        }

        const mapBriefData = await NormalMap_Model_NormalMapModel.getBriefData(normalMapId);
        if ((mapBriefData == null) || (normalMapId !== this.getOpenData()?.normalMapId)) {
            return;
        }

        this._labelName.setText(Lang_Utils.getLanguageText({ textArray : mapBriefData.getMapNameArray() }) ?? Lang_Constants.UndefinedError);
        this._labelId.setText(`#${normalMapId}`);
        this._labelDesigner.setText(mapBriefData.getDesignerName() ?? Lang_Constants.UndefinedError);
        this._layoutName.arrangeItems();
    }
}
