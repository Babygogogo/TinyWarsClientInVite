import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as HelpersCollection from "../helpers/Collection.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoStructureUnitCustomName from "../proto/schema/CommonProto/Structure/UnitCustomName.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialUnitMap from "../proto/schema/CommonProto/WarSerialization/SerialUnitMap.ts";
import type * as UnitsIUnit from "./IUnit.ts";
import type * as UnitsIUnitMap from "./IUnitMap.ts";
import type * as UnitsIUnitMapView from "./IUnitMapView.ts";
import * as UnitsUtilsCustomName from "./utils/CustomName.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../visibilities/Utils.ts";

type SerialUnit         = ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit;
type UnitCustomName     = ProtoSchemaCommonProtoStructureUnitCustomName.UnitCustomName;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

export class UnitMap implements UnitsIUnitMap.IUnitMap {
    private _war?                   : IBwWar;
    private _nextUnitId?            : number;
    private _map?                   : (UnitsIUnit.IUnit | null)[][];
    private _mapSize?               : AuxiliaryTypesMapSize.MapSize;
    private _loadedUnits?           : Map<number, UnitsIUnit.IUnit>;
    private _unitCustomNameArray?   : AuxiliaryTypesAuxiliaryTypes.Undefinable<UnitCustomName[]>;

    private readonly _view          = new (GameHelpersGhFactory.getUnitMapViewClass())();

