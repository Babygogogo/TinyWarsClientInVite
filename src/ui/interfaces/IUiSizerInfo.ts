import {
    type Ui_Interfaces_IUiComponent,
    type Ui_Types_UiSizerOptions,
} from "../../internal.ts";

export interface IUiSizerInfo {
    getSizer(): Ui_Interfaces_IUiComponent.IUiComponent;

    getIsEnabled(): boolean;
    setIsEnabled(isEnabled: boolean): void;

    /** 如果需要修改sizerOptions，需要重新调用setSizerOptions()，以便自动sizer正常运作 */
    getSizerOptions(): Ui_Types_UiSizerOptions.UiSizerOptions | undefined;
    setSizerOptions(options: Ui_Types_UiSizerOptions.UiSizerOptions | undefined): void;
    addSizerOptions(options: Ui_Types_UiSizerOptions.UiSizerOptions): void;

    getHasEverApplied(): boolean;
    setHasEverApplied(hasEverApplied: boolean): void;

    destroy(): void;
}
