import type * as UiInterfacesIUiContainer from "./IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "./IUiLabel.ts";
import type * as UiInterfacesIUiTextInput from "./IUiTextInput.ts";

export interface IUiPromptedInput extends UiInterfacesIUiContainer.IUiContainer {
    getPromptComponent(): UiInterfacesIUiLabel.IUiLabel | undefined;
    getPromptText(): string | undefined;
    setPromptText(text: string): void;

    getInputComponent(): UiInterfacesIUiTextInput.IUiTextInput | undefined;
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
