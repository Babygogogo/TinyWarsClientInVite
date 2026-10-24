import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as DestructionsUtils from "../../destructions/Utils.ts";
import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcMapEditor from "../../gameConfig/GcMapEditor.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GeometriesConstants from "../../geometries/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeDrawer from "../interface/IMeDrawer.ts";
import type * as MapEditorInterfaceIMeWar from "../interface/IMeWar.ts";
import * as MapEditorModelMeHelpers from "./MeHelpers.ts";
import type * as MapEditorModelMeTypes from "./MeTypes.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as NotificationsTypes from "../../notifications/Types.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialField from "../../proto/schema/CommonProto/WarSerialization/SerialField.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as TilesUtilsSerialization from "../../tiles/utils/Serialization.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type SerialTile             = ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile;
type SerialField            = ProtoSchemaCommonProtoWarSerializationSerialField.SerialField;
type IUnit                  = UnitsIUnit.IUnit;

const MaxCheckpointCount            = 1000;
const SymmetricalPlayerIndexArray   = [0, 2, 1, 4, 3, 6, 5, 8, 7];

export class MeDrawer implements MapEditorInterfaceIMeDrawer.IMeDrawer {
    private _war?                               : MapEditorInterfaceIMeWar.IMeWar;
    private _mode                               = GameConfigGcMapEditor.DrawerMode.Preview;
    private _dataForDrawTileObject              : MapEditorModelMeTypes.DataForDrawTileObject | null = null;
    private _dataForDrawTileBase                : MapEditorModelMeTypes.DataForDrawTileBase | null = null;
    private _dataForDrawTileDecoration          : MapEditorModelMeTypes.DataForDrawTileDecoration | null = null;
    private _dataForPasteTile                   : SerialTile | null = null;
    private _dataForPasteUnit                   : IUnit[] | null = null;
    private _drawTargetUnit                     : IUnit | null = null;
    private _dataForAddTileToLocation           : MapEditorModelMeTypes.DataForAddTileToLocation | null = null;
    private _dataForDeleteTileFromLocation      : MapEditorModelMeTypes.DataForDeleteTileFromLocation | null = null;
    private _symmetricalDrawType                = GeometriesConstants.SymmetryTypeId.None;
    private _isRealTimeAdjust                   = true;
    private _isSymmetricalPlayerIndexEnabled    = true;
    private _roadConnectTileTypeArray           : number[] = [
        TilesConstantsCommon.TileTypeId.Road,
        TilesConstantsCommon.TileTypeId.BridgeOnBeach,
        TilesConstantsCommon.TileTypeId.BridgeOnPlain,
        TilesConstantsCommon.TileTypeId.BridgeOnRiver,
        TilesConstantsCommon.TileTypeId.BridgeOnSea,
        TilesConstantsCommon.TileTypeId.Headquarters,
        TilesConstantsCommon.TileTypeId.City,
        TilesConstantsCommon.TileTypeId.CommandTower,
        TilesConstantsCommon.TileTypeId.Radar,
        TilesConstantsCommon.TileTypeId.Factory,
        TilesConstantsCommon.TileTypeId.Airport,
        TilesConstantsCommon.TileTypeId.Seaport,
        TilesConstantsCommon.TileTypeId.TempAirport,
        TilesConstantsCommon.TileTypeId.TempSeaport,
    ];
    private _bridgeConnectTileTypeArray         : number[] = [
        TilesConstantsCommon.TileTypeId.Road,
        TilesConstantsCommon.TileTypeId.BridgeOnBeach,
        TilesConstantsCommon.TileTypeId.BridgeOnPlain,
        TilesConstantsCommon.TileTypeId.BridgeOnRiver,
        TilesConstantsCommon.TileTypeId.BridgeOnSea,
        TilesConstantsCommon.TileTypeId.Headquarters,
        TilesConstantsCommon.TileTypeId.City,
        TilesConstantsCommon.TileTypeId.CommandTower,
        TilesConstantsCommon.TileTypeId.Radar,
        TilesConstantsCommon.TileTypeId.Factory,
        TilesConstantsCommon.TileTypeId.Airport,
        TilesConstantsCommon.TileTypeId.Seaport,
        TilesConstantsCommon.TileTypeId.TempAirport,
        TilesConstantsCommon.TileTypeId.TempSeaport,
    ];

    private _checkpointArray                    : SerialField[] = [];
    private _currentCheckpointIndex             = 0;

