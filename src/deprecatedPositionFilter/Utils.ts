import {
    ValueAndComparators_Utils,
    Locations_Utils,
    ValueAndComparators_Constants,
    Lang_Utils,
    Helpers_Misc,
    Helpers_Collection,
    AuxiliaryTypes_GridIndex,
    Lang_Constants,
    type Tiles_Tile,
    type Tiles_TileMap,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_PositionFilter,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export function checkIsValid(data: AuxiliaryTypes_PositionFilter.PositionFilter, mapSize: AuxiliaryTypes_MapSize.MapSize): boolean {
    if (!Locations_Utils.checkIsValidLocationIdSubset(data.getConLocationIdArray())) {
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
        if ((v != null) && (!ValueAndComparators_Utils.checkIsValid(v))) {
            return false;
        }
    }

    {
        const v = data.getConGridIndexMinDistance();
        if ((v != null) && (!ValueAndComparators_Utils.checkIsValid(v))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(data: AuxiliaryTypes_PositionFilter.PositionFilter, tile: Tiles_Tile.Tile): boolean {
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
        const conGridIndexArray = data.getConGridIndexArray().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v)));
        if ((conGridIndexArray?.length)                                                                                                                     &&
            (!ValueAndComparators_Utils.checkIsMeet(data.getConGridIndexMinDistance() ?? ValueAndComparators_Constants.Equal0, gridIndex.getMinDistance(conGridIndexArray)))
        ) {
            return false;
        }
    }

    {
        const conLocationIdArray              = data.getConLocationIdArray();
        const conGridIndexListForLocations    = conLocationIdArray?.length ? tile.getWar().getTileMap().getGridIndexListWithAnyLocationId(conLocationIdArray) : null;
        if (conGridIndexListForLocations != null) {
            if ((conGridIndexListForLocations.length <= 0)                                                                                                              ||
                (!ValueAndComparators_Utils.checkIsMeet(data.getConLocationMinDistance() ?? ValueAndComparators_Constants.Equal0, gridIndex.getMinDistance(conGridIndexListForLocations)))
            ) {
                return false;
            }
        }
    }

    return true;
}

export function checkIsEmpty(data: AuxiliaryTypes_PositionFilter.PositionFilter): boolean {
    return (!data.getConGridIndexArray().length)
        && (!data.getConLocationIdArray().length)
        && (!data.getConGridXArray().length)
        && (!data.getConGridYArray().length);
}

export function getDesc(data: AuxiliaryTypes_PositionFilter.PositionFilter): string {
    const conGridXArray         = data.getConGridXArray();
    const textForConGridXArray  = conGridXArray?.length
        ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0182, conGridXArray.join(`/`))
        : null;

    const conGridYArray         = data.getConGridYArray();
    const textForConGridYArray  = conGridYArray?.length
        ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0183, conGridYArray.join(`/`))
        : null;

    const conLocationIdArray        = data.getConLocationIdArray();
    const conLocationMinDistance    = data.getConLocationMinDistance() ?? ValueAndComparators_Constants.Equal0;
    const textForConLocationIdArray = conLocationIdArray?.length
        ? Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0170,
            conLocationIdArray.join(`/`),
            Lang_Utils.getComparatorName(conLocationMinDistance.getComparator()),
            conLocationMinDistance.getValue(),
        )
        : null;

    const conGridIndexArray         = data.getConGridIndexArray();
    const conGridIndexMinDistance   = data.getConGridIndexMinDistance() ?? ValueAndComparators_Constants.Equal0;
    const textForConGridIndexArray  = conGridIndexArray?.length
        ? Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0169,
            conGridIndexArray.map(v => `(${v.getX()},${v.getY()})`).join(`/`),
            Lang_Utils.getComparatorName(conGridIndexMinDistance.getComparator()),
            conGridIndexMinDistance.getValue(),
        )
        : null;

    const textArrayForSubConditions = Helpers_Collection.getNonNullElements([
        textForConGridXArray,
        textForConGridYArray,
        textForConLocationIdArray,
        textForConGridIndexArray,
    ]);
    return !textArrayForSubConditions.length
        ? Lang_Utils.getText(Lang_Constants.TextType.A0423)
        : Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0184,
            textArrayForSubConditions.join(Lang_Utils.getText(Lang_Constants.TextType.B0783)),
        );
}
export function getDescForEmbed(data: AuxiliaryTypes_PositionFilter.PositionFilter): string | null {
    const conGridXArray         = data.getConGridXArray();
    const textForConGridXArray  = conGridXArray?.length
        ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0182, conGridXArray.join(`/`))
        : null;

    const conGridYArray         = data.getConGridYArray();
    const textForConGridYArray  = conGridYArray?.length
        ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0183, conGridYArray.join(`/`))
        : null;

    const conLocationIdArray        = data.getConLocationIdArray();
    const conLocationMinDistance    = data.getConLocationMinDistance() ?? ValueAndComparators_Constants.Equal0;
    const textForConLocationIdArray = conLocationIdArray?.length
        ? Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0170,
            conLocationIdArray.join(`/`),
            Lang_Utils.getComparatorName(conLocationMinDistance.getComparator()),
            conLocationMinDistance.getValue(),
        )
        : null;

    const conGridIndexArray         = data.getConGridIndexArray();
    const conGridIndexMinDistance   = data.getConGridIndexMinDistance() ?? ValueAndComparators_Constants.Equal0;
    const textForConGridIndexArray  = conGridIndexArray?.length
        ? Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0169,
            conGridIndexArray.map(v => `(${v.getX()},${v.getY()})`).join(`/`),
            Lang_Utils.getComparatorName(conGridIndexMinDistance.getComparator()),
            conGridIndexMinDistance.getValue(),
        )
        : null;

    const textArrayForSubConditions = Helpers_Collection.getNonNullElements([
        textForConGridXArray,
        textForConGridYArray,
        textForConLocationIdArray,
        textForConGridIndexArray,
    ]);
    return !textArrayForSubConditions.length
        ? null
        : textArrayForSubConditions.join(Lang_Utils.getText(Lang_Constants.TextType.B0783));
}

