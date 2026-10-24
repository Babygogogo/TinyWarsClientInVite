import type * as UiInterfacesIUiPromptedInput from "../interfaces/IUiPromptedInput.ts";
import type * as UiInterfacesIUiTextInput from "../interfaces/IUiTextInput.ts";
import type * as UiTypesUiInputEventType from "./UiInputEventType.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export interface UiInputEventListener {
    ui          : UiInterfacesIUiTextInput.IUiTextInput | UiInterfacesIUiPromptedInput.IUiPromptedInput;
    callback    : (e: VendorEgretEgret.Event) => void;
    eventType   : UiTypesUiInputEventType.UiInputEventType;
    thisObject? : any;
}
