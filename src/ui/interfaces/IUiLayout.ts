import {
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiLayoutBase,
} from "../../internal.ts";

export interface IUiLayout extends Ui_Interfaces_IUiLayoutBase.IUiLayoutBase {
    getItemAt(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    getAllItems(): Ui_Interfaces_IUiComponent.IUiComponent[];

    addItem(item: Ui_Interfaces_IUiComponent.IUiComponent, needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent;
    addItemAt(item: Ui_Interfaces_IUiComponent.IUiComponent, index: number, needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent;

    removeItem(item: Ui_Interfaces_IUiComponent.IUiComponent, needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    removeItemAt(index: number, needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    removeAllItems(needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent[];
}
