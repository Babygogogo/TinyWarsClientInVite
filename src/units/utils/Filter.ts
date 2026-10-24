import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GridIndexArrayAndPredicatesUtils from "../../gridIndexArrayAndPredicates/Utils.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocationsUtils from "../../locations/Utils.ts";
import * as PlayersUtilsCommon from "../../players/utils/Common.ts";
import type * as ProtoSchemaCommonProtoStructureUnitFilter from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import * as TeamsUtils from "../../teams/Utils.ts";
import * as UnitBuffsUtilsCommon from "../../unitBuffs/utils/Common.ts";
import type * as UnitsIUnit from "../IUnit.ts";
import * as UnitsUtilsCommon from "./Common.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as ValueArrayAndPredicatesUtils from "../../valueArrayAndPredicates/Utils.ts";
import * as ValueSetAndRelationsUtils from "../../valueSetAndRelations/Utils.ts";

type UnitFilter                         = ProtoSchemaCommonProtoStructureUnitFilter.UnitFilter;

export function checkIsValid(data: UnitFilter, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): boolean {
    return getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null;
}

export function checkIsMeet(data: UnitFilter, unit: UnitsIUnit.IUnit): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, unit.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, unit.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConUnitType();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, unit.getUnitType()))) {
            return false;
        }
    }

    {
        const con = data.getConActionState();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, unit.getActionState()))) {
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
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsMeet(con, unit.getCurrentHp()))) {
            return false;
        }
    }

    {
        const con = data.getConFuel();
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsMeet(con, unit.getCurrentFuel()))) {
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
            if (!ValueAndComparatorsUtils.checkIsMeet(con, ammo)) {
                return false;
            }
        }
    }

    {
        const con = data.getConPromotion();
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsMeet(con, unit.getCurrentPromotion()))) {
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
        if ((con != null) && (!ValueSetAndRelationsUtils.checkIsMeet(con, unit.getTagIdArray(true)))) {
            return false;
        }
    }

    {
        const con = data.getConLoadedUnitsCount();
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsMeet(con, unit.getLoadedUnitsCount()))) {
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
            if (!ValueAndComparatorsUtils.checkIsMeet(con, ammo)) {
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
            if (!ValueAndComparatorsUtils.checkIsMeet(con, material)) {
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
            if (!ValueAndComparatorsUtils.checkIsMeet(con, material)) {
                return false;
            }
        }
    }

    {
        const con = data.getConForbiddenLocationId();
        if ((con != null) && (!ValueSetAndRelationsUtils.checkIsMeet(con, unit.getForbiddenLocationIdArray() ?? []))) {
            return false;
        }
    }

    {
        const con = data.getConAiMode();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, unit.getAiMode()))) {
            return false;
        }
    }

    {
        const con = data.getConGridIndex();
        if ((con != null) && (!GridIndexArrayAndPredicatesUtils.checkIsMeet(con, unit.getGridIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConLocationId();
        if ((con != null)                                                                                                               &&
            (!ValueSetAndRelationsUtils.checkIsMeet(con, unit.getWar().getTileMap().getTile(unit.getGridIndex()).getLocationIdList(true)))
        ) {
            return false;
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsMeet(con, unit.getCustomNameId() ?? 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuffTypeId();
        if ((con != null)                                                                                       &&
            (!ValueSetAndRelationsUtils.checkIsMeet(con, unit.getBuffList()?.map(v => v.getBuffTypeId()) ?? []))
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

export function getDesc(data: UnitFilter, gameConfig: GameConfigGcData.GcData): string {
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
        const con = data.getConUnitType();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.B0525), v => LangUtils.getUnitName(v, gameConfig)));
        }
    }
    {
        const con = data.getConActionState();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.ActionState), v => LangUtils.getUnitActionStateText(v)));
        }
    }
    {
        const con = data.getConIsCoOnboard();
        if (con != null) {
            textArrayForSubConditions.push(LangUtils.getFormattedText(LangConstants.TextType.F0234, LangUtils.getTextForYesOrNo(con)));
        }
    }
    {
        const con = data.getConHp();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.B0934)));
        }
    }
    {
        const con = data.getConFuel();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.Fuel)));
        }
    }
    {
        const con = data.getConPriAmmo();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo)));
        }
    }
    {
        const con = data.getConPromotion();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.Promotion)));
        }
    }
    {
        const con = data.getConIsOwnerPlayerInTurn();
        if (con != null) {
            textArrayForSubConditions.push(LangUtils.getText(con ? LangConstants.TextType.A0831 : LangConstants.TextType.A0832));
        }
    }
    {
        const con = data.getConIsDiving();
        if (con != null) {
            textArrayForSubConditions.push(LangUtils.getFormattedText(LangConstants.TextType.F0235, LangUtils.getTextForYesOrNo(con)));
        }
    }
    {
        const con = data.getConTagId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.Tags), v => `${v}`));
        }
    }
    {
        const con = data.getConLoadedUnitsCount();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.B0698)));
        }
    }
    {
        const con = data.getConIsLoaded();
        if (con != null) {
            textArrayForSubConditions.push(LangUtils.getFormattedText(LangConstants.TextType.F0236, LangUtils.getTextForYesOrNo(con)));
        }
    }
    {
        const con = data.getConFlareAmmo();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.FlareAmmo)));
        }
    }
    {
        const con = data.getConBuildMaterial();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.BuildMaterial)));
        }
    }
    {
        const con = data.getConProduceMaterial();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.ProductionMaterial)));
        }
    }
    {
        const con = data.getConForbiddenLocationId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.NoEntryLocations), v => `${v}`));
        }
    }
    {
        const con = data.getConAiMode();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.AiMode), v => LangUtils.getUnitAiModeName(v)));
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
        const con = data.getConCustomNameId();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.CustomNameId)));
        }
    }
    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtils.getDesc(con, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId), v => LangUtils.getUnitBuffName(v)));
        }
    }

    if (!textArrayForSubConditions.length) {
        textArrayForSubConditions.push(LangUtils.getText(LangConstants.TextType.A0944));
    }

    return LangUtils.getFormattedText(
        LangConstants.TextType.F0230,
        LangUtils.getText(LangConstants.TextType.B1058),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : LangUtils.getText(LangConstants.TextType.A0944)
    );
}
export function getDescForEmbed(data: UnitFilter): string | null {
    const textArrayForSubConditions = HelpersCollection.getNonNullElements([
        data.getConPlayerIndex() == null         ? null : LangUtils.getText(LangConstants.TextType.PlayerIndex),
        data.getConTeamIndex() == null           ? null : LangUtils.getText(LangConstants.TextType.B0019),
        data.getConUnitType() == null            ? null : LangUtils.getText(LangConstants.TextType.B0525),
        data.getConActionState() == null         ? null : LangUtils.getText(LangConstants.TextType.ActionState),
        data.getConIsCoOnboard() == null         ? null : LangUtils.getText(LangConstants.TextType.CoOnboard),
        data.getConHp() == null                  ? null : LangUtils.getText(LangConstants.TextType.B0934),
        data.getConFuel() == null                ? null : LangUtils.getText(LangConstants.TextType.Fuel),
        data.getConPriAmmo() == null             ? null : LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo),
        data.getConPromotion() == null           ? null : LangUtils.getText(LangConstants.TextType.Promotion),
        data.getConIsOwnerPlayerInTurn() == null ? null : LangUtils.getText(LangConstants.TextType.B0086),
        data.getConIsDiving() == null            ? null : LangUtils.getText(LangConstants.TextType.B0371),
        data.getConTagId() == null               ? null : LangUtils.getText(LangConstants.TextType.Tags),
        data.getConLoadedUnitsCount() == null    ? null : LangUtils.getText(LangConstants.TextType.B0698),
        data.getConIsLoaded() == null            ? null : LangUtils.getText(LangConstants.TextType.B1056),
        data.getConFlareAmmo() == null           ? null : LangUtils.getText(LangConstants.TextType.FlareAmmo),
        data.getConBuildMaterial() == null       ? null : LangUtils.getText(LangConstants.TextType.BuildMaterial),
        data.getConProduceMaterial() == null     ? null : LangUtils.getText(LangConstants.TextType.ProductionMaterial),
        data.getConForbiddenLocationId() == null ? null : LangUtils.getText(LangConstants.TextType.NoEntryLocations),
        data.getConAiMode() == null              ? null : LangUtils.getText(LangConstants.TextType.AiMode),
        data.getConGridIndex() == null           ? null : LangUtils.getText(LangConstants.TextType.B0531),
        data.getConLocationId() == null          ? null : LangUtils.getText(LangConstants.TextType.Location),
        data.getConCustomNameId() == null        ? null : LangUtils.getText(LangConstants.TextType.CustomNameId),
        data.getConBuffTypeId() == null          ? null : LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId),
    ]);
    return !textArrayForSubConditions.length
        ? null
        : LangUtils.getFormattedText(
            LangConstants.TextType.F0231,
            LangUtils.getText(LangConstants.TextType.B1058),
            textArrayForSubConditions.join(`, `)
        );
}

