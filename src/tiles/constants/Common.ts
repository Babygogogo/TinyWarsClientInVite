import {
    type Tiles_Types,
} from "../../internal.ts";

 
export const enum TileTypeId {
    Plain               = 0,
    River               = 1,
    Sea                 = 2,
    Beach               = 3,
    Road                = 4,
    BridgeOnPlain       = 5,
    BridgeOnRiver       = 6,
    BridgeOnBeach       = 7,
    BridgeOnSea         = 8,
    Wood                = 9,
    Mountain            = 10,
    Wasteland           = 11,
    Ruins               = 12,
    Fire                = 13,
    Rough               = 14,
    MistOnSea           = 15,
    Reef                = 16,
    Plasma              = 17,
    GreenPlasma         = 18,
    Meteor              = 19,
    Silo                = 20,
    EmptySilo           = 21,
    Headquarters        = 22,
    City                = 23,
    CommandTower        = 24,
    Radar               = 25,
    Factory             = 26,
    Airport             = 27,
    Seaport             = 28,
    TempAirport         = 29,
    TempSeaport         = 30,
    MistOnPlain         = 31,
    MistOnRiver         = 32,
    MistOnBeach         = 33,
    Crystal             = 34,
    CustomCrystal       = 35,
    CannonUp            = 36,
    CannonDown          = 37,
    CannonLeft          = 38,
    CannonRight         = 39,
    CustomCannon        = 40,
    LaserTurret         = 41,
    CustomLaserTurret   = 42,
    PipeJoint           = 43,
    CustomBuilding      = 44,
    CustomPort          = 45,
    Portal              = 46,
}

 
export const enum CategoryId {
    None    = 0,
    All     = 1,
}

 
export const enum CustomName {
    MinId       = 1,
    MaxId       = 30,
    MinLength   = 1,
    MaxLength   = 15,
}

 
export const enum ThemeTypeId {
    Normal      = 0,
    Sandstorm   = 1,
    Snow        = 2,
    Rain        = 3,
}
export const AllThemeTypeIdArray = [
    ThemeTypeId.Normal,
    ThemeTypeId.Sandstorm,
    ThemeTypeId.Snow,
    ThemeTypeId.Rain,
];

////////////////////////////////////////////////////////////////////////////////////////////////////
 
export const enum BaseTypeId {
    Plain               = 1,
    River               = 2,
    Sea                 = 3,
    Beach               = 4,
}

export const BaseCfgDict = new Map<number, Tiles_Types.TileBaseCfg>([
    [ 0,                {
        tileBaseTypeId : 0,                    isEnabled : false,   isDefault : false,   shapesCount : 1,     animParams : [1, 999999],    animParamsForV0 : [1, 999999], 
    } ],
    [ BaseTypeId.Plain, {
        tileBaseTypeId : BaseTypeId.Plain,     isEnabled : true,    isDefault : true,    shapesCount : 1,     animParams : [1, 999999],    animParamsForV0 : [1, 999999], 
    } ],
    [ BaseTypeId.River, {
        tileBaseTypeId : BaseTypeId.River,     isEnabled : true,    isDefault : false,   shapesCount : 16,    animParams : [4, 2],         animParamsForV0 : [1, 999999], 
    } ],
    [ BaseTypeId.Sea,   {
        tileBaseTypeId : BaseTypeId.Sea,       isEnabled : true,    isDefault : false,   shapesCount : 16,    animParams : [6, 1],         animParamsForV0 : [6, 1], 
    }      ],
    [ BaseTypeId.Beach, {
        tileBaseTypeId : BaseTypeId.Beach,     isEnabled : true,    isDefault : false,   shapesCount : 40,    animParams : [6, 1],         animParamsForV0 : [6, 1], 
    }      ],
]);

