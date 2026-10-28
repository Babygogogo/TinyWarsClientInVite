import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../auxiliaryTypes/MapSize.ts";
import { TextType } from "../lang/Constants.ts";
import { getFormattedText } from "../lang/Utils.ts";
import type { GridIndexArrayAndPredicate } from "../proto/schema/CommonProto/Structure/GridIndexArrayAndPredicate.ts";

type GridIndexArrayAndPredicateSchema = GridIndexArrayAndPredicate;

export function getDesc(data: GridIndexArrayAndPredicateSchema, valueName: string): string {
    return getFormattedText(
        data.getIsOneOf() ? TextType.F0228 : TextType.F0229,
        valueName,
        data.getGridIndexArray()?.map(v => `(${v.getX()},${v.getY()})`).join(`, `)
    );
}

export function checkIsValid(data: GridIndexArrayAndPredicateSchema, mapSize: MapSize): boolean {
    const rawArray = data.getGridIndexArray();
    if ((rawArray == null) || (!rawArray.length)) {
        return false;
    }

    const gridIdSet = new Set<number>();
    for (const gridIndex of rawArray.map(v => GridIndex.convertGridIndex(v))) {
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

export function checkIsMeet(data: GridIndexArrayAndPredicateSchema, value: GridIndex): boolean {
    const gridIndexArray = data.getGridIndexArray();
    return data.getIsOneOf()
        ? !!gridIndexArray?.some(v => value.checkIsEqual2(v))
        : !gridIndexArray?.some(v => value.checkIsEqual2(v));
}
