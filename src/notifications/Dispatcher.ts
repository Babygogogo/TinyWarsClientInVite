import {
    Egret_Egret,
    type Notifications_Mapping,
    type Notifications_Types,
} from "../internal.ts";

const _DISPATCHER = new Egret_Egret.EventDispatcher();

 
export function dispatch<T extends keyof Notifications_Mapping.Mapping>(
    t: T,
    ...[data]: undefined extends Notifications_Mapping.Mapping[T]
        ? [data?: Notifications_Mapping.Mapping[T]]
        : [data: Notifications_Mapping.Mapping[T]]
): void {
    _DISPATCHER.dispatchEventWith(t, false, data);
}

 
export function addEventListener<T extends keyof Notifications_Mapping.Mapping>(
    type: T,
    callback: (e: Egret_Egret.Event<Notifications_Mapping.Mapping[NoInfer<T>]>) => void,
    thisObject?: unknown,
    useCapture?: boolean,
    priority?: number,
): void {
    // Egret stores untyped callbacks; retain their identity for removal.
    _DISPATCHER.addEventListener(type, callback as Egret_Egret.EventListener, thisObject, useCapture, priority);
}
 
export function addEventListeners(listeners: Notifications_Types.Listener[], thisObject: unknown, useCapture?: boolean, priority?: number): void {
    for (const l of listeners) {
        _DISPATCHER.addEventListener(
            l.type,
            l.callback as Egret_Egret.EventListener,
            l.thisObject != null ? l.thisObject : thisObject,
            l.useCapture != null ? l.useCapture : useCapture,
            l.priority   != null ? l.priority   : priority,
        );
    }
}

 
export function removeEventListener<T extends keyof Notifications_Mapping.Mapping>(
    type: T,
    callback: (e: Egret_Egret.Event<Notifications_Mapping.Mapping[NoInfer<T>]>) => void,
    thisObject?: unknown,
    useCapture?: boolean,
): void {
    _DISPATCHER.removeEventListener(type, callback as Egret_Egret.EventListener, thisObject, useCapture);
}
 
export function removeEventListeners(listeners: Notifications_Types.Listener[], thisObject: unknown, useCapture?: boolean): void {
    for (const l of listeners) {
        _DISPATCHER.removeEventListener(
            l.type,
            l.callback as Egret_Egret.EventListener,
            l.thisObject != null ? l.thisObject : thisObject,
            l.useCapture != null ? l.useCapture : useCapture,
        );
    }
}
