import {
    MultiRankRoom_Model_MrrModel,
    Lobby_Model_LobbyModel,
    MultiPlayerWar_Model_MpwModel,
    GamePanels_Manager,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    Lang_Constants,
    Graphics_Constants,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _groupLeft!                : Ui_Interfaces_IUiContainer.IUiContainer;

    private readonly _groupCampaign!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnCampaign!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutCampaign!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCampaign1!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCampaign2!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCreateWarRoom!       : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnCreateWarRoom!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutCreateWarRoom!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCreateWarRoom1!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCreateWarRoom2!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupCreateCustomWar!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnCreateCustomWar!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutCreateCustomWar!    : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelCreateCustomWar1!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCreateCustomWar2!    : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupContinueWar!         : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnContinueWar!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _layoutContinueWar!        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelContinueWar1!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelContinueWar2!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnMultiPlayer!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRanking!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSinglePlayer!          : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnMultiPlayer,     callback : this._onTouchedBtnMultiPlayer },
            { ui : this._btnRanking,         callback : this._onTouchedBtnRanking },
            { ui : this._btnCampaign,        callback : this._onTouchedBtnCampaign },
            { ui : this._btnCreateWarRoom,   callback : this._onTouchedBtnCreateWarRoom },
            { ui : this._btnCreateCustomWar, callback : this._onTouchedBtnCreateCustomWar },
            { ui : this._btnContinueWar,     callback : this._onTouchedBtnContinueWar },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "MsgUserLogout",                       callback : this._onMsgUserLogout },
            { type : "MsgMcrGetRoomPlayerInfo",             callback : this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type : "MsgMfrGetRoomPlayerInfo",             callback : this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type : "MsgCcrGetRoomPlayerInfo",             callback : this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type : "MsgMrrGetJoinedRoomIdArray",          callback : this._onMsgMrrGetCreateCustomWarPublicInfoList },
            { type : "MsgMpwCommonGetWarProgressInfo",      callback : this._onMsgMpwCommonGetWarProgressInfo },
            { type : "MsgMpwWatchGetRequestedWarIdArray",   callback : this._onMsgMpwWatchGetRequestedWarIdArray },
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

    private _onMsgUserLogout(): void {
        this.closePanel();
    }

    private _onTouchedBtnMultiPlayer(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrMainMenuPanel, void 0);
    }
    private _onTouchedBtnRanking(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrMainMenuPanel, void 0);
    }
    private _onTouchedBtnCampaign(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CampaignCreateCampaignsPanel, void 0);
    }
    private _onTouchedBtnCreateWarRoom(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SrrCreateMapListPanel, {
            mapFilter            : null,
            mapSorter            : null,
            usePreviousFilter    : true,
            usePreviousPageIndex : true,
        });
    }
    private _onTouchedBtnCreateCustomWar(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().ScrCreateMapListPanel, {
            mapFilter            : null,
            mapSorter            : null,
            usePreviousFilter    : true,
            usePreviousPageIndex : true,
        });
    }
    private _onTouchedBtnContinueWar(): void {
        this.closePanel();
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyTopPanel);
        GamePanels_Manager.closePanel(GamePanels_Dict.getDict().LobbyBottomPanel);
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmWarListPanel, void 0);
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
    private _onMsgMrrGetCreateCustomWarPublicInfoList(): void {
        this._updateBtnRanking();
    }
    private _onMsgMpwCommonGetWarProgressInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
    }
    private _onMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnMultiPlayer();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
    }

    private _updateComponentsForLanguage(): void {
        const languageType2 = Lang_Utils.getSecondaryLanguageType();
        this._labelCampaign1.setLangText(Lang_Constants.TextType.B1135);
        this._labelCampaign2.setLangText(Lang_Constants.TextType.B1135, languageType2);
        this._labelCreateWarRoom1.setLangText(Lang_Constants.TextType.B0614);
        this._labelCreateWarRoom2.setLangText(Lang_Constants.TextType.B0614, languageType2);
        this._labelCreateCustomWar1.setLangText(Lang_Constants.TextType.B0603);
        this._labelCreateCustomWar2.setLangText(Lang_Constants.TextType.B0603, languageType2);
        this._labelContinueWar1.setLangText(Lang_Constants.TextType.B0024);
        this._labelContinueWar2.setLangText(Lang_Constants.TextType.B0024, languageType2);

        this._layoutCampaign.arrangeItems();
        this._layoutCreateWarRoom.arrangeItems();
        this._layoutCreateCustomWar.arrangeItems();
        this._layoutContinueWar.arrangeItems();
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await Lobby_Model_LobbyModel.checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(
            (await MultiPlayerWar_Model_MpwModel.checkIsRedForMyMrwWars())   ||
            (await MultiRankRoom_Model_MrrModel.checkIsRed()),
        );
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
            obj        : this._groupCampaign,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupCreateWarRoom,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 66,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupCreateCustomWar,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 133,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupContinueWar,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 200,
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
            obj        : this._groupCampaign,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupCreateWarRoom,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupCreateCustomWar,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupContinueWar,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });

        await Timer_TimerModel.wait();
    }
}
