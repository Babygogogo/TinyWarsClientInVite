import {
    Visibilities_Constants,
    type FogMaps_Constants,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type Units_Unit,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_UnitVisionInfo,
} from "../internal.ts";
import type { SerialFogMap } from "../proto/schema/CommonProto/WarSerialization/SerialFogMap.ts";

export interface IFogMap {
    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;

    init({ data, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialFogMap>;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void;
    fastInit({ data, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialFogMap>;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void;

    serialize(): SerialFogMap;
    serializeForCreateSfw(): SerialFogMap;
    serializeForCreateMfr(): SerialFogMap;

    getWar(): BaseWar_Interface_IBwWar.IBwWar;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getMapSize(): AuxiliaryTypes_MapSize.MapSize;

    setForceFogCode(code: FogMaps_Constants.ForcedFogCode): void;
    getForceFogCode(): FogMaps_Constants.ForcedFogCode;

    checkHasFogByDefault(): boolean;
    checkHasFogCurrently(): boolean;

    setForceExpireTurnIndex(index: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void;
    getForceExpireTurnIndex(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    setForceExpirePlayerIndex(index: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void;
    getForceExpirePlayerIndex(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    updateOnPlayerTurnSwitched(): void;

    resetAllMapsForPlayer(playerIndex: number): void;

    resetMapFromPathsForPlayer(playerIndex: number, visibilityList: Visibilities_Constants.VisibilityTypeId[] | null): void;
    resetMapFromPathsForPlayerWithEncodedData(playerIndex: number, encodedData?: string): void;
    updateMapFromPathsByUnitAndPath({ unit, unitVisionInfo, path }: {
        unit            : Units_Unit.Unit;
        unitVisionInfo  : AuxiliaryTypes_UnitVisionInfo.UnitVisionInfo;
        path            : AuxiliaryTypes_GridIndex.GridIndex[];
    }): void;
    updateMapFromPathsByVisibilityArray(playerIndex: number, visibilityArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>): void;
    updateMapFromPathsByUnitMovePathVisibilityArrayForWarEvent(array: number[]): void;
    updateMapFromPathsByFlare(playerIndex: number, flareGridIndex: AuxiliaryTypes_GridIndex.GridIndex, flareRadius: number): void;

    getVisibilityFromPathsForPlayer(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, playerIndex: number): Visibilities_Constants.VisibilityTypeId;
    getVisibilityMapFromPathsForTeams(teamIndexes: Set<number>): Visibilities_Constants.VisibilityTypeId[][];
    getRawVisibilityFromPathsForAllPlayers(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Visibilities_Constants.VisibilityTypeId[];
    updateRawVisibilityFromPathsForAllPlayers(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, visibilityArray: number[]): void;

    getVisibilityFromTilesForPlayer(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, playerIndex: number): Visibilities_Constants.VisibilityTypeId;
    getVisibilityMapFromTilesForTeam(teamIndex: number): Visibilities_Constants.VisibilityTypeId[][];
    getVisibilityMapFromTilesForTeams(teamIndexes: Set<number>): Visibilities_Constants.VisibilityTypeId[][];

    getVisibilityFromUnitsForPlayer(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, playerIndex: number): Visibilities_Constants.VisibilityTypeId;
    getVisibilityMapFromUnitsForTeam(teamIndex: number): Visibilities_Constants.VisibilityTypeId[][];
    getVisibilityMapFromUnitsForTeams(teamIndexes: Set<number>): Visibilities_Constants.VisibilityTypeId[][];
}
