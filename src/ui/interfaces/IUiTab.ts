import {
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiTabItemRenderer,
    type Ui_Types_UiListItemData,
    type Ui_Types_UiTabData,
} from "../../internal.ts";

export interface IUiTab<DataForTabItemRenderer extends Ui_Types_UiListItemData.UiListItemData, DataForPage> extends Ui_Interfaces_IUiContainer.IUiContainer {
    getSelectedIndex(): number | undefined;

    setBarItemRenderer(itemRenderer: new () => Ui_Interfaces_IUiTabItemRenderer.IUiTabItemRenderer<DataForTabItemRenderer>): void;

    bindData(dataArray: Ui_Types_UiTabData.UiTabData<DataForTabItemRenderer, DataForPage>[], selectedIndex?: number): Promise<void>;
    updatePageData(index: number, pageData: DataForPage, refreshPage?: boolean): Promise<void>;

    clear(): Promise<void>;
}
