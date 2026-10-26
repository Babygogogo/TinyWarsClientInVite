import { GcData } from "../../../gameConfigs/GcData.ts";
import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { destroyUnitOnMap } from "../../../destructions/Utils.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { Unit } from "../../../expressionParsers/contexts/Unit.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { NullableUnit } from "../../../expressionParsers/results/NullableUnit.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import {
    getAutoBridgeShapeId,
    getAutoRoadShapeId,
    getAutoPlasmaShapeId,
    getAutoPipeShapeId,
    getAutoTileBaseShapeId,
    getAutoTileDecorationTypeAndShapeId,
} from "../../../mapEditor/model/MeHelpers.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
import type { TileTemplateCfg } from "../../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type { WeaSetTileTypeExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeExpr.ts";
import type { SerialTile } from "../../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import { TileTypeId, ObjectTypeId } from "../../../tiles/constants/Common.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import type { ITileMap } from "../../../tiles/ITileMap.ts";
import { create } from "../../../tiles/utils/Serialization.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { ExpressionInfoDict } from "../constants/SetTileTypeExpr.ts";

type NewTileData = {
    serialTile              : SerialTile | null;
    autoAdjustBase          : boolean;
    autoAdjustObject        : boolean;
    autoAdjustDecoration    : boolean;
    destroyUnit             : boolean;
};
// eslint-disable-next-line no-shadow
const enum UnitHandler {
    NoAction                = 0,
    DestroyIfTileAttackable = 1,
    DestroyIfUnitCantMove   = 2,
    DestroyAlways           = 3,
}
const RoadConnectTileTypeArray = [
    TileTypeId.Road,
    TileTypeId.BridgeOnBeach,
    TileTypeId.BridgeOnPlain,
    TileTypeId.BridgeOnRiver,
    TileTypeId.BridgeOnSea,
    TileTypeId.Headquarters,
    TileTypeId.City,
    TileTypeId.CommandTower,
    TileTypeId.Radar,
    TileTypeId.Factory,
    TileTypeId.Airport,
    TileTypeId.Seaport,
    TileTypeId.TempAirport,
    TileTypeId.TempSeaport,
];
const BridgeConnectTileTypeArray = [
    TileTypeId.Road,
    TileTypeId.BridgeOnBeach,
    TileTypeId.BridgeOnPlain,
    TileTypeId.BridgeOnRiver,
    TileTypeId.BridgeOnSea,
    TileTypeId.Headquarters,
    TileTypeId.City,
    TileTypeId.CommandTower,
    TileTypeId.Radar,
    TileTypeId.Factory,
    TileTypeId.Airport,
    TileTypeId.Seaport,
    TileTypeId.TempAirport,
    TileTypeId.TempSeaport,
];

