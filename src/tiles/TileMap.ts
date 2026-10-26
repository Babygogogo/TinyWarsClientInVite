import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import { MapSize } from "../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { GcData } from "../gameConfigs/GcData.ts";
import { getTileMapViewClass, getTileClass } from "../gameHelpers/GhFactory.ts";
import { createEmptyMap, createRange } from "../helpers/Collection.ts";
import { newError, getExisted } from "../helpers/Misc.ts";
import { GroupSize, GroupCount, MinId, MaxId } from "../locations/Constants.ts";
import { encode } from "../locations/Utils.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { PlayerIndex } from "../players/Constants.ts";
import type { TileCustomName } from "../proto/schema/CommonProto/Structure/TileCustomName.ts";
import type { SerialTile } from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import { SerialTileMap } from "../proto/schema/CommonProto/WarSerialization/SerialTileMap.ts";
import { TileTypeId } from "./constants/Common.ts";
import type { ITile } from "./ITile.ts";
import type { ITileMap } from "./ITileMap.ts";
import type { ITileMapView } from "./ITileMapView.ts";
import { getErrorCodeForTileCustomNameArray } from "./utils/CustomName.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { getAllTilesVisibleToTeams } from "../visibilities/Utils.ts";

export class TileMap implements ITileMap {
    private _map?                           : ITile[][];
    private _tileCustomNameArray?           : Undefinable<TileCustomName[]>;
    private _mapSize?                       : MapSize;
    private _visibleGroupedLocationIdArray  : number[] = [];
    private _war?                           : IBwWar;

    private readonly _view                  = new (getTileMapViewClass())();

