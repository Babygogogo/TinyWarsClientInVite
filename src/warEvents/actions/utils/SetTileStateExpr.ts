import { GcData } from "../../../gameConfig/GcData.ts";
import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { NumArray } from "../../../expressionParsers/results/NumArray.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { MinId, MaxId } from "../../../locations/Constants.ts";
import { encode } from "../../../locations/Utils.ts";
import { getValueInInt32 } from "../../../numbers/Utils.ts";
import type {
    WeaSetTileStateExpr as ProtoSchemaCommonProtoWarEventWeaSetTileStateExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateExpr.ts";
import type {
    SerialTile as ProtoSchemaCommonProtoWarSerializationSerialTile,
} from "../../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { ITile as TilesITile } from "../../../tiles/ITile.ts";
import { checkIsValidCustomNameId } from "../../../tiles/utils/Common.ts";
import { create } from "../../../tiles/utils/Serialization.ts";
import { ExpressionInfoDict } from "../constants/SetTileStateExpr.ts";

type WeaSetTileStateExpr    = ProtoSchemaCommonProtoWarEventWeaSetTileStateExpr;
type SerialTile             = ProtoSchemaCommonProtoWarSerializationSerialTile;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type ITile                  = TilesITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypesUndefinable<WeaSetTileStateExpr>, customCounterNameSet: Set<string>): boolean {
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
            str                     : action.getActPlayerIndex(),
            expressionInfo          : ExpressionInfoDict.ActPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentHp(),
            expressionInfo          : ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentBuildPoint(),
            expressionInfo          : ExpressionInfoDict.ActCurrentBuildPoint,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCurrentCapturePoint(),
            expressionInfo          : ExpressionInfoDict.ActCurrentCapturePoint,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsHighlighted(),
            expressionInfo          : ExpressionInfoDict.ActIsHighlighted,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActGroupedLocationIdArray(),
            expressionInfo          : ExpressionInfoDict.ActGroupedLocationIdArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCustomNameId(),
            expressionInfo          : ExpressionInfoDict.ActCustomNameId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypesUndefinable<WeaSetTileStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0056, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypesUndefinable<WeaSetTileStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActPlayerIndex()             ? `${ExpressionInfoDict.ActPlayerIndex.getTitleText()}: ${data.getActPlayerIndex()}`                         : null,
        data.getActCurrentHp()               ? `${ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                             : null,
        data.getActCurrentBuildPoint()       ? `${ExpressionInfoDict.ActCurrentBuildPoint.getTitleText()}: ${data.getActCurrentBuildPoint()}`             : null,
        data.getActCurrentCapturePoint()     ? `${ExpressionInfoDict.ActCurrentCapturePoint.getTitleText()}: ${data.getActCurrentCapturePoint()}`         : null,
        data.getActIsHighlighted()           ? `${ExpressionInfoDict.ActIsHighlighted.getTitleText()}: ${data.getActIsHighlighted()}`                     : null,
        data.getActGroupedLocationIdArray()  ? `${ExpressionInfoDict.ActGroupedLocationIdArray.getTitleText()}: ${data.getActGroupedLocationIdArray()}`   : null,
        data.getActCustomNameId()            ? `${ExpressionInfoDict.ActCustomNameId.getTitleText()}: ${data.getActCustomNameId()}`                                       : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0056, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetTileStateExpr, customCounterNameSet: Set<string>): string | null {
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
        const info      = ExpressionInfoDict.ActPlayerIndex;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActPlayerIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentHp;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentBuildPoint;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentBuildPoint(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCurrentCapturePoint;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCurrentCapturePoint(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActIsHighlighted;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsHighlighted(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActGroupedLocationIdArray;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActGroupedLocationIdArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCustomNameId;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCustomNameId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetTileStateExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActPlayerIndex(action: WeaSetTileStateExpr, tile: ITile): number {
    const defaultValue  = tile.getPlayerIndex();
    const act           = action.getActPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newValue = Math.floor(epResult.num);
            return (tile.getWar().getPlayerManager().checkHasPlayer(newValue)) && (GcData.checkIsValidPlayerIndexForTileObject({ playerIndex: newValue, tileObjectType: tile.getObjectType() }))
                ? newValue
                : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActCurrentHp(action: WeaSetTileStateExpr, tile: ITile): number {
    const defaultValue  = tile.getCurrentHp();
    const act           = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newValue = getValueInInt32(epResult.num);
            return (newValue > (tile.getMaxHp() ?? 0))
                ? defaultValue
                : (newValue < 0 ? 0 : newValue);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActCurrentBuildPoint(action: WeaSetTileStateExpr, tile: ITile): number {
    const defaultValue  = tile.getCurrentBuildPoint();
    const act           = action.getActCurrentBuildPoint();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newValue = getValueInInt32(epResult.num);
            return (newValue > (tile.getMaxBuildPoint() ?? 0))
                ? defaultValue
                : (newValue < 0 ? 0 : newValue);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActCurrentCapturePoint(action: WeaSetTileStateExpr, tile: ITile): number {
    const defaultValue  = tile.getCurrentCapturePoint();
    const act           = action.getActCurrentCapturePoint();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newValue = getValueInInt32(epResult.num);
            return (newValue > (tile.getMaxCapturePoint() ?? 0))
                ? defaultValue
                : (newValue < 0 ? 0 : newValue);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActIsHighlighted(action: WeaSetTileStateExpr, tile: ITile): boolean {
    const defaultValue  = tile.getIsHighlighted();
    const act           = action.getActIsHighlighted();
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
    } catch {
        return defaultValue;
    }
}
function evalActGroupedLocationIdArray(action: WeaSetTileStateExpr, tile: ITile): number[] {
    const defaultValue  = tile.getGroupedLocationIdArray();
    const act           = action.getActGroupedLocationIdArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof NumArray) {
            const locationIdSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const value = Math.floor(rawValue);
                if ((value >= MinId) && (value <= MaxId)) {
                    locationIdSet.add(value);
                }
            }

            return locationIdSet.size > 0 ? encode([...locationIdSet]) : [];
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActCustomNameId(action: WeaSetTileStateExpr, tile: ITile): Undefinable<number> {
    const defaultValue  = tile.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const value = getValueInInt32(epResult.num);
            return checkIsValidCustomNameId(value)
                ? value
                : (value < 0 ? null : defaultValue);
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetTileStateExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, SerialTile>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if (!checkIsMeetConditionForTile(action, tile)) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileData(action, tile));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileData(action: WeaSetTileStateExpr, tile: ITile): SerialTile {
    // 为防止随机数导致结果不稳定，此处eval系列函数的顺序一旦写下就不能更改，后续新属性只能添加在最后
    // 必须保证函数顺序前后端相同
    const playerIndex               = evalActPlayerIndex(action, tile);
    const currentHp                 = evalActCurrentHp(action, tile);
    const currentBuildPoint         = evalActCurrentBuildPoint(action, tile);
    const currentCapturePoint       = evalActCurrentCapturePoint(action, tile);
    const isHighlighted             = evalActIsHighlighted(action, tile);
    const groupedLocationIdArray    = evalActGroupedLocationIdArray(action, tile);
    const customNameId              = evalActCustomNameId(action, tile);

    return create({
        baseType                : tile.getBaseType(),
        baseShapeId             : tile.getBaseShapeId(),
        objectType              : tile.getObjectType(),
        objectShapeId           : tile.getObjectShapeId(),
        decorationType          : tile.getDecorationType(),
        decorationShapeId       : tile.getDecorationShapeId(),
        gridIndex               : tile.getGridIndex().toProto().toJson(),
        unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),

        customBuildingData      : tile.getCustomBuildingData()?.toJson() ?? null,
        customCannonData        : tile.getCustomCannonData()?.toJson() ?? null,
        customCrystalData       : tile.getCustomCrystalData()?.toJson() ?? null,
        customLaserTurretData   : tile.getCustomLaserTurretData()?.toJson() ?? null,

        playerIndex             : playerIndex,
        currentHp               : currentHp,
        currentBuildPoint       : currentBuildPoint,
        currentCapturePoint     : currentCapturePoint,
        isHighlighted           : isHighlighted,
        groupedLocationIdArray  : groupedLocationIdArray,
        customNameId            : customNameId ?? null,
    });
}
function applyNewTileDataDict(dict: Map<ITile, SerialTile>, war: IBwWar, isFast: boolean): void {
    for (const [tile, newTileData] of dict) {
        tile.init(newTileData, tile.getGameConfig());
        tile.startRunning(war);

        // tile.startRunningView();
        if (!isFast) {
            tile.flushDataToView();
        }
    }
}
