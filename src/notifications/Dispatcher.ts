import type * as NotificationsTypeId from "./TypeId.ts";
import type * as NotificationsTypes from "./Types.ts";
import * as VendorEgretEgret from "../vendor/egret/Egret.ts";

type Listener = NotificationsTypes.Listener;

const _DISPATCHER = new VendorEgretEgret.EventDispatcher();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function dispatch(t: NotificationsTypeId.TypeId, data?: any): void {
    _DISPATCHER.dispatchEventWith(getTypeName(t), false, data);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addEventListener(type: NotificationsTypeId.TypeId, callback: (e: VendorEgretEgret.Event) => void, thisObject?: any, useCapture?: boolean, priority?: number): void {
    _DISPATCHER.addEventListener(getTypeName(type), callback, thisObject, useCapture, priority);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addEventListeners(listeners: Listener[], thisObject: any, useCapture?: boolean, priority?: number): void {
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
export function removeEventListener(type: NotificationsTypeId.TypeId, callback: (e: VendorEgretEgret.Event) => void, thisObject?: any, useCapture?: boolean): void {
    _DISPATCHER.removeEventListener(getTypeName(type), callback, thisObject, useCapture);
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function removeEventListeners(listeners: Listener[], thisObject: any, useCapture?: boolean): void {
    for (const l of listeners) {
        removeEventListener(
            l.type,
            l.callback,
            l.thisObject != null ? l.thisObject : thisObject,
            l.useCapture != null ? l.useCapture : useCapture
        );
    }
}

function getTypeName(t: NotificationsTypeId.TypeId): string {
    return "Notify" + t;
}