export const BaseSymmetryCfgDict = new Map<number, Map<number, Tiles_Types.TileBaseSymmetryCfg>>([
    [1, new Map([
        [0,     { tileBaseTypeId : 1,  shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [2, new Map([
        [0,     { tileBaseTypeId : 2,  shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
        [1,     { tileBaseTypeId : 2,  shapeId : 1,     symmetryShapeIds : [1, 3, 2, 4, 2] }],
        [2,     { tileBaseTypeId : 2,  shapeId : 2,     symmetryShapeIds : [2, 4, 1, 3, 1] }],
        [3,     { tileBaseTypeId : 2,  shapeId : 3,     symmetryShapeIds : [4, 1, 3, 2, 4] }],
        [4,     { tileBaseTypeId : 2,  shapeId : 4,     symmetryShapeIds : [3, 2, 4, 1, 3] }],
        [5,     { tileBaseTypeId : 2,  shapeId : 5,     symmetryShapeIds : [5, 10, 5, 10, 5] }],
        [6,     { tileBaseTypeId : 2,  shapeId : 6,     symmetryShapeIds : [8, 6, 7, 9, 9] }],
        [7,     { tileBaseTypeId : 2,  shapeId : 7,     symmetryShapeIds : [9, 8, 6, 7, 8] }],
        [8,     { tileBaseTypeId : 2,  shapeId : 8,     symmetryShapeIds : [6, 7, 9, 8, 7] }],
        [9,     { tileBaseTypeId : 2,  shapeId : 9,     symmetryShapeIds : [7, 9, 8, 6, 6] }],
        [10,    { tileBaseTypeId : 2,  shapeId : 10,    symmetryShapeIds : [10, 5, 10, 5, 10] }],
        [11,    { tileBaseTypeId : 2,  shapeId : 11,    symmetryShapeIds : [12, 13, 11, 14, 12] }],
        [12,    { tileBaseTypeId : 2,  shapeId : 12,    symmetryShapeIds : [11, 14, 12, 13, 11] }],
        [13,    { tileBaseTypeId : 2,  shapeId : 13,    symmetryShapeIds : [13, 11, 14, 12, 14] }],
        [14,    { tileBaseTypeId : 2,  shapeId : 14,    symmetryShapeIds : [14, 12, 13, 11, 13] }],
        [15,    { tileBaseTypeId : 2,  shapeId : 15,    symmetryShapeIds : [15, 15, 15, 15, 15] }],
    ])],
    [3, new Map([
        [0,     { tileBaseTypeId : 3,  shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
        [1,     { tileBaseTypeId : 3,  shapeId : 1,     symmetryShapeIds : [1, 3, 2, 4, 2] }],
        [2,     { tileBaseTypeId : 3,  shapeId : 2,     symmetryShapeIds : [2, 4, 1, 3, 1] }],
        [3,     { tileBaseTypeId : 3,  shapeId : 3,     symmetryShapeIds : [4, 1, 3, 2, 4] }],
        [4,     { tileBaseTypeId : 3,  shapeId : 4,     symmetryShapeIds : [3, 2, 4, 1, 3] }],
        [5,     { tileBaseTypeId : 3,  shapeId : 5,     symmetryShapeIds : [5, 10, 5, 10, 5] }],
        [6,     { tileBaseTypeId : 3,  shapeId : 6,     symmetryShapeIds : [8, 6, 7, 9, 9] }],
        [7,     { tileBaseTypeId : 3,  shapeId : 7,     symmetryShapeIds : [9, 8, 6, 7, 8] }],
        [8,     { tileBaseTypeId : 3,  shapeId : 8,     symmetryShapeIds : [6, 7, 9, 8, 7] }],
        [9,     { tileBaseTypeId : 3,  shapeId : 9,     symmetryShapeIds : [7, 9, 8, 6, 6] }],
        [10,    { tileBaseTypeId : 3,  shapeId : 10,    symmetryShapeIds : [10, 5, 10, 5, 10] }],
        [11,    { tileBaseTypeId : 3,  shapeId : 11,    symmetryShapeIds : [12, 13, 11, 14, 12] }],
        [12,    { tileBaseTypeId : 3,  shapeId : 12,    symmetryShapeIds : [11, 14, 12, 13, 11] }],
        [13,    { tileBaseTypeId : 3,  shapeId : 13,    symmetryShapeIds : [13, 11, 14, 12, 14] }],
        [14,    { tileBaseTypeId : 3,  shapeId : 14,    symmetryShapeIds : [14, 12, 13, 11, 13] }],
        [15,    { tileBaseTypeId : 3,  shapeId : 15,    symmetryShapeIds : [15, 15, 15, 15, 15] }],
    ])],
    [4, new Map([
        [0,     { tileBaseTypeId : 4,  shapeId : 0,     symmetryShapeIds : [1, 2, 0, 3, 1] }],
        [1,     { tileBaseTypeId : 4,  shapeId : 1,     symmetryShapeIds : [0, 3, 1, 2, 0] }],
        [2,     { tileBaseTypeId : 4,  shapeId : 2,     symmetryShapeIds : [2, 0, 3, 1, 3] }],
        [3,     { tileBaseTypeId : 4,  shapeId : 3,     symmetryShapeIds : [3, 1, 2, 0, 2] }],
        [4,     { tileBaseTypeId : 4,  shapeId : 4,     symmetryShapeIds : [5, 6, 4, 7, 5] }],
        [5,     { tileBaseTypeId : 4,  shapeId : 5,     symmetryShapeIds : [4, 7, 5, 6, 4] }],
        [6,     { tileBaseTypeId : 4,  shapeId : 6,     symmetryShapeIds : [6, 4, 7, 5, 7] }],
        [7,     { tileBaseTypeId : 4,  shapeId : 7,     symmetryShapeIds : [7, 5, 6, 4, 6] }],
        [8,     { tileBaseTypeId : 4,  shapeId : 8,     symmetryShapeIds : [13, 14, 12, 15, 9] }],
        [9,     { tileBaseTypeId : 4,  shapeId : 9,     symmetryShapeIds : [12, 15, 13, 14, 8] }],
        [10,    { tileBaseTypeId : 4,  shapeId : 10,    symmetryShapeIds : [14, 12, 15, 13, 11] }],
        [11,    { tileBaseTypeId : 4,  shapeId : 11,    symmetryShapeIds : [15, 13, 14, 12, 10] }],
        [12,    { tileBaseTypeId : 4,  shapeId : 12,    symmetryShapeIds : [9, 10, 8, 11, 13] }],
        [13,    { tileBaseTypeId : 4,  shapeId : 13,    symmetryShapeIds : [8, 11, 9, 10, 12] }],
        [14,    { tileBaseTypeId : 4,  shapeId : 14,    symmetryShapeIds : [10, 8, 11, 9, 15] }],
        [15,    { tileBaseTypeId : 4,  shapeId : 15,    symmetryShapeIds : [11, 9, 10, 8, 14] }],
        [16,    { tileBaseTypeId : 4,  shapeId : 16,    symmetryShapeIds : [19, 16, 17, 18, 18] }],
        [17,    { tileBaseTypeId : 4,  shapeId : 17,    symmetryShapeIds : [18, 19, 16, 17, 19] }],
        [18,    { tileBaseTypeId : 4,  shapeId : 18,    symmetryShapeIds : [17, 18, 19, 16, 16] }],
        [19,    { tileBaseTypeId : 4,  shapeId : 19,    symmetryShapeIds : [16, 17, 18, 19, 17] }],
        [20,    { tileBaseTypeId : 4,  shapeId : 20,    symmetryShapeIds : [23, 20, 21, 22, 22] }],
        [21,    { tileBaseTypeId : 4,  shapeId : 21,    symmetryShapeIds : [22, 23, 20, 21, 23] }],
        [22,    { tileBaseTypeId : 4,  shapeId : 22,    symmetryShapeIds : [21, 22, 23, 20, 20] }],
        [23,    { tileBaseTypeId : 4,  shapeId : 23,    symmetryShapeIds : [20, 21, 22, 23, 21] }],
        [24,    { tileBaseTypeId : 4,  shapeId : 24,    symmetryShapeIds : [31, 28, 29, 30, 26] }],
        [25,    { tileBaseTypeId : 4,  shapeId : 25,    symmetryShapeIds : [30, 31, 28, 29, 27] }],
        [26,    { tileBaseTypeId : 4,  shapeId : 26,    symmetryShapeIds : [29, 30, 31, 28, 24] }],
        [27,    { tileBaseTypeId : 4,  shapeId : 27,    symmetryShapeIds : [28, 29, 30, 31, 25] }],
        [28,    { tileBaseTypeId : 4,  shapeId : 28,    symmetryShapeIds : [27, 24, 25, 26, 30] }],
        [29,    { tileBaseTypeId : 4,  shapeId : 29,    symmetryShapeIds : [26, 27, 24, 25, 31] }],
        [30,    { tileBaseTypeId : 4,  shapeId : 30,    symmetryShapeIds : [25, 26, 27, 24, 28] }],
        [31,    { tileBaseTypeId : 4,  shapeId : 31,    symmetryShapeIds : [24, 25, 26, 27, 29] }],
        [32,    { tileBaseTypeId : 4,  shapeId : 32,    symmetryShapeIds : [33, 34, 32, 35, 33] }],
        [33,    { tileBaseTypeId : 4,  shapeId : 33,    symmetryShapeIds : [32, 35, 33, 34, 32] }],
        [34,    { tileBaseTypeId : 4,  shapeId : 34,    symmetryShapeIds : [34, 32, 35, 33, 35] }],
        [35,    { tileBaseTypeId : 4,  shapeId : 35,    symmetryShapeIds : [35, 33, 34, 32, 34] }],
        [36,    { tileBaseTypeId : 4,  shapeId : 36,    symmetryShapeIds : [36, 36, 36, 36, 36] }],
        [37,    { tileBaseTypeId : 4,  shapeId : 37,    symmetryShapeIds : [37, 37, 37, 37, 37] }],
        [38,    { tileBaseTypeId : 4,  shapeId : 38,    symmetryShapeIds : [38, 39, 38, 39, 38] }],
        [39,    { tileBaseTypeId : 4,  shapeId : 39,    symmetryShapeIds : [39, 38, 39, 38, 39] }],
    ])],
]);

////////////////////////////////////////////////////////////////////////////////////////////////////
 
export const enum ObjectTypeId {
    Empty               = 0,
    Road                = 1,
    Bridge              = 2,
    Plasma              = 11,
    Meteor              = 12,
    Headquarters        = 15,
    CommandTower        = 17,
    Pipe                = 24,
    PipeJoint           = 34,
}

export const ObjectCfgDict = new Map<number, Tiles_Types.TileObjectCfg>([
    [0,     {
        tileObjectTypeId : 0,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 4,     shapesCountInEditor : 4,     shapesCountForV0 : 4,    shapesCountInEditorForV0 : 4,    sortWeight : 17,     nameTextId : 42000,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [0, 0, 0, 0, 0], 
    }],
    [1,     {
        tileObjectTypeId : 1,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 11,    shapesCountInEditor : 11,    shapesCountForV0 : 11,   shapesCountInEditorForV0 : 11,   sortWeight : 1,      nameTextId : 42001,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [1, 1, 1, 1, 1], 
    }],
    [2,     {
        tileObjectTypeId : 2,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 11,    shapesCountInEditor : 11,    shapesCountForV0 : 11,   shapesCountInEditorForV0 : 11,   sortWeight : 2,      nameTextId : 42002,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [2, 2, 2, 2, 2], 
    }],
    [3,     {
        tileObjectTypeId : 3,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 3,      nameTextId : 42003,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [3, 3, 3, 3, 3], 
    }],
    [4,     {
        tileObjectTypeId : 4,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 2,     shapesCountInEditor : 2,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 4,      nameTextId : 42004,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [4, 4, 4, 4, 4], 
    }],
    [5,     {
        tileObjectTypeId : 5,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 6,      nameTextId : 42005,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [5, 5, 5, 5, 5], 
    }],
    [6,     {
        tileObjectTypeId : 6,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 5,      nameTextId : 42006,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [6, 6, 6, 6, 6], 
    }],
    [7,     {
        tileObjectTypeId : 7,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 8,      nameTextId : 42007,  animParams : [5, 1],         animParamsForV0 : [5, 1],        symmetryTypes : [7, 7, 7, 7, 7], 
    }],
    [8,     {
        tileObjectTypeId : 8,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 12,     nameTextId : 42008,  animParams : [6, 1],         animParamsForV0 : [4, 1],        symmetryTypes : [8, 8, 8, 8, 8], 
    }],
    [9,     {
        tileObjectTypeId : 9,    shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 7,      nameTextId : 42009,  animParams : [5, 1],         animParamsForV0 : [1, 999999],   symmetryTypes : [9, 9, 9, 9, 9], 
    }],
    [10,    {
        tileObjectTypeId : 10,   shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 11,     nameTextId : 42010,  animParams : [6, 1],         animParamsForV0 : [6, 1],        symmetryTypes : [10, 10, 10, 10, 10], 
    }],
    [11,    {
        tileObjectTypeId : 11,   shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 30,    shapesCountInEditor : 30,    shapesCountForV0 : 16,   shapesCountInEditorForV0 : 16,   sortWeight : 14,     nameTextId : 42011,  animParams : [4, 1],         animParamsForV0 : [3, 1],        symmetryTypes : [11, 11, 11, 11, 11], 
    }],
    [12,    {
        tileObjectTypeId : 12,   shapeIdsAfterDestruction : [3],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 13,     nameTextId : 42012,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [12, 12, 12, 12, 12], 
    }],
    [13,    {
        tileObjectTypeId : 13,   shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 9,      nameTextId : 42013,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [13, 13, 13, 13, 13], 
    }],
    [14,    {
        tileObjectTypeId : 14,   shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 10,     nameTextId : 42014,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [14, 14, 14, 14, 14], 
    }],
    [15,    {
        tileObjectTypeId : 15,   shapeIdsAfterDestruction : [0],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 18,     nameTextId : 42015,  animParams : [2, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [15, 15, 15, 15, 15], 
    }],
    [16,    {
        tileObjectTypeId : 16,   shapeIdsAfterDestruction : [0],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 19,     nameTextId : 42016,  animParams : [2, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [16, 16, 16, 16, 16], 
    }],
    [17,    {
        tileObjectTypeId : 17,   shapeIdsAfterDestruction : [0],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 25,     nameTextId : 42017,  animParams : [2, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [17, 17, 17, 17, 17], 
    }],
    [18,    {
        tileObjectTypeId : 18,   shapeIdsAfterDestruction : [0],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 26,     nameTextId : 42018,  animParams : [2, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [18, 18, 18, 18, 18], 
    }],
    [19,    {
        tileObjectTypeId : 19,   shapeIdsAfterDestruction : [0],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 20,     nameTextId : 42019,  animParams : [4, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [19, 19, 19, 19, 19], 
    }],
    [20,    {
        tileObjectTypeId : 20,   shapeIdsAfterDestruction : [0],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 21,     nameTextId : 42020,  animParams : [2, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [20, 20, 20, 20, 20], 
    }],
    [21,    {
        tileObjectTypeId : 21,   shapeIdsAfterDestruction : [0],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 23,     nameTextId : 42021,  animParams : [2, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [21, 21, 21, 21, 21], 
    }],
    [22,    {
        tileObjectTypeId : 22,   shapeIdsAfterDestruction : [0],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 22,     nameTextId : 42022,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [22, 22, 22, 22, 22], 
    }],
    [23,    {
        tileObjectTypeId : 23,   shapeIdsAfterDestruction : [0],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 24,     nameTextId : 42023,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [23, 23, 23, 23, 23], 
    }],
    [24,    {
        tileObjectTypeId : 24,   shapeIdsAfterDestruction : [0],                isNeutralOnly : true,    shapesCount : 16,    shapesCountInEditor : 16,    shapesCountForV0 : 16,   shapesCountInEditorForV0 : 16,   sortWeight : 15,     nameTextId : 42024,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [24, 24, 24, 24, 24], 
    }],
    [25,    {
        tileObjectTypeId : 25,   shapeIdsAfterDestruction : [3],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 27,     nameTextId : 42025,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [25, 25, 25, 25, 25], 
    }],
    [26,    {
        tileObjectTypeId : 26,   shapeIdsAfterDestruction : [3],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 28,     nameTextId : 42026,  animParams : [2, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [26, 26, 26, 26, 26], 
    }],
    [27,    {
        tileObjectTypeId : 27,   shapeIdsAfterDestruction : [3],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 29,     nameTextId : 42027,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [28, 29, 27, 30, 28], 
    }],
    [28,    {
        tileObjectTypeId : 28,   shapeIdsAfterDestruction : [3],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 30,     nameTextId : 42028,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [27, 30, 28, 29, 27], 
    }],
    [29,    {
        tileObjectTypeId : 29,   shapeIdsAfterDestruction : [3],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 31,     nameTextId : 42029,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [29, 27, 30, 28, 30], 
    }],
    [30,    {
        tileObjectTypeId : 30,   shapeIdsAfterDestruction : [3],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 32,     nameTextId : 42030,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [30, 28, 29, 27, 29], 
    }],
    [31,    {
        tileObjectTypeId : 31,   shapeIdsAfterDestruction : [3],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 33,     nameTextId : 42031,  animParams : [4, 3],         animParamsForV0 : [8, 1],        symmetryTypes : [31, 31, 31, 31, 31], 
    }],
    [32,    {
        tileObjectTypeId : 32,   shapeIdsAfterDestruction : [3],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 34,     nameTextId : 42032,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [32, 32, 32, 32, 32], 
    }],
    [33,    {
        tileObjectTypeId : 33,   shapeIdsAfterDestruction : [3],                isNeutralOnly : false,   shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 35,     nameTextId : 42033,  animParams : [2, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [33, 33, 33, 33, 33], 
    }],
    [34,    {
        tileObjectTypeId : 34,   shapeIdsAfterDestruction : [0, 0, 1, 1, 2],    isNeutralOnly : true,    shapesCount : 2,     shapesCountInEditor : 2,     shapesCountForV0 : 2,    shapesCountInEditorForV0 : 2,    sortWeight : 16,     nameTextId : 42034,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [34, 34, 34, 34, 34], 
    }],
    [35,    {
        tileObjectTypeId : 35,   shapeIdsAfterDestruction : [0],	            isNeutralOnly : false,   shapesCount : 9,     shapesCountInEditor : 7,     shapesCountForV0 : 9,    shapesCountInEditorForV0 : 7,    sortWeight : 36,     nameTextId : 42035,  animParams : [4, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [35, 35, 35, 35, 35], 
    }],
    [36,    {
        tileObjectTypeId : 36,   shapeIdsAfterDestruction : [0],	            isNeutralOnly : false,   shapesCount : 2,     shapesCountInEditor : 2,     shapesCountForV0 : 2,    shapesCountInEditorForV0 : 2,    sortWeight : 37,     nameTextId : 42036,  animParams : [4, 3],         animParamsForV0 : [2, 3],        symmetryTypes : [36, 36, 36, 36, 36], 
    }],
    [37,    {
        tileObjectTypeId : 37,   shapeIdsAfterDestruction : [0],	            isNeutralOnly : true,    shapesCount : 1,     shapesCountInEditor : 1,     shapesCountForV0 : 1,    shapesCountInEditorForV0 : 1,    sortWeight : 38,     nameTextId : 42037,  animParams : [1, 999999],    animParamsForV0 : [1, 999999],   symmetryTypes : [37, 37, 37, 37, 37], 
    }],
]);

export const ObjectSymmetryCfgDict = new Map<number, Map<number, Tiles_Types.TileObjectSymmetryCfg>>([
    [0, new Map([
        [0,     { tileObjectTypeId : 0,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
        [1,     { tileObjectTypeId : 0,    shapeId : 1,     symmetryShapeIds : [1, 2, 1, 2, 1] }],
        [2,     { tileObjectTypeId : 0,    shapeId : 2,     symmetryShapeIds : [2, 1, 2, 1, 2] }],
        [3,     { tileObjectTypeId : 0,    shapeId : 3,     symmetryShapeIds : [3, 3, 3, 3, 3] }],
    ])],
    [1, new Map([
        [0,     { tileObjectTypeId : 1,    shapeId : 0,     symmetryShapeIds : [0, 1, 0, 1, 0] }],
        [1,     { tileObjectTypeId : 1,    shapeId : 1,     symmetryShapeIds : [1, 0, 1, 0, 1] }],
        [2,     { tileObjectTypeId : 1,    shapeId : 2,     symmetryShapeIds : [4, 2, 3, 5, 5] }],
        [3,     { tileObjectTypeId : 1,    shapeId : 3,     symmetryShapeIds : [5, 4, 2, 3, 4] }],
        [4,     { tileObjectTypeId : 1,    shapeId : 4,     symmetryShapeIds : [2, 3, 5, 4, 3] }],
        [5,     { tileObjectTypeId : 1,    shapeId : 5,     symmetryShapeIds : [3, 5, 4, 2, 2] }],
        [6,     { tileObjectTypeId : 1,    shapeId : 6,     symmetryShapeIds : [7, 8, 6, 9, 7] }],
        [7,     { tileObjectTypeId : 1,    shapeId : 7,     symmetryShapeIds : [6, 9, 7, 8, 6] }],
        [8,     { tileObjectTypeId : 1,    shapeId : 8,     symmetryShapeIds : [8, 6, 9, 7, 9] }],
        [9,     { tileObjectTypeId : 1,    shapeId : 9,     symmetryShapeIds : [9, 7, 8, 6, 8] }],
        [10,    { tileObjectTypeId : 1,    shapeId : 10,    symmetryShapeIds : [10, 10, 10, 10, 10] }],
    ])],
    [2, new Map([
        [0,     { tileObjectTypeId : 2,    shapeId : 0,     symmetryShapeIds : [0, 1, 0, 1, 0] }],
        [1,     { tileObjectTypeId : 2,    shapeId : 1,     symmetryShapeIds : [1, 0, 1, 0, 1] }],
        [2,     { tileObjectTypeId : 2,    shapeId : 2,     symmetryShapeIds : [4, 2, 3, 5, 5] }],
        [3,     { tileObjectTypeId : 2,    shapeId : 3,     symmetryShapeIds : [5, 4, 2, 3, 4] }],
        [4,     { tileObjectTypeId : 2,    shapeId : 4,     symmetryShapeIds : [2, 3, 5, 4, 3] }],
        [5,     { tileObjectTypeId : 2,    shapeId : 5,     symmetryShapeIds : [3, 5, 4, 2, 2] }],
        [6,     { tileObjectTypeId : 2,    shapeId : 6,     symmetryShapeIds : [7, 8, 6, 9, 7] }],
        [7,     { tileObjectTypeId : 2,    shapeId : 7,     symmetryShapeIds : [6, 9, 7, 8, 6] }],
        [8,     { tileObjectTypeId : 2,    shapeId : 8,     symmetryShapeIds : [8, 6, 9, 7, 9] }],
        [9,     { tileObjectTypeId : 2,    shapeId : 9,     symmetryShapeIds : [9, 7, 8, 6, 8] }],
        [10,    { tileObjectTypeId : 2,    shapeId : 10,    symmetryShapeIds : [10, 10, 10, 10, 10] }],
    ])],
    [3, new Map([
        [0,     { tileObjectTypeId : 3,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [4, new Map([
        [0,     { tileObjectTypeId : 4,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
        [1,     { tileObjectTypeId : 4,    shapeId : 1,     symmetryShapeIds : [1, 1, 1, 1, 1] }],
    ])],
    [5, new Map([
        [0,     { tileObjectTypeId : 5,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [6, new Map([
        [0,     { tileObjectTypeId : 6,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [7, new Map([
        [0,     { tileObjectTypeId : 7,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [8, new Map([
        [0,     { tileObjectTypeId : 8,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [9, new Map([
        [0,     { tileObjectTypeId : 9,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [10, new Map([
        [0,     { tileObjectTypeId : 10,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [11, new Map([
        [0,     { tileObjectTypeId : 11,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
        [1,     { tileObjectTypeId : 11,   shapeId : 1,     symmetryShapeIds : [3, 2, 1, 4, 3] }],
        [2,     { tileObjectTypeId : 11,   shapeId : 2,     symmetryShapeIds : [2, 1, 4, 3, 4] }],
        [3,     { tileObjectTypeId : 11,   shapeId : 3,     symmetryShapeIds : [1, 4, 3, 2, 1] }],
        [4,     { tileObjectTypeId : 11,   shapeId : 4,     symmetryShapeIds : [4, 3, 2, 1, 2] }],
        [5,     { tileObjectTypeId : 11,   shapeId : 5,     symmetryShapeIds : [7, 6, 5, 8, 7] }],
        [6,     { tileObjectTypeId : 11,   shapeId : 6,     symmetryShapeIds : [6, 5, 8, 7, 8] }],
        [7,     { tileObjectTypeId : 11,   shapeId : 7,     symmetryShapeIds : [5, 8, 7, 6, 5] }],
        [8,     { tileObjectTypeId : 11,   shapeId : 8,     symmetryShapeIds : [8, 7, 6, 5, 6] }],
        [9,     { tileObjectTypeId : 11,   shapeId : 9,     symmetryShapeIds : [10, 9, 12, 11, 11] }],
        [10,    { tileObjectTypeId : 11,   shapeId : 10,    symmetryShapeIds : [9, 12, 11, 10, 12] }],
        [11,    { tileObjectTypeId : 11,   shapeId : 11,    symmetryShapeIds : [12, 11, 10, 9, 9] }],
        [12,    { tileObjectTypeId : 11,   shapeId : 12,    symmetryShapeIds : [11, 10, 9, 12, 10] }],
        [13,    { tileObjectTypeId : 11,   shapeId : 13,    symmetryShapeIds : [13, 13, 13, 13, 13] }],
        [14,    { tileObjectTypeId : 11,   shapeId : 14,    symmetryShapeIds : [14, 15, 14, 15, 14] }],
        [15,    { tileObjectTypeId : 11,   shapeId : 15,    symmetryShapeIds : [15, 14, 15, 14, 15] }],
        [16,    { tileObjectTypeId : 11,   shapeId : 16,    symmetryShapeIds : [18, 19, 16, 17, 18] }],
        [17,    { tileObjectTypeId : 11,   shapeId : 17,    symmetryShapeIds : [17, 18, 19, 16, 19] }],
        [18,    { tileObjectTypeId : 11,   shapeId : 18,    symmetryShapeIds : [16, 17, 18, 19, 16] }],
        [19,    { tileObjectTypeId : 11,   shapeId : 19,    symmetryShapeIds : [19, 16, 17, 18, 17] }],
        [20,    { tileObjectTypeId : 11,   shapeId : 20,    symmetryShapeIds : [21, 23, 22, 20, 23] }],
        [21,    { tileObjectTypeId : 11,   shapeId : 21,    symmetryShapeIds : [20, 21, 23, 22, 22] }],
        [22,    { tileObjectTypeId : 11,   shapeId : 22,    symmetryShapeIds : [23, 22, 20, 21, 21] }],
        [23,    { tileObjectTypeId : 11,   shapeId : 23,    symmetryShapeIds : [22, 20, 21, 23, 20] }],
        [24,    { tileObjectTypeId : 11,   shapeId : 24,    symmetryShapeIds : [24, 25, 24, 25, 24] }],
        [25,    { tileObjectTypeId : 11,   shapeId : 25,    symmetryShapeIds : [25, 24, 25, 24, 25] }],
        [26,    { tileObjectTypeId : 11,   shapeId : 26,    symmetryShapeIds : [26, 27, 28, 29, 28] }],
        [27,    { tileObjectTypeId : 11,   shapeId : 27,    symmetryShapeIds : [29, 26, 27, 28, 29] }],
        [28,    { tileObjectTypeId : 11,   shapeId : 28,    symmetryShapeIds : [28, 29, 26, 27, 26] }],
        [29,    { tileObjectTypeId : 11,   shapeId : 29,    symmetryShapeIds : [27, 28, 29, 26, 27] }],
    ])],
    [12, new Map([
        [0,     { tileObjectTypeId : 12,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [13, new Map([
        [0,     { tileObjectTypeId : 13,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [14, new Map([
        [0,     { tileObjectTypeId : 14,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [15, new Map([
        [0,     { tileObjectTypeId : 15,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [16, new Map([
        [0,     { tileObjectTypeId : 16,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [17, new Map([
        [0,     { tileObjectTypeId : 17,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [18, new Map([
        [0,     { tileObjectTypeId : 18,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [19, new Map([
        [0,     { tileObjectTypeId : 19,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [20, new Map([
        [0,     { tileObjectTypeId : 20,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [21, new Map([
        [0,     { tileObjectTypeId : 21,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [22, new Map([
        [0,     { tileObjectTypeId : 22,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [23, new Map([
        [0,     { tileObjectTypeId : 23,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [24, new Map([
        [0,     { tileObjectTypeId : 24,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
        [1,     { tileObjectTypeId : 24,   shapeId : 1,     symmetryShapeIds : [3, 2, 1, 4, 3] }],
        [2,     { tileObjectTypeId : 24,   shapeId : 2,     symmetryShapeIds : [2, 1, 4, 3, 4] }],
        [3,     { tileObjectTypeId : 24,   shapeId : 3,     symmetryShapeIds : [1, 4, 3, 2, 1] }],
        [4,     { tileObjectTypeId : 24,   shapeId : 4,     symmetryShapeIds : [4, 3, 2, 1, 2] }],
        [5,     { tileObjectTypeId : 24,   shapeId : 5,     symmetryShapeIds : [7, 6, 5, 8, 7] }],
        [6,     { tileObjectTypeId : 24,   shapeId : 6,     symmetryShapeIds : [6, 5, 8, 7, 8] }],
        [7,     { tileObjectTypeId : 24,   shapeId : 7,     symmetryShapeIds : [5, 8, 7, 6, 5] }],
        [8,     { tileObjectTypeId : 24,   shapeId : 8,     symmetryShapeIds : [8, 7, 6, 5, 6] }],
        [9,     { tileObjectTypeId : 24,   shapeId : 9,     symmetryShapeIds : [10, 9, 12, 11, 11] }],
        [10,    { tileObjectTypeId : 24,   shapeId : 10,    symmetryShapeIds : [9, 12, 11, 10, 12] }],
        [11,    { tileObjectTypeId : 24,   shapeId : 11,    symmetryShapeIds : [12, 11, 10, 9, 9] }],
        [12,    { tileObjectTypeId : 24,   shapeId : 12,    symmetryShapeIds : [11, 10, 9, 12, 10] }],
        [13,    { tileObjectTypeId : 24,   shapeId : 13,    symmetryShapeIds : [13, 13, 13, 13, 13] }],
        [14,    { tileObjectTypeId : 24,   shapeId : 14,    symmetryShapeIds : [14, 15, 14, 15, 14] }],
        [15,    { tileObjectTypeId : 24,   shapeId : 15,    symmetryShapeIds : [15, 14, 15, 14, 15] }],
    ])],
    [25, new Map([
        [0,     { tileObjectTypeId : 25,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [26, new Map([
        [0,     { tileObjectTypeId : 26,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [27, new Map([
        [0,     { tileObjectTypeId : 27,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [28, new Map([
        [0,     { tileObjectTypeId : 28,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [29, new Map([
        [0,     { tileObjectTypeId : 29,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [30, new Map([
        [0,     { tileObjectTypeId : 30,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [31, new Map([
        [0,     { tileObjectTypeId : 31,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [32, new Map([
        [0,     { tileObjectTypeId : 32,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [33, new Map([
        [0,     { tileObjectTypeId : 33,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [34, new Map([
        [0,     { tileObjectTypeId : 34,   shapeId : 0,     symmetryShapeIds : [0, 1, 0, 1, 0] }],
        [1,     { tileObjectTypeId : 34,   shapeId : 1,     symmetryShapeIds : [1, 0, 1, 0, 1] }],
    ])],
    [35, new Map([
        [0,     { tileObjectTypeId : 35,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
        [1,     { tileObjectTypeId : 35,   shapeId : 1,     symmetryShapeIds : [1, 1, 1, 1, 1] }],
        [2,     { tileObjectTypeId : 35,   shapeId : 2,     symmetryShapeIds : [2, 2, 2, 2, 2] }],
        [3,     { tileObjectTypeId : 35,   shapeId : 3,     symmetryShapeIds : [3, 3, 3, 3, 3] }],
        [4,     { tileObjectTypeId : 35,   shapeId : 4,     symmetryShapeIds : [4, 4, 4, 4, 4] }],
        [5,     { tileObjectTypeId : 35,   shapeId : 5,     symmetryShapeIds : [5, 5, 5, 5, 5] }],
        [6,     { tileObjectTypeId : 35,   shapeId : 6,     symmetryShapeIds : [6, 6, 6, 6, 6] }],
        [7,     { tileObjectTypeId : 35,   shapeId : 7,     symmetryShapeIds : [7, 7, 7, 7, 7] }],
        [8,     { tileObjectTypeId : 35,   shapeId : 8,     symmetryShapeIds : [8, 8, 8, 8, 8] }],
    ])],
    [36, new Map([
        [0,     { tileObjectTypeId : 36,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
        [1,     { tileObjectTypeId : 36,   shapeId : 1,     symmetryShapeIds : [1, 1, 1, 1, 1] }],
    ])],
    [37, new Map([
        [0,     { tileObjectTypeId : 37,   shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
]);

////////////////////////////////////////////////////////////////////////////////////////////////////
 
export const enum DecorationTypeId {
    Empty               = 0,
    Shore               = 1,
}

export const DecorationCfgDict = new Map<number, Tiles_Types.TileDecorationCfg>([
    [DecorationTypeId.Empty,  {
        tileDecorationTypeId : DecorationTypeId.Empty,   shapesCount : 1,     animParams : [1, 999999],    animParamsForV0 : [1, 999999],   nameTextId : 43000, 
    } ],
    [DecorationTypeId.Shore,  {
        tileDecorationTypeId : DecorationTypeId.Shore,   shapesCount : 47,    animParams : [6, 1],         animParamsForV0 : [6, 1],        nameTextId : 43001, 
    } ],
]);

export const DecorationSymmetryCfgDict = new Map<number, Map<number, Tiles_Types.TileDecorationSymmetryCfg>>([
    [0, new Map([
        [0,     { tileDecorationTypeId : 1,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
    ])],
    [1, new Map([
        [0,     { tileDecorationTypeId : 1,    shapeId : 0,     symmetryShapeIds : [0, 0, 0, 0, 0] }],
        [1,     { tileDecorationTypeId : 1,    shapeId : 1,     symmetryShapeIds : [2, 1, 4, 8, 8] }],
        [2,     { tileDecorationTypeId : 1,    shapeId : 2,     symmetryShapeIds : [1, 4, 8, 2, 4] }],
        [3,     { tileDecorationTypeId : 1,    shapeId : 3,     symmetryShapeIds : [3, 5, 12, 10, 12] }],
        [4,     { tileDecorationTypeId : 1,    shapeId : 4,     symmetryShapeIds : [8, 2, 1, 4, 2] }],
        [5,     { tileDecorationTypeId : 1,    shapeId : 5,     symmetryShapeIds : [10, 3, 5, 12, 10] }],
        [6,     { tileDecorationTypeId : 1,    shapeId : 6,     symmetryShapeIds : [9, 6, 9, 6, 6] }],
        [7,     { tileDecorationTypeId : 1,    shapeId : 7,     symmetryShapeIds : [11, 7, 13, 14, 14] }],
        [8,     { tileDecorationTypeId : 1,    shapeId : 8,     symmetryShapeIds : [4, 8, 2, 1, 1] }],
        [9,     { tileDecorationTypeId : 1,    shapeId : 9,     symmetryShapeIds : [6, 9, 6, 9, 9] }],
        [10,    { tileDecorationTypeId : 1,    shapeId : 10,    symmetryShapeIds : [5, 12, 10, 3, 5] }],
        [11,    { tileDecorationTypeId : 1,    shapeId : 11,    symmetryShapeIds : [7, 13, 14, 11, 13] }],
        [12,    { tileDecorationTypeId : 1,    shapeId : 12,    symmetryShapeIds : [12, 10, 3, 5, 3] }],
        [13,    { tileDecorationTypeId : 1,    shapeId : 13,    symmetryShapeIds : [14, 11, 7, 13, 11] }],
        [14,    { tileDecorationTypeId : 1,    shapeId : 14,    symmetryShapeIds : [13, 14, 11, 7, 7] }],
        [15,    { tileDecorationTypeId : 1,    shapeId : 15,    symmetryShapeIds : [15, 15, 15, 15, 15] }],
        [16,    { tileDecorationTypeId : 1,    shapeId : 16,    symmetryShapeIds : [16, 25, 20, 34, 20] }],
        [17,    { tileDecorationTypeId : 1,    shapeId : 17,    symmetryShapeIds : [18, 26, 21, 36, 22] }],
        [18,    { tileDecorationTypeId : 1,    shapeId : 18,    symmetryShapeIds : [17, 27, 22, 35, 21] }],
        [19,    { tileDecorationTypeId : 1,    shapeId : 19,    symmetryShapeIds : [19, 28, 23, 37, 23] }],
        [20,    { tileDecorationTypeId : 1,    shapeId : 20,    symmetryShapeIds : [20, 34, 16, 25, 16] }],
        [21,    { tileDecorationTypeId : 1,    shapeId : 21,    symmetryShapeIds : [22, 35, 17, 27, 18] }],
        [22,    { tileDecorationTypeId : 1,    shapeId : 22,    symmetryShapeIds : [21, 36, 18, 26, 17] }],
        [23,    { tileDecorationTypeId : 1,    shapeId : 23,    symmetryShapeIds : [23, 37, 19, 28, 19] }],
        [24,    { tileDecorationTypeId : 1,    shapeId : 24,    symmetryShapeIds : [24, 43, 24, 43, 24] }],
        [25,    { tileDecorationTypeId : 1,    shapeId : 25,    symmetryShapeIds : [34, 16, 25, 20, 34] }],
        [26,    { tileDecorationTypeId : 1,    shapeId : 26,    symmetryShapeIds : [35, 17, 27, 22, 36] }],
        [27,    { tileDecorationTypeId : 1,    shapeId : 27,    symmetryShapeIds : [36, 18, 26, 21, 35] }],
        [28,    { tileDecorationTypeId : 1,    shapeId : 28,    symmetryShapeIds : [37, 19, 28, 23, 37] }],
        [29,    { tileDecorationTypeId : 1,    shapeId : 29,    symmetryShapeIds : [38, 29, 31, 40, 40] }],
        [30,    { tileDecorationTypeId : 1,    shapeId : 30,    symmetryShapeIds : [39, 30, 32, 41, 41] }],
        [31,    { tileDecorationTypeId : 1,    shapeId : 31,    symmetryShapeIds : [40, 38, 29, 31, 38] }],
        [32,    { tileDecorationTypeId : 1,    shapeId : 32,    symmetryShapeIds : [41, 39, 30, 32, 39] }],
        [33,    { tileDecorationTypeId : 1,    shapeId : 33,    symmetryShapeIds : [42, 44, 33, 45, 42] }],
        [34,    { tileDecorationTypeId : 1,    shapeId : 34,    symmetryShapeIds : [25, 20, 34, 16, 25] }],
        [35,    { tileDecorationTypeId : 1,    shapeId : 35,    symmetryShapeIds : [26, 21, 36, 18, 27] }],
        [36,    { tileDecorationTypeId : 1,    shapeId : 36,    symmetryShapeIds : [27, 22, 35, 17, 26] }],
        [37,    { tileDecorationTypeId : 1,    shapeId : 37,    symmetryShapeIds : [28, 23, 37, 19, 28] }],
        [38,    { tileDecorationTypeId : 1,    shapeId : 38,    symmetryShapeIds : [29, 31, 40, 38, 31] }],
        [39,    { tileDecorationTypeId : 1,    shapeId : 39,    symmetryShapeIds : [30, 32, 41, 39, 32] }],
        [40,    { tileDecorationTypeId : 1,    shapeId : 40,    symmetryShapeIds : [31, 40, 38, 29, 29] }],
        [41,    { tileDecorationTypeId : 1,    shapeId : 41,    symmetryShapeIds : [32, 41, 39, 30, 30] }],
        [42,    { tileDecorationTypeId : 1,    shapeId : 42,    symmetryShapeIds : [33, 45, 42, 44, 33] }],
        [43,    { tileDecorationTypeId : 1,    shapeId : 43,    symmetryShapeIds : [43, 24, 43, 24, 43] }],
        [44,    { tileDecorationTypeId : 1,    shapeId : 44,    symmetryShapeIds : [44, 33, 45, 42, 45] }],
        [45,    { tileDecorationTypeId : 1,    shapeId : 45,    symmetryShapeIds : [45, 42, 44, 33, 44] }],
        [46,    { tileDecorationTypeId : 1,    shapeId : 46,    symmetryShapeIds : [46, 46, 46, 46, 46] }],
    ])],
]);

////////////////////////////////////////////////////////////////////////////////////////////////////
interface AwbwTileMappingInfo {
    tileTypeId  : number;
    playerIndex : number;
}
export const AwbwTileMapping = new Map<number, AwbwTileMappingInfo>([
    [1,     { tileTypeId : TileTypeId.Plain,             playerIndex : 0 }],
    [2,     { tileTypeId : TileTypeId.Mountain,          playerIndex : 0 }],
    [3,     { tileTypeId : TileTypeId.Wood,              playerIndex : 0 }],
    [4,     { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [5,     { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [6,     { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [7,     { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [8,     { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [9,     { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [10,    { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [11,    { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [12,    { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [13,    { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [14,    { tileTypeId : TileTypeId.River,             playerIndex : 0 }],
    [15,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [16,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [17,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [18,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [19,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [20,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [21,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [22,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [23,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [24,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [25,    { tileTypeId : TileTypeId.Road,              playerIndex : 0 }],
    [26,    { tileTypeId : TileTypeId.BridgeOnPlain,     playerIndex : 0 }],
    [27,    { tileTypeId : TileTypeId.BridgeOnPlain,     playerIndex : 0 }],
    [28,    { tileTypeId : TileTypeId.Sea,               playerIndex : 0 }],
    [29,    { tileTypeId : TileTypeId.Beach,             playerIndex : 0 }],
    [30,    { tileTypeId : TileTypeId.Beach,             playerIndex : 0 }],
    [31,    { tileTypeId : TileTypeId.Beach,             playerIndex : 0 }],
    [32,    { tileTypeId : TileTypeId.Beach,             playerIndex : 0 }],
    [33,    { tileTypeId : TileTypeId.Reef,              playerIndex : 0 }],
    [34,    { tileTypeId : TileTypeId.City,              playerIndex : 0 }],  // neutral
    [35,    { tileTypeId : TileTypeId.Factory,           playerIndex : 0 }],
    [36,    { tileTypeId : TileTypeId.Airport,           playerIndex : 0 }],
    [37,    { tileTypeId : TileTypeId.Seaport,           playerIndex : 0 }],
    [38,    { tileTypeId : TileTypeId.City,              playerIndex : 1 }],  // orange star
    [39,    { tileTypeId : TileTypeId.Factory,           playerIndex : 1 }],
    [40,    { tileTypeId : TileTypeId.Airport,           playerIndex : 1 }],
    [41,    { tileTypeId : TileTypeId.Seaport,           playerIndex : 1 }],
    [42,    { tileTypeId : TileTypeId.Headquarters,      playerIndex : 1 }],
    [43,    { tileTypeId : TileTypeId.City,              playerIndex : 2 }],  // blue moon
    [44,    { tileTypeId : TileTypeId.Factory,           playerIndex : 2 }],
    [45,    { tileTypeId : TileTypeId.Airport,           playerIndex : 2 }],
    [46,    { tileTypeId : TileTypeId.Seaport,           playerIndex : 2 }],
    [47,    { tileTypeId : TileTypeId.Headquarters,      playerIndex : 2 }],
    [48,    { tileTypeId : TileTypeId.City,              playerIndex : 3 }],  // green earth
    [49,    { tileTypeId : TileTypeId.Factory,           playerIndex : 3 }],
    [50,    { tileTypeId : TileTypeId.Airport,           playerIndex : 3 }],
    [51,    { tileTypeId : TileTypeId.Seaport,           playerIndex : 3 }],
    [52,    { tileTypeId : TileTypeId.Headquarters,      playerIndex : 3 }],
    [53,    { tileTypeId : TileTypeId.City,              playerIndex : 4 }],  // yellow comet
    [54,    { tileTypeId : TileTypeId.Factory,           playerIndex : 4 }],
    [55,    { tileTypeId : TileTypeId.Airport,           playerIndex : 4 }],
    [56,    { tileTypeId : TileTypeId.Seaport,           playerIndex : 4 }],
    [57,    { tileTypeId : TileTypeId.Headquarters,      playerIndex : 4 }],

    [81,    { tileTypeId : TileTypeId.City,              playerIndex : 5 }],  // red fire
    [82,    { tileTypeId : TileTypeId.Factory,           playerIndex : 5 }],
    [83,    { tileTypeId : TileTypeId.Airport,           playerIndex : 5 }],
    [84,    { tileTypeId : TileTypeId.Seaport,           playerIndex : 5 }],
    [85,    { tileTypeId : TileTypeId.Headquarters,      playerIndex : 5 }],
    [86,    { tileTypeId : TileTypeId.City,              playerIndex : 6 }],  // grey sky
    [87,    { tileTypeId : TileTypeId.Factory,           playerIndex : 6 }],
    [88,    { tileTypeId : TileTypeId.Airport,           playerIndex : 6 }],
    [89,    { tileTypeId : TileTypeId.Seaport,           playerIndex : 6 }],
    [90,    { tileTypeId : TileTypeId.Headquarters,      playerIndex : 6 }],
    [91,    { tileTypeId : TileTypeId.City,              playerIndex : 7 }],  // black hole
    [92,    { tileTypeId : TileTypeId.Factory,           playerIndex : 7 }],
    [93,    { tileTypeId : TileTypeId.Airport,           playerIndex : 7 }],
    [94,    { tileTypeId : TileTypeId.Seaport,           playerIndex : 7 }],
    [95,    { tileTypeId : TileTypeId.Headquarters,      playerIndex : 7 }],
    [96,    { tileTypeId : TileTypeId.City,              playerIndex : 8 }],  // brown desert
    [97,    { tileTypeId : TileTypeId.Factory,           playerIndex : 8 }],
    [98,    { tileTypeId : TileTypeId.Airport,           playerIndex : 8 }],
    [99,    { tileTypeId : TileTypeId.Seaport,           playerIndex : 8 }],
    [100,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 8 }],
    [101,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [102,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [103,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [104,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [105,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [106,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [107,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [108,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [109,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [110,   { tileTypeId : TileTypeId.GreenPlasma,       playerIndex : 0 }],
    [111,   { tileTypeId : TileTypeId.Silo,              playerIndex : 0 }],
    [112,   { tileTypeId : TileTypeId.EmptySilo,         playerIndex : 0 }],
    [113,   { tileTypeId : TileTypeId.PipeJoint,         playerIndex : 0 }],
    [114,   { tileTypeId : TileTypeId.PipeJoint,         playerIndex : 0 }],
    [115,   { tileTypeId : TileTypeId.Plain,             playerIndex : 0 }],
    [116,   { tileTypeId : TileTypeId.Plain,             playerIndex : 0 }],
    [117,   { tileTypeId : TileTypeId.Airport,           playerIndex : 9 }],  // amber blossom
    [118,   { tileTypeId : TileTypeId.Factory,           playerIndex : 9 }],
    [119,   { tileTypeId : TileTypeId.City,              playerIndex : 9 }],
    [120,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 9 }],
    [121,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 9 }],
    [122,   { tileTypeId : TileTypeId.Airport,           playerIndex : 10 }], // jade sun
    [123,   { tileTypeId : TileTypeId.Factory,           playerIndex : 10 }],
    [124,   { tileTypeId : TileTypeId.City,              playerIndex : 10 }],
    [125,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 10 }],
    [126,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 10 }],
    [127,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 9 }],  // amber blossom
    [128,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 7 }],  // black hole
    [129,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 2 }],  // blue moon
    [130,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 8 }],  // brown desert
    [131,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 3 }],  // green earth
    [132,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 10 }], // jade sun
    [133,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 0 }],  // neutral
    [134,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 1 }],  // orange star
    [135,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 5 }],  // red fire
    [136,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 4 }],  // yellow comet
    [137,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 6 }],  // grey sky
    [138,   { tileTypeId : TileTypeId.Radar,             playerIndex : 9 }],  // amber blossom
    [139,   { tileTypeId : TileTypeId.Radar,             playerIndex : 7 }],  // black hole
    [140,   { tileTypeId : TileTypeId.Radar,             playerIndex : 2 }],  // blue moon
    [141,   { tileTypeId : TileTypeId.Radar,             playerIndex : 8 }],  // brown desert
    [142,   { tileTypeId : TileTypeId.Radar,             playerIndex : 3 }],  // green earth
    [143,   { tileTypeId : TileTypeId.Radar,             playerIndex : 10 }], // jade sun
    [144,   { tileTypeId : TileTypeId.Radar,             playerIndex : 0 }],  // neutral
    [145,   { tileTypeId : TileTypeId.Radar,             playerIndex : 1 }],  // orange star
    [146,   { tileTypeId : TileTypeId.Radar,             playerIndex : 5 }],  // red fire
    [147,   { tileTypeId : TileTypeId.Radar,             playerIndex : 4 }],  // yellow comet
    [148,   { tileTypeId : TileTypeId.Radar,             playerIndex : 6 }],  // grey sky
    [149,   { tileTypeId : TileTypeId.Airport,           playerIndex : 11 }], // cobalt ice
    [150,   { tileTypeId : TileTypeId.Factory,           playerIndex : 11 }],
    [151,   { tileTypeId : TileTypeId.City,              playerIndex : 11 }],
    [152,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 11 }],
    [153,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 11 }],
    [154,   { tileTypeId : TileTypeId.Radar,             playerIndex : 11 }],
    [155,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 11 }],
    [156,   { tileTypeId : TileTypeId.Airport,           playerIndex : 12 }], // pink cosmos
    [157,   { tileTypeId : TileTypeId.Factory,           playerIndex : 12 }],
    [158,   { tileTypeId : TileTypeId.City,              playerIndex : 12 }],
    [159,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 12 }],
    [160,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 12 }],
    [161,   { tileTypeId : TileTypeId.Radar,             playerIndex : 12 }],
    [162,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 12 }],
    [163,   { tileTypeId : TileTypeId.Airport,           playerIndex : 13 }], // teal galaxy
    [164,   { tileTypeId : TileTypeId.Factory,           playerIndex : 13 }],
    [165,   { tileTypeId : TileTypeId.City,              playerIndex : 13 }],
    [166,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 13 }],
    [167,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 13 }],
    [168,   { tileTypeId : TileTypeId.Radar,             playerIndex : 13 }],
    [169,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 13 }],
    [170,   { tileTypeId : TileTypeId.Airport,           playerIndex : 14 }], // purple lightning
    [171,   { tileTypeId : TileTypeId.Factory,           playerIndex : 14 }],
    [172,   { tileTypeId : TileTypeId.City,              playerIndex : 14 }],
    [173,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 14 }],
    [174,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 14 }],
    [175,   { tileTypeId : TileTypeId.Radar,             playerIndex : 14 }],
    [176,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 14 }],

    [181,   { tileTypeId : TileTypeId.Airport,           playerIndex : 15 }], // acid rain
    [182,   { tileTypeId : TileTypeId.Factory,           playerIndex : 15 }],
    [183,   { tileTypeId : TileTypeId.City,              playerIndex : 15 }],
    [184,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 15 }],
    [185,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 15 }],
    [186,   { tileTypeId : TileTypeId.Radar,             playerIndex : 15 }],
    [187,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 15 }],
    [188,   { tileTypeId : TileTypeId.Airport,           playerIndex : 16 }], // white nova
    [189,   { tileTypeId : TileTypeId.Factory,           playerIndex : 16 }],
    [190,   { tileTypeId : TileTypeId.City,              playerIndex : 16 }],
    [191,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 16 }],
    [192,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 16 }],
    [193,   { tileTypeId : TileTypeId.Radar,             playerIndex : 16 }],
    [194,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 16 }],
    [195,   { tileTypeId : TileTypeId.Portal,            playerIndex : 0 }],
    [196,   { tileTypeId : TileTypeId.Airport,           playerIndex : 17 }], // azure asteroid
    [197,   { tileTypeId : TileTypeId.Factory,           playerIndex : 17 }],
    [198,   { tileTypeId : TileTypeId.City,              playerIndex : 17 }],
    [199,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 17 }],
    [200,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 17 }],
    [201,   { tileTypeId : TileTypeId.Radar,             playerIndex : 17 }],
    [202,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 17 }],
    [203,   { tileTypeId : TileTypeId.Airport,           playerIndex : 18 }], // noir eclipse
    [204,   { tileTypeId : TileTypeId.Factory,           playerIndex : 18 }],
    [205,   { tileTypeId : TileTypeId.City,              playerIndex : 18 }],
    [206,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 18 }],
    [207,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 18 }],
    [208,   { tileTypeId : TileTypeId.Radar,             playerIndex : 18 }],
    [209,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 18 }],
    [210,   { tileTypeId : TileTypeId.Airport,           playerIndex : 19 }], // silver claw
    [211,   { tileTypeId : TileTypeId.Factory,           playerIndex : 19 }],
    [212,   { tileTypeId : TileTypeId.City,              playerIndex : 19 }],
    [213,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 19 }],
    [214,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 19 }],
    [215,   { tileTypeId : TileTypeId.Radar,             playerIndex : 19 }],
    [216,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 19 }],
    [217,   { tileTypeId : TileTypeId.Airport,           playerIndex : 20 }], // umber wilds
    [218,   { tileTypeId : TileTypeId.Factory,           playerIndex : 20 }],
    [219,   { tileTypeId : TileTypeId.City,              playerIndex : 20 }],
    [220,   { tileTypeId : TileTypeId.CommandTower,      playerIndex : 20 }],
    [221,   { tileTypeId : TileTypeId.Headquarters,      playerIndex : 20 }],
    [222,   { tileTypeId : TileTypeId.Radar,             playerIndex : 20 }],
    [223,   { tileTypeId : TileTypeId.Seaport,           playerIndex : 20 }],
]);

////////////////////////////////////////////////////////////////////////////////////////////////////
 
export const enum InfoTypeId {
    DefenseBonus,
    Income,
    Vision,
    HideUnitCategory,
    IsDefeatedOnCapture,
    ProduceUnitCategory,
    GlobalBonus,
    RepairUnitCategory,
    Hp,
    CapturePoint,
    BuildPoint,
    IsHighlighted,
    Buff,
    BlockEnemyUnit,
    CoBoardUnit,

    CrystalRadius,
    CrystalPriority,
    CrystalCanAffectSelf,
    CrystalCanAffectAlly,
    CrystalCanAffectEnemy,
    CrystalDeltaFund,
    CrystalDeltaEnergyPercentage,
    CrystalDeltaHp,
    CrystalDeltaFuelPercentage,
    CrystalDeltaPrimaryAmmoPercentage,

    CannonRangeForLeft,
    CannonRangeForRight,
    CannonRangeForUp,
    CannonRangeForDown,
    CannonPriority,
    CannonMaxTargetCount,
    CannonCanAffectSelf,
    CannonCanAffectAlly,
    CannonCanAffectEnemy,
    CannonDeltaHp,
    CannonDeltaFuelPercentage,
    CannonDeltaPrimaryAmmoPercentage,

    LaserTurretRangeForLeft,
    LaserTurretRangeForRight,
    LaserTurretRangeForUp,
    LaserTurretRangeForDown,
    LaserTurretPriority,
    LaserTurretCanAffectSelf,
    LaserTurretCanAffectAlly,
    LaserTurretCanAffectEnemy,
    LaserTurretDeltaHp,
    LaserTurretDeltaFuelPercentage,
    LaserTurretDeltaPrimaryAmmoPercentage,
}
