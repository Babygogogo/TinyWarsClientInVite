import {
    Geometries_Utils,
    Helpers_PointerInput,
    FloatText,
    Ui_Components_UiContainerBase,
    Ui_Components_UiLayoutBase,
    Ui_Types_UiOrientation,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiScrollerBase,
    type Ui_Types_UiScrollerOptions,
    Egret_Egret,
    Ui_Utils_UiTrackPad,
} from "../../internal.ts";

export abstract class UiScrollerBase extends Ui_Components_UiContainerBase.UiContainerBase implements Ui_Interfaces_IUiScrollerBase.IUiScrollerBase {
    private readonly _borderMask    = new Egret_Egret.Rectangle();
    private readonly _trackPad      = new Ui_Utils_UiTrackPad.UiTrackPad({});
    private _options                : Ui_Types_UiScrollerOptions.UiScrollerOptions = {};

    private _isScrollable           = true;
    private _isDragging             = 0;    // 0=无点击 1=点击无拖动 2=拖动
    private _dragStartTouchPoint?   = new Egret_Egret.Point();

    public constructor(options?: Ui_Types_UiScrollerOptions.UiScrollerOptions) {
        super();

        this._initBorderMask();
        this._registerPointerEvents();
        this.setIsTouchEnabled(true);
        // this.setUnscaledManualSize(100, 100, false);

        if (options) {
            this.setOptions(options);
        }

        {
            const agent = this.getEventAgent();
            agent.addAutoEnterFrameListener(this._onEnterFrame, this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Wheel, this._onPointerWheel, this);
        }
    }
    private _onEnterFrame(): void {
        const viewport = this._getViewport();
        if (viewport == null) {
            return;
        }

        const trackPad = this._getTrackPad();
        trackPad.update();

        const orientation = this.getOrientation();
        if (orientation === Ui_Types_UiOrientation.UiOrientation.Horizontal) {
            const x = trackPad.getX();
            if (viewport.getX() !== x) {
                viewport.setX(x);
                this._updateVisibilityForAllItems();
            }
        } else if (orientation === Ui_Types_UiOrientation.UiOrientation.Vertical) {
            const y = trackPad.getY();
            if (viewport.getY() !== y) {
                viewport.setY(y);
                this._updateVisibilityForAllItems();
            }
        } else {
            let isUpdated = false;
            {
                const xAxis = trackPad.getXAxis();
                const minX  = xAxis.getMin();
                const x     = minX === xAxis.getMax() ? minX : trackPad.getX();
                if (viewport.getX() !== x) {
                    viewport.setX(x);
                    isUpdated = true;
                }
            }
            {
                const yAxis = trackPad.getYAxis();
                const minY  = yAxis.getMin();
                const y     = minY === yAxis.getMax() ? minY : trackPad.getY();
                if (viewport.getY() !== y) {
                    viewport.setY(y);
                    isUpdated = true;
                }
            }
            if (isUpdated) {
                this._updateVisibilityForAllItems();
            }
        }
    }
    private _onPointerWheel(e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>): void {
        e.stopPropagation();

        if ((this._isDragging) || (!this.getIsScrollable())) {
            return;
        }

        const value = ((e.data as Helpers_PointerInput.PointerUnifiedEventData).wheelValue ?? 0) / 2;
        if (value == 0) {
            return;
        }

        const orientation = this.getOrientation();
        if (orientation === Ui_Types_UiOrientation.UiOrientation.Horizontal) {
            this.setScrollX(this.getScrollX() + value);
        } else if (orientation === Ui_Types_UiOrientation.UiOrientation.Vertical) {
            this.setScrollY(this.getScrollY() + value);
        } else {
            const trackPad  = this._getTrackPad();
            const yAxis     = trackPad.getYAxis();
            if (yAxis.getMin() !== yAxis.getMax()) {
                this.setScrollY(this.getScrollY() + value);
            } else {
                const xAxis = trackPad.getXAxis();
                if (xAxis.getMin() !== xAxis.getMax()) {
                    this.setScrollX(this.getScrollX() + value);
                }
            }
        }
    }

