import type * as UiInterfacesIUiComponent from "./IUiComponent.ts";
import type * as UiTypesUiSizerOptions from "../types/UiSizerOptions.ts";

export interface IUiSizerInfo {
    getSizer(): UiInterfacesIUiComponent.IUiComponent;

    getIsEnabled(): boolean;
    setIsEnabled(isEnabled: boolean): void;

    /** 如果需要修改sizerOptions，需要重新调用setSizerOptions()，以便自动sizer正常运作 */
    getSizerOptions(): UiTypesUiSizerOptions.UiSizerOptions | undefined;
    setSizerOptions(options: UiTypesUiSizerOptions.UiSizerOptions | undefined): void;
    addSizerOptions(options: UiTypesUiSizerOptions.UiSizerOptions): void;

    getHasEverApplied(): boolean;
    setHasEverApplied(hasEverApplied: boolean): void;

    destroy(): void;
}
