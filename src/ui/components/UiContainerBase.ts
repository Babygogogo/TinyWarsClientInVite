import type { Rectangle } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { newError } from "../../helpers/Misc.ts";
import { MouseStyleType, getMouseExpectedStyleType, setMouseExpectedStyleType } from "../../helpers/PointerInput.ts";
import type { IUiComponent } from "../interfaces/IUiComponent.ts";
import type { IUiContainerBase } from "../interfaces/IUiContainerBase.ts";
import type { IUiEventAgent } from "../interfaces/IUiEventAgent.ts";
import type { UiSkinAttrs } from "../types/UiSkinAttrs.ts";
import { UiAabbCache } from "../utils/UiAabbCache.ts";
import { UiEventAgent } from "../utils/UiEventAgent.ts";
import { checkAndAddAutoSizerInfo } from "../utils/UiSizerHelpers.ts";
import { UiSizerInfo } from "../utils/UiSizerInfo.ts";
import { commonLoadSkinAttrsForSizer } from "../utils/UiSkinHelpers.ts";
import { UiSkinInfo } from "../utils/UiSkinInfo.ts";
import { DisplayObjectContainer, DisplayObject, Rectangle as VendorEgretEgretRectangle } from "../../vendor/egret/Egret.ts";

// const con = new egret.DisplayObjectContainer();
// con.touchChildren;

export abstract class UiContainerBase extends DisplayObjectContainer implements IUiContainerBase {
    private _unscaledManualWidth?   : number;
    private _unscaledManualHeight?  : number;

    private _eventAgent?            : IUiEventAgent;
    private _skinInfo?              : UiSkinInfo;
    private _sizerInfo?             : UiSizerInfo;
    private _aabbCache?             : UiAabbCache;

    private _callbackOnAppliedSizeFromSizerInfo?        : (component: IUiComponent, width: number | undefined, height: number | undefined) => void;
    private _callbackOnAppliedPositionFromSizerInfo?    : (component: IUiComponent, x: number | undefined, y: number | undefined) => void;

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
        commonLoadSkinAttrsForSizer(this, oldSkinAttrs, newSkinAttrs);
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

    public getIsTouchEnabled(): boolean {
        return this.touchEnabled;
    }
    public setIsTouchEnabled(enabled: boolean): void {
        this.touchEnabled = enabled;
    }
    public getIsTouchChildrenEnabled(): boolean {
        return this.touchChildren;
    }
    public setIsTouchChildrenEnabled(enabled: boolean): void {
        this.touchChildren = enabled;
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

        this.width = this.getUnscaledManualWidth() ?? NaN;
        this._checkAndAddAutoSizerInfo();

        return true;
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

        this.height = this.getUnscaledManualHeight() ?? NaN;
        this._checkAndAddAutoSizerInfo();

        return true;
    }

    public checkIsSameOrAncestor(target: IUiComponent): boolean {
        return this.contains(target as unknown as DisplayObject);
    }

    protected _checkAndAddAutoSizerInfo(): void {
        checkAndAddAutoSizerInfo(this, true);
    }

    /** 修改egret内部计算bounds的方式，若不这么做，会出问题 */
    public override $measureContentBounds(bounds: VendorEgretEgretRectangle): void {
        const width = this.getUnscaledManualWidth();
        (width != null) && (bounds.width = width);

        const height = this.getUnscaledManualHeight();
        (height != null) && (bounds.height = height);
    }
    public override $measureChildBounds(bounds: VendorEgretEgretRectangle): void {
        if ((this.getUnscaledManualWidth() == null) || (this.getUnscaledManualHeight() == null)) {
            super.$measureChildBounds(bounds);
        }
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
    public get customVisible(): boolean {
        return this.getIsVisible();
    }
    public set customVisible(value: boolean) {
        this.setIsVisible(value);
    }
}
