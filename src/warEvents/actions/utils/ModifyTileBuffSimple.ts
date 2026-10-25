import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfig/GcData.ts";
import { newError } from "../../../helpers/Misc.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getFormattedText, getTileBuffName } from "../../../lang/Utils.ts";
import { MaxInt32 } from "../../../numbers/Constants.ts";
import type { IPlayer as PlayersIPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type {
    PlayerFilter as ProtoSchemaCommonProtoStructurePlayerFilter,
} from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import type { TileBuff as ProtoSchemaCommonProtoStructureTileBuff } from "../../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type {
    WeaModifyTileBuffSimple as ProtoSchemaCommonProtoWarEventWeaModifyTileBuffSimple,
} from "../../../proto/schema/CommonProto/WarEvent/WeaModifyTileBuffSimple.ts";
import {
    checkIsValidTypeId,
    checkIsValidModificationEndTurnIndex,
    checkIsValidModificationEndPlayerIndex,
    create,
    checkIsValid as TileBuffsUtilsCommonCheckIsValid,
    checkIsExpired,
} from "../../../tileBuffs/utils/Common.ts";
import {
    getDescForEmbed as TileBuffsUtilsFilterGetDescForEmbed,
    checkIsValid as TileBuffsUtilsFilterCheckIsValid,
    checkIsMeet as TileBuffsUtilsFilterCheckIsMeet,
} from "../../../tileBuffs/utils/Filter.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import {
    getDescForEmbed as TilesUtilsFilterGetDescForEmbed,
    checkIsValid as TilesUtilsFilterCheckIsValid,
    checkIsMeet as TilesUtilsFilterCheckIsMeet,
} from "../../../tiles/utils/Filter.ts";
import { checkIsValid as UnitsUtilsFilterCheckIsValid, checkIsMeet as UnitsUtilsFilterCheckIsMeet } from "../../../units/utils/Filter.ts";
import {
    getDesc,
    checkIsValid as ValueAndComparatorsUtilsCheckIsValid,
    checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet,
} from "../../../valueAndComparators/Utils.ts";
import { BuffEndTimeModificationMode } from "../constants/Common.ts";
import { checkIsValidBuffEndTimeModificationMode } from "./Common.ts";

type Undefinable<T>                 = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type PlayerFilter                   = ProtoSchemaCommonProtoStructurePlayerFilter;
type TileBuff                       = ProtoSchemaCommonProtoStructureTileBuff;
type WeaModifyTileBuffSimple        = ProtoSchemaCommonProtoWarEventWeaModifyTileBuffSimple;
type IPlayer                        = PlayersIPlayer;

