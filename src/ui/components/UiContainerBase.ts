import {
    Egret_Egret,
    Helpers_PointerInput,
    Ui_Utils_UiAabbCache,
    Ui_Utils_UiEventAgent,
    Ui_Utils_UiSizerInfo,
    Ui_Utils_UiSkinInfo,
    Ui_Utils_UiSizerHelpers,
    Ui_Utils_UiSkinHelpers,
    Helpers_Misc,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiContainerBase,
    type Ui_Interfaces_IUiEventAgent,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

// const con = new egret.DisplayObjectContainer();
// con.touchChildren;

export abstract class UiContainerBase extends Egret_Egret.DisplayObjectContainer implements Ui_Interfaces_IUiContainerBase.IUiContainerBase {
    private _unscaledManualWidth?   : number;
    private _unscaledManualHeight?  : number;

    private _eventAgent?            : Ui_Interfaces_IUiEventAgent.IUiEventAgent;
    private _skinInfo?              : Ui_Utils_UiSkinInfo.UiSkinInfo;
    private _sizerInfo?             : Ui_Utils_UiSizerInfo.UiSizerInfo;
    private _aabbCache?             : Ui_Utils_UiAabbCache.UiAabbCache;

    private _callbackOnAppliedSizeFromSizerInfo?        : (component: Ui_Interfaces_IUiComponent.IUiComponent, width: number | undefined, height: number | undefined) => void;
    private _callbackOnAppliedPositionFromSizerInfo?    : (component: Ui_Interfaces_IUiComponent.IUiComponent, x: number | undefined, y: number | undefined) => void;

    public getEventAgent(): Ui_Interfaces_IUiEventAgent.IUiEventAgent {
        return this._eventAgent ??= new Ui_Utils_UiEventAgent.UiEventAgent(this);
    }

    public checkAndInitSkinInfo(): Ui_Utils_UiSkinInfo.UiSkinInfo {
        return this._skinInfo ??= new Ui_Utils_UiSkinInfo.UiSkinInfo(this);
    }
    public getSkinInfo(): Ui_Utils_UiSkinInfo.UiSkinInfo | undefined {
        return this._skinInfo;
    }
    public loadSkinAttrs(oldSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined, newSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
        Ui_Utils_UiSkinHelpers.commonLoadSkinAttrsForSizer(this, oldSkinAttrs, newSkinAttrs);
    }

    public checkAndInitSizerInfo(): Ui_Utils_UiSizerInfo.UiSizerInfo {
        return this._sizerInfo ??= new Ui_Utils_UiSizerInfo.UiSizerInfo(this);
    }
    public getSizerInfo(): Ui_Utils_UiSizerInfo.UiSizerInfo | undefined {
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

    public setCallbackOnAppliedSizeFromSizerInfo(callback: (component: Ui_Interfaces_IUiComponent.IUiComponent, width: number | undefined, height: number | undefined) => void): void {
        this._callbackOnAppliedSizeFromSizerInfo = callback;
    }
    public setCallbackOnAppliedPositionFromSizerInfo(callback: (component: Ui_Interfaces_IUiComponent.IUiComponent, x: number | undefined, y: number | undefined) => void): void {
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
    public getMouseStyle(): Helpers_PointerInput.MouseStyleType | undefined {
        return Helpers_PointerInput.getMouseExpectedStyleType(this);
    }
    public setMouseStyle(style: Helpers_PointerInput.MouseStyleType): void {
        Helpers_PointerInput.setMouseExpectedStyleType(this, style);
    }
    public getParent(): Egret_Egret.DisplayObjectContainer | undefined {
        return this.parent ?? undefined;
    }
    public getAabbToParent(): AuxiliaryTypes_AuxiliaryTypes.Rectangle {
        return (this._aabbCache ??= new Ui_Utils_UiAabbCache.UiAabbCache()).getAabb({
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

            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getY(): number {
        return this.y;
    }
    public setY(y: number): void {
        if (this.getY() !== y) {
            this.y = y;

            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getAnchorOffsetX(): number {
        return this.anchorOffsetX;
    }
    public setAnchorOffsetX(anchorOffsetX: number): void {
        if (this.getAnchorOffsetX() !== anchorOffsetX) {
            this.anchorOffsetX = anchorOffsetX;

            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getAnchorOffsetY(): number {
        return this.anchorOffsetY;
    }
    public setAnchorOffsetY(anchorOffsetY: number): void {
        if (this.getAnchorOffsetY() !== anchorOffsetY) {
            this.anchorOffsetY = anchorOffsetY;

            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getScaleX(): number {
        return this.scaleX;
    }
    public setScaleX(scaleX: number): void {
        if (this.getScaleX() !== scaleX) {
            this.scaleX = scaleX;

            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getScaleY(): number {
        return this.scaleY;
    }
    public setScaleY(scaleY: number): void {
        if (this.getScaleY() !== scaleY) {
            this.scaleY = scaleY;

            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
    public getRotationInDegree(): number {
        return this.rotation;
    }
    public setRotationInDegree(rotation: number): void {
        if (this.getRotationInDegree() !== rotation) {
            this.rotation = rotation;

            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
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
            throw Helpers_Misc.newError(`Invalid width: ${width}`);
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
            throw Helpers_Misc.newError(`Invalid height: ${height}`);
        }

        if (this.getUnscaledManualHeight() == height) {
            return false;
        }
        this._unscaledManualHeight = height;

        this.height = this.getUnscaledManualHeight() ?? NaN;
        this._checkAndAddAutoSizerInfo();

        return true;
    }

    public checkIsSameOrAncestor(target: Ui_Interfaces_IUiComponent.IUiComponent): boolean {
        return this.contains(target as unknown as Egret_Egret.DisplayObject);
    }

    protected _checkAndAddAutoSizerInfo(): void {
        Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
    }

    /** 修改egret内部计算bounds的方式，若不这么做，会出问题 */
    public override $measureContentBounds(bounds: Egret_Egret.Rectangle): void {
        const width = this.getUnscaledManualWidth();
        (width != null) && (bounds.width = width);

        const height = this.getUnscaledManualHeight();
        (height != null) && (bounds.height = height);
    }
    public override $measureChildBounds(bounds: Egret_Egret.Rectangle): void {
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
