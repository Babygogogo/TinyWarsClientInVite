import type { ShortSfxCode } from "../../sounds/Constants.ts";
import type { IUiOpenableComponent } from "./IUiOpenableComponent.ts";
import type { UiItemTapEventData } from "../types/UiItemTapEventData.ts";
import type { UiListItemData } from "../types/UiListItemData.ts";

export interface IUiListItemRenderer<OpenData extends UiListItemData> extends IUiOpenableComponent<OpenData> {
    onItemTapEvent(e: UiItemTapEventData): void;

    getShortSfxCode(): ShortSfxCode;
}
