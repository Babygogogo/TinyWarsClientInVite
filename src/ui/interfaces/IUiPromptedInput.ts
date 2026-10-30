import {
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiTextInput,
} from "../../internal.ts";

export interface IUiPromptedInput extends Ui_Interfaces_IUiContainer.IUiContainer {
    getPromptComponent(): Ui_Interfaces_IUiLabel.IUiLabel | undefined;
    getPromptText(): string | undefined;
    setPromptText(text: string): void;

    getInputComponent(): Ui_Interfaces_IUiTextInput.IUiTextInput | undefined;
    getInputText(): string | undefined;
    setInputText(text: string): void;
    trimInputText(): string | undefined;
    getInputMaxLength(): number | undefined;
    setInputMaxLength(length: number | undefined): void;
    getInputRestrict(): RegExp | undefined;
    setInputRestrict(restrict: string | RegExp | undefined): void;
    getInputMultiline(): boolean | undefined;
    setInputMultiline(isMultiline: boolean): void;
}
