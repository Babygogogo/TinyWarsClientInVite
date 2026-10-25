import type { TextType, LanguageType } from "../../lang/Constants.ts";
import type { IUiComponent } from "./IUiComponent.ts";
import type { UiHorizontalAlign } from "../types/UiHorizontalAlign.ts";
import type { UiVerticalAlign } from "../types/UiVerticalAlign.ts";

export interface IUiLabel extends IUiComponent {
    getText(): string;
    setText(text: string): void;
    setLangText(langTextType: TextType, languageType?: LanguageType): void;
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
    getHorizontalAlign(): UiHorizontalAlign;
    setHorizontalAlign(align: UiHorizontalAlign): void;
    getVerticalAlign(): UiVerticalAlign;
    setVerticalAlign(align: UiVerticalAlign): void;

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
