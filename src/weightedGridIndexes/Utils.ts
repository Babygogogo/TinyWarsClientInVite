import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import { GridIndexAndWeight } from "../auxiliaryTypes/GridIndexAndWeight.ts";
import type { MapSize } from "../auxiliaryTypes/MapSize.ts";
import { TextType } from "../lang/Constants.ts";
import {
    getFormattedText,
    getText,
} from "../lang/Utils.ts";
import type { WeightedGridIndex } from "../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import { AiDestination } from "../units/Constants.ts";

export function checkIsValid(data: WeightedGridIndex, mapSize: MapSize): boolean {
    return getErrorTip(data, mapSize) == null;
}

export function getDesc(data: WeightedGridIndex): string {
    const gridIndex = data.getGridIndex();
    return `(${gridIndex?.getX()}, ${gridIndex?.getY()}), ${data.getWeight()}`;
}

export function getErrorTip(data: WeightedGridIndex, mapSize: MapSize): string | null {
    {
        const gridIndex = GridIndex.convertGridIndex(data.getGridIndex());
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            return getFormattedText(TextType.F0091, getText(TextType.B0531));
        }
    }
    {
        const weight = data.getWeight();
        if ((weight > AiDestination.MaxWeight) ||
            (weight < AiDestination.MinWeight)
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.B1094));
        }
    }

    return null;
}

export function toGridIndexAndWeight(data: WeightedGridIndex): GridIndexAndWeight | null {
    const gridIndex = GridIndex.convertGridIndex(data.getGridIndex());
    return gridIndex == null
        ? null
        : new GridIndexAndWeight(gridIndex, data.getWeight());
}
