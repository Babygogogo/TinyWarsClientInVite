import {
    Tiles_Constants_Common,
    type Geometries_Constants,
    type Tiles_Types,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export function getTileDecorationCfg(tileDecorationType: number): Tiles_Types.TileDecorationCfg | null {
    return Tiles_Constants_Common.DecorationCfgDict.get(tileDecorationType) ?? null;
}

export function checkIsValidTileDecorationType(tileDecorationType: number): boolean {
    return Tiles_Constants_Common.DecorationCfgDict.has(tileDecorationType);
}

export function getAllTileDecorationCfgArray(): Tiles_Types.TileDecorationCfg[] {
    return [...Tiles_Constants_Common.DecorationCfgDict].sort((v1, v2) => v1[0] - v2[0]).map(v => v[1]);
}

export function checkIsValidTileDecorationShapeId(tileDecorationType: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>, shapeId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
    if (tileDecorationType == null) {
        return shapeId == null;
    }

    const cfg = getTileDecorationCfg(tileDecorationType);
    return (cfg != null)
        && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
}

export function getSymmetricalTileDecorationShapeId(tileDecorationType: number, shapeId: number, symmetryType: Geometries_Constants.SymmetryTypeId): number | null {
    const shapeIdArray = Tiles_Constants_Common.DecorationSymmetryCfgDict.get(tileDecorationType)?.get(shapeId)?.symmetryShapeIds;
    return shapeIdArray ? shapeIdArray[symmetryType] : null;
}

export function checkIsTileDecorationSymmetrical({ tileDecorationType, shapeId1, shapeId2, symmetryType }: {
    tileDecorationType: number | null;
    shapeId1: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    shapeId2: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    symmetryType: Geometries_Constants.SymmetryTypeId;
}): boolean {
    if (tileDecorationType == null) {
        return (shapeId1 == null) && (shapeId2 == null);
    }

    if (shapeId1 == null) {
        return shapeId2 == null;
    } else if (shapeId2 == null) {
        return shapeId1 == null;
    } else {
        return getSymmetricalTileDecorationShapeId(tileDecorationType, shapeId1, symmetryType) === shapeId2;
    }
}
