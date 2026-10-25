import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText, getComparatorName, getFormattedText, getTurnPhaseName } from "../../../lang/Utils.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
import type { WecTurnAndPlayer } from "../../../proto/schema/CommonProto/WarEvent/WecTurnAndPlayer.ts";
import { checkIsValidTurnPhaseCode } from "../../../turns/Utils.ts";
import { checkIsValidValueComparatorId, checkIsMeet1 } from "../../../valueAndComparators/Utils.ts";

export function getBriefDesc(data: Undefinable<WecTurnAndPlayer>): string | null {
    if (data == null) {
        return null;
    }

    return getText(TextType.A0943);
}
export function getDetailedDesc(data: Undefinable<WecTurnAndPlayer>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const turnIndex     = data.getTurnIndex();
        const comparator    = data.getTurnIndexComparator();
        if ((turnIndex != null) && (comparator != null)) {
            subTextArray.push(`- ${getText(TextType.B0504)} ${getComparatorName(comparator)} ${turnIndex}`);
        }
    }
    {
        const divider       = data.getTurnIndexDivider();
        const remainder     = data.getTurnIndexRemainder();
        const comparator    = data.getTurnIndexRemainderComparator();
        if ((divider != null) && (remainder != null) && (comparator != null)) {
            subTextArray.push(`- ${getText(TextType.B0504)} % ${divider} ${getComparatorName(comparator)} ${remainder}`);
        }
    }
    {
        const playerIndexArray = data.getPlayerIndexArray();
        if (playerIndexArray?.length) {
            subTextArray.push(`- ${getFormattedText(TextType.F0216, playerIndexArray.map(v => `P${v}`).join(` ${getText(TextType.Or)} `))}`);
        }
    }
    {
        const turnPhase = data.getTurnPhase();
        if (turnPhase != null) {
            subTextArray.push(`- ${getText(TextType.B0782)} == ${getTurnPhaseName(turnPhase)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(getText(TextType.A0944));
    }

    return [
        getText(TextType.A0942),
        ...subTextArray
    ].join(`\n`);
}
export function getErrorTip(data: WecTurnAndPlayer, war: IBwWar): string | null {
    {
        const comparator = data.getTurnIndexComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        const divider   = data.getTurnIndexDivider();
        const remainder = data.getTurnIndexRemainder();
        if (divider == null) {
            if (remainder != null) {
                return getText(TextType.A0265);
            }
        } else {
            if ((divider <= 1) || (remainder == null)) {
                return getText(TextType.A0265);
            }
        }

        const comparator = data.getTurnIndexRemainderComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return getFormattedText(TextType.F0091, getText(TextType.Comparator));
        }
    }

    {
        const turnPhase = data.getTurnPhase();
        if ((turnPhase != null) && (!checkIsValidTurnPhaseCode(turnPhase))) {
            return getText(TextType.A0265);
        }
    }

    {
        const playersCountUnneutral = war.getPlayersCountUnneutral();
        if (data.getPlayerIndexArray()?.some(v => (v < PlayerIndex.Neutral) || (v > playersCountUnneutral))) {
            return getFormattedText(TextType.F0091, getText(TextType.PlayerIndex));
        }
    }

    return null;
}

export function checkIsValid(condition: Undefinable<WecTurnAndPlayer>, playersCountUnneutral: number): boolean {
    if (condition == null) {
        return false;
    }

    {
        const comparator = condition.getTurnIndexComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
            return false;
        }
        // no need to check turnIndex
    }

    {
        const comparator = condition.getTurnIndexRemainderComparator();
        if ((comparator == null) || (!checkIsValidValueComparatorId(comparator))) {
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
        if ((turnPhase != null) && (!checkIsValidTurnPhaseCode(turnPhase))) {
            return false;
        }
    }

    {
        const playerIndexArray = condition.getPlayerIndexArray();
        if (playerIndexArray) {
            const playerIndexSet = new Set<number>();
            for (const playerIndex of playerIndexArray) {
                if ((playerIndex < PlayerIndex.Neutral)   ||
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

export function checkIsMeet(condition: WecTurnAndPlayer, war: IBwWar): boolean {
    const turnManager   = war.getTurnManager();
    const turnIndex     = turnManager.getTurnIndex();
    {
        const targetTurnIndex       = condition.getTurnIndex();
        const turnIndexComparator   = condition.getTurnIndexComparator();
        if ((targetTurnIndex != null) && (turnIndexComparator != null)) {
            if (!checkIsMeet1({
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
            if (!checkIsMeet1({
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
