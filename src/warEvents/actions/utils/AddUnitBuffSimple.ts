import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../../../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import type { GcData } from "../../../gameConfigs/GcData.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getFormattedText, getText, getUnitBuffName } from "../../../lang/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { getDescForEmbed, checkIsValid as PlayersUtilsFilterCheckIsValid, checkIsMeet } from "../../../players/utils/Filter.ts";
import type { PlayerFilter } from "../../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import { UnitBuff } from "../../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type { WeaAddUnitBuffSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaAddUnitBuffSimple.ts";
import {
    getDescForEmbed as TilesUtilsFilterGetDescForEmbed,
    checkIsValid as TilesUtilsFilterCheckIsValid,
    checkIsMeet as TilesUtilsFilterCheckIsMeet,
} from "../../../tiles/utils/Filter.ts";
import {
    checkIsValidTypeId,
    checkIsValidModificationEndTurnIndex,
    checkIsValidModificationEndPlayerIndex,
    checkIsValidExtraParams,
    checkIsValid as UnitBuffsUtilsCommonCheckIsValid,
    checkIsExpired,
} from "../../../unitBuffs/utils/Common.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import {
    getDescForEmbed as UnitsUtilsFilterGetDescForEmbed,
    checkIsValid as UnitsUtilsFilterCheckIsValid,
    checkIsMeet as UnitsUtilsFilterCheckIsMeet,
} from "../../../units/utils/Filter.ts";

export function checkIsValid(
    data                    : Undefinable<WeaAddUnitBuffSimple>,
    gameConfig              : GcData,
    mapSize                 : MapSize,
    playersCountUnneutral   : number
): boolean {
    return (data != null) && (getErrorTip(data, mapSize, playersCountUnneutral, gameConfig) == null);
}

