
import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { SymmetryTypeId } from "../geometries/Constants.ts";
import { getExisted } from "../helpers/Misc.ts";
import { PlayerIndex } from "../players/Constants.ts";
import {
    ObjectCfgDict,
    ObjectSymmetryCfgDict,
} from "../tiles/constants/Common.ts";
import type { TileObjectCfg } from "../tiles/Types.ts";

export function getTileObjectCfg(tileObjectType: number): TileObjectCfg | null {
    return ObjectCfgDict.get(tileObjectType) ?? null;
}

export function checkIsValidTileObjectType(tileObjectType: number): boolean {
    return ObjectCfgDict.has(tileObjectType);
}

export function getAllTileObjectCfgArray(): TileObjectCfg[] {
    return [...ObjectCfgDict]
        .sort((v1, v2) => v1[1].sortWeight - v2[1].sortWeight)
        .map(v => v[1]);
}

export function checkIsValidPlayerIndexForTileObject({ playerIndex, tileObjectType }: {
        playerIndex     : number;
        tileObjectType  : number;
    }): boolean {
    const cfg = getTileObjectCfg(tileObjectType);
    return (cfg != null)
        && (playerIndex >= PlayerIndex.Neutral)
        && (playerIndex <= PlayerIndex.Max)
        && ((!cfg.isNeutralOnly) || (playerIndex === PlayerIndex.Neutral));
}

export function checkIsValidTileObjectShapeId(tileObjectType: number, shapeId: Undefinable<number>): boolean {
    const shapesCount = getTileObjectCfg(tileObjectType)?.shapesCount;
    return (shapesCount != null)
        && ((shapeId == null) || ((shapeId >= 0) && (shapeId < shapesCount)));
}

export function getSymmetricalTileObjectType(tileObjectType: number, symmetryType: SymmetryTypeId): number {
    return getExisted(getTileObjectCfg(tileObjectType)?.symmetryTypes)[symmetryType];
}

export function getSymmetricalTileObjectShapeId(tileObjectType: number, shapeId: number, symmetryType: SymmetryTypeId): number | null {
    const shapeIdArray = ObjectSymmetryCfgDict.get(tileObjectType)?.get(shapeId)?.symmetryShapeIds;
    return shapeIdArray ? shapeIdArray[symmetryType] : null;
}

export function checkIsTileObjectSymmetrical({ objectType, shapeId1, shapeId2, symmetryType }: {
        objectType      : number;
        shapeId1        : number;
        shapeId2        : number;
        symmetryType    : SymmetryTypeId;
    }): boolean {
    return getSymmetricalTileObjectShapeId(objectType, shapeId1, symmetryType) === (shapeId2 || 0);
}
