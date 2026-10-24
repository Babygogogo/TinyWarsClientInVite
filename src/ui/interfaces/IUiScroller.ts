import type * as UiInterfacesIUiComponent from "./IUiComponent.ts";
import type * as UiInterfacesIUiContainer from "./IUiContainer.ts";
import type * as UiInterfacesIUiLayout from "./IUiLayout.ts";
import type * as UiInterfacesIUiScrollerBase from "./IUiScrollerBase.ts";

type IUiComponent = UiInterfacesIUiComponent.IUiComponent;

export interface IUiScroller<T extends UiInterfacesIUiContainer.IUiContainer | UiInterfacesIUiLayout.IUiLayout> extends UiInterfacesIUiScrollerBase.IUiScrollerBase {
    initViewport(viewport: T): void;

    addItems(items: IUiComponent[]): void;
    addItem(item: IUiComponent): void;

    removeItem(item: IUiComponent): IUiComponent | undefined;
    removeItemAt(index: number): IUiComponent | undefined;
    removeAllItems(): IUiComponent[] | undefined;
}