export function checkIsValid(
    data                    : Undefinable<WeaModifyTileBuffSimple>,
    mapSize                 : MapSize,
    playersCountUnneutral   : number,
    gcData                  : GcData
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
            textArray.push(getText(TextType.AbnormalStateTypeId));
        }
    }
    {
        if ((data.getActEndPlayerIndex() != null)                                          ||
            (data.getActEndPlayerIndexMode() != BuffEndTimeModificationMode.DoNotChange)   ||
            (data.getActEndTurnIndex() != null)                                            ||
            (data.getActEndTurnIndexMode() != BuffEndTimeModificationMode.DoNotChange)
        ) {
            textArray.push(getText(TextType.EndTime));
        }
    }

    return getFormattedText(
        TextType.F0254,
        getText(TextType.B1459),
        textArray.join(`, `) || getText(TextType.None)
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
                conTextArray.push(`- ${TileBuffsUtilsFilterGetDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConTileFilter();
            if (filter != null) {
                conTextArray.push(`- ${TilesUtilsFilterGetDescForEmbed(filter)}`);
            }
        }
        {
            const filter = data.getConPlayerFilter();
            if (filter != null) {
                conTextArray.push(`- (${getText(TextType.B1421)}) ${getDescForEmbed(filter)}`);
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

    const actTextArray: string[] = [];
    {
        {
            const act = data.getActBuffType();
            if (act != null) {
                actTextArray.push(`- ${getText(TextType.AbnormalStateTypeId)}: ${getTileBuffName(act)}`);
            }
        }
        {
            const turnIndexMode     = data.getActEndTurnIndexMode() as BuffEndTimeModificationMode;
            const playerIndexMode   = data.getActEndPlayerIndexMode() as BuffEndTimeModificationMode;
            if ((turnIndexMode != BuffEndTimeModificationMode.DoNotChange)      ||
                (playerIndexMode != BuffEndTimeModificationMode.DoNotChange)
            ) {
                if ((turnIndexMode == BuffEndTimeModificationMode.Delete) ||
                    (playerIndexMode == BuffEndTimeModificationMode.Delete)
                ) {
                    actTextArray.push(`- ${getText(TextType.EndTime)}: ${getText(TextType.B1455)}`);
                } else {
                    {
                        const turnIndex = data.getActEndTurnIndex() ?? 0;
                        if (turnIndexMode == BuffEndTimeModificationMode.AddOffset) {
                            actTextArray.push(`- ${getText(TextType.EndTurnIndex)}: ${getText(TextType.B1460)} ${turnIndex >= 0 ? `+` : ``}${turnIndex}`);
                        } else if (turnIndexMode == BuffEndTimeModificationMode.SetAbsoluteValue) {
                            actTextArray.push(`- ${getText(TextType.EndTurnIndex)}: ${turnIndex}`);
                        } else if (turnIndexMode == BuffEndTimeModificationMode.SetValueRelativeToCurrentTime) {
                            actTextArray.push(`- ${getText(TextType.EndTurnIndex)}: ${getText(TextType.B1461)} ${turnIndex >= 0 ? `+` : ``}${turnIndex}`);
                        }
                    }

                    {
                        const playerIndex = data.getActEndPlayerIndex() ?? 0;
                        if (playerIndexMode == BuffEndTimeModificationMode.AddOffset) {
                            actTextArray.push(`- ${getText(TextType.EndPlayerIndex)}: ${getText(TextType.B1460)} ${playerIndex >= 0 ? `+` : ``}${playerIndex}`);
                        } else if (playerIndexMode == BuffEndTimeModificationMode.SetAbsoluteValue) {
                            actTextArray.push(`- ${getText(TextType.EndPlayerIndex)}: ${playerIndex}`);
                        } else if (playerIndexMode == BuffEndTimeModificationMode.SetValueRelativeToCurrentTime) {
                            actTextArray.push(`- ${getText(TextType.EndPlayerIndex)}: ${getText(TextType.B1461)} ${playerIndex >= 0 ? `+` : ``}${playerIndex}`);
                        }
                    }
                }
            }
        }

        if (!actTextArray.length) {
            actTextArray.push(`- ${getText(TextType.A0957)}`);
        }
    }

    return getFormattedText(
        TextType.F0255,
        getText(TextType.B1459),
        conTextArray.join(`\n`),
        getText(TextType.B1459),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaModifyTileBuffSimple,
    mapSize                 : MapSize,
    playersCountUnneutral   : number,
    gcData                  : GcData
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
        if (filter != null) {
            if (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gcData)) {
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
            (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gcData))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }
    {
        const comparator = data.getConUnitComparator();
        if ((comparator != null)                                    &&
            (!ValueAndComparatorsUtilsCheckIsValid(comparator))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }
    {
        const filter = data.getConTileBuffFilter();
        if ((filter != null)                                &&
            (!TileBuffsUtilsFilterCheckIsValid(filter))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.B1235));
        }
    }
    {
        const con = data.getConMaxModifyCount();
        if ((con != null) && (con <= 0)) {
            return getFormattedText(TextType.F0091, getText(TextType.B1457));
        }
    }

    {
        const act = data.getActBuffType();
        if (act != null) {
            if (!checkIsValidTypeId(act)) {
                return getFormattedText(TextType.F0091, getText(TextType.AbnormalStateTypeId));
            }
        }
    }
    {
        const actEndTurnIndexMode   = data.getActEndTurnIndexMode() ?? 0;
        const actEndPlayerIndexMode = data.getActEndPlayerIndexMode() ?? 0;
        if ((!checkIsValidBuffEndTimeModificationMode(actEndTurnIndexMode)) ||
            (!checkIsValidBuffEndTimeModificationMode(actEndPlayerIndexMode))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.B1458));
        }

        if ((actEndTurnIndexMode == BuffEndTimeModificationMode.Delete)     ||
            (actEndPlayerIndexMode == BuffEndTimeModificationMode.Delete)
        ) {
            if (actEndTurnIndexMode != actEndPlayerIndexMode) {
                return getFormattedText(TextType.F0091, getText(TextType.B1458));
            }

            if (data.getActEndTurnIndex() != null) {
                return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
            }

            if (data.getActEndPlayerIndex() != null) {
                return getFormattedText(TextType.F0091, getText(TextType.EndPlayerIndex));
            }

        } else {
            if (actEndTurnIndexMode == BuffEndTimeModificationMode.DoNotChange) {
                if (data.getActEndTurnIndex() != null) {
                    return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
                }

            } else {
                const actEndTurnIndex = data.getActEndTurnIndex();
                if (actEndTurnIndex == null) {
                    return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
                }

                if (!checkIsValidModificationEndTurnIndex(actEndTurnIndex)) {
                    return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
                }
            }

            if (actEndPlayerIndexMode == BuffEndTimeModificationMode.DoNotChange) {
                if (data.getActEndPlayerIndex() != null) {
                    return getFormattedText(TextType.F0091, getText(TextType.EndPlayerIndex));
                }

            } else {
                const actEndPlayerIndex = data.getActEndPlayerIndex();
                if (actEndPlayerIndex == null) {
                    return getFormattedText(TextType.F0091, getText(TextType.EndPlayerIndex));
                }

                if (!checkIsValidModificationEndPlayerIndex(actEndPlayerIndex)) {
                    return getFormattedText(TextType.F0091, getText(TextType.EndPlayerIndex));
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

export async function applyWithoutExtraData(action: WeaModifyTileBuffSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const targetTileDict = new Map<ITile, TileBuff[]>();
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
        const conMaxModifyCount     = action.getConMaxModifyCount() ?? MaxInt32;
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
                    (!TilesUtilsFilterCheckIsMeet(conTileFilter, tile))
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
                        .filter(unit => (conUnitFilter == null) || (UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit)))
                        .length;
                    if (!ValueAndComparatorsUtilsCheckIsMeet(conUnitComparator, count)) {
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
                        (!TileBuffsUtilsFilterCheckIsMeet(conTileBuffFilter, oldBuff, war))
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
        resultDict.set(player, checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}

function calculateExpiringTimePart(
    mode        : number,
    actionTime  : number,
    buffTime    : Undefinable<number>,
    warTime     : number
): Undefinable<number> {
    if (mode == BuffEndTimeModificationMode.Delete) {
        return null;

    } else if (mode == BuffEndTimeModificationMode.DoNotChange) {
        return buffTime;

    } else if (mode == BuffEndTimeModificationMode.AddOffset) {
        if (buffTime == null) {
            return null;
        } else {
            return actionTime + buffTime;
        }

    } else if (mode == BuffEndTimeModificationMode.SetAbsoluteValue) {
        return actionTime;

    } else if (mode == BuffEndTimeModificationMode.SetValueRelativeToCurrentTime) {
        return actionTime + warTime;

    } else {
        throw newError(`Invalid mode: ${mode}`);
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
    const newBuff = create({
        buffTypeId          : action.getActBuffType() ?? oldBuff.getBuffTypeId(),
        expiringTurnIndex   : expiringTurnIndex,
        expiringPlayerIndex : expiringPlayerIndex,
        extraParams         : oldBuff.getExtraParamArray(),
    });

    if (!TileBuffsUtilsCommonCheckIsValid(newBuff)) {
        return oldBuff;
    } else if (checkIsExpired(newBuff, warTurnIndex, warPlayerIndex)) {
        return null;
    } else {
        return newBuff;
    }
}
