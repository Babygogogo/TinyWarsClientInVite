import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../auxiliaryTypes/MapSize.ts";
import type { UnitVisionInfo } from "../auxiliaryTypes/UnitVisionInfo.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { ForcedFogCode } from "./Constants.ts";
import type { IFogMap } from "./IFogMap.ts";
import {
    getHrwWarClass,
    getMeWarClass,
    getMpwWarClass,
    getRwWarClass,
    getSpwWarClass,
    getTwWarClass,
} from "../gameHelpers/GhFactory.ts";
import { createEmptyMap } from "../helpers/Collection.ts";
import {
    newError,
    getExisted,
    getDefined,
} from "../helpers/Misc.ts";
import { PlayerIndex } from "../players/Constants.ts";
import { DataForFogMapFromPath } from "../proto/schema/CommonProto/WarSerialization/DataForFogMapFromPath.ts";
import { SerialFogMap } from "../proto/schema/CommonProto/WarSerialization/SerialFogMap.ts";
import type { IUnit } from "../units/IUnit.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import {
    getAllTilesVisibleToTeam,
    getAllTilesVisibleToTeams,
    getAllUnitsOnMapVisibleToTeams,
    getVisibilityArrayWithMapFromPath,
} from "../visibilities/Utils.ts";
import { FogType } from "../weathers/Constants.ts";
import { VisibilityTypeId } from "../visibilities/Constants.ts";

export class FogMap implements IFogMap {
    private _forceFogCode?              : ForcedFogCode;
    private _forceExpirePlayerIndex?    : number | null;
    private _forceExpireTurnIndex?      : number | null;
    private _mapSize?                   : MapSize;
    private _allMapsFromPath?           : Map<number, VisibilityTypeId[][]>;
    private _war?                       : IBwWar;

