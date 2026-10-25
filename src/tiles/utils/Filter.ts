import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import {
    checkIsMeet as GridIndexArrayAndPredicatesUtilsCheckIsMeet,
    getDesc as GridIndexArrayAndPredicatesUtilsGetDesc,
    checkIsValid as GridIndexArrayAndPredicatesUtilsCheckIsValid,
} from "../../gridIndexArrayAndPredicates/Utils.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getPlayerTeamName, getTileName, getFormattedText, getTextForYesOrNo, getTileBuffName } from "../../lang/Utils.ts";
import { checkIsValidLocationIdSubset } from "../../locations/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { checkIsValidPlayerIndexSubset } from "../../players/utils/Common.ts";
import type { TileFilter } from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import { checkIsValidTeamIndexSubset } from "../../teams/Utils.ts";
import { checkIsValidTypeIdSubset } from "../../tileBuffs/utils/Common.ts";
import type { ITile } from "../ITile.ts";
import {
    checkIsMeet as ValueAndComparatorsUtilsCheckIsMeet,
    getDesc as ValueAndComparatorsUtilsGetDesc,
    checkIsValid as ValueAndComparatorsUtilsCheckIsValid,
} from "../../valueAndComparators/Utils.ts";
import {
    checkIsMeet as ValueArrayAndPredicatesUtilsCheckIsMeet,
    getDesc as ValueArrayAndPredicatesUtilsGetDesc,
    checkIsValid as ValueArrayAndPredicatesUtilsCheckIsValid,
} from "../../valueArrayAndPredicates/Utils.ts";
import {
    checkIsMeet as ValueSetAndRelationsUtilsCheckIsMeet,
    getDesc as ValueSetAndRelationsUtilsGetDesc,
    checkIsValid as ValueSetAndRelationsUtilsCheckIsValid,
} from "../../valueSetAndRelations/Utils.ts";

export function checkIsValid(data: TileFilter, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): boolean {
    return getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null;
}

export function checkIsMeet(data: TileFilter, tile: ITile): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, tile.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, tile.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTileType();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, tile.getTileTypeId()))) {
            return false;
        }
    }

    {
        const con = data.getConIsOwnerPlayerInTurn();
        if ((con != null) && (con !== (tile.getPlayerIndex() === tile.getWar().getPlayerIndexInTurn()))) {
            return false;
        }
    }

    {
        const con = data.getConIsHighlighted();
        if ((con != null) && (con !== tile.getIsHighlighted())) {
            return false;
        }
    }

    {
        const con = data.getConHp();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, tile.getCurrentHp())) {
                return false;
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, tile.getCurrentCapturePoint())) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, tile.getCurrentBuildPoint())) {
                return false;
            }
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, tile.getWar().getUnitMap().getUnitsCountOnGrid(tile.getGridIndex()))) {
                return false;
            }
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, tile.getCustomNameId() ?? 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConGridIndex();
        if ((con != null) && (!GridIndexArrayAndPredicatesUtilsCheckIsMeet(con, tile.getGridIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConLocationId();
        if ((con != null)                                                               &&
            (!ValueSetAndRelationsUtilsCheckIsMeet(con, tile.getLocationIdList(true)))
        ) {
            return false;
        }
    }

    {
        const con = data.getConBuffTypeId();
        if ((con != null)                                                               &&
            (!ValueSetAndRelationsUtilsCheckIsMeet(con, [...tile.getAllBuffTypeIdSet()]))
        ) {
            return false;
        }
    }

    return true;
}
export function checkIsMeetAsOutOfVision(data: TileFilter, tile: ITile): boolean {
    const war         = tile.getWar();
    const playerIndex = (tile.getTemplateCfg().getIsAlwaysShowOwner())
        ? tile.getPlayerIndex()
        : PlayerIndex.Neutral;
    {
        const conIsOwnerPlayerInTurn = data.getConIsOwnerPlayerInTurn();
        if ((conIsOwnerPlayerInTurn != null) && (conIsOwnerPlayerInTurn != (playerIndex == war.getPlayerIndexInTurn()))) {
            return false;
        }
    }

    {
        const con = data.getConIsHighlighted();
        if ((con != null) && (con != tile.getIsHighlighted())) {
            return false;
        }
    }

    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, tile.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, tile.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTileType();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, tile.getTileTypeId()))) {
            return false;
        }
    }

    {
        const con = data.getConHp();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, tile.getCurrentHp())) {
                return false;
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, 0)) {
                return false;
            }
        }
    }

    return true;
}

export function checkIsEmpty(data: TileFilter): boolean {
    return (data.getConPlayerIndex() == null)
        && (data.getConTeamIndex() == null)
        && (data.getConTileType() == null)
        && (data.getConIsOwnerPlayerInTurn() == null)
        && (data.getConIsHighlighted() == null)
        && (data.getConHp() == null)
        && (data.getConCapturePoint() == null)
        && (data.getConBuildPoint() == null)
        && (data.getConUnitsCount() == null)
        && (data.getConCustomNameId() == null)
        && (data.getConGridIndex() == null)
        && (data.getConLocationId() == null)
        && (data.getConBuffTypeId() == null);
}

