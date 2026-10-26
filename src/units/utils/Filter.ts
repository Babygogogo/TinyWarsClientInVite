import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import {
    checkIsMeet as GridIndexArrayAndPredicatesUtilsCheckIsMeet,
    getDesc as GridIndexArrayAndPredicatesUtilsGetDesc,
    checkIsValid as GridIndexArrayAndPredicatesUtilsCheckIsValid,
} from "../../gridIndexArrayAndPredicates/Utils.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getPlayerTeamName,
    getUnitName,
    getUnitActionStateText,
    getFormattedText,
    getTextForYesOrNo,
    getUnitAiModeName,
    getUnitBuffName,
} from "../../lang/Utils.ts";
import { checkIsValidLocationIdSubset } from "../../locations/Utils.ts";
import { checkIsValidPlayerIndexSubset } from "../../players/utils/Common.ts";
import type { UnitFilter } from "../../proto/schema/CommonProto/Structure/UnitFilter.ts";
import { checkIsValidTeamIndexSubset } from "../../teams/Utils.ts";
import { checkIsValidTypeIdSubset } from "../../unitBuffs/utils/Common.ts";
import type { IUnit } from "../IUnit.ts";
import { checkIsValidActionStateIdSubset, checkIsValidTagIdSubset, checkIsValidAiModeIdSubset } from "./Common.ts";
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

export function checkIsValid(data: UnitFilter, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): boolean {
    return getErrorTip(data, playersCountUnneutral, mapSize, gameConfig) == null;
}

