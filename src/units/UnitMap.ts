import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import { MapSize } from "../auxiliaryTypes/MapSize.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { GameConfig } from "../gameConfigs/GameConfig.ts";
import {
    getUnitMapViewClass,
    getUnitClass,
} from "../gameHelpers/GhFactory.ts";
import { createEmptyMap } from "../helpers/Collection.ts";
import {
    newError,
    getExisted,
} from "../helpers/Misc.ts";
import type { UnitCustomName } from "../proto/schema/CommonProto/Structure/UnitCustomName.ts";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { SerialUnitMap } from "../proto/schema/CommonProto/WarSerialization/SerialUnitMap.ts";
import type { IUnit } from "./IUnit.ts";
import type { IUnitMap } from "./IUnitMap.ts";
import type { IUnitMapView } from "./IUnitMapView.ts";
import { getErrorCodeForUnitCustomNameArray } from "./utils/CustomName.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import {
    getAllUnitsOnMapVisibleToTeams,
    checkIsUnitOnMapVisibleToTeam,
} from "../visibilities/Utils.ts";

export class UnitMap implements IUnitMap {
    private _war?                   : IBwWar;
    private _nextUnitId?            : number;
    private _map?                   : (IUnit | null)[][];
    private _mapSize?               : MapSize;
    private _loadedUnits?           : Map<number, IUnit>;
    private _unitCustomNameArray?   : Undefinable<UnitCustomName[]>;

    private readonly _view          = new (getUnitMapViewClass())();

