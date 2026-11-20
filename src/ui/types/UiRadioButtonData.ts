import {
    type Lang_Constants,
    type Lang_TextType,
} from "../../internal.ts";

export interface UiRadioButtonData {
    titleTextType           : Lang_TextType.TextType;
    leftTextType            : Lang_TextType.TextType;
    leftLangType?           : Lang_Constants.LanguageType;
    rightTextType           : Lang_TextType.TextType;
    rightLangType?          : Lang_Constants.LanguageType;
    callbackOnLeft          : () => void;
    callbackOnRight         : () => void;
    checkerForLeftOn        : () => boolean;
}
