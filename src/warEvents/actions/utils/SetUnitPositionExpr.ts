import {
    WarEvents_Actions_Constants_SetUnitPositionExpr,
    Lang_Utils,
    AuxiliaryTypes_GridIndex,
    Numbers_Constants,
    AuxiliaryTypes_MovableArea,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    ExpressionParsers_Results_Position,
    ExpressionParsers_Results_Tile,
    Lang_Constants,
    ExpressionParsers_Contexts_Tile,
    ExpressionParsers_Contexts_Unit,
    type BaseWar_Interface_IBwWar,
    type Tiles_ITile,
    type Units_IUnit,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetUnitPositionExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetUnitPositionExpr.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitPositionExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : WarEvents_Actions_Constants_SetUnitPositionExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActDestination(),
            expressionInfo          : WarEvents_Actions_Constants_SetUnitPositionExpr.ExpressionInfoDict.ActDestination,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getActAlternativeTileFilter(),
            expressionInfo          : WarEvents_Actions_Constants_SetUnitPositionExpr.ExpressionInfoDict.ActAlternativeTileFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitPositionExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0054, data.getConUnitFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetUnitPositionExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActDestination()             ? `${WarEvents_Actions_Constants_SetUnitPositionExpr.ExpressionInfoDict.ActDestination.getTitleText()}: ${data.getActDestination()}`                     : null,
        data.getActAlternativeTileFilter()   ? `${WarEvents_Actions_Constants_SetUnitPositionExpr.ExpressionInfoDict.ActAlternativeTileFilter.getTitleText()}: ${data.getActAlternativeTileFilter()}` : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0054, data.getConUnitFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaSetUnitPositionExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetUnitPositionExpr.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetUnitPositionExpr.ExpressionInfoDict.ActDestination;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActDestination(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetUnitPositionExpr.ExpressionInfoDict.ActAlternativeTileFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActAlternativeTileFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaSetUnitPositionExpr, unit: Units_IUnit.IUnit): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActDestination(action: WeaSetUnitPositionExpr, unit: Units_IUnit.IUnit): AuxiliaryTypes_GridIndex.GridIndex | null {
    const act = action.getActDestination();
    if (!act) {
        return null;
    }

    try {
        const war       = unit.getWar();
        const epResult  = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(war, unit)), false);
        if (epResult instanceof ExpressionParsers_Results_Tile.Tile) {
            return epResult.tile.getGridIndex();

        } else if (epResult instanceof ExpressionParsers_Results_Position.Position) {
            const newGridIndex = new AuxiliaryTypes_GridIndex.GridIndex(Math.floor(epResult.x), Math.floor(epResult.y));
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
function evalActAlternativeTileFilter(action: WeaSetUnitPositionExpr, tile: Tiles_ITile.ITile): boolean {
    const act = action.getActAlternativeTileFilter();
    if (!act) {
        return false;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Tile.Tile(tile), false);
        return (epResult instanceof ExpressionParsers_Results_Num.Num) && (epResult.num !== 0);

    } catch {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetUnitPositionExpr): Promise<void> {
    // nothing to do
}
export function applyWithoutExtraData(action: WeaSetUnitPositionExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const destinationDict = new Map<Units_IUnit.IUnit, AuxiliaryTypes_GridIndex.GridIndex>();
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
async function applyDestinationDict(dict: Map<Units_IUnit.IUnit, AuxiliaryTypes_GridIndex.GridIndex>, war: BaseWar_Interface_IBwWar.IBwWar, action: WeaSetUnitPositionExpr, isFast: boolean): Promise<void> {
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
            const movableArea   = AuxiliaryTypes_MovableArea.MovableArea.create({
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

function getAlternativeDestination(action: WeaSetUnitPositionExpr, unit: Units_IUnit.IUnit, oldDestination: AuxiliaryTypes_GridIndex.GridIndex): AuxiliaryTypes_GridIndex.GridIndex | null {
    if (!action.getActAlternativeTileFilter()) {
        return null;
    }

    const war       = unit.getWar();
    const tileMap   = war.getTileMap();
    const unitMap   = war.getUnitMap();
    return oldDestination.getGridsWithinDistance({
        minDistance : 1,
        maxDistance : Numbers_Constants.MaxInt32,
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
