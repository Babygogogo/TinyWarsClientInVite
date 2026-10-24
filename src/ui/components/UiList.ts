import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as ResManager2 from "../../ResManager.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiLayoutBase from "./UiLayoutBase.ts";
import type * as UiInterfacesIUiComponent from "../interfaces/IUiComponent.ts";
import type * as UiInterfacesIUiList from "../interfaces/IUiList.ts";
import type * as UiInterfacesIUiListItemRenderer from "../interfaces/IUiListItemRenderer.ts";
import * as UiTypesUiCommonEventType from "../types/UiCommonEventType.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";
import type * as UiTypesUiSkinAttrs from "../types/UiSkinAttrs.ts";
import * as UiTypesUiSkinState from "../types/UiSkinState.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";
import * as UiUtilsUiLayoutHelpers from "../utils/UiLayoutHelpers.ts";
import * as UiUtilsUiSizerHelpers from "../utils/UiSizerHelpers.ts";
import * as UiUtilsUiSkinHelpers from "../utils/UiSkinHelpers.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type UiSkinAttrs                                            = UiTypesUiSkinAttrs.UiSkinAttrs;
type IUiListItemRenderer<T extends UiTypesUiListItemData.UiListItemData>    = UiInterfacesIUiListItemRenderer.IUiListItemRenderer<T>;

