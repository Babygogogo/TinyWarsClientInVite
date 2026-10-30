import {
    type Ui_Interfaces_IUiComponent,
    type Lang_Constants,
    type Ui_Types_UiHorizontalAlign,
    type Ui_Types_UiVerticalAlign,
} from "../../internal.ts";

export interface IUiLabel extends Ui_Interfaces_IUiComponent.IUiComponent {
    getText(): string;
    setText(text: string): void;
    setLangText(langTextType: Lang_Constants.TextType, languageType?: Lang_Constants.LanguageType): void;
    getFontFamily(): string;
    setFontFamily(fontFamily: string): void;
    getFontSize(): number;
    setFontSize(size: number): void;
    getTextColor(): number;
    setTextColor(color: number): void;
    getIsItalic(): boolean;
    setIsItalic(isItalic: boolean): void;
    getIsBold(): boolean;
    setIsBold(isBold: boolean): void;
    getLineSpacing(): number;
    setLineSpacing(spacing: number): void;
    getStrokeWidth(): number;
    setStrokeWidth(width: number): void;
    getStrokeColor(): number;
    setStrokeColor(color: number): void;
    getAutoShrinkWidth(): number | undefined;
    setAutoShrinkWidth(width: number | undefined): void;
    getAutoShrinkHeight(): number | undefined;
    setAutoShrinkHeight(height: number | undefined): void;
    getHorizontalAlign(): Ui_Types_UiHorizontalAlign.UiHorizontalAlign;
    setHorizontalAlign(align: Ui_Types_UiHorizontalAlign.UiHorizontalAlign): void;
    getVerticalAlign(): Ui_Types_UiVerticalAlign.UiVerticalAlign;
    setVerticalAlign(align: Ui_Types_UiVerticalAlign.UiVerticalAlign): void;

    /** 仅用于配合tween */
    get customX(): number;
    /** 仅用于配合tween */
    set customX(value: number);
    /** 仅用于配合tween */
    get customY(): number;
    /** 仅用于配合tween */
    set customY(value: number);
    /** 仅用于配合tween */
    get customAlpha(): number;
    /** 仅用于配合tween */
    set customAlpha(value: number);
}
