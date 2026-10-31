import {
    Tiles_Utils_Serialization,
    WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr,
    Lang_Utils,
    Numbers_Utils,
    Tiles_Constants_CustomLimits,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    Tiles_Constants_Common,
    type BaseWar_Interface_IBwWar,
    type Tiles_Tile,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetCustomLaserTurretStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomLaserTurretStateExpr.ts";
import { TileCustomLaserTurretData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomLaserTurretStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConTileFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRangeForUp(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForUp,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRangeForDown(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForDown,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRangeForLeft(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForLeft,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActRangeForRight(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForRight,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActPriority(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActPriority,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCanAffectSelf(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectSelf,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCanAffectAlly(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectAlly,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCanAffectEnemy(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectEnemy,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActOffsetHp(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetHp,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCanBeFatal(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanBeFatal,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActOffsetFuelPercentage(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo       : WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomLaserTurretStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0058, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomLaserTurretStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActRangeForUp()                  ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForUp.getTitleText()}: ${data.getActRangeForUp()}`                                   : null,
        data.getActRangeForDown()                ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForDown.getTitleText()}: ${data.getActRangeForDown()}`                               : null,
        data.getActRangeForLeft()                ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForLeft.getTitleText()}: ${data.getActRangeForLeft()}`                               : null,
        data.getActRangeForRight()               ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForRight.getTitleText()}: ${data.getActRangeForRight()}`                             : null,
        data.getActPriority()                    ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActPriority.getTitleText()}: ${data.getActPriority()}`                                       : null,
        data.getActCanAffectSelf()               ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectSelf.getTitleText()}: ${data.getActCanAffectSelf()}`                             : null,
        data.getActCanAffectAlly()               ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectAlly.getTitleText()}: ${data.getActCanAffectAlly()}`                             : null,
        data.getActCanAffectEnemy()              ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectEnemy.getTitleText()}: ${data.getActCanAffectEnemy()}`                           : null,
        data.getActOffsetHp()                    ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetHp.getTitleText()}: ${data.getActOffsetHp()}`                                       : null,
        data.getActCanBeFatal()                  ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanBeFatal.getTitleText()}: ${data.getActCanBeFatal()}`                                   : null,
        data.getActOffsetFuelPercentage()        ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText()}: ${data.getActOffsetFuelPercentage()}`               : null,
        data.getActOffsetPrimaryAmmoPercentage() ? `${WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText()}: ${data.getActOffsetPrimaryAmmoPercentage()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0058, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomLaserTurretStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForUp;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForDown;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForLeft;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActRangeForRight;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActPriority;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectSelf;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectAlly;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanAffectEnemy;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetHp;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActCanBeFatal;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage;
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
        const info      = WarEvents_Actions_Constants_SetCustomLaserTurretStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage;
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

function checkIsMeetConditionForTile(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActRangeForUp(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForUp();
    const act           = action.getActRangeForUp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.LaserTurret.RangeForUp.MinValue,
                maxValue : Tiles_Constants_CustomLimits.LaserTurret.RangeForUp.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForDown(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForDown();
    const act           = action.getActRangeForDown();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.LaserTurret.RangeForDown.MinValue,
                maxValue : Tiles_Constants_CustomLimits.LaserTurret.RangeForDown.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForLeft(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForLeft();
    const act           = action.getActRangeForLeft();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.LaserTurret.RangeForLeft.MinValue,
                maxValue : Tiles_Constants_CustomLimits.LaserTurret.RangeForLeft.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForRight(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForRight();
    const act           = action.getActRangeForRight();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.LaserTurret.RangeForRight.MinValue,
                maxValue : Tiles_Constants_CustomLimits.LaserTurret.RangeForRight.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPriority(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getPriority();
    const act           = action.getActPriority();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.LaserTurret.Priority.MinValue,
                maxValue : Tiles_Constants_CustomLimits.LaserTurret.Priority.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanAffectSelf(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): boolean {
    const defaultValue  = customLaserTurretData.getCanAffectSelf();
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
function evalActCanAffectAlly(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): boolean {
    const defaultValue  = customLaserTurretData.getCanAffectAlly();
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
function evalActCanAffectEnemy(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): boolean {
    const defaultValue  = customLaserTurretData.getCanAffectEnemy();
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
function evalActOffsetHp(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getOffsetHp();
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.LaserTurret.OffsetHp.MinValue,
                maxValue : Tiles_Constants_CustomLimits.LaserTurret.OffsetHp.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanBeFatal(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customCannonData: TileCustomLaserTurretData): boolean {
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
function evalActOffsetFuelPercentage(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getOffsetFuelPercentage();
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.LaserTurret.OffsetFuelPercentage.MinValue,
                maxValue : Tiles_Constants_CustomLimits.LaserTurret.OffsetFuelPercentage.MaxValue,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getOffsetPrimaryAmmoPercentage();
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Tiles_Constants_CustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MinValue,
                maxValue : Tiles_Constants_CustomLimits.LaserTurret.OffsetPrimaryAmmoPercentage.MaxValue,
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
export async function applyWithExtraData(_action: WeaSetCustomLaserTurretStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetCustomLaserTurretStateExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<Tiles_Tile.Tile, TileCustomLaserTurretData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        const customLaserTurretData = tile.getFinalLaserTurretData();
        if (customLaserTurretData == null) {
            continue;
        }

        if ((tile.getTileTypeId() !== Tiles_Constants_Common.TileTypeId.CustomLaserTurret) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomLaserTurretData(action, tile, customLaserTurretData));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomLaserTurretData(action: WeaSetCustomLaserTurretStateExpr, tile: Tiles_Tile.Tile, customLaserTurretData: TileCustomLaserTurretData): TileCustomLaserTurretData {
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

    return TileCustomLaserTurretData.fromJson({
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
function applyNewTileDataDict(dict: Map<Tiles_Tile.Tile, TileCustomLaserTurretData>, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomLaserTurretData] of dict) {
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
            customCannonData      : null,
            customLaserTurretData : tileCustomLaserTurretData.toJson(),
        });

        tile.init(newData, tile.getGameConfig());
        tile.startRunning(war);

        // tile.startRunningView();
        if (!isFast) {
            tile.flushDataToView();
        }
    }
}
