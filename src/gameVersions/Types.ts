import type * as GraphicsConstants from "../graphics/Constants.ts";

export interface GameVersionConfig {
    clientUrl               : string;
    serverUrl               : string;
    textureResolutionTypeId : GraphicsConstants.TextureResolutionId;
}
