import {
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    UnitBuffs_Utils_Filter,
    Units_Utils_Filter,
    Lang_Utils,
    Numbers_Constants,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Units_IUnit,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { UnitBuff } from "../../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type { WeaDeleteUnitBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaDeleteUnitBuffSimple.ts";

export function checkIsValid(
    data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteUnitBuffSimple>,
    mapSize                 : AuxiliaryTypes_MapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigs_GameConfig.GameConfig
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gcData) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0262,
        Lang_Utils.getText(Lang_Constants.TextType.B1468),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDeleteUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
        {
            const filter = data.getConUnitBuffFilter();
            if (filter != null) {
                conTextArray.push(`- ${UnitBuffs_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConUnitFilter();
            if (filter != null) {
                conTextArray.push(`- ${Units_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1423)}) ${Tiles_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${Lang_Utils.getText(Lang_Constants.TextType.B1422)}) ${Players_Utils_Filter.getDescForEmbed(filter)}`);
            }
        }

        if (!conTextArray.length) {
            conTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0944)}`);
        }
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0263,
        Lang_Utils.getText(Lang_Constants.TextType.B1468),
        conTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaDeleteUnitBuffSimple,
    mapSize                 : AuxiliaryTypes_MapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigs_GameConfig.GameConfig
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
        if ((filter != null) &&
            (!Units_Utils_Filter.checkIsValid(filter, playersCountUnneutral, mapSize, gcData))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.UnitFilter));
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
        const filter = data.getConUnitBuffFilter();
        if ((filter != null)                                &&
            (!UnitBuffs_Utils_Filter.checkIsValid(filter))
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
export async function applyWithExtraData(_action: WeaDeleteUnitBuffSimple): Promise<void> {
    // nothing to do
}

export async function applyWithoutExtraData(action: WeaDeleteUnitBuffSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetUnitDict = new Map<Units_IUnit.IUnit, UnitBuff[]>();
    {
        const tileMap               = war.getTileMap();
        const conTileFilter         = action.getConTileFilter();
        const conUnitFilter         = action.getConUnitFilter();
        const conPlayerFilter       = action.getConPlayerFilter();
        const conUnitBuffFilter     = action.getConUnitBuffFilter();
        const conMaxDeleteCount     = action.getConMaxDeleteCount() ?? Numbers_Constants.MaxInt32;
        const playerFilterDict      = new Map<Players_IPlayer.IPlayer, boolean>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((conUnitFilter != null) &&
                (!Units_Utils_Filter.checkIsMeet(conUnitFilter, unit))
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
                (!Tiles_Utils_Filter.checkIsMeet(conTileFilter, tileMap.getTile(unit.getGridIndex())))
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
                    (!UnitBuffs_Utils_Filter.checkIsMeet(conUnitBuffFilter, oldBuff, war))
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

function checkIsMeetConPlayerFilter(resultDict: Map<Players_IPlayer.IPlayer, boolean>, filter: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, Players_Utils_Filter.checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
