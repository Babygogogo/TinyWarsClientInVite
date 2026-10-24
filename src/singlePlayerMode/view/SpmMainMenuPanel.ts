import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LobbyModelLobbyModel from "../../lobby/model/LobbyModel.ts";
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

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _groupLeft!                : UiInterfacesIUiContainer.IUiContainer;

    private readonly _groupCampaign!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnCampaign!              : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutCampaign!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCampaign1!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCampaign2!           : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCreateWarRoom!       : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnCreateWarRoom!         : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutCreateWarRoom!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCreateWarRoom1!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCreateWarRoom2!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupCreateCustomWar!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnCreateCustomWar!       : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutCreateCustomWar!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelCreateCustomWar1!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCreateCustomWar2!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupContinueWar!         : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnContinueWar!           : UiInterfacesIUiButton.IUiButton;
    private readonly _layoutContinueWar!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelContinueWar1!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelContinueWar2!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnMultiPlayer!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRanking!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSinglePlayer!          : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
            { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
            { ui: this._btnCampaign,        callback: this._onTouchedBtnCampaign },
            { ui: this._btnCreateWarRoom,   callback: this._onTouchedBtnCreateWarRoom },
            { ui: this._btnCreateCustomWar, callback: this._onTouchedBtnCreateCustomWar },
            { ui: this._btnContinueWar,     callback: this._onTouchedBtnContinueWar },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: NotificationsTypeId.TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: NotificationsTypeId.TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetCreateCustomWarPublicInfoList },
            { type: NotificationsTypeId.TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: NotificationsTypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().McrMainMenuPanel, void 0);
    }
    private _onTouchedBtnRanking(): void {
        this.closePanel();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MrrMainMenuPanel, void 0);
    }
    private _onTouchedBtnCampaign(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CampaignCreateCampaignsPanel, void 0);
    }
    private _onTouchedBtnCreateWarRoom(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SrrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnCreateCustomWar(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ScrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnContinueWar(): void {
        this.closePanel();
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyTopPanel);
        GamePanelsManager.closePanel(GamePanelsDict.getDict().LobbyBottomPanel);
        GamePanelsManager.openPanel(GamePanelsDict.getDict().SpmWarListPanel, void 0);
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
        const languageType2 = LangUtils.getSecondaryLanguageType();
        this._labelCampaign1.setLangText(LangConstants.TextType.B1135);
        this._labelCampaign2.setLangText(LangConstants.TextType.B1135, languageType2);
        this._labelCreateWarRoom1.setLangText(LangConstants.TextType.B0614);
        this._labelCreateWarRoom2.setLangText(LangConstants.TextType.B0614, languageType2);
        this._labelCreateCustomWar1.setLangText(LangConstants.TextType.B0603);
        this._labelCreateCustomWar2.setLangText(LangConstants.TextType.B0603, languageType2);
        this._labelContinueWar1.setLangText(LangConstants.TextType.B0024);
        this._labelContinueWar2.setLangText(LangConstants.TextType.B0024, languageType2);

        this._layoutCampaign.arrangeItems();
        this._layoutCreateWarRoom.arrangeItems();
        this._layoutCreateCustomWar.arrangeItems();
        this._layoutContinueWar.arrangeItems();
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await LobbyModelLobbyModel.checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(
            (await MultiPlayerWarModelMpwModel.checkIsRedForMyMrwWars())   ||
            (await MultiRankRoomModelMrrModel.checkIsRed())
        );
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
            obj         : this._groupCampaign,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupCreateWarRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 66,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupCreateCustomWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 133,
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContinueWar,
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
            obj         : this._groupCampaign,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupCreateWarRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupCreateCustomWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        TweenExecutor.Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await TimerTimerModel.wait();
    }
}
