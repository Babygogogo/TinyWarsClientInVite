import { type GameVersions_Constants } from "./internal.ts";

declare global {
    interface Window {
        readonly CLIENT_VERSION             : string;
        readonly GAME_VERSION               : GameVersions_Constants.TypeName;
        readonly RES_HASH_DICT_PATH?        : string;
        readonly TEXT_INPUT_CONTAINER       : HTMLDivElement;
        readonly TRANSPARENT_TOUCH_LAYER    : HTMLDivElement;
        readonly TW_APK_INJECT?             : {
            getScreenOrientation    : () => number;
            setScreenOrientation    : (orientation: number) => void;
        };
        browser?                            : any;
        readonly JSONParseClass             : {
            setData : (data: any) => void;
        };
    }
}
