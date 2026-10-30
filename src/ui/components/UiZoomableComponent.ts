import {
    Notifications_Dispatcher,
    Tween_Executor,
    Helpers_Misc,
    Geometries_Utils,
    Helpers_PointerInput,
    Notifications_TypeId,
    Ui_Components_UiContainer,
    Ui_Components_UiContainerBase,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiZoomableComponent,
    type Egret_Egret,
} from "../../internal.ts";

const MAX_CONTENT_SCALE = 6;

export class UiZoomableComponent extends Ui_Components_UiContainerBase.UiContainerBase implements Ui_Interfaces_IUiZoomableComponent.IUiZoomableComponent {
    private readonly _contentsContainer = new Ui_Components_UiContainer.UiContainer();
    private _spacingForTop              = 0;
    private _spacingForBottom           = 0;
    private _spacingForLeft             = 0;
    private _spacingForRight            = 0;
    private _currGlobalTouchPoints      = new Map<number, AuxiliaryTypes_AuxiliaryTypes.Point>();
    private _prevGlobalTouchPoints      = new Map<number, AuxiliaryTypes_AuxiliaryTypes.Point>();

    public constructor() {
        super();

        const contents = this._getContentsContainer();
        // contents.setIsTouchChildrenEnabled(false);
        // contents.hitArea                = {
        //     contains    : (x, y): boolean => (x >= 0) && (x <= this.getContentWidth()) && (y >= 0) && (y <= this.getContentHeight()),
        // };
        this.addChild(contents as unknown as Egret_Egret.DisplayObject);
    }

    public override applySizeFromSizerInfo(width: number | undefined, height: number | undefined): boolean {
        const isUpdated = super.applySizeFromSizerInfo(width, height);
        if (isUpdated) {
            this._reviseContentScaleAndPosition();
        }
        return isUpdated;
    }

    public override setUnscaledManualWidth(width: number | undefined): boolean {
        const isUpdated = super.setUnscaledManualWidth(width);
        if (isUpdated) {
            this._reviseContentScaleAndPosition();
        }
        return isUpdated;
    }
    public override setUnscaledManualHeight(height: number | undefined): boolean {
        const isUpdated = super.setUnscaledManualHeight(height);
        if (isUpdated) {
            this._reviseContentScaleAndPosition();
        }
        return isUpdated;
    }

