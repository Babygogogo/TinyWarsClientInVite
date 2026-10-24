import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesGridIndexAndWeight from "../../../auxiliaryTypes/GridIndexAndWeight.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsUnit from "../../../expressionParsers/contexts/Unit.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNullableUnit from "../../../expressionParsers/results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../../../expressionParsers/results/NumArray.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as LocationsConstants from "../../../locations/Constants.ts";
import * as LocationsUtils from "../../../locations/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedExpr from "../../../proto/schema/CommonProto/WarEvent/WeaFillUnitLoadedExpr.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarEventsActionsConstantsFillUnitLoadedExpr from "../constants/FillUnitLoadedExpr.ts";

type WeaFillUnitLoadedExpr  = ProtoSchemaCommonProtoWarEventWeaFillUnitLoadedExpr.WeaFillUnitLoadedExpr;
type IUnit                  = UnitsIUnit.IUnit;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaFillUnitLoadedExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActUnitType(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActUnitType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActActionState(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActActionState,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentHp(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActFlareCurrentAmmo(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActFlareCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentFuel(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentFuel,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsDiving(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActIsDiving,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentBuildMaterial(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentBuildMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentProduceMaterial(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentProduceMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentPromotion(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentPromotion,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsCoOnboard(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActIsCoOnboard,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAiMode(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActAiMode,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActGroupedTagId(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActGroupedTagId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAiWeightedDestination(),
            expressionInfo          : WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActAiWeightedDestination,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaFillUnitLoadedExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0049, data.getConUnitFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaFillUnitLoadedExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        `${LangUtils.getText(LangConstants.TextType.B0525)}: ${data.getActUnitType() ?? LangConstants.UndefinedError}`,
        data.getActActionState()                     ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActActionState.getTitleText()}: ${data.getActActionState()}`                                         : null,
        data.getActIsCoOnboard()                     ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActIsCoOnboard.getTitleText()}: ${data.getActIsCoOnboard()}`                                         : null,
        data.getActCurrentPromotion()                ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentPromotion.getTitleText()}: ${data.getActCurrentPromotion()}`                               : null,
        data.getActCurrentHp()                       ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                                             : null,
        data.getActCurrentFuel()                     ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentFuel.getTitleText()}: ${data.getActCurrentFuel()}`                                         : null,
        data.getActPrimaryWeaponCurrentAmmo()        ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText()}: ${data.getActPrimaryWeaponCurrentAmmo()}`               : null,
        data.getActFlareCurrentAmmo()                ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText()}: ${data.getActFlareCurrentAmmo()}`                               : null,
        data.getActCurrentBuildMaterial()            ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText()}: ${data.getActCurrentBuildMaterial()}`                       : null,
        data.getActCurrentProduceMaterial()          ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText()}: ${data.getActCurrentProduceMaterial()}`                   : null,
        data.getActIsDiving()                        ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActIsDiving.getTitleText()}: ${data.getActIsDiving()}`                                               : null,
        data.getActGroupedTagId()                    ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActGroupedTagId.getTitleText()}: ${data.getActGroupedTagId()}`                                       : null,
        data.getActForbiddenGroupedLocationIdArray() ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText()}: ${data.getActForbiddenGroupedLocationIdArray()}` : null,
        data.getActAiMode()                          ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActAiMode.getTitleText()}: ${data.getActAiMode()}`                                                   : null,
        data.getActAiWeightedDestination()           ? `${WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActAiWeightedDestination.getTitleText()}: ${data.getActAiWeightedDestination()}`                     : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0049, data.getConUnitFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaFillUnitLoadedExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActUnitType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActUnitType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActActionState;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActActionState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentHp;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActFlareCurrentAmmo;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActFlareCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentFuel;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentFuel(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActIsDiving;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsDiving(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentBuildMaterial;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentBuildMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentProduceMaterial;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentProduceMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActCurrentPromotion;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentPromotion(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActIsCoOnboard;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsCoOnboard(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActAiMode;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActAiMode(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActGroupedTagId;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActGroupedTagId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsFillUnitLoadedExpr.ExpressionInfoDict.ActAiWeightedDestination;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActAiWeightedDestination(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaFillUnitLoadedExpr, unit: IUnit): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
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
function evalActUnitType(action: WeaFillUnitLoadedExpr, unit: IUnit): number | null {
    const act = action.getActUnitType();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
function evalActActionState(action: WeaFillUnitLoadedExpr, unit: IUnit): number {
    const defaultValue  = UnitsConstants.ActionStateId.Idle;
    const act             = action.getActActionState();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const actionState = Math.floor(epResult.num);
            return (UnitsUtilsCommon.checkIsValidActionStateId(actionState)) ? actionState : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPrimaryWeaponCurrentAmmo(action: WeaFillUnitLoadedExpr, unit: IUnit, unitType: number): number {
    const defaultValue = unit.getGcData().getUnitTemplateCfg(unitType)?.getPrimaryWeaponMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActPrimaryWeaponCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentHp(action: WeaFillUnitLoadedExpr, unit: IUnit, unitType: number): number {
    const defaultValue = HelpersMisc.getExisted(unit.getGcData().getUnitTemplateCfg(unitType)?.getMaxHp());
    const act = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 1,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
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
function evalActIsDiving(action: WeaFillUnitLoadedExpr, unit: IUnit, unitType: number): boolean {
    const unitCfg = HelpersMisc.getExisted(unit.getGcData().getUnitTemplateCfg(unitType));
    if (unitCfg.getDiveCfg() == null) {
        return false;
    }

    const defaultValue    = !!unitCfg.getDiveCfg()?.getIsDivedByDefault();
    const act             = action.getActIsDiving();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActFlareCurrentAmmo(action: WeaFillUnitLoadedExpr, unit: IUnit, unitType: number): number {
    const defaultValue = unit.getGcData().getUnitTemplateCfg(unitType)?.getFlareMaxAmmo() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActFlareCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentFuel(action: WeaFillUnitLoadedExpr, unit: IUnit, unitType: number): number {
    const defaultValue = HelpersMisc.getExisted(unit.getGcData().getUnitTemplateCfg(unitType)?.getMaxFuel());
    const act = action.getActCurrentFuel();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentBuildMaterial(action: WeaFillUnitLoadedExpr, unit: IUnit, unitType: number): number {
    const defaultValue = unit.getGcData().getUnitTemplateCfg(unitType)?.getMaxBuildMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentBuildMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentProduceMaterial(action: WeaFillUnitLoadedExpr, unit: IUnit, unitType: number): number {
    const defaultValue = unit.getGcData().getUnitTemplateCfg(unitType)?.getMaxProduceMaterial() ?? 0;
    if (defaultValue <= 0) {
        return defaultValue;
    }

    const act = action.getActCurrentProduceMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentPromotion(action: WeaFillUnitLoadedExpr, unit: IUnit): number {
    const defaultValue    = unit.getGcData().getUnitMaxPromotion();
    const act             = action.getActCurrentPromotion();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : defaultValue,
                rawValue    : Math.floor(epResult.num),
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
function evalActIsCoOnboard(action: WeaFillUnitLoadedExpr, unit: IUnit): boolean {
    const defaultValue  = false;
    const act             = action.getActIsCoOnboard();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActAiMode(action: WeaFillUnitLoadedExpr, unit: IUnit): number {
    const defaultValue  = UnitsConstants.AiModeId.Normal;
    const act             = action.getActAiMode();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const aiMode = Math.floor(epResult.num);
            return (UnitsUtilsCommon.checkIsValidAiModeId(aiMode)) ? aiMode : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGroupedTagId(action: WeaFillUnitLoadedExpr, unit: IUnit): number {
    const defaultValue  = 0;
    const act             = action.getActGroupedTagId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            return UnitsUtilsCommon.getEncodedTagId(epResult.numberArray.map(v => NumbersUtils.getValueInRange({
                minValue    : UnitsConstants.TagId.MinTagId,
                maxValue    : UnitsConstants.TagId.MaxTagId,
                rawValue    : Math.floor(v),
            })));
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActForbiddenGroupedLocationIdArray(action: WeaFillUnitLoadedExpr, unit: IUnit): number[] {
    const act = action.getActForbiddenGroupedLocationIdArray();
    if (!act) {
        return [];
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            return LocationsUtils.encode(epResult.numberArray.map(v => NumbersUtils.getValueInRange({
                minValue    : LocationsConstants.MinId,
                maxValue    : LocationsConstants.MaxId,
                rawValue    : Math.floor(v),
            })));
        } else {
            return [];
        }
    } catch (Exception) {
        return [];
    }
}
function evalActAiWeightedDestination(action: WeaFillUnitLoadedExpr, unit: IUnit): AuxiliaryTypesGridIndexAndWeight.GridIndexAndWeight | null {
    const act = action.getActAiWeightedDestination();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            if (epResult.numberArray.length !== 3) {
                return null;
            }

            const arr       = epResult.numberArray.map(v => NumbersUtils.getValueInInt32(v));
            const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(arr[0], arr[1]);
            if (!gridIndex.checkIsInsideMap(unit.getWar().getTileMap().getMapSize())) {
                return null;
            }

            return new AuxiliaryTypesGridIndexAndWeight.GridIndexAndWeight(gridIndex, arr[2]);
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
export async function applyWithoutExtraData(action: WeaFillUnitLoadedExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const unitMap           = war.getUnitMap();
    const allUnits          = war.getUnitMap().getAllUnits().sort((v1, v2) => v1.getUnitId() - v2.getUnitId());
    let nextUnitId          = unitMap.getNextUnitId();
    const newUnitDataList   : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[] = [];
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
function createNewUnitData(action: WeaFillUnitLoadedExpr, loaderUnit: IUnit, unitId: number): ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit | null {
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

    return UnitsUtilsSerialization.create({
        unitType                        : unitType,
        unitId                          : unitId,
        playerIndex                     : loaderUnit.getPlayerIndex(),
        gridIndex                       : loaderUnit.getGridIndex().toProto().toJson(),

        actionState                     : actionState,
        currentHp                       : currentHp,
        aiMode                          : aiMode,
        groupedTagId                    : groupedTagId,
        customNameId                    : null,

        currentPromotion                : currentPromotion,
        isDiving                        : isDiving,
        isCoOnboard                     : isCoOnboard,
        currentBuildMaterial            : currentBuildMaterial,

        aiWeightedDestination           : aiWeightedDestination?.toJson() ?? null,
        forbiddenGroupedLocationIdArray : forbiddenGroupedLocationIdArray,
        buffArray                       : [],

        primaryWeaponCurrentAmmo        : primaryWeaponCurrentAmmo,
        flareCurrentAmmo                : flareCurrentAmmo,
        currentProduceMaterial          : currentProduceMaterial,
        currentFuel                     : currentFuel,
        loaderUnitId                    : loaderUnit.getUnitId(),
    });
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function applyNewUnitDataArray(unitDataArray: ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[], war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    const unitMap       = war.getUnitMap();
    const gameConfig    = war.getGcData();
    const unitArray     : IUnit[] = [];
    for (const unitData of unitDataArray) {
        const unit = new (GameHelpersGhFactory.getUnitClass())();
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
            const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: unit.getGridIndex() });
            if (observerTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                    unitType                    : unit.getUnitType(),
                    dstPlayerIndex              : unit.getPlayerIndex(),
                    unitGain                    : 1,
                    unitLoss                    : 0,
                    normalizedHpGain            : unit.getNormalizedCurrentHp(),
                    normalizedHpLoss            : 0,
                    groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                }));
            }
        }
    }
}
