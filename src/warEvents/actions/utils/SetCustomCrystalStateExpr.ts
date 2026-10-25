import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { getValueInRange } from "../../../numbers/Utils.ts";
import type {
    WeaSetCustomCrystalStateExpr as ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetCustomCrystalStateExpr.ts";
import { TileCustomCrystalData } from "../../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import { TileTypeId } from "../../../tiles/constants/Common.ts";
import { Crystal } from "../../../tiles/constants/CustomLimits.ts";
import type { ITile as TilesITile } from "../../../tiles/ITile.ts";
import { create } from "../../../tiles/utils/Serialization.ts";
import { ExpressionInfoDict } from "../constants/SetCustomCrystalStateExpr.ts";

type WeaSetCustomCrystalStateExpr   = ProtoSchemaCommonProtoWarEventWeaSetCustomCrystalStateExpr;
type ITile                          = TilesITile;

export function checkIsValid(action: Undefinable<WeaSetCustomCrystalStateExpr>, customCounterNameSet: Set<string>): boolean {
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
            str                     : action.getActRadius(),
            expressionInfo          : ExpressionInfoDict.ActRadius,
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
            str                     : action.getActOffsetFund(),
            expressionInfo          : ExpressionInfoDict.ActOffsetFund,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActOffsetEnergyPercentage(),
            expressionInfo          : ExpressionInfoDict.ActOffsetEnergyPercentage,
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

export function getBriefDesc(data: Undefinable<WeaSetCustomCrystalStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0057, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetCustomCrystalStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActRadius()                      ? `${ExpressionInfoDict.ActRadius.getTitleText()}: ${data.getActRadius()}`                                           : null,
        data.getActPriority()                    ? `${ExpressionInfoDict.ActPriority.getTitleText()}: ${data.getActPriority()}`                                       : null,
        data.getActCanAffectSelf()               ? `${ExpressionInfoDict.ActCanAffectSelf.getTitleText()}: ${data.getActCanAffectSelf()}`                             : null,
        data.getActCanAffectAlly()               ? `${ExpressionInfoDict.ActCanAffectAlly.getTitleText()}: ${data.getActCanAffectAlly()}`                             : null,
        data.getActCanAffectEnemy()              ? `${ExpressionInfoDict.ActCanAffectEnemy.getTitleText()}: ${data.getActCanAffectEnemy()}`                           : null,
        data.getActOffsetFund()                  ? `${ExpressionInfoDict.ActOffsetFund.getTitleText()}: ${data.getActOffsetFund()}`                                   : null,
        data.getActOffsetEnergyPercentage()      ? `${ExpressionInfoDict.ActOffsetEnergyPercentage.getTitleText()}: ${data.getActOffsetEnergyPercentage()}`           : null,
        data.getActOffsetHp()                    ? `${ExpressionInfoDict.ActOffsetHp.getTitleText()}: ${data.getActOffsetHp()}`                                       : null,
        data.getActCanBeFatal()                  ? `${ExpressionInfoDict.ActCanBeFatal.getTitleText()}: ${data.getActCanBeFatal()}`                                   : null,
        data.getActOffsetFuelPercentage()        ? `${ExpressionInfoDict.ActOffsetFuelPercentage.getTitleText()}: ${data.getActOffsetFuelPercentage()}`               : null,
        data.getActOffsetPrimaryAmmoPercentage() ? `${ExpressionInfoDict.ActOffsetPrimaryAmmoPercentage.getTitleText()}: ${data.getActOffsetPrimaryAmmoPercentage()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0057, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetCustomCrystalStateExpr, customCounterNameSet: Set<string>): string | null {
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
        const info      = ExpressionInfoDict.ActRadius;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActRadius(),
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
        const info      = ExpressionInfoDict.ActOffsetFund;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActOffsetFund(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActOffsetEnergyPercentage;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActOffsetEnergyPercentage(),
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

function checkIsMeetConditionForTile(action: WeaSetCustomCrystalStateExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActRadius(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getRadius() ?? 0;
    const act           = action.getActRadius();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Crystal.Radius.MinValue,
                maxValue    : Crystal.Radius.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActPriority(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getPriority() ?? 0;
    const act           = action.getActPriority();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Crystal.Priority.MinValue,
                maxValue    : Crystal.Priority.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanAffectSelf(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): boolean {
    const defaultValue  = customCrystalData.getCanAffectSelf() ?? false;
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
function evalActCanAffectAlly(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): boolean {
    const defaultValue  = customCrystalData.getCanAffectAlly() ?? false;
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
function evalActCanAffectEnemy(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): boolean {
    const defaultValue  = customCrystalData.getCanAffectEnemy() ?? false;
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
function evalActOffsetFund(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetFund() ?? 0;
    const act           = action.getActOffsetFund();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Crystal.OffsetFund.MinValue,
                maxValue    : Crystal.OffsetFund.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetEnergyPercentage(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetEnergyPercentage() ?? 0;
    const act           = action.getActOffsetEnergyPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Crystal.OffsetEnergyPercentage.MinValue,
                maxValue    : Crystal.OffsetEnergyPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetHp(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetHp() ?? 0;
    const act           = action.getActOffsetHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Crystal.OffsetHp.MinValue,
                maxValue    : Crystal.OffsetHp.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCanBeFatal(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): boolean {
    const defaultValue  = !!customCrystalData.getCanBeFatal();
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
function evalActOffsetFuelPercentage(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetFuelPercentage() ?? 0;
    const act           = action.getActOffsetFuelPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Crystal.OffsetFuelPercentage.MinValue,
                maxValue    : Crystal.OffsetFuelPercentage.MaxValue,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActOffsetPrimaryAmmoPercentage(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): number {
    const defaultValue  = customCrystalData.getOffsetPrimaryAmmoPercentage() ?? 0;
    const act           = action.getActOffsetPrimaryAmmoPercentage();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Crystal.OffsetPrimaryAmmoPercentage.MinValue,
                maxValue    : Crystal.OffsetPrimaryAmmoPercentage.MaxValue,
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
export async function applyWithoutExtraData(action: WeaSetCustomCrystalStateExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, TileCustomCrystalData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        const customCrystalData = tile.getFinalCrystalData();
        if (customCrystalData == null) {
            continue;
        }

        if ((tile.getTileTypeId() !== TileTypeId.CustomCrystal) || (!checkIsMeetConditionForTile(action, tile))) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileCustomCrystalData(action, tile, customCrystalData));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileCustomCrystalData(action: WeaSetCustomCrystalStateExpr, tile: ITile, customCrystalData: TileCustomCrystalData): TileCustomCrystalData {
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
function applyNewTileDataDict(dict: Map<ITile, TileCustomCrystalData>, war: IBwWar, isFast: boolean): void {
    for (const [tile, tileCustomCrystalData] of dict) {
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
