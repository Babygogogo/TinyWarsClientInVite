import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../../../gameConfigs/GameConfig.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText, getText } from "../../../lang/Utils.ts";
import { MaxInt32 } from "../../../numbers/Constants.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { UnitBuff } from "../../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type { WeaDeleteUnitBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteUnitBuffSimple.ts";
import {
    getDescForEmbed as TilesUtilsFilterGetDescForEmbed,
    checkIsValid as TilesUtilsFilterCheckIsValid,
    checkIsMeet as TilesUtilsFilterCheckIsMeet,
} from "../../../tiles/utils/Filter.ts";
import {
    getDescForEmbed as UnitBuffsUtilsFilterGetDescForEmbed,
    checkIsValid as UnitBuffsUtilsFilterCheckIsValid,
    checkIsMeet as UnitBuffsUtilsFilterCheckIsMeet,
} from "../../../unitBuffs/utils/Filter.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import {
    getDescForEmbed as UnitsUtilsFilterGetDescForEmbed,
    checkIsValid as UnitsUtilsFilterCheckIsValid,
    checkIsMeet as UnitsUtilsFilterCheckIsMeet,
} from "../../../units/utils/Filter.ts";

export function checkIsValid(
    data                    : Undefinable<WeaDeleteUnitBuffSimple>,
    mapSize                 : MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfig
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gcData) == null);
}

export function getBriefDesc(data: Undefinable<WeaDeleteUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return getFormattedText(
        TextType.F0262,
        getText(TextType.B1468),
    );
}
export function getDetailDesc(data: Undefinable<WeaDeleteUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConUnitBuffFilter();
            if (filter != null) {
                conTextArray.push(`- ${UnitBuffsUtilsFilterGetDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConUnitFilter();
            if (filter != null) {
                conTextArray.push(`- ${UnitsUtilsFilterGetDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- (${getText(TextType.B1423)}) ${TilesUtilsFilterGetDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${getText(TextType.B1422)}) ${getDescForEmbed(filter)}`);
            }
        }

        if (!conTextArray.length) {
            conTextArray.push(`- ${getText(TextType.A0944)}`);
        }
    }

    return getFormattedText(
        TextType.F0263,
        getText(TextType.B1468),
        conTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaDeleteUnitBuffSimple,
    mapSize                 : MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfig
): string | null {
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                            &&
            (!PlayersUtilsFilterCheckIsValid(filter, playersCountUnneutral, gcData))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConUnitFilter();
        if ((filter != null) &&
            (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gcData))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                    &&
            (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gcData))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }
    {
        const filter = data.getConUnitBuffFilter();
        if ((filter != null)                                &&
            (!UnitBuffsUtilsFilterCheckIsValid(filter))
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
export async function applyWithExtraData(_action: WeaDeleteUnitBuffSimple): Promise<void> {
    // nothing to do
}

export async function applyWithoutExtraData(action: WeaDeleteUnitBuffSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetUnitDict = new Map<IUnit, UnitBuff[]>();
    {
        const tileMap               = war.getTileMap();
        const conTileFilter         = action.getConTileFilter();
        const conUnitFilter         = action.getConUnitFilter();
        const conPlayerFilter       = action.getConPlayerFilter();
        const conUnitBuffFilter     = action.getConUnitBuffFilter();
        const conMaxDeleteCount     = action.getConMaxDeleteCount() ?? MaxInt32;
        const playerFilterDict      = new Map<IPlayer, boolean>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((conUnitFilter != null) &&
                (!UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit))
            ) {
                continue;
            }

            const oldBuffList = unit.getBuffList();
            if ((oldBuffList == null)       ||
                (oldBuffList.length <= 0)
            ) {
                continue;
            }

            if ((conTileFilter != null)                                                                 &&
                (!TilesUtilsFilterCheckIsMeet(conTileFilter, tileMap.getTile(unit.getGridIndex())))
            ) {
                continue;
            }

            if ((conPlayerFilter != null)                                                           &&
                (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))
            ) {
                continue;
            }

            const newBuffList   : UnitBuff[] = [];
            let modifiedCount   = 0;
            for (const oldBuff of oldBuffList) {
                if (modifiedCount >= conMaxDeleteCount) {
                    newBuffList.push(oldBuff);
                    continue;
                }

                if ((conUnitBuffFilter != null)                                             &&
                    (!UnitBuffsUtilsFilterCheckIsMeet(conUnitBuffFilter, oldBuff, war))
                ) {
                    newBuffList.push(oldBuff);
                } else {
                    ++modifiedCount;
                }
            }

            if (modifiedCount > 0) {
                targetUnitDict.set(unit, newBuffList);
            }
        }

        if (targetUnitDict.size <= 0) {
            return;
        }
    }

    {
        for (const [targetUnit, newBuffList] of targetUnitDict) {
            targetUnit.setBuffList(newBuffList);

            if (!isFastExecute) {
                targetUnit.updateView();
            }
        }
    }
}

function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
