import {
    Helpers_Collection,
    AuxiliaryTypes_GridIndex,
    Visibilities_Constants,
    type BaseWar_Interface_IBwWar,
    type Tiles_Tile,
    type Units_Unit,
    type Units_UnitMap,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_UnitVisionInfo,
} from "../internal.ts";

export function checkIsUnitOnMapVisibleToTeam({ war, gridIndex, unitType, isDiving, isInvisible, unitPlayerIndex, observerTeamIndex }: {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    gridIndex           : AuxiliaryTypes_GridIndex.GridIndex;
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
        observerTeamIndexes : new Set<number>([observerTeamIndex]),
    });
}
export function checkIsUnitOnMapVisibleToTeams({ war, gridIndex, unitType, isDiving, isInvisible, unitPlayerIndex, observerTeamIndexes }: {
    war                 : BaseWar_Interface_IBwWar.IBwWar;
    gridIndex           : AuxiliaryTypes_GridIndex.GridIndex;
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
        if (visibilityFromPaths === Visibilities_Constants.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromPaths === Visibilities_Constants.VisibilityTypeId.Inside) {
            if (!canTileHideUnit) {
                return true;
            }
        }

        const visibilityFromUnits = fogMap.getVisibilityFromUnitsForPlayer(gridIndex, playerIndex);
        if (visibilityFromUnits === Visibilities_Constants.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromUnits === Visibilities_Constants.VisibilityTypeId.Inside) {
            if (!canTileHideUnit) {
                return true;
            }
        }

        const visibilityFromTiles = fogMap.getVisibilityFromTilesForPlayer(gridIndex, playerIndex);
        if (visibilityFromTiles === Visibilities_Constants.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromTiles === Visibilities_Constants.VisibilityTypeId.Inside) {
            if (!canTileHideUnit) {
                return true;
            }
        }
    }

    return false;
}
export function getObserverTeamIndexListForUnitOnMap({ war, gridIndex }: {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    gridIndex       : AuxiliaryTypes_GridIndex.GridIndex;
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
            observerTeamIndexes : new Set([teamIndex]),
        })) {
            teamIndexList.push(teamIndex);
        }
    }
    return teamIndexList;
}

export function getAllUnitsOnMapVisibleToTeams(war: BaseWar_Interface_IBwWar.IBwWar, teamIndexes: Set<number>): Set<Units_Unit.Unit> {
    const fogMap                = war.getFogMap();
    const visibilityFromPaths   = fogMap.getVisibilityMapFromPathsForTeams(teamIndexes);
    const visibilityFromTiles   = fogMap.getVisibilityMapFromTilesForTeams(teamIndexes);
    const visibilityFromUnits   = fogMap.getVisibilityMapFromUnitsForTeams(teamIndexes);
    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const units                 = new Set<Units_Unit.Unit>();
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
                if ((visibility === Visibilities_Constants.VisibilityTypeId.Penetrating)                                          ||
                    ((visibility === Visibilities_Constants.VisibilityTypeId.Inside) && (!tile.checkCanHideUnitType(unitType)))
                ) {
                    units.add(unit);
                }
            }
        }
    }
    return units;
}

export function checkIsTileVisibleToTeams(war: BaseWar_Interface_IBwWar.IBwWar, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, observerTeamIndexes: Set<number>): boolean {
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
        if (visibilityFromPaths === Visibilities_Constants.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromPaths === Visibilities_Constants.VisibilityTypeId.Inside) {
            if (!isUnitHider) {
                return true;
            }
        }

        const visibilityFromUnits = fogMap.getVisibilityFromUnitsForPlayer(gridIndex, playerIndex);
        if (visibilityFromUnits === Visibilities_Constants.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromUnits === Visibilities_Constants.VisibilityTypeId.Inside) {
            if (!isUnitHider) {
                return true;
            }
        }

        const visibilityFromTiles = fogMap.getVisibilityFromTilesForPlayer(gridIndex, playerIndex);
        if (visibilityFromTiles === Visibilities_Constants.VisibilityTypeId.Penetrating) {
            return true;
        } else if (visibilityFromTiles === Visibilities_Constants.VisibilityTypeId.Inside) {
            if (!isUnitHider) {
                return true;
            }
        }
    }

    return false;
}

