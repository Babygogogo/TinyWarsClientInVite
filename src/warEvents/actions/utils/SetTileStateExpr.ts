import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsNumArray from "../../../expressionParsers/results/NumArray.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as LocationsConstants from "../../../locations/Constants.ts";
import * as LocationsUtils from "../../../locations/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetTileStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateExpr.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import * as TilesUtilsCommon from "../../../tiles/utils/Common.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import * as WarEventsActionsConstantsSetTileStateExpr from "../constants/SetTileStateExpr.ts";

type WeaSetTileStateExpr    = ProtoSchemaCommonProtoWarEventWeaSetTileStateExpr.WeaSetTileStateExpr;
type SerialTile             = ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type ITile                  = TilesITile.ITile;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActPlayerIndex(),
            expressionInfo          : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActPlayerIndex,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentHp(),
            expressionInfo          : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentBuildPoint(),
            expressionInfo          : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCurrentCapturePoint(),
            expressionInfo          : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsHighlighted(),
            expressionInfo          : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActIsHighlighted,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActGroupedLocationIdArray(),
            expressionInfo          : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCustomNameId(),
            expressionInfo          : WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCustomNameId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0056, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActPlayerIndex()             ? `${WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActPlayerIndex.getTitleText()}: ${data.getActPlayerIndex()}`                         : null,
        data.getActCurrentHp()               ? `${WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                             : null,
        data.getActCurrentBuildPoint()       ? `${WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint.getTitleText()}: ${data.getActCurrentBuildPoint()}`             : null,
        data.getActCurrentCapturePoint()     ? `${WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint.getTitleText()}: ${data.getActCurrentCapturePoint()}`         : null,
        data.getActIsHighlighted()           ? `${WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActIsHighlighted.getTitleText()}: ${data.getActIsHighlighted()}`                     : null,
        data.getActGroupedLocationIdArray()  ? `${WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray.getTitleText()}: ${data.getActGroupedLocationIdArray()}`   : null,
        data.getActCustomNameId()            ? `${WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCustomNameId.getTitleText()}: ${data.getActCustomNameId()}`                                       : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0056, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetTileStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActPlayerIndex;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActPlayerIndex(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentHp;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentHp(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentBuildPoint(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCurrentCapturePoint(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActIsHighlighted;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsHighlighted(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActGroupedLocationIdArray(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileStateExpr.ExpressionInfoDict.ActCustomNameId;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCustomNameId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetTileStateExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newValue = Math.floor(epResult.num);
            return (tile.getWar().getPlayerManager().checkHasPlayer(newValue)) && (tile.getGameConfig().checkIsValidPlayerIndexForTileObject({ playerIndex: newValue, tileObjectType: tile.getObjectType() }))
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newValue = NumbersUtils.getValueInInt32(epResult.num);
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newValue = NumbersUtils.getValueInInt32(epResult.num);
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newValue = NumbersUtils.getValueInInt32(epResult.num);
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNumArray.NumArray) {
            const locationIdSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const value = Math.floor(rawValue);
                if ((value >= LocationsConstants.MinId) && (value <= LocationsConstants.MaxId)) {
                    locationIdSet.add(value);
                }
            }

            return locationIdSet.size > 0 ? LocationsUtils.encode([...locationIdSet]) : [];
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const value = NumbersUtils.getValueInInt32(epResult.num);
            return TilesUtilsCommon.checkIsValidCustomNameId(value)
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
export async function applyWithoutExtraData(action: WeaSetTileStateExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
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

    return TilesUtilsSerialization.create({
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
function applyNewTileDataDict(dict: Map<ITile, SerialTile>, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, newTileData] of dict) {
        tile.init(newTileData, tile.getGameConfig());
        tile.startRunning(war);

        // tile.startRunningView();
        if (!isFast) {
            tile.flushDataToView();
        }
    }
}
