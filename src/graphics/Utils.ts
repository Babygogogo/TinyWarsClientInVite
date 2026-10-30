import {
    Egret_Egret,
    GameVersions_Utils,
    Helpers_Misc,
    Graphics_Constants,
    type Graphics_Types,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export function checkIsWebGl(): boolean {
    return Egret_Egret.Capabilities.renderMode === "webgl";
}

export function getTextureResolutionConfig(typeId: Graphics_Constants.TextureResolutionId): AuxiliaryTypes_AuxiliaryTypes.Undefinable<Graphics_Types.TextureResolutionConfig> {
    return Graphics_Constants.TextureResolutionConfigs.get(typeId);
}
export function getCurrentTextureResolutionConfig(): Graphics_Types.TextureResolutionConfig {
    return Helpers_Misc.getExisted(getTextureResolutionConfig(GameVersions_Utils.getCurrentGameEssentialConfig().textureResolutionTypeId));
}
