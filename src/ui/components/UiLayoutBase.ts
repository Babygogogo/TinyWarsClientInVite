import { getExisted } from "../../helpers/Misc.ts";
import { UiContainerBase } from "./UiContainerBase.ts";
import type { IUiLayoutBase } from "../interfaces/IUiLayoutBase.ts";
import { UiHorizontalAlign } from "../types/UiHorizontalAlign.ts";
import type { UiLayoutOptions as UiTypesUiLayoutOptions } from "../types/UiLayoutOptions.ts";
import { UiLayoutOrientation } from "../types/UiLayoutOrientation.ts";
import type { UiPadding as UiTypesUiPadding } from "../types/UiPadding.ts";
import type { UiSkinAttrs as UiTypesUiSkinAttrs } from "../types/UiSkinAttrs.ts";
import { UiVerticalAlign } from "../types/UiVerticalAlign.ts";
import { loadSizerOptions } from "../utils/UiSizerHelpers.ts";
import { getRevisedAttrValue } from "../utils/UiSkinHelpers.ts";

type UiLayoutOptions        = UiTypesUiLayoutOptions;
type UiPadding              = UiTypesUiPadding;
type UiSkinAttrs            = UiTypesUiSkinAttrs;

export abstract class UiLayoutBase extends UiContainerBase implements IUiLayoutBase {
    private _options: UiLayoutOptions = {};

    public constructor(layoutOptions?: UiLayoutOptions) {
        super();

        if (layoutOptions) {
            this.setOptions(layoutOptions, false);
        }
    }

