import {
    type Egret_Egret,
    type Helpers_PointerInput,
    type Ui_Types_UiCommonEventType,
    type Ui_Types_UiInputEventType,
} from "../../internal.ts";

export interface IUiEventAgent {
    addUiCommonEventListener(eventType: Ui_Types_UiCommonEventType.UiCommonEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void;
    onceUiCommonEventListener(eventType: Ui_Types_UiCommonEventType.UiCommonEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void;
    removeUiCommonEventListener(eventType: Ui_Types_UiCommonEventType.UiCommonEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void;
    dispatchUiCommonEvent(eventType: Ui_Types_UiCommonEventType.UiCommonEventType): void;

    /** 自动在ui进入舞台时注册，在ui离开舞台时移除 */
    addAutoEnterFrameListener(callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void;
    removeAutoEnterFrameListener(callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void;

    addPointerEventListener(eventType: Helpers_PointerInput.PointerEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void;
    removePointerEventListener(eventType: Helpers_PointerInput.PointerEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void;

    addInputEventListener(eventType: Ui_Types_UiInputEventType.UiInputEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void;
    removeInputEventListener(eventType: Ui_Types_UiInputEventType.UiInputEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void;
}
