import {
    type Ui_Interfaces_IUiContainer,
    type Sounds_Constants,
} from "../../internal.ts";

export interface IUiSwitch extends Ui_Interfaces_IUiContainer.IUiContainer {
    getIsSwitchOn(): boolean;
    setIsSwitchOn(isOn: boolean, isTween: boolean): void;

    setShortSfxCode(code: Sounds_Constants.ShortSfxCode): void;
    getShortSfxCode(): Sounds_Constants.ShortSfxCode;

    setCallbackOnTouch(callback: (() => void) | undefined): void;
    getCallbackOnTouch(): (() => void) | undefined;
}
