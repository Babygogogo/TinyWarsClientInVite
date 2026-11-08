import {
    type Ui_Types_UiSizerDimensionOptions,
    type Ui_Types_UiSizerHorizontalAlignOptions,
    type Ui_Types_UiSizerVerticalAlignOptions,
} from "../../internal.ts";

export interface UiSizerOptions {
    width?              : Ui_Types_UiSizerDimensionOptions.UiSizerDimensionOptions;
    height?             : Ui_Types_UiSizerDimensionOptions.UiSizerDimensionOptions;
    horizontalAlign?    : Ui_Types_UiSizerHorizontalAlignOptions.UiSizerHorizontalAlignOptions;
    verticalAlign?      : Ui_Types_UiSizerVerticalAlignOptions.UiSizerVerticalAlignOptions;
}
