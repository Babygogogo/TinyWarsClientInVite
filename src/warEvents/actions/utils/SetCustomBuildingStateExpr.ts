import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { NumArray } from "../../../expressionParsers/results/NumArray.ts";
import {
    TextType,
    UndefinedError,
} from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { MaxInt32 } from "../../../numbers/Constants.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type { WeaSetCustomBuildingStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateExpr.ts";
import { TileCustomBuildingData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import { Building as CustomLimitsBuilding } from "../../../tiles/constants/CustomLimits.ts";
import { Building as DefaultCustomTileDataBuilding } from "../../../tiles/constants/DefaultCustomTileData.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import {
    getMaxBuildPoint,
    getMaxCapturePoint,
    getMaxHp,
} from "../../../tiles/utils/Common.ts";
import { create } from "../../../tiles/utils/Serialization.ts";
import { ExpressionInfoDict } from "../constants/SetCustomBuildingStateExpr.ts";

export function checkIsValid(action: Undefinable<WeaSetCustomBuildingStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActDefenseAmount(),
            expressionInfo          : ExpressionInfoDict.ActDefenseAmount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActDefenseUnitTypeArray(),
            expressionInfo          : ExpressionInfoDict.ActDefenseUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActMaxCapturePoint(),
            expressionInfo          : ExpressionInfoDict.ActMaxCapturePoint,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsDefeatedOnCapture(),
            expressionInfo          : ExpressionInfoDict.ActIsDefeatedOnCapture,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActRepairNormalizedHp(),
            expressionInfo          : ExpressionInfoDict.ActRepairNormalizedHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActRepairUnitTypeArray(),
            expressionInfo          : ExpressionInfoDict.ActRepairUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIncomePerTurn(),
            expressionInfo          : ExpressionInfoDict.ActIncomePerTurn,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActVisionRange(),
            expressionInfo          : ExpressionInfoDict.ActVisionRange,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsVisionEnabledForAllPlayers(),
            expressionInfo          : ExpressionInfoDict.ActIsVisionEnabledForAllPlayers,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActHideUnitTypeArray(),
            expressionInfo          : ExpressionInfoDict.ActHideUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActProduceUnitTypeArray(),
            expressionInfo          : ExpressionInfoDict.ActProduceUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActGlobalAttackBonus(),
            expressionInfo          : ExpressionInfoDict.ActGlobalAttackBonus,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActGlobalDefenseBonus(),
            expressionInfo          : ExpressionInfoDict.ActGlobalDefenseBonus,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActUnitTypeArrayForCoBoard(),
            expressionInfo          : ExpressionInfoDict.ActUnitTypeArrayForCoBoard,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActBlockEnemyUnitTypeArray(),
            expressionInfo          : ExpressionInfoDict.ActBlockEnemyUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetCustomBuildingStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0066, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetCustomBuildingStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActDefenseAmount()                   ? `${ExpressionInfoDict.ActDefenseAmount.getTitleText()}: ${data.getActDefenseAmount()}`                                 : null,
        data.getActDefenseUnitTypeArray()            ? `${ExpressionInfoDict.ActDefenseUnitTypeArray.getTitleText()}: ${data.getActDefenseUnitTypeArray()}`                   : null,
        data.getActMaxCapturePoint()                 ? `${ExpressionInfoDict.ActMaxCapturePoint.getTitleText()}: ${data.getActMaxCapturePoint()}`                             : null,
        data.getActIsDefeatedOnCapture()             ? `${ExpressionInfoDict.ActIsDefeatedOnCapture.getTitleText()}: ${data.getActIsDefeatedOnCapture()}`                     : null,
        data.getActRepairNormalizedHp()              ? `${ExpressionInfoDict.ActRepairNormalizedHp.getTitleText()}: ${data.getActRepairNormalizedHp()}`                       : null,
        data.getActRepairUnitTypeArray()             ? `${ExpressionInfoDict.ActRepairUnitTypeArray.getTitleText()}: ${data.getActRepairUnitTypeArray()}`                     : null,
        data.getActIncomePerTurn()                   ? `${ExpressionInfoDict.ActIncomePerTurn.getTitleText()}: ${data.getActIncomePerTurn()}`                                 : null,
        data.getActVisionRange()                     ? `${ExpressionInfoDict.ActVisionRange.getTitleText()}: ${data.getActVisionRange()}`                                     : null,
        data.getActIsVisionEnabledForAllPlayers()    ? `${ExpressionInfoDict.ActIsVisionEnabledForAllPlayers.getTitleText()}: ${data.getActIsVisionEnabledForAllPlayers()}`   : null,
        data.getActHideUnitTypeArray()               ? `${ExpressionInfoDict.ActHideUnitTypeArray.getTitleText()}: ${data.getActHideUnitTypeArray()}`                         : null,
        data.getActProduceUnitTypeArray()            ? `${ExpressionInfoDict.ActProduceUnitTypeArray.getTitleText()}: ${data.getActProduceUnitTypeArray()}`                   : null,
        data.getActGlobalAttackBonus()               ? `${ExpressionInfoDict.ActGlobalAttackBonus.getTitleText()}: ${data.getActGlobalAttackBonus()}`                         : null,
        data.getActGlobalDefenseBonus()              ? `${ExpressionInfoDict.ActGlobalDefenseBonus.getTitleText()}: ${data.getActGlobalDefenseBonus()}`                       : null,
        data.getActUnitTypeArrayForCoBoard()         ? `${ExpressionInfoDict.ActUnitTypeArrayForCoBoard.getTitleText()}: ${data.getActUnitTypeArrayForCoBoard()}`             : null,
        data.getActBlockEnemyUnitTypeArray()         ? `${ExpressionInfoDict.ActBlockEnemyUnitTypeArray.getTitleText()}: ${data.getActBlockEnemyUnitTypeArray()}`             : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0066, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomBuildingStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConTileFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConTileFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActDefenseAmount;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActDefenseAmount(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActDefenseUnitTypeArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActDefenseUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActMaxCapturePoint;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActMaxCapturePoint(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsDefeatedOnCapture;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsDefeatedOnCapture(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActRepairNormalizedHp;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActRepairNormalizedHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActRepairUnitTypeArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActRepairUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIncomePerTurn;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIncomePerTurn(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActVisionRange;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActVisionRange(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsVisionEnabledForAllPlayers;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsVisionEnabledForAllPlayers(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActHideUnitTypeArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActHideUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActProduceUnitTypeArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActProduceUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActGlobalAttackBonus;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActGlobalAttackBonus(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActGlobalDefenseBonus;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActGlobalDefenseBonus(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActUnitTypeArrayForCoBoard;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActUnitTypeArrayForCoBoard(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActBlockEnemyUnitTypeArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActBlockEnemyUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetCustomBuildingStateExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActDefenseAmount(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getDefenseAmount();
    const act           = action.getActDefenseAmount();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : CustomLimitsBuilding.DefenseAmount.MinValue,
                maxValue    : CustomLimitsBuilding.DefenseAmount.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActDefenseUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getDefenseUnitTypeArray();
    const act           = action.getActDefenseUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = getValueInRange({
                    minValue: 0,
                    maxValue: MaxInt32,
                    rawValue: Math.floor(rawValue),
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
function evalActMaxCapturePoint(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number | null {
    const defaultValue  = customBuildingData.getMaxCapturePoint() ?? null;
    const act           = action.getActMaxCapturePoint();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const rawValue = epResult.num;
            if (rawValue < 0) {
                return null;
            } else {
                return getValueInRange({
                    minValue    : CustomLimitsBuilding.MaxCapturePoint.MinValue,
                    maxValue    : CustomLimitsBuilding.MaxCapturePoint.MaxValue,
                    rawValue    : Math.floor(rawValue),
                });
            }
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActIsDefeatedOnCapture(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): boolean {
    const defaultValue  = customBuildingData.getIsDefeatedOnCapture();
    const act           = action.getActIsDefeatedOnCapture();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRepairNormalizedHp(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number | null {
    const defaultValue  = customBuildingData.getRepairNormalizedHp() ?? null;
    const act           = action.getActRepairNormalizedHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const rawValue = epResult.num;
            if (rawValue < 0) {
                return null;
            } else {
                return getValueInRange({
                    minValue    : CustomLimitsBuilding.RepairNormalizedHp.MinValue,
                    maxValue    : CustomLimitsBuilding.RepairNormalizedHp.MaxValue,
                    rawValue    : Math.floor(rawValue),
                });
            }
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRepairUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getRepairUnitTypeArray();
    const act           = action.getActRepairUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = getValueInRange({
                    minValue: 0,
                    maxValue: MaxInt32,
                    rawValue: Math.floor(rawValue),
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
function evalActIncomePerTurn(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getIncomePerTurn();
    const act           = action.getActIncomePerTurn();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : CustomLimitsBuilding.IncomePerTurn.MinValue,
                maxValue    : CustomLimitsBuilding.IncomePerTurn.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActVisionRange(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getVisionRange();
    const act           = action.getActVisionRange();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : CustomLimitsBuilding.VisionRange.MinValue,
                maxValue    : CustomLimitsBuilding.VisionRange.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActIsVisionEnabledForAllPlayers(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): boolean {
    const defaultValue  = customBuildingData.getIsVisionEnabledForAllPlayers();
    const act           = action.getActIsVisionEnabledForAllPlayers();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActHideUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getHideUnitTypeArray();
    const act           = action.getActHideUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = getValueInRange({
                    minValue: 0,
                    maxValue: MaxInt32,
                    rawValue: Math.floor(rawValue),
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
function evalActProduceUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getProduceUnitTypeArray();
    const act           = action.getActProduceUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = getValueInRange({
                    minValue: 0,
                    maxValue: MaxInt32,
                    rawValue: Math.floor(rawValue),
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
function evalActGlobalAttackBonus(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getGlobalAttackBonus();
    const act           = action.getActGlobalAttackBonus();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : CustomLimitsBuilding.GlobalAttackBonus.MinValue,
                maxValue    : CustomLimitsBuilding.GlobalAttackBonus.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGlobalDefenseBonus(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getGlobalDefenseBonus();
    const act           = action.getActGlobalDefenseBonus();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : CustomLimitsBuilding.GlobalDefenseBonus.MinValue,
                maxValue    : CustomLimitsBuilding.GlobalDefenseBonus.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActUnitTypeArrayForCoBoard(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getUnitTypeArrayForCoBoard();
    const act           = action.getActUnitTypeArrayForCoBoard();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = getValueInRange({
                    minValue: 0,
                    maxValue: MaxInt32,
                    rawValue: Math.floor(rawValue),
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
function evalActBlockEnemyUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getBlockEnemyUnitTypeArray();
    const act           = action.getActBlockEnemyUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = getValueInRange({
                    minValue: 0,
                    maxValue: MaxInt32,
                    rawValue: Math.floor(rawValue),
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
export async function applyWithoutExtraData(action: WeaSetCustomBuildingStateExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, TileCustomBuildingData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if ((!tile.getIsCustomizableBuilding()) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomBuildingData(action, tile, tile.getCustomBuildingData() ?? DefaultCustomTileDataBuilding));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomBuildingData(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: TileCustomBuildingData): TileCustomBuildingData {
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
        defenseAmount                   : defenseAmount,
        defenseUnitTypeArray            : defenseUnitTypeArray,
        maxCapturePoint                 : maxCapturePoint,
        isDefeatedOnCapture             : isDefeatedOnCapture,
        repairNormalizedHp              : repairNormalizedHp,
        repairUnitTypeArray             : repairUnitTypeArray,
        incomePerTurn                   : incomePerTurn,
        visionRange                     : visionRange,
        isVisionEnabledForAllPlayers    : isVisionEnabledForAllPlayers,
        hideUnitTypeArray               : hideUnitTypeArray,
        produceUnitTypeArray            : produceUnitTypeArray,
        globalAttackBonus               : globalAttackBonus,
        globalDefenseBonus              : globalDefenseBonus,
        unitTypeArrayForCoBoard         : unitTypeArrayForCoBoard,
        blockEnemyUnitTypeArray         : blockEnemyUnitTypeArray,
    });
}
function applyNewTileDataDict(dict: Map<ITile, TileCustomBuildingData>, war: IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomBuildingData] of dict) {
        const cfg       = tile.getTemplateCfg();
        const newData   = create({
            gridIndex               : tile.getGridIndex().toProto().toJson(),
            playerIndex             : tile.getPlayerIndex(),
            baseType                : tile.getBaseType(),
            baseShapeId             : tile.getBaseShapeId(),
            decorationType          : tile.getDecorationType(),
            decorationShapeId       : tile.getDecorationShapeId(),
            objectType              : tile.getObjectType(),
            objectShapeId           : tile.getObjectShapeId(),

            customNameId            : tile.getCustomNameId() ?? null,
            unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
            groupedLocationIdArray  : tile.getGroupedLocationIdArray(),
            isHighlighted           : tile.getIsHighlighted(),

            currentBuildPoint       : Math.min(tile.getCurrentBuildPoint(),     getMaxBuildPoint(cfg, tileCustomBuildingData) ?? 0),
            currentCapturePoint     : Math.min(tile.getCurrentCapturePoint(),   getMaxCapturePoint(cfg, tileCustomBuildingData) ?? 0),
            currentHp               : Math.min(tile.getCurrentHp(),             getMaxHp(cfg, tileCustomBuildingData) ?? 0),

            customBuildingData      : tileCustomBuildingData.toJson(),
            customCrystalData       : null,
            customCannonData        : null,
            customLaserTurretData   : null,
        });

        tile.init(newData, tile.getGameConfig());
        tile.startRunning(war);

        // tile.startRunningView();
        if (!isFast) {
            tile.flushDataToView();
        }
    }
}
