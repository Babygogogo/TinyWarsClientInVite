import {
    ValueAndComparators_Utils,
    Turns_Utils,
    Lang_Utils,
    Players_Constants,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WecTurnAndPlayer } from "../../../proto/schema/CommonProto/WarEvent/WecTurnAndPlayer.ts";

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecTurnAndPlayer>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getText(Lang_Constants.TextType.A0943);
}
export function getDetailedDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecTurnAndPlayer>): string | null {
    if (data == null) {
        return null;
    }

    const subTextArray: string[] = [];
    {
        const turnIndex     = data.getTurnIndex();
        const comparator    = data.getTurnIndexComparator();
        if ((turnIndex != null) && (comparator != null)) {
            subTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.B0504)} ${Lang_Utils.getComparatorName(comparator)} ${turnIndex}`);
        }
    }
    {
        const divider       = data.getTurnIndexDivider();
        const remainder     = data.getTurnIndexRemainder();
        const comparator    = data.getTurnIndexRemainderComparator();
        if ((divider != null) && (remainder != null) && (comparator != null)) {
            subTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.B0504)} % ${divider} ${Lang_Utils.getComparatorName(comparator)} ${remainder}`);
        }
    }
    {
        const playerIndexArray = data.getPlayerIndexArray();
        if (playerIndexArray?.length) {
            subTextArray.push(`- ${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0216, playerIndexArray.map(v => `P${v}`).join(` ${Lang_Utils.getText(Lang_Constants.TextType.Or)} `))}`);
        }
    }
    {
        const turnPhase = data.getTurnPhase();
        if (turnPhase != null) {
            subTextArray.push(`- ${Lang_Utils.getText(Lang_Constants.TextType.B0782)} == ${Lang_Utils.getTurnPhaseName(turnPhase)}`);
        }
    }

    if (!subTextArray.length) {
        subTextArray.push(Lang_Utils.getText(Lang_Constants.TextType.A0944));
    }

    return [
        Lang_Utils.getText(Lang_Constants.TextType.A0942),
        ...subTextArray,
    ].join(`\n`);
}
export function getErrorTip(data: WecTurnAndPlayer, war: BaseWar_Interface_IBwWar.IBwWar): string | null {
    {
        const comparator = data.getTurnIndexComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    {
        const divider   = data.getTurnIndexDivider();
        const remainder = data.getTurnIndexRemainder();
        if (divider == null) {
            if (remainder != null) {
                return Lang_Utils.getText(Lang_Constants.TextType.A0265);
            }
        } else {
            if ((divider <= 1) || (remainder == null)) {
                return Lang_Utils.getText(Lang_Constants.TextType.A0265);
            }
        }

        const comparator = data.getTurnIndexRemainderComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Comparator));
        }
    }

    {
        const turnPhase = data.getTurnPhase();
        if ((turnPhase != null) && (!Turns_Utils.checkIsValidTurnPhaseCode(turnPhase))) {
            return Lang_Utils.getText(Lang_Constants.TextType.A0265);
        }
    }

    {
        const playersCountUnneutral = war.getPlayersCountUnneutral();
        if (data.getPlayerIndexArray()?.some(v => (v < Players_Constants.PlayerIndex.Neutral) || (v > playersCountUnneutral))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex));
        }
    }

    return null;
}

export function checkIsValid(condition: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WecTurnAndPlayer>, playersCountUnneutral: number): boolean {
    if (condition == null) {
        return false;
    }

    {
        const comparator = condition.getTurnIndexComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
            return false;
        }
        // no need to check turnIndex
    }

    {
        const comparator = condition.getTurnIndexRemainderComparator();
        if ((comparator == null) || (!ValueAndComparators_Utils.checkIsValidValueComparatorId(comparator))) {
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
        if ((turnPhase != null) && (!Turns_Utils.checkIsValidTurnPhaseCode(turnPhase))) {
            return false;
        }
    }

    {
        const playerIndexArray = condition.getPlayerIndexArray();
        if (playerIndexArray) {
            const playerIndexSet = new Set<number>();
            for (const playerIndex of playerIndexArray) {
                if ((playerIndex < Players_Constants.PlayerIndex.Neutral)   ||
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

export function checkIsMeet(condition: WecTurnAndPlayer, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    const turnManager   = war.getTurnManager();
    const turnIndex     = turnManager.getTurnIndex();
    {
        const targetTurnIndex       = condition.getTurnIndex();
        const turnIndexComparator   = condition.getTurnIndexComparator();
        if ((targetTurnIndex != null) && (turnIndexComparator != null)) {
            if (!ValueAndComparators_Utils.checkIsMeet1({
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
            if (!ValueAndComparators_Utils.checkIsMeet1({
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
