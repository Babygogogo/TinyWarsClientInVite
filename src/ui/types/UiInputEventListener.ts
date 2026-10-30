import {
    type Egret_Egret,
    type Ui_Interfaces_IUiPromptedInput,
    type Ui_Interfaces_IUiTextInput,
    type Ui_Types_UiInputEventType,
} from "../../internal.ts";

export interface UiInputEventListener {
    ui          : Ui_Interfaces_IUiTextInput.IUiTextInput | Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    callback    : (e: Egret_Egret.Event) => void;
    eventType   : Ui_Types_UiInputEventType.UiInputEventType;
    thisObject? : any;
}
