import type * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as UiInterfacesIUiEventAgent from "../interfaces/IUiEventAgent.ts";
import * as UiTypesUiCommonEventType from "../types/UiCommonEventType.ts";
import type * as UiTypesUiInputEventType from "../types/UiInputEventType.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type UiInputEventType       = UiTypesUiInputEventType.UiInputEventType;
type PointerEventType       = HelpersPointerInput.PointerEventType;

type EnterFrameListener = {
    callback    : (e: VendorEgretEgret.Event) => void;
    thisObject  : unknown;
};

export class UiEventAgent implements UiInterfacesIUiEventAgent.IUiEventAgent {
    private readonly _target            : VendorEgretEgret.DisplayObject;
    private _enterFrameListenerArray?   : EnterFrameListener[];

    public constructor(target: VendorEgretEgret.DisplayObject) {
        this._target = target;
    }

    public addUiCommonEventListener(eventType: UiTypesUiCommonEventType.UiCommonEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback, thisObject);
    }
    public onceUiCommonEventListener(eventType: UiTypesUiCommonEventType.UiCommonEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void {
        this._target.once(eventType, callback, thisObject);
    }
    public removeUiCommonEventListener(eventType: UiTypesUiCommonEventType.UiCommonEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback, thisObject);
    }
    public dispatchUiCommonEvent(eventType: UiTypesUiCommonEventType.UiCommonEventType): void {
        this._target.dispatchEventWith(eventType);
    }

    public addAutoEnterFrameListener(callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void {
        const arr = this._enterFrameListenerArray ??= [];
        {
            if (arr.some(v => (v.callback === callback) && (v.thisObject == thisObject))) {
                return;
            }
            arr.push({ callback, thisObject });
        }

        const target = this._target;
        if (arr.length === 1) {
            target.addEventListener(UiTypesUiCommonEventType.UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            target.addEventListener(UiTypesUiCommonEventType.UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
        if (target.stage) {
            target.addEventListener(UiTypesUiCommonEventType.UiCommonEventType.EnterFrame, callback, thisObject);
        }
    }
    public removeAutoEnterFrameListener(callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void {
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
            target.removeEventListener(UiTypesUiCommonEventType.UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            target.removeEventListener(UiTypesUiCommonEventType.UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
        if (target.stage) {
            target.removeEventListener(UiTypesUiCommonEventType.UiCommonEventType.EnterFrame, callback, thisObject);
        }
    }
    private _onAddedToStage(): void {
        const arr = this._enterFrameListenerArray;
        if (arr) {
            const target = this._target;
            for (const listener of arr) {
                target.addEventListener(UiTypesUiCommonEventType.UiCommonEventType.EnterFrame, listener.callback, listener.thisObject);
            }
        }
    }
    private _onRemovedFromStage(): void {
        const arr = this._enterFrameListenerArray;
        if (arr) {
            const target = this._target;
            for (const listener of arr) {
                target.removeEventListener(UiTypesUiCommonEventType.UiCommonEventType.EnterFrame, listener.callback, listener.thisObject);
            }
        }
    }

    public addPointerEventListener(eventType: PointerEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback, thisObject);
    }
    public removePointerEventListener(eventType: PointerEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback, thisObject);
    }

    public addInputEventListener(eventType: UiInputEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void {
        this._target.addEventListener(eventType, callback, thisObject);
    }
    public removeInputEventListener(eventType: UiInputEventType, callback: (e: VendorEgretEgret.Event) => void, thisObject: unknown): void {
        this._target.removeEventListener(eventType, callback, thisObject);
    }
}
