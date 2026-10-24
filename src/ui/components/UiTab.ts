import * as HelpersMisc from "../../helpers/Misc.ts";
import * as Logger2 from "../../Logger.ts";
import * as UiComponentsUiContainer from "./UiContainer.ts";
import type * as UiInterfacesIUiContainer from "../interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiList from "../interfaces/IUiList.ts";
import type * as UiInterfacesIUiOpenableComponent from "../interfaces/IUiOpenableComponent.ts";
import type * as UiInterfacesIUiTab from "../interfaces/IUiTab.ts";
import type * as UiInterfacesIUiTabItemRenderer from "../interfaces/IUiTabItemRenderer.ts";
import * as UiTypesUiCommonEventType from "../types/UiCommonEventType.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";
import type * as UiTypesUiTabData from "../types/UiTabData.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export class UiTab<DataForTabItemRenderer extends UiTypesUiListItemData.UiListItemData, DataForPage>
    extends     UiComponentsUiContainer.UiContainer
    implements  UiInterfacesIUiTab.IUiTab<DataForTabItemRenderer, DataForPage>
{
    private readonly _bar?              : UiInterfacesIUiList.IUiList<DataForTabItemRenderer>;   // 页签栏
    private readonly _page?             : UiInterfacesIUiContainer.IUiContainer;                      // 页面内容，仅用于占位

    private readonly _pageInstanceArray : (UiInterfacesIUiOpenableComponent.IUiOpenableComponent<DataForPage> | undefined)[] = [];
    private readonly _tabDataArray      : UiTypesUiTabData.UiTabData<DataForTabItemRenderer, DataForPage>[] = [];

    public updateOnLoadedSkin(): void {
        const bar = this._getBar();
        bar.setAllowMultiSelection(false);
        bar.setRequireSelection(true);
        bar.getEventAgent().addUiCommonEventListener(UiTypesUiCommonEventType.UiCommonEventType.ListItemSelectedByTap, this._onListItemSelectedByTap, this);
    }

    private async _onListItemSelectedByTap(e: VendorEgretEgret.Event): Promise<void> {
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

    public setBarItemRenderer(itemRenderer: new () => UiInterfacesIUiTabItemRenderer.IUiTabItemRenderer<DataForTabItemRenderer>): void {
        this._getBar().setItemRendererClass(itemRenderer);
    }

    private _getPageInstanceArray(): (UiInterfacesIUiOpenableComponent.IUiOpenableComponent<DataForPage> | undefined)[] {
        return this._pageInstanceArray;
    }
    private _getTabDataArray(): UiTypesUiTabData.UiTabData<DataForTabItemRenderer, DataForPage>[] {
        return this._tabDataArray;
    }
    public async bindData(dataArray: UiTypesUiTabData.UiTabData<DataForTabItemRenderer, DataForPage>[], selectedIndex = 0): Promise<void> {
        if (!dataArray.length) {
            throw HelpersMisc.newError(`UiTab.bindData() empty data.`);
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
            throw HelpersMisc.newError(`Multi page opened?!`);
        }

        const page = children[0];
        if (!(page instanceof UiUtilsUiFactory.getUiOpenableComponentClass())) {
            throw HelpersMisc.newError(`Invalid page.`);
        }

        await page.close();
        container.removeUiChild(page);
    }
    public async updatePageData(index: number, pageData: DataForPage, refreshPage = true): Promise<void> {
        const tabData = this._getTabDataArray()[index];
        if (tabData == null) {
            Logger2.warn(`page doesn't exist: ${index}`);
            return;
        }
        tabData.pageData = pageData;

        if ((refreshPage) && (this.getSelectedIndex() === index)) {
            const pageInstance = this._getPageContainer().getUiChildAt(0);
            if (pageInstance instanceof UiUtilsUiFactory.getUiOpenableComponentClass()) {
                pageInstance.setOpenData(pageData);
                await pageInstance.applyOpenData();
            } else {
                throw HelpersMisc.newError(`UiTab.updatePageData() invalid pageInstance.`);
            }
        }
    }

    public async clear(): Promise<void> {
        this._getTabDataArray().length = 0;
        await this._clearPageInstanceArray();
    }

    private _getBar(): UiInterfacesIUiList.IUiList<DataForTabItemRenderer> {
        return HelpersMisc.getExisted(this._bar);
    }
    private _getPageContainer(): UiInterfacesIUiContainer.IUiContainer {
        return HelpersMisc.getExisted(this._page);
    }

    private async _clearPageInstanceArray(): Promise<void> {
        await this._closePage();
        this._getPageInstanceArray().length = 0;
    }
}
