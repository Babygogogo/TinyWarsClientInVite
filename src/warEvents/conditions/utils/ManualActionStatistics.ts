import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText, getComparatorName, getText } from "../../../lang/Utils.ts";
import { checkIsValidPlayerIndexSubset } from "../../../players/utils/Common.ts";
import type { WecManualActionStatistics } from "../../../proto/schema/CommonProto/WarEvent/WecManualActionStatistics.ts";
import { checkIsValid as ValueAndComparatorsUtilsCheckIsValid, checkIsMeet1 } from "../../../valueAndComparators/Utils.ts";

export function getBriefDesc(data: Undefinable<WecManualActionStatistics>): string | null {
    if (data == null) {
        return null;
    }

    const totalActions  = data.getTotalActions();
    const comparator    = totalActions == null ? null : (totalActions.getComparator());
    return getFormattedText(
        TextType.F0143,
        comparator == null ? UndefinedError : (getComparatorName(comparator) ?? UndefinedError),
        totalActions == null ? UndefinedError : (totalActions.getValue())
    );
}
export function getDetailedDesc(data: Undefinable<WecManualActionStatistics>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const playerIndexArray = data.getPlayerIndexArray();
        if (playerIndexArray?.length) {
            subTextArray.push(`- ${getFormattedText(
                TextType.F0217,
                playerIndexArray.map(v => `P${v}`).join(` ${getText(TextType.Or)} `)
            )}`);
        }
    }
    {
        const isPlayerInTurn = data.getIsPlayerInTurn();
        if (isPlayerInTurn != null) {
            subTextArray.push(`- ${getText(isPlayerInTurn ? TextType.A0831 : TextType.A0832)}`);
        }
    }
    {
        const recentTurnsCount = data.getRecentTurnsCount();
        if (recentTurnsCount != null) {
            subTextArray.push(`- ${getFormattedText(
                TextType.F0144,
                recentTurnsCount
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(getText(TextType.A0944));
    }

    const totalActions  = data.getTotalActions();
    const comparator    = totalActions == null ? null : totalActions.getComparator();
    return [
        getFormattedText(
            TextType.F0227,
            comparator == null ? UndefinedError : (getComparatorName(comparator) ?? UndefinedError),
            totalActions == null ? UndefinedError : (totalActions.getValue())
        ),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecManualActionStatistics, war: IBwWar): string | null {
    {
        const playerIndexArray = data.getPlayerIndexArray();
        if ((playerIndexArray) && (!checkIsValidPlayerIndexSubset(playerIndexArray, war.getPlayersCountUnneutral()))) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerIndex));
        }
    }

    {
        const totalActions = data.getTotalActions();
        if ((totalActions == null) || (!ValueAndComparatorsUtilsCheckIsValid(totalActions))) {
            return getFormattedText(TextType.F0091, getText(TextType.B0902));
        }
    }

    return null;
}

export function checkIsValid(condition: Undefinable<WecManualActionStatistics>, playersCountUnneutral: number): boolean {
    if (condition == null) {
        return false;
    }

    {
        const playerIndexArray = condition.getPlayerIndexArray();
        if ((playerIndexArray) && (!checkIsValidPlayerIndexSubset(playerIndexArray, playersCountUnneutral))) {
            return false;
        }
    }

    {
        const totalActions = condition.getTotalActions();
        if ((totalActions == null) || (!ValueAndComparatorsUtilsCheckIsValid(totalActions))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecManualActionStatistics, war: IBwWar): boolean {
    const conPlayerIndexArray       = condition.getPlayerIndexArray();
    const revisedConPlayerIndexSet  = conPlayerIndexArray?.length
        ? new Set(conPlayerIndexArray)
        : new Set(war.getPlayerManager().getAllPlayers().map(v => v.getPlayerIndex()));

    const conIsPlayerInTurn = condition.getIsPlayerInTurn();
    if (conIsPlayerInTurn != null) {
        const playerIndexInTurn = war.getPlayerIndexInTurn();
        if (!conIsPlayerInTurn) {
            revisedConPlayerIndexSet.delete(playerIndexInTurn);
        } else {
            if (!revisedConPlayerIndexSet.has(playerIndexInTurn)) {
                revisedConPlayerIndexSet.clear();
            } else {
                revisedConPlayerIndexSet.clear();
                revisedConPlayerIndexSet.add(playerIndexInTurn);
            }
        }
    }

    const totalActions = getExisted(condition.getTotalActions());
    return checkIsMeet1({
        comparator  : totalActions.getComparator(),
        targetValue : totalActions.getValue(),
        actualValue : war.getWarStatisticsManager().getManualActionsCountForPlayersInRecentTurns(revisedConPlayerIndexSet, condition.getRecentTurnsCount()),
    });
}
