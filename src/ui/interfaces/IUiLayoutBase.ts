import {
    type Ui_Interfaces_IUiContainerBase,
    type Ui_Types_UiHorizontalAlign,
    type Ui_Types_UiLayoutOptions,
    type Ui_Types_UiLayoutOrientation,
    type Ui_Types_UiPadding,
    type Ui_Types_UiVerticalAlign,
} from "../../internal.ts";

export interface IUiLayoutBase extends Ui_Interfaces_IUiContainerBase.IUiContainerBase {
    setOptions(options: Ui_Types_UiLayoutOptions.UiLayoutOptions, needArrange?: boolean): void;
    getOptions(): Ui_Types_UiLayoutOptions.UiLayoutOptions;
    getUnscaledRequestedWidth(): number | undefined;
    setUnscaledRequestedWidth(width: number | undefined, needArrange?: boolean): void;
    getUnscaledRequestedHeight(): number | undefined;
    setUnscaledRequestedHeight(height: number | undefined, needArrange?: boolean): void;
    setUnscaledRequestedSize(width: number | undefined, height: number | undefined, needArrange?: boolean): void;
    getOrientation(): Ui_Types_UiLayoutOrientation.UiLayoutOrientation;
    setOrientation(orientation: Ui_Types_UiLayoutOrientation.UiLayoutOrientation, needArrange?: boolean): void;
    getItemsHorizontalAlign(): Ui_Types_UiHorizontalAlign.UiHorizontalAlign;
    setItemsHorizontalAlign(align: Ui_Types_UiHorizontalAlign.UiHorizontalAlign, needArrange?: boolean): void;
    getItemsVerticalAlign(): Ui_Types_UiVerticalAlign.UiVerticalAlign;
    setItemsVerticalAlign(align: Ui_Types_UiVerticalAlign.UiVerticalAlign, needArrange?: boolean): void;
    getItemsHorizontalMargin(): number;
    setItemsHorizontalMargin(margin: number, needArrange?: boolean): void;
    getItemsVerticalMargin(): number;
    setItemsVerticalMargin(margin: number, needArrange?: boolean): void;
    getPadding(): Ui_Types_UiPadding.UiPadding | undefined;
    setPadding(padding: Ui_Types_UiPadding.UiPadding | undefined, needArrange?: boolean): void;
    getMultiItemsPerBlock(): boolean;
    setMultiItemsPerBlock(value: boolean, needArrange?: boolean): void;
    arrangeItems(needApplySizer?: boolean): void;
}
