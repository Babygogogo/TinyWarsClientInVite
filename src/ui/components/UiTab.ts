import {
    Helpers_Misc,
    Ui_Types_UiCommonEventType,
    Ui_Components_UiContainer,
    Ui_Components_UiOpenableComponent,
    Logger,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiList,
    type Ui_Interfaces_IUiOpenableComponent,
    type Ui_Interfaces_IUiTab,
    type Ui_Interfaces_IUiTabItemRenderer,
    type Ui_Types_UiListItemData,
    type Ui_Types_UiTabData,
    type Egret_Egret,
} from "../../internal.ts";

export class UiTab<DataForTabItemRenderer extends Ui_Types_UiListItemData.UiListItemData, DataForPage>
    extends     Ui_Components_UiContainer.UiContainer
    implements  Ui_Interfaces_IUiTab.IUiTab<DataForTabItemRenderer, DataForPage> {
    private readonly _bar?              : Ui_Interfaces_IUiList.IUiList<DataForTabItemRenderer>;   // 页签栏
    private readonly _page?             : Ui_Interfaces_IUiContainer.IUiContainer;                      // 页面内容，仅用于占位

    private readonly _pageInstanceArray : (Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<DataForPage> | undefined)[] = [];
    private readonly _tabDataArray      : Ui_Types_UiTabData.UiTabData<DataForTabItemRenderer, DataForPage>[] = [];

    public updateOnLoadedSkin(): void {
        const bar = this._getBar();
        bar.setAllowMultiSelection(false);
        bar.setRequireSelection(true);
        bar.getEventAgent().addUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.ListItemSelectedByTap, this._onListItemSelectedByTap, this);
    }

    private async _onListItemSelectedByTap(e: Egret_Egret.Event): Promise<void> {
        // const item = this._getBar().getItem(index);
        // if (item instanceof UiTabItemRenderer) {
        //     SoundManager.playShortSfx(item.getShortSfxCode());
        // } else {
        //     throw Helpers.Misc.newError(`UiTab._onItemTapBar() invalid index: ${index}`);
        // }

        // this._getBar().setSelectedItemIndexes([index]);

        const pageIndex = e.data as number; // 必须事先提取，否则经过await之后此值会发生变化
        await this._closePage();
        await this._openPage(pageIndex);
    }

    public getSelectedIndex(): number | undefined {
        const indexes = this._getBar().getSelectedItemIndexes();
        return indexes == null ? undefined : indexes[0];
    }

    public setBarItemRenderer(itemRenderer: new () => Ui_Interfaces_IUiTabItemRenderer.IUiTabItemRenderer<DataForTabItemRenderer>): void {
        this._getBar().setItemRendererClass(itemRenderer);
    }

    private _getPageInstanceArray(): (Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<DataForPage> | undefined)[] {
        return this._pageInstanceArray;
    }
    private _getTabDataArray(): Ui_Types_UiTabData.UiTabData<DataForTabItemRenderer, DataForPage>[] {
        return this._tabDataArray;
    }
    public async bindData(dataArray: Ui_Types_UiTabData.UiTabData<DataForTabItemRenderer, DataForPage>[], selectedIndex = 0): Promise<void> {
        if (!dataArray.length) {
            throw Helpers_Misc.newError(`UiTab.bindData() empty data.`);
        }

        {
            await this._clearPageInstanceArray();

            const tabDataArray = this._getTabDataArray();
            tabDataArray.length = 0;
            tabDataArray.push(...dataArray);
        }

        {
            const bar = this._getBar();
            await bar.bindData(dataArray.map(v => v.tabItemData));
            bar.setSelectedItemIndexes([selectedIndex]);
        }

        await this._openPage(selectedIndex);
    }
    private async _openPage(index: number): Promise<void> {
        const data          = this._getTabDataArray()[index];
        const pageInstance  = this._getPageInstanceArray()[index] ??= new data.pageClass();
        pageInstance.setOpenData(data.pageData);
        this._getPageContainer().addUiChild(pageInstance);
        await pageInstance.open();
        await pageInstance.applyOpenData();
    }
    private async _closePage(): Promise<void> {
        const container = this._getPageContainer();
        const children  = container.getUiChildren();
        const length    = children.length;
        if (length === 0) {
            return;
        } else if (length > 1) {
            throw Helpers_Misc.newError(`Multi page opened?!`);
        }

        const page = children[0];
        if (!(page instanceof Ui_Components_UiOpenableComponent.UiOpenableComponent)) {
            throw Helpers_Misc.newError(`Invalid page.`);
        }

        await page.close();
        container.removeUiChild(page);
    }
    public async updatePageData(index: number, pageData: DataForPage, refreshPage = true): Promise<void> {
        const tabData = this._getTabDataArray()[index];
        if (tabData == null) {
            Logger.warn(`page doesn't exist: ${index}`);
            return;
        }
        tabData.pageData = pageData;

        if ((refreshPage) && (this.getSelectedIndex() === index)) {
            const pageInstance = this._getPageContainer().getUiChildAt(0);
            if (pageInstance instanceof Ui_Components_UiOpenableComponent.UiOpenableComponent) {
                pageInstance.setOpenData(pageData);
                await pageInstance.applyOpenData();
            } else {
                throw Helpers_Misc.newError(`UiTab.updatePageData() invalid pageInstance.`);
            }
        }
    }

    public async clear(): Promise<void> {
        this._getTabDataArray().length = 0;
        await this._clearPageInstanceArray();
    }

    private _getBar(): Ui_Interfaces_IUiList.IUiList<DataForTabItemRenderer> {
        return Helpers_Misc.getExisted(this._bar);
    }
    private _getPageContainer(): Ui_Interfaces_IUiContainer.IUiContainer {
        return Helpers_Misc.getExisted(this._page);
    }

    private async _clearPageInstanceArray(): Promise<void> {
        await this._closePage();
        this._getPageInstanceArray().length = 0;
    }
}
