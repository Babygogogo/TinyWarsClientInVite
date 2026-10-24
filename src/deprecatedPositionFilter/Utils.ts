import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as AuxiliaryTypesPositionFilter from "../auxiliaryTypes/PositionFilter.ts";
import * as HelpersCollection from "../helpers/Collection.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as LocationsUtils from "../locations/Utils.ts";
import type * as TilesITile from "../tiles/ITile.ts";
import type * as TilesITileMap from "../tiles/ITileMap.ts";
import * as ValueAndComparatorsConstants from "../valueAndComparators/Constants.ts";
import * as ValueAndComparatorsUtils from "../valueAndComparators/Utils.ts";

type PositionFilter                 = AuxiliaryTypesPositionFilter.PositionFilter;

export function checkIsValid(data: PositionFilter, mapSize: AuxiliaryTypesMapSize.MapSize): boolean {
    if (!LocationsUtils.checkIsValidLocationIdSubset(data.getConLocationIdArray())) {
        return false;
    }

    if (!mapSize.checkIsValidGridIndexSubset(data.getConGridIndexArray())) {
        return false;
    }

    if (!mapSize.checkIsValidGridXSubset(data.getConGridXArray())) {
        return false;
    }

    if (!mapSize.checkIsValidGridYSubset(data.getConGridYArray())) {
        return false;
    }

    {
        const v = data.getConLocationMinDistance();
        if ((v != null) && (!ValueAndComparatorsUtils.checkIsValid(v))) {
            return false;
        }
    }

    {
        const v = data.getConGridIndexMinDistance();
        if ((v != null) && (!ValueAndComparatorsUtils.checkIsValid(v))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(data: PositionFilter, tile: TilesITile.ITile): boolean {
    const gridIndex = tile.getGridIndex();
    {
        const conGridXArray = data.getConGridXArray();
        if ((conGridXArray?.length) && (conGridXArray.indexOf(gridIndex.getX()) < 0)) {
            return false;
        }
    }

    {
        const conGridYArray = data.getConGridYArray();
        if ((conGridYArray?.length) && (conGridYArray.indexOf(gridIndex.getY()) < 0)) {
            return false;
        }
    }

    {
        const conGridIndexArray = data.getConGridIndexArray().map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v)));
        if ((conGridIndexArray?.length)                                                                                                                     &&
            (!ValueAndComparatorsUtils.checkIsMeet(data.getConGridIndexMinDistance() ?? ValueAndComparatorsConstants.Equal0, gridIndex.getMinDistance(conGridIndexArray)))
        ) {
            return false;
        }
    }

    {
        const conLocationIdArray              = data.getConLocationIdArray();
        const conGridIndexListForLocations    = conLocationIdArray?.length ? tile.getWar().getTileMap().getGridIndexListWithAnyLocationId(conLocationIdArray) : null;
        if (conGridIndexListForLocations != null) {
            if ((conGridIndexListForLocations.length <= 0)                                                                                                              ||
                (!ValueAndComparatorsUtils.checkIsMeet(data.getConLocationMinDistance() ?? ValueAndComparatorsConstants.Equal0, gridIndex.getMinDistance(conGridIndexListForLocations)))
            ) {
                return false;
            }
        }
    }

    return true;
}

export function checkIsEmpty(data: PositionFilter): boolean {
    return (!data.getConGridIndexArray().length)
        && (!data.getConLocationIdArray().length)
        && (!data.getConGridXArray().length)
        && (!data.getConGridYArray().length);
}