export function checkIsMeet(data: UnitFilter, unit: IUnit): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, unit.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, unit.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConUnitType();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, unit.getUnitType()))) {
            return false;
        }
    }

    {
        const con = data.getConActionState();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, unit.getActionState()))) {
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
        if ((con != null) && (!ValueAndComparatorsUtilsCheckIsMeet(con, unit.getCurrentHp()))) {
            return false;
        }
    }

    {
        const con = data.getConFuel();
        if ((con != null) && (!ValueAndComparatorsUtilsCheckIsMeet(con, unit.getCurrentFuel()))) {
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
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, ammo)) {
                return false;
            }
        }
    }

    {
        const con = data.getConPromotion();
        if ((con != null) && (!ValueAndComparatorsUtilsCheckIsMeet(con, unit.getCurrentPromotion()))) {
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
        if ((con != null) && (!ValueSetAndRelationsUtilsCheckIsMeet(con, unit.getTagIdArray(true)))) {
            return false;
        }
    }

    {
        const con = data.getConLoadedUnitsCount();
        if ((con != null) && (!ValueAndComparatorsUtilsCheckIsMeet(con, unit.getLoadedUnitsCount()))) {
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
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, ammo)) {
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
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, material)) {
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
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, material)) {
                return false;
            }
        }
    }

    {
        const con = data.getConForbiddenLocationId();
        if ((con != null) && (!ValueSetAndRelationsUtilsCheckIsMeet(con, unit.getForbiddenLocationIdArray() ?? []))) {
            return false;
        }
    }

    {
        const con = data.getConAiMode();
        if ((con != null) && (!ValueArrayAndPredicatesUtilsCheckIsMeet(con, unit.getAiMode()))) {
            return false;
        }
    }

    {
        const con = data.getConGridIndex();
        if ((con != null) && (!GridIndexArrayAndPredicatesUtilsCheckIsMeet(con, unit.getGridIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConLocationId();
        if ((con != null)                                                                                                               &&
            (!ValueSetAndRelationsUtilsCheckIsMeet(con, unit.getWar().getTileMap().getTile(unit.getGridIndex()).getLocationIdList(true)))
        ) {
            return false;
        }
    }

    {
        const con = data.getConCustomNameId();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsMeet(con, unit.getCustomNameId() ?? 0)) {
                return false;
            }
        }
    }

    {
        const con = data.getConBuffTypeId();
        if ((con != null)                                                                                       &&
            (!ValueSetAndRelationsUtilsCheckIsMeet(con, unit.getBuffList()?.map(v => v.getBuffTypeId()) ?? []))
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

export function getDesc(data: UnitFilter, gameConfig: GcData): string {
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
        const con = data.getConUnitType();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtilsGetDesc(con, getText(TextType.B0525), v => getUnitName(v, gameConfig)));
        }
    }
    {
        const con = data.getConActionState();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtilsGetDesc(con, getText(TextType.ActionState), v => getUnitActionStateText(v)));
        }
    }
    {
        const con = data.getConIsCoOnboard();
        if (con != null) {
            textArrayForSubConditions.push(getFormattedText(TextType.F0234, getTextForYesOrNo(con)));
        }
    }
    {
        const con = data.getConHp();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.B0934)));
        }
    }
    {
        const con = data.getConFuel();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.Fuel)));
        }
    }
    {
        const con = data.getConPriAmmo();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.PrimaryWeaponAmmo)));
        }
    }
    {
        const con = data.getConPromotion();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.Promotion)));
        }
    }
    {
        const con = data.getConIsOwnerPlayerInTurn();
        if (con != null) {
            textArrayForSubConditions.push(getText(con ? TextType.A0831 : TextType.A0832));
        }
    }
    {
        const con = data.getConIsDiving();
        if (con != null) {
            textArrayForSubConditions.push(getFormattedText(TextType.F0235, getTextForYesOrNo(con)));
        }
    }
    {
        const con = data.getConTagId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtilsGetDesc(con, getText(TextType.Tags), v => `${v}`));
        }
    }
    {
        const con = data.getConLoadedUnitsCount();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.B0698)));
        }
    }
    {
        const con = data.getConIsLoaded();
        if (con != null) {
            textArrayForSubConditions.push(getFormattedText(TextType.F0236, getTextForYesOrNo(con)));
        }
    }
    {
        const con = data.getConFlareAmmo();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.FlareAmmo)));
        }
    }
    {
        const con = data.getConBuildMaterial();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.BuildMaterial)));
        }
    }
    {
        const con = data.getConProduceMaterial();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.ProductionMaterial)));
        }
    }
    {
        const con = data.getConForbiddenLocationId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtilsGetDesc(con, getText(TextType.NoEntryLocations), v => `${v}`));
        }
    }
    {
        const con = data.getConAiMode();
        if (con != null) {
            textArrayForSubConditions.push(ValueArrayAndPredicatesUtilsGetDesc(con, getText(TextType.AiMode), v => getUnitAiModeName(v)));
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
        const con = data.getConCustomNameId();
        if (con != null) {
            textArrayForSubConditions.push(ValueAndComparatorsUtilsGetDesc(con, getText(TextType.CustomNameId)));
        }
    }
    {
        const con = data.getConBuffTypeId();
        if (con != null) {
            textArrayForSubConditions.push(ValueSetAndRelationsUtilsGetDesc(con, getText(TextType.AbnormalStateTypeId), v => getUnitBuffName(v)));
        }
    }

    if (!textArrayForSubConditions.length) {
        textArrayForSubConditions.push(getText(TextType.A0944));
    }

    return getFormattedText(
        TextType.F0230,
        getText(TextType.B1058),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : getText(TextType.A0944)
    );
}
export function getDescForEmbed(data: UnitFilter): string | null {
    const textArrayForSubConditions = getNonNullElements([
        data.getConPlayerIndex() == null         ? null : getText(TextType.PlayerIndex),
        data.getConTeamIndex() == null           ? null : getText(TextType.B0019),
        data.getConUnitType() == null            ? null : getText(TextType.B0525),
        data.getConActionState() == null         ? null : getText(TextType.ActionState),
        data.getConIsCoOnboard() == null         ? null : getText(TextType.CoOnboard),
        data.getConHp() == null                  ? null : getText(TextType.B0934),
        data.getConFuel() == null                ? null : getText(TextType.Fuel),
        data.getConPriAmmo() == null             ? null : getText(TextType.PrimaryWeaponAmmo),
        data.getConPromotion() == null           ? null : getText(TextType.Promotion),
        data.getConIsOwnerPlayerInTurn() == null ? null : getText(TextType.B0086),
        data.getConIsDiving() == null            ? null : getText(TextType.B0371),
        data.getConTagId() == null               ? null : getText(TextType.Tags),
        data.getConLoadedUnitsCount() == null    ? null : getText(TextType.B0698),
        data.getConIsLoaded() == null            ? null : getText(TextType.B1056),
        data.getConFlareAmmo() == null           ? null : getText(TextType.FlareAmmo),
        data.getConBuildMaterial() == null       ? null : getText(TextType.BuildMaterial),
        data.getConProduceMaterial() == null     ? null : getText(TextType.ProductionMaterial),
        data.getConForbiddenLocationId() == null ? null : getText(TextType.NoEntryLocations),
        data.getConAiMode() == null              ? null : getText(TextType.AiMode),
        data.getConGridIndex() == null           ? null : getText(TextType.B0531),
        data.getConLocationId() == null          ? null : getText(TextType.Location),
        data.getConCustomNameId() == null        ? null : getText(TextType.CustomNameId),
        data.getConBuffTypeId() == null          ? null : getText(TextType.AbnormalStateTypeId),
    ]);
    return !textArrayForSubConditions.length
        ? null
        : getFormattedText(
            TextType.F0231,
            getText(TextType.B1058),
            textArrayForSubConditions.join(`, `)
        );
}

