import type * as UiInterfacesIUiContainer from "./IUiContainer.ts";
import type * as UiInterfacesIUiTabItemRenderer from "./IUiTabItemRenderer.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";
import type * as UiTypesUiTabData from "../types/UiTabData.ts";

export interface IUiTab<DataForTabItemRenderer extends UiTypesUiListItemData.UiListItemData, DataForPage> extends UiInterfacesIUiContainer.IUiContainer {
    getSelectedIndex(): number | undefined;

    setBarItemRenderer(itemRenderer: new () => UiInterfacesIUiTabItemRenderer.IUiTabItemRenderer<DataForTabItemRenderer>): void;

    bindData(dataArray: UiTypesUiTabData.UiTabData<DataForTabItemRenderer, DataForPage>[], selectedIndex?: number): Promise<void>;
    updatePageData(index: number, pageData: DataForPage, refreshPage?: boolean): Promise<void>;

    clear(): Promise<void>;
}
