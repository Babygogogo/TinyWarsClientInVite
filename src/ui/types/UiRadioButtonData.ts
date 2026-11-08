import {
    type Lang_Constants,
} from "../../internal.ts";

export interface UiRadioButtonData {
    titleTextType           : Lang_Constants.TextType;
    leftTextType            : Lang_Constants.TextType;
    leftLangType?           : Lang_Constants.LanguageType;
    rightTextType           : Lang_Constants.TextType;
    rightLangType?          : Lang_Constants.LanguageType;
    callbackOnLeft          : () => void;
    callbackOnRight         : () => void;
    checkerForLeftOn        : () => boolean;
}
