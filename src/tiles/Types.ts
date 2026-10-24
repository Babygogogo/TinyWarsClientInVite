

export type TileBaseCfg = {
    tileBaseTypeId      : number;
    isEnabled           : boolean;
    isDefault           : boolean;
    shapesCount         : number;
    animParams          : number[];
    animParamsForV0     : number[];
};
export type TileBaseSymmetryCfg = {
    tileBaseTypeId      : number;
    shapeId             : number;
    symmetryShapeIds    : number[];
};
export type TileObjectSymmetryCfg = {
    tileObjectTypeId        : number;
    shapeId                 : number;
    symmetryShapeIds        : number[];
};
export type TileObjectCfg = {
    tileObjectTypeId            : number;
    shapeIdsAfterDestruction    : number[];
    isNeutralOnly               : boolean;
    shapesCount                 : number;
    shapesCountInEditor         : number;
    shapesCountForV0            : number;
    shapesCountInEditorForV0    : number;
    sortWeight                  : number;
    nameTextId                  : number;
    animParams                  : number[];
    animParamsForV0             : number[];
    symmetryTypes               : number[];
};
export type TileDecorationCfg = {
    tileDecorationTypeId    : number;
    shapesCount             : number;
    nameTextId              : number;
    animParams              : number[];
    animParamsForV0         : number[];
};
export type TileDecorationSymmetryCfg = {
    tileDecorationTypeId    : number;
    shapeId                 : number;
    symmetryShapeIds        : number[];
};
