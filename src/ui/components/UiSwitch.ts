import {
    Tween_Executor,
    Helpers_Misc,
    Helpers_PointerInput,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Ui_Components_UiContainer,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiSwitch,
} from "../../internal.ts";

const TweenTime = 100;

export class UiSwitch extends Ui_Components_UiContainer.UiContainer implements Ui_Interfaces_IUiSwitch.IUiSwitch {
    private readonly _groupSlider?  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgEnabled?   : Ui_Interfaces_IUiImage.IUiImage;
    // private readonly _imgDisabled?  : UiImage | UiImage9;

    private _isSwitchOn             = false;
    private _isRunningTween         = false;
    private _shortSfxCode           = Sounds_Constants.ShortSfxCode.ButtonNeutral01;
    private _callbackOnTouch?       : () => void;

    public constructor() {
        super();

        this.setMouseStyle(Helpers_PointerInput.MouseStyleType.Pointer);
        this.getEventAgent().addPointerEventListener(Helpers_PointerInput.PointerEventType.Tap, this._onTouchedTap, this);
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

        const groupSlider       = Helpers_Misc.getExisted(this._groupSlider);
        const imgEnabled        = Helpers_Misc.getExisted(this._imgEnabled);
        // const imgDisabled       = this._imgDisabled;
        this._isRunningTween    = false;
        Tween_Executor.Executor.removeTweens(groupSlider);
        Tween_Executor.Executor.removeTweens(imgEnabled);
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
            Tween_Executor.Executor.get(groupSlider).to({ customX : endX }, TweenTime).call(() => this._isRunningTween = false);
            Tween_Executor.Executor.get(imgEnabled).to({ customAlpha : endEnabledAlpha }, TweenTime);
            // Tween.get(imgDisabled).to({ alpha: endDisabledAlpha }, TweenTime);
        }
    }

    public setShortSfxCode(code: Sounds_Constants.ShortSfxCode): void {
        this._shortSfxCode = code;
    }
    public getShortSfxCode(): Sounds_Constants.ShortSfxCode {
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

        Sounds_SoundPlayer.playShortSfx(this.getShortSfxCode());

        const callback = this._callbackOnTouch;
        (callback) && (callback());
    }
}
