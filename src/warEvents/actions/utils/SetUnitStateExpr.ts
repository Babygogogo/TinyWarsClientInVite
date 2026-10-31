import {
    Units_Utils_Common,
    Units_Utils_CustomName,
    Units_Utils_Serialization,
    Locations_Utils,
    Helpers_Team,
    WarEvents_Actions_Constants_SetUnitStateExpr,
    Lang_Utils,
    Visibilities_Utils,
    Numbers_Utils,
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_GridIndexAndWeight,
    Locations_Constants,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Parser,
    Units_Constants,
    Lang_Constants,
    ExpressionParsers_Contexts_Unit,
    type BaseWar_Interface_IBwWar,
    type Units_Unit,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetUnitStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateExpr.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConUnitFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActActionState(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActActionState,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentHp(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActFlareCurrentAmmo(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActFlareCurrentAmmo,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentFuel(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentFuel,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsCapturingTile(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCapturingTile,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsDiving(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsDiving,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentBuildMaterial(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentBuildMaterial,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentProduceMaterial(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentProduceMaterial,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentPromotion(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentPromotion,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsBuildingTile(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsBuildingTile,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsCoOnboard(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCoOnboard,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActAiMode(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiMode,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCustomNameId(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCustomNameId,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActGroupedTagId(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActGroupedTagId,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActAiWeightedDestination(),
            expressionInfo       : WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiWeightedDestination,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0053, data.getConUnitFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActActionState()                     ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActActionState.getTitleText()}: ${data.getActActionState()}`                                         : null,
        data.getActIsCoOnboard()                     ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCoOnboard.getTitleText()}: ${data.getActIsCoOnboard()}`                                         : null,
        data.getActCurrentPromotion()                ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentPromotion.getTitleText()}: ${data.getActCurrentPromotion()}`                               : null,
        data.getActCurrentHp()                       ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                                             : null,
        data.getActPrimaryWeaponCurrentAmmo()        ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText()}: ${data.getActPrimaryWeaponCurrentAmmo()}`               : null,
        data.getActFlareCurrentAmmo()                ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText()}: ${data.getActFlareCurrentAmmo()}`                               : null,
        data.getActCurrentFuel()                     ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentFuel.getTitleText()}: ${data.getActCurrentFuel()}`                                         : null,
        data.getActCurrentBuildMaterial()            ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText()}: ${data.getActCurrentBuildMaterial()}`                       : null,
        data.getActCurrentProduceMaterial()          ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText()}: ${data.getActCurrentProduceMaterial()}`                   : null,
        data.getActIsDiving()                        ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsDiving.getTitleText()}: ${data.getActIsDiving()}`                                               : null,
        data.getActIsBuildingTile()                  ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsBuildingTile.getTitleText()}: ${data.getActIsBuildingTile()}`                                   : null,
        data.getActIsCapturingTile()                 ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCapturingTile.getTitleText()}: ${data.getActIsCapturingTile()}`                                 : null,
        data.getActGroupedTagId()                    ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActGroupedTagId.getTitleText()}: ${data.getActGroupedTagId()}`                                       : null,
        data.getActForbiddenGroupedLocationIdArray() ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText()}: ${data.getActForbiddenGroupedLocationIdArray()}` : null,
        data.getActAiMode()                          ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiMode.getTitleText()}: ${data.getActAiMode()}`                                                   : null,
        data.getActCustomNameId()                    ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCustomNameId.getTitleText()}: ${data.getActCustomNameId()}`                                       : null,
        data.getActAiWeightedDestination()           ? `${WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiWeightedDestination.getTitleText()}: ${data.getActAiWeightedDestination()}`                     : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0053, data.getConUnitFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ConUnitFilter;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActActionState;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentHp;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActFlareCurrentAmmo;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentFuel;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCapturingTile;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIsCapturingTile(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsDiving;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentBuildMaterial;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentProduceMaterial;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCurrentPromotion;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsBuildingTile;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIsBuildingTile(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActIsCoOnboard;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiMode;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActCustomNameId;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCustomNameId(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActGroupedTagId;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActForbiddenGroupedLocationIdArray;
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
        const info      = WarEvents_Actions_Constants_SetUnitStateExpr.ExpressionInfoDict.ActAiWeightedDestination;
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

function checkIsMeetConditionForUnit(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
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
function evalActActionState(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = unit.getActionState();
    const act           = action.getActActionState();
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
function evalActPrimaryWeaponCurrentAmmo(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = unit.getPrimaryWeaponCurrentAmmo();
    const act           = action.getActPrimaryWeaponCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getPrimaryWeaponMaxAmmo() ?? 0,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentHp(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = unit.getCurrentHp();
    const act           = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 1,
                maxValue : unit.getMaxHp(),
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
// function evalActIsCapturingTile(action: IWeaSetUnitState, unit: Units_Unit.Unit): boolean {
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
function evalActIsDiving(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): boolean {
    if (!unit.checkIsDiver()) {
        return false;
    }

    const defaultValue    = unit.getIsDiving();
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
function evalActFlareCurrentAmmo(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = unit.getFlareCurrentAmmo();
    const act           = action.getActFlareCurrentAmmo();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getFlareMaxAmmo() ?? 0,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentFuel(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = unit.getCurrentFuel();
    const act           = action.getActCurrentFuel();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getMaxFuel(),
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentBuildMaterial(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = unit.getCurrentBuildMaterial();
    const act           = action.getActCurrentBuildMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getMaxBuildMaterial() ?? 0,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentProduceMaterial(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = unit.getCurrentProduceMaterial();
    const act           = action.getActCurrentProduceMaterial();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getMaxProduceMaterial() ?? 0,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentPromotion(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue    = unit.getCurrentPromotion();
    const act             = action.getActCurrentPromotion();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : 0,
                maxValue : unit.getMaxPromotion(),
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
// function evalActIsBuildingTile(action: IWeaSetUnitState, unit: Units_Unit.Unit): boolean {
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
function evalActIsCoOnboard(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): boolean {
    const defaultValue  = unit.getIsCoOnboard();
    const act           = action.getActIsCoOnboard();
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
function evalActAiMode(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = unit.getAiMode();
    const act           = action.getActAiMode();
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
function evalActCustomNameId(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    const defaultValue  = unit.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const value = Numbers_Utils.getValueInInt32(epResult.num);
            return Units_Utils_CustomName.checkIsValidCustomNameId(value)
                ? value
                : (value < 0 ? null : defaultValue);
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGroupedTagId(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number {
    const defaultValue  = unit.getGroupedTagId();
    const act           = action.getActGroupedTagId();
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
function evalActForbiddenGroupedLocationIdArray(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): number[] {
    const defaultValue  = unit.getForbiddenGroupedLocationIdArray();
    const act           = action.getActForbiddenGroupedLocationIdArray();
    if (!act) {
        return defaultValue;
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
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActAiWeightedDestination(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndexAndWeight.GridIndexAndWeight> {
    const defaultValue  = unit.getAiWeightedDestination();
    const act           = action.getActAiWeightedDestination();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            if (epResult.numberArray.length !== 3) {
                return defaultValue;
            }

            const arr       = epResult.numberArray.map(v => Numbers_Utils.getValueInInt32(v));
            const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(arr[0], arr[1]);
            if (!gridIndex.checkIsInsideMap(unit.getWar().getTileMap().getMapSize())) {
                return defaultValue;
            }

            return new AuxiliaryTypes_GridIndexAndWeight.GridIndexAndWeight(gridIndex, arr[2]);
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
export async function applyWithoutExtraData(action: WeaSetUnitStateExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newUnitDataDict = new Map<Units_Unit.Unit, SerialUnit>();
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
function createNewUnitData(action: WeaSetUnitStateExpr, unit: Units_Unit.Unit): SerialUnit {
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

    return Units_Utils_Serialization.create({
        unitType    : unit.getUnitType(),
        unitId      : unit.getUnitId(),
        playerIndex : unit.getPlayerIndex(),
        gridIndex   : unit.getGridIndex().toProto().toJson(),

        actionState  : actionState,
        currentHp    : currentHp,
        aiMode       : aiMode,
        groupedTagId : groupedTagId,
        customNameId : customNameId ?? null,

        currentPromotion     : currentPromotion,
        isDiving             : isDiving,
        isCoOnboard          : isCoOnboard,
        currentBuildMaterial : currentBuildMaterial,

        aiWeightedDestination           : aiWeightedDestination?.toJson() ?? null,
        forbiddenGroupedLocationIdArray : forbiddenGroupedLocationIdArray,
        buffArray                       : unit.getBuffList().map(buff => buff.toJson()),

        primaryWeaponCurrentAmmo : primaryWeaponCurrentAmmo,
        flareCurrentAmmo         : flareCurrentAmmo,
        currentProduceMaterial   : currentProduceMaterial,
        currentFuel              : currentFuel,
        loaderUnitId             : unit.getLoaderUnitId() ?? null,
    });
}
function applyNewUnitDataDict(dict: Map<Units_Unit.Unit, SerialUnit>, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    const unitMap                   = war.getUnitMap();
    const mapSize                   = unitMap.getMapSize();
    const observerTeamIndexesDict   = new Map<number, number[] | null>();
    for (const [unit] of dict) {
        const gridIndex   = unit.getGridIndex();
        const gridId      = gridIndex.getGridId(mapSize);
        if (!observerTeamIndexesDict.has(gridId)) {
            observerTeamIndexesDict.set(gridId, Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
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
                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                    unitType                   : unit.getUnitType(),
                    dstPlayerIndex             : unit.getPlayerIndex(),
                    unitGain                   : 0,
                    unitLoss                   : 0,
                    normalizedHpGain           : offsetHp > 0 ? offsetHp : 0,
                    normalizedHpLoss           : offsetHp < 0 ? -offsetHp : 0,
                    groupedObserverTeamIndexes : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                }));
            }
        }
    }
}