export function getDiscoveredUnitsByPath({ war, path, movingUnit, isUnitDestroyed, visibleUnits, unitVisionInfo }: {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    path            : AuxiliaryTypes_GridIndex.GridIndex[];
    movingUnit      : Units_Unit.Unit;
    isUnitDestroyed : boolean;
    visibleUnits    : Set<Units_Unit.Unit>;
    unitVisionInfo  : AuxiliaryTypes_UnitVisionInfo.UnitVisionInfo;
}): Set<Units_Unit.Unit> {
    const observerTeamIndex                         = movingUnit.getTeamIndex();
    const tileMap                                   = war.getTileMap();
    const mapSize                                   = tileMap.getMapSize();
    const visibilityMap                             = _createVisibilityMapFromPath(war, path, movingUnit, unitVisionInfo);
    const unitMap                                   = war.getUnitMap();
    const discoveredUnits                           = new Set<Units_Unit.Unit>();
    const destination                               = path[path.length - 1];
    const { width: mapWidth, height: mapHeight }    = mapSize.getWH();
    for (let x = 0; x < mapWidth; ++x) {
        for (let y = 0; y < mapHeight; ++y) {
            const visibility = visibilityMap[x][y];
            if ((visibility != null) && (visibility > 0)) {
                const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
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

export function getVisibilityArrayWithMapFromPath(map: Visibilities_Constants.VisibilityTypeId[][], mapSize: AuxiliaryTypes_MapSize.MapSize): Visibilities_Constants.VisibilityTypeId[] | null {
    const { width, height } = mapSize.getWH();
    const data              = new Array(width * height);
    let needSerialize       = false;

    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            data[x + y * width] = map[x][y];
            if ((!needSerialize) && (map[x][y] !== Visibilities_Constants.VisibilityTypeId.Outside)) {
                needSerialize = true;
            }
        }
    }

    return needSerialize ? data : null;
}

function _checkHasUnitWithTeamIndexesOnAdjacentGrids(unitMap: Units_UnitMap.UnitMap, origin: AuxiliaryTypes_GridIndex.GridIndex, teamIndexes: Set<number>): boolean {
    for (const adjacentGrid of origin.getAdjacentGrids(unitMap.getMapSize())) {
        const unit = unitMap.getUnitOnMap(adjacentGrid);
        if ((unit) && (teamIndexes.has(unit.getTeamIndex()))) {
            return true;
        }
    }
    return false;
}

function _checkHasUnitWithTeamIndexesOnGrid(unitMap: Units_UnitMap.UnitMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, teamIndexes: Set<number>): boolean {
    const unit = unitMap.getUnitOnMap(gridIndex);
    return (unit != null) && (teamIndexes.has(unit.getTeamIndex()));
}

function _checkIsUnitHiddenByTileToTeam(war: BaseWar_Interface_IBwWar.IBwWar, unit: Units_Unit.Unit, teamIndex: number): boolean {
    const gridIndex = unit.getGridIndex();
    const tileMap   = war.getTileMap();
    const tile      = tileMap.getTile(gridIndex);
    const unitType  = unit.getUnitType();
    return (tile.getTeamIndex() !== teamIndex) && (tile.checkCanHideUnitType(unitType));
}

function _createVisibilityMapFromPath(war: BaseWar_Interface_IBwWar.IBwWar, path: AuxiliaryTypes_GridIndex.GridIndex[], unit: Units_Unit.Unit, unitVisionInfo: AuxiliaryTypes_UnitVisionInfo.UnitVisionInfo): Visibilities_Constants.VisibilityTypeId[][] {
    const mapSize       = war.getTileMap().getMapSize();
    const visibilityMap = Helpers_Collection.createEmptyMap(mapSize.getWidth(), mapSize.getHeight(), Visibilities_Constants.VisibilityTypeId.Outside);
    const isPenetrating = unitVisionInfo.isPenetrating;
    for (const node of path) {
        const visionRange = unit.getFinalVisionRange(unitVisionInfo, node);
        if (visionRange == null) {
            continue;
        }

        for (const grid of node.getGridsWithinDistance({ minDistance : 0, maxDistance : 1, mapSize })) {
            visibilityMap[grid.getX()][grid.getY()] = Visibilities_Constants.VisibilityTypeId.Penetrating;
        }
        for (const grid of node.getGridsWithinDistance({ minDistance : 2, maxDistance : visionRange, mapSize })) {
            if (isPenetrating) {
                visibilityMap[grid.getX()][grid.getY()] = Visibilities_Constants.VisibilityTypeId.Penetrating;
            } else {
                if (visibilityMap[grid.getX()][grid.getY()] === Visibilities_Constants.VisibilityTypeId.Outside) {
                    visibilityMap[grid.getX()][grid.getY()] = Visibilities_Constants.VisibilityTypeId.Inside;
                }
            }
        }
    }

    return visibilityMap;
}

export function getAllTilesVisibleToTeam(war: BaseWar_Interface_IBwWar.IBwWar, teamIndex: number): Set<Tiles_Tile.Tile> {
    return getAllTilesVisibleToTeams(war, new Set([teamIndex]));
}
export function getAllTilesVisibleToTeams(war: BaseWar_Interface_IBwWar.IBwWar, teamIndexes: Set<number>): Set<Tiles_Tile.Tile> {
    const fogMap                = war.getFogMap();
    const visibilityFromPaths   = fogMap.getVisibilityMapFromPathsForTeams(teamIndexes);
    const visibilityFromTiles   = fogMap.getVisibilityMapFromTilesForTeams(teamIndexes);
    const visibilityFromUnits   = fogMap.getVisibilityMapFromUnitsForTeams(teamIndexes);
    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const tiles                 = new Set<Tiles_Tile.Tile>();
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
            if ((visibility === Visibilities_Constants.VisibilityTypeId.Penetrating)                                  ||
                ((visibility === Visibilities_Constants.VisibilityTypeId.Inside) && (!tile.checkIsUnitHider()))
            ) {
                tiles.add(tile);
            }
        }
    }
    return tiles;
}
