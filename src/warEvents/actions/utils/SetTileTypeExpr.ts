import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as DestructionsUtils from "../../../destructions/Utils.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersContextsUnit from "../../../expressionParsers/contexts/Unit.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNullableUnit from "../../../expressionParsers/results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as MapEditorModelMeHelpers from "../../../mapEditor/model/MeHelpers.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoConfigTileTemplateCfg from "../../../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetTileTypeExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetTileTypeExpr.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import * as TilesConstantsCommon from "../../../tiles/constants/Common.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import type * as TilesITileMap from "../../../tiles/ITileMap.ts";
import * as TilesUtilsSerialization from "../../../tiles/utils/Serialization.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as WarEventsActionsConstantsSetTileTypeExpr from "../constants/SetTileTypeExpr.ts";

type SerialTile         = ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile;
type WeaSetTileTypeExpr = ProtoSchemaCommonProtoWarEventWeaSetTileTypeExpr.WeaSetTileTypeExpr;
type IUnit              = UnitsIUnit.IUnit;
type ITile              = TilesITile.ITile;

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
    TilesConstantsCommon.TileTypeId.Road,
    TilesConstantsCommon.TileTypeId.BridgeOnBeach,
    TilesConstantsCommon.TileTypeId.BridgeOnPlain,
    TilesConstantsCommon.TileTypeId.BridgeOnRiver,
    TilesConstantsCommon.TileTypeId.BridgeOnSea,
    TilesConstantsCommon.TileTypeId.Headquarters,
    TilesConstantsCommon.TileTypeId.City,
    TilesConstantsCommon.TileTypeId.CommandTower,
    TilesConstantsCommon.TileTypeId.Radar,
    TilesConstantsCommon.TileTypeId.Factory,
    TilesConstantsCommon.TileTypeId.Airport,
    TilesConstantsCommon.TileTypeId.Seaport,
    TilesConstantsCommon.TileTypeId.TempAirport,
    TilesConstantsCommon.TileTypeId.TempSeaport,
];
const BridgeConnectTileTypeArray = [
    TilesConstantsCommon.TileTypeId.Road,
    TilesConstantsCommon.TileTypeId.BridgeOnBeach,
    TilesConstantsCommon.TileTypeId.BridgeOnPlain,
    TilesConstantsCommon.TileTypeId.BridgeOnRiver,
    TilesConstantsCommon.TileTypeId.BridgeOnSea,
    TilesConstantsCommon.TileTypeId.Headquarters,
    TilesConstantsCommon.TileTypeId.City,
    TilesConstantsCommon.TileTypeId.CommandTower,
    TilesConstantsCommon.TileTypeId.Radar,
    TilesConstantsCommon.TileTypeId.Factory,
    TilesConstantsCommon.TileTypeId.Airport,
    TilesConstantsCommon.TileTypeId.Seaport,
    TilesConstantsCommon.TileTypeId.TempAirport,
    TilesConstantsCommon.TileTypeId.TempSeaport,
];

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileTypeExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConTileFilter(),
            expressionInfo          : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ConTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActBaseType(),
            expressionInfo          : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActBaseShapeId(),
            expressionInfo          : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActObjectType(),
            expressionInfo          : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActObjectShapeId(),
            expressionInfo          : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActDecorationType(),
            expressionInfo          : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActDecorationShapeId(),
            expressionInfo          : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActUnitHandler(),
            expressionInfo          : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitHandler,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActUnitFilter(),
            expressionInfo          : WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0055, data.getConTileFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetTileTypeExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActBaseType()            ? `${WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseType.getTitleText()}: ${data.getActBaseType()}`                   : null,
        data.getActBaseShapeId()         ? `${WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId.getTitleText()}: ${data.getActBaseShapeId()}`             : null,
        data.getActObjectType()          ? `${WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectType.getTitleText()}: ${data.getActObjectType()}`               : null,
        data.getActObjectShapeId()       ? `${WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId.getTitleText()}: ${data.getActObjectShapeId()}`         : null,
        data.getActDecorationType()      ? `${WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationType.getTitleText()}: ${data.getActDecorationType()}`       : null,
        data.getActDecorationShapeId()   ? `${WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId.getTitleText()}: ${data.getActDecorationShapeId()}` : null,
        data.getActUnitHandler()         ? `${WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitHandler.getTitleText()}: ${data.getActUnitHandler()}`             : null,
        data.getActUnitFilter()          ? `${WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitFilter.getTitleText()}: ${data.getActUnitFilter()}`               : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0055, data.getConTileFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetTileTypeExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ConTileFilter;
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
        const info      = WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActBaseType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActBaseShapeId;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActBaseShapeId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActObjectType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActObjectShapeId;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActObjectShapeId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActDecorationType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActDecorationShapeId;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActDecorationShapeId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitHandler;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActUnitHandler(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetTileTypeExpr.ExpressionInfoDict.ActUnitFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForTile(action: WeaSetTileTypeExpr, tile: ITile): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConTileFilter() ?? ``).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newBaseType = Math.floor(epResult.num);
            return (tile.getGameConfig().checkIsUsableTileBaseType(newBaseType)) ? newBaseType : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActBaseShapeId(action: WeaSetTileTypeExpr, tile: ITile, newBaseType: number): number {
    const gameConfig        = tile.getGameConfig();
    const oldBaseShapeId    = tile.getBaseShapeId();
    const defaultValue      = gameConfig.checkIsValidTileBaseShapeId(newBaseType, oldBaseShapeId) ? oldBaseShapeId : 0;
    const act               = action.getActBaseShapeId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newBaseShapeId = Math.floor(epResult.num);
            return (newBaseShapeId < 0) || (gameConfig.checkIsValidTileBaseShapeId(newBaseType, newBaseShapeId))
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newObjectType = Math.floor(epResult.num);
            return (tile.getGameConfig().checkIsValidTileObjectType(newObjectType)) ? newObjectType : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActObjectShapeId(action: WeaSetTileTypeExpr, tile: ITile, newObjectType: number): number {
    const gameConfig        = tile.getGameConfig();
    const oldObjectShapeId    = tile.getObjectShapeId();
    const defaultValue      = gameConfig.checkIsValidTileObjectShapeId(newObjectType, oldObjectShapeId) ? oldObjectShapeId : 0;
    const act               = action.getActObjectShapeId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newObjectShapeId = Math.floor(epResult.num);
            return (newObjectShapeId < 0) || (gameConfig.checkIsValidTileObjectShapeId(newObjectType, newObjectShapeId))
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newDecorationType = Math.floor(epResult.num);
            return (tile.getGameConfig().checkIsValidTileDecorationType(newDecorationType)) ? newDecorationType : defaultValue;
        } else {
            return defaultValue;
        }
    } catch (Exception) {
        return defaultValue;
    }
}
function evalActDecorationShapeId(action: WeaSetTileTypeExpr, tile: ITile, newDecorationType: number): number {
    const gameConfig        = tile.getGameConfig();
    const oldDecorationShapeId    = tile.getDecorationShapeId();
    const defaultValue      = gameConfig.checkIsValidTileDecorationShapeId(newDecorationType, oldDecorationShapeId) ? oldDecorationShapeId : 0;
    const act               = action.getActDecorationShapeId();
    if (!act) {
        return defaultValue;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const newDecorationShapeId = Math.floor(epResult.num);
            return (newDecorationShapeId < 0) || (gameConfig.checkIsValidTileDecorationShapeId(newDecorationType, newDecorationShapeId))
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
    cfg         : ProtoSchemaCommonProtoConfigTileTemplateCfg.TileTemplateCfg,
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
        default                                  : throw HelpersMisc.newError(`Invalid unitHandler: ${unitHandler}`);
    }
}

