import {
    Tiles_Utils_Common,
    TileObjects_Utils,
    Tiles_Utils_Serialization,
    Locations_Utils,
    WarEvents_Actions_Constants_SetTileStateExpr,
    Lang_Utils,
    Numbers_Utils,
    Locations_Constants,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_NumArray,
    ExpressionParsers_Parser,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    type BaseWar_Interface_IBwWar,
    type Tiles_Tile,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetTileStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileStateExpr.ts";
import type { SerialTile } from "../../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConTileFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActPlayerIndex(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActPlayerIndex,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentHp(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentHp,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentBuildPoint(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCurrentCapturePoint(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsHighlighted(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActIsHighlighted,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActGroupedLocationIdArray(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCustomNameId(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCustomNameId,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0056, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActPlayerIndex()             ? `${WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActPlayerIndex.getTitleText()}: ${data.getActPlayerIndex()}`                         : null,
        data.getActCurrentHp()               ? `${WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentHp.getTitleText()}: ${data.getActCurrentHp()}`                             : null,
        data.getActCurrentBuildPoint()       ? `${WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint.getTitleText()}: ${data.getActCurrentBuildPoint()}`             : null,
        data.getActCurrentCapturePoint()     ? `${WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint.getTitleText()}: ${data.getActCurrentCapturePoint()}`         : null,
        data.getActIsHighlighted()           ? `${WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActIsHighlighted.getTitleText()}: ${data.getActIsHighlighted()}`                     : null,
        data.getActGroupedLocationIdArray()  ? `${WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray.getTitleText()}: ${data.getActGroupedLocationIdArray()}`   : null,
        data.getActCustomNameId()            ? `${WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCustomNameId.getTitleText()}: ${data.getActCustomNameId()}`                                       : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0056, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetTileStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActPlayerIndex;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActPlayerIndex(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentHp;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCurrentHp(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentBuildPoint;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCurrentBuildPoint(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCurrentCapturePoint;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCurrentCapturePoint(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActIsHighlighted;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIsHighlighted(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActGroupedLocationIdArray;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActGroupedLocationIdArray(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileStateExpr.ExpressionInfoDict.ActCustomNameId;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCustomNameId(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetTileStateExpr, tile: Tiles_Tile.Tile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}
function evalActPlayerIndex(action: WeaSetTileStateExpr, tile: Tiles_Tile.Tile): number {
    const defaultValue  = tile.getPlayerIndex();
    const act           = action.getActPlayerIndex();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newValue = Math.floor(epResult.num);
            return (tile.getWar().getPlayerManager().checkHasPlayer(newValue)) && (TileObjects_Utils.checkIsValidPlayerIndexForTileObject({ playerIndex : newValue, tileObjectType : tile.getObjectType() }))
                ? newValue
                : defaultValue;
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActCurrentHp(action: WeaSetTileStateExpr, tile: Tiles_Tile.Tile): number {
    const defaultValue  = tile.getCurrentHp();
    const act           = action.getActCurrentHp();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newValue = Numbers_Utils.getValueInInt32(epResult.num);
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
function evalActCurrentBuildPoint(action: WeaSetTileStateExpr, tile: Tiles_Tile.Tile): number {
    const defaultValue  = tile.getCurrentBuildPoint();
    const act           = action.getActCurrentBuildPoint();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newValue = Numbers_Utils.getValueInInt32(epResult.num);
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
function evalActCurrentCapturePoint(action: WeaSetTileStateExpr, tile: Tiles_Tile.Tile): number {
    const defaultValue  = tile.getCurrentCapturePoint();
    const act           = action.getActCurrentCapturePoint();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newValue = Numbers_Utils.getValueInInt32(epResult.num);
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
function evalActIsHighlighted(action: WeaSetTileStateExpr, tile: Tiles_Tile.Tile): boolean {
    const defaultValue  = tile.getIsHighlighted();
    const act           = action.getActIsHighlighted();
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
    } catch {
        return defaultValue;
    }
}
function evalActGroupedLocationIdArray(action: WeaSetTileStateExpr, tile: Tiles_Tile.Tile): number[] {
    const defaultValue  = tile.getGroupedLocationIdArray();
    const act           = action.getActGroupedLocationIdArray();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_NumArray.NumArray) {
            const locationIdSet = new Set<number>();
            for (const rawValue of epResult.numberArray) {
                const value = Math.floor(rawValue);
                if ((value >= Locations_Constants.MinId) && (value <= Locations_Constants.MaxId)) {
                    locationIdSet.add(value);
                }
            }

            return locationIdSet.size > 0 ? Locations_Utils.encode([...locationIdSet]) : [];
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActCustomNameId(action: WeaSetTileStateExpr, tile: Tiles_Tile.Tile): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    const defaultValue  = tile.getCustomNameId();
    const act           = action.getActCustomNameId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const value = Numbers_Utils.getValueInInt32(epResult.num);
            return Tiles_Utils_Common.checkIsValidCustomNameId(value)
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
export async function applyWithoutExtraData(action: WeaSetTileStateExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<Tiles_Tile.Tile, SerialTile>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if (!checkIsMeetConditionForTile(action, tile)) {
            continue;
        }

        newTileDataDict.set(tile, createNewTileData(action, tile));
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileData(action: WeaSetTileStateExpr, tile: Tiles_Tile.Tile): SerialTile {
    // 为防止随机数导致结果不稳定，此处eval系列函数的顺序一旦写下就不能更改，后续新属性只能添加在最后
    // 必须保证函数顺序前后端相同
    const playerIndex               = evalActPlayerIndex(action, tile);
    const currentHp                 = evalActCurrentHp(action, tile);
    const currentBuildPoint         = evalActCurrentBuildPoint(action, tile);
    const currentCapturePoint       = evalActCurrentCapturePoint(action, tile);
    const isHighlighted             = evalActIsHighlighted(action, tile);
    const groupedLocationIdArray    = evalActGroupedLocationIdArray(action, tile);
    const customNameId              = evalActCustomNameId(action, tile);

    return Tiles_Utils_Serialization.create({
        baseType          : tile.getBaseType(),
        baseShapeId       : tile.getBaseShapeId(),
        objectType        : tile.getObjectType(),
        objectShapeId     : tile.getObjectShapeId(),
        decorationType    : tile.getDecorationType(),
        decorationShapeId : tile.getDecorationShapeId(),
        gridIndex         : tile.getGridIndex().toProto().toJson(),
        unfixedBuffArray  : tile.getUnfixedBuffList().map(v => v.toJson()),

        customBuildingData    : tile.getCustomBuildingData()?.toJson() ?? null,
        customCannonData      : tile.getCustomCannonData()?.toJson() ?? null,
        customCrystalData     : tile.getCustomCrystalData()?.toJson() ?? null,
        customLaserTurretData : tile.getCustomLaserTurretData()?.toJson() ?? null,

        playerIndex            : playerIndex,
        currentHp              : currentHp,
        currentBuildPoint      : currentBuildPoint,
        currentCapturePoint    : currentCapturePoint,
        isHighlighted          : isHighlighted,
        groupedLocationIdArray : groupedLocationIdArray,
        customNameId           : customNameId ?? null,
    });
}
function applyNewTileDataDict(dict: Map<Tiles_Tile.Tile, SerialTile>, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    for (const [tile, newTileData] of dict) {
        tile.init(newTileData, tile.getGameConfig());
        tile.startRunning(war);

        // tile.startRunningView();
        if (!isFast) {
            tile.flushDataToView();
        }
    }
}
