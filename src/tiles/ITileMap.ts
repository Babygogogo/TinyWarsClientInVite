import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { GcData } from "../gameConfigs/GcData.ts";
import type { TileCustomName } from "../proto/schema/CommonProto/Structure/TileCustomName.ts";
import type { SerialTileMap } from "../proto/schema/CommonProto/WarSerialization/SerialTileMap.ts";
import type { ITile } from "./ITile.ts";
import type { ITileMapView } from "./ITileMapView.ts";

export interface ITileMap {
    init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialTileMap>;
        gameConfig              : GcData;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fastInit({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialTileMap>;
        gameConfig              : GcData;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void;

    startRunning(war: IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    serialize(): SerialTileMap;
    serializeForCreateSfw(): SerialTileMap;
    serializeForCreateMfr(): SerialTileMap;

    getWar(): IBwWar;

    getMap(): ITile[][];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getView(): ITileMapView;

    forEachTile(func: (t: ITile) => any): void;
    getTile(gridIndex: GridIndex): ITile;
    getTileWithGridId(gridId: number): ITile;
    getAllTiles(): ITile[];
    getTiles(predicate: (tile: ITile) => boolean): ITile[];
    getGridIndexListWithAnyLocationId(locationIdArray: number[]): GridIndex[];

    getConnectedGridIndexArrayWithTileType(origin: GridIndex, tileType: number): GridIndex[];

    getMapSize(): MapSize;

    getTileCustomNameArray(): Undefinable<TileCustomName[]>;
    setTileCustomNameArray(arr: Undefinable<TileCustomName[]>): void;

    getTilesCountForPlayer(playerIndex: number): number;
    getTilesCount(func: (t: ITile) => boolean): number;

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
