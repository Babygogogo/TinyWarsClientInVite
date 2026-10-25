import type { PointerEventType } from "../../helpers/PointerInput.ts";
import type { UiCommonEventType } from "../types/UiCommonEventType.ts";
import type { UiInputEventType } from "../types/UiInputEventType.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export interface IUiEventAgent {
    addUiCommonEventListener(eventType: UiCommonEventType, callback: (e: Event) => void, thisObject: unknown): void;
    onceUiCommonEventListener(eventType: UiCommonEventType, callback: (e: Event) => void, thisObject: unknown): void;
    removeUiCommonEventListener(eventType: UiCommonEventType, callback: (e: Event) => void, thisObject: unknown): void;
    dispatchUiCommonEvent(eventType: UiCommonEventType): void;

    /** 自动在ui进入舞台时注册，在ui离开舞台时移除 */
    addAutoEnterFrameListener(callback: (e: Event) => void, thisObject: unknown): void;
    removeAutoEnterFrameListener(callback: (e: Event) => void, thisObject: unknown): void;

    addPointerEventListener(eventType: PointerEventType, callback: (e: Event) => void, thisObject: unknown): void;
    removePointerEventListener(eventType: PointerEventType, callback: (e: Event) => void, thisObject: unknown): void;

    addInputEventListener(eventType: UiInputEventType, callback: (e: Event) => void, thisObject: unknown): void;
    removeInputEventListener(eventType: UiInputEventType, callback: (e: Event) => void, thisObject: unknown): void;
}
