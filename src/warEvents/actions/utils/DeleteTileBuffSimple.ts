import {
    Players_Utils_Filter,
    TileBuffs_Utils_Filter,
    Tiles_Utils_Filter,
    Units_Utils_Filter,
    ValueAndComparators_Utils,
    Lang_Utils,
    Numbers_Constants,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_Tile,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WeaDeleteTileBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffSimple.ts";

export function checkIsValid(
    data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteTileBuffSimple>,
    mapSize                 : AuxiliaryTypes_MapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigs_GameConfig.GameConfig,
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gcData) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0262,
        Lang_Utils.getText(Lang_Constants.TextType.B1459),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConTileBuffFilter();
            if (filter != null) {
                conTextArray.push(`- ${TileBuffs_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1421)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const comparator = data.getConUnitComparator();
            if (comparator != null) {
                conTextArray.push(`- ${ValueAndComparators_Utils.getDesc(
                    comparator,
                    Lang_Utils.getText(data.getConUnitFilter() == null ? Lang_Constants.TextType.B1418 : Lang_Constants.TextType.B1419),
                )}`);
            }
        }

        if (!conTextArray.length) {
            conTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
        }
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0263,
        Lang_Utils.getText(Lang_Constants.TextType.B1459),
        conTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaDeleteTileBuffSimple,
    mapSize                 : AuxiliaryTypes_MapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigs_GameConfig.GameConfig,
): string | null {
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                            &&
            (!Players_Utils_Filter.checkIsValid(filter, playersCountUnneutral, gcData))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gcData)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitFilter));
            }
            if (data.getConUnitComparator() == null) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
            }
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                    &&
            (!Tiles_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gcData))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                                    &&
            (!ValueAndComparators_Utils.checkIsValid(comparator))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }
    {
        const filter = data.getConTileBuffFilter();
        if ((filter != null)                                &&
            (!TileBuffs_Utils_Filter.checkIsValid(filter))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1235));
        }
    }
    {
        const con = data.getConMaxDeleteCount();
        if ((con != null) && (con <= 0)) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1457));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaDeleteTileBuffSimple): Promise<void> {
    // nothing to do
}

export async function applyWithoutExtraData(action: WeaDeleteTileBuffSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetTileDict = new Map<Tiles_Tile.Tile, TileBuff[]>();
    {
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const conTileFilter         = action.getConTileFilter();
        const conUnitFilter         = action.getConUnitFilter();
        const conUnitComparator     = action.getConUnitComparator();
        const conPlayerFilter       = action.getConPlayerFilter();
        const conTileBuffFilter     = action.getConTileBuffFilter();
        const conMaxDeleteCount     = action.getConMaxDeleteCount() ?? Numbers_Constants.MaxInt32;
        const playerFilterDict      = new Map<Players_IPlayer.IPlayer, boolean>();
        for (const column of tileMap.getMap()) {
            for (const tile of column) {
                const oldBuffList = tile.getUnfixedBuffList();
                if ((oldBuffList == null)       ||
                    (oldBuffList.length <= 0)
                ) {
                    continue;
                }

                if ((conTileFilter != null)                                 &&
                    (!Tiles_Utils_Filter.checkIsMeet(conTileFilter, tile))
                ) {
                    continue;
                }

                if ((conPlayerFilter != null)                                                           &&
                    (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, tile.getPlayer()))
                ) {
                    continue;
                }

                if (conUnitComparator != null) {
                    const count = unitMap
                        .getAllUnitsOnGrid(tile.getGridIndex())
                        .filter(unit => (conUnitFilter == null) || (Units_Utils_Filter.checkIsMeet(conUnitFilter, unit)))
                        .length;
                    if (!ValueAndComparators_Utils.checkIsMeet(conUnitComparator, count)) {
                        continue;
                    }
                }

                const newBuffList   : TileBuff[] = [];
                let modifiedCount   = 0;
                for (const oldBuff of oldBuffList) {
                    if (modifiedCount >= conMaxDeleteCount) {
                        newBuffList.push(oldBuff);
                        continue;
                    }

                    if ((conTileBuffFilter != null)                                             &&
                        (!TileBuffs_Utils_Filter.checkIsMeet(conTileBuffFilter, oldBuff, war))
                    ) {
                        newBuffList.push(oldBuff);
                    } else {
                        ++modifiedCount;
                    }
                }

                if (modifiedCount > 0) {
                    targetTileDict.set(tile, newBuffList);
                }
            }
        }

        if (targetTileDict.size <= 0) {
            return;
        }
    }

    {
        for (const [targetTile, newBuffList] of targetTileDict) {
            targetTile.setUnfixedBuffList(newBuffList);

            if (!isFastExecute) {
                targetTile.flushDataToView();
            }
        }
    }
}

function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
