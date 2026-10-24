import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersConstants from "../../../numbers/Constants.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaDeleteTileBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffSimple.ts";
import * as TileBuffsUtilsFilter from "../../../tileBuffs/utils/Filter.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type Undefinable<T>             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type PlayerFilter               = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type TileBuff                   = ProtoSchemaCommonProtoStructureTileBuff.TileBuff;
type WeaDeleteTileBuffSimple    = ProtoSchemaCommonProtoWarEventWeaDeleteTileBuffSimple.WeaDeleteTileBuffSimple;
type IPlayer                    = PlayersIPlayer.IPlayer;

export function checkIsValid(
    data                    : Undefinable<WeaDeleteTileBuffSimple>,
    mapSize                 : AuxiliaryTypesMapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigGcData.GcData
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gcData) == null);
}

export function getBriefDesc(data: Undefinable<WeaDeleteTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0262,
        LangUtils.getText(LangConstants.TextType.B1459),
    );
}
export function getDetailDesc(data: Undefinable<WeaDeleteTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConTileBuffFilter();
            if (filter != null) {
                conTextArray.push(`- ${TileBuffsUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- ${TilesUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${LangUtils.getText(LangConstants.TextType.B1421)}) ${PlayersUtilsFilter.getDescForEmbed(filter)}`);
            }
        }
        {
            const comparator = data.getConUnitComparator();
            if (comparator != null) {
                conTextArray.push(`- ${ValueAndComparatorsUtils.getDesc(
                    comparator,
                    LangUtils.getText(data.getConUnitFilter() == null ? LangConstants.TextType.B1418 : LangConstants.TextType.B1419)
                )}`);
            }
        }

        if (!conTextArray.length) {
            conTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0944)}`);
        }
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0263,
        LangUtils.getText(LangConstants.TextType.B1459),
        conTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaDeleteTileBuffSimple,
    mapSize                 : AuxiliaryTypesMapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigGcData.GcData
): string | null {
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                            &&
            (!PlayersUtilsFilter.checkIsValid(filter, playersCountUnneutral, gcData))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!UnitsUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gcData)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.UnitFilter));
            }
            if (data.getConUnitComparator() == null) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
            }
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                    &&
            (!TilesUtilsFilter.checkIsValid(filter, playersCountUnneutral, mapSize, gcData))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                                    &&
            (!ValueAndComparatorsUtils.checkIsValid(comparator))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }
    {
        const filter = data.getConTileBuffFilter();
        if ((filter != null)                                &&
            (!TileBuffsUtilsFilter.checkIsValid(filter))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1235));
        }
    }
    {
        const con = data.getConMaxDeleteCount();
        if ((con != null) && (con <= 0)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1457));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaDeleteTileBuffSimple): Promise<void> {
    // nothing to do
}

export async function applyWithoutExtraData(action: WeaDeleteTileBuffSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetTileDict = new Map<TilesITile.ITile, TileBuff[]>();
    {
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const conTileFilter         = action.getConTileFilter();
        const conUnitFilter         = action.getConUnitFilter();
        const conUnitComparator     = action.getConUnitComparator();
        const conPlayerFilter       = action.getConPlayerFilter();
        const conTileBuffFilter     = action.getConTileBuffFilter();
        const conMaxDeleteCount     = action.getConMaxDeleteCount() ?? NumbersConstants.MaxInt32;
        const playerFilterDict      = new Map<IPlayer, boolean>();
        for (const column of tileMap.getMap()) {
            for (const tile of column) {
                const oldBuffList = tile.getUnfixedBuffList();
                if ((oldBuffList == null)       ||
                    (oldBuffList.length <= 0)
                ) {
                    continue;
                }

                if ((conTileFilter != null)                                 &&
                    (!TilesUtilsFilter.checkIsMeet(conTileFilter, tile))
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
                        .filter(unit => (conUnitFilter == null) || (UnitsUtilsFilter.checkIsMeet(conUnitFilter, unit)))
                        .length;
                    if (!ValueAndComparatorsUtils.checkIsMeet(conUnitComparator, count)) {
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
                        (!TileBuffsUtilsFilter.checkIsMeet(conTileBuffFilter, oldBuff, war))
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

function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, PlayersUtilsFilter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
