import {
    Tiles_Constants_Common,
    Helpers_Misc,
    type Geometries_Constants,
    type Tiles_Types,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export function getTileBaseCfg(tileBaseType: number): Tiles_Types.TileBaseCfg | null {
    return Tiles_Constants_Common.BaseCfgDict.get(tileBaseType) ?? null;
}

export function checkIsUsableTileBaseType(tileBaseType: number): boolean {
    return !!Tiles_Constants_Common.BaseCfgDict.get(tileBaseType)?.isEnabled;
}

export function getAllEnabledTileBaseCfgArray(): Tiles_Types.TileBaseCfg[] {
    return [...Tiles_Constants_Common.BaseCfgDict].filter(v => v[1].isEnabled).map(v => v[1]).sort((v1, v2) => v1.tileBaseTypeId - v2.tileBaseTypeId);
}

export function getDefaultTileBaseType(): number {
    for (const [tileBaseType, cfg] of Tiles_Constants_Common.BaseCfgDict) {
        if (cfg.isDefault) {
            return tileBaseType;
        }
    }
    throw Helpers_Misc.newError(`No default tile base type.`);
}

export function checkIsValidTileBaseShapeId(tileBaseType: number, shapeId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): boolean {
    const cfg = getTileBaseCfg(tileBaseType);
    return (!!cfg?.isEnabled)
        && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
}

export function getSymmetricalTileBaseShapeId(tileBaseType: number, shapeId: number, symmetryType: Geometries_Constants.SymmetryTypeId): number | null {
    const shapeIdList = Tiles_Constants_Common.BaseSymmetryCfgDict.get(tileBaseType)?.get(shapeId)?.symmetryShapeIds;
    return shapeIdList ? shapeIdList[symmetryType] : null;
}

export function checkIsTileBaseSymmetrical({ baseType, shapeId1, shapeId2, symmetryType }: {
    baseType: number;
    shapeId1: number;
    shapeId2: number;
    symmetryType: Geometries_Constants.SymmetryTypeId;
}): boolean {
    return getSymmetricalTileBaseShapeId(baseType, shapeId1, symmetryType) === (shapeId2 || 0);
}
