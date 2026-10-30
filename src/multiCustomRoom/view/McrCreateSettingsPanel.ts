import {
    Common_View_CommonWarAdvancedSettingsPage,
    Common_View_CommonWarBasicSettingsPage,
    Common_View_CommonWarMapInfoPage,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiTab,
    type MultiCustomRoom_Model_McrRoomCreator,
    type Ui_Types_UiListItemData,
    Wars_Constants,
    Egret_Egret,
    Helpers_Collection,
    Tween_Executor,
    ForceSkins_Utils,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    PlayerRules_Utils,
    WarRules_Utils_CommonData,
    Lang_Utils,
    Helpers_GameFlow,
    GameModes_Constants,
    GamePanels_Manager,
    Cos_Utils,
    Players_Constants,
    Sounds_SoundPlayer,
    MultiCustomRoom_Model_McrProxy,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    BootTimers_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Ui_Components_UiTabItemRenderer,
    Timer_TimerModel,
} from "../../internal.ts";

const CONFIRM_INTERVAL_MS = 5000;

export interface OpenData {
    roomCreator : MultiCustomRoom_Model_McrRoomCreator.McrRoomCreator;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupNavigator!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMultiPlayer!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCreateRoom!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelChooseMap!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRoomSettings!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupSettings!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupChooseCo!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChooseCo!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgCo!                    : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupChoosePlayerIndex!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChoosePlayerIndex!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelPlayerIndex!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupChooseSkinId!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnChooseSkinId!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgSkinId!                : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupTab!                 : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _tabSettings!              : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, void | Common_View_CommonWarBasicSettingsPage.OpenData | Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData>;

    private readonly _btnBack!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!               : Ui_Interfaces_IUiButton.IUiButton;

    private _timeoutIdForBtnConfirm             : number | null = null;
    private _isTabInitialized                   = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,                callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
            { ui: this._btnChooseCo,            callback: this._onTouchedBtnChooseCo },
            { ui: this._btnChoosePlayerIndex,   callback: this._onTouchedBtnChoosePlayerIndex },
            { ui: this._btnChooseSkinId,        callback: this._onTouchedBtnChooseSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.RoomCreator_SelfCoIdChanged,   callback: this._onNotifyMcrCreateSelfCoIdChanged },
            { type: Notifications_TypeId.TypeId.MsgMcrCreateRoom,           callback: this._onNotifyMsgMcrCreateRoom },
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
        this._updateImgCo();
        this._updateLabelPlayerIndex();
        this._updateImgSkinId();
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
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

