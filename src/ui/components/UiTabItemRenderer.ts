import * as UiComponentsUiListItemRenderer from "./UiListItemRenderer.ts";
import type * as UiInterfacesIUiTabItemRenderer from "../interfaces/IUiTabItemRenderer.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";

export abstract class UiTabItemRenderer<DataForRenderer extends UiTypesUiListItemData.UiListItemData>
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForRenderer>
    implements  UiInterfacesIUiTabItemRenderer.IUiTabItemRenderer<DataForRenderer>
{
    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
}
