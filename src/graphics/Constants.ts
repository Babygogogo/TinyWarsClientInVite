import {
    type Graphics_Types,
} from "../internal.ts";

// eslint-disable-next-line no-shadow
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

// eslint-disable-next-line no-shadow
export const enum ColorValue {
    Red     = 0xFF0000,
    White   = 0xFFFFFF,
    Yellow  = 0xFFFF00,
    Green   = 0x00FF00,
    Dark    = 0xC9D3DF,
}

// eslint-disable-next-line no-shadow
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

// eslint-disable-next-line no-shadow
export const enum TextureResolutionId {
    Dor     = 1,
    Trilogy = 2,
}

export const TextureResolutionConfigs = new Map<TextureResolutionId, Graphics_Types.TextureResolutionConfig>([
    [TextureResolutionId.Dor,     {
        gridWidth               : 24,
        gridHeight              : 24,

        imgUnitStateWidth       : 10,
        imgUnitStateHeight      : 12,
    }],
    [TextureResolutionId.Trilogy, {
        gridWidth               : 48,
        gridHeight              : 48,

        imgUnitStateWidth       : 24,
        imgUnitStateHeight      : 24,
    }],
]);

// eslint-disable-next-line no-shadow
export const enum TextureVersionId {
    V0  = 0,
    V1  = 1,
}

// eslint-disable-next-line no-shadow
export const enum Tween {
    DefaultDuration     = 200,
}
