import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getText, getComparatorName } from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import {
    getDescForEmbed,
    checkIsValid as PlayersUtilsFilterCheckIsValid,
    checkIsMeet as PlayersUtilsFilterCheckIsMeet,
} from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { UnitFilter } from "../../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import type { ValueAndComparator } from "../../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WecTilePresence } from "../../../proto/schema/CommonProto/WarEvent/WecTilePresence.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import {
    getDescForEmbed as TilesUtilsFilterGetDescForEmbed,
    checkIsValid as TilesUtilsFilterCheckIsValid,
    checkIsMeet as TilesUtilsFilterCheckIsMeet,
} from "../../../tiles/utils/Filter.ts";
import { checkIsValid as UnitsUtilsFilterCheckIsValid, checkIsMeet as UnitsUtilsFilterCheckIsMeet } from "../../../units/utils/Filter.ts";
import {
    getDesc,
    checkIsValid as ValueAndComparatorsUtilsCheckIsValid,
    checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet,
} from "../../../valueAndComparators/Utils.ts";

export function getBriefDesc(data: Undefinable<WecTilePresence>): string | null {
    if (data == null) {
        return null;
    }

    const con           = data.getConTileComparator();
    const comparator    = con == null ? null : con.getComparator();
    return getFormattedText(
        TextType.F0098,
        getText(TextType.Tiles),
        comparator == null ? UndefinedError : (getComparatorName(comparator) ?? UndefinedError),
        con == null ? UndefinedError : (con.getValue() ?? UndefinedError)
    );
}
export function getDetailedDesc(data: Undefinable<WecTilePresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            subTextArray.push(`- ${getDesc(
                comparator,
                getText(data.getConUnitFilter() == null ? TextType.B1418 : TextType.B1419)
            )}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${getText(TextType.B1421)}) ${getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- ${TilesUtilsFilterGetDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    const con           = data.getConTileComparator();
    const comparator    = con == null ? null : con.getComparator();
    return getFormattedText(
        TextType.F0232,
        getText(TextType.Tiles),
        subTextArray.join(`\n`),
        comparator == null ? UndefinedError : (getComparatorName(comparator) ?? UndefinedError),
        con == null ? UndefinedError : (con.getValue() ?? UndefinedError)
    );
}
export function getErrorTip(data: WecTilePresence, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): string | null {
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }

    {
        const comparator = data.getConTileComparator();
        if (comparator == null) {
            return getFormattedText(
                TextType.F0091,
                getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Tiles)),
            );
        }
        if (!ValueAndComparatorsUtilsCheckIsValid(comparator)) {
            return getFormattedText(
                TextType.F0091,
                getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Tiles)),
            );
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilterCheckIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
        }
    }

    {
        const comparator = data.getConUnitComparator();
        if (comparator == null) {
            if (data.getConUnitFilter() != null) {
                return getFormattedText(
                    TextType.F0091,
                    getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Units)),
                );
            }
        } else {
            if (!ValueAndComparatorsUtilsCheckIsValid(comparator)) {
                return getFormattedText(
                    TextType.F0091,
                    getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Units)),
                );
            }
        }
    }


    if ((data.getConTileFilter() == null)        &&
        (data.getConPlayerFilter() == null)      &&
        (data.getConUnitComparator() == null)
    ) {
        return getText(TextType.A0944);
    }

    return null;
}

export function checkIsValid(data: Undefinable<WecTilePresence>, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): boolean {
    return (data != null) && (getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null);
}

export function checkIsMeet(data: WecTilePresence, war: IBwWar): boolean {
    const tileComparator = data.getConTileComparator();
    if (tileComparator == null) {
        return false;
    }

    const tileFilter        = data.getConTileFilter();
    const playerFilter      = data.getConPlayerFilter();
    const playerFilterDict  = new Map<IPlayer, boolean>();
    const unitFilter        = data.getConUnitFilter();
    const unitComparator    = data.getConUnitComparator();
    let tilesCount          = 0;
    for (const tile of war.getTileMap().getAllTiles()) {
        if ((tileFilter != null) && (!TilesUtilsFilterCheckIsMeet(tileFilter, tile))) {
            continue;
        }

        if ((playerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, playerFilter, tile.getPlayer()))) {
            continue;
        }

        if ((unitComparator != null) && (!checkIsMeetConUnitComparator(unitFilter, unitComparator, tile))) {
            continue;
        }

        ++tilesCount;
    }
    return ValueAndComparatorsUtilsCheckIsMeet(tileComparator, tilesCount);
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, PlayersUtilsFilterCheckIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConUnitComparator(filter: Undefinable<UnitFilter>, comparator: ValueAndComparator, tile: ITile): boolean {
    let unitsCount = 0;
    for (const unit of tile.getWar().getUnitMap().getAllUnitsOnGrid(tile.getGridIndex())) {
        if ((filter != null) && (!UnitsUtilsFilterCheckIsMeet(filter, unit))) {
            continue;
        }

        ++unitsCount;
    }
    return ValueAndComparatorsUtilsCheckIsMeet(comparator, unitsCount);
}
