import type * as UiInterfacesIUiComponent from "./IUiComponent.ts";
import type * as UiInterfacesIUiLayoutBase from "./IUiLayoutBase.ts";

export interface IUiLayout extends UiInterfacesIUiLayoutBase.IUiLayoutBase {
    getItemAt(index: number): UiInterfacesIUiComponent.IUiComponent | undefined;
    getAllItems(): UiInterfacesIUiComponent.IUiComponent[];

    addItem(item: UiInterfacesIUiComponent.IUiComponent, needArrange: boolean): UiInterfacesIUiComponent.IUiComponent;
    addItemAt(item: UiInterfacesIUiComponent.IUiComponent, index: number, needArrange: boolean): UiInterfacesIUiComponent.IUiComponent;

    removeItem(item: UiInterfacesIUiComponent.IUiComponent, needArrange: boolean): UiInterfacesIUiComponent.IUiComponent | undefined;
    removeItemAt(index: number, needArrange: boolean): UiInterfacesIUiComponent.IUiComponent | undefined;
    removeAllItems(needArrange: boolean): UiInterfacesIUiComponent.IUiComponent[];
}
