import {
    Ui_Components_UiListItemRenderer,
    type Ui_Interfaces_IUiTabItemRenderer,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export abstract class UiTabItemRenderer<DataForRenderer extends Ui_Types_UiListItemData.UiListItemData>
    extends     Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForRenderer>
    implements  Ui_Interfaces_IUiTabItemRenderer.IUiTabItemRenderer<DataForRenderer>
{
    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
}
