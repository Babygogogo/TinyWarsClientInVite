import {
    type Egret_Egret,
    type Helpers_PointerInput,
    type Ui_Types_UiCommonEventType,
    type Ui_Types_UiInputEventType,
} from "../../internal.ts";

export interface IUiEventAgent {
    addUiCommonEventListener<T extends Ui_Types_UiCommonEventType.UiCommonEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiCommonEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void;
    onceUiCommonEventListener<T extends Ui_Types_UiCommonEventType.UiCommonEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiCommonEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void;
    removeUiCommonEventListener<T extends Ui_Types_UiCommonEventType.UiCommonEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiCommonEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void;
    dispatchUiCommonEvent<T extends Ui_Types_UiCommonEventType.UiCommonEventType>(eventType: T, ...data: undefined extends Ui_Types_UiCommonEventType.Mapping[T] ? [data?: Ui_Types_UiCommonEventType.Mapping[T]] : [data: Ui_Types_UiCommonEventType.Mapping[T]]): void;

    /** 自动在ui进入舞台时注册，在ui离开舞台时移除 */
    addAutoEnterFrameListener(callback: (e: Egret_Egret.Event<undefined>) => void, thisObject: unknown): void;
    removeAutoEnterFrameListener(callback: (e: Egret_Egret.Event<undefined>) => void, thisObject: unknown): void;

    addPointerEventListener(eventType: Helpers_PointerInput.PointerEventType, callback: (e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>) => void, thisObject: unknown): void;
    removePointerEventListener(eventType: Helpers_PointerInput.PointerEventType, callback: (e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>) => void, thisObject: unknown): void;

    addInputEventListener<T extends Ui_Types_UiInputEventType.UiInputEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiInputEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void;
    removeInputEventListener<T extends Ui_Types_UiInputEventType.UiInputEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiInputEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void;
}
