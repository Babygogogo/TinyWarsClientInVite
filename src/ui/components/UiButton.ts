import { ColorId } from "../../graphics/Constants.ts";
import {
    MouseStyleType,
    PointerEventType,
} from "../../helpers/PointerInput.ts";
import type {
    TextType,
    LanguageType,
} from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiContainer } from "./UiContainer.ts";
import type { IUiButton } from "../interfaces/IUiButton.ts";
import type { IUiImage } from "../interfaces/IUiImage.ts";
import type { IUiLabel } from "../interfaces/IUiLabel.ts";
import type { UiSkinAttrs } from "../types/UiSkinAttrs.ts";
import { UiSkinState } from "../types/UiSkinState.ts";
import { changeColor } from "../utils/UiHelpers.ts";
import {
    getRevisedAttrValue,
    commonLoadSkinAttrsForSizer,
    loadSkinStateRecursively,
} from "../utils/UiSkinHelpers.ts";

export class UiButton extends UiContainer implements IUiButton {
    private readonly _labelDisplay? : IUiLabel;
    private readonly _imgIcon?      : IUiImage;
    private readonly _imgRed?       : IUiImage;
    private readonly _imgExtra?     : IUiImage;
    private readonly _labelExtra?   : IUiLabel;

    private _shortSfxCode           = ShortSfxCode.ButtonNeutral01;

    public constructor() {
        super();

        this.setIsTouchEnabled(true);
        this.setIsTouchChildrenEnabled(false);
        this.setMouseStyle(MouseStyleType.Pointer);
        // this.setEnabled(true);

        {
            const agent = this.getEventAgent();
            agent.addPointerEventListener(PointerEventType.Press,        this._onPointerPress,       this);
            agent.addPointerEventListener(PointerEventType.ReleaseIn,    this._onPointerReleaseIn,   this);
            agent.addPointerEventListener(PointerEventType.ReleaseOut,   this._onPointerReleaseOut,  this);
            agent.addPointerEventListener(PointerEventType.Tap,          this._onPointerTap,         this);
        }
        // TODO: 悬停和按下的视觉提示
    }

    public updateOnLoadedSkin(): void {
        this.setRedVisible(false);
        this.setImgExtraVisible(false);
    }
    public override loadSkinAttrs(oldSkinAttrs: UiSkinAttrs | undefined, newSkinAttrs: UiSkinAttrs): void {
        const icon          = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "icon");
        const label         = getRevisedAttrValue(oldSkinAttrs, newSkinAttrs, "label");
        (icon.needChange)   && (this.setIconSource(icon.value ?? ""));
        (label.needChange)  && (this.setText(label.value ?? ""));

        commonLoadSkinAttrsForSizer(this, oldSkinAttrs, newSkinAttrs);
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
    public setLangText(langTextType: TextType, languageType?: LanguageType): void {
        this.setText(getText(langTextType, languageType));
    }

    public setExtraText(text: string): void {
        this._labelExtra?.setText(text);
    }
    public setExtraLangText(langTextType: TextType, languageType?: LanguageType): void {
        this.setExtraText(getText(langTextType, languageType));
    }

    public setShortSfxCode(code: ShortSfxCode): void {
        this._shortSfxCode = code;
    }
    public getShortSfxCode(): ShortSfxCode {
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
        playShortSfx(this.getShortSfxCode());
    }

    private _updateViewOnButtonEvents(isDown: boolean): void {
        loadSkinStateRecursively(this, isDown ? UiSkinState.Down : UiSkinState.Up);
        if (isDown) {
            changeColor(this, ColorId.White, 50);
        } else {
            changeColor(this, ColorId.Origin);
        }
    }
}
