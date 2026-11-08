import {
    type Ui_Types_UiHorizontalAlign,
    type Ui_Types_UiLayoutOrientation,
    type Ui_Types_UiPadding,
    type Ui_Types_UiVerticalAlign,
} from "../../internal.ts";

export interface UiLayoutOptions {
    itemsHAlign?                : Ui_Types_UiHorizontalAlign.UiHorizontalAlign;
    itemsVAlign?                : Ui_Types_UiVerticalAlign.UiVerticalAlign;
    itemsHMargin?               : number;
    itemsVMargin?               : number;
    orientation?                : Ui_Types_UiLayoutOrientation.UiLayoutOrientation;
    multiItemsPerBlock?         : boolean;
    padding?                    : Ui_Types_UiPadding.UiPadding;
    unscaledRequestedWidth?     : number;
    unscaledRequestedHeight?    : number;
}
