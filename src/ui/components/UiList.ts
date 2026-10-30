import {
    Helpers_Misc,
    ResManager,
    Sounds_SoundPlayer,
    Helpers_PointerInput,
    Ui_Types_UiCommonEventType,
    Ui_Components_UiLayoutBase,
    Ui_Components_UiListItemRenderer,
    Ui_Types_UiSkinState,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiList,
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Types_UiListItemData,
    type Ui_Types_UiSkinAttrs,
    Ui_Utils_UiLayoutHelpers,
    Ui_Utils_UiSizerHelpers,
    Ui_Utils_UiSkinHelpers,
    type Egret_Egret,
} from "../../internal.ts";

export class UiList<DataForRenderer extends Ui_Types_UiListItemData.UiListItemData>
    extends Ui_Components_UiLayoutBase.UiLayoutBase
    implements Ui_Interfaces_IUiList.IUiList<DataForRenderer> {
    private _previousSelectedItems? : Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[];
    private _selectedItems?         : Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[];

    private _itemRendererClass?     : new () => Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>;
    private _requireSelection       = false;
    private _allowMultiSelection    = false;
    private _maxSelection           = Number.MAX_SAFE_INTEGER;

    public override loadSkinAttrs(oldSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined, newSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
        super.loadSkinAttrs(oldSkinAttrs, newSkinAttrs);

        const requireSelection      = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "requireSelection");
        const allowMultiSelection   = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "allowMultiSelection");
        (requireSelection.needChange)      && (this.setRequireSelection(!!requireSelection.value));
        (allowMultiSelection.needChange)   && (this.setAllowMultiSelection(!!allowMultiSelection.value));
    }

    public getItemRendererClass(): (new () => Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>) | undefined {
        return this._itemRendererClass;
    }
    public setItemRendererClass(itemRenderer: new () => Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): void {
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

    private createItemRenderers(dataArray: DataForRenderer[]): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] {
        const rendererClass = Helpers_Misc.getExisted(this.getItemRendererClass());
        const skinInfo      = this.getSkinInfo();
        const loadedSkin    = skinInfo == null ? undefined : Helpers_Misc.getExisted(skinInfo.getSkin());
        const itemSkin      = loadedSkin == null
            ? undefined
            : (loadedSkin.itemSkin ?? Helpers_Misc.getExisted(ResManager.getSkin(Helpers_Misc.getExisted(loadedSkin.itemSkinName))));
        return dataArray.map(v => {
            const renderer = new rendererClass();
            renderer.setOpenData(v);
            if (itemSkin != null) {
                Ui_Utils_UiSkinHelpers.loadSkin(renderer, itemSkin);
            }

            return renderer;
        });
    }

    private async _addItem(item: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): Promise<void> {
        this.addChild(item as unknown as Egret_Egret.DisplayObject);

        await item.open();
        await item.applyOpenData();
    }
    public async addItemByData(data: DataForRenderer): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>> {
        const item = this.createItemRenderers([data])[0];
        await this._addItem(item);
        this.arrangeItems();

        this._registerListenersForItem(item);
        if ((this.getRequireSelection()) && (!this.getSelectedItems()?.length)) {
            this.setSelectedItems([item]);
        }

        return item;
    }
    public async addItemsByData(dataArray: DataForRenderer[]): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[]> {
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

    public async removeItemAt(index: number): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined> {
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
            this.removeChild(item as unknown as Egret_Egret.DisplayObject);
            this.arrangeItems();
        }

        return item;
    }
    public removeItem(item: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined> {
        return this.removeItemAt(this.getAllItems().indexOf(item));
    }
    public async removeAllItems(): Promise<Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[]> {
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

    public getItemAt(index: number): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined {
        return this.getAllItems()[index];
    }
    public getItemIndex(item: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): number {
        return this.getChildIndex(item as unknown as Egret_Egret.DisplayObject);
    }
    public getAllItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] {
        return this.$children as unknown as Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[];
    }

    public getPreviousSelectedItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._previousSelectedItems;
    }
    public getPreviousSelectedItemIndexes(): number[] | undefined {
        return this.getPreviousSelectedItems()?.map(v => this.getChildIndex(v as unknown as Egret_Egret.DisplayObject));
    }
    private _setPreviousSelectedItems(items: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined): void {
        this._previousSelectedItems = items;
    }

    public getSelectedItems(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined {
        return this._selectedItems;
    }
    public setSelectedItems(newItems: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] | undefined, needResetItemsSkin = true): void {
        if (newItems?.some(v => v.getParent() !== this)) {
            throw Helpers_Misc.newError(`Invalid selectedItems.`);
        }

        this._setPreviousSelectedItems(this.getSelectedItems()?.concat());
        this._selectedItems = newItems;

        if (needResetItemsSkin) {
            this._resetItemsSkin();
        }
    }
    private _updateSelectedItemsOnTap(tappedItem: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): void {
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
        return this.getSelectedItems()?.map(v => this.getChildIndex(v as unknown as Egret_Egret.DisplayObject));
    }
    public setSelectedItemIndexes(indexes: number[], needResetItemsSkin = true): void {
        const items: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>[] = [];
        for (const index of indexes) {
            const item = this.getItemAt(index);
            if (item) {
                items.push(item);
            }
        }
        this.setSelectedItems(items, needResetItemsSkin);
    }

    public getFirstSelectedItem(): Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer> | undefined {
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
        Ui_Utils_UiLayoutHelpers.arrangeItems(this, this.getAllItems());

        if (needApplySizer) {
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
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
                Ui_Utils_UiSkinHelpers.loadSkinStateRecursively(item, newSet.has(item) ? Ui_Types_UiSkinState.UiSkinState.Down : Ui_Types_UiSkinState.UiSkinState.Up);
            }
        }
    }

    private _registerListenersForItem(item: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): void {
        const agent = item.getEventAgent();
        agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Press,        this._onItemPointerDown,        this);
        agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Tap,          this._onItemPointerTap,         this);
        agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseIn,    this._onItemPointerUp,          this);
        agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseOut,   this._onItemPointerUpOutside,   this);
    }
    private _unregisterListenersForItem(item: Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>): void {
        const agent = item.getEventAgent();
        agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.Press,      this._onItemPointerDown,        this);
        agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.Tap,        this._onItemPointerTap,         this);
        agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseIn,  this._onItemPointerUp,          this);
        agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseOut, this._onItemPointerUpOutside,   this);
    }
    private _onItemPointerDown(e: Egret_Egret.Event): void {
        // log(`UiList._onItemPointerDown`, e);

        const item = (e.data as Helpers_PointerInput.PointerUnifiedEventData).dispatcher;
        if ((item instanceof Ui_Components_UiListItemRenderer.UiListItemRenderer) && (item.getSkinInfo())) {
            Ui_Utils_UiSkinHelpers.loadSkinStateRecursively(
                item,
                Ui_Types_UiSkinState.UiSkinState.Down,
            );
        }
    }
    private _onItemPointerTap(e: Egret_Egret.Event): void {
        // log(`UiList._onItemPointerTap`, e);

        const dispatcher    = Helpers_Misc.getExisted((e.data as Helpers_PointerInput.PointerUnifiedEventData).dispatcher) as unknown as Ui_Interfaces_IUiComponent.IUiComponent;
        const renderer      = this.getAllItems().find(v => v.checkIsSameOrAncestor(dispatcher));
        if (renderer == null) {
            return;
        }

        this._updateSelectedItemsOnTap(renderer);
        Sounds_SoundPlayer.playShortSfx(renderer.getShortSfxCode());

        const isSelected = !!this.getSelectedItems()?.includes(renderer);
        if (renderer.getSkinInfo()) {
            Ui_Utils_UiSkinHelpers.loadSkinStateRecursively(renderer, isSelected ? Ui_Types_UiSkinState.UiSkinState.Down : Ui_Types_UiSkinState.UiSkinState.Up);
        }

        const itemIndex = this.getItemIndex(renderer);
        if (isSelected !== !!this.getPreviousSelectedItems()?.includes(renderer)) {
            this.dispatchEventWith(
                isSelected ? Ui_Types_UiCommonEventType.UiCommonEventType.ListItemSelectedByTap : Ui_Types_UiCommonEventType.UiCommonEventType.ListItemDeselectedByTap,
                undefined,
                itemIndex,
            );
        }

        renderer.onItemTapEvent({ itemIndex : itemIndex });
    }
    private _onItemPointerUp(e: Egret_Egret.Event): void {
        // log(`UiList._onItemPointerUp`, e);

        const item = (e.data as Helpers_PointerInput.PointerUnifiedEventData).dispatcher;
        if ((item instanceof Ui_Components_UiListItemRenderer.UiListItemRenderer) && (item.getSkinInfo())) {
            Ui_Utils_UiSkinHelpers.loadSkinStateRecursively(item, this.getSelectedItems()?.includes(item) ? Ui_Types_UiSkinState.UiSkinState.Down : Ui_Types_UiSkinState.UiSkinState.Up);
        }
    }
    private _onItemPointerUpOutside(e: Egret_Egret.Event): void {
        // log(`UiList._onItemPointerUpOutside`, e);

        const item = (e.data as Helpers_PointerInput.PointerUnifiedEventData).dispatcher;
        if ((item instanceof Ui_Components_UiListItemRenderer.UiListItemRenderer) && (item.getSkinInfo())) {
            Ui_Utils_UiSkinHelpers.loadSkinStateRecursively(item, this.getSelectedItems()?.includes(item) ? Ui_Types_UiSkinState.UiSkinState.Down : Ui_Types_UiSkinState.UiSkinState.Up);
        }
    }
}
