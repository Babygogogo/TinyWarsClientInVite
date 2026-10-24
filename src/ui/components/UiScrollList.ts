import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesTaskQueue from "../../auxiliaryTypes/TaskQueue.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as UiComponentsUiScrollerBase from "./UiScrollerBase.ts";
import type * as UiInterfacesIUiList from "../interfaces/IUiList.ts";
import type * as UiInterfacesIUiListItemRenderer from "../interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type IUiListItemRenderer<T extends UiTypesUiListItemData.UiListItemData> = UiInterfacesIUiListItemRenderer.IUiListItemRenderer<T>;

export class UiScrollList<DataForRenderer extends UiTypesUiListItemData.UiListItemData>
    extends     UiComponentsUiScrollerBase.UiScrollerBase
    implements  UiInterfacesIUiScrollList.IUiScrollList<DataForRenderer>
{
    private readonly _taskQueue = new AuxiliaryTypesTaskQueue.TaskQueue();
    private _viewport?          : UiInterfacesIUiList.IUiList<DataForRenderer>;

    private _getTaskQueue(): AuxiliaryTypesTaskQueue.TaskQueue<any> {
        return this._taskQueue;
    }

    public initViewport(viewport: UiInterfacesIUiList.IUiList<DataForRenderer>): void {
        if (this._getViewport()) {
            throw HelpersMisc.newError(`Viewport initialized.`);
        }

        if (!(viewport instanceof UiUtilsUiFactory.getUiListClass())) {
            throw HelpersMisc.newError(`UiScrollList only supports UiList as viewport, use UiScroller instead.`);
        }
        viewport.setUnscaledRequestedSize(this.getUnscaledManualWidth(), this.getUnscaledManualHeight());

        this._viewport = viewport;
        this.addChild(viewport as unknown as VendorEgretEgret.DisplayObjectContainer);
    }
    protected _getViewport(): UiInterfacesIUiList.IUiList<DataForRenderer> | undefined {
        return this._viewport;
    }

    public setItemRendererClass(itemRenderer: new () => IUiListItemRenderer<DataForRenderer>): void {
        HelpersMisc.getExisted(this._getViewport()).setItemRendererClass(itemRenderer);
    }

    public getMaxSelection(): number | undefined {
        return this._getViewport()?.getMaxSelection();
    }
    public setMaxSelection(value: number): void {
        this._getViewport()?.setMaxSelection(value);
    }

    public bindData(dataArray: DataForRenderer[], resetPosition = false, keepSelectedIndexes = false): Promise<void> {
        return this._getTaskQueue().addTask(() => this._doBindData(dataArray, resetPosition, keepSelectedIndexes));
    }
    private async _doBindData(dataArray: DataForRenderer[], resetPosition: boolean, keepSelectedIndexes: boolean): Promise<void> {
        const viewport = this._getViewport();
        if (viewport == null) {
            return;
        }

        const selectedIndexes   = this.getSelectedItemIndexes();
        const posX              = this.getScrollX();
        const posY              = this.getScrollY();
        await viewport.bindData(dataArray);
        this._resizeAllComponents();

        if (keepSelectedIndexes) {
            this.setSelectedItemIndexes(
                selectedIndexes                             ??
                (viewport.getRequireSelection() ? [0] : [])
            );
        }

        if (resetPosition) {
            this.scrollTop();
        } else {
            this.setScrollX(posX);
            this.setScrollY(posY);
        }
    }
    public getBoundDataArray(): (DataForRenderer | undefined)[] | undefined {
        return this._getViewport()?.getBoundDataArray();
    }
    public updateSingleData(index: number, data: DataForRenderer | undefined): Promise<void> {
        return this._getTaskQueue().addTask(() => this._doUpdateSingleData(index, data));
    }
    private async _doUpdateSingleData(index: number, data: DataForRenderer | undefined): Promise<void> {
        const viewport = this._getViewport();
        if (viewport) {
            await viewport.updateSingleData(index, data);
            this._resizeAllComponents();
        }
    }

    public async removeItem(item: IUiListItemRenderer<DataForRenderer>): Promise<IUiListItemRenderer<DataForRenderer> | undefined> {
        const index = this.getAllItems()?.indexOf(item);
        if ((index == null) || (index < 0)) {
            return undefined;
        } else {
            return this.removeItemAt(index);
        }
    }
    public removeItemAt(index: number): Promise<IUiListItemRenderer<DataForRenderer> | undefined> {
        return this._getTaskQueue().addTask(() => this._doRemoveItemAt(index));
    }
    private async _doRemoveItemAt(index: number): Promise<IUiListItemRenderer<DataForRenderer> | undefined> {
        const item = await this._getViewport()?.removeItemAt(index);
        if (item) {
            this._resizeAllComponents();
        }

        return item;
    }
    public removeAllItems(): Promise<IUiListItemRenderer<DataForRenderer>[] | undefined> {
        return this._getTaskQueue().addTask(() => this._doRemoveAllItems());
    }
    private async _doRemoveAllItems(): Promise<IUiListItemRenderer<DataForRenderer>[] | undefined> {
        const items = await this._getViewport()?.removeAllItems();
        if (items?.length) {
            this._resizeAllComponents();
        }

        return items;
    }

    public override getAllItems(): IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._getViewport()?.getAllItems();
    }
    public override getItem(index: number): IUiListItemRenderer<DataForRenderer> | undefined {
        return this._getViewport()?.getItemAt(index);
    }

    public getPreviousSelectedItems(): IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._getViewport()?.getPreviousSelectedItems();
    }
    public getPreviousSelectedItemIndexes(): number[] | undefined {
        return this._getViewport()?.getPreviousSelectedItemIndexes();
    }

    public getSelectedItems(): IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._getViewport()?.getSelectedItems();
    }
    public setSelectedItems(newItems: IUiListItemRenderer<DataForRenderer>[] | undefined, needResetItemsSkin = true): void {
        this._getViewport()?.setSelectedItems(newItems, needResetItemsSkin);
    }

    public getSelectedDataArray(): (DataForRenderer | undefined)[] | undefined {
        return this._getViewport()?.getSelectedDataArray();
    }

    public getSelectedItemIndexes(): number[] | undefined {
        return this._getViewport()?.getSelectedItemIndexes();
    }
    public setSelectedItemIndexes(indexes: number[], needResetItemsSkin = true): void {
        this._getViewport()?.setSelectedItemIndexes(indexes, needResetItemsSkin);
    }
    public setSelectedItemIndex(index: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>, needResetItemsSkin = true): void {
        this.setSelectedItemIndexes(index == null ? [] : [index], needResetItemsSkin);
    }

    public getFirstSelectedItem(): IUiListItemRenderer<DataForRenderer> | undefined {
        return this._getViewport()?.getFirstSelectedItem();
    }
    public getFirstSelectedItemIndex(): number | undefined {
        return this._getViewport()?.getFirstSelectedItemIndex();
    }
    public getFirstSelectedData(): DataForRenderer | undefined {
        return this._getViewport()?.getFirstSelectedData();
    }

    public findIndex(predicate: (v: DataForRenderer | undefined) => boolean): number {
        return this._getViewport()?.findIndex(predicate) ?? -1;
    }
    public getRevisedFirstIndex(predicate: (v: DataForRenderer | undefined) => boolean): number {
        return this._getViewport()?.getRevisedFirstIndex(predicate) ?? -1;
    }
}
