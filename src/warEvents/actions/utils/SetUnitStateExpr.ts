import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { GridIndexAndWeight } from "../../../auxiliaryTypes/GridIndexAndWeight.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Unit } from "../../../expressionParsers/contexts/Unit.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { NullableUnit } from "../../../expressionParsers/results/NullableUnit.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { NumArray } from "../../../expressionParsers/results/NumArray.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { MinId, MaxId } from "../../../locations/Constants.ts";
import { encode } from "../../../locations/Utils.ts";
import { getValueInRange, getValueInInt32 } from "../../../numbers/Utils.ts";
import type {
    WeaSetUnitStateExpr as ProtoSchemaCommonProtoWarEventWeaSetUnitStateExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitStateExpr.ts";
import type { SerialUnit } from "../../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import { TagId } from "../../../units/Constants.ts";
import type { IUnit as UnitsIUnit } from "../../../units/IUnit.ts";
import { checkIsValidActionStateId, checkIsValidAiModeId, getEncodedTagId } from "../../../units/utils/Common.ts";
import { checkIsValidCustomNameId } from "../../../units/utils/CustomName.ts";
import { create } from "../../../units/utils/Serialization.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { ExpressionInfoDict } from "../constants/SetUnitStateExpr.ts";

type WeaSetUnitStateExpr    = ProtoSchemaCommonProtoWarEventWeaSetUnitStateExpr;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type IUnit                  = UnitsIUnit;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypesUndefinable<WeaSetUnitStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActActionState(),
            expressionInfo          : ExpressionInfoDict.ActActionState,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentHp(),
            expressionInfo          : ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActFlareCurrentAmmo(),
            expressionInfo          : ExpressionInfoDict.ActFlareCurrentAmmo,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentFuel(),
            expressionInfo          : ExpressionInfoDict.ActCurrentFuel,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsCapturingTile(),
            expressionInfo          : ExpressionInfoDict.ActIsCapturingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsDiving(),
            expressionInfo          : ExpressionInfoDict.ActIsDiving,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentBuildMaterial(),
            expressionInfo          : ExpressionInfoDict.ActCurrentBuildMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentProduceMaterial(),
            expressionInfo          : ExpressionInfoDict.ActCurrentProduceMaterial,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentPromotion(),
            expressionInfo          : ExpressionInfoDict.ActCurrentPromotion,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsBuildingTile(),
            expressionInfo          : ExpressionInfoDict.ActIsBuildingTile,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsCoOnboard(),
            expressionInfo          : ExpressionInfoDict.ActIsCoOnboard,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActAiMode(),
            expressionInfo          : ExpressionInfoDict.ActAiMode,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCustomNameId(),
            expressionInfo          : ExpressionInfoDict.ActCustomNameId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActGroupedTagId(),
            expressionInfo          : ExpressionInfoDict.ActGroupedTagId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : ExpressionInfoDict.ActForbiddenGroupedLocationIdArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActAiWeightedDestination(),
            expressionInfo          : ExpressionInfoDict.ActAiWeightedDestination,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypesUndefinable<WeaSetUnitStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0053, data.getConUnitFilter() ?? UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypesUndefinable<WeaSetUnitStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActActionState()                     ? `${ExpressionInfoDict.ActActionState.getTitleText()}: ${data.getActActionState()}`                                         : null,
        data.getActIsCoOnboard()                     ? `${ExpressionInfoDict.ActIsCoOnboard.getTitleText()}: ${data.getActIsCoOnboard()}`                                         : null,
        data.getActCurrentPromotion()                ? `${ExpressionInfoDict.ActCurrentPromotion.getTitleText()}: ${data.getActCurrentPromotion()}`                               : null,
        data.getActCurrentHp()                       ? `${ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                                             : null,
        data.getActPrimaryWeaponCurrentAmmo()        ? `${ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo.getTitleText()}: ${data.getActPrimaryWeaponCurrentAmmo()}`               : null,
        data.getActFlareCurrentAmmo()                ? `${ExpressionInfoDict.ActFlareCurrentAmmo.getTitleText()}: ${data.getActFlareCurrentAmmo()}`                               : null,
        data.getActCurrentFuel()                     ? `${ExpressionInfoDict.ActCurrentFuel.getTitleText()}: ${data.getActCurrentFuel()}`                                         : null,
        data.getActCurrentBuildMaterial()            ? `${ExpressionInfoDict.ActCurrentBuildMaterial.getTitleText()}: ${data.getActCurrentBuildMaterial()}`                       : null,
        data.getActCurrentProduceMaterial()          ? `${ExpressionInfoDict.ActCurrentProduceMaterial.getTitleText()}: ${data.getActCurrentProduceMaterial()}`                   : null,
        data.getActIsDiving()                        ? `${ExpressionInfoDict.ActIsDiving.getTitleText()}: ${data.getActIsDiving()}`                                               : null,
        data.getActIsBuildingTile()                  ? `${ExpressionInfoDict.ActIsBuildingTile.getTitleText()}: ${data.getActIsBuildingTile()}`                                   : null,
        data.getActIsCapturingTile()                 ? `${ExpressionInfoDict.ActIsCapturingTile.getTitleText()}: ${data.getActIsCapturingTile()}`                                 : null,
        data.getActGroupedTagId()                    ? `${ExpressionInfoDict.ActGroupedTagId.getTitleText()}: ${data.getActGroupedTagId()}`                                       : null,
        data.getActForbiddenGroupedLocationIdArray() ? `${ExpressionInfoDict.ActForbiddenGroupedLocationIdArray.getTitleText()}: ${data.getActForbiddenGroupedLocationIdArray()}` : null,
        data.getActAiMode()                          ? `${ExpressionInfoDict.ActAiMode.getTitleText()}: ${data.getActAiMode()}`                                                   : null,
        data.getActCustomNameId()                    ? `${ExpressionInfoDict.ActCustomNameId.getTitleText()}: ${data.getActCustomNameId()}`                                       : null,
        data.getActAiWeightedDestination()           ? `${ExpressionInfoDict.ActAiWeightedDestination.getTitleText()}: ${data.getActAiWeightedDestination()}`                     : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0053, data.getConUnitFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConUnitFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActActionState;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActActionState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentHp;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActPrimaryWeaponCurrentAmmo;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActPrimaryWeaponCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActFlareCurrentAmmo;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActFlareCurrentAmmo(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentFuel;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentFuel(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsCapturingTile;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsCapturingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsDiving;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsDiving(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentBuildMaterial;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentBuildMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentProduceMaterial;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentProduceMaterial(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentPromotion;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentPromotion(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsBuildingTile;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsBuildingTile(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsCoOnboard;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsCoOnboard(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActAiMode;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActAiMode(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCustomNameId;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCustomNameId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActGroupedTagId;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActGroupedTagId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActForbiddenGroupedLocationIdArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActForbiddenGroupedLocationIdArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActAiWeightedDestination;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActAiWeightedDestination(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitStateExpr, unit: IUnit): boolean {
    try {
        const result = Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof Num) && (result.num !== 0);
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            const actionState = Math.floor(epResult.num);
            return (checkIsValidActionStateId(actionState)) ? actionState : defaultValue;
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            return getValueInRange({
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            return getValueInRange({
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            return getValueInRange({
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            return getValueInRange({
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            return getValueInRange({
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            return getValueInRange({
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            return getValueInRange({
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            const aiMode = Math.floor(epResult.num);
            return (checkIsValidAiModeId(aiMode)) ? aiMode : defaultValue;
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            const value = getValueInInt32(epResult.num);
            return checkIsValidCustomNameId(value)
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof NumArray) {
            return getEncodedTagId(epResult.numberArray.map(v => getValueInRange({
                minValue    : TagId.MinTagId,
                maxValue    : TagId.MaxTagId,
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
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof NumArray) {
            return encode(epResult.numberArray.map(v => getValueInRange({
                minValue    : MinId,
                maxValue    : MaxId,
                rawValue    : Math.floor(v),
            })));
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActAiWeightedDestination(action: WeaSetUnitStateExpr, unit: IUnit): Undefinable<GridIndexAndWeight> {
    const defaultValue  = unit.getAiWeightedDestination();
    const act           = action.getActAiWeightedDestination();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof NumArray) {
            if (epResult.numberArray.length !== 3) {
                return defaultValue;
            }

            const arr       = epResult.numberArray.map(v => getValueInInt32(v));
            const gridIndex = new GridIndex(arr[0], arr[1]);
            if (!gridIndex.checkIsInsideMap(unit.getWar().getTileMap().getMapSize())) {
                return defaultValue;
            }

            return new GridIndexAndWeight(gridIndex, arr[2]);
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
export async function applyWithoutExtraData(action: WeaSetUnitStateExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const newUnitDataDict = new Map<IUnit, SerialUnit>();
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
function createNewUnitData(action: WeaSetUnitStateExpr, unit: IUnit): SerialUnit {
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

    return create({
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
function applyNewUnitDataDict(dict: Map<IUnit, SerialUnit>, war: IBwWar, isFast: boolean): void {
    const unitMap                   = war.getUnitMap();
    const mapSize                   = unitMap.getMapSize();
    const observerTeamIndexesDict   = new Map<number, number[] | null>();
    for (const [unit] of dict) {
        const gridIndex   = unit.getGridIndex();
        const gridId      = gridIndex.getGridId(mapSize);
        if (!observerTeamIndexesDict.has(gridId)) {
            observerTeamIndexesDict.set(gridId, getObserverTeamIndexListForUnitOnMap({ war, gridIndex }));
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
                    unitType                    : unit.getUnitType(),
                    dstPlayerIndex              : unit.getPlayerIndex(),
                    unitGain                    : 0,
                    unitLoss                    : 0,
                    normalizedHpGain            : offsetHp > 0 ? offsetHp : 0,
                    normalizedHpLoss            : offsetHp < 0 ? -offsetHp : 0,
                    groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                }));
            }
        }
    }
}
