import type { IUiComponent } from "./IUiComponent.ts";
import type { UiSizerOptions } from "../types/UiSizerOptions.ts";

export interface IUiSizerInfo {
    getSizer(): IUiComponent;

    getIsEnabled(): boolean;
    setIsEnabled(isEnabled: boolean): void;

    /** 如果需要修改sizerOptions，需要重新调用setSizerOptions()，以便自动sizer正常运作 */
    getSizerOptions(): UiSizerOptions | undefined;
    setSizerOptions(options: UiSizerOptions | undefined): void;
    addSizerOptions(options: UiSizerOptions): void;

    getHasEverApplied(): boolean;
    setHasEverApplied(hasEverApplied: boolean): void;

    destroy(): void;
}
