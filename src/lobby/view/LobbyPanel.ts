import {
    MultiRankRoom_Model_MrrModel,
    Lobby_Model_LobbyModel,
    MultiPlayerWar_Model_MpwModel,
    Urls_Constants,
    Tween_Executor,
    GamePanels_Dict,
    Lang_Utils,
    Users_Model,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
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
    private readonly _groupTips!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupWelcome!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTips0!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips1!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupQq!              : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTips2!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips3!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupDiscord!         : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTips4!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips5!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupGithub!          : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTips6!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips7!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupSwitchVersion!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnSwitchVersion!     : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSinglePlayer!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMultiPlayer!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRanking!           : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupDiscord,       callback : this._onTouchedGroupDiscord },
            { ui : this._groupGithub,        callback : this._onTouchedGroupGithub },
            { ui : this._btnSwitchVersion,   callback : this._onTouchedBtnSwitchVersion },
            { ui : this._btnMultiPlayer,     callback : this._onTouchedBtnMultiPlayer },
            { ui : this._btnSinglePlayer,    callback : this._onTouchedBtnSinglePlayer },
            { ui : this._btnRanking,         callback : this._onTouchedBtnRanking },
        ]);
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                     callback : this._onNotifyLanguageChanged },
            { type : "MsgUserLogout",                       callback : this._onMsgUserLogout },
            { type : "MsgMcrGetRoomPlayerInfo",             callback : this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type : "MsgMfrGetRoomPlayerInfo",             callback : this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type : "MsgCcrGetRoomPlayerInfo",             callback : this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type : "MsgMrrGetJoinedRoomIdArray",          callback : this._onMsgMrrGetJoinedRoomIdArray },
            { type : "MsgMpwCommonGetWarProgressInfo",      callback : this._onMsgMpwCommonGetWarProgressInfo },
            { type : "MsgMpwWatchGetRequestedWarIdArray",   callback : this._onMsgMpwWatchGetRequestedWarIdArray },
        ]);
    }
    protected _doApplyOpenData(): void {
        this._updateComponentsForLanguage();
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();

        Sounds_SoundPlayer.playBgm(Users_Model.getSelfSettingsBgmCodeForLobby());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedGroupDiscord(): void {
        if ((window) && (window.open)) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0065, `Discord`),
                callback   : () => {
                    window.open(Urls_Constants.Constants.DiscordUrl);
                },
            });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedGroupGithub(): void {
        if ((window) && (window.open)) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0065, `GitHub`),
                callback   : () => {
                    window.open(Urls_Constants.Constants.GithubUrl);
                },
            });
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedBtnSwitchVersion(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChangeVersionPanel, void 0);
    }

    private _onTouchedBtnMultiPlayer(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().McrMainMenuPanel, void 0);
    }

    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().SpmMainMenuPanel, void 0);
    }

    private _onTouchedBtnRanking(): void {
        this.closePanel();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().MrrMainMenuPanel, void 0);
    }

    private _onMsgUserLogout(): void {
        this.closePanel();
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

    private _onMsgMrrGetJoinedRoomIdArray(): void {
        this._updateBtnRanking();
    }

    private _onMsgMpwCommonGetWarProgressInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
    }

    private _onMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnMultiPlayer();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
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
            obj        : this._groupWelcome,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupQq,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 50,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupDiscord,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 100,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupGithub,
            beginProps : { customAlpha : 0, customX : -40 },
            endProps   : { customAlpha : 1, customX : 0 },
            waitTime   : 150,
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSwitchVersion,
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
            obj        : this._groupWelcome,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupQq,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupDiscord,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupGithub,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });
        Tween_Executor.Executor.reset({
            obj        : this._groupSwitchVersion,
            beginProps : { customAlpha : 1, customX : 0 },
            endProps   : { customAlpha : 0, customX : -40 },
        });

        await Timer_TimerModel.wait();
    }

    private async _updateComponentsForLanguage(): Promise<void> {
        this._labelTips0.setLangText(Lang_Constants.TextType.A0195);
        this._labelTips1.setLangText(Lang_Constants.TextType.A0833);
        this._labelTips2.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0537)}:`);
        this._labelTips3.setText(`368142455`);
        this._labelTips4.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0538)}:`);
        // this._labelTips5.textFlow   = [{
        //     text    : GameConfig.DiscordUrl,
        //     style   : { underline: true },
        // }];
        this._labelTips5.setText(Urls_Constants.Constants.DiscordUrl);
        this._labelTips6.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0539)}:`);
        // this._labelTips7.textFlow   = [{
        //     text    : GameConfig.GithubUrl,
        //     style   : { underline: true },
        // }];
        this._labelTips7.setText(Urls_Constants.Constants.GithubUrl);

        this._btnSwitchVersion.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1277)}: ${Lang_Utils.getGameVersionName(window.GAME_VERSION)}`);

        this._groupWelcome.arrangeItems();
        this._groupQq.arrangeItems();
        this._groupDiscord.arrangeItems();
        this._groupGithub.arrangeItems();
        this._groupSwitchVersion.arrangeItems();
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
}
