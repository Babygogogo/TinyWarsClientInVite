import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomLaserTurretStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomLaserTurretStateExpr.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData from "../../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";
import * as TilesConstantsCommon from "../../../tiles/constants/Common.ts";
import * as TilesConstantsCustomLimits from "../../../tiles/constants/CustomLimits.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as WarEventsActionsConstantsSetCustomLaserTurretStateExpr from "../constants/SetCustomLaserTurretStateExpr.ts";

type WeaSetCustomLaserTurretStateExpr   = ProtoSchemaCommonProtoWarEventWeaSetCustomLaserTurretStateExpr.WeaSetCustomLaserTurretStateExpr;
type ITile                              = TilesITile.ITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomLaserTurretStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRangeForUp(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForUp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRangeForDown(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForDown,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRangeForLeft(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForLeft,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRangeForRight(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForRight,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActPriority(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActPriority,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectSelf(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectSelf,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectAlly(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectAlly,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectEnemy(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectEnemy,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetHp(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanBeFatal(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanBeFatal,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetFuelPercentage(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo          : WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomLaserTurretStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0058, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomLaserTurretStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActRangeForUp()                  ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForUp.getTitleText()}: ${data.getActRangeForUp()}`                                   : null,
        data.getActRangeForDown()                ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForDown.getTitleText()}: ${data.getActRangeForDown()}`                               : null,
        data.getActRangeForLeft()                ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForLeft.getTitleText()}: ${data.getActRangeForLeft()}`                               : null,
        data.getActRangeForRight()               ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForRight.getTitleText()}: ${data.getActRangeForRight()}`                             : null,
        data.getActPriority()                    ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActPriority.getTitleText()}: ${data.getActPriority()}`                                       : null,
        data.getActCanAffectSelf()               ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectSelf.getTitleText()}: ${data.getActCanAffectSelf()}`                             : null,
        data.getActCanAffectAlly()               ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectAlly.getTitleText()}: ${data.getActCanAffectAlly()}`                             : null,
        data.getActCanAffectEnemy()              ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectEnemy.getTitleText()}: ${data.getActCanAffectEnemy()}`                           : null,
        data.getActOffsetHp()                    ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetHp.getTitleText()}: ${data.getActOffsetHp()}`                                       : null,
        data.getActCanBeFatal()                  ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanBeFatal.getTitleText()}: ${data.getActCanBeFatal()}`                                   : null,
        data.getActOffsetFuelPercentage()        ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText()}: ${data.getActOffsetFuelPercentage()}`               : null,
        data.getActOffsetPrimaryAmmoPercentage() ? `${WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText()}: ${data.getActOffsetPrimaryAmmoPercentage()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0058, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomLaserTurretStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForUp;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForDown;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForLeft;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForRight;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActPriority;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectSelf;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectAlly;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectEnemy;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetHp;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanBeFatal;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage;
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
        const info      = WarEventsActionsConstantsSetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage;
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

function checkIsMeetConditionForTile(action: WeaSetCustomLaserTurretStateExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActRangeForUp(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForUp() ?? 0;
    const act           = action.getActRangeForUp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.LaserTurret.RangeForUp.MinValue,
                maxValue    : TilesConstantsCustomLimits.LaserTurret.RangeForUp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForDown(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForDown() ?? 0;
    const act           = action.getActRangeForDown();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.LaserTurret.RangeForDown.MinValue,
                maxValue    : TilesConstantsCustomLimits.LaserTurret.RangeForDown.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForLeft(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForLeft() ?? 0;
    const act           = action.getActRangeForLeft();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.LaserTurret.RangeForLeft.MinValue,
                maxValue    : TilesConstantsCustomLimits.LaserTurret.RangeForLeft.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForRight(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForRight() ?? 0;
    const act           = action.getActRangeForRight();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.LaserTurret.RangeForRight.MinValue,
                maxValue    : TilesConstantsCustomLimits.LaserTurret.RangeForRight.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPriority(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.LaserTurret.Priority.MinValue,
                maxValue    : TilesConstantsCustomLimits.LaserTurret.Priority.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanAffectSelf(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): boolean {
    const defaultValue  = customLaserTurretData.getCanAffectSelf() ?? false;
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
function evalActCanAffectAlly(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): boolean {
    const defaultValue  = customLaserTurretData.getCanAffectAlly() ?? false;
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
function evalActCanAffectEnemy(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): boolean {
    const defaultValue  = customLaserTurretData.getCanAffectEnemy() ?? false;
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
function evalActOffsetHp(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.LaserTurret.OffsetHp.MinValue,
                maxValue    : TilesConstantsCustomLimits.LaserTurret.OffsetHp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanBeFatal(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customCannonData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): boolean {
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
function evalActOffsetFuelPercentage(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.LaserTurret.OffsetFuelPercentage.MinValue,
                maxValue    : TilesConstantsCustomLimits.LaserTurret.OffsetFuelPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MinValue,
                maxValue    : TilesConstantsCustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MaxValue,
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
export async function applyWithExtraData(_action: WeaSetCustomLaserTurretStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomLaserTurretStateExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        const customLaserTurretData = tile.getFinalLaserTurretData();
        if (customLaserTurretData == null) {
            continue;
        }

        if ((tile.getTileTypeId() !== TilesConstantsCommon.TileTypeId.CustomLaserTurret) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomLaserTurretData(action, tile, customLaserTurretData));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomLaserTurretData(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData): ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData {
    const rangeForUp                    = evalActRangeForUp(action, tile, customLaserTurretData);
    const rangeForDown                  = evalActRangeForDown(action, tile, customLaserTurretData);
    const rangeForLeft                  = evalActRangeForLeft(action, tile, customLaserTurretData);
    const rangeForRight                 = evalActRangeForRight(action, tile, customLaserTurretData);
    const priority                      = evalActPriority(action, tile, customLaserTurretData);
    const canAffectSelf                 = evalActCanAffectSelf(action, tile, customLaserTurretData);
    const canAffectAlly                 = evalActCanAffectAlly(action, tile, customLaserTurretData);
    const canAffectEnemy                = evalActCanAffectEnemy(action, tile, customLaserTurretData);
    const offsetHp                      = evalActOffsetHp(action, tile, customLaserTurretData);
    const canBeFatal                    = evalActCanBeFatal(action, tile, customLaserTurretData);
    const offsetFuelPercentage          = evalActOffsetFuelPercentage(action, tile, customLaserTurretData);
    const offsetPrimaryAmmoPercentage   = evalActOffsetPrimaryAmmoPercentage(action, tile, customLaserTurretData);

    return ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData.fromJson({
        rangeForUp                  : rangeForUp,
        rangeForDown                : rangeForDown,
        rangeForLeft                : rangeForLeft,
        rangeForRight               : rangeForRight,
        priority                    : priority,
        canAffectSelf               : canAffectSelf,
        canAffectAlly               : canAffectAlly,
        canAffectEnemy              : canAffectEnemy,
        offsetHp                    : offsetHp,
        canBeFatal                  : canBeFatal,
        offsetFuelPercentage        : offsetFuelPercentage,
        offsetPrimaryAmmoPercentage : offsetPrimaryAmmoPercentage,
    });
}
function applyNewTileDataDict(dict: Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData>, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomLaserTurretData] of dict) {
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
            customCannonData        : null,
            customLaserTurretData   : tileCustomLaserTurretData.toJson(),
        });

        tile.init(newData, tile.getGameConfig());
        tile.startRunning(war);

        // tile.startRunningView();
        if (!isFast) {
            tile.flushDataToView();
        }
    }
}