    private _notifyListeners: NotificationsTypes.Listener[] = [
        { type: NotificationsTypeId.TypeId.BwCursorTapped,     callback: this._onNotifyBwCursorTapped },
        { type: NotificationsTypeId.TypeId.BwCursorDragged,    callback: this._onNotifyBwCursorDragged },
    ];

    public init(): MapEditorInterfaceIMeDrawer.IMeDrawer {
        return this;
    }

    public startRunning(war: MapEditorInterfaceIMeWar.IMeWar): void {
        this._setWar(war);

        NotificationsDispatcher.addEventListeners(this._notifyListeners, this);
    }
    public stopRunning(): void {
        delete this._war;

        NotificationsDispatcher.removeEventListeners(this._notifyListeners, this);
    }

    private _onNotifyBwCursorTapped(e: VendorEgretEgret.Event): void {
        const data      = e.data as NotificationsDataTypes.BwCursorTapped;
        const gridIndex = data.tappedOn;
        this._handleAction(gridIndex);
    }
    private _onNotifyBwCursorDragged(e: VendorEgretEgret.Event): void {
        const data = e.data as NotificationsDataTypes.BwCursorDragged;
        this._handleAction(data.draggedTo);
    }

    private _setWar(war: MapEditorInterfaceIMeWar.IMeWar): void {
        this._war = war;
    }
    private _getWar(): MapEditorInterfaceIMeWar.IMeWar {
        return HelpersMisc.getExisted(this._war);
    }

