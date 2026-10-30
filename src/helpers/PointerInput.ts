import {
    Egret_Egret,
    type AuxiliaryTypes_AuxiliaryTypes,
    Notifications_TypeId,
    Helpers_Compatibility,
    Notifications_Dispatcher,
    Helpers_Misc,
    Geometries_Utils,
    Stages_StageManager,
    Ui_Utils_UiHelpers,
} from "../internal.ts";

/**
 * 已知的egret事件相关信息：
 * - 多次注册同事件类型、相同回调的监听器，只有第一次会成功，后续的会被自动忽略
 * - 注册事件监听器与DisplayObject垃圾回收的关系：
 *   - egret.Event.ENTER_FRAME和egret.Event.RENDER会阻止垃圾回收，原因未知，有可能是因为调用太频繁
 *   - 否则，一般情况下都可以回收（对于频繁调用的事件类型，需要实测是否可以正常回收，或者确保把监听器移除掉以防止回收失败）
 *
 * scale不影响getBounds()结果
 * 对于非容器
 * - 设置宽高会影响getBounds()结果
 * - scale，skew，rotation都不影响结果
 * 对于容器
 * - getBounds()只由子元素决定，所以设置容器宽高不影响结果
 * - 子元素的位置和大小都会影响结果，结果是包含所有子元素的最小矩形
 * - 若calculateAnchor为真或留空，则会计入锚点，也就是说如果有元素在负数坐标，返回的矩形的坐标也是负数，以此类推
 * 对于touchEnabled / touchChildren
 * - touchEnabled 默认 false，touchChildren 默认 true
 * - 对于con和其子元素sub，仅当 con.touchChildren == sub.touchEnabled == true 时，sub才能接收到触摸事件
 * 进行DisplayObjectContainer.$hitTest时
 * - 如果con.touchChildren == false
 *   - 如果存在任意命中的sub，不论其touchEnabled是什么，直接返回con
 *   - 否则（一个sub都未命中），返回DisplayObject.$hitTest的值
 * - 否则
 *   - 如果存在命中的sub
 *     - 如果存在touchEnabled的sub，返回sub
 *     - 否则，返回con
 *   - 否则（一个sub都未命中），返回DisplayObject.$hitTest的值
 */

 
export const enum MouseStyleType {
    Auto,
    Default,
    Pointer,
    Text,
}

type MouseExpectedStyle = {
    displayObject   : WeakRef<Egret_Egret.DisplayObject>;
    expectedStyle   : MouseStyleType;
};
type PointerPressStatus = {
    originX     : number;
    originY     : number;
    hasMoved    : boolean;
};

const LIMIT_MOVE_EVENT_FREQUENCY    = false;

// const MouseWheelMultiplier      = (egret.Capabilities.os === `Unknown` || navigator?.userAgent?.toLocaleLowerCase()?.includes(`firefox`)) ? 40 : 1;
const MouseExpectedStyleArray   : MouseExpectedStyle[] = [];
const PointerHoverObjectDict    = new Map<number, WeakRef<Egret_Egret.DisplayObject>>();
const PointerPressObjectDict    = new Map<number, WeakRef<Egret_Egret.DisplayObject>>();
const PointerPressStatusDict    = new Map<number, PointerPressStatus>();
const PointerMoveTimeDict       = new Map<number, number>();

let _stage                      : Egret_Egret.Stage;
let _webPlayer                  : Helpers_Compatibility.WebPlayer;
let _webTouchHandler            : Helpers_Compatibility.WebTouchHandler;
let _canvas                     : HTMLCanvasElement;

let _isEnabled                  = false;
// let _currentTarget              : egret.DisplayObject | null = null;
let _mouseX                     : number | undefined;
let _mouseY                     : number | undefined;
let _frames                     = 0;
let _tempPointerMoveEventData   : PointerUnifiedEventData;

