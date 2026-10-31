import {
    Ui_Types_UiCommonEventType,
    type Egret_Egret,
    type Ui_Interfaces_IUiEventAgent,
    type Helpers_PointerInput,
    type Ui_Types_UiInputEventType,
} from "../../internal.ts";

type EnterFrameListener = {
    callback    : (e: Egret_Egret.Event<undefined>) => void;
    thisObject  : unknown;
};

export class UiEventAgent implements Ui_Interfaces_IUiEventAgent.IUiEventAgent {
    private readonly _target            : Egret_Egret.DisplayObject;
    private _enterFrameListenerArray?   : EnterFrameListener[];

    public constructor(target: Egret_Egret.DisplayObject) {
        this._target = target;
    }

    public addUiCommonEventListener<T extends Ui_Types_UiCommonEventType.UiCommonEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiCommonEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback as Egret_Egret.EventListener, thisObject);
    }
    public onceUiCommonEventListener<T extends Ui_Types_UiCommonEventType.UiCommonEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiCommonEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void {
        this._target.once(eventType, callback as Egret_Egret.EventListener, thisObject);
    }
    public removeUiCommonEventListener<T extends Ui_Types_UiCommonEventType.UiCommonEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiCommonEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback as Egret_Egret.EventListener, thisObject);
    }
    public dispatchUiCommonEvent<T extends Ui_Types_UiCommonEventType.UiCommonEventType>(eventType: T, ...[data]: undefined extends Ui_Types_UiCommonEventType.Mapping[T] ? [data?: Ui_Types_UiCommonEventType.Mapping[T]] : [data: Ui_Types_UiCommonEventType.Mapping[T]]): void {
        this._target.dispatchEventWith(eventType, false, data);
    }

    public addAutoEnterFrameListener(callback: (e: Egret_Egret.Event<undefined>) => void, thisObject: unknown): void {
        const arr = this._enterFrameListenerArray ??= [];
        {
            if (arr.some(v => (v.callback === callback) && (v.thisObject == thisObject))) {
                return;
            }
            arr.push({ callback, thisObject });
        }

        const target = this._target;
        if (arr.length === 1) {
            target.addEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            target.addEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
        if (target.stage) {
            target.addEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.EnterFrame, callback as Egret_Egret.EventListener, thisObject);
        }
    }
    public removeAutoEnterFrameListener(callback: (e: Egret_Egret.Event<undefined>) => void, thisObject: unknown): void {
        const arr = this._enterFrameListenerArray;
        {
            if (arr == null) {
                return;
            }

            const index = arr.findIndex(v => (v.callback === callback) && (v.thisObject == thisObject));
            if (index < 0) {
                return;
            }
            arr.splice(index, 1);
        }

        const target = this._target;
        if (arr.length == 0) {
            target.removeEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            target.removeEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
        if (target.stage) {
            target.removeEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.EnterFrame, callback as Egret_Egret.EventListener, thisObject);
        }
    }
    private _onAddedToStage(): void {
        const arr = this._enterFrameListenerArray;
        if (arr) {
            const target = this._target;
            for (const listener of arr) {
                target.addEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.EnterFrame, listener.callback as Egret_Egret.EventListener, listener.thisObject);
            }
        }
    }
    private _onRemovedFromStage(): void {
        const arr = this._enterFrameListenerArray;
        if (arr) {
            const target = this._target;
            for (const listener of arr) {
                target.removeEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.EnterFrame, listener.callback as Egret_Egret.EventListener, listener.thisObject);
            }
        }
    }

    public addPointerEventListener(eventType: Helpers_PointerInput.PointerEventType, callback: (e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>) => void, thisObject: unknown): void {
        // Egret stores untyped callbacks; retain their identity for removal.
        this._target.addEventListener(eventType, callback as Egret_Egret.EventListener, thisObject);
    }
    public removePointerEventListener(eventType: Helpers_PointerInput.PointerEventType, callback: (e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback as Egret_Egret.EventListener, thisObject);
    }

    public addInputEventListener<T extends Ui_Types_UiInputEventType.UiInputEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiInputEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback as Egret_Egret.EventListener, thisObject);
    }
    public removeInputEventListener<T extends Ui_Types_UiInputEventType.UiInputEventType>(eventType: T, callback: (e: Egret_Egret.Event<Ui_Types_UiInputEventType.Mapping[NoInfer<T>]>) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback as Egret_Egret.EventListener, thisObject);
    }
}
