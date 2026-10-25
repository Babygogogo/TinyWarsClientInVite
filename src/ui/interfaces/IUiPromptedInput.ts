import type { IUiContainer } from "./IUiContainer.ts";
import type { IUiLabel } from "./IUiLabel.ts";
import type { IUiTextInput } from "./IUiTextInput.ts";

export interface IUiPromptedInput extends IUiContainer {
    getPromptComponent(): IUiLabel | undefined;
    getPromptText(): string | undefined;
    setPromptText(text: string): void;

    getInputComponent(): IUiTextInput | undefined;
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
