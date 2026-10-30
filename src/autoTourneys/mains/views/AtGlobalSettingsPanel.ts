import {
    AutoTourneys_Constants,
    GamePanels_Dict,
    Lang_Utils,
    AutoTourneys_Mains_Provider,
    Timer_TimerModel,
    GamePanels_Manager,
    AutoTourneys_Mains_Gateway,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnCreateTourney!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDeleteLastTourney! : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnIsEnabled!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelIsEnabled!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnInterval!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelInterval!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!            : Ui_Interfaces_IUiButton.IUiButton;

    private _isEnabled  = false;
    private _interval   = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: Notifications_TypeId.TypeId.MsgAtGetGlobalSettings,      callback: this._onNotifyMsgAtGetGlobalSettings },
            { type: Notifications_TypeId.TypeId.MsgAtSetGlobalSettings,      callback: this._onNotifyMsgAtSetGlobalSettings },
            { type: Notifications_TypeId.TypeId.MsgAtCreateTourney,          callback: this._onNotifyMsgAtCreateTourney },
            { type: Notifications_TypeId.TypeId.MsgAtDeleteLastTourney,      callback: this._onNotifyMsgAtDeleteLastTourney },
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
        const globalSettings    = await AutoTourneys_Mains_Provider.getGlobalSettings();
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
        const minValue = AutoTourneys_Constants.Common.MinCreateInterval;
        const maxValue = AutoTourneys_Constants.Common.MaxCreateInterval;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputDurationPanel, {
            title           : Lang_Utils.getText(Lang_Constants.TextType.B1035),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : this._interval,
            tips            : `${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${Lang_Utils.getTimeDurationText2(minValue)}, ${Lang_Utils.getTimeDurationText2(maxValue)}]`,
            getHelpText     : () => Lang_Utils.getText(Lang_Constants.TextType.A0847),
            callback        : interval => {
                this._interval = interval;
                this._updateLabelInterval();
            }
        });
    }

    private async _onTouchedBtnCreateTourney(): Promise<void> {
        const globalSettings = await AutoTourneys_Mains_Provider.getGlobalSettings();
        if (globalSettings == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const duration = globalSettings.lastCreateTimestamp + AutoTourneys_Constants.Common.MinCreateInterval - Timer_TimerModel.getServerTimestamp();
        if (duration > 0) {
            FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0201, Lang_Utils.getTimeDurationText2(duration)));
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.A0846),
                callback    : () => AutoTourneys_Mains_Gateway.reqAtCreateTourney(),
            });
        }
    }

    private _onTouchedBtnDeleteLastTourney(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent     : () => Lang_Utils.getText(Lang_Constants.TextType.A0405),
            callback    : () => AutoTourneys_Mains_Gateway.reqAtDeleteLastTourney(),
        });
    }

    private _onTouchedBtnConfirm(): void {
        AutoTourneys_Mains_Gateway.reqAtSetGlobalSettings(this._isEnabled, this._interval);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtGetGlobalSettings(): void {
        this._updateView();
    }

    private _onNotifyMsgAtSetGlobalSettings(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtCreateTourney(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtDeleteLastTourney(): void {
        FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1022);
        this._btnIsEnabled.setLangText(Lang_Constants.TextType.B1034);
        this._btnInterval.setLangText(Lang_Constants.TextType.B1035);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);

        this._updateLabelIsEnabled();
    }

    private _updateLabelInterval(): void {
        this._labelInterval.setText(Lang_Utils.getTimeDurationText(this._interval));
    }

    private _updateLabelIsEnabled(): void {
        this._labelIsEnabled.setLangText(this._isEnabled ? Lang_Constants.TextType.Yes : Lang_Constants.TextType.No);
    }
}