    public override applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean {
        if (!super.applySizeFromSizerInfo(width, height)) {
            return false;
        }

        const viewport = this._getViewport();
        if (viewport instanceof Ui_Components_UiLayoutBase.UiLayoutBase) {
            viewport.setUnscaledRequestedSize(this.getUnscaledManualWidth(), this.getUnscaledManualHeight());
        }

        this._resizeAllComponents();

        return true;
    }

    public setUnscaledManualWidth(width: number | undefined, needArrange = true): boolean {
        if (!super.setUnscaledManualWidth(width)) {
            return false;
        }

        const viewport = this._getViewport();
        if (viewport instanceof Ui_Components_UiLayoutBase.UiLayoutBase) {
            viewport.setUnscaledRequestedWidth(width, needArrange);
        }

        if (needArrange) {
            this._resizeAllComponents();
        }

        return true;
    }
    public setUnscaledManualHeight(height: number | undefined, needArrange = true): boolean {
        if (!super.setUnscaledManualHeight(height)) {
            return false;
        }

        const viewport = this._getViewport();
        if (viewport instanceof Ui_Components_UiLayoutBase.UiLayoutBase) {
            viewport.setUnscaledRequestedHeight(height, needArrange);
        }

        if (needArrange) {
            this._resizeAllComponents();
        }

        return true;
    }

    public getOptions(): Ui_Types_UiScrollerOptions.UiScrollerOptions {
        return this._options;
    }
    public setOptions(options: Ui_Types_UiScrollerOptions.UiScrollerOptions): void { // 原名init
        this._options = options;

        this._resizeAllComponents();

        this._resetTrackPad();
    }

    private _getIsGlobalScroll(): boolean {
        return this.getOptions().globalScroll ?? false;
    }

    private _getBorderMask(): Egret_Egret.Rectangle {
        return this._borderMask;
    }
    private _getTrackPad(): Ui_Utils_UiTrackPad.UiTrackPad {
        return this._trackPad;
    }

    protected abstract _getViewport(): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    public abstract getItem(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    public abstract getAllItems(): Ui_Interfaces_IUiComponent.IUiComponent[] | undefined;

    public getOrientation(): Ui_Types_UiOrientation.UiOrientation | undefined {
        return this.getOptions().orientation;
    }
    public setOrientation(orientation: Ui_Types_UiOrientation.UiOrientation | undefined): void {
        if (this.getOrientation() != orientation) {
            this.getOptions().orientation = orientation;

            this._resizeTrackPad();
            this._updateIsScrollable();
        }
    }

    private _initBorderMask(): void {
        const mask  = this._getBorderMask();
        this.mask   = mask;
    }
    private _registerPointerEvents(): void {    // 原名makeScrollable
        const trackPad      = this._getTrackPad();
        const eventAgent    = this.getEventAgent();

        eventAgent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Press, (e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>) => {
            e.stopPropagation();

            if (!this.getIsScrollable()) {
                return;
            }

            const data = e.data as Helpers_PointerInput.PointerUnifiedEventData;
            if (window.CLIENT_VERSION === "DEVELOP") {
                FloatText.show(`pointer id: ${data.pointerId}`);
            }

            const viewport = this._getViewport();
            if (viewport == null) {
                return;
            }

            this._isDragging            = 1;
            this._dragStartTouchPoint   = this.globalToLocal(data.stageX, data.stageY, this._dragStartTouchPoint);

            trackPad.pointerDown(this._dragStartTouchPoint);
        }, undefined);

        eventAgent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseIn, (e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>) => {
            e.stopPropagation();

            this._isDragging = 0;
            trackPad.pointerUp();
        }, undefined);

