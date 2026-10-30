import { PhaseId } from "../../Constants.ts";
import {
    getSinglePhaseInfoArrayForPhase,
    setIsNotifiedForRegistration,
    getAtPhaseInfo,
    getLastTourneyId,
    checkIsRedForRegistration,
} from "../../mains/Provider.ts";
import { checkIsRed } from "../Provider.ts";
import { showLang } from "../../../FloatText.ts";
import { ModeId } from "../../../gameModes/Constants.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../../gamePanels/Manager.ts";
import { Tween } from "../../../graphics/Constants.ts";
import { checkIsAnyPromiseTrue } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getSecondaryLanguageType,
    getText,
} from "../../../lang/Utils.ts";
import {
    openMultiPlayerModePanel,
    checkIsRedForMultiPlayer,
    checkIsRedForRankedMode,
    checkIsRedForMultiCoopMode,
    checkIsRedForMultiFreeMode,
    checkIsRedForMultiCustomMode,
    checkIsRedForMultiMatchMode,
} from "../../../lobby/model/LobbyModel.ts";
import { checkIsRedForMyAtwWars } from "../../../multiPlayerWar/model/MpwModel.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import { wait } from "../../../timer/TimerModel.ts";
import { Executor } from "../../../tween/Executor.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../../ui/interfaces/IUiLayout.ts";

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

    private readonly _groupRegister!        : IUiContainer;
    private readonly _btnRegister!          : IUiButton;
    private readonly _layoutRegister!       : IUiLayout;
    private readonly _labelRegister1!       : IUiLabel;
    private readonly _labelRegister2!       : IUiLabel;

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

    private readonly _groupPreviewMaps!     : IUiContainer;
    private readonly _btnPreviewMaps!       : IUiButton;
    private readonly _layoutPreviewMaps!    : IUiLayout;
    private readonly _labelPreviewMaps1!    : IUiLabel;
    private readonly _labelPreviewMaps2!    : IUiLabel;

    private readonly _groupTourneyInfo!     : IUiContainer;
    private readonly _btnTourneyInfo!       : IUiButton;
    private readonly _layoutTourneyInfo!    : IUiLayout;
    private readonly _labelTourneyInfo1!    : IUiLabel;
    private readonly _labelTourneyInfo2!    : IUiLabel;

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
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogout,                       callback: this._onNotifyMsgUserLogout },
            { type: TypeId.MsgAtrGetRoomPublicInfo,             callback: this._onNotifyMsgAtrGetRoomPublicInfo },
            { type: TypeId.MsgAtrGetJoinedRoomIdArray,          callback: this._onNotifyMsgAtrGetJoinedRoomIdArray },
            { type: TypeId.MsgMcrGetRoomPlayerInfo,             callback: this._onNotifyMsgMcrGetRoomPlayerInfo },
            { type: TypeId.MsgMfrGetRoomPlayerInfo,             callback: this._onNotifyMsgMfrGetRoomPlayerInfo },
            { type: TypeId.MsgCcrGetRoomPlayerInfo,             callback: this._onNotifyMsgCcrGetRoomPlayerInfo },
            { type: TypeId.MsgMpwCommonGetWarProgressInfo,      callback: this._onNotifyMsgMpwCommonGetWarProgressInfo },
            { type: TypeId.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onNotifyMsgMpwWatchGetRequestedWarIdArray },
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
    private async _onTouchedBtnRegister(): Promise<void> {
        const tourneyIdArray = (await getSinglePhaseInfoArrayForPhase(PhaseId.Registration))?.map(v => v.getTourneyId());
        if (tourneyIdArray.length <= 0) {
            showLang(TextType.A0403);
        } else {
            for (const tourneyId of tourneyIdArray) {
                setIsNotifiedForRegistration(tourneyId, true);
            }

            this._updateBtnRegister();
            openPanel(getDict().AtRegisterPanel, void 0);
        }
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
    private async _onTouchedBtnPreviewMaps(): Promise<void> {
        const tourneyIdArray = (await getAtPhaseInfo())?.infoArray.map(v => v.getTourneyId()) ?? [];
        if (tourneyIdArray.length <= 0) {
            showLang(TextType.B0278);
            return;
        }

        this.closePanel();
        closePanel(getDict().LobbyTopPanel);
        closePanel(getDict().LobbyBottomPanel);
        openPanel(getDict().AtrPreviewMapListPanel, { tourneyId: Math.max(...tourneyIdArray) });
    }
    private async _onTouchedBtnTourneyInfo(): Promise<void> {
        if ((await getLastTourneyId()) == null) {
            showLang(TextType.B0278);
        } else {
            openPanel(getDict().AtTourneyInfoPanel, void 0);
        }
    }
    private _onTouchedBtnMode(): void {
        openMultiPlayerModePanel(ModeId.AutoTourney);
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
        const languageType2 = getSecondaryLanguageType();
        this._labelMode1.setText(`${getText(TextType.B1378)}\n${getText(TextType.B1379)}: ${getText(TextType.B1022)}`);
        this._labelMode2.setText(`${getText(TextType.B1378, languageType2)}\n${getText(TextType.B1379, languageType2)}: ${getText(TextType.B1022, languageType2)}`);
        this._labelRegister1.setLangText(TextType.B1380);
        this._labelRegister2.setLangText(TextType.B1380, languageType2);
        this._labelMyRoom1.setLangText(TextType.B0410);
        this._labelMyRoom2.setLangText(TextType.B0410, languageType2);
        this._labelContinueWar1.setLangText(TextType.B0024);
        this._labelContinueWar2.setLangText(TextType.B0024, languageType2);
        this._labelPreviewMaps1.setLangText(TextType.B0594);
        this._labelPreviewMaps2.setLangText(TextType.B0594, languageType2);
        this._labelTourneyInfo1.setLangText(TextType.B1381);
        this._labelTourneyInfo2.setLangText(TextType.B1381, languageType2);

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
        this._btnMultiPlayer.setRedVisible(await checkIsRedForMultiPlayer());
    }

    private async _updateBtnRanking(): Promise<void> {
        this._btnRanking.setRedVisible(await checkIsRedForRankedMode());
    }

    private async _updateBtnContinueWar(): Promise<void> {
        this._btnContinueWar.setRedVisible(await checkIsRedForMyAtwWars());
    }

    private async _updateBtnMyRoom(): Promise<void> {
        this._btnMyRoom.setRedVisible(await checkIsRed());
    }

    private async _updateBtnRegister(): Promise<void> {
        this._btnRegister.setRedVisible(await checkIsRedForRegistration());
    }

    private async _updateBtnMode(): Promise<void> {
        this._btnMode.setRedVisible(await checkIsAnyPromiseTrue([
            checkIsRedForMultiCoopMode(),
            checkIsRedForMultiFreeMode(),
            checkIsRedForMultiCustomMode(),
            checkIsRedForMultiMatchMode(),
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
            waitTime    : 200 / 5 * 0,
        });
        Executor.reset({
            obj         : this._groupRegister,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 1,
        });
        Executor.reset({
            obj         : this._groupMyRoom,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 2,
        });
        Executor.reset({
            obj         : this._groupContinueWar,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 3,
        });
        Executor.reset({
            obj         : this._groupPreviewMaps,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 4,
        });
        Executor.reset({
            obj         : this._groupTourneyInfo,
            beginProps  : { customAlpha: 0, customX: -40 },
            endProps    : { customAlpha: 1, customX: 0 },
            waitTime    : 200 / 5 * 5,
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
            obj         : this._groupRegister,
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
            obj         : this._groupPreviewMaps,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });
        Executor.reset({
            obj         : this._groupTourneyInfo,
            beginProps  : { customAlpha: 1, customX: 0 },
            endProps    : { customAlpha: 0, customX: -40 },
        });

        await wait();
    }
}