export type PointerUnifiedEventData = {
    pointerId       : number;   // wheel事件为-1
    stageX          : number;
    stageY          : number;
    wheelValue      : number | undefined;
    lastHover       : Egret_Egret.DisplayObject | undefined;
    currentHover    : Egret_Egret.DisplayObject | undefined;
    lastPress       : Egret_Egret.DisplayObject | undefined;
    currentPress    : Egret_Egret.DisplayObject | undefined;
    rawEvent        : PointerEvent | WheelEvent;
    dispatcher      : Egret_Egret.DisplayObject | undefined;
};
 
export const enum PointerEventType {
    Press       = "PointerPress",
    ReleaseIn   = "PointerReleaseIn",
    ReleaseOut  = "PointerReleaseOut",
    PressMove   = "PointerPressMove",
    Tap         = "PointerTap",         // 按下后原地松开

    HoverIn     = "PointerHoverIn",
    HoverOut    = "PointerHoverOut",

    Wheel       = "PointerWheel",
}

export function enable(): void {
    {
        if (_isEnabled) {
            return;
        }
        _isEnabled = true;
    }

    _stage              = Stages_StageManager.getStage();
    _webPlayer          = Helpers_Misc.getExisted(Helpers_Compatibility.getWebPlayer());
    _webTouchHandler    = _webPlayer.webTouchHandler;
    _canvas             = _webPlayer.canvas;
    _canvas.addEventListener("wheel", e => {
        // Notify.Dispatcher.dispatch(Notify.NotifyType.MouseWheel, -(e.deltaX || e.deltaY) * MouseWheelMultiplier);
        const value = e.deltaX + e.deltaY;
        if (value === 0) {
            return;
        }

        const revisedValue = value > 0 ? -100 : 100;
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MouseWheel, revisedValue);

        const point         = getStagePoint(e);
        const targetObject  = getPointerTargetObject(point);
        if (targetObject) {
            targetObject.dispatchEventWith(
                PointerEventType.Wheel,
                true,
                {
                    pointerId    : -1,
                    stageX       : point.x,
                    stageY       : point.y,
                    wheelValue   : revisedValue,
                    lastHover    : targetObject,
                    currentHover : targetObject,
                    lastPress    : undefined,
                    currentPress : undefined,
                    rawEvent     : e,
                    dispatcher   : targetObject,
                } as PointerUnifiedEventData,
            );
        }
    }, false);

    // pointercancel    done
    // pointerdown      done
    // pointermove
    // pointerup

    _canvas.addEventListener("pointercancel", e => {
        // console.log("pointercancel", e, e.button, e.buttons);
        if (e.button === 2) {
            return;
        }

        const point = getStagePoint(e);
        checkAndUpdateMousePos(point);

        const pointerId         = e.pointerId;
        const lastPressObject   = getPointerPressObject(pointerId);
        setPointerPressObject(pointerId, undefined);
        setPointerPressStatus(pointerId, undefined);

        if (lastPressObject) {
            const hoverObject = getPointerHoverObject(pointerId);
            lastPressObject.dispatchEventWith(
                PointerEventType.ReleaseOut,
                true,
                {
                    pointerId    : pointerId,
                    stageX       : point.x,
                    stageY       : point.y,
                    wheelValue   : undefined,
                    lastHover    : hoverObject,
                    currentHover : hoverObject,
                    lastPress    : lastPressObject,
                    currentPress : undefined,
                    rawEvent     : e,
                    dispatcher   : lastPressObject,
                } as PointerUnifiedEventData,
            );
        }
    });

    _canvas.addEventListener("pointerdown", e => {
        // console.log("pointerdown", e, e.button, e.buttons);
        if (e.button === 2) {
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MouseRightButtonClicked, e);
            return;
        }

        const point = getStagePoint(e);
        checkAndUpdateMousePos(point);

        const pointerId         = e.pointerId;
        const lastPressObject   = getPointerPressObject(pointerId);
        const targetObject      = getPointerTargetObject(point);
        const stageX            = point.x;
        const stageY            = point.y;
        // console.log(`pointdown ${stageX}, ${stageY}`);
        setPointerPressObject(pointerId, targetObject);
        setPointerPressStatus(pointerId, {
            originX  : stageX,
            originY  : stageY,
            hasMoved : false,
        });

        if ((lastPressObject != null) || (targetObject != null)) {
            const hoverObject = getPointerHoverObject(pointerId);
            lastPressObject?.dispatchEventWith(
                PointerEventType.ReleaseOut,
                true,
                {
                    pointerId    : pointerId,
                    stageX       : stageX,
                    stageY       : stageY,
                    wheelValue   : undefined,
                    lastHover    : hoverObject,
                    currentHover : hoverObject,
                    lastPress    : lastPressObject,
                    currentPress : targetObject,
                    rawEvent     : e,
                    dispatcher   : lastPressObject,
                } as PointerUnifiedEventData,
            );
            targetObject?.dispatchEventWith(
                PointerEventType.Press,
                true,
                {
                    pointerId    : pointerId,
                    stageX       : stageX,
                    stageY       : stageY,
                    wheelValue   : undefined,
                    lastHover    : hoverObject,
                    currentHover : hoverObject,
                    lastPress    : lastPressObject,
                    currentPress : targetObject,
                    rawEvent     : e,
                    dispatcher   : targetObject,
                } as PointerUnifiedEventData,
            );
        }
    });

    _canvas.addEventListener("pointerup", e => {
        // console.log("pointerup", e, e.button, e.buttons);
        if (e.button === 2) {
            return;
        }

        const point = getStagePoint(e);
        checkAndUpdateMousePos(point);

        const pointerId         = e.pointerId;
        const lastPressObject   = getPointerPressObject(pointerId);
        const pressStatus       = getPointerPressStatus(pointerId);
        setPointerPressObject(pointerId, undefined);
        setPointerPressStatus(pointerId, undefined);

        if (lastPressObject != null) {
            const hoverObject   = getPointerHoverObject(pointerId);
            const unifiedEvent  : PointerUnifiedEventData = {
                pointerId    : pointerId,
                stageX       : point.x,
                stageY       : point.y,
                wheelValue   : undefined,
                lastHover    : hoverObject,
                currentHover : hoverObject,
                lastPress    : lastPressObject,
                currentPress : undefined,
                rawEvent     : e,
                dispatcher   : lastPressObject,
            };

            if (!checkIsSameOrAncestor(lastPressObject, getPointerTargetObject(point))) {
                lastPressObject.dispatchEventWith(PointerEventType.ReleaseOut, true, unifiedEvent);

            } else {
                lastPressObject.dispatchEventWith(PointerEventType.ReleaseIn, true, unifiedEvent);
                if (!pressStatus?.hasMoved) {
                    lastPressObject.dispatchEventWith(PointerEventType.Tap, true, unifiedEvent);
                }
            }
        }
    });

    _canvas.addEventListener("pointermove", e => {
        // console.log("pointermove", e, e.button, e.buttons);
        if (e.button === 2) {
            return;
        }

        const pointerId = e.pointerId;
        if (LIMIT_MOVE_EVENT_FREQUENCY) {
            const currentTime   = Date.now();
            const lastTime      = PointerMoveTimeDict.get(pointerId) ?? 0;
            if (currentTime - lastTime <= 8) {
                return;
            }
            PointerMoveTimeDict.set(pointerId, currentTime);
        }

        const point = getStagePoint(e);
        checkAndUpdateMousePos(point);

        const stageX        = point.x;
        const stageY        = point.y;
        const pressStatus   = getPointerPressStatus(pointerId);
        if (pressStatus != null) {
            pressStatus.hasMoved ||= Geometries_Utils.getSquaredPointDistance(pressStatus.originX, pressStatus.originY, stageX, stageY) > 100;
        }

        const lastHoverObject   = getPointerHoverObject(pointerId);
        const targetObject      = getPointerTargetObject(point);
        setPointerHoverObject(pointerId, targetObject);

        const lastPressObject       = getPointerPressObject(pointerId);
        _tempPointerMoveEventData   = {
            pointerId    : pointerId,
            stageX       : stageX,
            stageY       : stageY,
            wheelValue   : undefined,
            lastHover    : lastHoverObject,
            currentHover : targetObject,
            lastPress    : lastPressObject,
            currentPress : lastPressObject,
            rawEvent     : e,
            dispatcher   : undefined,
        };
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.PointerGlobalMove, _tempPointerMoveEventData);

        lastPressObject?.dispatchEventWith(
            PointerEventType.PressMove,
            true,
            {
                pointerId    : pointerId,
                stageX       : stageX,
                stageY       : stageY,
                wheelValue   : undefined,
                lastHover    : lastHoverObject,
                currentHover : targetObject,
                lastPress    : lastPressObject,
                currentPress : lastPressObject,
                rawEvent     : e,
                dispatcher   : lastPressObject,
            } as PointerUnifiedEventData,
        );
        if (lastHoverObject !== targetObject) {
            // TODO
            lastHoverObject?.dispatchEventWith(
                PointerEventType.HoverOut,
                true,
                {
                    pointerId    : pointerId,
                    stageX       : stageX,
                    stageY       : stageY,
                    wheelValue   : undefined,
                    lastHover    : lastHoverObject,
                    currentHover : targetObject,
                    lastPress    : lastPressObject,
                    currentPress : lastPressObject,
                    rawEvent     : e,
                    dispatcher   : lastHoverObject,
                } as PointerUnifiedEventData,
            );
            targetObject?.dispatchEventWith(
                PointerEventType.HoverIn,
                true,
                {
                    pointerId    : pointerId,
                    stageX       : stageX,
                    stageY       : stageY,
                    wheelValue   : undefined,
                    lastHover    : lastHoverObject,
                    currentHover : targetObject,
                    lastPress    : lastPressObject,
                    currentPress : lastPressObject,
                    rawEvent     : e,
                    dispatcher   : targetObject,
                } as PointerUnifiedEventData,
            );
        }
    });

    {
        // _mouseMoveEnabled目前用不上，所以先屏蔽掉相关逻辑
        // {
        //     const webTouchHandlerPrototype = (egret.web as any).WebTouchHandler.prototype as CompatibilityHelpers.WebTouchHandler;
        //     {
        //         const getLocation = webTouchHandlerPrototype.getLocation;
        //         webTouchHandlerPrototype.getLocation = function (e) {
        //             if (e.buttons == 0) {
        //                 isMove = true;
        //             }
        //             return getLocation.call(this, e);
        //         };
        //     }
        // }

        // 不再需要egret自带的点击监听，因此全部屏蔽
        // {
        //     {
        //         const onTouchBegin = _webTouchHandler.onTouchBegin;
        //         _webTouchHandler.onTouchBegin = function (e: Event) {
        //             if ((e instanceof MouseEvent) && (e.buttons & 2)) {
        //                 Notify.Dispatcher.dispatch(Notify.NotifyType.MouseRightButtonClicked, e);
        //                 return;
        //             }
        //             return onTouchBegin.call(_webTouchHandler, e);
        //         };

        //         // 抵消egret.web.js第2827行
        //         if (!egret.Capabilities.isMobile) {
        //             _canvas.removeEventListener("mousedown", onTouchBegin);
        //             _canvas.addEventListener("mousedown", _webTouchHandler.onTouchBegin);
        //         }
        //     }
        //     {
        //         const onMouseMove = _webTouchHandler.onMouseMove;
        //         _webTouchHandler.onMouseMove = function (e: Event) {
        //             if ((e instanceof MouseEvent) && (e.buttons & 2)) {
        //                 Notify.Dispatcher.dispatch(Notify.NotifyType.MouseRightButtonClicked, e);
        //                 return;
        //             }
        //             return onMouseMove.call(_webTouchHandler, e);
        //         };

        //         // 抵消egret.web.js第2827行
        //         if (!egret.Capabilities.isMobile) {
        //             _canvas.removeEventListener("mousemove", onMouseMove);
        //             _canvas.addEventListener("mousemove", _webTouchHandler.onMouseMove);
        //         }
        //     }
        //     {
        //         const onToucheMove = _webTouchHandler.onTouchMove;
        //         _webTouchHandler.onTouchMove = function (e: Event) {
        //             if ((e instanceof MouseEvent) && (e.buttons & 2)) {
        //                 Notify.Dispatcher.dispatch(Notify.NotifyType.MouseRightButtonClicked, e);
        //                 return;
        //             }
        //             return onToucheMove.call(_webTouchHandler, e);
        //         };
        //     }
        //     {
        //         const onTouchEnd = _webTouchHandler.onTouchEnd;
        //         _webTouchHandler.onTouchEnd = function (e: Event) {
        //             if ((e instanceof MouseEvent) && (e.buttons & 2)) {
        //                 Notify.Dispatcher.dispatch(Notify.NotifyType.MouseRightButtonClicked, e);
        //                 return;
        //             }
        //             return onTouchEnd.call(_webTouchHandler, e);
        //         };

        //         // 抵消egret.web.js第2827行
        //         if (!egret.Capabilities.isMobile) {
        //             _canvas.removeEventListener("mouseup", onTouchEnd);
        //             _canvas.addEventListener("mouseup", _webTouchHandler.onTouchEnd);
        //         }
        //     }
        // }

        {
            // 不再需要egret自带的点击监听，因此全部屏蔽，egret.web.js第2827行
            _canvas.removeEventListener("mousedown", _webTouchHandler.onTouchBegin);
            _canvas.removeEventListener("mousemove", _webTouchHandler.onMouseMove);
            _canvas.removeEventListener("mouseup", _webTouchHandler.onTouchEnd);
            _webTouchHandler.onTouchBegin   = () => { /* nothing to do  */ };
            _webTouchHandler.onMouseMove    = () => { /* nothing to do  */ };
            _webTouchHandler.onTouchEnd     = () => { /* nothing to do  */ };
        }
    }

    {
        Egret_Egret.startTick(() => {
            ++_frames;
            if (_frames % 2 === 0) {
                updateMouseStyle();
            }
            return false;
        }, undefined);
    }
}

