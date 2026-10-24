import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiContainer from "./UiContainer.ts";
import type * as UiInterfacesIUiContainer from "../interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../interfaces/IUiImage.ts";
import type * as UiInterfacesIUiSwitch from "../interfaces/IUiSwitch.ts";

const TweenTime = 100;

export class UiSwitch extends UiComponentsUiContainer.UiContainer implements UiInterfacesIUiSwitch.IUiSwitch {
    private readonly _groupSlider?  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgEnabled?   : UiInterfacesIUiImage.IUiImage;
    // private readonly _imgDisabled?  : UiImage | UiImage9;

    private _isSwitchOn             = false;
    private _isRunningTween         = false;
    private _shortSfxCode           = SoundsConstants.ShortSfxCode.ButtonNeutral01;
    private _callbackOnTouch?       : () => void;

    public constructor() {
        super();

        this.setMouseStyle(HelpersPointerInput.MouseStyleType.Pointer);
        this.getEventAgent().addPointerEventListener(HelpersPointerInput.PointerEventType.Tap, this._onTouchedTap, this);
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

        const groupSlider       = HelpersMisc.getExisted(this._groupSlider);
        const imgEnabled        = HelpersMisc.getExisted(this._imgEnabled);
        // const imgDisabled       = this._imgDisabled;
        this._isRunningTween    = false;
        TweenExecutor.Executor.removeTweens(groupSlider);
        TweenExecutor.Executor.removeTweens(imgEnabled);
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
            TweenExecutor.Executor.get(groupSlider).to({ customX: endX }, TweenTime).call(() => this._isRunningTween = false);
            TweenExecutor.Executor.get(imgEnabled).to({ customAlpha: endEnabledAlpha }, TweenTime);
            // Tween.get(imgDisabled).to({ alpha: endDisabledAlpha }, TweenTime);
        }
    }

    public setShortSfxCode(code: SoundsConstants.ShortSfxCode): void {
        this._shortSfxCode = code;
    }
    public getShortSfxCode(): SoundsConstants.ShortSfxCode {
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

        SoundsSoundPlayer.playShortSfx(this.getShortSfxCode());

        const callback = this._callbackOnTouch;
        (callback) && (callback());
    }
}