export class UiList<DataForRenderer extends UiTypesUiListItemData.UiListItemData>
    extends UiComponentsUiLayoutBase.UiLayoutBase
    implements UiInterfacesIUiList.IUiList<DataForRenderer>
{
    private _previousSelectedItems? : IUiListItemRenderer<DataForRenderer>[];
    private _selectedItems?         : IUiListItemRenderer<DataForRenderer>[];

    private _itemRendererClass?     : new () => IUiListItemRenderer<DataForRenderer>;
    private _requireSelection       = false;
    private _allowMultiSelection    = false;
    private _maxSelection           = Number.MAX_SAFE_INTEGER;

    public override loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
        super.loadSkinAttrs(oldSkinAttrs, newSkinAttrs);

        const requireSelection      = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "requireSelection");
        const allowMultiSelection   = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "allowMultiSelection");
        (requireSelection.needChange)      && (this.setRequireSelection(!!requireSelection.value));
        (allowMultiSelection.needChange)   && (this.setAllowMultiSelection(!!allowMultiSelection.value));
    }

    public getItemRendererClass(): (new () => IUiListItemRenderer<DataForRenderer>) | undefined {
        return this._itemRendererClass;
    }
    public setItemRendererClass(itemRenderer: new () => IUiListItemRenderer<DataForRenderer>): void {
        this._itemRendererClass = itemRenderer;
    }

    public getRequireSelection(): boolean {
        return this._requireSelection;
    }
    public setRequireSelection(value: boolean): void {
        this._requireSelection = value;
    }

    public getAllowMultiSelection(): boolean {
        return this._allowMultiSelection;
    }
    public setAllowMultiSelection(value: boolean): void {
        this._allowMultiSelection = value;
    }

    public getMaxSelection(): number {
        return this._maxSelection;
    }
    public setMaxSelection(value: number): void {
        this._maxSelection = value;
    }

    public async bindData(dataArray: DataForRenderer[]): Promise<void> {
        await this.removeAllItems();
        await this.addItemsByData(dataArray);
    }
    public getBoundDataArray(): (DataForRenderer | undefined)[] {
        return this.getAllItems().map(v => v.getOpenData());
    }
    public async updateSingleData(index: number, data: DataForRenderer | undefined): Promise<void> {
        const item = this.getItemAt(index);
        if (item) {
            item.setOpenData(data);
            await item.applyOpenData();
            this.arrangeItems();
        }
    }

    private createItemRenderers(dataArray: DataForRenderer[]): IUiListItemRenderer<DataForRenderer>[] {
        const rendererClass = HelpersMisc.getExisted(this.getItemRendererClass());
        const skinInfo      = this.getSkinInfo();
        const loadedSkin    = skinInfo == null ? undefined : HelpersMisc.getExisted(skinInfo.getSkin());
        const itemSkin      = loadedSkin == null
            ? undefined
            : (loadedSkin.itemSkin ?? HelpersMisc.getExisted(ResManager2.getSkin(HelpersMisc.getExisted(loadedSkin.itemSkinName))));
        return dataArray.map(v => {
            const renderer = new rendererClass();
            renderer.setOpenData(v);
            if (itemSkin != null) {
                UiUtilsUiSkinHelpers.loadSkin(renderer, itemSkin);
            }

            return renderer;
        });
    }

    private async _addItem(item: IUiListItemRenderer<DataForRenderer>): Promise<void> {
        this.addChild(item as unknown as VendorEgretEgret.DisplayObject);

        await item.open();
        await item.applyOpenData();
    }
    public async addItemByData(data: DataForRenderer): Promise<IUiListItemRenderer<DataForRenderer>> {
        const item = this.createItemRenderers([data])[0];
        await this._addItem(item);
        this.arrangeItems();

        this._registerListenersForItem(item);
        if ((this.getRequireSelection()) && (!this.getSelectedItems()?.length)) {
            this.setSelectedItems([item]);
        }

        return item;
    }
    public async addItemsByData(dataArray: DataForRenderer[]): Promise<IUiListItemRenderer<DataForRenderer>[]> {
        const items = this.createItemRenderers(dataArray);
        await Promise.all(items.map(v => this._addItem(v)));
        this.arrangeItems();

        const requireSelection = this.getRequireSelection();
        for (const item of items) {
            this._registerListenersForItem(item);
            if ((requireSelection) && (!this.getSelectedItems()?.length)) {
                this.setSelectedItems([item]);
            }
        }

        return items;
    }

    public async removeItemAt(index: number): Promise<IUiListItemRenderer<DataForRenderer> | undefined> {
        const item = this.getItemAt(index);
        if (item) {
            {
                const selectedItems = this.getSelectedItems()?.concat();
                if (selectedItems) {
                    const i = selectedItems.indexOf(item);
                    if (i >= 0) {
                        selectedItems.splice(i, 1);
                        this.setSelectedItems(selectedItems);
                    }
                }
            }
            this._unregisterListenersForItem(item);

            await item.close();
            this.removeChild(item as unknown as VendorEgretEgret.DisplayObject);
            this.arrangeItems();
        }

        return item;
    }
    public removeItem(item: IUiListItemRenderer<DataForRenderer>): Promise<IUiListItemRenderer<DataForRenderer> | undefined> {
        return this.removeItemAt(this.getAllItems().indexOf(item));
    }
    public async removeAllItems(): Promise<IUiListItemRenderer<DataForRenderer>[]> {
        const allItems = this.getAllItems().concat();
        if (allItems.length) {
            this.setSelectedItems(undefined);
            for (const item of allItems) {
                this._unregisterListenersForItem(item);
            }

            await Promise.all(allItems.map(v => v.close()));
            this.removeChildren();
            this.arrangeItems();
        }

        return allItems;
    }

    public getItemAt(index: number): IUiListItemRenderer<DataForRenderer> | undefined {
        return this.getAllItems()[index];
    }
    public getItemIndex(item: IUiListItemRenderer<DataForRenderer>): number {
        return this.getChildIndex(item as unknown as VendorEgretEgret.DisplayObject);
    }
    public getAllItems(): IUiListItemRenderer<DataForRenderer>[] {
        return this.$children as unknown as IUiListItemRenderer<DataForRenderer>[];
    }

    public getPreviousSelectedItems(): IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._previousSelectedItems;
    }
    public getPreviousSelectedItemIndexes(): number[] | undefined {
        return this.getPreviousSelectedItems()?.map(v => this.getChildIndex(v as unknown as VendorEgretEgret.DisplayObject));
    }
    private _setPreviousSelectedItems(items: IUiListItemRenderer<DataForRenderer>[] | undefined): void {
        this._previousSelectedItems = items;
    }

    public getSelectedItems(): IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._selectedItems;
    }
    public setSelectedItems(newItems: IUiListItemRenderer<DataForRenderer>[] | undefined, needResetItemsSkin = true): void {
        if (newItems?.some(v => v.getParent() !== this)) {
            throw HelpersMisc.newError(`Invalid selectedItems.`);
        }

        this._setPreviousSelectedItems(this.getSelectedItems()?.concat());
        this._selectedItems = newItems;

        if (needResetItemsSkin) {
            this._resetItemsSkin();
        }
    }
    private _updateSelectedItemsOnTap(tappedItem: IUiListItemRenderer<DataForRenderer>): void {
        const openData              = tappedItem.getOpenData();
        const selectedItems         = this.getSelectedItems()?.concat() ?? [];
        const selectedItemsCount    = selectedItems.length;
        const index                 = selectedItems.indexOf(tappedItem);
        if (index >= 0) {
            if ((!this.getRequireSelection()) || (selectedItemsCount > 1)) {
                selectedItems.splice(index, 1);
            }
        } else {
            const checkCanBeSelected = openData?.checkCanBeSelected;
            if ((checkCanBeSelected == null) || (checkCanBeSelected())) {
                const maxSelection = this.getMaxSelection();
                if ((!this.getAllowMultiSelection()) || (maxSelection === 1)) {
                    selectedItems.length = 0;
                    if (maxSelection > 0) {
                        selectedItems.push(tappedItem);
                    }
                } else {
                    if (maxSelection > selectedItemsCount) {
                        selectedItems.push(tappedItem);
                    }
                }
            }
        }
        this.setSelectedItems(selectedItems);
    }

    public getSelectedDataArray(): (DataForRenderer | undefined)[] | undefined {
        return this.getSelectedItems()?.map(v => v.getOpenData());
    }

    public getSelectedItemIndexes(): number[] | undefined {
        return this.getSelectedItems()?.map(v => this.getChildIndex(v as unknown as VendorEgretEgret.DisplayObject));
    }
    public setSelectedItemIndexes(indexes: number[], needResetItemsSkin = true): void {
        const items: IUiListItemRenderer<DataForRenderer>[] = [];
        for (const index of indexes) {
            const item = this.getItemAt(index);
            if (item) {
                items.push(item);
            }
        }
        this.setSelectedItems(items, needResetItemsSkin);
    }

    public getFirstSelectedItem(): IUiListItemRenderer<DataForRenderer> | undefined {
        const items = this.getSelectedItems();
        return items ? items[0] : undefined;
    }
    public getFirstSelectedItemIndex(): number | undefined {
        const indexes = this.getSelectedItemIndexes();
        return indexes == null ? undefined : indexes[0];
    }
    public getFirstSelectedData(): DataForRenderer | undefined {
        return this.getFirstSelectedItem()?.getOpenData();
    }

    public findIndex(predicate: (v: DataForRenderer | undefined) => boolean): number {
        return this.getAllItems().findIndex(v => predicate(v.getOpenData()));
    }
    public getRevisedFirstIndex(predicate: (v: DataForRenderer | undefined) => boolean): number {
        const firstIndex = this.findIndex(predicate);
        return (firstIndex >= 0)
            ? firstIndex
            : ((this.getAllItems().length <= 0) ? -1 : 0);
    }

    public arrangeItems(needApplySizer = true): void {
        UiUtilsUiLayoutHelpers.arrangeItems(this, this.getAllItems());

        if (needApplySizer) {
            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }

    private _resetItemsSkin(): void {
        const newSet                    = new Set(this.getSelectedItems());
        const symmetricDifferenceSet    = new Set(newSet);
        {
            const previousItems = this.getPreviousSelectedItems();
            if (previousItems != null) {
                for (const item of new Set(previousItems)) {
                    if (symmetricDifferenceSet.has(item)) {
                        symmetricDifferenceSet.delete(item);
                    } else {
                        symmetricDifferenceSet.add(item);
                    }
                }
            }
        }

        for (const item of symmetricDifferenceSet) {
            if ((item.getParent() === this) && (item.getSkinInfo())) {
                UiUtilsUiSkinHelpers.loadSkinStateRecursively(item, newSet.has(item) ? UiTypesUiSkinState.UiSkinState.Down : UiTypesUiSkinState.UiSkinState.Up);
            }
        }
    }

    private _registerListenersForItem(item: IUiListItemRenderer<DataForRenderer>): void {
        const agent = item.getEventAgent();
        agent.addPointerEventListener(HelpersPointerInput.PointerEventType.Press,        this._onItemPointerDown,        this);
        agent.addPointerEventListener(HelpersPointerInput.PointerEventType.Tap,          this._onItemPointerTap,         this);
        agent.addPointerEventListener(HelpersPointerInput.PointerEventType.ReleaseIn,    this._onItemPointerUp,          this);
        agent.addPointerEventListener(HelpersPointerInput.PointerEventType.ReleaseOut,   this._onItemPointerUpOutside,   this);
    }
    private _unregisterListenersForItem(item: IUiListItemRenderer<DataForRenderer>): void {
        const agent = item.getEventAgent();
        agent.removePointerEventListener(HelpersPointerInput.PointerEventType.Press,      this._onItemPointerDown,        this);
        agent.removePointerEventListener(HelpersPointerInput.PointerEventType.Tap,        this._onItemPointerTap,         this);
        agent.removePointerEventListener(HelpersPointerInput.PointerEventType.ReleaseIn,  this._onItemPointerUp,          this);
        agent.removePointerEventListener(HelpersPointerInput.PointerEventType.ReleaseOut, this._onItemPointerUpOutside,   this);
    }
    private _onItemPointerDown(e: VendorEgretEgret.Event): void {
        // log(`UiList._onItemPointerDown`, e);

        const item = (e.data as HelpersPointerInput.PointerUnifiedEventData).dispatcher;
        if ((item instanceof UiUtilsUiFactory.getUiListItemRendererClass()) && (item.getSkinInfo())) {
            UiUtilsUiSkinHelpers.loadSkinStateRecursively(
                HelpersMisc.getExisted(item),
                UiTypesUiSkinState.UiSkinState.Down
            );
        }
    }
    private _onItemPointerTap(e: VendorEgretEgret.Event): void {
        // log(`UiList._onItemPointerTap`, e);

        const dispatcher    = HelpersMisc.getExisted((e.data as HelpersPointerInput.PointerUnifiedEventData).dispatcher) as unknown as UiInterfacesIUiComponent.IUiComponent;
        const renderer      = this.getAllItems().find(v => v.checkIsSameOrAncestor(dispatcher));
        if (renderer == null) {
            return;
        }

        this._updateSelectedItemsOnTap(renderer);
        SoundsSoundPlayer.playShortSfx(renderer.getShortSfxCode());

        const isSelected = !!this.getSelectedItems()?.includes(renderer);
        if (renderer.getSkinInfo()) {
            UiUtilsUiSkinHelpers.loadSkinStateRecursively(renderer, isSelected ? UiTypesUiSkinState.UiSkinState.Down : UiTypesUiSkinState.UiSkinState.Up);
        }

        const itemIndex = this.getItemIndex(renderer);
        if (isSelected !== !!this.getPreviousSelectedItems()?.includes(renderer)) {
            this.dispatchEventWith(
                isSelected ? UiTypesUiCommonEventType.UiCommonEventType.ListItemSelectedByTap : UiTypesUiCommonEventType.UiCommonEventType.ListItemDeselectedByTap,
                undefined,
                itemIndex
            );
        }

        renderer.onItemTapEvent({ itemIndex: itemIndex });
    }
    private _onItemPointerUp(e: VendorEgretEgret.Event): void {
        // log(`UiList._onItemPointerUp`, e);

        const item = (e.data as HelpersPointerInput.PointerUnifiedEventData).dispatcher;
        if ((item instanceof UiUtilsUiFactory.getUiListItemRendererClass()) && (item.getSkinInfo())) {
            UiUtilsUiSkinHelpers.loadSkinStateRecursively(item, this.getSelectedItems()?.includes(item) ? UiTypesUiSkinState.UiSkinState.Down : UiTypesUiSkinState.UiSkinState.Up);
        }
    }
    private _onItemPointerUpOutside(e: VendorEgretEgret.Event): void {
        // log(`UiList._onItemPointerUpOutside`, e);

        const item = (e.data as HelpersPointerInput.PointerUnifiedEventData).dispatcher;
        if ((item instanceof UiUtilsUiFactory.getUiListItemRendererClass()) && (item.getSkinInfo())) {
            UiUtilsUiSkinHelpers.loadSkinStateRecursively(item, this.getSelectedItems()?.includes(item) ? UiTypesUiSkinState.UiSkinState.Down : UiTypesUiSkinState.UiSkinState.Up);
        }
    }
}
