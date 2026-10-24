import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesTaskQueue from "../../auxiliaryTypes/TaskQueue.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as UiInterfacesIUiComponent from "../interfaces/IUiComponent.ts";
import type * as UiInterfacesIUiEventAgent from "../interfaces/IUiEventAgent.ts";
import type * as UiInterfacesIUiImage from "../interfaces/IUiImage.ts";
import type * as UiTypesUiSkinAttrs from "../types/UiSkinAttrs.ts";
import * as UiUtilsUiAabbCache from "../utils/UiAabbCache.ts";
import * as UiUtilsUiEventAgent from "../utils/UiEventAgent.ts";
import * as UiUtilsUiSizerHelpers from "../utils/UiSizerHelpers.ts";
import * as UiUtilsUiSizerInfo from "../utils/UiSizerInfo.ts";
import * as UiUtilsUiSkinHelpers from "../utils/UiSkinHelpers.ts";
import * as UiUtilsUiSkinInfo from "../utils/UiSkinInfo.ts";
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as VendorEgretRes from "../../vendor/egret/Res.ts";

type UiSkinAttrs    = UiTypesUiSkinAttrs.UiSkinAttrs;
type IUiImage       = UiInterfacesIUiImage.IUiImage;

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

export class UiImage extends VendorEgretEgret.Bitmap implements IUiImage {
    private _unscaledManualWidth?   : number;
    private _unscaledManualHeight?  : number;
    private _source?                : string;
    private _scale9Grid?            : number[];

    private _eventAgent?            : UiInterfacesIUiEventAgent.IUiEventAgent;
    private _skinInfo?              : UiUtilsUiSkinInfo.UiSkinInfo;
    private _sizerInfo?             : UiUtilsUiSizerInfo.UiSizerInfo;
    private _aabbCache?             : UiUtilsUiAabbCache.UiAabbCache;
    private _taskQueue?             : AuxiliaryTypesTaskQueue.TaskQueue<void>;

    private _callbackOnAppliedSizeFromSizerInfo?        : (component: UiInterfacesIUiComponent.IUiComponent, width: number | undefined, height: number | undefined) => void;
    private _callbackOnAppliedPositionFromSizerInfo?    : (component: UiInterfacesIUiComponent.IUiComponent, x: number | undefined, y: number | undefined) => void;

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

    public getEventAgent(): UiInterfacesIUiEventAgent.IUiEventAgent {
        return this._eventAgent ??= new UiUtilsUiEventAgent.UiEventAgent(this);
    }

