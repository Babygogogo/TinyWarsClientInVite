import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { TaskQueue } from "../../auxiliaryTypes/TaskQueue.ts";
import {
    newError,
    getExisted,
} from "../../helpers/Misc.ts";
import { UiScrollerBase } from "./UiScrollerBase.ts";
import type { IUiList } from "../interfaces/IUiList.ts";
import type { IUiListItemRenderer } from "../interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";
import { getUiListClass } from "../utils/UiFactory.ts";
import type { DisplayObjectContainer } from "../../vendor/egret/Egret.ts";

export class UiScrollList<DataForRenderer extends UiListItemData>
    extends     UiScrollerBase
    implements  IUiScrollList<DataForRenderer>
{
    private readonly _taskQueue = new TaskQueue();
    private _viewport?          : IUiList<DataForRenderer>;

    private _getTaskQueue(): TaskQueue<any> {
        return this._taskQueue;
    }

    public initViewport(viewport: IUiList<DataForRenderer>): void {
        if (this._getViewport()) {
            throw newError(`Viewport initialized.`);
        }

        if (!(viewport instanceof getUiListClass())) {
            throw newError(`UiScrollList only supports UiList as viewport, use UiScroller instead.`);
        }
        viewport.setUnscaledRequestedSize(this.getUnscaledManualWidth(), this.getUnscaledManualHeight());

        this._viewport = viewport;
        this.addChild(viewport as unknown as DisplayObjectContainer);
    }
    protected _getViewport(): IUiList<DataForRenderer> | undefined {
        return this._viewport;
    }

    public setItemRendererClass(itemRenderer: new () => IUiListItemRenderer<DataForRenderer>): void {
        getExisted(this._getViewport()).setItemRendererClass(itemRenderer);
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
    public setSelectedItemIndex(index: Undefinable<number>, needResetItemsSkin = true): void {
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
