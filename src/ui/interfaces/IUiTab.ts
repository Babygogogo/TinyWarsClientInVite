import type { IUiContainer } from "./IUiContainer.ts";
import type { IUiTabItemRenderer } from "./IUiTabItemRenderer.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";
import type { UiTabData } from "../types/UiTabData.ts";

export interface IUiTab<DataForTabItemRenderer extends UiListItemData, DataForPage> extends IUiContainer {
    getSelectedIndex(): number | undefined;

    setBarItemRenderer(itemRenderer: new () => IUiTabItemRenderer<DataForTabItemRenderer>): void;

    bindData(dataArray: UiTabData<DataForTabItemRenderer, DataForPage>[], selectedIndex?: number): Promise<void>;
    updatePageData(index: number, pageData: DataForPage, refreshPage?: boolean): Promise<void>;

    clear(): Promise<void>;
}
