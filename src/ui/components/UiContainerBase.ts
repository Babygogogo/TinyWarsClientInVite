import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as UiInterfacesIUiComponent from "../interfaces/IUiComponent.ts";
import type * as UiInterfacesIUiContainerBase from "../interfaces/IUiContainerBase.ts";
import type * as UiInterfacesIUiEventAgent from "../interfaces/IUiEventAgent.ts";
import type * as UiTypesUiSkinAttrs from "../types/UiSkinAttrs.ts";
import * as UiUtilsUiAabbCache from "../utils/UiAabbCache.ts";
import * as UiUtilsUiEventAgent from "../utils/UiEventAgent.ts";
import * as UiUtilsUiSizerHelpers from "../utils/UiSizerHelpers.ts";
import * as UiUtilsUiSizerInfo from "../utils/UiSizerInfo.ts";
import * as UiUtilsUiSkinHelpers from "../utils/UiSkinHelpers.ts";
import * as UiUtilsUiSkinInfo from "../utils/UiSkinInfo.ts";
import * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type UiSkinAttrs = UiTypesUiSkinAttrs.UiSkinAttrs;

// const con = new egret.DisplayObjectContainer();
// con.touchChildren;

export abstract class UiContainerBase extends VendorEgretEgret.DisplayObjectContainer implements UiInterfacesIUiContainerBase.IUiContainerBase {
    private _unscaledManualWidth?   : number;
    private _unscaledManualHeight?  : number;

    private _eventAgent?            : UiInterfacesIUiEventAgent.IUiEventAgent;
    private _skinInfo?              : UiUtilsUiSkinInfo.UiSkinInfo;
    private _sizerInfo?             : UiUtilsUiSizerInfo.UiSizerInfo;
    private _aabbCache?             : UiUtilsUiAabbCache.UiAabbCache;

    private _callbackOnAppliedSizeFromSizerInfo?        : (component: UiInterfacesIUiComponent.IUiComponent, width: number | undefined, height: number | undefined) => void;
    private _callbackOnAppliedPositionFromSizerInfo?    : (component: UiInterfacesIUiComponent.IUiComponent, x: number | undefined, y: number | undefined) => void;

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
        UiUtilsUiSkinHelpers.commonLoadSkinAttrsForSizer(this, oldSkinAttrs, newSkinAttrs);
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

        this.width = this.getUnscaledManualWidth() ?? NaN;
        this._checkAndAddAutoSizerInfo();

        return true;
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

        this.height = this.getUnscaledManualHeight() ?? NaN;
        this._checkAndAddAutoSizerInfo();

        return true;
    }

    public checkIsSameOrAncestor(target: UiInterfacesIUiComponent.IUiComponent): boolean {
        return this.contains(target as unknown as VendorEgretEgret.DisplayObject);
    }

    protected _checkAndAddAutoSizerInfo(): void {
        UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
    }

    /** 修改egret内部计算bounds的方式，若不这么做，会出问题 */
    public override $measureContentBounds(bounds: VendorEgretEgret.Rectangle): void {
        const width = this.getUnscaledManualWidth();
        (width != null) && (bounds.width = width);

        const height = this.getUnscaledManualHeight();
        (height != null) && (bounds.height = height);
    }
    public override $measureChildBounds(bounds: VendorEgretEgret.Rectangle): void {
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
