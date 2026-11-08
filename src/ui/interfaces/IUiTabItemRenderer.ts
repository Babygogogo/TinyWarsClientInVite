import {
    type Ui_Interfaces_IUiListItemRenderer,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type IUiTabItemRenderer<DataForRenderer extends Ui_Types_UiListItemData.UiListItemData> = Ui_Interfaces_IUiListItemRenderer.IUiListItemRenderer<DataForRenderer>;
