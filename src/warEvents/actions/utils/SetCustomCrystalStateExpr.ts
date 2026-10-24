import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateExpr.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import * as TilesConstantsCommon from "../../../tiles/constants/Common.ts";
import * as TilesConstantsCustomLimits from "../../../tiles/constants/CustomLimits.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as WarEventsActionsConstantsSetCustomCrystalStateExpr from "../constants/SetCustomCrystalStateExpr.ts";

type WeaSetCustomCrystalStateExpr   = ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateExpr.WeaSetCustomCrystalStateExpr;
type ITile                          = TilesITile.ITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActRadius(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActPriority(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectSelf(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectAlly(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectEnemy(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetFund(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetEnergyPercentage(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetHp(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCanBeFatal(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetFuelPercentage(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo          : WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0057, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActRadius()                      ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius.getTitleText()}: ${data.getActRadius()}`                                           : null,
        data.getActPriority()                    ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority.getTitleText()}: ${data.getActPriority()}`                                       : null,
        data.getActCanAffectSelf()               ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf.getTitleText()}: ${data.getActCanAffectSelf()}`                             : null,
        data.getActCanAffectAlly()               ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly.getTitleText()}: ${data.getActCanAffectAlly()}`                             : null,
        data.getActCanAffectEnemy()              ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy.getTitleText()}: ${data.getActCanAffectEnemy()}`                           : null,
        data.getActOffsetFund()                  ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund.getTitleText()}: ${data.getActOffsetFund()}`                                   : null,
        data.getActOffsetEnergyPercentage()      ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage.getTitleText()}: ${data.getActOffsetEnergyPercentage()}`           : null,
        data.getActOffsetHp()                    ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp.getTitleText()}: ${data.getActOffsetHp()}`                                       : null,
        data.getActCanBeFatal()                  ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal.getTitleText()}: ${data.getActCanBeFatal()}`                                   : null,
        data.getActOffsetFuelPercentage()        ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText()}: ${data.getActOffsetFuelPercentage()}`               : null,
        data.getActOffsetPrimaryAmmoPercentage() ? `${WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText()}: ${data.getActOffsetPrimaryAmmoPercentage()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0057, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomCrystalStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActRadius(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority;
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
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf;
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
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly;
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
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy;
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
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetFund(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetEnergyPercentage(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp;
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
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal;
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
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage;
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
        const info      = WarEventsActionsConstantsSetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage;
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

function checkIsMeetConditionForTile(action: WeaSetCustomCrystalStateExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActRadius(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getRadius() ?? 0;
    const act           = action.getActRadius();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Crystal.Radius.MinValue,
                maxValue    : TilesConstantsCustomLimits.Crystal.Radius.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPriority(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Crystal.Priority.MinValue,
                maxValue    : TilesConstantsCustomLimits.Crystal.Priority.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanAffectSelf(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): boolean {
    const defaultValue  = customCrystalData.getCanAffectSelf() ?? false;
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
function evalActCanAffectAlly(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): boolean {
    const defaultValue  = customCrystalData.getCanAffectAlly() ?? false;
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
function evalActCanAffectEnemy(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): boolean {
    const defaultValue  = customCrystalData.getCanAffectEnemy() ?? false;
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
function evalActOffsetFund(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetFund() ?? 0;
    const act           = action.getActOffsetFund();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Crystal.OffsetFund.MinValue,
                maxValue    : TilesConstantsCustomLimits.Crystal.OffsetFund.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetEnergyPercentage(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetEnergyPercentage() ?? 0;
    const act           = action.getActOffsetEnergyPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Crystal.OffsetEnergyPercentage.MinValue,
                maxValue    : TilesConstantsCustomLimits.Crystal.OffsetEnergyPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetHp(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Crystal.OffsetHp.MinValue,
                maxValue    : TilesConstantsCustomLimits.Crystal.OffsetHp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanBeFatal(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): boolean {
    const defaultValue  = !!customCrystalData.getCanBeFatal();
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
function evalActOffsetFuelPercentage(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Crystal.OffsetFuelPercentage.MinValue,
                maxValue    : TilesConstantsCustomLimits.Crystal.OffsetFuelPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : TilesConstantsCustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MinValue,
                maxValue    : TilesConstantsCustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MaxValue,
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
export async function applyWithExtraData(_action: WeaSetCustomCrystalStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomCrystalStateExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        const customCrystalData = tile.getFinalCrystalData();
        if (customCrystalData == null) {
            continue;
        }

        if ((tile.getTileTypeId() !== TilesConstantsCommon.TileTypeId.CustomCrystal) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomCrystalData(action, tile, customCrystalData));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomCrystalData(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData): ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData {
    const radius                        = evalActRadius(action, tile, customCrystalData);
    const priority                      = evalActPriority(action, tile, customCrystalData);
    const canAffectSelf                 = evalActCanAffectSelf(action, tile, customCrystalData);
    const canAffectAlly                 = evalActCanAffectAlly(action, tile, customCrystalData);
    const canAffectEnemy                = evalActCanAffectEnemy(action, tile, customCrystalData);
    const offsetFund                    = evalActOffsetFund(action, tile, customCrystalData);
    const offsetEnergyPercentage        = evalActOffsetEnergyPercentage(action, tile, customCrystalData);
    const offsetHp                      = evalActOffsetHp(action, tile, customCrystalData);
    const canBeFatal                    = evalActCanBeFatal(action, tile, customCrystalData);
    const offsetFuelPercentage          = evalActOffsetFuelPercentage(action, tile, customCrystalData);
    const offsetPrimaryAmmoPercentage   = evalActOffsetPrimaryAmmoPercentage(action, tile, customCrystalData);

    return ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData.fromJson({
        radius                          : radius,
        priority                        : priority,
        canAffectSelf                   : canAffectSelf,
        canAffectAlly                   : canAffectAlly,
        canAffectEnemy                  : canAffectEnemy,
        offsetFund                      : offsetFund,
        offsetEnergyPercentage          : offsetEnergyPercentage,
        offsetHp                        : offsetHp,
        canBeFatal                      : canBeFatal,
        offsetFuelPercentage            : offsetFuelPercentage,
        offsetPrimaryAmmoPercentage     : offsetPrimaryAmmoPercentage,
    });
}
function applyNewTileDataDict(dict: Map<ITile, ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData>, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomCrystalData] of dict) {
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
            customCrystalData       : tileCustomCrystalData.toJson(),
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
