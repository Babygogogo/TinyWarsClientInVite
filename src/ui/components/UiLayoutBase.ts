import * as HelpersMisc from "../../helpers/Misc.ts";
import * as UiComponentsUiContainerBase from "./UiContainerBase.ts";
import type * as UiInterfacesIUiLayoutBase from "../interfaces/IUiLayoutBase.ts";
import * as UiTypesUiHorizontalAlign from "../types/UiHorizontalAlign.ts";
import type * as UiTypesUiLayoutOptions from "../types/UiLayoutOptions.ts";
import * as UiTypesUiLayoutOrientation from "../types/UiLayoutOrientation.ts";
import type * as UiTypesUiPadding from "../types/UiPadding.ts";
import type * as UiTypesUiSkinAttrs from "../types/UiSkinAttrs.ts";
import * as UiTypesUiVerticalAlign from "../types/UiVerticalAlign.ts";
import * as UiUtilsUiSizerHelpers from "../utils/UiSizerHelpers.ts";
import * as UiUtilsUiSkinHelpers from "../utils/UiSkinHelpers.ts";

type UiLayoutOptions        = UiTypesUiLayoutOptions.UiLayoutOptions;
type UiPadding              = UiTypesUiPadding.UiPadding;
type UiSkinAttrs            = UiTypesUiSkinAttrs.UiSkinAttrs;

export abstract class UiLayoutBase extends UiComponentsUiContainerBase.UiContainerBase implements UiInterfacesIUiLayoutBase.IUiLayoutBase {
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
        const width         = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "width");
        const height        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "height");
        const x             = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "x");
        const y             = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "y");
        const alpha         = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "alpha");
        const visible       = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "visible");
        const rotation      = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "rotation");
        const scaleX        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleX");
        const scaleY        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleY");
        const pivotX        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetX");
        const pivotY        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetY");
        const layoutAttrs   = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "layoutAttrs");

        (x.needChange)          && (this.setX(HelpersMisc.getExisted(x.value)));
        (y.needChange)          && (this.setY(HelpersMisc.getExisted(y.value)));
        (scaleX.needChange)     && (this.setScaleX(HelpersMisc.getExisted(scaleX.value)));
        (scaleY.needChange)     && (this.setScaleY(HelpersMisc.getExisted(scaleY.value)));
        (pivotX.needChange)     && (this.setAnchorOffsetX(HelpersMisc.getExisted(pivotX.value)));
        (pivotY.needChange)     && (this.setAnchorOffsetY(HelpersMisc.getExisted(pivotY.value)));
        (alpha.needChange)      && (this.setAlpha(HelpersMisc.getExisted(alpha.value)));
        (visible.needChange)    && (this.setIsVisible(!!visible.value));
        (rotation.needChange)   && (this.setRotationInDegree(HelpersMisc.getExisted(rotation.value)));

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

        UiUtilsUiSizerHelpers.loadSizerOptions(this, newSkinAttrs);
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
    public getOrientation(): UiTypesUiLayoutOrientation.UiLayoutOrientation {
        return this.getOptions().orientation ?? UiTypesUiLayoutOrientation.UiLayoutOrientation.Rows;
    }
    public setOrientation(orientation: UiTypesUiLayoutOrientation.UiLayoutOrientation, needArrange = true): void {
        if (this.getOrientation() !== orientation) {
            this.getOptions().orientation = orientation;

            if (needArrange) {
                this.arrangeItems();
            }
        }
    }
    public getItemsHorizontalAlign(): UiTypesUiHorizontalAlign.UiHorizontalAlign {
        return this.getOptions().itemsHAlign ?? UiTypesUiHorizontalAlign.UiHorizontalAlign.Left;
    }
    public setItemsHorizontalAlign(align: UiTypesUiHorizontalAlign.UiHorizontalAlign, needArrange = true): void {
        if (this.getItemsHorizontalAlign() !== align) {
            this.getOptions().itemsHAlign = align;

            if (needArrange) {
                this.arrangeItems();
            }
        }
    }
    public getItemsVerticalAlign(): UiTypesUiVerticalAlign.UiVerticalAlign {
        return this.getOptions().itemsVAlign ?? UiTypesUiVerticalAlign.UiVerticalAlign.Top;
    }
    public setItemsVerticalAlign(align: UiTypesUiVerticalAlign.UiVerticalAlign, needArrange = true): void {
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
