import {
    WarEvents_Actions_Constants_Common,
    UnitBuffs_Utils_Common,
    Players_Utils_Filter,
    Tiles_Utils_Filter,
    UnitBuffs_Utils_Filter,
    Units_Utils_Filter,
    WarEvents_Actions_Utils_Common,
    Lang_Utils,
    Numbers_Constants,
    Helpers_Misc,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Units_IUnit,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import { UnitBuff } from "../../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type { WeaModifyUnitBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaModifyUnitBuffSimple.ts";

export function checkIsValid(
    data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaModifyUnitBuffSimple>,
    mapSize                 : AuxiliaryTypes_MapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigs_GameConfig.GameConfig,
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gcData) == null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaModifyUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const textArray: string[] = [];
    {
        if (data.getActBuffType() != null) {
            textArray.push(Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId));
        }
    }
    {
        if ((data.getActEndPlayerIndex() != null)                                          ||
            (data.getActEndPlayerIndexMode() != WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange)   ||
            (data.getActEndTurnIndex() != null)                                            ||
            (data.getActEndTurnIndexMode() != WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange)
        ) {
            textArray.push(Lang_Utils.getText(Lang_Constants.TextType.EndTime));
        }
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0254,
        Lang_Utils.getText(Lang_Constants.TextType.B1468),
        textArray.join(`, `) || Lang_Utils.getText(Lang_Constants.TextType.None),
    );
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaModifyUnitBuffSimple>): string | null {
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

    const actTextArray: string[] = [];
    {
        {
            const act = data.getActBuffType();
            if (act != null) {
                actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId)}: ${Lang_Utils.getUnitBuffName(act)}`);
            }
        }
        {
            const turnIndexMode     = data.getActEndTurnIndexMode() as WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode;
            const playerIndexMode   = data.getActEndPlayerIndexMode() as WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode;
            if ((turnIndexMode != WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange)      ||
                (playerIndexMode != WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange)
            ) {
                if ((turnIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete) ||
                    (playerIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete)
                ) {
                    actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndTime)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1455)}`);
                } else {
                    {
                        const turnIndex = data.getActEndTurnIndex() ?? 0;
                        if (turnIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.AddOffset) {
                            actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1460)} ${turnIndex >= 0 ? `+` : ``}${turnIndex}`);
                        } else if (turnIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetAbsoluteValue) {
                            actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex)}: ${turnIndex}`);
                        } else if (turnIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime) {
                            actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1461)} ${turnIndex >= 0 ? `+` : ``}${turnIndex}`);
                        }
                    }

                    {
                        const playerIndex = data.getActEndPlayerIndex() ?? 0;
                        if (playerIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.AddOffset) {
                            actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1460)} ${playerIndex >= 0 ? `+` : ``}${playerIndex}`);
                        } else if (playerIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetAbsoluteValue) {
                            actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex)}: ${playerIndex}`);
                        } else if (playerIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime) {
                            actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex)}: ${Lang_Utils.getText(Lang_Constants.TextType.B1461)} ${playerIndex >= 0 ? `+` : ``}${playerIndex}`);
                        }
                    }
                }
            }
        }

        if (!actTextArray.length) {
            actTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.A0957)}`);
        }
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0255,
        Lang_Utils.getText(Lang_Constants.TextType.B1468),
        conTextArray.join(`\n`),
        Lang_Utils.getText(Lang_Constants.TextType.B1468),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaModifyUnitBuffSimple,
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
        const con = data.getConMaxModifyCount();
        if ((con != null) && (con <= 0)) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1457));
        }
    }

    {
        const act = data.getActBuffType();
        if (act != null) {
            if (!UnitBuffs_Utils_Common.checkIsValidTypeId(act)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId));
            }
        }
    }
    {
        const actEndTurnIndexMode   = data.getActEndTurnIndexMode();
        const actEndPlayerIndexMode = data.getActEndPlayerIndexMode();
        if ((!WarEvents_Actions_Utils_Common.checkIsValidBuffEndTimeModificationMode(actEndTurnIndexMode)) ||
            (!WarEvents_Actions_Utils_Common.checkIsValidBuffEndTimeModificationMode(actEndPlayerIndexMode))
        ) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1458));
        }

        if ((actEndTurnIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete)     ||
            (actEndPlayerIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete)
        ) {
            if (actEndTurnIndexMode != actEndPlayerIndexMode) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B1458));
            }

            if (data.getActEndTurnIndex() != null) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex));
            }

            if (data.getActEndPlayerIndex() != null) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex));
            }

        } else {
            if (actEndTurnIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange) {
                if (data.getActEndTurnIndex() != null) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex));
                }

            } else {
                const actEndTurnIndex = data.getActEndTurnIndex();
                if (actEndTurnIndex == null) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex));
                }

                if (!UnitBuffs_Utils_Common.checkIsValidModificationEndTurnIndex(actEndTurnIndex)) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex));
                }
            }

            if (actEndPlayerIndexMode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange) {
                if (data.getActEndPlayerIndex() != null) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex));
                }

            } else {
                const actEndPlayerIndex = data.getActEndPlayerIndex();
                if (actEndPlayerIndex == null) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex));
                }

                if (!UnitBuffs_Utils_Common.checkIsValidModificationEndPlayerIndex(actEndPlayerIndex)) {
                    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex));
                }
            }
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaModifyUnitBuffSimple): Promise<void> {
    // nothing to do
}

export async function applyWithoutExtraData(action: WeaModifyUnitBuffSimple, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const targetUnitDict = new Map<Units_IUnit.IUnit, UnitBuff[]>();
    {
        const tileMap               = war.getTileMap();
        const turnManager           = war.getTurnManager();
        const warTurnIndex          = turnManager.getTurnIndex();
        const warPlayerIndex        = turnManager.getPlayerIndexInTurn();
        const playersCountNeutral   = war.getPlayerManager().getTotalPlayersCount(true);
        const conTileFilter         = action.getConTileFilter();
        const conUnitFilter         = action.getConUnitFilter();
        const conPlayerFilter       = action.getConPlayerFilter();
        const conUnitBuffFilter     = action.getConUnitBuffFilter();
        const conMaxModifyCount     = action.getConMaxModifyCount() ?? Numbers_Constants.MaxInt32;
        const playerFilterDict      = new Map<Players_IPlayer.IPlayer, boolean>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const oldBuffList = unit.getBuffList();
            if ((oldBuffList == null)       ||
                (oldBuffList.length <= 0)
            ) {
                continue;
            }

            if ((conUnitFilter != null) &&
                (!Units_Utils_Filter.checkIsMeet(conUnitFilter, unit))
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
                if (modifiedCount >= conMaxModifyCount) {
                    newBuffList.push(oldBuff);
                    continue;
                }

                if ((conUnitBuffFilter != null)                                             &&
                    (!UnitBuffs_Utils_Filter.checkIsMeet(conUnitBuffFilter, oldBuff, war))
                ) {
                    newBuffList.push(oldBuff);
                } else {
                    ++modifiedCount;
                    const newBuff = generateNewBuff(
                        action,
                        oldBuff,
                        warTurnIndex,
                        warPlayerIndex,
                        playersCountNeutral,
                    );
                    if (newBuff) {
                        newBuffList.push(newBuff);
                    }
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

function calculateExpiringTimePart(
    mode        : number,
    actionTime  : number,
    buffTime    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>,
    warTime     : number,
): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    if (mode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.Delete) {
        return null;

    } else if (mode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.DoNotChange) {
        return buffTime;

    } else if (mode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.AddOffset) {
        if (buffTime == null) {
            return null;
        } else {
            return actionTime + buffTime;
        }

    } else if (mode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetAbsoluteValue) {
        return actionTime;

    } else if (mode == WarEvents_Actions_Constants_Common.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime) {
        return actionTime + warTime;

    } else {
        throw Helpers_Misc.newError(`Invalid mode: ${mode}`);
    }
}

function calculateExpiringTime(
    action              : WeaModifyUnitBuffSimple,
    buffEndTurnIndex    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>,
    buffEndPlayerIndex  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>,
    warTurnIndex        : number,
    warPlayerIndex      : number,
    playersCountNeutral : number,
): (number | null)[] {
    let turnIndex = calculateExpiringTimePart(
        action.getActEndTurnIndexMode(),
        action.getActEndTurnIndex() ?? 0,
        buffEndTurnIndex,
        warTurnIndex,
    );
    if (turnIndex == null) {
        return [null, null];
    }

    let playerIndex = calculateExpiringTimePart(
        action.getActEndPlayerIndexMode(),
        action.getActEndPlayerIndex() ?? 0,
        buffEndPlayerIndex,
        warPlayerIndex,
    );
    if (playerIndex == null) {
        return [null, null];
    }

    {
        const temp  = Math.floor(playerIndex / playersCountNeutral);
        turnIndex   += temp;
        playerIndex -= temp * playersCountNeutral;
    }
    if (playerIndex < 0) {
        turnIndex   -= 1;
        playerIndex += playersCountNeutral;
    }

    return [turnIndex, playerIndex];
}

function generateNewBuff(
    action              : WeaModifyUnitBuffSimple,
    oldBuff             : UnitBuff,
    warTurnIndex        : number,
    warPlayerIndex      : number,
    playersCountNeutral : number,
): UnitBuff | null {
    const [expiringTurnIndex, expiringPlayerIndex] = calculateExpiringTime(
        action,
        oldBuff.getExpiringTurnIndex(),
        oldBuff.getExpiringPlayerIndex(),
        warTurnIndex,
        warPlayerIndex,
        playersCountNeutral,
    );
    const newBuff = UnitBuff.fromJson({
        buffTypeId          : action.getActBuffType() ?? oldBuff.getBuffTypeId(),
        expiringTurnIndex   : expiringTurnIndex,
        expiringPlayerIndex : expiringPlayerIndex,
        extraParamArray     : oldBuff.getExtraParamArray(),
    });

    if (!UnitBuffs_Utils_Common.checkIsValid(newBuff)) {
        return oldBuff;
    } else if (UnitBuffs_Utils_Common.checkIsExpired(newBuff, warTurnIndex, warPlayerIndex)) {
        return null;
    } else {
        return newBuff;
    }
}
