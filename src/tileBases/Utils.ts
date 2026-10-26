
import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { SymmetryTypeId } from "../geometries/Constants.ts";
import { newError } from "../helpers/Misc.ts";
import { BaseCfgDict, BaseSymmetryCfgDict } from "../tiles/constants/Common.ts";
import type { TileBaseCfg } from "../tiles/Types.ts";

export function getTileBaseCfg(tileBaseType: number): TileBaseCfg | null {
    return BaseCfgDict.get(tileBaseType) ?? null;
}

export function checkIsUsableTileBaseType(tileBaseType: number): boolean {
    return !!BaseCfgDict.get(tileBaseType)?.isEnabled;
}

export function getAllEnabledTileBaseCfgArray(): TileBaseCfg[] {
    return [...BaseCfgDict].filter(v => v[1].isEnabled).map(v => v[1]).sort((v1, v2) => v1.tileBaseTypeId - v2.tileBaseTypeId);
}

export function getDefaultTileBaseType(): number {
    for (const [tileBaseType, cfg] of BaseCfgDict) {
        if (cfg.isDefault) {
            return tileBaseType;
        }
    }
    throw newError(`No default tile base type.`);
}

export function checkIsValidTileBaseShapeId(tileBaseType: number, shapeId: Undefinable<number>): boolean {
    const cfg = getTileBaseCfg(tileBaseType);
    return (!!cfg?.isEnabled)
        && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
}

export function getSymmetricalTileBaseShapeId(tileBaseType: number, shapeId: number, symmetryType: SymmetryTypeId): number | null {
    const shapeIdList = BaseSymmetryCfgDict.get(tileBaseType)?.get(shapeId)?.symmetryShapeIds;
    return shapeIdList ? shapeIdList[symmetryType] : null;
}

export function checkIsTileBaseSymmetrical({ baseType, shapeId1, shapeId2, symmetryType }: {
    baseType: number;
    shapeId1: number;
    shapeId2: number;
    symmetryType: SymmetryTypeId;
}): boolean {
    return getSymmetricalTileBaseShapeId(baseType, shapeId1, symmetryType) === (shapeId2 || 0);
}
