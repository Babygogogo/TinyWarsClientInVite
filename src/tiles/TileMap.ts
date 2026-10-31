import {
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MapSize,
    Tiles_Tile,
    Tiles_TileMapView,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Utils_ClientErrorCode,
    Helpers_Collection,
    Notifications_Dispatcher,
    Locations_Utils,
    Visibilities_Utils,
    Tiles_Utils_CustomName,
    Helpers_Misc,
    Locations_Constants,
    Players_Constants,
    Tiles_Constants_Common,
} from "../internal.ts";

import type { TileCustomName } from "../proto/schema/CommonProto/Structure/TileCustomName.ts";
import type { SerialTile } from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import { SerialTileMap } from "../proto/schema/CommonProto/WarSerialization/SerialTileMap.ts";

export class TileMap {
    private _map?                           : Tiles_Tile.Tile[][];
    private _tileCustomNameArray?           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomName[]>;
    private _mapSize?                       : AuxiliaryTypes_MapSize.MapSize;
    private _visibleGroupedLocationIdArray  : number[] = [];
    private _war?                           : BaseWar_Interface_IBwWar.IBwWar;

    private readonly _view                  = new Tiles_TileMapView.TileMapView();

    public init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTileMap>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw Helpers_Misc.newError(`Empty data.`, Utils_ClientErrorCode.ClientErrorCode.BwTileMap_Init_00);
        }

        const tiles     = data.getTiles();
        const mapWidth  = mapSize.getWidth();
        const mapHeight = mapSize.getHeight();
        if ((!mapSize.checkIsValid()) ||
            (mapWidth * mapHeight !== tiles.length)
        ) {
            throw Helpers_Misc.newError(`Invalid mapSize.`, Utils_ClientErrorCode.ClientErrorCode.BwTileMap_Init_02);
        }

        const tileCustomNameArray = data.getTileCustomNameArray();
        {
            const errorCode = Tiles_Utils_CustomName.getErrorCodeForTileCustomNameArray(tileCustomNameArray);
            if (errorCode) {
                throw Helpers_Misc.newError(`Invalid tileCustomNameArray.`, errorCode);
            }
        }

        const map = Helpers_Collection.createEmptyMap<Tiles_Tile.Tile>(mapWidth, mapHeight);
        for (const tileData of tiles) {
            const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.BwTileMap_Init_03);
            if (!gridIndex.checkIsInsideMap(mapSize)) {
                throw Helpers_Misc.newError(`The gridIndex is not inside the map.`, Utils_ClientErrorCode.ClientErrorCode.BwTileMap_Init_04);
            }

            const gridX = gridIndex.getX();
            const gridY = gridIndex.getY();
            if (map[gridX][gridY]) {
                throw Helpers_Misc.newError(`Duplicated gridIndex: ${gridX}, ${gridY}`, Utils_ClientErrorCode.ClientErrorCode.BwTileMap_Init_05);
            }

            const tile = new Tiles_Tile.Tile();
            tile.init(tileData, gameConfig);

            const playerIndex = tile.getPlayerIndex();
            if ((playerIndex == null)                                   ||
                (playerIndex < Players_Constants.PlayerIndex.Neutral)   ||
                (playerIndex > playersCountUnneutral)
            ) {
                throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwTileMap_Init_06);
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
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTileMap>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        const map = this.getMap();
        for (const tileData of data ? data.getTiles() || [] : []) {
            const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()));
            map[gridIndex.getX()][gridIndex.getY()].fastInit(tileData, gameConfig);
        }

        this.getView().fastInit(this);
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
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

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    public getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    private _setMap(map: Tiles_Tile.Tile[][]): void {
        this._map = map;
    }
    public getMap(): Tiles_Tile.Tile[][] {
        return Helpers_Misc.getExisted(this._map);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): Tiles_TileMapView.TileMapView {
        return this._view;
    }

    public forEachTile(func: (t: Tiles_Tile.Tile) => any): void {
        for (const column of this.getMap()) {
            for (const tile of column) {
                func(tile);
            }
        }
    }
    public getTile(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Tiles_Tile.Tile {
        return this.getMap()[gridIndex.getX()][gridIndex.getY()];
    }
    public getTileWithGridId(gridId: number): Tiles_Tile.Tile {
        const width = this.getMapSize().getWidth();
        return this.getMap()[gridId % width][Math.floor(gridId / width)];
    }
    public getAllTiles(): Tiles_Tile.Tile[] {
        const tileArray: Tiles_Tile.Tile[] = [];
        this.forEachTile(tile => tileArray.push(tile));
        return tileArray;
    }
    public getTiles(predicate: (tile: Tiles_Tile.Tile) => boolean): Tiles_Tile.Tile[] {
        const map               = this.getMap();
        const { width, height } = this.getMapSize().getWH();
        const tiles             : Tiles_Tile.Tile[] = [];
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
    public getGridIndexListWithAnyLocationId(locationIdArray: number[]): AuxiliaryTypes_GridIndex.GridIndex[] {
        const list                      : AuxiliaryTypes_GridIndex.GridIndex[] = [];
        const groupedLocationIdArray    = Locations_Utils.encode(locationIdArray);
        for (const column of this.getMap()) {
            for (const tile of column) {
                if (tile.checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray)) {
                    list.push(tile.getGridIndex());
                }
            }
        }
        return list;
    }

    public getConnectedGridIndexArrayWithTileType(origin: AuxiliaryTypes_GridIndex.GridIndex, tileType: number): AuxiliaryTypes_GridIndex.GridIndex[] {
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
        this._mapSize = new AuxiliaryTypes_MapSize.MapSize(width, height);
    }
    public getMapSize(): AuxiliaryTypes_MapSize.MapSize {
        return Helpers_Misc.getExisted(this._mapSize);
    }

    public getTileCustomNameArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomName[]> {
        return this._tileCustomNameArray;
    }
    public setTileCustomNameArray(arr: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomName[]>): void {
        this._tileCustomNameArray = arr;
    }

    public getTilesCountForPlayer(playerIndex: number): number {
        return this.getTilesCount(v => v.getPlayerIndex() === playerIndex);
    }
    public getTilesCount(func: (t: Tiles_Tile.Tile) => boolean): number {
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
                    bonus += tile.getGlobalAttackBonus();
                }
            });
        } else {
            for (const tile of Visibilities_Utils.getAllTilesVisibleToTeams(this.getWar(), observerTeamIndexSet)) {
                if (tile.getPlayerIndex() === playerIndex) {
                    bonus += tile.getGlobalAttackBonus();
                }
            }
        }

        if (useDamagePreviewSettings) {
            const war                       = this.getWar();
            const settings                  = war.getDamagePreviewSettings();
            const commandTowerTemplateCfg   = war.getGcData().getTileTemplateCfg(Tiles_Constants_Common.TileTypeId.CommandTower);
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
                    bonus += tile.getGlobalDefenseBonus();
                }
            });
        } else {
            for (const tile of Visibilities_Utils.getAllTilesVisibleToTeams(this.getWar(), observerTeamIndexSet)) {
                if (tile.getPlayerIndex() === playerIndex) {
                    bonus += tile.getGlobalDefenseBonus();
                }
            }
        }

        if (useDamagePreviewSettings) {
            const war                       = this.getWar();
            const settings                  = war.getDamagePreviewSettings();
            const commandTowerTemplateCfg   = war.getGcData().getTileTemplateCfg(Tiles_Constants_Common.TileTypeId.CommandTower);
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
        Notifications_Dispatcher.dispatch("BwTileMapLocationVisibleSet");
    }
    public getVisibleGroupedLocationIdArray(): number[] {
        return this._visibleGroupedLocationIdArray;
    }

    public getIsLocationVisible(locationId: number): boolean {
        const idArray = this.getVisibleGroupedLocationIdArray();
        if (idArray == null) {
            return false;
        }

        const groupedLocationId = idArray[Math.floor((locationId - 1) / Locations_Constants.GroupSize)];
        return !!((groupedLocationId >>> ((locationId - 1) % Locations_Constants.GroupSize)) & 1);
    }
    public setIsLocationVisible(locationId: number, isVisible: boolean): void {
        const groupedLocationIdArray  = this._visibleGroupedLocationIdArray ??= new Array<number>(Locations_Constants.GroupCount).fill(0);
        const index                   = Math.floor((locationId - 1) / Locations_Constants.GroupSize);
        if (isVisible) {
            groupedLocationIdArray[index] |= 1 << ((locationId - 1) % Locations_Constants.GroupSize);
        } else {
            groupedLocationIdArray[index] &= ~(1 << ((locationId - 1) % Locations_Constants.GroupSize));
        }
        this.getView().resetLocationLayer();
        Notifications_Dispatcher.dispatch("BwTileMapLocationVisibleSet");
    }
    public setAllLocationVisible(isVisible: boolean): void {
        if (!isVisible) {
            this.setVisibleGroupedLocationIdArray([]);
        } else {
            const locationIdArray = Helpers_Collection.createRange(Locations_Constants.MinId, Locations_Constants.MaxId + 1, 1);
            this.setVisibleGroupedLocationIdArray(Locations_Utils.encode(locationIdArray));
        }
    }
}
