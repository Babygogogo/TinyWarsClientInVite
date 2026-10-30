import { getExisted } from "../../helpers/Misc.ts";
import {
    MouseStyleType,
    PointerEventType,
} from "../../helpers/PointerInput.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiContainer } from "./UiContainer.ts";
import type { IUiContainer } from "../interfaces/IUiContainer.ts";
import type { IUiImage } from "../interfaces/IUiImage.ts";
import type { IUiSwitch } from "../interfaces/IUiSwitch.ts";

const TweenTime = 100;

export class UiSwitch extends UiContainer implements IUiSwitch {
    private readonly _groupSlider?  : IUiContainer;
    private readonly _imgEnabled?   : IUiImage;
    // private readonly _imgDisabled?  : UiImage | UiImage9;

    private _isSwitchOn             = false;
    private _isRunningTween         = false;
    private _shortSfxCode           = ShortSfxCode.ButtonNeutral01;
    private _callbackOnTouch?       : () => void;

    public constructor() {
        super();

        this.setMouseStyle(MouseStyleType.Pointer);
        this.getEventAgent().addPointerEventListener(PointerEventType.Tap, this._onTouchedTap, this);
    }
    public updateOnLoadedSkin(): void {
        this.setIsTouchEnabled(true);
        this.setIsTouchChildrenEnabled(false);
    }

    public getIsSwitchOn(): boolean {
        return this._isSwitchOn;
    }
    public setIsSwitchOn(isOn: boolean, isTween: boolean): void {
        this._isSwitchOn = isOn;

        const groupSlider       = getExisted(this._groupSlider);
        const imgEnabled        = getExisted(this._imgEnabled);
        // const imgDisabled       = this._imgDisabled;
        this._isRunningTween    = false;
        Executor.removeTweens(groupSlider);
        Executor.removeTweens(imgEnabled);
        // Tween.removeTweens(imgDisabled);

        const endX              = isOn ? this.getUnscaledWidth() - groupSlider.getScaledWidth() : 0;
        const endEnabledAlpha   = isOn ? 1 : 0;
        // const endDisabledAlpha  = isOn ? 0 : 1;
        if (!isTween) {
            groupSlider.setX(endX);
            imgEnabled.setAlpha(endEnabledAlpha);
            // imgDisabled.alpha   = endDisabledAlpha;
        } else {
            this._isRunningTween = true;
            Executor.get(groupSlider).to({ customX: endX }, TweenTime).call(() => this._isRunningTween = false);
            Executor.get(imgEnabled).to({ customAlpha: endEnabledAlpha }, TweenTime);
            // Tween.get(imgDisabled).to({ alpha: endDisabledAlpha }, TweenTime);
        }
    }

    public setShortSfxCode(code: ShortSfxCode): void {
        this._shortSfxCode = code;
    }
    public getShortSfxCode(): ShortSfxCode {
        return this._shortSfxCode;
    }

    public setCallbackOnTouch(callback: (() => void) | undefined): void {
        this._callbackOnTouch = callback;
    }
    public getCallbackOnTouch(): (() => void) | undefined {
        return this._callbackOnTouch;
    }

    private _onTouchedTap(): void {
        if (this._isRunningTween) {
            return;
        }

        playShortSfx(this.getShortSfxCode());

        const callback = this._callbackOnTouch;
        (callback) && (callback());
    }
}
