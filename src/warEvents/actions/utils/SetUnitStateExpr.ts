import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesGridIndexAndWeight from "../../../auxiliaryTypes/GridIndexAndWeight.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsUnit from "../../../expressionParsers/contexts/Unit.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNullableUnit from "../../../expressionParsers/results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../../../expressionParsers/results/NumArray.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as LocationsConstants from "../../../locations/Constants.ts";
import * as LocationsUtils from "../../../locations/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetUnitStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateExpr.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../../units/utils/Common.ts";
import * as UnitsUtilsCustomName from "../../../units/utils/CustomName.ts";
import * as UnitsUtilsSerialization from "../../../units/utils/Serialization.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarEventsActionsConstantsSetUnitStateExpr from "../constants/SetUnitStateExpr.ts";

type WeaSetUnitStateExpr    = ProtoSchemaCommonProtoWarEventWeaSetUnitStateExpr.WeaSetUnitStateExpr;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type IUnit                  = UnitsIUnit.IUnit;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActActionState(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActActionState,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentHp(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActFlareCurrentAmmo(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActFlareCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentFuel(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentFuel,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsCapturingTile(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsCapturingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsDiving(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsDiving,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentBuildMaterial(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentBuildMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentProduceMaterial(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentProduceMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentPromotion(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentPromotion,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsBuildingTile(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsBuildingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsCoOnboard(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsCoOnboard,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAiMode(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActAiMode,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCustomNameId(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCustomNameId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActGroupedTagId(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActGroupedTagId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAiWeightedDestination(),
            expressionInfo          : WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActAiWeightedDestination,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0053, data.getConUnitFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActActionState()                     ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActActionState.getTitleText()}: ${data.getActActionState()}`                                         : null,
        data.getActIsCoOnboard()                     ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsCoOnboard.getTitleText()}: ${data.getActIsCoOnboard()}`                                         : null,
        data.getActCurrentPromotion()                ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentPromotion.getTitleText()}: ${data.getActCurrentPromotion()}`                               : null,
        data.getActCurrentHp()                       ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                                             : null,
        data.getActPrimaryWeaponCurrentAmmo()        ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText()}: ${data.getActPrimaryWeaponCurrentAmmo()}`               : null,
        data.getActFlareCurrentAmmo()                ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText()}: ${data.getActFlareCurrentAmmo()}`                               : null,
        data.getActCurrentFuel()                     ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentFuel.getTitleText()}: ${data.getActCurrentFuel()}`                                         : null,
        data.getActCurrentBuildMaterial()            ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText()}: ${data.getActCurrentBuildMaterial()}`                       : null,
        data.getActCurrentProduceMaterial()          ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText()}: ${data.getActCurrentProduceMaterial()}`                   : null,
        data.getActIsDiving()                        ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsDiving.getTitleText()}: ${data.getActIsDiving()}`                                               : null,
        data.getActIsBuildingTile()                  ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsBuildingTile.getTitleText()}: ${data.getActIsBuildingTile()}`                                   : null,
        data.getActIsCapturingTile()                 ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsCapturingTile.getTitleText()}: ${data.getActIsCapturingTile()}`                                 : null,
        data.getActGroupedTagId()                    ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActGroupedTagId.getTitleText()}: ${data.getActGroupedTagId()}`                                       : null,
        data.getActForbiddenGroupedLocationIdArray() ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText()}: ${data.getActForbiddenGroupedLocationIdArray()}` : null,
        data.getActAiMode()                          ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActAiMode.getTitleText()}: ${data.getActAiMode()}`                                                   : null,
        data.getActCustomNameId()                    ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCustomNameId.getTitleText()}: ${data.getActCustomNameId()}`                                       : null,
        data.getActAiWeightedDestination()           ? `${WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActAiWeightedDestination.getTitleText()}: ${data.getActAiWeightedDestination()}`                     : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0053, data.getConUnitFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ConUnitFilter;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActActionState;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentHp;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActFlareCurrentAmmo;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentFuel;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsCapturingTile;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsCapturingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsDiving;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentBuildMaterial;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentProduceMaterial;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCurrentPromotion;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsBuildingTile;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsBuildingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActIsCoOnboard;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActAiMode;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActCustomNameId;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCustomNameId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActGroupedTagId;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray;
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
        const info      = WarEventsActionsConstantsSetUnitStateExpr.ExpressionInfoDict.ActAiWeightedDestination;
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

function checkIsMeetConditionForUnit(action: WeaSetUnitStateExpr, unit: IUnit): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
// function evalActPlayerIndex(action: IWeaSetUnitState, tile: BaseWar.IBwTile): number | null {
//     const act = action.actPlayerIndex;
//     if (!act) {
//         return null;
//     }

//     try {
//         const epResult = ExpressionParser.EpParser.getParseResult(act).eval(new ExpressionParser.EpContextTile(tile), false);
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
// function evalActUnitType(action: IWeaSetUnitState, tile: BaseWar.IBwTile): number | null {
//     const act = action.actUnitType;
//     if (!act) {
//         return null;
//     }

//     try {
//         const epResult = ExpressionParser.EpParser.getParseResult(act).eval(new ExpressionParser.EpContextTile(tile), false);
//         if (epResult instanceof ExpressionParser.EpResultNumber) {
//             const unitType = Math.floor(epResult.num);
//             return (tile.getGameConfig().checkIsValidUnitType(unitType)) ? unitType : null;
//         } else {
//             return null;
//         }
//     } catch (Exception) {
//         return null;
//     }
// }
function evalActActionState(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue  = unit.getActionState();
    const act           = action.getActActionState();
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
function evalActPrimaryWeaponCurrentAmmo(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue  = unit.getPrimaryWeaponCurrentAmmo();
    const act           = action.getActPrimaryWeaponCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getPrimaryWeaponMaxAmmo() ?? 0,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentHp(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue  = unit.getCurrentHp();
    const act           = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 1,
                maxValue    : unit.getMaxHp(),
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
// function evalActIsCapturingTile(action: IWeaSetUnitState, unit: IUnit): boolean {
//     if (!unit.checkIsCapturer()) {
//         return false;
//     }

//     const defaultValue  = unit.getIsCapturingTile();
//     const act           = action.actIsCapturingTile;
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
function evalActIsDiving(action: WeaSetUnitStateExpr, unit: IUnit): boolean {
    if (!unit.checkIsDiver()) {
        return false;
    }

    const defaultValue    = unit.getIsDiving();
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
function evalActFlareCurrentAmmo(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue  = unit.getFlareCurrentAmmo();
    const act           = action.getActFlareCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getFlareMaxAmmo() ?? 0,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentFuel(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue  = unit.getCurrentFuel();
    const act           = action.getActCurrentFuel();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxFuel(),
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentBuildMaterial(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue  = unit.getCurrentBuildMaterial();
    const act           = action.getActCurrentBuildMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxBuildMaterial() ?? 0,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentProduceMaterial(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue  = unit.getCurrentProduceMaterial();
    const act           = action.getActCurrentProduceMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxProduceMaterial() ?? 0,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentPromotion(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue    = unit.getCurrentPromotion();
    const act             = action.getActCurrentPromotion();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : 0,
                maxValue    : unit.getMaxPromotion(),
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
// function evalActIsBuildingTile(action: IWeaSetUnitState, unit: IUnit): boolean {
//     const maxBuildMaterial = unit.getMaxBuildMaterial();
//     if ((maxBuildMaterial == null) || (maxBuildMaterial <= 0)) {
//         return false;
//     }

//     const defaultValue  = unit.getIsBuildingTile();
//     const act           = action.actIsBuildingTile;
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
function evalActIsCoOnboard(action: WeaSetUnitStateExpr, unit: IUnit): boolean {
    const defaultValue  = unit.getIsCoOnboard();
    const act           = action.getActIsCoOnboard();
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
function evalActAiMode(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue  = unit.getAiMode();
    const act           = action.getActAiMode();
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
function evalActCustomNameId(action: WeaSetUnitStateExpr, unit: IUnit): Undefinable<number> {
    const defaultValue  = unit.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const value = NumbersUtils.getValueInInt32(epResult.num);
            return UnitsUtilsCustomName.checkIsValidCustomNameId(value)
                ? value
                : (value < 0 ? null : defaultValue);
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGroupedTagId(action: WeaSetUnitStateExpr, unit: IUnit): number {
    const defaultValue  = unit.getGroupedTagId();
    const act           = action.getActGroupedTagId();
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
function evalActForbiddenGroupedLocationIdArray(action: WeaSetUnitStateExpr, unit: IUnit): number[] {
    const defaultValue  = unit.getForbiddenGroupedLocationIdArray();
    const act           = action.getActForbiddenGroupedLocationIdArray();
    if (!act) {
        return defaultValue;
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
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActAiWeightedDestination(action: WeaSetUnitStateExpr, unit: IUnit): Undefinable<AuxiliaryTypesGridIndexAndWeight.GridIndexAndWeight> {
    const defaultValue  = unit.getAiWeightedDestination();
    const act           = action.getActAiWeightedDestination();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            if (epResult.numberArray.length !== 3) {
                return defaultValue;
            }

            const arr       = epResult.numberArray.map(v => NumbersUtils.getValueInInt32(v));
            const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(arr[0], arr[1]);
            if (!gridIndex.checkIsInsideMap(unit.getWar().getTileMap().getMapSize())) {
                return defaultValue;
            }

            return new AuxiliaryTypesGridIndexAndWeight.GridIndexAndWeight(gridIndex, arr[2]);
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetUnitStateExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const newUnitDataDict = new Map<IUnit, ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit>();
    for (const unit of war.getUnitMap().getAllUnits().sort((v1, v2) => v1.getUnitId() - v2.getUnitId())) {
        if (!checkIsMeetConditionForUnit(action, unit)) {
            continue;
        }

        const newUnitData = createNewUnitData(action, unit);
        if (newUnitData == null) {
            continue;
        }

        newUnitDataDict.set(unit, newUnitData);
    }

    applyNewUnitDataDict(newUnitDataDict, war, isFast);
}
function createNewUnitData(action: WeaSetUnitStateExpr, unit: IUnit): ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit {
    // 为防止随机数导致结果不稳定，此处eval系列函数的顺序一旦写下就不能更改，后续新属性只能添加在最后
    // 必须保证函数顺序前后端相同
    const actionState                       = evalActActionState(action, unit);
    const currentHp                         = evalActCurrentHp(action, unit);
    const aiMode                            = evalActAiMode(action, unit);
    const groupedTagId                      = evalActGroupedTagId(action, unit);
    const customNameId                      = evalActCustomNameId(action, unit);
    const currentPromotion                  = evalActCurrentPromotion(action, unit);
    const isDiving                          = evalActIsDiving(action, unit);
    const isCoOnboard                       = evalActIsCoOnboard(action, unit);
    const currentBuildMaterial              = evalActCurrentBuildMaterial(action, unit);
    const aiWeightedDestination             = evalActAiWeightedDestination(action, unit)?.toProto();
    const forbiddenGroupedLocationIdArray   = evalActForbiddenGroupedLocationIdArray(action, unit);
    const primaryWeaponCurrentAmmo          = evalActPrimaryWeaponCurrentAmmo(action, unit);
    const flareCurrentAmmo                  = evalActFlareCurrentAmmo(action, unit);
    const currentProduceMaterial            = evalActCurrentProduceMaterial(action, unit);
    const currentFuel                       = evalActCurrentFuel(action, unit);

    return UnitsUtilsSerialization.create({
        unitType                        : unit.getUnitType(),
        unitId                          : unit.getUnitId(),
        playerIndex                     : unit.getPlayerIndex(),
        gridIndex                       : unit.getGridIndex().toProto().toJson(),

        actionState                     : actionState,
        currentHp                       : currentHp,
        aiMode                          : aiMode,
        groupedTagId                    : groupedTagId,
        customNameId                    : customNameId ?? null,

        currentPromotion                : currentPromotion,
        isDiving                        : isDiving,
        isCoOnboard                     : isCoOnboard,
        currentBuildMaterial            : currentBuildMaterial,

        aiWeightedDestination           : aiWeightedDestination?.toJson() ?? null,
        forbiddenGroupedLocationIdArray : forbiddenGroupedLocationIdArray ?? [],
        buffArray                       : unit.getBuffList().map(buff => buff.toJson()),

        primaryWeaponCurrentAmmo        : primaryWeaponCurrentAmmo,
        flareCurrentAmmo                : flareCurrentAmmo,
        currentProduceMaterial          : currentProduceMaterial,
        currentFuel                     : currentFuel,
        loaderUnitId                    : unit.getLoaderUnitId() ?? null,
    });
}
function applyNewUnitDataDict(dict: Map<IUnit, ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit>, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    const unitMap                   = war.getUnitMap();
    const mapSize                   = unitMap.getMapSize();
    const observerTeamIndexesDict   = new Map<number, number[] | null>();
    for (const [unit] of dict) {
        const gridIndex   = unit.getGridIndex();
        const gridId      = gridIndex.getGridId(mapSize);
        if (!observerTeamIndexesDict.has(gridId)) {
            observerTeamIndexesDict.set(gridId, VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
        }
    }

    const gameConfig            = war.getGcData();
    const warStatisticsManager  = war.getWarStatisticsManager();
    const isLoadedUnitVisible   = true;
    for (const [unit, unitData] of dict) {
        const normalizedHp = unit.getNormalizedCurrentHp();
        unit.init(unitData, gameConfig);
        unit.startRunning(war);
        // unit.startRunningView();
        (!isFast) && (unit.updateView());

        const offsetHp = unit.getNormalizedCurrentHp() - normalizedHp;
        if ((offsetHp !== 0)                                            &&
            ((isLoadedUnitVisible) || (unit.getLoaderUnitId() == null))
        ) {
            const observerTeamIndexes = observerTeamIndexesDict.get(unit.getGridIndex().getGridId(mapSize));
            if (observerTeamIndexes != null) {
                warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                    unitType                    : unit.getUnitType(),
                    dstPlayerIndex              : unit.getPlayerIndex(),
                    unitGain                    : 0,
                    unitLoss                    : 0,
                    normalizedHpGain            : offsetHp > 0 ? offsetHp : 0,
                    normalizedHpLoss            : offsetHp < 0 ? -offsetHp : 0,
                    groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                }));
            }
        }
    }
}
