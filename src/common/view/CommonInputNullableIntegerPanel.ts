import {
    Keyboard_KbTypes,
    GamePanels_Dict,
    Lang_Utils,
    Numbers_Utils,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export interface OpenData {
    getTitle        : () => string;
    currentValue    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    maxValue        : number;
    minValue        : number;
    getHelpText?    : (() => string);
    callback        : (value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>) => any;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitch!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupValue!           : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelTips!            : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelValue!           : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnMin!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnMax!               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelKeyboardTips!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnEmpty!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClear!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!           : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupOperator!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnAdd1!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd10!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd100!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd1000!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd10000!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd100000!         : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub1!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub10!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub100!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub1000!           : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub10000!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSub100000!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupNumber!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btn7!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btn8!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btn9!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btn6!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btn5!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btn4!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btn3!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btn2!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btn1!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btn0!                 : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSign!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnBackspace!         : Ui_Interfaces_IUiButton.IUiButton;

    private _value: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,    callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnConfirm,     callback : this._onTouchedBtnConfirm },
            { ui : this._btnEmpty,       callback : this._onTouchedBtnEmpty },
            { ui : this._btnClear,       callback : this._onTouchedBtnClear },
            { ui : this._btnHelp,        callback : this._onTouchedBtnHelp },
            { ui : this._btnSwitch,      callback : this._onTouchedBtnSwitch },

            { ui : this._btnMin,         callback : this._onTouchedBtnMin },
            { ui : this._btnMax,         callback : this._onTouchedBtnMax },

            { ui : this._btnAdd1,        callback : this._onTouchedBtnAdd1 },
            { ui : this._btnAdd10,       callback : this._onTouchedBtnAdd10 },
            { ui : this._btnAdd100,      callback : this._onTouchedBtnAdd100 },
            { ui : this._btnAdd1000,     callback : this._onTouchedBtnAdd1000 },
            { ui : this._btnAdd10000,    callback : this._onTouchedBtnAdd10000 },
            { ui : this._btnAdd100000,   callback : this._onTouchedBtnAdd100000 },
            { ui : this._btnSub1,        callback : this._onTouchedBtnSub1 },
            { ui : this._btnSub10,       callback : this._onTouchedBtnSub10 },
            { ui : this._btnSub100,      callback : this._onTouchedBtnSub100 },
            { ui : this._btnSub1000,     callback : this._onTouchedBtnSub1000 },
            { ui : this._btnSub10000,    callback : this._onTouchedBtnSub10000 },
            { ui : this._btnSub100000,   callback : this._onTouchedBtnSub100000 },

            { ui : this._btn7,           callback : this._onTouchedBtn7 },
            { ui : this._btn8,           callback : this._onTouchedBtn8 },
            { ui : this._btn9,           callback : this._onTouchedBtn9 },
            { ui : this._btn6,           callback : this._onTouchedBtn6 },
            { ui : this._btn5,           callback : this._onTouchedBtn5 },
            { ui : this._btn4,           callback : this._onTouchedBtn4 },
            { ui : this._btn3,           callback : this._onTouchedBtn3 },
            { ui : this._btn2,           callback : this._onTouchedBtn2 },
            { ui : this._btn1,           callback : this._onTouchedBtn1 },
            { ui : this._btn0,           callback : this._onTouchedBtn0 },
            { ui : this._btnSign,        callback : this._onTouchedBtnSign },
            { ui : this._btnBackspace,   callback : this._onTouchedBtnBackspace },
        ]);
        this._setKeyboardListener({
            callback   : this._onKeyboard,
            thisObject : this,
        });
        this._setIsTouchMaskEnabled();
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
        this._labelKeyboardTips.setLangText(Lang_Constants.TextType.A0827);
        this._btnHelp.setIsVisible(!!openData.getHelpText);
        this._groupNumber.setIsVisible(true);
        this._groupOperator.setIsVisible(false);

        this._value = openData.currentValue;
        this._updateLabelValue();
    }

    private _onKeyboard(data: Keyboard_KbTypes.EventData): void {
        if (this._getIsShowingCloseAnimation()) {
            return;
        }

        if (data.isHandled) {
            return;
        }
        data.isHandled = true;

        const newKeys   = data.newKeys;
        const allKeys   = data.allKeys;
        const oldValue  = this._value;
        if (newKeys.has(Keyboard_KbTypes.KeyCode.Escape)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this.closePanel();

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Enter)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonConfirm01);
            this._onTouchedBtnConfirm();

        } else if ((allKeys.has(Keyboard_KbTypes.KeyCode.Control)) && (newKeys.has(Keyboard_KbTypes.KeyCode.C))) {
            this._handleKeyboardCtrlC();

        } else if ((allKeys.has(Keyboard_KbTypes.KeyCode.Control)) && (newKeys.has(Keyboard_KbTypes.KeyCode.V))) {
            this._handleKeyboardCtrlV();

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num0)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(0);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num1)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(1);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num2)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(2);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num3)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(3);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num4)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(4);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num5)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(5);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num6)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(6);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num7)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(7);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num8)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(8);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Num9)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            this._updateOnTouchedButtonsForAddDigit(9);

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Backspace)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonCancel01);
            this._updateOnBackspace();

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Add)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            if (oldValue != null) {
                this._value = Math.abs(oldValue);
                this._updateLabelValue();
            }

        } else if (newKeys.has(Keyboard_KbTypes.KeyCode.Sub)) {
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
            if (oldValue != null) {
                this._value = -Math.abs(oldValue);
                this._updateLabelValue();
            }
        }
    }

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const value = this._value;
        if ((value != null)                                             &&
            ((value < openData.minValue) || (value > openData.maxValue))
        ) {
            FloatText.showLang(Lang_Constants.TextType.A0098);
            return;
        }

        this.closePanel();
        openData.callback(value);
    }
    private _onTouchedBtnEmpty(): void {
        this._value = null;
        this._updateLabelValue();
    }
    private _onTouchedBtnClear(): void {
        this._value = 0;
        this._updateLabelValue();
    }
    private _onTouchedBtnHelp(): void {
        const func = this.getOpenData()?.getHelpText;
        if (func) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
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
        const value = this._value;
        if (value != null) {
            this._value = -value;
            this._updateLabelValue();
        }
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

        this._labelTips.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0319)}: [${openData.minValue}, ${openData.maxValue}]`);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnEmpty.setLangText(Lang_Constants.TextType.B0022);
        this._btnClear.setText(`C`);
        this._groupValue.arrangeItems();
    }

    private _updateLabelValue(): void {
        const value = this._value;
        const label = this._labelValue;
        label.setText(`${value == null ? Lang_Utils.getText(Lang_Constants.TextType.B0022) : value}`);

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

        this._groupValue.arrangeItems();
    }

    private _updateOnTouchedButtonsForChangeValue(offset: number): void {
        this._value = this._getValueInRange((this._value ?? 0) + offset);
        this._updateLabelValue();
    }
    private _updateOnTouchedButtonsForAddDigit(num: number): void {
        const value = this._value ?? 0;
        // this._value = this._getValueInRange(value >= 0 ? (value * 10 + num) : (value * 10 - num));
        this._value = value >= 0 ? (value * 10 + num) : (value * 10 - num);
        this._updateLabelValue();
    }
    private _updateOnBackspace(): void {
        const value = this._value;
        if (value != null) {
            this._value = Math.trunc(value / 10);
            this._updateLabelValue();
        }
    }

    private _getValueInRange(rawValue: number): number | undefined {
        const openData = this.getOpenData();
        if (openData == null) {
            return undefined;
        } else {
            return Numbers_Utils.getValueInRange({
                minValue : openData.minValue,
                maxValue : openData.maxValue,
                rawValue : rawValue,
            });
        }
    }

    private async _handleKeyboardCtrlC(): Promise<void> {
        if (navigator?.clipboard?.writeText == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0275));
        } else {
            try {
                await navigator.clipboard.writeText(`${this._value}`);
                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
            } catch {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0275));
            }
        }
    }
    private async _handleKeyboardCtrlV(): Promise<void> {
        if (navigator?.clipboard?.writeText == null) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0275));
        } else {
            let text = ``;
            try {
                text = await navigator.clipboard.readText();
            } catch {
                FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0275));
                return;
            }

            const value = parseInt(text);
            if (isNaN(value)) {
                FloatText.showLang(Lang_Constants.TextType.A0098);
            } else {
                this._value = value;
                this._updateLabelValue();
                FloatText.showLang(Lang_Constants.TextType.OperationSucceeded);
            }
        }
    }
}
