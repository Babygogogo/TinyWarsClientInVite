import * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureGridIndexArrayAndPredicate from "../proto/schema/CommonProto/Structure/GridIndexArrayAndPredicate.ts";

type GridIndexArrayAndPredicateSchema = ProtoSchemaCommonProtoStructureGridIndexArrayAndPredicate.GridIndexArrayAndPredicate;

export function getDesc(data: GridIndexArrayAndPredicateSchema, valueName: string): string {
    return LangUtils.getFormattedText(
        data.getIsOneOf() ? LangConstants.TextType.F0228 : LangConstants.TextType.F0229,
        valueName,
        data.getGridIndexArray()?.map(v => `(${v.getX()},${v.getY()})`).join(`, `) ?? LangConstants.UndefinedError
    );
}

export function checkIsValid(data: GridIndexArrayAndPredicateSchema, mapSize: AuxiliaryTypesMapSize.MapSize): boolean {
    const rawArray = data.getGridIndexArray();
    if ((rawArray == null) || (!rawArray.length)) {
        return false;
    }

    const gridIdSet = new Set<number>();
    for (const gridIndex of rawArray.map(v => AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) {
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            return false;
        }

        const gridId = gridIndex.getGridId(mapSize);
        if (gridIdSet.has(gridId)) {
            return false;
        }
        gridIdSet.add(gridId);
    }

    return true;
}

export function checkIsMeet(data: GridIndexArrayAndPredicateSchema, value: AuxiliaryTypesGridIndex.GridIndex): boolean {
    const gridIndexArray = data.getGridIndexArray();
    return data.getIsOneOf()
        ? !!gridIndexArray?.some(v => value.checkIsEqual2(v))
        : !gridIndexArray?.some(v => value.checkIsEqual2(v));
}
