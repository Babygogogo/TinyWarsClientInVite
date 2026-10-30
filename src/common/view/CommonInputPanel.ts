import {
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Types_UiInputEventType,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
} from "../../internal.ts";

export type OpenData = {
    title           : string;
    currentValue    : string;
    tips            : string | null;
    minLength?      : number;
    maxChars        : number | null;
    charRestrict    : string | null;
    canBeEmpty?     : boolean;
    isMultiLine?    : boolean;
    isAutoClose?    : boolean;          // 留空=true
    callback        : (panel: Panel) => any;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _input!        : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnDelete!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnCancel!    : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!   : Ui_Interfaces_IUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            { ui: this._btnCancel,  callback: this.closePanel, },
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
        ]);
        this._setInputListenerArray([
            { ui: this._input,      callback: this._onFocusOutInput,    eventType: Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelTitle.setText(openData.title);

        const input = this._input;
        const text  = openData.currentValue;
        input.setInputText(text);
        input.setInputMaxLength(openData.maxChars ?? undefined);
        input.setInputRestrict(openData.charRestrict ?? undefined);
        input.setPromptText(openData.tips ?? ``);
        input.setInputMultiline(!!openData.isMultiLine);

        // egret.setTimeout(() => this._activateInput(), null, GameConfig.Graphic.TweenConst.DefaultDuration + 50);
    }

    public getInputText(): string {
        return this._input.trimInputText() ?? ``;
    }

    private _onTouchedBtnDelete(): void {
        this._input.setInputText(``);
    }

    private _onTouchedBtnConfirm(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const text          = this.getInputText();
        const textLength    = text.length;
        if ((!openData.canBeEmpty) && (!textLength)) {
            FloatText.showLang(Lang_Constants.TextType.A0787);
            return;
        }

        const minLength = openData.minLength;
        if ((minLength != null) && (textLength < minLength)) {
            FloatText.showLang(Lang_Constants.TextType.A0155);
            return;
        }

        openData.callback(this);

        if (openData.isAutoClose !== false) {
            this.closePanel();
        }
    }

    private _onFocusOutInput(): void {
        this._input.trimInputText();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0026);
        this._btnCancel.setLangText(Lang_Constants.TextType.B0154);
    }
}
