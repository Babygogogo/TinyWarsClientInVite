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
import type { WecPlayerPresence } from "../../../proto/schema/CommonProto/WarEvent/WecPlayerPresence.ts";
import { checkIsValid as TilesUtilsFilterCheckIsValid, checkIsMeet as TilesUtilsFilterCheckIsMeet } from "../../../tiles/utils/Filter.ts";
import { checkIsValid as UnitsUtilsFilterCheckIsValid, checkIsMeet as UnitsUtilsFilterCheckIsMeet } from "../../../units/utils/Filter.ts";
import {
    getDesc,
    checkIsValid as ValueAndComparatorsUtilsCheckIsValid,
    checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet,
} from "../../../valueAndComparators/Utils.ts";

export function getBriefDesc(data: Undefinable<WecPlayerPresence>): string | null {
    if (data == null) {
        return null;
    }

    const con           = data.getConPlayerComparator();
    const comparator    = con == null ? null : con.getComparator();
    return getFormattedText(
        TextType.F0098,
        getText(TextType.Players),
        comparator == null ? UndefinedError : (getComparatorName(comparator) ?? UndefinedError),
        con == null ? UndefinedError : (con.getValue() ?? UndefinedError)
    );
}
export function getDetailedDesc(data: Undefinable<WecPlayerPresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- ${getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            subTextArray.push(`- ${getDesc(
                comparator,
                getText(data.getConUnitFilter() == null ? TextType.B1404 : TextType.B1405)
            )}`);
        }
    }
    {
        const comparator = data.getConTileComparator();
        if (comparator != null) {
            subTextArray.push(`- ${getDesc(
                comparator,
                getText(data.getConTileFilter() == null ? TextType.B1406 : TextType.B1407)
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    const con           = data.getConPlayerComparator();
    const comparator    = con == null ? null : con.getComparator();
    return getFormattedText(
        TextType.F0232,
        getText(TextType.Players),
        subTextArray.join(`\n`),
        comparator == null ? UndefinedError : (getComparatorName(comparator) ?? UndefinedError),
        con == null ? UndefinedError : (con.getValue() ?? UndefinedError)
    );
}
export function getErrorTip(data: WecPlayerPresence, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): string | null {
    {
        const comparator = data.getConPlayerComparator();
        if (comparator == null) {
            return getFormattedText(
                TextType.F0091,
                getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Players)),
            );
        }
        if (!ValueAndComparatorsUtilsCheckIsValid(comparator)) {
            return getFormattedText(
                TextType.F0091,
                getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Players)),
            );
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null) && (!PlayersUtilsFilterCheckIsValid(filter, playersCountUnneutral, gameConfig))) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
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

    {
        const filter = data.getConUnitFilter();
        if ((filter != null) && (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
        }
    }

    {
        const comparator = data.getConTileComparator();
        if (comparator == null) {
            if (data.getConTileFilter() != null) {
                return getFormattedText(
                    TextType.F0091,
                    getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.B0899)),
                );
            }
        } else {
            if (!ValueAndComparatorsUtilsCheckIsValid(comparator)) {
                return getFormattedText(
                    TextType.F0091,
                    getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.B0899)),
                );
            }
        }
    }

    {
        const filter = data.getConTileFilter();
        if ((filter != null) && (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }

    if ((data.getConPlayerFilter() == null)      &&
        (data.getConUnitComparator() == null)    &&
        (data.getConTileComparator() == null)
    ) {
        return getText(TextType.A0944);
    }

    return null;
}

export function checkIsValid(data: Undefinable<WecPlayerPresence>, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): boolean {
    return (data != null) && (getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null);
}

export function checkIsMeet(data: WecPlayerPresence, war: IBwWar): boolean {
    const playerComparator = data.getConPlayerComparator();
    if (playerComparator == null) {
        return false;
    }

    const players: IPlayer[] = [];
    {
        const filter = data.getConPlayerFilter();
        for (const player of war.getPlayerManager().getAllPlayers(true)) {
            if ((filter == null) || (PlayersUtilsFilterCheckIsMeet(filter, player))) {
                players.push(player);
            }
        }
    }

    const unitDict          = new Map<number, number>();
    const unitComparator    = data.getConUnitComparator();
    if (unitComparator != null) {
        const filter = data.getConUnitFilter();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((filter == null) || (UnitsUtilsFilterCheckIsMeet(filter, unit))) {
                const playerIndex = unit.getPlayerIndex();
                unitDict.set(playerIndex, (unitDict.get(playerIndex) ?? 0) + 1);
            }
        }
    }

    const tileDict          = new Map<number, number>();
    const tileComparator    = data.getConTileComparator();
    if (tileComparator!= null) {
        const filter = data.getConTileFilter();
        for (const tile of war.getTileMap().getAllTiles()) {
            if ((filter == null) || (TilesUtilsFilterCheckIsMeet(filter, tile))) {
                const playerIndex = tile.getPlayerIndex();
                tileDict.set(playerIndex, (tileDict.get(playerIndex) ?? 0) + 1);
            }
        }
    }

    let playersCount = 0;
    for (const player of players) {
        const playerIndex = player.getPlayerIndex();
        if ((unitComparator != null)                                                            &&
            (!ValueAndComparatorsUtilsCheckIsMeet(unitComparator, unitDict.get(playerIndex) ?? 0))
        )  {
            continue;
        }
        if ((tileComparator != null)                                                            &&
            (!ValueAndComparatorsUtilsCheckIsMeet(tileComparator, tileDict.get(playerIndex) ?? 0))
        ) {
            continue;
        }
        ++playersCount;
    }
    return ValueAndComparatorsUtilsCheckIsMeet(playerComparator, playersCount);
}
