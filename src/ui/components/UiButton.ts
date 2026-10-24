import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersPointerInput from "../../helpers/PointerInput.ts";
import type * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiContainer from "./UiContainer.ts";
import type * as UiInterfacesIUiButton from "../interfaces/IUiButton.ts";
import type * as UiInterfacesIUiImage from "../interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../interfaces/IUiLabel.ts";
import type * as UiTypesUiSkinAttrs from "../types/UiSkinAttrs.ts";
import * as UiTypesUiSkinState from "../types/UiSkinState.ts";
import * as UiUtilsUiHelpers from "../utils/UiHelpers.ts";
import * as UiUtilsUiSkinHelpers from "../utils/UiSkinHelpers.ts";

type UiSkinAttrs    = UiTypesUiSkinAttrs.UiSkinAttrs;

export class UiButton extends UiComponentsUiContainer.UiContainer implements UiInterfacesIUiButton.IUiButton {
    private readonly _labelDisplay? : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgIcon?      : UiInterfacesIUiImage.IUiImage;
    private readonly _imgRed?       : UiInterfacesIUiImage.IUiImage;
    private readonly _imgExtra?     : UiInterfacesIUiImage.IUiImage;
    private readonly _labelExtra?   : UiInterfacesIUiLabel.IUiLabel;

    private _shortSfxCode           = SoundsConstants.ShortSfxCode.ButtonNeutral01;

    public constructor() {
        super();

        this.setIsTouchEnabled(true);
        this.setIsTouchChildrenEnabled(false);
        this.setMouseStyle(HelpersPointerInput.MouseStyleType.Pointer);
        // this.setEnabled(true);

        {
            const agent = this.getEventAgent();
            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.Press,        this._onPointerPress,       this);
            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.ReleaseIn,    this._onPointerReleaseIn,   this);
            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.ReleaseOut,   this._onPointerReleaseOut,  this);
            agent.addPointerEventListener(HelpersPointerInput.PointerEventType.Tap,          this._onPointerTap,         this);
        }
        // TODO: 悬停和按下的视觉提示
    }

    public updateOnLoadedSkin(): void {
        this.setRedVisible(false);
        this.setImgExtraVisible(false);
    }
    public override loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
        const icon          = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "icon");
        const label         = UiUtilsUiSkinHelpers.getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "label");
        (icon.needChange)   && (this.setIconSource(icon.value ?? ""));
        (label.needChange)  && (this.setText(label.value ?? ""));

        UiUtilsUiSkinHelpers.commonLoadSkinAttrsForSizer(this, oldSkinAttrs, newSkinAttrs);
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
    public setLangText(langTextType: LangConstants.TextType, languageType?: LangConstants.LanguageType): void {
        this.setText(LangUtils.getText(langTextType, languageType));
    }

    public setExtraText(text: string): void {
        this._labelExtra?.setText(text);
    }
    public setExtraLangText(langTextType: LangConstants.TextType, languageType?: LangConstants.LanguageType): void {
        this.setExtraText(LangUtils.getText(langTextType, languageType));
    }

    public setShortSfxCode(code: SoundsConstants.ShortSfxCode): void {
        this._shortSfxCode = code;
    }
    public getShortSfxCode(): SoundsConstants.ShortSfxCode {
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
        SoundsSoundPlayer.playShortSfx(this.getShortSfxCode());
    }

    private _updateViewOnButtonEvents(isDown: boolean): void {
        UiUtilsUiSkinHelpers.loadSkinStateRecursively(this, isDown ? UiTypesUiSkinState.UiSkinState.Down : UiTypesUiSkinState.UiSkinState.Up);
        if (isDown) {
            UiUtilsUiHelpers.changeColor(this, GraphicsConstants.ColorId.White, 50);
        } else {
            UiUtilsUiHelpers.changeColor(this, GraphicsConstants.ColorId.Origin);
        }
    }
}
