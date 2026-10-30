import {
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    ValueAndComparators_Utils,
    Lang_Utils,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WecPlayerPresence } from "../../../proto/schema/CommonProto/WarEvent/WecPlayerPresence.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecPlayerPresence>): string | null {
    if (data == null) {
        return null;
    }

    const con           = data.getConPlayerComparator();
    const comparator    = con == null ? null : con.getComparator();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0098,
        Lang_Utils.getText(Lang_Constants.TextType.Players),
        comparator == null ? Lang_Constants.UndefinedError : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError),
        con == null ? Lang_Constants.UndefinedError : (con.getValue()),
    );
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecPlayerPresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- ${Players_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            subTextArray.push(`- ${ValueAndComparators_Utils.getDesc(
                comparator,
                Lang_Utils.getText(data.getConUnitFilter() == null ? Lang_Constants.TextType.B1404 : Lang_Constants.TextType.B1405),
            )}`);
        }
    }
    {
        const comparator = data.getConTileComparator();
        if (comparator != null) {
            subTextArray.push(`- ${ValueAndComparators_Utils.getDesc(
                comparator,
                Lang_Utils.getText(data.getConTileFilter() == null ? Lang_Constants.TextType.B1406 : Lang_Constants.TextType.B1407),
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
    }

    const con           = data.getConPlayerComparator();
    const comparator    = con == null ? null : con.getComparator();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0232,
        Lang_Utils.getText(Lang_Constants.TextType.Players),
        subTextArray.join(`\n`),
        comparator == null ? Lang_Constants.UndefinedError : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError),
        con == null ? Lang_Constants.UndefinedError : (con.getValue()),
    );
}
export function getErrorTip(data: WecPlayerPresence, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const comparator = data.getConPlayerComparator();
        if (comparator == null) {
            return Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0091,
                Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.Players)),
            );
        }
        if (!ValueAndComparators_Utils.checkIsValid(comparator)) {
            return Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0091,
                Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.Players)),
            );
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null) && (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gameConfig))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter));
        }
    }

    {
        const comparator = data.getConUnitComparator();
        if (comparator == null) {
            if (data.getConUnitFilter() != null) {
                return Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0091,
                    Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.Units)),
                );
            }
        } else {
            if (!ValueAndComparators_Utils.checkIsValid(comparator)) {
                return Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0091,
                    Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.Units)),
                );
            }
        }
    }

    {
        const filter = data.getConUnitFilter();
        if ((filter != null) && (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitFilter));
        }
    }

    {
        const comparator = data.getConTileComparator();
        if (comparator == null) {
            if (data.getConTileFilter() != null) {
                return Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0091,
                    Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.B0899)),
                );
            }
        } else {
            if (!ValueAndComparators_Utils.checkIsValid(comparator)) {
                return Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0091,
                    Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.B0899)),
                );
            }
        }
    }

    {
        const filter = data.getConTileFilter();
        if ((filter != null) && (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
        }
    }

    if ((data.getConPlayerFilter() == null)      &&
        (data.getConUnitComparator() == null)    &&
        (data.getConTileComparator() == null)
    ) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0944);
    }

    return null;
}

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecPlayerPresence>, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    return (data != null) && (getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null);
}

export function checkIsMeet(data: WecPlayerPresence, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    const playerComparator = data.getConPlayerComparator();
    if (playerComparator == null) {
        return false;
    }

    const players: Players_IPlayer.IPlayer[] = [];
    {
        const filter = data.getConPlayerFilter();
        for (const player of war.getPlayerManager().getAllPlayers(true)) {
            if ((filter == null) || (Players_Utils_Filter.checkIsMeet(filter, player))) {
                players.push(player);
            }
        }
    }

    const unitDict          = new Map<number, number>();
    const unitComparator    = data.getConUnitComparator();
    if (unitComparator != null) {
        const filter = data.getConUnitFilter();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((filter == null) || (Units_Utils_Filter.checkIsMeet(filter, unit))) {
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
            if ((filter == null) || (Tiles_Utils_Filter.checkIsMeet(filter, tile))) {
                const playerIndex = tile.getPlayerIndex();
                tileDict.set(playerIndex, (tileDict.get(playerIndex) ?? 0) + 1);
            }
        }
    }

    let playersCount = 0;
    for (const player of players) {
        const playerIndex = player.getPlayerIndex();
        if ((unitComparator != null)                                                            &&
            (!ValueAndComparators_Utils.checkIsMeet(unitComparator, unitDict.get(playerIndex) ?? 0))
        )  {
            continue;
        }
        if ((tileComparator != null)                                                            &&
            (!ValueAndComparators_Utils.checkIsMeet(tileComparator, tileDict.get(playerIndex) ?? 0))
        ) {
            continue;
        }
        ++playersCount;
    }
    return ValueAndComparators_Utils.checkIsMeet(playerComparator, playersCount);
}
