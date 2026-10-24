import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureUnitFilter from "../../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import type * as ProtoSchemaCommonProtoStructureValueAndComparator from "../../../proto/schema/CommonProto/Structure/ValueAndComparator.ts";
import type * as ProtoSchemaCommonProtoWarEventWecTilePresence from "../../../proto/schema/CommonProto/WarEvent/WecTilePresence.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type WecTilePresence                = ProtoSchemaCommonProtoWarEventWecTilePresence.WecTilePresence;
type PlayerFilter                   = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type UnitFilter                     = ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter;
type ValueAndComparator             = ProtoSchemaCommonProtoStructureValueAndComparator.ValueAndComparator;
type IPlayer                        = PlayersIPlayer.IPlayer;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecTilePresence>): string | null {
    if (data == null) {
        return null;
    }

    const con           = data.getConTileComparator();
    const comparator    = con == null ? null : con.getComparator();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0098,
        LangUtils.getText(LangConstants.TextType.Tiles),
        comparator == null ? LangConstants.UndefinedError : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError),
        con == null ? LangConstants.UndefinedError : (con.getValue() ?? LangConstants.UndefinedError)
    );
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecTilePresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            subTextArray.push(`- ${ValueAndComparatorsUtils.getDesc(
                comparator,
                LangUtils.getText(data.getConUnitFilter() == null ? LangConstants.TextType.B1418 : LangConstants.TextType.B1419)
            )}`);
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1421)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const filter = data.getConTileFilter();
        if (filter != null) {
            subTextArray.push(`- ${TilesUtilsFilter.getDescForEmbed(filter)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    const con           = data.getConTileComparator();
    const comparator    = con == null ? null : con.getComparator();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0232,
        LangUtils.getText(LangConstants.TextType.Tiles),
        subTextArray.join(`\n`),
        comparator == null ? LangConstants.UndefinedError : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError),
        con == null ? LangConstants.UndefinedError : (con.getValue() ?? LangConstants.UndefinedError)
    );
}
export function getErrorTip(data: WecTilePresence, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }

    {
        const comparator = data.getConTileComparator();
        if (comparator == null) {
            return LangUtils.getFormattedText(
                LangConstants.TextType.F0091,
                LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.Tiles)),
            );
        }
        if (!ValueAndComparatorsUtils.checkIsValid(comparator)) {
            return LangUtils.getFormattedText(
                LangConstants.TextType.F0091,
                LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.Tiles)),
            );
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
            if (data.getConUnitFilter() != null) {
                return LangUtils.getFormattedText(
                    LangConstants.TextType.F0091,
                    LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.Units)),
                );
            }
        } else {
            if (!ValueAndComparatorsUtils.checkIsValid(comparator)) {
                return LangUtils.getFormattedText(
                    LangConstants.TextType.F0091,
                    LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.Units)),
                );
            }
        }
    }


    if ((data.getConTileFilter() == null)        &&
        (data.getConPlayerFilter() == null)      &&
        (data.getConUnitComparator() == null)
    ) {
        return LangUtils.getText(LangConstants.TextType.A0944);
    }

    return null;
}

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecTilePresence>, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): boolean {
    return (data != null) && (getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null);
}

export function checkIsMeet(data: WecTilePresence, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
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
        if ((tileFilter != null) && (!TilesUtilsFilter.checkIsMeet(tileFilter, tile))) {
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
    return ValueAndComparatorsUtils.checkIsMeet(tileComparator, tilesCount);
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function checkIsMeetConUnitComparator(filter: AuxiliaryTypesAuxiliaryTypes.Undefinable<UnitFilter>, comparator: ValueAndComparator, tile: TilesITile.ITile): boolean {
    let unitsCount = 0;
    for (const unit of tile.getWar().getUnitMap().getAllUnitsOnGrid(tile.getGridIndex())) {
        if ((filter != null) && (!UnitsUtilsFilter.checkIsMeet(filter, unit))) {
            continue;
        }

        ++unitsCount;
    }
    return ValueAndComparatorsUtils.checkIsMeet(comparator, unitsCount);
}
