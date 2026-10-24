import * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as AuxiliaryTypesUnitVisionInfo from "../auxiliaryTypes/UnitVisionInfo.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as GameConfigGcWar from "../gameConfig/GcWar.ts";
import * as HelpersCollection from "../helpers/Collection.ts";
import type * as TilesITile from "../tiles/ITile.ts";
import type * as UnitsIUnit from "../units/IUnit.ts";
import type * as UnitsIUnitMap from "../units/IUnitMap.ts";

type IUnit              = UnitsIUnit.IUnit;
type IUnitMap           = UnitsIUnitMap.IUnitMap;
type ITile              = TilesITile.ITile;

export function checkIsUnitOnMapVisibleToTeam({ war, gridIndex, unitType, isDiving, isInvisible, unitPlayerIndex, observerTeamIndex }: {
    war                 : BaseWarInterfaceIBwWar.IBwWar;
    gridIndex           : AuxiliaryTypesGridIndex.GridIndex;
    unitType            : number;
    isDiving            : boolean;
    isInvisible         : boolean;
    unitPlayerIndex     : number;
    observerTeamIndex   : number;
}): boolean {
    return checkIsUnitOnMapVisibleToTeams({
        war,
        gridIndex,
        unitType,
        isDiving,
        isInvisible,
        unitPlayerIndex,
        observerTeamIndexes : new Set<number>([observerTeamIndex])
    });
}
export function checkIsUnitOnMapVisibleToTeams({ war, gridIndex, unitType, isDiving, isInvisible, unitPlayerIndex, observerTeamIndexes }: {
    war                 : BaseWarInterfaceIBwWar.IBwWar;
    gridIndex           : AuxiliaryTypesGridIndex.GridIndex;
    unitType            : number;
    isDiving            : boolean;
    isInvisible         : boolean;
    unitPlayerIndex     : number;
    observerTeamIndexes : Set<number>;
}): boolean {
    const playerManager = war.getPlayerManager();
    if (observerTeamIndexes.has(playerManager.getTeamIndex(unitPlayerIndex))) {
        return true;
    }

    const unitMap = war.getUnitMap();
    if (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, observerTeamIndexes)) {
        return true;
    }

    const tile = war.getTileMap().getTile(gridIndex);
    if (observerTeamIndexes.has(tile.getTeamIndex())) {
        return true;
    }

    if ((isDiving) || (isInvisible)) {
        return false;
    }

    const fogMap = war.getFogMap();
    if (!fogMap.checkHasFogCurrently()) {
        return true;
    }

    const canTileHideUnit = tile.checkCanHideUnitType(unitType);
    for (const playerIndex of playerManager.getPlayerIndexesInTeams(observerTeamIndexes)) {
        const visibilityFromPaths = fogMap.getVisibilityFromPathsForPlayer(gridIndex, playerIndex);
        if (visibilityFromPaths === GameConfigGcWar.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromPaths === GameConfigGcWar.VisibilityTypeId.Inside) {
            if (!canTileHideUnit) {
                return true;
            }
        }

        const visibilityFromUnits = fogMap.getVisibilityFromUnitsForPlayer(gridIndex, playerIndex);
        if (visibilityFromUnits === GameConfigGcWar.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromUnits === GameConfigGcWar.VisibilityTypeId.Inside) {
            if (!canTileHideUnit) {
                return true;
            }
        }

        const visibilityFromTiles = fogMap.getVisibilityFromTilesForPlayer(gridIndex, playerIndex);
        if (visibilityFromTiles === GameConfigGcWar.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromTiles === GameConfigGcWar.VisibilityTypeId.Inside) {
            if (!canTileHideUnit) {
                return true;
            }
        }
    }

    return false;
}
export function getObserverTeamIndexListForUnitOnMap({ war, gridIndex }: {
    war             : BaseWarInterfaceIBwWar.IBwWar;
    gridIndex       : AuxiliaryTypesGridIndex.GridIndex;
}): number[] | null {
    const unit = war.getUnitMap().getUnitOnMap(gridIndex);
    if (unit == null) {
        return null;
    }

    const unitType          = unit.getUnitType();
    const isDiving          = unit.getIsDiving();
    const isInvisible       = unit.checkIsInvisible(gridIndex);
    const unitPlayerIndex   = unit.getPlayerIndex();
    const teamIndexList     : number[] = [];
    for (const teamIndex of war.getPlayerManager().getAllTeamIndexSet()) {
        if (checkIsUnitOnMapVisibleToTeams({
            war                 : war,
            gridIndex           : gridIndex,
            unitType            : unitType,
            isDiving            : isDiving,
            isInvisible         : isInvisible,
            unitPlayerIndex     : unitPlayerIndex,
            observerTeamIndexes : new Set([teamIndex])
        })) {
            teamIndexList.push(teamIndex);
        }
    }
    return teamIndexList;
}

