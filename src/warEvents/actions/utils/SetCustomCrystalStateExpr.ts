import {
    Tiles_Utils_Serialization,
    Tiles_Constants_CustomLimits,
    WarEvents_Actions_Constants_SetCustomCrystalStateExpr,
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
import type { WeaSetCustomCrystalStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateExpr.ts";
import { TileCustomCrystalData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActRadius(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActPriority(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectSelf(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectAlly(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCanAffectEnemy(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActOffsetFund(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActOffsetEnergyPercentage(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActOffsetHp(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActCanBeFatal(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActOffsetFuelPercentage(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo          : WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0057, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetCustomCrystalStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActRadius()                      ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius.getTitleText()}: ${data.getActRadius()}`                                           : null,
        data.getActPriority()                    ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority.getTitleText()}: ${data.getActPriority()}`                                       : null,
        data.getActCanAffectSelf()               ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf.getTitleText()}: ${data.getActCanAffectSelf()}`                             : null,
        data.getActCanAffectAlly()               ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly.getTitleText()}: ${data.getActCanAffectAlly()}`                             : null,
        data.getActCanAffectEnemy()              ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy.getTitleText()}: ${data.getActCanAffectEnemy()}`                           : null,
        data.getActOffsetFund()                  ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund.getTitleText()}: ${data.getActOffsetFund()}`                                   : null,
        data.getActOffsetEnergyPercentage()      ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage.getTitleText()}: ${data.getActOffsetEnergyPercentage()}`           : null,
        data.getActOffsetHp()                    ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp.getTitleText()}: ${data.getActOffsetHp()}`                                       : null,
        data.getActCanBeFatal()                  ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal.getTitleText()}: ${data.getActCanBeFatal()}`                                   : null,
        data.getActOffsetFuelPercentage()        ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText()}: ${data.getActOffsetFuelPercentage()}`               : null,
        data.getActOffsetPrimaryAmmoPercentage() ? `${WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText()}: ${data.getActOffsetPrimaryAmmoPercentage()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0057, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomCrystalStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ConTileFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getConTileFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActRadius;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActRadius(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActPriority;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActPriority(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectSelf;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCanAffectSelf(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectAlly;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCanAffectAlly(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanAffectEnemy;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCanAffectEnemy(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFund;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetFund(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetEnergyPercentage;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetEnergyPercentage(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetHp;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActCanBeFatal;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActCanBeFatal(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetFuelPercentage;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetFuelPercentage(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetCustomCrystalStateExpr.ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActRadius(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getRadius();
    const act           = action.getActRadius();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue    : Tiles_Constants_CustomLimits.Crystal.Radius.MinValue,
                maxValue    : Tiles_Constants_CustomLimits.Crystal.Radius.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPriority(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getPriority();
    const act           = action.getActPriority();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue    : Tiles_Constants_CustomLimits.Crystal.Priority.MinValue,
                maxValue    : Tiles_Constants_CustomLimits.Crystal.Priority.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanAffectSelf(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): boolean {
    const defaultValue  = customCrystalData.getCanAffectSelf();
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
function evalActCanAffectAlly(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): boolean {
    const defaultValue  = customCrystalData.getCanAffectAlly();
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
function evalActCanAffectEnemy(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): boolean {
    const defaultValue  = customCrystalData.getCanAffectEnemy();
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
function evalActOffsetFund(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetFund();
    const act           = action.getActOffsetFund();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue    : Tiles_Constants_CustomLimits.Crystal.OffsetFund.MinValue,
                maxValue    : Tiles_Constants_CustomLimits.Crystal.OffsetFund.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetEnergyPercentage(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetEnergyPercentage();
    const act           = action.getActOffsetEnergyPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue    : Tiles_Constants_CustomLimits.Crystal.OffsetEnergyPercentage.MinValue,
                maxValue    : Tiles_Constants_CustomLimits.Crystal.OffsetEnergyPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetHp(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetHp();
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue    : Tiles_Constants_CustomLimits.Crystal.OffsetHp.MinValue,
                maxValue    : Tiles_Constants_CustomLimits.Crystal.OffsetHp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanBeFatal(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): boolean {
    const defaultValue  = !!customCrystalData.getCanBeFatal();
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
function evalActOffsetFuelPercentage(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetFuelPercentage();
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue    : Tiles_Constants_CustomLimits.Crystal.OffsetFuelPercentage.MinValue,
                maxValue    : Tiles_Constants_CustomLimits.Crystal.OffsetFuelPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetPrimaryAmmoPercentage();
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue    : Tiles_Constants_CustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MinValue,
                maxValue    : Tiles_Constants_CustomLimits.Crystal.OffsetPrimaryAmmoPercentage.MaxValue,
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
export async function applyWithoutExtraData(action: WeaSetCustomCrystalStateExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<Tiles_ITile.ITile, TileCustomCrystalData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        const customCrystalData = tile.getFinalCrystalData();
        if (customCrystalData == null) {
            continue;
        }

        if ((tile.getTileTypeId() !== Tiles_Constants_Common.TileTypeId.CustomCrystal) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomCrystalData(action, tile, customCrystalData));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomCrystalData(action: WeaSetCustomCrystalStateExpr, tile: Tiles_ITile.ITile, customCrystalData: TileCustomCrystalData): TileCustomCrystalData {
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

    return TileCustomCrystalData.fromJson({
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
function applyNewTileDataDict(dict: Map<Tiles_ITile.ITile, TileCustomCrystalData>, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomCrystalData] of dict) {
        const cfg       = tile.getTemplateCfg();
        const newData   = Tiles_Utils_Serialization.create({
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
