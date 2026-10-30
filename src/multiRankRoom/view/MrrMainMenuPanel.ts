import { showLang } from "../../FloatText.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../gamePanels/Manager.ts";
import { Tween } from "../../graphics/Constants.ts";
import { checkIsAnyPromiseTrue } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getSecondaryLanguageType,
    getText,
} from "../../lang/Utils.ts";
import {
    openMultiPlayerModePanel,
    checkIsRedForMultiPlayer,
    checkIsRedForMultiCoopMode,
    checkIsRedForMultiMatchMode,
    checkIsRedForMultiFreeMode,
    checkIsRedForMultiCustomMode,
    checkIsRedForAutoTourneyMode,
} from "../../lobby/model/LobbyModel.ts";
import { checkIsRedForMyMrwWars } from "../../multiPlayerWar/model/MpwModel.ts";
import { checkIsRed } from "../model/MrrModel.ts";
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

    private readonly _groupSetGameNumber!   : IUiContainer;
    private readonly _btnSetGameNumber!     : IUiButton;
    private readonly _layoutSetGameNumber!  : IUiLayout;
    private readonly _labelSetGameNumber1!  : IUiLabel;
    private readonly _labelSetGameNumber2!  : IUiLabel;

    private readonly _groupBanMap!          : IUiContainer;
    private readonly _btnBanMap!            : IUiButton;
    private readonly _layoutBanMap!         : IUiLayout;
    private readonly _labelBanMap1!         : IUiLabel;
    private readonly _labelBanMap2!         : IUiLabel;

    private readonly _groupSetTimer!        : IUiContainer;
    private readonly _btnSetTimer!          : IUiButton;
    private readonly _layoutSetTimer!       : IUiLayout;
    private readonly _labelSetTimer1!       : IUiLabel;
    private readonly _labelSetTimer2!       : IUiLabel;

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

    private readonly _groupPreviewStdMaps!  : IUiContainer;
    private readonly _btnPreviewStdMaps!    : IUiButton;
    private readonly _layoutPreviewStdMaps! : IUiLayout;
    private readonly _labelPreviewStdMaps1! : IUiLabel;
    private readonly _labelPreviewStdMaps2! : IUiLabel;

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
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogout,                       callback: this._onMsgUserLogout },
            { type: TypeId.MsgMrrGetRoomPublicInfo,             callback: this._onMsgMrrGetRoomPublicInfo },
            { type: TypeId.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetJoinedRoomIdArray },
            { type: TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
            { type: TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
            { type: TypeId.MsgMrrSetBootTimerDaysRange,         callback: this._onMsgMrrSetBootTimerDaysRange },
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
        openPanel(getDict().McrMainMenuPanel, void 0);
    }
    private _onTouchedBtnSinglePlayer(): void {
        this.closePanel();
        openPanel(getDict().SpmMainMenuPanel, void 0);
    }
    private _onTouchedBtnSetGameNumber(): void {
        openPanel(getDict().MrrSetMaxConcurrentCountPanel, void 0);
    }
    private _onTouchedBtnBanMap(): void {
        openPanel(getDict().MrrBanMapPanel, void 0);
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
    private _onTouchedBtnPreviewStdMaps(): void {
        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().MrrPreviewMapListPanel, { hasFog: false });
    }
    private _onTouchedBtnMode(): void {
        openMultiPlayerModePanel(ModeId.RankedMatch);
    }
    private _onTouchedBtnSetTimer(): void {
        openPanel(getDict().MrrSetTimerPanel, void 0);
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
        showLang(TextType.OperationSucceeded);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
        this._updateComponentsForRed();
    }

    private _updateComponentsForLanguage(): void {
        const languageType2 = getSecondaryLanguageType();
        this._labelMode1.setText(`${getText(TextType.B1378)}\n${getText(TextType.B1379)}: ${getText(TextType.B0404)}`);
        this._labelMode2.setText(`${getText(TextType.B1378, languageType2)}\n${getText(TextType.B1379, languageType2)}: ${getText(TextType.B0404, languageType2)}`);
        this._labelSetGameNumber1.setLangText(TextType.B0413);
        this._labelSetGameNumber2.setLangText(TextType.B0413, languageType2);
        this._labelBanMap1.setLangText(TextType.B0084);
        this._labelBanMap2.setLangText(TextType.B0084, languageType2);
        this._labelSetTimer1.setLangText(TextType.B1284);
        this._labelSetTimer2.setLangText(TextType.B1284, languageType2);
        this._labelMyRoom1.setLangText(TextType.B0410);
        this._labelMyRoom2.setLangText(TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(TextType.B0024);
        this._labelContinueWar2.setLangText(TextType.B0024, languageType2);
        this._labelPreviewStdMaps1.setLangText(TextType.B0594);
        this._labelPreviewStdMaps2.setLangText(TextType.B0594, languageType2);

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

        this._btnMyRoom.setRedVisible(await checkIsRed());
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

    private async _updateBtnContinueWar(): Promise<void> {
        this._btnContinueWar.setRedVisible(await checkIsRedForMyMrwWars());
    }

    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await checkIsAnyPromiseTrue([
            checkIsRedForMultiCoopMode(),
            checkIsRedForMultiMatchMode(),
            checkIsRedForMultiFreeMode(),
            checkIsRedForMultiCustomMode(),
            checkIsRedForAutoTourneyMode(),
        ]));
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
            obj         : this._groupMode,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 0,
        });
        Executor.reset({
            obj         : this._groupSetGameNumber,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 1,
        });
        Executor.reset({
            obj         : this._groupBanMap,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 2,
        });
        Executor.reset({
            obj         : this._groupSetTimer,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 3,
        });
        Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 4,
        });
        Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 6 * 5,
        });
        Executor.reset({
            obj         : this._groupPreviewStdMaps,
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
            obj         : this._groupSetGameNumber,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupBanMap,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupSetTimer,
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
            obj         : this._groupPreviewStdMaps,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await wait();
    }
}
