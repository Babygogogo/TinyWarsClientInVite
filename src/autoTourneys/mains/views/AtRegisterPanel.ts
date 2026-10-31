import {
    type Notifications_Mapping,
    AutoTourneys_Mains_Provider,
    Lang_Utils,
    Timer_TimerModel,
    AutoTourneys_Constants,
    AutoTourneys_Mains_Gateway,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    type Egret_Egret,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../../internal.ts";
import type { S as AtGetRegistrationInfoResponse } from "../../../proto/schema/CommonProto/NetMessage/MsgAtGetRegistrationInfo/S.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelTourneyIdTitle!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTourneyId!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnPreviousTourney!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnNextTourney!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelRegisteredPlayersTitle!  : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRegisteredPlayers!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRegisteredTitle!         : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRegistered!              : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRestTimeTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelRestTime!                : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnRegister!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnUnregister!                : Ui_Interfaces_IUiButton.IUiButton;

    private _tourneyId  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "TimeTick",                    callback : this._onNotifyTimeTick },
            { type : "LanguageChanged",             callback : this._onNotifyLanguageChanged },
            { type : "MsgAtRegister",               callback : this._onNotifyMsgAtRegister },
            { type : "MsgAtGetRegistrationInfo",    callback : this._onNotifyMsgAtGetRegistrationInfo },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,           callback : this.closePanel },
            { ui : this._btnPreviousTourney, callback : this._onTouchedBtnPreviousTourney },
            { ui : this._btnNextTourney,     callback : this._onTouchedBtnNextTourney },
            { ui : this._btnRegister,        callback : this._onTouchedBtnRegister },
            { ui : this._btnUnregister,      callback : this._onTouchedBtnUnregister },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const tourneyIdArray    = (await AutoTourneys_Mains_Provider.getSinglePhaseInfoArrayForPhase(AutoTourneys_Constants.PhaseId.Registration))?.map(v => v.getTourneyId());
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

        const tourneyIdArray    = (await AutoTourneys_Mains_Provider.getSinglePhaseInfoArrayForPhase(AutoTourneys_Constants.PhaseId.Registration))?.map(v => v.getTourneyId());
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

        const tourneyIdArray    = (await AutoTourneys_Mains_Provider.getSinglePhaseInfoArrayForPhase(AutoTourneys_Constants.PhaseId.Registration))?.map(v => v.getTourneyId());
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
            AutoTourneys_Mains_Gateway.reqAtRegister(tourneyId, true);
        }
    }
    private _onTouchedBtnUnregister(): void {
        const tourneyId = this._tourneyId;
        if (tourneyId != null) {
            AutoTourneys_Mains_Gateway.reqAtRegister(tourneyId, false);
        }
    }

    private _onNotifyTimeTick(): void {
        this._updateLabelRestTime();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtRegister(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtGetRegistrationInfo(e: Egret_Egret.Event<Notifications_Mapping.Mapping["MsgAtGetRegistrationInfo"]>): void {
        const data = (e.data as { msg: AtGetRegistrationInfoResponse }).msg;
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

        const registrationInfo          = tourneyId == null ? null : await AutoTourneys_Mains_Provider.getAtRegistrationInfo(tourneyId);
        const labelRegistered           = this._labelRegistered;
        const labelRegisteredPlayers    = this._labelRegisteredPlayers;
        if (registrationInfo == null) {
            labelRegistered.setText(`----`);
            labelRegisteredPlayers.setText(`----`);
        } else {
            labelRegistered.setLangText(registrationInfo.isRegistered ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
            labelRegistered.setTextColor(registrationInfo.isRegistered ? 0x00ff00 : 0xffffff);
            labelRegisteredPlayers.setText(`${registrationInfo.playersCount}`);
        }

        this._updateLabelTourneyId();
        this._updateBtnPreviousAndNext();
        this._updateLabelRestTime();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1025);
        this._labelTourneyIdTitle.setLangText(Lang_Constants.TextType.B1026);
        this._labelRegisteredPlayersTitle.setLangText(Lang_Constants.TextType.B1027);
        this._labelRegisteredTitle.setLangText(Lang_Constants.TextType.B1028);
        this._labelRestTimeTitle.setLangText(Lang_Constants.TextType.B1032);
        this._btnRegister.setLangText(Lang_Constants.TextType.B0174);
        this._btnUnregister.setLangText(Lang_Constants.TextType.B1031);

        this._updateLabelTourneyId();
    }

    private async _updateLabelTourneyId(): Promise<void> {
        const tourneyId = this._tourneyId;
        const label     = this._labelTourneyId;
        if (tourneyId == null) {
            label.setText(`----`);
        } else {
            const tourneyName = Lang_Utils.getLanguageText({ textArray : (await AutoTourneys_Mains_Provider.getAtTourneyInfo(tourneyId))?.getNameArray() });
            this._labelTourneyId.setText(`#${tourneyId} ${tourneyName ?? ``}`);
        }
    }
    private async _updateBtnPreviousAndNext(): Promise<void> {
        const hasMultipleTourneys = (await AutoTourneys_Mains_Provider.getSinglePhaseInfoArrayForPhase(AutoTourneys_Constants.PhaseId.Registration)).length > 1;
        this._btnNextTourney.setIsVisible(hasMultipleTourneys);
        this._btnPreviousTourney.setIsVisible(hasMultipleTourneys);
    }

    private async _updateLabelRestTime(): Promise<void> {
        const tourneyId         = this._tourneyId;
        const registrationInfo  = tourneyId == null ? null : await AutoTourneys_Mains_Provider.getAtRegistrationInfo(tourneyId);
        const label             = this._labelRestTime;
        if (registrationInfo == null) {
            label.setText(`----`);
        } else {
            label.setText(Lang_Utils.getTimeDurationText2(registrationInfo.endTimestamp - Timer_TimerModel.getServerTimestamp()));
        }
    }
}
