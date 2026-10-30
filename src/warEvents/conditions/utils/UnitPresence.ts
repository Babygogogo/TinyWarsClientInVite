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
    type Tiles_ITile,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type { WecUnitPresence } from "../../../proto/schema/CommonProto/WarEvent/WecUnitPresence.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecUnitPresence>): string | null {
    if (data == null) {
        return null;
    }

    const con           = data.getConUnitComparator();
    const comparator    = con == null ? null : con.getComparator();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0098,
        Lang_Utils.getText(Lang_Constants.TextType.Units),
        comparator == null ? Lang_Constants.UndefinedError : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError),
        con == null ? Lang_Constants.UndefinedError : (con.getValue()),
    );
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecUnitPresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            subTextArray.push(`- ${Units_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1422)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1423)}) ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
    }

    const con           = data.getConUnitComparator();
    const comparator    = con == null ? null : con.getComparator();
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0232,
        Lang_Utils.getText(Lang_Constants.TextType.Units),
        subTextArray.join(`\n`),
        comparator == null ? Lang_Constants.UndefinedError : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError),
        con == null ? Lang_Constants.UndefinedError : (con.getValue()),
    );
}
export function getErrorTip(data: WecUnitPresence, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
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
            return Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0091,
                Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.Units)),
            );
        } else {
            if (!ValueAndComparators_Utils.checkIsValid(comparator)) {
                return Lang_Utils.getFormattedText(
                    Lang_Constants.TextType.F0091,
                    Lang_Utils.getFormattedText(Lang_Constants.TextType.FormatComparatorOfNumberOf, Lang_Utils.getText(Lang_Constants.TextType.Units)),
                );
            }
        }
    }

    return null;
}

export function checkIsValid(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecUnitPresence>, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    return (data != null) && (getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null);
}

export function checkIsMeet(data: WecUnitPresence, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    const unitComparator = data.getConUnitComparator();
    if (unitComparator == null) {
        return false;
    }

    const tileFilter        = data.getConTileFilter();
    const tileFilterDict    = new Map<Tiles_ITile.ITile, boolean>();
    const playerFilter      = data.getConPlayerFilter();
    const playerFilterDict  = new Map<Players_IPlayer.IPlayer, boolean>();
    const unitFilter        = data.getConUnitFilter();
    const tileMap           = war.getTileMap();
    let unitsCount          = 0;
    for (const unit of war.getUnitMap().getAllUnits()) {
        if ((unitFilter != null) && (!Units_Utils_Filter.checkIsMeet(unitFilter, unit))) {
            continue;
        }

        if ((playerFilter != null) && (!checkIsMeetConPlayerFilter(playerFilterDict, playerFilter, unit.getPlayer()))) {
            continue;
        }

        if ((tileFilter != null) && (!checkIsMeetConTileFilter(tileFilterDict, tileFilter, tileMap.getTile(unit.getGridIndex())))) {
            continue;
        }

        ++unitsCount;
    }
    return ValueAndComparators_Utils.checkIsMeet(unitComparator, unitsCount);
}
function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<Tiles_ITile.ITile, boolean>, filter: TileFilter, tile: Tiles_ITile.ITile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, Tiles_Utils_Filter.checkIsMeet(filter, tile));
    }
    return !!resultDict.get(tile);
}
