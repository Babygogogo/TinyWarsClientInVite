import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LobbyModelLobbyModel from "../model/LobbyModel.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as MultiRankRoomModelMrrModel from "../../multiRankRoom/model/MrrModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UrlsConstants from "../../urls/Constants.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupTips!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupWelcome!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTips0!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips1!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupQq!              : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTips2!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips3!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDiscord!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTips4!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips5!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupGithub!          : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTips6!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips7!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupSwitchVersion!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnSwitchVersion!     : UiInterfacesIUiButton.IUiButton;

    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSinglePlayer!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnMultiPlayer!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRanking!           : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupDiscord,       callback: this._onTouchedGroupDiscord },
            { ui: this._groupGithub,        callback: this._onTouchedGroupGithub },
            { ui: this._btnSwitchVersion,   callback: this._onTouchedBtnSwitchVersion },
            { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
            { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
            { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: NotificationsTypeId.TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetJoinedRoomIdArray },
            { type: NotificationsTypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
        ]);
    }
    protected _doApplyOpenData(): void {
        this._updateComponentsForLanguage();
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();

        SoundsSoundPlayer.playBgm(UsersModel.getSelfSettingsBgmCodeForLobby());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedGroupDiscord(): void {
        if ((window) && (window.open)) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getFormattedText(LangConstants.TextType.F0065, `Discord`),
                callback: () => {
                    window.open(UrlsConstants.Constants.DiscordUrl);
                },
            });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedGroupGithub(): void {
        if ((window) && (window.open)) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getFormattedText(LangConstants.TextType.F0065, `GitHub`),
                callback: () => {
                    window.open(UrlsConstants.Constants.GithubUrl);
                },
            });
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedBtnSwitchVersion(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChangeVersionPanel, void 0);
    }

    private _onTouchedBtnMultiPlayer(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrMainMenuPanel, void 0);
    }

    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmMainMenuPanel, void 0);
    }

    private _onTouchedBtnRanking(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrMainMenuPanel, void 0);
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
        TweenExecutor.Executor.reset({
            obj         : this._btnMultiPlayer,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnRanking,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 100,
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnSinglePlayer,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200,
        });

        TweenExecutor.Executor.reset({
            obj         : this._groupWelcome,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupQq,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 50,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupDiscord,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 100,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupGithub,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 150,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSwitchVersion,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200,
        });

        await TimerTimerModel.wait(200 + GraphicsConstants.Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this._btnMultiPlayer,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnRanking,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._btnSinglePlayer,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });

        TweenExecutor.Executor.reset({
            obj         : this._groupWelcome,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupQq,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupDiscord,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupGithub,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSwitchVersion,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await TimerTimerModel.wait();
    }

    private async _updateComponentsForLanguage(): Promise<void> {
        this._labelTips0.setLangText(LangConstants.TextType.A0195);
        this._labelTips1.setLangText(LangConstants.TextType.A0833);
        this._labelTips2.setText(`${LangUtils.getText(LangConstants.TextType.B0537)}:`);
        this._labelTips3.setText(`368142455`);
        this._labelTips4.setText(`${LangUtils.getText(LangConstants.TextType.B0538)}:`);
        // this._labelTips5.textFlow   = [{
        //     text    : GameConfig.DiscordUrl,
        //     style   : { underline: true },
        // }];
        this._labelTips5.setText(UrlsConstants.Constants.DiscordUrl);
        this._labelTips6.setText(`${LangUtils.getText(LangConstants.TextType.B0539)}:`);
        // this._labelTips7.textFlow   = [{
        //     text    : GameConfig.GithubUrl,
        //     style   : { underline: true },
        // }];
        this._labelTips7.setText(UrlsConstants.Constants.GithubUrl);

        this._btnSwitchVersion.setText(`${LangUtils.getText(LangConstants.TextType.B1277)}: ${LangUtils.getGameVersionName(window.GAME_VERSION)}`);

        this._groupWelcome.arrangeItems();
        this._groupQq.arrangeItems();
        this._groupDiscord.arrangeItems();
        this._groupGithub.arrangeItems();
        this._groupSwitchVersion.arrangeItems();
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await LobbyModelLobbyModel.checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(
            (await MultiPlayerWarModelMpwModel.checkIsRedForMyMrwWars()) ||
            (await MultiRankRoomModelMrrModel.checkIsRed())
        );
    }
}
