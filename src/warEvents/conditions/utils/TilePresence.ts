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
    type Tiles_Tile,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { UnitFilter } from "../../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import type { ValueAndComparator } from "../../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type { WecTilePresence } from "../../../proto/schema/CommonProto/WarEvent/WecTilePresence.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecTilePresence>): string | null {
    if (data == null) {
        return null;
    }

    const con           = data.getConTileComparator();
    const comparator    = con == null ? null : con.getComparator();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0098,
        Lang_Utils.getText(Lang_Constants.TextType.Tiles),
        comparator == null ? Lang_Constants.UndefinedError : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError),
        con == null ? Lang_Constants.UndefinedError : (con.getValue()),
    );
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecTilePresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            subTextArray.push(`- ${ValueAndComparators_Utils.getDesc(
                comparator,
                Lang_Utils.getText(data.getConUnitFilter() == null ? Lang_Constants.TextType.B1418 : Lang_Constants.TextType.B1419),
            )}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1421)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
    }

    const con           = data.getConTileComparator();
    const comparator    = con == null ? null : con.getComparator();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0232,
        Lang_Utils.getText(Lang_Constants.TextType.Tiles),
        subTextArray.join(`\n`),
        comparator == null ? Lang_Constants.UndefinedError : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError),
        con == null ? Lang_Constants.UndefinedError : (con.getValue()),
    );
}
export function getErrorTip(data: WecTilePresence, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
        }
    }

    {
        const comparator = data.getConTileComparator();
        if (comparator == null) {
            return Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0091,
                Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.Tiles)),
            );
        }
        if (!ValueAndComparators_Utils.checkIsValid(comparator)) {
            return Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0091,
                Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.Tiles)),
            );
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitFilter));
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

    if ((data.getConTileFilter() == null)        &&
        (data.getConPlayerFilter() == null)      &&
        (data.getConUnitComparator() == null)
    ) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0944);
    }

    return null;
}

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecTilePresence>, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    return (data != null) && (getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null);
}

export function checkIsMeet(data: WecTilePresence, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    const tileComparator = data.getConTileComparator();
    if (tileComparator == null) {
        return false;
    }

    const tileFilter        = data.getConTileFilter();
    const playerFilter      = data.getConPlayerFilter();
    const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
    const unitFilter        = data.getConUnitFilter();
    const unitComparator    = data.getConUnitComparator();
    let tilesCount          = 0;
    for (const tile of war.getTileMap().getAllTiles()) {
        if ((tileFilter != null) && (!Tiles_Utils_Filter.checkIsMeet(tileFilter, tile))) {
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
    return ValueAndComparators_Utils.checkIsMeet(tileComparator, tilesCount);
}
function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConUnitComparator(filter: AuxiliaryTypes_AuxiliaryTypes.Undefinable<UnitFilter>, comparator: ValueAndComparator, tile: Tiles_Tile.Tile): boolean {
    let unitsCount = 0;
    for (const unit of tile.getWar().getUnitMap().getAllUnitsOnGrid(tile.getGridIndex())) {
        if ((filter != null) && (!Units_Utils_Filter.checkIsMeet(filter, unit))) {
            continue;
        }

        ++unitsCount;
    }
    return ValueAndComparators_Utils.checkIsMeet(comparator, unitsCount);
}
