import {
    Helpers_Misc,
    MultiRankRoom_Model_MrrModel,
    Lobby_Model_LobbyModel,
    MultiPlayerWar_Model_MpwModel,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    GameModes_Constants,
    FloatText,
    Lang_Constants,
    Graphics_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

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

    private readonly _groupSetGameNumber!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSetGameNumber!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutSetGameNumber!  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSetGameNumber1!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSetGameNumber2!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupBanMap!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnBanMap!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutBanMap!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelBanMap1!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelBanMap2!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupSetTimer!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSetTimer!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutSetTimer!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelSetTimer1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelSetTimer2!       : Ui_Interfaces_IUiLabel.IUiLabel;

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

    private readonly _groupPreviewStdMaps!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnPreviewStdMaps!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutPreviewStdMaps! : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelPreviewStdMaps1! : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelPreviewStdMaps2! : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnMultiPlayer,     callback : this._onTouchedBtnMultiPlayer },
            { ui : this._btnSinglePlayer,    callback : this._onTouchedBtnSinglePlayer },
            { ui : this._btnSetGameNumber,   callback : this._onTouchedBtnSetGameNumber },
            { ui : this._btnBanMap,          callback : this._onTouchedBtnBanMap },
            { ui : this._btnSetTimer,        callback : this._onTouchedBtnSetTimer },
            { ui : this._btnMyRoom,          callback : this._onTouchedBtnMyRoom },
            { ui : this._btnContinueWar,     callback : this._onTouchedBtnContinueWar },
            { ui : this._btnPreviewStdMaps,  callback : this._onTouchedBtnPreviewStdMaps },
            { ui : this._btnMode,            callback : this._onTouchedBtnMode },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserLogout,                       callback : this._onMsgUserLogout },
            { type : Notifications_TypeId.TypeId.MsgMrrGetRoomPublicInfo,             callback : this._onMsgMrrGetRoomPublicInfo },
            { type : Notifications_TypeId.TypeId.MsgMrrGetJoinedRoomIdArray,          callback : this._onMsgMrrGetJoinedRoomIdArray },
            { type : Notifications_TypeId.TypeId.MsgMcrGetRoomPlayerInfo,             callback : this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type : Notifications_TypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback : this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type : Notifications_TypeId.TypeId.MsgCcrGetRoomPlayerInfo,             callback : this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type : Notifications_TypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback : this._onMsgMpwCommonGetWarProgressInfo },
            { type : Notifications_TypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback : this._onMsgMpwWatchGetRequestedWarIdArray },
            { type : Notifications_TypeId.TypeId.MsgMrrSetBootTimerDaysRange,         callback : this._onMsgMrrSetBootTimerDaysRange },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnMultiPlayer(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrMainMenuPanel, void 0);
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmMainMenuPanel, void 0);
    }
    private _onTouchedBtnSetGameNumber(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrSetMaxConcurrentCountPanel, void 0);
    }
    private _onTouchedBtnBanMap(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrBanMapPanel, void 0);
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
    private _onTouchedBtnPreviewStdMaps(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrPreviewMapListPanel, { hasFog : false });
    }
    private _onTouchedBtnMode(): void {
        Lobby_Model_LobbyModel.openMultiPlayerModePanel(GameModes_Constants.ModeId.RankedMatch);
    }
    private _onTouchedBtnSetTimer(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrSetTimerPanel, void 0);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserLogout(): void {
        this.closePanel();
    }
    private _onMsgMrrGetRoomPublicInfo(): void {
        this._updateComponentsForRed();
    }
    private _onMsgMrrGetJoinedRoomIdArray(): void {
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
    private _onMsgMpwCommonGetWarProgressInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnContinueWar();
    }
    private _onMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnMultiPlayer();
    }
    private _onMsgMrrSetBootTimerDaysRange(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
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
        this._labelMode1.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1378)}\n${Lang_Utils.getText(Lang_Constants.TextType.B1379)}: ${Lang_Utils.getText(Lang_Constants.TextType.B0404)}`);
        this._labelMode2.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1378, languageType2)}\n${Lang_Utils.getText(Lang_Constants.TextType.B1379, languageType2)}: ${Lang_Utils.getText(Lang_Constants.TextType.B0404, languageType2)}`);
        this._labelSetGameNumber1.setLangText(Lang_Constants.TextType.B0413);
        this._labelSetGameNumber2.setLangText(Lang_Constants.TextType.B0413, languageType2);
        this._labelBanMap1.setLangText(Lang_Constants.TextType.B0084);
        this._labelBanMap2.setLangText(Lang_Constants.TextType.B0084, languageType2);
        this._labelSetTimer1.setLangText(Lang_Constants.TextType.B1284);
        this._labelSetTimer2.setLangText(Lang_Constants.TextType.B1284, languageType2);
        this._labelMyRoom1.setLangText(Lang_Constants.TextType.B0410);
        this._labelMyRoom2.setLangText(Lang_Constants.TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(Lang_Constants.TextType.B0024);
        this._labelContinueWar2.setLangText(Lang_Constants.TextType.B0024, languageType2);
        this._labelPreviewStdMaps1.setLangText(Lang_Constants.TextType.B0594);
        this._labelPreviewStdMaps2.setLangText(Lang_Constants.TextType.B0594, languageType2);

        this._layoutMode.arrangeItems();
        this._layoutSetGameNumber.arrangeItems();
        this._layoutBanMap.arrangeItems();
        this._layoutSetTimer.arrangeItems();
        this._layoutMyRoom.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutPreviewStdMaps.arrangeItems();
    }

    private async _updateComponentsForRed(): Promise<void> {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnContinueWar();
        this._updateBtnMode();

        this._btnMyRoom.setRedVisible(await MultiRankRoom_Model_MrrModel.checkIsRed());
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await Lobby_Model_LobbyModel.checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(
            (await MultiPlayerWar_Model_MpwModel.checkIsRedForMyMrwWars()) ||
            (await MultiRankRoom_Model_MrrModel.checkIsRed()),
        );
    }

    private async _updateBtnContinueWar(): Promise<void> {
        this._btnContinueWar.setRedVisible(await MultiPlayerWar_Model_MpwModel.checkIsRedForMyMrwWars());
    }

    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await Helpers_Misc.checkIsAnyPromiseTrue([
            Lobby_Model_LobbyModel.checkIsRedForMultiCoopMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiMatchMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiFreeMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiCustomMode(),
            Lobby_Model_LobbyModel.checkIsRedForAutoTourneyMode(),
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
            waitTime   : 200 / 6 * 0,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSetGameNumber,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 1,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupBanMap,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 2,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSetTimer,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 3,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupMyRoom,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 4,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupContinueWar,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 5,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupPreviewStdMaps,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 6,
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
            obj        : this._groupSetGameNumber,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupBanMap,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSetTimer,
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
            obj        : this._groupPreviewStdMaps,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });

        await Timer_TimerModel.wait();
    }
}