function getMouseExpectedStyle(obj: Egret_Egret.DisplayObject): MouseExpectedStyle | undefined {
    return MouseExpectedStyleArray.find(v => v.displayObject.deref() === obj);
}
export function getMouseExpectedStyleType(obj: Egret_Egret.DisplayObject): MouseStyleType | undefined {
    return getMouseExpectedStyle(obj)?.expectedStyle;
}
export function setMouseExpectedStyleType(obj: Egret_Egret.DisplayObject, style: MouseStyleType): void {
    const status = getMouseExpectedStyle(obj);
    if (status) {
        status.expectedStyle = style;
    } else {
        MouseExpectedStyleArray.push({
            displayObject : new WeakRef(obj),
            expectedStyle : style,
        });
    }
}

export function getMouseX(): number | undefined {
    return _mouseX;
}
export function getMouseY(): number | undefined {
    return _mouseY;
}
function checkAndUpdateMousePos(point: AuxiliaryTypes_AuxiliaryTypes.Point): void {
    if (Helpers_Compatibility.isPc) {
        _mouseX = point.x;
        _mouseY = point.y;
    }
}

export function getPointerHoverObject(pointerId: number): Egret_Egret.DisplayObject | undefined {
    return PointerHoverObjectDict.get(pointerId)?.deref();
}
function setPointerHoverObject(pointerId: number, obj: Egret_Egret.DisplayObject | undefined): void {
    if (obj == null) {
        PointerHoverObjectDict.delete(pointerId);
    } else {
        PointerHoverObjectDict.set(pointerId, new WeakRef(obj));
    }
}
export function getPointerPressObject(pointerId: number): Egret_Egret.DisplayObject | undefined {
    return PointerPressObjectDict.get(pointerId)?.deref();
}
function setPointerPressObject(pointerId: number, obj: Egret_Egret.DisplayObject | undefined): void {
    if (obj == null) {
        PointerPressObjectDict.delete(pointerId);
    } else {
        PointerPressObjectDict.set(pointerId, new WeakRef(obj));
    }
}
export function getPointerPressStatus(pointerId: number): PointerPressStatus | undefined {
    return PointerPressStatusDict.get(pointerId);
}
function setPointerPressStatus(pointerId: number, status: PointerPressStatus | undefined): void {
    if (status == null) {
        PointerPressStatusDict.delete(pointerId);
    } else {
        PointerPressStatusDict.set(pointerId, status);
    }
}

