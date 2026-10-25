import { isPc } from "../../helpers/Compatibility.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { MouseStyleType, PointerEventType } from "../../helpers/PointerInput.ts";
import { getStage, getCanvasBoundingClientRect } from "../../stages/StageManager.ts";
import { UiContainerBase } from "./UiContainerBase.ts";
import type { IUiLabel } from "../interfaces/IUiLabel.ts";
import type { IUiTextInput } from "../interfaces/IUiTextInput.ts";
import { UiCommonEventType } from "../types/UiCommonEventType.ts";
import { UiHorizontalAlign } from "../types/UiHorizontalAlign.ts";
import { UiInputEventType } from "../types/UiInputEventType.ts";
import type { UiSkinAttrs as UiTypesUiSkinAttrs } from "../types/UiSkinAttrs.ts";
import { UiVerticalAlign } from "../types/UiVerticalAlign.ts";
import { getUiLabelClass } from "../utils/UiFactory.ts";
import { getWorldAlpha, getWorldVisible } from "../utils/UiHelpers.ts";
import { checkAndAddAutoSizerInfo, loadSizerOptions } from "../utils/UiSizerHelpers.ts";
import { getRevisedAttrValue } from "../utils/UiSkinHelpers.ts";
import type { Matrix, TextField } from "../../vendor/egret/Egret.ts";

type UiSkinAttrs            = UiTypesUiSkinAttrs;

interface CanvasBounds {
    top     : number;
    left    : number;
    width   : number;
    height  : number;
}
interface PreviousAttrs {
    canvasBounds?   : CanvasBounds;
    transform?      : Matrix; // dom related world transform
    worldAlpha?     : number;
    isDomVisible?   : boolean;
}

const KeyMaxLength                      = "maxlength";
const DefaultWidth                      = 100;
const DefaultHeight                     = 30;
const ApkLandscapeDomHeightMultiplier   = 0.3;
const ApkPortraitDomHeightMultiplier    = 0.55;

export class UiTextInput extends UiContainerBase implements IUiTextInput {
    private readonly _boundOnDomKeyDown = (e: Event) => {
        const dom = this._getDomInput();
        if (dom) {
            this._selectionRange = [
                dom.selectionStart ?? null,
                dom.selectionEnd ?? null
            ];
        }

        // this.emit('keydown', e.keyCode);
        this.dispatchEventWith(UiInputEventType.KeyDown, undefined, e);
    };
    private readonly _boundOnDomInput = () => {
        const maxLength     = this.getMaxLength() ?? Number.MAX_SAFE_INTEGER;
        const rawNewText    = _getDomText(this._getDomInput());
        const subNewText    = rawNewText.substring(0, maxLength);
        const restrict      = this.getRestrict();
        if ((restrict == null) || (restrict.test(subNewText))) {
            this._text = subNewText;
        } else {
            const subOldText    = this.getText().substring(0, maxLength);
            this._text          = restrict.test(subOldText) ? subOldText : ``;
        }

        const text = this.getText();
        if (text !== rawNewText) {
            this._applyDomText(text);
            this._applyDomSelectionRange(this._selectionRange);
        }
        this.dispatchEventWith(UiInputEventType.KeyInput, undefined, text);
    };
    private readonly _boundOnDomKeyUp = (e: Event) => {
        this.dispatchEventWith(UiInputEventType.KeyUp, undefined, e);
    };
    private readonly _boundOnDomFocus = () => {
        window.TEXT_INPUT_CONTAINER.style.pointerEvents = "auto";
        this._setIsFocused(true);
        this._applyLabelVisible(false);
        this.dispatchEventWith(UiInputEventType.FocusIn, undefined);
    };
    private readonly _boundOnDomBlur = () => {
        window.TEXT_INPUT_CONTAINER.style.pointerEvents = "none";
        this._setIsFocused(false);
        this._applyLabelVisible(true);
        if (this._applyLabelText(this.getText(), this.getIsDisplayAsPassword())) {
            this._updateInnerWidth();
            this._updateInnerHeight();
            checkAndAddAutoSizerInfo(this, true);
        }

        this.dispatchEventWith(UiInputEventType.FocusOut, undefined);
    };
    private readonly _boundOnBodyPointerDown = (e: Event) => {
        const target = e.target;
        if ((target != null) && (target !== this._getDomInput())) {
            this.blur();
        }
    };

