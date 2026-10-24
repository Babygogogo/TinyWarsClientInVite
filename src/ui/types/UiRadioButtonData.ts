import type * as LangConstants from "../../lang/Constants.ts";

export interface UiRadioButtonData {
    titleTextType           : LangConstants.TextType;
    leftTextType            : LangConstants.TextType;
    leftLangType?           : LangConstants.LanguageType;
    rightTextType           : LangConstants.TextType;
    rightLangType?          : LangConstants.LanguageType;
    callbackOnLeft          : () => void;
    callbackOnRight         : () => void;
    checkerForLeftOn        : () => boolean;
}
