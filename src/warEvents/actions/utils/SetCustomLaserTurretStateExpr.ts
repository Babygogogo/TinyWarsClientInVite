import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type { WeaSetCustomLaserTurretStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomLaserTurretStateExpr.ts";
import { TileCustomLaserTurretData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";
import { TileTypeId } from "../../../tiles/constants/Common.ts";
import { LaserTurret } from "../../../tiles/constants/CustomLimits.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import { create } from "../../../tiles/utils/Serialization.ts";
import { ExpressionInfoDict } from "../constants/SetCustomLaserTurretStateExpr.ts";

export function checkIsValid(action: Undefinable<WeaSetCustomLaserTurretStateExpr>, customCounterNameSet: Set<string>): boolean {
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

export function getBriefDesc(data: Undefinable<WeaSetCustomLaserTurretStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0058, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetCustomLaserTurretStateExpr>): string | null {
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
        data.getActOffsetHp()                    ? `${ExpressionInfoDict.ActOffsetHp.getTitleText()}: ${data.getActOffsetHp()}`                                       : null,
        data.getActCanBeFatal()                  ? `${ExpressionInfoDict.ActCanBeFatal.getTitleText()}: ${data.getActCanBeFatal()}`                                   : null,
        data.getActOffsetFuelPercentage()        ? `${ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText()}: ${data.getActOffsetFuelPercentage()}`               : null,
        data.getActOffsetPrimaryAmmoPercentage() ? `${ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText()}: ${data.getActOffsetPrimaryAmmoPercentage()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0058, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomLaserTurretStateExpr, customCounterNameSet: Set<string>): string | null {
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

function checkIsMeetConditionForTile(action: WeaSetCustomLaserTurretStateExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActRangeForUp(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForUp() ?? 0;
    const act           = action.getActRangeForUp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : LaserTurret.RangeForUp.MinValue,
                maxValue    : LaserTurret.RangeForUp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForDown(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForDown() ?? 0;
    const act           = action.getActRangeForDown();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : LaserTurret.RangeForDown.MinValue,
                maxValue    : LaserTurret.RangeForDown.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForLeft(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForLeft() ?? 0;
    const act           = action.getActRangeForLeft();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : LaserTurret.RangeForLeft.MinValue,
                maxValue    : LaserTurret.RangeForLeft.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActRangeForRight(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getRangeForRight() ?? 0;
    const act           = action.getActRangeForRight();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : LaserTurret.RangeForRight.MinValue,
                maxValue    : LaserTurret.RangeForRight.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPriority(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : LaserTurret.Priority.MinValue,
                maxValue    : LaserTurret.Priority.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanAffectSelf(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): boolean {
    const defaultValue  = customLaserTurretData.getCanAffectSelf() ?? false;
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
function evalActCanAffectAlly(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): boolean {
    const defaultValue  = customLaserTurretData.getCanAffectAlly() ?? false;
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
function evalActCanAffectEnemy(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): boolean {
    const defaultValue  = customLaserTurretData.getCanAffectEnemy() ?? false;
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
function evalActOffsetHp(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : LaserTurret.OffsetHp.MinValue,
                maxValue    : LaserTurret.OffsetHp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanBeFatal(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customCannonData: TileCustomLaserTurretData): boolean {
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
function evalActOffsetFuelPercentage(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : LaserTurret.OffsetFuelPercentage.MinValue,
                maxValue    : LaserTurret.OffsetFuelPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): number {
    const defaultValue  = customLaserTurretData.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : LaserTurret.OffsetPrimaryAmmoPercentage.MinValue,
                maxValue    : LaserTurret.OffsetPrimaryAmmoPercentage.MaxValue,
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
export async function applyWithoutExtraData(action: WeaSetCustomLaserTurretStateExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, TileCustomLaserTurretData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        const customLaserTurretData = tile.getFinalLaserTurretData();
        if (customLaserTurretData == null) {
            continue;
        }

        if ((tile.getTileTypeId() !== TileTypeId.CustomLaserTurret) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomLaserTurretData(action, tile, customLaserTurretData));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomLaserTurretData(action: WeaSetCustomLaserTurretStateExpr, tile: ITile, customLaserTurretData: TileCustomLaserTurretData): TileCustomLaserTurretData {
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
function applyNewTileDataDict(dict: Map<ITile, TileCustomLaserTurretData>, war: IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomLaserTurretData] of dict) {
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
