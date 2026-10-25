import type { UiHorizontalAlign } from "./UiHorizontalAlign.ts";
import type { UiLayoutOrientation } from "./UiLayoutOrientation.ts";
import type { UiPadding } from "./UiPadding.ts";
import type { UiVerticalAlign } from "./UiVerticalAlign.ts";

export interface UiLayoutOptions {
    itemsHAlign?                : UiHorizontalAlign;
    itemsVAlign?                : UiVerticalAlign;
    itemsHMargin?               : number;
    itemsVMargin?               : number;
    orientation?                : UiLayoutOrientation;
    multiItemsPerBlock?         : boolean;
    padding?                    : UiPadding;
    unscaledRequestedWidth?     : number;
    unscaledRequestedHeight?    : number;
}
