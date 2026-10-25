import type { IUiLayoutBase } from "./IUiLayoutBase.ts";
import type { IUiListItemRenderer } from "./IUiListItemRenderer.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";

export interface IUiList<DataForRenderer extends UiListItemData> extends IUiLayoutBase {
    getItemRendererClass(): (new () => IUiListItemRenderer<DataForRenderer>) | undefined;
    setItemRendererClass(itemRenderer: new () => IUiListItemRenderer<DataForRenderer>): void;

    getRequireSelection(): boolean;
    setRequireSelection(value: boolean): void;

    getAllowMultiSelection(): boolean;
    setAllowMultiSelection(value: boolean): void;

    getMaxSelection(): number;
    setMaxSelection(value: number): void;

    bindData(dataArray: DataForRenderer[]): Promise<void>;
    getBoundDataArray(): (DataForRenderer | undefined)[];
    updateSingleData(index: number, data: DataForRenderer | undefined): Promise<void>;

    addItemByData(data: DataForRenderer): Promise<IUiListItemRenderer<DataForRenderer>>;
    addItemsByData(dataArray: DataForRenderer[]): Promise<IUiListItemRenderer<DataForRenderer>[]>;

    removeItemAt(index: number): Promise<IUiListItemRenderer<DataForRenderer> | undefined>;
    removeItem(item: IUiListItemRenderer<DataForRenderer>): Promise<IUiListItemRenderer<DataForRenderer> | undefined>;
    removeAllItems(): Promise<IUiListItemRenderer<DataForRenderer>[]>;

    getItemAt(index: number): IUiListItemRenderer<DataForRenderer> | undefined;
    getItemIndex(item: IUiListItemRenderer<DataForRenderer>): number;
    getAllItems(): IUiListItemRenderer<DataForRenderer>[];

    getPreviousSelectedItems(): IUiListItemRenderer<DataForRenderer>[] | undefined;
    getPreviousSelectedItemIndexes(): number[] | undefined;

    getSelectedItems(): IUiListItemRenderer<DataForRenderer>[] | undefined;
    setSelectedItems(newItems: IUiListItemRenderer<DataForRenderer>[] | undefined, needResetItemsSkin?: boolean): void;

    getSelectedDataArray(): (DataForRenderer | undefined)[] | undefined;

    getSelectedItemIndexes(): number[] | undefined;
    setSelectedItemIndexes(indexes: number[], needResetItemsSkin?: boolean): void;

    getFirstSelectedItem(): IUiListItemRenderer<DataForRenderer> | undefined;
    getFirstSelectedItemIndex(): number | undefined;
    getFirstSelectedData(): DataForRenderer | undefined;

    findIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
    getRevisedFirstIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
}