export function getErrorTip(data: UnitFilter, playersCountUnneutral: number, mapSize: AuxiliaryTypesMapSize.MapSize, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                                               ||
                (!PlayersUtilsCommon.checkIsValidPlayerIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerIndex));
            }
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                                                   ||
                (!TeamsUtils.checkIsValidTeamIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0019));
            }
        }
    }

    {
        const con = data.getConUnitType();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                   ||
                (!gameConfig.checkIsValidUnitTypeSubset(con.getValueArray()))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0525));
            }
        }
    }

    {
        const con = data.getConActionState();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                               ||
                (!UnitsUtilsCommon.checkIsValidActionStateIdSubset(con.getValueArray()))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.ActionState));
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
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0934));
            }
        }
    }

    {
        const con = data.getConFuel();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Fuel));
            }
        }
    }

    {
        const con = data.getConPriAmmo();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PrimaryWeaponAmmo));
            }
        }
    }

    {
        const con = data.getConPromotion();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Promotion));
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
            if (!ValueSetAndRelationsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Tags));
            }
            if (!UnitsUtilsCommon.checkIsValidTagIdSubset(con.getValueArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Tags));
            }
        }
    }

    {
        const con = data.getConLoadedUnitsCount();
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsValid(con))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0698));
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsLoaded();
    }

    {
        const con = data.getConFlareAmmo();
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsValid(con))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.FlareAmmo));
        }
    }

    {
        const con = data.getConBuildMaterial();
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsValid(con))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.BuildMaterial));
        }
    }

    {
        const con = data.getConProduceMaterial();
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsValid(con))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.ProductionMaterial));
        }
    }

    {
        const con = data.getConForbiddenLocationId();
        if (con != null) {
            if (!ValueSetAndRelationsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.NoEntryLocations));
            }
            if (!LocationsUtils.checkIsValidLocationIdSubset(con.getValueArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.NoEntryLocations));
            }
        }
    }

    {
        const con = data.getConAiMode();
        if (con != null) {
            if (!ValueArrayAndPredicatesUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AiMode));
            }
            if (!UnitsUtilsCommon.checkIsValidAiModeIdSubset(con.getValueArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AiMode));
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
        const con = data.getConCustomNameId();
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsValid(con))) {
            return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CustomNameId));
        }
    }

    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            if (!ValueSetAndRelationsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
            }
            if (!UnitBuffsUtilsCommon.checkIsValidTypeIdSubset(con.getValueArray())) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.AbnormalStateTypeId));
            }
        }
    }

    return null;
}
