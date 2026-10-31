import {
    TileBases_Utils,
    TileDecorations_Utils,
    TileObjects_Utils,
    Tiles_Utils_Serialization,
    Destructions_Utils,
    WarEvents_Actions_Constants_SetTileTypeExpr,
    MapEditor_Model_MeHelpers,
    Helpers_Misc,
    Lang_Utils,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    Tiles_Constants_Common,
    ExpressionParsers_Parser,
    Players_Constants,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    ExpressionParsers_Contexts_Unit,
    type BaseWar_Interface_IBwWar,
    type Tiles_Tile,
    type Tiles_TileMap,
    type Units_Unit,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { TileTemplateCfg } from "../../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type { WeaSetTileTypeExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeExpr.ts";
import type { SerialTile } from "../../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

type NewTileData = {
    serialTile              : SerialTile | null;
    autoAdjustBase          : boolean;
    autoAdjustObject        : boolean;
    autoAdjustDecoration    : boolean;
    destroyUnit             : boolean;
};

const enum UnitHandler {
    NoAction                = 0,
    DestroyIfTileAttackable = 1,
    DestroyIfUnitCantMove   = 2,
    DestroyAlways           = 3,
}
const RoadConnectTileTypeArray = [
    Tiles_Constants_Common.TileTypeId.Road,
    Tiles_Constants_Common.TileTypeId.BridgeOnBeach,
    Tiles_Constants_Common.TileTypeId.BridgeOnPlain,
    Tiles_Constants_Common.TileTypeId.BridgeOnRiver,
    Tiles_Constants_Common.TileTypeId.BridgeOnSea,
    Tiles_Constants_Common.TileTypeId.Headquarters,
    Tiles_Constants_Common.TileTypeId.City,
    Tiles_Constants_Common.TileTypeId.CommandTower,
    Tiles_Constants_Common.TileTypeId.Radar,
    Tiles_Constants_Common.TileTypeId.Factory,
    Tiles_Constants_Common.TileTypeId.Airport,
    Tiles_Constants_Common.TileTypeId.Seaport,
    Tiles_Constants_Common.TileTypeId.TempAirport,
    Tiles_Constants_Common.TileTypeId.TempSeaport,
];
const BridgeConnectTileTypeArray = [
    Tiles_Constants_Common.TileTypeId.Road,
    Tiles_Constants_Common.TileTypeId.BridgeOnBeach,
    Tiles_Constants_Common.TileTypeId.BridgeOnPlain,
    Tiles_Constants_Common.TileTypeId.BridgeOnRiver,
    Tiles_Constants_Common.TileTypeId.BridgeOnSea,
    Tiles_Constants_Common.TileTypeId.Headquarters,
    Tiles_Constants_Common.TileTypeId.City,
    Tiles_Constants_Common.TileTypeId.CommandTower,
    Tiles_Constants_Common.TileTypeId.Radar,
    Tiles_Constants_Common.TileTypeId.Factory,
    Tiles_Constants_Common.TileTypeId.Airport,
    Tiles_Constants_Common.TileTypeId.Seaport,
    Tiles_Constants_Common.TileTypeId.TempAirport,
    Tiles_Constants_Common.TileTypeId.TempSeaport,
];

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileTypeExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConTileFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActBaseType(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseType,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActBaseShapeId(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActObjectType(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectType,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActObjectShapeId(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActDecorationType(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationType,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActDecorationShapeId(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActUnitHandler(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitHandler,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActUnitFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0055, data.getConTileFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetTileTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActBaseType()            ? `${WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseType.getTitleText()}: ${data.getActBaseType()}`                   : null,
        data.getActBaseShapeId()         ? `${WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId.getTitleText()}: ${data.getActBaseShapeId()}`             : null,
        data.getActObjectType()          ? `${WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectType.getTitleText()}: ${data.getActObjectType()}`               : null,
        data.getActObjectShapeId()       ? `${WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId.getTitleText()}: ${data.getActObjectShapeId()}`         : null,
        data.getActDecorationType()      ? `${WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationType.getTitleText()}: ${data.getActDecorationType()}`       : null,
        data.getActDecorationShapeId()   ? `${WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId.getTitleText()}: ${data.getActDecorationShapeId()}` : null,
        data.getActUnitHandler()         ? `${WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitHandler.getTitleText()}: ${data.getActUnitHandler()}`             : null,
        data.getActUnitFilter()          ? `${WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitFilter.getTitleText()}: ${data.getActUnitFilter()}`               : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0055, data.getConTileFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetTileTypeExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActBaseType(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActBaseShapeId(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActObjectType(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActObjectShapeId(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActDecorationType(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActDecorationShapeId(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitHandler;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActUnitHandler(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetTileTypeExpr.ExpressionInfoDict.ActUnitFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActUnitFilter(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetTileTypeExpr, tile: Tiles_Tile.Tile): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}
function evalActBaseType(action: WeaSetTileTypeExpr, tile: Tiles_Tile.Tile): number {
    const defaultValue  = tile.getBaseType();
    const act           = action.getActBaseType();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newBaseType = Math.floor(epResult.num);
            return (TileBases_Utils.checkIsUsableTileBaseType(newBaseType)) ? newBaseType : defaultValue;
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActBaseShapeId(action: WeaSetTileTypeExpr, tile: Tiles_Tile.Tile, newBaseType: number): number {
    const oldBaseShapeId    = tile.getBaseShapeId();
    const defaultValue      = TileBases_Utils.checkIsValidTileBaseShapeId(newBaseType, oldBaseShapeId) ? oldBaseShapeId : 0;
    const act               = action.getActBaseShapeId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newBaseShapeId = Math.floor(epResult.num);
            return (newBaseShapeId < 0) || (TileBases_Utils.checkIsValidTileBaseShapeId(newBaseType, newBaseShapeId))
                ? newBaseShapeId
                : defaultValue;
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActObjectType(action: WeaSetTileTypeExpr, tile: Tiles_Tile.Tile): number {
    const defaultValue  = tile.getObjectType();
    const act           = action.getActObjectType();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newObjectType = Math.floor(epResult.num);
            return (TileObjects_Utils.checkIsValidTileObjectType(newObjectType)) ? newObjectType : defaultValue;
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActObjectShapeId(action: WeaSetTileTypeExpr, tile: Tiles_Tile.Tile, newObjectType: number): number {
    const oldObjectShapeId    = tile.getObjectShapeId();
    const defaultValue      = TileObjects_Utils.checkIsValidTileObjectShapeId(newObjectType, oldObjectShapeId) ? oldObjectShapeId : 0;
    const act               = action.getActObjectShapeId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newObjectShapeId = Math.floor(epResult.num);
            return (newObjectShapeId < 0) || (TileObjects_Utils.checkIsValidTileObjectShapeId(newObjectType, newObjectShapeId))
                ? newObjectShapeId
                : defaultValue;
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActDecorationType(action: WeaSetTileTypeExpr, tile: Tiles_Tile.Tile): number {
    const defaultValue  = tile.getDecorationType();
    const act           = action.getActDecorationType();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newDecorationType = Math.floor(epResult.num);
            return (TileDecorations_Utils.checkIsValidTileDecorationType(newDecorationType)) ? newDecorationType : defaultValue;
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActDecorationShapeId(action: WeaSetTileTypeExpr, tile: Tiles_Tile.Tile, newDecorationType: number): number {
    const oldDecorationShapeId    = tile.getDecorationShapeId();
    const defaultValue      = TileDecorations_Utils.checkIsValidTileDecorationShapeId(newDecorationType, oldDecorationShapeId) ? oldDecorationShapeId : 0;
    const act               = action.getActDecorationShapeId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const newDecorationShapeId = Math.floor(epResult.num);
            return (newDecorationShapeId < 0) || (TileDecorations_Utils.checkIsValidTileDecorationShapeId(newDecorationType, newDecorationShapeId))
                ? newDecorationShapeId
                : defaultValue;
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function evalActUnitHandler(action: WeaSetTileTypeExpr, tile: Tiles_Tile.Tile): UnitHandler {
    const defaultValue  = UnitHandler.NoAction;
    const act           = action.getActUnitHandler();
    if ((!act) || (tile.getWar().getUnitMap().getUnitOnMap(tile.getGridIndex()) == null)) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
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
    } catch {
        return defaultValue;
    }
}
function evalActUnitFilter(action: WeaSetTileTypeExpr, unit: Units_Unit.Unit): boolean {
    const defaultValue  = true;
    const act           = action.getActUnitFilter();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return defaultValue;
        }
    } catch {
        return defaultValue;
    }
}
function checkShouldDestroyUnit(
    action      : WeaSetTileTypeExpr,
    unitHandler : UnitHandler,
    cfg         : TileTemplateCfg,
    unit        : Units_Unit.Unit | null,
): boolean {
    if (unit == null) {
        return false;
    }

    switch (unitHandler) {
        case UnitHandler.NoAction                : return false;
        case UnitHandler.DestroyAlways           : return evalActUnitFilter(action, unit);
        case UnitHandler.DestroyIfTileAttackable : return (cfg.getMaxHp() != null) && (evalActUnitFilter(action, unit));
        case UnitHandler.DestroyIfUnitCantMove   : return ((unit.getGcData().getMoveCostCfg(cfg.getTileTypeId()) ?? {})[unit.getMoveTypeId()]?.getCost() == null) && (evalActUnitFilter(action, unit));
        default                                  : throw Helpers_Misc.newError(`Invalid unitHandler: ${unitHandler}`);
    }
}

function getAutoTileObjectShapeId(tileMap: Tiles_TileMap.TileMap, tile: Tiles_Tile.Tile): number | null {
    const gridIndex = tile.getGridIndex();
    switch (tile.getObjectType()) {
        case Tiles_Constants_Common.ObjectTypeId.Bridge    : return MapEditor_Model_MeHelpers.getAutoBridgeShapeId(tileMap, gridIndex, BridgeConnectTileTypeArray);
        case Tiles_Constants_Common.ObjectTypeId.Road      : return MapEditor_Model_MeHelpers.getAutoRoadShapeId(tileMap, gridIndex, RoadConnectTileTypeArray);
        case Tiles_Constants_Common.ObjectTypeId.Plasma    : return MapEditor_Model_MeHelpers.getAutoPlasmaShapeId(tileMap, gridIndex);
        case Tiles_Constants_Common.ObjectTypeId.Pipe      : return MapEditor_Model_MeHelpers.getAutoPipeShapeId(tileMap, gridIndex);
        default                         : return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileTypeExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetTileTypeExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const newTileDataDict = new Map<Tiles_Tile.Tile, NewTileData>();
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
function createNewTileData(action: WeaSetTileTypeExpr, tile: Tiles_Tile.Tile): NewTileData | null {
    const newBaseType           = evalActBaseType(action, tile);
    const newBaseShapeId        = evalActBaseShapeId(action, tile, newBaseType);
    const newObjectType         = evalActObjectType(action, tile);
    const newObjectShapeId      = evalActObjectShapeId(action, tile, newObjectType);
    const gridIndex             = tile.getGridIndex();
    const war                   = tile.getWar();
    const gameConfig            = war.getGcData();
    const unit                  = war.getUnitMap().getUnitOnMap(gridIndex);
    const newTileType           = Helpers_Misc.getExisted(gameConfig.getTileType(newBaseType, newObjectType));
    const newCfg                = Helpers_Misc.getExisted(gameConfig.getTileTemplateCfg(newTileType));
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
            serialTile           : null,
            autoAdjustBase       : false,
            autoAdjustObject     : false,
            autoAdjustDecoration : false,
            destroyUnit          : shouldDestroyUnit,
        };
    }

    // there are 18 tile attributes currently
    const isSameTileTypeId = newTileType === tile.getTileTypeId();
    const maxBuildPoint    = newCfg.getMaxBuildPoint() ?? 0;
    const maxCapturePoint  = newCfg.getMaxCapturePoint() ?? 0;
    const maxHp            = newCfg.getMaxHp() ?? 0;

    const serialTile        = Tiles_Utils_Serialization.create({
        baseType          : newBaseType,
        baseShapeId       : Math.max(0, newBaseShapeId),
        objectType        : newObjectType,
        objectShapeId     : Math.max(0, newObjectShapeId),
        decorationType    : newDecorationType,
        decorationShapeId : Math.max(0, newDecorationShapeId),
        playerIndex       : TileObjects_Utils.getTileObjectCfg(newObjectType)?.isNeutralOnly
            ? Players_Constants.PlayerIndex.Neutral
            : tile.getPlayerIndex(),

        gridIndex              : gridIndex.toProto().toJson(),
        customNameId           : tile.getCustomNameId() ?? null,
        unfixedBuffArray       : tile.getUnfixedBuffList().map(v => v.toJson()),
        groupedLocationIdArray : tile.getGroupedLocationIdArray(),
        isHighlighted          : tile.getIsHighlighted(),

        currentBuildPoint   : tile.getMaxBuildPoint() == null   ? maxBuildPoint     : Math.min(tile.getCurrentBuildPoint(), maxBuildPoint),
        currentCapturePoint : tile.getMaxCapturePoint() == null ? maxCapturePoint   : Math.min(tile.getCurrentCapturePoint(), maxCapturePoint),
        currentHp           : tile.getMaxHp() == null           ? maxHp             : Math.min(tile.getCurrentHp(), maxHp),

        customBuildingData    : isSameTileTypeId ? tile.getCustomBuildingData()?.toJson() ?? null     : null,
        customCrystalData     : isSameTileTypeId ? tile.getCustomCrystalData()?.toJson() ?? null      : null,
        customCannonData      : isSameTileTypeId ? tile.getCustomCannonData()?.toJson() ?? null       : null,
        customLaserTurretData : isSameTileTypeId ? tile.getCustomLaserTurretData()?.toJson() ?? null  : null,
    });

    return {
        serialTile           : serialTile,
        autoAdjustBase       : newBaseShapeId < 0,
        autoAdjustObject     : newObjectShapeId < 0,
        autoAdjustDecoration : newDecorationShapeId < 0,
        destroyUnit          : shouldDestroyUnit,
    };
}
function applyNewTileDataDict(dict: Map<Tiles_Tile.Tile, NewTileData>, war: BaseWar_Interface_IBwWar.IBwWar, isFast: boolean): void {
    const unitMap       = war.getUnitMap();
    const gameConfig    = war.getGcData();
    const affectedTiles = new Set<Tiles_Tile.Tile>();
    for (const [tile, newTileData] of dict) {
        if (newTileData.destroyUnit) {
            const gridIndex = tile.getGridIndex();
            if (unitMap.getUnitOnMap(gridIndex) != null) {
                Destructions_Utils.destroyUnitOnMap(war, gridIndex, !isFast);
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
            const shapeId = MapEditor_Model_MeHelpers.getAutoTileBaseShapeId(tileMap, tile);
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

        const { decorationType, shapeId } = MapEditor_Model_MeHelpers.getAutoTileDecorationTypeAndShapeId(tileMap, tile.getGridIndex());
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