export function getErrorTip(data: UnitFilter, playersCountUnneutral: number, mapSize: MapSize, gameConfig: GcData): string | null {
    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtilsCheckIsValid(con))                                               ||
                (!checkIsValidPlayerIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.PlayerIndex));
            }
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtilsCheckIsValid(con))                                                   ||
                (!checkIsValidTeamIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.B0019));
            }
        }
    }

    {
        const con = data.getConUnitType();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtilsCheckIsValid(con))                   ||
                (!gameConfig.checkIsValidUnitTypeSubset(con.getValueArray()))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.B0525));
            }
        }
    }

    {
        const con = data.getConActionState();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtilsCheckIsValid(con))                               ||
                (!checkIsValidActionStateIdSubset(con.getValueArray()))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.ActionState));
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
            if (!ValueAndComparatorsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.B0934));
            }
        }
    }

    {
        const con = data.getConFuel();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.Fuel));
            }
        }
    }

    {
        const con = data.getConPriAmmo();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.PrimaryWeaponAmmo));
            }
        }
    }

    {
        const con = data.getConPromotion();
        if (con != null) {
            if (!ValueAndComparatorsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.Promotion));
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
            if (!ValueSetAndRelationsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.Tags));
            }
            if (!checkIsValidTagIdSubset(con.getValueArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.Tags));
            }
        }
    }

    {
        const con = data.getConLoadedUnitsCount();
        if ((con != null) && (!ValueAndComparatorsUtilsCheckIsValid(con))) {
            return getFormattedText(TextType.F0091, getText(TextType.B0698));
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsLoaded();
    }

    {
        const con = data.getConFlareAmmo();
        if ((con != null) && (!ValueAndComparatorsUtilsCheckIsValid(con))) {
            return getFormattedText(TextType.F0091, getText(TextType.FlareAmmo));
        }
    }

    {
        const con = data.getConBuildMaterial();
        if ((con != null) && (!ValueAndComparatorsUtilsCheckIsValid(con))) {
            return getFormattedText(TextType.F0091, getText(TextType.BuildMaterial));
        }
    }

    {
        const con = data.getConProduceMaterial();
        if ((con != null) && (!ValueAndComparatorsUtilsCheckIsValid(con))) {
            return getFormattedText(TextType.F0091, getText(TextType.ProductionMaterial));
        }
    }

    {
        const con = data.getConForbiddenLocationId();
        if (con != null) {
            if (!ValueSetAndRelationsUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.NoEntryLocations));
            }
            if (!checkIsValidLocationIdSubset(con.getValueArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.NoEntryLocations));
            }
        }
    }

    {
        const con = data.getConAiMode();
        if (con != null) {
            if (!ValueArrayAndPredicatesUtilsCheckIsValid(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.AiMode));
            }
            if (!checkIsValidAiModeIdSubset(con.getValueArray())) {
                return getFormattedText(TextType.F0091, getText(TextType.AiMode));
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
        const con = data.getConCustomNameId();
        if ((con != null) && (!ValueAndComparatorsUtilsCheckIsValid(con))) {
            return getFormattedText(TextType.F0091, getText(TextType.CustomNameId));
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
