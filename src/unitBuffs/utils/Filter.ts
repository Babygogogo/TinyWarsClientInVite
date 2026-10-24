import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureUnitBuff from "../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type * as ProtoSchemaCommonProtoStructureUnitBuffFilter from "../../proto/schema/CommonProto/Structure/UnitBuffFilter.ts";
import * as UnitBuffsUtilsCommon from "./Common.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as ValueArrayAndPredicatesUtils from "../../valueArrayAndPredicates/Utils.ts";

type UnitBuffFilter                     = ProtoSchemaCommonProtoStructureUnitBuffFilter.UnitBuffFilter;
type UnitBuff                           = ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff;
type IBwWar                             = BaseWarInterfaceIBwWar.IBwWar;

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
            (!ValueArrayAndPredicatesUtils.checkIsMeet(con, buff.getBuffTypeId() ?? 0))
        ) {
            return false;
        }
    }

    {
        const con = data.getConIsEverlasting();
        if ((con != null) && (con !== UnitBuffsUtilsCommon.checkIsEverlasting(buff))) {
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
                if (!ValueAndComparatorsUtils.checkIsMeet(con, turnIndex)) {
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
                if (!ValueAndComparatorsUtils.checkIsMeet(con, playerIndex)) {
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
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtils.getDesc(
                conBuffTypeId,
                LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId),
                v => LangUtils.getUnitBuffName(v)
            ));
        }
    }

    const conIsEverlasting = data.getConIsEverlasting();
    if (conIsEverlasting) {
        textArrayForSubConditions.push(`${LangUtils.getText(LangConstants.TextType.B1455)}: ${LangUtils.getText(LangConstants.TextType.Yes)}`);
    } else {
        if (conIsEverlasting != null) {
            textArrayForSubConditions.push(`${LangUtils.getText(LangConstants.TextType.B1455)}: ${LangUtils.getText(LangConstants.TextType.No)}`);
        }

        {
            const con = data.getConEndTurnIndex();
            if (con != null) {
                const isRelative        = data.getConIsRelativeEndTurnIndex();
                const value             = con.getValue();
                const comparator        = con.getComparator();
                const textForComparator = LangUtils.getComparatorName(comparator);
                const textForRelative   = isRelative ? `${LangUtils.getText(LangConstants.TextType.B1462)} ` : ``;
                textArrayForSubConditions.push(`${LangUtils.getText(LangConstants.TextType.EndTurnIndex)}: ${textForRelative}${textForComparator} ${value}`);
            }
        }

        {
            const con = data.getConEndPlayerIndex();
            if (con != null) {
                const isRelative        = data.getConIsRelativeEndPlayerIndex();
                const value             = con.getValue();
                const comparator        = con.getComparator();
                const textForComparator = LangUtils.getComparatorName(comparator);
                const textForRelative   = isRelative ? `${LangUtils.getText(LangConstants.TextType.B1462)} ` : ``;
                textArrayForSubConditions.push(`${LangUtils.getText(LangConstants.TextType.EndPlayerIndex)}: ${textForRelative}${textForComparator} ${value}`);
            }
        }
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0230,
        LangUtils.getText(LangConstants.TextType.AbnormalStates),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : LangUtils.getText(LangConstants.TextType.A0944)
    );
}
export function getDescForEmbed(data: UnitBuffFilter): string | null {
    const textArrayForSubConditions: string[] = [];
    {
        if (data.getConBuffTypeId() != null) {
            textArrayForSubConditions.push(LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
        }
    }
    {
        if ((data.getConIsEverlasting() != null)  ||
            (data.getConEndTurnIndex() != null)   ||
            (data.getConEndPlayerIndex() != null)
        ) {
            textArrayForSubConditions.push(LangUtils.getText(LangConstants.TextType.EndTime));
        }
    }

    return !textArrayForSubConditions.length
        ? null
        : LangUtils.getFormattedText(
            LangConstants.TextType.F0231,
            LangUtils.getText(LangConstants.TextType.AbnormalStates),
            textArrayForSubConditions.join(`, `)
        );
}

export function getErrorTip(data: UnitBuffFilter): string | null {
    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                     ||
                (!UnitBuffsUtilsCommon.checkIsValidTypeIdSubset(con.getValueArray()))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
            }
        }
    }

    const conIsEverlasting = data.getConIsEverlasting();
    {
        const con = data.getConEndTurnIndex();
        if (con != null) {
            if ((conIsEverlasting) || (!ValueAndComparatorsUtils.checkIsValid(con))) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndTurnIndex));
            }
        }
    }

    {
        const con = data.getConEndPlayerIndex();
        if (con != null) {
            if ((conIsEverlasting) || (!ValueAndComparatorsUtils.checkIsValid(con))) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.EndPlayerIndex));
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
