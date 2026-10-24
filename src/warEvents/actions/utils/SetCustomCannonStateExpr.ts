import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomCannonStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateExpr.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomCannonData from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import * as TilesConstantsCommon from "../../../tiles/constants/Common.ts";
import * as TilesConstantsCustomLimits from "../../../tiles/constants/CustomLimits.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as WarEventsActionsConstantsSetCustomCannonStateExpr from "../constants/SetCustomCannonStateExpr.ts";

type WeaSetCustomCannonStateExpr    = ProtoSchemaCommonProtoWarEventWeaSetCustomCannonStateExpr.WeaSetCustomCannonStateExpr;
type ITile                          = TilesITile.ITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCannonStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRangeForUp(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForUp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRangeForDown(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForDown,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRangeForLeft(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForLeft,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRangeForRight(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForRight,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActPriority(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActPriority,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectSelf(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectSelf,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectAlly(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectAlly,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectEnemy(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectEnemy,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActMaxTargetCount(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActMaxTargetCount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetHp(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanBeFatal(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanBeFatal,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetFuelPercentage(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCannonStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0058, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCannonStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActRangeForUp()                  ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForUp.getTitleText()}: ${data.getActRangeForUp()}`                                   : null,
        data.getActRangeForDown()                ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForDown.getTitleText()}: ${data.getActRangeForDown()}`                               : null,
        data.getActRangeForLeft()                ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForLeft.getTitleText()}: ${data.getActRangeForLeft()}`                               : null,
        data.getActRangeForRight()               ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForRight.getTitleText()}: ${data.getActRangeForRight()}`                             : null,
        data.getActPriority()                    ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActPriority.getTitleText()}: ${data.getActPriority()}`                                       : null,
        data.getActCanAffectSelf()               ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectSelf.getTitleText()}: ${data.getActCanAffectSelf()}`                             : null,
        data.getActCanAffectAlly()               ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectAlly.getTitleText()}: ${data.getActCanAffectAlly()}`                             : null,
        data.getActCanAffectEnemy()              ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectEnemy.getTitleText()}: ${data.getActCanAffectEnemy()}`                           : null,
        data.getActMaxTargetCount()              ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActMaxTargetCount.getTitleText()}: ${data.getActMaxTargetCount()}`                           : null,
        data.getActOffsetHp()                    ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetHp.getTitleText()}: ${data.getActOffsetHp()}`                                       : null,
        data.getActCanBeFatal()                  ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanBeFatal.getTitleText()}: ${data.getActCanBeFatal()}`                                   : null,
        data.getActOffsetFuelPercentage()        ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText()}: ${data.getActOffsetFuelPercentage()}`               : null,
        data.getActOffsetPrimaryAmmoPercentage() ? `${WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText()}: ${data.getActOffsetPrimaryAmmoPercentage()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0058, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomCannonStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForUp;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActRangeForUp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForDown;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActRangeForDown(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForLeft;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActRangeForLeft(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForRight;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActRangeForRight(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActPriority;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActPriority(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectSelf;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCanAffectSelf(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectAlly;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCanAffectAlly(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectEnemy;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCanAffectEnemy(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActMaxTargetCount;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActMaxTargetCount(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetHp;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActCanBeFatal;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCanBeFatal(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetFuelPercentage(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetCustomCannonStateExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActRangeForUp(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForUp() ?? 0;
    const act           = action.getActRangeForUp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Cannon.RangeForUp.MinValue,
                maxValue    : TilesConstantsCustomLimits.Cannon.RangeForUp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForDown(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForDown() ?? 0;
    const act           = action.getActRangeForDown();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Cannon.RangeForDown.MinValue,
                maxValue    : TilesConstantsCustomLimits.Cannon.RangeForDown.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForLeft(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForLeft() ?? 0;
    const act           = action.getActRangeForLeft();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Cannon.RangeForLeft.MinValue,
                maxValue    : TilesConstantsCustomLimits.Cannon.RangeForLeft.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForRight(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForRight() ?? 0;
    const act           = action.getActRangeForRight();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Cannon.RangeForRight.MinValue,
                maxValue    : TilesConstantsCustomLimits.Cannon.RangeForRight.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPriority(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): number {
    const defaultValue  = customCannonData.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Cannon.Priority.MinValue,
                maxValue    : TilesConstantsCustomLimits.Cannon.Priority.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanAffectSelf(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): boolean {
    const defaultValue  = customCannonData.getCanAffectSelf() ?? false;
    const act           = action.getActCanAffectSelf();
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
function evalActCanAffectAlly(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): boolean {
    const defaultValue  = customCannonData.getCanAffectAlly() ?? false;
    const act           = action.getActCanAffectAlly();
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
function evalActCanAffectEnemy(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): boolean {
    const defaultValue  = customCannonData.getCanAffectEnemy() ?? false;
    const act           = action.getActCanAffectEnemy();
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
function evalActMaxTargetCount(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): number {
    const defaultValue  = customCannonData.getMaxTargetCount() ?? 0;
    const act           = action.getActMaxTargetCount();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Cannon.MaxTargetCount.MinValue,
                maxValue    : TilesConstantsCustomLimits.Cannon.MaxTargetCount.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetHp(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): number {
    const defaultValue  = customCannonData.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Cannon.OffsetHp.MinValue,
                maxValue    : TilesConstantsCustomLimits.Cannon.OffsetHp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanBeFatal(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): boolean {
    const defaultValue  = !!customCannonData.getCanBeFatal();
    const act           = action.getActCanBeFatal();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return !!epResult.num;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetFuelPercentage(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): number {
    const defaultValue  = customCannonData.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Cannon.OffsetFuelPercentage.MinValue,
                maxValue    : TilesConstantsCustomLimits.Cannon.OffsetFuelPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): number {
    const defaultValue  = customCannonData.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MinValue,
                maxValue    : TilesConstantsCustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetCustomCannonStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomCannonStateExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        const customCannonData = tile.getFinalCannonData();
        if (customCannonData == null) {
            continue;
        }

        if ((tile.getTileTypeId() !== TilesConstantsCommon.TileTypeId.CustomCannon) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomCannonData(action, tile, customCannonData));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomCannonData(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData): ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData {
    const rangeForUp                    = evalActRangeForUp(action, tile, customCannonData);
    const rangeForDown                  = evalActRangeForDown(action, tile, customCannonData);
    const rangeForLeft                  = evalActRangeForLeft(action, tile, customCannonData);
    const rangeForRight                 = evalActRangeForRight(action, tile, customCannonData);
    const priority                      = evalActPriority(action, tile, customCannonData);
    const canAffectSelf                 = evalActCanAffectSelf(action, tile, customCannonData);
    const canAffectAlly                 = evalActCanAffectAlly(action, tile, customCannonData);
    const canAffectEnemy                = evalActCanAffectEnemy(action, tile, customCannonData);
    const maxTargetCount                = evalActMaxTargetCount(action, tile, customCannonData);
    const offsetHp                      = evalActOffsetHp(action, tile, customCannonData);
    const canBeFatal                    = evalActCanBeFatal(action, tile, customCannonData);
    const offsetFuelPercentage          = evalActOffsetFuelPercentage(action, tile, customCannonData);
    const offsetPrimaryAmmoPercentage   = evalActOffsetPrimaryAmmoPercentage(action, tile, customCannonData);

    return ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData.fromJson({
        rangeForUp                  : rangeForUp,
        rangeForDown                : rangeForDown,
        rangeForLeft                : rangeForLeft,
        rangeForRight               : rangeForRight,
        priority                    : priority,
        canAffectSelf               : canAffectSelf,
        canAffectAlly               : canAffectAlly,
        canAffectEnemy              : canAffectEnemy,
        maxTargetCount              : maxTargetCount,
        offsetHp                    : offsetHp,
        canBeFatal                  : canBeFatal,
        offsetFuelPercentage        : offsetFuelPercentage,
        offsetPrimaryAmmoPercentage : offsetPrimaryAmmoPercentage,
    });
}
function applyNewTileDataDict(dict: Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData>, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomCannonData] of dict) {
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

            currentBuildPoint       : Math.min(tile.getCurrentBuildPoint(),     cfg.getMaxBuildPoint() ?? 0),
            currentCapturePoint     : Math.min(tile.getCurrentCapturePoint(),   cfg.getMaxCapturePoint() ?? 0),
            currentHp               : Math.min(tile.getCurrentHp(),             cfg.getMaxHp() ?? 0),

            customBuildingData      : null,
            customCrystalData       : null,
            customCannonData        : tileCustomCannonData.toJson(),
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
