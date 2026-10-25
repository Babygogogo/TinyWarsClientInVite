import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../auxiliaryTypes/MapSize.ts";
import type { PositionFilter as AuxiliaryTypesPositionFilter } from "../auxiliaryTypes/PositionFilter.ts";
import { getNonNullElements } from "../helpers/Collection.ts";
import { getExisted } from "../helpers/Misc.ts";
import { TextType } from "../lang/Constants.ts";
import { getFormattedText, getComparatorName, getText } from "../lang/Utils.ts";
import { checkIsValidLocationIdSubset } from "../locations/Utils.ts";
import type { ITile } from "../tiles/ITile.ts";
import type { ITileMap } from "../tiles/ITileMap.ts";
import { Equal0 } from "../valueAndComparators/Constants.ts";
import {
    checkIsValid as ValueAndComparatorsUtilsCheckIsValid,
    checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet,
} from "../valueAndComparators/Utils.ts";

type PositionFilter                 = AuxiliaryTypesPositionFilter;

export function checkIsValid(data: PositionFilter, mapSize: MapSize): boolean {
    if (!checkIsValidLocationIdSubset(data.getConLocationIdArray())) {
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
        if ((v != null) && (!ValueAndComparatorsUtilsCheckIsValid(v))) {
            return false;
        }
    }

    {
        const v = data.getConGridIndexMinDistance();
        if ((v != null) && (!ValueAndComparatorsUtilsCheckIsValid(v))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(data: PositionFilter, tile: ITile): boolean {
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
        const conGridIndexArray = data.getConGridIndexArray().map(v => getExisted(GridIndex.convertGridIndex(v)));
        if ((conGridIndexArray?.length)                                                                                                                     &&
            (!ValueAndComparatorsUtilsCheckIsMeet(data.getConGridIndexMinDistance() ?? Equal0, gridIndex.getMinDistance(conGridIndexArray)))
        ) {
            return false;
        }
    }

    {
        const conLocationIdArray              = data.getConLocationIdArray();
        const conGridIndexListForLocations    = conLocationIdArray?.length ? tile.getWar().getTileMap().getGridIndexListWithAnyLocationId(conLocationIdArray) : null;
        if (conGridIndexListForLocations != null) {
            if ((conGridIndexListForLocations.length <= 0)                                                                                                              ||
                (!ValueAndComparatorsUtilsCheckIsMeet(data.getConLocationMinDistance() ?? Equal0, gridIndex.getMinDistance(conGridIndexListForLocations)))
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
        ? getFormattedText(TextType.F0182, conGridXArray.join(`/`))
        : null;

    const conGridYArray         = data.getConGridYArray();
    const textForConGridYArray  = conGridYArray?.length
        ? getFormattedText(TextType.F0183, conGridYArray.join(`/`))
        : null;

    const conLocationIdArray        = data.getConLocationIdArray();
    const conLocationMinDistance    = data.getConLocationMinDistance() ?? Equal0;
    const textForConLocationIdArray = conLocationIdArray?.length
        ? getFormattedText(
            TextType.F0170,
            conLocationIdArray.join(`/`),
            getComparatorName(conLocationMinDistance.getComparator()),
            conLocationMinDistance.getValue()
        )
        : null;

    const conGridIndexArray         = data.getConGridIndexArray();
    const conGridIndexMinDistance   = data.getConGridIndexMinDistance() ?? Equal0;
    const textForConGridIndexArray  = conGridIndexArray?.length
        ? getFormattedText(
            TextType.F0169,
            conGridIndexArray.map(v => `(${v.getX()},${v.getY()})`).join(`/`),
            getComparatorName(conGridIndexMinDistance.getComparator()),
            conGridIndexMinDistance.getValue()
        )
        : null;

    const textArrayForSubConditions = getNonNullElements([
        textForConGridXArray,
        textForConGridYArray,
        textForConLocationIdArray,
        textForConGridIndexArray,
    ]);
    return !textArrayForSubConditions.length
        ? getText(TextType.A0423)
        : getFormattedText(
            TextType.F0184,
            textArrayForSubConditions.join(getText(TextType.B0783))
        );
}
export function getDescForEmbed(data: PositionFilter): string | null {
    const conGridXArray         = data.getConGridXArray();
    const textForConGridXArray  = conGridXArray?.length
        ? getFormattedText(TextType.F0182, conGridXArray.join(`/`))
        : null;

    const conGridYArray         = data.getConGridYArray();
    const textForConGridYArray  = conGridYArray?.length
        ? getFormattedText(TextType.F0183, conGridYArray.join(`/`))
        : null;

    const conLocationIdArray        = data.getConLocationIdArray();
    const conLocationMinDistance    = data.getConLocationMinDistance() ?? Equal0;
    const textForConLocationIdArray = conLocationIdArray?.length
        ? getFormattedText(
            TextType.F0170,
            conLocationIdArray.join(`/`),
            getComparatorName(conLocationMinDistance.getComparator()),
            conLocationMinDistance.getValue()
        )
        : null;

    const conGridIndexArray         = data.getConGridIndexArray();
    const conGridIndexMinDistance   = data.getConGridIndexMinDistance() ?? Equal0;
    const textForConGridIndexArray  = conGridIndexArray?.length
        ? getFormattedText(
            TextType.F0169,
            conGridIndexArray.map(v => `(${v.getX()},${v.getY()})`).join(`/`),
            getComparatorName(conGridIndexMinDistance.getComparator()),
            conGridIndexMinDistance.getValue()
        )
        : null;

    const textArrayForSubConditions = getNonNullElements([
        textForConGridXArray,
        textForConGridYArray,
        textForConLocationIdArray,
        textForConGridIndexArray,
    ]);
    return !textArrayForSubConditions.length
        ? null
        : textArrayForSubConditions.join(getText(TextType.B0783));
}

export function getErrorTip(data: PositionFilter, mapSize: MapSize): string | null {
    if (!mapSize.checkIsValidGridXSubset(data.getConGridXArray())) {
        return getFormattedText(TextType.F0091, getText(TextType.B1071));
    }

    if (!mapSize.checkIsValidGridXSubset(data.getConGridYArray())) {
        return getFormattedText(TextType.F0091, getText(TextType.B1072));
    }

    if (!checkIsValidLocationIdSubset(data.getConLocationIdArray())) {
        return getFormattedText(TextType.F0091, getText(TextType.Location));
    }

    if (!mapSize.checkIsValidGridIndexSubset(data.getConGridIndexArray())) {
        return getFormattedText(TextType.F0091, getText(TextType.B0531));
    }

    {
        const conLocationMinDistance = data.getConLocationMinDistance();
        if ((conLocationMinDistance != null) && (!ValueAndComparatorsUtilsCheckIsValid(conLocationMinDistance))) {
            return getFormattedText(TextType.F0091, getText(TextType.B1062));
        }
    }

    {
        const conGridIndexMinDistance = data.getConGridIndexMinDistance();
        if ((conGridIndexMinDistance != null) && (!ValueAndComparatorsUtilsCheckIsValid(conGridIndexMinDistance))) {
            return getFormattedText(TextType.F0091, getText(TextType.B1063));
        }
    }

    return null;
}

export function getMetGridIndexList(data: Undefinable<PositionFilter>, tileMap: ITileMap, predicate: ((g: GridIndex) => boolean) | null): GridIndex[] {
    const gridIndexList: GridIndex[] = [];
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
        const conGridIndexArray               = data.getConGridIndexArray()?.map(v => getExisted(GridIndex.convertGridIndex(v)));
        const conGridIndexMinDistance         = data.getConGridIndexMinDistance() ?? Equal0;
        const conLocationIdArray              = data.getConLocationIdArray();
        const conGridIndexListForLocations    = conLocationIdArray?.length ? tileMap.getGridIndexListWithAnyLocationId(conLocationIdArray) : null;
        const conLocationMinDistance          = data.getConLocationMinDistance() ?? Equal0;

        for (const tile of tileMap.getAllTiles()) {
            const gridIndex = tile.getGridIndex();

            if ((conGridXArray?.length) && (conGridXArray.indexOf(gridIndex.getX()) < 0)) {
                continue;
            }

            if ((conGridYArray?.length) && (conGridYArray.indexOf(gridIndex.getY()) < 0)) {
                continue;
            }

            if ((conGridIndexArray?.length)                                                                                 &&
                (!ValueAndComparatorsUtilsCheckIsMeet(conGridIndexMinDistance, gridIndex.getMinDistance(conGridIndexArray)))
            ) {
                continue;
            }

            if (conGridIndexListForLocations != null) {
                if ((conGridIndexListForLocations.length <= 0)                                                                          ||
                    (!ValueAndComparatorsUtilsCheckIsMeet(conLocationMinDistance, gridIndex.getMinDistance(conGridIndexListForLocations)))
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