export function getDesc(data: PositionFilter): string {
    const conGridXArray         = data.getConGridXArray();
    const textForConGridXArray  = conGridXArray?.length
        ? LangUtils.getFormattedText(LangConstants.TextType.F0182, conGridXArray.join(`/`))
        : null;

    const conGridYArray         = data.getConGridYArray();
    const textForConGridYArray  = conGridYArray?.length
        ? LangUtils.getFormattedText(LangConstants.TextType.F0183, conGridYArray.join(`/`))
        : null;

    const conLocationIdArray        = data.getConLocationIdArray();
    const conLocationMinDistance    = data.getConLocationMinDistance() ?? ValueAndComparatorsConstants.Equal0;
    const textForConLocationIdArray = conLocationIdArray?.length
        ? LangUtils.getFormattedText(
            LangConstants.TextType.F0170,
            conLocationIdArray.join(`/`),
            LangUtils.getComparatorName(conLocationMinDistance.getComparator()),
            conLocationMinDistance.getValue()
        )
        : null;

    const conGridIndexArray         = data.getConGridIndexArray();
    const conGridIndexMinDistance   = data.getConGridIndexMinDistance() ?? ValueAndComparatorsConstants.Equal0;
    const textForConGridIndexArray  = conGridIndexArray?.length
        ? LangUtils.getFormattedText(
            LangConstants.TextType.F0169,
            conGridIndexArray.map(v => `(${v.getX()},${v.getY()})`).join(`/`),
            LangUtils.getComparatorName(conGridIndexMinDistance.getComparator()),
            conGridIndexMinDistance.getValue()
        )
        : null;

    const textArrayForSubConditions = HelpersCollection.getNonNullElements([
        textForConGridXArray,
        textForConGridYArray,
        textForConLocationIdArray,
        textForConGridIndexArray,
    ]);
    return !textArrayForSubConditions.length
        ? LangUtils.getText(LangConstants.TextType.A0423)
        : LangUtils.getFormattedText(
            LangConstants.TextType.F0184,
            textArrayForSubConditions.join(LangUtils.getText(LangConstants.TextType.B0783))
        );
}
export function getDescForEmbed(data: PositionFilter): string | null {
    const conGridXArray         = data.getConGridXArray();
    const textForConGridXArray  = conGridXArray?.length
        ? LangUtils.getFormattedText(LangConstants.TextType.F0182, conGridXArray.join(`/`))
        : null;

    const conGridYArray         = data.getConGridYArray();
    const textForConGridYArray  = conGridYArray?.length
        ? LangUtils.getFormattedText(LangConstants.TextType.F0183, conGridYArray.join(`/`))
        : null;

    const conLocationIdArray        = data.getConLocationIdArray();
    const conLocationMinDistance    = data.getConLocationMinDistance() ?? ValueAndComparatorsConstants.Equal0;
    const textForConLocationIdArray = conLocationIdArray?.length
        ? LangUtils.getFormattedText(
            LangConstants.TextType.F0170,
            conLocationIdArray.join(`/`),
            LangUtils.getComparatorName(conLocationMinDistance.getComparator()),
            conLocationMinDistance.getValue()
        )
        : null;

    const conGridIndexArray         = data.getConGridIndexArray();
    const conGridIndexMinDistance   = data.getConGridIndexMinDistance() ?? ValueAndComparatorsConstants.Equal0;
    const textForConGridIndexArray  = conGridIndexArray?.length
        ? LangUtils.getFormattedText(
            LangConstants.TextType.F0169,
            conGridIndexArray.map(v => `(${v.getX()},${v.getY()})`).join(`/`),
            LangUtils.getComparatorName(conGridIndexMinDistance.getComparator()),
            conGridIndexMinDistance.getValue()
        )
        : null;

    const textArrayForSubConditions = HelpersCollection.getNonNullElements([
        textForConGridXArray,
        textForConGridYArray,
        textForConLocationIdArray,
        textForConGridIndexArray,
    ]);
    return !textArrayForSubConditions.length
        ? null
        : textArrayForSubConditions.join(LangUtils.getText(LangConstants.TextType.B0783));
}

export function getErrorTip(data: PositionFilter, mapSize: AuxiliaryTypesMapSize.MapSize): string | null {
    if (!mapSize.checkIsValidGridXSubset(data.getConGridXArray())) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1071));
    }

    if (!mapSize.checkIsValidGridXSubset(data.getConGridYArray())) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1072));
    }

    if (!LocationsUtils.checkIsValidLocationIdSubset(data.getConLocationIdArray())) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Location));
    }

    if (!mapSize.checkIsValidGridIndexSubset(data.getConGridIndexArray())) {
        return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0531));
    }

    {
        const conLocationMinDistance = data.getConLocationMinDistance();
        if ((conLocationMinDistance != null) && (!ValueAndComparatorsUtils.checkIsValid(conLocationMinDistance))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1062));
        }
    }

    {
        const conGridIndexMinDistance = data.getConGridIndexMinDistance();
        if ((conGridIndexMinDistance != null) && (!ValueAndComparatorsUtils.checkIsValid(conGridIndexMinDistance))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1063));
        }
    }

    return null;
}

export function getMetGridIndexList(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<PositionFilter>, tileMap: TilesITileMap.ITileMap, predicate: ((g: AuxiliaryTypesGridIndex.GridIndex) => boolean) | null): AuxiliaryTypesGridIndex.GridIndex[] {
    const gridIndexList: AuxiliaryTypesGridIndex.GridIndex[] = [];
    if (data == null) {
        for (const tile of tileMap.getAllTiles()) {
            const gridIndex = tile.getGridIndex();
            if ((predicate != null) && (!predicate(gridIndex))) {
                continue;
            }

            gridIndexList.push(gridIndex);
        }

    } else {
        const conGridXArray                   = data.getConGridXArray();
        const conGridYArray                   = data.getConGridYArray();
        const conGridIndexArray               = data.getConGridIndexArray()?.map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v)));
        const conGridIndexMinDistance         = data.getConGridIndexMinDistance() ?? ValueAndComparatorsConstants.Equal0;
        const conLocationIdArray              = data.getConLocationIdArray();
        const conGridIndexListForLocations    = conLocationIdArray?.length ? tileMap.getGridIndexListWithAnyLocationId(conLocationIdArray) : null;
        const conLocationMinDistance          = data.getConLocationMinDistance() ?? ValueAndComparatorsConstants.Equal0;

        for (const tile of tileMap.getAllTiles()) {
            const gridIndex = tile.getGridIndex();

            if ((conGridXArray?.length) && (conGridXArray.indexOf(gridIndex.getX()) < 0)) {
                continue;
            }

            if ((conGridYArray?.length) && (conGridYArray.indexOf(gridIndex.getY()) < 0)) {
                continue;
            }

            if ((conGridIndexArray?.length)                                                                                 &&
                (!ValueAndComparatorsUtils.checkIsMeet(conGridIndexMinDistance, gridIndex.getMinDistance(conGridIndexArray)))
            ) {
                continue;
            }

            if (conGridIndexListForLocations != null) {
                if ((conGridIndexListForLocations.length <= 0)                                                                          ||
                    (!ValueAndComparatorsUtils.checkIsMeet(conLocationMinDistance, gridIndex.getMinDistance(conGridIndexListForLocations)))
                ) {
                    continue;
                }
            }

            if ((predicate != null) && (!predicate(gridIndex))) {
                continue;
            }

            gridIndexList.push(gridIndex);
        }
    }

    return gridIndexList;
}
