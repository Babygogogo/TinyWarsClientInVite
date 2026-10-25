import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovableArea } from "../../../auxiliaryTypes/MovableArea.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { Tile } from "../../../expressionParsers/contexts/Tile.ts";
import { Unit } from "../../../expressionParsers/contexts/Unit.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { NullableUnit } from "../../../expressionParsers/results/NullableUnit.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { Position } from "../../../expressionParsers/results/Position.ts";
import { Tile as ExpressionParsersResultsTile } from "../../../expressionParsers/results/Tile.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { MaxInt32 } from "../../../numbers/Constants.ts";
import type {
    WeaSetUnitPositionExpr as ProtoSchemaCommonProtoWarEventWeaSetUnitPositionExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionExpr.ts";
import type { ITile } from "../../../tiles/ITile.ts";
import type { IUnit as UnitsIUnit } from "../../../units/IUnit.ts";
import { ExpressionInfoDict } from "../constants/SetUnitPositionExpr.ts";

type WeaSetUnitPositionExpr = ProtoSchemaCommonProtoWarEventWeaSetUnitPositionExpr;
type IUnit                  = UnitsIUnit;

export function checkIsValid(action: Undefinable<WeaSetUnitPositionExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActDestination(),
            expressionInfo          : ExpressionInfoDict.ActDestination,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActAlternativeTileFilter(),
            expressionInfo          : ExpressionInfoDict.ActAlternativeTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetUnitPositionExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0054, data.getConUnitFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetUnitPositionExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActDestination()             ? `${ExpressionInfoDict.ActDestination.getTitleText()}: ${data.getActDestination()}`                     : null,
        data.getActAlternativeTileFilter()   ? `${ExpressionInfoDict.ActAlternativeTileFilter.getTitleText()}: ${data.getActAlternativeTileFilter()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0054, data.getConUnitFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitPositionExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConUnitFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActDestination;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActDestination(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActAlternativeTileFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActAlternativeTileFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitPositionExpr, unit: IUnit): boolean {
    try {
        const result = Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActDestination(action: WeaSetUnitPositionExpr, unit: IUnit): GridIndex | null {
    const act = action.getActDestination();
    if (!act) {
        return null;
    }

    try {
        const war       = unit.getWar();
        const epResult  = Parser.getParseResult(act).eval(new Unit(new NullableUnit(war, unit)), false);
        if (epResult instanceof ExpressionParsersResultsTile) {
            return epResult.tile.getGridIndex();

        } else if (epResult instanceof Position) {
            const newGridIndex = new GridIndex(Math.floor(epResult.x), Math.floor(epResult.y));
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
function evalActAlternativeTileFilter(action: WeaSetUnitPositionExpr, tile: ITile): boolean {
    const act = action.getActAlternativeTileFilter();
    if (!act) {
        return false;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Tile(tile), false);
        return (epResult instanceof Num) && (epResult.num !== 0);

    } catch {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitPositionExpr): Promise<void> {
    // nothing to do
}
export function applyWithoutExtraData(action: WeaSetUnitPositionExpr, isFast: boolean, war: IBwWar): Promise<void> {
    const destinationDict = new Map<IUnit, GridIndex>();
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
async function applyDestinationDict(dict: Map<IUnit, GridIndex>, war: IBwWar, action: WeaSetUnitPositionExpr, isFast: boolean): Promise<void> {
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
            const movableArea   = MovableArea.create({
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

function getAlternativeDestination(action: WeaSetUnitPositionExpr, unit: IUnit, oldDestination: GridIndex): GridIndex | null {
    if (!action.getActAlternativeTileFilter()) {
        return null;
    }

    const war       = unit.getWar();
    const tileMap   = war.getTileMap();
    const unitMap   = war.getUnitMap();
    return oldDestination.getGridsWithinDistance({
        minDistance : 1,
        maxDistance : MaxInt32,
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
