import {
    type Ui_Interfaces_IUiComponent,
    type Ui_Types_UiHorizontalAlign,
    type Ui_Types_UiVerticalAlign,
} from "../../internal.ts";

export interface IUiTextInput extends Ui_Interfaces_IUiComponent.IUiComponent {
    getText(): string;
    setText(text: string): void;
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
    getHorizontalAlign(): Ui_Types_UiHorizontalAlign.UiHorizontalAlign;
    setHorizontalAlign(align: Ui_Types_UiHorizontalAlign.UiHorizontalAlign): void;
    getVerticalAlign(): Ui_Types_UiVerticalAlign.UiVerticalAlign;
    setVerticalAlign(align: Ui_Types_UiVerticalAlign.UiVerticalAlign): void;

    focus(): void;
    blur(): void;
    select(): void;

    getDomPlaceholder(): string;
    setDomPlaceholder(text: string): void;
    getIsMultiline(): boolean;
    setIsMultiline(isMultiline: boolean): void;
    getMaxLength(): number | undefined;
    setMaxLength(maxLength: number | undefined): void;
    getRestrict(): RegExp | undefined;
    setRestrict(regex: string | RegExp | undefined): void;
    getIsDisplayAsPassword(): boolean;
    setIsDisplayAsPassword(asPassword: boolean): void;
}
