import type {
    TextType,
    LanguageType,
} from "../../lang/Constants.ts";

export interface UiRadioButtonData {
    titleTextType           : TextType;
    leftTextType            : TextType;
    leftLangType?           : LanguageType;
    rightTextType           : TextType;
    rightLangType?          : LanguageType;
    callbackOnLeft          : () => void;
    callbackOnRight         : () => void;
    checkerForLeftOn        : () => boolean;
}
