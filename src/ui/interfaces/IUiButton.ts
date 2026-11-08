import {
    type Ui_Interfaces_IUiContainer,
    type Lang_Constants,
    type Sounds_Constants,
} from "../../internal.ts";

export interface IUiButton extends Ui_Interfaces_IUiContainer.IUiContainer {
    getIconSource(): string | undefined;
    setIconSource(source: string): void;

    getRedVisible(): boolean;
    setRedVisible(visible: boolean): void;

    getImgExtraVisible(): boolean;
    setImgExtraVisible(visible: boolean): void;
    setImgExtraSource(source: string): Promise<void> | void;

    setTextColor(color: number): void;

    setText(text: string): void;
    setLangText(langTextType: Lang_Constants.TextType, languageType?: Lang_Constants.LanguageType): void;

    setExtraText(text: string): void;
    setExtraLangText(langTextType: Lang_Constants.TextType, languageType?: Lang_Constants.LanguageType): void;

    setShortSfxCode(code: Sounds_Constants.ShortSfxCode): void;
    getShortSfxCode(): Sounds_Constants.ShortSfxCode;
}
