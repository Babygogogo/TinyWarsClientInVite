import * as FloatText2 from "../../FloatText.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LobbyModelLobbyModel from "../../lobby/model/LobbyModel.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as MultiRankRoomModelMrrModel from "../model/MrrModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnMultiPlayer!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRanking!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSinglePlayer!      : UiInterfacesIUiButton.IUiButton;

    private readonly _groupLeft!            : UiInterfacesIUiContainer.IUiContainer;

    private readonly _groupMode!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnMode!              : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutMode!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMode1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMode2!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupSetGameNumber!   : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSetGameNumber!     : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutSetGameNumber!  : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSetGameNumber1!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSetGameNumber2!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupBanMap!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnBanMap!            : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutBanMap!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelBanMap1!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelBanMap2!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupSetTimer!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSetTimer!          : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutSetTimer!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSetTimer1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSetTimer2!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupMyRoom!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnMyRoom!            : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutMyRoom!         : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMyRoom1!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMyRoom2!         : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupContinueWar!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnContinueWar!       : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutContinueWar!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelContinueWar1!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelContinueWar2!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupPreviewStdMaps!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnPreviewStdMaps!    : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutPreviewStdMaps! : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPreviewStdMaps1! : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPreviewStdMaps2! : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
            { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
            { ui: this._btnSetGameNumber,   callback: this._onTouchedBtnSetGameNumber },
            { ui: this._btnBanMap,          callback: this._onTouchedBtnBanMap },
            { ui: this._btnSetTimer,        callback: this._onTouchedBtnSetTimer },
            { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
            { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
            { ui: this._btnPreviewStdMaps,  callback: this._onTouchedBtnPreviewStdMaps },
            { ui: this._btnMode,            callback: this._onTouchedBtnMode },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: NotificationsTypeId.TypeId.MsgMrrGetRoomPublicInfo,             callback: this._onMsgMrrGetRoomPublicInfo },
            { type: NotificationsTypeId.TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetJoinedRoomIdArray },
            { type: NotificationsTypeId.TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
            { type: NotificationsTypeId.TypeId.MsgMrrSetBootTimerDaysRange,         callback: this._onMsgMrrSetBootTimerDaysRange },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnMultiPlayer(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrMainMenuPanel, void 0);
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmMainMenuPanel, void 0);
    }
    private _onTouchedBtnSetGameNumber(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrSetMaxConcurrentCountPanel, void 0);
    }
    private _onTouchedBtnBanMap(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrBanMapPanel, void 0);
    }
    private _onTouchedBtnMyRoom(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyRoomListPanel, void 0);
    }
    private _onTouchedBtnContinueWar(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwMyWarListPanel, void 0);
    }
    private _onTouchedBtnPreviewStdMaps(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrPreviewMapListPanel, { hasFog: false });
    }
    private _onTouchedBtnMode(): void {
        LobbyModelLobbyModel.openMultiPlayerModePanel(GameModesConstants.ModeId.RankedMatch);
    }
    private _onTouchedBtnSetTimer(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrSetTimerPanel, void 0);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgUserLogout(): void {
        this.closePanel();
    }
    private _onMsgMrrGetRoomPublicInfo(): void {
        this._updateComponentsForRed();
    }
    private _onMsgMrrGetJoinedRoomIdArray(): void {
        this._updateComponentsForRed();
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
    private _onMsgMpwCommonGetWarProgressInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnContinueWar();
    }
    private _onMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnMultiPlayer();
    }
    private _onMsgMrrSetBootTimerDaysRange(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForRed();
    }

    private _updateComponentsForLanguage(): void {
        const languageType2 = LangUtils.getSecondaryLanguageType();
        this._labelMode1.setText(`${LangUtils.getText(LangConstants.TextType.B1378)}\n${LangUtils.getText(LangConstants.TextType.B1379)}: ${LangUtils.getText(LangConstants.TextType.B0404)}`);
        this._labelMode2.setText(`${LangUtils.getText(LangConstants.TextType.B1378, languageType2)}\n${LangUtils.getText(LangConstants.TextType.B1379, languageType2)}: ${LangUtils.getText(LangConstants.TextType.B0404, languageType2)}`);
        this._labelSetGameNumber1.setLangText(LangConstants.TextType.B0413);
        this._labelSetGameNumber2.setLangText(LangConstants.TextType.B0413, languageType2);
        this._labelBanMap1.setLangText(LangConstants.TextType.B0084);
        this._labelBanMap2.setLangText(LangConstants.TextType.B0084, languageType2);
        this._labelSetTimer1.setLangText(LangConstants.TextType.B1284);
        this._labelSetTimer2.setLangText(LangConstants.TextType.B1284, languageType2);
        this._labelMyRoom1.setLangText(LangConstants.TextType.B0410);
        this._labelMyRoom2.setLangText(LangConstants.TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(LangConstants.TextType.B0024);
        this._labelContinueWar2.setLangText(LangConstants.TextType.B0024, languageType2);
        this._labelPreviewStdMaps1.setLangText(LangConstants.TextType.B0594);
        this._labelPreviewStdMaps2.setLangText(LangConstants.TextType.B0594, languageType2);

        this._layoutMode.arrangeItems();
        this._layoutSetGameNumber.arrangeItems();
        this._layoutBanMap.arrangeItems();
        this._layoutSetTimer.arrangeItems();
        this._layoutMyRoom.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutPreviewStdMaps.arrangeItems();
    }

    private async _updateComponentsForRed(): Promise<void> {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnContinueWar();
        this._updateBtnMode();

        this._btnMyRoom.setRedVisible(await MultiRankRoomModelMrrModel.checkIsRed());
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

    private async _updateBtnContinueWar(): Promise<void> {
        this._btnContinueWar.setRedVisible(await MultiPlayerWarModelMpwModel.checkIsRedForMyMrwWars());
    }

    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await HelpersMisc.checkIsAnyPromiseTrue([
            LobbyModelLobbyModel.checkIsRedForMultiCoopMode(),
            LobbyModelLobbyModel.checkIsRedForMultiMatchMode(),
            LobbyModelLobbyModel.checkIsRedForMultiFreeMode(),
            LobbyModelLobbyModel.checkIsRedForMultiCustomMode(),
            LobbyModelLobbyModel.checkIsRedForAutoTourneyMode(),
        ]));
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
            obj         : this._groupMode,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 0,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSetGameNumber,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 1,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupBanMap,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 2,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSetTimer,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 3,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 4,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 5,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupPreviewStdMaps,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 6,
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
            obj         : this._groupMode,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSetGameNumber,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupBanMap,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupSetTimer,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupPreviewStdMaps,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await TimerTimerModel.wait();
    }
}
