import {
    Helpers_Misc,
    AuxiliaryTypes_TaskQueue,
    Ui_Components_UiList,
    Ui_Components_UiScrollerBase,
    type Ui_Interfaces_IUiList,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Egret_Egret,
} from "../../internal.ts";

export class UiScrollList<DataForRenderer extends Ui_Types_UiListItemData.UiListItemData>
    extends     Ui_Components_UiScrollerBase.UiScrollerBase
    implements  Ui_Interfaces_IUiScrollList.IUiScrollList<DataForRenderer> {
    private readonly _taskQueue = new AuxiliaryTypes_TaskQueue.TaskQueue();
    private _viewport?          : Ui_Interfaces_IUiList.IUiList<DataForRenderer>;

    private _getTaskQueue(): AuxiliaryTypes_TaskQueue.TaskQueue<any> {
        return this._taskQueue;
    }

    public initViewport(viewport: Ui_Interfaces_IUiList.IUiList<DataForRenderer>): void {
        if (this._getViewport()) {
            throw Helpers_Misc.newError(`Viewport initialized.`);
        }

        if (!(viewport instanceof Ui_Components_UiList.UiList)) {
            throw Helpers_Misc.newError(`UiScrollList only supports UiList as viewport, use UiScroller instead.`);
        }
        viewport.setUnscaledRequestedSize(this.getUnscaledManualWidth(), this.getUnscaledManualHeight());

        this._viewport = viewport;
        this.addChild(viewport as unknown as Egret_Egret.DisplayObjectContainer);
    }
    protected _getViewport(): Ui_Interfaces_IUiList.IUiList<DataForRenderer> | undefined {
        return this._viewport;
    }

    public setItemRendererClass(itemRenderer: new () => Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): void {
        Helpers_Misc.getExisted(this._getViewport()).setItemRendererClass(itemRenderer);
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
                (viewport.getRequireSelection() ? [0] : []),
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

    public async removeItem(item: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined> {
        const index = this.getAllItems()?.indexOf(item);
        if ((index == null) || (index < 0)) {
            return undefined;
        } else {
            return this.removeItemAt(index);
        }
    }
    public removeItemAt(index: number): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined> {
        return this._getTaskQueue().addTask(() => this._doRemoveItemAt(index));
    }
    private async _doRemoveItemAt(index: number): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined> {
        const item = await this._getViewport()?.removeItemAt(index);
        if (item) {
            this._resizeAllComponents();
        }

        return item;
    }
    public removeAllItems(): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined> {
        return this._getTaskQueue().addTask(() => this._doRemoveAllItems());
    }
    private async _doRemoveAllItems(): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined> {
        const items = await this._getViewport()?.removeAllItems();
        if (items?.length) {
            this._resizeAllComponents();
        }

        return items;
    }

    public override getAllItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._getViewport()?.getAllItems();
    }
    public override getItem(index: number): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined {
        return this._getViewport()?.getItemAt(index);
    }

    public getPreviousSelectedItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._getViewport()?.getPreviousSelectedItems();
    }
    public getPreviousSelectedItemIndexes(): number[] | undefined {
        return this._getViewport()?.getPreviousSelectedItemIndexes();
    }

    public getSelectedItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._getViewport()?.getSelectedItems();
    }
    public setSelectedItems(newItems: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined, needResetItemsSkin = true): void {
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
    public setSelectedItemIndex(index: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>, needResetItemsSkin = true): void {
        this.setSelectedItemIndexes(index == null ? [] : [index], needResetItemsSkin);
    }

    public getFirstSelectedItem(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined {
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