    public init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialUnitMap>;
        gameConfig              : GameConfig;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw newError(`Empty data.`, ClientErrorCode.BwUnitMap_Init_00);
        }

        const nextUnitId = data.getNextUnitId();
        if (!mapSize.checkIsValid()) {
            throw newError(`Invalid mapSize.`, ClientErrorCode.BwUnitMap_Init_02);
        }

        const unitCustomNameArray = data.getUnitCustomNameArray();
        {
            const errorCode = getErrorCodeForUnitCustomNameArray(unitCustomNameArray);
            if (errorCode) {
                throw newError(`Invalid unitCustomNameArray.`, errorCode);
            }
        }

        const mapWidth      = mapSize.getWidth();
        const map           = createEmptyMap<IUnit>(mapWidth);
        const loadedUnits   = new Map<number, IUnit>();
        const allUnits      = new Map<number, IUnit>();
        for (const unitData of data.getUnits()) {
            const unit = new (getUnitClass())();
            unit.init(unitData, gameConfig);

            const gridIndex = unit.getGridIndex();
            if ((!gridIndex) || (!gridIndex.checkIsInsideMap(mapSize))) {
                throw newError(`Invalid gridIndex: ${gridIndex.getX()}, ${gridIndex.getY()}`, ClientErrorCode.BwUnitMap_Init_03);
            }

            const unitId = unit.getUnitId();
            if (allUnits.has(unitId)) {
                throw newError(`Duplicated unitId: ${unitId}`, ClientErrorCode.BwUnitMap_Init_04);
            }
            if (unitId >= nextUnitId) {
                throw newError(`Invalid unitId: ${unitId}`, ClientErrorCode.BwUnitMap_Init_05);
            }
            allUnits.set(unitId, unit);

            const playerIndex = unit.getPlayerIndex();
            if ((playerIndex == null) || (playerIndex > playersCountUnneutral)) {
                throw newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwUnitMap_Init_06);
            }

            if (unit.getLoaderUnitId() != null) {
                loadedUnits.set(unitId, unit);
            } else {
                const x = gridIndex.getX();
                const y = gridIndex.getY();
                if (map[x][y]) {
                    throw newError(`The grid is occupied: ${x}, ${y}`, ClientErrorCode.BwUnitMap_Init_07);
                }

                map[x][y] = unit;
            }
        }

        const loadUnitCounts = new Map<number, number>();
        for (const [, loadedUnit] of loadedUnits) {
            const loaderId  = getExisted(loadedUnit.getLoaderUnitId(), ClientErrorCode.BwUnitMap_Init_08);
            const loader    = getExisted(allUnits.get(loaderId), ClientErrorCode.BwUnitMap_Init_09);
            if (loader.getPlayerIndex() !== loadedUnit.getPlayerIndex()) {
                throw newError(`Invalid playerIndex.`, ClientErrorCode.BwUnitMap_Init_10);
            }

            const gridIndex1 = loader.getGridIndex();
            const gridIndex2 = loadedUnit.getGridIndex();
            if ((!gridIndex1) || (!gridIndex2) || (!gridIndex1.checkIsEqual(gridIndex2))) {
                throw newError(`Invalid gridIndex.`, ClientErrorCode.BwUnitMap_Init_11);
            }

            const maxLoadCount  = loader.getMaxLoadUnitsCount();
            const loadCount     = (loadUnitCounts.get(loaderId) || 0) + 1;
            if ((maxLoadCount == null) || (loadCount > maxLoadCount)) {
                throw newError(`Over load.`, ClientErrorCode.BwUnitMap_Init_12);
            }
            loadUnitCounts.set(loaderId, loadCount);

            const unitType          = loadedUnit.getUnitType();
            const loadUnitCategory  = loader.getLoadUnitCategoryId();
            if ((loadUnitCategory == null)                                          ||
                (!gameConfig.checkIsUnitTypeInCategory(unitType, loadUnitCategory))
            ) {
                throw newError(`Invalid unitType: ${unitType}`, ClientErrorCode.BwUnitMap_Init_13);
            }
        }

        this._setMap(map);
        this._setLoadedUnits(loadedUnits);
        this._setMapSize(mapWidth, mapSize.getHeight());
        this.setNextUnitId(nextUnitId);
        this.setUnitCustomNameArray(unitCustomNameArray.map(v => v.clone()));

        this.getView().init(this);
    }
    public fastInit({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : Undefinable<SerialUnitMap>;
        gameConfig              : GameConfig;
        mapSize                 : MapSize;
        playersCountUnneutral   : number;
    }): void {
        this.init({ data, gameConfig, mapSize, playersCountUnneutral });
    }

    public startRunning(war: IBwWar): void {
        this._setWar(war);
        this._forEachUnitOnMap(unit => unit.startRunning(war));
        this._forEachUnitLoaded(unit => unit.startRunning(war));
    }
    public startRunningView(): void {
        this.getView().startRunningView();
        this._forEachUnitOnMap(unit => unit.startRunningView());
        this._forEachUnitLoaded(unit => unit.startRunningView());
    }
    public stopRunning(): void {
        this._forEachUnit(unit => unit.stopRunning());
        this.getView().stopRunningView();
    }

    public serialize(): SerialUnitMap {
        const units: SerialUnit[] = [];
        for (const unit of this.getAllUnits()) {
            units.push(unit.serialize());
        }

        return SerialUnitMap.fromJson({
            units               : units.map(v => v.toJson()),
            nextUnitId          : this.getNextUnitId(),
            unitCustomNameArray : this.getUnitCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }
    public serializeForCreateSfw(): SerialUnitMap {
        const nextUnitId    = this.getNextUnitId();
        const war           = this.getWar();
        const units         : SerialUnit[] = [];
        if (war.getShouldSerializeFullInfoForFreeModeGames()) {
            for (const unit of this.getAllUnits()) {
                units.push(unit.serializeForCreateSfw());
            }

        } else {
            const teamIndexes = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            for (const unit of getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
                units.push(unit.serializeForCreateSfw());

                for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                    units.push(loadedUnit.serializeForCreateSfw());
                }
            }
        }

        return SerialUnitMap.fromJson({
            units               : units.map(v => v.toJson()),
            nextUnitId          : nextUnitId,
            unitCustomNameArray : this.getUnitCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }
    public serializeForCreateMfr(): SerialUnitMap {
        const nextUnitId    = this.getNextUnitId();
        const war           = this.getWar();
        const units         : SerialUnit[] = [];
        if (war.getShouldSerializeFullInfoForFreeModeGames()) {
            for (const unit of this.getAllUnits()) {
                units.push(unit.serializeForCreateMfr());
            }

        } else {
            const teamIndexes = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            for (const unit of getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
                units.push(unit.serializeForCreateMfr());

                if (teamIndexes.has(unit.getTeamIndex())) {
                    for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                        units.push(loadedUnit.serializeForCreateMfr());
                    }
                }
            }
        }

        return SerialUnitMap.fromJson({
            units               : units.map(v => v.toJson()),
            nextUnitId          : nextUnitId,
            unitCustomNameArray : this.getUnitCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }

    private _setMap(map: (IUnit | null)[][]): void {
        this._map = map;
    }
    private _getMap(): (IUnit | null)[][] {
        return getExisted(this._map);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): IUnitMapView {
        return this._view;
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return getExisted(this._war);
    }

    private _setMapSize(width: number, height: number): void {
        this._mapSize = new MapSize(width, height);
    }
    public getMapSize(): MapSize {
        return getExisted(this._mapSize);
    }

    public getUnitCustomNameArray(): Undefinable<UnitCustomName[]> {
        return this._unitCustomNameArray;
    }
    public setUnitCustomNameArray(arr: Undefinable<UnitCustomName[]>): void {
        this._unitCustomNameArray = arr;
    }

    public getNextUnitId(): number {
        return getExisted(this._nextUnitId);
    }
    public setNextUnitId(id: number): void {
        this._nextUnitId = id;
    }

    public getUnit(gridIndex: GridIndex, unitId: Undefinable<number>): IUnit | null {
        if (unitId == null) {
            return this.getUnitOnMap(gridIndex);
        } else {
            const unitLoaded = this.getUnitLoadedById(unitId);
            if (unitLoaded) {
                return unitLoaded;
            } else {
                const unitOnMap = this.getUnitOnMap(gridIndex);
                if (!unitOnMap) {
                    return null;
                } else {
                    return unitOnMap.getUnitId() === unitId ? unitOnMap : null;
                }
            }
        }
    }
    public getUnitById(unitId: number): IUnit | null {
        const unitLoaded = this.getUnitLoadedById(unitId);
        if (unitLoaded) {
            return unitLoaded;
        } else {
            for (const column of this._getMap()) {
                for (const unit of column) {
                    if ((unit) && (unit.getUnitId() === unitId)) {
                        return unit;
                    }
                }
            }
            return null;
        }
    }

    public getUnitOnMap(gridIndex: GridIndex): IUnit | null {
        return this._getMap()[gridIndex.getX()][gridIndex.getY()] ?? null;
    }
    public getVisibleUnitOnMap(gridIndex: GridIndex): IUnit | null {
        const unit = this.getUnitOnMap(gridIndex);
        if (unit == null) {
            return null;
        }

        const war = this.getWar();
        return (checkIsUnitOnMapVisibleToTeam({
            war                 : war,
            unitType            : unit.getUnitType(),
            isDiving            : unit.getIsDiving(),
            isInvisible         : unit.checkIsInvisible(gridIndex),
            observerTeamIndex   : war.getPlayerInTurn().getTeamIndex(),
            gridIndex           : gridIndex,
            unitPlayerIndex     : unit.getPlayerIndex(),
        }))
            ? unit
            : null;
    }

    public getUnitLoadedById(unitId: number): IUnit | null {
        return this.getRawAllUnitsLoaded().get(unitId) ?? null;
    }
    private _setLoadedUnits(units: Map<number, IUnit>): void {
        this._loadedUnits = units;
    }
    public getRawAllUnitsLoaded(): Map<number, IUnit> {
        return getExisted(this._loadedUnits);
    }
    public getUnitsLoadedByLoader(loader: IUnit, isRecursive: boolean): IUnit[] {
        const units: IUnit[] = [];
        this._forEachUnitLoaded((unit: IUnit) => {
            if (unit.getLoaderUnitId() === loader.getUnitId()) {
                units.push(unit);
                (isRecursive) && (units.push(...this.getUnitsLoadedByLoader(unit, isRecursive)));
            }
        });
        return units;
    }

    public getAllUnitsOnMap(predicate?: (unit: IUnit) => boolean): IUnit[] {
        const units: IUnit[] = [];
        this._forEachUnitOnMap(unit => {
            if ((predicate == null) || (predicate(unit))) {
                units.push(unit);
            }
        });
        return units;
    }
    public getAllUnitsLoaded(): IUnit[] {
        const units: IUnit[] = [];
        this._forEachUnitLoaded(unit => units.push(unit));
        return units;
    }
    public getAllUnits(): IUnit[] {
        const units = this.getAllUnitsOnMap();
        this._forEachUnitLoaded(unit => units.push(unit));
        return units;
    }

    public setUnitLoaded(unit: IUnit): void {
        const loadedUnits = this.getRawAllUnitsLoaded();
        if (loadedUnits == null) {
            throw newError(`BwUnitMap.setUnitLoaded() the map is not initialized.`);
        }

        const unitId = unit.getUnitId();
        if (unitId == null) {
            throw newError(`BwUnitMap.setUnitLoaded() the unit has no unitId.`);
        }

        if (loadedUnits.has(unitId)) {
            throw newError(`BwUnitMap.setUnitLoaded() the unit is already loaded?!?.`);
        }

        loadedUnits.set(unitId, unit);
        this.getView().addUnit(unit.getView(), true);
    }
    public setUnitUnloaded(unitId: number, gridIndex: GridIndex): void {
        const loadedUnits = this.getRawAllUnitsLoaded();
        this._getMap()[gridIndex.getX()][gridIndex.getY()] = getExisted(loadedUnits.get(unitId));
        loadedUnits.delete(unitId);
    }

    public setUnitOnMap(unit: IUnit): void {
        const mapSize   = this.getMapSize();
        const map       = this._getMap();
        if ((!mapSize) || (!map)) {
            throw newError(`BwUnitMap.setUnitOnMap() the map is not initialized.`);
        }

        const gridIndex = unit.getGridIndex();
        if ((!gridIndex) || (!gridIndex.checkIsInsideMap(mapSize))) {
            throw newError(`BwUnitMap.setUnitOnMap() the unit is outside map! gridIndex: ${JSON.stringify(gridIndex)}`);
        }
        if (this.getUnitOnMap(gridIndex)) {
            throw newError(`BwUnitMap.setUnitOnMap() another unit exists in the same grid! gridIndex: ${JSON.stringify(gridIndex)}`);
        }

        map[gridIndex.getX()][gridIndex.getY()] = unit;
        this.getView().addUnit(unit.getView(), true);
    }
    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    public removeUnitOnMap(gridIndex: GridIndex, removeView: boolean): IUnit | null {
        const unit = this.getUnitOnMap(gridIndex);
        this._getMap()[gridIndex.getX()][gridIndex.getY()] = null;

        (removeView) && (this.getView().removeUnit(getExisted(unit).getView()));

        return unit;
    }

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    public removeUnitLoaded(unitId: number): IUnit {
        const loadedUnits   = this.getRawAllUnitsLoaded();
        const unit          = getExisted(loadedUnits.get(unitId));
        loadedUnits.delete(unitId);
        this.getView().removeUnit(unit.getView());

        return unit;
    }

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    public removeUnitById(unitId: number, removeView: boolean): IUnit | null {
        const unit = this.getUnitById(unitId);
        if (unit == null) {
            return null;
        } else {
            if (unit.getLoaderUnitId() == null) {
                return this.removeUnitOnMap(unit.getGridIndex(), removeView);
            } else {
                return this.removeUnitLoaded(unitId);
            }
        }
    }

    private _forEachUnit(func: (unit: IUnit) => any): void {
        this._forEachUnitOnMap(func);
        this._forEachUnitLoaded(func);
    }
    private _forEachUnitOnMap(func: (unit: IUnit) => any): void {
        for (const column of this._getMap()) {
            for (const unit of column) {
                (unit) && (func(unit));
            }
        }
    }
    private _forEachUnitLoaded(func: (unit: IUnit) => any): void {
        for (const [, unit] of this.getRawAllUnitsLoaded()) {
            func(unit);
        }
    }

    public countUnitsOnMapForPlayer(playerIndex: number): number {
        let count = 0;
        this._forEachUnitOnMap(unit => {
            (unit.getPlayerIndex() === playerIndex) && (++count);
        });
        return count;
    }
    public countUnitsLoadedForPlayer(playerIndex: number): number {
        let count = 0;
        this._forEachUnitLoaded(unit => {
            (unit.getPlayerIndex() === playerIndex) && (++count);
        });
        return count;
    }
    public countAllUnitsForPlayer(playerIndex: number): number {
        return this.countUnitsLoadedForPlayer(playerIndex) + this.countUnitsOnMapForPlayer(playerIndex);
    }

    public getUnitsCountOnGrid(gridIndex: GridIndex): number {
        const unit = this.getUnitOnMap(gridIndex);
        if (unit == null) {
            return 0;
        } else {
            return 1 + this.getUnitsLoadedByLoader(unit, true).length;
        }
    }
    public getAllUnitsOnGrid(gridIndex: GridIndex): IUnit[] {
        const units : IUnit[] = [];
        const unit  = this.getUnitOnMap(gridIndex);
        if (unit != null) {
            units.push(unit);
        }
        for (const [, loadedUnit] of this.getRawAllUnitsLoaded()) {
            if (loadedUnit.getGridIndex().checkIsEqual(gridIndex)) {
                units.push(loadedUnit);
            }
        }

        return units;
    }

    public checkHasUnitForPlayer(playerIndex: number): boolean {
        for (const column of this._getMap()) {
            for (const unit of column) {
                if ((unit) && (unit.getPlayerIndex() === playerIndex)) {
                    return true;
                }
            }
        }
        return false;
    }

    public checkIsCoOnboardAnyUnit(playerIndex: number): boolean {
        return (this.checkIsCoLoadedByAnyUnitOnMap(playerIndex))
            || (this.checkIsCoLoadedByAnyUnitLoaded(playerIndex));
    }
    public checkIsCoLoadedByAnyUnitLoaded(playerIndex: number): boolean {
        for (const [, unit] of this.getRawAllUnitsLoaded()) {
            if ((unit.getPlayerIndex() === playerIndex) && (unit.getIsCoOnboard())) {
                return true;
            }
        }
        return false;
    }
    public checkIsCoLoadedByAnyUnitOnMap(playerIndex: number): boolean {
        return this._getMap().some(v => v.some(u => (u?.getPlayerIndex() === playerIndex) && (u.getIsCoOnboard())));
    }

    public getCoGridIndexListOnMap(playerIndex: number): GridIndex[] {
        const list: GridIndex[] = [];
        for (const column of this._getMap()) {
            for (const unit of column) {
                if ((unit) && (unit.getIsCoOnboard()) && (unit.getPlayerIndex() === playerIndex)) {
                    list.push(unit.getGridIndex());
                }
            }
        }

        return list;
    }
    public getVisibleCoGridIndexArrayOnMap(coPlayerIndex: number, observerTeamIndexSet: Set<number>): GridIndex[] {
        const array: GridIndex[] = [];
        for (const unit of getAllUnitsOnMapVisibleToTeams(this.getWar(), observerTeamIndexSet)) {
            if ((unit.getIsCoOnboard()) && (unit.getPlayerIndex() === coPlayerIndex)) {
                array.push(unit.getGridIndex());
            }
        }
        return array;
    }

    public getAllCoUnits(playerIndex: number): IUnit[] {
        const coUnits: IUnit[] = [];
        for (const [, unit] of this.getRawAllUnitsLoaded()) {
            if ((unit.getPlayerIndex() === playerIndex) && (unit.getIsCoOnboard())) {
                coUnits.push(unit);
            }
        }
        for (const column of this._getMap()) {
            for (const unit of column) {
                if ((unit) && (unit.getPlayerIndex() == playerIndex) && (unit.getIsCoOnboard())) {
                    coUnits.push(unit);
                }
            }
        }
        return coUnits;
    }
}
