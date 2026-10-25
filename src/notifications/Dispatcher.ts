import type { TypeId } from "./TypeId.ts";
import type { Listener } from "./Types.ts";
import { EventDispatcher, Event } from "../vendor/egret/Egret.ts";

const _DISPATCHER = new EventDispatcher();

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function dispatch(t: TypeId, data?: any): void {
    _DISPATCHER.dispatchEventWith(getTypeName(t), false, data);
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function addEventListener(type: TypeId, callback: (e: Event) => void, thisObject?: any, useCapture?: boolean, priority?: number): void {
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
export function removeEventListener(type: TypeId, callback: (e: Event) => void, thisObject?: any, useCapture?: boolean): void {
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

function getTypeName(t: TypeId): string {
    return "Notify" + t;
}
