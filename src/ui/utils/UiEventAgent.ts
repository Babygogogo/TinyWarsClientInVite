import type { PointerEventType as HelpersPointerInputPointerEventType } from "../../helpers/PointerInput.ts";
import type { IUiEventAgent } from "../interfaces/IUiEventAgent.ts";
import { UiCommonEventType } from "../types/UiCommonEventType.ts";
import type { UiInputEventType as UiTypesUiInputEventType } from "../types/UiInputEventType.ts";
import type { Event, DisplayObject } from "../../vendor/egret/Egret.ts";

type UiInputEventType       = UiTypesUiInputEventType;
type PointerEventType       = HelpersPointerInputPointerEventType;

type EnterFrameListener = {
    callback    : (e: Event) => void;
    thisObject  : unknown;
};

export class UiEventAgent implements IUiEventAgent {
    private readonly _target            : DisplayObject;
    private _enterFrameListenerArray?   : EnterFrameListener[];

    public constructor(target: DisplayObject) {
        this._target = target;
    }

    public addUiCommonEventListener(eventType: UiCommonEventType, callback: (e: Event) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback, thisObject);
    }
    public onceUiCommonEventListener(eventType: UiCommonEventType, callback: (e: Event) => void, thisObject: unknown): void {
        this._target.once(eventType, callback, thisObject);
    }
    public removeUiCommonEventListener(eventType: UiCommonEventType, callback: (e: Event) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback, thisObject);
    }
    public dispatchUiCommonEvent(eventType: UiCommonEventType): void {
        this._target.dispatchEventWith(eventType);
    }

    public addAutoEnterFrameListener(callback: (e: Event) => void, thisObject: unknown): void {
        const arr = this._enterFrameListenerArray ??= [];
        {
            if (arr.some(v => (v.callback === callback) && (v.thisObject == thisObject))) {
                return;
            }
            arr.push({ callback, thisObject });
        }

        const target = this._target;
        if (arr.length === 1) {
            target.addEventListener(UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            target.addEventListener(UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
        if (target.stage) {
            target.addEventListener(UiCommonEventType.EnterFrame, callback, thisObject);
        }
    }
    public removeAutoEnterFrameListener(callback: (e: Event) => void, thisObject: unknown): void {
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
            target.removeEventListener(UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            target.removeEventListener(UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
        if (target.stage) {
            target.removeEventListener(UiCommonEventType.EnterFrame, callback, thisObject);
        }
    }
    private _onAddedToStage(): void {
        const arr = this._enterFrameListenerArray;
        if (arr) {
            const target = this._target;
            for (const listener of arr) {
                target.addEventListener(UiCommonEventType.EnterFrame, listener.callback, listener.thisObject);
            }
        }
    }
    private _onRemovedFromStage(): void {
        const arr = this._enterFrameListenerArray;
        if (arr) {
            const target = this._target;
            for (const listener of arr) {
                target.removeEventListener(UiCommonEventType.EnterFrame, listener.callback, listener.thisObject);
            }
        }
    }

    public addPointerEventListener(eventType: PointerEventType, callback: (e: Event) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback, thisObject);
    }
    public removePointerEventListener(eventType: PointerEventType, callback: (e: Event) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback, thisObject);
    }

    public addInputEventListener(eventType: UiInputEventType, callback: (e: Event) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback, thisObject);
    }
    public removeInputEventListener(eventType: UiInputEventType, callback: (e: Event) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback, thisObject);
    }
}
