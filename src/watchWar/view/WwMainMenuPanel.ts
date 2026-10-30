import { getDict } from "../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../gamePanels/Manager.ts";
import { Tween } from "../../graphics/Constants.ts";
import { TextType } from "../../lang/Constants.ts";
import { getSecondaryLanguageType } from "../../lang/Utils.ts";
import { checkIsRedForMultiPlayer } from "../../lobby/model/LobbyModel.ts";
import { checkIsRedForMyMrwWars } from "../../multiPlayerWar/model/MpwModel.ts";
import { checkIsRed } from "../../multiRankRoom/model/MrrModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getRequestedWarIdArray } from "../model/WwModel.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    // private readonly _group!            : Ui.Interfaces.IUiContainer;
    private readonly _btnMultiPlayer!       : IUiButton;
    private readonly _btnRanking!           : IUiButton;
    private readonly _btnSinglePlayer!      : IUiButton;

    // private readonly _groupLeft!        : Ui.Interfaces.IUiContainer;
    private readonly _groupMakeRequest!     : IUiContainer;
    private readonly _btnMakeRequest!       : IUiButton;
    private readonly _layoutMakeRequest!    : IUiLayout;
    private readonly _labelMakeRequest1!    : IUiLabel;
    private readonly _labelMakeRequest2!    : IUiLabel;

    private readonly _groupHandleRequest!   : IUiContainer;
    private readonly _btnHandleRequest!     : IUiButton;
    private readonly _layoutHandleRequest!  : IUiLayout;
    private readonly _labelHandleRequest1!  : IUiLabel;
    private readonly _labelHandleRequest2!  : IUiLabel;

    private readonly _groupDeleteWatcher!   : IUiContainer;
    private readonly _btnDeleteWatcher!     : IUiButton;
    private readonly _layoutDeleteWatcher!  : IUiLayout;
    private readonly _labelDeleteWatcher1!  : IUiLabel;
    private readonly _labelDeleteWatcher2!  : IUiLabel;

    private readonly _groupContinueWar!     : IUiContainer;
    private readonly _btnContinueWar!       : IUiButton;
    private readonly _layoutContinueWar!    : IUiLayout;
    private readonly _labelContinueWar1!    : IUiLabel;
    private readonly _labelContinueWar2!    : IUiLabel;

    private readonly _groupBack!            : IUiContainer;
    private readonly _btnBack!              : IUiButton;
    private readonly _layoutBack!           : IUiLayout;
    private readonly _labelBack1!           : IUiLabel;
    private readonly _labelBack2!           : IUiLabel;

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
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            playShortSfx(ShortSfxCode.ButtonCancel01);
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
        openPanel(getDict().MrrMainMenuPanel, void 0);
    }

    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        openPanel(getDict().SpmMainMenuPanel, void 0);
    }

    private _onTouchedBtnMakeRequest(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().WwMakeRequestWarsPanel, { filter: null });
    }

    private _onTouchedBtnHandleRequest(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().WwHandleRequestWarsPanel, void 0);
    }

    private _onTouchedBtnDeleteWatcher(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().WwDeleteWatcherWarsPanel, void 0);
    }

    private _onTouchedBtnContinueWar(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().WwOngoingWarsPanel, void 0);
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        openPanel(getDict().McrMainMenuPanel, void 0);
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
        const languageType2 = getSecondaryLanguageType();
        this._labelMakeRequest1.setLangText(TextType.B0207);
        this._labelMakeRequest2.setLangText(TextType.B0207, languageType2);
        this._labelHandleRequest1.setLangText(TextType.B0208);
        this._labelHandleRequest2.setLangText(TextType.B0208, languageType2);
        this._labelDeleteWatcher1.setLangText(TextType.B0219);
        this._labelDeleteWatcher2.setLangText(TextType.B0219, languageType2);
        this._labelContinueWar1.setLangText(TextType.B1382);
        this._labelContinueWar2.setLangText(TextType.B1382, languageType2);
        this._labelBack1.setLangText(TextType.B0146);
        this._labelBack2.setLangText(TextType.B0146, languageType2);

        this._layoutMakeRequest.arrangeItems();
        this._layoutHandleRequest.arrangeItems();
        this._layoutDeleteWatcher.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutBack.arrangeItems();
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

    private _updateBtnHandleRequest(): void {
        this._btnHandleRequest.setRedVisible(!!getRequestedWarIdArray()?.length);
    }

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
            obj         : this._groupMakeRequest,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        Executor.reset({
            obj         : this._groupHandleRequest,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 1,
        });
        Executor.reset({
            obj         : this._groupDeleteWatcher,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 2,
        });
        Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 3,
        });
        Executor.reset({
            obj         : this._groupBack,
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
            obj         : this._groupMakeRequest,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupHandleRequest,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupDeleteWatcher,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupBack,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await wait();
    }
}
