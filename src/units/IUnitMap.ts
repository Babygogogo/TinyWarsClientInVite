import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type Units_IUnit,
    type Units_IUnitMapView,
    type AuxiliaryTypes_MapSize,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { UnitCustomName } from "../proto/schema/CommonProto/Structure/UnitCustomName.ts";
import type { SerialUnitMap } from "../proto/schema/CommonProto/WarSerialization/SerialUnitMap.ts";

export interface IUnitMap {
    init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialUnitMap>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void;
    fastInit({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialUnitMap>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    serialize(): SerialUnitMap;
    serializeForCreateSfw(): SerialUnitMap;
    serializeForCreateMfr(): SerialUnitMap;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getView(): Units_IUnitMapView.IUnitMapView;

    getWar(): BaseWar_Interface_IBwWar.IBwWar;

    getMapSize(): AuxiliaryTypes_MapSize.MapSize;

    getUnitCustomNameArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<UnitCustomName[]>;
    setUnitCustomNameArray(arr: AuxiliaryTypes_AuxiliaryTypes.Undefinable<UnitCustomName[]>): void;

    getNextUnitId(): number;
    setNextUnitId(id: number): void;

    getUnit(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, unitId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Units_IUnit.IUnit | null;
    getUnitById(unitId: number): Units_IUnit.IUnit | null;

    getUnitOnMap(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Units_IUnit.IUnit | null;
    getVisibleUnitOnMap(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Units_IUnit.IUnit | null;

    getUnitLoadedById(unitId: number): Units_IUnit.IUnit | null;
    getRawAllUnitsLoaded(): Map<number, Units_IUnit.IUnit>;
    getUnitsLoadedByLoader(loader: Units_IUnit.IUnit, isRecursive: boolean): Units_IUnit.IUnit[];

    getAllUnitsOnMap(predicate?: (unit: Units_IUnit.IUnit) => boolean): Units_IUnit.IUnit[];
    getAllUnitsLoaded(): Units_IUnit.IUnit[];
    getAllUnits(): Units_IUnit.IUnit[];

    getUnitsCountOnGrid(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;
    getAllUnitsOnGrid(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Units_IUnit.IUnit[];

    setUnitLoaded(unit: Units_IUnit.IUnit): void;
    setUnitUnloaded(unitId: number, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    setUnitOnMap(unit: Units_IUnit.IUnit): void;
    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    removeUnitOnMap(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, removeView: boolean): Units_IUnit.IUnit | null;

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    removeUnitLoaded(unitId: number): Units_IUnit.IUnit;

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    removeUnitById(unitId: number, removeView: boolean): Units_IUnit.IUnit | null;

    countUnitsOnMapForPlayer(playerIndex: number): number;
    countUnitsLoadedForPlayer(playerIndex: number): number;
    countAllUnitsForPlayer(playerIndex: number): number;

    checkHasUnitForPlayer(playerIndex: number): boolean;

    checkIsCoOnboardAnyUnit(playerIndex: number): boolean;
    checkIsCoLoadedByAnyUnitLoaded(playerIndex: number): boolean;
    checkIsCoLoadedByAnyUnitOnMap(playerIndex: number): boolean;

    getCoGridIndexListOnMap(playerIndex: number): AuxiliaryTypes_GridIndex.GridIndex[];
    getVisibleCoGridIndexArrayOnMap(coPlayerIndex: number, observerTeamIndexSet: Set<number>): AuxiliaryTypes_GridIndex.GridIndex[];

    getAllCoUnits(playerIndex: number): Units_IUnit.IUnit[];
}
