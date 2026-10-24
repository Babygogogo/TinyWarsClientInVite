import type * as SoundsConstants from "../../sounds/Constants.ts";
import type * as UiInterfacesIUiOpenableComponent from "./IUiOpenableComponent.ts";
import type * as UiTypesUiItemTapEventData from "../types/UiItemTapEventData.ts";
import type * as UiTypesUiListItemData from "../types/UiListItemData.ts";

export interface IUiListItemRenderer<OpenData extends UiTypesUiListItemData.UiListItemData> extends UiInterfacesIUiOpenableComponent.IUiOpenableComponent<OpenData> {
    onItemTapEvent(e: UiTypesUiItemTapEventData.UiItemTapEventData): void;

    getShortSfxCode(): SoundsConstants.ShortSfxCode;
}
