import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { SymmetryTypeId } from "../geometries/Constants.ts";
import {
    DecorationCfgDict,
    DecorationSymmetryCfgDict,
} from "../tiles/constants/Common.ts";
import type { TileDecorationCfg } from "../tiles/Types.ts";

export function getTileDecorationCfg(tileDecorationType: number): TileDecorationCfg | null {
    return DecorationCfgDict.get(tileDecorationType) ?? null;
}

export function checkIsValidTileDecorationType(tileDecorationType: number): boolean {
    return DecorationCfgDict.has(tileDecorationType);
}

export function getAllTileDecorationCfgArray(): TileDecorationCfg[] {
    return [...DecorationCfgDict].sort((v1, v2) => v1[0] - v2[0]).map(v => v[1]);
}

export function checkIsValidTileDecorationShapeId(tileDecorationType: Undefinable<number>, shapeId: Undefinable<number>): boolean {
    if (tileDecorationType == null) {
        return shapeId == null;
    }

    const cfg = getTileDecorationCfg(tileDecorationType);
    return (cfg != null)
        && ((shapeId == null) || ((shapeId >= 0) && (shapeId < cfg.shapesCount)));
}

export function getSymmetricalTileDecorationShapeId(tileDecorationType: number, shapeId: number, symmetryType: SymmetryTypeId): number | null {
    const shapeIdArray = DecorationSymmetryCfgDict.get(tileDecorationType)?.get(shapeId)?.symmetryShapeIds;
    return shapeIdArray ? shapeIdArray[symmetryType] : null;
}

export function checkIsTileDecorationSymmetrical({ tileDecorationType, shapeId1, shapeId2, symmetryType }: {
    tileDecorationType: number | null;
    shapeId1: Undefinable<number>;
    shapeId2: Undefinable<number>;
    symmetryType: SymmetryTypeId;
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
