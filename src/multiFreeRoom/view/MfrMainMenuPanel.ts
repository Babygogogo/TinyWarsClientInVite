import {
    Helpers_Misc,
    Lobby_Model_LobbyModel,
    MultiPlayerWar_Model_MpwModel,
    MultiFreeRoom_Model_MfrModel,
    MultiRankRoom_Model_MrrModel,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    GameModes_Constants,
    MultiPlayerRooms_Constants,
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
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnMultiPlayer!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRanking!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSinglePlayer!  : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupLeft!        : Ui_Interfaces_IUiContainer.IUiContainer;

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

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
            { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
            { ui: this._btnCreateRoom,      callback: this._onTouchedBtnCreateRoom },
            { ui: this._btnJoinRoom,        callback: this._onTouchedBtnJoinRoom },
            { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
            { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
            { ui: this._btnMode,            callback: this._onTouchedBtnMode },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: Notifications_TypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: Notifications_TypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
            { type: Notifications_TypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onMsgMfrGetRoomPlayerInfo },
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
    private _onTouchedBtnCreateRoom(): void {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0198));
    }
    private _onTouchedBtnJoinRoom(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        // PanelHelpers.open(PanelHelpers.PanelDict.MfrJoinRoomListPanel, { filter: null });
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MpwJoinRoomListPanel, { preferredRoomType: MultiPlayerRooms_Constants.MultiPlayerRoomType.Mfr, filter: null });
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
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
            getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0143),
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0007),
        });
    }
    private _onTouchedBtnMode(): void {
        Lobby_Model_LobbyModel.openMultiPlayerModePanel(GameModes_Constants.ModeId.Free);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserLogout(): void {
        this.closePanel();
    }
    private _onMsgMpwCommonGetWarProgressInfo(): void {
        this._updateBtnContinueWar();
        this._updateBtnMode();
        this._updateBtnRanking();
        this._updateBtnMultiPlayer();
    }
    private _onMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnMultiPlayer();
    }
    private _onMsgMfrGetRoomPlayerInfo(): void {
        this._updateBtnMyRoom();
        this._updateBtnMultiPlayer();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._btnMultiPlayer,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnRanking,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 100,
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnSinglePlayer,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200,
        });

        Tween_Executor.Executor.reset({
            obj         : this._groupMode,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 0,
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupCreateRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 1,
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupJoinRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 2,
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 3,
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 4,
        });

        await Timer_TimerModel.wait(200 + Graphics_Constants.Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj         : this._btnMultiPlayer,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnRanking,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._btnSinglePlayer,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });

        Tween_Executor.Executor.reset({
            obj         : this._groupMode,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupCreateRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupJoinRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await Timer_TimerModel.wait();
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateBtnContinueWar();
        this._updateBtnMode();
        this._updateBtnRanking();
        this._updateBtnMultiPlayer();
        this._updateBtnMyRoom();
    }
    private _updateComponentsForLanguage(): void {
        const languageType2 = Lang_Utils.getSecondaryLanguageType();
        this._labelMode1.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1378)}\n${Lang_Utils.getText(Lang_Constants.TextType.B1379)}: ${Lang_Utils.getText(Lang_Constants.TextType.B0557)}`);
        this._labelMode2.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1378, languageType2)}\n${Lang_Utils.getText(Lang_Constants.TextType.B1379, languageType2)}: ${Lang_Utils.getText(Lang_Constants.TextType.B0557, languageType2)}`);
        this._labelCreateRoom1.setLangText(Lang_Constants.TextType.B0000);
        this._labelCreateRoom2.setLangText(Lang_Constants.TextType.B0000, languageType2);
        this._labelJoinRoom1.setLangText(Lang_Constants.TextType.B0580);
        this._labelJoinRoom2.setLangText(Lang_Constants.TextType.B0580, languageType2);
        this._labelMyRoom1.setLangText(Lang_Constants.TextType.B0410);
        this._labelMyRoom2.setLangText(Lang_Constants.TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(Lang_Constants.TextType.B0024);
        this._labelContinueWar2.setLangText(Lang_Constants.TextType.B0024, languageType2);

        this._layoutMode.arrangeItems();
        this._layoutCreateRoom.arrangeItems();
        this._layoutJoinRoom.arrangeItems();
        this._layoutMyRoom.arrangeItems();
        this._layoutContinueWar.arrangeItems();
    }
    private async _updateBtnContinueWar(): Promise<void> {
        this._btnContinueWar.setRedVisible(await MultiPlayerWar_Model_MpwModel.checkIsRedForMyMfwWars());
    }
    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await Helpers_Misc.checkIsAnyPromiseTrue([
            Lobby_Model_LobbyModel.checkIsRedForMultiCustomMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiCoopMode(),
            Lobby_Model_LobbyModel.checkIsRedForMultiMatchMode(),
            Lobby_Model_LobbyModel.checkIsRedForAutoTourneyMode(),
        ]));
    }
    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible((await MultiPlayerWar_Model_MpwModel.checkIsRedForMyMrwWars()) || (await MultiRankRoom_Model_MrrModel.checkIsRed()));
    }
    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await Lobby_Model_LobbyModel.checkIsRedForMultiPlayer());
    }
    private async _updateBtnMyRoom(): Promise<void> {
        this._btnMyRoom.setRedVisible(await MultiFreeRoom_Model_MfrModel.checkIsRed());
    }
}
