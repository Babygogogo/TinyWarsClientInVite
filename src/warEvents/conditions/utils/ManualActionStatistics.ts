import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as PlayersUtilsCommon from "../../../players/utils/Common.ts";
import type * as ProtoSchemaCommonProtoWarEventWecManualActionStatistics from "../../../proto/schema/CommonProto/WarEvent/WecManualActionStatistics.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type WecManualActionStatistics      = ProtoSchemaCommonProtoWarEventWecManualActionStatistics.WecManualActionStatistics;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecManualActionStatistics>): string | null {
    if (data == null) {
        return null;
    }

    const totalActions  = data.getTotalActions();
    const comparator    = totalActions == null ? null : (totalActions.getComparator() ?? 0);
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0143,
        comparator == null ? LangConstants.UndefinedError : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError),
        totalActions == null ? LangConstants.UndefinedError : (totalActions.getValue() ?? LangConstants.UndefinedError)
    );
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecManualActionStatistics>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const playerIndexArray = data.getPlayerIndexArray();
        if (playerIndexArray?.length) {
            subTextArray.push(`- ${LangUtils.getFormattedText(
                LangConstants.TextType.F0217,
                playerIndexArray.map(v => `P${v}`).join(` ${LangUtils.getText(LangConstants.TextType.Or)} `)
            )}`);
        }
    }
    {
        const isPlayerInTurn = data.getIsPlayerInTurn();
        if (isPlayerInTurn != null) {
            subTextArray.push(`- ${LangUtils.getText(isPlayerInTurn ? LangConstants.TextType.A0831 : LangConstants.TextType.A0832)}`);
        }
    }
    {
        const recentTurnsCount = data.getRecentTurnsCount();
        if (recentTurnsCount != null) {
            subTextArray.push(`- ${LangUtils.getFormattedText(
                LangConstants.TextType.F0144,
                recentTurnsCount
            )}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(LangUtils.getText(LangConstants.TextType.A0944));
    }

    const totalActions  = data.getTotalActions();
    const comparator    = totalActions == null ? null : totalActions.getComparator() ?? 0;
    return [
        LangUtils.getFormattedText(
            LangConstants.TextType.F0227,
            comparator == null ? LangConstants.UndefinedError : (LangUtils.getComparatorName(comparator) ?? LangConstants.UndefinedError),
            totalActions == null ? LangConstants.UndefinedError : (totalActions.getValue() ?? LangConstants.UndefinedError)
        ),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecManualActionStatistics, war: BaseWarInterfaceIBwWar.IBwWar): string | null {
    {
        const playerIndexArray = data.getPlayerIndexArray();
        if ((playerIndexArray) && (!PlayersUtilsCommon.checkIsValidPlayerIndexSubset(playerIndexArray, war.getPlayersCountUnneutral()))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerIndex));
        }
    }

    {
        const totalActions = data.getTotalActions();
        if ((totalActions == null) || (!ValueAndComparatorsUtils.checkIsValid(totalActions))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0902));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecManualActionStatistics>, playersCountUnneutral: number): boolean {
    if (condition == null) {
        return false;
    }

    {
        const playerIndexArray = condition.getPlayerIndexArray();
        if ((playerIndexArray) && (!PlayersUtilsCommon.checkIsValidPlayerIndexSubset(playerIndexArray, playersCountUnneutral))) {
            return false;
        }
    }

    {
        const totalActions = condition.getTotalActions();
        if ((totalActions == null) || (!ValueAndComparatorsUtils.checkIsValid(totalActions))) {
            return false;
        }
    }

    return true;
}

export function checkIsMeet(condition: WecManualActionStatistics, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
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

    const totalActions = HelpersMisc.getExisted(condition.getTotalActions());
    return ValueAndComparatorsUtils.checkIsMeet1({
        comparator  : totalActions.getComparator() ?? 0,
        targetValue : totalActions.getValue() ?? 0,
        actualValue : war.getWarStatisticsManager().getManualActionsCountForPlayersInRecentTurns(revisedConPlayerIndexSet, condition.getRecentTurnsCount()),
    });
}
