import type { ShortSfxCode as SoundsConstantsShortSfxCode } from "../../sounds/Constants.ts";
import type { IUiContainer } from "./IUiContainer.ts";

type ShortSfxCode = SoundsConstantsShortSfxCode;

export interface IUiSwitch extends IUiContainer {
    getIsSwitchOn(): boolean;
    setIsSwitchOn(isOn: boolean, isTween: boolean): void;

    setShortSfxCode(code: ShortSfxCode): void;
    getShortSfxCode(): ShortSfxCode;

    setCallbackOnTouch(callback: (() => void) | undefined): void;
    getCallbackOnTouch(): (() => void) | undefined;
}
