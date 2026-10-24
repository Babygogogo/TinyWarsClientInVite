import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as AuxiliaryTypesUnitVisionInfo from "../auxiliaryTypes/UnitVisionInfo.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import * as FogMapsConstants from "./Constants.ts";
import type * as FogMapsIFogMap from "./IFogMap.ts";
import * as GameConfigGcWar from "../gameConfig/GcWar.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as HelpersCollection from "../helpers/Collection.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as PlayersConstants from "../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarSerializationDataForFogMapFromPath from "../proto/schema/CommonProto/WarSerialization/DataForFogMapFromPath.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialFogMap from "../proto/schema/CommonProto/WarSerialization/SerialFogMap.ts";
import type * as UnitsIUnit from "../units/IUnit.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../visibilities/Utils.ts";
import * as WeathersConstants from "../weathers/Constants.ts";

type IBwWar                     = BaseWarInterfaceIBwWar.IBwWar;

export class FogMap implements FogMapsIFogMap.IFogMap {
    private _forceFogCode?              : FogMapsConstants.ForcedFogCode;
    private _forceExpirePlayerIndex?    : number | null;
    private _forceExpireTurnIndex?      : number | null;
    private _mapSize?                   : AuxiliaryTypesMapSize.MapSize;
    private _allMapsFromPath?           : Map<number, GameConfigGcWar.VisibilityTypeId[][]>;
    private _war?                       : IBwWar;

