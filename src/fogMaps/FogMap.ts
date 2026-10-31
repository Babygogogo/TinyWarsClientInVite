import {
    FogMaps_Constants,
    AuxiliaryTypes_GridIndex,
    HalfwayReplayWar_Model_HrwWar,
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWar,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    type FogMaps_IFogMap,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_UnitVisionInfo,
    Utils_ClientErrorCode,
    Helpers_Collection,
    Weathers_Constants,
    Visibilities_Utils,
    Helpers_Misc,
    Players_Constants,
    Visibilities_Constants,
    type Units_Unit,
} from "../internal.ts";

import { DataForFogMapFromPath } from "../proto/schema/CommonProto/WarSerialization/DataForFogMapFromPath.ts";
import { SerialFogMap } from "../proto/schema/CommonProto/WarSerialization/SerialFogMap.ts";

export class FogMap implements FogMaps_IFogMap.IFogMap {
    private _forceFogCode?              : FogMaps_Constants.ForcedFogCode;
    private _forceExpirePlayerIndex?    : number | null;
    private _forceExpireTurnIndex?      : number | null;
    private _mapSize?                   : AuxiliaryTypes_MapSize.MapSize;
    private _allMapsFromPath?           : Map<number, Visibilities_Constants.VisibilityTypeId[][]>;
    private _war?                       : BaseWar_Interface_IBwWar.IBwWar;

