import {
    type Ui_Interfaces_IUiList,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollerBase,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export interface IUiScrollList<DataForRenderer extends Ui_Types_UiListItemData.UiListItemData> extends Ui_Interfaces_IUiScrollerBase.IUiScrollerBase {
    initViewport(viewport: Ui_Interfaces_IUiList.IUiList<DataForRenderer>): void;

    setItemRendererClass(itemRenderer: new () => Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): void;

    getMaxSelection(): number | undefined;
    setMaxSelection(value: number): void;

    bindData(dataArray: DataForRenderer[], resetPosition?: boolean, keepSelectedIndexes?: boolean): Promise<void>;
    getBoundDataArray(): (DataForRenderer | undefined)[] | undefined;
    updateSingleData(index: number, data: DataForRenderer | undefined): Promise<void>;

    removeItem(item: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined>;
    removeItemAt(itemId: number): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined>;
    removeAllItems(): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined>;

    getAllItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined;
    getItem(index: number): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined;

    getPreviousSelectedItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined;
    getPreviousSelectedItemIndexes(): number[] | undefined;

    getSelectedItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined;
    setSelectedItems(newItems: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined, needResetItemsSkin?: boolean): void;

    getSelectedDataArray(): (DataForRenderer | undefined)[] | undefined;

    getSelectedItemIndexes(): number[] | undefined;
    setSelectedItemIndexes(indexes: number[], needResetItemsSkin?: boolean): void;
    setSelectedItemIndex(index: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>, needResetItemsSkin?: boolean): void;

    getFirstSelectedItem(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined;
    getFirstSelectedItemIndex(): number | undefined;
    getFirstSelectedData(): DataForRenderer | undefined;

    findIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
    getRevisedFirstIndex(predicate: (v: DataForRenderer | undefined) => boolean): number;
}
