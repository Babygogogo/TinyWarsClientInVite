import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../../proto/schema/CommonProto/Structure/TileFilter.ts";
import type * as ProtoSchemaCommonProtoWarEventWecUnitPresence from "../../../proto/schema/CommonProto/WarEvent/WecUnitPresence.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type WecUnitPresence                = ProtoSchemaCommonProtoWarEventWecUnitPresence.WecUnitPresence;
type PlayerFilter                   = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type TileFilter                     = ProtoSchemaCommonProtoStructureTileFilter.TileFilter;
type IPlayer                        = PlayersIPlayer.IPlayer;
type ITile                          = TilesITile.ITile;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecUnitPresence>): string | null {
    if (data == null) {
        return null;
    }

    const con           = data.getConUnitComparator();
    const comparator    = con == null ? null : con.getComparator();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0098,
        LangUtils.getText(LangConstants.TextType.Units),
        comparator == null ? LangConstants.UndefinedError : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError),
        con == null ? LangConstants.UndefinedError : (con.getValue() ?? LangConstants.UndefinedError)
    );
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecUnitPresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            subTextArray.push(`- ${UnitsUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1422)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1423)}) ${TilesUtilsFilter.getDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    const con           = data.getConUnitComparator();
    const comparator    = con == null ? null : con.getComparator();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0232,
        LangUtils.getText(LangConstants.TextType.Units),
        subTextArray.join(`\n`),
        comparator == null ? LangConstants.UndefinedError : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError),
        con == null ? LangConstants.UndefinedError : (con.getValue() ?? LangConstants.UndefinedError)
    );
}
export function getErrorTip(data: WecUnitPresence, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
        }
    }

    {
        const filter = data.getConUnitFilter();
        if ((filter != null)                                                                            &&
            (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
        }
    }

    {
        const comparator = data.getConUnitComparator();
        if (comparator == null) {
            return LangUtils.getFormattedText(
                LangConstants.TextType.F0091,
                LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.Units)),
            );
        } else {
            if (!ValueAndComparatorsUtils.checkIsValid(comparator)) {
                return LangUtils.getFormattedText(
                    LangConstants.TextType.F0091,
                    LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.Units)),
                );
            }
        }
    }

    return null;
}

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecUnitPresence>, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): boolean {
    return (data != null) && (getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null);
}

export function checkIsMeet(data: WecUnitPresence, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
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
        if ((unitFilter != null) && (!UnitsUtilsFilter.checkIsMeet(unitFilter, unit))) {
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
    return ValueAndComparatorsUtils.checkIsMeet(unitComparator, unitsCount);
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConTileFilter(resultDict: Map<ITile, boolean>, filter: TileFilter, tile: ITile): boolean {
    if (!resultDict.has(tile)) {
        resultDict.set(tile, TilesUtilsFilter.checkIsMeet(filter, tile));
    }
    return !!resultDict.get(tile);
}
