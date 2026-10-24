import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as UiInterfacesIUiList from "./IUiList.ts";
import type * as UiInterfacesIUiListItemRenderer from "./IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollerBase from "./IUiScrollerBase.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";

type IUiListItemRenderer<T extends UiTypesUiListItemData.UiListItemData> = UiInterfacesIUiListItemRenderer.IUiListItemRenderer<T>;

export interface IUiScrollList<DataForRenderer extends UiTypesUiListItemData.UiListItemData> extends UiInterfacesIUiScrollerBase.IUiScrollerBase {
    initViewport(viewport: UiInterfacesIUiList.IUiList<DataForRenderer>): void;

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
    setSelectedItemIndex(index: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>, needResetItemsSkin?: boolean): void;

    getFirstSelectedItem(): IUiListItemRenderer<DataForRenderer> | undefined;
    getFirstSelectedItemIndex(): number | undefined;
    getFirstSelectedData(): DataForRenderer | undefined;

    findIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
    getRevisedFirstIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
}
