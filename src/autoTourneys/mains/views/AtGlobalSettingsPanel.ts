import * as AutoTourneysConstants from "../../Constants.ts";
import * as AutoTourneysMainsGateway from "../Gateway.ts";
import * as AutoTourneysMainsProvider from "../Provider.ts";
import * as FloatText2 from "../../../FloatText.ts";
import * as GamePanelsDict from "../../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../../gamePanels/Manager.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NotificationsTypeId from "../../../notifications/TypeId.ts";
import * as TimerTimerModel from "../../../timer/TimerModel.ts";
import * as UiComponentsUiPanel from "../../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../../ui/interfaces/IUiLabel.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCreateTourney!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteLastTourney! : UiInterfacesIUiButton.IUiButton;

    private readonly _btnIsEnabled!         : UiInterfacesIUiButton.IUiButton;
    private readonly _labelIsEnabled!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnInterval!          : UiInterfacesIUiButton.IUiButton;
    private readonly _labelInterval!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConfirm!           : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!            : UiInterfacesIUiButton.IUiButton;

    private _isEnabled  = false;
    private _interval   = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgAtGetGlobalSettings,      callback: this._onNotifyMsgAtGetGlobalSettings },
            { type: NotificationsTypeId.TypeId.MsgAtSetGlobalSettings,      callback: this._onNotifyMsgAtSetGlobalSettings },
            { type: NotificationsTypeId.TypeId.MsgAtCreateTourney,          callback: this._onNotifyMsgAtCreateTourney },
            { type: NotificationsTypeId.TypeId.MsgAtDeleteLastTourney,      callback: this._onNotifyMsgAtDeleteLastTourney },
        ]);
        this._setUiListenerArray([
            { ui: this._btnIsEnabled,           callback: this._onTouchedBtnIsEnabled },
            { ui: this._btnInterval,            callback: this._onTouchedBtnInterval },
            { ui: this._btnCreateTourney,       callback: this._onTouchedBtnCreateTourney },
            { ui: this._btnDeleteLastTourney,   callback: this._onTouchedBtnDeleteLastTourney },
            { ui: this._btnConfirm,             callback: this._onTouchedBtnConfirm },
            { ui: this._btnCancel,              callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const globalSettings    = await AutoTourneysMainsProvider.getGlobalSettings();
        this._isEnabled         = !!globalSettings?.isEnabled;
        this._interval          = globalSettings?.interval ?? 0;

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnIsEnabled(): void {
        this._isEnabled = !this._isEnabled;
        this._updateLabelIsEnabled();
    }

    private _onTouchedBtnInterval(): void {
        const minValue = AutoTourneysConstants.Common.MinCreateInterval;
        const maxValue = AutoTourneysConstants.Common.MaxCreateInterval;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputDurationPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B1035),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : this._interval,
            tips            : `${LangUtils.getText(LangConstants.TextType.B0319)}: [${LangUtils.getTimeDurationText2(minValue)}, ${LangUtils.getTimeDurationText2(maxValue)}]`,
            getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0847),
            callback        : interval => {
                this._interval = interval;
                this._updateLabelInterval();
            }
        });
    }

    private async _onTouchedBtnCreateTourney(): Promise<void> {
        const globalSettings = await AutoTourneysMainsProvider.getGlobalSettings();
        if (globalSettings == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const duration = globalSettings.lastCreateTimestamp + AutoTourneysConstants.Common.MinCreateInterval - TimerTimerModel.getServerTimestamp();
        if (duration > 0) {
            FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0201, LangUtils.getTimeDurationText2(duration)));
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => LangUtils.getText(LangConstants.TextType.A0846),
                callback    : () => AutoTourneysMainsGateway.reqAtCreateTourney(),
            });
        }
    }

    private _onTouchedBtnDeleteLastTourney(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0405),
            callback    : () => AutoTourneysMainsGateway.reqAtDeleteLastTourney(),
        });
    }

    private _onTouchedBtnConfirm(): void {
        AutoTourneysMainsGateway.reqAtSetGlobalSettings(this._isEnabled, this._interval);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtGetGlobalSettings(): void {
        this._updateView();
    }

    private _onNotifyMsgAtSetGlobalSettings(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtCreateTourney(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtDeleteLastTourney(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLabelIsEnabled();
        this._updateLabelInterval();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1022));
        this._btnIsEnabled.setText(LangUtils.getText(LangConstants.TextType.B1034));
        this._btnInterval.setText(LangUtils.getText(LangConstants.TextType.B1035));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));

        this._updateLabelIsEnabled();
    }

    private _updateLabelInterval(): void {
        this._labelInterval.setText(LangUtils.getTimeDurationText(this._interval));
    }

    private _updateLabelIsEnabled(): void {
        this._labelIsEnabled.setText(LangUtils.getTextForYesOrNo(this._isEnabled));
    }
}
