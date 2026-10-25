import type { Rectangle } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { TaskQueue } from "../../auxiliaryTypes/TaskQueue.ts";
import { checkIsSameList } from "../../helpers/Collection.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { MouseStyleType, getMouseExpectedStyleType, setMouseExpectedStyleType } from "../../helpers/PointerInput.ts";
import type { IUiComponent } from "../interfaces/IUiComponent.ts";
import type { IUiEventAgent } from "../interfaces/IUiEventAgent.ts";
import type { IUiImage } from "../interfaces/IUiImage.ts";
import type { UiSkinAttrs } from "../types/UiSkinAttrs.ts";
import { UiAabbCache } from "../utils/UiAabbCache.ts";
import { UiEventAgent } from "../utils/UiEventAgent.ts";
import { loadSizerOptions, checkAndAddAutoSizerInfo } from "../utils/UiSizerHelpers.ts";
import { UiSizerInfo } from "../utils/UiSizerInfo.ts";
import { getRevisedAttrValue } from "../utils/UiSkinHelpers.ts";
import { UiSkinInfo } from "../utils/UiSkinInfo.ts";
import {
    Bitmap,
    DisplayObjectContainer,
    Texture,
    is,
    Event,
    Rectangle as VendorEgretEgretRectangle,
    DisplayObject,
} from "../../vendor/egret/Egret.ts";
import { hasRes, getResByUrl, ResourceItemHelper, getRes, getResAsync } from "../../vendor/egret/Res.ts";

// const obj = new egret.DisplayObject;
// obj.x;
// obj.y;
// obj.scaleX;
// obj.scaleY;
// obj.width;
// obj.height;
// obj.anchorOffsetX;
// obj.anchorOffsetY;
// obj.alpha;
// obj.rotation;
// obj.touchEnabled;
// obj.parent;
// obj.visible;

export class UiImage extends Bitmap implements IUiImage {
    private _unscaledManualWidth?   : number;
    private _unscaledManualHeight?  : number;
    private _source?                : string;
    private _scale9Grid?            : number[];

    private _eventAgent?            : IUiEventAgent;
    private _skinInfo?              : UiSkinInfo;
    private _sizerInfo?             : UiSizerInfo;
    private _aabbCache?             : UiAabbCache;
    private _taskQueue?             : TaskQueue<void>;

    private _callbackOnAppliedSizeFromSizerInfo?        : (component: IUiComponent, width: number | undefined, height: number | undefined) => void;
    private _callbackOnAppliedPositionFromSizerInfo?    : (component: IUiComponent, x: number | undefined, y: number | undefined) => void;

    public constructor({
        textureSourceName,
        scale9Grid,
        callbackOnLoaded,
    }: {
        textureSourceName?  : string;
        scale9Grid?         : number[];
        callbackOnLoaded?   : (s: IUiImage) => void;
    } = {}) {
        super();

        if (textureSourceName) {
            this.loadSource(textureSourceName, scale9Grid ?? this.getScale9Grid(), callbackOnLoaded);
        } else if (scale9Grid) {
            this.applyScale9Grid(scale9Grid);
        }
    }

    public getEventAgent(): IUiEventAgent {
        return this._eventAgent ??= new UiEventAgent(this);
    }