    public init({ data, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialFogMap>;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw Helpers_Misc.newError(`Empty data.`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_Init_00);
        }

        const forceFogCode = data.getForceFogCode();
        if ((forceFogCode !== FogMaps_Constants.ForcedFogCode.Clear)   &&
            (forceFogCode !== FogMaps_Constants.ForcedFogCode.Fog)     &&
            (forceFogCode !== FogMaps_Constants.ForcedFogCode.None)
        ) {
            throw Helpers_Misc.newError(`Invalid forceFogCode: ${forceFogCode}`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_Init_01);
        }

        const forceExpirePlayerIndex = data.getForceExpirePlayerIndex();
        if ((forceExpirePlayerIndex != null)                                                                                    &&
            ((forceExpirePlayerIndex < Players_Constants.PlayerIndex.Neutral) || (forceExpirePlayerIndex > playersCountUnneutral))
        ) {
            throw Helpers_Misc.newError(`Invalid forceExpirePlayerIndex: ${forceExpirePlayerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_Init_02);
        }

        const forceExpireTurnIndex = data.getForceExpireTurnIndex();
        if (((forceExpirePlayerIndex == null) && (forceExpireTurnIndex != null)) ||
            ((forceExpirePlayerIndex != null) && (forceExpireTurnIndex == null))
        ) {
            throw Helpers_Misc.newError(`Invalid forceExpireTurnIndex: ${forceExpireTurnIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_Init_03);
        }

        if (!mapSize.checkIsValid()) {
            throw Helpers_Misc.newError(`Invalid mapSize.`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_Init_04);
        }

        const allMapsFromPath   = createEmptyMaps<Visibilities_Constants.VisibilityTypeId>(mapSize, playersCountUnneutral);
        const playerIndexSet    = new Set<number>();
        for (const d of data.getMapsFromPath()) {
            const playerIndex = d.getPlayerIndex();
            if (playerIndexSet.has(playerIndex)) {
                throw Helpers_Misc.newError(`Duplicated playerIndex: ${playerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_Init_06);
            }
            playerIndexSet.add(playerIndex);

            const mapFromPath = Helpers_Misc.getExisted(allMapsFromPath.get(playerIndex), Utils_ClientErrorCode.ClientErrorCode.BwFogMap_Init_07);
            resetMapFromPath(mapFromPath, mapSize, d.getVisibilityArray());
        }

        this._setMapSize(mapSize.clone());
        this._setAllMapsFromPath(allMapsFromPath);
        this.setForceFogCode(forceFogCode);
        this.setForceExpirePlayerIndex(forceExpirePlayerIndex ?? null);
        this.setForceExpireTurnIndex(forceExpireTurnIndex ?? null);
    }
    public fastInit({ data, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialFogMap>;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        this.init({
            data,
            mapSize,
            playersCountUnneutral,
        });
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._setWar(war);

        if (war instanceof HalfwayReplayWar_Model_HrwWar.HrwWar) {
            const visibleTiles = Visibilities_Utils.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }

        } else if (war instanceof MapEditor_Model_MeWar.MeWar) {
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(false);
            }

        } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
            const visibleTiles = Visibilities_Utils.getAllTilesVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            for (const tile of war.getTileMap().getAllTiles()) {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        tile.resetTileDataAsHasFog();
                    }
                }
            }

        } else if (war instanceof ReplayWar_Model_RwWar.RwWar) {
            const visibleTiles = Visibilities_Utils.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }

        } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
            const teamIndexes   = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            const visibleUnits  = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes);
            for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                unit.setViewVisible(visibleUnits.has(unit));
            }

            const visibleTiles = Visibilities_Utils.getAllTilesVisibleToTeams(war, teamIndexes);
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            }

        } else if (war instanceof TestWar_Model_TwWar.TwWar) {
            // nothing to do

        } else {
            throw Helpers_Misc.newError(`Invalid war.`);
        }
    }

    public serialize(): SerialFogMap {
        const mapSize               = this.getMapSize();
        const serialMapsFromPath    : DataForFogMapFromPath[] = [];
        for (const [playerIndex, map] of this._getAllMapsFromPath()) {
            const visibilityArray = Visibilities_Utils.getVisibilityArrayWithMapFromPath(map, mapSize);
            if (visibilityArray != null) {
                serialMapsFromPath.push(DataForFogMapFromPath.fromJson({
                    playerIndex     : playerIndex,
                    visibilityArray : visibilityArray,
                }));
            }
        }

        return SerialFogMap.fromJson({
            forceFogCode           : this.getForceFogCode(),
            forceExpirePlayerIndex : this.getForceExpirePlayerIndex(),
            forceExpireTurnIndex   : this.getForceExpireTurnIndex(),
            mapsFromPath           : serialMapsFromPath.map(v => v.toJson()),
        });
    }
    public serializeForCreateSfw(): SerialFogMap {
        const war = this.getWar();
        if (war instanceof MapEditor_Model_MeWar.MeWar) {
            const mapSize           = this.getMapSize();
            const maxPlayerIndex    = war.getField().getMaxPlayerIndex();
            const serialMapsFromPath: DataForFogMapFromPath[] = [];
            for (const [playerIndex, map] of this._getAllMapsFromPath()) {
                if (playerIndex > maxPlayerIndex) {
                    continue;
                }

                const visibilityArray = Visibilities_Utils.getVisibilityArrayWithMapFromPath(map, mapSize);
                if (visibilityArray != null) {
                    serialMapsFromPath.push(DataForFogMapFromPath.fromJson({
                        playerIndex,
                        visibilityArray,
                    }));
                }
            }

            return SerialFogMap.fromJson({
                forceFogCode           : this.getForceFogCode(),
                forceExpirePlayerIndex : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex   : this.getForceExpireTurnIndex(),
                mapsFromPath           : serialMapsFromPath.map(v => v.toJson()),
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
                    const visibilityArray = Visibilities_Utils.getVisibilityArrayWithMapFromPath(map, mapSize);
                    if (visibilityArray != null) {
                        mapsFromPath.push(DataForFogMapFromPath.fromJson({
                            playerIndex     : playerIndex,
                            visibilityArray : visibilityArray,
                        }));
                    }
                }
            }
            return SerialFogMap.fromJson({
                forceFogCode           : this.getForceFogCode(),
                forceExpirePlayerIndex : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex   : this.getForceExpireTurnIndex(),
                mapsFromPath           : mapsFromPath.map(v => v.toJson()),
            });
        }
    }
    public serializeForCreateMfr(): SerialFogMap {
        return this.serializeForCreateSfw();
    }

    protected _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    public getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    private _setAllMapsFromPath(mapsFromPath: Map<number, Visibilities_Constants.VisibilityTypeId[][]>): void {
        this._allMapsFromPath = mapsFromPath;
    }
    protected _getAllMapsFromPath(): Map<number, Visibilities_Constants.VisibilityTypeId[][]> {
        return Helpers_Misc.getExisted(this._allMapsFromPath);
    }
    private _getMapFromPath(playerIndex: number): Visibilities_Constants.VisibilityTypeId[][] {
        return Helpers_Misc.getExisted(this._getAllMapsFromPath().get(playerIndex));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _setMapSize(mapSize: AuxiliaryTypes_MapSize.MapSize): void {
        this._mapSize = mapSize;
    }
    public getMapSize(): AuxiliaryTypes_MapSize.MapSize {
        return Helpers_Misc.getExisted(this._mapSize);
    }

    public setForceFogCode(code: FogMaps_Constants.ForcedFogCode): void {
        this._forceFogCode = code;
    }
    public getForceFogCode(): FogMaps_Constants.ForcedFogCode {
        return Helpers_Misc.getExisted(this._forceFogCode);
    }

    public checkHasFogByDefault(): boolean {
        return this.getWar().getCommonSettingManager().getSettingsHasFogByDefault();
    }
    public checkHasFogCurrently(): boolean {
        const fogCode = this.getForceFogCode();
        if (fogCode === FogMaps_Constants.ForcedFogCode.Fog) {
            return true;
        } else if (fogCode === FogMaps_Constants.ForcedFogCode.Clear) {
            return false;
        } else {
            const war               = this.getWar();
            const weatherFogType    = war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getFog();
            if (weatherFogType === Weathers_Constants.FogType.Fog) {
                return true;
            } else if (weatherFogType === Weathers_Constants.FogType.NoFog) {
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
        return Helpers_Misc.getDefined(this._forceExpireTurnIndex, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_GetForceExpireTurnIndex_00);
    }

    public setForceExpirePlayerIndex(index: number | null): void {
        this._forceExpirePlayerIndex = index;
    }
    public getForceExpirePlayerIndex(): number | null {
        return Helpers_Misc.getDefined(this._forceExpirePlayerIndex, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_GetForceExpirePlayerIndex_00);
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
            this.setForceFogCode(FogMaps_Constants.ForcedFogCode.None);
            this.setForceExpireTurnIndex(null);
            this.setForceExpirePlayerIndex(null);
        }
    }

    public resetAllMapsForPlayer(playerIndex: number): void {
        this.resetMapFromPathsForPlayerWithEncodedData(playerIndex);
    }

    public resetMapFromPathsForPlayer(playerIndex: number, visibilityList: Visibilities_Constants.VisibilityTypeId[] | null): void {
        resetMapFromPath(this._getMapFromPath(playerIndex), this.getMapSize(), visibilityList);
    }
    public resetMapFromPathsForPlayerWithEncodedData(playerIndex: number, encodedData?: string): void {
        const map = Helpers_Misc.getExisted(this._getAllMapsFromPath().get(playerIndex));
        if (encodedData == null) {
            fillMap(map, 0);
        } else {
            const { width, height } = this.getMapSize().getWH();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    map[x][y] = Number(encodedData[x + y * width]) as Visibilities_Constants.VisibilityTypeId;
                }
            }
        }
    }
    public updateMapFromPathsByUnitAndPath({ unit, unitVisionInfo, path }: {
        unit            : Units_Unit.Unit;
        unitVisionInfo  : AuxiliaryTypes_UnitVisionInfo.UnitVisionInfo;
        path            : AuxiliaryTypes_GridIndex.GridIndex[];
    }): void {
        const playerIndex   = unit.getPlayerIndex();
        const mapSize       = this.getMapSize();
        const mapFromPath   = this._getMapFromPath(playerIndex);
        for (const pathNode of path) {
            for (const gridIndex of pathNode.getGridsWithinDistance({ minDistance : 0, maxDistance : 1, mapSize })) {
                mapFromPath[gridIndex.getX()][gridIndex.getY()] = Visibilities_Constants.VisibilityTypeId.Penetrating;
            }

            const visionRange = unit.getFinalVisionRange(unitVisionInfo, pathNode);
            for (const gridIndex of pathNode.getGridsWithinDistance({ minDistance : 2, maxDistance : visionRange, mapSize })) {
                if (unitVisionInfo.isPenetrating) {
                    mapFromPath[gridIndex.getX()][gridIndex.getY()] = Visibilities_Constants.VisibilityTypeId.Penetrating;
                } else {
                    if (mapFromPath[gridIndex.getX()][gridIndex.getY()] === Visibilities_Constants.VisibilityTypeId.Outside) {
                        mapFromPath[gridIndex.getX()][gridIndex.getY()] = Visibilities_Constants.VisibilityTypeId.Inside;
                    }
                }
            }
        }
    }
    public updateMapFromPathsByVisibilityArray(playerIndex: number, visibilityArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>): void {
        if (visibilityArray == null) {
            return;
        }

        const map       = this._getMapFromPath(playerIndex);
        const mapSize   = this.getMapSize();
        for (const value of visibilityArray) {
            const gridIndex                         = AuxiliaryTypes_GridIndex.GridIndex.getGridIndexByGridId(Math.floor(value / 10), mapSize);
            map[gridIndex.getX()][gridIndex.getY()] = value % 10;
        }
    }
    public updateMapFromPathsByUnitMovePathVisibilityArrayForWarEvent(array: number[]): void {
        const mapSize = this.getMapSize();
        for (const value of array) {
            const value1    = Math.floor(value / 10);
            const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.getGridIndexByGridId(Math.floor(value1 / 100), mapSize);
            this._getMapFromPath(value1 % 100)[gridIndex.getX()][gridIndex.getY()] = value % 10;
        }
    }
    public updateMapFromPathsByFlare(playerIndex: number, flareGridIndex: AuxiliaryTypes_GridIndex.GridIndex, flareRadius: number): void {
        const map = this._getMapFromPath(playerIndex);
        for (const gridIndex of flareGridIndex.getGridsWithinDistance({ minDistance : 0, maxDistance : flareRadius, mapSize : this.getMapSize() })) {
            map[gridIndex.getX()][gridIndex.getY()] = 2;
        }
    }

    public getVisibilityFromPathsForPlayer(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, playerIndex: number): Visibilities_Constants.VisibilityTypeId {
        const visibility = this._getMapFromPath(playerIndex)[gridIndex.getX()][gridIndex.getY()];
        if (visibility === Visibilities_Constants.VisibilityTypeId.Penetrating) {
            return visibility;
        } else {
            return this.checkHasFogCurrently() ? visibility : Visibilities_Constants.VisibilityTypeId.Penetrating;
        }
    }
    public getVisibilityMapFromPathsForTeams(teamIndexes: Set<number>): Visibilities_Constants.VisibilityTypeId[][] {
        const { width, height } = this.getMapSize().getWH();
        if (!this.checkHasFogCurrently()) {
            return Helpers_Collection.createEmptyMap<Visibilities_Constants.VisibilityTypeId>(width, height, Visibilities_Constants.VisibilityTypeId.Penetrating);
        }

        const resultMap     = Helpers_Collection.createEmptyMap<Visibilities_Constants.VisibilityTypeId>(width, height, Visibilities_Constants.VisibilityTypeId.Outside);
        const mapFromPaths  = this._getAllMapsFromPath();
        for (const playerIndex of this.getWar().getPlayerManager().getPlayerIndexesInTeams(teamIndexes)) {
            const map = Helpers_Misc.getExisted(mapFromPaths.get(playerIndex));
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    resultMap[x][y] = Math.max(
                        resultMap[x][y],
                        map[x][y],
                    );
                }
            }
        }

        return resultMap;
    }
    public getRawVisibilityFromPathsForAllPlayers(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Visibilities_Constants.VisibilityTypeId[] {
        const array                 : number[]= [];
        const { x, y }              = gridIndex.getXY();
        const playersCountUnneutral = this.getWar().getPlayersCountUnneutral();
        for (let playerIndex = 0; playerIndex <= playersCountUnneutral; ++playerIndex) {
            array.push(this._getMapFromPath(playerIndex)[x][y]);
        }
        return array;
    }
    public updateRawVisibilityFromPathsForAllPlayers(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, visibilityArray: number[]): void {
        const length = visibilityArray.length;
        if (length <= 0) {
            return;
        }

        const maxPlayerIndex  = Math.min(this.getWar().getPlayerManager().getTotalPlayersCount(true), length);
        const { x, y }        = gridIndex.getXY();
        for (let playerIndex = 0; playerIndex < maxPlayerIndex; ++playerIndex) {
            const visibility = visibilityArray[playerIndex];
            if ((visibility !== Visibilities_Constants.VisibilityTypeId.Inside)      &&
                (visibility !== Visibilities_Constants.VisibilityTypeId.Outside)     &&
                (visibility !== Visibilities_Constants.VisibilityTypeId.Penetrating)
            ) {
                continue;
            }

            this._getMapFromPath(playerIndex)[x][y] = visibility;
        }
    }
    // public getVisibilityMapFromPathsForUser(userId: number): Visibility[][] {
    //     return this.getVisibilityMapFromPathsForTeams(this._getWar().getWatcherTeamIndexes(userId));
    // }

    public getVisibilityFromTilesForPlayer(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, playerIndex: number): Visibilities_Constants.VisibilityTypeId {
        if (!this.checkHasFogCurrently()) {
            return Visibilities_Constants.VisibilityTypeId.Penetrating;
        }

        const tileMap = this.getWar().getTileMap();
        {
            const tile = tileMap.getTile(gridIndex);
            if ((tile.getIsVisionEnabledForAllPlayers()) || (tile.getPlayerIndex() === playerIndex)) {
                return Visibilities_Constants.VisibilityTypeId.Penetrating;
            }
        }

        const { width, height } = tileMap.getMapSize().getWH();
        const tileGridIndex     = new AuxiliaryTypes_GridIndex.GridIndex(0, 0);
        for (let x = 0; x < width; ++x) {
            tileGridIndex.setX(x);
            for (let y = 0; y < height; ++y) {
                tileGridIndex.setY(y);

                const tile = tileMap.getTile(tileGridIndex);
                if ((tile.getPlayerIndex() !== playerIndex) && (!tile.getIsVisionEnabledForAllPlayers())) {
                    continue;
                }

                if (gridIndex.getDistance(tileGridIndex) <= tile.getFinalVisionRange()) {
                    return Visibilities_Constants.VisibilityTypeId.Inside;
                }
            }
        }

        return Visibilities_Constants.VisibilityTypeId.Outside;
    }
    public getVisibilityMapFromTilesForTeam(teamIndex: number): Visibilities_Constants.VisibilityTypeId[][] {
        return this.getVisibilityMapFromTilesForTeams(new Set([teamIndex]));
    }
    public getVisibilityMapFromTilesForTeams(teamIndexes: Set<number>): Visibilities_Constants.VisibilityTypeId[][] {
        const mapSize           = this.getMapSize();
        const { width, height } = mapSize.getWH();
        const resultMap         = Helpers_Collection.createEmptyMap<Visibilities_Constants.VisibilityTypeId>(width, height, Visibilities_Constants.VisibilityTypeId.Outside);
        if (!this.checkHasFogCurrently()) {
            resultMap.forEach(column => column.fill(Visibilities_Constants.VisibilityTypeId.Penetrating));
        } else {
            const tileMap       = this.getWar().getTileMap();
            const tileGridIndex = new AuxiliaryTypes_GridIndex.GridIndex(0, 0);
            for (let x = 0; x < width; ++x) {
                tileGridIndex.setX(x);
                for (let y = 0; y < height; ++y) {
                    tileGridIndex.setY(y);

                    const tile = tileMap.getTile(tileGridIndex);
                    if ((!tile.getIsVisionEnabledForAllPlayers()) && (!teamIndexes.has(tile.getTeamIndex()))) {
                        continue;
                    }

                    resultMap[x][y] = Visibilities_Constants.VisibilityTypeId.Penetrating;
                    for (const g of tileGridIndex.getGridsWithinDistance({
                        minDistance : 1,
                        maxDistance : tile.getFinalVisionRange(),
                        mapSize     : mapSize,
                    })) {
                        const newX = g.getX();
                        const newY = g.getY();
                        if (resultMap[newX][newY] === Visibilities_Constants.VisibilityTypeId.Outside) {
                            resultMap[newX][newY] = Visibilities_Constants.VisibilityTypeId.Inside;
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

    public getVisibilityFromUnitsForPlayer(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, playerIndex: number): Visibilities_Constants.VisibilityTypeId {
        if (!this.checkHasFogCurrently()) {
            return Visibilities_Constants.VisibilityTypeId.Penetrating;
        } else {
            const unitMap           = this.getWar().getUnitMap();
            const { width, height } = unitMap.getMapSize().getWH();
            let isInside            = false;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const unitGridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
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
                        return Visibilities_Constants.VisibilityTypeId.Penetrating;
                    }
                    if (visionRange >= distance) {
                        if (visionInfo.isPenetrating) {
                            return Visibilities_Constants.VisibilityTypeId.Penetrating;
                        }
                        isInside = true;
                    }
                }
            }
            return isInside ? Visibilities_Constants.VisibilityTypeId.Inside : Visibilities_Constants.VisibilityTypeId.Outside;
        }
    }
    public getVisibilityMapFromUnitsForTeam(teamIndex: number): Visibilities_Constants.VisibilityTypeId[][] {
        return this.getVisibilityMapFromUnitsForTeams(new Set([teamIndex]));
    }
    public getVisibilityMapFromUnitsForTeams(teamIndexes: Set<number>): Visibilities_Constants.VisibilityTypeId[][] {
        const mapSize           = this.getMapSize();
        const { width, height } = mapSize.getWH();
        const resultMap         = Helpers_Collection.createEmptyMap<Visibilities_Constants.VisibilityTypeId>(width, height, Visibilities_Constants.VisibilityTypeId.Outside);
        if (!this.checkHasFogCurrently()) {
            resultMap.forEach(column => column.fill(Visibilities_Constants.VisibilityTypeId.Penetrating));
        } else {
            const unitMap = this.getWar().getUnitMap();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const unitGridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
                    const unit          = unitMap.getUnitOnMap(unitGridIndex);
                    if ((unit == null) || (!teamIndexes.has(unit.getTeamIndex()))) {
                        continue;
                    }

                    const visionInfo    = unit.getVisionInfo();
                    const visionRange   = unit.getFinalVisionRange(visionInfo, unitGridIndex);
                    if (visionRange == null) {
                        continue;
                    }

                    for (const g of unitGridIndex.getGridsWithinDistance({ minDistance : 0, maxDistance : 1, mapSize })) {
                        resultMap[g.getX()][g.getY()] = Visibilities_Constants.VisibilityTypeId.Penetrating;
                    }

                    const isPenetrating = visionInfo.isPenetrating;
                    for (const g of unitGridIndex.getGridsWithinDistance({ minDistance : 2, maxDistance : visionRange, mapSize })) {
                        if (isPenetrating) {
                            resultMap[g.getX()][g.getY()] = Visibilities_Constants.VisibilityTypeId.Penetrating;
                        } else {
                            if (resultMap[g.getX()][g.getY()] === Visibilities_Constants.VisibilityTypeId.Outside) {
                                resultMap[g.getX()][g.getY()] = Visibilities_Constants.VisibilityTypeId.Inside;
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

function createEmptyMaps<T extends (number | Visibilities_Constants.VisibilityTypeId)>(mapSize: AuxiliaryTypes_MapSize.MapSize, maxPlayerIndex: number): Map<number, T[][]> {
    const map = new Map<number, T[][]>();
    for (let i = 0; i <= maxPlayerIndex; ++i) {
        map.set(i, Helpers_Collection.createEmptyMap<T>(mapSize.getWidth(), mapSize.getHeight(), 0 as T));
    }
    return map;
}

function fillMap(map: number[][], data: number): void {
    for (const column of map) {
        column.fill(data);
    }
}

function resetMapFromPath(mapFromPath: Visibilities_Constants.VisibilityTypeId[][], mapSize: AuxiliaryTypes_MapSize.MapSize, visibilityList: Visibilities_Constants.VisibilityTypeId[] | null): void {
    const { width, height } = mapSize.getWH();
    if (mapFromPath.length !== width) {
        throw Helpers_Misc.newError(`Invalid width: ${width}`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_ResetMapFromPath_00);
    }

    for (let x = 0; x < width; ++x) {
        const column = mapFromPath[x];
        if ((column == null) || (column.length !== height)) {
            throw Helpers_Misc.newError(`Invalid height: ${height}`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_ResetMapFromPath_01);
        }
    }

    if (visibilityList == null) {
        fillMap(mapFromPath, 0);
        return;
    }

    if (visibilityList.length !== width * height) {
        throw Helpers_Misc.newError(`Invalid visibilityList.length: ${visibilityList.length}`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_ResetMapFromPath_02);
    }

    for (let x = 0; x < width; ++x) {
        const column = mapFromPath[x];
        for (let y = 0; y < height; ++y) {
            const visibility = visibilityList[x + y * width];
            if ((visibility !== Visibilities_Constants.VisibilityTypeId.Inside)    &&
                (visibility !== Visibilities_Constants.VisibilityTypeId.Outside)   &&
                (visibility !== Visibilities_Constants.VisibilityTypeId.Penetrating)
            ) {
                throw Helpers_Misc.newError(`Invalid visibility: ${visibility}`, Utils_ClientErrorCode.ClientErrorCode.BwFogMap_ResetMapFromPath_03);
            }

            column[y] = visibility;
        }
    }
}
