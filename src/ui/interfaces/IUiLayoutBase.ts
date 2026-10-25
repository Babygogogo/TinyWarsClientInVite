import type { IUiContainerBase } from "./IUiContainerBase.ts";
import type { UiHorizontalAlign } from "../types/UiHorizontalAlign.ts";
import type { UiLayoutOptions } from "../types/UiLayoutOptions.ts";
import type { UiLayoutOrientation } from "../types/UiLayoutOrientation.ts";
import type { UiPadding } from "../types/UiPadding.ts";
import type { UiVerticalAlign } from "../types/UiVerticalAlign.ts";

export interface IUiLayoutBase extends IUiContainerBase {
    setOptions(options: UiLayoutOptions, needArrange?: boolean): void;
    getOptions(): UiLayoutOptions;
    getUnscaledRequestedWidth(): number | undefined;
    setUnscaledRequestedWidth(width: number | undefined, needArrange?: boolean): void;
    getUnscaledRequestedHeight(): number | undefined;
    setUnscaledRequestedHeight(height: number | undefined, needArrange?: boolean): void;
    setUnscaledRequestedSize(width: number | undefined, height: number | undefined, needArrange?: boolean): void;
    getOrientation(): UiLayoutOrientation;
    setOrientation(orientation: UiLayoutOrientation, needArrange?: boolean): void;
    getItemsHorizontalAlign(): UiHorizontalAlign;
    setItemsHorizontalAlign(align: UiHorizontalAlign, needArrange?: boolean): void;
    getItemsVerticalAlign(): UiVerticalAlign;
    setItemsVerticalAlign(align: UiVerticalAlign, needArrange?: boolean): void;
    getItemsHorizontalMargin(): number;
    setItemsHorizontalMargin(margin: number, needArrange?: boolean): void;
    getItemsVerticalMargin(): number;
    setItemsVerticalMargin(margin: number, needArrange?: boolean): void;
    getPadding(): UiPadding | undefined;
    setPadding(padding: UiPadding | undefined, needArrange?: boolean): void;
    getMultiItemsPerBlock(): boolean;
    setMultiItemsPerBlock(value: boolean, needArrange?: boolean): void;
    arrangeItems(needApplySizer?: boolean): void;
}
