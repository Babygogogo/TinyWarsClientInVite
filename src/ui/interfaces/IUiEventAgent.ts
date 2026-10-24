import type * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as UiTypesUiCommonEventType from "../types/UiCommonEventType.ts";
import type * as UiTypesUiInputEventType from "../types/UiInputEventType.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type UiCommonEventType  = UiTypesUiCommonEventType.UiCommonEventType;
type UiInputEventType   = UiTypesUiInputEventType.UiInputEventType;
type PointerEventType   = HelpersPointerInput.PointerEventType;

export interface IUiEventAgent {
    addUiCommonEventListener(eventType: UiCommonEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void;
    onceUiCommonEventListener(eventType: UiCommonEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void;
    removeUiCommonEventListener(eventType: UiCommonEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void;
    dispatchUiCommonEvent(eventType: UiCommonEventType): void;

    /** 自动在ui进入舞台时注册，在ui离开舞台时移除 */
    addAutoEnterFrameListener(callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void;
    removeAutoEnterFrameListener(callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void;

    addPointerEventListener(eventType: PointerEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void;
    removePointerEventListener(eventType: PointerEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void;

    addInputEventListener(eventType: UiInputEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void;
    removeInputEventListener(eventType: UiInputEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void;
}
