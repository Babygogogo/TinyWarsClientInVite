import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";

export interface UiTileViewData {
    gameConfig              : GameConfigGcData.GcData;
    tileBaseType            : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    tileBaseShapeId         : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    tileDecorationType      : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    tileDecorationShapeId   : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    tileObjectType          : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    tileObjectShapeId       : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    skinId                  : number;
    overridingSkinId        : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
}
