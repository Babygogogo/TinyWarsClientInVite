import {
    type Ui_Interfaces_IUiOpenableComponent,
} from "../../internal.ts";

export interface UiTabData<TabItemData, PageData> {
    callbackOnTouchedItem?  : () => boolean;
    tabItemData             : TabItemData;

    pageClass               : new () => Ui_Interfaces_IUiOpenableComponent.IUiOpenableComponent<PageData>;
    pageData                : PageData;

    // /**
    //  * 页面的实例。设计意图是作为UiTab的页面缓存使用，因此外部不必提供此值；
    //  * 但如果提供了，则UiTab会直接使用此实例，而忽略掉pageClassName和pageSkinName属性。
    //  */
    // pageInstance?           : UiOpenableComponent<DataForPage>;
}