    public init({ data, gameConfig, mapSize, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap>;
        gameConfig              : GameConfigGcData.GcData;
        mapSize                 : AuxiliaryTypesMapSize.MapSize;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw HelpersMisc.newError(`Empty data.`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_00);
        }

        const nextUnitId = data.getNextUnitId() ?? 0;
        if (!mapSize.checkIsValid()) {
            throw HelpersMisc.newError(`Invalid mapSize.`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_02);
        }

        const unitCustomNameArray = data.getUnitCustomNameArray();
        {
            const errorCode = UnitsUtilsCustomName.getErrorCodeForUnitCustomNameArray(unitCustomNameArray ?? []);
            if (errorCode) {
                throw HelpersMisc.newError(`Invalid unitCustomNameArray.`, errorCode);
            }
        }

        const mapWidth      = mapSize.getWidth();
        const map           = HelpersCollection.createEmptyMap<UnitsIUnit.IUnit>(mapWidth);
        const loadedUnits   = new Map<number, UnitsIUnit.IUnit>();
        const allUnits      = new Map<number, UnitsIUnit.IUnit>();
        for (const unitData of data.getUnits()) {
            const unit = new (GameHelpersGhFactory.getUnitClass())();
            unit.init(unitData, gameConfig);

            const gridIndex = unit.getGridIndex();
            if ((!gridIndex) || (!gridIndex.checkIsInsideMap(mapSize))) {
                throw HelpersMisc.newError(`Invalid gridIndex: ${gridIndex.getX()}, ${gridIndex.getY()}`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_03);
            }

            const unitId = unit.getUnitId();
            if (allUnits.has(unitId)) {
                throw HelpersMisc.newError(`Duplicated unitId: ${unitId}`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_04);
            }
            if (unitId >= nextUnitId) {
                throw HelpersMisc.newError(`Invalid unitId: ${unitId}`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_05);
            }
            allUnits.set(unitId, unit);

            const playerIndex = unit.getPlayerIndex();
            if ((playerIndex == null) || (playerIndex > playersCountUnneutral)) {
                throw HelpersMisc.newError(`Invalid playerIndex: ${playerIndex}`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_06);
            }

            if (unit.getLoaderUnitId() != null) {
                loadedUnits.set(unitId, unit);
            } else {
                const x = gridIndex.getX();
                const y = gridIndex.getY();
                if (map[x][y]) {
                    throw HelpersMisc.newError(`The grid is occupied: ${x}, ${y}`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_07);
                }

                map[x][y] = unit;
            }
        }

        const loadUnitCounts = new Map<number, number>();
        for (const [, loadedUnit] of loadedUnits) {
            const loaderId  = HelpersMisc.getExisted(loadedUnit.getLoaderUnitId(), UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_08);
            const loader    = HelpersMisc.getExisted(allUnits.get(loaderId), UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_09);
            if (loader.getPlayerIndex() !== loadedUnit.getPlayerIndex()) {
                throw HelpersMisc.newError(`Invalid playerIndex.`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_10);
            }

            const gridIndex1 = loader.getGridIndex();
            const gridIndex2 = loadedUnit.getGridIndex();
            if ((!gridIndex1) || (!gridIndex2) || (!gridIndex1.checkIsEqual(gridIndex2))) {
                throw HelpersMisc.newError(`Invalid gridIndex.`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_11);
            }

            const maxLoadCount  = loader.getMaxLoadUnitsCount();
            const loadCount     = (loadUnitCounts.get(loaderId) || 0) + 1;
            if ((maxLoadCount == null) || (loadCount > maxLoadCount)) {
                throw HelpersMisc.newError(`Over load.`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_12);
            }
            loadUnitCounts.set(loaderId, loadCount);

            const unitType          = loadedUnit.getUnitType();
            const loadUnitCategory  = loader.getLoadUnitCategoryId();
            if ((loadUnitCategory == null)                                          ||
                (!gameConfig.checkIsUnitTypeInCategory(unitType, loadUnitCategory))
            ) {
                throw HelpersMisc.newError(`Invalid unitType: ${unitType}`, UtilsClientErrorCode.ClientErrorCode.BwUnitMap_Init_13);
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
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap>;
        gameConfig              : GameConfigGcData.GcData;
        mapSize                 : AuxiliaryTypesMapSize.MapSize;
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

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap {
        const units: SerialUnit[] = [];
        for (const unit of this.getAllUnits()) {
            units.push(unit.serialize());
        }

        return ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap.fromJson({
            units               : units.map(v => v.toJson()),
            nextUnitId          : this.getNextUnitId(),
            unitCustomNameArray : this.getUnitCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap {
        const nextUnitId    = this.getNextUnitId();
        const war           = this.getWar();
        const units         : SerialUnit[] = [];
        if (war.getShouldSerializeFullInfoForFreeModeGames()) {
            for (const unit of this.getAllUnits()) {
                units.push(unit.serializeForCreateSfw());
            }

        } else {
            const teamIndexes = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            for (const unit of VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
                units.push(unit.serializeForCreateSfw());

                for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                    units.push(loadedUnit.serializeForCreateSfw());
                }
            }
        }

        return ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap.fromJson({
            units               : units.map(v => v.toJson()),
            nextUnitId          : nextUnitId,
            unitCustomNameArray : this.getUnitCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap {
        const nextUnitId    = this.getNextUnitId();
        const war           = this.getWar();
        const units         : SerialUnit[] = [];
        if (war.getShouldSerializeFullInfoForFreeModeGames()) {
            for (const unit of this.getAllUnits()) {
                units.push(unit.serializeForCreateMfr());
            }

        } else {
            const teamIndexes = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            for (const unit of VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
                units.push(unit.serializeForCreateMfr());

                if (teamIndexes.has(unit.getTeamIndex())) {
                    for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                        units.push(loadedUnit.serializeForCreateMfr());
                    }
                }
            }
        }

        return ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap.fromJson({
            units               : units.map(v => v.toJson()),
            nextUnitId          : nextUnitId,
            unitCustomNameArray : this.getUnitCustomNameArray()?.map(v => v.toJson()) ?? [],
        });
    }

    private _setMap(map: (UnitsIUnit.IUnit | null)[][]): void {
        this._map = map;
    }
    private _getMap(): (UnitsIUnit.IUnit | null)[][] {
        return HelpersMisc.getExisted(this._map);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other public functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): UnitsIUnitMapView.IUnitMapView {
        return this._view;
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return HelpersMisc.getExisted(this._war);
    }

    private _setMapSize(width: number, height: number): void {
        this._mapSize = new AuxiliaryTypesMapSize.MapSize(width, height);
    }
    public getMapSize(): AuxiliaryTypesMapSize.MapSize {
        return HelpersMisc.getExisted(this._mapSize);
    }

    public getUnitCustomNameArray(): AuxiliaryTypesAuxiliaryTypes.Undefinable<UnitCustomName[]> {
        return this._unitCustomNameArray;
    }
    public setUnitCustomNameArray(arr: AuxiliaryTypesAuxiliaryTypes.Undefinable<UnitCustomName[]>): void {
        this._unitCustomNameArray = arr;
    }

    public getNextUnitId(): number {
        return HelpersMisc.getExisted(this._nextUnitId);
    }
    public setNextUnitId(id: number): void {
        this._nextUnitId = id;
    }

    public getUnit(gridIndex: AuxiliaryTypesGridIndex.GridIndex, unitId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): UnitsIUnit.IUnit | null {
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
    public getUnitById(unitId: number): UnitsIUnit.IUnit | null {
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

    public getUnitOnMap(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UnitsIUnit.IUnit | null {
        return this._getMap()[gridIndex.getX()][gridIndex.getY()] ?? null;
    }
    public getVisibleUnitOnMap(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UnitsIUnit.IUnit | null {
        const unit = this.getUnitOnMap(gridIndex);
        if (unit == null) {
            return null;
        }

        const war = this.getWar();
        return (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeam({
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

    public getUnitLoadedById(unitId: number): UnitsIUnit.IUnit | null {
        return this.getRawAllUnitsLoaded().get(unitId) ?? null;
    }
    private _setLoadedUnits(units: Map<number, UnitsIUnit.IUnit>): void {
        this._loadedUnits = units;
    }
    public getRawAllUnitsLoaded(): Map<number, UnitsIUnit.IUnit> {
        return HelpersMisc.getExisted(this._loadedUnits);
    }
    public getUnitsLoadedByLoader(loader: UnitsIUnit.IUnit, isRecursive: boolean): UnitsIUnit.IUnit[] {
        const units: UnitsIUnit.IUnit[] = [];
        this._forEachUnitLoaded((unit: UnitsIUnit.IUnit) => {
            if (unit.getLoaderUnitId() === loader.getUnitId()) {
                units.push(unit);
                (isRecursive) && (units.push(...this.getUnitsLoadedByLoader(unit, isRecursive)));
            }
        });
        return units;
    }

    public getAllUnitsOnMap(predicate?: (unit: UnitsIUnit.IUnit) => boolean): UnitsIUnit.IUnit[] {
        const units: UnitsIUnit.IUnit[] = [];
        this._forEachUnitOnMap(unit => {
            if ((predicate == null) || (predicate(unit))) {
                units.push(unit);
            }
        });
        return units;
    }
    public getAllUnitsLoaded(): UnitsIUnit.IUnit[] {
        const units: UnitsIUnit.IUnit[] = [];
        this._forEachUnitLoaded(unit => units.push(unit));
        return units;
    }
    public getAllUnits(): UnitsIUnit.IUnit[] {
        const units = this.getAllUnitsOnMap();
        this._forEachUnitLoaded(unit => units.push(unit));
        return units;
    }

    public setUnitLoaded(unit: UnitsIUnit.IUnit): void {
        const loadedUnits = this.getRawAllUnitsLoaded();
        if (loadedUnits == null) {
            throw HelpersMisc.newError(`BwUnitMap.setUnitLoaded() the map is not initialized.`);
        }

        const unitId = unit.getUnitId();
        if (unitId == null) {
            throw HelpersMisc.newError(`BwUnitMap.setUnitLoaded() the unit has no unitId.`);
        }

        if (loadedUnits.has(unitId)) {
            throw HelpersMisc.newError(`BwUnitMap.setUnitLoaded() the unit is already loaded?!?.`);
        }

        loadedUnits.set(unitId, unit);
        this.getView().addUnit(unit.getView(), true);
    }
    public setUnitUnloaded(unitId: number, gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const loadedUnits = this.getRawAllUnitsLoaded();
        this._getMap()[gridIndex.getX()][gridIndex.getY()] = HelpersMisc.getExisted(loadedUnits.get(unitId));
        loadedUnits.delete(unitId);
    }

    public setUnitOnMap(unit: UnitsIUnit.IUnit): void {
        const mapSize   = this.getMapSize();
        const map       = this._getMap();
        if ((!mapSize) || (!map)) {
            throw HelpersMisc.newError(`BwUnitMap.setUnitOnMap() the map is not initialized.`);
        }

        const gridIndex = unit.getGridIndex();
        if ((!gridIndex) || (!gridIndex.checkIsInsideMap(mapSize))) {
            throw HelpersMisc.newError(`BwUnitMap.setUnitOnMap() the unit is outside map! gridIndex: ${JSON.stringify(gridIndex)}`);
        }
        if (this.getUnitOnMap(gridIndex)) {
            throw HelpersMisc.newError(`BwUnitMap.setUnitOnMap() another unit exists in the same grid! gridIndex: ${JSON.stringify(gridIndex)}`);
        }

        map[gridIndex.getX()][gridIndex.getY()] = unit;
        this.getView().addUnit(unit.getView(), true);
    }
    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    public removeUnitOnMap(gridIndex: AuxiliaryTypesGridIndex.GridIndex, removeView: boolean): UnitsIUnit.IUnit | null {
        const unit = this.getUnitOnMap(gridIndex);
        this._getMap()[gridIndex.getX()][gridIndex.getY()] = null;

        (removeView) && (this.getView().removeUnit(HelpersMisc.getExisted(unit).getView()));

        return unit;
    }

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    public removeUnitLoaded(unitId: number): UnitsIUnit.IUnit {
        const loadedUnits   = this.getRawAllUnitsLoaded();
        const unit          = HelpersMisc.getExisted(loadedUnits.get(unitId));
        loadedUnits.delete(unitId);
        this.getView().removeUnit(unit.getView());

        return unit;
    }

    /** 返回被移除的unit；若不再需要该unit，则必须手动调用stopRunning */
    public removeUnitById(unitId: number, removeView: boolean): UnitsIUnit.IUnit | null {
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

    private _forEachUnit(func: (unit: UnitsIUnit.IUnit) => any): void {
        this._forEachUnitOnMap(func);
        this._forEachUnitLoaded(func);
    }
    private _forEachUnitOnMap(func: (unit: UnitsIUnit.IUnit) => any): void {
        for (const column of this._getMap()) {
            for (const unit of column) {
                (unit) && (func(unit));
            }
        }
    }
    private _forEachUnitLoaded(func: (unit: UnitsIUnit.IUnit) => any): void {
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

    public getUnitsCountOnGrid(gridIndex: AuxiliaryTypesGridIndex.GridIndex): number {
        const unit = this.getUnitOnMap(gridIndex);
        if (unit == null) {
            return 0;
        } else {
            return 1 + this.getUnitsLoadedByLoader(unit, true).length;
        }
    }
    public getAllUnitsOnGrid(gridIndex: AuxiliaryTypesGridIndex.GridIndex): UnitsIUnit.IUnit[] {
        const units : UnitsIUnit.IUnit[] = [];
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

    public getCoGridIndexListOnMap(playerIndex: number): AuxiliaryTypesGridIndex.GridIndex[] {
        const list: AuxiliaryTypesGridIndex.GridIndex[] = [];
        for (const column of this._getMap()) {
            for (const unit of column) {
                if ((unit) && (unit.getIsCoOnboard()) && (unit.getPlayerIndex() === playerIndex)) {
                    list.push(unit.getGridIndex());
                }
            }
        }

        return list;
    }
    public getVisibleCoGridIndexArrayOnMap(coPlayerIndex: number, observerTeamIndexSet: Set<number>): AuxiliaryTypesGridIndex.GridIndex[] {
        const array: AuxiliaryTypesGridIndex.GridIndex[] = [];
        for (const unit of VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(this.getWar(), observerTeamIndexSet)) {
            if ((unit.getIsCoOnboard()) && (unit.getPlayerIndex() === coPlayerIndex)) {
                array.push(unit.getGridIndex());
            }
        }
        return array;
    }

    public getAllCoUnits(playerIndex: number): UnitsIUnit.IUnit[] {
        const coUnits: UnitsIUnit.IUnit[] = [];
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
