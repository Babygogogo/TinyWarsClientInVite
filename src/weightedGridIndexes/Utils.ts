import {
    Units_Constants,
    Lang_Utils,
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_GridIndexAndWeight,
    Lang_Constants,
    type AuxiliaryTypes_MapSize,
} from "../internal.ts";
import type { WeightedGridIndex } from "../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";

export function checkIsValid(data: WeightedGridIndex, mapSize: AuxiliaryTypes_MapSize.MapSize): boolean {
    return getErrorTip(data, mapSize) == null;
}

export function getDesc(data: WeightedGridIndex): string {
    const gridIndex = data.getGridIndex();
    return `(${gridIndex?.getX()}, ${gridIndex?.getY()}), ${data.getWeight()}`;
}

export function getErrorTip(data: WeightedGridIndex, mapSize: AuxiliaryTypes_MapSize.MapSize): string | null {
    {
        const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(data.getGridIndex());
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0531));
        }
    }
    {
        const weight = data.getWeight();
        if ((weight > Units_Constants.AiDestination.MaxWeight) ||
            (weight < Units_Constants.AiDestination.MinWeight)
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1094));
        }
    }

    return null;
}

export function toGridIndexAndWeight(data: WeightedGridIndex): AuxiliaryTypes_GridIndexAndWeight.GridIndexAndWeight | null {
    const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(data.getGridIndex());
    return gridIndex == null
        ? null
        : new AuxiliaryTypes_GridIndexAndWeight.GridIndexAndWeight(gridIndex, data.getWeight());
}
