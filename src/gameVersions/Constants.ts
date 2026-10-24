import type * as GameVersionsTypes from "./Types.ts";
import * as GraphicsConstants from "../graphics/Constants.ts";

// eslint-disable-next-line no-shadow
export const enum TypeName {
    Legacy      = "Legacy",
    Test        = "Test",
    Dor         = "Dor",
    TinyWars2   = "TinyWars2",
    Trilogy     = "Trilogy",
    Awbw        = "Awbw",
}

export const ConfigDict = new Map<TypeName, GameVersionsTypes.GameVersionConfig>([
    [TypeName.Legacy,    { clientUrl: "https://classic.tinywars.online",         serverUrl: "wss://ws_legacy.tinywars.online",   textureResolutionTypeId: GraphicsConstants.TextureResolutionId.Dor }],
    [TypeName.Test,      { clientUrl: "https://experimental.tinywars.online",    serverUrl: "wss://ws_test.tinywars.online",     textureResolutionTypeId: GraphicsConstants.TextureResolutionId.Dor }],
    [TypeName.Dor,       { clientUrl: "https://dor.tinywars.online",             serverUrl: "wss://ws_dor.tinywars.online",      textureResolutionTypeId: GraphicsConstants.TextureResolutionId.Dor }],
    [TypeName.TinyWars2, { clientUrl: "https://tw2.tinywars.online",             serverUrl: "wss://ws_test2.tinywars.online",    textureResolutionTypeId: GraphicsConstants.TextureResolutionId.Dor }],
    [TypeName.Trilogy,   { clientUrl: "https://trilogy.tinywars.online",         serverUrl: "wss://ws_trilogy.tinywars.online",  textureResolutionTypeId: GraphicsConstants.TextureResolutionId.Trilogy }],
    [TypeName.Awbw,      { clientUrl: "https://awbw.amarriner.com/",             serverUrl: "",                                  textureResolutionTypeId: GraphicsConstants.TextureResolutionId.Trilogy }],
]);