    public updateOnLoadedSkin(): void {
        this.arrangeItems();
    }
    public loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
        const width         = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "width");
        const height        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "height");
        const x             = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "x");
        const y             = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "y");
        const alpha         = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "alpha");
        const visible       = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "visible");
        const rotation      = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "rotation");
        const scaleX        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleX");
        const scaleY        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleY");
        const pivotX        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetX");
        const pivotY        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetY");
        const layoutAttrs   = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "layoutAttrs");

        (x.needChange)          && (this.setX(getExisted(x.value)));
        (y.needChange)          && (this.setY(getExisted(y.value)));
        (scaleX.needChange)     && (this.setScaleX(getExisted(scaleX.value)));
        (scaleY.needChange)     && (this.setScaleY(getExisted(scaleY.value)));
        (pivotX.needChange)     && (this.setAnchorOffsetX(getExisted(pivotX.value)));
        (pivotY.needChange)     && (this.setAnchorOffsetY(getExisted(pivotY.value)));
        (alpha.needChange)      && (this.setAlpha(getExisted(alpha.value)));
        (visible.needChange)    && (this.setIsVisible(!!visible.value));
        (rotation.needChange)   && (this.setRotationInDegree(getExisted(rotation.value)));

        {
            const options = this.getOptions();
            (width.needChange)  && (options.unscaledRequestedWidth = width.value);
            (height.needChange) && (options.unscaledRequestedHeight = height.value);

            if (layoutAttrs.needChange) {
                const attrs = layoutAttrs.value;
                options.itemsHAlign         = attrs?.horizontalAlign;
                options.itemsVAlign         = attrs?.verticalAlign;
                options.itemsHMargin        = attrs?.horizontalGap;
                options.itemsVMargin        = attrs?.verticalGap;
                options.orientation         = attrs?.orientation;
                options.multiItemsPerBlock  = !!attrs?.multiItemsPerBlock;
                options.padding             = {
                    left    : attrs?.paddingLeft,
                    right   : attrs?.paddingRight,
                    top     : attrs?.paddingTop,
                    bottom  : attrs?.paddingBottom,
                };
            }

            this.setOptions(options, false);
        }

        loadSizerOptions(this, newSkinAttrs);
    }

    public override applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean {
        const isUpdated = super.applySizeFromSizerInfo(width, height);
        if (isUpdated) {
            this.arrangeItems(false);
        }

        return isUpdated;
    }

    public setOptions(options: UiLayoutOptions, needArrange = true): void {
        this._options = options;

        if (needArrange) {
            this.arrangeItems();
        }
    }
    public getOptions(): UiLayoutOptions {
        return this._options;
    }
    public getUnscaledRequestedWidth(): number | undefined {
        return this.getOptions().unscaledRequestedWidth;
    }
    public setUnscaledRequestedWidth(width: number | undefined, needArrange = true): void {
        if (this.getUnscaledRequestedWidth() == width) {
            return;
        }

        this.getOptions().unscaledRequestedWidth = width;

        if (needArrange) {
            this.arrangeItems();
        }
    }
    public getUnscaledRequestedHeight(): number | undefined {
        return this.getOptions().unscaledRequestedHeight;
    }
    public setUnscaledRequestedHeight(height: number | undefined, needArrange = true): void {
        if (this.getUnscaledRequestedHeight() == height) {
            return;
        }

        this.getOptions().unscaledRequestedHeight = height;

        if (needArrange) {
            this.arrangeItems();
        }
    }
    public setUnscaledRequestedSize(width: number | undefined, height: number | undefined, needArrange = true): void {
        if ((this.getUnscaledRequestedWidth() == width)       &&
            (this.getUnscaledRequestedHeight() == height)
        ) {
            return;
        }

        const options = this.getOptions();
        options.unscaledRequestedWidth  = width;
        options.unscaledRequestedHeight = height;

        if (needArrange) {
            this.arrangeItems();
        }
    }
    public getOrientation(): UiLayoutOrientation {
        return this.getOptions().orientation ?? UiLayoutOrientation.Rows;
    }
    public setOrientation(orientation: UiLayoutOrientation, needArrange = true): void {
        if (this.getOrientation() !== orientation) {
            this.getOptions().orientation = orientation;

            if (needArrange) {
                this.arrangeItems();
            }
        }
    }
    public getItemsHorizontalAlign(): UiHorizontalAlign {
        return this.getOptions().itemsHAlign ?? UiHorizontalAlign.Left;
    }
    public setItemsHorizontalAlign(align: UiHorizontalAlign, needArrange = true): void {
        if (this.getItemsHorizontalAlign() !== align) {
            this.getOptions().itemsHAlign = align;

            if (needArrange) {
                this.arrangeItems();
            }
        }
    }
    public getItemsVerticalAlign(): UiVerticalAlign {
        return this.getOptions().itemsVAlign ?? UiVerticalAlign.Top;
    }
    public setItemsVerticalAlign(align: UiVerticalAlign, needArrange = true): void {
        if (this.getItemsVerticalAlign() !== align) {
            this.getOptions().itemsVAlign = align;

            if (needArrange) {
                this.arrangeItems();
            }
        }
    }
    public getItemsHorizontalMargin(): number {
        return this.getOptions().itemsHMargin ?? 6;
    }
    public setItemsHorizontalMargin(margin: number, needArrange = true): void {
        if (this.getItemsHorizontalMargin() !== margin) {
            this.getOptions().itemsHMargin = margin;

            if (needArrange) {
                this.arrangeItems();
            }
        }
    }
    public getItemsVerticalMargin(): number {
        return this.getOptions().itemsVMargin ?? 6;
    }
    public setItemsVerticalMargin(margin: number, needArrange = true): void {
        if (this.getItemsVerticalMargin() !== margin) {
            this.getOptions().itemsVMargin = margin;

            if (needArrange) {
                this.arrangeItems();
            }
        }
    }
    public getPadding(): UiPadding | undefined {
        return this.getOptions().padding;
    }
    public setPadding(padding: UiPadding | undefined, needArrange = true): void {
        this.getOptions().padding = padding;

        if (needArrange) {
            this.arrangeItems();
        }
    }
    public getMultiItemsPerBlock(): boolean {
        return this.getOptions().multiItemsPerBlock ?? false;
    }
    public setMultiItemsPerBlock(value: boolean, needArrange = true): void {
        if (this.getMultiItemsPerBlock() === value) {
            return;
        }

        this.getOptions().multiItemsPerBlock = value;
        if (needArrange) {
            this.arrangeItems();
        }
    }
    public abstract arrangeItems(needApplySizer?: boolean): void;
}
