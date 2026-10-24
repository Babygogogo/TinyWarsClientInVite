import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as AuxiliaryTypesUnitVisionInfo from "../auxiliaryTypes/UnitVisionInfo.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as FogMapsConstants from "./Constants.ts";
import type * as GameConfigGcWar from "../gameConfig/GcWar.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialFogMap from "../proto/schema/CommonProto/WarSerialization/SerialFogMap.ts";
import type * as UnitsIUnit from "../units/IUnit.ts";

type GridIndex      = AuxiliaryTypesGridIndex.GridIndex;
type MapSize        = AuxiliaryTypesMapSize.MapSize;
type VisibilityType = GameConfigGcWar.VisibilityTypeId;
type ForceFogCode   = FogMapsConstants.ForcedFogCode;
type SerialFogMap   = ProtoSchemaCommonProtoWarSerializationSerialFogMap.SerialFogMap;
type Undefinable<T> = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export interface IFogMap {
    startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void;

    init({ data, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialFogMap>;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void;
    fastInit({ data, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialFogMap>;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void;

    serialize(): SerialFogMap;
    serializeForCreateSfw(): SerialFogMap;
    serializeForCreateMfr(): SerialFogMap;

    getWar(): BaseWarInterfaceIBwWar.IBwWar;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getMapSize(): MapSize;

    setForceFogCode(code: ForceFogCode): void;
    getForceFogCode(): ForceFogCode;

    checkHasFogByDefault(): boolean;
    checkHasFogCurrently(): boolean;

    setForceExpireTurnIndex(index: Undefinable<number>): void;
    getForceExpireTurnIndex(): Undefinable<number>;

    setForceExpirePlayerIndex(index: Undefinable<number>): void;
    getForceExpirePlayerIndex(): Undefinable<number>;

    updateOnPlayerTurnSwitched(): void;

    resetAllMapsForPlayer(playerIndex: number): void;

    resetMapFromPathsForPlayer(playerIndex: number, visibilityList: VisibilityType[] | null): void;
    resetMapFromPathsForPlayerWithEncodedData(playerIndex: number, encodedData?: string): void;
    updateMapFromPathsByUnitAndPath({ unit, unitVisionInfo, path }: {
        unit            : UnitsIUnit.IUnit;
        unitVisionInfo  : AuxiliaryTypesUnitVisionInfo.UnitVisionInfo;
        path            : GridIndex[];
    }): void;
    updateMapFromPathsByVisibilityArray(playerIndex: number, visibilityArray: Undefinable<number[]>): void;
    updateMapFromPathsByUnitMovePathVisibilityArrayForWarEvent(array: number[]): void;
    updateMapFromPathsByFlare(playerIndex: number, flareGridIndex: GridIndex, flareRadius: number): void;

    getVisibilityFromPathsForPlayer(gridIndex: GridIndex, playerIndex: number): VisibilityType;
    getVisibilityMapFromPathsForTeams(teamIndexes: Set<number>): VisibilityType[][];
    getRawVisibilityFromPathsForAllPlayers(gridIndex: GridIndex): VisibilityType[];
    updateRawVisibilityFromPathsForAllPlayers(gridIndex: GridIndex, visibilityArray: number[]): void;

    getVisibilityFromTilesForPlayer(gridIndex: GridIndex, playerIndex: number): VisibilityType;
    getVisibilityMapFromTilesForTeam(teamIndex: number): VisibilityType[][];
    getVisibilityMapFromTilesForTeams(teamIndexes: Set<number>): VisibilityType[][];

    getVisibilityFromUnitsForPlayer(gridIndex: GridIndex, playerIndex: number): VisibilityType;
    getVisibilityMapFromUnitsForTeam(teamIndex: number): VisibilityType[][];
    getVisibilityMapFromUnitsForTeams(teamIndexes: Set<number>): VisibilityType[][];
}
