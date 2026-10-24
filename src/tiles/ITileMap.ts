import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoStructureTileCustomName from "../proto/schema/CommonProto/Structure/TileCustomName.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTileMap from "../proto/schema/CommonProto/WarSerialization/SerialTileMap.ts";
import type * as TilesITile from "./ITile.ts";
import type * as TilesITileMapView from "./ITileMapView.ts";

type MapSize            = AuxiliaryTypesMapSize.MapSize;
type GcData             = GameConfigGcData.GcData;
type SerialTileMap      = ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap;
type TileCustomName     = ProtoSchemaCommonProtoStructureTileCustomName.TileCustomName;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

export interface ITileMap {
    init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialTileMap>;
        gameConfig              : GcData;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    fastInit({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialTileMap>;
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

    getMap(): TilesITile.ITile[][];

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getView(): TilesITileMapView.ITileMapView;

    forEachTile(func: (t: TilesITile.ITile) => any): void;
    getTile(gridIndex: AuxiliaryTypesGridIndex.GridIndex): TilesITile.ITile;
    getTileWithGridId(gridId: number): TilesITile.ITile;
    getAllTiles(): TilesITile.ITile[];
    getTiles(predicate: (tile: TilesITile.ITile) => boolean): TilesITile.ITile[];
    getGridIndexListWithAnyLocationId(locationIdArray: number[]): AuxiliaryTypesGridIndex.GridIndex[];

    getConnectedGridIndexArrayWithTileType(origin: AuxiliaryTypesGridIndex.GridIndex, tileType: number): AuxiliaryTypesGridIndex.GridIndex[];

    getMapSize(): MapSize;

    getTileCustomNameArray(): AuxiliaryTypesAuxiliaryTypes.Undefinable<TileCustomName[]>;
    setTileCustomNameArray(arr: AuxiliaryTypesAuxiliaryTypes.Undefinable<TileCustomName[]>): void;

    getTilesCountForPlayer(playerIndex: number): number;
    getTilesCount(func: (t: TilesITile.ITile) => boolean): number;

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
