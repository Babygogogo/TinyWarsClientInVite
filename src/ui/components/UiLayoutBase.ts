import {
    Helpers_Misc,
    Ui_Utils_UiSkinHelpers,
    Ui_Utils_UiSizerHelpers,
    Ui_Components_UiContainerBase,
    Ui_Types_UiHorizontalAlign,
    Ui_Types_UiLayoutOrientation,
    Ui_Types_UiVerticalAlign,
    type Ui_Interfaces_IUiLayoutBase,
    type Ui_Types_UiLayoutOptions,
    type Ui_Types_UiPadding,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

export abstract class UiLayoutBase extends Ui_Components_UiContainerBase.UiContainerBase implements Ui_Interfaces_IUiLayoutBase.IUiLayoutBase {
    private _options: Ui_Types_UiLayoutOptions.UiLayoutOptions = {};

    public constructor(layoutOptions?: Ui_Types_UiLayoutOptions.UiLayoutOptions) {
        super();

        if (layoutOptions) {
            this.setOptions(layoutOptions, false);
        }
    }

    public updateOnLoadedSkin(): void {
        this.arrangeItems();
    }
    public loadSkinAttrs(oldSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined, newSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
        const width         = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "width");
        const height        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "height");
        const x             = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "x");
        const y             = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "y");
        const alpha         = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "alpha");
        const visible       = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "visible");
        const rotation      = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "rotation");
        const scaleX        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleX");
        const scaleY        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleY");
        const pivotX        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetX");
        const pivotY        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetY");
        const layoutAttrs   = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "layoutAttrs");

        (x.needChange)          && (this.setX(Helpers_Misc.getExisted(x.value)));
        (y.needChange)          && (this.setY(Helpers_Misc.getExisted(y.value)));
        (scaleX.needChange)     && (this.setScaleX(Helpers_Misc.getExisted(scaleX.value)));
        (scaleY.needChange)     && (this.setScaleY(Helpers_Misc.getExisted(scaleY.value)));
        (pivotX.needChange)     && (this.setAnchorOffsetX(Helpers_Misc.getExisted(pivotX.value)));
        (pivotY.needChange)     && (this.setAnchorOffsetY(Helpers_Misc.getExisted(pivotY.value)));
        (alpha.needChange)      && (this.setAlpha(Helpers_Misc.getExisted(alpha.value)));
        (visible.needChange)    && (this.setIsVisible(!!visible.value));
        (rotation.needChange)   && (this.setRotationInDegree(Helpers_Misc.getExisted(rotation.value)));

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

        Ui_Utils_UiSizerHelpers.loadSizerOptions(this, newSkinAttrs);
    }

    public override applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean {
        const isUpdated = super.applySizeFromSizerInfo(width, height);
        if (isUpdated) {
            this.arrangeItems(false);
        }

        return isUpdated;
    }

    public setOptions(options: Ui_Types_UiLayoutOptions.UiLayoutOptions, needArrange = true): void {
        this._options = options;

        if (needArrange) {
            this.arrangeItems();
        }
    }
    public getOptions(): Ui_Types_UiLayoutOptions.UiLayoutOptions {
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
    public getOrientation(): Ui_Types_UiLayoutOrientation.UiLayoutOrientation {
        return this.getOptions().orientation ?? Ui_Types_UiLayoutOrientation.UiLayoutOrientation.Rows;
    }
    public setOrientation(orientation: Ui_Types_UiLayoutOrientation.UiLayoutOrientation, needArrange = true): void {
        if (this.getOrientation() !== orientation) {
            this.getOptions().orientation = orientation;

            if (needArrange) {
                this.arrangeItems();
            }
        }
    }
    public getItemsHorizontalAlign(): Ui_Types_UiHorizontalAlign.UiHorizontalAlign {
        return this.getOptions().itemsHAlign ?? Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left;
    }
    public setItemsHorizontalAlign(align: Ui_Types_UiHorizontalAlign.UiHorizontalAlign, needArrange = true): void {
        if (this.getItemsHorizontalAlign() !== align) {
            this.getOptions().itemsHAlign = align;

            if (needArrange) {
                this.arrangeItems();
            }
        }
    }
    public getItemsVerticalAlign(): Ui_Types_UiVerticalAlign.UiVerticalAlign {
        return this.getOptions().itemsVAlign ?? Ui_Types_UiVerticalAlign.UiVerticalAlign.Top;
    }
    public setItemsVerticalAlign(align: Ui_Types_UiVerticalAlign.UiVerticalAlign, needArrange = true): void {
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
    public getPadding(): Ui_Types_UiPadding.UiPadding | undefined {
        return this.getOptions().padding;
    }
    public setPadding(padding: Ui_Types_UiPadding.UiPadding | undefined, needArrange = true): void {
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
