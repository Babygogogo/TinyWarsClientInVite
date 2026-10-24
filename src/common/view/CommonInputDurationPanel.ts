import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersText from "../../helpers/Text.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";

export type OpenData = {
    title           : string;
    currentValue    : number;
    maxValue        : number;
    minValue        : number;
    tips            : string | null;
    getHelpText?    : () => string;
    callback        : (value: number) => any;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTips!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSwitch!        : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutValue!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelValue!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelValueInDay!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;

    private readonly _group1Btn!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnAdd1s!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd1m!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd1h!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd1d!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSub1s!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSub1m!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSub1h!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSub1d!         : UiInterfacesIUiButton.IUiButton;

    private readonly _groupBtn2!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnAdd10s!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd10m!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd10h!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd10d!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSub10s!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSub10m!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSub10h!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSub10d!        : UiInterfacesIUiButton.IUiButton;

    private _value                      = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            throw HelpersMisc.newError(`Invalid minValue: ${openData.minValue}.`);
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
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0154));
    }

    private _updateLabelValue(): void {
        const value                 = this._value;
        this._labelValue.setText(`${LangUtils.getTimeDurationText2(value)}`);
        this._labelValueInDay.setText(`${HelpersText.format(`%.2f`, value / 3600 / 24)}d`);
        this._layoutValue.arrangeItems();
    }

    private _updateOnTouchedButtonsForChangeValue(deltaValue: number): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._value = NumbersUtils.getValueInRange({
            minValue    : openData.minValue,
            maxValue    : openData.maxValue,
            rawValue    : this._value + deltaValue,
        });
        this._updateLabelValue();
    }
}
