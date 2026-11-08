import {
    type Graphics_Types,
} from "../internal.ts";

 
export const enum ColorId {
    Origin,
    Gray,
    Dark,
    Red,
    Green,
    Blue,
    White,
    Yellow,
}

 
export const enum ColorValue {
    Red     = 0xFF0000,
    White   = 0xFFFFFF,
    Yellow  = 0xFFFF00,
    Green   = 0x00FF00,
    Dark    = 0xC9D3DF,
}

 
export const enum DisplayLayerId {
    Top,
    FloatText,  // FloatText
    Notify1,    // CommonAlertPanel, ...
    Notify0,    // CommonBroadcastPanel
    Hud3,
    Hud2,
    Hud1,
    Hud0,
    Scene,
    Bottom,
}

 
export const enum TextureResolutionId {
    Dor     = 1,
    Trilogy = 2,
}

export const TextureResolutionConfigs = new Map<TextureResolutionId, Graphics_Types.TextureResolutionConfig>([
    [TextureResolutionId.Dor,     {
        gridWidth  : 24,
        gridHeight : 24,

        imgUnitStateWidth  : 10,
        imgUnitStateHeight : 12,
    }],
    [TextureResolutionId.Trilogy, {
        gridWidth  : 48,
        gridHeight : 48,

        imgUnitStateWidth  : 24,
        imgUnitStateHeight : 24,
    }],
]);

 
export const enum TextureVersionId {
    V0  = 0,
    V1  = 1,
}

 
export const enum Tween {
    DefaultDuration     = 200,
}
