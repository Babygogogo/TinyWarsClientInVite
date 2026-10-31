import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_GridIndexAndWeight,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Parser,
    ExpressionParsers_Contexts_Unit,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Units_Constants,
    Units_Utils_Common,
    Units_Utils_Serialization,
    Locations_Utils,
    Helpers_Team,
    WarEvents_Actions_Constants_FillUnitLoadedExpr,
    Helpers_Misc,
    Lang_Utils,
    Visibilities_Utils,
    Numbers_Utils,
    Locations_Constants,
    Lang_Constants,
    Units_Unit,
} from "../../../internal.ts";

import type { WeaFillUnitLoadedExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedExpr.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitLoadedExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConUnitFilter(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActUnitType(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActUnitType,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActActionState(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActActionState,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentHp(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActFlareCurrentAmmo(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActFlareCurrentAmmo,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentFuel(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentFuel,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsDiving(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActIsDiving,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentBuildMaterial(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentBuildMaterial,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentProduceMaterial(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentProduceMaterial,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentPromotion(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentPromotion,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsCoOnboard(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActIsCoOnboard,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActAiMode(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActAiMode,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActGroupedTagId(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActGroupedTagId,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActAiWeightedDestination(),
            expressionInfo       : WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActAiWeightedDestination,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitLoadedExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0049, data.getConUnitFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaFillUnitLoadedExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${Lang_Utils.getText(Lang_Constants.TextType.B0525)}: ${data.getActUnitType() ?? Lang_Constants.UndefinedError}`,
        data.getActActionState()                     ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActActionState.getTitleText()}: ${data.getActActionState()}`                                         : null,
        data.getActIsCoOnboard()                     ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActIsCoOnboard.getTitleText()}: ${data.getActIsCoOnboard()}`                                         : null,
        data.getActCurrentPromotion()                ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentPromotion.getTitleText()}: ${data.getActCurrentPromotion()}`                               : null,
        data.getActCurrentHp()                       ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                                             : null,
        data.getActCurrentFuel()                     ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentFuel.getTitleText()}: ${data.getActCurrentFuel()}`                                         : null,
        data.getActPrimaryWeaponCurrentAmmo()        ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText()}: ${data.getActPrimaryWeaponCurrentAmmo()}`               : null,
        data.getActFlareCurrentAmmo()                ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText()}: ${data.getActFlareCurrentAmmo()}`                               : null,
        data.getActCurrentBuildMaterial()            ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText()}: ${data.getActCurrentBuildMaterial()}`                       : null,
        data.getActCurrentProduceMaterial()          ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText()}: ${data.getActCurrentProduceMaterial()}`                   : null,
        data.getActIsDiving()                        ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActIsDiving.getTitleText()}: ${data.getActIsDiving()}`                                               : null,
        data.getActGroupedTagId()                    ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActGroupedTagId.getTitleText()}: ${data.getActGroupedTagId()}`                                       : null,
        data.getActForbiddenGroupedLocationIdArray() ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText()}: ${data.getActForbiddenGroupedLocationIdArray()}` : null,
        data.getActAiMode()                          ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActAiMode.getTitleText()}: ${data.getActAiMode()}`                                                   : null,
        data.getActAiWeightedDestination()           ? `${WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActAiWeightedDestination.getTitleText()}: ${data.getActAiWeightedDestination()}`                     : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0049, data.getConUnitFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaFillUnitLoadedExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getConUnitFilter(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActUnitType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActUnitType(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActActionState;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActActionState(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentHp;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCurrentHp(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActFlareCurrentAmmo;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActFlareCurrentAmmo(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentFuel;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCurrentFuel(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActIsDiving;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIsDiving(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentBuildMaterial;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCurrentBuildMaterial(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentProduceMaterial;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCurrentProduceMaterial(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActCurrentPromotion;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCurrentPromotion(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActIsCoOnboard;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIsCoOnboard(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActAiMode;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActAiMode(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActGroupedTagId;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActGroupedTagId(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActForbiddenGroupedLocationIdArray(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_FillUnitLoadedExpr.ExpressionInfoDict.ActAiWeightedDestination;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActAiWeightedDestination(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
// function evalActPlayerIndex(action: IWeaFillUnitLoaded, tile: BaseWar.IBwTile): number | null {
//     const act = action.actPlayerIndex;
//     if (!act) {
//         return null;
//     }

//     try {
//         const epResult = ExpressionParser.EpParser.getParseResult(act).eval(new ExpressionParser.EpContextUnit(new ExpressionParser.EpResultNullableUnit(unit.getWar(), unit)), false);
//         if (epResult instanceof ExpressionParser.EpResultNumber) {
//             const playerIndex = Math.floor(epResult.num);
//             return (playerIndex >= GameConfig.Player.PlayerIndex.Const.First) && (playerIndex <= tile.getWar().getPlayerManager().getTotalPlayersCount(false)) ? playerIndex : null;
//         } else {
//             return null;
//         }
//     } catch (Exception) {
//         return null;
//     }
// }
function evalActUnitType(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit): number | null {
    const act = action.getActUnitType();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const unitType          = Math.floor(epResult.num);
            const loadUnitCategory  = unit.getLoadUnitCategoryId();
            return (loadUnitCategory != null) && (unit.getGcData().checkIsUnitTypeInCategory(unitType, loadUnitCategory)) ? unitType : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
function evalActActionState(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = Units_Constants.ActionStateId.Idle;
    const act             = action.getActActionState();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const actionState = Math.floor(epResult.num);
            return (Units_Utils_Common.checkIsValidActionStateId(actionState)) ? actionState : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPrimaryWeaponCurrentAmmo(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit, unitType: number): number {
    const defaultValue = unit.getGcData().getUnitTemplateCfg(unitType)?.getPrimaryWeaponMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActPrimaryWeaponCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : defaultValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentHp(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit, unitType: number): number {
    const defaultValue = Helpers_Misc.getExisted(unit.getGcData().getUnitTemplateCfg(unitType)?.getMaxHp());
    const act = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 1,
                maxValue : defaultValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
// function evalActIsCapturingTile(action: IWeaFillUnitLoaded, tile: BaseWar.IBwTile, unitType: number): boolean {
//     if (!tile.getGameConfig().getUnitTemplateCfg(unitType)?.canCaptureTile) {
//         return false;
//     }

//     const defaultValue  = false;
//     const act             = action.actIsCapturingTile;
//     if (!act) {
//         return defaultValue;
//     }

//     try {
//         const epResult = ExpressionParser.EpParser.getParseResult(act).eval(new ExpressionParser.EpContextUnit(new ExpressionParser.EpResultNullableUnit(unit.getWar(), unit)), false);
//         if (epResult instanceof ExpressionParser.EpResultNumber) {
//             return epResult.num !== 0;
//         } else {
//             return defaultValue;
//         }
//     } catch (Exception) {
//         return defaultValue;
//     }
// }
function evalActIsDiving(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit, unitType: number): boolean {
    const unitCfg = Helpers_Misc.getExisted(unit.getGcData().getUnitTemplateCfg(unitType));
    if (unitCfg.getDiveCfg() == null) {
        return false;
    }

    const defaultValue    = !!unitCfg.getDiveCfg()?.getIsDivedByDefault();
    const act             = action.getActIsDiving();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActFlareCurrentAmmo(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit, unitType: number): number {
    const defaultValue = unit.getGcData().getUnitTemplateCfg(unitType)?.getFlareMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActFlareCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : defaultValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentFuel(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit, unitType: number): number {
    const defaultValue = Helpers_Misc.getExisted(unit.getGcData().getUnitTemplateCfg(unitType)?.getMaxFuel());
    const act = action.getActCurrentFuel();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : defaultValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentBuildMaterial(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit, unitType: number): number {
    const defaultValue = unit.getGcData().getUnitTemplateCfg(unitType)?.getMaxBuildMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentBuildMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : defaultValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentProduceMaterial(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit, unitType: number): number {
    const defaultValue = unit.getGcData().getUnitTemplateCfg(unitType)?.getMaxProduceMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentProduceMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : defaultValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentPromotion(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit): number {
    const defaultValue    = unit.getGcData().getUnitMaxPromotion();
    const act             = action.getActCurrentPromotion();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : defaultValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
// function evalActIsBuildingTile(action: IWeaFillUnitLoaded, tile: BaseWar.IBwTile, unitType: number): boolean {
//     const maxBuildMaterial = tile.getGameConfig().getUnitTemplateCfg(unitType)?.maxBuildMaterial;
//     if ((maxBuildMaterial == null) || (maxBuildMaterial <= 0)) {
//         return false;
//     }

//     const defaultValue  = false;
//     const act             = action.actIsBuildingTile;
//     if (!act) {
//         return defaultValue;
//     }

//     try {
//         const epResult = ExpressionParser.EpParser.getParseResult(act).eval(new ExpressionParser.EpContextUnit(new ExpressionParser.EpResultNullableUnit(unit.getWar(), unit)), false);
//         if (epResult instanceof ExpressionParser.EpResultNumber) {
//             return epResult.num !== 0;
//         } else {
//             return defaultValue;
//         }
//     } catch (Exception) {
//         return defaultValue;
//     }
// }
function evalActIsCoOnboard(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit): boolean {
    const defaultValue  = false;
    const act             = action.getActIsCoOnboard();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActAiMode(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = Units_Constants.AiModeId.Normal;
    const act             = action.getActAiMode();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const aiMode = Math.floor(epResult.num);
            return (Units_Utils_Common.checkIsValidAiModeId(aiMode)) ? aiMode : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGroupedTagId(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = 0;
    const act             = action.getActGroupedTagId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            return Units_Utils_Common.getEncodedTagId(epResult.numberArray.map(v => Numbers_Utils.getValueInRange({
                minValue : Units_Constants.TagId.MinTagId,
                maxValue : Units_Constants.TagId.MaxTagId,
                rawValue : Math.floor(v),
            })));
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActForbiddenGroupedLocationIdArray(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit): number[] {
    const act = action.getActForbiddenGroupedLocationIdArray();
    if (!act) {
        return [];
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            return Locations_Utils.encode(epResult.numberArray.map(v => Numbers_Utils.getValueInRange({
                minValue : Locations_Constants.MinId,
                maxValue : Locations_Constants.MaxId,
                rawValue : Math.floor(v),
            })));
        } else {
            return [];
        }
    } catch (Exception) {
        return [];
    }
}
function evalActAiWeightedDestination(action: WeaFillUnitLoadedExpr, unit: Units_Unit.Unit): AuxiliaryTypes_GridIndexAndWeight.GridIndexAndWeight | null {
    const act = action.getActAiWeightedDestination();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            if (epResult.numberArray.length !== 3) {
                return null;
            }

            const arr       = epResult.numberArray.map(v => Numbers_Utils.getValueInInt32(v));
            const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(arr[0], arr[1]);
            if (!gridIndex.checkIsInsideMap(unit.getWar().getTileMap().getMapSize())) {
                return null;
            }

            return new AuxiliaryTypes_GridIndexAndWeight.GridIndexAndWeight(gridIndex, arr[2]);
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaFillUnitLoadedExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaFillUnitLoadedExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const allUnits          = war.getUnitMap().getAllUnits().sort((v1, v2) => v1.getUnitId() - v2.getUnitId());
    let nextUnitId          = unitMap.getNextUnitId();
    const newUnitDataList   : SerialUnit[] = [];
    for (const unit of allUnits) {
        const maxLoadUnitsCount = unit.getMaxLoadUnitsCount();
        if ((maxLoadUnitsCount == null)                         ||
            (maxLoadUnitsCount <= 0)                            ||
            (unit.getLoadUnitCategoryId() == null)                ||
            (unit.getLoadedUnitsCount() >= maxLoadUnitsCount)   ||
            (!checkIsMeetConditionForUnit(action, unit))
        ) {
            continue;
        }

        const newUnitData = createNewUnitData(action, unit, nextUnitId);
        if (newUnitData == null) {
            continue;
        }

        newUnitDataList.push(newUnitData);
        ++nextUnitId;
    }

    unitMap.setNextUnitId(nextUnitId);
    applyNewUnitDataArray(newUnitDataList, war, isFast);
}
function createNewUnitData(action: WeaFillUnitLoadedExpr, loaderUnit: Units_Unit.Unit, unitId: number): SerialUnit | null {
    const unitType = evalActUnitType(action, loaderUnit);
    if (unitType == null) {
        return null;
    }

    // 为防止随机数导致结果不稳定，此处eval系列函数的顺序一旦写下就不能更改，后续新属性只能添加在最后
    // 必须保证函数顺序前后端相同
    const actionState                       = evalActActionState(action, loaderUnit);
    const currentHp                         = evalActCurrentHp(action, loaderUnit, unitType);
    const aiMode                            = evalActAiMode(action, loaderUnit);
    const groupedTagId                      = evalActGroupedTagId(action, loaderUnit);
    const currentPromotion                  = evalActCurrentPromotion(action, loaderUnit);
    const isDiving                          = evalActIsDiving(action, loaderUnit, unitType);
    const isCoOnboard                       = evalActIsCoOnboard(action, loaderUnit);
    const currentBuildMaterial              = evalActCurrentBuildMaterial(action, loaderUnit, unitType);
    const aiWeightedDestination             = evalActAiWeightedDestination(action, loaderUnit)?.toProto();
    const forbiddenGroupedLocationIdArray   = evalActForbiddenGroupedLocationIdArray(action, loaderUnit);
    const primaryWeaponCurrentAmmo          = evalActPrimaryWeaponCurrentAmmo(action, loaderUnit, unitType);
    const flareCurrentAmmo                  = evalActFlareCurrentAmmo(action, loaderUnit, unitType);
    const currentProduceMaterial            = evalActCurrentProduceMaterial(action, loaderUnit, unitType);
    const currentFuel                       = evalActCurrentFuel(action, loaderUnit, unitType);

    return Units_Utils_Serialization.create({
        unitType    : unitType,
        unitId      : unitId,
        playerIndex : loaderUnit.getPlayerIndex(),
        gridIndex   : loaderUnit.getGridIndex().toProto().toJson(),

        actionState  : actionState,
        currentHp    : currentHp,
        aiMode       : aiMode,
        groupedTagId : groupedTagId,
        customNameId : null,

        currentPromotion     : currentPromotion,
        isDiving             : isDiving,
        isCoOnboard          : isCoOnboard,
        currentBuildMaterial : currentBuildMaterial,

        aiWeightedDestination           : aiWeightedDestination?.toJson() ?? null,
        forbiddenGroupedLocationIdArray : forbiddenGroupedLocationIdArray,
        buffArray                       : [],

        primaryWeaponCurrentAmmo : primaryWeaponCurrentAmmo,
        flareCurrentAmmo         : flareCurrentAmmo,
        currentProduceMaterial   : currentProduceMaterial,
        currentFuel              : currentFuel,
        loaderUnitId             : loaderUnit.getUnitId(),
    });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function applyNewUnitDataArray(unitDataArray: SerialUnit[], war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    const unitMap       = war.getUnitMap();
    const gameConfig    = war.getGcData();
    const unitArray     : Units_Unit.Unit[] = [];
    for (const unitData of unitDataArray) {
        const unit = new Units_Unit.Unit();
        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        // unit.startRunningView();
        unitMap.setUnitLoaded(unit);
        // (!isFast) && (unit.updateView());

        unitArray.push(unit);
    }

    {
        const warStatisticsManager = war.getWarStatisticsManager();
        for (const unit of unitArray) {
            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex : unit.getGridIndex() });
            if (observerTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : unit.getUnitType(),
                    dstPlayerIndex             : unit.getPlayerIndex(),
                    unitGain                   : 1,
                    unitLoss                   : 0,
                    normalizedHpGain           : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss           : 0,
                    groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                }));
            }
        }
    }
}
