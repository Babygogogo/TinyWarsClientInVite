import type { IBwWar as BaseWarInterfaceIBwWar } from "../../baseWar/interface/IBwWar.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getTileBuffName, getComparatorName, getFormattedText } from "../../lang/Utils.ts";
import type { TileBuff as ProtoSchemaCommonProtoStructureTileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import type {
    TileBuffFilter as ProtoSchemaCommonProtoStructureTileBuffFilter,
} from "../../proto/schema/CommonProto/Structure/TileBuffFilter.ts";
import { checkIsEverlasting, checkIsValidTypeIdSubset } from "./Common.ts";
import {
    checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet,
    checkIsValid as ValueAndComparatorsUtilsCheckIsValid,
} from "../../valueAndComparators/Utils.ts";
import {
    checkIsMeet as ValueArrayAndPredicatesUtilsCheckIsMeet,
    getDesc as ValueArrayAndPredicatesUtilsGetDesc,
    checkIsValid as ValueArrayAndPredicatesUtilsCheckIsValid,
} from "../../valueArrayAndPredicates/Utils.ts";

type TileBuffFilter                     = ProtoSchemaCommonProtoStructureTileBuffFilter;
type TileBuff                           = ProtoSchemaCommonProtoStructureTileBuff;
type IBwWar                             = BaseWarInterfaceIBwWar;

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
            (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, buff.getBuffTypeId() ?? 0))
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
                if (!ValueAndComparatorsUtilsCheckIsMeet(con, turnIndex)) {
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
                if (!ValueAndComparatorsUtilsCheckIsMeet(con, playerIndex)) {
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
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtilsGetDesc(
                conBuffTypeId,
                getText(TextType.AbnormalStateTypeId),
                v => getTileBuffName(v)
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
export function getDescForEmbed(data: TileBuffFilter): string | null {
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

export function getErrorTip(data: TileBuffFilter): string | null {
    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtilsCheckIsValid(con))                     ||
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
            if ((conIsEverlasting) || (!ValueAndComparatorsUtilsCheckIsValid(con))) {
                return getFormattedText(TextType.F0091, getText(TextType.EndTurnIndex));
            }
        }
    }

    {
        const con = data.getConEndPlayerIndex();
        if (con != null) {
            if ((conIsEverlasting) || (!ValueAndComparatorsUtilsCheckIsValid(con))) {
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