export function getAllUnitsOnMapVisibleToTeams(war: BaseWarInterfaceIBwWar.IBwWar, teamIndexes: Set<number>): Set<IUnit> {
    const fogMap                = war.getFogMap();
    const visibilityFromPaths   = fogMap.getVisibilityMapFromPathsForTeams(teamIndexes);
    const visibilityFromTiles   = fogMap.getVisibilityMapFromTilesForTeams(teamIndexes);
    const visibilityFromUnits   = fogMap.getVisibilityMapFromUnitsForTeams(teamIndexes);
    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const units                 = new Set<IUnit>();
    for (const unit of unitMap.getAllUnitsOnMap()) {
        const gridIndex     = unit.getGridIndex();
        const tile          = tileMap.getTile(gridIndex);
        const unitTeamIndex = unit.getTeamIndex();
        if ((teamIndexes.has(unitTeamIndex))                                                ||
            (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, teamIndexes))  ||
            (teamIndexes.has(tile.getTeamIndex()))
        ) {
            units.add(unit);
        } else {
            const unitType = unit.getUnitType();
            if ((unit.getIsDiving()) || (unit.checkIsInvisible(gridIndex))) {
                // Do nothing.
            } else {
                const { x, y }      = gridIndex.getXY();
                const visibility    = Math.max(
                    visibilityFromPaths[x][y],
                    visibilityFromTiles[x][y],
                    visibilityFromUnits[x][y],
                );
                if ((visibility === GameConfigGcWar.VisibilityTypeId.Penetrating)                                          ||
                    ((visibility === GameConfigGcWar.VisibilityTypeId.Inside) && (!tile.checkCanHideUnitType(unitType)))
                ) {
                    units.add(unit);
                }
            }
        }
    }
    return units;
}

export function checkIsTileVisibleToTeams(war: BaseWarInterfaceIBwWar.IBwWar, gridIndex: AuxiliaryTypesGridIndex.GridIndex, observerTeamIndexes: Set<number>): boolean {
    const fogMap = war.getFogMap();
    if (!fogMap.checkHasFogCurrently()) {
        return true;
    }

    const playerManager = war.getPlayerManager();
    const tile          = war.getTileMap().getTile(gridIndex);
    if (observerTeamIndexes.has(tile.getTeamIndex())) {
        return true;
    }

    const unitMap = war.getUnitMap();
    if (_checkHasUnitWithTeamIndexesOnGrid(unitMap, gridIndex, observerTeamIndexes)) {
        return true;
    }
    if (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, observerTeamIndexes)) {
        return true;
    }

    const isUnitHider = tile.checkIsUnitHider();
    for (const playerIndex of playerManager.getPlayerIndexesInTeams(observerTeamIndexes)) {
        const visibilityFromPaths = fogMap.getVisibilityFromPathsForPlayer(gridIndex, playerIndex);
        if (visibilityFromPaths === GameConfigGcWar.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromPaths === GameConfigGcWar.VisibilityTypeId.Inside) {
            if (!isUnitHider) {
                return true;
            }
        }

        const visibilityFromUnits = fogMap.getVisibilityFromUnitsForPlayer(gridIndex, playerIndex);
        if (visibilityFromUnits === GameConfigGcWar.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromUnits === GameConfigGcWar.VisibilityTypeId.Inside) {
            if (!isUnitHider) {
                return true;
            }
        }

        const visibilityFromTiles = fogMap.getVisibilityFromTilesForPlayer(gridIndex, playerIndex);
        if (visibilityFromTiles === GameConfigGcWar.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromTiles === GameConfigGcWar.VisibilityTypeId.Inside) {
            if (!isUnitHider) {
                return true;
            }
        }
    }

    return false;
}