export function getBriefDesc(data: Undefinable<WeaAddUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    return getFormattedText(
        TextType.F0260,
        getText(TextType.Units),
        getUnitBuffName(data.getActBuffType() ?? 0)
    );
}
export function getDetailDesc(data: Undefinable<WeaAddUnitBuffSimple>): string | null {
    if (!data) {
        return null;
    }

    const conTextArray: string[] = [];
    {
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

    const actTextArray: string[] = [];
    {
        {
            const act = data.getActBuffType() ?? 0;
            actTextArray.push(`- ${getText(TextType.AbnormalStateTypeId)}: ${getUnitBuffName(act)}`);
        }
        {
            const turnIndex = data.getActEndTurnIndex();
            if (turnIndex == null) {
                actTextArray.push(`- ${getText(TextType.EndTime)}: ${getText(TextType.B1455)}`);
            } else {
                const textForRelative = ` (${getText(TextType.B1017)})`;
                actTextArray.push(`- ${getText(TextType.EndTurnIndex)}: ${turnIndex}${data.getActIsRelativeEndTurnIndex() ? textForRelative : ``}`);

                const playerIndex = data.getActEndPlayerIndex() ?? 0;
                actTextArray.push(`- ${getText(TextType.EndPlayerIndex)}: ${playerIndex}${data.getActIsRelativeEndPlayerIndex() ? textForRelative : ``}`);
            }
        }
        {
            const extraParams = data.getActExtraParams();
            if (extraParams != null) {
                actTextArray.push(`- ${getText(TextType.B1229)}: [${extraParams.join(", ")}]`);
            }
        }

        if (!actTextArray.length) {
            actTextArray.push(getText(TextType.A0957));
        }
    }

    return getFormattedText(
        TextType.F0261,
        getText(TextType.Units),
        conTextArray.join(`\n`),
        getText(TextType.Units),
        actTextArray.join(`\n`),
    );
}

export function getErrorTip(
    data                    : WeaAddUnitBuffSimple,
    mapSize                 : MapSize,
    playersCountUnneutral   : number,
    gameConfig              : GcData
): string | null {
    {
        const filter = data.getConUnitFilter();
        if (filter != null) {
            if (!UnitsUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig)) {
                return getFormattedText(TextType.F0091, getText(TextType.UnitFilter));
            }
        }
    }
    {
        const filter = data.getConPlayerFilter();
        if ((filter != null)                                                                    &&
            (!PlayersUtilsFilterCheckIsValid(filter, playersCountUnneutral, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerFilter));
        }
    }
    {
        const filter = data.getConTileFilter();
        if ((filter != null)                                                                            &&
            (!TilesUtilsFilterCheckIsValid(filter, playersCountUnneutral, mapSize, gameConfig))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.TileFilter));
        }
    }

    const actBuffTypeId = data.getActBuffType() ?? 0;
    {
        if ((actBuffTypeId != null)                                     &&
            (!checkIsValidTypeId(actBuffTypeId))
        ) {
            return getFormattedText(TextType.F0091, getText(TextType.AbnormalStateTypeId));
        }
    }
    {
        const act = data.getActEndTurnIndex();
        if (act != null) {
            if (!checkIsValidModificationEndTurnIndex(act)) {
                return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
            }
        }
        if (data.getActIsRelativeEndTurnIndex()) {
            if (act == null) {
                return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
            }
        }
    }
    {
        const act = data.getActEndPlayerIndex();
        if (act != null) {
            if (!checkIsValidModificationEndPlayerIndex(act)) {
                return getFormattedText(TextType.F0091, getText(TextType.EndPlayerIndex));
            }
        }
        if (data.getActIsRelativeEndPlayerIndex()) {
            if (act == null) {
                return getFormattedText(TextType.F0091, getText(TextType.EndPlayerIndex));
            }
        }
    }
    {
        const act = data.getActExtraParams();
        if (!checkIsValidExtraParams(actBuffTypeId, act)) {
            return getFormattedText(TextType.F0091, getText(TextType.B1229));
        }
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaAddUnitBuffSimple): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(data: WeaAddUnitBuffSimple, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const newBuff = generateNewBuff(data, war);
    if (newBuff == null) {
        return;
    }

    const targetUnitList: IUnit[] = [];
    {
        const tileMap           = war.getTileMap();
        const conTileFilter     = data.getConTileFilter();
        const conPlayerFilter   = data.getConPlayerFilter();
        const conUnitFilter     = data.getConUnitFilter();
        const playerFilterDict  = new Map<IPlayer, boolean>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            if ((conUnitFilter != null) &&
                (!UnitsUtilsFilterCheckIsMeet(conUnitFilter, unit))
            ) {
                continue;
            }

            if ((conTileFilter != null) &&
                (!TilesUtilsFilterCheckIsMeet(conTileFilter, tileMap.getTile(unit.getGridIndex())))
            ) {
                continue;
            }

            if ((conPlayerFilter != null) &&
                (!checkIsMeetConPlayerFilter(playerFilterDict, conPlayerFilter, unit.getPlayer()))
            ) {
                continue;
            }

            targetUnitList.push(unit);
        }

        if (!targetUnitList.length) {
            return;
        }
    }

    {
        const needUpdateView = !isFastExecute;
        for (const unit of targetUnitList) {
            unit.addBuff(newBuff.clone(), needUpdateView, true);
        }
    }
}
function checkIsMeetConPlayerFilter(resultDict: Map<IPlayer, boolean>, filter: PlayerFilter, player: IPlayer): boolean {
    if (!resultDict.has(player)) {
        resultDict.set(player, checkIsMeet(filter, player));
    }
    return !!resultDict.get(player);
}
function calculateExpiringTime(
    action              : WeaAddUnitBuffSimple,
    currentTurnIndex    : number,
    currentPlayerIndex  : number,
    playersCountNeutral : number
): (number | null)[] {
    const rawEndTurnIndex = action.getActEndTurnIndex();
    if (rawEndTurnIndex == null) {
        return [null, null];
    }

    let turnIndex   = rawEndTurnIndex                      + (action.getActIsRelativeEndTurnIndex() ? currentTurnIndex : 0);
    let playerIndex = (action.getActEndPlayerIndex() ?? 0) + (action.getActIsRelativeEndPlayerIndex() ? currentPlayerIndex : 0);
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
function generateNewBuff(action: WeaAddUnitBuffSimple, war: IBwWar): UnitBuff | null {
    const turnManager           = war.getTurnManager();
    const currentTurnIndex      = turnManager.getTurnIndex();
    const currentPlayerIndex    = turnManager.getPlayerIndexInTurn();
    const expiringTime          = calculateExpiringTime(action, currentTurnIndex, currentPlayerIndex, war.getPlayerManager().getTotalPlayersCount(true));
    const buff                  = UnitBuff.fromJson({
        buffTypeId          : action.getActBuffType(),
        expiringTurnIndex   : expiringTime[0],
        expiringPlayerIndex : expiringTime[1],
        extraParamArray     : action.getActExtraParams(),
    });

    return (!UnitBuffsUtilsCommonCheckIsValid(buff)) || (checkIsExpired(buff, currentTurnIndex, currentPlayerIndex))
        ? null
        : buff;
}
