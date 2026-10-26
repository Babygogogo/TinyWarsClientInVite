import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { destroyUnitOnMap } from "../../destructions/Utils.ts";
import { show, showLang } from "../../FloatText.ts";
import { GcData } from "../../gameConfigs/GcData.ts";
import { DrawerMode } from "../../mapEditors/Constants.ts";
import { getUnitClass } from "../../gameHelpers/GhFactory.ts";
import { SymmetryTypeId } from "../../geometries/Constants.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getFormattedText } from "../../lang/Utils.ts";
import type { IMeDrawer } from "../interface/IMeDrawer.ts";
import type { IMeWar } from "../interface/IMeWar.ts";
import {
    getAutoRiverShapeId,
    getAutoBeachShapeId,
    getAutoSeaShapeId,
    getAutoRoadShapeId,
    getAutoBridgeShapeId,
    getAutoPlasmaShapeId,
    getAutoPipeShapeId,
    getAutoTileDecorationTypeAndShapeId,
    getSymmetricalGridIndex,
} from "./MeHelpers.ts";
import type {
    DataForDrawTileObject,
    DataForDrawTileBase,
    DataForDrawTileDecoration,
    DataForAddTileToLocation,
    DataForDeleteTileFromLocation,
    DataForDrawUnit,
} from "./MeTypes.ts";
import type { BwCursorTapped, BwCursorDragged, BwTileChanged, BwUnitChanged } from "../../notifications/DataTypes.ts";
import { addEventListeners, removeEventListeners, dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { Listener } from "../../notifications/Types.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { SerialField } from "../../proto/schema/CommonProto/WarSerialization/SerialField.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import { TileTypeId, BaseTypeId, ObjectTypeId } from "../../tiles/constants/Common.ts";
import type { ITile } from "../../tiles/ITile.ts";
import { create, fillNonTrivialDefaultValues } from "../../tiles/utils/Serialization.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { createDefault } from "../../units/utils/Serialization.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

const MaxCheckpointCount            = 1000;
const SymmetricalPlayerIndexArray   = [0, 2, 1, 4, 3, 6, 5, 8, 7];

export class MeDrawer implements IMeDrawer {
    private _war?                               : IMeWar;
    private _mode                               = DrawerMode.Preview;
    private _dataForDrawTileObject              : DataForDrawTileObject | null = null;
    private _dataForDrawTileBase                : DataForDrawTileBase | null = null;
    private _dataForDrawTileDecoration          : DataForDrawTileDecoration | null = null;
    private _dataForPasteTile                   : SerialTile | null = null;
    private _dataForPasteUnit                   : IUnit[] | null = null;
    private _drawTargetUnit                     : IUnit | null = null;
    private _dataForAddTileToLocation           : DataForAddTileToLocation | null = null;
    private _dataForDeleteTileFromLocation      : DataForDeleteTileFromLocation | null = null;
    private _symmetricalDrawType                = SymmetryTypeId.None;
    private _isRealTimeAdjust                   = true;
    private _isSymmetricalPlayerIndexEnabled    = true;
    private _roadConnectTileTypeArray           : number[] = [
        TileTypeId.Road,
        TileTypeId.BridgeOnBeach,
        TileTypeId.BridgeOnPlain,
        TileTypeId.BridgeOnRiver,
        TileTypeId.BridgeOnSea,
        TileTypeId.Headquarters,
        TileTypeId.City,
        TileTypeId.CommandTower,
        TileTypeId.Radar,
        TileTypeId.Factory,
        TileTypeId.Airport,
        TileTypeId.Seaport,
        TileTypeId.TempAirport,
        TileTypeId.TempSeaport,
    ];
    private _bridgeConnectTileTypeArray         : number[] = [
        TileTypeId.Road,
        TileTypeId.BridgeOnBeach,
        TileTypeId.BridgeOnPlain,
        TileTypeId.BridgeOnRiver,
        TileTypeId.BridgeOnSea,
        TileTypeId.Headquarters,
        TileTypeId.City,
        TileTypeId.CommandTower,
        TileTypeId.Radar,
        TileTypeId.Factory,
        TileTypeId.Airport,
        TileTypeId.Seaport,
        TileTypeId.TempAirport,
        TileTypeId.TempSeaport,
    ];

    private _checkpointArray                    : SerialField[] = [];
    private _currentCheckpointIndex             = 0;

    private _notifyListeners: Listener[] = [
        { type: TypeId.BwCursorTapped,     callback: this._onNotifyBwCursorTapped },
        { type: TypeId.BwCursorDragged,    callback: this._onNotifyBwCursorDragged },
    ];

    public init(): IMeDrawer {
        return this;
    }

    public startRunning(war: IMeWar): void {
        this._setWar(war);

        addEventListeners(this._notifyListeners, this);
    }
    public stopRunning(): void {
        delete this._war;

        removeEventListeners(this._notifyListeners, this);
    }

    private _onNotifyBwCursorTapped(e: Event): void {
        const data      = e.data as BwCursorTapped;
        const gridIndex = data.tappedOn;
        this._handleAction(gridIndex);
    }
    private _onNotifyBwCursorDragged(e: Event): void {
        const data = e.data as BwCursorDragged;
        this._handleAction(data.draggedTo);
    }

    private _setWar(war: IMeWar): void {
        this._war = war;
    }
    private _getWar(): IMeWar {
        return getExisted(this._war);
    }

    private _setMode(mode: DrawerMode): void {
        this._mode = mode;
        dispatch(TypeId.MeDrawerModeChanged);
    }
    public setModeDeleteUnit(): void {
        this._setMode(DrawerMode.DeleteUnit);
    }
    public setModeDeleteTileDecoration(): void {
        this._setMode(DrawerMode.DeleteTileDecoration);
    }
    public setModeDeleteTileObject(): void {
        this._setMode(DrawerMode.DeleteTileObject);
    }
    public setModePreview(): void {
        this._setMode(DrawerMode.Preview);
    }
    public getMode(): DrawerMode {
        return this._mode;
    }

    public setModeDrawTileObject(data: DataForDrawTileObject): void {
        this._setDrawTargetTileObjectData(data);
        this._setDrawTargetTileBaseData(null);
        this._setDrawTargetTileDecorationData(null);
        this._setMode(DrawerMode.DrawTileObject);
    }
    public setModeDrawTileBase(data: DataForDrawTileBase): void {
        this._setDrawTargetTileObjectData(null);
        this._setDrawTargetTileBaseData(data);
        this._setDrawTargetTileDecorationData(null);
        this._setMode(DrawerMode.DrawTileBase);
    }
    public setModeDrawTileDecoration(data: DataForDrawTileDecoration): void {
        this._setDrawTargetTileObjectData(null);
        this._setDrawTargetTileBaseData(null);
        this._setDrawTargetTileDecorationData(data);
        this._setMode(DrawerMode.DrawTileDecoration);
    }
    private _setDrawTargetTileObjectData(data: DataForDrawTileObject | null): void {
        this._dataForDrawTileObject = data;
    }
    public getDrawTargetTileObjectData(): DataForDrawTileObject | null {
        return this._dataForDrawTileObject;
    }
    private _setDrawTargetTileBaseData(data: DataForDrawTileBase | null): void {
        this._dataForDrawTileBase = data;
    }
    public getDrawTargetTileBaseData(): DataForDrawTileBase | null {
        return this._dataForDrawTileBase;
    }
    private _setDrawTargetTileDecorationData(data: DataForDrawTileDecoration | null): void {
        this._dataForDrawTileDecoration = data;
    }
    public getDrawTargetTileDecorationData(): DataForDrawTileDecoration | null {
        return this._dataForDrawTileDecoration;
    }
    public setDataForPasteTile(data: SerialTile): void {
        this._dataForPasteTile = data;
    }
    public getDataForPasteTile(): SerialTile | null {
        return this._dataForPasteTile;
    }
    public setDataForPasteUnit(data: IUnit[]): void {
        this._dataForPasteUnit = data;
    }
    public getDataForPasteUnit(): IUnit[] | null {
        return this._dataForPasteUnit;
    }

    public setModeDrawUnit(data: DataForDrawUnit): void {
        const war           = this._getWar();
        const unit          = new (getUnitClass())();
        const gameConfig    = war.getGcData();
        unit.init(createDefault({
            gridIndex   : { x: 0, y: 0 },
            unitId      : -1,
            unitTypeId  : data.unitType,
            playerIndex : data.playerIndex,
            gcData      : gameConfig,
        }), gameConfig);
        unit.startRunning(war);

        this._setDrawTargetUnit(unit);
        this._setMode(DrawerMode.DrawUnit);
    }
    private _setDrawTargetUnit(unit: IUnit): void {
        this._drawTargetUnit = unit;
    }
    public getDrawTargetUnit(): IUnit | null {
        return this._drawTargetUnit;
    }

    public setModeAddTileToLocation(data: DataForAddTileToLocation): void {
        this._setDataForAddTileToLocation(data);
        this._setMode(DrawerMode.AddTileToLocation);
    }
    private _setDataForAddTileToLocation(data: DataForAddTileToLocation): void {
        this._dataForAddTileToLocation = data;
    }
    public getDataForAddTileToLocation(): DataForAddTileToLocation | null {
        return this._dataForAddTileToLocation;
    }

    public setModeDeleteTileFromLocation(data: DataForDeleteTileFromLocation): void {
        this._setDataForDeleteTileFromLocation(data);
        this._setMode(DrawerMode.DeleteTileFromLocation);
    }
    private _setDataForDeleteTileFromLocation(data: DataForDeleteTileFromLocation): void {
        this._dataForDeleteTileFromLocation = data;
    }
    public getDataForDeleteTileFromLocation(): DataForDeleteTileFromLocation | null {
        return this._dataForDeleteTileFromLocation;
    }

    public setModePasteTile(): void {
        this._setMode(DrawerMode.PasteTile);
    }
    public setModePasteUnit(): void {
        this._setMode(DrawerMode.PasteUnit);
    }

    public getSymmetricalDrawType(): SymmetryTypeId {
        return this._symmetricalDrawType;
    }
    public setSymmetricalDrawType(type: SymmetryTypeId): void {
        this._symmetricalDrawType = type;
    }

    public getSymmetricalPlayerIndex(playerIndex: number): number {
        return getExisted(SymmetricalPlayerIndexArray[playerIndex]);
    }
    public setSymmetricalPlayerIndex(srcPlayerIndex: number, dstPlayerIndex: number): void {
        if (srcPlayerIndex === PlayerIndex.Neutral) {
            throw newError(`Cannot set symmetrical color for neutral player.`);
        }
        SymmetricalPlayerIndexArray[srcPlayerIndex] = dstPlayerIndex;
    }
    public getIsSymmetricalPlayerIndexEnabled(): boolean {
        return this._isSymmetricalPlayerIndexEnabled;
    }
    public setIsSymmetricalPlayerIndexEnabled(isEnabled: boolean): void {
        this._isSymmetricalPlayerIndexEnabled = isEnabled;
    }

    public getIsRealTimeAdjust(): boolean {
        return this._isRealTimeAdjust;
    }
    public setIsRealTimeAdjust(isAuto: boolean): void {
        if (this._isRealTimeAdjust != isAuto) {
            this._isRealTimeAdjust = isAuto;
            dispatch(TypeId.MeRealTimeAdjustChanged);
        }
    }

    public getRoadConnectTileTypeArray(): number[] {
        return this._roadConnectTileTypeArray;
    }
    public getBridgeConnectTileTypeArray(): number[] {
        return this._bridgeConnectTileTypeArray;
    }

    public autoAdjustRivers(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const tileBaseType = tile.getBaseType();
            if (tileBaseType !== BaseTypeId.River) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = getAutoRiverShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getBaseShapeId()) {
                ++adjustCount;
                tile.setBaseShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
            }
        }

        show(getFormattedText(TextType.F0159, adjustCount));
    }
    public autoAdjustBeaches(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const tileBaseType = tile.getBaseType();
            if (tileBaseType !== BaseTypeId.Beach) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = getAutoBeachShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getBaseShapeId()) {
                ++adjustCount;
                tile.setBaseShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
            }
        }

        show(getFormattedText(TextType.F0159, adjustCount));
    }
    public autoAdjustSeas(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const tileBaseType = tile.getBaseType();
            if (tileBaseType !== BaseTypeId.Sea) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = getAutoSeaShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getBaseShapeId()) {
                ++adjustCount;
                tile.setBaseShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
            }
        }

        show(getFormattedText(TextType.F0159, adjustCount));
    }
    public autoAdjustRoads(connectTileTypeArray: number[]): void {
        this._roadConnectTileTypeArray.length = 0;
        this._roadConnectTileTypeArray.push(...connectTileTypeArray);

        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== ObjectTypeId.Road) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = getAutoRoadShapeId(tileMap, gridIndex, connectTileTypeArray);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
            }
        }

        show(getFormattedText(TextType.F0159, adjustCount));
    }
    public autoAdjustBridges(connectTileTypeArray: number[]): void {
        this._bridgeConnectTileTypeArray.length = 0;
        this._bridgeConnectTileTypeArray.push(...connectTileTypeArray);

        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== ObjectTypeId.Bridge) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = getAutoBridgeShapeId(tileMap, gridIndex, connectTileTypeArray);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
            }
        }

        show(getFormattedText(TextType.F0159, adjustCount));
    }
    public autoAdjustPlasmas(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== ObjectTypeId.Plasma) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = getAutoPlasmaShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
            }
        }

        show(getFormattedText(TextType.F0159, adjustCount));
    }
    public autoAdjustPipes(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== ObjectTypeId.Pipe) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = getAutoPipeShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
            }
        }

        show(getFormattedText(TextType.F0159, adjustCount));
    }
    public autoFillTileDecorations(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const gridIndex             = tile.getGridIndex();
            const targetDecorationData  = getAutoTileDecorationTypeAndShapeId(tileMap, gridIndex);
            const decorationType        = targetDecorationData.decorationType;
            const decorationShapeId     = targetDecorationData.shapeId;

            if ((decorationType !== tile.getDecorationType()) || (decorationShapeId !== tile.getDecorationShapeId())) {
                ++adjustCount;
                tile.setDecorationType(decorationType);
                tile.setDecorationShapeId(decorationShapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
            }
        }

        show(getFormattedText(TextType.F0159, adjustCount));
    }

    private _handleAction(gridIndex: GridIndex): void {
        const mode = this.getMode();
        if (mode === DrawerMode.DrawTileBase) {
            this._addCheckpoint();
            this._handleDrawTileBase(gridIndex);

        } else if (mode === DrawerMode.DrawTileDecoration) {
            this._addCheckpoint();
            this._handleDrawTileDecoration(gridIndex);

        } else if (mode === DrawerMode.DrawTileObject) {
            this._addCheckpoint();
            this._handleDrawTileObject(gridIndex);

        } else if (mode === DrawerMode.DrawUnit) {
            this._addCheckpoint();
            this._handleDrawUnit(gridIndex);

        } else if (mode === DrawerMode.DeleteTileDecoration) {
            this._addCheckpoint();
            this._handleDeleteTileDecoration(gridIndex);

        } else if (mode === DrawerMode.DeleteTileObject) {
            this._addCheckpoint();
            this._handleDeleteTileObject(gridIndex);

        } else if (mode === DrawerMode.DeleteUnit) {
            this._addCheckpoint();
            this._handleDeleteUnit(gridIndex);

        } else if (mode === DrawerMode.AddTileToLocation) {
            this._addCheckpoint();
            this._handleAddTileToLocation(gridIndex);

        } else if (mode === DrawerMode.DeleteTileFromLocation) {
            this._addCheckpoint();
            this._handleDeleteTileFromLocation(gridIndex);

        } else if (mode === DrawerMode.Preview) {
            // nothing to do

        } else if (mode === DrawerMode.PasteTile) {
            this._addCheckpoint();
            this._handlePasteTile(gridIndex);

        } else if (mode === DrawerMode.PasteUnit) {
            this._addCheckpoint();
            this._handlePasteUnit(gridIndex);

        } else {
            throw newError(`MeDrawer._handleAction() invalid mode.`);
        }

        this._getWar().setIsMapModified(true);
    }
    private _handleDrawTileBase(gridIndex: GridIndex): void {
        const war               = this._getWar();
        const tileMap           = war.getTileMap();
        const targetBaseData    = getExisted(this.getDrawTargetTileBaseData());
        const baseType          = targetBaseData.baseType;
        const baseShapeId       = targetBaseData.shapeId;
        const gameConfig        = war.getGcData();
        const isRealTileAdjust  = this.getIsRealTimeAdjust();
        const mapSize           = tileMap.getMapSize();

        {
            const tile          = tileMap.getTile(gridIndex);
            const objectType    = tile.getObjectType();
            if (tile.getTileTypeId() === gameConfig.getTileType(baseType, objectType)) {
                tile.setBaseType(baseType);
                tile.setBaseShapeId(baseShapeId);
            } else {
                const data = create({
                    gridIndex               : tile.getGridIndex().toProto().toJson(),
                    playerIndex             : tile.getPlayerIndex(),
                    objectType              : objectType,
                    objectShapeId           : tile.getObjectShapeId(),
                    decorationType          : tile.getDecorationType(),
                    decorationShapeId       : tile.getDecorationShapeId(),
                    baseType                : baseType,
                    baseShapeId             : baseShapeId,
                    groupedLocationIdArray  : tile.getGroupedLocationIdArray(),
                    isHighlighted           : tile.getIsHighlighted(),
                    unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
                    customNameId            : tile.getCustomNameId() ?? null,

                    currentBuildPoint       : null,
                    currentCapturePoint     : null,
                    currentHp               : null,

                    customBuildingData      : null,
                    customCannonData        : null,
                    customCrystalData       : null,
                    customLaserTurretData   : null,
                });
                fillNonTrivialDefaultValues(data, gameConfig);

                tile.init(data, gameConfig);
            }
            tile.startRunning(war);
            tile.flushDataToView();

            dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);

            if (isRealTileAdjust) {
                for (const g of gridIndex.getGridsWithinDistance({
                    minDistance : 0,
                    maxDistance : 1,
                    mapSize     : mapSize,
                })) {
                    this._adjustTile(g);
                }
            }
        }

        {
            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile          = tileMap.getTile(symGridIndex);
                const objectType    = tile.getObjectType();
                const baseShapeId2  = GcData.getSymmetricalTileBaseShapeId(baseType, baseShapeId, symmetryType) ?? 0;
                if (tile.getTileTypeId() === gameConfig.getTileType(baseType, objectType)) {
                    tile.setBaseType(baseType);
                    tile.setBaseShapeId(baseShapeId2);
                } else {
                    const data = create({
                        gridIndex               : tile.getGridIndex().toProto().toJson(),
                        playerIndex             : tile.getPlayerIndex(),
                        objectType              : objectType,
                        objectShapeId           : tile.getObjectShapeId(),
                        decorationType          : tile.getDecorationType(),
                        decorationShapeId       : tile.getDecorationShapeId(),
                        baseType                : baseType,
                        baseShapeId             : baseShapeId2,
                        groupedLocationIdArray  : tile.getGroupedLocationIdArray(),
                        isHighlighted           : tile.getIsHighlighted(),
                        unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
                        customNameId            : tile.getCustomNameId() ?? null,

                        currentBuildPoint       : null,
                        currentCapturePoint     : null,
                        currentHp               : null,

                        customBuildingData      : null,
                        customCannonData        : null,
                        customCrystalData       : null,
                        customLaserTurretData   : null,
                    });
                    fillNonTrivialDefaultValues(data, gameConfig);

                    tile.init(data, gameConfig);
                }
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex: symGridIndex } as BwTileChanged);

                if (isRealTileAdjust) {
                    for (const g of symGridIndex.getGridsWithinDistance({
                        minDistance : 0,
                        maxDistance : 1,
                        mapSize     : mapSize,
                    })) {
                        this._adjustTile(g);
                    }
                }
            }
        }
    }
    private _handleDrawTileDecoration(gridIndex: GridIndex): void {
        const war                   = this._getWar();
        const tileMap               = war.getTileMap();
        const targetDecorationData  = getExisted(this.getDrawTargetTileDecorationData());
        const decorationType        = targetDecorationData.decorationType;
        const decorationShapeId     = targetDecorationData.shapeId;
        const isRealTileAdjust      = this.getIsRealTimeAdjust();
        const mapSize               = tileMap.getMapSize();

        {
            const tile = tileMap.getTile(gridIndex);
            tile.setDecorationType(decorationType);
            tile.setDecorationShapeId(decorationShapeId);
            tile.startRunning(war);
            tile.flushDataToView();

            dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);

            if (isRealTileAdjust) {
                for (const g of gridIndex.getGridsWithinDistance({
                    minDistance : 0,
                    maxDistance : 1,
                    mapSize     : mapSize,
                })) {
                    this._adjustTile(g);
                }
            }
        }

        {
            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = getSymmetricalGridIndex(gridIndex, symmetryType, mapSize);
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile = tileMap.getTile(symGridIndex);
                tile.setDecorationType(decorationType);
                tile.setDecorationShapeId(GcData.getSymmetricalTileDecorationShapeId(decorationType, decorationShapeId, symmetryType) ?? 0);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex: symGridIndex } as BwTileChanged);

                if (isRealTileAdjust) {
                    for (const g of symGridIndex.getGridsWithinDistance({
                        minDistance : 0,
                        maxDistance : 1,
                        mapSize     : mapSize,
                    })) {
                        this._adjustTile(g);
                    }
                }
            }
        }
    }
    private _handleDrawTileObject(gridIndex: GridIndex): void {
        const war               = this._getWar();
        const gameConfig        = war.getGcData();
        const tileMap           = war.getTileMap();
        const unitMap           = war.getUnitMap();
        const targetObjectData  = getExisted(this.getDrawTargetTileObjectData());
        const objectType        = targetObjectData.objectType;
        const playerIndex       = targetObjectData.playerIndex;
        const objectShapeId     = targetObjectData.shapeId;
        const isRealTileAdjust  = this.getIsRealTimeAdjust();
        const mapSize           = tileMap.getMapSize();

        {
            const tile      = tileMap.getTile(gridIndex);
            const baseType  = tile.getBaseType();
            const tileType  = getExisted(gameConfig.getTileType(baseType, objectType));
            if (tileType === tile.getTileTypeId()) {
                tile.setPlayerIndex(playerIndex);
                tile.setObjectType(objectType);
                tile.setObjectShapeId(objectShapeId);
            } else {
                const data = create({
                    gridIndex               : tile.getGridIndex().toProto().toJson(),
                    baseType                : baseType,
                    baseShapeId             : tile.getBaseShapeId(),
                    decorationType          : tile.getDecorationType(),
                    decorationShapeId       : tile.getDecorationShapeId(),
                    playerIndex             : playerIndex,
                    objectType              : objectType,
                    objectShapeId           : objectShapeId,
                    groupedLocationIdArray  : tile.getGroupedLocationIdArray(),
                    isHighlighted           : tile.getIsHighlighted(),
                    unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
                    customNameId            : tile.getCustomNameId() ?? null,

                    currentBuildPoint       : null,
                    currentCapturePoint     : null,
                    currentHp               : null,

                    customBuildingData      : null,
                    customCannonData        : null,
                    customCrystalData       : null,
                    customLaserTurretData   : null,
                });
                fillNonTrivialDefaultValues(data, gameConfig);

                tile.init(data, gameConfig);
            }
            tile.startRunning(war);
            tile.flushDataToView();

            dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);

            if (isRealTileAdjust) {
                for (const g of gridIndex.getGridsWithinDistance({
                    minDistance : 0,
                    maxDistance : 1,
                    mapSize     : mapSize,
                })) {
                    this._adjustTile(g);
                }
            }
        }

        {
            const symmetryType  = this.getSymmetricalDrawType();
            const symGridIndex  = getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile          = tileMap.getTile(symGridIndex);
                const baseType      = tile.getBaseType();
                const objectType2   = GcData.getSymmetricalTileObjectType(objectType, symmetryType);
                const tileType      = getExisted(gameConfig.getTileType(baseType, objectType2));
                if ((!!gameConfig.getTileTemplateCfg(tileType)?.getMaxHp()) && (unitMap.getUnitOnMap(symGridIndex))) {
                    return;
                }

                const objectShapeId2    = GcData.getSymmetricalTileObjectShapeId(objectType, objectShapeId, symmetryType);
                const playerIndex2      = this.getIsSymmetricalPlayerIndexEnabled() ? this.getSymmetricalPlayerIndex(playerIndex) : playerIndex;
                if (tileType === tile.getTileTypeId()) {
                    tile.setPlayerIndex(playerIndex2);
                    tile.setObjectType(objectType2);
                    tile.setObjectShapeId(objectShapeId2 ?? 0);
                } else {
                    const data = create({
                        gridIndex               : tile.getGridIndex().toProto().toJson(),
                        baseType                : tile.getBaseType(),
                        baseShapeId             : tile.getBaseShapeId(),
                        decorationType          : tile.getDecorationType(),
                        decorationShapeId       : tile.getDecorationShapeId(),
                        playerIndex             : playerIndex2,
                        objectType              : objectType2,
                        objectShapeId           : objectShapeId2 ?? 0,
                        groupedLocationIdArray  : tile.getGroupedLocationIdArray(),
                        isHighlighted           : tile.getIsHighlighted(),
                        unfixedBuffArray        : tile.getUnfixedBuffList().map(v => v.toJson()),
                        customNameId            : tile.getCustomNameId() ?? null,

                        currentBuildPoint       : null,
                        currentCapturePoint     : null,
                        currentHp               : null,

                        customBuildingData      : null,
                        customCannonData        : null,
                        customCrystalData       : null,
                        customLaserTurretData   : null,
                    });
                    fillNonTrivialDefaultValues(data, gameConfig);

                    tile.init(data, gameConfig);
                }
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex: symGridIndex } as BwTileChanged);

                if (isRealTileAdjust) {
                    for (const g of symGridIndex.getGridsWithinDistance({
                        minDistance : 0,
                        maxDistance : 1,
                        mapSize     : mapSize,
                    })) {
                        this._adjustTile(g);
                    }
                }
            }
        }
    }
    private _handleDrawUnit(gridIndex: GridIndex): void {
        this._handleDeleteUnit(gridIndex);

        const war           = this._getWar();
        const gameConfig    = war.getGcData();
        const unitMap       = war.getUnitMap();
        const unitId        = unitMap.getNextUnitId();
        const targetUnit    = getExisted(this.getDrawTargetUnit());
        const unit          = new (getUnitClass())();
        unit.init(createDefault({
            gridIndex   : gridIndex.getXY(),
            playerIndex : targetUnit.getPlayerIndex(),
            unitTypeId  : targetUnit.getUnitType(),
            unitId      : unitId,
            gcData      : gameConfig,
        }), gameConfig);
        unit.startRunning(this._getWar());
        unit.startRunningView();

        unitMap.setUnitOnMap(unit);
        unitMap.setNextUnitId(unitId + 1);

        dispatch(TypeId.BwUnitChanged, { gridIndex } as BwUnitChanged);
    }
    private _handleDeleteTileDecoration(gridIndex: GridIndex): void {
        const tileMap   = this._getWar().getTileMap();
        const tile      = tileMap.getTile(gridIndex);
        tile.deleteTileDecoration();
        tile.flushDataToView();

        dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);

        const symmetryType = this.getSymmetricalDrawType();
        const symGridIndex = getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
        if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
            const t2 = tileMap.getTile(symGridIndex);
            t2.deleteTileDecoration();
            t2.flushDataToView();

            dispatch(TypeId.BwTileChanged, { gridIndex: symGridIndex } as BwTileChanged);
        }
    }
    private _handleDeleteTileObject(gridIndex: GridIndex): void {
        const war       = this._getWar();
        const gcData    = war.getGcData();
        const tileMap   = war.getTileMap();

        {
            const tile = tileMap.getTile(gridIndex);
            tile.init(generateSerialTileForDeleteTileObject(tile, gcData), gcData);
            this.startRunning(war);
            tile.flushDataToView();

            dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
        }

        {
            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile = tileMap.getTile(symGridIndex);
                tile.init(generateSerialTileForDeleteTileObject(tile, gcData), gcData);
                this.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex: symGridIndex } as BwTileChanged);
            }
        }
    }
    private _handleDeleteUnit(gridIndex: GridIndex): void {
        const unit = this._getWar().getUnitMap().getUnitOnMap(gridIndex);
        if (unit) {
            const war = this._getWar();
            destroyUnitOnMap(war, gridIndex, true);
            if (unit.getIsCoOnboard()) {
                war.getTileMap().getView().updateCoZone();
            }

            dispatch(TypeId.BwUnitChanged, { gridIndex } as BwUnitChanged);
        }
    }
    private _handleAddTileToLocation(gridIndex: GridIndex): void {
        this._getWar().getTileMap().getTile(gridIndex).setHasLocationIdWithLocationIdArray(this.getDataForAddTileToLocation()?.locationIdArray ?? [], true);
    }
    private _handleDeleteTileFromLocation(gridIndex: GridIndex): void {
        this._getWar().getTileMap().getTile(gridIndex).setHasLocationIdWithLocationIdArray(this.getDataForDeleteTileFromLocation()?.locationIdArray ?? [], false);
    }
    private _handlePasteTile(gridIndex: GridIndex): void {
        const war               = this._getWar();
        const gameConfig        = war.getGcData();
        const unitMap           = war.getUnitMap();
        const srcTileData       = getExisted(this.getDataForPasteTile());
        const srcBaseType       = srcTileData.getBaseType() ?? 0;
        const srcObjectType     = srcTileData.getObjectType() ?? 0;
        const tileMap           = war.getTileMap();
        const isRealTileAdjust  = this.getIsRealTimeAdjust();
        const mapSize           = tileMap.getMapSize();

        {
            const newTileData = srcTileData.clone();
            newTileData.setGridIndex(gridIndex.toProto());

            const tile = tileMap.getTile(gridIndex);
            tile.init(newTileData, gameConfig);
            tile.startRunning(war);
            tile.flushDataToView();

            dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);

            if (isRealTileAdjust) {
                for (const g of gridIndex.getGridsWithinDistance({
                    minDistance : 0,
                    maxDistance : 1,
                    mapSize     : mapSize,
                })) {
                    this._adjustTile(g);
                }
            }
        }

        {
            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const newBaseType   = srcBaseType;
                const newObjectType = GcData.getSymmetricalTileObjectType(srcObjectType, symmetryType);
                const newTileType   = getExisted(gameConfig.getTileType(newBaseType, newObjectType));
                if ((!!gameConfig.getTileTemplateCfg(newTileType)?.getMaxHp()) && (unitMap.getUnitOnMap(symGridIndex))) {
                    return;
                }

                const newTileData = srcTileData.clone();
                newTileData.setGridIndex(symGridIndex.toProto());
                newTileData.setBaseType(newBaseType);
                newTileData.setBaseShapeId(GcData.getSymmetricalTileBaseShapeId(srcBaseType, newTileData.getBaseShapeId() ?? 0, symmetryType));
                newTileData.setObjectType(newObjectType);
                newTileData.setObjectShapeId(GcData.getSymmetricalTileObjectShapeId(srcObjectType, newTileData.getObjectShapeId() ?? 0, symmetryType));
                newTileData.setDecorationShapeId(GcData.getSymmetricalTileDecorationShapeId(newTileData.getDecorationType() ?? 0, newTileData.getDecorationShapeId() ?? 0, symmetryType));
                if (newTileType != gameConfig.getTileType(srcBaseType, srcObjectType)) {
                    newTileData.setCustomBuildingData(null);
                    newTileData.setCustomCannonData(null);
                    newTileData.setCustomCrystalData(null);
                    newTileData.setCustomLaserTurretData(null);
                }

                const tile = tileMap.getTile(symGridIndex);
                tile.init(newTileData, gameConfig);
                tile.startRunning(war);
                tile.flushDataToView();

                dispatch(TypeId.BwTileChanged, { gridIndex: symGridIndex } as BwTileChanged);

                if (isRealTileAdjust) {
                    for (const g of symGridIndex.getGridsWithinDistance({
                        minDistance : 0,
                        maxDistance : 1,
                        mapSize     : mapSize,
                    })) {
                        this._adjustTile(g);
                    }
                }
            }
        }
    }
    private _handlePasteUnit(gridIndex: GridIndex): void {
        this._handleDeleteUnit(gridIndex);

        const war                   = this._getWar();
        const gameConfig            = war.getGcData();
        const tileMap               = war.getTileMap();
        const unitMap               = war.getUnitMap();
        const revisedUnitIdDict     = new Map<number, number>();
        let nextUnitId              = unitMap.getNextUnitId();
        const getRevisedUnitIdDict  = (rawUnitId: number) => {
            if (!revisedUnitIdDict.has(rawUnitId)) {
                revisedUnitIdDict.set(rawUnitId, nextUnitId++);
            }
            return getExisted(revisedUnitIdDict.get(rawUnitId));
        };

        const addedUnits: IUnit[] = [];
        for (const rawUnit of this.getDataForPasteUnit() ?? []) {
            const unitData = rawUnit.serialize();
            unitData.setUnitId(getRevisedUnitIdDict(getExisted(unitData.getUnitId())));
            unitData.setGridIndex(gridIndex.toProto());

            const rawLoaderUnitId = unitData.getLoaderUnitId();
            if (rawLoaderUnitId != null) {
                unitData.setLoaderUnitId(getRevisedUnitIdDict(rawLoaderUnitId));
            }

            const unit = new (getUnitClass())();
            unit.init(unitData, gameConfig);
            unit.startRunning(this._getWar());
            addedUnits.push(unit);

            if (rawLoaderUnitId == null) {
                unitMap.setUnitOnMap(unit);
            } else {
                unitMap.setUnitLoaded(unit);
            }
        }
        for (const unit of addedUnits) {
            unit.startRunningView();
        }
        if (addedUnits.some(v => v.getIsCoOnboard())) {
            tileMap.getView().updateCoZone();
        }

        unitMap.setNextUnitId(nextUnitId);

        dispatch(TypeId.BwUnitChanged, { gridIndex } as BwUnitChanged);
    }

    private _adjustTile(gridIndex: GridIndex): void {
        const war               = this._getWar();
        const tileMap           = war.getTileMap();
        const tile              = tileMap.getTile(gridIndex);
        const baseType          = tile.getBaseType();
        const oldBaseShapeId    = tile.getBaseShapeId();
        let newBaseShapeId      = oldBaseShapeId;
        if (baseType === BaseTypeId.River) {
            newBaseShapeId = getAutoRiverShapeId(tileMap, gridIndex);
        } else if (baseType === BaseTypeId.Beach) {
            newBaseShapeId = getAutoBeachShapeId(tileMap, gridIndex);
        } else if (baseType === BaseTypeId.Sea) {
            newBaseShapeId = getAutoSeaShapeId(tileMap, gridIndex);
        }
        tile.setBaseShapeId(newBaseShapeId);

        const objectType        = tile.getObjectType();
        const oldObjectShapeId  = tile.getObjectShapeId();
        let newObjectShapeId    = oldObjectShapeId;
        if (objectType === ObjectTypeId.Road) {
            newObjectShapeId = getAutoRoadShapeId(tileMap, gridIndex, this.getRoadConnectTileTypeArray());
        } else if (objectType === ObjectTypeId.Bridge) {
            newObjectShapeId = getAutoBridgeShapeId(tileMap, gridIndex, this.getBridgeConnectTileTypeArray());
        } else if (objectType === ObjectTypeId.Plasma) {
            newObjectShapeId = getAutoPlasmaShapeId(tileMap, gridIndex);
        } else if (objectType === ObjectTypeId.Pipe) {
            newObjectShapeId = getAutoPipeShapeId(tileMap, gridIndex);
        }
        tile.setObjectShapeId(newObjectShapeId);

        const oldDecorationType     = tile.getDecorationType();
        const oldDecorationShapeId  = tile.getDecorationShapeId();
        const {
            decorationType  : newDecorationType,
            shapeId         : newDecorationShapeId,
        } = getAutoTileDecorationTypeAndShapeId(tileMap, gridIndex);
        tile.setDecorationType(newDecorationType);
        tile.setDecorationShapeId(newDecorationShapeId);

        if ((newBaseShapeId != oldBaseShapeId)              ||
            (newObjectShapeId != oldObjectShapeId)          ||
            (newDecorationType != oldDecorationType)        ||
            (newDecorationShapeId != oldDecorationShapeId)
        ) {
            tile.startRunning(war);
            tile.flushDataToView();

            dispatch(TypeId.BwTileChanged, { gridIndex } as BwTileChanged);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public loadNextCheckpoint(): void {
        const arr = this._checkpointArray;
        if (this._currentCheckpointIndex >= arr.length - 1) {
            showLang(TextType.A0319);
        } else {
            this._loadCheckpoint(arr[++this._currentCheckpointIndex]);
        }
    }
    public loadPreviousCheckpoint(): void {
        if (this._currentCheckpointIndex <= 0) {
            showLang(TextType.A0319);
        } else {
            const arr = this._checkpointArray;
            if (this._currentCheckpointIndex < arr.length) {
                this._loadCheckpoint(arr[--this._currentCheckpointIndex]);
            } else {
                this._addCheckpoint();
                this._loadCheckpoint(arr[this._currentCheckpointIndex -= 2]);
            }
        }
    }
    private _loadCheckpoint(data: SerialField): void {
        const war = this._getWar();
        war.stopRunning();
        war.getField().init({
            data                    : data,
            gameConfig              : war.getGcData(),
            playersCountUnneutral   : PlayerIndex.Max,
        });
        war.startRunning();
        war.startRunningView();
    }

    private _addCheckpoint(): void {
        const arr   = this._checkpointArray;
        arr.length  = this._currentCheckpointIndex;

        const war = this._getWar();
        if (arr.length >= MaxCheckpointCount) {
            arr.splice(0, 1);
            --this._currentCheckpointIndex;
        }

        arr.push(war.getField().serialize());
        ++this._currentCheckpointIndex;
    }
}

function generateSerialTileForDeleteTileObject(tile: ITile, gcData: GcData): SerialTile {
    const data = tile.serialize();
    data.setPlayerIndex(PlayerIndex.Neutral);
    data.setObjectType(ObjectTypeId.Empty);
    data.setObjectShapeId(0);
    data.setCustomBuildingData(null);
    data.setCustomCannonData(null);
    data.setCustomCrystalData(null);
    data.setCustomLaserTurretData(null);
    fillNonTrivialDefaultValues(data, gcData);

    return data;
}
