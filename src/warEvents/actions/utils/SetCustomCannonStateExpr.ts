import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import {
    TextType,
    UndefinedError,
} from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type { WeaSetCustomCannonStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCannonStateExpr.ts";
import { TileCustomCannonData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import { TileTypeId } from "../../../tiles/constants/Common.ts";
import { Cannon } from "../../../tiles/constants/CustomLimits.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import { create } from "../../../tiles/utils/Serialization.ts";
import { ExpressionInfoDict } from "../constants/SetCustomCannonStateExpr.ts";

export function checkIsValid(action: Undefinable<WeaSetCustomCannonStateExpr>, customCounterNameSet: Set<string>): boolean {
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
            str                     : action.getActRangeForUp(),
            expressionInfo          : ExpressionInfoDict.ActRangeForUp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActRangeForDown(),
            expressionInfo          : ExpressionInfoDict.ActRangeForDown,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActRangeForLeft(),
            expressionInfo          : ExpressionInfoDict.ActRangeForLeft,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActRangeForRight(),
            expressionInfo          : ExpressionInfoDict.ActRangeForRight,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActPriority(),
            expressionInfo          : ExpressionInfoDict.ActPriority,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCanAffectSelf(),
            expressionInfo          : ExpressionInfoDict.ActCanAffectSelf,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCanAffectAlly(),
            expressionInfo          : ExpressionInfoDict.ActCanAffectAlly,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCanAffectEnemy(),
            expressionInfo          : ExpressionInfoDict.ActCanAffectEnemy,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActMaxTargetCount(),
            expressionInfo          : ExpressionInfoDict.ActMaxTargetCount,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActOffsetHp(),
            expressionInfo          : ExpressionInfoDict.ActOffsetHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCanBeFatal(),
            expressionInfo          : ExpressionInfoDict.ActCanBeFatal,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActOffsetFuelPercentage(),
            expressionInfo          : ExpressionInfoDict.ActOffsetFuelPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo          : ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetCustomCannonStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0058, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetCustomCannonStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActRangeForUp()                  ? `${ExpressionInfoDict.ActRangeForUp.getTitleText()}: ${data.getActRangeForUp()}`                                   : null,
        data.getActRangeForDown()                ? `${ExpressionInfoDict.ActRangeForDown.getTitleText()}: ${data.getActRangeForDown()}`                               : null,
        data.getActRangeForLeft()                ? `${ExpressionInfoDict.ActRangeForLeft.getTitleText()}: ${data.getActRangeForLeft()}`                               : null,
        data.getActRangeForRight()               ? `${ExpressionInfoDict.ActRangeForRight.getTitleText()}: ${data.getActRangeForRight()}`                             : null,
        data.getActPriority()                    ? `${ExpressionInfoDict.ActPriority.getTitleText()}: ${data.getActPriority()}`                                       : null,
        data.getActCanAffectSelf()               ? `${ExpressionInfoDict.ActCanAffectSelf.getTitleText()}: ${data.getActCanAffectSelf()}`                             : null,
        data.getActCanAffectAlly()               ? `${ExpressionInfoDict.ActCanAffectAlly.getTitleText()}: ${data.getActCanAffectAlly()}`                             : null,
        data.getActCanAffectEnemy()              ? `${ExpressionInfoDict.ActCanAffectEnemy.getTitleText()}: ${data.getActCanAffectEnemy()}`                           : null,
        data.getActMaxTargetCount()              ? `${ExpressionInfoDict.ActMaxTargetCount.getTitleText()}: ${data.getActMaxTargetCount()}`                           : null,
        data.getActOffsetHp()                    ? `${ExpressionInfoDict.ActOffsetHp.getTitleText()}: ${data.getActOffsetHp()}`                                       : null,
        data.getActCanBeFatal()                  ? `${ExpressionInfoDict.ActCanBeFatal.getTitleText()}: ${data.getActCanBeFatal()}`                                   : null,
        data.getActOffsetFuelPercentage()        ? `${ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText()}: ${data.getActOffsetFuelPercentage()}`               : null,
        data.getActOffsetPrimaryAmmoPercentage() ? `${ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText()}: ${data.getActOffsetPrimaryAmmoPercentage()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0058, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomCannonStateExpr, customCounterNameSet: Set<string>): string | null {
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
        const info      = ExpressionInfoDict.ActRangeForUp;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActRangeForUp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActRangeForDown;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActRangeForDown(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActRangeForLeft;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActRangeForLeft(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActRangeForRight;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActRangeForRight(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActPriority;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActPriority(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCanAffectSelf;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCanAffectSelf(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCanAffectAlly;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCanAffectAlly(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCanAffectEnemy;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCanAffectEnemy(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActMaxTargetCount;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActMaxTargetCount(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActOffsetHp;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActOffsetHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCanBeFatal;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCanBeFatal(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActOffsetFuelPercentage;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActOffsetFuelPercentage(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActOffsetPrimaryAmmoPercentage(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetCustomCannonStateExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActRangeForUp(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForUp();
    const act           = action.getActRangeForUp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Cannon.RangeForUp.MinValue,
                maxValue    : Cannon.RangeForUp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForDown(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForDown();
    const act           = action.getActRangeForDown();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Cannon.RangeForDown.MinValue,
                maxValue    : Cannon.RangeForDown.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForLeft(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForLeft();
    const act           = action.getActRangeForLeft();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Cannon.RangeForLeft.MinValue,
                maxValue    : Cannon.RangeForLeft.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForRight(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getRangeForRight();
    const act           = action.getActRangeForRight();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Cannon.RangeForRight.MinValue,
                maxValue    : Cannon.RangeForRight.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPriority(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getPriority();
    const act           = action.getActPriority();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Cannon.Priority.MinValue,
                maxValue    : Cannon.Priority.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanAffectSelf(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): boolean {
    const defaultValue  = customCannonData.getCanAffectSelf();
    const act           = action.getActCanAffectSelf();
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
function evalActCanAffectAlly(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): boolean {
    const defaultValue  = customCannonData.getCanAffectAlly();
    const act           = action.getActCanAffectAlly();
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
function evalActCanAffectEnemy(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): boolean {
    const defaultValue  = customCannonData.getCanAffectEnemy();
    const act           = action.getActCanAffectEnemy();
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
function evalActMaxTargetCount(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getMaxTargetCount();
    const act           = action.getActMaxTargetCount();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Cannon.MaxTargetCount.MinValue,
                maxValue    : Cannon.MaxTargetCount.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetHp(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getOffsetHp();
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Cannon.OffsetHp.MinValue,
                maxValue    : Cannon.OffsetHp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanBeFatal(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): boolean {
    const defaultValue  = !!customCannonData.getCanBeFatal();
    const act           = action.getActCanBeFatal();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return !!epResult.num;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetFuelPercentage(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getOffsetFuelPercentage();
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Cannon.OffsetFuelPercentage.MinValue,
                maxValue    : Cannon.OffsetFuelPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): number {
    const defaultValue  = customCannonData.getOffsetPrimaryAmmoPercentage();
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Cannon.OffsetPrimaryAmmoPercentage.MinValue,
                maxValue    : Cannon.OffsetPrimaryAmmoPercentage.MaxValue,
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
export async function applyWithoutExtraData(action: WeaSetCustomCannonStateExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, TileCustomCannonData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        const customCannonData = tile.getFinalCannonData();
        if (customCannonData == null) {
            continue;
        }

        if ((tile.getTileTypeId() !== TileTypeId.CustomCannon) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomCannonData(action, tile, customCannonData));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomCannonData(action: WeaSetCustomCannonStateExpr, tile: ITile, customCannonData: TileCustomCannonData): TileCustomCannonData {
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
function applyNewTileDataDict(dict: Map<ITile, TileCustomCannonData>, war: IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomCannonData] of dict) {
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
