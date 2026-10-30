import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import {
    checkIsMeet as checkIsMeetGridIndexArrayAndPredicate,
    getDesc as getGridIndexArrayAndPredicatesDesc,
    checkIsValid as checkIsValidGridIndexArrayAndPredicate,
} from "../../gridIndexArrayAndPredicates/Utils.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getPlayerTeamName,
    getTileName,
    getFormattedText,
    getTextForYesOrNo,
    getTileBuffName,
} from "../../lang/Utils.ts";
import { checkIsValidLocationIdSubset } from "../../locations/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { checkIsValidPlayerIndexSubset } from "../../players/utils/Common.ts";
import type { TileFilter } from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import { checkIsValidTeamIndexSubset } from "../../teams/Utils.ts";
import { checkIsValidTypeIdSubset } from "../../tileBuffs/utils/Common.ts";
import type { ITile } from "../ITile.ts";
import {
    checkIsMeet as checkIsMeetValueAndComparator,
    getDesc as getValueAndComparatorsDesc,
    checkIsValid as checkIsValidValueAndComparator,
} from "../../valueAndComparators/Utils.ts";
import {
    checkIsMeet as checkIsMeetValueArrayAndPredicate,
    getDesc as getValueArrayAndPredicatesDesc,
    checkIsValid as checkIsValidValueArrayAndPredicate,
} from "../../valueArrayAndPredicates/Utils.ts";
import {
    checkIsMeet as checkIsMeetValueSetAndRelation,
    getDesc as getValueSetAndRelationsDesc,
    checkIsValid as checkIsValidValueSetAndRelation,
} from "../../valueSetAndRelations/Utils.ts";

export function checkIsValid(data: TileFilter, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GameConfig): boolean {
    return getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null;
}

export function checkIsMeet(data: TileFilter, tile: ITile): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, tile.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, tile.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTileType();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, tile.getTileTypeId()))) {
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
            if (!checkIsMeetValueAndComparator(con, tile.getCurrentHp())) {
                return false;
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!checkIsMeetValueAndComparator(con, tile.getCurrentCapturePoint())) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!checkIsMeetValueAndComparator(con, tile.getCurrentBuildPoint())) {
                return false;
            }
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            if (!checkIsMeetValueAndComparator(con, tile.getWar().getUnitMap().getUnitsCountOnGrid(tile.getGridIndex()))) {
                return false;
            }
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!checkIsMeetValueAndComparator(con, tile.getCustomNameId() ?? 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConGridIndex();
        if ((con != null) && (!checkIsMeetGridIndexArrayAndPredicate(con, tile.getGridIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConLocationId();
        if ((con != null)                                                               &&
            (!checkIsMeetValueSetAndRelation(con, tile.getLocationIdList(true)))
        ) {
            return false;
        }
    }

    {
        const con = data.getConBuffTypeId();
        if ((con != null)                                                               &&
            (!checkIsMeetValueSetAndRelation(con, [...tile.getAllBuffTypeIdSet()]))
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
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, tile.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, tile.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTileType();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, tile.getTileTypeId()))) {
            return false;
        }
    }

    {
        const con = data.getConHp();
        if (con != null) {
            if (!checkIsMeetValueAndComparator(con, tile.getCurrentHp())) {
                return false;
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!checkIsMeetValueAndComparator(con, 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!checkIsMeetValueAndComparator(con, 0)) {
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

export function getDesc(data: TileFilter, gameConfig: GameConfig): string {
    const textArrayForSubConditions: string[] = [];

    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            textArrayForSubConditions.push(getValueArrayAndPredicatesDesc(con, getText(TextType.PlayerIndex), v => `P${v}`));
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            textArrayForSubConditions.push(getValueArrayAndPredicatesDesc(con, getText(TextType.B0019), v => getPlayerTeamName(v)));
        }
    }

    {
        const con = data.getConTileType();
        if (con != null) {
            textArrayForSubConditions.push(getValueArrayAndPredicatesDesc(con, getText(TextType.B0718), v => getTileName(v, gameConfig)));
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
            textArrayForSubConditions.push(getValueAndComparatorsDesc(con, getText(TextType.Hp)));
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            textArrayForSubConditions.push(getValueAndComparatorsDesc(con, getText(TextType.CapturePoint)));
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            textArrayForSubConditions.push(getValueAndComparatorsDesc(con, getText(TextType.BuildPoint)));
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            textArrayForSubConditions.push(getValueAndComparatorsDesc(con, getText(TextType.B1418)));
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            textArrayForSubConditions.push(getValueAndComparatorsDesc(con, getText(TextType.CustomNameId)));
        }
    }

    {
        const con = data.getConGridIndex();
        if (con != null) {
            textArrayForSubConditions.push(getGridIndexArrayAndPredicatesDesc(con, getText(TextType.B0531)));
        }
    }

    {
        const con = data.getConLocationId();
        if (con != null) {
            textArrayForSubConditions.push(getValueSetAndRelationsDesc(con, getText(TextType.Location), v => `${v}`));
        }
    }

    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            textArrayForSubConditions.push(getValueSetAndRelationsDesc(con, getText(TextType.AbnormalStateTypeId), v => `${getTileBuffName(v)}`));
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

export function getErrorTip(data: TileFilter, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GameConfig): string | null {
    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            if ((!checkIsValidValueArrayAndPredicate(con))                                               ||
                (!checkIsValidPlayerIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.PlayerIndex));
            }
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            if ((!checkIsValidValueArrayAndPredicate(con))                                                   ||
                (!checkIsValidTeamIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.B0019));
            }
        }
    }

    {
        const con = data.getConTileType();
        if (con != null) {
            if ((!checkIsValidValueArrayAndPredicate(con))                   ||
                (!gameConfig.checkIsValidTileTypeSubset(con.getValueArray()))
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
            if (!checkIsValidValueAndComparator(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.Hp));
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!checkIsValidValueAndComparator(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.CapturePoint));
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!checkIsValidValueAndComparator(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.BuildPoint));
            }
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            if (!checkIsValidValueAndComparator(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.B0773));
            }
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!checkIsValidValueAndComparator(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.CustomNameId));
            }
        }
    }

    {
        const con = data.getConGridIndex();
        if (con != null) {
            if (!checkIsValidGridIndexArrayAndPredicate(con, mapSize)) {
                return getFormattedText(TextType.F0091, getText(TextType.B0531));
            }
        }
    }

    {
        const con = data.getConLocationId();
        if (con != null) {
            if (!checkIsValidValueSetAndRelation(con)) {
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
            if (!checkIsValidValueSetAndRelation(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.AbnormalStateTypeId));
            }
            if (!checkIsValidTypeIdSubset(con.getValueArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.AbnormalStateTypeId));
            }
        }
    }

    return null;
}