export function getDiscoveredUnitsByPath({ war, path, movingUnit, isUnitDestroyed, visibleUnits, unitVisionInfo }: {
    war             : BaseWarInterfaceIBwWar.IBwWar;
    path            : AuxiliaryTypesGridIndex.GridIndex[];
    movingUnit      : IUnit;
    isUnitDestroyed : boolean;
    visibleUnits    : Set<IUnit>;
    unitVisionInfo  : AuxiliaryTypesUnitVisionInfo.UnitVisionInfo;
}): Set<IUnit> {
    const observerTeamIndex                         = movingUnit.getTeamIndex();
    const tileMap                                   = war.getTileMap();
    const mapSize                                   = tileMap.getMapSize();
    const visibilityMap                             = _createVisibilityMapFromPath(war, path, movingUnit, unitVisionInfo);
    const unitMap                                   = war.getUnitMap();
    const discoveredUnits                           = new Set<IUnit>();
    const destination                               = path[path.length - 1];
    const { width: mapWidth, height: mapHeight }    = mapSize.getWH();
    for (let x = 0; x < mapWidth; ++x) {
        for (let y = 0; y < mapHeight; ++y) {
            const visibility = visibilityMap[x][y];
            if ((visibility != null) && (visibility > 0)) {
                const gridIndex = new AuxiliaryTypesGridIndex.GridIndex(x, y);
                const unit      = unitMap.getUnitOnMap(gridIndex);
                if ((unit) && (!visibleUnits.has(unit))) {
                    if ((unit.getIsDiving()) || (unit.checkIsInvisible(gridIndex))) {
                        if ((!isUnitDestroyed)                          &&
                            (gridIndex.checkIsAdjacent(destination))
                        ) {
                            discoveredUnits.add(unit);
                        }
                    } else {
                        if ((visibility === 2)                                              ||
                            (!_checkIsUnitHiddenByTileToTeam(war, unit, observerTeamIndex))
                        ) {
                            discoveredUnits.add(unit);
                        }
                    }
                }
            }
        }
    }

    return discoveredUnits;
}

export function getVisibilityArrayWithMapFromPath(map: GameConfigGcWar.VisibilityTypeId[][], mapSize: AuxiliaryTypesMapSize.MapSize): GameConfigGcWar.VisibilityTypeId[] | null {
    const { width, height } = mapSize.getWH();
    const data              = new Array(width * height);
    let needSerialize       = false;

    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            data[x + y * width] = map[x][y];
            if ((!needSerialize) && (map[x][y] !== GameConfigGcWar.VisibilityTypeId.Outside)) {
                needSerialize = true;
            }
        }
    }

    return needSerialize ? data : null;
}

function _checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap: IUnitMap, origin: AuxiliaryTypesGridIndex.GridIndex, teamIndexes: Set<number>): boolean {
    for (const adjacentGrid of origin.getAdjacentGrids(unitMap.getMapSize())) {
        const unit = unitMap.getUnitOnMap(adjacentGrid);
        if ((unit) && (teamIndexes.has(unit.getTeamIndex()))) {
            return true;
        }
    }
    return false;
}

function _checkHasUnitWithTeamIndexesOnGrid(unitMap: IUnitMap, gridIndex: AuxiliaryTypesGridIndex.GridIndex, teamIndexes: Set<number>): boolean {
    const unit = unitMap.getUnitOnMap(gridIndex);
    return (unit != null) && (teamIndexes.has(unit.getTeamIndex()));
}

