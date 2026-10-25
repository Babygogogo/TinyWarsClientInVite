import { UiListItemRenderer } from "./UiListItemRenderer.ts";
import type { IUiTabItemRenderer } from "../interfaces/IUiTabItemRenderer.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";

export abstract class UiTabItemRenderer<DataForRenderer extends UiListItemData>
    extends     UiListItemRenderer<DataForRenderer>
    implements  IUiTabItemRenderer<DataForRenderer>
{
    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
}
