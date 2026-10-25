import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { Tween } from "../../graphics/Constants.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText, getText, getGameVersionName } from "../../lang/Utils.ts";
import { checkIsRedForMultiPlayer } from "../model/LobbyModel.ts";
import { checkIsRedForMyMrwWars } from "../../multiPlayerWar/model/MpwModel.ts";
import { checkIsRed } from "../../multiRankRoom/model/MrrModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playBgm, playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { Constants } from "../../urls/Constants.ts";
import { getSelfSettingsBgmCodeForLobby } from "../../users/Model.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _groupTips!            : IUiContainer;
    private readonly _groupWelcome!         : IUiLayout;
    private readonly _labelTips0!           : IUiLabel;
    private readonly _labelTips1!           : IUiLabel;

    private readonly _groupQq!              : IUiLayout;
    private readonly _labelTips2!           : IUiLabel;
    private readonly _labelTips3!           : IUiLabel;

    private readonly _groupDiscord!         : IUiLayout;
    private readonly _labelTips4!           : IUiLabel;
    private readonly _labelTips5!           : IUiLabel;

    private readonly _groupGithub!          : IUiLayout;
    private readonly _labelTips6!           : IUiLabel;
    private readonly _labelTips7!           : IUiLabel;

    private readonly _groupSwitchVersion!   : IUiLayout;
    private readonly _btnSwitchVersion!     : IUiButton;

    private readonly _group!                : IUiContainer;
    private readonly _btnSinglePlayer!      : IUiButton;
    private readonly _btnMultiPlayer!       : IUiButton;
    private readonly _btnRanking!           : IUiButton;

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
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetJoinedRoomIdArray },
            { type: TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
        ]);
    }
    protected _doApplyOpenData(): void {
        this._updateComponentsForLanguage();
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();

        playBgm(getSelfSettingsBgmCodeForLobby());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedGroupDiscord(): void {
        if ((window) && (window.open)) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getFormattedText(TextType.F0065, `Discord`),
                callback: () => {
                    window.open(Constants.DiscordUrl);
                },
            });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedGroupGithub(): void {
        if ((window) && (window.open)) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getFormattedText(TextType.F0065, `GitHub`),
                callback: () => {
                    window.open(Constants.GithubUrl);
                },
            });
            playShortSfx(ShortSfxCode.ButtonNeutral01);
        }
    }

    private _onTouchedBtnSwitchVersion(): void {
        openPanel(getDict().CommonChangeVersionPanel, void 0);
    }

    private _onTouchedBtnMultiPlayer(): void {
        this.closePanel();
        openPanel(getDict().McrMainMenuPanel, void 0);
    }

    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        openPanel(getDict().SpmMainMenuPanel, void 0);
    }

    private _onTouchedBtnRanking(): void {
        this.closePanel();
        openPanel(getDict().MrrMainMenuPanel, void 0);
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
        Executor.reset({
            obj         : this._btnMultiPlayer,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        Executor.reset({
            obj         : this._btnRanking,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 100,
        });
        Executor.reset({
            obj         : this._btnSinglePlayer,
            beginProps  : { customAlpha: 0, customX: 40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200,
        });

        Executor.reset({
            obj         : this._groupWelcome,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        Executor.reset({
            obj         : this._groupQq,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 50,
        });
        Executor.reset({
            obj         : this._groupDiscord,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 100,
        });
        Executor.reset({
            obj         : this._groupGithub,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 150,
        });
        Executor.reset({
            obj         : this._groupSwitchVersion,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200,
        });

        await wait(200 + Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._btnMultiPlayer,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });
        Executor.reset({
            obj         : this._btnRanking,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });
        Executor.reset({
            obj         : this._btnSinglePlayer,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: 40 },
        });

        Executor.reset({
            obj         : this._groupWelcome,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupQq,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupDiscord,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupGithub,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupSwitchVersion,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await wait();
    }

    private async _updateComponentsForLanguage(): Promise<void> {
        this._labelTips0.setLangText(TextType.A0195);
        this._labelTips1.setLangText(TextType.A0833);
        this._labelTips2.setText(`${getText(TextType.B0537)}:`);
        this._labelTips3.setText(`368142455`);
        this._labelTips4.setText(`${getText(TextType.B0538)}:`);
        // this._labelTips5.textFlow   = [{
        //     text    : GameConfig.DiscordUrl,
        //     style   : { underline: true },
        // }];
        this._labelTips5.setText(Constants.DiscordUrl);
        this._labelTips6.setText(`${getText(TextType.B0539)}:`);
        // this._labelTips7.textFlow   = [{
        //     text    : GameConfig.GithubUrl,
        //     style   : { underline: true },
        // }];
        this._labelTips7.setText(Constants.GithubUrl);

        this._btnSwitchVersion.setText(`${getText(TextType.B1277)}: ${getGameVersionName(window.GAME_VERSION)}`);

        this._groupWelcome.arrangeItems();
        this._groupQq.arrangeItems();
        this._groupDiscord.arrangeItems();
        this._groupGithub.arrangeItems();
        this._groupSwitchVersion.arrangeItems();
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(
            (await checkIsRedForMyMrwWars()) ||
            (await checkIsRed())
        );
    }
}
