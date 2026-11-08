import {
    GridIndexArrayAndPredicates_Utils,
    ValueAndComparators_Utils,
    ValueArrayAndPredicates_Utils,
    ValueSetAndRelations_Utils,
    Units_Utils_Common,
    Locations_Utils,
    Players_Utils_Common,
    Teams_Utils,
    UnitBuffs_Utils_Common,
    Lang_Utils,
    Helpers_Collection,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type Units_Unit,
    type AuxiliaryTypes_MapSize,
} from "../../internal.ts";
import type { UnitFilter } from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";

export function checkIsValid(data: UnitFilter, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    return getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null;
}

export function checkIsMeet(data: UnitFilter, unit: Units_Unit.Unit): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, unit.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, unit.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConUnitType();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, unit.getUnitType()))) {
            return false;
        }
    }

    {
        const con = data.getConActionState();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, unit.getActionState()))) {
            return false;
        }
    }

    {
        const con = data.getConIsCoOnboard();
        if ((con != null) && (con !== unit.getIsCoOnboard())) {
            return false;
        }
    }

    {
        const con = data.getConHp();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsMeet(con, unit.getCurrentHp()))) {
            return false;
        }
    }

    {
        const con = data.getConFuel();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsMeet(con, unit.getCurrentFuel()))) {
            return false;
        }
    }

    {
        const con = data.getConPriAmmo();
        if (con != null) {
            const ammo = unit.getPrimaryWeaponCurrentAmmo();
            if (ammo == null) {
                return false;
            }
            if (!ValueAndComparators_Utils.checkIsMeet(con, ammo)) {
                return false;
            }
        }
    }

    {
        const con = data.getConPromotion();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsMeet(con, unit.getCurrentPromotion()))) {
            return false;
        }
    }

    {
        const con = data.getConIsOwnerPlayerInTurn();
        if ((con != null) && (con !== (unit.getPlayerIndex() === unit.getWar().getPlayerIndexInTurn()))) {
            return false;
        }
    }

    {
        const con = data.getConIsDiving();
        if ((con != null) && (con !== unit.getIsDiving())) {
            return false;
        }
    }

    {
        const con = data.getConTagId();
        if ((con != null) && (!ValueSetAndRelations_Utils.checkIsMeet(con, unit.getTagIdArray(true)))) {
            return false;
        }
    }

    {
        const con = data.getConLoadedUnitsCount();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsMeet(con, unit.getLoadedUnitsCount()))) {
            return false;
        }
    }

    {
        const con = data.getConIsLoaded();
        if ((con != null) && (con !== (unit.getLoaderUnitId() != null))) {
            return false;
        }
    }

    {
        const con = data.getConFlareAmmo();
        if (con != null) {
            const ammo = unit.getFlareCurrentAmmo();
            if (ammo == null) {
                return false;
            }
            if (!ValueAndComparators_Utils.checkIsMeet(con, ammo)) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuildMaterial();
        if (con != null) {
            const material = unit.getCurrentBuildMaterial();
            if (material == null) {
                return false;
            }
            if (!ValueAndComparators_Utils.checkIsMeet(con, material)) {
                return false;
            }
        }
    }

    {
        const con = data.getConProduceMaterial();
        if (con != null) {
            const material = unit.getCurrentProduceMaterial();
            if (material == null) {
                return false;
            }
            if (!ValueAndComparators_Utils.checkIsMeet(con, material)) {
                return false;
            }
        }
    }

    {
        const con = data.getConForbiddenLocationId();
        if ((con != null) && (!ValueSetAndRelations_Utils.checkIsMeet(con, unit.getForbiddenLocationIdArray()))) {
            return false;
        }
    }

    {
        const con = data.getConAiMode();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, unit.getAiMode()))) {
            return false;
        }
    }

    {
        const con = data.getConGridIndex();
        if ((con != null) && (!GridIndexArrayAndPredicates_Utils.checkIsMeet(con, unit.getGridIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConLocationId();
        if ((con != null)                                                                                                               &&
            (!ValueSetAndRelations_Utils.checkIsMeet(con, unit.getWar().getTileMap().getTile(unit.getGridIndex()).getLocationIdList(true)))
        ) {
            return false;
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsMeet(con, unit.getCustomNameId() ?? 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuffTypeId();
        if ((con != null)                                                                                       &&
            (!ValueSetAndRelations_Utils.checkIsMeet(con, unit.getBuffList()?.map(v => v.getBuffTypeId())))
        ) {
            return false;
        }
    }

    return true;
}

export function checkIsEmpty(data: UnitFilter): boolean {
    return (data.getConPlayerIndex() == null)
        && (data.getConTeamIndex() == null)
        && (data.getConUnitType() == null)
        && (data.getConActionState() == null)
        && (data.getConIsCoOnboard() == null)
        && (data.getConHp() == null)
        && (data.getConFuel() == null)
        && (data.getConPriAmmo() == null)
        && (data.getConPromotion() == null)
        && (data.getConIsOwnerPlayerInTurn() == null)
        && (data.getConIsDiving() == null)
        && (data.getConTagId() == null)
        && (data.getConLoadedUnitsCount() == null)
        && (data.getConIsLoaded() == null)
        && (data.getConFlareAmmo() == null)
        && (data.getConBuildMaterial() == null)
        && (data.getConProduceMaterial() == null)
        && (data.getConForbiddenLocationId() == null)
        && (data.getConAiMode() == null)
        && (data.getConGridIndex() == null)
        && (data.getConLocationId() == null)
        && (data.getConCustomNameId() == null)
        && (data.getConBuffTypeId() == null);
}

export function getDesc(data: UnitFilter, gameConfig: GameConfigs_GameConfig.GameConfig): string {
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
        const con = data.getConUnitType();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicates_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.B0525), v => Lang_Utils.getUnitName(v, gameConfig)));
        }
    }
    {
        const con = data.getConActionState();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicates_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.ActionState), v => Lang_Utils.getUnitActionStateText(v)));
        }
    }
    {
        const con = data.getConIsCoOnboard();
        if (con != null) {
            textArrayForSubConditions.push(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0234, Lang_Utils.getTextForYesOrNo(con)));
        }
    }
    {
        const con = data.getConHp();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.B0934)));
        }
    }
    {
        const con = data.getConFuel();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.Fuel)));
        }
    }
    {
        const con = data.getConPriAmmo();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo)));
        }
    }
    {
        const con = data.getConPromotion();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.Promotion)));
        }
    }
    {
        const con = data.getConIsOwnerPlayerInTurn();
        if (con != null) {
            textArrayForSubConditions.push(Lang_Utils.getText(con ? Lang_Constants.TextType.A0831 : Lang_Constants.TextType.A0832));
        }
    }
    {
        const con = data.getConIsDiving();
        if (con != null) {
            textArrayForSubConditions.push(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0235, Lang_Utils.getTextForYesOrNo(con)));
        }
    }
    {
        const con = data.getConTagId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelations_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.Tags), v => `${v}`));
        }
    }
    {
        const con = data.getConLoadedUnitsCount();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.B0698)));
        }
    }
    {
        const con = data.getConIsLoaded();
        if (con != null) {
            textArrayForSubConditions.push(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0236, Lang_Utils.getTextForYesOrNo(con)));
        }
    }
    {
        const con = data.getConFlareAmmo();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo)));
        }
    }
    {
        const con = data.getConBuildMaterial();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial)));
        }
    }
    {
        const con = data.getConProduceMaterial();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial)));
        }
    }
    {
        const con = data.getConForbiddenLocationId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelations_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations), v => `${v}`));
        }
    }
    {
        const con = data.getConAiMode();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicates_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.AiMode), v => Lang_Utils.getUnitAiModeName(v)));
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
        const con = data.getConCustomNameId();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparators_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.CustomNameId)));
        }
    }
    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelations_Utils.getDesc(con, Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId), v => Lang_Utils.getUnitBuffName(v)));
        }
    }

    if (!textArrayForSubConditions.length) {
        textArrayForSubConditions.push(Lang_Utils.getText(Lang_Constants.TextType.A0944));
    }

    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0230,
        Lang_Utils.getText(Lang_Constants.TextType.B1058),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : Lang_Utils.getText(Lang_Constants.TextType.A0944),
    );
}
export function getDescForEmbed(data: UnitFilter): string | null {
    const textArrayForSubConditions = Helpers_Collection.getNonNullElements([
        data.getConPlayerIndex() == null         ? null : Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex),
        data.getConTeamIndex() == null           ? null : Lang_Utils.getText(Lang_Constants.TextType.B0019),
        data.getConUnitType() == null            ? null : Lang_Utils.getText(Lang_Constants.TextType.B0525),
        data.getConActionState() == null         ? null : Lang_Utils.getText(Lang_Constants.TextType.ActionState),
        data.getConIsCoOnboard() == null         ? null : Lang_Utils.getText(Lang_Constants.TextType.CoOnboard),
        data.getConHp() == null                  ? null : Lang_Utils.getText(Lang_Constants.TextType.B0934),
        data.getConFuel() == null                ? null : Lang_Utils.getText(Lang_Constants.TextType.Fuel),
        data.getConPriAmmo() == null             ? null : Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo),
        data.getConPromotion() == null           ? null : Lang_Utils.getText(Lang_Constants.TextType.Promotion),
        data.getConIsOwnerPlayerInTurn() == null ? null : Lang_Utils.getText(Lang_Constants.TextType.B0086),
        data.getConIsDiving() == null            ? null : Lang_Utils.getText(Lang_Constants.TextType.B0371),
        data.getConTagId() == null               ? null : Lang_Utils.getText(Lang_Constants.TextType.Tags),
        data.getConLoadedUnitsCount() == null    ? null : Lang_Utils.getText(Lang_Constants.TextType.B0698),
        data.getConIsLoaded() == null            ? null : Lang_Utils.getText(Lang_Constants.TextType.B1056),
        data.getConFlareAmmo() == null           ? null : Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo),
        data.getConBuildMaterial() == null       ? null : Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial),
        data.getConProduceMaterial() == null     ? null : Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial),
        data.getConForbiddenLocationId() == null ? null : Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations),
        data.getConAiMode() == null              ? null : Lang_Utils.getText(Lang_Constants.TextType.AiMode),
        data.getConGridIndex() == null           ? null : Lang_Utils.getText(Lang_Constants.TextType.B0531),
        data.getConLocationId() == null          ? null : Lang_Utils.getText(Lang_Constants.TextType.Location),
        data.getConCustomNameId() == null        ? null : Lang_Utils.getText(Lang_Constants.TextType.CustomNameId),
        data.getConBuffTypeId() == null          ? null : Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId),
    ]);
    return !textArrayForSubConditions.length
        ? null
        : Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0231,
            Lang_Utils.getText(Lang_Constants.TextType.B1058),
            textArrayForSubConditions.join(`, `),
        );
}

