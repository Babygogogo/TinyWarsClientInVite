import {
    Ui_Utils_UiHelpers,
    Graphics_Constants,
    Ui_Utils_UiSkinHelpers,
    Lang_Utils,
    Helpers_PointerInput,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Ui_Components_UiContainer,
    Ui_Types_UiSkinState,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Lang_Constants,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

export class UiButton extends Ui_Components_UiContainer.UiContainer implements Ui_Interfaces_IUiButton.IUiButton {
    private readonly _labelDisplay? : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgIcon?      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgRed?       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgExtra?     : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelExtra?   : Ui_Interfaces_IUiLabel.IUiLabel;

    private _shortSfxCode           = Sounds_Constants.ShortSfxCode.ButtonNeutral01;

    public constructor() {
        super();

        this.setIsTouchEnabled(true);
        this.setIsTouchChildrenEnabled(false);
        this.setMouseStyle(Helpers_PointerInput.MouseStyleType.Pointer);
        // this.setEnabled(true);

        {
            const agent = this.getEventAgent();
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Press,        this._onPointerPress,       this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseIn,    this._onPointerReleaseIn,   this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.ReleaseOut,   this._onPointerReleaseOut,  this);
            agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Tap,          this._onPointerTap,         this);
        }
        // TODO: 悬停和按下的视觉提示
    }

    public updateOnLoadedSkin(): void {
        this.setRedVisible(false);
        this.setImgExtraVisible(false);
    }
    public override loadSkinAttrs(oldSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined, newSkinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
        const icon          = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "icon");
        const label         = Ui_Utils_UiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "label");
        (icon.needChange)   && (this.setIconSource(icon.value ?? ""));
        (label.needChange)  && (this.setText(label.value ?? ""));

        Ui_Utils_UiSkinHelpers.commonLoadSkinAttrsForSizer(this, oldSkinAttrs, newSkinAttrs);
    }

    // /**
    //  * Switcher, which prevents all button events from firing if off.
    //  * @param {boolean} enabled
    //  */
    // public setEnabled(enabled: boolean): void {
    //     this.eventMode  = enabled ? 'static' : 'auto';
    //     this.cursor     = enabled ? 'pointer' : 'default';

    //     // TODO: ?
    //     // const buttonEvents = this.getButtonEvents();
    //     // if ((!enabled) && (buttonEvents.getGlobalDownPoint())) {
    //     //     buttonEvents._processUp();
    //     // }
    // }
    // public getEnabled(): boolean {
    //     return this.eventMode === 'static';
    // }

    public getIconSource(): string | undefined {
        return this._imgIcon?.getSource();
    }
    public setIconSource(source: string): void {
        this._imgIcon?.loadSource(source);
    }

    public getRedVisible(): boolean {
        return this._imgRed?.getIsVisible() ?? false;
    }
    public setRedVisible(visible: boolean): void {
        this._imgRed?.setIsVisible(visible);
    }

    public getImgExtraVisible(): boolean {
        return this._imgExtra?.getIsVisible() ?? false;
    }
    public setImgExtraVisible(visible: boolean): void {
        this._imgExtra?.setIsVisible(visible);
    }
    public setImgExtraSource(source: string): Promise<void> | void {
        const img = this._imgExtra;
        if (img != null) {
            return img.loadSource(source);
        }
    }

    public setTextColor(color: number): void {
        this._labelDisplay?.setTextColor(color);
    }

    public setText(text: string): void {
        this._labelDisplay?.setText(text);
    }
    public setLangText(langTextType: Lang_Constants.TextType, languageType?: Lang_Constants.LanguageType): void {
        this.setText(Lang_Utils.getText(langTextType, languageType));
    }

    public setExtraText(text: string): void {
        this._labelExtra?.setText(text);
    }
    public setExtraLangText(langTextType: Lang_Constants.TextType, languageType?: Lang_Constants.LanguageType): void {
        this.setExtraText(Lang_Utils.getText(langTextType, languageType));
    }

    public setShortSfxCode(code: Sounds_Constants.ShortSfxCode): void {
        this._shortSfxCode = code;
    }
    public getShortSfxCode(): Sounds_Constants.ShortSfxCode {
        return this._shortSfxCode;
    }

    private _onPointerPress(): void {
        this._updateViewOnButtonEvents(true);
    }
    private _onPointerReleaseIn(): void {
        this._updateViewOnButtonEvents(false);
    }
    private _onPointerReleaseOut(): void {
        this._updateViewOnButtonEvents(false);
    }
    private _onPointerTap(): void {
        Sounds_SoundPlayer.playShortSfx(this.getShortSfxCode());
    }

    private _updateViewOnButtonEvents(isDown: boolean): void {
        Ui_Utils_UiSkinHelpers.loadSkinStateRecursively(this, isDown ? Ui_Types_UiSkinState.UiSkinState.Down : Ui_Types_UiSkinState.UiSkinState.Up);
        if (isDown) {
            Ui_Utils_UiHelpers.changeColor(this, Graphics_Constants.ColorId.White, 50);
        } else {
            Ui_Utils_UiHelpers.changeColor(this, Graphics_Constants.ColorId.Origin);
        }
    }
}
