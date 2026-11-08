import {
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiContainerBase,
    type Ui_Types_UiOrientation,
    type Ui_Types_UiScrollerOptions,
} from "../../internal.ts";

export interface IUiScrollerBase extends Ui_Interfaces_IUiContainerBase.IUiContainerBase {
    getIsTouchChildrenEnabled(): boolean;
    setIsTouchChildrenEnabled(enabled: boolean): void;

    setUnscaledManualWidth(width: number | undefined, needArrange?: boolean): boolean;
    setUnscaledManualHeight(height: number | undefined, needArrange?: boolean): boolean;

    getOptions(): Ui_Types_UiScrollerOptions.UiScrollerOptions;
    setOptions(options: Ui_Types_UiScrollerOptions.UiScrollerOptions): void;

    getItem(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    getAllItems(): Ui_Interfaces_IUiComponent.IUiComponent[] | undefined;

    getOrientation(): Ui_Types_UiOrientation.UiOrientation | undefined;
    setOrientation(orientation: Ui_Types_UiOrientation.UiOrientation | undefined): void;

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
