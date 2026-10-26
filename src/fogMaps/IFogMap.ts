import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../auxiliaryTypes/MapSize.ts";
import type { UnitVisionInfo } from "../auxiliaryTypes/UnitVisionInfo.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { ForcedFogCode } from "./Constants.ts";
import type { SerialFogMap } from "../proto/schema/CommonProto/WarSerialization/SerialFogMap.ts";
import type { IUnit } from "../units/IUnit.ts";
import {VisibilityTypeId} from "../visibilities/Constants.ts";

type VisibilityType = VisibilityTypeId;
type ForceFogCode   = ForcedFogCode;
export interface IFogMap {
    startRunning(war: IBwWar): void;

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

    getWar(): IBwWar;

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
        unit            : IUnit;
        unitVisionInfo  : UnitVisionInfo;
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
