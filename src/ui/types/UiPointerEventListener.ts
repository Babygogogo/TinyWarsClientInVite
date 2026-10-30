import type {
    MouseStyleType,
    PointerEventType,
} from "../../helpers/PointerInput.ts";
import type { IUiComponent } from "../interfaces/IUiComponent.ts";
import type { Event } from "../../egret/Egret.ts";

export interface UiPointerEventListener {
    ui              : IUiComponent;
    callback        : (e: Event) => void;
    mouseStyle?     : MouseStyleType;
    eventType?      : PointerEventType;
    thisObject?     : any;
}
