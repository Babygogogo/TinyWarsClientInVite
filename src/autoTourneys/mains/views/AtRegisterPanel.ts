import { PhaseId } from "../../Constants.ts";
import { reqAtRegister } from "../Gateway.ts";
import { getSinglePhaseInfoArrayForPhase, getAtRegistrationInfo, getAtTourneyInfo } from "../Provider.ts";
import { showLang } from "../../../FloatText.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getLanguageText, getTimeDurationText2 } from "../../../lang/Utils.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import type { S } from "../../../proto/schema/CommonProto/NetMessage/MsgAtGetRegistrationInfo/S.ts";
import { getServerTimestamp } from "../../../timer/TimerModel.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";
import type { Event } from "../../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;
    private readonly _labelTourneyIdTitle!          : IUiLabel;
    private readonly _labelTourneyId!               : IUiLabel;
    private readonly _btnPreviousTourney!           : IUiButton;
    private readonly _btnNextTourney!               : IUiButton;
    private readonly _labelRegisteredPlayersTitle!  : IUiLabel;
    private readonly _labelRegisteredPlayers!       : IUiLabel;
    private readonly _labelRegisteredTitle!         : IUiLabel;
    private readonly _labelRegistered!              : IUiLabel;
    private readonly _labelRestTimeTitle!           : IUiLabel;
    private readonly _labelRestTime!                : IUiLabel;
    private readonly _btnRegister!                  : IUiButton;
    private readonly _btnUnregister!                : IUiButton;

    private _tourneyId  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.TimeTick,                    callback: this._onNotifyTimeTick },
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgAtRegister,               callback: this._onNotifyMsgAtRegister },
            { type: TypeId.MsgAtGetRegistrationInfo,    callback: this._onNotifyMsgAtGetRegistrationInfo },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnPreviousTourney, callback: this._onTouchedBtnPreviousTourney },
            { ui: this._btnNextTourney,     callback: this._onTouchedBtnNextTourney },
            { ui: this._btnRegister,        callback: this._onTouchedBtnRegister },
            { ui: this._btnUnregister,      callback: this._onTouchedBtnUnregister },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const tourneyIdArray    = (await getSinglePhaseInfoArrayForPhase(PhaseId.Registration))?.map(v => v.getTourneyId());
        this._tourneyId         = tourneyIdArray.length > 0 ? Math.max(...tourneyIdArray) : null;
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _onTouchedBtnPreviousTourney(): Promise<void> {
        const tourneyId = this._tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyIdArray    = (await getSinglePhaseInfoArrayForPhase(PhaseId.Registration))?.map(v => v.getTourneyId());
        if (tourneyIdArray.length <= 1) {
            return;
        }

        const index     = tourneyIdArray.indexOf(tourneyId) - 1;
        this._tourneyId = tourneyIdArray[index >= 0 ? index : (tourneyIdArray.length - 1)];
        this._updateView();
    }
    private async _onTouchedBtnNextTourney(): Promise<void> {
        const tourneyId = this._tourneyId;
        if (tourneyId == null) {
            return;
        }

        const tourneyIdArray    = (await getSinglePhaseInfoArrayForPhase(PhaseId.Registration))?.map(v => v.getTourneyId());
        if (tourneyIdArray.length <= 1) {
            return;
        }

        const index     = (tourneyIdArray.indexOf(tourneyId) + 1) % tourneyIdArray.length;
        this._tourneyId = tourneyIdArray[index];
        this._updateView();
    }
    private _onTouchedBtnRegister(): void {
        const tourneyId = this._tourneyId;
        if (tourneyId != null) {
            reqAtRegister(tourneyId, true);
        }
    }
    private _onTouchedBtnUnregister(): void {
        const tourneyId = this._tourneyId;
        if (tourneyId != null) {
            reqAtRegister(tourneyId, false);
        }
    }

    private _onNotifyTimeTick(): void {
        this._updateLabelRestTime();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtRegister(): void {
        showLang(TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtGetRegistrationInfo(e: Event): void {
        const data = e.data as S;
        if (data.getTourneyId() === this._tourneyId) {
            this._updateView();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        const tourneyId             = this._tourneyId;
        this._labelTourneyId.setText(tourneyId == null ? `----` : `${tourneyId}`);

        const registrationInfo          = tourneyId == null ? null : await getAtRegistrationInfo(tourneyId);
        const labelRegistered           = this._labelRegistered;
        const labelRegisteredPlayers    = this._labelRegisteredPlayers;
        if (registrationInfo == null) {
            labelRegistered.setText(`----`);
            labelRegisteredPlayers.setText(`----`);
        } else {
            labelRegistered.setLangText(registrationInfo.isRegistered ? TextType.Yes : TextType.No);
            labelRegistered.setTextColor(registrationInfo.isRegistered ? 0x00ff00 : 0xffffff);
            labelRegisteredPlayers.setText(`${registrationInfo.playersCount}`);
        }

        this._updateLabelTourneyId();
        this._updateBtnPreviousAndNext();
        this._updateLabelRestTime();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1025);
        this._labelTourneyIdTitle.setLangText(TextType.B1026);
        this._labelRegisteredPlayersTitle.setLangText(TextType.B1027);
        this._labelRegisteredTitle.setLangText(TextType.B1028);
        this._labelRestTimeTitle.setLangText(TextType.B1032);
        this._btnRegister.setLangText(TextType.B0174);
        this._btnUnregister.setLangText(TextType.B1031);

        this._updateLabelTourneyId();
    }

    private async _updateLabelTourneyId(): Promise<void> {
        const tourneyId = this._tourneyId;
        const label     = this._labelTourneyId;
        if (tourneyId == null) {
            label.setText(`----`);
        } else {
            const tourneyName = getLanguageText({ textArray: (await getAtTourneyInfo(tourneyId))?.getNameArray() });
            this._labelTourneyId.setText(`#${tourneyId} ${tourneyName ?? ``}`);
        }
    }
    private async _updateBtnPreviousAndNext(): Promise<void> {
        const hasMultipleTourneys = (await getSinglePhaseInfoArrayForPhase(PhaseId.Registration)).length > 1;
        this._btnNextTourney.setIsVisible(hasMultipleTourneys);
        this._btnPreviousTourney.setIsVisible(hasMultipleTourneys);
    }

    private async _updateLabelRestTime(): Promise<void> {
        const tourneyId         = this._tourneyId;
        const registrationInfo  = tourneyId == null ? null : await getAtRegistrationInfo(tourneyId);
        const label             = this._labelRestTime;
        if (registrationInfo == null) {
            label.setText(`----`);
        } else {
            label.setText(getTimeDurationText2(registrationInfo.endTimestamp - getServerTimestamp()));
        }
    }
}
