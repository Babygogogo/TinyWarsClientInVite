import {
    MultiRankRoom_Model_MrrModel,
    Lobby_Model_LobbyModel,
    MultiPlayerWar_Model_MpwModel,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    WatchWar_Model_WwModel,
    Lang_Utils,
    Sounds_SoundPlayer,
    Sounds_Constants,
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
    // private readonly _group!            : Ui.Interfaces.IUiContainer;
    private readonly _btnMultiPlayer!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRanking!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSinglePlayer!      : Ui_Interfaces_IUiButton.IUiButton;

    // private readonly _groupLeft!        : Ui.Interfaces.IUiContainer;
    private readonly _groupMakeRequest!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnMakeRequest!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutMakeRequest!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelMakeRequest1!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMakeRequest2!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupHandleRequest!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnHandleRequest!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutHandleRequest!  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelHandleRequest1!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelHandleRequest2!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDeleteWatcher!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnDeleteWatcher!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutDeleteWatcher!  : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDeleteWatcher1!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDeleteWatcher2!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupContinueWar!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnContinueWar!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutContinueWar!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelContinueWar1!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelContinueWar2!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupBack!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnBack!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutBack!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelBack1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelBack2!           : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
            { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
            { ui: this._btnMakeRequest,     callback: this._onTouchedBtnMakeRequest },
            { ui: this._btnHandleRequest,   callback: this._onTouchedBtnHandleRequest },
            { ui: this._btnDeleteWatcher,   callback: this._onTouchedBtnDeleteWatcher },
            { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
            { ui: this._btnBack,            callback: this._onTouchedBtnBack },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: Notifications_TypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: Notifications_TypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._onTouchedBtnBack();
        });
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

    private _onTouchedBtnMakeRequest(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwMakeRequestWarsPanel, { filter: null });
    }

    private _onTouchedBtnHandleRequest(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwHandleRequestWarsPanel, void 0);
    }

    private _onTouchedBtnDeleteWatcher(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwDeleteWatcherWarsPanel, void 0);
    }

    private _onTouchedBtnContinueWar(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WwOngoingWarsPanel, void 0);
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrMainMenuPanel, void 0);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserLogout(): void {
        this.closePanel();
    }
    private _onMsgMpwCommonGetWarProgressInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
    }
    private _onMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnHandleRequest();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnHandleRequest();
    }

    private _updateComponentsForLanguage(): void {
        const languageType2 = Lang_Utils.getSecondaryLanguageType();
        this._labelMakeRequest1.setLangText(Lang_Constants.TextType.B0207);
        this._labelMakeRequest2.setLangText(Lang_Constants.TextType.B0207, languageType2);
        this._labelHandleRequest1.setLangText(Lang_Constants.TextType.B0208);
        this._labelHandleRequest2.setLangText(Lang_Constants.TextType.B0208, languageType2);
        this._labelDeleteWatcher1.setLangText(Lang_Constants.TextType.B0219);
        this._labelDeleteWatcher2.setLangText(Lang_Constants.TextType.B0219, languageType2);
        this._labelContinueWar1.setLangText(Lang_Constants.TextType.B1382);
        this._labelContinueWar2.setLangText(Lang_Constants.TextType.B1382, languageType2);
        this._labelBack1.setLangText(Lang_Constants.TextType.B0146);
        this._labelBack2.setLangText(Lang_Constants.TextType.B0146, languageType2);

        this._layoutMakeRequest.arrangeItems();
        this._layoutHandleRequest.arrangeItems();
        this._layoutDeleteWatcher.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutBack.arrangeItems();
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await Lobby_Model_LobbyModel.checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(
            (await MultiPlayerWar_Model_MpwModel.checkIsRedForMyMrwWars()) ||
            (await MultiRankRoom_Model_MrrModel.checkIsRed())
        );
    }

    private _updateBtnHandleRequest(): void {
        this._btnHandleRequest.setRedVisible(!!WatchWar_Model_WwModel.getRequestedWarIdArray()?.length);
    }

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
            obj         : this._groupMakeRequest,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupHandleRequest,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 1,
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupDeleteWatcher,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 2,
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 3,
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupBack,
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
            obj         : this._groupMakeRequest,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupHandleRequest,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupDeleteWatcher,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Tween_Executor.Executor.reset({
            obj         : this._groupBack,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await Timer_TimerModel.wait();
    }
}
