import {
    Tiles_Constants_CustomLimits,
    Tiles_Utils_Serialization,
    WarEvents_Actions_Constants_SetCustomCannonStateExpr,
    Lang_Utils,
    Numbers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    Tiles_Constants_Common,
    type BaseWar_Interface_IBwWar,
    type Tiles_ITile,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetCustomCannonStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateExpr.ts";
import { TileCustomCannonData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCannonStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConTileFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRangeForUp(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForUp,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRangeForDown(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForDown,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRangeForLeft(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForLeft,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRangeForRight(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForRight,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActPriority(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActPriority,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCanAffectSelf(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectSelf,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCanAffectAlly(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectAlly,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCanAffectEnemy(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectEnemy,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActMaxTargetCount(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActMaxTargetCount,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActOffsetHp(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetHp,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCanBeFatal(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanBeFatal,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActOffsetFuelPercentage(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCannonStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0058, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCannonStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActRangeForUp()                  ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForUp.getTitleText()}: ${data.getActRangeForUp()}`                                   : null,
        data.getActRangeForDown()                ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForDown.getTitleText()}: ${data.getActRangeForDown()}`                               : null,
        data.getActRangeForLeft()                ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForLeft.getTitleText()}: ${data.getActRangeForLeft()}`                               : null,
        data.getActRangeForRight()               ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForRight.getTitleText()}: ${data.getActRangeForRight()}`                             : null,
        data.getActPriority()                    ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActPriority.getTitleText()}: ${data.getActPriority()}`                                       : null,
        data.getActCanAffectSelf()               ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectSelf.getTitleText()}: ${data.getActCanAffectSelf()}`                             : null,
        data.getActCanAffectAlly()               ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectAlly.getTitleText()}: ${data.getActCanAffectAlly()}`                             : null,
        data.getActCanAffectEnemy()              ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectEnemy.getTitleText()}: ${data.getActCanAffectEnemy()}`                           : null,
        data.getActMaxTargetCount()              ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActMaxTargetCount.getTitleText()}: ${data.getActMaxTargetCount()}`                           : null,
        data.getActOffsetHp()                    ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetHp.getTitleText()}: ${data.getActOffsetHp()}`                                       : null,
        data.getActCanBeFatal()                  ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanBeFatal.getTitleText()}: ${data.getActCanBeFatal()}`                                   : null,
        data.getActOffsetFuelPercentage()        ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText()}: ${data.getActOffsetFuelPercentage()}`               : null,
        data.getActOffsetPrimaryAmmoPercentage() ? `${WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText()}: ${data.getActOffsetPrimaryAmmoPercentage()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0058, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomCannonStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForUp;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActRangeForUp(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForDown;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActRangeForDown(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForLeft;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActRangeForLeft(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActRangeForRight;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActRangeForRight(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActPriority;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActPriority(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectSelf;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCanAffectSelf(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectAlly;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCanAffectAlly(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanAffectEnemy;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCanAffectEnemy(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActMaxTargetCount;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActMaxTargetCount(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetHp;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActOffsetHp(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActCanBeFatal;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCanBeFatal(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActOffsetFuelPercentage(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCannonStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActRangeForUp(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForUp();
    const act           = action.getActRangeForUp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Cannon.RangeForUp.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Cannon.RangeForUp.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForDown(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForDown();
    const act           = action.getActRangeForDown();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Cannon.RangeForDown.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Cannon.RangeForDown.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForLeft(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForLeft();
    const act           = action.getActRangeForLeft();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Cannon.RangeForLeft.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Cannon.RangeForLeft.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForRight(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForRight();
    const act           = action.getActRangeForRight();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Cannon.RangeForRight.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Cannon.RangeForRight.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPriority(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getPriority();
    const act           = action.getActPriority();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Cannon.Priority.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Cannon.Priority.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanAffectSelf(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): boolean {
    const defaultValue  = customCannonData.getCanAffectSelf();
    const act           = action.getActCanAffectSelf();
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
function evalActCanAffectAlly(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): boolean {
    const defaultValue  = customCannonData.getCanAffectAlly();
    const act           = action.getActCanAffectAlly();
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
function evalActCanAffectEnemy(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): boolean {
    const defaultValue  = customCannonData.getCanAffectEnemy();
    const act           = action.getActCanAffectEnemy();
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
function evalActMaxTargetCount(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getMaxTargetCount();
    const act           = action.getActMaxTargetCount();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Cannon.MaxTargetCount.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Cannon.MaxTargetCount.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetHp(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getOffsetHp();
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Cannon.OffsetHp.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Cannon.OffsetHp.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanBeFatal(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): boolean {
    const defaultValue  = !!customCannonData.getCanBeFatal();
    const act           = action.getActCanBeFatal();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return !!epResult.num;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetFuelPercentage(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getOffsetFuelPercentage();
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Cannon.OffsetFuelPercentage.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Cannon.OffsetFuelPercentage.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getOffsetPrimaryAmmoPercentage();
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MinValue,
                maxValue : Tiles_Constants_CustomLimits.Cannon.OffsetPrimaryAmmoPercentage.MaxValue,
                rawValue : Math.floor(epResult.num),
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
export async function applyWithoutExtraData(action: WeaSetCustomCannonStateExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<Tiles_ITile.ITile, TileCustomCannonData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        const customCannonData = tile.getFinalCannonData();
        if (customCannonData == null) {
            continue;
        }

        if ((tile.getTileTypeId() !== Tiles_Constants_Common.TileTypeId.CustomCannon) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomCannonData(action, tile, customCannonData));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomCannonData(action: WeaSetCustomCannonStateExpr, tile: Tiles_ITile.ITile, customCannonData: TileCustomCannonData): TileCustomCannonData {
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

    return TileCustomCannonData.fromJson({
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
function applyNewTileDataDict(dict: Map<Tiles_ITile.ITile, TileCustomCannonData>, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomCannonData] of dict) {
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

            currentBuildPoint   : Math.min(tile.getCurrentBuildPoint(),     cfg.getMaxBuildPoint() ?? 0),
            currentCapturePoint : Math.min(tile.getCurrentCapturePoint(),   cfg.getMaxCapturePoint() ?? 0),
            currentHp           : Math.min(tile.getCurrentHp(),             cfg.getMaxHp() ?? 0),

            customBuildingData    : null,
            customCrystalData     : null,
            customCannonData      : tileCustomCannonData.toJson(),
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