    public setMouseWheelListenerEnabled(enabled: boolean): void {
        const agent = this._getContentsContainer().getEventAgent();
        if (enabled) {
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Wheel,    this._onPointerWheel,   this);
        } else {
            agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.Wheel, this._onPointerWheel,   this);
        }
    }

    public getTouchListenerEnabled(): boolean {
        return this._getContentsContainer().getIsTouchEnabled();
    }
    public setTouchListenerEnabled(enabled: boolean, mouseStyle = Helpers_PointerInput.MouseStyleType.Pointer): void {
        if (this.getTouchListenerEnabled() === enabled) {
            return;
        }

        const contents = this._getContentsContainer();
        contents.setIsTouchEnabled(enabled);
        contents.setMouseStyle(mouseStyle);

        const agent = contents.getEventAgent();
        if (enabled) {
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Press,        this._onTouchBegin,             this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseIn,    this._onTouchEnd,               this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseOut,   this._onTouchReleaseOutside,    this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.PressMove,    this._onTouchMove,              this);
            // this.on(egret.TouchEvent.TOUCH_CANCEL,            this._onTouchCancel,            this);

        } else {
            agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.Press,         this._onTouchBegin,             this);
            agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseIn,     this._onTouchEnd,               this);
            agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseOut,    this._onTouchReleaseOutside,    this);
            agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.PressMove,     this._onTouchMove,              this);
            // this.off(egret.TouchEvent.TOUCH_CANCEL,             this._onTouchCancel,            this);

            this._currGlobalTouchPoints.clear();
            this._prevGlobalTouchPoints.clear();
        }
    }

    public addContent(content: Ui_Interfaces_IUiComponent.IUiComponent): void {
        this._getContentsContainer().addUiChild(content);
        // this.__resetBoundsArea();
    }
    public removeContent<T extends Ui_Interfaces_IUiComponent.IUiComponent>(content: T): T | undefined {
        return this._getContentsContainer().removeUiChild(content) as unknown as (T | undefined);
    }
    public removeAllContents(): Ui_Interfaces_IUiComponent.IUiComponent[] {
        return this._getContentsContainer().removeUiChildren();
    }
    private _getContentsContainer(): Ui_Interfaces_IUiContainer.IUiContainer {
        return this._contentsContainer;
    }
    public getContentsContainerLocalToGlobal(point: AuxiliaryTypes_AuxiliaryTypes.Point): Egret_Egret.Point {
        return this._getContentsContainer().localToGlobal(point.x, point.y);
    }
    public getContentsContainerGlobalToLocal(point: AuxiliaryTypes_AuxiliaryTypes.Point): Egret_Egret.Point {
        return this._getContentsContainer().globalToLocal(point.x, point.y);
    }

    // public setContentWidth(width: number): void {
    //     this._contentWidth = width;

    //     this._reviseContentScaleAndPosition();
    // }
    public getContentWidth(): number {
        return this._getContentsContainer().getUnscaledManualWidth() ?? 0;
    }
    // public setContentHeight(height: number): void {
    //     this._contentHeight = height;

    //     this._reviseContentScaleAndPosition();
    // }
    public getContentHeight(): number {
        return this._getContentsContainer().getUnscaledManualHeight() ?? 0;
    }
    public setContentSize(width: number, height: number): void {
        const container = this._getContentsContainer();
        container.setUnscaledManualWidth(width);
        container.setUnscaledManualHeight(height);
        this._reviseContentScaleAndPosition();
    }

    public setBoundarySpacings(left = 0, right = 0, top = 0, bottom = 0): void {
        this._spacingForTop    = top;
        this._spacingForBottom = bottom;
        this._spacingForLeft   = left;
        this._spacingForRight  = right;

        this._reviseContentScaleAndPosition();
    }

    public setContentX(x: number, needRevise: boolean): void {
        const contents  = this._getContentsContainer();
        const newX      = needRevise ? this.getRevisedContentX(x) : x;
        if (newX !== contents.getX()) {
            contents.setX(newX);
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.ZoomableContentsMoved);
        }
    }
    public set customContentX(x: number) {
        this.setContentX(x, false);
    }
    public get customContentX(): number {
        return this.getContentX();
    }
    public getContentX(): number {
        return this._getContentsContainer().getX();
    }
    public setContentY(y: number, needRevise: boolean): void {
        const contents  = this._getContentsContainer();
        const newY      = needRevise ? this.getRevisedContentY(y) : y;
        if (newY !== contents.getY()) {
            contents.setY(newY);
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.ZoomableContentsMoved);
        }
    }
    public set customContentY(y: number) {
        this.setContentY(y, false);
    }
    public get customContentY(): number {
        return this.getContentY();
    }
    public getContentY(): number {
        return this._getContentsContainer().getY();
    }
    public tweenContentToPoint(contentX: number, contentY: number, needRevise: boolean): void {
        if (needRevise) {
            contentX = this.getRevisedContentX(contentX);
            contentY = this.getRevisedContentY(contentY);
        }

        Tween_Executor.Executor.removeTweens(this);
        Tween_Executor.Executor.get(this as UiZoomableComponent)
            .to({ customContentX: contentX, customContentY: contentY }, 200);
    }

    public setContentScale(scale: number, needRevise: boolean): void {
        const container = this._getContentsContainer();
        container.setScaleX(scale);
        container.setScaleY(scale);

        if (needRevise) {
            if ((this._getBoundaryHeight()) && (this._getBoundaryWidth())) {
                this._reviseContentScaleAndPosition();
            }
        }
    }
    public getContentScale(): number {
        return this._getContentsContainer().getScaleX();
    }

    public setZoomByScroll(stageX: number, stageY: number, scrollValue: number): void {
        const point = ((stageX != null) && (stageY != null))
            ? this._getContentsContainer().globalToLocal(stageX, stageY)
            : null;
        if ((point != null) && (this._checkIsInsideContents(point))) {
            this._setZoom(point, this._getScaleModifierByScrollValue(scrollValue));
        }
    }

    public setZoomByTouches(currGlobalPoints: AuxiliaryTypes_AuxiliaryTypes.TouchPoints, prevGlobalPoints: AuxiliaryTypes_AuxiliaryTypes.TouchPoints): void {
        const currGlobalCenterPoint = this._getCenterPoint(currGlobalPoints);
        const currLocalCenterPoint  = this._getContentsContainer().globalToLocal(currGlobalCenterPoint.x, currGlobalCenterPoint.y);
        if (this._checkIsInsideContents(currLocalCenterPoint)) {
            this._setZoom(currLocalCenterPoint, this._getScaleModifierByTouches(currGlobalPoints, prevGlobalPoints));

            const prevGlobalCenterPoint = this._getCenterPoint(prevGlobalPoints);
            this.setContentX(this.getContentX() + currGlobalCenterPoint.x - prevGlobalCenterPoint.x, true);
            this.setContentY(this.getContentY() + currGlobalCenterPoint.y - prevGlobalCenterPoint.y, true);
        }
    }

    public setDragByTouches(currGlobalPoint: AuxiliaryTypes_AuxiliaryTypes.Point, prevGlobalPoint: AuxiliaryTypes_AuxiliaryTypes.Point): void {
        this.setContentX(this.getContentX() + currGlobalPoint.x - prevGlobalPoint.x, true);
        this.setContentY(this.getContentY() + currGlobalPoint.y - prevGlobalPoint.y, true);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onPointerWheel(e: Egret_Egret.Event): void {
        e.stopPropagation();

        const data = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        this.setZoomByScroll(data.stageX, data.stageY, data.wheelValue ?? 0);
    }

    private _onTouchBegin(e: Egret_Egret.Event): void {
        const touchesCount = this._currGlobalTouchPoints.size;
        // if (touchesCount <= 0) {
        //     this.on(UiTypes.RawEventName.PointerGlobalMove,   this._onTouchMove, this);
        // }

        const data      = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const touchId   = data.pointerId;
        if (touchesCount <= 1) {
            this._currGlobalTouchPoints.set(touchId, { x: data.stageX, y: data.stageY });
            this._prevGlobalTouchPoints.set(touchId, { x: data.stageX, y: data.stageY });
        }
    }
    private _onTouchEnd(e: Egret_Egret.Event): void {
        this._removeTouch((e.data as Helpers_PointerInput.PointerUnifiedEventData).pointerId);
    }
    // private _onTouchCancel(e: UiEventTypes.UiTouchEvent): void {
    //     this._removeTouch(e.touchPointID);
    // }
    private _onTouchReleaseOutside(e: Egret_Egret.Event): void {
        this._removeTouch((e.data as Helpers_PointerInput.PointerUnifiedEventData).pointerId);
    }
    private _onTouchMove(e: Egret_Egret.Event): void {
        const data                  = e.data as Helpers_PointerInput.PointerUnifiedEventData;
        const touchId               = data.pointerId;
        const currGlobalTouchPoints = this._currGlobalTouchPoints;
        const prevGlobalTouchPoints = this._prevGlobalTouchPoints;
        currGlobalTouchPoints.set(touchId, { x: data.stageX, y: data.stageY });

        if ((currGlobalTouchPoints.size > 1) && (prevGlobalTouchPoints.size > 1)) {
            this.setZoomByTouches(currGlobalTouchPoints, prevGlobalTouchPoints);
        } else {
            if (prevGlobalTouchPoints.has(touchId)) {
                this.setDragByTouches(Helpers_Misc.getExisted(currGlobalTouchPoints.get(touchId)), Helpers_Misc.getExisted(prevGlobalTouchPoints.get(touchId)));
            }
        }

        this._prevGlobalTouchPoints.set(touchId, { x: data.stageX, y: data.stageY });
    }
    private _removeTouch(touchPointId: number): void {
        this._currGlobalTouchPoints.delete(touchPointId);
        this._prevGlobalTouchPoints.delete(touchPointId);

        // if (!this._currGlobalTouchPoints.size) {
        //     this.off(UiTypes.RawEventName.PointerGlobalMove,  this._onTouchMove, this);
        // }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _getScaleModifierByScrollValue(value: number): number {
        return Math.max(0.01, 1 + value / 1000);
    }
    private _getScaleModifierByTouches(currPoints: AuxiliaryTypes_AuxiliaryTypes.TouchPoints, prevPoints: AuxiliaryTypes_AuxiliaryTypes.TouchPoints): number {
        const contents  = this._getContentsContainer();
        const newPoints : AuxiliaryTypes_AuxiliaryTypes.Point[] = [];
        for (const [, point] of currPoints) {
            newPoints.push(contents.globalToLocal(point.x, point.y));
        }

        const oldPoints: AuxiliaryTypes_AuxiliaryTypes.Point[] = [];
        for (const [, point] of prevPoints) {
            oldPoints.push(contents.globalToLocal(point.x, point.y));
        }

        return Geometries_Utils.getPointDistance(newPoints[0].x, newPoints[0].y, newPoints[1].x, newPoints[1].y)
            /  Geometries_Utils.getPointDistance(oldPoints[0].x, oldPoints[0].y, oldPoints[1].x, oldPoints[1].y);
    }

    private _getCenterPoint(touches: AuxiliaryTypes_AuxiliaryTypes.TouchPoints): AuxiliaryTypes_AuxiliaryTypes.Point {
        const points: AuxiliaryTypes_AuxiliaryTypes.Point[] = [];
        for (const [, point] of touches) {
            points.push({ x: point.x, y: point.y });
            if (points.length >= 2) {
                break;
            }
        }

        if (points.length === 0) {
            return {x: 0, y: 0};
        } else if (points.length === 1) {
            return points[0];
        } else {
            return {
                x: (points[0].x + points[1].x) / 2,
                y: (points[0].y + points[1].y) / 2,
            };
        }
    }

    private _checkIsInsideContents(point: AuxiliaryTypes_AuxiliaryTypes.Point): boolean {
        return (point.x >= 0)
            && (point.y >= 0)
            && (point.x <= this.getContentWidth())
            && (point.y <= this.getContentHeight());
    }

    private _setZoom(focusPoint: AuxiliaryTypes_AuxiliaryTypes.Point, scaleModifier: number): void {
        const currentScale = this.getContentScale();
        let newScale = currentScale * scaleModifier;
        newScale = Math.max(newScale, this._getMinContentScale());
        newScale = Math.min(newScale, this._getMaxContentScale());

        if (newScale !== currentScale) {
            const contents          = this._getContentsContainer();
            const oldGlobalPoint    = contents.localToGlobal(focusPoint.x, focusPoint.y);
            this.setContentScale(newScale, false);

            const newGlobalPoint    = contents.localToGlobal(focusPoint.x, focusPoint.y);
            this.setContentX(this.getContentX() - newGlobalPoint.x + oldGlobalPoint.x, false);
            this.setContentY(this.getContentY() - newGlobalPoint.y + oldGlobalPoint.y, false);

            this._reviseContentScaleAndPosition();
        }
    }

    private _getMaxContentScale(): number {
        return Math.max(MAX_CONTENT_SCALE, this._getMinContentScale());
    }
    private _getMinContentScale(): number {
        const boundaryWidth  = this._getBoundaryWidth();
        const boundaryHeight = this._getBoundaryHeight();
        const contentWidth   = this.getContentWidth();
        const contentHeight  = this.getContentHeight();
        if ((!boundaryWidth) || (!boundaryHeight) || (!contentWidth) || (!contentHeight)) {
            return 1;
        } else {
            return Math.min(boundaryWidth / contentWidth, boundaryHeight / contentHeight);
        }
    }

    private _getBoundaryWidth(): number {
        return this.getUnscaledWidth() - this._spacingForLeft - this._spacingForRight;
    }
    private _getBoundaryHeight(): number {
        return this.getUnscaledHeight() - this._spacingForTop - this._spacingForBottom;
    }

    private _getMinContentX(): number {
        const boundaryWidth = this._getBoundaryWidth();
        const contentWidth  = this.getContentWidth() * this.getContentScale();
        if (contentWidth <= boundaryWidth) {
            return this._spacingForLeft + (boundaryWidth - contentWidth) / 2;
        } else {
            return this._spacingForLeft - (contentWidth - boundaryWidth);
        }
    }
    private _getMaxContentX(): number {
        const boundaryWidth = this._getBoundaryWidth();
        const contentWidth  = this.getContentWidth() * this.getContentScale();
        if (contentWidth <= boundaryWidth) {
            return this._spacingForLeft + (boundaryWidth - contentWidth) / 2;
        } else {
            return this._spacingForLeft;
        }
    }
    private _getMinContentY(): number {
        const boundaryHeight = this._getBoundaryHeight();
        const contentHeight  = this.getContentHeight() * this.getContentScale();
        if (contentHeight <= boundaryHeight) {
            return this._spacingForTop + (boundaryHeight - contentHeight) / 2;
        } else {
            return this._spacingForTop - (contentHeight - boundaryHeight);
        }
    }
    private _getMaxContentY(): number {
        const boundaryHeight = this._getBoundaryHeight();
        const contentHeight  = this.getContentHeight() * this.getContentScale();
        if (contentHeight <= boundaryHeight) {
            return this._spacingForTop + (boundaryHeight - contentHeight) / 2;
        } else {
            return this._spacingForTop;
        }
    }

    public getRevisedContentX(contentX: number): number {
        return Math.min(
            Math.max(contentX, this._getMinContentX()),
            this._getMaxContentX()
        );
    }
    public getRevisedContentY(contentY: number): number {
        return Math.min(
            Math.max(contentY, this._getMinContentY()),
            this._getMaxContentY()
        );
    }
    private _reviseContentX(): void {
        this.setContentX(this.getRevisedContentX(this.getContentX()), false);
    }
    private _reviseContentY(): void {
        this.setContentY(this.getRevisedContentY(this.getContentY()), false);
    }
    private _reviseContentScaleAndPosition(): void {
        let scale = this.getContentScale();
        scale = Math.max(scale, this._getMinContentScale());
        scale = Math.min(scale, this._getMaxContentScale());
        this.setContentScale(scale, false);

        this._reviseContentX();
        this._reviseContentY();
    }
    private _checkAndReviseContentScaleAndPosition(needRevise: boolean): boolean {
        if (needRevise) {
            this._reviseContentScaleAndPosition();
        }
        return needRevise;
    }
}
