import type { IUiListItemRenderer } from "./IUiListItemRenderer.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";

export type IUiTabItemRenderer<DataForRenderer extends UiListItemData> = IUiListItemRenderer<DataForRenderer>;
