import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { getCurrentGameEssentialConfig } from "../gameVersions/Utils.ts";
import { TextureResolutionId, TextureResolutionConfigs } from "./Constants.ts";
import type { TextureResolutionConfig as GraphicsTypesTextureResolutionConfig } from "./Types.ts";
import { getExisted } from "../helpers/Misc.ts";
import { Capabilities } from "../vendor/egret/Egret.ts";

type TextureResolutionConfig    = GraphicsTypesTextureResolutionConfig;
type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export function checkIsWebGl(): boolean {
    return Capabilities.renderMode === "webgl";
}

export function getTextureResolutionConfig(typeId: TextureResolutionId): Undefinable<TextureResolutionConfig> {
    return TextureResolutionConfigs.get(typeId);
}
export function getCurrentTextureResolutionConfig(): TextureResolutionConfig {
    return getExisted(getTextureResolutionConfig(getCurrentGameEssentialConfig().textureResolutionTypeId));
}
