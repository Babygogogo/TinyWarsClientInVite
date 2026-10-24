import type * as UiInterfacesIUiComponent from "./IUiComponent.ts";
import type * as UiInterfacesIUiContainerBase from "./IUiContainerBase.ts";
import type * as UiTypesUiOrientation from "../types/UiOrientation.ts";
import type * as UiTypesUiScrollerOptions from "../types/UiScrollerOptions.ts";

type UiOrientation      = UiTypesUiOrientation.UiOrientation;
type UiScrollerOptions  = UiTypesUiScrollerOptions.UiScrollerOptions;

export interface IUiScrollerBase extends UiInterfacesIUiContainerBase.IUiContainerBase {
    getIsTouchChildrenEnabled(): boolean;
    setIsTouchChildrenEnabled(enabled: boolean): void;

    setUnscaledManualWidth(width: number | undefined, needArrange?: boolean): boolean;
    setUnscaledManualHeight(height: number | undefined, needArrange?: boolean): boolean;

    getOptions(): UiScrollerOptions;
    setOptions(options: UiScrollerOptions): void;

    getItem(index: number): UiInterfacesIUiComponent.IUiComponent | undefined;
    getAllItems(): UiInterfacesIUiComponent.IUiComponent[] | undefined;

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