    public init({ data, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialFogMap>;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw newError(`Empty data.`, ClientErrorCode.BwFogMap_Init_00);
        }

        const forceFogCode = data.getForceFogCode();
        if ((forceFogCode !== ForcedFogCode.Clear)   &&
            (forceFogCode !== ForcedFogCode.Fog)     &&
            (forceFogCode !== ForcedFogCode.None)
        ) {
            throw newError(`Invalid forceFogCode: ${forceFogCode}`, ClientErrorCode.BwFogMap_Init_01);
        }

        const forceExpirePlayerIndex = data.getForceExpirePlayerIndex();
        if ((forceExpirePlayerIndex != null)                                                                                    &&
            ((forceExpirePlayerIndex < PlayerIndex.Neutral) || (forceExpirePlayerIndex > playersCountUnneutral))
        ) {
            throw newError(`Invalid forceExpirePlayerIndex: ${forceExpirePlayerIndex}`, ClientErrorCode.BwFogMap_Init_02);
        }

        const forceExpireTurnIndex = data.getForceExpireTurnIndex();
        if (((forceExpirePlayerIndex == null) && (forceExpireTurnIndex != null)) ||
            ((forceExpirePlayerIndex != null) && (forceExpireTurnIndex == null))
        ) {
            throw newError(`Invalid forceExpireTurnIndex: ${forceExpireTurnIndex}`, ClientErrorCode.BwFogMap_Init_03);
        }

        if (!mapSize.checkIsValid()) {
            throw newError(`Invalid mapSize.`, ClientErrorCode.BwFogMap_Init_04);
        }

        const allMapsFromPath   = createEmptyMaps<VisibilityTypeId>(mapSize, playersCountUnneutral);
        const playerIndexSet    = new Set<number>();
        for (const d of data.getMapsFromPath()) {
            const playerIndex = d.getPlayerIndex();
            if (playerIndexSet.has(playerIndex)) {
                throw newError(`Duplicated playerIndex: ${playerIndex}`, ClientErrorCode.BwFogMap_Init_06);
            }
            playerIndexSet.add(playerIndex);

            const mapFromPath = getExisted(allMapsFromPath.get(playerIndex), ClientErrorCode.BwFogMap_Init_07);
            resetMapFromPath(mapFromPath, mapSize, d.getVisibilityArray());
        }

        this._setMapSize(mapSize.clone());
        this._setAllMapsFromPath(allMapsFromPath);
        this.setForceFogCode(forceFogCode);
        this.setForceExpirePlayerIndex(forceExpirePlayerIndex ?? null);
        this.setForceExpireTurnIndex(forceExpireTurnIndex ?? null);
    }
    public fastInit({ data, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialFogMap>;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void {
        this.init({
            data,
            mapSize,
            playersCountUnneutral
        });
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);

        if (war instanceof getHrwWarClass()) {
            const visibleTiles = getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }

        } else if (war instanceof getMeWarClass()) {
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(false);
            }

        } else if (war instanceof getMpwWarClass()) {
            const visibleTiles = getAllTilesVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            for (const tile of war.getTileMap().getAllTiles()) {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        tile.resetTileDataAsHasFog();
                    }
                }
            }

        } else if (war instanceof getRwWarClass()) {
            const visibleTiles = getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }

        } else if (war instanceof getSpwWarClass()) {
            const teamIndexes   = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            const visibleUnits  = getAllUnitsOnMapVisibleToTeams(war, teamIndexes);
            for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                unit.setViewVisible(visibleUnits.has(unit));
            }

            const visibleTiles = getAllTilesVisibleToTeams(war, teamIndexes);
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            }

        } else if (war instanceof getTwWarClass()) {
            // nothing to do

        } else {
            throw newError(`Invalid war.`);
        }
    }

    public serialize(): SerialFogMap {
        const mapSize               = this.getMapSize();
        const serialMapsFromPath    : DataForFogMapFromPath[] = [];
        for (const [playerIndex, map] of this._getAllMapsFromPath()) {
            const visibilityArray = getVisibilityArrayWithMapFromPath(map, mapSize);
            if (visibilityArray != null) {
                serialMapsFromPath.push(DataForFogMapFromPath.fromJson({
                    playerIndex     : playerIndex,
                    visibilityArray : visibilityArray,
                }));
            }
        }

        return SerialFogMap.fromJson({
            forceFogCode            : this.getForceFogCode(),
            forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
            forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
            mapsFromPath            : serialMapsFromPath.map(v => v.toJson()),
        });
    }
    public serializeForCreateSfw(): SerialFogMap {
        const war = this.getWar();
        if (war instanceof getMeWarClass()) {
            const mapSize           = this.getMapSize();
            const maxPlayerIndex    = war.getField().getMaxPlayerIndex();
            const serialMapsFromPath: DataForFogMapFromPath[] = [];
            for (const [playerIndex, map] of this._getAllMapsFromPath()) {
                if (playerIndex > maxPlayerIndex) {
                    continue;
                }

                const visibilityArray = getVisibilityArrayWithMapFromPath(map, mapSize);
                if (visibilityArray != null) {
                    serialMapsFromPath.push(DataForFogMapFromPath.fromJson({
                        playerIndex,
                        visibilityArray,
                    }));
                }
            }

            return SerialFogMap.fromJson({
                forceFogCode            : this.getForceFogCode(),
                forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
                mapsFromPath            : serialMapsFromPath.map(v => v.toJson()),
            });
        }

        if (war.getShouldSerializeFullInfoForFreeModeGames()) {
            return this.serialize();

        } else {
            const mapSize           = this.getMapSize();
            const targetTeamIndexes = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            const mapsFromPath       : DataForFogMapFromPath[] = [];

            for (const [playerIndex, map] of this._getAllMapsFromPath()) {
                const player = war.getPlayer(playerIndex);
                if (targetTeamIndexes.has(player.getTeamIndex())) {
                    const visibilityArray = getVisibilityArrayWithMapFromPath(map, mapSize);
                    if (visibilityArray != null) {
                        mapsFromPath.push(DataForFogMapFromPath.fromJson({
                            playerIndex     : playerIndex,
                            visibilityArray : visibilityArray,
                        }));
                    }
                }
            }
            return SerialFogMap.fromJson({
                forceFogCode            : this.getForceFogCode(),
                forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
                mapsFromPath            : mapsFromPath.map(v => v.toJson()),
            });
        }
    }
    public serializeForCreateMfr(): SerialFogMap {
        return this.serializeForCreateSfw();
    }

    protected _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return getExisted(this._war);
    }

    private _setAllMapsFromPath(mapsFromPath: Map<number, VisibilityTypeId[][]>): void {
        this._allMapsFromPath = mapsFromPath;
    }
    protected _getAllMapsFromPath(): Map<number, VisibilityTypeId[][]> {
        return getExisted(this._allMapsFromPath);
    }
    private _getMapFromPath(playerIndex: number): VisibilityTypeId[][] {
        return getExisted(this._getAllMapsFromPath().get(playerIndex));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _setMapSize(mapSize: MapSize): void {
        this._mapSize = mapSize;
    }
    public getMapSize(): MapSize {
        return getExisted(this._mapSize);
    }

    public setForceFogCode(code: ForcedFogCode): void {
        this._forceFogCode = code;
    }
    public getForceFogCode(): ForcedFogCode {
        return getExisted(this._forceFogCode);
    }

    public checkHasFogByDefault(): boolean {
        return this.getWar().getCommonSettingManager().getSettingsHasFogByDefault();
    }
    public checkHasFogCurrently(): boolean {
        const fogCode = this.getForceFogCode();
        if (fogCode === ForcedFogCode.Fog) {
            return true;
        } else if (fogCode === ForcedFogCode.Clear) {
            return false;
        } else {
            const war               = this.getWar();
            const weatherFogType    = war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getFog();
            if (weatherFogType === FogType.Fog) {
                return true;
            } else if (weatherFogType === FogType.NoFog) {
                return false;
            } else {
                return this.checkHasFogByDefault();
            }
        }
    }

    public setForceExpireTurnIndex(index: number | null): void {
        this._forceExpireTurnIndex = index;
    }
    public getForceExpireTurnIndex(): number | null {
        return getDefined(this._forceExpireTurnIndex, ClientErrorCode.BwFogMap_GetForceExpireTurnIndex_00);
    }

    public setForceExpirePlayerIndex(index: number | null): void {
        this._forceExpirePlayerIndex = index;
    }
    public getForceExpirePlayerIndex(): number | null {
        return getDefined(this._forceExpirePlayerIndex, ClientErrorCode.BwFogMap_GetForceExpirePlayerIndex_00);
    }

    public updateOnPlayerTurnSwitched(): void {
        const expireTurnIndex   = this.getForceExpireTurnIndex();
        const expirePlayerIndex = this.getForceExpirePlayerIndex();
        if ((expireTurnIndex == null) || (expirePlayerIndex == null)) {
            return;
        }

        const turnManager       = this.getWar().getTurnManager();
        const currentTurnIndex  = turnManager.getTurnIndex();
        if ((expireTurnIndex < currentTurnIndex)                                                                ||
            (expireTurnIndex === currentTurnIndex) && (expirePlayerIndex <= turnManager.getPlayerIndexInTurn())
        ) {
            this.setForceFogCode(ForcedFogCode.None);
            this.setForceExpireTurnIndex(null);
            this.setForceExpirePlayerIndex(null);
        }
    }

    public resetAllMapsForPlayer(playerIndex: number): void {
        this.resetMapFromPathsForPlayerWithEncodedData(playerIndex);
    }

    public resetMapFromPathsForPlayer(playerIndex: number, visibilityList: VisibilityTypeId[] | null): void {
        resetMapFromPath(this._getMapFromPath(playerIndex), this.getMapSize(), visibilityList);
    }
    public resetMapFromPathsForPlayerWithEncodedData(playerIndex: number, encodedData?: string): void {
        const map = getExisted(this._getAllMapsFromPath().get(playerIndex));
        if (encodedData == null) {
            fillMap(map, 0);
        } else {
            const { width, height } = this.getMapSize().getWH();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    map[x][y] = Number(encodedData[x + y * width]) as VisibilityTypeId;
                }
            }
        }
    }
    public updateMapFromPathsByUnitAndPath({ unit, unitVisionInfo, path }: {
        unit            : IUnit;
        unitVisionInfo  : UnitVisionInfo;
        path            : GridIndex[];
    }): void {
        const playerIndex   = unit.getPlayerIndex();
        const mapSize       = this.getMapSize();
        const mapFromPath   = this._getMapFromPath(playerIndex);
        for (const pathNode of path) {
            for (const gridIndex of pathNode.getGridsWithinDistance({ minDistance: 0, maxDistance: 1, mapSize })) {
                mapFromPath[gridIndex.getX()][gridIndex.getY()] = VisibilityTypeId.Penetrating;
            }

            const visionRange = unit.getFinalVisionRange(unitVisionInfo, pathNode);
            for (const gridIndex of pathNode.getGridsWithinDistance({ minDistance: 2, maxDistance: visionRange, mapSize })) {
                if (unitVisionInfo.isPenetrating) {
                    mapFromPath[gridIndex.getX()][gridIndex.getY()] = VisibilityTypeId.Penetrating;
                } else {
                    if (mapFromPath[gridIndex.getX()][gridIndex.getY()] === VisibilityTypeId.Outside) {
                        mapFromPath[gridIndex.getX()][gridIndex.getY()] = VisibilityTypeId.Inside;
                    }
                }
            }
        }
    }
    public updateMapFromPathsByVisibilityArray(playerIndex: number, visibilityArray: Undefinable<number[]>): void {
        if (visibilityArray == null) {
            return;
        }

        const map       = this._getMapFromPath(playerIndex);
        const mapSize   = this.getMapSize();
        for (const value of visibilityArray) {
            const gridIndex                         = GridIndex.getGridIndexByGridId(Math.floor(value / 10), mapSize);
            map[gridIndex.getX()][gridIndex.getY()] = value % 10;
        }
    }
    public updateMapFromPathsByUnitMovePathVisibilityArrayForWarEvent(array: number[]): void {
        const mapSize = this.getMapSize();
        for (const value of array) {
            const value1    = Math.floor(value / 10);
            const gridIndex = GridIndex.getGridIndexByGridId(Math.floor(value1 / 100), mapSize);
            this._getMapFromPath(value1 % 100)[gridIndex.getX()][gridIndex.getY()] = value % 10;
        }
    }
    public updateMapFromPathsByFlare(playerIndex: number, flareGridIndex: GridIndex, flareRadius: number): void {
        const map = this._getMapFromPath(playerIndex);
        for (const gridIndex of flareGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: flareRadius, mapSize: this.getMapSize() })) {
            map[gridIndex.getX()][gridIndex.getY()] = 2;
        }
    }

    public getVisibilityFromPathsForPlayer(gridIndex: GridIndex, playerIndex: number): VisibilityTypeId {
        const visibility = this._getMapFromPath(playerIndex)[gridIndex.getX()][gridIndex.getY()];
        if (visibility === VisibilityTypeId.Penetrating) {
            return visibility;
        } else {
            return this.checkHasFogCurrently() ? visibility : VisibilityTypeId.Penetrating;
        }
    }
    public getVisibilityMapFromPathsForTeams(teamIndexes: Set<number>): VisibilityTypeId[][] {
        const { width, height } = this.getMapSize().getWH();
        if (!this.checkHasFogCurrently()) {
            return createEmptyMap<VisibilityTypeId>(width, height, VisibilityTypeId.Penetrating);
        }

        const resultMap     = createEmptyMap<VisibilityTypeId>(width, height, VisibilityTypeId.Outside);
        const mapFromPaths  = this._getAllMapsFromPath();
        for (const playerIndex of this.getWar().getPlayerManager().getPlayerIndexesInTeams(teamIndexes)) {
            const map = getExisted(mapFromPaths.get(playerIndex));
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    resultMap[x][y] = Math.max(
                        resultMap[x][y],
                        map[x][y]
                    );
                }
            }
        }

        return resultMap;
    }
    public getRawVisibilityFromPathsForAllPlayers(gridIndex: GridIndex): VisibilityTypeId[] {
        const array                 : number[]= [];
        const { x, y }              = gridIndex.getXY();
        const playersCountUnneutral = this.getWar().getPlayersCountUnneutral();
        for (let playerIndex = 0; playerIndex <= playersCountUnneutral; ++playerIndex) {
            array.push(this._getMapFromPath(playerIndex)[x][y]);
        }
        return array;
    }
    public updateRawVisibilityFromPathsForAllPlayers(gridIndex: GridIndex, visibilityArray: number[]): void {
        const length = visibilityArray.length;
        if (length <= 0) {
            return;
        }

        const maxPlayerIndex  = Math.min(this.getWar().getPlayerManager().getTotalPlayersCount(true), length);
        const { x, y }        = gridIndex.getXY();
        for (let playerIndex = 0; playerIndex < maxPlayerIndex; ++playerIndex) {
            const visibility = visibilityArray[playerIndex];
            if ((visibility !== VisibilityTypeId.Inside)      &&
                (visibility !== VisibilityTypeId.Outside)     &&
                (visibility !== VisibilityTypeId.Penetrating)
            ) {
                continue;
            }

            this._getMapFromPath(playerIndex)[x][y] = visibility;
        }
    }
    // public getVisibilityMapFromPathsForUser(userId: number): Visibility[][] {
    //     return this.getVisibilityMapFromPathsForTeams(this._getWar().getWatcherTeamIndexes(userId));
    // }

    public getVisibilityFromTilesForPlayer(gridIndex: GridIndex, playerIndex: number): VisibilityTypeId {
        if (!this.checkHasFogCurrently()) {
            return VisibilityTypeId.Penetrating;
        }

        const tileMap = this.getWar().getTileMap();
        {
            const tile = tileMap.getTile(gridIndex);
            if ((tile.getIsVisionEnabledForAllPlayers()) || (tile.getPlayerIndex() === playerIndex)) {
                return VisibilityTypeId.Penetrating;
            }
        }

        const { width, height } = tileMap.getMapSize().getWH();
        const tileGridIndex     = new GridIndex(0, 0);
        for (let x = 0; x < width; ++x) {
            tileGridIndex.setX(x);
            for (let y = 0; y < height; ++y) {
                tileGridIndex.setY(y);

                const tile = tileMap.getTile(tileGridIndex);
                if ((tile.getPlayerIndex() !== playerIndex) && (!tile.getIsVisionEnabledForAllPlayers())) {
                    continue;
                }

                if (gridIndex.getDistance(tileGridIndex) <= tile.getFinalVisionRange()) {
                    return VisibilityTypeId.Inside;
                }
            }
        }

        return VisibilityTypeId.Outside;
    }
    public getVisibilityMapFromTilesForTeam(teamIndex: number): VisibilityTypeId[][] {
        return this.getVisibilityMapFromTilesForTeams(new Set([teamIndex]));
    }
    public getVisibilityMapFromTilesForTeams(teamIndexes: Set<number>): VisibilityTypeId[][] {
        const mapSize           = this.getMapSize();
        const { width, height } = mapSize.getWH();
        const resultMap         = createEmptyMap<VisibilityTypeId>(width, height, VisibilityTypeId.Outside);
        if (!this.checkHasFogCurrently()) {
            resultMap.forEach(column => column.fill(VisibilityTypeId.Penetrating));
        } else {
            const tileMap       = this.getWar().getTileMap();
            const tileGridIndex = new GridIndex(0, 0);
            for (let x = 0; x < width; ++x) {
                tileGridIndex.setX(x);
                for (let y = 0; y < height; ++y) {
                    tileGridIndex.setY(y);

                    const tile = tileMap.getTile(tileGridIndex);
                    if ((!tile.getIsVisionEnabledForAllPlayers()) && (!teamIndexes.has(tile.getTeamIndex()))) {
                        continue;
                    }

                    resultMap[x][y] = VisibilityTypeId.Penetrating;
                    for (const g of tileGridIndex.getGridsWithinDistance({
                        minDistance : 1,
                        maxDistance : tile.getFinalVisionRange(),
                        mapSize     : mapSize,
                    })) {
                        const newX = g.getX();
                        const newY = g.getY();
                        if (resultMap[newX][newY] === VisibilityTypeId.Outside) {
                            resultMap[newX][newY] = VisibilityTypeId.Inside;
                        }
                    }
                }
            }
        }
        return resultMap;
    }
    // public getVisibilityMapFromTilesForUser(userId: number): Visibility[][] {
    //     return this.getVisibilityMapFromTilesForTeams(this._getWar().getWatcherTeamIndexes(userId));
    // }

    public getVisibilityFromUnitsForPlayer(gridIndex: GridIndex, playerIndex: number): VisibilityTypeId {
        if (!this.checkHasFogCurrently()) {
            return VisibilityTypeId.Penetrating;
        } else {
            const unitMap           = this.getWar().getUnitMap();
            const { width, height } = unitMap.getMapSize().getWH();
            let isInside            = false;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const unitGridIndex = new GridIndex(x, y);
                    const unit          = unitMap.getUnitOnMap(unitGridIndex);
                    if ((unit == null) || (unit.getPlayerIndex() !== playerIndex)) {
                        continue;
                    }

                    const visionInfo    = unit.getVisionInfo();
                    const visionRange   = unit.getFinalVisionRange(visionInfo, unitGridIndex);
                    if (visionRange == null) {
                        continue;
                    }

                    const distance = gridIndex.getDistance(unitGridIndex);
                    if (distance <= 1) {
                        return VisibilityTypeId.Penetrating;
                    }
                    if (visionRange >= distance) {
                        if (visionInfo.isPenetrating) {
                            return VisibilityTypeId.Penetrating;
                        }
                        isInside = true;
                    }
                }
            }
            return isInside ? VisibilityTypeId.Inside : VisibilityTypeId.Outside;
        }
    }
    public getVisibilityMapFromUnitsForTeam(teamIndex: number): VisibilityTypeId[][] {
        return this.getVisibilityMapFromUnitsForTeams(new Set([teamIndex]));
    }
    public getVisibilityMapFromUnitsForTeams(teamIndexes: Set<number>): VisibilityTypeId[][] {
        const mapSize           = this.getMapSize();
        const { width, height } = mapSize.getWH();
        const resultMap         = createEmptyMap<VisibilityTypeId>(width, height, VisibilityTypeId.Outside);
        if (!this.checkHasFogCurrently()) {
            resultMap.forEach(column => column.fill(VisibilityTypeId.Penetrating));
        } else {
            const unitMap = this.getWar().getUnitMap();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const unitGridIndex = new GridIndex(x, y);
                    const unit          = unitMap.getUnitOnMap(unitGridIndex);
                    if ((unit == null) || (!teamIndexes.has(unit.getTeamIndex()))) {
                        continue;
                    }

                    const visionInfo    = unit.getVisionInfo();
                    const visionRange   = unit.getFinalVisionRange(visionInfo, unitGridIndex);
                    if (visionRange == null) {
                        continue;
                    }

                    for (const g of unitGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: 1, mapSize })) {
                        resultMap[g.getX()][g.getY()] = VisibilityTypeId.Penetrating;
                    }

                    const isPenetrating = visionInfo.isPenetrating;
                    for (const g of unitGridIndex.getGridsWithinDistance({ minDistance: 2, maxDistance: visionRange, mapSize })) {
                        if (isPenetrating) {
                            resultMap[g.getX()][g.getY()] = VisibilityTypeId.Penetrating;
                        } else {
                            if (resultMap[g.getX()][g.getY()] === VisibilityTypeId.Outside) {
                                resultMap[g.getX()][g.getY()] = VisibilityTypeId.Inside;
                            }
                        }
                    }
                }
            }
        }
        return resultMap;
    }
    // public getVisibilityMapFromUnitsForUser(userId: number): Visibility[][] {
    //     return this.getVisibilityMapFromUnitsForTeams(this._getWar().getWatcherTeamIndexes(userId));
    // }
}

