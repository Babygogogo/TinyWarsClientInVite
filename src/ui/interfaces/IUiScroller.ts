import {
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScrollerBase,
} from "../../internal.ts";

export interface IUiScroller<T extends Ui_Interfaces_IUiContainer.IUiContainer | Ui_Interfaces_IUiLayout.IUiLayout> extends Ui_Interfaces_IUiScrollerBase.IUiScrollerBase {
    initViewport(viewport: T): void;

    addItems(items: Ui_Interfaces_IUiComponent.IUiComponent[]): void;
    addItem(item: Ui_Interfaces_IUiComponent.IUiComponent): void;

    removeItem(item: Ui_Interfaces_IUiComponent.IUiComponent): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    removeItemAt(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    removeAllItems(): Ui_Interfaces_IUiComponent.IUiComponent[] | undefined;
}
