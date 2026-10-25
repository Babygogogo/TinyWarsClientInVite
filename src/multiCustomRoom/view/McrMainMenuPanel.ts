import { checkIsRed } from "../../autoTourneys/rooms/Provider.ts";
import { checkIsRed as CoopCustomRoomModelCcrModelCheckIsRed } from "../../coopCustomRoom/model/CcrModel.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel, closePanel } from "../../gamePanels/Manager.ts";
import { Tween } from "../../graphics/Constants.ts";
import { checkIsAnyPromiseTrue } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getSecondaryLanguageType, getText } from "../../lang/Utils.ts";
import {
    openMultiPlayerModePanel,
    checkIsRedForMultiPlayer,
    checkIsRedForMultiCoopMode,
    checkIsRedForMultiFreeMode,
    checkIsRedForMultiMatchMode,
    checkIsRedForAutoTourneyMode,
} from "../../lobby/model/LobbyModel.ts";
import { checkIsRed as MultiCustomRoomModelMcrModelCheckIsRed } from "../model/McrModel.ts";
import { checkIsRed as MultiFreeRoomModelMfrModelCheckIsRed } from "../../multiFreeRoom/model/MfrModel.ts";
import { checkIsRed as MultiMatchRoomModelMmrModelCheckIsRed } from "../../multiMatchRoom/model/MmrModel.ts";
import { MultiPlayerRoomType } from "../../multiPlayerRooms/Constants.ts";
import { checkIsRedForMyMrwWars, checkIsRedForAllMyWars } from "../../multiPlayerWar/model/MpwModel.ts";
import { checkIsRed as MultiRankRoomModelMrrModelCheckIsRed } from "../../multiRankRoom/model/MrrModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { checkIsRed as WatchWarModelWwModelCheckIsRed } from "../../watchWar/model/WwModel.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _group!                : IUiContainer;
    private readonly _btnMultiPlayer!       : IUiButton;
    private readonly _btnRanking!           : IUiButton;
    private readonly _btnSinglePlayer!      : IUiButton;

    private readonly _groupLeft!            : IUiContainer;

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

    private readonly _groupWatchWar!        : IUiContainer;
    private readonly _btnWatchWar!          : IUiButton;
    private readonly _layoutWatchWar!       : IUiLayout;
    private readonly _labelWatchWar1!       : IUiLabel;
    private readonly _labelWatchWar2!       : IUiLabel;

    private readonly _groupReplayWar!       : IUiContainer;
    private readonly _btnReplayWar!         : IUiButton;
    private readonly _layoutReplayWar!      : IUiLayout;
    private readonly _labelReplayWar1!      : IUiLabel;
    private readonly _labelReplayWar2!      : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogout,                       callback: this._onNotifyMsgUserLogout },
            { type: TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetJoinedRoomIdArray },
            { type: TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
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
        openPanel(getDict().MrrMainMenuPanel, void 0);
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        openPanel(getDict().SpmMainMenuPanel, void 0);
    }
    private _onTouchedBtnCreateRoom(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().McrCreateMapListPanel, {
            mapFilter               : null,
            mapSorter               : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnJoinRoom(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        // PanelHelpers.open(PanelHelpers.PanelDict.McrJoinRoomListPanel, { filter: null });
        openPanel(getDict().MpwJoinRoomListPanel, { preferredRoomType: MultiPlayerRoomType.Mcr, filter: null });
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
    private _onTouchedBtnWatchWar(): void {
        this.closePanel();
        openPanel(getDict().WwMainMenuPanel, void 0);
    }
    private _onTouchedBtnReplayWar(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().RwReplayListPanel, {
            filter                  : null,
            usePreviousFilter       : true,
            usePreviousPageIndex    : true,
        });
    }
    private _onTouchedBtnMode(): void {
        openMultiPlayerModePanel(ModeId.Versus);
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
            waitTime    : 200 / 6 * 0,
        });
        Executor.reset({
            obj         : this._groupCreateRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 1,
        });
        Executor.reset({
            obj         : this._groupJoinRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 2,
        });
        Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 3,
        });
        Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 4,
        });
        Executor.reset({
            obj         : this._groupWatchWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 5,
        });
        Executor.reset({
            obj         : this._groupReplayWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 6,
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
        Executor.reset({
            obj         : this._groupWatchWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupReplayWar,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await wait();
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
        const languageType2 = getSecondaryLanguageType();
        this._labelMode1.setText(`${getText(TextType.B1378)}\n${getText(TextType.B1379)}: ${getText(TextType.B1011)}`);
        this._labelMode2.setText(`${getText(TextType.B1378, languageType2)}\n${getText(TextType.B1379, languageType2)}: ${getText(TextType.B1011, languageType2)}`);
        this._labelCreateRoom1.setLangText(TextType.B0000);
        this._labelCreateRoom2.setLangText(TextType.B0000, languageType2);
        this._labelJoinRoom1.setLangText(TextType.B0580);
        this._labelJoinRoom2.setLangText(TextType.B0580, languageType2);
        this._labelMyRoom1.setLangText(TextType.B0410);
        this._labelMyRoom2.setLangText(TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(TextType.B0024);
        this._labelContinueWar2.setLangText(TextType.B0024, languageType2);
        this._labelWatchWar1.setLangText(TextType.B0206);
        this._labelWatchWar2.setLangText(TextType.B0206, languageType2);
        this._labelReplayWar1.setLangText(TextType.B0092);
        this._labelReplayWar2.setLangText(TextType.B0092, languageType2);

        this._layoutMode.arrangeItems();
        this._layoutCreateRoom.arrangeItems();
        this._layoutJoinRoom.arrangeItems();
        this._layoutMyRoom.arrangeItems();
        this._layoutContinueWar.arrangeItems();
        this._layoutWatchWar.arrangeItems();
        this._layoutReplayWar.arrangeItems();
    }

    private async _updateBtnMultiPlayer(): Promise<void> {
        this._btnMultiPlayer.setRedVisible(await checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(
            (await checkIsRedForMyMrwWars()) ||
            (await MultiRankRoomModelMrrModelCheckIsRed())
        );
    }

    private async _updateBtnMyRoom(): Promise<void> {
        this._btnMyRoom.setRedVisible(await checkIsAnyPromiseTrue([
            MultiCustomRoomModelMcrModelCheckIsRed(),
            CoopCustomRoomModelCcrModelCheckIsRed(),
            MultiFreeRoomModelMfrModelCheckIsRed(),
            MultiRankRoomModelMrrModelCheckIsRed(),
            MultiMatchRoomModelMmrModelCheckIsRed(),
            checkIsRed()
        ]));
    }

    private async _updateBtnContinueWar(): Promise<void> {
        // this._btnContinueWar.setRedVisible(await MultiPlayerWar.MpwModel.checkIsRedForMyMcwWars());
        this._btnContinueWar.setRedVisible(await checkIsRedForAllMyWars());
    }

    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await checkIsAnyPromiseTrue([
            checkIsRedForMultiCoopMode(),
            checkIsRedForMultiFreeMode(),
            checkIsRedForMultiMatchMode(),
            checkIsRedForAutoTourneyMode(),
        ]));
    }

    private async _updateBtnWatchWar(): Promise<void> {
        this._btnWatchWar.setRedVisible(await WatchWarModelWwModelCheckIsRed());
    }
}
