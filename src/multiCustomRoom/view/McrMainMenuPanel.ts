import * as AutoTourneysRoomsProvider from "../../autoTourneys/rooms/Provider.ts";
import * as CoopCustomRoomModelCcrModel from "../../coopCustomRoom/model/CcrModel.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LobbyModelLobbyModel from "../../lobby/model/LobbyModel.ts";
import * as MultiCustomRoomModelMcrModel from "../model/McrModel.ts";
import * as MultiFreeRoomModelMfrModel from "../../multiFreeRoom/model/MfrModel.ts";
import * as MultiMatchRoomModelMmrModel from "../../multiMatchRoom/model/MmrModel.ts";
import * as MultiPlayerRoomsConstants from "../../multiPlayerRooms/Constants.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as MultiRankRoomModelMrrModel from "../../multiRankRoom/model/MrrModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as WatchWarModelWwModel from "../../watchWar/model/WwModel.ts";

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

    private readonly _groupCreateRoom!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnCreateRoom!        : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutCreateRoom!     : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCreateRoom1!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCreateRoom2!     : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupJoinRoom!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnJoinRoom!          : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutJoinRoom!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelJoinRoom1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelJoinRoom2!       : UiInterfacesIUiLabel.IUiLabel;

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

    private readonly _groupWatchWar!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnWatchWar!          : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutWatchWar!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelWatchWar1!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWatchWar2!       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupReplayWar!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnReplayWar!         : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutReplayWar!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelReplayWar1!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelReplayWar2!      : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserLogout,                       callback: this._onNotifyMsgUserLogout },
            { type: NotificationsTypeId.TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetJoinedRoomIdArray },
            { type: NotificationsTypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnRanking,                 callback: this._onTouchedBtnRanking },
            { ui: this._btnSinglePlayer,            callback: this._onTouchedBtnSinglePlayer },
            { ui: this._btnCreateRoom,              callback: this._onTouchedBtnCreateRoom },
            { ui: this._btnJoinRoom,                callback: this._onTouchedBtnJoinRoom },
            { ui: this._btnMyRoom,                  callback: this._onTouchedBtnMyRoom },
            { ui: this._btnContinueWar,             callback: this._onTouchedBtnContinueWar },
            { ui: this._btnWatchWar,                callback: this._onTouchedBtnWatchWar },
            { ui: this._btnReplayWar,               callback: this._onTouchedBtnReplayWar },
            { ui: this._btnMode,                    callback: this._onTouchedBtnMode },
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
    private _onTouchedBtnRanking(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrMainMenuPanel, void 0);
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmMainMenuPanel, void 0);
    }
    private _onTouchedBtnCreateRoom(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnJoinRoom(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        // PanelHelpers.open(PanelHelpers.PanelDict.McrJoinRoomListPanel, { filter: null });
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MpwJoinRoomListPanel, { preferredRoomType: MultiPlayerRoomsConstants.MultiPlayerRoomType.Mcr, filter: null });
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
    private _onTouchedBtnWatchWar(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WwMainMenuPanel, void 0);
    }
    private _onTouchedBtnReplayWar(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().RwReplayListPanel, {
            filter                  : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnMode(): void {
        LobbyModelLobbyModel.openMultiPlayerModePanel(GameModesConstants.ModeId.Versus);
    }

    private _onNotifyMsgUserLogout(): void {
        this.closePanel();
    }
    private _onNotifyMsgMcrGetRoomPlayerInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnMyRoom();
    }
    private _onNotifyMsgMfrGetRoomPlayerInfo(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnMode();
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
        this._updateBtnContinueWar();
        this._updateBtnMode();
    }
    private _onMsgMpwWatchGetRequestedWarIdArray(): void {
        this._updateBtnMultiPlayer();
        this._updateBtnWatchWar();
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
            obj         : this._groupMode,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 0,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupCreateRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 1,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupJoinRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 2,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 3,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 4,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupWatchWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 5,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupReplayWar,
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
            obj         : this._groupCreateRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupJoinRoom,
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
            obj         : this._groupWatchWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupReplayWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await TimerTimerModel.wait();
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateBtnMultiPlayer();
        this._updateBtnRanking();
        this._updateBtnMyRoom();
        this._updateBtnContinueWar();
        this._updateBtnMode();
        this._updateBtnWatchWar();
    }

    private _updateComponentsForLanguage(): void {
        const languageType2 = LangUtils.getSecondaryLanguageType();
        this._labelMode1.setText(`${LangUtils.getText(LangConstants.TextType.B1378)}\n${LangUtils.getText(LangConstants.TextType.B1379)}: ${LangUtils.getText(LangConstants.TextType.B1011)}`);
        this._labelMode2.setText(`${LangUtils.getText(LangConstants.TextType.B1378, languageType2)}\n${LangUtils.getText(LangConstants.TextType.B1379, languageType2)}: ${LangUtils.getText(LangConstants.TextType.B1011, languageType2)}`);
        this._labelCreateRoom1.setLangText(LangConstants.TextType.B0000);
        this._labelCreateRoom2.setLangText(LangConstants.TextType.B0000, languageType2);
        this._labelJoinRoom1.setLangText(LangConstants.TextType.B0580);
        this._labelJoinRoom2.setLangText(LangConstants.TextType.B0580, languageType2);
        this._labelMyRoom1.setLangText(LangConstants.TextType.B0410);
        this._labelMyRoom2.setLangText(LangConstants.TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(LangConstants.TextType.B0024);
        this._labelContinueWar2.setLangText(LangConstants.TextType.B0024, languageType2);
        this._labelWatchWar1.setLangText(LangConstants.TextType.B0206);
        this._labelWatchWar2.setLangText(LangConstants.TextType.B0206, languageType2);
        this._labelReplayWar1.setLangText(LangConstants.TextType.B0092);
        this._labelReplayWar2.setLangText(LangConstants.TextType.B0092, languageType2);

        this._layoutMode.arrangeItems();
        this._layoutCreateRoom.arrangeItems();
        this._layoutJoinRoom.arrangeItems();
        this._layoutMyRoom.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutWatchWar.arrangeItems();
        this._layoutReplayWar.arrangeItems();
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

    private async _updateBtnMyRoom(): Promise<void> {
        this._btnMyRoom.setRedVisible(await HelpersMisc.checkIsAnyPromiseTrue([
            MultiCustomRoomModelMcrModel.checkIsRed(),
            CoopCustomRoomModelCcrModel.checkIsRed(),
            MultiFreeRoomModelMfrModel.checkIsRed(),
            MultiRankRoomModelMrrModel.checkIsRed(),
            MultiMatchRoomModelMmrModel.checkIsRed(),
            AutoTourneysRoomsProvider.checkIsRed()
        ]));
    }

    private async _updateBtnContinueWar(): Promise<void> {
        // this._btnContinueWar.setRedVisible(await MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars());
        this._btnContinueWar.setRedVisible(await MultiPlayerWarModelMpwModel.checkIsRedForAllMyWars());
    }

    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await HelpersMisc.checkIsAnyPromiseTrue([
            LobbyModelLobbyModel.checkIsRedForMultiCoopMode(),
            LobbyModelLobbyModel.checkIsRedForMultiFreeMode(),
            LobbyModelLobbyModel.checkIsRedForMultiMatchMode(),
            LobbyModelLobbyModel.checkIsRedForAutoTourneyMode(),
        ]));
    }

    private async _updateBtnWatchWar(): Promise<void> {
        this._btnWatchWar.setRedVisible(await WatchWarModelWwModel.checkIsRed());
    }
}
