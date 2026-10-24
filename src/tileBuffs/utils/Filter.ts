import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuffFilter from "../../proto/schema/CommonProto/Structure/TileBuffFilter.ts";
import * as TileBuffsUtilsCommon from "./Common.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as ValueArrayAndPredicatesUtils from "../../valueArrayAndPredicates/Utils.ts";

type TileBuffFilter                     = ProtoSchemaCommonProtoStructureTileBuffFilter.TileBuffFilter;
type TileBuff                           = ProtoSchemaCommonProtoStructureTileBuff.TileBuff;
type IBwWar                             = BaseWarInterfaceIBwWar.IBwWar;

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

export function checkIsMeet(data: TileBuffFilter, buff: TileBuff, war: IBwWar): boolean {
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
        if ((con != null) && (con !== TileBuffsUtilsCommon.checkIsEverlasting(buff))) {
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
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtils.getDesc(
                conBuffTypeId,
                LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId),
                v => LangUtils.getTileBuffName(v)
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
export function getDescForEmbed(data: TileBuffFilter): string | null {
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

export function getErrorTip(data: TileBuffFilter): string | null {
    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                     ||
                (!TileBuffsUtilsCommon.checkIsValidTypeIdSubset(con.getValueArray()))
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
