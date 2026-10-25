import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getText, getComparatorName } from "../../../lang/Utils.ts";
import type { IPlayer as PlayersIPlayer } from "../../../players/IPlayer.ts";
import {
    getDescForEmbed,
    checkIsValid as PlayersUtilsFilterCheckIsValid,
    checkIsMeet as PlayersUtilsFilterCheckIsMeet,
} from "../../../players/utils/Filter.ts";
import type {
    PlayerFilter as ProtoSchemaCommonProtoStructurePlayerFilter,
} from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileFilter as ProtoSchemaCommonProtoStructureTileFilter } from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type {
    WecUnitPresence as ProtoSchemaCommonProtoWarEventWecUnitPresence,
} from "../../../proto/schema/CommonProto/WarEvent/WecUnitPresence.ts";
import type { ITile as TilesITile } from "../../../tiles/ITile.ts";
import {
    getDescForEmbed as TilesUtilsFilterGetDescForEmbed,
    checkIsValid as TilesUtilsFilterCheckIsValid,
    checkIsMeet as TilesUtilsFilterCheckIsMeet,
} from "../../../tiles/utils/Filter.ts";
import {
    getDescForEmbed as UnitsUtilsFilterGetDescForEmbed,
    checkIsValid as UnitsUtilsFilterCheckIsValid,
    checkIsMeet as UnitsUtilsFilterCheckIsMeet,
} from "../../../units/utils/Filter.ts";
import {
    checkIsValid as ValueAndComparatorsUtilsCheckIsValid,
    checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet,
} from "../../../valueAndComparators/Utils.ts";

type WecUnitPresence                = ProtoSchemaCommonProtoWarEventWecUnitPresence;
type PlayerFilter                   = ProtoSchemaCommonProtoStructurePlayerFilter;
type TileFilter                     = ProtoSchemaCommonProtoStructureTileFilter;
type IPlayer                        = PlayersIPlayer;
type ITile                          = TilesITile;

export function getBriefDesc(data: Undefinable<WecUnitPresence>): string | null {
    if (data == null) {
        return null;
    }

    const con           = data.getConUnitComparator();
    const comparator    = con == null ? null : con.getComparator();
    return getFormattedText(
        TextType.F0098,
        getText(TextType.Units),
        comparator == null ? UndefinedError : (getComparatorName(comparator) ?? UndefinedError),
        con == null ? UndefinedError : (con.getValue() ?? UndefinedError)
    );
}
export function getDetailedDesc(data: Undefinable<WecUnitPresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            subTextArray.push(`- ${UnitsUtilsFilterGetDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${getText(TextType.B1422)}) ${getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- (${getText(TextType.B1423)}) ${TilesUtilsFilterGetDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${getText(TextType.A0944)}`);
    }

    const con           = data.getConUnitComparator();
    const comparator    = con == null ? null : con.getComparator();
    return getFormattedText(
        TextType.F0232,
        getText(TextType.Units),
        subTextArray.join(`\n`),
        comparator == null ? UndefinedError : (getComparatorName(comparator) ?? UndefinedError),
        con == null ? UndefinedError : (con.getValue() ?? UndefinedError)
    );
}
export function getErrorTip(data: WecUnitPresence, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): string | null {
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
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
            return getFormattedText(
                TextType.F0091,
                getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Units)),
            );
        } else {
            if (!ValueAndComparatorsUtilsCheckIsValid(comparator)) {
                return getFormattedText(
                    TextType.F0091,
                    getFormattedText(TextType.FormatComparatorOfNumberOf, getText(TextType.Units)),
                );
            }
        }
    }

    return null;
}

export function checkIsValid(data: Undefinable<WecUnitPresence>, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): boolean {
    return (data != null) && (getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null);
}

export function checkIsMeet(data: WecUnitPresence, war: IBwWar): boolean {
    const unitComparator = data.getConUnitComparator();
    if (unitComparator == null) {
        return false;
    }

    const tileFilter        = data.getConTileFilter();
    const tileFilterDict    = new Map<ITile, boolean>();
    const playerFilter      = data.getConPlayerFilter();
    const playerFilterDict  = new Map<IPlayer, boolean>();
    const unitFilter        = data.getConUnitFilter();
    const tileMap           = war.getTileMap();
    let unitsCount          = 0;
    for (const unit of war.getUnitMap().getAllUnits()) {
        if ((unitFilter != null) && (!UnitsUtilsFilterCheckIsMeet(unitFilter, unit))) {
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
    return ValueAndComparatorsUtilsCheckIsMeet(unitComparator, unitsCount);
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, PlayersUtilsFilterCheckIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<ITile, boolean>, filter: TileFilter, tile: ITile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, TilesUtilsFilterCheckIsMeet(filter, tile));
    }
    return !!resultDict.get(tile);
}