function updateMouseStyle(): void {
    if ((!Helpers_Compatibility.isPc)    ||
        (_mouseX == null)               ||
        (_mouseY == null)
    ) {
        return;
    }

    const aliveStatusArray  = MouseExpectedStyleArray.concat();
    const expectedStyleArray: {
        obj                 : Egret_Egret.DisplayObject;
        style               : MouseStyleType;
        displayIndexArray   : number[];
    }[] = [];
    for (let i = 0; i < aliveStatusArray.length; ++i) {
        const status    = aliveStatusArray[i];
        const obj       = status.displayObject.deref();
        if (obj == null) {
            aliveStatusArray.splice(i--, 1);
            continue;
        }

        const displayIndexArray = getDisplayIndexArray(obj);
        if (displayIndexArray.length <= 0) {
            continue;
        }

        expectedStyleArray.push({
            obj               : obj,
            style             : status.expectedStyle,
            displayIndexArray : displayIndexArray,
        });
    }
    if (aliveStatusArray.length !== MouseExpectedStyleArray.length) {
        MouseExpectedStyleArray.length = 0;
        MouseExpectedStyleArray.push(...aliveStatusArray);
    }

    {
        let isUpdated = false;
        if (expectedStyleArray.length > 0) {
            const targetObj = getPointerTargetObject({ x : _mouseX, y : _mouseY });
            if (targetObj != null) {
                for (const item of expectedStyleArray.sort((v1, v2) => v2.displayIndexArray.length - v1.displayIndexArray.length)) {
                    if (checkIsSameOrAncestor(item.obj, targetObj)) {
                        isUpdated               = true;
                        _canvas.style.cursor    = getStyleString(item.style);
                        break;
                    }
                }
            }
        }

        if (!isUpdated) {
            _canvas.style.cursor = getStyleString(MouseStyleType.Auto);
        }
    }
}