export function getDesc(data: TileFilter, gameConfig: GcData): string {
    const textArrayForSubConditions: string[] = [];

    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtilsGetDesc(con, getText(TextType.PlayerIndex), v => `P${v}`));
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtilsGetDesc(con, getText(TextType.B0019), v => getPlayerTeamName(v)));
        }
    }

    {
        const con = data.getConTileType();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtilsGetDesc(con, getText(TextType.B0718), v => getTileName(v, gameConfig)));
        }
    }

    {
        const con = data.getConIsOwnerPlayerInTurn();
        if (con != null) {
            textArrayForSubConditions.push(getText(con ? TextType.A0831 : TextType.A0832));
        }
    }

    {
        const con = data.getConIsHighlighted();
        if (con != null) {
            textArrayForSubConditions.push(getFormattedText(TextType.F0245, getTextForYesOrNo(con)));
        }
    }

    {
        const con = data.getConHp();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.Hp)));
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.CapturePoint)));
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.BuildPoint)));
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.B1418)));
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.CustomNameId)));
        }
    }

    {
        const con = data.getConGridIndex();
        if (con != null) {
            textArrayForSubConditions.push(GridIndexArrayAndPredicatesUtilsGetDesc(con, getText(TextType.B0531)));
        }
    }

    {
        const con = data.getConLocationId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtilsGetDesc(con, getText(TextType.Location), v => `${v}`));
        }
    }

    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtilsGetDesc(con, getText(TextType.AbnormalStateTypeId), v => `${getTileBuffName(v)}`));
        }
    }

    return getFormattedText(
        TextType.F0230,
        getText(TextType.B1144),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : getText(TextType.A0944)
    );
}
export function getDescForEmbed(data: TileFilter): string | null {
    const textArrayForSubConditions = getNonNullElements([
        data.getConPlayerIndex() == null         ? null : getText(TextType.PlayerIndex),
        data.getConTeamIndex() == null           ? null : getText(TextType.B0019),
        data.getConTileType() == null            ? null : getText(TextType.B0718),
        data.getConIsOwnerPlayerInTurn() == null ? null : getText(TextType.B0086),
        data.getConIsHighlighted() == null       ? null : getText(TextType.IsHighlighted),
        data.getConHp() == null                  ? null : getText(TextType.Hp),
        data.getConCapturePoint() == null        ? null : getText(TextType.CapturePoint),
        data.getConBuildPoint() == null          ? null : getText(TextType.BuildPoint),
        data.getConUnitsCount() == null          ? null : getText(TextType.B0773),
        data.getConCustomNameId() == null        ? null : getText(TextType.CustomNameId),
        data.getConGridIndex() == null           ? null : getText(TextType.B0531),
        data.getConLocationId() == null          ? null : getText(TextType.Location),
        data.getConBuffTypeId() == null          ? null : getText(TextType.AbnormalStateTypeId),
    ]);
    return !textArrayForSubConditions.length
        ? null
        : getFormattedText(
            TextType.F0231,
            getText(TextType.B1144),
            textArrayForSubConditions.join(`, `)
        );
}

export function getErrorTip(data: TileFilter, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): string | null {
    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtilsCheckIsValid(con))                                               ||
                (!checkIsValidPlayerIndexSubset(con.getValueArray() ?? [], playersCountUnneutral))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.PlayerIndex));
            }
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtilsCheckIsValid(con))                                                   ||
                (!checkIsValidTeamIndexSubset(con.getValueArray() ?? [], playersCountUnneutral))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.B0019));
            }
        }
    }

    {
        const con = data.getConTileType();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtilsCheckIsValid(con))                   ||
                (!gameConfig.checkIsValidTileTypeSubset(con.getValueArray() ?? []))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.B0718));
            }
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsOwnerPlayerInTurn();
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsHighlighted();
    }

    {
        const con = data.getConHp();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.Hp));
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.CapturePoint));
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.BuildPoint));
            }
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.B0773));
            }
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.CustomNameId));
            }
        }
    }

    {
        const con = data.getConGridIndex();
        if (con != null) {
            if (!GridIndexArrayAndPredicatesUtilsCheckIsValid(con, mapSize)) {
                return getFormattedText(TextType.F0091, getText(TextType.B0531));
            }
        }
    }

    {
        const con = data.getConLocationId();
        if (con != null) {
            if (!ValueSetAndRelationsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.Location));
            }
            if (!checkIsValidLocationIdSubset(con.getValueArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.Location));
            }
        }
    }

    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if (!ValueSetAndRelationsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.AbnormalStateTypeId));
            }
            if (!checkIsValidTypeIdSubset(con.getValueArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.AbnormalStateTypeId));
            }
        }
    }

    return null;
}
