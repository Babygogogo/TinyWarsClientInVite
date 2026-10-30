import {
    ValueAndComparators_Utils,
    Players_Utils_Common,
    Lang_Utils,
    Helpers_Misc,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WecManualActionStatistics } from "../../../proto/schema/CommonProto/WarEvent/WecManualActionStatistics.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecManualActionStatistics>): string | null {
    if (data == null) {
        return null;
    }

    const totalActions  = data.getTotalActions();
    const comparator    = totalActions == null ? null : (totalActions.getComparator());
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0143,
        comparator == null ? Lang_Constants.UndefinedError : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError),
        totalActions == null ? Lang_Constants.UndefinedError : (totalActions.getValue())
    );
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecManualActionStatistics>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const playerIndexArray = data.getPlayerIndexArray();
        if (playerIndexArray?.length) {
            subTextArray.push(`- ${Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0217,
                playerIndexArray.map(v => `P${v}`).join(` ${Lang_Utils.getText(Lang_Constants.TextType.Or)} `)
            )}`);
        }
    }
    {
        const isPlayerInTurn = data.getIsPlayerInTurn();
        if (isPlayerInTurn != null) {
            subTextArray.push(`- ${Lang_Utils.getText(isPlayerInTurn ? Lang_Constants.TextType.A0831 : Lang_Constants.TextType.A0832)}`);
        }
    }
    {
        const recentTurnsCount = data.getRecentTurnsCount();
        if (recentTurnsCount != null) {
            subTextArray.push(`- ${Lang_Utils.getFormattedText(
                Lang_Constants.TextType.F0144,
                recentTurnsCount
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0944));
    }

    const totalActions  = data.getTotalActions();
    const comparator    = totalActions == null ? null : totalActions.getComparator();
    return [
        Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0227,
            comparator == null ? Lang_Constants.UndefinedError : (Lang_Utils.getComparatorName(comparator) ?? Lang_Constants.UndefinedError),
            totalActions == null ? Lang_Constants.UndefinedError : (totalActions.getValue())
        ),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecManualActionStatistics, war: BaseWar_Interface_IBwWar.IBwWar): string | null {
    {
        const playerIndexArray = data.getPlayerIndexArray();
        if ((playerIndexArray) && (!Players_Utils_Common.checkIsValidPlayerIndexSubset(playerIndexArray, war.getPlayersCountUnneutral()))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex));
        }
    }

    {
        const totalActions = data.getTotalActions();
        if ((totalActions == null) || (!ValueAndComparators_Utils.checkIsValid(totalActions))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0902));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecManualActionStatistics>, playersCountUnneutral: number): boolean {
    if (condition == null) {
        return false;
    }

    {
        const playerIndexArray = condition.getPlayerIndexArray();
        if ((playerIndexArray) && (!Players_Utils_Common.checkIsValidPlayerIndexSubset(playerIndexArray, playersCountUnneutral))) {
            return false;
        }
    }

    {
        const totalActions = condition.getTotalActions();
        if ((totalActions == null) || (!ValueAndComparators_Utils.checkIsValid(totalActions))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecManualActionStatistics, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
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

    const totalActions = Helpers_Misc.getExisted(condition.getTotalActions());
    return ValueAndComparators_Utils.checkIsMeet1({
        comparator  : totalActions.getComparator(),
        targetValue : totalActions.getValue(),
        actualValue : war.getWarStatisticsManager().getManualActionsCountForPlayersInRecentTurns(revisedConPlayerIndexSet, condition.getRecentTurnsCount()),
    });
}