export function checkIsValid(action: Undefinable<WeaSetTileTypeExpr>, customCounterNameSet: Set<string>): boolean {
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
            str                     : action.getActBaseType(),
            expressionInfo          : ExpressionInfoDict.ActBaseType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActBaseShapeId(),
            expressionInfo          : ExpressionInfoDict.ActBaseShapeId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActObjectType(),
            expressionInfo          : ExpressionInfoDict.ActObjectType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActObjectShapeId(),
            expressionInfo          : ExpressionInfoDict.ActObjectShapeId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActDecorationType(),
            expressionInfo          : ExpressionInfoDict.ActDecorationType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActDecorationShapeId(),
            expressionInfo          : ExpressionInfoDict.ActDecorationShapeId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActUnitHandler(),
            expressionInfo          : ExpressionInfoDict.ActUnitHandler,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActUnitFilter(),
            expressionInfo          : ExpressionInfoDict.ActUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetTileTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0055, data.getConTileFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetTileTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActBaseType()            ? `${ExpressionInfoDict.ActBaseType.getTitleText()}: ${data.getActBaseType()}`                   : null,
        data.getActBaseShapeId()         ? `${ExpressionInfoDict.ActBaseShapeId.getTitleText()}: ${data.getActBaseShapeId()}`             : null,
        data.getActObjectType()          ? `${ExpressionInfoDict.ActObjectType.getTitleText()}: ${data.getActObjectType()}`               : null,
        data.getActObjectShapeId()       ? `${ExpressionInfoDict.ActObjectShapeId.getTitleText()}: ${data.getActObjectShapeId()}`         : null,
        data.getActDecorationType()      ? `${ExpressionInfoDict.ActDecorationType.getTitleText()}: ${data.getActDecorationType()}`       : null,
        data.getActDecorationShapeId()   ? `${ExpressionInfoDict.ActDecorationShapeId.getTitleText()}: ${data.getActDecorationShapeId()}` : null,
        data.getActUnitHandler()         ? `${ExpressionInfoDict.ActUnitHandler.getTitleText()}: ${data.getActUnitHandler()}`             : null,
        data.getActUnitFilter()          ? `${ExpressionInfoDict.ActUnitFilter.getTitleText()}: ${data.getActUnitFilter()}`               : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0055, data.getConTileFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetTileTypeExpr, customCounterNameSet: Set<string>): string | null {
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
        const info      = ExpressionInfoDict.ActBaseType;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActBaseType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActBaseShapeId;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActBaseShapeId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActObjectType;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActObjectType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActObjectShapeId;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActObjectShapeId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActDecorationType;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActDecorationType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActDecorationShapeId;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActDecorationShapeId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActUnitHandler;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActUnitHandler(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActUnitFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetTileTypeExpr, tile: ITile): boolean {
    try {
        const result = Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new Tile(tile), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActBaseType(action: WeaSetTileTypeExpr, tile: ITile): number {
    const defaultValue  = tile.getBaseType();
    const act           = action.getActBaseType();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newBaseType = Math.floor(epResult.num);
            return (GcData.checkIsUsableTileBaseType(newBaseType)) ? newBaseType : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActBaseShapeId(action: WeaSetTileTypeExpr, tile: ITile, newBaseType: number): number {
    const oldBaseShapeId    = tile.getBaseShapeId();
    const defaultValue      = GcData.checkIsValidTileBaseShapeId(newBaseType, oldBaseShapeId) ? oldBaseShapeId : 0;
    const act               = action.getActBaseShapeId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newBaseShapeId = Math.floor(epResult.num);
            return (newBaseShapeId < 0) || (GcData.checkIsValidTileBaseShapeId(newBaseType, newBaseShapeId))
                ? newBaseShapeId
                : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActObjectType(action: WeaSetTileTypeExpr, tile: ITile): number {
    const defaultValue  = tile.getObjectType();
    const act           = action.getActObjectType();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newObjectType = Math.floor(epResult.num);
            return (GcData.checkIsValidTileObjectType(newObjectType)) ? newObjectType : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActObjectShapeId(action: WeaSetTileTypeExpr, tile: ITile, newObjectType: number): number {
    const oldObjectShapeId    = tile.getObjectShapeId();
    const defaultValue      = GcData.checkIsValidTileObjectShapeId(newObjectType, oldObjectShapeId) ? oldObjectShapeId : 0;
    const act               = action.getActObjectShapeId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newObjectShapeId = Math.floor(epResult.num);
            return (newObjectShapeId < 0) || (GcData.checkIsValidTileObjectShapeId(newObjectType, newObjectShapeId))
                ? newObjectShapeId
                : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActDecorationType(action: WeaSetTileTypeExpr, tile: ITile): number {
    const defaultValue  = tile.getDecorationType();
    const act           = action.getActDecorationType();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newDecorationType = Math.floor(epResult.num);
            return (GcData.checkIsValidTileDecorationType(newDecorationType)) ? newDecorationType : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActDecorationShapeId(action: WeaSetTileTypeExpr, tile: ITile, newDecorationType: number): number {
    const oldDecorationShapeId    = tile.getDecorationShapeId();
    const defaultValue      = GcData.checkIsValidTileDecorationShapeId(newDecorationType, oldDecorationShapeId) ? oldDecorationShapeId : 0;
    const act               = action.getActDecorationShapeId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const newDecorationShapeId = Math.floor(epResult.num);
            return (newDecorationShapeId < 0) || (GcData.checkIsValidTileDecorationShapeId(newDecorationType, newDecorationShapeId))
                ? newDecorationShapeId
                : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActUnitHandler(action: WeaSetTileTypeExpr, tile: ITile): UnitHandler {
    const defaultValue  = UnitHandler.NoAction;
    const act           = action.getActUnitHandler();
    if ((!act) || (tile.getWar().getUnitMap().getUnitOnMap(tile.getGridIndex()) == null)) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        if (epResult instanceof Num) {
            const unitHandler = Math.floor(epResult.num);
            return (
                (unitHandler === UnitHandler.DestroyAlways)             ||
                (unitHandler === UnitHandler.DestroyIfTileAttackable)   ||
                (unitHandler === UnitHandler.DestroyIfUnitCantMove)     ||
                (unitHandler === UnitHandler.NoAction)
            )
                ? unitHandler
                : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActUnitFilter(action: WeaSetTileTypeExpr, unit: IUnit): boolean {
    const defaultValue  = true;
    const act           = action.getActUnitFilter();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function checkShouldDestroyUnit(
    action      : WeaSetTileTypeExpr,
    unitHandler : UnitHandler,
    cfg         : TileTemplateCfg,
    unit        : IUnit | null
): boolean {
    if (unit == null) {
        return false;
    }

    switch (unitHandler) {
        case UnitHandler.NoAction                : return false;
        case UnitHandler.DestroyAlways           : return evalActUnitFilter(action, unit);
        case UnitHandler.DestroyIfTileAttackable : return (cfg.getMaxHp() != null) && (evalActUnitFilter(action, unit));
        case UnitHandler.DestroyIfUnitCantMove   : return ((unit.getGcData().getMoveCostCfg(cfg.getTileTypeId() ?? 0) ?? {})[unit.getMoveTypeId()]?.getCost() == null) && (evalActUnitFilter(action, unit));
        default                                  : throw newError(`Invalid unitHandler: ${unitHandler}`);
    }
}

function getAutoTileObjectShapeId(tileMap: ITileMap, tile: ITile): number | null {
    const gridIndex = tile.getGridIndex();
    switch (tile.getObjectType()) {
        case ObjectTypeId.Bridge    : return getAutoBridgeShapeId(tileMap, gridIndex, BridgeConnectTileTypeArray);
        case ObjectTypeId.Road      : return getAutoRoadShapeId(tileMap, gridIndex, RoadConnectTileTypeArray);
        case ObjectTypeId.Plasma    : return getAutoPlasmaShapeId(tileMap, gridIndex);
        case ObjectTypeId.Pipe      : return getAutoPipeShapeId(tileMap, gridIndex);
        default                         : return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileTypeExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetTileTypeExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const newTileDataDict = new Map<ITile, NewTileData>();
    for (const tile of war.getTileMap().getAllTiles()) {
        if (!checkIsMeetConditionForTile(action, tile)) {
            continue;
        }

        const newTileData = createNewTileData(action, tile);
        if (newTileData != null) {
            newTileDataDict.set(tile, newTileData);
        }
    }

    applyNewTileDataDict(newTileDataDict, war, isFast);
}
function createNewTileData(action: WeaSetTileTypeExpr, tile: ITile): NewTileData | null {
    const newBaseType           = evalActBaseType(action, tile);
    const newBaseShapeId        = evalActBaseShapeId(action, tile, newBaseType);
    const newObjectType         = evalActObjectType(action, tile);
    const newObjectShapeId      = evalActObjectShapeId(action, tile, newObjectType);
    const gridIndex             = tile.getGridIndex();
    const war                   = tile.getWar();
    const gameConfig            = war.getGcData();
    const unit                  = war.getUnitMap().getUnitOnMap(gridIndex);
    const newTileType           = getExisted(gameConfig.getTileType(newBaseType, newObjectType));
    const newCfg                = getExisted(gameConfig.getTileTemplateCfg(newTileType));
    const unitHandler           = evalActUnitHandler(action, tile);
    const shouldDestroyUnit     = checkShouldDestroyUnit(action, unitHandler, newCfg, unit);
    const newDecorationType     = evalActDecorationType(action, tile);
    const newDecorationShapeId  = evalActDecorationShapeId(action, tile, newDecorationType);
    if ((newBaseType            === tile.getBaseType())             &&
        (newBaseShapeId         === tile.getBaseShapeId())          &&
        (newObjectType          === tile.getObjectType())           &&
        (newObjectShapeId       === tile.getObjectShapeId())        &&
        (newDecorationType      === tile.getDecorationType())       &&
        (newDecorationShapeId   === tile.getDecorationShapeId())
    ) {
        return {
            serialTile              : null,
            autoAdjustBase          : false,
            autoAdjustObject        : false,
            autoAdjustDecoration    : false,
            destroyUnit             : shouldDestroyUnit
        };
    }

    // there are 18 tile attributes currently
    const isSameTileTypeId = newTileType === tile.getTileTypeId();
    const maxBuildPoint    = newCfg.getMaxBuildPoint() ?? 0;
    const maxCapturePoint  = newCfg.getMaxCapturePoint() ?? 0;
    const maxHp            = newCfg.getMaxHp() ?? 0;

    const serialTile        = create({
        baseType            : newBaseType,
        baseShapeId         : Math.max(0, newBaseShapeId),
        objectType          : newObjectType,
        objectShapeId       : Math.max(0, newObjectShapeId),
        decorationType      : newDecorationType,
        decorationShapeId   : Math.max(0, newDecorationShapeId),
        playerIndex         : GcData.getTileObjectCfg(newObjectType)?.isNeutralOnly
            ? PlayerIndex.Neutral
            : tile.getPlayerIndex(),

        gridIndex               : gridIndex.toProto().toJson(),
        customNameId            : tile.getCustomNameId() ?? null,
        unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
        groupedLocationIdArray  : tile.getGroupedLocationIdArray(),
        isHighlighted           : tile.getIsHighlighted(),

        currentBuildPoint       : tile.getMaxBuildPoint() == null   ? maxBuildPoint     : Math.min(tile.getCurrentBuildPoint(), maxBuildPoint),
        currentCapturePoint     : tile.getMaxCapturePoint() == null ? maxCapturePoint   : Math.min(tile.getCurrentCapturePoint(), maxCapturePoint),
        currentHp               : tile.getMaxHp() == null           ? maxHp             : Math.min(tile.getCurrentHp(), maxHp),

        customBuildingData      : isSameTileTypeId ? tile.getCustomBuildingData()?.toJson() ?? null     : null,
        customCrystalData       : isSameTileTypeId ? tile.getCustomCrystalData()?.toJson() ?? null      : null,
        customCannonData        : isSameTileTypeId ? tile.getCustomCannonData()?.toJson() ?? null       : null,
        customLaserTurretData   : isSameTileTypeId ? tile.getCustomLaserTurretData()?.toJson() ?? null  : null,
    });

    return {
        serialTile              : serialTile,
        autoAdjustBase          : newBaseShapeId < 0,
        autoAdjustObject        : newObjectShapeId < 0,
        autoAdjustDecoration    : newDecorationShapeId < 0,
        destroyUnit             : shouldDestroyUnit
    };
}
function applyNewTileDataDict(dict: Map<ITile, NewTileData>, war: IBwWar, isFast: boolean): void {
    const unitMap       = war.getUnitMap();
    const gameConfig    = war.getGcData();
    const affectedTiles = new Set<ITile>();
    for (const [tile, newTileData] of dict) {
        if (newTileData.destroyUnit) {
            const gridIndex = tile.getGridIndex();
            if (unitMap.getUnitOnMap(gridIndex) != null) {
                destroyUnitOnMap(war, gridIndex, !isFast);
                affectedTiles.add(tile);
            }
        }

        const serialTile = newTileData.serialTile;
        if (serialTile != null) {
            tile.init(serialTile, gameConfig);
            tile.startRunning(war);
            affectedTiles.add(tile);
        }
    }

    const tileMap = war.getTileMap();
    for (const [tile, newTileData] of dict) {
        if (newTileData.autoAdjustBase) {
            const shapeId = getAutoTileBaseShapeId(tileMap, tile);
            if ((shapeId != null) && (shapeId != tile.getBaseShapeId())) {
                tile.setBaseShapeId(shapeId);
                affectedTiles.add(tile);
            }
        }

        if (newTileData.autoAdjustObject) {
            const shapeId = getAutoTileObjectShapeId(tileMap, tile);
            if ((shapeId != null) && (shapeId != tile.getObjectShapeId())) {
                tile.setObjectShapeId(shapeId);
                affectedTiles.add(tile);
            }
        }
    }
    for (const [tile, newTileData] of dict) {
        if (!newTileData.autoAdjustDecoration) {
            continue;
        }

        const { decorationType, shapeId } = getAutoTileDecorationTypeAndShapeId(tileMap, tile.getGridIndex());
        if ((tile.getDecorationType() == decorationType) && (tile.getDecorationShapeId() == shapeId)) {
            continue;
        }

        tile.setDecorationType(decorationType);
        tile.setDecorationShapeId(shapeId);
        affectedTiles.add(tile);
    }

    if (!isFast) {
        for (const tile of affectedTiles) {
            tile.flushDataToView();
        }
    }
}
