import type { IUiPromptedInput } from "../interfaces/IUiPromptedInput.ts";
import type { IUiTextInput } from "../interfaces/IUiTextInput.ts";
import type { UiInputEventType } from "./UiInputEventType.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export interface UiInputEventListener {
    ui          : IUiTextInput | IUiPromptedInput;
    callback    : (e: Event) => void;
    eventType   : UiInputEventType;
    thisObject? : any;
}
