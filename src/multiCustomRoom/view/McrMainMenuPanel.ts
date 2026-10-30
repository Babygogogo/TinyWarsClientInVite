import {
    AutoTourneys_Rooms_Provider,
    CoopCustomRoom_Model_CcrModel,
    Helpers_Misc,
    MultiPlayerWar_Model_MpwModel,
    Lobby_Model_LobbyModel,
    MultiCustomRoom_Model_McrModel,
    MultiFreeRoom_Model_MfrModel,
    MultiMatchRoom_Model_MmrModel,
    MultiRankRoom_Model_MrrModel,
    WatchWar_Model_WwModel,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    GameModes_Constants,
    MultiPlayerRooms_Constants,
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

    private readonly _groupCreateRoom!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnCreateRoom!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutCreateRoom!     : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCreateRoom1!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCreateRoom2!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupJoinRoom!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnJoinRoom!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutJoinRoom!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelJoinRoom1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelJoinRoom2!       : Ui_Interfaces_IUiLabel.IUiLabel;

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

    private readonly _groupWatchWar!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnWatchWar!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutWatchWar!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelWatchWar1!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelWatchWar2!       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupReplayWar!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnReplayWar!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutReplayWar!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelReplayWar1!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelReplayWar2!      : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,                     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgUserLogout,                       callback : this._onNotifyMsgUserLogout },
            { type : Notifications_TypeId.TypeId.MsgMcrGetRoomPlayerInfo,             callback : this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type : Notifications_TypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback : this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type : Notifications_TypeId.TypeId.MsgCcrGetRoomPlayerInfo,             callback : this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type : Notifications_TypeId.TypeId.MsgMrrGetJoinedRoomIdArray,          callback : this._onMsgMrrGetJoinedRoomIdArray },
            { type : Notifications_TypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback : this._onMsgMpwCommonGetWarProgressInfo },
            { type : Notifications_TypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback : this._onMsgMpwWatchGetRequestedWarIdArray },
        ]);
        this._setUiListenerArray([
            { ui : this._btnRanking,                 callback : this._onTouchedBtnRanking },
            { ui : this._btnSinglePlayer,            callback : this._onTouchedBtnSinglePlayer },
            { ui : this._btnCreateRoom,              callback : this._onTouchedBtnCreateRoom },
            { ui : this._btnJoinRoom,                callback : this._onTouchedBtnJoinRoom },
            { ui : this._btnMyRoom,                  callback : this._onTouchedBtnMyRoom },
            { ui : this._btnContinueWar,             callback : this._onTouchedBtnContinueWar },
            { ui : this._btnWatchWar,                callback : this._onTouchedBtnWatchWar },
            { ui : this._btnReplayWar,               callback : this._onTouchedBtnReplayWar },
            { ui : this._btnMode,                    callback : this._onTouchedBtnMode },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnRanking(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrMainMenuPanel, void 0);
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmMainMenuPanel, void 0);
    }
    private _onTouchedBtnCreateRoom(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrCreateMapListPanel, {
            mapFilter            : null,
            mapSorter            : null,
            usePreviousFilter    : true,
            usePreviousPageIndex : true,
        });
    }
    private _onTouchedBtnJoinRoom(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        // PanelHelpers.open(PanelHelpers.PanelDict.McrJoinRoomListPanel, { filter: null });
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwJoinRoomListPanel, { preferredRoomType : MultiPlayerRooms_Constants.MultiPlayerRoomType.Mcr, filter : null });
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
    private _onTouchedBtnWatchWar(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwMainMenuPanel, void 0);
    }
    private _onTouchedBtnReplayWar(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().RwReplayListPanel, {
            filter               : null,
            usePreviousFilter    : true,
            usePreviousPageIndex : true,
        });
    }
    private _onTouchedBtnMode(): void {
        Lobby_Model_LobbyModel.openMultiPlayerModePanel(GameModes_Constants.ModeId.Versus);
    }

    private _onNotifyMsgUserLogout(): void {
        this.closePanel();
    }
    private _onNotifyMsgMcrGetRoomPlayerInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnMyRoom();
    }
    private _onNotifyMsgMfrGetRoomPlayerInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnMode();
    }
    private _onNotifyMsgCcrGetRoomPlayerInfo(): void {
        this._updateBtnMultiPlayer();
    }
    private _onMsgMrrGetJoinedRoomIdArray(): void {
        this._updateBtnRanking();
    }
    private _onMsgMpwCommonGetWarProgressInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnContinueWar();
        this._updateBtnMode();
    }
    private _onMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnWatchWar();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
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
            obj        : this._groupCreateRoom,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 1,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupJoinRoom,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 2,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupMyRoom,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 3,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupContinueWar,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 4,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupWatchWar,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200 / 6 * 5,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupReplayWar,
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
            obj        : this._groupCreateRoom,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupJoinRoom,
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
            obj        : this._groupWatchWar,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupReplayWar,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });

        await Timer_TimerModel.wait();
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnMyRoom();
        this._updateBtnContinueWar();
        this._updateBtnMode();
        this._updateBtnWatchWar();
    }

    private _updateComponentsForLanguage(): void {
        const languageType2 = Lang_Utils.getSecondaryLanguageType();
        this._labelMode1.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1378)}\n${Lang_Utils.getText(Lang_Constants.TextType.B1379)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1011)}`);
        this._labelMode2.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1378, languageType2)}\n${Lang_Utils.getText(Lang_Constants.TextType.B1379, languageType2)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1011, languageType2)}`);
        this._labelCreateRoom1.setLangText(Lang_Constants.TextType.B0000);
        this._labelCreateRoom2.setLangText(Lang_Constants.TextType.B0000, languageType2);
        this._labelJoinRoom1.setLangText(Lang_Constants.TextType.B0580);
        this._labelJoinRoom2.setLangText(Lang_Constants.TextType.B0580, languageType2);
        this._labelMyRoom1.setLangText(Lang_Constants.TextType.B0410);
        this._labelMyRoom2.setLangText(Lang_Constants.TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(Lang_Constants.TextType.B0024);
        this._labelContinueWar2.setLangText(Lang_Constants.TextType.B0024, languageType2);
        this._labelWatchWar1.setLangText(Lang_Constants.TextType.B0206);
        this._labelWatchWar2.setLangText(Lang_Constants.TextType.B0206, languageType2);
        this._labelReplayWar1.setLangText(Lang_Constants.TextType.B0092);
        this._labelReplayWar2.setLangText(Lang_Constants.TextType.B0092, languageType2);

        this._layoutMode.arrangeItems();
        this._layoutCreateRoom.arrangeItems();
        this._layoutJoinRoom.arrangeItems();
        this._layoutMyRoom.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutWatchWar.arrangeItems();
        this._layoutReplayWar.arrangeItems();
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

    private async _updateBtnMyRoom(): Promise<void> {
        this._btnMyRoom.setRedVisible(await Helpers_Misc.checkIsAnyPromiseTrue([
            MultiCustomRoom_Model_McrModel.checkIsRed(),
            CoopCustomRoom_Model_CcrModel.checkIsRed(),
            MultiFreeRoom_Model_MfrModel.checkIsRed(),
            MultiRankRoom_Model_MrrModel.checkIsRed(),
            MultiMatchRoom_Model_MmrModel.checkIsRed(),
            AutoTourneys_Rooms_Provider.checkIsRed(),
        ]));
    }

    private async _updateBtnContinueWar(): Promise<void> {
        // this._btnContinueWar.setRedVisible(await MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars());
        this._btnContinueWar.setRedVisible(await MultiPlayerWar_Model_MpwModel.checkIsRedForAllMyWars());
    }

    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await Helpers_Misc.checkIsAnyPromiseTrue([
            Lobby_Model_LobbyModel.checkIsRedForMultiCoopMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiFreeMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiMatchMode(),
            Lobby_Model_LobbyModel.checkIsRedForAutoTourneyMode(),
        ]));
    }

    private async _updateBtnWatchWar(): Promise<void> {
        this._btnWatchWar.setRedVisible(await WatchWar_Model_WwModel.checkIsRed());
    }
}
