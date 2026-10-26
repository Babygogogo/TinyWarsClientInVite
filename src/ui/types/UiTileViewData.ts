import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";

export interface UiTileViewData {
    gameConfig              : GameConfig;
    tileBaseType            : Undefinable<number>;
    tileBaseShapeId         : Undefinable<number>;
    tileDecorationType      : Undefinable<number>;
    tileDecorationShapeId   : Undefinable<number>;
    tileObjectType          : Undefinable<number>;
    tileObjectShapeId       : Undefinable<number>;
    skinId                  : number;
    overridingSkinId        : Undefinable<number>;
}
