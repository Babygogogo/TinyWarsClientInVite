import type { TextType, LanguageType } from "../../lang/Constants.ts";
import type { ShortSfxCode as SoundsConstantsShortSfxCode } from "../../sounds/Constants.ts";
import type { IUiContainer } from "./IUiContainer.ts";

type ShortSfxCode = SoundsConstantsShortSfxCode;

export interface IUiButton extends IUiContainer {
    getIconSource(): string | undefined;
    setIconSource(source: string): void;

    getRedVisible(): boolean;
    setRedVisible(visible: boolean): void;

    getImgExtraVisible(): boolean;
    setImgExtraVisible(visible: boolean): void;
    setImgExtraSource(source: string): Promise<void> | void;

    setTextColor(color: number): void;

    setText(text: string): void;
    setLangText(langTextType: TextType, languageType?: LanguageType): void;

    setExtraText(text: string): void;
    setExtraLangText(langTextType: TextType, languageType?: LanguageType): void;

    setShortSfxCode(code: ShortSfxCode): void;
    getShortSfxCode(): ShortSfxCode;
}
