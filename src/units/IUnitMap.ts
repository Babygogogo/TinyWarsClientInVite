import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { GcData } from "../gameConfigs/GcData.ts";
import type { UnitCustomName } from "../proto/schema/CommonProto/Structure/UnitCustomName.ts";
import type { SerialUnitMap } from "../proto/schema/CommonProto/WarSerialization/SerialUnitMap.ts";
import type { IUnit } from "./IUnit.ts";
import type { IUnitMapView } from "./IUnitMapView.ts";

type GameConfiguration      = GcData;
export interface IUnitMap {
    init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialUnitMap>;
        gameConfig              : GameConfiguration;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void;
    fastInit({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialUnitMap>;
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
    getView(): IUnitMapView;

    getWar(): IBwWar;

    getMapSize(): MapSize;

    getUnitCustomNameArray(): Undefinable<UnitCustomName[]>;
    setUnitCustomNameArray(arr: Undefinable<UnitCustomName[]>): void;

    getNextUnitId(): number;
    setNextUnitId(id: number): void;

    getUnit(gridIndex: GridIndex, unitId: Undefinable<number>): IUnit | null;
    getUnitById(unitId: number): IUnit | null;

    getUnitOnMap(gridIndex: GridIndex): IUnit | null;
    getVisibleUnitOnMap(gridIndex: GridIndex): IUnit | null;

    getUnitLoadedById(unitId: number): IUnit | null;
    getRawAllUnitsLoaded(): Map<number, IUnit>;
    getUnitsLoadedByLoader(loader: IUnit, isRecursive: boolean): IUnit[];

    getAllUnitsOnMap(predicate?: (unit: IUnit) => boolean): IUnit[];
    getAllUnitsLoaded(): IUnit[];
    getAllUnits(): IUnit[];

    getUnitsCountOnGrid(gridIndex: GridIndex): number;
    getAllUnitsOnGrid(gridIndex: GridIndex): IUnit[];

    setUnitLoaded(unit: IUnit): void;
    setUnitUnloaded(unitId: number, gridIndex: GridIndex): void;

    setUnitOnMap(unit: IUnit): void;
    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    removeUnitOnMap(gridIndex: GridIndex, removeView: boolean): IUnit | null;

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    removeUnitLoaded(unitId: number): IUnit;

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    removeUnitById(unitId: number, removeView: boolean): IUnit | null;

    countUnitsOnMapForPlayer(playerIndex: number): number;
    countUnitsLoadedForPlayer(playerIndex: number): number;
    countAllUnitsForPlayer(playerIndex: number): number;

    checkHasUnitForPlayer(playerIndex: number): boolean;

    checkIsCoOnboardAnyUnit(playerIndex: number): boolean;
    checkIsCoLoadedByAnyUnitLoaded(playerIndex: number): boolean;
    checkIsCoLoadedByAnyUnitOnMap(playerIndex: number): boolean;

    getCoGridIndexListOnMap(playerIndex: number): GridIndex[];
    getVisibleCoGridIndexArrayOnMap(coPlayerIndex: number, observerTeamIndexSet: Set<number>): GridIndex[];

    getAllCoUnits(playerIndex: number): IUnit[];
}
