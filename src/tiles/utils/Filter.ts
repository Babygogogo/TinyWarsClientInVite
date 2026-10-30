import {
    GridIndexArrayAndPredicates_Utils,
    ValueAndComparators_Utils,
    ValueArrayAndPredicates_Utils,
    ValueSetAndRelations_Utils,
    Locations_Utils,
    Players_Utils_Common,
    Teams_Utils,
    TileBuffs_Utils_Common,
    Lang_Utils,
    Helpers_Collection,
    Players_Constants,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type Tiles_ITile,
    type AuxiliaryTypes_MapSize,
} from "../../internal.ts";
import type { TileFilter } from "../../proto/schema/CommonProto/Structure/TileFilter.ts";

export function checkIsValid(data: TileFilter, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    return getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null;
}

export function checkIsMeet(data: TileFilter, tile: Tiles_ITile.ITile): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, tile.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, tile.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTileType();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, tile.getTileTypeId()))) {
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
            if (!ValueAndComparators_Utils.checkIsMeet(con, tile.getCurrentHp())) {
                return false;
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsMeet(con, tile.getCurrentCapturePoint())) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsMeet(con, tile.getCurrentBuildPoint())) {
                return false;
            }
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsMeet(con, tile.getWar().getUnitMap().getUnitsCountOnGrid(tile.getGridIndex()))) {
                return false;
            }
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsMeet(con, tile.getCustomNameId() ?? 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConGridIndex();
        if ((con != null) && (!GridIndexArrayAndPredicates_Utils.checkIsMeet(con, tile.getGridIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConLocationId();
        if ((con != null)                                                               &&
            (!ValueSetAndRelations_Utils.checkIsMeet(con, tile.getLocationIdList(true)))
        ) {
            return false;
        }
    }

    {
        const con = data.getConBuffTypeId();
        if ((con != null)                                                               &&
            (!ValueSetAndRelations_Utils.checkIsMeet(con, [...tile.getAllBuffTypeIdSet()]))
        ) {
            return false;
        }
    }

    return true;
}
export function checkIsMeetAsOutOfVision(data: TileFilter, tile: Tiles_ITile.ITile): boolean {
    const war         = tile.getWar();
    const playerIndex = (tile.getTemplateCfg().getIsAlwaysShowOwner())
        ? tile.getPlayerIndex()
        : Players_Constants.PlayerIndex.Neutral;
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
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, tile.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, tile.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTileType();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, tile.getTileTypeId()))) {
            return false;
        }
    }

    {
        const con = data.getConHp();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsMeet(con, tile.getCurrentHp())) {
                return false;
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsMeet(con, 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsMeet(con, 0)) {
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

export function getDesc(data: TileFilter, gameConfig: GameConfigs_GameConfig.GameConfig): string {
    const textArrayForSubConditions: string[] = [];

    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicates_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex), v => `P${v}`));
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicates_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.B0019), v => Lang_Utils.getPlayerTeamName(v)));
        }
    }

    {
        const con = data.getConTileType();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicates_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.B0718), v => Lang_Utils.getTileName(v, gameConfig)));
        }
    }

    {
        const con = data.getConIsOwnerPlayerInTurn();
        if (con != null) {
            textArrayForSubConditions.push(Lang_Utils.getText(con ? Lang_Constants.TextType.A0831 : Lang_Constants.TextType.A0832));
        }
    }

    {
        const con = data.getConIsHighlighted();
        if (con != null) {
            textArrayForSubConditions.push(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0245, Lang_Utils.getTextForYesOrNo(con)));
        }
    }

    {
        const con = data.getConHp();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.Hp)));
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.CapturePoint)));
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.BuildPoint)));
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.B1418)));
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.CustomNameId)));
        }
    }

    {
        const con = data.getConGridIndex();
        if (con != null) {
            textArrayForSubConditions.push(GridIndexArrayAndPredicates_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.B0531)));
        }
    }

    {
        const con = data.getConLocationId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelations_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.Location), v => `${v}`));
        }
    }

    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelations_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId), v => `${Lang_Utils.getTileBuffName(v)}`));
        }
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0230,
        Lang_Utils.getText(Lang_Constants.TextType.B1144),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : Lang_Utils.getText(Lang_Constants.TextType.A0944)
    );
}
export function getDescForEmbed(data: TileFilter): string | null {
    const textArrayForSubConditions = Helpers_Collection.getNonNullElements([
        data.getConPlayerIndex() == null         ? null : Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex),
        data.getConTeamIndex() == null           ? null : Lang_Utils.getText(Lang_Constants.TextType.B0019),
        data.getConTileType() == null            ? null : Lang_Utils.getText(Lang_Constants.TextType.B0718),
        data.getConIsOwnerPlayerInTurn() == null ? null : Lang_Utils.getText(Lang_Constants.TextType.B0086),
        data.getConIsHighlighted() == null       ? null : Lang_Utils.getText(Lang_Constants.TextType.IsHighlighted),
        data.getConHp() == null                  ? null : Lang_Utils.getText(Lang_Constants.TextType.Hp),
        data.getConCapturePoint() == null        ? null : Lang_Utils.getText(Lang_Constants.TextType.CapturePoint),
        data.getConBuildPoint() == null          ? null : Lang_Utils.getText(Lang_Constants.TextType.BuildPoint),
        data.getConUnitsCount() == null          ? null : Lang_Utils.getText(Lang_Constants.TextType.B0773),
        data.getConCustomNameId() == null        ? null : Lang_Utils.getText(Lang_Constants.TextType.CustomNameId),
        data.getConGridIndex() == null           ? null : Lang_Utils.getText(Lang_Constants.TextType.B0531),
        data.getConLocationId() == null          ? null : Lang_Utils.getText(Lang_Constants.TextType.Location),
        data.getConBuffTypeId() == null          ? null : Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId),
    ]);
    return !textArrayForSubConditions.length
        ? null
        : Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0231,
            Lang_Utils.getText(Lang_Constants.TextType.B1144),
            textArrayForSubConditions.join(`, `)
        );
}

export function getErrorTip(data: TileFilter, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                                               ||
                (!Players_Utils_Common.checkIsValidPlayerIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex));
            }
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                                                   ||
                (!Teams_Utils.checkIsValidTeamIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0019));
            }
        }
    }

    {
        const con = data.getConTileType();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                   ||
                (!gameConfig.checkIsValidTileTypeSubset(con.getValueArray()))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0718));
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
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Hp));
            }
        }
    }

    {
        const con = data.getConCapturePoint();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CapturePoint));
            }
        }
    }

    {
        const con = data.getConBuildPoint();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.BuildPoint));
            }
        }
    }

    {
        const con = data.getConUnitsCount();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0773));
            }
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CustomNameId));
            }
        }
    }

    {
        const con = data.getConGridIndex();
        if (con != null) {
            if (!GridIndexArrayAndPredicates_Utils.checkIsValid(con, mapSize)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0531));
            }
        }
    }

    {
        const con = data.getConLocationId();
        if (con != null) {
            if (!ValueSetAndRelations_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Location));
            }
            if (!Locations_Utils.checkIsValidLocationIdSubset(con.getValueArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Location));
            }
        }
    }

    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if (!ValueSetAndRelations_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId));
            }
            if (!TileBuffs_Utils_Common.checkIsValidTypeIdSubset(con.getValueArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId));
            }
        }
    }

    return null;
}