        MultiCustomRoom_Model_McrProxy.reqCreateRoom(openData.roomCreator.generateData());
        this._resetTimeoutForBtnConfirm();
    }
    private _onTouchedBtnChooseCo(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator       = openData.roomCreator;
        const currentCoId       = roomCreator.getSelfCoId();
        const gameConfig        = roomCreator.getGcData();
        const warRuleCommonData = Helpers_Misc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...PlayerRules_Utils.getFinalMcwHumanCoIdSet({
                playerRule          : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, roomCreator.getSelfPlayerIndex()),
                gameConfiguration   : gameConfig,
                hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                includeRandom       : true,
            })],
            isBan               : false,
            callbackOnConfirm   : newCoId => {
                if (newCoId !== currentCoId) {
                    roomCreator.setSelfCoId(newCoId);
                }
            },
        });
    }
    private async _onTouchedBtnChoosePlayerIndex(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator           = openData.roomCreator;
        const playersCountUnneutral = (await roomCreator.getMapRawData()).getPlayersCountUnneutral();
        if (playersCountUnneutral == null) {
            return;
        }

        const warRuleCommonData = Helpers_Misc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : roomCreator.getSelfPlayerIndex(),
            availableNumberArray    : Helpers_Collection.createRange(Players_Constants.PlayerIndex.First, playersCountUnneutral + 1, 1),
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0168),
            getNumberMainText       : playerIndex => `P${playerIndex}, ${Lang_Utils.getPlayerTeamName(WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) ?? Lang_Constants.UndefinedError}`,
            callbackOnConfirm       : playerIndex => {
                roomCreator.setSelfPlayerIndex(playerIndex);
                this._updateLabelPlayerIndex();

                const availableCoIdArray = [...PlayerRules_Utils.getFinalMcwHumanCoIdSet({
                    playerRule          : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfiguration   : roomCreator.getGcData(),
                    hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                    includeRandom       : true,
                })];
                if (availableCoIdArray.indexOf(roomCreator.getSelfCoId()) < 0) {
                    roomCreator.setSelfCoId(Cos_Utils.pickRandomCo(availableCoIdArray));
                }
            },
        });
    }
    private _onTouchedBtnChooseSkinId(): void {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId           : roomCreator.getSelfUnitAndTileSkinId(),
            availableSkinIdArray    : ForceSkins_Utils.getAllSkinIdArray(false),
            callback                : skinId => {
                roomCreator.setSelfUnitAndTileSkinId(skinId);
                this._updateImgSkinId();
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMcrCreateSelfCoIdChanged(): void {
        this._updateImgCo();
    }
    private _onNotifyMsgMcrCreateRoom(): void {
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
        this._labelMultiPlayer.setLangText(Lang_Constants.TextType.B1011);
        this._labelChooseMap.setLangText(Lang_Constants.TextType.B0227);
        this._labelRoomSettings.setLangText(Lang_Constants.TextType.B0571);
        this._btnChooseCo.setLangText(Lang_Constants.TextType.B0425);
        this._btnChoosePlayerIndex.setLangText(Lang_Constants.TextType.B0168);
        this._btnChooseSkinId.setLangText(Lang_Constants.TextType.B0397);
        this._btnBack.setLangText(Lang_Constants.TextType.B0146);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);

        this._groupNavigator.arrangeItems();

        this._updateLabelPlayerIndex();
    }

    private async _initTabSettings(): Promise<void> {
        this._isTabInitialized = false;
        await this._tabSettings.bindData([
            {
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0002) },
                pageClass   : Common_View_CommonWarBasicSettingsPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0003) },
                pageClass   : Common_View_CommonWarAdvancedSettingsPage.Page,
                pageData    : null,
            },
            {
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0298) },
                pageClass   : Common_View_CommonWarMapInfoPage.Page,
                pageData    : null,
            },
        ]);
        this._isTabInitialized = true;
    }
    private async _updateAllPagesForTabSettings(): Promise<void> {
        await Promise.all([
            this._updateCommonWarBasicSettingsPage(),
            this._updateMcrCreateAdvancedSettingsPage(),
            this._updateCommonWarMapInfoPage(),
        ]);
    }
    private _updateCommonWarBasicSettingsPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, this._createDataForCommonWarBasicSettingsPage());
        }
    }
    private _updateMcrCreateAdvancedSettingsPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private _updateCommonWarMapInfoPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, this._createDataForCommonMapInfoPage());
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

        const bootTimerParams       = roomCreator.getBootTimerParams();
        const settingsForCommon     = roomCreator.getSettingsForCommon();
        const gcData                = roomCreator.getGcData();
        const warEventFullData      = roomCreator.getMapRawData().getWarEventFullData() ?? null;
        const timerType             = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
        const openData              : Common_View_CommonWarBasicSettingsPage.OpenData = {
            dataArrayForListSettings: [
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                    currentValue    : roomCreator.getSettingsForMcw().getNormalMapId(),
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.WarName,
                    currentValue    : roomCreator.getWarName() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue == "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarName(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.WarPassword,
                    currentValue    : roomCreator.getWarPassword() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue == "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarPassword(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.WarComment,
                    currentValue    : roomCreator.getWarComment() ?? null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue == "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarComment(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: async () => {
                        await roomCreator.tickTemplateWarRuleId();
                        this._updateCommonWarBasicSettingsPage();
                        this._updateMcrCreateAdvancedSettingsPage();
                    },
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.HasFog,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: () => {
                        warRuleCommonData.setHasFogByDefault(!warRuleCommonData.getHasFogByDefault());
                        instanceWarRule.setTemplateWarRuleId(null);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.Weather,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: () => {
                        WarRules_Utils_CommonData.tickDefaultWeatherType(warRuleCommonData, gcData);
                        instanceWarRule.setTemplateWarRuleId(null);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType        : Wars_Constants.BasicSettingsTypeId.TileTheme,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gcData,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : newValue => {
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
                    settingsType    : Wars_Constants.BasicSettingsTypeId.WarEvent,
                    currentValue    : null,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: null,
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                    currentValue    : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
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
                    settingsType    : Wars_Constants.BasicSettingsTypeId.TimerType,
                    currentValue    : timerType,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: async () => {
                        roomCreator.tickBootTimerType();
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            ],
        };
        if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
            openData.dataArrayForListSettings.push({
                settingsType    : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule : instanceWarRule,
                gameConfig      : gcData,
                warEventFullData: warEventFullData,
                callbackOnModify: () => {
                    roomCreator.tickTimerRegularTime();
                    this._updateCommonWarBasicSettingsPage();
                },
            });
        } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
            openData.dataArrayForListSettings.push(
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
                    currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule : instanceWarRule,
                    gameConfig      : gcData,
                    warEventFullData: warEventFullData,
                    callbackOnModify: (newValue: number | string | null) => {
                        if (typeof newValue !== "string") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }

                        roomCreator.setBootTimerParams([BootTimers_Constants.TimerTypeId.Incremental, ...newValue.split(`,`).map(v => parseInt(v))]);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            );
        } else {
            throw Helpers_Misc.newError(`Invalid timerType: ${timerType}`);
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
            gameModeId      : GameModes_Constants.ModeId.Versus,
            gcData          : roomCreator.getGcData(),
        };
    }
    private _createDataForCommonMapInfoPage(): Common_View_CommonWarMapInfoPage.OpenData {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            mapInfo : {
                gameConfig          : roomCreator.getGcData(),
                hasFog              : !!roomCreator.getInstanceWarRule().getWarRuleCommonData()?.getHasFogByDefault(),
                mapRawData          : roomCreator.getMapRawData(),
                overridingPlayers   : null,
            },
        };
    }

    private async _updateImgCo(): Promise<void> {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        const gameConfig    = roomCreator.getGcData();
        const coId          = roomCreator.getSelfCoId();
        this._imgCo.loadSource(((gameConfig == null) || (coId == null))
            ? ``
            : Helpers_ImageSource.getCoEye(gameConfig, coId, true) ?? ``
        );
    }

    private _updateLabelPlayerIndex(): void {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        const playerIndex       = roomCreator.getSelfPlayerIndex();
        const warRuleCommonData = Helpers_Misc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const teamIndex         = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        this._labelPlayerIndex.setText(`P${playerIndex}${`\n`}${Lang_Utils.getPlayerTeamName(teamIndex) ?? Lang_Constants.UndefinedError}`);
    }

    private _updateImgSkinId(): void {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return;
        }

        this._imgSkinId.loadSource(Helpers_ImageSource.getSkinCircle(roomCreator.getSelfUnitAndTileSkinId(), true));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Opening/closing animations.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 0, customY: -20 },
            endProps    : { customAlpha: 1, customY: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnConfirm,
            beginProps  : { customAlpha: 0, customX: -20 },
            endProps    : { customAlpha: 1, customX: 20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 0, },
            endProps    : { customAlpha: 1, },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._groupNavigator,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnBack,
            beginProps  : { customAlpha: 1, customY: 20 },
            endProps    : { customAlpha: 0, customY: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupSettings,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnConfirm,
            beginProps  : { customAlpha: 1, customX: 20 },
            endProps    : { customAlpha: 0, customX: -20 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupTab,
            beginProps  : { customAlpha: 1, },
            endProps    : { customAlpha: 0, },
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
