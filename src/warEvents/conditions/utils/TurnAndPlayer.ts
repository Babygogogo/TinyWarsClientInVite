import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarEventWecTurnAndPlayer from "../../../proto/schema/CommonProto/WarEvent/WecTurnAndPlayer.ts";
import * as TurnsUtils from "../../../turns/Utils.ts";
import * as ValueAndComparatorsUtils from "../../../valueAndComparators/Utils.ts";

type WecTurnAndPlayer           = ProtoSchemaCommonProtoWarEventWecTurnAndPlayer.WecTurnAndPlayer;

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecTurnAndPlayer>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getText(LangConstants.TextType.A0943);
}
export function getDetailedDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecTurnAndPlayer>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const turnIndex     = data.getTurnIndex();
        const comparator    = data.getTurnIndexComparator();
        if ((turnIndex != null) && (comparator != null)) {
            subTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.B0504)} ${LangUtils.getComparatorName(comparator)} ${turnIndex}`);
        }
    }
    {
        const divider       = data.getTurnIndexDivider();
        const remainder     = data.getTurnIndexRemainder();
        const comparator    = data.getTurnIndexRemainderComparator();
        if ((divider != null) && (remainder != null) && (comparator != null)) {
            subTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.B0504)} % ${divider} ${LangUtils.getComparatorName(comparator)} ${remainder}`);
        }
    }
    {
        const playerIndexArray = data.getPlayerIndexArray();
        if (playerIndexArray?.length) {
            subTextArray.push(`- ${LangUtils.getFormattedText(LangConstants.TextType.F0216, playerIndexArray.map(v => `P${v}`).join(` ${LangUtils.getText(LangConstants.TextType.Or)} `))}`);
        }
    }
    {
        const turnPhase = data.getTurnPhase();
        if (turnPhase != null) {
            subTextArray.push(`- ${LangUtils.getText(LangConstants.TextType.B0782)} == ${LangUtils.getTurnPhaseName(turnPhase)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(LangUtils.getText(LangConstants.TextType.A0944));
    }

    return [
        LangUtils.getText(LangConstants.TextType.A0942),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecTurnAndPlayer, war: BaseWarInterfaceIBwWar.IBwWar): string | null {
    {
        const comparator = data.getTurnIndexComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    {
        const divider   = data.getTurnIndexDivider();
        const remainder = data.getTurnIndexRemainder();
        if (divider == null) {
            if (remainder != null) {
                return LangUtils.getText(LangConstants.TextType.A0265);
            }
        } else {
            if ((divider <= 1) || (remainder == null)) {
                return LangUtils.getText(LangConstants.TextType.A0265);
            }
        }

        const comparator = data.getTurnIndexRemainderComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Comparator));
        }
    }

    {
        const turnPhase = data.getTurnPhase();
        if ((turnPhase != null) && (!TurnsUtils.checkIsValidTurnPhaseCode(turnPhase))) {
            return LangUtils.getText(LangConstants.TextType.A0265);
        }
    }

    {
        const playersCountUnneutral = war.getPlayersCountUnneutral();
        if (data.getPlayerIndexArray()?.some(v => (v < PlayersConstants.PlayerIndex.Neutral) || (v > playersCountUnneutral))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerIndex));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypesAuxiliaryTypes.Undefinable<WecTurnAndPlayer>, playersCountUnneutral: number): boolean {
    if (condition == null) {
        return false;
    }

    {
        const comparator = condition.getTurnIndexComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
        // no need to check turnIndex
    }

    {
        const comparator = condition.getTurnIndexRemainderComparator();
        if ((comparator == null) || (!ValueAndComparatorsUtils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }

        const divider   = condition.getTurnIndexDivider();
        const remainder = condition.getTurnIndexRemainder();
        if (divider == null) {
            if (remainder != null) {
                return false;
            }
        } else {
            if ((divider <= 1) || (remainder == null)) {
                return false;
            }
        }
    }

    {
        const turnPhase = condition.getTurnPhase();
        if ((turnPhase != null) && (!TurnsUtils.checkIsValidTurnPhaseCode(turnPhase))) {
            return false;
        }
    }

    {
        const playerIndexArray = condition.getPlayerIndexArray();
        if (playerIndexArray) {
            const playerIndexSet = new Set<number>();
            for (const playerIndex of playerIndexArray) {
                if ((playerIndex < PlayersConstants.PlayerIndex.Neutral)   ||
                    (playerIndex > playersCountUnneutral)                   ||
                    (playerIndexSet.has(playerIndex))
                ) {
                    return false;
                }

                playerIndexSet.add(playerIndex);
            }
        }
    }

    return true;
}

export function checkIsMeet(condition: WecTurnAndPlayer, war: BaseWarInterfaceIBwWar.IBwWar): boolean {
    const turnManager   = war.getTurnManager();
    const turnIndex     = turnManager.getTurnIndex();
    {
        const targetTurnIndex       = condition.getTurnIndex();
        const turnIndexComparator   = condition.getTurnIndexComparator();
        if ((targetTurnIndex != null) && (turnIndexComparator != null)) {
            if (!ValueAndComparatorsUtils.checkIsMeet1({
                comparator  : turnIndexComparator,
                actualValue : turnIndex,
                targetValue : targetTurnIndex,
            })) {
                return false;
            }
        }
    }
    {
        const turnIndexDivider      = condition.getTurnIndexDivider();
        const targetRemainder       = condition.getTurnIndexRemainder();
        const remainderComparator   = condition.getTurnIndexRemainderComparator();
        if ((turnIndexDivider != null) && (targetRemainder != null) && (remainderComparator != null)) {
            if (!ValueAndComparatorsUtils.checkIsMeet1({
                comparator  : remainderComparator,
                actualValue : turnIndex % turnIndexDivider,
                targetValue : targetRemainder,
            })) {
                return false;
            }
        }
    }
    {
        const turnPhase = condition.getTurnPhase();
        if ((turnPhase != null) && (turnManager.getPhaseCode() !== turnPhase)) {
            return false;
        }
    }
    {
        const playerIndexArray = condition.getPlayerIndexArray();
        if ((playerIndexArray?.length) && (playerIndexArray.indexOf(turnManager.getPlayerIndexInTurn()) < 0)) {
            return false;
        }
    }

    return true;
}
