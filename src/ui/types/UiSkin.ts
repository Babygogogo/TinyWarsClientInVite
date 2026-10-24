import type * as UiTypesUiComponentType from "./UiComponentType.ts";
import type * as UiTypesUiSkinAttrs from "./UiSkinAttrs.ts";

export interface UiSkin {
    id?             : string;
    uiType?         : UiTypesUiComponentType.UiComponentType;
    selfSkinName?   : string;
    currentState?   : string;
    nestedSkin?     : UiSkin;
    nestedSkinName? : string;
    itemSkin?       : UiSkin;
    itemSkinName?   : string;
    $?              : Record<string, UiTypesUiSkinAttrs.UiSkinAttrs>;
    $$?             : UiSkin[];
}
