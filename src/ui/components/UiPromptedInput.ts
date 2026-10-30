import {
    Ui_Utils_UiSkinHelpers,
    Helpers_Compatibility,
    Ui_Components_UiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiPromptedInput,
    type Ui_Interfaces_IUiTextInput,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

export class UiPromptedInput extends Ui_Components_UiContainer.UiContainer implements Ui_Interfaces_IUiPromptedInput.IUiPromptedInput {
    private readonly _textInput?    : Ui_Interfaces_IUiTextInput.IUiTextInput;
    private readonly _labelPrompt?  : Ui_Interfaces_IUiLabel.IUiLabel;

    public constructor() {
        super();

        // this.setMouseStyle(PointerManager.MouseStyleType.Text);
        // this.setIsTouchEnabled(true);

        this.getEventAgent().addAutoEnterFrameListener(this._onEnterFrame, this);
    }

    private _onEnterFrame(): void {
        this._updateLabelPrompt();
    }

    public loadSkinAttrs(oldSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined, newSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
        Ui_Utils_UiSkinHelpers.commonLoadSkinAttrsForSizer(this, oldSkinAttrs, newSkinAttrs);

        const input = this.getInputComponent();
        if (input == null) {
            return;
        }

        const restrict          = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "restrict");
        const maxChars          = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "maxChars");
        const displayAsPassword = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "displayAsPassword");
        // const multiline         = Utils.UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "multiline");

        (restrict.needChange)           && (input.setRestrict(restrict.value));
        (maxChars.needChange)           && (input.setMaxLength(maxChars.value));
        (displayAsPassword.needChange)  && (input.setIsDisplayAsPassword(!!displayAsPassword.value));
        // (multiline.needChange)          && (input.setIsMultiline(!!multiline.value));
    }

    // GETTERS & SETTERS
    public getPromptComponent(): Ui_Interfaces_IUiLabel.IUiLabel | undefined {
        return this._labelPrompt;
    }
    public getPromptText(): string | undefined {
        return this.getPromptComponent()?.getText();
    }
    public setPromptText(text: string): void {
        this.getPromptComponent()?.setText(text);
        this.getInputComponent()?.setDomPlaceholder(text);
    }

    public getInputComponent(): Ui_Interfaces_IUiTextInput.IUiTextInput | undefined {
        return this._textInput;
    }
    public getInputText(): string | undefined {
        return this.getInputComponent()?.getText();
    }
    public setInputText(text: string): void {
        this.getInputComponent()?.setText(text);
    }
    public trimInputText(): string | undefined {
        const input = this.getInputComponent();
        if (input == null) {
            return undefined;
        }

        const text = input.getText().trim();
        input.setText(text);
        return text;
    }
    public getInputMaxLength(): number | undefined {
        return this.getInputComponent()?.getMaxLength();
    }
    public setInputMaxLength(length: number | undefined): void {
        this.getInputComponent()?.setMaxLength(length);
    }
    public getInputRestrict(): RegExp | undefined {
        return this.getInputComponent()?.getRestrict();
    }
    public setInputRestrict(restrict: string | RegExp | undefined): void {
        this.getInputComponent()?.setRestrict(restrict);
    }
    public getInputMultiline(): boolean | undefined {
        return this.getInputComponent()?.getIsMultiline();
    }
    public setInputMultiline(isMultiline: boolean): void {
        this.getInputComponent()?.setIsMultiline(isMultiline);
    }

    // INPUT SUBSTITUTION
    private _updateLabelPrompt(): void {
        this.getPromptComponent()?.setIsVisible((Helpers_Compatibility.isPc) && (!this.getInputComponent()?.getText().length));
    }
}