function getDisplayIndexArray(obj: Egret_Egret.DisplayObject): number[] {
    const arr: number[] = [];
    while (obj !== _stage) {
        if (!obj.visible) {
            return [];
        }

        if ((!obj.touchEnabled)                                                         &&
            (!((obj instanceof Egret_Egret.DisplayObjectContainer) && (obj.touchChildren)))
        ) {
            return [];
        }

        const parent = obj.parent;
        if (parent == null) {
            return [];
        }

        arr.push(parent.getChildIndex(obj));
        obj = parent;
    }

    return arr.reverse();
}
function checkIsSameOrAncestor(container: Egret_Egret.DisplayObject, obj: Egret_Egret.DisplayObject | undefined): boolean {
    if (container === obj) {
        return true;
    } else {
        return (obj != null)
            && (container instanceof Egret_Egret.DisplayObjectContainer)
            && (container.contains(obj));
    }

    // while (obj != null) {
    //     if (obj === container) {
    //         return true;
    //     }
    //     obj = obj.parent;
    // }
    // return false;
}
function getPointerTargetObject(stagePoint: AuxiliaryTypes_AuxiliaryTypes.Point): Egret_Egret.DisplayObject | undefined {
    // return _stage.$hitTest(stagePoint.x, stagePoint.y);
    return Ui_Utils_UiHelpers.hitTestTarget(_stage, stagePoint.x, stagePoint.y).mostInnerObject;
}
function getStagePoint(e: PointerEvent | WheelEvent): AuxiliaryTypes_AuxiliaryTypes.Point {
    const p = _webTouchHandler.getLocation(e);
    return { x : p.x, y : p.y };
}

function getStyleString(style: MouseStyleType): string {
    switch (style) {
        case MouseStyleType.Auto    : return "auto";
        case MouseStyleType.Default : return "default";
        case MouseStyleType.Text    : return "text";
        case MouseStyleType.Pointer : return "pointer";
        default                     : return "auto";
    }
}