    public init({ data, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialFogMap.SerialFogMap>;
        mapSize                 : AuxiliaryTypesMapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw HelpersMisc.newError(`Empty data.`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_Init_00);
        }

        const forceFogCode = data.getForceFogCode();
        if ((forceFogCode !== FogMapsConstants.ForcedFogCode.Clear)   &&
            (forceFogCode !== FogMapsConstants.ForcedFogCode.Fog)     &&
            (forceFogCode !== FogMapsConstants.ForcedFogCode.None)
        ) {
            throw HelpersMisc.newError(`Invalid forceFogCode: ${forceFogCode}`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_Init_01);
        }

        const forceExpirePlayerIndex = data.getForceExpirePlayerIndex();
        if ((forceExpirePlayerIndex != null)                                                                                    &&
            ((forceExpirePlayerIndex < PlayersConstants.PlayerIndex.Neutral) || (forceExpirePlayerIndex > playersCountUnneutral))
        ) {
            throw HelpersMisc.newError(`Invalid forceExpirePlayerIndex: ${forceExpirePlayerIndex}`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_Init_02);
        }

        const forceExpireTurnIndex = data.getForceExpireTurnIndex();
        if (((forceExpirePlayerIndex == null) && (forceExpireTurnIndex != null)) ||
            ((forceExpirePlayerIndex != null) && (forceExpireTurnIndex == null))
        ) {
            throw HelpersMisc.newError(`Invalid forceExpireTurnIndex: ${forceExpireTurnIndex}`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_Init_03);
        }

        if (!mapSize.checkIsValid()) {
            throw HelpersMisc.newError(`Invalid mapSize.`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_Init_04);
        }

        const allMapsFromPath   = createEmptyMaps<GameConfigGcWar.VisibilityTypeId>(mapSize, playersCountUnneutral);
        const playerIndexSet    = new Set<number>();
        for (const d of data.getMapsFromPath()) {
            const playerIndex = HelpersMisc.getExisted(d.getPlayerIndex(), UtilsClientErrorCode.ClientErrorCode.BwFogMap_Init_05);
            if (playerIndexSet.has(playerIndex)) {
                throw HelpersMisc.newError(`Duplicated playerIndex: ${playerIndex}`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_Init_06);
            }
            playerIndexSet.add(playerIndex);

            const mapFromPath = HelpersMisc.getExisted(allMapsFromPath.get(playerIndex), UtilsClientErrorCode.ClientErrorCode.BwFogMap_Init_07);
            resetMapFromPath(mapFromPath, mapSize, d.getVisibilityArray() ?? null);
        }

        this._setMapSize(mapSize.clone());
        this._setAllMapsFromPath(allMapsFromPath);
        this.setForceFogCode(forceFogCode);
        this.setForceExpirePlayerIndex(forceExpirePlayerIndex ?? null);
        this.setForceExpireTurnIndex(forceExpireTurnIndex ?? null);
    }
    public fastInit({ data, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialFogMap.SerialFogMap>;
        mapSize                 : AuxiliaryTypesMapSize.MapSize;
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

        if (war instanceof GameHelpersGhFactory.getHrwWarClass()) {
            const visibleTiles = VisibilitiesUtils.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }

        } else if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(false);
            }

        } else if (war instanceof GameHelpersGhFactory.getMpwWarClass()) {
            const visibleTiles = VisibilitiesUtils.getAllTilesVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            for (const tile of war.getTileMap().getAllTiles()) {
                if (visibleTiles.has(tile)) {
                    tile.setHasFog(false);
                } else {
                    if (!tile.getHasFog()) {
                        tile.resetTileDataAsHasFog();
                    }
                }
            }

        } else if (war instanceof GameHelpersGhFactory.getRwWarClass()) {
            const visibleTiles = VisibilitiesUtils.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }

        } else if (war instanceof GameHelpersGhFactory.getSpwWarClass()) {
            const teamIndexes   = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            const visibleUnits  = VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes);
            for (const unit of war.getUnitMap().getAllUnitsOnMap()) {
                unit.setViewVisible(visibleUnits.has(unit));
            }

            const visibleTiles = VisibilitiesUtils.getAllTilesVisibleToTeams(war, teamIndexes);
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
                tile.flushDataToView();
            }

        } else if (war instanceof GameHelpersGhFactory.getTwWarClass()) {
            // nothing to do

        } else {
            throw HelpersMisc.newError(`Invalid war.`);
        }
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialFogMap.SerialFogMap {
        const mapSize               = this.getMapSize();
        const serialMapsFromPath    : ProtoSchemaCommonProtoWarSerializationDataForFogMapFromPath.DataForFogMapFromPath[] = [];
        for (const [playerIndex, map] of this._getAllMapsFromPath()) {
            const visibilityArray = VisibilitiesUtils.getVisibilityArrayWithMapFromPath(map, mapSize);
            if (visibilityArray != null) {
                serialMapsFromPath.push(ProtoSchemaCommonProtoWarSerializationDataForFogMapFromPath.DataForFogMapFromPath.fromJson({
                    playerIndex     : playerIndex,
                    visibilityArray : visibilityArray,
                }));
            }
        }

        return ProtoSchemaCommonProtoWarSerializationSerialFogMap.SerialFogMap.fromJson({
            forceFogCode            : this.getForceFogCode(),
            forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
            forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
            mapsFromPath            : serialMapsFromPath.map(v => v.toJson()),
        });
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialFogMap.SerialFogMap {
        const war = this.getWar();
        if (war instanceof GameHelpersGhFactory.getMeWarClass()) {
            const mapSize           = this.getMapSize();
            const maxPlayerIndex    = war.getField().getMaxPlayerIndex();
            const serialMapsFromPath: ProtoSchemaCommonProtoWarSerializationDataForFogMapFromPath.DataForFogMapFromPath[] = [];
            for (const [playerIndex, map] of this._getAllMapsFromPath()) {
                if (playerIndex > maxPlayerIndex) {
                    continue;
                }

                const visibilityArray = VisibilitiesUtils.getVisibilityArrayWithMapFromPath(map, mapSize);
                if (visibilityArray != null) {
                    serialMapsFromPath.push(ProtoSchemaCommonProtoWarSerializationDataForFogMapFromPath.DataForFogMapFromPath.fromJson({
                        playerIndex,
                        visibilityArray,
                    }));
                }
            }

            return ProtoSchemaCommonProtoWarSerializationSerialFogMap.SerialFogMap.fromJson({
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
            const mapsFromPath       : ProtoSchemaCommonProtoWarSerializationDataForFogMapFromPath.DataForFogMapFromPath[] = [];

            for (const [playerIndex, map] of this._getAllMapsFromPath()) {
                const player = war.getPlayer(playerIndex);
                if (targetTeamIndexes.has(player.getTeamIndex())) {
                    const visibilityArray = VisibilitiesUtils.getVisibilityArrayWithMapFromPath(map, mapSize);
                    if (visibilityArray != null) {
                        mapsFromPath.push(ProtoSchemaCommonProtoWarSerializationDataForFogMapFromPath.DataForFogMapFromPath.fromJson({
                            playerIndex     : playerIndex,
                            visibilityArray : visibilityArray,
                        }));
                    }
                }
            }
            return ProtoSchemaCommonProtoWarSerializationSerialFogMap.SerialFogMap.fromJson({
                forceFogCode            : this.getForceFogCode(),
                forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
                mapsFromPath            : mapsFromPath.map(v => v.toJson()),
            });
        }
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialFogMap.SerialFogMap {
        return this.serializeForCreateSfw();
    }

    protected _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return HelpersMisc.getExisted(this._war);
    }

    private _setAllMapsFromPath(mapsFromPath: Map<number, GameConfigGcWar.VisibilityTypeId[][]>): void {
        this._allMapsFromPath = mapsFromPath;
    }
    protected _getAllMapsFromPath(): Map<number, GameConfigGcWar.VisibilityTypeId[][]> {
        return HelpersMisc.getExisted(this._allMapsFromPath);
    }
    private _getMapFromPath(playerIndex: number): GameConfigGcWar.VisibilityTypeId[][] {
        return HelpersMisc.getExisted(this._getAllMapsFromPath().get(playerIndex));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _setMapSize(mapSize: AuxiliaryTypesMapSize.MapSize): void {
        this._mapSize = mapSize;
    }
    public getMapSize(): AuxiliaryTypesMapSize.MapSize {
        return HelpersMisc.getExisted(this._mapSize);
    }

    public setForceFogCode(code: FogMapsConstants.ForcedFogCode): void {
        this._forceFogCode = code;
    }
    public getForceFogCode(): FogMapsConstants.ForcedFogCode {
        return HelpersMisc.getExisted(this._forceFogCode);
    }

    public checkHasFogByDefault(): boolean {
        return this.getWar().getCommonSettingManager().getSettingsHasFogByDefault();
    }
    public checkHasFogCurrently(): boolean {
        const fogCode = this.getForceFogCode();
        if (fogCode === FogMapsConstants.ForcedFogCode.Fog) {
            return true;
        } else if (fogCode === FogMapsConstants.ForcedFogCode.Clear) {
            return false;
        } else {
            const war               = this.getWar();
            const weatherFogType    = war.getGcData().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.getFog();
            if (weatherFogType === WeathersConstants.FogType.Fog) {
                return true;
            } else if (weatherFogType === WeathersConstants.FogType.NoFog) {
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
        return HelpersMisc.getDefined(this._forceExpireTurnIndex, UtilsClientErrorCode.ClientErrorCode.BwFogMap_GetForceExpireTurnIndex_00);
    }

    public setForceExpirePlayerIndex(index: number | null): void {
        this._forceExpirePlayerIndex = index;
    }
    public getForceExpirePlayerIndex(): number | null {
        return HelpersMisc.getDefined(this._forceExpirePlayerIndex, UtilsClientErrorCode.ClientErrorCode.BwFogMap_GetForceExpirePlayerIndex_00);
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
            this.setForceFogCode(FogMapsConstants.ForcedFogCode.None);
            this.setForceExpireTurnIndex(null);
            this.setForceExpirePlayerIndex(null);
        }
    }

    public resetAllMapsForPlayer(playerIndex: number): void {
        this.resetMapFromPathsForPlayerWithEncodedData(playerIndex);
    }

    public resetMapFromPathsForPlayer(playerIndex: number, visibilityList: GameConfigGcWar.VisibilityTypeId[] | null): void {
        resetMapFromPath(this._getMapFromPath(playerIndex), this.getMapSize(), visibilityList);
    }
    public resetMapFromPathsForPlayerWithEncodedData(playerIndex: number, encodedData?: string): void {
        const map = HelpersMisc.getExisted(this._getAllMapsFromPath().get(playerIndex));
        if (encodedData == null) {
            fillMap(map, 0);
        } else {
            const { width, height } = this.getMapSize().getWH();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    map[x][y] = Number(encodedData[x + y * width]) as GameConfigGcWar.VisibilityTypeId;
                }
            }
        }
    }
    public updateMapFromPathsByUnitAndPath({ unit, unitVisionInfo, path }: {
        unit            : UnitsIUnit.IUnit;
        unitVisionInfo  : AuxiliaryTypesUnitVisionInfo.UnitVisionInfo;
        path            : AuxiliaryTypesGridIndex.GridIndex[];
    }): void {
        const playerIndex   = unit.getPlayerIndex();
        const mapSize       = this.getMapSize();
        const mapFromPath   = this._getMapFromPath(playerIndex);
        for (const pathNode of path) {
            for (const gridIndex of pathNode.getGridsWithinDistance({ minDistance: 0, maxDistance: 1, mapSize })) {
                mapFromPath[gridIndex.getX()][gridIndex.getY()] = GameConfigGcWar.VisibilityTypeId.Penetrating;
            }

            const visionRange = unit.getFinalVisionRange(unitVisionInfo, pathNode);
            for (const gridIndex of pathNode.getGridsWithinDistance({ minDistance: 2, maxDistance: visionRange, mapSize })) {
                if (unitVisionInfo.isPenetrating) {
                    mapFromPath[gridIndex.getX()][gridIndex.getY()] = GameConfigGcWar.VisibilityTypeId.Penetrating;
                } else {
                    if (mapFromPath[gridIndex.getX()][gridIndex.getY()] === GameConfigGcWar.VisibilityTypeId.Outside) {
                        mapFromPath[gridIndex.getX()][gridIndex.getY()] = GameConfigGcWar.VisibilityTypeId.Inside;
                    }
                }
            }
        }
    }
    public updateMapFromPathsByVisibilityArray(playerIndex: number, visibilityArray: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>): void {
        if (visibilityArray == null) {
            return;
        }

        const map       = this._getMapFromPath(playerIndex);
        const mapSize   = this.getMapSize();
        for (const value of visibilityArray) {
            const gridIndex                         = AuxiliaryTypesGridIndex.GridIndex.getGridIndexByGridId(Math.floor(value / 10), mapSize);
            map[gridIndex.getX()][gridIndex.getY()] = value % 10;
        }
    }
    public updateMapFromPathsByUnitMovePathVisibilityArrayForWarEvent(array: number[]): void {
        const mapSize = this.getMapSize();
        for (const value of array) {
            const value1    = Math.floor(value / 10);
            const gridIndex = AuxiliaryTypesGridIndex.GridIndex.getGridIndexByGridId(Math.floor(value1 / 100), mapSize);
            this._getMapFromPath(value1 % 100)[gridIndex.getX()][gridIndex.getY()] = value % 10;
        }
    }
    public updateMapFromPathsByFlare(playerIndex: number, flareGridIndex: AuxiliaryTypesGridIndex.GridIndex, flareRadius: number): void {
        const map = this._getMapFromPath(playerIndex);
        for (const gridIndex of flareGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: flareRadius, mapSize: this.getMapSize() })) {
            map[gridIndex.getX()][gridIndex.getY()] = 2;
        }
    }

    public getVisibilityFromPathsForPlayer(gridIndex: AuxiliaryTypesGridIndex.GridIndex, playerIndex: number): GameConfigGcWar.VisibilityTypeId {
        const visibility = this._getMapFromPath(playerIndex)[gridIndex.getX()][gridIndex.getY()];
        if (visibility === GameConfigGcWar.VisibilityTypeId.Penetrating) {
            return visibility;
        } else {
            return this.checkHasFogCurrently() ? visibility : GameConfigGcWar.VisibilityTypeId.Penetrating;
        }
    }
    public getVisibilityMapFromPathsForTeams(teamIndexes: Set<number>): GameConfigGcWar.VisibilityTypeId[][] {
        const { width, height } = this.getMapSize().getWH();
        if (!this.checkHasFogCurrently()) {
            return HelpersCollection.createEmptyMap<GameConfigGcWar.VisibilityTypeId>(width, height, GameConfigGcWar.VisibilityTypeId.Penetrating);
        }

        const resultMap     = HelpersCollection.createEmptyMap<GameConfigGcWar.VisibilityTypeId>(width, height, GameConfigGcWar.VisibilityTypeId.Outside);
        const mapFromPaths  = this._getAllMapsFromPath();
        for (const playerIndex of this.getWar().getPlayerManager().getPlayerIndexesInTeams(teamIndexes)) {
            const map = HelpersMisc.getExisted(mapFromPaths.get(playerIndex));
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
    public getRawVisibilityFromPathsForAllPlayers(gridIndex: AuxiliaryTypesGridIndex.GridIndex): GameConfigGcWar.VisibilityTypeId[] {
        const array                 : number[]= [];
        const { x, y }              = gridIndex.getXY();
        const playersCountUnneutral = this.getWar().getPlayersCountUnneutral();
        for (let playerIndex = 0; playerIndex <= playersCountUnneutral; ++playerIndex) {
            array.push(this._getMapFromPath(playerIndex)[x][y]);
        }
        return array;
    }
    public updateRawVisibilityFromPathsForAllPlayers(gridIndex: AuxiliaryTypesGridIndex.GridIndex, visibilityArray: number[]): void {
        const length = visibilityArray.length;
        if (length <= 0) {
            return;
        }

        const maxPlayerIndex  = Math.min(this.getWar().getPlayerManager().getTotalPlayersCount(true), length);
        const { x, y }        = gridIndex.getXY();
        for (let playerIndex = 0; playerIndex < maxPlayerIndex; ++playerIndex) {
            const visibility = visibilityArray[playerIndex];
            if ((visibility !== GameConfigGcWar.VisibilityTypeId.Inside)      &&
                (visibility !== GameConfigGcWar.VisibilityTypeId.Outside)     &&
                (visibility !== GameConfigGcWar.VisibilityTypeId.Penetrating)
            ) {
                continue;
            }

            this._getMapFromPath(playerIndex)[x][y] = visibility;
        }
    }
    // public getVisibilityMapFromPathsForUser(userId: number): Visibility[][] {
    //     return this.getVisibilityMapFromPathsForTeams(this._getWar().getWatcherTeamIndexes(userId));
    // }

    public getVisibilityFromTilesForPlayer(gridIndex: AuxiliaryTypesGridIndex.GridIndex, playerIndex: number): GameConfigGcWar.VisibilityTypeId {
        if (!this.checkHasFogCurrently()) {
            return GameConfigGcWar.VisibilityTypeId.Penetrating;
        }

        const tileMap = this.getWar().getTileMap();
        {
            const tile = tileMap.getTile(gridIndex);
            if ((tile.getIsVisionEnabledForAllPlayers()) || (tile.getPlayerIndex() === playerIndex)) {
                return GameConfigGcWar.VisibilityTypeId.Penetrating;
            }
        }

        const { width, height } = tileMap.getMapSize().getWH();
        const tileGridIndex     = new AuxiliaryTypesGridIndex.GridIndex(0, 0);
        for (let x = 0; x < width; ++x) {
            tileGridIndex.setX(x);
            for (let y = 0; y < height; ++y) {
                tileGridIndex.setY(y);

                const tile = tileMap.getTile(tileGridIndex);
                if ((tile.getPlayerIndex() !== playerIndex) && (!tile.getIsVisionEnabledForAllPlayers())) {
                    continue;
                }

                if (gridIndex.getDistance(tileGridIndex) <= tile.getFinalVisionRange()) {
                    return GameConfigGcWar.VisibilityTypeId.Inside;
                }
            }
        }

        return GameConfigGcWar.VisibilityTypeId.Outside;
    }
    public getVisibilityMapFromTilesForTeam(teamIndex: number): GameConfigGcWar.VisibilityTypeId[][] {
        return this.getVisibilityMapFromTilesForTeams(new Set([teamIndex]));
    }
    public getVisibilityMapFromTilesForTeams(teamIndexes: Set<number>): GameConfigGcWar.VisibilityTypeId[][] {
        const mapSize           = this.getMapSize();
        const { width, height } = mapSize.getWH();
        const resultMap         = HelpersCollection.createEmptyMap<GameConfigGcWar.VisibilityTypeId>(width, height, GameConfigGcWar.VisibilityTypeId.Outside);
        if (!this.checkHasFogCurrently()) {
            resultMap.forEach(column => column.fill(GameConfigGcWar.VisibilityTypeId.Penetrating));
        } else {
            const tileMap       = this.getWar().getTileMap();
            const tileGridIndex = new AuxiliaryTypesGridIndex.GridIndex(0, 0);
            for (let x = 0; x < width; ++x) {
                tileGridIndex.setX(x);
                for (let y = 0; y < height; ++y) {
                    tileGridIndex.setY(y);

                    const tile = tileMap.getTile(tileGridIndex);
                    if ((!tile.getIsVisionEnabledForAllPlayers()) && (!teamIndexes.has(tile.getTeamIndex()))) {
                        continue;
                    }

                    resultMap[x][y] = GameConfigGcWar.VisibilityTypeId.Penetrating;
                    for (const g of tileGridIndex.getGridsWithinDistance({
                        minDistance : 1,
                        maxDistance : tile.getFinalVisionRange(),
                        mapSize     : mapSize,
                    })) {
                        const newX = g.getX();
                        const newY = g.getY();
                        if (resultMap[newX][newY] === GameConfigGcWar.VisibilityTypeId.Outside) {
                            resultMap[newX][newY] = GameConfigGcWar.VisibilityTypeId.Inside;
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

    public getVisibilityFromUnitsForPlayer(gridIndex: AuxiliaryTypesGridIndex.GridIndex, playerIndex: number): GameConfigGcWar.VisibilityTypeId {
        if (!this.checkHasFogCurrently()) {
            return GameConfigGcWar.VisibilityTypeId.Penetrating;
        } else {
            const unitMap           = this.getWar().getUnitMap();
            const { width, height } = unitMap.getMapSize().getWH();
            let isInside            = false;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const unitGridIndex = new AuxiliaryTypesGridIndex.GridIndex(x, y);
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
                        return GameConfigGcWar.VisibilityTypeId.Penetrating;
                    }
                    if (visionRange >= distance) {
                        if (visionInfo.isPenetrating) {
                            return GameConfigGcWar.VisibilityTypeId.Penetrating;
                        }
                        isInside = true;
                    }
                }
            }
            return isInside ? GameConfigGcWar.VisibilityTypeId.Inside : GameConfigGcWar.VisibilityTypeId.Outside;
        }
    }
    public getVisibilityMapFromUnitsForTeam(teamIndex: number): GameConfigGcWar.VisibilityTypeId[][] {
        return this.getVisibilityMapFromUnitsForTeams(new Set([teamIndex]));
    }
    public getVisibilityMapFromUnitsForTeams(teamIndexes: Set<number>): GameConfigGcWar.VisibilityTypeId[][] {
        const mapSize           = this.getMapSize();
        const { width, height } = mapSize.getWH();
        const resultMap         = HelpersCollection.createEmptyMap<GameConfigGcWar.VisibilityTypeId>(width, height, GameConfigGcWar.VisibilityTypeId.Outside);
        if (!this.checkHasFogCurrently()) {
            resultMap.forEach(column => column.fill(GameConfigGcWar.VisibilityTypeId.Penetrating));
        } else {
            const unitMap = this.getWar().getUnitMap();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const unitGridIndex = new AuxiliaryTypesGridIndex.GridIndex(x, y);
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
                        resultMap[g.getX()][g.getY()] = GameConfigGcWar.VisibilityTypeId.Penetrating;
                    }

                    const isPenetrating = visionInfo.isPenetrating;
                    for (const g of unitGridIndex.getGridsWithinDistance({ minDistance: 2, maxDistance: visionRange, mapSize })) {
                        if (isPenetrating) {
                            resultMap[g.getX()][g.getY()] = GameConfigGcWar.VisibilityTypeId.Penetrating;
                        } else {
                            if (resultMap[g.getX()][g.getY()] === GameConfigGcWar.VisibilityTypeId.Outside) {
                                resultMap[g.getX()][g.getY()] = GameConfigGcWar.VisibilityTypeId.Inside;
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

function createEmptyMaps<T extends (number | GameConfigGcWar.VisibilityTypeId)>(mapSize: AuxiliaryTypesMapSize.MapSize, maxPlayerIndex: number): Map<number, T[][]> {
    const map = new Map<number, T[][]>();
    for (let i = 0; i <= maxPlayerIndex; ++i) {
        map.set(i, HelpersCollection.createEmptyMap<T>(mapSize.getWidth(), mapSize.getHeight(), 0 as T));
    }
    return map;
}

function fillMap(map: number[][], data: number): void {
    for (const column of map) {
        column.fill(data);
    }
}

function resetMapFromPath(mapFromPath: GameConfigGcWar.VisibilityTypeId[][], mapSize: AuxiliaryTypesMapSize.MapSize, visibilityList: GameConfigGcWar.VisibilityTypeId[] | null): void {
    const { width, height } = mapSize.getWH();
    if (mapFromPath.length !== width) {
        throw HelpersMisc.newError(`Invalid width: ${width}`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_ResetMapFromPath_00);
    }

    for (let x = 0; x < width; ++x) {
        const column = mapFromPath[x];
        if ((column == null) || (column.length !== height)) {
            throw HelpersMisc.newError(`Invalid height: ${height}`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_ResetMapFromPath_01);
        }
    }

    if (visibilityList == null) {
        fillMap(mapFromPath, 0);
        return;
    }

    if (visibilityList.length !== width * height) {
        throw HelpersMisc.newError(`Invalid visibilityList.length: ${visibilityList.length}`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_ResetMapFromPath_02);
    }

    for (let x = 0; x < width; ++x) {
        const column = mapFromPath[x];
        for (let y = 0; y < height; ++y) {
            const visibility = visibilityList[x + y * width];
            if ((visibility !== GameConfigGcWar.VisibilityTypeId.Inside)    &&
                (visibility !== GameConfigGcWar.VisibilityTypeId.Outside)   &&
                (visibility !== GameConfigGcWar.VisibilityTypeId.Penetrating)
            ) {
                throw HelpersMisc.newError(`Invalid visibility: ${visibility}`, UtilsClientErrorCode.ClientErrorCode.BwFogMap_ResetMapFromPath_03);
            }

            column[y] = visibility;
        }
    }
}
