import type { UiSizerDimensionOptions } from "./UiSizerDimensionOptions.ts";
import type { UiSizerHorizontalAlignOptions } from "./UiSizerHorizontalAlignOptions.ts";
import type { UiSizerVerticalAlignOptions } from "./UiSizerVerticalAlignOptions.ts";

export interface UiSizerOptions {
    width?              : UiSizerDimensionOptions;
    height?             : UiSizerDimensionOptions;
    horizontalAlign?    : UiSizerHorizontalAlignOptions;
    verticalAlign?      : UiSizerVerticalAlignOptions;
}
