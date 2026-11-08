import {
    type Ui_Types_UiComponentType,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

export interface UiSkin {
    id?             : string;
    uiType?         : Ui_Types_UiComponentType.UiComponentType;
    selfSkinName?   : string;
    currentState?   : string;
    nestedSkin?     : UiSkin;
    nestedSkinName? : string;
    itemSkin?       : UiSkin;
    itemSkinName?   : string;
    $?              : Record<string, Ui_Types_UiSkinAttrs.UiSkinAttrs>;
    $$?             : UiSkin[];
}
