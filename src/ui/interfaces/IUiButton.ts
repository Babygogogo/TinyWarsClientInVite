import type * as LangConstants from "../../lang/Constants.ts";
import type * as SoundsConstants from "../../sounds/Constants.ts";
import type * as UiInterfacesIUiContainer from "./IUiContainer.ts";

type ShortSfxCode = SoundsConstants.ShortSfxCode;

export interface IUiButton extends UiInterfacesIUiContainer.IUiContainer {
    getIconSource(): string | undefined;
    setIconSource(source: string): void;

    getRedVisible(): boolean;
    setRedVisible(visible: boolean): void;

    getImgExtraVisible(): boolean;
    setImgExtraVisible(visible: boolean): void;
    setImgExtraSource(source: string): Promise<void> | void;

    setTextColor(color: number): void;

    setText(text: string): void;
    setLangText(langTextType: LangConstants.TextType, languageType?: LangConstants.LanguageType): void;

    setExtraText(text: string): void;
    setExtraLangText(langTextType: LangConstants.TextType, languageType?: LangConstants.LanguageType): void;

    setShortSfxCode(code: ShortSfxCode): void;
    getShortSfxCode(): ShortSfxCode;
}
