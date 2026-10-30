import {
    Tiles_Utils_Serialization,
    Tiles_Constants_CustomLimits,
    Tiles_Constants_DefaultCustomTileData,
    WarEvents_Actions_Constants_SetCustomBuildingStateExpr,
    Lang_Utils,
    Tiles_Utils_Common,
    Numbers_Utils,
    Numbers_Constants,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    type BaseWar_Interface_IBwWar,
    type Tiles_ITile,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetCustomBuildingStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateExpr.ts";
import { TileCustomBuildingData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConTileFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActDefenseAmount(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActDefenseUnitTypeArray(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActMaxCapturePoint(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsDefeatedOnCapture(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRepairNormalizedHp(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRepairUnitTypeArray(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIncomePerTurn(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActVisionRange(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsVisionEnabledForAllPlayers(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActHideUnitTypeArray(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActProduceUnitTypeArray(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActGlobalAttackBonus(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActGlobalDefenseBonus(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActUnitTypeArrayForCoBoard(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActBlockEnemyUnitTypeArray(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0066, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActDefenseAmount()                   ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount.getTitleText()}: ${data.getActDefenseAmount()}`                                 : null,
        data.getActDefenseUnitTypeArray()            ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray.getTitleText()}: ${data.getActDefenseUnitTypeArray()}`                   : null,
        data.getActMaxCapturePoint()                 ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint.getTitleText()}: ${data.getActMaxCapturePoint()}`                             : null,
        data.getActIsDefeatedOnCapture()             ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture.getTitleText()}: ${data.getActIsDefeatedOnCapture()}`                     : null,
        data.getActRepairNormalizedHp()              ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp.getTitleText()}: ${data.getActRepairNormalizedHp()}`                       : null,
        data.getActRepairUnitTypeArray()             ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray.getTitleText()}: ${data.getActRepairUnitTypeArray()}`                     : null,
        data.getActIncomePerTurn()                   ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn.getTitleText()}: ${data.getActIncomePerTurn()}`                                 : null,
        data.getActVisionRange()                     ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange.getTitleText()}: ${data.getActVisionRange()}`                                     : null,
        data.getActIsVisionEnabledForAllPlayers()    ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers.getTitleText()}: ${data.getActIsVisionEnabledForAllPlayers()}`   : null,
        data.getActHideUnitTypeArray()               ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray.getTitleText()}: ${data.getActHideUnitTypeArray()}`                         : null,
        data.getActProduceUnitTypeArray()            ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray.getTitleText()}: ${data.getActProduceUnitTypeArray()}`                   : null,
        data.getActGlobalAttackBonus()               ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus.getTitleText()}: ${data.getActGlobalAttackBonus()}`                         : null,
        data.getActGlobalDefenseBonus()              ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus.getTitleText()}: ${data.getActGlobalDefenseBonus()}`                       : null,
        data.getActUnitTypeArrayForCoBoard()         ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard.getTitleText()}: ${data.getActUnitTypeArrayForCoBoard()}`             : null,
        data.getActBlockEnemyUnitTypeArray()         ? `${WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray.getTitleText()}: ${data.getActBlockEnemyUnitTypeArray()}`             : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0066, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomBuildingStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ConTileFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getConTileFilter(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActDefenseAmount(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActDefenseUnitTypeArray(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActMaxCapturePoint(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIsDefeatedOnCapture(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActRepairNormalizedHp(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActRepairUnitTypeArray(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIncomePerTurn(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActVisionRange(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIsVisionEnabledForAllPlayers(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActHideUnitTypeArray(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActProduceUnitTypeArray(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActGlobalAttackBonus(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActGlobalDefenseBonus(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActUnitTypeArrayForCoBoard(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActBlockEnemyUnitTypeArray(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActDefenseAmount(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getDefenseAmount();
    const act           = action.getActDefenseAmount();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Building.DefenseAmount.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Building.DefenseAmount.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActDefenseUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getDefenseUnitTypeArray();
    const act           = action.getActDefenseUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = Numbers_Utils.getValueInRange({
                    minValue : 0,
                    maxValue : Numbers_Constants.MaxInt32,
                    rawValue : Math.floor(rawValue),
                });
                if (gameConfig.checkIsValidUnitType(unitType)) {
                    unitTypeSet.add(unitType);
                }
            }
            return [...unitTypeSet];
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActMaxCapturePoint(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number | null {
    const defaultValue  = customBuildingData.getMaxCapturePoint() ?? null;
    const act           = action.getActMaxCapturePoint();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const rawValue = epResult.num;
            if (rawValue < 0) {
                return null;
            } else {
                return Numbers_Utils.getValueInRange({
                    minValue : Tiles_Constants_CustomLimits.Building.MaxCapturePoint.MinValue,
                    maxValue : Tiles_Constants_CustomLimits.Building.MaxCapturePoint.MaxValue,
                    rawValue : Math.floor(rawValue),
                });
            }
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActIsDefeatedOnCapture(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): boolean {
    const defaultValue  = customBuildingData.getIsDefeatedOnCapture();
    const act           = action.getActIsDefeatedOnCapture();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRepairNormalizedHp(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number | null {
    const defaultValue  = customBuildingData.getRepairNormalizedHp() ?? null;
    const act           = action.getActRepairNormalizedHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const rawValue = epResult.num;
            if (rawValue < 0) {
                return null;
            } else {
                return Numbers_Utils.getValueInRange({
                    minValue : Tiles_Constants_CustomLimits.Building.RepairNormalizedHp.MinValue,
                    maxValue : Tiles_Constants_CustomLimits.Building.RepairNormalizedHp.MaxValue,
                    rawValue : Math.floor(rawValue),
                });
            }
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRepairUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getRepairUnitTypeArray();
    const act           = action.getActRepairUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = Numbers_Utils.getValueInRange({
                    minValue : 0,
                    maxValue : Numbers_Constants.MaxInt32,
                    rawValue : Math.floor(rawValue),
                });
                if (gameConfig.checkIsValidUnitType(unitType)) {
                    unitTypeSet.add(unitType);
                }
            }
            return [...unitTypeSet];
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActIncomePerTurn(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getIncomePerTurn();
    const act           = action.getActIncomePerTurn();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Building.IncomePerTurn.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Building.IncomePerTurn.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActVisionRange(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getVisionRange();
    const act           = action.getActVisionRange();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Building.VisionRange.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Building.VisionRange.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActIsVisionEnabledForAllPlayers(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): boolean {
    const defaultValue  = customBuildingData.getIsVisionEnabledForAllPlayers();
    const act           = action.getActIsVisionEnabledForAllPlayers();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActHideUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getHideUnitTypeArray();
    const act           = action.getActHideUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = Numbers_Utils.getValueInRange({
                    minValue : 0,
                    maxValue : Numbers_Constants.MaxInt32,
                    rawValue : Math.floor(rawValue),
                });
                if (gameConfig.checkIsValidUnitType(unitType)) {
                    unitTypeSet.add(unitType);
                }
            }
            return [...unitTypeSet];
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActProduceUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getProduceUnitTypeArray();
    const act           = action.getActProduceUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = Numbers_Utils.getValueInRange({
                    minValue : 0,
                    maxValue : Numbers_Constants.MaxInt32,
                    rawValue : Math.floor(rawValue),
                });
                if (gameConfig.checkIsValidUnitType(unitType)) {
                    unitTypeSet.add(unitType);
                }
            }
            return [...unitTypeSet];
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGlobalAttackBonus(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getGlobalAttackBonus();
    const act           = action.getActGlobalAttackBonus();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Building.GlobalAttackBonus.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Building.GlobalAttackBonus.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGlobalDefenseBonus(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getGlobalDefenseBonus();
    const act           = action.getActGlobalDefenseBonus();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Building.GlobalDefenseBonus.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Building.GlobalDefenseBonus.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActUnitTypeArrayForCoBoard(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getUnitTypeArrayForCoBoard();
    const act           = action.getActUnitTypeArrayForCoBoard();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = Numbers_Utils.getValueInRange({
                    minValue : 0,
                    maxValue : Numbers_Constants.MaxInt32,
                    rawValue : Math.floor(rawValue),
                });
                if (gameConfig.checkIsValidUnitType(unitType)) {
                    unitTypeSet.add(unitType);
                }
            }
            return [...unitTypeSet];
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActBlockEnemyUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getBlockEnemyUnitTypeArray();
    const act           = action.getActBlockEnemyUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = Numbers_Utils.getValueInRange({
                    minValue : 0,
                    maxValue : Numbers_Constants.MaxInt32,
                    rawValue : Math.floor(rawValue),
                });
                if (gameConfig.checkIsValidUnitType(unitType)) {
                    unitTypeSet.add(unitType);
                }
            }
            return [...unitTypeSet];
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaSetCustomBuildingStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomBuildingStateExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<Tiles_ITile.ITile, TileCustomBuildingData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if ((!tile.getIsCustomizableBuilding()) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomBuildingData(action, tile, tile.getCustomBuildingData() ?? Tiles_Constants_DefaultCustomTileData.Building));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomBuildingData(action: WeaSetCustomBuildingStateExpr, tile: Tiles_ITile.ITile, customBuildingData: TileCustomBuildingData): TileCustomBuildingData {
    const defenseAmount                 = evalActDefenseAmount(action, tile, customBuildingData);
    const isDefeatedOnCapture           = evalActIsDefeatedOnCapture(action, tile, customBuildingData);
    const incomePerTurn                 = evalActIncomePerTurn(action, tile, customBuildingData);
    const visionRange                   = evalActVisionRange(action, tile, customBuildingData);
    const isVisionEnabledForAllPlayers  = evalActIsVisionEnabledForAllPlayers(action, tile, customBuildingData);
    const globalAttackBonus             = evalActGlobalAttackBonus(action, tile, customBuildingData);
    const globalDefenseBonus            = evalActGlobalDefenseBonus(action, tile, customBuildingData);

    const defenseUnitTypeArray          = evalActDefenseUnitTypeArray(action, tile, customBuildingData);
    const maxCapturePoint               = evalActMaxCapturePoint(action, tile, customBuildingData);
    const repairNormalizedHp            = evalActRepairNormalizedHp(action, tile, customBuildingData);
    const repairUnitTypeArray           = evalActRepairUnitTypeArray(action, tile, customBuildingData);
    const hideUnitTypeArray             = evalActHideUnitTypeArray(action, tile, customBuildingData);
    const produceUnitTypeArray          = evalActProduceUnitTypeArray(action, tile, customBuildingData);
    const unitTypeArrayForCoBoard       = evalActUnitTypeArrayForCoBoard(action, tile, customBuildingData);
    const blockEnemyUnitTypeArray       = evalActBlockEnemyUnitTypeArray(action, tile, customBuildingData);
    return TileCustomBuildingData.fromJson({
        defenseAmount                : defenseAmount,
        defenseUnitTypeArray         : defenseUnitTypeArray,
        maxCapturePoint              : maxCapturePoint,
        isDefeatedOnCapture          : isDefeatedOnCapture,
        repairNormalizedHp           : repairNormalizedHp,
        repairUnitTypeArray          : repairUnitTypeArray,
        incomePerTurn                : incomePerTurn,
        visionRange                  : visionRange,
        isVisionEnabledForAllPlayers : isVisionEnabledForAllPlayers,
        hideUnitTypeArray            : hideUnitTypeArray,
        produceUnitTypeArray         : produceUnitTypeArray,
        globalAttackBonus            : globalAttackBonus,
        globalDefenseBonus           : globalDefenseBonus,
        unitTypeArrayForCoBoard      : unitTypeArrayForCoBoard,
        blockEnemyUnitTypeArray      : blockEnemyUnitTypeArray,
    });
}
function applyNewTileDataDict(dict: Map<Tiles_ITile.ITile, TileCustomBuildingData>, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomBuildingData] of dict) {
        const cfg       = tile.getTemplateCfg();
        const newData   = Tiles_Utils_Serialization.create({
            gridIndex         : tile.getGridIndex().toProto().toJson(),
            playerIndex       : tile.getPlayerIndex(),
            baseType          : tile.getBaseType(),
            baseShapeId       : tile.getBaseShapeId(),
            decorationType    : tile.getDecorationType(),
            decorationShapeId : tile.getDecorationShapeId(),
            objectType        : tile.getObjectType(),
            objectShapeId     : tile.getObjectShapeId(),

            customNameId           : tile.getCustomNameId() ?? null,
            unfixedBuffArray       : tile.getUnfixedBuffList().map(v => v.toJson()),
            groupedLocationIdArray : tile.getGroupedLocationIdArray(),
            isHighlighted          : tile.getIsHighlighted(),

            currentBuildPoint   : Math.min(tile.getCurrentBuildPoint(),     Tiles_Utils_Common.getMaxBuildPoint(cfg, tileCustomBuildingData) ?? 0),
            currentCapturePoint : Math.min(tile.getCurrentCapturePoint(),   Tiles_Utils_Common.getMaxCapturePoint(cfg, tileCustomBuildingData) ?? 0),
            currentHp           : Math.min(tile.getCurrentHp(),             Tiles_Utils_Common.getMaxHp(cfg, tileCustomBuildingData) ?? 0),

            customBuildingData    : tileCustomBuildingData.toJson(),
            customCrystalData     : null,
            customCannonData      : null,
            customLaserTurretData : null,
        });

        tile.init(newData, tile.getGameConfig());
        tile.startRunning(war);

        // tile.startRunningView();
        if (!isFast) {
            tile.flushDataToView();
        }
    }
}
