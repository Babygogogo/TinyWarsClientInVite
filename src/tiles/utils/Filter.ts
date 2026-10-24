import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GridIndexArrayAndPredicatesUtils from "../../gridIndexArrayAndPredicates/Utils.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocationsUtils from "../../locations/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as PlayersUtilsCommon from "../../players/utils/Common.ts";
import type * as ProtoSchemaCommonProtoStructureTileFilter from "../../proto/schema/CommonProto/Structure/TileFilter.ts";
import * as TeamsUtils from "../../teams/Utils.ts";
import * as TileBuffsUtilsCommon from "../../tileBuffs/utils/Common.ts";
import type * as TilesITile from "../ITile.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as ValueArrayAndPredicatesUtils from "../../valueArrayAndPredicates/Utils.ts";
import * as ValueSetAndRelationsUtils from "../../valueSetAndRelations/Utils.ts";

type TileFilter                         = ProtoSchemaCommonProtoStructureTileFilter.TileFilter;
type ITile                              = TilesITile.ITile;

export function checkIsValid(data: TileFilter, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): boolean {
    return getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null;
}

export function checkIsMeet(data: TileFilter, tile: ITile): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, tile.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, tile.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTileType();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, tile.getTileTypeId()))) {
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
            if (!ValueAndComparatorsUtils.checkIsMeet(con, tile.getCurrentHp())) {
                return false;
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsMeet(con, tile.getCurrentCapturePoint())) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsMeet(con, tile.getCurrentBuildPoint())) {
                return false;
            }
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsMeet(con, tile.getWar().getUnitMap().getUnitsCountOnGrid(tile.getGridIndex()))) {
                return false;
            }
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsMeet(con, tile.getCustomNameId() ?? 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConGridIndex();
        if ((con != null) && (!GridIndexArrayAndPredicatesUtils.checkIsMeet(con, tile.getGridIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConLocationId();
        if ((con != null)                                                               &&
            (!ValueSetAndRelationsUtils.checkIsMeet(con, tile.getLocationIdList(true)))
        ) {
            return false;
        }
    }

    {
        const con = data.getConBuffTypeId();
        if ((con != null)                                                               &&
            (!ValueSetAndRelationsUtils.checkIsMeet(con, [...tile.getAllBuffTypeIdSet()]))
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
        : PlayersConstants.PlayerIndex.Neutral;
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
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, tile.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, tile.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTileType();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, tile.getTileTypeId()))) {
            return false;
        }
    }

    {
        const con = data.getConHp();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsMeet(con, tile.getCurrentHp())) {
                return false;
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsMeet(con, 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsMeet(con, 0)) {
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

export function getDesc(data: TileFilter, gameConfig: GameConfigGcData.GcData): string {
    const textArrayForSubConditions: string[] = [];

    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.PlayerIndex), v => `P${v}`));
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.B0019), v => LangUtils.getPlayerTeamName(v)));
        }
    }

    {
        const con = data.getConTileType();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.B0718), v => LangUtils.getTileName(v, gameConfig)));
        }
    }

    {
        const con = data.getConIsOwnerPlayerInTurn();
        if (con != null) {
            textArrayForSubConditions.push(LangUtils.getText(con ? LangConstants.TextType.A0831 : LangConstants.TextType.A0832));
        }
    }

    {
        const con = data.getConIsHighlighted();
        if (con != null) {
            textArrayForSubConditions.push(LangUtils.getFormattedText(LangConstants.TextType.F0245, LangUtils.getTextForYesOrNo(con)));
        }
    }

    {
        const con = data.getConHp();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.Hp)));
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.CapturePoint)));
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.BuildPoint)));
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.B1418)));
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.CustomNameId)));
        }
    }

    {
        const con = data.getConGridIndex();
        if (con != null) {
            textArrayForSubConditions.push(GridIndexArrayAndPredicatesUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.B0531)));
        }
    }

    {
        const con = data.getConLocationId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.Location), v => `${v}`));
        }
    }

    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId), v => `${LangUtils.getTileBuffName(v)}`));
        }
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0230,
        LangUtils.getText(LangConstants.TextType.B1144),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : LangUtils.getText(LangConstants.TextType.A0944)
    );
}
export function getDescForEmbed(data: TileFilter): string | null {
    const textArrayForSubConditions = HelpersCollection.getNonNullElements([
        data.getConPlayerIndex() == null         ? null : LangUtils.getText(LangConstants.TextType.PlayerIndex),
        data.getConTeamIndex() == null           ? null : LangUtils.getText(LangConstants.TextType.B0019),
        data.getConTileType() == null            ? null : LangUtils.getText(LangConstants.TextType.B0718),
        data.getConIsOwnerPlayerInTurn() == null ? null : LangUtils.getText(LangConstants.TextType.B0086),
        data.getConIsHighlighted() == null       ? null : LangUtils.getText(LangConstants.TextType.IsHighlighted),
        data.getConHp() == null                  ? null : LangUtils.getText(LangConstants.TextType.Hp),
        data.getConCapturePoint() == null        ? null : LangUtils.getText(LangConstants.TextType.CapturePoint),
        data.getConBuildPoint() == null          ? null : LangUtils.getText(LangConstants.TextType.BuildPoint),
        data.getConUnitsCount() == null          ? null : LangUtils.getText(LangConstants.TextType.B0773),
        data.getConCustomNameId() == null        ? null : LangUtils.getText(LangConstants.TextType.CustomNameId),
        data.getConGridIndex() == null           ? null : LangUtils.getText(LangConstants.TextType.B0531),
        data.getConLocationId() == null          ? null : LangUtils.getText(LangConstants.TextType.Location),
        data.getConBuffTypeId() == null          ? null : LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId),
    ]);
    return !textArrayForSubConditions.length
        ? null
        : LangUtils.getFormattedText(
            LangConstants.TextType.F0231,
            LangUtils.getText(LangConstants.TextType.B1144),
            textArrayForSubConditions.join(`, `)
        );
}

export function getErrorTip(data: TileFilter, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                                               ||
                (!PlayersUtilsCommon.checkIsValidPlayerIndexSubset(con.getValueArray() ?? [], playersCountUnneutral))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerIndex));
            }
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                                                   ||
                (!TeamsUtils.checkIsValidTeamIndexSubset(con.getValueArray() ?? [], playersCountUnneutral))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0019));
            }
        }
    }

    {
        const con = data.getConTileType();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                   ||
                (!gameConfig.checkIsValidTileTypeSubset(con.getValueArray() ?? []))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0718));
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
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Hp));
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CapturePoint));
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.BuildPoint));
            }
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0773));
            }
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CustomNameId));
            }
        }
    }

    {
        const con = data.getConGridIndex();
        if (con != null) {
            if (!GridIndexArrayAndPredicatesUtils.checkIsValid(con, mapSize)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0531));
            }
        }
    }

    {
        const con = data.getConLocationId();
        if (con != null) {
            if (!ValueSetAndRelationsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Location));
            }
            if (!LocationsUtils.checkIsValidLocationIdSubset(con.getValueArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Location));
            }
        }
    }

    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if (!ValueSetAndRelationsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
            }
            if (!TileBuffsUtilsCommon.checkIsValidTypeIdSubset(con.getValueArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
            }
        }
    }

    return null;
}
