import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type Tiles_ITile,
    type Tiles_ITileMapView,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { TileCustomName } from "../proto/schema/CommonProto/Structure/TileCustomName.ts";
import type { SerialTileMap } from "../proto/schema/CommonProto/WarSerialization/SerialTileMap.ts";

export interface ITileMap {
    init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTileMap>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fastInit({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialTileMap>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    serialize(): SerialTileMap;
    serializeForCreateSfw(): SerialTileMap;
    serializeForCreateMfr(): SerialTileMap;

    getWar(): BaseWar_Interface_IBwWar.IBwWar;

    getMap(): Tiles_ITile.ITile[][];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getView(): Tiles_ITileMapView.ITileMapView;

    forEachTile(func: (t: Tiles_ITile.ITile) => any): void;
    getTile(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Tiles_ITile.ITile;
    getTileWithGridId(gridId: number): Tiles_ITile.ITile;
    getAllTiles(): Tiles_ITile.ITile[];
    getTiles(predicate: (tile: Tiles_ITile.ITile) => boolean): Tiles_ITile.ITile[];
    getGridIndexListWithAnyLocationId(locationIdArray: number[]): AuxiliaryTypes_GridIndex.GridIndex[];

    getConnectedGridIndexArrayWithTileType(origin: AuxiliaryTypes_GridIndex.GridIndex, tileType: number): AuxiliaryTypes_GridIndex.GridIndex[];

    getMapSize(): AuxiliaryTypes_MapSize.MapSize;

    getTileCustomNameArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomName[]>;
    setTileCustomNameArray(arr: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TileCustomName[]>): void;

    getTilesCountForPlayer(playerIndex: number): number;
    getTilesCount(func: (t: Tiles_ITile.ITile) => boolean): number;

    getTotalIncomeForPlayer(playerIndex: number): number;

    getTotalGlobalAttackBonus(playerIndex: number, observerTeamIndexSet: Set<number> | null, useDamagePreviewSettings: boolean): number;
    getTotalGlobalDefenseBonus(playerIndex: number, observerTeamIndexSet: Set<number> | null, useDamagePreviewSettings: boolean): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for locations.
    ////////////////////////////////////////////////////////////////////////////////
    setVisibleGroupedLocationIdArray(idArray: number[]): void;
    getVisibleGroupedLocationIdArray(): number[];

    getIsLocationVisible(locationId: number): boolean;
    setIsLocationVisible(locationId: number, isVisible: boolean): void;
    setAllLocationVisible(isVisible: boolean): void;
}
