import {
    Lang_Utils,
    AuxiliaryTypes_GridIndex,
    Lang_Constants,
    type AuxiliaryTypes_MapSize,
} from "../internal.ts";
import type { GridIndexArrayAndPredicate } from "../proto/schema/CommonProto/Structure/GridIndexArrayAndPredicate.ts";

export function getDesc(data: GridIndexArrayAndPredicate, valueName: string): string {
    return Lang_Utils.getFormattedText(
        data.getIsOneOf() ? Lang_Constants.TextType.F0228 : Lang_Constants.TextType.F0229,
        valueName,
        data.getGridIndexArray()?.map(v => `(${v.getX()},${v.getY()})`).join(`, `),
    );
}

export function checkIsValid(data: GridIndexArrayAndPredicate, mapSize: AuxiliaryTypes_MapSize.MapSize): boolean {
    const rawArray = data.getGridIndexArray();
    if ((rawArray == null) || (!rawArray.length)) {
        return false;
    }

    const gridIdSet = new Set<number>();
    for (const gridIndex of rawArray.map(v => AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) {
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

export function checkIsMeet(data: GridIndexArrayAndPredicate, value: AuxiliaryTypes_GridIndex.GridIndex): boolean {
    const gridIndexArray = data.getGridIndexArray();
    return data.getIsOneOf()
        ? !!gridIndexArray?.some(v => value.checkIsEqual2(v))
        : !gridIndexArray?.some(v => value.checkIsEqual2(v));
}