export function getErrorTip(data: AuxiliaryTypes_PositionFilter.PositionFilter, mapSize: AuxiliaryTypes_MapSize.MapSize): string | null {
    if (!mapSize.checkIsValidGridXSubset(data.getConGridXArray())) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1071));
    }

    if (!mapSize.checkIsValidGridXSubset(data.getConGridYArray())) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1072));
    }

    if (!Locations_Utils.checkIsValidLocationIdSubset(data.getConLocationIdArray())) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Location));
    }

    if (!mapSize.checkIsValidGridIndexSubset(data.getConGridIndexArray())) {
        return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0531));
    }

    {
        const conLocationMinDistance = data.getConLocationMinDistance();
        if ((conLocationMinDistance != null) && (!ValueAndComparators_Utils.checkIsValid(conLocationMinDistance))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1062));
        }
    }

    {
        const conGridIndexMinDistance = data.getConGridIndexMinDistance();
        if ((conGridIndexMinDistance != null) && (!ValueAndComparators_Utils.checkIsValid(conGridIndexMinDistance))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1063));
        }
    }

    return null;
}

export function getMetGridIndexList(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_PositionFilter.PositionFilter>, tileMap: Tiles_TileMap.TileMap, predicate: ((g: AuxiliaryTypes_GridIndex.GridIndex) => boolean) | null): AuxiliaryTypes_GridIndex.GridIndex[] {
    const gridIndexList: AuxiliaryTypes_GridIndex.GridIndex[] = [];
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
        const conGridIndexArray               = data.getConGridIndexArray()?.map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v)));
        const conGridIndexMinDistance         = data.getConGridIndexMinDistance() ?? ValueAndComparators_Constants.Equal0;
        const conLocationIdArray              = data.getConLocationIdArray();
        const conGridIndexListForLocations    = conLocationIdArray?.length ? tileMap.getGridIndexListWithAnyLocationId(conLocationIdArray) : null;
        const conLocationMinDistance          = data.getConLocationMinDistance() ?? ValueAndComparators_Constants.Equal0;

        for (const tile of tileMap.getAllTiles()) {
            const gridIndex = tile.getGridIndex();

            if ((conGridXArray?.length) && (conGridXArray.indexOf(gridIndex.getX()) < 0)) {
                continue;
            }

            if ((conGridYArray?.length) && (conGridYArray.indexOf(gridIndex.getY()) < 0)) {
                continue;
            }

            if ((conGridIndexArray?.length)                                                                                 &&
                (!ValueAndComparators_Utils.checkIsMeet(conGridIndexMinDistance, gridIndex.getMinDistance(conGridIndexArray)))
            ) {
                continue;
            }

            if (conGridIndexListForLocations != null) {
                if ((conGridIndexListForLocations.length <= 0)                                                                          ||
                    (!ValueAndComparators_Utils.checkIsMeet(conLocationMinDistance, gridIndex.getMinDistance(conGridIndexListForLocations)))
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
