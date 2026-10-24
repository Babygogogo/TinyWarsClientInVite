import type * as SoundsConstants from "../../sounds/Constants.ts";
import type * as UiInterfacesIUiContainer from "./IUiContainer.ts";

type ShortSfxCode = SoundsConstants.ShortSfxCode;

export interface IUiSwitch extends UiInterfacesIUiContainer.IUiContainer {
    getIsSwitchOn(): boolean;
    setIsSwitchOn(isOn: boolean, isTween: boolean): void;

    setShortSfxCode(code: ShortSfxCode): void;
    getShortSfxCode(): ShortSfxCode;

    setCallbackOnTouch(callback: (() => void) | undefined): void;
    getCallbackOnTouch(): (() => void) | undefined;
}
