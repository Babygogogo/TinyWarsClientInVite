import {
    type Notifications_Mapping,
    Destructions_Utils,
    GameConfigs_GameConfig,
    FloatText,
    Units_Unit,
    type AuxiliaryTypes_GridIndex,
    Notifications_Dispatcher,
    Tiles_Constants_Common,
    Tiles_Utils_Serialization,
    Units_Utils_Serialization,
    MapEditors_Constants,
    MapEditor_Model_MeHelpers,
    Helpers_Misc,
    Lang_Utils,
    TileBases_Utils,
    TileDecorations_Utils,
    TileObjects_Utils,
    Players_Constants,
    Geometries_Constants,
    Lang_Constants,
    type MapEditor_Model_MeTypes,
    type Egret_Egret,
    type MapEditor_Interface_IMeDrawer,
    type MapEditor_Interface_IMeWar,
    type Tiles_Tile,
    type Notifications_Types,
} from "../../internal.ts";

import type { SerialField } from "../../proto/schema/CommonProto/WarSerialization/SerialField.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

const MaxCheckpointCount            = 1000;
const SymmetricalPlayerIndexArray   = [0, 2, 1, 4, 3, 6, 5, 8, 7];

export class MeDrawer implements MapEditor_Interface_IMeDrawer.IMeDrawer {
    private _war?                               : MapEditor_Interface_IMeWar.IMeWar;
    private _mode                               = MapEditors_Constants.DrawerMode.Preview;
    private _dataForDrawTileObject              : MapEditor_Model_MeTypes.DataForDrawTileObject | null = null;
    private _dataForDrawTileBase                : MapEditor_Model_MeTypes.DataForDrawTileBase | null = null;
    private _dataForDrawTileDecoration          : MapEditor_Model_MeTypes.DataForDrawTileDecoration | null = null;
    private _dataForPasteTile                   : SerialTile | null = null;
    private _dataForPasteUnit                   : Units_Unit.Unit[] | null = null;
    private _drawTargetUnit                     : Units_Unit.Unit | null = null;
    private _dataForAddTileToLocation           : MapEditor_Model_MeTypes.DataForAddTileToLocation | null = null;
    private _dataForDeleteTileFromLocation      : MapEditor_Model_MeTypes.DataForDeleteTileFromLocation | null = null;
    private _symmetricalDrawType                = Geometries_Constants.SymmetryTypeId.None;
    private _isRealTimeAdjust                   = true;
    private _isSymmetricalPlayerIndexEnabled    = true;
    private _roadConnectTileTypeArray           : number[] = [
        Tiles_Constants_Common.TileTypeId.Road,
        Tiles_Constants_Common.TileTypeId.BridgeOnBeach,
        Tiles_Constants_Common.TileTypeId.BridgeOnPlain,
        Tiles_Constants_Common.TileTypeId.BridgeOnRiver,
        Tiles_Constants_Common.TileTypeId.BridgeOnSea,
        Tiles_Constants_Common.TileTypeId.Headquarters,
        Tiles_Constants_Common.TileTypeId.City,
        Tiles_Constants_Common.TileTypeId.CommandTower,
        Tiles_Constants_Common.TileTypeId.Radar,
        Tiles_Constants_Common.TileTypeId.Factory,
        Tiles_Constants_Common.TileTypeId.Airport,
        Tiles_Constants_Common.TileTypeId.Seaport,
        Tiles_Constants_Common.TileTypeId.TempAirport,
        Tiles_Constants_Common.TileTypeId.TempSeaport,
    ];
    private _bridgeConnectTileTypeArray         : number[] = [
        Tiles_Constants_Common.TileTypeId.Road,
        Tiles_Constants_Common.TileTypeId.BridgeOnBeach,
        Tiles_Constants_Common.TileTypeId.BridgeOnPlain,
        Tiles_Constants_Common.TileTypeId.BridgeOnRiver,
        Tiles_Constants_Common.TileTypeId.BridgeOnSea,
        Tiles_Constants_Common.TileTypeId.Headquarters,
        Tiles_Constants_Common.TileTypeId.City,
        Tiles_Constants_Common.TileTypeId.CommandTower,
        Tiles_Constants_Common.TileTypeId.Radar,
        Tiles_Constants_Common.TileTypeId.Factory,
        Tiles_Constants_Common.TileTypeId.Airport,
        Tiles_Constants_Common.TileTypeId.Seaport,
        Tiles_Constants_Common.TileTypeId.TempAirport,
        Tiles_Constants_Common.TileTypeId.TempSeaport,
    ];