    private _setMode(mode: GameConfigGcMapEditor.DrawerMode): void {
        this._mode = mode;
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeDrawerModeChanged);
    }
    public setModeDeleteUnit(): void {
        this._setMode(GameConfigGcMapEditor.DrawerMode.DeleteUnit);
    }
    public setModeDeleteTileDecoration(): void {
        this._setMode(GameConfigGcMapEditor.DrawerMode.DeleteTileDecoration);
    }
    public setModeDeleteTileObject(): void {
        this._setMode(GameConfigGcMapEditor.DrawerMode.DeleteTileObject);
    }
    public setModePreview(): void {
        this._setMode(GameConfigGcMapEditor.DrawerMode.Preview);
    }
    public getMode(): GameConfigGcMapEditor.DrawerMode {
        return this._mode;
    }

    public setModeDrawTileObject(data: MapEditorModelMeTypes.DataForDrawTileObject): void {
        this._setDrawTargetTileObjectData(data);
        this._setDrawTargetTileBaseData(null);
        this._setDrawTargetTileDecorationData(null);
        this._setMode(GameConfigGcMapEditor.DrawerMode.DrawTileObject);
    }
    public setModeDrawTileBase(data: MapEditorModelMeTypes.DataForDrawTileBase): void {
        this._setDrawTargetTileObjectData(null);
        this._setDrawTargetTileBaseData(data);
        this._setDrawTargetTileDecorationData(null);
        this._setMode(GameConfigGcMapEditor.DrawerMode.DrawTileBase);
    }
    public setModeDrawTileDecoration(data: MapEditorModelMeTypes.DataForDrawTileDecoration): void {
        this._setDrawTargetTileObjectData(null);
        this._setDrawTargetTileBaseData(null);
        this._setDrawTargetTileDecorationData(data);
        this._setMode(GameConfigGcMapEditor.DrawerMode.DrawTileDecoration);
    }
    private _setDrawTargetTileObjectData(data: MapEditorModelMeTypes.DataForDrawTileObject | null): void {
        this._dataForDrawTileObject = data;
    }
    public getDrawTargetTileObjectData(): MapEditorModelMeTypes.DataForDrawTileObject | null {
        return this._dataForDrawTileObject;
    }
    private _setDrawTargetTileBaseData(data: MapEditorModelMeTypes.DataForDrawTileBase | null): void {
        this._dataForDrawTileBase = data;
    }
    public getDrawTargetTileBaseData(): MapEditorModelMeTypes.DataForDrawTileBase | null {
        return this._dataForDrawTileBase;
    }
    private _setDrawTargetTileDecorationData(data: MapEditorModelMeTypes.DataForDrawTileDecoration | null): void {
        this._dataForDrawTileDecoration = data;
    }
    public getDrawTargetTileDecorationData(): MapEditorModelMeTypes.DataForDrawTileDecoration | null {
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

    public setModeDrawUnit(data: MapEditorModelMeTypes.DataForDrawUnit): void {
        const war           = this._getWar();
        const unit          = new (GameHelpersGhFactory.getUnitClass())();
        const gameConfig    = war.getGcData();
        unit.init(UnitsUtilsSerialization.createDefault({
            gridIndex   : { x: 0, y: 0 },
            unitId      : -1,
            unitTypeId  : data.unitType,
            playerIndex : data.playerIndex,
            gcData      : gameConfig,
        }), gameConfig);
        unit.startRunning(war);

        this._setDrawTargetUnit(unit);
        this._setMode(GameConfigGcMapEditor.DrawerMode.DrawUnit);
    }
    private _setDrawTargetUnit(unit: IUnit): void {
        this._drawTargetUnit = unit;
    }
    public getDrawTargetUnit(): IUnit | null {
        return this._drawTargetUnit;
    }

    public setModeAddTileToLocation(data: MapEditorModelMeTypes.DataForAddTileToLocation): void {
        this._setDataForAddTileToLocation(data);
        this._setMode(GameConfigGcMapEditor.DrawerMode.AddTileToLocation);
    }
    private _setDataForAddTileToLocation(data: MapEditorModelMeTypes.DataForAddTileToLocation): void {
        this._dataForAddTileToLocation = data;
    }
    public getDataForAddTileToLocation(): MapEditorModelMeTypes.DataForAddTileToLocation | null {
        return this._dataForAddTileToLocation;
    }

    public setModeDeleteTileFromLocation(data: MapEditorModelMeTypes.DataForDeleteTileFromLocation): void {
        this._setDataForDeleteTileFromLocation(data);
        this._setMode(GameConfigGcMapEditor.DrawerMode.DeleteTileFromLocation);
    }
    private _setDataForDeleteTileFromLocation(data: MapEditorModelMeTypes.DataForDeleteTileFromLocation): void {
        this._dataForDeleteTileFromLocation = data;
    }
    public getDataForDeleteTileFromLocation(): MapEditorModelMeTypes.DataForDeleteTileFromLocation | null {
        return this._dataForDeleteTileFromLocation;
    }

    public setModePasteTile(): void {
        this._setMode(GameConfigGcMapEditor.DrawerMode.PasteTile);
    }
    public setModePasteUnit(): void {
        this._setMode(GameConfigGcMapEditor.DrawerMode.PasteUnit);
    }

    public getSymmetricalDrawType(): GeometriesConstants.SymmetryTypeId {
        return this._symmetricalDrawType;
    }
    public setSymmetricalDrawType(type: GeometriesConstants.SymmetryTypeId): void {
        this._symmetricalDrawType = type;
    }

    public getSymmetricalPlayerIndex(playerIndex: number): number {
        return HelpersMisc.getExisted(SymmetricalPlayerIndexArray[playerIndex]);
    }
    public setSymmetricalPlayerIndex(srcPlayerIndex: number, dstPlayerIndex: number): void {
        if (srcPlayerIndex === PlayersConstants.PlayerIndex.Neutral) {
            throw HelpersMisc.newError(`Cannot set symmetrical color for neutral player.`);
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
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeRealTimeAdjustChanged);
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
            if (tileBaseType !== TilesConstantsCommon.BaseTypeId.River) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditorModelMeHelpers.getAutoRiverShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getBaseShapeId()) {
                ++adjustCount;
                tile.setBaseShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
            }
        }

        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0159, adjustCount));
    }
    public autoAdjustBeaches(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const tileBaseType = tile.getBaseType();
            if (tileBaseType !== TilesConstantsCommon.BaseTypeId.Beach) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditorModelMeHelpers.getAutoBeachShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getBaseShapeId()) {
                ++adjustCount;
                tile.setBaseShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
            }
        }

        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0159, adjustCount));
    }
    public autoAdjustSeas(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const tileBaseType = tile.getBaseType();
            if (tileBaseType !== TilesConstantsCommon.BaseTypeId.Sea) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditorModelMeHelpers.getAutoSeaShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getBaseShapeId()) {
                ++adjustCount;
                tile.setBaseShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
            }
        }

        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0159, adjustCount));
    }
    public autoAdjustRoads(connectTileTypeArray: number[]): void {
        this._roadConnectTileTypeArray.length = 0;
        this._roadConnectTileTypeArray.push(...connectTileTypeArray);

        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== TilesConstantsCommon.ObjectTypeId.Road) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditorModelMeHelpers.getAutoRoadShapeId(tileMap, gridIndex, connectTileTypeArray);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
            }
        }

        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0159, adjustCount));
    }
    public autoAdjustBridges(connectTileTypeArray: number[]): void {
        this._bridgeConnectTileTypeArray.length = 0;
        this._bridgeConnectTileTypeArray.push(...connectTileTypeArray);

        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== TilesConstantsCommon.ObjectTypeId.Bridge) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditorModelMeHelpers.getAutoBridgeShapeId(tileMap, gridIndex, connectTileTypeArray);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
            }
        }

        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0159, adjustCount));
    }
    public autoAdjustPlasmas(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== TilesConstantsCommon.ObjectTypeId.Plasma) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditorModelMeHelpers.getAutoPlasmaShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
            }
        }

        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0159, adjustCount));
    }
    public autoAdjustPipes(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== TilesConstantsCommon.ObjectTypeId.Pipe) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditorModelMeHelpers.getAutoPipeShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
            }
        }

        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0159, adjustCount));
    }
    public autoFillTileDecorations(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const gridIndex             = tile.getGridIndex();
            const targetDecorationData  = MapEditorModelMeHelpers.getAutoTileDecorationTypeAndShapeId(tileMap, gridIndex);
            const decorationType        = targetDecorationData.decorationType;
            const decorationShapeId     = targetDecorationData.shapeId;

            if ((decorationType !== tile.getDecorationType()) || (decorationShapeId !== tile.getDecorationShapeId())) {
                ++adjustCount;
                tile.setDecorationType(decorationType);
                tile.setDecorationShapeId(decorationShapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
            }
        }

        FloatText2.show(LangUtils.getFormattedText(LangConstants.TextType.F0159, adjustCount));
    }

    private _handleAction(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const mode = this.getMode();
        if (mode === GameConfigGcMapEditor.DrawerMode.DrawTileBase) {
            this._addCheckpoint();
            this._handleDrawTileBase(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DrawTileDecoration) {
            this._addCheckpoint();
            this._handleDrawTileDecoration(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DrawTileObject) {
            this._addCheckpoint();
            this._handleDrawTileObject(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DrawUnit) {
            this._addCheckpoint();
            this._handleDrawUnit(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DeleteTileDecoration) {
            this._addCheckpoint();
            this._handleDeleteTileDecoration(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DeleteTileObject) {
            this._addCheckpoint();
            this._handleDeleteTileObject(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DeleteUnit) {
            this._addCheckpoint();
            this._handleDeleteUnit(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.AddTileToLocation) {
            this._addCheckpoint();
            this._handleAddTileToLocation(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.DeleteTileFromLocation) {
            this._addCheckpoint();
            this._handleDeleteTileFromLocation(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.Preview) {
            // nothing to do

        } else if (mode === GameConfigGcMapEditor.DrawerMode.PasteTile) {
            this._addCheckpoint();
            this._handlePasteTile(gridIndex);

        } else if (mode === GameConfigGcMapEditor.DrawerMode.PasteUnit) {
            this._addCheckpoint();
            this._handlePasteUnit(gridIndex);

        } else {
            throw HelpersMisc.newError(`MeDrawer._handleAction() invalid mode.`);
        }

        this._getWar().setIsMapModified(true);
    }
    private _handleDrawTileBase(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const war               = this._getWar();
        const tileMap           = war.getTileMap();
        const targetBaseData    = HelpersMisc.getExisted(this.getDrawTargetTileBaseData());
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
                const data = TilesUtilsSerialization.create({
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
                TilesUtilsSerialization.fillNonTrivialDefaultValues(data, gameConfig);

                tile.init(data, gameConfig);
            }
            tile.startRunning(war);
            tile.flushDataToView();

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);

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
            const symGridIndex = MapEditorModelMeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile          = tileMap.getTile(symGridIndex);
                const objectType    = tile.getObjectType();
                const baseShapeId2  = gameConfig.getSymmetricalTileBaseShapeId(baseType, baseShapeId, symmetryType) ?? 0;
                if (tile.getTileTypeId() === gameConfig.getTileType(baseType, objectType)) {
                    tile.setBaseType(baseType);
                    tile.setBaseShapeId(baseShapeId2);
                } else {
                    const data = TilesUtilsSerialization.create({
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
                    TilesUtilsSerialization.fillNonTrivialDefaultValues(data, gameConfig);

                    tile.init(data, gameConfig);
                }
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex: symGridIndex } as NotificationsDataTypes.BwTileChanged);

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
    private _handleDrawTileDecoration(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const war                   = this._getWar();
        const tileMap               = war.getTileMap();
        const gameConfig            = war.getGcData();
        const targetDecorationData  = HelpersMisc.getExisted(this.getDrawTargetTileDecorationData());
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

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);

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
            const symGridIndex = MapEditorModelMeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, mapSize);
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile = tileMap.getTile(symGridIndex);
                tile.setDecorationType(decorationType);
                tile.setDecorationShapeId(gameConfig.getSymmetricalTileDecorationShapeId(decorationType, decorationShapeId, symmetryType) ?? 0);
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex: symGridIndex } as NotificationsDataTypes.BwTileChanged);

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
    private _handleDrawTileObject(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const war               = this._getWar();
        const gameConfig        = war.getGcData();
        const tileMap           = war.getTileMap();
        const unitMap           = war.getUnitMap();
        const targetObjectData  = HelpersMisc.getExisted(this.getDrawTargetTileObjectData());
        const objectType        = targetObjectData.objectType;
        const playerIndex       = targetObjectData.playerIndex;
        const objectShapeId     = targetObjectData.shapeId;
        const isRealTileAdjust  = this.getIsRealTimeAdjust();
        const mapSize           = tileMap.getMapSize();

        {
            const tile      = tileMap.getTile(gridIndex);
            const baseType  = tile.getBaseType();
            const tileType  = HelpersMisc.getExisted(gameConfig.getTileType(baseType, objectType));
            if (tileType === tile.getTileTypeId()) {
                tile.setPlayerIndex(playerIndex);
                tile.setObjectType(objectType);
                tile.setObjectShapeId(objectShapeId);
            } else {
                const data = TilesUtilsSerialization.create({
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
                TilesUtilsSerialization.fillNonTrivialDefaultValues(data, gameConfig);

                tile.init(data, gameConfig);
            }
            tile.startRunning(war);
            tile.flushDataToView();

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);

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
            const symGridIndex  = MapEditorModelMeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile          = tileMap.getTile(symGridIndex);
                const baseType      = tile.getBaseType();
                const objectType2   = gameConfig.getSymmetricalTileObjectType(objectType, symmetryType);
                const tileType      = HelpersMisc.getExisted(gameConfig.getTileType(baseType, objectType2));
                if ((!!gameConfig.getTileTemplateCfg(tileType)?.getMaxHp()) && (unitMap.getUnitOnMap(symGridIndex))) {
                    return;
                }

                const objectShapeId2    = gameConfig.getSymmetricalTileObjectShapeId(objectType, objectShapeId, symmetryType);
                const playerIndex2      = this.getIsSymmetricalPlayerIndexEnabled() ? this.getSymmetricalPlayerIndex(playerIndex) : playerIndex;
                if (tileType === tile.getTileTypeId()) {
                    tile.setPlayerIndex(playerIndex2);
                    tile.setObjectType(objectType2);
                    tile.setObjectShapeId(objectShapeId2 ?? 0);
                } else {
                    const data = TilesUtilsSerialization.create({
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
                    TilesUtilsSerialization.fillNonTrivialDefaultValues(data, gameConfig);

                    tile.init(data, gameConfig);
                }
                tile.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex: symGridIndex } as NotificationsDataTypes.BwTileChanged);

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
    private _handleDrawUnit(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._handleDeleteUnit(gridIndex);

        const war           = this._getWar();
        const gameConfig    = war.getGcData();
        const unitMap       = war.getUnitMap();
        const unitId        = unitMap.getNextUnitId();
        const targetUnit    = HelpersMisc.getExisted(this.getDrawTargetUnit());
        const unit          = new (GameHelpersGhFactory.getUnitClass())();
        unit.init(UnitsUtilsSerialization.createDefault({
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

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwUnitChanged, { gridIndex } as NotificationsDataTypes.BwUnitChanged);
    }
    private _handleDeleteTileDecoration(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const tileMap   = this._getWar().getTileMap();
        const tile      = tileMap.getTile(gridIndex);
        tile.deleteTileDecoration();
        tile.flushDataToView();

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);

        const symmetryType = this.getSymmetricalDrawType();
        const symGridIndex = MapEditorModelMeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
        if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
            const t2 = tileMap.getTile(symGridIndex);
            t2.deleteTileDecoration();
            t2.flushDataToView();

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex: symGridIndex } as NotificationsDataTypes.BwTileChanged);
        }
    }
    private _handleDeleteTileObject(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const war       = this._getWar();
        const gcData    = war.getGcData();
        const tileMap   = war.getTileMap();

        {
            const tile = tileMap.getTile(gridIndex);
            tile.init(generateSerialTileForDeleteTileObject(tile, gcData), gcData);
            this.startRunning(war);
            tile.flushDataToView();

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
        }

        {
            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MapEditorModelMeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile = tileMap.getTile(symGridIndex);
                tile.init(generateSerialTileForDeleteTileObject(tile, gcData), gcData);
                this.startRunning(war);
                tile.flushDataToView();

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex: symGridIndex } as NotificationsDataTypes.BwTileChanged);
            }
        }
    }
    private _handleDeleteUnit(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const unit = this._getWar().getUnitMap().getUnitOnMap(gridIndex);
        if (unit) {
            const war = this._getWar();
            DestructionsUtils.destroyUnitOnMap(war, gridIndex, true);
            if (unit.getIsCoOnboard()) {
                war.getTileMap().getView().updateCoZone();
            }

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwUnitChanged, { gridIndex } as NotificationsDataTypes.BwUnitChanged);
        }
    }
    private _handleAddTileToLocation(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._getWar().getTileMap().getTile(gridIndex).setHasLocationIdWithLocationIdArray(this.getDataForAddTileToLocation()?.locationIdArray ?? [], true);
    }
    private _handleDeleteTileFromLocation(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        this._getWar().getTileMap().getTile(gridIndex).setHasLocationIdWithLocationIdArray(this.getDataForDeleteTileFromLocation()?.locationIdArray ?? [], false);
    }
    private _handlePasteTile(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const war               = this._getWar();
        const gameConfig        = war.getGcData();
        const unitMap           = war.getUnitMap();
        const srcTileData       = HelpersMisc.getExisted(this.getDataForPasteTile());
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

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);

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
            const symGridIndex = MapEditorModelMeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const newBaseType   = srcBaseType;
                const newObjectType = gameConfig.getSymmetricalTileObjectType(srcObjectType, symmetryType);
                const newTileType   = HelpersMisc.getExisted(gameConfig.getTileType(newBaseType, newObjectType));
                if ((!!gameConfig.getTileTemplateCfg(newTileType)?.getMaxHp()) && (unitMap.getUnitOnMap(symGridIndex))) {
                    return;
                }

                const newTileData = srcTileData.clone();
                newTileData.setGridIndex(symGridIndex.toProto());
                newTileData.setBaseType(newBaseType);
                newTileData.setBaseShapeId(gameConfig.getSymmetricalTileBaseShapeId(srcBaseType, newTileData.getBaseShapeId() ?? 0, symmetryType));
                newTileData.setObjectType(newObjectType);
                newTileData.setObjectShapeId(gameConfig.getSymmetricalTileObjectShapeId(srcObjectType, newTileData.getObjectShapeId() ?? 0, symmetryType));
                newTileData.setDecorationShapeId(gameConfig.getSymmetricalTileDecorationShapeId(newTileData.getDecorationType() ?? 0, newTileData.getDecorationShapeId() ?? 0, symmetryType));
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

                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex: symGridIndex } as NotificationsDataTypes.BwTileChanged);

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
    private _handlePasteUnit(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
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
            return HelpersMisc.getExisted(revisedUnitIdDict.get(rawUnitId));
        };

        const addedUnits: IUnit[] = [];
        for (const rawUnit of this.getDataForPasteUnit() ?? []) {
            const unitData = rawUnit.serialize();
            unitData.setUnitId(getRevisedUnitIdDict(HelpersMisc.getExisted(unitData.getUnitId())));
            unitData.setGridIndex(gridIndex.toProto());

            const rawLoaderUnitId = unitData.getLoaderUnitId();
            if (rawLoaderUnitId != null) {
                unitData.setLoaderUnitId(getRevisedUnitIdDict(rawLoaderUnitId));
            }

            const unit = new (GameHelpersGhFactory.getUnitClass())();
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

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwUnitChanged, { gridIndex } as NotificationsDataTypes.BwUnitChanged);
    }

    private _adjustTile(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void {
        const war               = this._getWar();
        const tileMap           = war.getTileMap();
        const tile              = tileMap.getTile(gridIndex);
        const baseType          = tile.getBaseType();
        const oldBaseShapeId    = tile.getBaseShapeId();
        let newBaseShapeId      = oldBaseShapeId;
        if (baseType === TilesConstantsCommon.BaseTypeId.River) {
            newBaseShapeId = MapEditorModelMeHelpers.getAutoRiverShapeId(tileMap, gridIndex);
        } else if (baseType === TilesConstantsCommon.BaseTypeId.Beach) {
            newBaseShapeId = MapEditorModelMeHelpers.getAutoBeachShapeId(tileMap, gridIndex);
        } else if (baseType === TilesConstantsCommon.BaseTypeId.Sea) {
            newBaseShapeId = MapEditorModelMeHelpers.getAutoSeaShapeId(tileMap, gridIndex);
        }
        tile.setBaseShapeId(newBaseShapeId);

        const objectType        = tile.getObjectType();
        const oldObjectShapeId  = tile.getObjectShapeId();
        let newObjectShapeId    = oldObjectShapeId;
        if (objectType === TilesConstantsCommon.ObjectTypeId.Road) {
            newObjectShapeId = MapEditorModelMeHelpers.getAutoRoadShapeId(tileMap, gridIndex, this.getRoadConnectTileTypeArray());
        } else if (objectType === TilesConstantsCommon.ObjectTypeId.Bridge) {
            newObjectShapeId = MapEditorModelMeHelpers.getAutoBridgeShapeId(tileMap, gridIndex, this.getBridgeConnectTileTypeArray());
        } else if (objectType === TilesConstantsCommon.ObjectTypeId.Plasma) {
            newObjectShapeId = MapEditorModelMeHelpers.getAutoPlasmaShapeId(tileMap, gridIndex);
        } else if (objectType === TilesConstantsCommon.ObjectTypeId.Pipe) {
            newObjectShapeId = MapEditorModelMeHelpers.getAutoPipeShapeId(tileMap, gridIndex);
        }
        tile.setObjectShapeId(newObjectShapeId);

        const oldDecorationType     = tile.getDecorationType();
        const oldDecorationShapeId  = tile.getDecorationShapeId();
        const {
            decorationType  : newDecorationType,
            shapeId         : newDecorationShapeId,
        } = MapEditorModelMeHelpers.getAutoTileDecorationTypeAndShapeId(tileMap, gridIndex);
        tile.setDecorationType(newDecorationType);
        tile.setDecorationShapeId(newDecorationShapeId);

        if ((newBaseShapeId != oldBaseShapeId)              ||
            (newObjectShapeId != oldObjectShapeId)          ||
            (newDecorationType != oldDecorationType)        ||
            (newDecorationShapeId != oldDecorationShapeId)
        ) {
            tile.startRunning(war);
            tile.flushDataToView();

            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileChanged, { gridIndex } as NotificationsDataTypes.BwTileChanged);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public loadNextCheckpoint(): void {
        const arr = this._checkpointArray;
        if (this._currentCheckpointIndex >= arr.length - 1) {
            FloatText2.showLang(LangConstants.TextType.A0319);
        } else {
            this._loadCheckpoint(arr[++this._currentCheckpointIndex]);
        }
    }
    public loadPreviousCheckpoint(): void {
        if (this._currentCheckpointIndex <= 0) {
            FloatText2.showLang(LangConstants.TextType.A0319);
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
            playersCountUnneutral   : PlayersConstants.PlayerIndex.Max,
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

function generateSerialTileForDeleteTileObject(tile: TilesITile.ITile, gcData: GameConfigGcData.GcData): SerialTile {
    const data = tile.serialize();
    data.setPlayerIndex(PlayersConstants.PlayerIndex.Neutral);
    data.setObjectType(TilesConstantsCommon.ObjectTypeId.Empty);
    data.setObjectShapeId(0);
    data.setCustomBuildingData(null);
    data.setCustomCannonData(null);
    data.setCustomCrystalData(null);
    data.setCustomLaserTurretData(null);
    TilesUtilsSerialization.fillNonTrivialDefaultValues(data, gcData);

    return data;
}
