import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";

export interface UiTileViewData {
    gameConfig              : GcData;
    tileBaseType            : Undefinable<number>;
    tileBaseShapeId         : Undefinable<number>;
    tileDecorationType      : Undefinable<number>;
    tileDecorationShapeId   : Undefinable<number>;
    tileObjectType          : Undefinable<number>;
    tileObjectShapeId       : Undefinable<number>;
    skinId                  : number;
    overridingSkinId        : Undefinable<number>;
}