function createEmptyMaps<T extends (number | VisibilityTypeId)>(mapSize: MapSize, maxPlayerIndex: number): Map<number, T[][]> {
    const map = new Map<number, T[][]>();
    for (let i = 0; i <= maxPlayerIndex; ++i) {
        map.set(i, createEmptyMap<T>(mapSize.getWidth(), mapSize.getHeight(), 0 as T));
    }
    return map;
}

function fillMap(map: number[][], data: number): void {
    for (const column of map) {
        column.fill(data);
    }
}

function resetMapFromPath(mapFromPath: VisibilityTypeId[][], mapSize: MapSize, visibilityList: VisibilityTypeId[] | null): void {
    const { width, height } = mapSize.getWH();
    if (mapFromPath.length !== width) {
        throw newError(`Invalid width: ${width}`, ClientErrorCode.BwFogMap_ResetMapFromPath_00);
    }

    for (let x = 0; x < width; ++x) {
        const column = mapFromPath[x];
        if ((column == null) || (column.length !== height)) {
            throw newError(`Invalid height: ${height}`, ClientErrorCode.BwFogMap_ResetMapFromPath_01);
        }
    }

    if (visibilityList == null) {
        fillMap(mapFromPath, 0);
        return;
    }

    if (visibilityList.length !== width * height) {
        throw newError(`Invalid visibilityList.length: ${visibilityList.length}`, ClientErrorCode.BwFogMap_ResetMapFromPath_02);
    }

    for (let x = 0; x < width; ++x) {
        const column = mapFromPath[x];
        for (let y = 0; y < height; ++y) {
            const visibility = visibilityList[x + y * width];
            if ((visibility !== VisibilityTypeId.Inside)    &&
                (visibility !== VisibilityTypeId.Outside)   &&
                (visibility !== VisibilityTypeId.Penetrating)
            ) {
                throw newError(`Invalid visibility: ${visibility}`, ClientErrorCode.BwFogMap_ResetMapFromPath_03);
            }

            column[y] = visibility;
        }
    }
}