        eventAgent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseOut, (e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>) => {
            e.stopPropagation();

            this._isDragging = 0;
            trackPad.pointerUp();
        }, undefined);

        eventAgent.addPointerEventListener(Helpers_PointerInput.PointerEventType.PressMove, (e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>) => {
            e.stopPropagation();

            if (!this._isDragging) {
                return;
            }

            const data              = e.data as Helpers_PointerInput.PointerUnifiedEventData;
            const touchPoint        = this.globalToLocal(data.stageX, data.stageY);
            const dragStartPoint    = this._dragStartTouchPoint;
            if (dragStartPoint) {
                const squaredDistance = Geometries_Utils.getSquaredPointDistance2(dragStartPoint, touchPoint);
                if (squaredDistance != null) {
                    const trashHold = this.getOptions().dragTrashHold ?? 10;
                    if (squaredDistance > trashHold * trashHold) {
                        this._isDragging = 2;
                    }
                }

                if (this._isDragging !== 2) {
                    return;
                }
            }

            trackPad.pointerMove(touchPoint);
        }, undefined);
    }
    private _resetTrackPad(): void {
        const trackPad = this._getTrackPad();
        trackPad.getXAxis().setValueToMin();
        trackPad.getYAxis().setValueToMin();
        trackPad.setIsEasingDisabled(this.getOptions().disableEasing ?? false);
    }

    public getIsScrollable(): boolean {
        return this._isScrollable;
    }
    public setIsScrollable(value: boolean): void {
        this._isScrollable = value;
    }
    private _updateIsScrollable(): void {
        const viewport = this._getViewport();
        if (viewport == null) {
            this.setIsScrollable(false);
            return;
        }

        // const orientation = this.getOrientation();
        // if (orientation === UiOrientation.Horizontal) {
        //     const width = this.getUnscaledManualWidth();
        //     this.setIsScrollable((width != null) && (viewport.getScaledWidth() > width));
        // } else if (orientation === UiOrientation.Vertical) {
        //     const height = this.getUnscaledManualHeight();
        //     this.setIsScrollable((height != null) && (viewport.getScaledHeight() > height));
        // } else {
        //     const width     = this.getUnscaledManualWidth();
        //     const height    = this.getUnscaledManualHeight();
        //     this.setIsScrollable(
        //         ((width != null) && (viewport.getScaledWidth() > width))    ||
        //         ((height != null) && (viewport.getScaledHeight() > height))
        //     );
        // }

        const trackPad  = this._getTrackPad();
        const xAxis     = trackPad.getXAxis();
        if (xAxis.getMin() !== xAxis.getMax()) {
            this.setIsScrollable(true);
        } else {
            const yAxis = trackPad.getYAxis();
            this.setIsScrollable(yAxis.getMin() !== yAxis.getMax());
        }
    }

    protected _resizeAllComponents(): void {
        this._resizeBorderMask();
        this._resizeTrackPad();
        this._updateIsScrollable();

        // Since the scrolling adjustment can happen due to the resize,
        // we shouldn't update the visible items immediately.
        this._updateVisibilityForAllItems();
    }
    public updateOnItemsChanged(): void {
        this._resizeBorderMask();
        this._resizeTrackPad();
        this._updateIsScrollable();

        this._updateVisibilityForAllItems();
    }
    private _resizeBorderMask(): void {
        const mask  = this._getBorderMask();
        // mask.width  = this.width;
        // mask.height = this.height;
        mask.height = this.getUnscaledHeight() + 1;  // HACK: egret的mask会截掉上方和右方各1像素，在此做出补偿
        mask.y      = -1;
        mask.width  = this.getUnscaledWidth() + 1;
        this.mask   = mask;
    }

    private _resizeTrackPad(): void {
        const viewport = this._getViewport();
        if (viewport == null) {
            return;
        }

        const trackPad  = this._getTrackPad();
        const xAxis     = trackPad.getXAxis();
        const yAxis     = trackPad.getYAxis();
        // TODO: align
        xAxis.setMin(0);
        yAxis.setMin(0);

        const orientation = this.getOrientation();
        if (orientation === Ui_Types_UiOrientation.UiOrientation.Horizontal) {
            const viewportWidth = viewport.getScaledWidth();
            xAxis.setMax(Math.min(0, (this.getUnscaledManualWidth() ?? viewportWidth) - viewportWidth));
            this.setScrollX(this.getScrollX());
            this.setScrollY(0);
        } else if (orientation === Ui_Types_UiOrientation.UiOrientation.Vertical) {
            const viewportHeight = viewport.getScaledHeight();
            yAxis.setMax(Math.min(0, (this.getUnscaledManualHeight() ?? viewportHeight) - viewportHeight));
            this.setScrollX(0);
            this.setScrollY(this.getScrollY());
        } else {
            const viewportWidth     = viewport.getScaledWidth();
            const viewportHeight    = viewport.getScaledHeight();
            xAxis.setMax(Math.min(0, (this.getUnscaledManualWidth() ?? viewportWidth) - viewportWidth));
            yAxis.setMax(Math.min(0, (this.getUnscaledManualHeight() ?? viewportHeight) - viewportHeight));
            this.setScrollX(this.getScrollX());
            this.setScrollY(this.getScrollY());
        }
    }

    public scrollBottom(): void {
        // if (!this.getIsScrollable()) {
        //     this.scrollTop();
        // } else {
        //     this.scrollToItem((this.getAllItems()?.length ?? 0) - 1);
        // }
        const length = this.getAllItems()?.length ?? 0;
        if (length === 0) {
            this.scrollTop();
        } else {
            this.scrollToItem(length - 1);
        }
    }
    public scrollTop(): void {
        const trackPad = this._getTrackPad();
        trackPad.getXAxis().setValueToMin();
        trackPad.getYAxis().setValueToMin();
    }
    public scrollToItem(index: number): void {
        // if (!this.getIsScrollable()) {
        //     return;
        // }

        const target = this.getItem(index);
        if (!target) {
            if (index === 0) {
                this.scrollTop();
            }
            return;
        }

        const aabb          = target.getAabbToParent();
        const orientation   = this.getOrientation();
        if (orientation === Ui_Types_UiOrientation.UiOrientation.Horizontal) {
            this.setScrollX(-(target.getX() + aabb.x));
        } else if (orientation === Ui_Types_UiOrientation.UiOrientation.Vertical) {
            this.setScrollY(-(target.getY() + aabb.y));
        } else {
            this.setScrollX(-(target.getX() + aabb.x));
            this.setScrollY(-(target.getY() + aabb.y));
        }
    }
    public getScrollX(): number {
        return this._getTrackPad().getX();
    }
    public setScrollX(value: number): void {
        this._getTrackPad().setX(value);
    }
    public getScrollY(): number {
        return this._getTrackPad().getY();
    }
    public setScrollY(value: number): void {
        this._getTrackPad().setY(value);
    }

    protected _checkIsItemVisible(item: Ui_Interfaces_IUiComponent.IUiComponent): boolean {
        const viewport = this._getViewport();
        if (viewport == null) {
            return false;
        }

        // TODO 处理元素旋转和锚点，大概率可以用aabb
        const aabb          = item.getAabbToParent();
        const posX          = aabb.x + item.getX() + viewport.getX();
        const posY          = aabb.y + item.getY() + viewport.getY();
        const selfWidth     = this.getUnscaledManualWidth();
        const selfHeight    = this.getUnscaledManualHeight();
        return (posY + aabb.height >= 0)
            && ((selfHeight == null) || (posY <= selfHeight))
            && (posX + aabb.width >= 0)
            && ((selfWidth == null) || (posX <= selfWidth));
    }
    private _updateVisibilityForAllItems(): void {
        for (const item of this.getAllItems() ?? []) {
            item.setIsVisible(this._checkIsItemVisible(item));
        }
    }
}
