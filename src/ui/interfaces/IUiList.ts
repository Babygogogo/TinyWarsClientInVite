import {
    type Ui_Interfaces_IUiLayoutBase,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface IUiList<DataForRenderer extends Ui_Types_UiListItemData.UiListItemData> extends Ui_Interfaces_IUiLayoutBase.IUiLayoutBase {
    getItemRendererClass(): (new () => Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>) | undefined;
    setItemRendererClass(itemRenderer: new () => Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): void;

    getRequireSelection(): boolean;
    setRequireSelection(value: boolean): void;

    getAllowMultiSelection(): boolean;
    setAllowMultiSelection(value: boolean): void;

    getMaxSelection(): number;
    setMaxSelection(value: number): void;

    bindData(dataArray: DataForRenderer[]): Promise<void>;
    getBoundDataArray(): (DataForRenderer | undefined)[];
    updateSingleData(index: number, data: DataForRenderer | undefined): Promise<void>;

    addItemByData(data: DataForRenderer): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>>;
    addItemsByData(dataArray: DataForRenderer[]): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[]>;

    removeItemAt(index: number): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined>;
    removeItem(item: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined>;
    removeAllItems(): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[]>;

    getItemAt(index: number): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined;
    getItemIndex(item: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): number;
    getAllItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[];

    getPreviousSelectedItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined;
    getPreviousSelectedItemIndexes(): number[] | undefined;

    getSelectedItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined;
    setSelectedItems(newItems: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined, needResetItemsSkin?: boolean): void;

    getSelectedDataArray(): (DataForRenderer | undefined)[] | undefined;

    getSelectedItemIndexes(): number[] | undefined;
    setSelectedItemIndexes(indexes: number[], needResetItemsSkin?: boolean): void;

    getFirstSelectedItem(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined;
    getFirstSelectedItemIndex(): number | undefined;
    getFirstSelectedData(): DataForRenderer | undefined;

    findIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
    getRevisedFirstIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
}
