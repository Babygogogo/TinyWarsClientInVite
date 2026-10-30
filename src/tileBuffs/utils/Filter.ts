import {
    TileBuffs_Utils_Common,
    ValueAndComparators_Utils,
    ValueArrayAndPredicates_Utils,
    Lang_Utils,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
} from "../../internal.ts";
import type { TileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { TileBuffFilter } from "../../proto/schema/CommonProto/Structure/TileBuffFilter.ts";

export function tickConIsEverlasting(data: TileBuffFilter): boolean | null {
    const oldValue = data.getConIsEverlasting();
    const newValue = (oldValue == null)
        ? true
        : (oldValue ? false : null);
    data.setConIsEverlasting(newValue);
    return newValue;
}

export function checkIsValid(data: TileBuffFilter): boolean {
    return getErrorTip(data) == null;
}

export function checkIsMeet(data: TileBuffFilter, buff: TileBuff, war: BaseWar_Interface_IBwWar.IBwWar): boolean {
    {
        const con = data.getConBuffTypeId();
        if ((con != null) &&
            (!ValueArrayAndPredicates_Utils.checkIsMeet(con, buff.getBuffTypeId()))
        ) {
            return false;
        }
    }

    {
        const con = data.getConIsEverlasting();
        if ((con != null) && (con !== TileBuffs_Utils_Common.checkIsEverlasting(buff))) {
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
                if (!ValueAndComparators_Utils.checkIsMeet(con, turnIndex)) {
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
                if (!ValueAndComparators_Utils.checkIsMeet(con, playerIndex)) {
                    return false;
                }
            }
        }
    }

    return true;
}

export function checkIsEmpty(data: TileBuffFilter): boolean {
    return (data.getConBuffTypeId()               == null)
        && (data.getConEndTurnIndex()             == null)
        && (data.getConEndPlayerIndex()           == null)
        && (data.getConIsRelativeEndTurnIndex()   == null)
        && (data.getConIsRelativeEndPlayerIndex() == null)
        && (data.getConIsEverlasting()            == null);
}

export function getDesc(data: TileBuffFilter): string {
    const textArrayForSubConditions: string[] = [];
    {
        const conBuffTypeId = data.getConBuffTypeId();
        if (conBuffTypeId != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicates_Utils.getDesc(
                conBuffTypeId,
                Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId),
                v => Lang_Utils.getTileBuffName(v),
            ));
        }
    }

    const conIsEverlasting = data.getConIsEverlasting();
    if (conIsEverlasting) {
        textArrayForSubConditions.push(`${Lang_Utils.getText(Lang_Constants.TextType.B1455)}: ${Lang_Utils.getText(Lang_Constants.TextType.Yes)}`);
    } else {
        if (conIsEverlasting != null) {
            textArrayForSubConditions.push(`${Lang_Utils.getText(Lang_Constants.TextType.B1455)}: ${Lang_Utils.getText(Lang_Constants.TextType.No)}`);
        }

        {
            const con = data.getConEndTurnIndex();
            if (con != null) {
                const isRelative        = data.getConIsRelativeEndTurnIndex();
                const value             = con.getValue();
                const comparator        = con.getComparator();
                const textForComparator = Lang_Utils.getComparatorName(comparator);
                const textForRelative   = isRelative ? `${Lang_Utils.getText(Lang_Constants.TextType.B1462)} ` : ``;
                textArrayForSubConditions.push(`${Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex)}: ${textForRelative}${textForComparator} ${value}`);
            }
        }

        {
            const con = data.getConEndPlayerIndex();
            if (con != null) {
                const isRelative        = data.getConIsRelativeEndPlayerIndex();
                const value             = con.getValue();
                const comparator        = con.getComparator();
                const textForComparator = Lang_Utils.getComparatorName(comparator);
                const textForRelative   = isRelative ? `${Lang_Utils.getText(Lang_Constants.TextType.B1462)} ` : ``;
                textArrayForSubConditions.push(`${Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex)}: ${textForRelative}${textForComparator} ${value}`);
            }
        }
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0230,
        Lang_Utils.getText(Lang_Constants.TextType.AbnormalStates),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : Lang_Utils.getText(Lang_Constants.TextType.A0944),
    );
}
export function getDescForEmbed(data: TileBuffFilter): string | null {
    const textArrayForSubConditions: string[] = [];
    {
        if (data.getConBuffTypeId() != null) {
            textArrayForSubConditions.push(Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId));
        }
    }
    {
        if ((data.getConIsEverlasting() != null)  ||
            (data.getConEndTurnIndex() != null)   ||
            (data.getConEndPlayerIndex() != null)
        ) {
            textArrayForSubConditions.push(Lang_Utils.getText(Lang_Constants.TextType.EndTime));
        }
    }

    return !textArrayForSubConditions.length
        ? null
        : Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0231,
            Lang_Utils.getText(Lang_Constants.TextType.AbnormalStates),
            textArrayForSubConditions.join(`, `),
        );
}

export function getErrorTip(data: TileBuffFilter): string | null {
    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                     ||
                (!TileBuffs_Utils_Common.checkIsValidTypeIdSubset(con.getValueArray()))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId));
            }
        }
    }

    const conIsEverlasting = data.getConIsEverlasting();
    {
        const con = data.getConEndTurnIndex();
        if (con != null) {
            if ((conIsEverlasting) || (!ValueAndComparators_Utils.checkIsValid(con))) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndTurnIndex));
            }
        }
    }

    {
        const con = data.getConEndPlayerIndex();
        if (con != null) {
            if ((conIsEverlasting) || (!ValueAndComparators_Utils.checkIsValid(con))) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.EndPlayerIndex));
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
