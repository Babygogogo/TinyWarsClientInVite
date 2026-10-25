import type { ShortSfxCode } from "../../sounds/Constants.ts";
import type { IUiContainer } from "./IUiContainer.ts";

export interface IUiSwitch extends IUiContainer {
    getIsSwitchOn(): boolean;
    setIsSwitchOn(isOn: boolean, isTween: boolean): void;

    setShortSfxCode(code: ShortSfxCode): void;
    getShortSfxCode(): ShortSfxCode;

    setCallbackOnTouch(callback: (() => void) | undefined): void;
    getCallbackOnTouch(): (() => void) | undefined;
}
