import {
    type Egret_Egret,
    type Ui_Interfaces_IUiPromptedInput,
    type Ui_Interfaces_IUiTextInput,
    type Ui_Types_UiInputEventType,
} from "../../internal.ts";

export type UiInputEventListener<T extends Ui_Types_UiInputEventType.UiInputEventType = Ui_Types_UiInputEventType.UiInputEventType> = {
    [K in T]: {
        ui          : Ui_Interfaces_IUiTextInput.IUiTextInput | Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
        callback    : (e: Egret_Egret.Event<Ui_Types_UiInputEventType.Mapping[K]>) => void;
        eventType   : K;
        thisObject? : unknown;
    };
}[T];
