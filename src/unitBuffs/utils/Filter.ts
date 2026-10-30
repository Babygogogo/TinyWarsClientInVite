import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getUnitBuffName,
    getComparatorName,
    getFormattedText,
} from "../../lang/Utils.ts";
import type { UnitBuff } from "../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type { UnitBuffFilter } from "../../proto/schema/CommonProto/Structure/UnitBuffFilter.ts";
import {
    checkIsEverlasting,
    checkIsValidTypeIdSubset,
} from "./Common.ts";
import {
    checkIsMeet as checkIsMeetValueAndComparator,
    checkIsValid as checkIsValidValueAndComparator,
} from "../../valueAndComparators/Utils.ts";
import {
    checkIsMeet as checkIsMeetValueArrayAndPredicate,
    getDesc as getValueArrayAndPredicatesDesc,
    checkIsValid as checkIsValidValueArrayAndPredicate,
} from "../../valueArrayAndPredicates/Utils.ts";

export function tickConIsEverlasting(data: UnitBuffFilter): boolean | null {
    const oldValue = data.getConIsEverlasting();
    const newValue = (oldValue == null)
        ? true
        : (oldValue ? false : null);
    data.setConIsEverlasting(newValue);
    return newValue;
}

export function checkIsValid(data: UnitBuffFilter): boolean {
    return getErrorTip(data) == null;
}

export function checkIsMeet(data: UnitBuffFilter, buff: UnitBuff, war: IBwWar): boolean {
    {
        const con = data.getConBuffTypeId();
        if ((con != null) &&
            (!checkIsMeetValueArrayAndPredicate(con, buff.getBuffTypeId()))
        ) {
            return false;
        }
    }

    {
        const con = data.getConIsEverlasting();
        if ((con != null) && (con !== checkIsEverlasting(buff))) {
            return false;
        }
    }

    {
        const turnManager = war.getTurnManager();
        {
            const con = data.getConEndTurnIndex();
            if (con != null) {
                const expiringTurnIndex = buff.getExpiringTurnIndex();
                if (expiringTurnIndex == null) {
                    return false;
                }

                const turnIndex = data.getConIsRelativeEndTurnIndex()
                    ? expiringTurnIndex - turnManager.getTurnIndex()
                    : expiringTurnIndex;
                if (!checkIsMeetValueAndComparator(con, turnIndex)) {
                    return false;
                }
            }
        }

        {
            const con = data.getConEndPlayerIndex();
            if (con != null) {
                const expiringPlayerIndex = buff.getExpiringPlayerIndex();
                if (expiringPlayerIndex == null) {
                    return false;
                }

                const playerIndex = data.getConIsRelativeEndPlayerIndex()
                    ? expiringPlayerIndex - turnManager.getPlayerIndexInTurn()
                    : expiringPlayerIndex;
                if (!checkIsMeetValueAndComparator(con, playerIndex)) {
                    return false;
                }
            }
        }
    }

    return true;
}

export function checkIsEmpty(data: UnitBuffFilter): boolean {
    return (data.getConBuffTypeId()               == null)
        && (data.getConEndTurnIndex()             == null)
        && (data.getConEndPlayerIndex()           == null)
        && (data.getConIsRelativeEndTurnIndex()   == null)
        && (data.getConIsRelativeEndPlayerIndex() == null)
        && (data.getConIsEverlasting()            == null);
}

export function getDesc(data: UnitBuffFilter): string {
    const textArrayForSubConditions: string[] = [];
    {
        const conBuffTypeId = data.getConBuffTypeId();
        if (conBuffTypeId != null) {
            textArrayForSubConditions.push(getValueArrayAndPredicatesDesc(
                conBuffTypeId,
                getText(TextType.AbnormalStateTypeId),
                v => getUnitBuffName(v)
            ));
        }
    }

    const conIsEverlasting = data.getConIsEverlasting();
    if (conIsEverlasting) {
        textArrayForSubConditions.push(`${getText(TextType.B1455)}: ${getText(TextType.Yes)}`);
    } else {
        if (conIsEverlasting != null) {
            textArrayForSubConditions.push(`${getText(TextType.B1455)}: ${getText(TextType.No)}`);
        }

        {
            const con = data.getConEndTurnIndex();
            if (con != null) {
                const isRelative        = data.getConIsRelativeEndTurnIndex();
                const value             = con.getValue();
                const comparator        = con.getComparator();
                const textForComparator = getComparatorName(comparator);
                const textForRelative   = isRelative ? `${getText(TextType.B1462)} ` : ``;
                textArrayForSubConditions.push(`${getText(TextType.EndTurnIndex)}: ${textForRelative}${textForComparator} ${value}`);
            }
        }

        {
            const con = data.getConEndPlayerIndex();
            if (con != null) {
                const isRelative        = data.getConIsRelativeEndPlayerIndex();
                const value             = con.getValue();
                const comparator        = con.getComparator();
                const textForComparator = getComparatorName(comparator);
                const textForRelative   = isRelative ? `${getText(TextType.B1462)} ` : ``;
                textArrayForSubConditions.push(`${getText(TextType.EndPlayerIndex)}: ${textForRelative}${textForComparator} ${value}`);
            }
        }
    }

    return getFormattedText(
        TextType.F0230,
        getText(TextType.AbnormalStates),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : getText(TextType.A0944)
    );
}
export function getDescForEmbed(data: UnitBuffFilter): string | null {
    const textArrayForSubConditions: string[] = [];
    {
        if (data.getConBuffTypeId() != null) {
            textArrayForSubConditions.push(getText(TextType.AbnormalStateTypeId));
        }
    }
    {
        if ((data.getConIsEverlasting() != null)  ||
            (data.getConEndTurnIndex() != null)   ||
            (data.getConEndPlayerIndex() != null)
        ) {
            textArrayForSubConditions.push(getText(TextType.EndTime));
        }
    }

    return !textArrayForSubConditions.length
        ? null
        : getFormattedText(
            TextType.F0231,
            getText(TextType.AbnormalStates),
            textArrayForSubConditions.join(`, `)
        );
}

export function getErrorTip(data: UnitBuffFilter): string | null {
    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if ((!checkIsValidValueArrayAndPredicate(con))                     ||
                (!checkIsValidTypeIdSubset(con.getValueArray()))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.AbnormalStateTypeId));
            }
        }
    }

    const conIsEverlasting = data.getConIsEverlasting();
    {
        const con = data.getConEndTurnIndex();
        if (con != null) {
            if ((conIsEverlasting) || (!checkIsValidValueAndComparator(con))) {
                return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
            }
        }
    }

    {
        const con = data.getConEndPlayerIndex();
        if (con != null) {
            if ((conIsEverlasting) || (!checkIsValidValueAndComparator(con))) {
                return getFormattedText(TextType.F0091, getText(TextType.EndPlayerIndex));
            }
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsRelativeEndTurnIndex();
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsRelativeEndPlayerIndex();
    }

    return null;
}
