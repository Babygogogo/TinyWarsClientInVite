import {
    type Egret_Egret,
    type Ui_Interfaces_IUiComponent,
    type Helpers_PointerInput,
} from "../../internal.ts";

export interface UiPointerEventListener {
    ui              : Ui_Interfaces_IUiComponent.IUiComponent;
    callback        : (e: Egret_Egret.Event) => void;
    mouseStyle?     : Helpers_PointerInput.MouseStyleType;
    eventType?      : Helpers_PointerInput.PointerEventType;
    thisObject?     : any;
}
