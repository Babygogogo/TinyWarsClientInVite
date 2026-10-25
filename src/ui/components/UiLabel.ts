import { getExisted, newError } from "../../helpers/Misc.ts";
import type { TextType, LanguageType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { UiContainerBase } from "./UiContainerBase.ts";
import type { IUiLabel } from "../interfaces/IUiLabel.ts";
import { UiHorizontalAlign } from "../types/UiHorizontalAlign.ts";
import type { UiSkinAttrs } from "../types/UiSkinAttrs.ts";
import { UiVerticalAlign } from "../types/UiVerticalAlign.ts";
import { loadSizerOptions, checkAndAddAutoSizerInfo } from "../utils/UiSizerHelpers.ts";
import { getRevisedAttrValue } from "../utils/UiSkinHelpers.ts";
import { TextField, HorizontalAlign, VerticalAlign } from "../../vendor/egret/Egret.ts";

// const textField = new egret.TextField();
// textField.text;
// textField.wordWrap;
// textField.verticalAlign;
// textField.textColor;
// textField.textFlow;
// textField.textAlign;
// textField.strokeColor;
// textField.stroke;
// textField.size;
// textField.lineSpacing;
// textField.italic;
// textField.fontFamily;
// textField.displayAsPassword;
// textField.bold;

const UseEngineAlignFeature = true;

export class UiLabel extends UiContainerBase implements IUiLabel {
    private _autoShrinkWidth?       : number;
    private _autoShrinkHeight?      : number;

    private _horizontalAlign        = UiHorizontalAlign.Left;
    private _verticalAlign          = UiVerticalAlign.Top;

    private readonly _textField     = new TextField();
    private _text                   = "";

    public constructor() {
        super();

        const textField     = this._getTextField();
        textField.wordWrap  = true;
        this.addChild(textField);

        this.setIsTouchChildrenEnabled(false);
    }

    private _getTextField(): TextField {
        return this._textField;
    }

    public loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
        const width             = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "width");
        const height            = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "height");
        const x                 = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "x");
        const y                 = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "y");
        const alpha             = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "alpha");
        const visible           = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "visible");
        const rotation          = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "rotation");
        const size              = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "size");
        const bold              = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "bold");
        const italic            = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "italic");
        const horizontalAlign   = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "horizontalAlign");
        const verticalAlign     = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "verticalAlign");
        const stroke            = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "stroke");
        const strokeColor       = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "strokeColor");
        const text              = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "text");
        const textColor         = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "textColor");
        const scaleX            = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleX");
        const scaleY            = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleY");
        const pivotX            = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetX");
        const pivotY            = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetY");
        const lineSpacing       = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "lineSpacing");
        const autoShrinkWidth   = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "autoShrinkWidth");
        // const wordWrap          : number | undefined = attrs?.wordWrap;

        (x.needChange)                  && (this.setX(getExisted(x.value)));
        (y.needChange)                  && (this.setY(getExisted(y.value)));
        (scaleX.needChange)             && (this.setScaleX(getExisted(scaleX.value)));
        (scaleY.needChange)             && (this.setScaleY(getExisted(scaleY.value)));
        (pivotX.needChange)             && (this.setAnchorOffsetX(getExisted(pivotX.value)));
        (pivotY.needChange)             && (this.setAnchorOffsetY(getExisted(pivotY.value)));
        (alpha.needChange)              && (this.setAlpha(getExisted(alpha.value)));
        (visible.needChange)            && (this.setIsVisible(!!visible.value));
        (rotation.needChange)           && (this.setRotationInDegree(getExisted(rotation.value)));
        (horizontalAlign.needChange)    && (this.setHorizontalAlign(horizontalAlign.value ?? UiHorizontalAlign.Left));
        (verticalAlign.needChange)      && (this.setVerticalAlign(verticalAlign.value ?? UiVerticalAlign.Top));
        (width.needChange)              && (this.setUnscaledManualWidth(width.value));
        (height.needChange)             && (this.setUnscaledManualHeight(height.value));
        (autoShrinkWidth.needChange)    && (this.setAutoShrinkWidth(autoShrinkWidth.value));
        (text.needChange)               && (this.setText(text.value ?? ``));
        (italic.needChange)             && (this.setIsItalic(!!italic.value));
        (bold.needChange)               && (this.setIsBold(!!bold.value));
        (textColor.needChange)          && (this.setTextColor(parseInt(getExisted(textColor.value).replaceAll("#", "0x"))));
        (size.needChange)               && (this.setFontSize(getExisted(size.value)));
        (lineSpacing.needChange)        && (this.setLineSpacing(getExisted(lineSpacing.value)));
        (stroke.needChange)             && (this.setStrokeWidth(getExisted(stroke.value)));
        (strokeColor.needChange)        && (this.setStrokeColor(parseInt(getExisted(strokeColor.value).replaceAll("#", "0x"))));

        loadSizerOptions(this, newSkinAttrs);
    }

    public override applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean {
        if (!super.applySizeFromSizerInfo(width, height)) {
            return false;
        }

        this._updateInnerWidth();
        this._updateInnerHeight();
        this._handleShrink();
        this._handleAlign();
        return true;
    }

    public override setUnscaledManualWidth(width: number | undefined): boolean {
        if (!super.setUnscaledManualWidth(width)) {
            return false;
        }

        this._updateInnerWidth();
        this._handleShrink();
        this._handleAlign();
        checkAndAddAutoSizerInfo(this, true);

        return true;
    }
    public override setUnscaledManualHeight(height: number | undefined): boolean {
        if (!super.setUnscaledManualHeight(height)) {
            return false;
        }

        this._updateInnerHeight();
        this._handleShrink();
        this._handleAlign();
        checkAndAddAutoSizerInfo(this, true);

        return true;
    }

    public getText(): string {
        return this._text;
    }
    public setText(text: string): void {
        if (this.getText() !== text) {
            this._text = text;

            const textField = this._getTextField();
            if (text.trim() === "") {
                textField.text      = ".";
                textField.visible   = false;
            } else {
                textField.text      = text;
                textField.visible   = true;
            }

            this._updateInnerWidth();
            this._updateInnerHeight();
            this._handleShrink();
            this._handleAlign();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public setLangText(langTextType: TextType, languageType?: LanguageType): void {
        this.setText(getText(langTextType, languageType));
    }
    public getFontFamily(): string {
        return this._getTextField().fontFamily;
    }
    public setFontFamily(fontFamily: string): void {
        if (this.getFontFamily() !== fontFamily) {
            this._getTextField().fontFamily = fontFamily;

            this._updateInnerWidth();
            this._updateInnerHeight();
            this._handleShrink();
            this._handleAlign();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getFontSize(): number {
        return this._getTextField().size;
    }
    public setFontSize(size: number): void {
        if (this.getFontSize() !== size) {
            this._getTextField().size = size;

            this._updateInnerWidth();
            this._updateInnerHeight();
            this._handleShrink();
            this._handleAlign();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getTextColor(): number {
        return this._getTextField().textColor;
    }
    public setTextColor(color: number): void {
        this._getTextField().textColor = color;
    }
    public getIsItalic(): boolean {
        return this._getTextField().italic;
    }
    public setIsItalic(isItalic: boolean): void {
        if (this.getIsItalic() !== isItalic) {
            this._getTextField().italic = isItalic;

            this._updateInnerWidth();
            this._updateInnerHeight();
            this._handleShrink();
            this._handleAlign();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getIsBold(): boolean {
        return this._getTextField().bold;
    }
    public setIsBold(isBold: boolean): void {
        if (this.getIsBold() !== isBold) {
            this._getTextField().bold = isBold;

            this._updateInnerWidth();
            this._updateInnerHeight();
            this._handleShrink();
            this._handleAlign();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getLineSpacing(): number {
        return this._getTextField().lineSpacing;
    }
    public setLineSpacing(spacing: number): void {
        if (this.getLineSpacing() !== spacing) {
            this._getTextField().lineSpacing = spacing;

            this._updateInnerHeight();
            this._handleShrink();
            this._handleAlign();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getStrokeWidth(): number {
        return this._getTextField().stroke;
    }
    public setStrokeWidth(width: number): void {
        if (this.getStrokeWidth() !== width) {
            this._getTextField().stroke = width;
        }
    }
    public getStrokeColor(): number {
        return this._getTextField().strokeColor;
    }
    public setStrokeColor(color: number): void {
        this._getTextField().strokeColor = color;
    }
    public getAutoShrinkWidth(): number | undefined {
        return this._autoShrinkWidth;
    }
    public setAutoShrinkWidth(width: number | undefined): void {
        if ((width != null) && (width < 0)) {
            throw newError(`Invalid width: ${width}`);
        }

        if (this.getAutoShrinkWidth() != width) {
            this._autoShrinkWidth = width;

            this._updateInnerWidth();
            this._handleShrink();
            this._handleAlign();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getAutoShrinkHeight(): number | undefined {
        return this._autoShrinkHeight;
    }
    public setAutoShrinkHeight(height: number | undefined): void {
        if ((height != null) && (height < 0)) {
            throw newError(`Invalid height: ${height}`);
        }

        if (this.getAutoShrinkHeight() != height) {
            this._autoShrinkHeight = height;

            this._updateInnerHeight();
            this._handleShrink();
            this._handleAlign();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getHorizontalAlign(): UiHorizontalAlign {
        return this._horizontalAlign;
    }
    public setHorizontalAlign(align: UiHorizontalAlign): void {
        if (this.getHorizontalAlign() !== align) {
            this._horizontalAlign = align;

            if (UseEngineAlignFeature) {
                const textField = this._getTextField();
                if (align === UiHorizontalAlign.Left) {
                    textField.textAlign = HorizontalAlign.LEFT;
                } else if (align === UiHorizontalAlign.Center) {
                    textField.textAlign = HorizontalAlign.CENTER;
                } else {
                    textField.textAlign = HorizontalAlign.RIGHT;
                }
            }

            this._handleAlign();
        }
    }
    public getVerticalAlign(): UiVerticalAlign {
        return this._verticalAlign;
    }
    public setVerticalAlign(align: UiVerticalAlign): void {
        if (this.getVerticalAlign() !== align) {
            this._verticalAlign = align;

            if (UseEngineAlignFeature) {
                const textField = this._getTextField();
                if (align === UiVerticalAlign.Top) {
                    textField.verticalAlign = VerticalAlign.TOP;
                } else if (align === UiVerticalAlign.Middle) {
                    textField.verticalAlign = VerticalAlign.MIDDLE;
                } else {
                    textField.verticalAlign = VerticalAlign.BOTTOM;
                }
            }

            this._handleAlign();
        }
    }

    private _updateInnerWidth(): void {
        const unscaledManualWidth   = this.getUnscaledManualWidth();
        const textField             = this._getTextField();
        if ((unscaledManualWidth != null) && (this.getAutoShrinkWidth() == null)) {
            textField.width = unscaledManualWidth;
        } else {
            textField.width = NaN;
            // textField.width = textField.textWidth;
        }
    }
    private _updateInnerHeight(): void {
        const unscaledManualHeight  = this.getUnscaledManualHeight();
        const textField             = this._getTextField();
        if ((unscaledManualHeight != null) && (this.getAutoShrinkHeight() == null)) {
            textField.height = unscaledManualHeight;
        } else {
            textField.height = NaN;
            // textField.height = textField.textHeight;
        }
    }
    private _handleShrink(): void {
        const textField = this._getTextField();

        {
            const textWidth     = textField.textWidth;
            textField.scaleX    = textWidth === 0
                ? 1
                : Math.min(
                    (this.getUnscaledManualWidth() ?? Number.MAX_SAFE_INTEGER) / textWidth,
                    (this.getAutoShrinkWidth() ?? Number.MAX_SAFE_INTEGER) / textWidth,
                    1
                );
        }

        {
            const textHeight    = textField.textHeight;
            textField.scaleY    = textHeight === 0
                ? 1
                : Math.min(
                    (this.getUnscaledManualHeight() ?? Number.MAX_SAFE_INTEGER) / textHeight,
                    (this.getAutoShrinkHeight() ?? Number.MAX_SAFE_INTEGER) / textHeight,
                    1
                );
        }
    }
    private _handleAlign(): void {
        const textField = this._getTextField();

        {
            const unscaledManualWidth   = this.getUnscaledManualWidth();
            const align                 = this.getHorizontalAlign();
            if ((unscaledManualWidth == null) || (align === UiHorizontalAlign.Left)) {
                textField.x = 0;
            } else {
                const width = UseEngineAlignFeature
                    ? textField.width * textField.scaleX
                    : textField.textWidth * textField.scaleX;
                textField.x = align === UiHorizontalAlign.Center
                    ? (unscaledManualWidth - width) / 2
                    : (unscaledManualWidth - width);
            }
        }

        {
            const unscaledManualHeight  = this.getUnscaledManualHeight();
            const align                 = this.getVerticalAlign();
            if ((unscaledManualHeight == null) || (align === UiVerticalAlign.Top)) {
                textField.y = 0;
            } else {
                const height = UseEngineAlignFeature
                    ? textField.height * textField.scaleY
                    : textField.textHeight * textField.scaleY;
                textField.y     = align === UiVerticalAlign.Middle
                    ? (unscaledManualHeight - height) / 2
                    : (unscaledManualHeight - height);
            }
        }
    }
}
