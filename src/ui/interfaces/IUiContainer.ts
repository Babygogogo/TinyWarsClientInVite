import type * as UiInterfacesIUiComponent from "./IUiComponent.ts";
import type * as UiInterfacesIUiContainerBase from "./IUiContainerBase.ts";

export interface IUiContainer extends UiInterfacesIUiContainerBase.IUiContainerBase {
    getUiChildAt(index: number): UiInterfacesIUiComponent.IUiComponent | undefined;
    getUiChildren(): UiInterfacesIUiComponent.IUiComponent[];
    addUiChild(child: UiInterfacesIUiComponent.IUiComponent): UiInterfacesIUiComponent.IUiComponent;
    addUiChildAt(child: UiInterfacesIUiComponent.IUiComponent, index: number): UiInterfacesIUiComponent.IUiComponent;
    removeUiChild(child: UiInterfacesIUiComponent.IUiComponent): UiInterfacesIUiComponent.IUiComponent | undefined;
    removeUiChildAt(index: number): UiInterfacesIUiComponent.IUiComponent | undefined;
    removeUiChildren(): UiInterfacesIUiComponent.IUiComponent[];

    setUiChildIndex(child: UiInterfacesIUiComponent.IUiComponent, index: number): void;
}
