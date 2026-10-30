import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { TextType } from "../../../lang/Constants.ts";
import {
    getFormattedText,
    getText,
} from "../../../lang/Utils.ts";
import { MaxInt32 } from "../../../numbers/Constants.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import {
    getDescForEmbed as getPlayersDescForEmbed,
    checkIsValid as checkIsValidPlayerFilter,
    checkIsMeet as checkIsMeetPlayerFilter,
} from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { WeaDeleteTileBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteTileBuffSimple.ts";
import {
    getDescForEmbed as getTileBuffsDescForEmbed,
    checkIsValid as checkIsValidTileBuffFilter,
    checkIsMeet as checkIsMeetTileBuffFilter,
} from "../../../tileBuffs/utils/Filter.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import {
    getDescForEmbed as getTilesDescForEmbed,
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

export function checkIsValid(
    data                    : Undefinable<WeaDeleteTileBuffSimple>,
    mapSize                 : MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfig
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gcData) == null);
}

export function getBriefDesc(data: Undefinable<WeaDeleteTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return getFormattedText(
        TextType.F0262,
        getText(TextType.B1459),
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
                conTextArray.push(`- ${getTileBuffsDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- ${getTilesDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${getText(TextType.B1421)}) ${getPlayersDescForEmbed(filter)}`);
            }
        }
        {
            const comparator = data.getConUnitComparator();
            if (comparator != null) {
                conTextArray.push(`- ${getDesc(
                    comparator,
                    getText(data.getConUnitFilter() == null ? TextType.B1418 : TextType.B1419)
                )}`);
            }
        }

        if (!conTextArray.length) {
            conTextArray.push(`- ${getText(TextType.A0944)}`);
        }
    }

    return getFormattedText(
        TextType.F0263,
        getText(TextType.B1459),
        conTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaDeleteTileBuffSimple,
    mapSize                 : MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfig
): string | null {
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                            &&
            (!checkIsValidPlayerFilter(filter, playersCountUnneutral, gcData))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!checkIsValidUnitFilter(filter, playersCountUnneutral, mapSize, gcData)) {
                return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
            }
            if (data.getConUnitComparator() == null) {
                return getFormattedText(TextType.F0091, getText(TextType.Comparator));
            }
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                    &&
            (!checkIsValidTileFilter(filter, playersCountUnneutral, mapSize, gcData))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                                    &&
            (!checkIsValidValueAndComparator(comparator))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }
    {
        const filter = data.getConTileBuffFilter();
        if ((filter != null)                                &&
            (!checkIsValidTileBuffFilter(filter))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.B1235));
        }
    }
    {
        const con = data.getConMaxDeleteCount();
        if ((con != null) && (con <= 0)) {
            return getFormattedText(TextType.F0091, getText(TextType.B1457));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaDeleteTileBuffSimple): Promise<void> {
    // nothing to do
}

export async function applyWithoutExtraData(action: WeaDeleteTileBuffSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetTileDict = new Map<ITile, TileBuff[]>();
    {
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const conTileFilter         = action.getConTileFilter();
        const conUnitFilter         = action.getConUnitFilter();
        const conUnitComparator     = action.getConUnitComparator();
        const conPlayerFilter       = action.getConPlayerFilter();
        const conTileBuffFilter     = action.getConTileBuffFilter();
        const conMaxDeleteCount     = action.getConMaxDeleteCount() ?? MaxInt32;
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
                    (!checkIsMeetTileFilter(conTileFilter, tile))
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
                        .filter(unit => (conUnitFilter == null) || (checkIsMeetUnitFilter(conUnitFilter, unit)))
                        .length;
                    if (!checkIsMeetValueAndComparator(conUnitComparator, count)) {
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
                        (!checkIsMeetTileBuffFilter(conTileBuffFilter, oldBuff, war))
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
        resultDict.set(player, checkIsMeetPlayerFilter(filter, player));
    }
    return !!resultDict.get(player);
}
