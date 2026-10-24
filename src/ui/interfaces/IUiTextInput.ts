import type * as UiInterfacesIUiComponent from "./IUiComponent.ts";
import type * as UiTypesUiHorizontalAlign from "../types/UiHorizontalAlign.ts";
import type * as UiTypesUiVerticalAlign from "../types/UiVerticalAlign.ts";

type UiHorizontalAlign  = UiTypesUiHorizontalAlign.UiHorizontalAlign;
type UiVerticalAlign    = UiTypesUiVerticalAlign.UiVerticalAlign;

export interface IUiTextInput extends UiInterfacesIUiComponent.IUiComponent {
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
    getHorizontalAlign(): UiHorizontalAlign;
    setHorizontalAlign(align: UiHorizontalAlign): void;
    getVerticalAlign(): UiVerticalAlign;
    setVerticalAlign(align: UiVerticalAlign): void;

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
