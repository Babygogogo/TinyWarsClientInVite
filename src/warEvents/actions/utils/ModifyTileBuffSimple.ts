import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersConstants from "../../../numbers/Constants.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsFilter from "../../../players/utils/Filter.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaModifyTileBuffSimple from "../../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffSimple.ts";
import * as TileBuffsUtilsCommon from "../../../tileBuffs/utils/Common.ts";
import * as TileBuffsUtilsFilter from "../../../tileBuffs/utils/Filter.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsFilter from "../../../tiles/utils/Filter.ts";
import * as UnitsUtilsFilter from "../../../units/utils/Filter.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";
import * as WarEventsActionsConstantsCommon from "../constants/Common.ts";
import * as WarEventsActionsUtilsCommon from "./Common.ts";

type Undefinable<T>                 = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type PlayerFilter                   = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;
type TileBuff                       = ProtoSchemaCommonProtoStructureTileBuff.TileBuff;
type WeaModifyTileBuffSimple        = ProtoSchemaCommonProtoWarEventWeaModifyTileBuffSimple.WeaModifyTileBuffSimple;
type IPlayer                        = PlayersIPlayer.IPlayer;

export function checkIsValid(
    data                    : Undefinable<WeaModifyTileBuffSimple>,
    mapSize                 : AuxiliaryTypesMapSize.MapSize,
    playersCountUnneutral   : number,
    gcData                  : GameConfigGcData.GcData
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gcData) == null);
}

