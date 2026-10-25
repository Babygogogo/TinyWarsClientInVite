import type { GameVersionConfig } from "./Types.ts";
import { TextureResolutionId } from "../graphics/Constants.ts";

// eslint-disable-next-line no-shadow
export const enum TypeName {
    Legacy      = "Legacy",
    Test        = "Test",
    Dor         = "Dor",
    TinyWars2   = "TinyWars2",
    Trilogy     = "Trilogy",
    Awbw        = "Awbw",
}

export const ConfigDict = new Map<TypeName, GameVersionConfig>([
    [TypeName.Legacy,    { clientUrl: "https://classic.tinywars.online",         serverUrl: "wss://ws_legacy.tinywars.online",   textureResolutionTypeId: TextureResolutionId.Dor }],
    [TypeName.Test,      { clientUrl: "https://experimental.tinywars.online",    serverUrl: "wss://ws_test.tinywars.online",     textureResolutionTypeId: TextureResolutionId.Dor }],
    [TypeName.Dor,       { clientUrl: "https://dor.tinywars.online",             serverUrl: "wss://ws_dor.tinywars.online",      textureResolutionTypeId: TextureResolutionId.Dor }],
    [TypeName.TinyWars2, { clientUrl: "https://tw2.tinywars.online",             serverUrl: "wss://ws_test2.tinywars.online",    textureResolutionTypeId: TextureResolutionId.Dor }],
    [TypeName.Trilogy,   { clientUrl: "https://trilogy.tinywars.online",         serverUrl: "wss://ws_trilogy.tinywars.online",  textureResolutionTypeId: TextureResolutionId.Trilogy }],
    [TypeName.Awbw,      { clientUrl: "https://awbw.amarriner.com/",             serverUrl: "",                                  textureResolutionTypeId: TextureResolutionId.Trilogy }],
]);
