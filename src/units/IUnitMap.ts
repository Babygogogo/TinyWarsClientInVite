import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import type * as ProtoSchemaCommonProtoStructureUnitCustomName from "../proto/schema/CommonProto/Structure/UnitCustomName.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnitMap from "../proto/schema/CommonProto/WarSerialization/SerialUnitMap.ts";
import type * as UnitsIUnit from "./IUnit.ts";
import type * as UnitsIUnitMapView from "./IUnitMapView.ts";

type GridIndex              = AuxiliaryTypesGridIndex.GridIndex;
type MapSize                = AuxiliaryTypesMapSize.MapSize;
type GameConfiguration      = GameConfigGcData.GcData;
type SerialUnitMap          = ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap;
type UnitCustomName         = ProtoSchemaCommonProtoStructureUnitCustomName.UnitCustomName;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export interface IUnitMap {
    init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialUnitMap>;
        gameConfig              : GameConfiguration;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void;
    fastInit({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialUnitMap>;
        gameConfig              : GameConfiguration;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void;

    startRunning(war: IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    serialize(): SerialUnitMap;
    serializeForCreateSfw(): SerialUnitMap;
    serializeForCreateMfr(): SerialUnitMap;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getView(): UnitsIUnitMapView.IUnitMapView;

    getWar(): IBwWar;

    getMapSize(): MapSize;

    getUnitCustomNameArray(): AuxiliaryTypesAuxiliaryTypes.Undefinable<UnitCustomName[]>;
    setUnitCustomNameArray(arr: AuxiliaryTypesAuxiliaryTypes.Undefinable<UnitCustomName[]>): void;

    getNextUnitId(): number;
    setNextUnitId(id: number): void;

    getUnit(gridIndex: GridIndex, unitId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): UnitsIUnit.IUnit | null;
    getUnitById(unitId: number): UnitsIUnit.IUnit | null;

    getUnitOnMap(gridIndex: GridIndex): UnitsIUnit.IUnit | null;
    getVisibleUnitOnMap(gridIndex: GridIndex): UnitsIUnit.IUnit | null;

    getUnitLoadedById(unitId: number): UnitsIUnit.IUnit | null;
    getRawAllUnitsLoaded(): Map<number, UnitsIUnit.IUnit>;
    getUnitsLoadedByLoader(loader: UnitsIUnit.IUnit, isRecursive: boolean): UnitsIUnit.IUnit[];

    getAllUnitsOnMap(predicate?: (unit: UnitsIUnit.IUnit) => boolean): UnitsIUnit.IUnit[];
    getAllUnitsLoaded(): UnitsIUnit.IUnit[];
    getAllUnits(): UnitsIUnit.IUnit[];

    getUnitsCountOnGrid(gridIndex: GridIndex): number;
    getAllUnitsOnGrid(gridIndex: GridIndex): UnitsIUnit.IUnit[];

    setUnitLoaded(unit: UnitsIUnit.IUnit): void;
    setUnitUnloaded(unitId: number, gridIndex: GridIndex): void;

    setUnitOnMap(unit: UnitsIUnit.IUnit): void;
    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    removeUnitOnMap(gridIndex: AuxiliaryTypesGridIndex.GridIndex, removeView: boolean): UnitsIUnit.IUnit | null;

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    removeUnitLoaded(unitId: number): UnitsIUnit.IUnit;

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    removeUnitById(unitId: number, removeView: boolean): UnitsIUnit.IUnit | null;

    countUnitsOnMapForPlayer(playerIndex: number): number;
    countUnitsLoadedForPlayer(playerIndex: number): number;
    countAllUnitsForPlayer(playerIndex: number): number;

    checkHasUnitForPlayer(playerIndex: number): boolean;

    checkIsCoOnboardAnyUnit(playerIndex: number): boolean;
    checkIsCoLoadedByAnyUnitLoaded(playerIndex: number): boolean;
    checkIsCoLoadedByAnyUnitOnMap(playerIndex: number): boolean;

    getCoGridIndexListOnMap(playerIndex: number): GridIndex[];
    getVisibleCoGridIndexArrayOnMap(coPlayerIndex: number, observerTeamIndexSet: Set<number>): GridIndex[];

    getAllCoUnits(playerIndex: number): UnitsIUnit.IUnit[];
}
