import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as GameVersionsUtils from "../gameVersions/Utils.ts";
import * as GraphicsConstants from "./Constants.ts";
import type * as GraphicsTypes from "./Types.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as VendorEgretEgret from "../vendor/egret/Egret.ts";

type TextureResolutionConfig    = GraphicsTypes.TextureResolutionConfig;
type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function checkIsWebGl(): boolean {
    return VendorEgretEgret.Capabilities.renderMode === "webgl";
}

export function getTextureResolutionConfig(typeId: GraphicsConstants.TextureResolutionId): Undefinable<TextureResolutionConfig> {
    return GraphicsConstants.TextureResolutionConfigs.get(typeId);
}
export function getCurrentTextureResolutionConfig(): TextureResolutionConfig {
    return HelpersMisc.getExisted(getTextureResolutionConfig(GameVersionsUtils.getCurrentGameEssentialConfig().textureResolutionTypeId));
}
