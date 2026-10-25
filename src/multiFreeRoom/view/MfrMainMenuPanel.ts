import { show } from "../../FloatText.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { Tween } from "../../graphics/Constants.ts";
import { checkIsAnyPromiseTrue } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getSecondaryLanguageType } from "../../lang/Utils.ts";
import {
    openMultiPlayerModePanel,
    checkIsRedForMultiCustomMode,
    checkIsRedForMultiCoopMode,
    checkIsRedForMultiMatchMode,
    checkIsRedForAutoTourneyMode,
    checkIsRedForMultiPlayer,
} from "../../lobby/model/LobbyModel.ts";
import { checkIsRed } from "../model/MfrModel.ts";
import { MultiPlayerRoomType } from "../../multiPlayerRooms/Constants.ts";
import { checkIsRedForMyMfwWars, checkIsRedForMyMrwWars } from "../../multiPlayerWar/model/MpwModel.ts";
import { checkIsRed as MultiRankRoomModelMrrModelCheckIsRed } from "../../multiRankRoom/model/MrrModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _group!            : IUiContainer;
    private readonly _btnMultiPlayer!   : IUiButton;
    private readonly _btnRanking!       : IUiButton;
    private readonly _btnSinglePlayer!  : IUiButton;

    private readonly _groupLeft!        : IUiContainer;

    private readonly _groupMode!            : IUiContainer;
    private readonly _btnMode!              : IUiButton;
    private readonly _layoutMode!           : IUiLayout;
    private readonly _labelMode1!           : IUiLabel;
    private readonly _labelMode2!           : IUiLabel;

    private readonly _groupCreateRoom!      : IUiContainer;
    private readonly _btnCreateRoom!        : IUiButton;
    private readonly _layoutCreateRoom!     : IUiLayout;
    private readonly _labelCreateRoom1!     : IUiLabel;
    private readonly _labelCreateRoom2!     : IUiLabel;

    private readonly _groupJoinRoom!        : IUiContainer;
    private readonly _btnJoinRoom!          : IUiButton;
    private readonly _layoutJoinRoom!       : IUiLayout;
    private readonly _labelJoinRoom1!       : IUiLabel;
    private readonly _labelJoinRoom2!       : IUiLabel;

    private readonly _groupMyRoom!          : IUiContainer;
    private readonly _btnMyRoom!            : IUiButton;
    private readonly _layoutMyRoom!         : IUiLayout;
    private readonly _labelMyRoom1!         : IUiLabel;
    private readonly _labelMyRoom2!         : IUiLabel;

    private readonly _groupContinueWar!     : IUiContainer;
    private readonly _btnContinueWar!       : IUiButton;
    private readonly _layoutContinueWar!    : IUiLayout;
    private readonly _labelContinueWar1!    : IUiLabel;
    private readonly _labelContinueWar2!    : IUiLabel;

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
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
            { type: TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onMsgMfrGetRoomPlayerInfo },
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
        openPanel(getDict().MrrMainMenuPanel, void 0);
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        openPanel(getDict().SpmMainMenuPanel, void 0);
    }
    private _onTouchedBtnCreateRoom(): void {
        show(getText(TextType.A0198));
    }
    private _onTouchedBtnJoinRoom(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        // PanelHelpers.open(PanelHelpers.PanelDict.MfrJoinRoomListPanel, { filter: null });
        openPanel(getDict().MpwJoinRoomListPanel, { preferredRoomType: MultiPlayerRoomType.Mfr, filter: null });
    }
    private _onTouchedBtnMyRoom(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().MpwMyRoomListPanel, void 0);
    }
    private _onTouchedBtnContinueWar(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().MpwMyWarListPanel, void 0);
    }
    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonAlertPanel, {
            getTitle   : () => getText(TextType.B0143),
            getContent : () => getText(TextType.R0007),
        });
    }
    private _onTouchedBtnMode(): void {
        openMultiPlayerModePanel(ModeId.Free);
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
            obj         : this._groupMode,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 0,
        });
        Executor.reset({
            obj         : this._groupCreateRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 1,
        });
        Executor.reset({
            obj         : this._groupJoinRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 2,
        });
        Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 3,
        });
        Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 4,
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
            obj         : this._groupMode,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupCreateRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupJoinRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await wait();
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
        const languageType2 = getSecondaryLanguageType();
        this._labelMode1.setText(`${getText(TextType.B1378)}\n${getText(TextType.B1379)}: ${getText(TextType.B0557)}`);
        this._labelMode2.setText(`${getText(TextType.B1378, languageType2)}\n${getText(TextType.B1379, languageType2)}: ${getText(TextType.B0557, languageType2)}`);
        this._labelCreateRoom1.setLangText(TextType.B0000);
        this._labelCreateRoom2.setLangText(TextType.B0000, languageType2);
        this._labelJoinRoom1.setLangText(TextType.B0580);
        this._labelJoinRoom2.setLangText(TextType.B0580, languageType2);
        this._labelMyRoom1.setLangText(TextType.B0410);
        this._labelMyRoom2.setLangText(TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(TextType.B0024);
        this._labelContinueWar2.setLangText(TextType.B0024, languageType2);

        this._layoutMode.arrangeItems();
        this._layoutCreateRoom.arrangeItems();
        this._layoutJoinRoom.arrangeItems();
        this._layoutMyRoom.arrangeItems();
        this._layoutContinueWar.arrangeItems();
    }
    private async _updateBtnContinueWar(): Promise<void> {
        this._btnContinueWar.setRedVisible(await checkIsRedForMyMfwWars());
    }
    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await checkIsAnyPromiseTrue([
            checkIsRedForMultiCustomMode(),
            checkIsRedForMultiCoopMode(),
            checkIsRedForMultiMatchMode(),
            checkIsRedForAutoTourneyMode(),
        ]));
    }
    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible((await checkIsRedForMyMrwWars()) || (await MultiRankRoomModelMrrModelCheckIsRed()));
    }
    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await checkIsRedForMultiPlayer());
    }
    private async _updateBtnMyRoom(): Promise<void> {
        this._btnMyRoom.setRedVisible(await checkIsRed());
    }
}
