import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IUiList } from "./IUiList.ts";
import type { IUiListItemRenderer } from "./IUiListItemRenderer.ts";
import type { IUiScrollerBase } from "./IUiScrollerBase.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";

export interface IUiScrollList<DataForRenderer extends UiListItemData> extends IUiScrollerBase {
    initViewport(viewport: IUiList<DataForRenderer>): void;

    setItemRendererClass(itemRenderer: new () => IUiListItemRenderer<DataForRenderer>): void;

    getMaxSelection(): number | undefined;
    setMaxSelection(value: number): void;

    bindData(dataArray: DataForRenderer[], resetPosition?: boolean, keepSelectedIndexes?: boolean): Promise<void>;
    getBoundDataArray(): (DataForRenderer | undefined)[] | undefined;
    updateSingleData(index: number, data: DataForRenderer | undefined): Promise<void>;

    removeItem(item: IUiListItemRenderer<DataForRenderer>): Promise<IUiListItemRenderer<DataForRenderer> | undefined>;
    removeItemAt(itemId: number): Promise<IUiListItemRenderer<DataForRenderer> | undefined>;
    removeAllItems(): Promise<IUiListItemRenderer<DataForRenderer>[] | undefined>;

    getAllItems(): IUiListItemRenderer<DataForRenderer>[] | undefined;
    getItem(index: number): IUiListItemRenderer<DataForRenderer> | undefined;

    getPreviousSelectedItems(): IUiListItemRenderer<DataForRenderer>[] | undefined;
    getPreviousSelectedItemIndexes(): number[] | undefined;

    getSelectedItems(): IUiListItemRenderer<DataForRenderer>[] | undefined;
    setSelectedItems(newItems: IUiListItemRenderer<DataForRenderer>[] | undefined, needResetItemsSkin?: boolean): void;

    getSelectedDataArray(): (DataForRenderer | undefined)[] | undefined;

    getSelectedItemIndexes(): number[] | undefined;
    setSelectedItemIndexes(indexes: number[], needResetItemsSkin?: boolean): void;
    setSelectedItemIndex(index: Undefinable<number>, needResetItemsSkin?: boolean): void;

    getFirstSelectedItem(): IUiListItemRenderer<DataForRenderer> | undefined;
    getFirstSelectedItemIndex(): number | undefined;
    getFirstSelectedData(): DataForRenderer | undefined;

    findIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
    getRevisedFirstIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
}
