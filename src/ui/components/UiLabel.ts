import {
    Ui_Utils_UiSizerHelpers,
    Helpers_Misc,
    Ui_Utils_UiSkinHelpers,
    Lang_Utils,
    Egret_Egret,
    Ui_Components_UiContainerBase,
    Ui_Types_UiHorizontalAlign,
    Ui_Types_UiVerticalAlign,
    type Ui_Interfaces_IUiLabel,
    type Lang_Constants,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

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

export class UiLabel extends Ui_Components_UiContainerBase.UiContainerBase implements Ui_Interfaces_IUiLabel.IUiLabel {
    private _autoShrinkWidth?       : number;
    private _autoShrinkHeight?      : number;

    private _horizontalAlign        = Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left;
    private _verticalAlign          = Ui_Types_UiVerticalAlign.UiVerticalAlign.Top;

    private readonly _textField     = new Egret_Egret.TextField();
    private _text                   = "";

    public constructor() {
        super();

        const textField     = this._getTextField();
        textField.wordWrap  = true;
        this.addChild(textField);

        this.setIsTouchChildrenEnabled(false);
    }

    private _getTextField(): Egret_Egret.TextField {
        return this._textField;
    }

    public loadSkinAttrs(oldSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined, newSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
        const width             = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "width");
        const height            = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "height");
        const x                 = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "x");
        const y                 = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "y");
        const alpha             = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "alpha");
        const visible           = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "visible");
        const rotation          = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "rotation");
        const size              = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "size");
        const bold              = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "bold");
        const italic            = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "italic");
        const horizontalAlign   = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "horizontalAlign");
        const verticalAlign     = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "verticalAlign");
        const stroke            = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "stroke");
        const strokeColor       = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "strokeColor");
        const text              = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "text");
        const textColor         = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "textColor");
        const scaleX            = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleX");
        const scaleY            = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleY");
        const pivotX            = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetX");
        const pivotY            = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetY");
        const lineSpacing       = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "lineSpacing");
        const autoShrinkWidth   = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "autoShrinkWidth");
        // const wordWrap          : number | undefined = attrs?.wordWrap;

        (x.needChange)                  && (this.setX(Helpers_Misc.getExisted(x.value)));
        (y.needChange)                  && (this.setY(Helpers_Misc.getExisted(y.value)));
        (scaleX.needChange)             && (this.setScaleX(Helpers_Misc.getExisted(scaleX.value)));
        (scaleY.needChange)             && (this.setScaleY(Helpers_Misc.getExisted(scaleY.value)));
        (pivotX.needChange)             && (this.setAnchorOffsetX(Helpers_Misc.getExisted(pivotX.value)));
        (pivotY.needChange)             && (this.setAnchorOffsetY(Helpers_Misc.getExisted(pivotY.value)));
        (alpha.needChange)              && (this.setAlpha(Helpers_Misc.getExisted(alpha.value)));
        (visible.needChange)            && (this.setIsVisible(!!visible.value));
        (rotation.needChange)           && (this.setRotationInDegree(Helpers_Misc.getExisted(rotation.value)));
        (horizontalAlign.needChange)    && (this.setHorizontalAlign(horizontalAlign.value ?? Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left));
        (verticalAlign.needChange)      && (this.setVerticalAlign(verticalAlign.value ?? Ui_Types_UiVerticalAlign.UiVerticalAlign.Top));
        (width.needChange)              && (this.setUnscaledManualWidth(width.value));
        (height.needChange)             && (this.setUnscaledManualHeight(height.value));
        (autoShrinkWidth.needChange)    && (this.setAutoShrinkWidth(autoShrinkWidth.value));
        (text.needChange)               && (this.setText(text.value ?? ``));
        (italic.needChange)             && (this.setIsItalic(!!italic.value));
        (bold.needChange)               && (this.setIsBold(!!bold.value));
        (textColor.needChange)          && (this.setTextColor(parseInt(Helpers_Misc.getExisted(textColor.value).replaceAll("#", "0x"))));
        (size.needChange)               && (this.setFontSize(Helpers_Misc.getExisted(size.value)));
        (lineSpacing.needChange)        && (this.setLineSpacing(Helpers_Misc.getExisted(lineSpacing.value)));
        (stroke.needChange)             && (this.setStrokeWidth(Helpers_Misc.getExisted(stroke.value)));
        (strokeColor.needChange)        && (this.setStrokeColor(parseInt(Helpers_Misc.getExisted(strokeColor.value).replaceAll("#", "0x"))));

        Ui_Utils_UiSizerHelpers.loadSizerOptions(this, newSkinAttrs);
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
        Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);

        return true;
    }
    public override setUnscaledManualHeight(height: number | undefined): boolean {
        if (!super.setUnscaledManualHeight(height)) {
            return false;
        }

        this._updateInnerHeight();
        this._handleShrink();
        this._handleAlign();
        Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);

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
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
        }
    }
    public setLangText(langTextType: Lang_Constants.TextType, languageType?: Lang_Constants.LanguageType): void {
        this.setText(Lang_Utils.getText(langTextType, languageType));
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
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
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
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
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
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
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
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
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
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
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
            throw Helpers_Misc.newError(`Invalid width: ${width}`);
        }

        if (this.getAutoShrinkWidth() != width) {
            this._autoShrinkWidth = width;

            this._updateInnerWidth();
            this._handleShrink();
            this._handleAlign();
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getAutoShrinkHeight(): number | undefined {
        return this._autoShrinkHeight;
    }
    public setAutoShrinkHeight(height: number | undefined): void {
        if ((height != null) && (height < 0)) {
            throw Helpers_Misc.newError(`Invalid height: ${height}`);
        }

        if (this.getAutoShrinkHeight() != height) {
            this._autoShrinkHeight = height;

            this._updateInnerHeight();
            this._handleShrink();
            this._handleAlign();
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getHorizontalAlign(): Ui_Types_UiHorizontalAlign.UiHorizontalAlign {
        return this._horizontalAlign;
    }
    public setHorizontalAlign(align: Ui_Types_UiHorizontalAlign.UiHorizontalAlign): void {
        if (this.getHorizontalAlign() !== align) {
            this._horizontalAlign = align;

            if (UseEngineAlignFeature) {
                const textField = this._getTextField();
                if (align === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left) {
                    textField.textAlign = Egret_Egret.HorizontalAlign.LEFT;
                } else if (align === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center) {
                    textField.textAlign = Egret_Egret.HorizontalAlign.CENTER;
                } else {
                    textField.textAlign = Egret_Egret.HorizontalAlign.RIGHT;
                }
            }

            this._handleAlign();
        }
    }
    public getVerticalAlign(): Ui_Types_UiVerticalAlign.UiVerticalAlign {
        return this._verticalAlign;
    }
    public setVerticalAlign(align: Ui_Types_UiVerticalAlign.UiVerticalAlign): void {
        if (this.getVerticalAlign() !== align) {
            this._verticalAlign = align;

            if (UseEngineAlignFeature) {
                const textField = this._getTextField();
                if (align === Ui_Types_UiVerticalAlign.UiVerticalAlign.Top) {
                    textField.verticalAlign = Egret_Egret.VerticalAlign.TOP;
                } else if (align === Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle) {
                    textField.verticalAlign = Egret_Egret.VerticalAlign.MIDDLE;
                } else {
                    textField.verticalAlign = Egret_Egret.VerticalAlign.BOTTOM;
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
                    1,
                );
        }

        {
            const textHeight    = textField.textHeight;
            textField.scaleY    = textHeight === 0
                ? 1
                : Math.min(
                    (this.getUnscaledManualHeight() ?? Number.MAX_SAFE_INTEGER) / textHeight,
                    (this.getAutoShrinkHeight() ?? Number.MAX_SAFE_INTEGER) / textHeight,
                    1,
                );
        }
    }
    private _handleAlign(): void {
        const textField = this._getTextField();

        {
            const unscaledManualWidth   = this.getUnscaledManualWidth();
            const align                 = this.getHorizontalAlign();
            if ((unscaledManualWidth == null) || (align === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Left)) {
                textField.x = 0;
            } else {
                const width = UseEngineAlignFeature
                    ? textField.width * textField.scaleX
                    : textField.textWidth * textField.scaleX;
                textField.x = align === Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center
                    ? (unscaledManualWidth - width) / 2
                    : (unscaledManualWidth - width);
            }
        }

        {
            const unscaledManualHeight  = this.getUnscaledManualHeight();
            const align                 = this.getVerticalAlign();
            if ((unscaledManualHeight == null) || (align === Ui_Types_UiVerticalAlign.UiVerticalAlign.Top)) {
                textField.y = 0;
            } else {
                const height = UseEngineAlignFeature
                    ? textField.height * textField.scaleY
                    : textField.textHeight * textField.scaleY;
                textField.y     = align === Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle
                    ? (unscaledManualHeight - height) / 2
                    : (unscaledManualHeight - height);
            }
        }
    }
}
