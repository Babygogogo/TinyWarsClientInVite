import {
    Helpers_Text,
    Lang_Utils,
    Numbers_Utils,
    Helpers_Misc,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export type OpenData = {
    title           : string;
    currentValue    : number;
    maxValue        : number;
    minValue        : number;
    tips            : string | null;
    getHelpText?    : () => string;
    callback        : (value: number) => any;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelTips!        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitch!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutValue!      : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelValue!       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelValueInDay!  : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnConfirm!       : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _group1Btn!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnAdd1s!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd1m!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd1h!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd1d!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub1s!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub1m!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub1h!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub1d!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupBtn2!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnAdd10s!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd10m!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd10h!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd10d!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub10s!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub10m!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub10h!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub10d!        : Ui_Interfaces_IUiButton.IUiButton;

    private _value                      = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            throw Helpers_Misc.newError(`Invalid minValue: ${openData.minValue}.`);
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
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnClose.setLangText(Lang_Constants.TextType.B0154);
    }

    private _updateLabelValue(): void {
        const value                 = this._value;
        this._labelValue.setText(`${Lang_Utils.getTimeDurationText2(value)}`);
        this._labelValueInDay.setText(`${Helpers_Text.format(`%.2f`, value / 3600 / 24)}d`);
        this._layoutValue.arrangeItems();
    }

    private _updateOnTouchedButtonsForChangeValue(deltaValue: number): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._value = Numbers_Utils.getValueInRange({
            minValue    : openData.minValue,
            maxValue    : openData.maxValue,
            rawValue    : this._value + deltaValue,
        });
        this._updateLabelValue();
    }
}