export function getErrorTip(data: UnitFilter, playersCountUnneutral: number, mapSize: AuxiliaryTypes_MapSize.MapSize, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
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
        const con = data.getConUnitType();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                   ||
                (!gameConfig.checkIsValidUnitTypeSubset(con.getValueArray()))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0525));
            }
        }
    }

    {
        const con = data.getConActionState();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                               ||
                (!Units_Utils_Common.checkIsValidActionStateIdSubset(con.getValueArray()))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.ActionState));
            }
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsCoOnboard();
    }

    {
        const con = data.getConHp();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0934));
            }
        }
    }

    {
        const con = data.getConFuel();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Fuel));
            }
        }
    }

    {
        const con = data.getConPriAmmo();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PrimaryWeaponAmmo));
            }
        }
    }

    {
        const con = data.getConPromotion();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Promotion));
            }
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsOwnerPlayerInTurn();
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsDiving();
    }

    {
        const con = data.getConTagId();
        if (con != null) {
            if (!ValueSetAndRelations_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Tags));
            }
            if (!Units_Utils_Common.checkIsValidTagIdSubset(con.getValueArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Tags));
            }
        }
    }

    {
        const con = data.getConLoadedUnitsCount();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsValid(con))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0698));
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsLoaded();
    }

    {
        const con = data.getConFlareAmmo();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsValid(con))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.FlareAmmo));
        }
    }

    {
        const con = data.getConBuildMaterial();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsValid(con))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.BuildMaterial));
        }
    }

    {
        const con = data.getConProduceMaterial();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsValid(con))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.ProductionMaterial));
        }
    }

    {
        const con = data.getConForbiddenLocationId();
        if (con != null) {
            if (!ValueSetAndRelations_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations));
            }
            if (!Locations_Utils.checkIsValidLocationIdSubset(con.getValueArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.NoEntryLocations));
            }
        }
    }

    {
        const con = data.getConAiMode();
        if (con != null) {
            if (!ValueArrayAndPredicates_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AiMode));
            }
            if (!Units_Utils_Common.checkIsValidAiModeIdSubset(con.getValueArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AiMode));
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
        const con = data.getConCustomNameId();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsValid(con))) {
            return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CustomNameId));
        }
    }

    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if (!ValueSetAndRelations_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId));
            }
            if (!UnitBuffs_Utils_Common.checkIsValidTypeIdSubset(con.getValueArray())) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.AbnormalStateTypeId));
            }
        }
    }

    return null;
}
