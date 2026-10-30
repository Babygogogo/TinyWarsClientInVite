import {
    Helpers_Misc,
    Tiles_Constants_Common,
    Players_Constants,
    type Geometries_Constants,
    type Tiles_Types,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export function getTileObjectCfg(tileObjectType: number): Tiles_Types.TileObjectCfg | null {
    return Tiles_Constants_Common.ObjectCfgDict.get(tileObjectType) ?? null;
}

export function checkIsValidTileObjectType(tileObjectType: number): boolean {
    return Tiles_Constants_Common.ObjectCfgDict.has(tileObjectType);
}

export function getAllTileObjectCfgArray(): Tiles_Types.TileObjectCfg[] {
    return [...Tiles_Constants_Common.ObjectCfgDict]
        .sort((v1, v2) => v1[1].sortWeight - v2[1].sortWeight)
        .map(v => v[1]);
}

export function checkIsValidPlayerIndexForTileObject({ playerIndex, tileObjectType }: {
        playerIndex     : number;
        tileObjectType  : number;
    }): boolean {
    const cfg = getTileObjectCfg(tileObjectType);
    return (cfg != null)
        && (playerIndex >= Players_Constants.PlayerIndex.Neutral)
        && (playerIndex <= Players_Constants.PlayerIndex.Max)
        && ((!cfg.isNeutralOnly) || (playerIndex === Players_Constants.PlayerIndex.Neutral));
}

export function checkIsValidTileObjectShapeId(tileObjectType: number, shapeId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
    const shapesCount = getTileObjectCfg(tileObjectType)?.shapesCount;
    return (shapesCount != null)
        && ((shapeId == null) || ((shapeId >= 0) && (shapeId < shapesCount)));
}

export function getSymmetricalTileObjectType(tileObjectType: number, symmetryType: Geometries_Constants.SymmetryTypeId): number {
    return Helpers_Misc.getExisted(getTileObjectCfg(tileObjectType)?.symmetryTypes)[symmetryType];
}

export function getSymmetricalTileObjectShapeId(tileObjectType: number, shapeId: number, symmetryType: Geometries_Constants.SymmetryTypeId): number | null {
    const shapeIdArray = Tiles_Constants_Common.ObjectSymmetryCfgDict.get(tileObjectType)?.get(shapeId)?.symmetryShapeIds;
    return shapeIdArray ? shapeIdArray[symmetryType] : null;
}

export function checkIsTileObjectSymmetrical({ objectType, shapeId1, shapeId2, symmetryType }: {
        objectType      : number;
        shapeId1        : number;
        shapeId2        : number;
        symmetryType    : Geometries_Constants.SymmetryTypeId;
    }): boolean {
    return getSymmetricalTileObjectShapeId(objectType, shapeId1, symmetryType) === (shapeId2 || 0);
}
