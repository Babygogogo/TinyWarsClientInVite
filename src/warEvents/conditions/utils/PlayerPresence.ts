import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import {
    TextType,
    UndefinedError,
} from "../../../lang/Constants.ts";
import {
    getFormattedText,
    getText,
    getComparatorName,
} from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import {
    getDescForEmbed,
    checkIsValid as checkIsValidPlayerFilter,
    checkIsMeet as checkIsMeetPlayerFilter,
} from "../../../players/utils/Filter.ts";
import type { WecPlayerPresence } from "../../../proto/schema/CommonProto/WarEvent/WecPlayerPresence.ts";
import {
    checkIsValid as checkIsValidTileFilter,
    checkIsMeet as checkIsMeetTileFilter,
} from "../../../tiles/utils/Filter.ts";
import {
    checkIsValid as checkIsValidUnitFilter,
    checkIsMeet as checkIsMeetUnitFilter,
} from "../../../units/utils/Filter.ts";
import {
    getDesc,
    checkIsValid as checkIsValidValueAndComparator,
    checkIsMeet as checkIsMeetValueAndComparator,
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
        con == null ? UndefinedError : (con.getValue())
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
        con == null ? UndefinedError : (con.getValue())
    );
}
export function getErrorTip(data: WecPlayerPresence, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GameConfig): string | null {
    {
        const comparator = data.getConPlayerComparator();
        if (comparator == null) {
            return getFormattedText(
                TextType.F0091,
                getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Players)),
            );
        }
        if (!checkIsValidValueAndComparator(comparator)) {
            return getFormattedText(
                TextType.F0091,
                getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Players)),
            );
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null) && (!checkIsValidPlayerFilter(filter, playersCountUnneutral, gameConfig))) {
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
            if (!checkIsValidValueAndComparator(comparator)) {
                return getFormattedText(
                    TextType.F0091,
                    getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Units)),
                );
            }
        }
    }

    {
        const filter = data.getConUnitFilter();
        if ((filter != null) && (!checkIsValidUnitFilter(filter, playersCountUnneutral, mapSize, gameConfig))) {
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
            if (!checkIsValidValueAndComparator(comparator)) {
                return getFormattedText(
                    TextType.F0091,
                    getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.B0899)),
                );
            }
        }
    }

    {
        const filter = data.getConTileFilter();
        if ((filter != null) && (!checkIsValidTileFilter(filter, playersCountUnneutral, mapSize, gameConfig))) {
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

export function checkIsValid(data: Undefinable<WecPlayerPresence>, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GameConfig): boolean {
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
            if ((filter == null) || (checkIsMeetPlayerFilter(filter, player))) {
                players.push(player);
            }
        }
    }

    const unitDict          = new Map<number, number>();
    const unitComparator    = data.getConUnitComparator();
    if (unitComparator != null) {
        const filter = data.getConUnitFilter();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((filter == null) || (checkIsMeetUnitFilter(filter, unit))) {
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
            if ((filter == null) || (checkIsMeetTileFilter(filter, tile))) {
                const playerIndex = tile.getPlayerIndex();
                tileDict.set(playerIndex, (tileDict.get(playerIndex) ?? 0) + 1);
            }
        }
    }

    let playersCount = 0;
    for (const player of players) {
        const playerIndex = player.getPlayerIndex();
        if ((unitComparator != null)                                                            &&
            (!checkIsMeetValueAndComparator(unitComparator, unitDict.get(playerIndex) ?? 0))
        )  {
            continue;
        }
        if ((tileComparator != null)                                                            &&
            (!checkIsMeetValueAndComparator(tileComparator, tileDict.get(playerIndex) ?? 0))
        ) {
            continue;
        }
        ++playersCount;
    }
    return checkIsMeetValueAndComparator(playerComparator, playersCount);
}
