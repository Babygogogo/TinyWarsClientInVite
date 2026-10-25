import type { IUiComponent } from "./IUiComponent.ts";
import type { IUiContainerBase } from "./IUiContainerBase.ts";
import type { UiOrientation } from "../types/UiOrientation.ts";
import type { UiScrollerOptions } from "../types/UiScrollerOptions.ts";

export interface IUiScrollerBase extends IUiContainerBase {
    getIsTouchChildrenEnabled(): boolean;
    setIsTouchChildrenEnabled(enabled: boolean): void;

    setUnscaledManualWidth(width: number | undefined, needArrange?: boolean): boolean;
    setUnscaledManualHeight(height: number | undefined, needArrange?: boolean): boolean;

    getOptions(): UiScrollerOptions;
    setOptions(options: UiScrollerOptions): void;

    getItem(index: number): IUiComponent | undefined;
    getAllItems(): IUiComponent[] | undefined;

    getOrientation(): UiOrientation | undefined;
    setOrientation(orientation: UiOrientation | undefined): void;

    getIsScrollable(): boolean;
    setIsScrollable(value: boolean): void;

    updateOnItemsChanged(): void;

    scrollBottom(): void;
    scrollTop(): void;
    scrollToItem(index: number): void;
    getScrollX(): number;
    setScrollX(value: number): void;
    getScrollY(): number;
    setScrollY(value: number): void;
}
