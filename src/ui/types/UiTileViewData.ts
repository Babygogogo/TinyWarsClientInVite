import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";

export interface UiTileViewData {
    gameConfig              : GameConfigs_GameConfig.GameConfig;
    tileBaseType            : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    tileBaseShapeId         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    tileDecorationType      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    tileDecorationShapeId   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    tileObjectType          : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    tileObjectShapeId       : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    skinId                  : number;
    overridingSkinId        : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}
