import {
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiContainerBase,
} from "../../internal.ts";

export interface IUiContainer extends Ui_Interfaces_IUiContainerBase.IUiContainerBase {
    getUiChildAt(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    getUiChildren(): Ui_Interfaces_IUiComponent.IUiComponent[];
    addUiChild(child: Ui_Interfaces_IUiComponent.IUiComponent): Ui_Interfaces_IUiComponent.IUiComponent;
    addUiChildAt(child: Ui_Interfaces_IUiComponent.IUiComponent, index: number): Ui_Interfaces_IUiComponent.IUiComponent;
    removeUiChild(child: Ui_Interfaces_IUiComponent.IUiComponent): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    removeUiChildAt(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    removeUiChildren(): Ui_Interfaces_IUiComponent.IUiComponent[];

    setUiChildIndex(child: Ui_Interfaces_IUiComponent.IUiComponent, index: number): void;
}
