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
    MultiFreeRoom_View_MfrCreatePlayerInfoPage,
    type MultiFreeRoom_Model_MfrRoomCreator,
    type Ui_Types_UiListItemData,
    Players_Constants,
    Wars_Constants,
    Egret_Egret,
    Notifications_Dispatcher,
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
    Sounds_SoundPlayer,
    MultiFreeRoom_Model_MfrProxy,
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
    roomCreator : MultiFreeRoom_Model_MfrRoomCreator.MfrRoomCreator;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupNavigator!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelFreeMode!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCreateRoom!          : Ui_Interfaces_IUiLabel.IUiLabel;
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
    private readonly _tabSettings!              : Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, void | Common_View_CommonWarMapInfoPage.OpenData | Common_View_CommonWarBasicSettingsPage.OpenData | Common_View_CommonWarAdvancedSettingsPage.OpenData | MultiFreeRoom_View_MfrCreatePlayerInfoPage.OpenData>;

    private readonly _btnBack!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!               : Ui_Interfaces_IUiButton.IUiButton;

    private _timeoutIdForBtnConfirm : number | null = null;
    private _isTabInitialized       = false;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnBack,                callback: this._onTouchedBtnBack },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
            { ui: this._btnChooseCo,            callback: this._onTouchedBtnChooseCo },
            { ui: this._btnChoosePlayerIndex,   callback: this._onTouchedBtnChoosePlayerIndex },
            { ui: this._btnChooseSkinId,        callback: this._onTouchedBtnChooseSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.RoomCreator_SelfCoIdChanged,     callback: this._onNotifyMfrCreateSelfCoIdChanged },
            { type: Notifications_TypeId.TypeId.RoomCreator_SelfSkinIdChanged,   callback: this._onNotifyMfrCreateSelfSkinIdChanged },
            { type: Notifications_TypeId.TypeId.MsgMfrCreateRoom,                callback: this._onNotifyMsgMfrCreateRoom },
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
            await this._updateAllPagesForTabSettings();
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
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MfrMainMenuPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyTopPanel, void 0);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().LobbyBottomPanel, void 0);
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

        MultiFreeRoom_Model_MfrProxy.reqCreateRoom(openData.roomCreator.generateData());
        this._resetTimeoutForBtnConfirm();
    }
    private async _onTouchedBtnChooseCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator       = openData.roomCreator;
        const currentCoId       = roomCreator.getSelfCoId();
        const warRuleCommonData = Helpers_Misc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const gameConfig        = roomCreator.getGcData();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoId         : currentCoId,
            availableCoIdArray  : [...PlayerRules_Utils.getFinalMfwHumanCoIdSet({
                playerRule      : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, roomCreator.getSelfPlayerIndex()),
                gameConfig      : gameConfig,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : true,
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

        const roomCreator   = openData.roomCreator;
        const gameConfig    = roomCreator.getGcData();
        if (gameConfig == null) {
            return;
        }

        const warRuleCommonData         = Helpers_Misc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const playersCountUnneutral     = WarRules_Utils_CommonData.getPlayersCountUnneutral(warRuleCommonData);
        const playerDataArray           = roomCreator.getInitialWarData().getPlayerManager()?.getPlayers() ?? [];
        const availablePlayerIndexArray : number[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
            const playerData = playerDataArray.find(v => (v.getPlayerIndex()) === playerIndex);
            if ((playerData != null)                                                            &&
                (playerData.getUserId() != null)                                                &&
                ((playerData.getAliveState()) !== Players_Constants.AliveStateId.Dead)
            ) {
                availablePlayerIndexArray.push(playerIndex);
            }
        }

        const oldPlayerIndex = roomCreator.getSelfPlayerIndex();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : oldPlayerIndex,
            availableNumberArray    : availablePlayerIndexArray,
            getTitleText            : () => Lang_Utils.getText(Lang_Constants.TextType.B0168),
            getNumberMainText       : playerIndex => `P${playerIndex}, ${Lang_Utils.getPlayerTeamName(WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex()) ?? Lang_Constants.UndefinedError}`,
            callbackOnConfirm       : targetPlayerIndex => {
                if (oldPlayerIndex === targetPlayerIndex) {
                    return;
                }
                roomCreator.setSelfPlayerIndex(targetPlayerIndex);

                const targetPlayer = Helpers_Misc.getExisted(playerDataArray.find(v => (v.getPlayerIndex() === targetPlayerIndex)));
                playerDataArray.find(v => v.getPlayerIndex() === oldPlayerIndex)?.setUnitAndTileSkinId(targetPlayer.getUnitAndTileSkinId());
                targetPlayer.setUnitAndTileSkinId(roomCreator.getSelfUnitAndTileSkinId());

                this._updateLabelPlayerIndex();
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MfrCreatePlayerSkinIdChanged);

                const availableCoIdSet = PlayerRules_Utils.getFinalMfwHumanCoIdSet({
                    playerRule      : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, targetPlayerIndex),
                    gameConfig      : gameConfig,
                    hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                    includeRandom   : true,
                });
                if (!availableCoIdSet.has(roomCreator.getSelfCoId())) {
                    roomCreator.setSelfCoId(Cos_Utils.pickRandomCo([...availableCoIdSet]));
                }
            },
        });
    }
    private _onTouchedBtnChooseSkinId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const oldSkinId     = roomCreator.getSelfUnitAndTileSkinId();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleSkinIdPanel, {
            currentSkinId           : oldSkinId,
            availableSkinIdArray    : ForceSkins_Utils.getAllSkinIdArray(false),
            callback                : newSkinId => {
                if (oldSkinId === newSkinId) {
                    return;
                }

                const players           = roomCreator.getInitialWarData().getPlayerManager()?.getPlayers() ?? [];
                const existingPlayer    = players.find(v => v.getUnitAndTileSkinId() === newSkinId);
                players.find(v => v.getUnitAndTileSkinId() === oldSkinId)?.setUnitAndTileSkinId(newSkinId);
                existingPlayer?.setUnitAndTileSkinId(oldSkinId);
                roomCreator.setSelfUnitAndTileSkinId(newSkinId);

                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MfrCreatePlayerSkinIdChanged);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMfrCreateSelfCoIdChanged(): void {
        this._updateImgCo();
    }
    private _onNotifyMfrCreateSelfSkinIdChanged(): void {
        this._updateImgSkinId();
    }
    private _onNotifyMsgMfrCreateRoom(): void {
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
        this._labelFreeMode.setLangText(Lang_Constants.TextType.B0557);
        this._labelCreateRoom.setLangText(Lang_Constants.TextType.B0000);
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
                tabItemData : { name: Lang_Utils.getText(Lang_Constants.TextType.B0224) },
                pageClass   : MultiFreeRoom_View_MfrCreatePlayerInfoPage.Page,
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
            this._updateCommonWarAdvancedSettingsPage(),
            this._updateMfrCreatePlayerInfoPage(),
            this._updateCommonWarMapInfoPage(),
        ]);
    }
    private _updateCommonWarBasicSettingsPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(0, this._createDataForCommonWarBasicSettingsPage());
        }
    }
    private _updateCommonWarAdvancedSettingsPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(1, this._createDataForCommonWarAdvancedSettingsPage());
        }
    }
    private _updateMfrCreatePlayerInfoPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(2, this._createDataForMfrCreatePlayerInfoPage());
        }
    }
    private _updateCommonWarMapInfoPage(): void {
        if (this._isTabInitialized) {
            this._tabSettings.updatePageData(3, this._createDataForCommonWarMapInfoPage());
        }
    }

    private _createDataForCommonWarBasicSettingsPage(): Common_View_CommonWarBasicSettingsPage.OpenData {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const roomCreator       = openData.roomCreator;
        const instanceWarRule   = roomCreator.getInstanceWarRule();
        const bootTimerParams   = roomCreator.getBootTimerParams();
        const settingsForCommon = roomCreator.getSettingsForCommon();
        const gameConfig        = roomCreator.getGcData();
        const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
        const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
        const warRuleCommonData = Helpers_Misc.getExisted(instanceWarRule.getWarRuleCommonData());
        const openDataForPage   : Common_View_CommonWarBasicSettingsPage.OpenData = {
            dataArrayForListSettings: [
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.WarName,
                    currentValue    : roomCreator.getWarName() ?? null,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarName(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.WarPassword,
                    currentValue    : roomCreator.getWarPassword() ?? null,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarPassword(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.WarComment,
                    currentValue    : roomCreator.getWarComment() ?? null,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: (newValue: string | number | null) => {
                        if (typeof newValue === "number") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }
                        roomCreator.setWarComment(newValue);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType        : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : null,
                },
                {
                    settingsType        : Wars_Constants.BasicSettingsTypeId.HasFog,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : () => {
                        const data = instanceWarRule.createIfNotExistsWarRuleCommonData();
                        data.setHasFogByDefault(!data.getHasFogByDefault());
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType        : Wars_Constants.BasicSettingsTypeId.Weather,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : () => {
                        WarRules_Utils_CommonData.tickDefaultWeatherType(warRuleCommonData, gameConfig);
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
                {
                    settingsType        : Wars_Constants.BasicSettingsTypeId.TileTheme,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : newValue => {
                        if (typeof newValue === "string") {
                            throw Helpers_Misc.newError(`Invalid newValue: ${newValue}`);
                        }

                        const data = instanceWarRule.createIfNotExistsWarRuleCommonData();
                        if (data.getFixedTileTheme() !== newValue) {
                            data.setFixedTileTheme(newValue);
                            this._updateCommonWarBasicSettingsPage();
                        }
                    },
                },
                {
                    settingsType        : Wars_Constants.BasicSettingsTypeId.WarEvent,
                    currentValue        : null,
                    instanceWarRule     : instanceWarRule,
                    gameConfig          : gameConfig,
                    warEventFullData    : warEventFullData,
                    callbackOnModify    : null,
                },
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                    currentValue    : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
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
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
                    callbackOnModify: async () => {
                        roomCreator.tickBootTimerType();
                        this._updateCommonWarBasicSettingsPage();
                    },
                },
            ],
        };
        if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
            openDataForPage.dataArrayForListSettings.push({
                settingsType    : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
                currentValue    : bootTimerParams[1],
                instanceWarRule: instanceWarRule,
                gameConfig,
                warEventFullData,
                callbackOnModify: () => {
                    roomCreator.tickTimerRegularTime();
                    this._updateCommonWarBasicSettingsPage();
                },
            });
        } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
            openDataForPage.dataArrayForListSettings.push(
                {
                    settingsType    : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
                    currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                    instanceWarRule: instanceWarRule,
                    gameConfig,
                    warEventFullData,
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
            throw Helpers_Misc.newError(`MfrCreateSettingsPanel._createDataForCommonWarBasicSettingsPage() invalid timerType.`);
        }

        return openDataForPage;
    }
    private _createDataForCommonWarAdvancedSettingsPage(): Common_View_CommonWarAdvancedSettingsPage.OpenData {
        const roomCreator = this.getOpenData()?.roomCreator;
        if (roomCreator == null) {
            return null;
        }

        return {
            canModify       : true,
            instanceWarRule : roomCreator.getInstanceWarRule(),
            gameModeId      : GameModes_Constants.ModeId.Free,
            gcData          : roomCreator.getGcData(),
        };
    }
    private _createDataForMfrCreatePlayerInfoPage(): MultiFreeRoom_View_MfrCreatePlayerInfoPage.OpenData {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        return {
            roomCreator   : openData.roomCreator,
        };
    }
    private _createDataForCommonWarMapInfoPage(): Common_View_CommonWarMapInfoPage.OpenData {
        const openData = this.getOpenData();
        if (openData == null) {
            return null;
        }

        const roomCreator   = openData.roomCreator;
        const warData       = roomCreator.getInitialWarData();
        return warData == null
            ? null
            : {
                warInfo     : {
                    warData             : warData,
                    showInitialWarData  : false,
                    overridingPlayers   : null,
                },
            };
    }

    private async _updateImgCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator   = openData.roomCreator;
        const gameConfig    = roomCreator.getGcData();
        const coId          = roomCreator.getSelfCoId();
        this._imgCo.loadSource(((gameConfig == null) || (coId == null))
            ? ``
            : Helpers_ImageSource.getCoEye(gameConfig, coId, true) ?? ``
        );
    }

    private _updateLabelPlayerIndex(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator       = openData.roomCreator;
        const playerIndex       = roomCreator.getSelfPlayerIndex();
        const warRuleCommonData = Helpers_Misc.getExisted(roomCreator.getInstanceWarRule().getWarRuleCommonData());
        const teamIndex         = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex();
        this._labelPlayerIndex.setText(`P${playerIndex}${`\n`}${Lang_Utils.getPlayerTeamName(teamIndex) ?? Lang_Constants.UndefinedError}`);
    }

    private _updateImgSkinId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const roomCreator = openData.roomCreator;
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
