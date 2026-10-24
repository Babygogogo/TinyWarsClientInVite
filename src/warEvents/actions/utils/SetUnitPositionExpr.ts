import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovableArea from "../../../auxiliaryTypes/MovableArea.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as ExpressionParsersContextsTile from "../../../expressionParsers/contexts/Tile.ts";
import * as ExpressionParsersContextsUnit from "../../../expressionParsers/contexts/Unit.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNullableUnit from "../../../expressionParsers/results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as ExpressionParsersResultsPosition from "../../../expressionParsers/results/Position.ts";
import * as ExpressionParsersResultsTile from "../../../expressionParsers/results/Tile.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersConstants from "../../../numbers/Constants.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetUnitPositionExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionExpr.ts";
import type * as TilesITile from "../../../tiles/ITile.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as WarEventsActionsConstantsSetUnitPositionExpr from "../constants/SetUnitPositionExpr.ts";

type WeaSetUnitPositionExpr = ProtoSchemaCommonProtoWarEventWeaSetUnitPositionExpr.WeaSetUnitPositionExpr;
type IUnit                  = UnitsIUnit.IUnit;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitPositionExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : WarEventsActionsConstantsSetUnitPositionExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActDestination(),
            expressionInfo          : WarEventsActionsConstantsSetUnitPositionExpr.ExpressionInfoDict.ActDestination,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAlternativeTileFilter(),
            expressionInfo          : WarEventsActionsConstantsSetUnitPositionExpr.ExpressionInfoDict.ActAlternativeTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitPositionExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0054, data.getConUnitFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetUnitPositionExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActDestination()             ? `${WarEventsActionsConstantsSetUnitPositionExpr.ExpressionInfoDict.ActDestination.getTitleText()}: ${data.getActDestination()}`                     : null,
        data.getActAlternativeTileFilter()   ? `${WarEventsActionsConstantsSetUnitPositionExpr.ExpressionInfoDict.ActAlternativeTileFilter.getTitleText()}: ${data.getActAlternativeTileFilter()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0054, data.getConUnitFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitPositionExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetUnitPositionExpr.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetUnitPositionExpr.ExpressionInfoDict.ActDestination;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActDestination(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetUnitPositionExpr.ExpressionInfoDict.ActAlternativeTileFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActAlternativeTileFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitPositionExpr, unit: IUnit): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActDestination(action: WeaSetUnitPositionExpr, unit: IUnit): AuxiliaryTypesGridIndex.GridIndex | null {
    const act = action.getActDestination();
    if (!act) {
        return null;
    }

    try {
        const war       = unit.getWar();
        const epResult  = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(war, unit)), false);
        if (epResult instanceof ExpressionParsersResultsTile.Tile) {
            return epResult.tile.getGridIndex();

        } else if (epResult instanceof ExpressionParsersResultsPosition.Position) {
            const newGridIndex = new AuxiliaryTypesGridIndex.GridIndex(Math.floor(epResult.x), Math.floor(epResult.y));
            return newGridIndex.checkIsInsideMap(war.getTileMap().getMapSize())
                ? newGridIndex
                : null;

        } else {
            return null;
        }

    } catch (Exception) {
        return null;
    }
}
function evalActAlternativeTileFilter(action: WeaSetUnitPositionExpr, tile: TilesITile.ITile): boolean {
    const act = action.getActAlternativeTileFilter();
    if (!act) {
        return false;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsTile.Tile(tile), false);
        return (epResult instanceof ExpressionParsersResultsNum.Num) && (epResult.num !== 0);

    } catch {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitPositionExpr): Promise<void> {
    // nothing to do
}
export function applyWithoutExtraData(action: WeaSetUnitPositionExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const destinationDict = new Map<IUnit, AuxiliaryTypesGridIndex.GridIndex>();
    for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
        if (!checkIsMeetConditionForUnit(action, unit)) {
            continue;
        }

        const gridIndex = evalActDestination(action, unit);
        if (gridIndex != null) {
            destinationDict.set(unit, gridIndex);
        }
    }

    return applyDestinationDict(destinationDict, war, action, isFast);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function applyDestinationDict(dict: Map<IUnit, AuxiliaryTypesGridIndex.GridIndex>, war: BaseWarInterfaceIBwWar.IBwWar, action: WeaSetUnitPositionExpr, isFast: boolean): Promise<void> {
    const unitMap       = war.getUnitMap();
    const tileMap       = war.getTileMap();
    const mapSize       = tileMap.getMapSize();
    const promiseArray  : Promise<void>[] = [];
    for (const [unit, oldDestination] of dict) {
        const unitGridIndex = unit.getGridIndex();
        if (unitGridIndex.checkIsEqual(oldDestination)) {
            continue;
        }

        const newDestination = (unitMap.getUnitOnMap(oldDestination) == null)
            ? oldDestination
            : getAlternativeDestination(action, unit, oldDestination);
        if ((newDestination == null) || (newDestination.checkIsEqual(unitGridIndex))) {
            continue;
        }

        if (!isFast) {
            const moveType      = unit.getMoveTypeId();
            const movableArea   = AuxiliaryTypesMovableArea.MovableArea.create({
                gridIndex       : unitGridIndex,
                maxMoveCost     : 1000,
                mapSize         : mapSize,
                moveCostGetter  : g => tileMap.getTile(g).getMoveCostByMoveType(moveType),
            });
            const { x: newX, y: newY } = newDestination.getXY();
            if (movableArea.checkHasGrid(newX, newY)) {
                promiseArray.push(unit.moveViewAlongPath({
                    pathNodes           : movableArea.createShortestMovePath(newDestination).map(v => v.getGridIndex()),
                    isDiving            : unit.getIsDiving(),
                    isBlocked           : false,
                    aiming              : null,
                    updateViewAfterMove : true,
                }));
            } else {
                let tempGridIndex   = unitGridIndex.clone();
                const path          = [tempGridIndex];
                while (!tempGridIndex.checkIsEqual(newDestination)) {
                    tempGridIndex   = tempGridIndex.clone();
                    const { x, y }  = tempGridIndex.getXY();
                    if (x < newX) {
                        tempGridIndex.setX(x + 1);
                    } else if (x > newX) {
                        tempGridIndex.setX(x - 1);
                    } else if (y < newY) {
                        tempGridIndex.setY(y + 1);
                    } else if (y > newY) {
                        tempGridIndex.setY(y - 1);
                    }
                    path.push(tempGridIndex);
                }
                promiseArray.push(unit.moveViewAlongPath({
                    pathNodes           : path,
                    isDiving            : unit.getIsDiving(),
                    isBlocked           : false,
                    aiming              : null,
                    updateViewAfterMove : true,
                }));
            }
        }

        unitMap.removeUnitOnMap(unitGridIndex, false);

        unit.setGridIndex(newDestination);
        for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit, true)) {
            loadedUnit.setGridIndex(newDestination);
        }

        unitMap.setUnitOnMap(unit);
    }

    await Promise.all(promiseArray);
}

function getAlternativeDestination(action: WeaSetUnitPositionExpr, unit: IUnit, oldDestination: AuxiliaryTypesGridIndex.GridIndex): AuxiliaryTypesGridIndex.GridIndex | null {
    if (!action.getActAlternativeTileFilter()) {
        return null;
    }

    const war       = unit.getWar();
    const tileMap   = war.getTileMap();
    const unitMap   = war.getUnitMap();
    return oldDestination.getGridsWithinDistance({
        minDistance : 1,
        maxDistance : NumbersConstants.MaxInt32,
        mapSize     : tileMap.getMapSize(),
        predicate   : g => {
            const tile = tileMap.getTile(g);
            const existingUnit = unitMap.getUnitOnMap(g);
            if (existingUnit != null) {
                return (existingUnit == unit) && (evalActAlternativeTileFilter(action, tile));
            } else {
                return evalActAlternativeTileFilter(action, tile);
            }
        },
        limit       : 1
    })[0] ?? null;
}
