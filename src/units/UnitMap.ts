import {
    AuxiliaryTypes_MapSize,
    Units_Unit,
    Units_UnitMapView,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Visibilities_Utils,
    Utils_ClientErrorCode,
    Helpers_Collection,
    Units_Utils_CustomName,
    Helpers_Misc,
    type Units_IUnit,
    type Units_IUnitMap,
    type Units_IUnitMapView,
} from "../internal.ts";

import type { UnitCustomName } from "../proto/schema/CommonProto/Structure/UnitCustomName.ts";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { SerialUnitMap } from "../proto/schema/CommonProto/WarSerialization/SerialUnitMap.ts";

export class UnitMap implements Units_IUnitMap.IUnitMap {
    private _war?                   : BaseWar_Interface_IBwWar.IBwWar;
    private _nextUnitId?            : number;
    private _map?                   : (Units_IUnit.IUnit | null)[][];
    private _mapSize?               : AuxiliaryTypes_MapSize.MapSize;
    private _loadedUnits?           : Map<number, Units_IUnit.IUnit>;
    private _unitCustomNameArray?   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<UnitCustomName[]>;

    private readonly _view          = new Units_UnitMapView.UnitMapView();

    public init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialUnitMap>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw Helpers_Misc.newError(`Empty data.`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_00);
        }

        const nextUnitId = data.getNextUnitId();
        if (!mapSize.checkIsValid()) {
            throw Helpers_Misc.newError(`Invalid mapSize.`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_02);
        }

        const unitCustomNameArray = data.getUnitCustomNameArray();
        {
            const errorCode = Units_Utils_CustomName.getErrorCodeForUnitCustomNameArray(unitCustomNameArray);
            if (errorCode) {
                throw Helpers_Misc.newError(`Invalid unitCustomNameArray.`, errorCode);
            }
        }

        const mapWidth      = mapSize.getWidth();
        const map           = Helpers_Collection.createEmptyMap<Units_IUnit.IUnit>(mapWidth);
        const loadedUnits   = new Map<number, Units_IUnit.IUnit>();
        const allUnits      = new Map<number, Units_IUnit.IUnit>();
        for (const unitData of data.getUnits()) {
            const unit = new Units_Unit.Unit();
            unit.init(unitData, gameConfig);

            const gridIndex = unit.getGridIndex();
            if ((!gridIndex) || (!gridIndex.checkIsInsideMap(mapSize))) {
                throw Helpers_Misc.newError(`Invalid gridIndex: ${gridIndex.getX()}, ${gridIndex.getY()}`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_03);
            }

            const unitId = unit.getUnitId();
            if (allUnits.has(unitId)) {
                throw Helpers_Misc.newError(`Duplicated unitId: ${unitId}`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_04);
            }
            if (unitId >= nextUnitId) {
                throw Helpers_Misc.newError(`Invalid unitId: ${unitId}`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_05);
            }
            allUnits.set(unitId, unit);

            const playerIndex = unit.getPlayerIndex();
            if ((playerIndex == null) || (playerIndex > playersCountUnneutral)) {
                throw Helpers_Misc.newError(`Invalid playerIndex: ${playerIndex}`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_06);
            }

            if (unit.getLoaderUnitId() != null) {
                loadedUnits.set(unitId, unit);
            } else {
                const x = gridIndex.getX();
                const y = gridIndex.getY();
                if (map[x][y]) {
                    throw Helpers_Misc.newError(`The grid is occupied: ${x}, ${y}`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_07);
                }

                map[x][y] = unit;
            }
        }

        const loadUnitCounts = new Map<number, number>();
        for (const [, loadedUnit] of loadedUnits) {
            const loaderId  = Helpers_Misc.getExisted(loadedUnit.getLoaderUnitId(), Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_08);
            const loader    = Helpers_Misc.getExisted(allUnits.get(loaderId), Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_09);
            if (loader.getPlayerIndex() !== loadedUnit.getPlayerIndex()) {
                throw Helpers_Misc.newError(`Invalid playerIndex.`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_10);
            }

            const gridIndex1 = loader.getGridIndex();
            const gridIndex2 = loadedUnit.getGridIndex();
            if ((!gridIndex1) || (!gridIndex2) || (!gridIndex1.checkIsEqual(gridIndex2))) {
                throw Helpers_Misc.newError(`Invalid gridIndex.`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_11);
            }

            const maxLoadCount  = loader.getMaxLoadUnitsCount();
            const loadCount     = (loadUnitCounts.get(loaderId) || 0) + 1;
            if ((maxLoadCount == null) || (loadCount > maxLoadCount)) {
                throw Helpers_Misc.newError(`Over load.`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_12);
            }
            loadUnitCounts.set(loaderId, loadCount);

            const unitType          = loadedUnit.getUnitType();
            const loadUnitCategory  = loader.getLoadUnitCategoryId();
            if ((loadUnitCategory == null)                                          ||
                (!gameConfig.checkIsUnitTypeInCategory(unitType, loadUnitCategory))
            ) {
                throw Helpers_Misc.newError(`Invalid unitType: ${unitType}`, Utils_ClientErrorCode.ClientErrorCode.BwUnitMap_Init_13);
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
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialUnitMap>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        mapSize                 : AuxiliaryTypes_MapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        this.init({ data, gameConfig, mapSize, playersCountUnneutral });
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
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
            for (const unit of Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
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
            for (const unit of Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
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

    private _setMap(map: (Units_IUnit.IUnit | null)[][]): void {
        this._map = map;
    }
    private _getMap(): (Units_IUnit.IUnit | null)[][] {
        return Helpers_Misc.getExisted(this._map);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): Units_IUnitMapView.IUnitMapView {
        return this._view;
    }

    private _setWar(war: BaseWar_Interface_IBwWar.IBwWar): void {
        this._war = war;
    }
    public getWar(): BaseWar_Interface_IBwWar.IBwWar {
        return Helpers_Misc.getExisted(this._war);
    }

    private _setMapSize(width: number, height: number): void {
        this._mapSize = new AuxiliaryTypes_MapSize.MapSize(width, height);
    }
    public getMapSize(): AuxiliaryTypes_MapSize.MapSize {
        return Helpers_Misc.getExisted(this._mapSize);
    }

    public getUnitCustomNameArray(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<UnitCustomName[]> {
        return this._unitCustomNameArray;
    }
    public setUnitCustomNameArray(arr: AuxiliaryTypes_AuxiliaryTypes.Undefinable<UnitCustomName[]>): void {
        this._unitCustomNameArray = arr;
    }

    public getNextUnitId(): number {
        return Helpers_Misc.getExisted(this._nextUnitId);
    }
    public setNextUnitId(id: number): void {
        this._nextUnitId = id;
    }

    public getUnit(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, unitId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Units_IUnit.IUnit | null {
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
    public getUnitById(unitId: number): Units_IUnit.IUnit | null {
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

    public getUnitOnMap(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Units_IUnit.IUnit | null {
        return this._getMap()[gridIndex.getX()][gridIndex.getY()] ?? null;
    }
    public getVisibleUnitOnMap(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Units_IUnit.IUnit | null {
        const unit = this.getUnitOnMap(gridIndex);
        if (unit == null) {
            return null;
        }

        const war = this.getWar();
        return (Visibilities_Utils.checkIsUnitOnMapVisibleToTeam({
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

    public getUnitLoadedById(unitId: number): Units_IUnit.IUnit | null {
        return this.getRawAllUnitsLoaded().get(unitId) ?? null;
    }
    private _setLoadedUnits(units: Map<number, Units_IUnit.IUnit>): void {
        this._loadedUnits = units;
    }
    public getRawAllUnitsLoaded(): Map<number, Units_IUnit.IUnit> {
        return Helpers_Misc.getExisted(this._loadedUnits);
    }
    public getUnitsLoadedByLoader(loader: Units_IUnit.IUnit, isRecursive: boolean): Units_IUnit.IUnit[] {
        const units: Units_IUnit.IUnit[] = [];
        this._forEachUnitLoaded((unit: Units_IUnit.IUnit) => {
            if (unit.getLoaderUnitId() === loader.getUnitId()) {
                units.push(unit);
                (isRecursive) && (units.push(...this.getUnitsLoadedByLoader(unit, isRecursive)));
            }
        });
        return units;
    }

    public getAllUnitsOnMap(predicate?: (unit: Units_IUnit.IUnit) => boolean): Units_IUnit.IUnit[] {
        const units: Units_IUnit.IUnit[] = [];
        this._forEachUnitOnMap(unit => {
            if ((predicate == null) || (predicate(unit))) {
                units.push(unit);
            }
        });
        return units;
    }
    public getAllUnitsLoaded(): Units_IUnit.IUnit[] {
        const units: Units_IUnit.IUnit[] = [];
        this._forEachUnitLoaded(unit => units.push(unit));
        return units;
    }
    public getAllUnits(): Units_IUnit.IUnit[] {
        const units = this.getAllUnitsOnMap();
        this._forEachUnitLoaded(unit => units.push(unit));
        return units;
    }

    public setUnitLoaded(unit: Units_IUnit.IUnit): void {
        const loadedUnits = this.getRawAllUnitsLoaded();
        if (loadedUnits == null) {
            throw Helpers_Misc.newError(`BwUnitMap.setUnitLoaded() the map is not initialized.`);
        }

        const unitId = unit.getUnitId();
        if (unitId == null) {
            throw Helpers_Misc.newError(`BwUnitMap.setUnitLoaded() the unit has no unitId.`);
        }

        if (loadedUnits.has(unitId)) {
            throw Helpers_Misc.newError(`BwUnitMap.setUnitLoaded() the unit is already loaded?!?.`);
        }

        loadedUnits.set(unitId, unit);
        this.getView().addUnit(unit.getView(), true);
    }
    public setUnitUnloaded(unitId: number, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const loadedUnits = this.getRawAllUnitsLoaded();
        this._getMap()[gridIndex.getX()][gridIndex.getY()] = Helpers_Misc.getExisted(loadedUnits.get(unitId));
        loadedUnits.delete(unitId);
    }

    public setUnitOnMap(unit: Units_IUnit.IUnit): void {
        const mapSize   = this.getMapSize();
        const map       = this._getMap();
        if ((!mapSize) || (!map)) {
            throw Helpers_Misc.newError(`BwUnitMap.setUnitOnMap() the map is not initialized.`);
        }

        const gridIndex = unit.getGridIndex();
        if ((!gridIndex) || (!gridIndex.checkIsInsideMap(mapSize))) {
            throw Helpers_Misc.newError(`BwUnitMap.setUnitOnMap() the unit is outside map! gridIndex: ${JSON.stringify(gridIndex)}`);
        }
        if (this.getUnitOnMap(gridIndex)) {
            throw Helpers_Misc.newError(`BwUnitMap.setUnitOnMap() another unit exists in the same grid! gridIndex: ${JSON.stringify(gridIndex)}`);
        }

        map[gridIndex.getX()][gridIndex.getY()] = unit;
        this.getView().addUnit(unit.getView(), true);
    }
    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    public removeUnitOnMap(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, removeView: boolean): Units_IUnit.IUnit | null {
        const unit = this.getUnitOnMap(gridIndex);
        this._getMap()[gridIndex.getX()][gridIndex.getY()] = null;

        (removeView) && (this.getView().removeUnit(Helpers_Misc.getExisted(unit).getView()));

        return unit;
    }

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    public removeUnitLoaded(unitId: number): Units_IUnit.IUnit {
        const loadedUnits   = this.getRawAllUnitsLoaded();
        const unit          = Helpers_Misc.getExisted(loadedUnits.get(unitId));
        loadedUnits.delete(unitId);
        this.getView().removeUnit(unit.getView());

        return unit;
    }

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    public removeUnitById(unitId: number, removeView: boolean): Units_IUnit.IUnit | null {
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

    private _forEachUnit(func: (unit: Units_IUnit.IUnit) => any): void {
        this._forEachUnitOnMap(func);
        this._forEachUnitLoaded(func);
    }
    private _forEachUnitOnMap(func: (unit: Units_IUnit.IUnit) => any): void {
        for (const column of this._getMap()) {
            for (const unit of column) {
                (unit) && (func(unit));
            }
        }
    }
    private _forEachUnitLoaded(func: (unit: Units_IUnit.IUnit) => any): void {
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

    public getUnitsCountOnGrid(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
        const unit = this.getUnitOnMap(gridIndex);
        if (unit == null) {
            return 0;
        } else {
            return 1 + this.getUnitsLoadedByLoader(unit, true).length;
        }
    }
    public getAllUnitsOnGrid(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Units_IUnit.IUnit[] {
        const units : Units_IUnit.IUnit[] = [];
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

    public getCoGridIndexListOnMap(playerIndex: number): AuxiliaryTypes_GridIndex.GridIndex[] {
        const list: AuxiliaryTypes_GridIndex.GridIndex[] = [];
        for (const column of this._getMap()) {
            for (const unit of column) {
                if ((unit) && (unit.getIsCoOnboard()) && (unit.getPlayerIndex() === playerIndex)) {
                    list.push(unit.getGridIndex());
                }
            }
        }

        return list;
    }
    public getVisibleCoGridIndexArrayOnMap(coPlayerIndex: number, observerTeamIndexSet: Set<number>): AuxiliaryTypes_GridIndex.GridIndex[] {
        const array: AuxiliaryTypes_GridIndex.GridIndex[] = [];
        for (const unit of Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(this.getWar(), observerTeamIndexSet)) {
            if ((unit.getIsCoOnboard()) && (unit.getPlayerIndex() === coPlayerIndex)) {
                array.push(unit.getGridIndex());
            }
        }
        return array;
    }

    public getAllCoUnits(playerIndex: number): Units_IUnit.IUnit[] {
        const coUnits: Units_IUnit.IUnit[] = [];
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
