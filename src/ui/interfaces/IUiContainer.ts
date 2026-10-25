import type { IUiComponent } from "./IUiComponent.ts";
import type { IUiContainerBase } from "./IUiContainerBase.ts";

export interface IUiContainer extends IUiContainerBase {
    getUiChildAt(index: number): IUiComponent | undefined;
    getUiChildren(): IUiComponent[];
    addUiChild(child: IUiComponent): IUiComponent;
    addUiChildAt(child: IUiComponent, index: number): IUiComponent;
    removeUiChild(child: IUiComponent): IUiComponent | undefined;
    removeUiChildAt(index: number): IUiComponent | undefined;
    removeUiChildren(): IUiComponent[];

    setUiChildIndex(child: IUiComponent, index: number): void;
}