    public init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialTileMap>;
        gameConfig              : GcData;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw newError(`Empty data.`, ClientErrorCode.BwTileMap_Init_00);
        }

        const tiles     = getExisted(data.getTiles(), ClientErrorCode.BwTileMap_Init_01);
        const mapWidth  = mapSize.getWidth();
        const mapHeight = mapSize.getHeight();
        if ((!mapSize.checkIsValid()) ||
            (mapWidth * mapHeight !== tiles.length)
        ) {
            throw newError(`Invalid mapSize.`, ClientErrorCode.BwTileMap_Init_02);
        }

        const tileCustomNameArray = data.getTileCustomNameArray();
        {
            const errorCode = getErrorCodeForTileCustomNameArray(tileCustomNameArray ?? []);
            if (errorCode) {
                throw newError(`Invalid tileCustomNameArray.`, errorCode);
            }
        }

        const map = createEmptyMap<ITile>(mapWidth, mapHeight);
        for (const tileData of tiles) {
            const gridIndex = getExisted(GridIndex.convertGridIndex(tileData.getGridIndex()), ClientErrorCode.BwTileMap_Init_03);
            if (!gridIndex.checkIsInsideMap(mapSize)) {
                throw newError(`The gridIndex is not inside the map.`, ClientErrorCode.BwTileMap_Init_04);
            }

            const gridX = gridIndex.getX();
            const gridY = gridIndex.getY();
            if (map[gridX][gridY]) {
                throw newError(`Duplicated gridIndex: ${gridX}, ${gridY}`, ClientErrorCode.BwTileMap_Init_05);
            }

            const tile = new (getTileClass())();
            tile.init(tileData, gameConfig);

            const playerIndex = tile.getPlayerIndex();
            if ((playerIndex == null)                                   ||
                (playerIndex < PlayerIndex.Neutral)   ||
                (playerIndex > playersCountUnneutral)
            ) {
                throw newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwTileMap_Init_06);
            }

            map[gridX][gridY] = tile;
        }

        this._setMap(map);
        this._setMapSize(mapWidth, mapHeight);
        this.setTileCustomNameArray(tileCustomNameArray.map(v => v.clone()));

        this.getView().init(this);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public fastInit({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialTileMap>;
        gameConfig              : GcData;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void {
        const map = this.getMap();
        for (const tileData of data ? data.getTiles() || [] : []) {
            const gridIndex = getExisted(GridIndex.convertGridIndex(tileData.getGridIndex()));
            map[gridIndex.getX()][gridIndex.getY()].fastInit(tileData, gameConfig);
        }

        this.getView().fastInit(this);
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
        this.forEachTile(tile => tile.startRunning(war));
    }
    public startRunningView(): void {
        this.getView().startRunningView();
        this.forEachTile(tile => tile.startRunningView());
    }
    public stopRunning(): void {
        this.getView().stopRunningView();
    }

    public serialize(): SerialTileMap {
        const map               = this.getMap();
        const { width, height } = this.getMapSize().getWH();
        const tilesData         : SerialTile[] = [];
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                tilesData.push(map[x][y].serialize());
            }
        }
        return SerialTileMap.fromJson({
            tiles               : tilesData.map(v => v.toJson()),
            tileCustomNameArray : this.getTileCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }
    public serializeForCreateSfw(): SerialTileMap {
        const map               = this.getMap();
        const { width, height } = this.getMapSize().getWH();
        const tilesData         : SerialTile[] = [];
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                tilesData.push(map[x][y].serializeForCreateSfw());
            }
        }
        return SerialTileMap.fromJson({
            tiles               : tilesData.map(v => v.toJson()),
            tileCustomNameArray : this.getTileCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }
    public serializeForCreateMfr(): SerialTileMap {
        const map               = this.getMap();
        const { width, height } = this.getMapSize().getWH();
        const tilesData         : SerialTile[] = [];
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                tilesData.push(map[x][y].serializeForCreateMfr());
            }
        }
        return SerialTileMap.fromJson({
            tiles               : tilesData.map(v => v.toJson()),
            tileCustomNameArray : this.getTileCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return getExisted(this._war);
    }

    private _setMap(map: ITile[][]): void {
        this._map = map;
    }
    public getMap(): ITile[][] {
        return getExisted(this._map);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): ITileMapView {
        return this._view;
    }

    public forEachTile(func: (t: ITile) => any): void {
        for (const column of this.getMap()) {
            for (const tile of column) {
                func(tile);
            }
        }
    }
    public getTile(gridIndex: GridIndex): ITile {
        return this.getMap()[gridIndex.getX()][gridIndex.getY()];
    }
    public getTileWithGridId(gridId: number): ITile {
        const width = this.getMapSize().getWidth();
        return this.getMap()[gridId % width][Math.floor(gridId / width)];
    }
    public getAllTiles(): ITile[] {
        const tileArray: ITile[] = [];
        this.forEachTile(tile => tileArray.push(tile));
        return tileArray;
    }
    public getTiles(predicate: (tile: ITile) => boolean): ITile[] {
        const map               = this.getMap();
        const { width, height } = this.getMapSize().getWH();
        const tiles             : ITile[] = [];
        for (let i = 0; i < width; ++i) {
            for (let j = 0; j < height; ++j) {
                const tile = map[i][j];
                if (predicate(tile)) {
                    tiles.push(tile);
                }
            }
        }
        return tiles;
    }
    public getGridIndexListWithAnyLocationId(locationIdArray: number[]): GridIndex[] {
        const list                      : GridIndex[] = [];
        const groupedLocationIdArray    = encode(locationIdArray);
        for (const column of this.getMap()) {
            for (const tile of column) {
                if (tile.checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray)) {
                    list.push(tile.getGridIndex());
                }
            }
        }
        return list;
    }

    public getConnectedGridIndexArrayWithTileType(origin: GridIndex, tileType: number): GridIndex[] {
        const plasmas           = [origin];
        const mapSize           = this.getMapSize();
        const searchedIndexes   = new Set<number>([origin.getGridId(mapSize)]);

        let i = 0;
        while (i < plasmas.length) {
            for (const adjacentGridIndex of plasmas[i].getAdjacentGrids(mapSize)) {
                if (this.getTile(adjacentGridIndex).getTileTypeId() === tileType) {
                    const searchIndex = adjacentGridIndex.getGridId(mapSize);
                    if (!searchedIndexes.has(searchIndex)) {
                        searchedIndexes.add(searchIndex);
                        plasmas.push(adjacentGridIndex);
                    }
                }
            }
            ++i;
        }

        plasmas.shift();
        return plasmas;
    }

    private _setMapSize(width: number, height: number): void {
        this._mapSize = new MapSize(width, height);
    }
    public getMapSize(): MapSize {
        return getExisted(this._mapSize);
    }

    public getTileCustomNameArray(): Undefinable<TileCustomName[]> {
        return this._tileCustomNameArray;
    }
    public setTileCustomNameArray(arr: Undefinable<TileCustomName[]>): void {
        this._tileCustomNameArray = arr;
    }

    public getTilesCountForPlayer(playerIndex: number): number {
        return this.getTilesCount(v => v.getPlayerIndex() === playerIndex);
    }
    public getTilesCount(func: (t: ITile) => boolean): number {
        let count = 0;
        for (const column of this.getMap()) {
            for (const tile of column) {
                if (func(tile)) {
                    ++ count;
                }
            }
        }
        return count;
    }

    public getTotalIncomeForPlayer(playerIndex: number): number {
        let totalIncome = 0;
        for (const column of this.getMap()) {
            for (const tile of column) {
                totalIncome += tile.getIncomeForPlayer(playerIndex);
            }
        }

        return totalIncome;
    }

    public getTotalGlobalAttackBonus(playerIndex: number, observerTeamIndexSet: Set<number> | null, useDamagePreviewSettings: boolean): number {
        let bonus = 0;
        if (observerTeamIndexSet == null) {
            this.forEachTile(tile => {
                if (tile.getPlayerIndex() === playerIndex) {
                    bonus += tile.getGlobalAttackBonus() ?? 0;
                }
            });
        } else {
            for (const tile of getAllTilesVisibleToTeams(this.getWar(), observerTeamIndexSet)) {
                if (tile.getPlayerIndex() === playerIndex) {
                    bonus += tile.getGlobalAttackBonus() ?? 0;
                }
            }
        }

        if (useDamagePreviewSettings) {
            const war                       = this.getWar();
            const settings                  = war.getDamagePreviewSettings();
            const commandTowerTemplateCfg   = war.getGcData().getTileTemplateCfg(TileTypeId.CommandTower);
            bonus                           += (settings.isEnabled ? settings.settings.find(v => v.playerIndex === playerIndex)?.extraCommandTowerCount ?? 0 : 0)
                * (commandTowerTemplateCfg == null ? 0 : commandTowerTemplateCfg.getGlobalAttackBonus());
        }

        return bonus;
    }
    public getTotalGlobalDefenseBonus(playerIndex: number, observerTeamIndexSet: Set<number> | null, useDamagePreviewSettings: boolean): number {
        let bonus = 0;
        if (observerTeamIndexSet == null) {
            this.forEachTile(tile => {
                if (tile.getPlayerIndex() === playerIndex) {
                    bonus += tile.getGlobalDefenseBonus() ?? 0;
                }
            });
        } else {
            for (const tile of getAllTilesVisibleToTeams(this.getWar(), observerTeamIndexSet)) {
                if (tile.getPlayerIndex() === playerIndex) {
                    bonus += tile.getGlobalDefenseBonus() ?? 0;
                }
            }
        }

        if (useDamagePreviewSettings) {
            const war                       = this.getWar();
            const settings                  = war.getDamagePreviewSettings();
            const commandTowerTemplateCfg   = war.getGcData().getTileTemplateCfg(TileTypeId.CommandTower);
            bonus                           += (settings.isEnabled ? settings.settings.find(v => v.playerIndex === playerIndex)?.extraCommandTowerCount ?? 0 : 0)
                * (commandTowerTemplateCfg == null ? 0 : commandTowerTemplateCfg.getGlobalDefenseBonus());
        }

        return bonus;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for locations.
    ////////////////////////////////////////////////////////////////////////////////
    public setVisibleGroupedLocationIdArray(idArray: number[]): void {
        this._visibleGroupedLocationIdArray = idArray;
        this.getView().resetLocationLayer();
        dispatch(TypeId.BwTileMapLocationVisibleSet);
    }
    public getVisibleGroupedLocationIdArray(): number[] {
        return this._visibleGroupedLocationIdArray;
    }

    public getIsLocationVisible(locationId: number): boolean {
        const idArray = this.getVisibleGroupedLocationIdArray();
        if (idArray == null) {
            return false;
        }

        const groupedLocationId = idArray[Math.floor((locationId - 1) / GroupSize)];
        return !!((groupedLocationId >>> ((locationId - 1) % GroupSize)) & 1);
    }
    public setIsLocationVisible(locationId: number, isVisible: boolean): void {
        const groupedLocationIdArray  = this._visibleGroupedLocationIdArray ??= new Array<number>(GroupCount).fill(0);
        const index                   = Math.floor((locationId - 1) / GroupSize);
        if (isVisible) {
            groupedLocationIdArray[index] |= 1 << ((locationId - 1) % GroupSize);
        } else {
            groupedLocationIdArray[index] &= ~(1 << ((locationId - 1) % GroupSize));
        }
        this.getView().resetLocationLayer();
        dispatch(TypeId.BwTileMapLocationVisibleSet);
    }
    public setAllLocationVisible(isVisible: boolean): void {
        if (!isVisible) {
            this.setVisibleGroupedLocationIdArray([]);
        } else {
            const locationIdArray = createRange(MinId, MaxId + 1, 1);
            this.setVisibleGroupedLocationIdArray(encode(locationIdArray));
        }
    }
}