function _checkIsUnitHiddenByTileToTeam(war: BaseWarInterfaceIBwWar.IBwWar, unit: IUnit, teamIndex: number): boolean {
    const gridIndex = unit.getGridIndex();
    const tileMap   = war.getTileMap();
    const tile      = tileMap.getTile(gridIndex);
    const unitType  = unit.getUnitType();
    return (tile.getTeamIndex() !== teamIndex) && (tile.checkCanHideUnitType(unitType));
}

function _createVisibilityMapFromPath(war: BaseWarInterfaceIBwWar.IBwWar, path: AuxiliaryTypesGridIndex.GridIndex[], unit: IUnit, unitVisionInfo: AuxiliaryTypesUnitVisionInfo.UnitVisionInfo): GameConfigGcWar.VisibilityTypeId[][] {
    const mapSize       = war.getTileMap().getMapSize();
    const visibilityMap = HelpersCollection.createEmptyMap(mapSize.getWidth(), mapSize.getHeight(), GameConfigGcWar.VisibilityTypeId.Outside);
    const isPenetrating = unitVisionInfo.isPenetrating;
    for (const node of path) {
        const visionRange = unit.getFinalVisionRange(unitVisionInfo, node);
        if (visionRange == null) {
            continue;
        }

        for (const grid of node.getGridsWithinDistance({ minDistance: 0, maxDistance: 1, mapSize })) {
            visibilityMap[grid.getX()][grid.getY()] = GameConfigGcWar.VisibilityTypeId.Penetrating;
        }
        for (const grid of node.getGridsWithinDistance({ minDistance: 2, maxDistance: visionRange, mapSize })) {
            if (isPenetrating) {
                visibilityMap[grid.getX()][grid.getY()] = GameConfigGcWar.VisibilityTypeId.Penetrating;
            } else {
                if (visibilityMap[grid.getX()][grid.getY()] === GameConfigGcWar.VisibilityTypeId.Outside) {
                    visibilityMap[grid.getX()][grid.getY()] = GameConfigGcWar.VisibilityTypeId.Inside;
                }
            }
        }
    }

    return visibilityMap;
}

export function getAllTilesVisibleToTeam(war: BaseWarInterfaceIBwWar.IBwWar, teamIndex: number): Set<ITile> {
    return getAllTilesVisibleToTeams(war, new Set([teamIndex]));
}
export function getAllTilesVisibleToTeams(war: BaseWarInterfaceIBwWar.IBwWar, teamIndexes: Set<number>): Set<ITile> {
    const fogMap                = war.getFogMap();
    const visibilityFromPaths   = fogMap.getVisibilityMapFromPathsForTeams(teamIndexes);
    const visibilityFromTiles   = fogMap.getVisibilityMapFromTilesForTeams(teamIndexes);
    const visibilityFromUnits   = fogMap.getVisibilityMapFromUnitsForTeams(teamIndexes);
    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const tiles                 = new Set<ITile>();
    const hasFog                = fogMap.checkHasFogCurrently();

    for (const tile of tileMap.getAllTiles()) {
        const gridIndex = tile.getGridIndex();
        if ((!hasFog)                                                                       ||
            (teamIndexes.has(tile.getTeamIndex()))                                          ||
            (_checkHasUnitWithTeamIndexesOnGrid(unitMap, gridIndex, teamIndexes))           ||
            (_checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap, gridIndex, teamIndexes))
        ) {
            tiles.add(tile);
        } else {
            const { x, y }      = gridIndex.getXY();
            const visibility    = Math.max(
                visibilityFromPaths[x][y],
                visibilityFromTiles[x][y],
                visibilityFromUnits[x][y],
            );
            if ((visibility === GameConfigGcWar.VisibilityTypeId.Penetrating)                                  ||
                ((visibility === GameConfigGcWar.VisibilityTypeId.Inside) && (!tile.checkIsUnitHider()))
            ) {
                tiles.add(tile);
            }
        }
    }
    return tiles;
}