    public checkAndInitSkinInfo(): UiUtilsUiSkinInfo.UiSkinInfo {
        return this._skinInfo ??= new UiUtilsUiSkinInfo.UiSkinInfo(this);
    }
    public getSkinInfo(): UiUtilsUiSkinInfo.UiSkinInfo | undefined {
        return this._skinInfo;
    }
    public loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
        const source        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "source");
        const width         = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "width");
        const height        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "height");
        const x             = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "x");
        const y             = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "y");
        const alpha         = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "alpha");
        const visible       = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "visible");
        const rotation      = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "rotation");
        const pivotX        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetX");
        const pivotY        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetY");
        const scale9Grid    = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scale9Grid");
        const scaleX        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleX");
        const scaleY        = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleY");
        const smoothing     = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "smoothing");

        (x.needChange)          && (this.setX(HelpersMisc.getExisted(x.value)));
        (y.needChange)          && (this.setY(HelpersMisc.getExisted(y.value)));
        (scaleX.needChange)     && (this.setScaleX(HelpersMisc.getExisted(scaleX.value)));
        (scaleY.needChange)     && (this.setScaleY(HelpersMisc.getExisted(scaleY.value)));
        (pivotX.needChange)     && (this.setAnchorOffsetX(HelpersMisc.getExisted(pivotX.value)));
        (pivotY.needChange)     && (this.setAnchorOffsetY(HelpersMisc.getExisted(pivotY.value)));
        (alpha.needChange)      && (this.setAlpha(HelpersMisc.getExisted(alpha.value)));
        (visible.needChange)    && (this.setIsVisible(!!visible.value));
        (rotation.needChange)   && (this.setRotationInDegree(HelpersMisc.getExisted(rotation.value)));
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

        UiUtilsUiSizerHelpers.loadSizerOptions(this, newSkinAttrs);
    }

    public checkAndInitSizerInfo(): UiUtilsUiSizerInfo.UiSizerInfo {
        return this._sizerInfo ??= new UiUtilsUiSizerInfo.UiSizerInfo(this);
    }
    public getSizerInfo(): UiUtilsUiSizerInfo.UiSizerInfo | undefined {
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

    public setCallbackOnAppliedSizeFromSizerInfo(callback: (component: UiInterfacesIUiComponent.IUiComponent, width: number | undefined, height: number | undefined) => void): void {
        this._callbackOnAppliedSizeFromSizerInfo = callback;
    }
    public setCallbackOnAppliedPositionFromSizerInfo(callback: (component: UiInterfacesIUiComponent.IUiComponent, x: number | undefined, y: number | undefined) => void): void {
        this._callbackOnAppliedPositionFromSizerInfo = callback;
    }

    private _getTaskQueue(): AuxiliaryTypesTaskQueue.TaskQueue<void> {
        return this._taskQueue ??= new AuxiliaryTypesTaskQueue.TaskQueue();
    }

    public getIsTouchEnabled(): boolean {
        return this.touchEnabled;
    }
    public setIsTouchEnabled(enabled: boolean): void {
        this.touchEnabled = enabled;
    }
    public getMouseStyle(): HelpersPointerInput.MouseStyleType | undefined {
        return HelpersPointerInput.getMouseExpectedStyleType(this);
    }
    public setMouseStyle(style: HelpersPointerInput.MouseStyleType): void {
        HelpersPointerInput.setMouseExpectedStyleType(this, style);
    }
    public getParent(): VendorEgretEgret.DisplayObjectContainer | undefined {
        return this.parent ?? undefined;
    }
    public getAabbToParent(): AuxiliaryTypesAuxiliaryTypes.Rectangle {
        // return Utils.UiSizerHelpers.getAabbForSizer({
        //     unscaledWidth       : this.getUnscaledWidth(),
        //     unscaledHeight      : this.getUnscaledHeight(),
        //     scaleX              : this.getScaleX(),
        //     scaleY              : this.getScaleY(),
        //     rotationInDegree    : this.getRotationInDegree(),
        //     anchorOffsetX       : this.getAnchorOffsetX(),
        //     anchorOffsetY       : this.getAnchorOffsetY(),
        // });
        return (this._aabbCache ??= new UiUtilsUiAabbCache.UiAabbCache()).getAabb({
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

            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getY(): number {
        return this.y;
    }
    public setY(y: number): void {
        if (this.getY() !== y) {
            this.y = y;

            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getAnchorOffsetX(): number {
        return this.anchorOffsetX;
    }
    public setAnchorOffsetX(anchorOffsetX: number): void {
        if (this.getAnchorOffsetX() !== anchorOffsetX) {
            this.anchorOffsetX = anchorOffsetX;

            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getAnchorOffsetY(): number {
        return this.anchorOffsetY;
    }
    public setAnchorOffsetY(anchorOffsetY: number): void {
        if (this.getAnchorOffsetY() !== anchorOffsetY) {
            this.anchorOffsetY = anchorOffsetY;

            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getScaleX(): number {
        return this.scaleX;
    }
    public setScaleX(scaleX: number): void {
        if (this.getScaleX() !== scaleX) {
            this.scaleX = scaleX;

            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getScaleY(): number {
        return this.scaleY;
    }
    public setScaleY(scaleY: number): void {
        if (this.getScaleY() !== scaleY) {
            this.scaleY = scaleY;

            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getRotationInDegree(): number {
        return this.rotation;
    }
    public setRotationInDegree(rotation: number): void {
        if (this.getRotationInDegree() !== rotation) {
            this.rotation = rotation;

            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
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
            throw HelpersMisc.newError(`Invalid width: ${width}`);
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
        UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
    }
    public getUnscaledManualHeight(): number | undefined {
        return this._unscaledManualHeight;
    }
    public setUnscaledManualHeight(height: number | undefined): boolean {
        if ((height != null) && (height < 0)) {
            throw HelpersMisc.newError(`Invalid height: ${height}`);
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
        UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
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
            (HelpersCollection.checkIsSameList(oldScale9Grid ?? [], scale9Grid ?? []))
        ) {
            (callbackOnLoaded) && (callbackOnLoaded(this));
            return;
        }

        this._setSource(textureSourceName);
        this._setScale9Grid(scale9Grid);

        if (textureSourceName == ``) {
            this.$setTexture(`` as any);
        } else {
            const data = !VendorEgretRes.hasRes(textureSourceName)
                ? await VendorEgretRes.getResByUrl<VendorEgretEgret.Texture>(textureSourceName, undefined, undefined, VendorEgretRes.ResourceItemHelper.TYPE_IMAGE)
                : (VendorEgretRes.getRes<VendorEgretEgret.Texture>(textureSourceName) ?? await VendorEgretRes.getResAsync<VendorEgretEgret.Texture>(textureSourceName));
            if ((data == null) || (!VendorEgretEgret.is(data, "egret.Texture"))) {
                throw HelpersMisc.newError(`Invalid textureSourceName: ${textureSourceName}`);
            }
            this.$setTexture(data);
            this.dispatchEventWith(VendorEgretEgret.Event.COMPLETE);
        }

        this._doApplyScale9Grid(scale9Grid);
        this._doApplyUnscaledManualWidth();
        this._doApplyUnscaledManualHeight();
        UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, true);

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
            if (!HelpersCollection.checkIsSameList(oldScale9Grid ?? [], scale9Grid ?? [])) {
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
                throw HelpersMisc.newError(`Invalid scale9Grid.`);
            }
            this.scale9Grid = new VendorEgretEgret.Rectangle(newValue[0], newValue[1], newValue[2], newValue[3]);
        }
    }

    public getIsSmoothing(): boolean {
        return this.smoothing;
    }
    public setIsSmoothing(value: boolean): void {
        this.smoothing = value;
    }

    public getMask(): VendorEgretEgret.DisplayObject | VendorEgretEgret.Rectangle | null {
        return this.mask;
    }
    public setMask(mask: VendorEgretEgret.Rectangle | null): void {
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