export function getBriefDesc(data: Undefinable<WeaModifyTileBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const textArray: string[] = [];
    {
        if (data.getActBuffType() != null) {
            textArray.push(LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
        }
    }
    {
        if ((data.getActEndPlayerIndex() != null)                                          ||
            (data.getActEndPlayerIndexMode() != WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.DoNotChange)   ||
            (data.getActEndTurnIndex() != null)                                            ||
            (data.getActEndTurnIndexMode() != WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.DoNotChange)
        ) {
            textArray.push(LangUtils.getText(LangConstants.TextType.EndTime));
        }
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0254,
        LangUtils.getText(LangConstants.TextType.B1459),
        textArray.join(`, `) || LangUtils.getText(LangConstants.TextType.None)
    );
}
export function getDetailDesc(data: Undefinable<WeaModifyTileBuffSimple>): string | null {
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

    const actTextArray: string[] = [];
    {
        {
            const act = data.getActBuffType();
            if (act != null) {
                actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId)}: ${LangUtils.getTileBuffName(act)}`);
            }
        }
        {
            const turnIndexMode     = data.getActEndTurnIndexMode() as WarEventsActionsConstantsCommon.BuffEndTimeModificationMode;
            const playerIndexMode   = data.getActEndPlayerIndexMode() as WarEventsActionsConstantsCommon.BuffEndTimeModificationMode;
            if ((turnIndexMode != WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.DoNotChange)      ||
                (playerIndexMode != WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.DoNotChange)
            ) {
                if ((turnIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.Delete) ||
                    (playerIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.Delete)
                ) {
                    actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndTime)}: ${LangUtils.getText(LangConstants.TextType.B1455)}`);
                } else {
                    {
                        const turnIndex = data.getActEndTurnIndex() ?? 0;
                        if (turnIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.AddOffset) {
                            actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndTurnIndex)}: ${LangUtils.getText(LangConstants.TextType.B1460)} ${turnIndex >= 0 ? `+` : ``}${turnIndex}`);
                        } else if (turnIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.SetAbsoluteValue) {
                            actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndTurnIndex)}: ${turnIndex}`);
                        } else if (turnIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime) {
                            actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndTurnIndex)}: ${LangUtils.getText(LangConstants.TextType.B1461)} ${turnIndex >= 0 ? `+` : ``}${turnIndex}`);
                        }
                    }

                    {
                        const playerIndex = data.getActEndPlayerIndex() ?? 0;
                        if (playerIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.AddOffset) {
                            actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndPlayerIndex)}: ${LangUtils.getText(LangConstants.TextType.B1460)} ${playerIndex >= 0 ? `+` : ``}${playerIndex}`);
                        } else if (playerIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.SetAbsoluteValue) {
                            actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndPlayerIndex)}: ${playerIndex}`);
                        } else if (playerIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime) {
                            actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.EndPlayerIndex)}: ${LangUtils.getText(LangConstants.TextType.B1461)} ${playerIndex >= 0 ? `+` : ``}${playerIndex}`);
                        }
                    }
                }
            }
        }

        if (!actTextArray.length) {
            actTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.A0957)}`);
        }
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0255,
        LangUtils.getText(LangConstants.TextType.B1459),
        conTextArray.join(`\n`),
        LangUtils.getText(LangConstants.TextType.B1459),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaModifyTileBuffSimple,
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
        const con = data.getConMaxModifyCount();
        if ((con != null) && (con <= 0)) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1457));
        }
    }

    {
        const act = data.getActBuffType();
        if (act != null) {
            if (!TileBuffsUtilsCommon.checkIsValidTypeId(act)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
            }
        }
    }
    {
        const actEndTurnIndexMode   = data.getActEndTurnIndexMode() ?? 0;
        const actEndPlayerIndexMode = data.getActEndPlayerIndexMode() ?? 0;
        if ((!WarEventsActionsUtilsCommon.checkIsValidBuffEndTimeModificationMode(actEndTurnIndexMode)) ||
            (!WarEventsActionsUtilsCommon.checkIsValidBuffEndTimeModificationMode(actEndPlayerIndexMode))
        ) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1458));
        }

        if ((actEndTurnIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.Delete)     ||
            (actEndPlayerIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.Delete)
        ) {
            if (actEndTurnIndexMode != actEndPlayerIndexMode) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B1458));
            }

            if (data.getActEndTurnIndex() != null) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndTurnIndex));
            }

            if (data.getActEndPlayerIndex() != null) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndPlayerIndex));
            }

        } else {
            if (actEndTurnIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.DoNotChange) {
                if (data.getActEndTurnIndex() != null) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndTurnIndex));
                }

            } else {
                const actEndTurnIndex = data.getActEndTurnIndex();
                if (actEndTurnIndex == null) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndTurnIndex));
                }

                if (!TileBuffsUtilsCommon.checkIsValidModificationEndTurnIndex(actEndTurnIndex)) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndTurnIndex));
                }
            }

            if (actEndPlayerIndexMode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.DoNotChange) {
                if (data.getActEndPlayerIndex() != null) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndPlayerIndex));
                }

            } else {
                const actEndPlayerIndex = data.getActEndPlayerIndex();
                if (actEndPlayerIndex == null) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndPlayerIndex));
                }

                if (!TileBuffsUtilsCommon.checkIsValidModificationEndPlayerIndex(actEndPlayerIndex)) {
                    return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndPlayerIndex));
                }
            }
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaModifyTileBuffSimple): Promise<void> {
    // nothing to do
}

export async function applyWithoutExtraData(action: WeaModifyTileBuffSimple, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const targetTileDict = new Map<TilesITile.ITile, TileBuff[]>();
    {
        const unitMap               = war.getUnitMap();
        const tileMap               = war.getTileMap();
        const turnManager           = war.getTurnManager();
        const warTurnIndex          = turnManager.getTurnIndex();
        const warPlayerIndex        = turnManager.getPlayerIndexInTurn();
        const playersCountNeutral   = war.getPlayerManager().getTotalPlayersCount(true);
        const conTileFilter         = action.getConTileFilter();
        const conUnitFilter         = action.getConUnitFilter();
        const conUnitComparator     = action.getConUnitComparator();
        const conPlayerFilter       = action.getConPlayerFilter();
        const conTileBuffFilter     = action.getConTileBuffFilter();
        const conMaxModifyCount     = action.getConMaxModifyCount() ?? NumbersConstants.MaxInt32;
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
                    if (modifiedCount >= conMaxModifyCount) {
                        newBuffList.push(oldBuff);
                        continue;
                    }

                    if ((conTileBuffFilter != null)                                             &&
                        (!TileBuffsUtilsFilter.checkIsMeet(conTileBuffFilter, oldBuff, war))
                    ) {
                        newBuffList.push(oldBuff);
                    } else {
                        ++modifiedCount;
                        const newBuff = generateNewBuff(
                            action,
                            oldBuff,
                            warTurnIndex,
                            warPlayerIndex,
                            playersCountNeutral
                        );
                        if (newBuff) {
                            newBuffList.push(newBuff);
                        }
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

function calculateExpiringTimePart(
    mode        : number,
    actionTime  : number,
    buffTime    : Undefinable<number>,
    warTime     : number
): Undefinable<number> {
    if (mode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.Delete) {
        return null;

    } else if (mode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.DoNotChange) {
        return buffTime;

    } else if (mode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.AddOffset) {
        if (buffTime == null) {
            return null;
        } else {
            return actionTime + buffTime;
        }

    } else if (mode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.SetAbsoluteValue) {
        return actionTime;

    } else if (mode == WarEventsActionsConstantsCommon.BuffEndTimeModificationMode.SetValueRelativeToCurrentTime) {
        return actionTime + warTime;

    } else {
        throw HelpersMisc.newError(`Invalid mode: ${mode}`);
    }
}

function calculateExpiringTime(
    action              : WeaModifyTileBuffSimple,
    buffEndTurnIndex    : Undefinable<number>,
    buffEndPlayerIndex  : Undefinable<number>,
    warTurnIndex        : number,
    warPlayerIndex      : number,
    playersCountNeutral : number
): (number | null)[] {
    let turnIndex = calculateExpiringTimePart(
        action.getActEndTurnIndexMode() ?? 0,
        action.getActEndTurnIndex() ?? 0,
        buffEndTurnIndex,
        warTurnIndex
    );
    if (turnIndex == null) {
        return [null, null];
    }

    let playerIndex = calculateExpiringTimePart(
        action.getActEndPlayerIndexMode() ?? 0,
        action.getActEndPlayerIndex() ?? 0,
        buffEndPlayerIndex,
        warPlayerIndex
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
    action              : WeaModifyTileBuffSimple,
    oldBuff             : TileBuff,
    warTurnIndex        : number,
    warPlayerIndex      : number,
    playersCountNeutral : number
): TileBuff | null {
    const [expiringTurnIndex, expiringPlayerIndex] = calculateExpiringTime(
        action,
        oldBuff.getExpiringTurnIndex(),
        oldBuff.getExpiringPlayerIndex(),
        warTurnIndex,
        warPlayerIndex,
        playersCountNeutral
    );
    const newBuff = TileBuffsUtilsCommon.create({
        buffTypeId          : action.getActBuffType() ?? oldBuff.getBuffTypeId(),
        expiringTurnIndex   : expiringTurnIndex,
        expiringPlayerIndex : expiringPlayerIndex,
        extraParams         : oldBuff.getExtraParamArray(),
    });

    if (!TileBuffsUtilsCommon.checkIsValid(newBuff)) {
        return oldBuff;
    } else if (TileBuffsUtilsCommon.checkIsExpired(newBuff, warTurnIndex, warPlayerIndex)) {
        return null;
    } else {
        return newBuff;
    }
}
