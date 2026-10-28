import { showLang, show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { type EventData, KeyCode } from "../../keyboard/KbTypes.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";

export interface OpenData {
    getTitle        : () => string;
    currentValue    : number;
    maxValue        : number;
    minValue        : number;
    getHelpText?    : (() => string);
    callback        : (value: number) => any;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnSwitch!            : IUiButton;
    private readonly _btnClose!             : IUiButton;

    private readonly _layoutValue!          : IUiLayout;
    private readonly _labelTips!            : IUiLabel;
    private readonly _labelValue!           : IUiLabel;

    private readonly _btnMin!               : IUiButton;
    private readonly _btnMax!               : IUiButton;

    private readonly _labelKeyboardTips!    : IUiLabel;
    private readonly _btnConfirm!           : IUiButton;
    private readonly _btnClear!             : IUiButton;

    private readonly _groupOperator!        : IUiContainer;
    private readonly _btnAdd1!              : IUiButton;
    private readonly _btnAdd10!             : IUiButton;
    private readonly _btnAdd100!            : IUiButton;
    private readonly _btnAdd1000!           : IUiButton;
    private readonly _btnAdd10000!          : IUiButton;
    private readonly _btnAdd100000!         : IUiButton;
    private readonly _btnSub1!              : IUiButton;
    private readonly _btnSub10!             : IUiButton;
    private readonly _btnSub100!            : IUiButton;
    private readonly _btnSub1000!           : IUiButton;
    private readonly _btnSub10000!          : IUiButton;
    private readonly _btnSub100000!         : IUiButton;

    private readonly _groupNumber!          : IUiContainer;
    private readonly _btn7!                 : IUiButton;
    private readonly _btn8!                 : IUiButton;
    private readonly _btn9!                 : IUiButton;
    private readonly _btn6!                 : IUiButton;
    private readonly _btn5!                 : IUiButton;
    private readonly _btn4!                 : IUiButton;
    private readonly _btn3!                 : IUiButton;
    private readonly _btn2!                 : IUiButton;
    private readonly _btn1!                 : IUiButton;
    private readonly _btn0!                 : IUiButton;
    private readonly _btnSign!              : IUiButton;
    private readonly _btnBackspace!         : IUiButton;

    private _value = 0;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel, },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
            { ui: this._btnClear,       callback: this._onTouchedBtnClear, },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnSwitch,      callback: this._onTouchedBtnSwitch },

            { ui: this._btnMin,         callback: this._onTouchedBtnMin },
            { ui: this._btnMax,         callback: this._onTouchedBtnMax },

            { ui: this._btnAdd1,        callback: this._onTouchedBtnAdd1 },
            { ui: this._btnAdd10,       callback: this._onTouchedBtnAdd10 },
            { ui: this._btnAdd100,      callback: this._onTouchedBtnAdd100 },
            { ui: this._btnAdd1000,     callback: this._onTouchedBtnAdd1000 },
            { ui: this._btnAdd10000,    callback: this._onTouchedBtnAdd10000 },
            { ui: this._btnAdd100000,   callback: this._onTouchedBtnAdd100000 },
            { ui: this._btnSub1,        callback: this._onTouchedBtnSub1 },
            { ui: this._btnSub10,       callback: this._onTouchedBtnSub10 },
            { ui: this._btnSub100,      callback: this._onTouchedBtnSub100 },
            { ui: this._btnSub1000,     callback: this._onTouchedBtnSub1000 },
            { ui: this._btnSub10000,    callback: this._onTouchedBtnSub10000 },
            { ui: this._btnSub100000,   callback: this._onTouchedBtnSub100000 },

            { ui: this._btn7,           callback: this._onTouchedBtn7 },
            { ui: this._btn8,           callback: this._onTouchedBtn8 },
            { ui: this._btn9,           callback: this._onTouchedBtn9 },
            { ui: this._btn6,           callback: this._onTouchedBtn6 },
            { ui: this._btn5,           callback: this._onTouchedBtn5 },
            { ui: this._btn4,           callback: this._onTouchedBtn4 },
            { ui: this._btn3,           callback: this._onTouchedBtn3 },
            { ui: this._btn2,           callback: this._onTouchedBtn2 },
            { ui: this._btn1,           callback: this._onTouchedBtn1 },
            { ui: this._btn0,           callback: this._onTouchedBtn0 },
            { ui: this._btnSign,        callback: this._onTouchedBtnSign },
            { ui: this._btnBackspace,   callback: this._onTouchedBtnBackspace },
        ]);
        this._setKeyboardListener({
            callback    : this._onKeyboard,
            thisObject  : this,
        });
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._btn0.setText(`0`);
        this._btn1.setText(`1`);
        this._btn2.setText(`2`);
        this._btn3.setText(`3`);
        this._btn4.setText(`4`);
        this._btn5.setText(`5`);
        this._btn6.setText(`6`);
        this._btn7.setText(`7`);
        this._btn8.setText(`8`);
        this._btn9.setText(`9`);
        this._btnAdd1.setText(`+1`);
        this._btnAdd10.setText(`+10`);
        this._btnAdd100.setText(`+100`);
        this._btnAdd1000.setText(`+1K`);
        this._btnAdd10000.setText(`+10K`);
        this._btnAdd100000.setText(`+100K`);
        this._btnSub1.setText(`-1`);
        this._btnSub10.setText(`-10`);
        this._btnSub100.setText(`-100`);
        this._btnSub1000.setText(`-1K`);
        this._btnSub10000.setText(`-10K`);
        this._btnSub100000.setText(`-100K`);
        this._btnSign.setText(`+ -`);
        this._btnBackspace.setText(`<=`);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setText(openData.getTitle());
        this._labelKeyboardTips.setLangText(TextType.A0827);
        this._btnHelp.setIsVisible(!!openData.getHelpText);
        this._groupNumber.setIsVisible(true);
        this._groupOperator.setIsVisible(false);

        this._value = openData.currentValue;
        this._updateLabelValue();
    }

    private _onKeyboard(data: EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        const newKeys   = data.newKeys;
        const allKeys   = data.allKeys;
        if ((newKeys.has(KeyCode.Escape)) || (newKeys.has(KeyCode.K))) {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this.closePanel();

        } else if ((newKeys.has(KeyCode.J)) || (newKeys.has(KeyCode.Enter))) {
            playShortSfx(ShortSfxCode.ButtonConfirm01);
            this._onTouchedBtnConfirm();

        } else if ((allKeys.has(KeyCode.Control)) && (newKeys.has(KeyCode.C))) {
            this._handleKeyboardCtrlC();

        } else if ((allKeys.has(KeyCode.Control)) && (newKeys.has(KeyCode.V))) {
            this._handleKeyboardCtrlV();

        } else if (newKeys.has(KeyCode.Num0)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(0);

        } else if (newKeys.has(KeyCode.Num1)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(1);

        } else if (newKeys.has(KeyCode.Num2)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(2);

        } else if (newKeys.has(KeyCode.Num3)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(3);

        } else if (newKeys.has(KeyCode.Num4)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(4);

        } else if (newKeys.has(KeyCode.Num5)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(5);

        } else if (newKeys.has(KeyCode.Num6)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(6);

        } else if (newKeys.has(KeyCode.Num7)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(7);

        } else if (newKeys.has(KeyCode.Num8)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(8);

        } else if (newKeys.has(KeyCode.Num9)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(9);

        } else if (newKeys.has(KeyCode.Backspace)) {
            playShortSfx(ShortSfxCode.ButtonCancel01);
            this._updateOnBackspace();

        } else if (newKeys.has(KeyCode.Add)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._value = Math.abs(this._value);
            this._updateLabelValue();

        } else if (newKeys.has(KeyCode.Sub)) {
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._value = -Math.abs(this._value);
            this._updateLabelValue();
        }
    }

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const value = this._value;
        if ((value < openData.minValue) || (value > openData.maxValue)) {
            showLang(TextType.A0098);
            return;
        }

        this.closePanel();
        openData.callback(value);
    }
    private _onTouchedBtnClear(): void {
        this._value = 0;
        this._updateLabelValue();
    }
    private _onTouchedBtnHelp(): void {
        const func = this.getOpenData()?.getHelpText;
        if (func) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => func(),
            });
        }
    }
    private _onTouchedBtnSwitch(): void {
        const groupNumber   = this._groupNumber;
        const visible       = !groupNumber.getIsVisible();
        groupNumber.setIsVisible(visible);
        this._groupOperator.setIsVisible(!visible);
    }

    private _onTouchedBtnMin(): void {
        const minValue = this.getOpenData()?.minValue;
        if (minValue == null) {
            return;
        }

        if (this._value !== minValue) {
            this._value = minValue;
            this._updateLabelValue();
        }
    }
    private _onTouchedBtnMax(): void {
        const maxValue = this.getOpenData()?.maxValue;
        if (maxValue == null) {
            return;
        }

        if (this._value !== maxValue) {
            this._value = maxValue;
            this._updateLabelValue();
        }
    }

    private _onTouchedBtnAdd1(): void {
        this._updateOnTouchedButtonsForChangeValue(1);
    }
    private _onTouchedBtnAdd10(): void {
        this._updateOnTouchedButtonsForChangeValue(10);
    }
    private _onTouchedBtnAdd100(): void {
        this._updateOnTouchedButtonsForChangeValue(100);
    }
    private _onTouchedBtnAdd1000(): void {
        this._updateOnTouchedButtonsForChangeValue(1000);
    }
    private _onTouchedBtnAdd10000(): void {
        this._updateOnTouchedButtonsForChangeValue(10000);
    }
    private _onTouchedBtnAdd100000(): void {
        this._updateOnTouchedButtonsForChangeValue(100000);
    }
    private _onTouchedBtnSub1(): void {
        this._updateOnTouchedButtonsForChangeValue(-1);
    }
    private _onTouchedBtnSub10(): void {
        this._updateOnTouchedButtonsForChangeValue(-10);
    }
    private _onTouchedBtnSub100(): void {
        this._updateOnTouchedButtonsForChangeValue(-100);
    }
    private _onTouchedBtnSub1000(): void {
        this._updateOnTouchedButtonsForChangeValue(-1000);
    }
    private _onTouchedBtnSub10000(): void {
        this._updateOnTouchedButtonsForChangeValue(-10000);
    }
    private _onTouchedBtnSub100000(): void {
        this._updateOnTouchedButtonsForChangeValue(-100000);
    }

    private _onTouchedBtn7(): void {
        this._updateOnTouchedButtonsForAddDigit(7);
    }
    private _onTouchedBtn8(): void {
        this._updateOnTouchedButtonsForAddDigit(8);
    }
    private _onTouchedBtn9(): void {
        this._updateOnTouchedButtonsForAddDigit(9);
    }
    private _onTouchedBtn6(): void {
        this._updateOnTouchedButtonsForAddDigit(6);
    }
    private _onTouchedBtn5(): void {
        this._updateOnTouchedButtonsForAddDigit(5);
    }
    private _onTouchedBtn4(): void {
        this._updateOnTouchedButtonsForAddDigit(4);
    }
    private _onTouchedBtn3(): void {
        this._updateOnTouchedButtonsForAddDigit(3);
    }
    private _onTouchedBtn2(): void {
        this._updateOnTouchedButtonsForAddDigit(2);
    }
    private _onTouchedBtn1(): void {
        this._updateOnTouchedButtonsForAddDigit(1);
    }
    private _onTouchedBtn0(): void {
        this._updateOnTouchedButtonsForAddDigit(0);
    }
    private _onTouchedBtnSign(): void {
        this._value = -this._value;
        this._updateLabelValue();
    }
    private _onTouchedBtnBackspace(): void {
        this._updateOnBackspace();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._btnConfirm.setLangText(TextType.B0026);
        this._btnClear.setText(`C`);
        this._labelTips.setText(`${getText(TextType.B0319)}: [${openData.minValue}, ${openData.maxValue}]`);
        this._layoutValue.arrangeItems();
    }

    private _updateLabelValue(): void {
        const value = this._value;
        const label = this._labelValue;
        label.setText(`${value}`);

        const openData = this.getOpenData();
        if (openData != null) {
            if ((value != null) && ((value > openData.maxValue) || (value < openData.minValue))) {
                label.setTextColor(0xFF7700);
            } else {
                label.setTextColor(0xFFFFFF);
            }
        } else {
            label.setTextColor(0xFFFFFF);
        }

        this._layoutValue.arrangeItems();
    }

    private _updateOnTouchedButtonsForChangeValue(offset: number): void {
        const newValue = this._getValueInRange(this._value + offset);
        if (newValue == null) {
            return;
        }

        this._value = newValue;
        this._updateLabelValue();
    }
    private _updateOnTouchedButtonsForAddDigit(num: number): void {
        const value     = this._value;
        // const newValue  = this._getValueInRange(value >= 0 ? (value * 10 + num) : (value * 10 - num));
        // if (newValue == null) {
        //     return;
        // }
        // this._value = newValue;
        this._value = value >= 0 ? (value * 10 + num) : (value * 10 - num);

        this._updateLabelValue();
    }
    private _updateOnBackspace(): void {
        this._value = Math.trunc(this._value / 10);
        this._updateLabelValue();
    }

    private _getValueInRange(rawValue: number): number | undefined {
        const openData = this.getOpenData();
        if (openData == null) {
            return undefined;
        }
        return getValueInRange({
            minValue    : openData.minValue,
            maxValue    : openData.maxValue,
            rawValue    : rawValue,
        });
    }

    private async _handleKeyboardCtrlC(): Promise<void> {
        if (navigator?.clipboard?.writeText == null) {
            show(getText(TextType.A0275));
        } else {
            try {
                await navigator.clipboard.writeText(`${this._value}`);
                showLang(TextType.OperationSucceeded);
            } catch {
                show(getText(TextType.A0275));
            }
        }
    }
    private async _handleKeyboardCtrlV(): Promise<void> {
        if (navigator?.clipboard?.writeText == null) {
            show(getText(TextType.A0275));
        } else {
            let text = ``;
            try {
                text = await navigator.clipboard.readText();
            } catch {
                show(getText(TextType.A0275));
                return;
            }

            const value = parseInt(text);
            if (isNaN(value)) {
                showLang(TextType.A0098);
            } else {
                this._value = value;
                this._updateLabelValue();
                showLang(TextType.OperationSucceeded);
            }
        }
    }
}
