import { Common } from "../../Constants.ts";
import {
    reqAtCreateTourney,
    reqAtDeleteLastTourney,
    reqAtSetGlobalSettings,
} from "../Gateway.ts";
import { getGlobalSettings } from "../Provider.ts";
import {
    showLang,
    show,
} from "../../../FloatText.ts";
import { getDict } from "../../../gamePanels/Dict.ts";
import { openPanel } from "../../../gamePanels/Manager.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getText,
    getTimeDurationText2,
    getFormattedText,
    getTimeDurationText,
} from "../../../lang/Utils.ts";
import { TypeId } from "../../../notifications/TypeId.ts";
import { getServerTimestamp } from "../../../timer/TimerModel.ts";
import { UiPanel } from "../../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../../ui/interfaces/IUiLabel.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnCreateTourney!     : IUiButton;
    private readonly _btnDeleteLastTourney! : IUiButton;

    private readonly _btnIsEnabled!         : IUiButton;
    private readonly _labelIsEnabled!       : IUiLabel;
    private readonly _btnInterval!          : IUiButton;
    private readonly _labelInterval!        : IUiLabel;

    private readonly _btnConfirm!           : IUiButton;
    private readonly _btnCancel!            : IUiButton;

    private _isEnabled  = false;
    private _interval   = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgAtGetGlobalSettings,      callback: this._onNotifyMsgAtGetGlobalSettings },
            { type: TypeId.MsgAtSetGlobalSettings,      callback: this._onNotifyMsgAtSetGlobalSettings },
            { type: TypeId.MsgAtCreateTourney,          callback: this._onNotifyMsgAtCreateTourney },
            { type: TypeId.MsgAtDeleteLastTourney,      callback: this._onNotifyMsgAtDeleteLastTourney },
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
        const globalSettings    = await getGlobalSettings();
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
        const minValue = Common.MinCreateInterval;
        const maxValue = Common.MaxCreateInterval;
        openPanel(getDict().CommonInputDurationPanel, {
            title           : getText(TextType.B1035),
            minValue        : minValue,
            maxValue        : maxValue,
            currentValue    : this._interval,
            tips            : `${getText(TextType.B0319)}: [${getTimeDurationText2(minValue)}, ${getTimeDurationText2(maxValue)}]`,
            getHelpText     : () => getText(TextType.A0847),
            callback        : interval => {
                this._interval = interval;
                this._updateLabelInterval();
            }
        });
    }

    private async _onTouchedBtnCreateTourney(): Promise<void> {
        const globalSettings = await getGlobalSettings();
        if (globalSettings == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const duration = globalSettings.lastCreateTimestamp + Common.MinCreateInterval - getServerTimestamp();
        if (duration > 0) {
            show(getFormattedText(TextType.F0201, getTimeDurationText2(duration)));
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => getText(TextType.A0846),
                callback    : () => reqAtCreateTourney(),
            });
        }
    }

    private _onTouchedBtnDeleteLastTourney(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.A0405),
            callback    : () => reqAtDeleteLastTourney(),
        });
    }

    private _onTouchedBtnConfirm(): void {
        reqAtSetGlobalSettings(this._isEnabled, this._interval);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgAtGetGlobalSettings(): void {
        this._updateView();
    }

    private _onNotifyMsgAtSetGlobalSettings(): void {
        showLang(TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtCreateTourney(): void {
        showLang(TextType.OperationSucceeded);
    }

    private _onNotifyMsgAtDeleteLastTourney(): void {
        showLang(TextType.OperationSucceeded);
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
        this._labelTitle.setLangText(TextType.B1022);
        this._btnIsEnabled.setLangText(TextType.B1034);
        this._btnInterval.setLangText(TextType.B1035);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);

        this._updateLabelIsEnabled();
    }

    private _updateLabelInterval(): void {
        this._labelInterval.setText(getTimeDurationText(this._interval));
    }

    private _updateLabelIsEnabled(): void {
        this._labelIsEnabled.setLangText(this._isEnabled ? TextType.Yes : TextType.No);
    }
}
