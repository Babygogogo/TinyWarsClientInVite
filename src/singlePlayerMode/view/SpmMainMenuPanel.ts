import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { Tween } from "../../graphics/Constants.ts";
import { TextType } from "../../lang/Constants.ts";
import { getSecondaryLanguageType } from "../../lang/Utils.ts";
import { checkIsRedForMultiPlayer } from "../../lobby/model/LobbyModel.ts";
import { checkIsRedForMyMrwWars } from "../../multiPlayerWar/model/MpwModel.ts";
import { checkIsRed } from "../../multiRankRoom/model/MrrModel.ts";
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
    private readonly _groupLeft!                : IUiContainer;

    private readonly _groupCampaign!            : IUiContainer;
    private readonly _btnCampaign!              : IUiButton;
    private readonly _layoutCampaign!           : IUiLayout;
    private readonly _labelCampaign1!           : IUiLabel;
    private readonly _labelCampaign2!           : IUiLabel;

    private readonly _groupCreateWarRoom!       : IUiContainer;
    private readonly _btnCreateWarRoom!         : IUiButton;
    private readonly _layoutCreateWarRoom!      : IUiLayout;
    private readonly _labelCreateWarRoom1!      : IUiLabel;
    private readonly _labelCreateWarRoom2!      : IUiLabel;

    private readonly _groupCreateCustomWar!     : IUiContainer;
    private readonly _btnCreateCustomWar!       : IUiButton;
    private readonly _layoutCreateCustomWar!    : IUiLayout;
    private readonly _labelCreateCustomWar1!    : IUiLabel;
    private readonly _labelCreateCustomWar2!    : IUiLabel;

    private readonly _groupContinueWar!         : IUiContainer;
    private readonly _btnContinueWar!           : IUiButton;
    private readonly _layoutContinueWar!        : IUiLayout;
    private readonly _labelContinueWar1!        : IUiLabel;
    private readonly _labelContinueWar2!        : IUiLabel;

    private readonly _group!                    : IUiContainer;
    private readonly _btnMultiPlayer!           : IUiButton;
    private readonly _btnRanking!               : IUiButton;
    private readonly _btnSinglePlayer!          : IUiButton;

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
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetCreateCustomWarPublicInfoList },
            { type: TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
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
        openPanel(getDict().McrMainMenuPanel, void 0);
    }
    private _onTouchedBtnRanking(): void {
        this.closePanel();
        openPanel(getDict().MrrMainMenuPanel, void 0);
    }
    private _onTouchedBtnCampaign(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().CampaignCreateCampaignsPanel, void 0);
    }
    private _onTouchedBtnCreateWarRoom(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().SrrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnCreateCustomWar(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().ScrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnContinueWar(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().SpmWarListPanel, void 0);
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
        const languageType2 = getSecondaryLanguageType();
        this._labelCampaign1.setLangText(TextType.B1135);
        this._labelCampaign2.setLangText(TextType.B1135, languageType2);
        this._labelCreateWarRoom1.setLangText(TextType.B0614);
        this._labelCreateWarRoom2.setLangText(TextType.B0614, languageType2);
        this._labelCreateCustomWar1.setLangText(TextType.B0603);
        this._labelCreateCustomWar2.setLangText(TextType.B0603, languageType2);
        this._labelContinueWar1.setLangText(TextType.B0024);
        this._labelContinueWar2.setLangText(TextType.B0024, languageType2);

        this._layoutCampaign.arrangeItems();
        this._layoutCreateWarRoom.arrangeItems();
        this._layoutCreateCustomWar.arrangeItems();
        this._layoutContinueWar.arrangeItems();
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(
            (await checkIsRedForMyMrwWars())   ||
            (await checkIsRed())
        );
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
            obj         : this._groupCampaign,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
        });
        Executor.reset({
            obj         : this._groupCreateWarRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 66,
        });
        Executor.reset({
            obj         : this._groupCreateCustomWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 133,
        });
        Executor.reset({
            obj         : this._groupContinueWar,
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
            obj         : this._groupCampaign,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupCreateWarRoom,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupCreateCustomWar,
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
}
