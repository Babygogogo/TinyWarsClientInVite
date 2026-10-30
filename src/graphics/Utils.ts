import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { getCurrentGameEssentialConfig } from "../gameVersions/Utils.ts";
import {
    TextureResolutionId,
    TextureResolutionConfigs,
} from "./Constants.ts";
import type { TextureResolutionConfig } from "./Types.ts";
import { getExisted } from "../helpers/Misc.ts";
import { Capabilities } from "../vendor/egret/Egret.ts";

export function checkIsWebGl(): boolean {
    return Capabilities.renderMode === "webgl";
}

export function getTextureResolutionConfig(typeId: TextureResolutionId): Undefinable<TextureResolutionConfig> {
    return TextureResolutionConfigs.get(typeId);
}
export function getCurrentTextureResolutionConfig(): TextureResolutionConfig {
    return getExisted(getTextureResolutionConfig(getCurrentGameEssentialConfig().textureResolutionTypeId));
}
