import {
    Ui_Types_UiCommonEventType,
    type Egret_Egret,
    type Ui_Interfaces_IUiEventAgent,
    type Helpers_PointerInput,
    type Ui_Types_UiInputEventType,
} from "../../internal.ts";

type EnterFrameListener = {
    callback    : (e: Egret_Egret.Event) => void;
    thisObject  : unknown;
};

export class UiEventAgent implements Ui_Interfaces_IUiEventAgent.IUiEventAgent {
    private readonly _target            : Egret_Egret.DisplayObject;
    private _enterFrameListenerArray?   : EnterFrameListener[];

    public constructor(target: Egret_Egret.DisplayObject) {
        this._target = target;
    }

    public addUiCommonEventListener(eventType: Ui_Types_UiCommonEventType.UiCommonEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback, thisObject);
    }
    public onceUiCommonEventListener(eventType: Ui_Types_UiCommonEventType.UiCommonEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void {
        this._target.once(eventType, callback, thisObject);
    }
    public removeUiCommonEventListener(eventType: Ui_Types_UiCommonEventType.UiCommonEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback, thisObject);
    }
    public dispatchUiCommonEvent(eventType: Ui_Types_UiCommonEventType.UiCommonEventType): void {
        this._target.dispatchEventWith(eventType);
    }

    public addAutoEnterFrameListener(callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void {
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
            target.addEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.EnterFrame, callback, thisObject);
        }
    }
    public removeAutoEnterFrameListener(callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void {
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
            target.removeEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.EnterFrame, callback, thisObject);
        }
    }
    private _onAddedToStage(): void {
        const arr = this._enterFrameListenerArray;
        if (arr) {
            const target = this._target;
            for (const listener of arr) {
                target.addEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.EnterFrame, listener.callback, listener.thisObject);
            }
        }
    }
    private _onRemovedFromStage(): void {
        const arr = this._enterFrameListenerArray;
        if (arr) {
            const target = this._target;
            for (const listener of arr) {
                target.removeEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.EnterFrame, listener.callback, listener.thisObject);
            }
        }
    }

    public addPointerEventListener(eventType: Helpers_PointerInput.PointerEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback, thisObject);
    }
    public removePointerEventListener(eventType: Helpers_PointerInput.PointerEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback, thisObject);
    }

    public addInputEventListener(eventType: Ui_Types_UiInputEventType.UiInputEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback, thisObject);
    }
    public removeInputEventListener(eventType: Ui_Types_UiInputEventType.UiInputEventType, callback: (e: Egret_Egret.Event) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback, thisObject);
    }
}
