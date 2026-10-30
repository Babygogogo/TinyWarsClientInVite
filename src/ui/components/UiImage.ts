import {
    Egret_Egret,
    Helpers_PointerInput,
    Egret_Res,
    AuxiliaryTypes_TaskQueue,
    Ui_Utils_UiAabbCache,
    Ui_Utils_UiEventAgent,
    Ui_Utils_UiSizerInfo,
    Ui_Utils_UiSkinInfo,
    Ui_Utils_UiSizerHelpers,
    Helpers_Collection,
    Helpers_Misc,
    Ui_Utils_UiSkinHelpers,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiEventAgent,
    type Ui_Interfaces_IUiImage,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

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

export class UiImage extends Egret_Egret.Bitmap implements Ui_Interfaces_IUiImage.IUiImage {
    private _unscaledManualWidth?   : number;
    private _unscaledManualHeight?  : number;
    private _source?                : string;
    private _scale9Grid?            : number[];

    private _eventAgent?            : Ui_Interfaces_IUiEventAgent.IUiEventAgent;
    private _skinInfo?              : Ui_Utils_UiSkinInfo.UiSkinInfo;
    private _sizerInfo?             : Ui_Utils_UiSizerInfo.UiSizerInfo;
    private _aabbCache?             : Ui_Utils_UiAabbCache.UiAabbCache;
    private _taskQueue?             : AuxiliaryTypes_TaskQueue.TaskQueue<void>;

    private _callbackOnAppliedSizeFromSizerInfo?        : (component: Ui_Interfaces_IUiComponent.IUiComponent, width: number | undefined, height: number | undefined) => void;
    private _callbackOnAppliedPositionFromSizerInfo?    : (component: Ui_Interfaces_IUiComponent.IUiComponent, x: number | undefined, y: number | undefined) => void;

    public constructor({
        textureSourceName,
        scale9Grid,
        callbackOnLoaded,
    }: {
        textureSourceName?  : string;
        scale9Grid?         : number[];
        callbackOnLoaded?   : (s: Ui_Interfaces_IUiImage.IUiImage) => void;
    } = {}) {
        super();

        if (textureSourceName) {
            this.loadSource(textureSourceName, scale9Grid ?? this.getScale9Grid(), callbackOnLoaded);
        } else if (scale9Grid) {
            this.applyScale9Grid(scale9Grid);
        }
    }

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
        const source        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "source");
        const width         = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "width");
        const height        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "height");
        const x             = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "x");
        const y             = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "y");
        const alpha         = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "alpha");
        const visible       = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "visible");
        const rotation      = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "rotation");
        const pivotX        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetX");
        const pivotY        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "anchorOffsetY");
        const scale9Grid    = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scale9Grid");
        const scaleX        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleX");
        const scaleY        = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "scaleY");
        const smoothing     = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "smoothing");

        (x.needChange)          && (this.setX(Helpers_Misc.getExisted(x.value)));
        (y.needChange)          && (this.setY(Helpers_Misc.getExisted(y.value)));
        (scaleX.needChange)     && (this.setScaleX(Helpers_Misc.getExisted(scaleX.value)));
        (scaleY.needChange)     && (this.setScaleY(Helpers_Misc.getExisted(scaleY.value)));
        (pivotX.needChange)     && (this.setAnchorOffsetX(Helpers_Misc.getExisted(pivotX.value)));
        (pivotY.needChange)     && (this.setAnchorOffsetY(Helpers_Misc.getExisted(pivotY.value)));
        (alpha.needChange)      && (this.setAlpha(Helpers_Misc.getExisted(alpha.value)));
        (visible.needChange)    && (this.setIsVisible(!!visible.value));
        (rotation.needChange)   && (this.setRotationInDegree(Helpers_Misc.getExisted(rotation.value)));
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

        Ui_Utils_UiSizerHelpers.loadSizerOptions(this, newSkinAttrs);
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

    private _getTaskQueue(): AuxiliaryTypes_TaskQueue.TaskQueue<void> {
        return this._taskQueue ??= new AuxiliaryTypes_TaskQueue.TaskQueue();
    }

    public getIsTouchEnabled(): boolean {
        return this.touchEnabled;
    }
    public setIsTouchEnabled(enabled: boolean): void {
        this.touchEnabled = enabled;
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
        // return Utils.UiSizerHelpers.getAabbForSizer({
        //     unscaledWidth       : this.getUnscaledWidth(),
        //     unscaledHeight      : this.getUnscaledHeight(),
        //     scaleX              : this.getScaleX(),
        //     scaleY              : this.getScaleY(),
        //     rotationInDegree    : this.getRotationInDegree(),
        //     anchorOffsetX       : this.getAnchorOffsetX(),
        //     anchorOffsetY       : this.getAnchorOffsetY(),
        // });
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

        this._doApplyUnscaledManualWidth();
        return true;
    }
    private _doApplyUnscaledManualWidth(): void {
        this.width = this.getUnscaledManualWidth() ?? NaN;
        Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
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

        this._doApplyUnscaledManualHeight();
        return true;
    }
    private _doApplyUnscaledManualHeight(): void {
        this.height = this.getUnscaledManualHeight() ?? NaN;
        Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
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
        callbackOnLoaded?   : (s: Ui_Interfaces_IUiImage.IUiImage) => void
    ): Promise<void> {
        return this._getTaskQueue().addTask(() => this._doLoadSource(textureSourceName, scale9Grid, callbackOnLoaded));
    }
    private async _doLoadSource(
        textureSourceName   : string,
        scale9Grid          : number[] | undefined,
        callbackOnLoaded?   : (s: Ui_Interfaces_IUiImage.IUiImage) => void
    ): Promise<void> {
        const oldScale9Grid = this.getScale9Grid();
        if ((textureSourceName === this.getSource())                                    &&
            ((oldScale9Grid == null) === (scale9Grid == null))                          &&
            (Helpers_Collection.checkIsSameList(oldScale9Grid ?? [], scale9Grid ?? []))
        ) {
            (callbackOnLoaded) && (callbackOnLoaded(this));
            return;
        }

        this._setSource(textureSourceName);
        this._setScale9Grid(scale9Grid);

        if (textureSourceName == ``) {
            this.$setTexture(`` as any);
        } else {
            const data = !Egret_Res.hasRes(textureSourceName)
                ? await Egret_Res.getResByUrl<Egret_Egret.Texture>(textureSourceName, undefined, undefined, Egret_Res.ResourceItemHelper.TYPE_IMAGE)
                : (Egret_Res.getRes<Egret_Egret.Texture>(textureSourceName) ?? await Egret_Res.getResAsync<Egret_Egret.Texture>(textureSourceName));
            if ((data == null) || (!Egret_Egret.is(data, "egret.Texture"))) {
                throw Helpers_Misc.newError(`Invalid textureSourceName: ${textureSourceName}`);
            }
            this.$setTexture(data);
            this.dispatchEventWith(Egret_Egret.Event.COMPLETE);
        }

        this._doApplyScale9Grid(scale9Grid);
        this._doApplyUnscaledManualWidth();
        this._doApplyUnscaledManualHeight();
        Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);

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
            if (!Helpers_Collection.checkIsSameList(oldScale9Grid ?? [], scale9Grid ?? [])) {
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
                throw Helpers_Misc.newError(`Invalid scale9Grid.`);
            }
            this.scale9Grid = new Egret_Egret.Rectangle(newValue[0], newValue[1], newValue[2], newValue[3]);
        }
    }

    public getIsSmoothing(): boolean {
        return this.smoothing;
    }
    public setIsSmoothing(value: boolean): void {
        this.smoothing = value;
    }

    public getMask(): Egret_Egret.DisplayObject | Egret_Egret.Rectangle | null {
        return this.mask;
    }
    public setMask(mask: Egret_Egret.Rectangle | null): void {
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
