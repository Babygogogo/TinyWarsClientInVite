import type { TextureResolutionId } from "../graphics/Constants.ts";

export interface GameVersionConfig {
    clientUrl               : string;
    serverUrl               : string;
    textureResolutionTypeId : TextureResolutionId;
}
