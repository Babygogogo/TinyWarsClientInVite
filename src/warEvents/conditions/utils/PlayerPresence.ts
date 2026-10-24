import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoWarEventWecPlayerPresence from "../../../proto/schema/CommonProto/WarEvent/WecPlayerPresence.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type WecPlayerPresence              = ProtoSchemaCommonProtoWarEventWecPlayerPresence.WecPlayerPresence;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecPlayerPresence>): string | null {
    if (data == null) {
        return null;
    }

    const con           = data.getConPlayerComparator();
    const comparator    = con == null ? null : con.getComparator();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0098,
        LangUtils.getText(LangConstants.TextType.Players),
        comparator == null ? LangConstants.UndefinedError : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError),
        con == null ? LangConstants.UndefinedError : (con.getValue() ?? LangConstants.UndefinedError)
    );
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecPlayerPresence>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const filter = data.getConPlayerFilter();
        if (filter != null) {
            subTextArray.push(`- ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if (comparator != null) {
            subTextArray.push(`- ${ValueAndComparatorsUtils.getDesc(
                comparator,
                LangUtils.getText(data.getConUnitFilter() == null ? LangConstants.TextType.B1404 : LangConstants.TextType.B1405)
            )}`);
        }
    }
    {
        const comparator = data.getConTileComparator();
        if (comparator != null) {
            subTextArray.push(`- ${ValueAndComparatorsUtils.getDesc(
                comparator,
                LangUtils.getText(data.getConTileFilter() == null ? LangConstants.TextType.B1406 : LangConstants.TextType.B1407)
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
    }

    const con           = data.getConPlayerComparator();
    const comparator    = con == null ? null : con.getComparator();
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0232,
        LangUtils.getText(LangConstants.TextType.Players),
        subTextArray.join(`\n`),
        comparator == null ? LangConstants.UndefinedError : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError),
        con == null ? LangConstants.UndefinedError : (con.getValue() ?? LangConstants.UndefinedError)
    );
}
export function getErrorTip(data: WecPlayerPresence, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const comparator = data.getConPlayerComparator();
        if (comparator == null) {
            return LangUtils.getFormattedText(
                LangConstants.TextType.F0091,
                LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.Players)),
            );
        }
        if (!ValueAndComparatorsUtils.checkIsValid(comparator)) {
            return LangUtils.getFormattedText(
                LangConstants.TextType.F0091,
                LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.Players)),
            );
        }
    }

    {
        const filter = data.getConPlayerFilter();
        if ((filter != null) && (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gameConfig))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
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

    {
        const filter = data.getConUnitFilter();
        if ((filter != null) && (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
        }
    }

    {
        const comparator = data.getConTileComparator();
        if (comparator == null) {
            if (data.getConTileFilter() != null) {
                return LangUtils.getFormattedText(
                    LangConstants.TextType.F0091,
                    LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.B0899)),
                );
            }
        } else {
            if (!ValueAndComparatorsUtils.checkIsValid(comparator)) {
                return LangUtils.getFormattedText(
                    LangConstants.TextType.F0091,
                    LangUtils.getFormattedText(LangConstants.TextType.FormatComparatorOfNumberOf, LangUtils.getText(LangConstants.TextType.B0899)),
                );
            }
        }
    }

    {
        const filter = data.getConTileFilter();
        if ((filter != null) && (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gameConfig))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }

    if ((data.getConPlayerFilter() == null)      &&
        (data.getConUnitComparator() == null)    &&
        (data.getConTileComparator() == null)
    ) {
        return LangUtils.getText(LangConstants.TextType.A0944);
    }

    return null;
}

export function checkIsValid(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecPlayerPresence>, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): boolean {
    return (data != null) && (getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null);
}

export function checkIsMeet(data: WecPlayerPresence, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    const playerComparator = data.getConPlayerComparator();
    if (playerComparator == null) {
        return false;
    }

    const players: PlayersIPlayer.IPlayer[] = [];
    {
        const filter = data.getConPlayerFilter();
        for (const player of war.getPlayerManager().getAllPlayers(true)) {
            if ((filter == null) || (PlayersUtilsFilter.checkIsMeet(filter, player))) {
                players.push(player);
            }
        }
    }

    const unitDict          = new Map<number, number>();
    const unitComparator    = data.getConUnitComparator();
    if (unitComparator != null) {
        const filter = data.getConUnitFilter();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((filter == null) || (UnitsUtilsFilter.checkIsMeet(filter, unit))) {
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
            if ((filter == null) || (TilesUtilsFilter.checkIsMeet(filter, tile))) {
                const playerIndex = tile.getPlayerIndex();
                tileDict.set(playerIndex, (tileDict.get(playerIndex) ?? 0) + 1);
            }
        }
    }

    let playersCount = 0;
    for (const player of players) {
        const playerIndex = player.getPlayerIndex();
        if ((unitComparator != null)                                                            &&
            (!ValueAndComparatorsUtils.checkIsMeet(unitComparator, unitDict.get(playerIndex) ?? 0))
        )  {
            continue;
        }
        if ((tileComparator != null)                                                            &&
            (!ValueAndComparatorsUtils.checkIsMeet(tileComparator, tileDict.get(playerIndex) ?? 0))
        ) {
            continue;
        }
        ++playersCount;
    }
    return ValueAndComparatorsUtils.checkIsMeet(playerComparator, playersCount);
}
