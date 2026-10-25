import { isPc } from "../../helpers/Compatibility.ts";
import { UiContainer } from "./UiContainer.ts";
import type { IUiLabel } from "../interfaces/IUiLabel.ts";
import type { IUiPromptedInput } from "../interfaces/IUiPromptedInput.ts";
import type { IUiTextInput } from "../interfaces/IUiTextInput.ts";
import type { UiSkinAttrs } from "../types/UiSkinAttrs.ts";
import { commonLoadSkinAttrsForSizer, getRevisedAttrValue } from "../utils/UiSkinHelpers.ts";

export class UiPromptedInput extends UiContainer implements IUiPromptedInput {
    private readonly _textInput?    : IUiTextInput;
    private readonly _labelPrompt?  : IUiLabel;

    public constructor() {
        super();

        // this.setMouseStyle(PointerManager.MouseStyleType.Text);
        // this.setIsTouchEnabled(true);

        this.getEventAgent().addAutoEnterFrameListener(this._onEnterFrame, this);
    }

    private _onEnterFrame(): void {
        this._updateLabelPrompt();
    }

    public loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
        commonLoadSkinAttrsForSizer(this, oldSkinAttrs, newSkinAttrs);

        const input = this.getInputComponent();
        if (input == null) {
            return;
        }

        const restrict          = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "restrict");
        const maxChars          = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "maxChars");
        const displayAsPassword = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "displayAsPassword");
        // const multiline         = Utils.UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "multiline");

        (restrict.needChange)           && (input.setRestrict(restrict.value));
        (maxChars.needChange)           && (input.setMaxLength(maxChars.value));
        (displayAsPassword.needChange)  && (input.setIsDisplayAsPassword(!!displayAsPassword.value));
        // (multiline.needChange)          && (input.setIsMultiline(!!multiline.value));
    }

    // GETTERS & SETTERS
    public getPromptComponent(): IUiLabel | undefined {
        return this._labelPrompt;
    }
    public getPromptText(): string | undefined {
        return this.getPromptComponent()?.getText();
    }
    public setPromptText(text: string): void {
        this.getPromptComponent()?.setText(text);
        this.getInputComponent()?.setDomPlaceholder(text);
    }

    public getInputComponent(): IUiTextInput | undefined {
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
        this.getPromptComponent()?.setIsVisible((isPc) && (!this.getInputComponent()?.getText().length));
    }
}
