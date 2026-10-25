import type { IUiComponent as UiInterfacesIUiComponent } from "./IUiComponent.ts";
import type { IUiContainer } from "./IUiContainer.ts";
import type { IUiLayout } from "./IUiLayout.ts";
import type { IUiScrollerBase } from "./IUiScrollerBase.ts";

type IUiComponent = UiInterfacesIUiComponent;

export interface IUiScroller<T extends IUiContainer | IUiLayout> extends IUiScrollerBase {
    initViewport(viewport: T): void;

    addItems(items: IUiComponent[]): void;
    addItem(item: IUiComponent): void;

    removeItem(item: IUiComponent): IUiComponent | undefined;
    removeItemAt(index: number): IUiComponent | undefined;
    removeAllItems(): IUiComponent[] | undefined;
}
