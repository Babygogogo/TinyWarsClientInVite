import * as AutoTourneysConstants from "../../Constants.ts";
import * as AutoTourneysMainsProvider from "../../mains/Provider.ts";
import * as AutoTourneysRoomsProvider from "../Provider.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GameModesConstants from "../../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../../graphics/Constants.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as LobbyModelLobbyModel from "../../../lobby/model/LobbyModel.ts";
import * as MultiPlayerWarModelMpwModel from "../../../multiPlayerWar/model/MpwModel.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import * as TimerTimerModel from "../../../timer/TimerModel.ts";
import * as TweenExecutor from "../../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../../ui/interfaces/IUiLayout.ts";

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

    private readonly _groupRegister!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnRegister!          : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutRegister!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelRegister1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRegister2!       : UiInterfacesIUiLabel.IUiLabel;

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

    private readonly _groupPreviewMaps!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnPreviewMaps!       : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutPreviewMaps!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelPreviewMaps1!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPreviewMaps2!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupTourneyInfo!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnTourneyInfo!       : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutTourneyInfo!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTourneyInfo1!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTourneyInfo2!    : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
            { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
            { ui: this._btnRegister,        callback: this._onTouchedBtnRegister },
            { ui: this._btnMyRoom,          callback: this._onTouchedBtnMyRoom },
            { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
            { ui: this._btnPreviewMaps,     callback: this._onTouchedBtnPreviewMaps },
            { ui: this._btnTourneyInfo,     callback: this._onTouchedBtnTourneyInfo },
            { ui: this._btnMode,            callback: this._onTouchedBtnMode },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserLogout,                       callback: this._onNotifyMsgUserLogout },
            { type: NotificationsTypeId.TypeId.MsgAtrGetRoomPublicInfo,             callback: this._onNotifyMsgAtrGetRoomPublicInfo },
            { type: NotificationsTypeId.TypeId.MsgAtrGetJoinedRoomIdArray,          callback: this._onNotifyMsgAtrGetJoinedRoomIdArray },
            { type: NotificationsTypeId.TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onNotifyMsgMpwCommonGetWarProgressInfo },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onNotifyMsgMpwWatchGetRequestedWarIdArray },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrMainMenuPanel, void 0);
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmMainMenuPanel, void 0);
    }
    private async _onTouchedBtnRegister(): Promise<void> {
        const tourneyIdArray = (await AutoTourneysMainsProvider.getSinglePhaseInfoArrayForPhase(AutoTourneysConstants.PhaseId.Registration))?.map(v => v.getTourneyId() ?? 0) ?? [];
        if (tourneyIdArray.length <= 0) {
            FloatText2.showLang(LangConstants.TextType.A0403);
        } else {
            for (const tourneyId of tourneyIdArray) {
                AutoTourneysMainsProvider.setIsNotifiedForRegistration(tourneyId, true);
            }

            this._updateBtnRegister();
            GamePanelsManager.openPanel(GamePanelsDict.getDict().AtRegisterPanel, void 0);
        }
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
    private async _onTouchedBtnPreviewMaps(): Promise<void> {
        const tourneyIdArray = (await AutoTourneysMainsProvider.getAtPhaseInfo())?.infoArray.map(v => v.getTourneyId() ?? 0) ?? [];
        if (tourneyIdArray.length <= 0) {
            FloatText2.showLang(LangConstants.TextType.B0278);
            return;
        }

        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().AtrPreviewMapListPanel, { tourneyId: Math.max(...tourneyIdArray) });
    }
    private async _onTouchedBtnTourneyInfo(): Promise<void> {
        if ((await AutoTourneysMainsProvider.getLastTourneyId()) == null) {
            FloatText2.showLang(LangConstants.TextType.B0278);
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().AtTourneyInfoPanel, void 0);
        }
    }
    private _onTouchedBtnMode(): void {
        LobbyModelLobbyModel.openMultiPlayerModePanel(GameModesConstants.ModeId.AutoTourney);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgUserLogout(): void {
        this.closePanel();
    }
    private _onNotifyMsgAtrGetRoomPublicInfo(): void {
        this._updateComponentsForRed();
    }
    private _onNotifyMsgAtrGetJoinedRoomIdArray(): void {
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
    private _onNotifyMsgMpwCommonGetWarProgressInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnContinueWar();
    }
    private _onNotifyMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnMultiPlayer();
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
        this._labelMode1.setText(`${LangUtils.getText(LangConstants.TextType.B1378)}\n${LangUtils.getText(LangConstants.TextType.B1379)}: ${LangUtils.getText(LangConstants.TextType.B1022)}`);
        this._labelMode2.setText(`${LangUtils.getText(LangConstants.TextType.B1378, languageType2)}\n${LangUtils.getText(LangConstants.TextType.B1379, languageType2)}: ${LangUtils.getText(LangConstants.TextType.B1022, languageType2)}`);
        this._labelRegister1.setText(LangUtils.getText(LangConstants.TextType.B1380));
        this._labelRegister2.setText(LangUtils.getText(LangConstants.TextType.B1380, languageType2));
        this._labelMyRoom1.setText(LangUtils.getText(LangConstants.TextType.B0410));
        this._labelMyRoom2.setText(LangUtils.getText(LangConstants.TextType.B0410, languageType2));
        this._labelContinueWar1.setText(LangUtils.getText(LangConstants.TextType.B0024));
        this._labelContinueWar2.setText(LangUtils.getText(LangConstants.TextType.B0024, languageType2));
        this._labelPreviewMaps1.setText(LangUtils.getText(LangConstants.TextType.B0594));
        this._labelPreviewMaps2.setText(LangUtils.getText(LangConstants.TextType.B0594, languageType2));
        this._labelTourneyInfo1.setText(LangUtils.getText(LangConstants.TextType.B1381));
        this._labelTourneyInfo2.setText(LangUtils.getText(LangConstants.TextType.B1381, languageType2));

        this._layoutMode.arrangeItems();
        this._layoutRegister.arrangeItems();
        this._layoutMyRoom.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutPreviewMaps.arrangeItems();
        this._layoutTourneyInfo.arrangeItems();
    }

    private _updateComponentsForRed(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnContinueWar();
        this._updateBtnMyRoom();
        this._updateBtnRegister();
        this._updateBtnMode();
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await LobbyModelLobbyModel.checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(await LobbyModelLobbyModel.checkIsRedForRankedMode());
    }

    private async _updateBtnContinueWar(): Promise<void> {
        this._btnContinueWar.setRedVisible(await MultiPlayerWarModelMpwModel.checkIsRedForMyAtwWars());
    }

    private async _updateBtnMyRoom(): Promise<void> {
        this._btnMyRoom.setRedVisible(await AutoTourneysRoomsProvider.checkIsRed());
    }

    private async _updateBtnRegister(): Promise<void> {
        this._btnRegister.setRedVisible(await AutoTourneysMainsProvider.checkIsRedForRegistration());
    }

    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await HelpersMisc.checkIsAnyPromiseTrue([
            LobbyModelLobbyModel.checkIsRedForMultiCoopMode(),
            LobbyModelLobbyModel.checkIsRedForMultiFreeMode(),
            LobbyModelLobbyModel.checkIsRedForMultiCustomMode(),
            LobbyModelLobbyModel.checkIsRedForMultiMatchMode(),
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
            waitTime    : 200 / 5 * 0,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupRegister,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 1,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 2,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 3,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupPreviewMaps,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 4,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTourneyInfo,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 5,
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
            obj         : this._groupRegister,
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
            obj         : this._groupPreviewMaps,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupTourneyInfo,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await TimerTimerModel.wait();
    }
}
