import { newError } from "../../helpers/Misc.ts";
import { format } from "../../helpers/Text.ts";
import { TextType } from "../../lang/Constants.ts";
import { getTimeDurationText2 } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";

export type OpenData = {
    title           : string;
    currentValue    : number;
    maxValue        : number;
    minValue        : number;
    tips            : string | null;
    getHelpText?    : () => string;
    callback        : (value: number) => any;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _labelTips!        : IUiLabel;
    private readonly _btnClose!         : IUiButton;
    private readonly _btnSwitch!        : IUiButton;

    private readonly _layoutValue!      : IUiLayout;
    private readonly _labelValue!       : IUiLabel;
    private readonly _labelValueInDay!  : IUiLabel;

    private readonly _btnConfirm!       : IUiButton;

    private readonly _group1Btn!        : IUiContainer;
    private readonly _btnAdd1s!         : IUiButton;
    private readonly _btnAdd1m!         : IUiButton;
    private readonly _btnAdd1h!         : IUiButton;
    private readonly _btnAdd1d!         : IUiButton;
    private readonly _btnSub1s!         : IUiButton;
    private readonly _btnSub1m!         : IUiButton;
    private readonly _btnSub1h!         : IUiButton;
    private readonly _btnSub1d!         : IUiButton;

    private readonly _groupBtn2!        : IUiContainer;
    private readonly _btnAdd10s!        : IUiButton;
    private readonly _btnAdd10m!        : IUiButton;
    private readonly _btnAdd10h!        : IUiButton;
    private readonly _btnAdd10d!        : IUiButton;
    private readonly _btnSub10s!        : IUiButton;
    private readonly _btnSub10m!        : IUiButton;
    private readonly _btnSub10h!        : IUiButton;
    private readonly _btnSub10d!        : IUiButton;

    private _value                      = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel, },
            { ui: this._btnSwitch,      callback: this._onTouchedBtnSwitch },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },

            { ui: this._btnAdd1s,       callback: this._onTouchedBtnAdd1s },
            { ui: this._btnAdd10s,      callback: this._onTouchedBtnAdd10s },
            { ui: this._btnAdd1m,       callback: this._onTouchedBtnAdd1m },
            { ui: this._btnAdd10m,      callback: this._onTouchedBtnAdd10m },
            { ui: this._btnAdd1h,       callback: this._onTouchedBtnAdd1h },
            { ui: this._btnAdd10h,      callback: this._onTouchedBtnAdd10h },
            { ui: this._btnAdd1d,       callback: this._onTouchedBtnAdd1d },
            { ui: this._btnAdd10d,      callback: this._onTouchedBtnAdd10d },
            { ui: this._btnSub1s,       callback: this._onTouchedBtnSub1s },
            { ui: this._btnSub10s,      callback: this._onTouchedBtnSub10s },
            { ui: this._btnSub1m,       callback: this._onTouchedBtnSub1m },
            { ui: this._btnSub10m,      callback: this._onTouchedBtnSub10m },
            { ui: this._btnSub1h,       callback: this._onTouchedBtnSub1h },
            { ui: this._btnSub10h,      callback: this._onTouchedBtnSub10h },
            { ui: this._btnSub1d,       callback: this._onTouchedBtnSub1d },
            { ui: this._btnSub10d,      callback: this._onTouchedBtnSub10d },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._btnAdd1s.setText(`+1s`);
        this._btnAdd10s.setText(`+10s`);
        this._btnAdd1m.setText(`+1m`);
        this._btnAdd10m.setText(`+10m`);
        this._btnAdd1h.setText(`+1h`);
        this._btnAdd10h.setText(`+10h`);
        this._btnAdd1d.setText(`+1d`);
        this._btnAdd10d.setText(`+10d`);
        this._btnSub1s.setText(`-1s`);
        this._btnSub10s.setText(`-10s`);
        this._btnSub1m.setText(`-1m`);
        this._btnSub10m.setText(`-10m`);
        this._btnSub1h.setText(`-1h`);
        this._btnSub10h.setText(`-10h`);
        this._btnSub1d.setText(`-1d`);
        this._btnSub10d.setText(`-10d`);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        if (openData.minValue < 0) {
            throw newError(`Invalid minValue: ${openData.minValue}.`);
        }

        this._value = openData.currentValue;
        this._labelTitle.setText(openData.title);
        this._labelTips.setText(openData.tips ?? ``);
        this._updateLabelValue();
    }

    public getInputValue(): number {
        const value     = this._value;
        const openData  = this.getOpenData();
        if (openData == null) {
            return value;
        } else {
            return ((value <= openData.maxValue) && (value >= openData.minValue))
                ? value
                : openData.currentValue;
        }
    }

    private _onTouchedBtnSwitch(): void {
        const group = this._groupBtn2;
        group.setIsVisible(!group.getIsVisible());
    }
    private _onTouchedBtnConfirm(): void {
        const openData  = this.getOpenData();
        const value     = this.getInputValue();
        this.closePanel();
        openData?.callback(value);
    }

    private _onTouchedBtnAdd1s(): void {
        this._updateOnTouchedButtonsForChangeValue(1);
    }
    private _onTouchedBtnAdd10s(): void {
        this._updateOnTouchedButtonsForChangeValue(10);
    }
    private _onTouchedBtnAdd1m(): void {
        this._updateOnTouchedButtonsForChangeValue(60);
    }
    private _onTouchedBtnAdd10m(): void {
        this._updateOnTouchedButtonsForChangeValue(60 * 10);
    }
    private _onTouchedBtnAdd1h(): void {
        this._updateOnTouchedButtonsForChangeValue(3600);
    }
    private _onTouchedBtnAdd10h(): void {
        this._updateOnTouchedButtonsForChangeValue(3600 * 10);
    }
    private _onTouchedBtnAdd1d(): void {
        this._updateOnTouchedButtonsForChangeValue(3600 * 24);
    }
    private _onTouchedBtnAdd10d(): void {
        this._updateOnTouchedButtonsForChangeValue(3600 * 24 * 10);
    }
    private _onTouchedBtnSub1s(): void {
        this._updateOnTouchedButtonsForChangeValue(-1);
    }
    private _onTouchedBtnSub10s(): void {
        this._updateOnTouchedButtonsForChangeValue(-10);
    }
    private _onTouchedBtnSub1m(): void {
        this._updateOnTouchedButtonsForChangeValue(-60);
    }
    private _onTouchedBtnSub10m(): void {
        this._updateOnTouchedButtonsForChangeValue(-60 * 10);
    }
    private _onTouchedBtnSub1h(): void {
        this._updateOnTouchedButtonsForChangeValue(-3600);
    }
    private _onTouchedBtnSub10h(): void {
        this._updateOnTouchedButtonsForChangeValue(-3600 * 10);
    }
    private _onTouchedBtnSub1d(): void {
        this._updateOnTouchedButtonsForChangeValue(-3600 * 24);
    }
    private _onTouchedBtnSub10d(): void {
        this._updateOnTouchedButtonsForChangeValue(-3600 * 24 * 10);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnClose.setLangText(TextType.B0154);
    }

    private _updateLabelValue(): void {
        const value                 = this._value;
        this._labelValue.setText(`${getTimeDurationText2(value)}`);
        this._labelValueInDay.setText(`${format(`%.2f`, value / 3600 / 24)}d`);
        this._layoutValue.arrangeItems();
    }

    private _updateOnTouchedButtonsForChangeValue(deltaValue: number): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._value = getValueInRange({
            minValue    : openData.minValue,
            maxValue    : openData.maxValue,
            rawValue    : this._value + deltaValue,
        });
        this._updateLabelValue();
    }
}
