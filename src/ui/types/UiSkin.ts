import type { UiComponentType } from "./UiComponentType.ts";
import type { UiSkinAttrs } from "./UiSkinAttrs.ts";

export interface UiSkin {
    id?             : string;
    uiType?         : UiComponentType;
    selfSkinName?   : string;
    currentState?   : string;
    nestedSkin?     : UiSkin;
    nestedSkinName? : string;
    itemSkin?       : UiSkin;
    itemSkinName?   : string;
    $?              : Record<string, UiSkinAttrs>;
    $$?             : UiSkin[];
}