    public checkAndInitSkinInfo(): UiSkinInfo {
        return this._skinInfo ??= new UiSkinInfo(this);
    }
    public getSkinInfo(): UiSkinInfo | undefined {
        return this._skinInfo;
    }
    public loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
        const source        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "source");
        const width         = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "width");
        const height        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "height");
        const x             = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "x");
        const y             = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "y");
        const alpha         = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "alpha");
        const visible       = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "visible");
        const rotation      = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "rotation");
        const pivotX        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetX");
        const pivotY        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetY");
        const scale9Grid    = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scale9Grid");
        const scaleX        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleX");
        const scaleY        = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleY");
        const smoothing     = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "smoothing");

        (x.needChange)          && (this.setX(getExisted(x.value)));
        (y.needChange)          && (this.setY(getExisted(y.value)));
        (scaleX.needChange)     && (this.setScaleX(getExisted(scaleX.value)));
        (scaleY.needChange)     && (this.setScaleY(getExisted(scaleY.value)));
        (pivotX.needChange)     && (this.setAnchorOffsetX(getExisted(pivotX.value)));
        (pivotY.needChange)     && (this.setAnchorOffsetY(getExisted(pivotY.value)));
        (alpha.needChange)      && (this.setAlpha(getExisted(alpha.value)));
        (visible.needChange)    && (this.setIsVisible(!!visible.value));
        (rotation.needChange)   && (this.setRotationInDegree(getExisted(rotation.value)));
        (width.needChange)      && (this.setUnscaledManualWidth(width.value));
        (height.needChange)     && (this.setUnscaledManualHeight(height.value));
        (smoothing.needChange)  && (this.setIsSmoothing(!!smoothing.value));

        if (source.needChange) {
            this.loadSource(
                source.value ?? ``,
                scale9Grid.needChange ? scale9Grid.value : this.getScale9Grid(),
            );
        } else if (scale9Grid.needChange) {
            this.applyScale9Grid(scale9Grid.value);
        }

        loadSizerOptions(this, newSkinAttrs);
    }

    public checkAndInitSizerInfo(): UiSizerInfo {
        return this._sizerInfo ??= new UiSizerInfo(this);
    }
    public getSizerInfo(): UiSizerInfo | undefined {
        return this._sizerInfo;
    }
    public destroySizerInfo(): void {
        this._sizerInfo?.destroy();
        delete this._sizerInfo;
    }
    public applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean {
        let isUpdated = false;
        if ((width != null) && (isFinite(width))) {
            isUpdated                   ||= (this.scaleX !== 1) || (this.width !== width) || (this._unscaledManualWidth !== width);
            this.scaleX                 = 1;
            this.width                  = width;
            this._unscaledManualWidth   = width;
        }
        if ((height != null) && (isFinite(height))) {
            isUpdated                   ||= (this.scaleY !== 1) || (this.height !== height) || (this._unscaledManualHeight !== height);
            this.scaleY                 = 1;
            this.height                 = height;
            this._unscaledManualHeight  = height;
        }

        this._callbackOnAppliedSizeFromSizerInfo?.(this, width, height);

        return isUpdated;
    }
    public applyPositionFromSizerInfo(x: number | undefined, y: number | undefined): void {
        if ((x != null) && (isFinite(x))) {
            this.x = x;
        }
        if ((y != null) && (isFinite(y))) {
            this.y = y;
        }

        this._callbackOnAppliedPositionFromSizerInfo?.(this, x, y);
    }

    public setCallbackOnAppliedSizeFromSizerInfo(callback: (component: IUiComponent, width: number | undefined, height: number | undefined) => void): void {
        this._callbackOnAppliedSizeFromSizerInfo = callback;
    }
    public setCallbackOnAppliedPositionFromSizerInfo(callback: (component: IUiComponent, x: number | undefined, y: number | undefined) => void): void {
        this._callbackOnAppliedPositionFromSizerInfo = callback;
    }

    private _getTaskQueue(): TaskQueue<void> {
        return this._taskQueue ??= new TaskQueue();
    }

    public getIsTouchEnabled(): boolean {
        return this.touchEnabled;
    }
    public setIsTouchEnabled(enabled: boolean): void {
        this.touchEnabled = enabled;
    }
    public getMouseStyle(): MouseStyleType | undefined {
        return getMouseExpectedStyleType(this);
    }
    public setMouseStyle(style: MouseStyleType): void {
        setMouseExpectedStyleType(this, style);
    }
    public getParent(): DisplayObjectContainer | undefined {
        return this.parent ?? undefined;
    }
    public getAabbToParent(): Rectangle {
        // return Utils.UiSizerHelpers.getAabbForSizer({
        //     unscaledWidth       : this.getUnscaledWidth(),
        //     unscaledHeight      : this.getUnscaledHeight(),
        //     scaleX              : this.getScaleX(),
        //     scaleY              : this.getScaleY(),
        //     rotationInDegree    : this.getRotationInDegree(),
        //     anchorOffsetX       : this.getAnchorOffsetX(),
        //     anchorOffsetY       : this.getAnchorOffsetY(),
        // });
        return (this._aabbCache ??= new UiAabbCache()).getAabb({
            unscaledWidth       : this.width,
            unscaledHeight      : this.height,
            scaleX              : this.scaleX,
            scaleY              : this.scaleY,
            rotationInDegree    : this.rotation,
            anchorOffsetX       : this.anchorOffsetX,
            anchorOffsetY       : this.anchorOffsetY,
        });
    }

    public getX(): number {
        return this.x;
    }
    public setX(x: number): void {
        if (this.getX() !== x) {
            this.x = x;

            checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getY(): number {
        return this.y;
    }
    public setY(y: number): void {
        if (this.getY() !== y) {
            this.y = y;

            checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getAnchorOffsetX(): number {
        return this.anchorOffsetX;
    }
    public setAnchorOffsetX(anchorOffsetX: number): void {
        if (this.getAnchorOffsetX() !== anchorOffsetX) {
            this.anchorOffsetX = anchorOffsetX;

            checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getAnchorOffsetY(): number {
        return this.anchorOffsetY;
    }
    public setAnchorOffsetY(anchorOffsetY: number): void {
        if (this.getAnchorOffsetY() !== anchorOffsetY) {
            this.anchorOffsetY = anchorOffsetY;

            checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getScaleX(): number {
        return this.scaleX;
    }
    public setScaleX(scaleX: number): void {
        if (this.getScaleX() !== scaleX) {
            this.scaleX = scaleX;

            checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getScaleY(): number {
        return this.scaleY;
    }
    public setScaleY(scaleY: number): void {
        if (this.getScaleY() !== scaleY) {
            this.scaleY = scaleY;

            checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getRotationInDegree(): number {
        return this.rotation;
    }
    public setRotationInDegree(rotation: number): void {
        if (this.getRotationInDegree() !== rotation) {
            this.rotation = rotation;

            checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getIsVisible(): boolean {
        return this.visible;
    }
    public setIsVisible(isVisible: boolean): void {
        this.visible = isVisible;
    }
    public getAlpha(): number {
        return this.alpha;
    }
    public setAlpha(alpha: number): void {
        this.alpha = alpha;
    }
    public getUnscaledWidth(): number {
        return this.getUnscaledManualWidth() ?? this.width;
    }
    public getScaledWidth(): number {
        return this.getUnscaledWidth() * this.getScaleX();
    }
    public getUnscaledHeight(): number {
        return this.getUnscaledManualHeight() ?? this.height;
    }
    public getScaledHeight(): number {
        return this.getUnscaledHeight() * this.getScaleY();
    }
    public getUnscaledManualWidth(): number | undefined {
        return this._unscaledManualWidth;
    }
    public setUnscaledManualWidth(width: number | undefined): boolean {
        if ((width != null) && (width < 0)) {
            throw newError(`Invalid width: ${width}`);
        }

        if (this.getUnscaledManualWidth() == width) {
            return false;
        }
        this._unscaledManualWidth = width;

        this._doApplyUnscaledManualWidth();
        return true;
    }
    private _doApplyUnscaledManualWidth(): void {
        this.width = this.getUnscaledManualWidth() ?? NaN;
        checkAndAddAutoSizerInfo(this, true);
    }
    public getUnscaledManualHeight(): number | undefined {
        return this._unscaledManualHeight;
    }
    public setUnscaledManualHeight(height: number | undefined): boolean {
        if ((height != null) && (height < 0)) {
            throw newError(`Invalid height: ${height}`);
        }

        if (this.getUnscaledManualHeight() == height) {
            return false;
        }
        this._unscaledManualHeight = height;

        this._doApplyUnscaledManualHeight();
        return true;
    }
    private _doApplyUnscaledManualHeight(): void {
        this.height = this.getUnscaledManualHeight() ?? NaN;
        checkAndAddAutoSizerInfo(this, true);
    }

    public getSource(): string | undefined {
        return this._source;
    }
    private _setSource(source: string): void {
        this._source = source;
    }
    public loadSource(
        textureSourceName   : string,
        scale9Grid          = this.getScale9Grid(),
        callbackOnLoaded?   : (s: IUiImage) => void
    ): Promise<void> {
        return this._getTaskQueue().addTask(() => this._doLoadSource(textureSourceName, scale9Grid, callbackOnLoaded));
    }
    private async _doLoadSource(
        textureSourceName   : string,
        scale9Grid          : number[] | undefined,
        callbackOnLoaded?   : (s: IUiImage) => void
    ): Promise<void> {
        const oldScale9Grid = this.getScale9Grid();
        if ((textureSourceName === this.getSource())                                    &&
            ((oldScale9Grid == null) === (scale9Grid == null))                          &&
            (checkIsSameList(oldScale9Grid ?? [], scale9Grid ?? []))
        ) {
            (callbackOnLoaded) && (callbackOnLoaded(this));
            return;
        }

        this._setSource(textureSourceName);
        this._setScale9Grid(scale9Grid);

        if (textureSourceName == ``) {
            this.$setTexture(`` as any);
        } else {
            const data = !hasRes(textureSourceName)
                ? await getResByUrl<Texture>(textureSourceName, undefined, undefined, ResourceItemHelper.TYPE_IMAGE)
                : (getRes<Texture>(textureSourceName) ?? await getResAsync<Texture>(textureSourceName));
            if ((data == null) || (!is(data, "egret.Texture"))) {
                throw newError(`Invalid textureSourceName: ${textureSourceName}`);
            }
            this.$setTexture(data);
            this.dispatchEventWith(Event.COMPLETE);
        }

        this._doApplyScale9Grid(scale9Grid);
        this._doApplyUnscaledManualWidth();
        this._doApplyUnscaledManualHeight();
        checkAndAddAutoSizerInfo(this, true);

        (callbackOnLoaded) && (callbackOnLoaded(this));
    }

    public getScale9Grid(): number[] | undefined {
        return this._scale9Grid;
    }
    private _setScale9Grid(scale9Grid: number[] | undefined): void {
        this._scale9Grid = scale9Grid;
    }
    public applyScale9Grid(scale9Grid: number[] | undefined): void {
        const oldScale9Grid = this.getScale9Grid();
        if ((oldScale9Grid == null) !== (scale9Grid == null)) {
            this.loadSource(this.getSource() ?? ``, scale9Grid);
        } else {
            if (!checkIsSameList(oldScale9Grid ?? [], scale9Grid ?? [])) {
                this._setScale9Grid(scale9Grid);
                this._doApplyScale9Grid(scale9Grid);
            }
        }
    }
    private _doApplyScale9Grid(newValue: number[] | undefined): void {
        if (newValue == null) {
            this.scale9Grid = null as any;
        } else {
            if (newValue.length !== 4) {
                throw newError(`Invalid scale9Grid.`);
            }
            this.scale9Grid = new VendorEgretEgretRectangle(newValue[0], newValue[1], newValue[2], newValue[3]);
        }
    }

    public getIsSmoothing(): boolean {
        return this.smoothing;
    }
    public setIsSmoothing(value: boolean): void {
        this.smoothing = value;
    }

    public getMask(): DisplayObject | VendorEgretEgretRectangle | null {
        return this.mask;
    }
    public setMask(mask: VendorEgretEgretRectangle | null): void {
        (this.mask as any) = mask;
    }

    public get customX(): number {
        return this.getX();
    }
    public set customX(value: number) {
        this.setX(value);
    }
    public get customY(): number {
        return this.getY();
    }
    public set customY(value: number) {
        this.setY(value);
    }
    public get customScaleX(): number {
        return this.getScaleX();
    }
    public set customScaleX(value: number) {
        this.setScaleX(value);
    }
    public get customScaleY(): number {
        return this.getScaleY();
    }
    public set customScaleY(value: number) {
        this.setScaleY(value);
    }
    public get customAlpha(): number {
        return this.getAlpha();
    }
    public set customAlpha(value: number) {
        this.setAlpha(value);
    }
}
