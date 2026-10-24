import * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesGridIndexAndWeight from "../auxiliaryTypes/GridIndexAndWeight.ts";
import type * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureWeightedGridIndex from "../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import * as UnitsConstants from "../units/Constants.ts";

type WeightedGridIndex      = ProtoSchemaCommonProtoStructureWeightedGridIndex.WeightedGridIndex;

export function checkIsValid(data: WeightedGridIndex, mapSize: AuxiliaryTypesMapSize.MapSize): boolean {
    return getErrorTip(data, mapSize) == null;
}

export function getDesc(data: WeightedGridIndex): string {
    const gridIndex = data.getGridIndex();
    return `(${gridIndex?.getX()}, ${gridIndex?.getY()}), ${data.getWeight()}`;
}

export function getErrorTip(data: WeightedGridIndex, mapSize: AuxiliaryTypesMapSize.MapSize): string | null {
    {
        const gridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(data.getGridIndex());
        if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0531));
        }
    }
    {
        const weight = data.getWeight() ?? 0;
        if ((weight > UnitsConstants.AiDestination.MaxWeight) ||
            (weight < UnitsConstants.AiDestination.MinWeight)
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1094));
        }
    }

    return null;
}

export function toGridIndexAndWeight(data: WeightedGridIndex): AuxiliaryTypesGridIndexAndWeight.GridIndexAndWeight | null {
    const gridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(data.getGridIndex());
    return gridIndex == null
        ? null
        : new AuxiliaryTypesGridIndexAndWeight.GridIndexAndWeight(gridIndex, data.getWeight() ?? 0);
}
