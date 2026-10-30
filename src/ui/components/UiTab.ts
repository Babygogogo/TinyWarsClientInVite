import {
    newError,
    getExisted,
} from "../../helpers/Misc.ts";
import { warn } from "../../Logger.ts";
import { UiContainer } from "./UiContainer.ts";
import type { IUiContainer } from "../interfaces/IUiContainer.ts";
import type { IUiList } from "../interfaces/IUiList.ts";
import type { IUiOpenableComponent } from "../interfaces/IUiOpenableComponent.ts";
import type { IUiTab } from "../interfaces/IUiTab.ts";
import type { IUiTabItemRenderer } from "../interfaces/IUiTabItemRenderer.ts";
import { UiCommonEventType } from "../types/UiCommonEventType.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";
import type { UiTabData } from "../types/UiTabData.ts";
import { getUiOpenableComponentClass } from "../utils/UiFactory.ts";
import type { Event } from "../../egret/Egret.ts";

export class UiTab<DataForTabItemRenderer extends UiListItemData, DataForPage>
    extends     UiContainer
    implements  IUiTab<DataForTabItemRenderer, DataForPage>
{
    private readonly _bar?              : IUiList<DataForTabItemRenderer>;   // 页签栏
    private readonly _page?             : IUiContainer;                      // 页面内容，仅用于占位

    private readonly _pageInstanceArray : (IUiOpenableComponent<DataForPage> | undefined)[] = [];
    private readonly _tabDataArray      : UiTabData<DataForTabItemRenderer, DataForPage>[] = [];

    public updateOnLoadedSkin(): void {
        const bar = this._getBar();
        bar.setAllowMultiSelection(false);
        bar.setRequireSelection(true);
        bar.getEventAgent().addUiCommonEventListener(UiCommonEventType.ListItemSelectedByTap, this._onListItemSelectedByTap, this);
    }

    private async _onListItemSelectedByTap(e: Event): Promise<void> {
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

    public setBarItemRenderer(itemRenderer: new () => IUiTabItemRenderer<DataForTabItemRenderer>): void {
        this._getBar().setItemRendererClass(itemRenderer);
    }

    private _getPageInstanceArray(): (IUiOpenableComponent<DataForPage> | undefined)[] {
        return this._pageInstanceArray;
    }
    private _getTabDataArray(): UiTabData<DataForTabItemRenderer, DataForPage>[] {
        return this._tabDataArray;
    }
    public async bindData(dataArray: UiTabData<DataForTabItemRenderer, DataForPage>[], selectedIndex = 0): Promise<void> {
        if (!dataArray.length) {
            throw newError(`UiTab.bindData() empty data.`);
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
            throw newError(`Multi page opened?!`);
        }

        const page = children[0];
        if (!(page instanceof getUiOpenableComponentClass())) {
            throw newError(`Invalid page.`);
        }

        await page.close();
        container.removeUiChild(page);
    }
    public async updatePageData(index: number, pageData: DataForPage, refreshPage = true): Promise<void> {
        const tabData = this._getTabDataArray()[index];
        if (tabData == null) {
            warn(`page doesn't exist: ${index}`);
            return;
        }
        tabData.pageData = pageData;

        if ((refreshPage) && (this.getSelectedIndex() === index)) {
            const pageInstance = this._getPageContainer().getUiChildAt(0);
            if (pageInstance instanceof getUiOpenableComponentClass()) {
                pageInstance.setOpenData(pageData);
                await pageInstance.applyOpenData();
            } else {
                throw newError(`UiTab.updatePageData() invalid pageInstance.`);
            }
        }
    }

    public async clear(): Promise<void> {
        this._getTabDataArray().length = 0;
        await this._clearPageInstanceArray();
    }

    private _getBar(): IUiList<DataForTabItemRenderer> {
        return getExisted(this._bar);
    }
    private _getPageContainer(): IUiContainer {
        return getExisted(this._page);
    }

    private async _clearPageInstanceArray(): Promise<void> {
        await this._closePage();
        this._getPageInstanceArray().length = 0;
    }
}
