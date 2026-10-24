import type * as UiInterfacesIUiLayoutBase from "./IUiLayoutBase.ts";
import type * as UiInterfacesIUiListItemRenderer from "./IUiListItemRenderer.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";

export interface IUiList<DataForRenderer extends UiTypesUiListItemData.UiListItemData> extends UiInterfacesIUiLayoutBase.IUiLayoutBase {
    getItemRendererClass(): (new () => UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>) | undefined;
    setItemRendererClass(itemRenderer: new () => UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): void;

    getRequireSelection(): boolean;
    setRequireSelection(value: boolean): void;

    getAllowMultiSelection(): boolean;
    setAllowMultiSelection(value: boolean): void;

    getMaxSelection(): number;
    setMaxSelection(value: number): void;

    bindData(dataArray: DataForRenderer[]): Promise<void>;
    getBoundDataArray(): (DataForRenderer | undefined)[];
    updateSingleData(index: number, data: DataForRenderer | undefined): Promise<void>;

    addItemByData(data: DataForRenderer): Promise<UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>>;
    addItemsByData(dataArray: DataForRenderer[]): Promise<UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[]>;

    removeItemAt(index: number): Promise<UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined>;
    removeItem(item: UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): Promise<UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined>;
    removeAllItems(): Promise<UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[]>;

    getItemAt(index: number): UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined;
    getItemIndex(item: UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): number;
    getAllItems(): UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[];

    getPreviousSelectedItems(): UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined;
    getPreviousSelectedItemIndexes(): number[] | undefined;

    getSelectedItems(): UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined;
    setSelectedItems(newItems: UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined, needResetItemsSkin?: boolean): void;

    getSelectedDataArray(): (DataForRenderer | undefined)[] | undefined;

    getSelectedItemIndexes(): number[] | undefined;
    setSelectedItemIndexes(indexes: number[], needResetItemsSkin?: boolean): void;

    getFirstSelectedItem(): UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined;
    getFirstSelectedItemIndex(): number | undefined;
    getFirstSelectedData(): DataForRenderer | undefined;

    findIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
    getRevisedFirstIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
}
