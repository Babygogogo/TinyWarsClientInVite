import {
    Helpers_Misc,
    AutoTourneys_Rooms_Provider,
    Lobby_Model_LobbyModel,
    MultiPlayerWar_Model_MpwModel,
    AutoTourneys_Mains_Provider,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    GameModes_Constants,
    AutoTourneys_Constants,
    FloatText,
    Lang_Constants,
    Graphics_Constants,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnMultiPlayer!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRanking!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSinglePlayer!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupLeft!            : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _groupMode!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnMode!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutMode!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMode1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMode2!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupRegister!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnRegister!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutRegister!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelRegister1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRegister2!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupMyRoom!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnMyRoom!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutMyRoom!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMyRoom1!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMyRoom2!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupContinueWar!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnContinueWar!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutContinueWar!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelContinueWar1!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelContinueWar2!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupPreviewMaps!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnPreviewMaps!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutPreviewMaps!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPreviewMaps1!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPreviewMaps2!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupTourneyInfo!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnTourneyInfo!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutTourneyInfo!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTourneyInfo1!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTourneyInfo2!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnRanking,         callback : this._onTouchedBtnRanking },
            { ui : this._btnSinglePlayer,    callback : this._onTouchedBtnSinglePlayer },
            { ui : this._btnRegister,        callback : this._onTouchedBtnRegister },
            { ui : this._btnMyRoom,          callback : this._onTouchedBtnMyRoom },
            { ui : this._btnContinueWar,     callback : this._onTouchedBtnContinueWar },
            { ui : this._btnPreviewMaps,     callback : this._onTouchedBtnPreviewMaps },
            { ui : this._btnTourneyInfo,     callback : this._onTouchedBtnTourneyInfo },
            { ui : this._btnMode,            callback : this._onTouchedBtnMode },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "MsgUserLogout",                       callback : this._onNotifyMsgUserLogout },
            { type : "MsgAtrGetRoomPublicInfo",             callback : this._onNotifyMsgAtrGetRoomPublicInfo },
            { type : "MsgAtrGetJoinedRoomIdArray",          callback : this._onNotifyMsgAtrGetJoinedRoomIdArray },
            { type : "MsgMcrGetRoomPlayerInfo",             callback : this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type : "MsgMfrGetRoomPlayerInfo",             callback : this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type : "MsgCcrGetRoomPlayerInfo",             callback : this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type : "MsgMpwCommonGetWarProgressInfo",      callback : this._onNotifyMsgMpwCommonGetWarProgressInfo },
            { type : "MsgMpwWatchGetRequestedWarIdArray",   callback : this._onNotifyMsgMpwWatchGetRequestedWarIdArray },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnRanking(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrMainMenuPanel, void 0);
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmMainMenuPanel, void 0);
    }
    private async _onTouchedBtnRegister(): Promise<void> {
        const tourneyIdArray = (await AutoTourneys_Mains_Provider.getSinglePhaseInfoArrayForPhase(AutoTourneys_Constants.PhaseId.Registration))?.map(v => v.getTourneyId());
        if (tourneyIdArray.length <= 0) {
            FloatText.showLang(Lang_Constants.TextType.A0403);
        } else {
            for (const tourneyId of tourneyIdArray) {
                AutoTourneys_Mains_Provider.setIsNotifiedForRegistration(tourneyId, true);
            }

            this._updateBtnRegister();
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtRegisterPanel, void 0);
        }
    }
    private _onTouchedBtnMyRoom(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyRoomListPanel, void 0);
    }
    private _onTouchedBtnContinueWar(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwMyWarListPanel, void 0);
    }
    private async _onTouchedBtnPreviewMaps(): Promise<void> {
        const tourneyIdArray = (await AutoTourneys_Mains_Provider.getAtPhaseInfo())?.infoArray.map(v => v.getTourneyId()) ?? [];
        if (tourneyIdArray.length <= 0) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
            return;
        }

        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtrPreviewMapListPanel, { tourneyId : Math.max(...tourneyIdArray) });
    }
    private async _onTouchedBtnTourneyInfo(): Promise<void> {
        if ((await AutoTourneys_Mains_Provider.getLastTourneyId()) == null) {
            FloatText.showLang(Lang_Constants.TextType.B0278);
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().AtTourneyInfoPanel, void 0);
        }
    }
    private _onTouchedBtnMode(): void {
        Lobby_Model_LobbyModel.openMultiPlayerModePanel(GameModes_Constants.ModeId.AutoTourney);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserLogout(): void {
        this.closePanel();
    }
    private _onNotifyMsgAtrGetRoomPublicInfo(): void {
        this._updateComponentsForRed();
    }
    private _onNotifyMsgAtrGetJoinedRoomIdArray(): void {
        this._updateComponentsForRed();
    }
    private _onNotifyMsgMcrGetRoomPlayerInfo(): void {
        this._updateBtnMultiPlayer();
    }
    private _onNotifyMsgMfrGetRoomPlayerInfo(): void {
        this._updateBtnMultiPlayer();
    }
    private _onNotifyMsgCcrGetRoomPlayerInfo(): void {
        this._updateBtnMultiPlayer();
    }
    private _onNotifyMsgMpwCommonGetWarProgressInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnContinueWar();
    }
    private _onNotifyMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnMultiPlayer();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForRed();
    }

    private _updateComponentsForLanguage(): void {
        const languageType2 = Lang_Utils.getSecondaryLanguageType();
        this._labelMode1.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1378)}\n${Lang_Utils.getText(Lang_Constants.TextType.B1379)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1022)}`);
        this._labelMode2.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1378, languageType2)}\n${Lang_Utils.getText(Lang_Constants.TextType.B1379, languageType2)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1022, languageType2)}`);
        this._labelRegister1.setLangText(Lang_Constants.TextType.B1380);
        this._labelRegister2.setLangText(Lang_Constants.TextType.B1380, languageType2);
        this._labelMyRoom1.setLangText(Lang_Constants.TextType.B0410);
        this._labelMyRoom2.setLangText(Lang_Constants.TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(Lang_Constants.TextType.B0024);
        this._labelContinueWar2.setLangText(Lang_Constants.TextType.B0024, languageType2);
        this._labelPreviewMaps1.setLangText(Lang_Constants.TextType.B0594);
        this._labelPreviewMaps2.setLangText(Lang_Constants.TextType.B0594, languageType2);
        this._labelTourneyInfo1.setLangText(Lang_Constants.TextType.B1381);
        this._labelTourneyInfo2.setLangText(Lang_Constants.TextType.B1381, languageType2);

        this._layoutMode.arrangeItems();
        this._layoutRegister.arrangeItems();
        this._layoutMyRoom.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutPreviewMaps.arrangeItems();
        this._layoutTourneyInfo.arrangeItems();
    }

    private _updateComponentsForRed(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnContinueWar();
        this._updateBtnMyRoom();
        this._updateBtnRegister();
        this._updateBtnMode();
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await Lobby_Model_LobbyModel.checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(await Lobby_Model_LobbyModel.checkIsRedForRankedMode());
    }

    private async _updateBtnContinueWar(): Promise<void> {
        this._btnContinueWar.setRedVisible(await MultiPlayerWar_Model_MpwModel.checkIsRedForMyAtwWars());
    }

    private async _updateBtnMyRoom(): Promise<void> {
        this._btnMyRoom.setRedVisible(await AutoTourneys_Rooms_Provider.checkIsRed());
    }

    private async _updateBtnRegister(): Promise<void> {
        this._btnRegister.setRedVisible(await AutoTourneys_Mains_Provider.checkIsRedForRegistration());
    }

    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await Helpers_Misc.checkIsAnyPromiseTrue([
            Lobby_Model_LobbyModel.checkIsRedForMultiCoopMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiFreeMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiCustomMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiMatchMode(),
        ]));
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._btnMultiPlayer,
            beginProps : { customAlpha : 0, customX : 40 },
            endProps   : { customAlpha : 1, customX : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnRanking,
            beginProps : { customAlpha : 0, customX : 40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 100,
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnSinglePlayer,
            beginProps : { customAlpha : 0, customX : 40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200,
        });

        Tween_Executor.Executor.reset({
            obj        : this._groupMode,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 5 * 0,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupRegister,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 5 * 1,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupMyRoom,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 5 * 2,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupContinueWar,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 5 * 3,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupPreviewMaps,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 5 * 4,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTourneyInfo,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 5 * 5,
        });

        await Timer_TimerModel.wait(200 + Graphics_Constants.Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._btnMultiPlayer,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : 40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnRanking,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : 40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._btnSinglePlayer,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : 40 },
        });

        Tween_Executor.Executor.reset({
            obj        : this._groupMode,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupRegister,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupMyRoom,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupContinueWar,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupPreviewMaps,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupTourneyInfo,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });

        await Timer_TimerModel.wait();
    }
}