    private _domInput?                  : HTMLTextAreaElement | HTMLInputElement;
    private _labelInput                 = new (getUiLabelClass())();

    private _previousAttrs              : PreviousAttrs = {};
    private _restrictRegex?             : RegExp;
    private _text                       = "";
    private _domPlaceholder             = "";
    private _isFocused                  = false;
    private _isMultiline                = false;
    private _isDisplayAsPassword        = false;
    private _selectionRange             : (number | null)[] = [0, 0];
    private _maxLength?                 : number;

    public constructor() {
        super();

        this.addChild(this._getLabelInputAsTextField());

        this.setMouseStyle(MouseStyleType.Text);
        this.setIsTouchEnabled(true);

        {
            const agent = this.getEventAgent();
            agent.addAutoEnterFrameListener(this._onEnterFrame, this);
            agent.addUiCommonEventListener(UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            agent.addUiCommonEventListener(UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
            agent.addPointerEventListener(PointerEventType.Tap, this._onPointerTap, this);
        }

        this.setUnscaledManualWidth(DefaultWidth);
        this.setUnscaledManualHeight(DefaultHeight);
    }

    private _onAddedToStage(): void {
        const container = window.TEXT_INPUT_CONTAINER;
        container.addEventListener("pointerdown", this._boundOnBodyPointerDown);

        const dom = this._getDomInput();
        (dom) && (container.appendChild(dom));
    }
    private _onRemovedFromStage(): void {
        this.blur();

        const container = window.TEXT_INPUT_CONTAINER;
        container.removeEventListener("pointerdown", this._boundOnBodyPointerDown);

        const dom = this._getDomInput();
        (dom) && (container.removeChild(dom));
    }
    private _onEnterFrame(): void {
        const previousAttrs = this._previousAttrs;
        const isDomVisible  = this._calculateDomVisible();
        if (isDomVisible !== previousAttrs.isDomVisible) {
            previousAttrs.isDomVisible = isDomVisible;
            this._applyDomVisible(isDomVisible);
        }
        if (!isDomVisible) {
            return;
        }

        {
            const canvasBounds  = _calculateCanvasBounds();
            const transform     = this._calculateDomRelativeWorldTransform();
            if ((!_compareClientRects(canvasBounds, previousAttrs.canvasBounds))    ||
                (!_compareMatrices(transform, previousAttrs.transform))
            ) {
                previousAttrs.canvasBounds  = canvasBounds;
                previousAttrs.transform     = transform;
                this._applyDomTransform(canvasBounds, transform);
            }
        }

        {
            const worldAlpha = getWorldAlpha(this);
            if (worldAlpha !== previousAttrs.worldAlpha) {
                previousAttrs.worldAlpha = worldAlpha;
                this._applyDomAlpha(worldAlpha);
            }
        }
    }
    private _onPointerTap(): void {
        this.focus();
    }

    public override loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
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
        const restrict          = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "restrict");
        const maxChars          = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "maxChars");
        const displayAsPassword = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "displayAsPassword");
        const multiline         = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "multiline");
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
        (text.needChange)               && (this.setText(text.value ?? ``));
        (italic.needChange)             && (this.setIsItalic(!!italic.value));
        (bold.needChange)               && (this.setIsBold(!!bold.value));
        (textColor.needChange)          && (this.setTextColor(parseInt(getExisted(textColor.value).replaceAll("#", "0x"))));
        (size.needChange)               && (this.setFontSize(getExisted(size.value)));
        (lineSpacing.needChange)        && (this.setLineSpacing(getExisted(lineSpacing.value)));
        (stroke.needChange)             && (this.setStrokeWidth(getExisted(stroke.value)));
        (strokeColor.needChange)        && (this.setStrokeColor(parseInt(getExisted(strokeColor.value).replaceAll("#", "0x"))));
        (restrict.needChange)           && (this.setRestrict(restrict.value));
        (maxChars.needChange)           && (this.setMaxLength(maxChars.value));
        (displayAsPassword.needChange)  && (this.setIsDisplayAsPassword(!!displayAsPassword.value));
        (multiline.needChange)          && (this.setIsMultiline(!!multiline.value));

        // this.arrange();

        loadSizerOptions(this, newSkinAttrs);
    }

    public override applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean {
        if (!super.applySizeFromSizerInfo(width, height)) {
            return false;
        }

        this._updateInnerWidth();
        this._updateInnerHeight();

        return true;
    }

    public focus(): void {
        if (this._getIsFocused()) {
            return;
        }
        this._setIsFocused(true);

        this._resetDomInput();
        this._applyDomVisible(true);
        this._applyLabelVisible(false);
        this._getDomInput()?.focus();
    }
    public blur(): void {
        if (!this._getIsFocused()) {
            return;
        }
        this._setIsFocused(false);

        this._applyDomVisible(false);
        this._applyLabelVisible(true);
        this._getDomInput()?.blur();
    }
    public select(): void {
        this.focus();

        this._getDomInput()?.select();
    }

    public override setUnscaledManualWidth(width: number | undefined): boolean {
        width ??= DefaultWidth;
        if (!super.setUnscaledManualWidth(width)) {
            return false;
        }

        this._updateInnerWidth();
        this._checkAndAddAutoSizerInfo();

        return true;
    }
    public override setUnscaledManualHeight(height: number | undefined): boolean {
        height ??= DefaultHeight;
        if (!super.setUnscaledManualHeight(height)) {
            return false;
        }

        this._updateInnerHeight();
        this._checkAndAddAutoSizerInfo();

        return true;
    }
    public getIsMultiline(): boolean {
        return this._isMultiline;
    }
    public setIsMultiline(isMultiline: boolean): void {
        // if (this._checkHasFocus()) {
        //     return;
        // }

        if (this.getIsMultiline() === isMultiline) {
            return;
        }
        this._isMultiline = isMultiline;

        // this._updateLabelWordWrapWidth(true);
    }
    public getMaxLength(): number | undefined {
        return this._maxLength;
    }
    public setMaxLength(maxLength: number | undefined): void {
        if (this.getMaxLength() == maxLength) {
            return;
        }
        this._maxLength = maxLength;

        this._applyDomMaxLength(maxLength);
    }
    public getRestrict(): RegExp | undefined {
        return this._restrictRegex;
    }
    public setRestrict(regex: string | RegExp | undefined): void {
        if (regex instanceof RegExp) {
            regex = regex.toString().slice(1,-1);

            if (regex.charAt(0) !== '^') {
                regex = '^'+regex;
            }

            if (regex.charAt(regex.length-1) !== '$') {
                regex = regex+'$';
            }

            this._restrictRegex = new RegExp(regex);

        } else {
            if (regex?.length) {
                this._restrictRegex = new RegExp('^['+regex+']*$');
            } else {
                this._restrictRegex = undefined;
            }
        }
    }
    public getIsDisplayAsPassword(): boolean {
        return this._isDisplayAsPassword;
    }
    /** 仅在 isMultiline == false 时有效，其余时候实际效果为false */
    public setIsDisplayAsPassword(asPassword: boolean): void {
        if (this.getIsDisplayAsPassword() === asPassword) {
            return;
        }
        this._isDisplayAsPassword = asPassword;

        this._applyDomDisplayAsPassword(asPassword);
        if (this._applyLabelText(this.getText(), asPassword)) {
            this._updateInnerWidth();
            this._updateInnerHeight();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getText(): string {
        return this._text;
    }
    public setText(text: string): void {
        if (this.getText() === text) {
            return;
        }
        this._text = text;

        {
            const length            = text.length;
            this._selectionRange    = [length, length];
        }

        this._applyDomText(text);
        if (this._applyLabelText(text, this.getIsDisplayAsPassword())) {
            this._updateInnerWidth();
            this._updateInnerHeight();
            checkAndAddAutoSizerInfo(this, true);
        }
    }
    public getDomPlaceholder(): string {
        return this._domPlaceholder;
    }
    public setDomPlaceholder(text: string): void {
        if (this.getDomPlaceholder() === text) {
            return;
        }
        this._domPlaceholder = text;

        this._applyDomPlaceholder(this._calculateDomPlaceholder());
    }
    public getFontFamily(): string {
        return this._getLabelInput().getFontFamily();
    }
    public setFontFamily(fontFamily: string): void {
        if (this.getFontFamily() === fontFamily) {
            return;
        }

        this._applyDomFontFamily(fontFamily);
        this._applyLabelFontFamily(fontFamily);
        this._updateInnerWidth();
        this._updateInnerHeight();
        checkAndAddAutoSizerInfo(this, true);
    }
    public getFontSize(): number {
        return this._getLabelInput().getFontSize();
    }
    public setFontSize(size: number): void {
        if (this.getFontSize() === size) {
            return;
        }

        this._applyLabelFontSize(size);
        this._applyDomFontSize(this._calculateDomFontSize());
        this._updateInnerWidth();
        this._updateInnerHeight();
        checkAndAddAutoSizerInfo(this, true);
    }
    public getTextColor(): number {
        return this._getLabelInput().getTextColor();
    }
    public setTextColor(color: number): void {
        if (this.getTextColor() === color) {
            return;
        }

        this._applyLabelTextColor(color);
        this._applyDomTextColor(this._calculateDomTextColor());
    }
    public getIsItalic(): boolean {
        return this._getLabelInput().getIsItalic();
    }
    public setIsItalic(isItalic: boolean): void {
        if (this.getIsItalic() === isItalic) {
            return;
        }

        this._applyDomIsItalic(isItalic);
        this._applyLabelIsItalic(isItalic);
        this._updateInnerWidth();
        this._updateInnerHeight();
        checkAndAddAutoSizerInfo(this, true);
    }
    public getIsBold(): boolean {
        return this._getLabelInput().getIsBold();
    }
    public setIsBold(isBold: boolean): void {
        if (this.getIsBold() === isBold) {
            return;
        }

        this._applyDomIsBold(isBold);
        this._applyLabelIsBold(isBold);
        this._updateInnerWidth();
        this._updateInnerHeight();
        checkAndAddAutoSizerInfo(this, true);
    }
    public getLineSpacing(): number {
        return this._getLabelInput().getLineSpacing();
    }
    public setLineSpacing(spacing: number): void {
        if (this.getLineSpacing() === spacing) {
            return;
        }

        this._applyDomLineSpacing(spacing);
        this._applyLabelLineSpacing(spacing);
        this._updateInnerHeight();
        checkAndAddAutoSizerInfo(this, true);
    }
    public getStrokeWidth(): number {
        return this._getLabelInput().getStrokeWidth();
    }
    public setStrokeWidth(width: number): void {
        if (this.getStrokeWidth() === width) {
            return;
        }

        this._applyDomStrokeWidth(width);
        this._applyLabelStrokeWidth(width);
    }
    public getStrokeColor(): number {
        return this._getLabelInput().getStrokeColor();
    }
    public setStrokeColor(color: number): void {
        if (this.getStrokeColor() === color) {
            return;
        }

        this._applyDomStrokeColor(color);
        this._applyLabelStrokeColor(color);
    }
    public getHorizontalAlign(): UiHorizontalAlign {
        return this._getLabelInput().getHorizontalAlign();
    }
    public setHorizontalAlign(align: UiHorizontalAlign): void {
        if (this.getHorizontalAlign() === align) {
            return;
        }

        this._applyDomHorizontalAlign(align);
        this._applyLabelHorizontalAlign(align);
    }
    public getVerticalAlign(): UiVerticalAlign {
        return this._getLabelInput().getVerticalAlign();
    }
    /** 只对非输入状态下显示的文字有效
     *
     *  在输入状态下，单行模式的文字永远居中，多行模式的文字永远置顶
     */
    public setVerticalAlign(align: UiVerticalAlign): void {
        if (this.getVerticalAlign() === align) {
            return;
        }

        this._applyDomVerticalAlign(align);
        this._applyLabelVerticalAlign(align);
    }

    private _updateInnerWidth(): void {
        const width         = this.getUnscaledManualWidth() ?? DefaultWidth;
        const labelInput    = this._getLabelInput();
        labelInput.setUnscaledManualWidth(width);
        // labelInput.setAutoShrinkWidth(this.getIsMultiline() ? undefined : width);
        labelInput.setAutoShrinkWidth(width);

        this._applyDomWidth(this._calculateDomWidth());
    }
    private _updateInnerHeight(): void {
        const height        = this.getUnscaledManualHeight() ?? DefaultHeight;
        const labelInput    = this._getLabelInput();
        labelInput.setUnscaledManualHeight(height);
        // labelInput.setAutoShrinkHeight(this.getIsMultiline() ? undefined : height);
        labelInput.setAutoShrinkHeight(height);

        this._applyDomHeight(this._calculateDomHeight());
    }

    private _getDomInput(): HTMLTextAreaElement | HTMLInputElement | undefined {
        return this._domInput;
    }
    private _getLabelInput(): IUiLabel {
        return this._labelInput;
    }
    private _getLabelInputAsTextField(): TextField {
        return this._labelInput as unknown as TextField;
    }

    // SETUP
    private _getIsFocused(): boolean {
        return this._isFocused;
    }
    private _setIsFocused(focused: boolean): void {
        this._isFocused = focused;
    }

    // RENDER & UPDATE
    private _resetDomInput(): void {
        const isMultiline = this.getIsMultiline();

        {
            const oldDomInput = this._getDomInput();
            if (oldDomInput) {
                if ((oldDomInput.nodeName === "TEXTAREA") === isMultiline) {
                    return;
                }

                oldDomInput.removeEventListener('keydown',      this._boundOnDomKeyDown);
                oldDomInput.removeEventListener('input',        this._boundOnDomInput);
                oldDomInput.removeEventListener('keyup',        this._boundOnDomKeyUp);
                oldDomInput.removeEventListener('focus',        this._boundOnDomFocus);
                oldDomInput.removeEventListener('blur',         this._boundOnDomBlur);
                window.TEXT_INPUT_CONTAINER.removeChild(oldDomInput);
            }
        }

        {
            const newDomInput   = _createDomInput(isMultiline);
            this._domInput      = newDomInput;
            this._previousAttrs = {};

            newDomInput.addEventListener('keydown',     this._boundOnDomKeyDown);
            newDomInput.addEventListener('input',       this._boundOnDomInput);
            newDomInput.addEventListener('keyup',       this._boundOnDomKeyUp);
            newDomInput.addEventListener('focus',       this._boundOnDomFocus);
            newDomInput.addEventListener('blur',        this._boundOnDomBlur);
            window.TEXT_INPUT_CONTAINER.appendChild(newDomInput);
        }

        {
            this._applyDomMaxLength(this.getMaxLength());
            this._applyDomTextColor(this._calculateDomTextColor());
            this._applyDomFontSize(this._calculateDomFontSize());
            this._applyDomIsBold(this.getIsBold());
            this._applyDomIsItalic(this.getIsItalic());
            this._applyDomLineSpacing(this.getLineSpacing());
            this._applyDomHorizontalAlign(this.getHorizontalAlign());
            this._applyDomVerticalAlign(this.getVerticalAlign());
            this._applyDomDisplayAsPassword(this.getIsDisplayAsPassword());
            this._applyDomWidth(this._calculateDomWidth());
            this._applyDomHeight(this._calculateDomHeight());
            this._applyDomFontFamily(this.getFontFamily());
            this._applyDomText(this.getText());
            this._applyDomPlaceholder(this._calculateDomPlaceholder());
            this._applyDomSelectionRange(this._selectionRange);
        }
    }

    // INPUT SUBSTITUTION
    private _applyDomVisible(visible: boolean): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.display = visible ? 'block' : 'none';
            window.scrollTo(0, 0);
        }
    }
    private _applyLabelVisible(visible: boolean): void {
        this._getLabelInput().setIsVisible(visible);
    }
    private _applyDomTransform(canvasBounds: CanvasBounds, transform: Matrix): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            if (isPc) {
                // domStyle.top        = `${canvasBounds.top}px`;
                // domStyle.left       = `${canvasBounds.left}px`;
                // domStyle.transform  = _matrixToCSS(transform);

                // TODO: transform会导致PC上鼠标拖选文字的行为变得很奇怪，因此改为不使用它
                // 缺点是如果输入框存在旋转、skew之类的操作，则会导致dom的位置对不上
                const point         = this.localToGlobal(0, 0);
                const stage         = getStage();
                const outerScaleX   = canvasBounds.width / stage.stageWidth;
                const outerScaleY   = canvasBounds.height / stage.stageHeight;
                domStyle.left       = `${canvasBounds.left + point.x * outerScaleX}px`;
                domStyle.top        = `${canvasBounds.top + point.y * outerScaleY}px`;
                domStyle.scale      = `${outerScaleX} ${outerScaleY}`;

            } else {
                const domWidth          = this._calculateDomWidth();
                const domHeight         = this._calculateDomHeight();
                const canvasWidth       = canvasBounds.width;
                const canvasHeight      = canvasBounds.height;
                const borderWidth       = 3;
                domStyle.left           = `${(canvasWidth - domWidth - borderWidth * 2) / 2}px`;
                if (!window.TW_APK_INJECT) {
                    domStyle.top    = `${(canvasHeight - domHeight - borderWidth * 2) / 2}px`;
                } else {
                    const stage         = getStage();
                    const multiplier    = (stage.stageWidth > stage.stageHeight) ? ApkLandscapeDomHeightMultiplier : ApkPortraitDomHeightMultiplier;
                    domStyle.top        = `${(canvasHeight * multiplier - domHeight - borderWidth * 2) / 2}px`;
                }

                domStyle.minHeight      = `${domHeight}px`;
                domStyle.maxHeight      = `${domHeight}px`;
                domStyle.minWidth       = `${domWidth}px`;
                domStyle.maxWidth       = `${domWidth}px`;
                domStyle.borderRadius   = "5px";
                domStyle.border         = `${borderWidth}px solid #3F4D66`;
                // domStyle.boxShadow      = "1px 1px 1px #999";
                domStyle.background     = "#4F607F";
                domStyle.transform      = "none";
                this._applyDomWidth(domWidth);
                this._applyDomHeight(domHeight);
            }

            // console.log(`_applyDomTransform`, canvasBounds, transform);
        }
    }
    private _applyDomAlpha(worldAlpha: number): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.opacity = `${worldAlpha}`;
        }
    }
    private _applyDomDisplayAsPassword(asPassword: boolean): void {
        const dom = this._getDomInput();
        if (dom?.nodeName === "INPUT") {
            (dom as HTMLInputElement).type = asPassword ? "password" : "text";
        }
    }
    private _applyDomWidth(width: number): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.width = `${width}px`;
        }
    }
    private _applyDomHeight(height: number): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.height = `${height}px`;
        }
    }
    private _applyDomText(text: string): void {
        const dom = this._getDomInput();
        if (dom) {
            dom.value = text;
        }
    }
    private _applyLabelText(text: string, asPassword: boolean): boolean {
        const label = this._getLabelInput();
        text        = asPassword ? '•'.repeat(text.length) : text;
        if (label.getText() == text) {
            return false;
        } else {
            label.setText(text);
            return true;
        }
    }
    private _applyDomPlaceholder(text: string): void {
        const dom = this._getDomInput();
        if (dom) {
            dom.placeholder = text;
        }
    }
    private _applyDomFontFamily(fontFamily: string): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.fontFamily = fontFamily;
        }
    }
    private _applyLabelFontFamily(fontFamily: string): void {
        this._getLabelInput().setFontFamily(fontFamily);
    }
    private _applyDomFontSize(size: number): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.fontSize = `${size}px`;
        }
    }
    private _applyLabelFontSize(size: number): void {
        this._getLabelInput().setFontSize(size);
    }
    private _applyDomTextColor(color: number): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.color = `#${color.toString(16).padStart(6, "0")}`;
        }
    }
    private _applyLabelTextColor(color: number): void {
        this._getLabelInput().setTextColor(color);
    }
    private _applyDomIsItalic(isItalic: boolean): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.fontStyle = isItalic ? " italic" : "normal";
        }
    }
    private _applyLabelIsItalic(isItalic: boolean): void {
        this._getLabelInput().setIsItalic(isItalic);
    }
    private _applyDomIsBold(isBold: boolean): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.fontWeight = isBold ? "bold" : "normal";
        }
    }
    private _applyLabelIsBold(isBold: boolean): void {
        this._getLabelInput().setIsBold(isBold);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private _applyDomLineSpacing(_spacing: number): void {
        // TODO
    }
    private _applyLabelLineSpacing(spacing: number): void {
        this._getLabelInput().setLineSpacing(spacing);
    }
    private _applyDomStrokeWidth(width: number): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.webkitTextStrokeWidth = `${width}px`;
        }
    }
    private _applyLabelStrokeWidth(width: number): void {
        this._getLabelInput().setStrokeWidth(width);
    }
    private _applyDomStrokeColor(color: number): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            domStyle.webkitTextStrokeColor = `#${color.toString(16).padStart(6, "0")}`;
        }
    }
    private _applyLabelStrokeColor(color: number): void {
        this._getLabelInput().setStrokeColor(color);
    }
    private _applyDomHorizontalAlign(align: UiHorizontalAlign): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            if (align === UiHorizontalAlign.Left) {
                domStyle.textAlign = "left";
            } else if (align === UiHorizontalAlign.Right) {
                domStyle.textAlign = "right";
            } else {
                domStyle.textAlign = "center";
            }
        }
    }
    private _applyLabelHorizontalAlign(align: UiHorizontalAlign): void {
        const label = this._getLabelInput();
        switch (align) {
            case UiHorizontalAlign.Left     : label.setHorizontalAlign(UiHorizontalAlign.Left);         return;
            case UiHorizontalAlign.Right    : label.setHorizontalAlign(UiHorizontalAlign.Right);        return;
            case UiHorizontalAlign.Center   : label.setHorizontalAlign(UiHorizontalAlign.Center);       return;
            default                         : throw newError(`Invalid align: ${align}`);
        }
    }
    private _applyDomVerticalAlign(align: UiVerticalAlign): void {
        const domStyle = this._getDomInput()?.style;
        if (domStyle) {
            if (align === UiVerticalAlign.Top) {
                domStyle.verticalAlign = "top";
            } else if (align === UiVerticalAlign.Bottom) {
                domStyle.verticalAlign = "bottom";
            } else {
                domStyle.verticalAlign = "middle";
            }
        }
    }
    private _applyLabelVerticalAlign(align: UiVerticalAlign): void {
        const label = this._getLabelInput();
        switch (align) {
            case UiVerticalAlign.Top    : label.setVerticalAlign(UiVerticalAlign.Top);              return;
            case UiVerticalAlign.Bottom : label.setVerticalAlign(UiVerticalAlign.Bottom);           return;
            case UiVerticalAlign.Middle : label.setVerticalAlign(UiVerticalAlign.Middle);           return;
            default                     : throw newError(`Invalid align: ${align}`);
        }
    }
    private _applyDomMaxLength(maxLength: number | undefined): void {
        const input = this._getDomInput();
        if (maxLength) {
            input?.setAttribute(KeyMaxLength, "" + maxLength);
        } else {
            input?.removeAttribute(KeyMaxLength);
        }
    }
    private _applyDomSelectionRange(range: (number | null)[]): void {
        const dom = this._getDomInput();
        if (dom) {
            dom.setSelectionRange(range[0], range[1]);
        }
    }

    private _calculateDomVisible(): boolean {
        return (this._getIsFocused())
            && (getWorldVisible(this));
    }
    private _calculateDomRelativeWorldTransform(): Matrix {
        const canvasBounds  = getCanvasBoundingClientRect();
        const matrix        = this._getWorldTransform().clone();
        const stage         = getStage();
        matrix.scale(
            canvasBounds.width / stage.stageWidth,
            canvasBounds.height / stage.stageHeight
        );

        // 以下原代码会导致缩放出错，故屏蔽
        // const resolution = lastRenderer.resolution;
        // matrix.scale(resolution, resolution);

        return matrix;
    }
    private _calculateDomPlaceholder(): string {
        return isPc ? "" : this.getDomPlaceholder();
    }
    private _calculateDomFontSize(): number {
        return isPc
            ? this.getFontSize()
            : 14;
    }
    private _calculateDomTextColor(): number {
        return isPc
            ? this.getTextColor()
            : 0xFFFFFF;
    }
    private _calculateDomWidth(): number {
        // const autoShrinkWidth   = this.getAutoShrinkWidth();
        // const manualWidth       = this.getUnscaledManualWidth();
        // if ((autoShrinkWidth == null) && (manualWidth == null)) {
        //     return Math.max(this.width, this.getFontSize() * 10);
        // } else {
        //     return Math.min(autoShrinkWidth ?? Number.MAX_SAFE_INTEGER, manualWidth ?? Number.MAX_SAFE_INTEGER);
        // }

        // return CompatibilityHelpers.isPc
        //     ? (this.getUnscaledManualWidth() ?? Math.max(this._getLabelInputAsTextField().width, this.getFontSize() * 10))
        //     : Math.floor(StageManager.getCanvasBoundingClientRect().width * 0.7);

        return isPc
            ? (this.getUnscaledManualWidth() ?? DefaultWidth)
            : Math.floor(getCanvasBoundingClientRect().width * 0.7);
    }
    private _calculateDomHeight(): number {
        // const autoShrinkHeight  = this.getAutoShrinkHeight();
        // const manualHeight      = this.getUnscaledManualHeight();
        // if ((autoShrinkHeight == null) && (manualHeight == null)) {
        //     return Math.max(this.height, this.getFontSize());
        // } else {
        //     return Math.min(autoShrinkHeight ?? Number.MAX_SAFE_INTEGER, manualHeight ?? Number.MAX_SAFE_INTEGER);
        // }

        // return CompatibilityHelpers.isPc
        //     ? (this.getUnscaledManualHeight() ?? Math.max(this._getLabelInputAsTextField().height, this.getFontSize()))
        //     : (this.getIsMultiline()
        //         ? Math.floor(StageManager.getCanvasBoundingClientRect().height * 0.7)
        //         : 30
        //     );

        if (isPc) {
            return this.getUnscaledManualHeight() ?? DefaultHeight;
        } else {
            if (!this.getIsMultiline()) {
                return 30;
            } else {
                const baseHeight = getCanvasBoundingClientRect().height * 0.7;
                if (!window.TW_APK_INJECT) {
                    return Math.floor(baseHeight);
                } else {
                    const stage = getStage();
                    return (stage.stageWidth > stage.stageHeight)
                        ? Math.floor(baseHeight * ApkLandscapeDomHeightMultiplier)
                        : Math.floor(baseHeight * ApkPortraitDomHeightMultiplier);
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _getWorldTransform(): Matrix {
        return this._getLabelInputAsTextField().$getConcatenatedMatrix();
    }
}

function _createDomInput(isMultiline: boolean): HTMLTextAreaElement | HTMLInputElement {
    let domInput: HTMLTextAreaElement | HTMLInputElement;
    if (isMultiline) {
        domInput                = document.createElement('textarea');
        domInput.style.resize   = 'none';
    } else {
        domInput = document.createElement('input');
        // domInput.type  = 'text';
    }

    {
        const style             = domInput.style;
        style.pointerEvents     = "auto";
        style.display           = "none";
        style.position          = "absolute";
        style.background        = "none";
        style.border            = "none";
        style.outline           = "none";
        style.transformOrigin   = "0 0";
        style.overflow          = "hidden";
        // style.fontFamily        = "Arial";
        // style.color             = '#99272E';
        // style.lineHeight        = "1";
    }

    return domInput;
}
function _getDomText(dom: HTMLTextAreaElement | HTMLInputElement | undefined): string {
    return dom?.value ?? "";
}

function _matrixToCSS(m: Matrix): string {
    return 'matrix('+[m.a,m.b,m.c,m.d,m.tx,m.ty].join(',')+')';
}
function _calculateCanvasBounds(): CanvasBounds {
    const rect = getCanvasBoundingClientRect();
    return {
        left    : rect.left + window.scrollX,
        top     : rect.top + window.scrollY,
        width   : rect.width,
        height  : rect.height,
    };
}
function _compareMatrices(m1: Matrix | undefined, m2: Matrix | undefined): boolean {
    return (m1 != null)
        && (m2 != null)
        && (m1.equals(m2));
}
function _compareClientRects(r1: CanvasBounds | undefined, r2: CanvasBounds | undefined): boolean {
    return (r1 != null)
        && (r2 != null)
        && (r1.left == r2.left)
        && (r1.top == r2.top)
        && (r1.width == r2.width)
        && (r1.height == r2.height);
}
