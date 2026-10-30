import {
    Egret_Egret,
    type Notifications_Types,
    type Notifications_TypeId,
} from "../internal.ts";

const _DISPATCHER = new Egret_Egret.EventDispatcher();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function dispatch(t: Notifications_TypeId.TypeId, data?: any): void {
    _DISPATCHER.dispatchEventWith(getTypeName(t), false, data);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addEventListener(type: Notifications_TypeId.TypeId, callback: (e: Egret_Egret.Event) => void, thisObject?: any, useCapture?: boolean, priority?: number): void {
    _DISPATCHER.addEventListener(getTypeName(type), callback, thisObject, useCapture, priority);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addEventListeners(listeners: Notifications_Types.Listener[], thisObject: any, useCapture?: boolean, priority?: number): void {
    for (const l of listeners) {
        addEventListener(
            l.type,
            l.callback,
            l.thisObject != null ? l.thisObject : thisObject,
            l.useCapture != null ? l.useCapture : useCapture,
            l.priority   != null ? l.priority   : priority
        );
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function removeEventListener(type: Notifications_TypeId.TypeId, callback: (e: Egret_Egret.Event) => void, thisObject?: any, useCapture?: boolean): void {
    _DISPATCHER.removeEventListener(getTypeName(type), callback, thisObject, useCapture);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function removeEventListeners(listeners: Notifications_Types.Listener[], thisObject: any, useCapture?: boolean): void {
    for (const l of listeners) {
        removeEventListener(
            l.type,
            l.callback,
            l.thisObject != null ? l.thisObject : thisObject,
            l.useCapture != null ? l.useCapture : useCapture
        );
    }
}

function getTypeName(t: Notifications_TypeId.TypeId): string {
    return "Notify" + t;
}
