import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LobbyModelLobbyModel from "../../lobby/model/LobbyModel.ts";
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
import * as WatchWarModelWwModel from "../model/WwModel.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    // private readonly _group!            : Ui.Interfaces.IUiContainer;
    private readonly _btnMultiPlayer!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRanking!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSinglePlayer!      : UiInterfacesIUiButton.IUiButton;

    // private readonly _groupLeft!        : Ui.Interfaces.IUiContainer;
    private readonly _groupMakeRequest!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnMakeRequest!       : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutMakeRequest!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMakeRequest1!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMakeRequest2!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupHandleRequest!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnHandleRequest!     : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutHandleRequest!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelHandleRequest1!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHandleRequest2!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupDeleteWatcher!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnDeleteWatcher!     : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutDeleteWatcher!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDeleteWatcher1!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDeleteWatcher2!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupContinueWar!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnContinueWar!       : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutContinueWar!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelContinueWar1!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelContinueWar2!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupBack!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnBack!              : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutBack!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelBack1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelBack2!           : UiInterfacesIUiLabel.IUiLabel;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: NotificationsTypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
        ]);
        this._enableKeyEscapeToClosePanel(() => {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonCancel01);
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrMainMenuPanel, void 0);
    }

    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmMainMenuPanel, void 0);
    }

    private _onTouchedBtnMakeRequest(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WwMakeRequestWarsPanel, { filter: null });
    }

    private _onTouchedBtnHandleRequest(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WwHandleRequestWarsPanel, void 0);
    }

    private _onTouchedBtnDeleteWatcher(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WwDeleteWatcherWarsPanel, void 0);
    }

    private _onTouchedBtnContinueWar(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WwOngoingWarsPanel, void 0);
    }

    private _onTouchedBtnBack(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrMainMenuPanel, void 0);
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
        const languageType2 = LangUtils.getSecondaryLanguageType();
        this._labelMakeRequest1.setLangText(LangConstants.TextType.B0207);
        this._labelMakeRequest2.setLangText(LangConstants.TextType.B0207, languageType2);
        this._labelHandleRequest1.setLangText(LangConstants.TextType.B0208);
        this._labelHandleRequest2.setLangText(LangConstants.TextType.B0208, languageType2);
        this._labelDeleteWatcher1.setLangText(LangConstants.TextType.B0219);
        this._labelDeleteWatcher2.setLangText(LangConstants.TextType.B0219, languageType2);
        this._labelContinueWar1.setLangText(LangConstants.TextType.B1382);
        this._labelContinueWar2.setLangText(LangConstants.TextType.B1382, languageType2);
        this._labelBack1.setLangText(LangConstants.TextType.B0146);
        this._labelBack2.setLangText(LangConstants.TextType.B0146, languageType2);

        this._layoutMakeRequest.arrangeItems();
        this._layoutHandleRequest.arrangeItems();
        this._layoutDeleteWatcher.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutBack.arrangeItems();
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

    private _updateBtnHandleRequest(): void {
        this._btnHandleRequest.setRedVisible(!!WatchWarModelWwModel.getRequestedWarIdArray()?.length);
    }

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
            obj         : this._groupMakeRequest,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupHandleRequest,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 1,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupDeleteWatcher,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 2,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 3,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupBack,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 4 * 4,
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
            obj         : this._groupMakeRequest,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupHandleRequest,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupDeleteWatcher,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupBack,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await TimerTimerModel.wait();
    }
}
