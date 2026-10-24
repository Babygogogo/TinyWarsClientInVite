import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as HelpersCollection from "../helpers/Collection.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LocationsConstants from "../locations/Constants.ts";
import * as LocationsUtils from "../locations/Utils.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import * as PlayersConstants from "../players/Constants.ts";
import type * as ProtoSchemaCommonProtoStructureTileCustomName from "../proto/schema/CommonProto/Structure/TileCustomName.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialTileMap from "../proto/schema/CommonProto/WarSerialization/SerialTileMap.ts";
import * as TilesConstantsCommon from "./constants/Common.ts";
import type * as TilesITile from "./ITile.ts";
import type * as TilesITileMap from "./ITileMap.ts";
import type * as TilesITileMapView from "./ITileMapView.ts";
import * as TilesUtilsCustomName from "./utils/CustomName.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../visibilities/Utils.ts";

type SerialTile             = ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile;
type TileCustomName         = ProtoSchemaCommonProtoStructureTileCustomName.TileCustomName;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export class TileMap implements TilesITileMap.ITileMap {
    private _map?                           : TilesITile.ITile[][];
    private _tileCustomNameArray?           : AuxiliaryTypesAuxiliaryTypes.Undefinable<TileCustomName[]>;
    private _mapSize?                       : AuxiliaryTypesMapSize.MapSize;
    private _visibleGroupedLocationIdArray  : number[] = [];
    private _war?                           : IBwWar;

    private readonly _view                  = new (GameHelpersGhFactory.getTileMapViewClass())();

    public init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap>;
        gameConfig              : GameConfigGcData.GcData;
        mapSize                 : AuxiliaryTypesMapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw HelpersMisc.newError(`Empty data.`, UtilsClientErrorCode.ClientErrorCode.BwTileMap_Init_00);
        }

        const tiles     = HelpersMisc.getExisted(data.getTiles(), UtilsClientErrorCode.ClientErrorCode.BwTileMap_Init_01);
        const mapWidth  = mapSize.getWidth();
        const mapHeight = mapSize.getHeight();
        if ((!mapSize.checkIsValid()) ||
            (mapWidth * mapHeight !== tiles.length)
        ) {
            throw HelpersMisc.newError(`Invalid mapSize.`, UtilsClientErrorCode.ClientErrorCode.BwTileMap_Init_02);
        }

        const tileCustomNameArray = data.getTileCustomNameArray();
        {
            const errorCode = TilesUtilsCustomName.getErrorCodeForTileCustomNameArray(tileCustomNameArray ?? []);
            if (errorCode) {
                throw HelpersMisc.newError(`Invalid tileCustomNameArray.`, errorCode);
            }
        }

        const map = HelpersCollection.createEmptyMap<TilesITile.ITile>(mapWidth, mapHeight);
        for (const tileData of tiles) {
            const gridIndex = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.BwTileMap_Init_03);
            if (!gridIndex.checkIsInsideMap(mapSize)) {
                throw HelpersMisc.newError(`The gridIndex is not inside the map.`, UtilsClientErrorCode.ClientErrorCode.BwTileMap_Init_04);
            }

            const gridX = gridIndex.getX();
            const gridY = gridIndex.getY();
            if (map[gridX][gridY]) {
                throw HelpersMisc.newError(`Duplicated gridIndex: ${gridX}, ${gridY}`, UtilsClientErrorCode.ClientErrorCode.BwTileMap_Init_05);
            }

            const tile = new (GameHelpersGhFactory.getTileClass())();
            tile.init(tileData, gameConfig);

            const playerIndex = tile.getPlayerIndex();
            if ((playerIndex == null)                                   ||
                (playerIndex < PlayersConstants.PlayerIndex.Neutral)   ||
                (playerIndex > playersCountUnneutral)
            ) {
                throw HelpersMisc.newError(`Invalid playerIndex: ${playerIndex}`, UtilsClientErrorCode.ClientErrorCode.BwTileMap_Init_06);
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
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap>;
        gameConfig              : GameConfigGcData.GcData;
        mapSize                 : AuxiliaryTypesMapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        const map = this.getMap();
        for (const tileData of data ? data.getTiles() || [] : []) {
            const gridIndex = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()));
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

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap {
        const map               = this.getMap();
        const { width, height } = this.getMapSize().getWH();
        const tilesData         : SerialTile[] = [];
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                tilesData.push(map[x][y].serialize());
            }
        }
        return ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap.fromJson({
            tiles               : tilesData.map(v => v.toJson()),
            tileCustomNameArray : this.getTileCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap {
        const map               = this.getMap();
        const { width, height } = this.getMapSize().getWH();
        const tilesData         : SerialTile[] = [];
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                tilesData.push(map[x][y].serializeForCreateSfw());
            }
        }
        return ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap.fromJson({
            tiles               : tilesData.map(v => v.toJson()),
            tileCustomNameArray : this.getTileCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap {
        const map               = this.getMap();
        const { width, height } = this.getMapSize().getWH();
        const tilesData         : SerialTile[] = [];
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                tilesData.push(map[x][y].serializeForCreateMfr());
            }
        }
        return ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap.fromJson({
            tiles               : tilesData.map(v => v.toJson()),
            tileCustomNameArray : this.getTileCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return HelpersMisc.getExisted(this._war);
    }

    private _setMap(map: TilesITile.ITile[][]): void {
        this._map = map;
    }
    public getMap(): TilesITile.ITile[][] {
        return HelpersMisc.getExisted(this._map);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): TilesITileMapView.ITileMapView {
        return this._view;
    }

    public forEachTile(func: (t: TilesITile.ITile) => any): void {
        for (const column of this.getMap()) {
            for (const tile of column) {
                func(tile);
            }
        }
    }
    public getTile(gridIndex: AuxiliaryTypesGridIndex.GridIndex): TilesITile.ITile {
        return this.getMap()[gridIndex.getX()][gridIndex.getY()];
    }
    public getTileWithGridId(gridId: number): TilesITile.ITile {
        const width = this.getMapSize().getWidth();
        return this.getMap()[gridId % width][Math.floor(gridId / width)];
    }
    public getAllTiles(): TilesITile.ITile[] {
        const tileArray: TilesITile.ITile[] = [];
        this.forEachTile(tile => tileArray.push(tile));
        return tileArray;
    }
    public getTiles(predicate: (tile: TilesITile.ITile) => boolean): TilesITile.ITile[] {
        const map               = this.getMap();
        const { width, height } = this.getMapSize().getWH();
        const tiles             : TilesITile.ITile[] = [];
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
    public getGridIndexListWithAnyLocationId(locationIdArray: number[]): AuxiliaryTypesGridIndex.GridIndex[] {
        const list                      : AuxiliaryTypesGridIndex.GridIndex[] = [];
        const groupedLocationIdArray    = LocationsUtils.encode(locationIdArray);
        for (const column of this.getMap()) {
            for (const tile of column) {
                if (tile.checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray)) {
                    list.push(tile.getGridIndex());
                }
            }
        }
        return list;
    }

    public getConnectedGridIndexArrayWithTileType(origin: AuxiliaryTypesGridIndex.GridIndex, tileType: number): AuxiliaryTypesGridIndex.GridIndex[] {
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
        this._mapSize = new AuxiliaryTypesMapSize.MapSize(width, height);
    }
    public getMapSize(): AuxiliaryTypesMapSize.MapSize {
        return HelpersMisc.getExisted(this._mapSize);
    }

    public getTileCustomNameArray(): AuxiliaryTypesAuxiliaryTypes.Undefinable<TileCustomName[]> {
        return this._tileCustomNameArray;
    }
    public setTileCustomNameArray(arr: AuxiliaryTypesAuxiliaryTypes.Undefinable<TileCustomName[]>): void {
        this._tileCustomNameArray = arr;
    }

    public getTilesCountForPlayer(playerIndex: number): number {
        return this.getTilesCount(v => v.getPlayerIndex() === playerIndex);
    }
    public getTilesCount(func: (t: TilesITile.ITile) => boolean): number {
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
            for (const tile of VisibilitiesUtils.getAllTilesVisibleToTeams(this.getWar(), observerTeamIndexSet)) {
                if (tile.getPlayerIndex() === playerIndex) {
                    bonus += tile.getGlobalAttackBonus() ?? 0;
                }
            }
        }

        if (useDamagePreviewSettings) {
            const war                       = this.getWar();
            const settings                  = war.getDamagePreviewSettings();
            const commandTowerTemplateCfg   = war.getGcData().getTileTemplateCfg(TilesConstantsCommon.TileTypeId.CommandTower);
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
            for (const tile of VisibilitiesUtils.getAllTilesVisibleToTeams(this.getWar(), observerTeamIndexSet)) {
                if (tile.getPlayerIndex() === playerIndex) {
                    bonus += tile.getGlobalDefenseBonus() ?? 0;
                }
            }
        }

        if (useDamagePreviewSettings) {
            const war                       = this.getWar();
            const settings                  = war.getDamagePreviewSettings();
            const commandTowerTemplateCfg   = war.getGcData().getTileTemplateCfg(TilesConstantsCommon.TileTypeId.CommandTower);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileMapLocationVisibleSet);
    }
    public getVisibleGroupedLocationIdArray(): number[] {
        return this._visibleGroupedLocationIdArray;
    }

    public getIsLocationVisible(locationId: number): boolean {
        const idArray = this.getVisibleGroupedLocationIdArray();
        if (idArray == null) {
            return false;
        }

        const groupedLocationId = idArray[Math.floor((locationId - 1) / LocationsConstants.GroupSize)];
        return !!((groupedLocationId >>> ((locationId - 1) % LocationsConstants.GroupSize)) & 1);
    }
    public setIsLocationVisible(locationId: number, isVisible: boolean): void {
        const groupedLocationIdArray  = this._visibleGroupedLocationIdArray ??= new Array<number>(LocationsConstants.GroupCount).fill(0);
        const index                   = Math.floor((locationId - 1) / LocationsConstants.GroupSize);
        if (isVisible) {
            groupedLocationIdArray[index] |= 1 << ((locationId - 1) % LocationsConstants.GroupSize);
        } else {
            groupedLocationIdArray[index] &= ~(1 << ((locationId - 1) % LocationsConstants.GroupSize));
        }
        this.getView().resetLocationLayer();
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileMapLocationVisibleSet);
    }
    public setAllLocationVisible(isVisible: boolean): void {
        if (!isVisible) {
            this.setVisibleGroupedLocationIdArray([]);
        } else {
            const locationIdArray = HelpersCollection.createRange(LocationsConstants.MinId, LocationsConstants.MaxId + 1, 1);
            this.setVisibleGroupedLocationIdArray(LocationsUtils.encode(locationIdArray));
        }
    }
}