function getAutoTileObjectShapeId(tileMap: TilesITileMap.ITileMap, tile: ITile): number | null {
    const gridIndex = tile.getGridIndex();
    switch (tile.getObjectType()) {
        case TilesConstantsCommon.ObjectTypeId.Bridge    : return MapEditorModelMeHelpers.getAutoBridgeShapeId(tileMap, gridIndex, BridgeConnectTileTypeArray);
        case TilesConstantsCommon.ObjectTypeId.Road      : return MapEditorModelMeHelpers.getAutoRoadShapeId(tileMap, gridIndex, RoadConnectTileTypeArray);
        case TilesConstantsCommon.ObjectTypeId.Plasma    : return MapEditorModelMeHelpers.getAutoPlasmaShapeId(tileMap, gridIndex);
        case TilesConstantsCommon.ObjectTypeId.Pipe      : return MapEditorModelMeHelpers.getAutoPipeShapeId(tileMap, gridIndex);
        default                         : return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetTileTypeExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetTileTypeExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
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
    const newTileType           = HelpersMisc.getExisted(gameConfig.getTileType(newBaseType, newObjectType));
    const newCfg                = HelpersMisc.getExisted(gameConfig.getTileTemplateCfg(newTileType));
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

    const serialTile        = TilesUtilsSerialization.create({
        baseType            : newBaseType,
        baseShapeId         : Math.max(0, newBaseShapeId),
        objectType          : newObjectType,
        objectShapeId       : Math.max(0, newObjectShapeId),
        decorationType      : newDecorationType,
        decorationShapeId   : Math.max(0, newDecorationShapeId),
        playerIndex         : gameConfig.getTileObjectCfg(newObjectType)?.isNeutralOnly
            ? PlayersConstants.PlayerIndex.Neutral
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
function applyNewTileDataDict(dict: Map<ITile, NewTileData>, war: BaseWarInterfaceIBwWar.IBwWar, isFast: boolean): void {
    const unitMap       = war.getUnitMap();
    const gameConfig    = war.getGcData();
    const affectedTiles = new Set<ITile>();
    for (const [tile, newTileData] of dict) {
        if (newTileData.destroyUnit) {
            const gridIndex = tile.getGridIndex();
            if (unitMap.getUnitOnMap(gridIndex) != null) {
                DestructionsUtils.destroyUnitOnMap(war, gridIndex, !isFast);
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
            const shapeId = MapEditorModelMeHelpers.getAutoTileBaseShapeId(tileMap, tile);
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

        const { decorationType, shapeId } = MapEditorModelMeHelpers.getAutoTileDecorationTypeAndShapeId(tileMap, tile.getGridIndex());
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
