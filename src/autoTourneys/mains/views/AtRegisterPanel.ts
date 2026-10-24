import * as AutoTourneysConstants from "../../Constants.ts";
import * as AutoTourneysMainsGateway from "../Gateway.ts";
import * as AutoTourneysMainsProvider from "../Provider.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtGetRegistrationInfoS from "../../../proto/schema/CommonProto/NetMessage/MsgAtGetRegistrationInfo/S.ts";
import * as TimerTimerModel from "../../../timer/TimerModel.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";
import type * as VendorEgretEgret from "../../../vendor/egret/Egret.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTourneyIdTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTourneyId!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPreviousTourney!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnNextTourney!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelRegisteredPlayersTitle!  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRegisteredPlayers!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRegisteredTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRegistered!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRestTimeTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRestTime!                : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnRegister!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnUnregister!                : UiInterfacesIUiButton.IUiButton;

    private _tourneyId  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.TimeTick,                    callback: this._onNotifyTimeTick },
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgAtRegister,               callback: this._onNotifyMsgAtRegister },
            { type: NotificationsTypeId.TypeId.MsgAtGetRegistrationInfo,    callback: this._onNotifyMsgAtGetRegistrationInfo },
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
        const tourneyIdArray    = (await AutoTourneysMainsProvider.getSinglePhaseInfoArrayForPhase(AutoTourneysConstants.PhaseId.Registration))?.map(v => v.getTourneyId() ?? 0) ?? [];
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

        const tourneyIdArray    = (await AutoTourneysMainsProvider.getSinglePhaseInfoArrayForPhase(AutoTourneysConstants.PhaseId.Registration))?.map(v => v.getTourneyId() ?? 0) ?? [];
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

        const tourneyIdArray    = (await AutoTourneysMainsProvider.getSinglePhaseInfoArrayForPhase(AutoTourneysConstants.PhaseId.Registration))?.map(v => v.getTourneyId() ?? 0) ?? [];
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
            AutoTourneysMainsGateway.reqAtRegister(tourneyId, true);
        }
    }
    private _onTouchedBtnUnregister(): void {
        const tourneyId = this._tourneyId;
        if (tourneyId != null) {
            AutoTourneysMainsGateway.reqAtRegister(tourneyId, false);
        }
    }

    private _onNotifyTimeTick(): void {
        this._updateLabelRestTime();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtRegister(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtGetRegistrationInfo(e: VendorEgretEgret.Event): void {
        const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtGetRegistrationInfoS.S;
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

        const registrationInfo          = tourneyId == null ? null : await AutoTourneysMainsProvider.getAtRegistrationInfo(tourneyId);
        const labelRegistered           = this._labelRegistered;
        const labelRegisteredPlayers    = this._labelRegisteredPlayers;
        if (registrationInfo == null) {
            labelRegistered.setText(`----`);
            labelRegisteredPlayers.setText(`----`);
        } else {
            labelRegistered.setText(LangUtils.getText(registrationInfo.isRegistered ? LangConstants.TextType.Yes : LangConstants.TextType.No));
            labelRegistered.setTextColor(registrationInfo.isRegistered ? 0x00ff00 : 0xffffff);
            labelRegisteredPlayers.setText(`${registrationInfo.playersCount ?? 0}`);
        }

        this._updateLabelTourneyId();
        this._updateBtnPreviousAndNext();
        this._updateLabelRestTime();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1025));
        this._labelTourneyIdTitle.setText(LangUtils.getText(LangConstants.TextType.B1026));
        this._labelRegisteredPlayersTitle.setText(LangUtils.getText(LangConstants.TextType.B1027));
        this._labelRegisteredTitle.setText(LangUtils.getText(LangConstants.TextType.B1028));
        this._labelRestTimeTitle.setText(LangUtils.getText(LangConstants.TextType.B1032));
        this._btnRegister.setText(LangUtils.getText(LangConstants.TextType.B0174));
        this._btnUnregister.setText(LangUtils.getText(LangConstants.TextType.B1031));

        this._updateLabelTourneyId();
    }

    private async _updateLabelTourneyId(): Promise<void> {
        const tourneyId = this._tourneyId;
        const label     = this._labelTourneyId;
        if (tourneyId == null) {
            label.setText(`----`);
        } else {
            const tourneyName = LangUtils.getLanguageText({ textArray: (await AutoTourneysMainsProvider.getAtTourneyInfo(tourneyId))?.getNameArray() });
            this._labelTourneyId.setText(`#${tourneyId} ${tourneyName ?? ``}`);
        }
    }
    private async _updateBtnPreviousAndNext(): Promise<void> {
        const hasMultipleTourneys = (await AutoTourneysMainsProvider.getSinglePhaseInfoArrayForPhase(AutoTourneysConstants.PhaseId.Registration)).length > 1;
        this._btnNextTourney.setIsVisible(hasMultipleTourneys);
        this._btnPreviousTourney.setIsVisible(hasMultipleTourneys);
    }

    private async _updateLabelRestTime(): Promise<void> {
        const tourneyId         = this._tourneyId;
        const registrationInfo  = tourneyId == null ? null : await AutoTourneysMainsProvider.getAtRegistrationInfo(tourneyId);
        const label             = this._labelRestTime;
        if (registrationInfo == null) {
            label.setText(`----`);
        } else {
            label.setText(LangUtils.getTimeDurationText2(registrationInfo.endTimestamp - TimerTimerModel.getServerTimestamp()));
        }
    }
}
