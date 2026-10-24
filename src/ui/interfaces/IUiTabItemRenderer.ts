import type * as UiInterfacesIUiListItemRenderer from "./IUiListItemRenderer.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";

export type IUiTabItemRenderer<DataForRenderer extends UiTypesUiListItemData.UiListItemData> = UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForRenderer>;
