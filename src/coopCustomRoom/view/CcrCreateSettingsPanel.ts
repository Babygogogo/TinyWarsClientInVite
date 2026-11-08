import {
    CoopCustomRoom_View_CcrCreatePlayerInfoPage,
    type CoopCustomRoom_Model_CcrRoomCreator,
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiTab,
    type Ui_Types_UiListItemData,
    Wars_Constants,
    Egret_Egret,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_GameFlow,
    GameModes_Constants,
    Helpers_Misc,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    CoopCustomRoom_Model_CcrProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    WarRules_Utils_CommonData,
    BootTimers_Constants,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
} from "../../internal.ts";

const CONFIRM_INTERVAL_MS = 5000;

export interface OpenData {
    roomCreator : CoopCustomRoom_Model_CcrRoomCreator.CcrRoomCreator;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupNavigator!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCreateRoom!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseMap!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRoomSettings!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTab!             : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!          : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, void | Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData | CoopCustomRoom_View_CcrCreatePlayerInfoPage.OpenData>;

    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;

    private _timeoutIdForBtnConfirm : number | null = null;
    private _isTabInitialized       = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnBack,        callback : this._onTouchedBtnBack },
            { ui : this._btnConfirm,     callback : this._onTouchedBtnConfirm },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",            callback : this._onNotifyLanguageChanged },
            { type : "MsgCcrCreateRoom",           callback : this._onNotifyMsgCcrCreateRoom },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });

        this._tabSettings.setBarItemRenderer(TabItemRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._initTabSettings();

        if (this.getOpenData()) {
            this._updateAllPagesForTabSettings();
        }
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateAllPagesForTabSettings();
    }
    protected override async _onClosed(): Promise<void> {
        this._clearTimeoutForBtnConfirm();

        this._isTabInitialized = false;
        await this._tabSettings.clear();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CcrCreateMapListPanel, {
            mapFilter            : null,
            mapSorter            : null,
            usePreviousFilter    : true,
            usePreviousPageIndex : true,
        });
    }
    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        if (this._timeoutIdForBtnConfirm != null) {
            FloatText.showLang(Lang_Constants.TextType.A0421);
            return;
        }

        CoopCustomRoom_Model_CcrProxy.reqCreateRoom(openData.roomCreator.generateData());
        this._resetTimeoutForBtnConfirm();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgCcrCreateRoom(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0015));
        Helpers_GameFlow.gotoLobby();
    }

    private _resetTimeoutForBtnConfirm(): void {
        this._clearTimeoutForBtnConfirm();
        this._timeoutIdForBtnConfirm = Egret_Egret.setTimeout(() => {
            this._timeoutIdForBtnConfirm = null;
        }, this, CONFIRM_INTERVAL_MS);
    }

    private _clearTimeoutForBtnConfirm(): void {
        if (this._timeoutIdForBtnConfirm != null) {
            Egret_Egret.clearTimeout(this._timeoutIdForBtnConfirm);
            this._timeoutIdForBtnConfirm = null;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for the view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelCreateRoom.setLangText(Lang_Constants.TextType.B0000);
        this._labelMultiPlayer.setLangText(Lang_Constants.TextType.B0646);
        this._labelChooseMap.setLangText(Lang_Constants.TextType.B0227);
        this._labelRoomSettings.setLangText(Lang_Constants.TextType.B0571);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);

        this._groupNavigator.arrangeItems();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
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
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0224) },
                pageClass   : CoopCustomRoom_View_CcrCreatePlayerInfoPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name : Lang_Utils.getText(Lang_Constants.TextType.B0298) },
                pageClass   : Common_View_CommonWarMapInfoPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonWarBasicSettingsPage(),
            this._updateCommonWarAdvancedSettingsPage(),
            this._updateCcrCreatePlayerInfoPage(),
            this._updateCommonWarMapInfoPage(),
        ]);
    }
    private async _updateCommonWarBasicSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, this._createDataForCommonWarBasicSettingsPage());
        }
    }
    private async _updateCommonWarAdvancedSettingsPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private async _updateCcrCreatePlayerInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, this._createDataForCcrCreatePlayerInfoPage());
        }
    }
    private async _updateCommonWarMapInfoPage(): Promise<void> {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, this._createDataForCommonMapInfoPage());
        }
    }

    private _createDataForCommonWarBasicSettingsPage(): Common_View_CommonWarBasicSettingsPage.OpenData {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        const instanceWarRule   = roomCreator.getInstanceWarRule();
        const warRuleCommonData = instanceWarRule.getWarRuleCommonData();
        if (warRuleCommonData == null) {
            return null;
        }

        const settingsForCommon = roomCreator.getSettingsForCommon();
        const bootTimerParams   = roomCreator.getBootTimerParams();
        const gcData            = roomCreator.getGcData();
        const warEventFullData  = roomCreator.getMapRawData().getWarEventFullData();
        const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
        const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
            dataArrayForListSettings : [
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                    currentValue     : roomCreator.getSettingsForCcw().getNormalMapId(),
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarName,
                    currentValue     : roomCreator.getWarName() ?? null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarName(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarPassword,
                    currentValue     : roomCreator.getWarPassword() ?? null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarPassword(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarComment,
                    currentValue     : roomCreator.getWarComment() ?? null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarComment(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : () => {
                        roomCreator.tickTemplateWarRuleId();
                        this._updateCommonWarBasicSettingsPage();
                        this._updateCommonWarAdvancedSettingsPage();
                        this._updateCcrCreatePlayerInfoPage();
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : () => {
                        warRuleCommonData.setHasFogByDefault(!warRuleCommonData.getHasFogByDefault());
                        instanceWarRule.setTemplateWarRuleId(null);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : () => {
                        WarRules_Utils_CommonData.tickDefaultWeatherType(warRuleCommonData, gcData);
                        instanceWarRule.setTemplateWarRuleId(null);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.TileTheme,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : newValue => {
                        if (typeof newValue === "string") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }

                        if (warRuleCommonData.getFixedTileTheme() !== newValue) {
                            warRuleCommonData.setFixedTileTheme(newValue);
                            instanceWarRule.setTemplateWarRuleId(null);
                            this._updateCommonWarBasicSettingsPage();
                        }
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.WarEvent,
                    currentValue     : null,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : null,
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                    currentValue     : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : (newValue: string | number | null) => {
                        if (typeof newValue !== "string") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }

                        const stringArray = newValue.split(`,`);
                        settingsForCommon.setTurnsLimit(parseInt(stringArray[0]));
                        settingsForCommon.setWarOperationsLimit(parseInt(stringArray[1]));
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.TimerType,
                    currentValue     : timerType,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : async () => {
                        roomCreator.tickBootTimerType();
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            ],
        };
        if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
                currentValue     : bootTimerParams[1],
                instanceWarRule  : instanceWarRule,
                gameConfig       : gcData,
                warEventFullData : warEventFullData,
                callbackOnModify : () => {
                    roomCreator.tickTimerRegularTime();
                    this._updateCommonWarBasicSettingsPage();
                },
            });
        } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType     : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
                    currentValue     : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule  : instanceWarRule,
                    gameConfig       : gcData,
                    warEventFullData : warEventFullData,
                    callbackOnModify : (newValue: number | string | null) => {
                        if (typeof newValue !== "string") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }

                        roomCreator.setBootTimerParams([BootTimers_Constants.TimerTypeId.Incremental, ...newValue.split(`,`).map(v => parseInt(v))]);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            );
        } else {
            throw Helpers_Misc.newError(`CcrCreateSettingsPanel._createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openData;
    }
    private _createDataForCommonWarAdvancedSettingsPage(): Common_View_CommonWarAdvancedSettingsPage.OpenData {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            canModify       : true,
            instanceWarRule : roomCreator.getInstanceWarRule(),
            gameModeId      : GameModes_Constants.ModeId.Coop,
            gcData          : roomCreator.getGcData(),
        };
    }
    private _createDataForCcrCreatePlayerInfoPage(): CoopCustomRoom_View_CcrCreatePlayerInfoPage.OpenData {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            roomCreator : roomCreator,
        };
    }
    private _createDataForCommonMapInfoPage(): Common_View_CommonWarMapInfoPage.OpenData {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            mapInfo : {
                gameConfig        : roomCreator.getGcData(),
                hasFog            : !!roomCreator.getInstanceWarRule().getWarRuleCommonData()?.getHasFogByDefault(),
                mapRawData        : roomCreator.getMapRawData(),
                overridingPlayers : null,
            },
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 0, customY : -20 },
            endProps   : { customAlpha : 1, customY : 20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnConfirm,
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
            obj        : this._groupNavigator,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnBack,
            beginProps : { customAlpha : 1, customY : 20 },
            endProps   : { customAlpha : 0, customY : -20 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnConfirm,
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
class TabItemRenderer extends Ui_Components_UiTabItemRenderer.UiTabItemRenderer<DataForTabItemRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? Lang_Constants.UndefinedError);
    }
}
