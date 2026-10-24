import type * as UiTypesUiSizerDimensionOptions from "./UiSizerDimensionOptions.ts";
import type * as UiTypesUiSizerHorizontalAlignOptions from "./UiSizerHorizontalAlignOptions.ts";
import type * as UiTypesUiSizerVerticalAlignOptions from "./UiSizerVerticalAlignOptions.ts";

export interface UiSizerOptions {
    width?              : UiTypesUiSizerDimensionOptions.UiSizerDimensionOptions;
    height?             : UiTypesUiSizerDimensionOptions.UiSizerDimensionOptions;
    horizontalAlign?    : UiTypesUiSizerHorizontalAlignOptions.UiSizerHorizontalAlignOptions;
    verticalAlign?      : UiTypesUiSizerVerticalAlignOptions.UiSizerVerticalAlignOptions;
}