    private _checkpointArray                    : SerialField[] = [];
    private _currentCheckpointIndex             = 0;

    private _notifyListeners: Notifications_Types.Listener[] = [
        { type : "BwCursorTapped",     callback : this._onNotifyBwCursorTapped },
        { type : "BwCursorDragged",    callback : this._onNotifyBwCursorDragged },
    ];

    public init(): MapEditor_Interface_IMeDrawer.IMeDrawer {
        return this;
    }

    public startRunning(war: MapEditor_Interface_IMeWar.IMeWar): void {
        this._setWar(war);

        Notifications_Dispatcher.addEventListeners(this._notifyListeners, this);
    }
    public stopRunning(): void {
        delete this._war;

        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);
    }

    private _onNotifyBwCursorTapped(e: Egret_Egret.Event<Notifications_Mapping.Mapping["BwCursorTapped"]>): void {
        const data      = Helpers_Misc.getExisted(e.data);
        const gridIndex = data.tappedOn;
        this._handleAction(gridIndex);
    }
    private _onNotifyBwCursorDragged(e: Egret_Egret.Event<Notifications_Mapping.Mapping["BwCursorDragged"]>): void {
        const data = Helpers_Misc.getExisted(e.data);
        this._handleAction(data.draggedTo);
    }

    private _setWar(war: MapEditor_Interface_IMeWar.IMeWar): void {
        this._war = war;
    }
    private _getWar(): MapEditor_Interface_IMeWar.IMeWar {
        return Helpers_Misc.getExisted(this._war);
    }

    private _setMode(mode: MapEditors_Constants.DrawerMode): void {
        this._mode = mode;
        Notifications_Dispatcher.dispatch("MeDrawerModeChanged");
    }
    public setModeDeleteUnit(): void {
        this._setMode(MapEditors_Constants.DrawerMode.DeleteUnit);
    }
    public setModeDeleteTileDecoration(): void {
        this._setMode(MapEditors_Constants.DrawerMode.DeleteTileDecoration);
    }
    public setModeDeleteTileObject(): void {
        this._setMode(MapEditors_Constants.DrawerMode.DeleteTileObject);
    }
    public setModePreview(): void {
        this._setMode(MapEditors_Constants.DrawerMode.Preview);
    }
    public getMode(): MapEditors_Constants.DrawerMode {
        return this._mode;
    }

    public setModeDrawTileObject(data: MapEditor_Model_MeTypes.DataForDrawTileObject): void {
        this._setDrawTargetTileObjectData(data);
        this._setDrawTargetTileBaseData(null);
        this._setDrawTargetTileDecorationData(null);
        this._setMode(MapEditors_Constants.DrawerMode.DrawTileObject);
    }
    public setModeDrawTileBase(data: MapEditor_Model_MeTypes.DataForDrawTileBase): void {
        this._setDrawTargetTileObjectData(null);
        this._setDrawTargetTileBaseData(data);
        this._setDrawTargetTileDecorationData(null);
        this._setMode(MapEditors_Constants.DrawerMode.DrawTileBase);
    }
    public setModeDrawTileDecoration(data: MapEditor_Model_MeTypes.DataForDrawTileDecoration): void {
        this._setDrawTargetTileObjectData(null);
        this._setDrawTargetTileBaseData(null);
        this._setDrawTargetTileDecorationData(data);
        this._setMode(MapEditors_Constants.DrawerMode.DrawTileDecoration);
    }
    private _setDrawTargetTileObjectData(data: MapEditor_Model_MeTypes.DataForDrawTileObject | null): void {
        this._dataForDrawTileObject = data;
    }
    public getDrawTargetTileObjectData(): MapEditor_Model_MeTypes.DataForDrawTileObject | null {
        return this._dataForDrawTileObject;
    }
    private _setDrawTargetTileBaseData(data: MapEditor_Model_MeTypes.DataForDrawTileBase | null): void {
        this._dataForDrawTileBase = data;
    }
    public getDrawTargetTileBaseData(): MapEditor_Model_MeTypes.DataForDrawTileBase | null {
        return this._dataForDrawTileBase;
    }
    private _setDrawTargetTileDecorationData(data: MapEditor_Model_MeTypes.DataForDrawTileDecoration | null): void {
        this._dataForDrawTileDecoration = data;
    }
    public getDrawTargetTileDecorationData(): MapEditor_Model_MeTypes.DataForDrawTileDecoration | null {
        return this._dataForDrawTileDecoration;
    }
    public setDataForPasteTile(data: SerialTile): void {
        this._dataForPasteTile = data;
    }
    public getDataForPasteTile(): SerialTile | null {
        return this._dataForPasteTile;
    }
    public setDataForPasteUnit(data: Units_Unit.Unit[]): void {
        this._dataForPasteUnit = data;
    }
    public getDataForPasteUnit(): Units_Unit.Unit[] | null {
        return this._dataForPasteUnit;
    }

    public setModeDrawUnit(data: MapEditor_Model_MeTypes.DataForDrawUnit): void {
        const war           = this._getWar();
        const unit          = new Units_Unit.Unit();
        const gameConfig    = war.getGcData();
        unit.init(Units_Utils_Serialization.createDefault({
            gridIndex   : { x : 0, y : 0 },
            unitId      : -1,
            unitTypeId  : data.unitType,
            playerIndex : data.playerIndex,
            gcData      : gameConfig,
        }), gameConfig);
        unit.startRunning(war);

        this._setDrawTargetUnit(unit);
        this._setMode(MapEditors_Constants.DrawerMode.DrawUnit);
    }
    private _setDrawTargetUnit(unit: Units_Unit.Unit): void {
        this._drawTargetUnit = unit;
    }
    public getDrawTargetUnit(): Units_Unit.Unit | null {
        return this._drawTargetUnit;
    }

    public setModeAddTileToLocation(data: MapEditor_Model_MeTypes.DataForAddTileToLocation): void {
        this._setDataForAddTileToLocation(data);
        this._setMode(MapEditors_Constants.DrawerMode.AddTileToLocation);
    }
    private _setDataForAddTileToLocation(data: MapEditor_Model_MeTypes.DataForAddTileToLocation): void {
        this._dataForAddTileToLocation = data;
    }
    public getDataForAddTileToLocation(): MapEditor_Model_MeTypes.DataForAddTileToLocation | null {
        return this._dataForAddTileToLocation;
    }

    public setModeDeleteTileFromLocation(data: MapEditor_Model_MeTypes.DataForDeleteTileFromLocation): void {
        this._setDataForDeleteTileFromLocation(data);
        this._setMode(MapEditors_Constants.DrawerMode.DeleteTileFromLocation);
    }
    private _setDataForDeleteTileFromLocation(data: MapEditor_Model_MeTypes.DataForDeleteTileFromLocation): void {
        this._dataForDeleteTileFromLocation = data;
    }
    public getDataForDeleteTileFromLocation(): MapEditor_Model_MeTypes.DataForDeleteTileFromLocation | null {
        return this._dataForDeleteTileFromLocation;
    }

    public setModePasteTile(): void {
        this._setMode(MapEditors_Constants.DrawerMode.PasteTile);
    }
    public setModePasteUnit(): void {
        this._setMode(MapEditors_Constants.DrawerMode.PasteUnit);
    }

    public getSymmetricalDrawType(): Geometries_Constants.SymmetryTypeId {
        return this._symmetricalDrawType;
    }
    public setSymmetricalDrawType(type: Geometries_Constants.SymmetryTypeId): void {
        this._symmetricalDrawType = type;
    }

    public getSymmetricalPlayerIndex(playerIndex: number): number {
        return Helpers_Misc.getExisted(SymmetricalPlayerIndexArray[playerIndex]);
    }
    public setSymmetricalPlayerIndex(srcPlayerIndex: number, dstPlayerIndex: number): void {
        if (srcPlayerIndex === Players_Constants.PlayerIndex.Neutral) {
            throw Helpers_Misc.newError(`Cannot set symmetrical color for neutral player.`);
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
            Notifications_Dispatcher.dispatch("MeRealTimeAdjustChanged");
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
            if (tileBaseType !== Tiles_Constants_Common.BaseTypeId.River) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditor_Model_MeHelpers.getAutoRiverShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getBaseShapeId()) {
                ++adjustCount;
                tile.setBaseShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
            }
        }

        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0159, adjustCount));
    }
    public autoAdjustBeaches(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const tileBaseType = tile.getBaseType();
            if (tileBaseType !== Tiles_Constants_Common.BaseTypeId.Beach) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditor_Model_MeHelpers.getAutoBeachShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getBaseShapeId()) {
                ++adjustCount;
                tile.setBaseShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
            }
        }

        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0159, adjustCount));
    }
    public autoAdjustSeas(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const tileBaseType = tile.getBaseType();
            if (tileBaseType !== Tiles_Constants_Common.BaseTypeId.Sea) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditor_Model_MeHelpers.getAutoSeaShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getBaseShapeId()) {
                ++adjustCount;
                tile.setBaseShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
            }
        }

        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0159, adjustCount));
    }
    public autoAdjustRoads(connectTileTypeArray: number[]): void {
        this._roadConnectTileTypeArray.length = 0;
        this._roadConnectTileTypeArray.push(...connectTileTypeArray);

        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== Tiles_Constants_Common.ObjectTypeId.Road) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditor_Model_MeHelpers.getAutoRoadShapeId(tileMap, gridIndex, connectTileTypeArray);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
            }
        }

        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0159, adjustCount));
    }
    public autoAdjustBridges(connectTileTypeArray: number[]): void {
        this._bridgeConnectTileTypeArray.length = 0;
        this._bridgeConnectTileTypeArray.push(...connectTileTypeArray);

        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== Tiles_Constants_Common.ObjectTypeId.Bridge) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditor_Model_MeHelpers.getAutoBridgeShapeId(tileMap, gridIndex, connectTileTypeArray);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
            }
        }

        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0159, adjustCount));
    }
    public autoAdjustPlasmas(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== Tiles_Constants_Common.ObjectTypeId.Plasma) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditor_Model_MeHelpers.getAutoPlasmaShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
            }
        }

        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0159, adjustCount));
    }
    public autoAdjustPipes(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            if (tile.getObjectType() !== Tiles_Constants_Common.ObjectTypeId.Pipe) {
                continue;
            }

            const gridIndex = tile.getGridIndex();
            const shapeId   = MapEditor_Model_MeHelpers.getAutoPipeShapeId(tileMap, gridIndex);
            if (shapeId !== tile.getObjectShapeId()) {
                ++adjustCount;
                tile.setObjectShapeId(shapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
            }
        }

        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0159, adjustCount));
    }
    public autoFillTileDecorations(): void {
        const war           = this._getWar();
        const tileMap       = war.getTileMap();
        let adjustCount     = 0;
        for (const tile of tileMap.getAllTiles()) {
            const gridIndex             = tile.getGridIndex();
            const targetDecorationData  = MapEditor_Model_MeHelpers.getAutoTileDecorationTypeAndShapeId(tileMap, gridIndex);
            const decorationType        = targetDecorationData.decorationType;
            const decorationShapeId     = targetDecorationData.shapeId;

            if ((decorationType !== tile.getDecorationType()) || (decorationShapeId !== tile.getDecorationShapeId())) {
                ++adjustCount;
                tile.setDecorationType(decorationType);
                tile.setDecorationShapeId(decorationShapeId);
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
            }
        }

        FloatText.show(Lang_Utils.getFormattedText(Lang_Constants.TextType.F0159, adjustCount));
    }

    private _handleAction(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const mode = this.getMode();
        if (mode === MapEditors_Constants.DrawerMode.DrawTileBase) {
            this._addCheckpoint();
            this._handleDrawTileBase(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.DrawTileDecoration) {
            this._addCheckpoint();
            this._handleDrawTileDecoration(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.DrawTileObject) {
            this._addCheckpoint();
            this._handleDrawTileObject(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.DrawUnit) {
            this._addCheckpoint();
            this._handleDrawUnit(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.DeleteTileDecoration) {
            this._addCheckpoint();
            this._handleDeleteTileDecoration(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.DeleteTileObject) {
            this._addCheckpoint();
            this._handleDeleteTileObject(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.DeleteUnit) {
            this._addCheckpoint();
            this._handleDeleteUnit(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.AddTileToLocation) {
            this._addCheckpoint();
            this._handleAddTileToLocation(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.DeleteTileFromLocation) {
            this._addCheckpoint();
            this._handleDeleteTileFromLocation(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.Preview) {
            // nothing to do

        } else if (mode === MapEditors_Constants.DrawerMode.PasteTile) {
            this._addCheckpoint();
            this._handlePasteTile(gridIndex);

        } else if (mode === MapEditors_Constants.DrawerMode.PasteUnit) {
            this._addCheckpoint();
            this._handlePasteUnit(gridIndex);

        } else {
            throw Helpers_Misc.newError(`MeDrawer._handleAction() invalid mode.`);
        }

        this._getWar().setIsMapModified(true);
    }
    private _handleDrawTileBase(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const war               = this._getWar();
        const tileMap           = war.getTileMap();
        const targetBaseData    = Helpers_Misc.getExisted(this.getDrawTargetTileBaseData());
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
                const data = Tiles_Utils_Serialization.create({
                    gridIndex              : tile.getGridIndex().toProto().toJson(),
                    playerIndex            : tile.getPlayerIndex(),
                    objectType             : objectType,
                    objectShapeId          : tile.getObjectShapeId(),
                    decorationType         : tile.getDecorationType(),
                    decorationShapeId      : tile.getDecorationShapeId(),
                    baseType               : baseType,
                    baseShapeId            : baseShapeId,
                    groupedLocationIdArray : tile.getGroupedLocationIdArray(),
                    isHighlighted          : tile.getIsHighlighted(),
                    unfixedBuffArray       : tile.getUnfixedBuffList().map(v => v.toJson()),
                    customNameId           : tile.getCustomNameId() ?? null,

                    currentBuildPoint   : null,
                    currentCapturePoint : null,
                    currentHp           : null,

                    customBuildingData    : null,
                    customCannonData      : null,
                    customCrystalData     : null,
                    customLaserTurretData : null,
                });
                Tiles_Utils_Serialization.fillNonTrivialDefaultValues(data, gameConfig);

                tile.init(data, gameConfig);
            }
            tile.startRunning(war);
            tile.flushDataToView();

            Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });

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
            const symGridIndex = MapEditor_Model_MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile          = tileMap.getTile(symGridIndex);
                const objectType    = tile.getObjectType();
                const baseShapeId2  = TileBases_Utils.getSymmetricalTileBaseShapeId(baseType, baseShapeId, symmetryType) ?? 0;
                if (tile.getTileTypeId() === gameConfig.getTileType(baseType, objectType)) {
                    tile.setBaseType(baseType);
                    tile.setBaseShapeId(baseShapeId2);
                } else {
                    const data = Tiles_Utils_Serialization.create({
                        gridIndex              : tile.getGridIndex().toProto().toJson(),
                        playerIndex            : tile.getPlayerIndex(),
                        objectType             : objectType,
                        objectShapeId          : tile.getObjectShapeId(),
                        decorationType         : tile.getDecorationType(),
                        decorationShapeId      : tile.getDecorationShapeId(),
                        baseType               : baseType,
                        baseShapeId            : baseShapeId2,
                        groupedLocationIdArray : tile.getGroupedLocationIdArray(),
                        isHighlighted          : tile.getIsHighlighted(),
                        unfixedBuffArray       : tile.getUnfixedBuffList().map(v => v.toJson()),
                        customNameId           : tile.getCustomNameId() ?? null,

                        currentBuildPoint   : null,
                        currentCapturePoint : null,
                        currentHp           : null,

                        customBuildingData    : null,
                        customCannonData      : null,
                        customCrystalData     : null,
                        customLaserTurretData : null,
                    });
                    Tiles_Utils_Serialization.fillNonTrivialDefaultValues(data, gameConfig);

                    tile.init(data, gameConfig);
                }
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex : symGridIndex });

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
    private _handleDrawTileDecoration(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const war                   = this._getWar();
        const tileMap               = war.getTileMap();
        const targetDecorationData  = Helpers_Misc.getExisted(this.getDrawTargetTileDecorationData());
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

            Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });

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
            const symGridIndex = MapEditor_Model_MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, mapSize);
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile = tileMap.getTile(symGridIndex);
                tile.setDecorationType(decorationType);
                tile.setDecorationShapeId(TileDecorations_Utils.getSymmetricalTileDecorationShapeId(decorationType, decorationShapeId, symmetryType) ?? 0);
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex : symGridIndex });

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
    private _handleDrawTileObject(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const war               = this._getWar();
        const gameConfig        = war.getGcData();
        const tileMap           = war.getTileMap();
        const unitMap           = war.getUnitMap();
        const targetObjectData  = Helpers_Misc.getExisted(this.getDrawTargetTileObjectData());
        const objectType        = targetObjectData.objectType;
        const playerIndex       = targetObjectData.playerIndex;
        const objectShapeId     = targetObjectData.shapeId;
        const isRealTileAdjust  = this.getIsRealTimeAdjust();
        const mapSize           = tileMap.getMapSize();

        {
            const tile      = tileMap.getTile(gridIndex);
            const baseType  = tile.getBaseType();
            const tileType  = Helpers_Misc.getExisted(gameConfig.getTileType(baseType, objectType));
            if (tileType === tile.getTileTypeId()) {
                tile.setPlayerIndex(playerIndex);
                tile.setObjectType(objectType);
                tile.setObjectShapeId(objectShapeId);
            } else {
                const data = Tiles_Utils_Serialization.create({
                    gridIndex              : tile.getGridIndex().toProto().toJson(),
                    baseType               : baseType,
                    baseShapeId            : tile.getBaseShapeId(),
                    decorationType         : tile.getDecorationType(),
                    decorationShapeId      : tile.getDecorationShapeId(),
                    playerIndex            : playerIndex,
                    objectType             : objectType,
                    objectShapeId          : objectShapeId,
                    groupedLocationIdArray : tile.getGroupedLocationIdArray(),
                    isHighlighted          : tile.getIsHighlighted(),
                    unfixedBuffArray       : tile.getUnfixedBuffList().map(v => v.toJson()),
                    customNameId           : tile.getCustomNameId() ?? null,

                    currentBuildPoint   : null,
                    currentCapturePoint : null,
                    currentHp           : null,

                    customBuildingData    : null,
                    customCannonData      : null,
                    customCrystalData     : null,
                    customLaserTurretData : null,
                });
                Tiles_Utils_Serialization.fillNonTrivialDefaultValues(data, gameConfig);

                tile.init(data, gameConfig);
            }
            tile.startRunning(war);
            tile.flushDataToView();

            Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });

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
            const symGridIndex  = MapEditor_Model_MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile          = tileMap.getTile(symGridIndex);
                const baseType      = tile.getBaseType();
                const objectType2   = TileObjects_Utils.getSymmetricalTileObjectType(objectType, symmetryType);
                const tileType      = Helpers_Misc.getExisted(gameConfig.getTileType(baseType, objectType2));
                if ((!!gameConfig.getTileTemplateCfg(tileType)?.getMaxHp()) && (unitMap.getUnitOnMap(symGridIndex))) {
                    return;
                }

                const objectShapeId2    = TileObjects_Utils.getSymmetricalTileObjectShapeId(objectType, objectShapeId, symmetryType);
                const playerIndex2      = this.getIsSymmetricalPlayerIndexEnabled() ? this.getSymmetricalPlayerIndex(playerIndex) : playerIndex;
                if (tileType === tile.getTileTypeId()) {
                    tile.setPlayerIndex(playerIndex2);
                    tile.setObjectType(objectType2);
                    tile.setObjectShapeId(objectShapeId2 ?? 0);
                } else {
                    const data = Tiles_Utils_Serialization.create({
                        gridIndex              : tile.getGridIndex().toProto().toJson(),
                        baseType               : tile.getBaseType(),
                        baseShapeId            : tile.getBaseShapeId(),
                        decorationType         : tile.getDecorationType(),
                        decorationShapeId      : tile.getDecorationShapeId(),
                        playerIndex            : playerIndex2,
                        objectType             : objectType2,
                        objectShapeId          : objectShapeId2 ?? 0,
                        groupedLocationIdArray : tile.getGroupedLocationIdArray(),
                        isHighlighted          : tile.getIsHighlighted(),
                        unfixedBuffArray       : tile.getUnfixedBuffList().map(v => v.toJson()),
                        customNameId           : tile.getCustomNameId() ?? null,

                        currentBuildPoint   : null,
                        currentCapturePoint : null,
                        currentHp           : null,

                        customBuildingData    : null,
                        customCannonData      : null,
                        customCrystalData     : null,
                        customLaserTurretData : null,
                    });
                    Tiles_Utils_Serialization.fillNonTrivialDefaultValues(data, gameConfig);

                    tile.init(data, gameConfig);
                }
                tile.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex : symGridIndex });

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
    private _handleDrawUnit(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._handleDeleteUnit(gridIndex);

        const war           = this._getWar();
        const gameConfig    = war.getGcData();
        const unitMap       = war.getUnitMap();
        const unitId        = unitMap.getNextUnitId();
        const targetUnit    = Helpers_Misc.getExisted(this.getDrawTargetUnit());
        const unit          = new Units_Unit.Unit();
        unit.init(Units_Utils_Serialization.createDefault({
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

        Notifications_Dispatcher.dispatch("BwUnitChanged", { gridIndex });
    }
    private _handleDeleteTileDecoration(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const tileMap   = this._getWar().getTileMap();
        const tile      = tileMap.getTile(gridIndex);
        tile.deleteTileDecoration();
        tile.flushDataToView();

        Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });

        const symmetryType = this.getSymmetricalDrawType();
        const symGridIndex = MapEditor_Model_MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
        if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
            const t2 = tileMap.getTile(symGridIndex);
            t2.deleteTileDecoration();
            t2.flushDataToView();

            Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex : symGridIndex });
        }
    }
    private _handleDeleteTileObject(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const war       = this._getWar();
        const gcData    = war.getGcData();
        const tileMap   = war.getTileMap();

        {
            const tile = tileMap.getTile(gridIndex);
            tile.init(generateSerialTileForDeleteTileObject(tile, gcData), gcData);
            this.startRunning(war);
            tile.flushDataToView();

            Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
        }

        {
            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MapEditor_Model_MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const tile = tileMap.getTile(symGridIndex);
                tile.init(generateSerialTileForDeleteTileObject(tile, gcData), gcData);
                this.startRunning(war);
                tile.flushDataToView();

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex : symGridIndex });
            }
        }
    }
    private _handleDeleteUnit(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const unit = this._getWar().getUnitMap().getUnitOnMap(gridIndex);
        if (unit) {
            const war = this._getWar();
            Destructions_Utils.destroyUnitOnMap(war, gridIndex, true);
            if (unit.getIsCoOnboard()) {
                war.getTileMap().getView().updateCoZone();
            }

            Notifications_Dispatcher.dispatch("BwUnitChanged", { gridIndex });
        }
    }
    private _handleAddTileToLocation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._getWar().getTileMap().getTile(gridIndex).setHasLocationIdWithLocationIdArray(this.getDataForAddTileToLocation()?.locationIdArray ?? [], true);
    }
    private _handleDeleteTileFromLocation(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        this._getWar().getTileMap().getTile(gridIndex).setHasLocationIdWithLocationIdArray(this.getDataForDeleteTileFromLocation()?.locationIdArray ?? [], false);
    }
    private _handlePasteTile(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const war               = this._getWar();
        const gameConfig        = war.getGcData();
        const unitMap           = war.getUnitMap();
        const srcTileData       = Helpers_Misc.getExisted(this.getDataForPasteTile());
        const srcBaseType       = srcTileData.getBaseType();
        const srcObjectType     = srcTileData.getObjectType();
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

            Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });

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
            const symGridIndex = MapEditor_Model_MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!symGridIndex.checkIsEqual(gridIndex))) {
                const newBaseType   = srcBaseType;
                const newObjectType = TileObjects_Utils.getSymmetricalTileObjectType(srcObjectType, symmetryType);
                const newTileType   = Helpers_Misc.getExisted(gameConfig.getTileType(newBaseType, newObjectType));
                if ((!!gameConfig.getTileTemplateCfg(newTileType)?.getMaxHp()) && (unitMap.getUnitOnMap(symGridIndex))) {
                    return;
                }

                const newTileData = srcTileData.clone();
                newTileData.setGridIndex(symGridIndex.toProto());
                newTileData.setBaseType(newBaseType);
                newTileData.setBaseShapeId(TileBases_Utils.getSymmetricalTileBaseShapeId(srcBaseType, newTileData.getBaseShapeId(), symmetryType));
                newTileData.setObjectType(newObjectType);
                newTileData.setObjectShapeId(TileObjects_Utils.getSymmetricalTileObjectShapeId(srcObjectType, newTileData.getObjectShapeId(), symmetryType));
                newTileData.setDecorationShapeId(TileDecorations_Utils.getSymmetricalTileDecorationShapeId(newTileData.getDecorationType(), newTileData.getDecorationShapeId(), symmetryType));
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

                Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex : symGridIndex });

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
    private _handlePasteUnit(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
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
            return Helpers_Misc.getExisted(revisedUnitIdDict.get(rawUnitId));
        };

        const addedUnits: Units_Unit.Unit[] = [];
        for (const rawUnit of this.getDataForPasteUnit() ?? []) {
            const unitData = rawUnit.serialize();
            unitData.setUnitId(getRevisedUnitIdDict(unitData.getUnitId()));
            unitData.setGridIndex(gridIndex.toProto());

            const rawLoaderUnitId = unitData.getLoaderUnitId();
            if (rawLoaderUnitId != null) {
                unitData.setLoaderUnitId(getRevisedUnitIdDict(rawLoaderUnitId));
            }

            const unit = new Units_Unit.Unit();
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

        Notifications_Dispatcher.dispatch("BwUnitChanged", { gridIndex });
    }

    private _adjustTile(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void {
        const war               = this._getWar();
        const tileMap           = war.getTileMap();
        const tile              = tileMap.getTile(gridIndex);
        const baseType          = tile.getBaseType();
        const oldBaseShapeId    = tile.getBaseShapeId();
        let newBaseShapeId      = oldBaseShapeId;
        if (baseType === Tiles_Constants_Common.BaseTypeId.River) {
            newBaseShapeId = MapEditor_Model_MeHelpers.getAutoRiverShapeId(tileMap, gridIndex);
        } else if (baseType === Tiles_Constants_Common.BaseTypeId.Beach) {
            newBaseShapeId = MapEditor_Model_MeHelpers.getAutoBeachShapeId(tileMap, gridIndex);
        } else if (baseType === Tiles_Constants_Common.BaseTypeId.Sea) {
            newBaseShapeId = MapEditor_Model_MeHelpers.getAutoSeaShapeId(tileMap, gridIndex);
        }
        tile.setBaseShapeId(newBaseShapeId);

        const objectType        = tile.getObjectType();
        const oldObjectShapeId  = tile.getObjectShapeId();
        let newObjectShapeId    = oldObjectShapeId;
        if (objectType === Tiles_Constants_Common.ObjectTypeId.Road) {
            newObjectShapeId = MapEditor_Model_MeHelpers.getAutoRoadShapeId(tileMap, gridIndex, this.getRoadConnectTileTypeArray());
        } else if (objectType === Tiles_Constants_Common.ObjectTypeId.Bridge) {
            newObjectShapeId = MapEditor_Model_MeHelpers.getAutoBridgeShapeId(tileMap, gridIndex, this.getBridgeConnectTileTypeArray());
        } else if (objectType === Tiles_Constants_Common.ObjectTypeId.Plasma) {
            newObjectShapeId = MapEditor_Model_MeHelpers.getAutoPlasmaShapeId(tileMap, gridIndex);
        } else if (objectType === Tiles_Constants_Common.ObjectTypeId.Pipe) {
            newObjectShapeId = MapEditor_Model_MeHelpers.getAutoPipeShapeId(tileMap, gridIndex);
        }
        tile.setObjectShapeId(newObjectShapeId);

        const oldDecorationType     = tile.getDecorationType();
        const oldDecorationShapeId  = tile.getDecorationShapeId();
        const {
            decorationType  : newDecorationType,
            shapeId         : newDecorationShapeId,
        } = MapEditor_Model_MeHelpers.getAutoTileDecorationTypeAndShapeId(tileMap, gridIndex);
        tile.setDecorationType(newDecorationType);
        tile.setDecorationShapeId(newDecorationShapeId);

        if ((newBaseShapeId != oldBaseShapeId)              ||
            (newObjectShapeId != oldObjectShapeId)          ||
            (newDecorationType != oldDecorationType)        ||
            (newDecorationShapeId != oldDecorationShapeId)
        ) {
            tile.startRunning(war);
            tile.flushDataToView();

            Notifications_Dispatcher.dispatch("BwTileChanged", { gridIndex });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public loadNextCheckpoint(): void {
        const arr = this._checkpointArray;
        if (this._currentCheckpointIndex >= arr.length - 1) {
            FloatText.showLang(Lang_Constants.TextType.A0319);
        } else {
            this._loadCheckpoint(arr[++this._currentCheckpointIndex]);
        }
    }
    public loadPreviousCheckpoint(): void {
        if (this._currentCheckpointIndex <= 0) {
            FloatText.showLang(Lang_Constants.TextType.A0319);
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
            data                  : data,
            gameConfig            : war.getGcData(),
            playersCountUnneutral : Players_Constants.PlayerIndex.Max,
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

function generateSerialTileForDeleteTileObject(tile: Tiles_Tile.Tile, gcData: GameConfigs_GameConfig.GameConfig): SerialTile {
    const data = tile.serialize();
    data.setPlayerIndex(Players_Constants.PlayerIndex.Neutral);
    data.setObjectType(Tiles_Constants_Common.ObjectTypeId.Empty);
    data.setObjectShapeId(0);
    data.setCustomBuildingData(null);
    data.setCustomCannonData(null);
    data.setCustomCrystalData(null);
    data.setCustomLaserTurretData(null);
    Tiles_Utils_Serialization.fillNonTrivialDefaultValues(data, gcData);

    return data;
}
