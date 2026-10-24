import type * as UiTypesUiHorizontalAlign from "./UiHorizontalAlign.ts";
import type * as UiTypesUiLayoutOrientation from "./UiLayoutOrientation.ts";
import type * as UiTypesUiPadding from "./UiPadding.ts";
import type * as UiTypesUiVerticalAlign from "./UiVerticalAlign.ts";

export interface UiLayoutOptions {
    itemsHAlign?                : UiTypesUiHorizontalAlign.UiHorizontalAlign;
    itemsVAlign?                : UiTypesUiVerticalAlign.UiVerticalAlign;
    itemsHMargin?               : number;
    itemsVMargin?               : number;
    orientation?                : UiTypesUiLayoutOrientation.UiLayoutOrientation;
    multiItemsPerBlock?         : boolean;
    padding?                    : UiTypesUiPadding.UiPadding;
    unscaledRequestedWidth?     : number;
    unscaledRequestedHeight?    : number;
}
