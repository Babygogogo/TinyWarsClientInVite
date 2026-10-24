import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../../../expressionParsers/results/NumArray.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersConstants from "../../../numbers/Constants.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomBuildingStateExpr.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData from "../../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import * as TilesConstantsCustomLimits from "../../../tiles/constants/CustomLimits.ts";
import * as TilesConstantsDefaultCustomTileData from "../../../tiles/constants/DefaultCustomTileData.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsCommon from "../../../tiles/utils/Common.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as WarEventsActionsConstantsSetCustomBuildingStateExpr from "../constants/SetCustomBuildingStateExpr.ts";

type WeaSetCustomBuildingStateExpr  = ProtoSchemaCommonProtoWarEventWeaSetCustomBuildingStateExpr.WeaSetCustomBuildingStateExpr;
type ITile                          = TilesITile.ITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActDefenseAmount(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActDefenseUnitTypeArray(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActMaxCapturePoint(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsDefeatedOnCapture(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRepairNormalizedHp(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRepairUnitTypeArray(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIncomePerTurn(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActVisionRange(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsVisionEnabledForAllPlayers(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActHideUnitTypeArray(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActProduceUnitTypeArray(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActGlobalAttackBonus(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActGlobalDefenseBonus(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActUnitTypeArrayForCoBoard(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActBlockEnemyUnitTypeArray(),
            expressionInfo          : WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0066, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomBuildingStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActDefenseAmount()                   ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount.getTitleText()}: ${data.getActDefenseAmount()}`                                 : null,
        data.getActDefenseUnitTypeArray()            ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray.getTitleText()}: ${data.getActDefenseUnitTypeArray()}`                   : null,
        data.getActMaxCapturePoint()                 ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint.getTitleText()}: ${data.getActMaxCapturePoint()}`                             : null,
        data.getActIsDefeatedOnCapture()             ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture.getTitleText()}: ${data.getActIsDefeatedOnCapture()}`                     : null,
        data.getActRepairNormalizedHp()              ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp.getTitleText()}: ${data.getActRepairNormalizedHp()}`                       : null,
        data.getActRepairUnitTypeArray()             ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray.getTitleText()}: ${data.getActRepairUnitTypeArray()}`                     : null,
        data.getActIncomePerTurn()                   ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn.getTitleText()}: ${data.getActIncomePerTurn()}`                                 : null,
        data.getActVisionRange()                     ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange.getTitleText()}: ${data.getActVisionRange()}`                                     : null,
        data.getActIsVisionEnabledForAllPlayers()    ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers.getTitleText()}: ${data.getActIsVisionEnabledForAllPlayers()}`   : null,
        data.getActHideUnitTypeArray()               ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray.getTitleText()}: ${data.getActHideUnitTypeArray()}`                         : null,
        data.getActProduceUnitTypeArray()            ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray.getTitleText()}: ${data.getActProduceUnitTypeArray()}`                   : null,
        data.getActGlobalAttackBonus()               ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus.getTitleText()}: ${data.getActGlobalAttackBonus()}`                         : null,
        data.getActGlobalDefenseBonus()              ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus.getTitleText()}: ${data.getActGlobalDefenseBonus()}`                       : null,
        data.getActUnitTypeArrayForCoBoard()         ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard.getTitleText()}: ${data.getActUnitTypeArrayForCoBoard()}`             : null,
        data.getActBlockEnemyUnitTypeArray()         ? `${WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray.getTitleText()}: ${data.getActBlockEnemyUnitTypeArray()}`             : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0066, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomBuildingStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ConTileFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConTileFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseAmount;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActDefenseAmount(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActDefenseUnitTypeArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActDefenseUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActMaxCapturePoint;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActMaxCapturePoint(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsDefeatedOnCapture;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsDefeatedOnCapture(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairNormalizedHp;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActRepairNormalizedHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActRepairUnitTypeArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActRepairUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIncomePerTurn;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIncomePerTurn(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActVisionRange;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActVisionRange(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActIsVisionEnabledForAllPlayers;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsVisionEnabledForAllPlayers(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActHideUnitTypeArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActHideUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActProduceUnitTypeArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActProduceUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalAttackBonus;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActGlobalAttackBonus(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActGlobalDefenseBonus;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActGlobalDefenseBonus(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActUnitTypeArrayForCoBoard;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActUnitTypeArrayForCoBoard(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomBuildingStateExpr.ExpressionInfoDict.ActBlockEnemyUnitTypeArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActBlockEnemyUnitTypeArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetCustomBuildingStateExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActDefenseAmount(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getDefenseAmount() ?? 0;
    const act           = action.getActDefenseAmount();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Building.DefenseAmount.MinValue,
                maxValue    : TilesConstantsCustomLimits.Building.DefenseAmount.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActDefenseUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getDefenseUnitTypeArray();
    const act           = action.getActDefenseUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = NumbersUtils.getValueInRange({
                    minValue: 0,
                    maxValue: NumbersConstants.MaxInt32,
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
function evalActMaxCapturePoint(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number | null {
    const defaultValue  = customBuildingData.getMaxCapturePoint() ?? null;
    const act           = action.getActMaxCapturePoint();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const rawValue = epResult.num;
            if (rawValue < 0) {
                return null;
            } else {
                return NumbersUtils.getValueInRange({
                    minValue    : TilesConstantsCustomLimits.Building.MaxCapturePoint.MinValue,
                    maxValue    : TilesConstantsCustomLimits.Building.MaxCapturePoint.MaxValue,
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
function evalActIsDefeatedOnCapture(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): boolean {
    const defaultValue  = customBuildingData.getIsDefeatedOnCapture() ?? false;
    const act           = action.getActIsDefeatedOnCapture();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRepairNormalizedHp(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number | null {
    const defaultValue  = customBuildingData.getRepairNormalizedHp() ?? null;
    const act           = action.getActRepairNormalizedHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const rawValue = epResult.num;
            if (rawValue < 0) {
                return null;
            } else {
                return NumbersUtils.getValueInRange({
                    minValue    : TilesConstantsCustomLimits.Building.RepairNormalizedHp.MinValue,
                    maxValue    : TilesConstantsCustomLimits.Building.RepairNormalizedHp.MaxValue,
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
function evalActRepairUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getRepairUnitTypeArray();
    const act           = action.getActRepairUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = NumbersUtils.getValueInRange({
                    minValue: 0,
                    maxValue: NumbersConstants.MaxInt32,
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
function evalActIncomePerTurn(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getIncomePerTurn() ?? 0;
    const act           = action.getActIncomePerTurn();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Building.IncomePerTurn.MinValue,
                maxValue    : TilesConstantsCustomLimits.Building.IncomePerTurn.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActVisionRange(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getVisionRange() ?? 0;
    const act           = action.getActVisionRange();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Building.VisionRange.MinValue,
                maxValue    : TilesConstantsCustomLimits.Building.VisionRange.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActIsVisionEnabledForAllPlayers(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): boolean {
    const defaultValue  = customBuildingData.getIsVisionEnabledForAllPlayers() ?? false;
    const act           = action.getActIsVisionEnabledForAllPlayers();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActHideUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getHideUnitTypeArray();
    const act           = action.getActHideUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = NumbersUtils.getValueInRange({
                    minValue: 0,
                    maxValue: NumbersConstants.MaxInt32,
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
function evalActProduceUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getProduceUnitTypeArray();
    const act           = action.getActProduceUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = NumbersUtils.getValueInRange({
                    minValue: 0,
                    maxValue: NumbersConstants.MaxInt32,
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
function evalActGlobalAttackBonus(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getGlobalAttackBonus() ?? 0;
    const act           = action.getActGlobalAttackBonus();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Building.GlobalAttackBonus.MinValue,
                maxValue    : TilesConstantsCustomLimits.Building.GlobalAttackBonus.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActGlobalDefenseBonus(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number {
    const defaultValue  = customBuildingData.getGlobalDefenseBonus() ?? 0;
    const act           = action.getActGlobalDefenseBonus();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Building.GlobalDefenseBonus.MinValue,
                maxValue    : TilesConstantsCustomLimits.Building.GlobalDefenseBonus.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActUnitTypeArrayForCoBoard(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getUnitTypeArrayForCoBoard();
    const act           = action.getActUnitTypeArrayForCoBoard();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = NumbersUtils.getValueInRange({
                    minValue: 0,
                    maxValue: NumbersConstants.MaxInt32,
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
function evalActBlockEnemyUnitTypeArray(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): number[] {
    const defaultValue  = customBuildingData.getBlockEnemyUnitTypeArray();
    const act           = action.getActBlockEnemyUnitTypeArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            const gameConfig  = tile.getGameConfig();
            const unitTypeSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const unitType = NumbersUtils.getValueInRange({
                    minValue: 0,
                    maxValue: NumbersConstants.MaxInt32,
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
export async function applyWithoutExtraData(action: WeaSetCustomBuildingStateExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if ((!tile.getIsCustomizableBuilding()) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomBuildingData(action, tile, tile.getCustomBuildingData() ?? TilesConstantsDefaultCustomTileData.Building));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomBuildingData(action: WeaSetCustomBuildingStateExpr, tile: ITile, customBuildingData: ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData): ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData {
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
    return ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData.fromJson({
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
function applyNewTileDataDict(dict: Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData>, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomBuildingData] of dict) {
        const cfg       = tile.getTemplateCfg();
        const newData   = TilesUtilsSerialization.create({
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

            currentBuildPoint       : Math.min(tile.getCurrentBuildPoint(),     TilesUtilsCommon.getMaxBuildPoint(cfg, tileCustomBuildingData) ?? 0),
            currentCapturePoint     : Math.min(tile.getCurrentCapturePoint(),   TilesUtilsCommon.getMaxCapturePoint(cfg, tileCustomBuildingData) ?? 0),
            currentHp               : Math.min(tile.getCurrentHp(),             TilesUtilsCommon.getMaxHp(cfg, tileCustomBuildingData) ?? 0),

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
