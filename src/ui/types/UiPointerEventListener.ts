import type * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as UiInterfacesIUiComponent from "../interfaces/IUiComponent.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface UiPointerEventListener {
    ui              : UiInterfacesIUiComponent.IUiComponent;
    callback        : (e: VendorEgretEgret.Event) => void;
    mouseStyle?     : HelpersPointerInput.MouseStyleType;
    eventType?      : HelpersPointerInput.PointerEventType;
    thisObject?     : any;
}
