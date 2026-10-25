import type { IUiComponent } from "./IUiComponent.ts";
import type { IUiLayoutBase } from "./IUiLayoutBase.ts";

export interface IUiLayout extends IUiLayoutBase {
    getItemAt(index: number): IUiComponent | undefined;
    getAllItems(): IUiComponent[];

    addItem(item: IUiComponent, needArrange: boolean): IUiComponent;
    addItemAt(item: IUiComponent, index: number, needArrange: boolean): IUiComponent;

    removeItem(item: IUiComponent, needArrange: boolean): IUiComponent | undefined;
    removeItemAt(index: number, needArrange: boolean): IUiComponent | undefined;
    removeAllItems(needArrange: boolean): IUiComponent[];
}
