import {
    type Graphics_Constants,
} from "../internal.ts";

export interface GameVersionConfig {
    clientUrl               : string;
    serverUrl               : string;
    textureResolutionTypeId : Graphics_Constants.TextureResolutionId;
}
