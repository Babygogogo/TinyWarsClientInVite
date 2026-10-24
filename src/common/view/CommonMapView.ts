import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import * as CampaignsMainsProvider from "../../campaigns/mains/Provider.ts";
import * as CommonModelCommonModel from "../model/CommonModel.ts";
import * as ForceSkinsConstants from "../../forceSkins/Constants.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GraphicsUtils from "../../graphics/Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as NotificationsTypes from "../../notifications/Types.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayer from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import * as UiComponentsUiContainer from "../../ui/components/UiContainer.ts";
import * as UiComponentsUiContainerBase from "../../ui/components/UiContainerBase.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiUnitView from "../../ui/interfaces/IUiUnitView.ts";
import * as UiTypesUiCommonEventType from "../../ui/types/UiCommonEventType.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type MapRawData             = ProtoSchemaCommonProtoMapMapRawData.MapRawData;
type SerialWar              = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type SerialTile             = ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile;
type SerialPlayer           = ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer;

const getGridWidth  = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);

export class CommonMapView extends UiComponentsUiContainerBase.UiContainerBase {
    private readonly _tileMapView   = new TileMapView();
    private readonly _unitMapView   = new WarMapUnitMapView();

    public constructor() {
        super();

        this.addChild(this._tileMapView);
        this.addChild(this._unitMapView);

        this.setIsTouchChildrenEnabled(false);
    }

    public showMapByMapData({ mapRawData, gameConfig, overridingPlayers }: {
        mapRawData          : MapRawData;
        gameConfig          : GameConfigGcData.GcData;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>;
    }): void {
        this.setUnscaledManualWidth(getGridWidth()  * HelpersMisc.getExisted(mapRawData.getMapWidth()));
        this.setUnscaledManualHeight(getGridHeight() * HelpersMisc.getExisted(mapRawData.getMapHeight()));
        this._tileMapView.showTileMap(gameConfig, mapRawData.getTileDataArray(), overridingPlayers);
        this._unitMapView.showUnitMap({
            unitDataArray   : mapRawData.getUnitDataArray(),
            players         : overridingPlayers,
            gameConfig      : gameConfig,
        });
    }
    public async showMapByWarData({ warData, showInitialWarData, overridingPlayers }: {
        warData             : SerialWar;
        showInitialWarData  : boolean;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>;
    }): Promise<void> {
        if (!showInitialWarData) {
            await this._showMapByWarData(warData, overridingPlayers);
            return;
        }

        {
            const settingsForSfw = warData.getSettingsForSfw();
            if (settingsForSfw) {
                await this._showMapByWarData(settingsForSfw.getInitialWarData() ?? warData, overridingPlayers);
                return;
            }
        }

        {
            const settingsForMfw = warData.getSettingsForMfw();
            if (settingsForMfw) {
                await this._showMapByWarData(settingsForMfw.getInitialWarData() ?? warData, overridingPlayers);
                return;
            }
        }

        const gameConfig = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(warData.getSettingsForCommon()?.getConfigVersion()));
        {
            const settingsForCaw = warData.getSettingsForCaw();
            if (settingsForCaw) {
                const mapRawData = HelpersMisc.getExisted(await CampaignsMainsProvider.getCampaignMapRawData(settingsForCaw.getCampaignId() ?? 0, settingsForCaw.getCampaignMapId() ?? 0));
                if ((mapRawData.getCampaignMapData()?.getRevision() ?? 0) === (settingsForCaw.getCampaignMapRevision() ?? 0)) {
                    this.showMapByMapData({
                        mapRawData  : mapRawData,
                        gameConfig  : gameConfig,
                        overridingPlayers     : overridingPlayers,
                    });
                } else {
                    this.clear();
                }

                return;
            }
        }

        {
            const normalMapId = HelpersProtoSchemaWarSerializationSerialWar.getNormalMapId(warData);
            if (normalMapId != null) {
                this.showMapByMapData({
                    mapRawData  : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                    gameConfig  : gameConfig,
                    overridingPlayers     : overridingPlayers,
                });
                return;
            }
        }

        await this._showMapByWarData(warData, overridingPlayers);
    }
    private async _showMapByWarData(warData: SerialWar, overridingPlayers: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>): Promise<void> {
        const gameConfig    = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(warData.getSettingsForCommon()?.getConfigVersion()));
        const field         = HelpersMisc.getExisted(warData.getField());
        const tileMap       = HelpersMisc.getExisted(field.getTileMap());
        const mapSize       = AuxiliaryTypesMapSize.MapSize.createWithSerialTileMap(tileMap);
        this.setUnscaledManualWidth(getGridWidth() * mapSize.getWidth());
        this.setUnscaledManualHeight(getGridHeight() * mapSize.getHeight());

        overridingPlayers ??= HelpersMisc.getExisted(warData.getPlayerManager()?.getPlayers());
        this._tileMapView.showTileMap(gameConfig, tileMap.getTiles(), overridingPlayers);
        this._unitMapView.showUnitMap({
            unitDataArray   : field.getUnitMap()?.getUnits() ?? [],
            players         : overridingPlayers,
            gameConfig      : gameConfig,
        });
    }

    public clear(): void {
        this._tileMapView.clear();
        this._unitMapView.clear();
    }
}

class TileMapView extends UiComponentsUiContainer.UiContainer {
    private readonly _borderLayer           = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _imgCornerUL           = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedCorner0000` });
    private readonly _imgCornerUR           = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedCorner0001` });
    private readonly _imgCornerDR           = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedCorner0002` });
    private readonly _imgCornerDL           = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedCorner0003` });
    private readonly _imgBorderU            = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedBorder0000` });
    private readonly _imgBorderR            = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedBorder0001` });
    private readonly _imgBorderD            = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedBorder0002` });
    private readonly _imgBorderL            = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedBorder0003` });

    private readonly _baseLayer             = new TileBaseLayer();
    private readonly _decorationLayer       = new TileDecorationLayer();
    private readonly _gridBorderLayer       = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _objectLayer           = new TileObjectLayer();

    private readonly _notifyListenerArray   : NotificationsTypes.Listener[] = [
        { type: NotificationsTypeId.TypeId.TileAnimationTick,                   callback: this._onNotifyTileAnimationTick },
        { type: NotificationsTypeId.TypeId.UserSettingsIsShowGridBorderChanged, callback: this._onNotifyIsShowGridBorderChanged },
    ];

    public constructor() {
        super();

        this._initBorderLayer();
        this._gridBorderLayer.setAlpha(0.3);
        this.addUiChild(this._baseLayer);
        this.addUiChild(this._decorationLayer);
        this.addUiChild(this._gridBorderLayer);
        this.addUiChild(this._objectLayer);

        {
            const agent = this.getEventAgent();
            agent.addUiCommonEventListener(UiTypesUiCommonEventType.UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            agent.addUiCommonEventListener(UiTypesUiCommonEventType.UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
    }

    public showTileMap(gameConfig: GameConfigGcData.GcData, dataList: SerialTile[], players?: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>): void {
        this._baseLayer.updateWithTileDataList(gameConfig, dataList, players);
        this._decorationLayer.updateWithTileDataList(gameConfig, dataList, players);
        this._objectLayer.updateWithTileDataList(gameConfig, dataList, players);
        this._resetGridBorderLayer(dataList);
        this._updateBorderLayer(dataList);
    }
    public clear(): void {
        this._baseLayer.clear();
        this._decorationLayer.clear();
        this._objectLayer.clear();
        this._resetGridBorderLayer([]);
        this._updateBorderLayer([]);
    }

    private _onAddedToStage(): void {
        NotificationsDispatcher.addEventListeners(this._notifyListenerArray, this);
    }
    private _onRemovedFromStage(): void {
        NotificationsDispatcher.removeEventListeners(this._notifyListenerArray, this);
    }
    private _onNotifyTileAnimationTick(): void {
        this._baseLayer.updateViewOnTick();
        this._decorationLayer.updateViewOnTick();
        this._objectLayer.updateViewOnTick();
    }

    private _onNotifyIsShowGridBorderChanged(): void {
        this._updateGridBorderLayerVisible();
    }

    private _resetGridBorderLayer(tileDataArray: SerialTile[]): void {
        const { width: mapWidth, height: mapHeight }    = AuxiliaryTypesMapSize.MapSize.createWithTileArray(tileDataArray).getWH();
        const borderWidth                               = mapWidth * getGridWidth();
        const borderHeight                              = mapHeight * getGridHeight();
        const gridBorderLayer                           = this._gridBorderLayer;
        gridBorderLayer.removeUiChildren();
        for (let x = 1; x < mapWidth; ++x) {
            const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedColorBlack0000` });
            img.setIsSmoothing(false);
            img.setUnscaledManualWidth(1);
            img.setUnscaledManualHeight(borderHeight);
            img.setX((x * getGridWidth()) - 0.5);
            gridBorderLayer.addUiChild(img);
        }
        for (let y = 1; y < mapHeight; ++y) {
            const img = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedColorBlack0000` });
            img.setIsSmoothing(false);
            img.setUnscaledManualWidth(borderWidth);
            img.setUnscaledManualHeight(1);
            img.setY((y * getGridHeight()) - 0.5);
            gridBorderLayer.addUiChild(img);
        }
        this._updateGridBorderLayerVisible();
    }
    private _updateGridBorderLayerVisible(): void {
        this._gridBorderLayer.setIsVisible(UsersModel.getSelfSettingsIsShowGridBorder());
    }

    private _initBorderLayer(): void {
        const borderLayer       = this._borderLayer;
        const imgCornerUL       = this._imgCornerUL;
        const imgCornerUR       = this._imgCornerUR;
        const imgCornerDL       = this._imgCornerDL;
        const imgCornerDR       = this._imgCornerDR;
        const imgBorderU        = this._imgBorderU;
        const imgBorderD        = this._imgBorderD;
        const imgBorderL        = this._imgBorderL;
        const imgBorderR        = this._imgBorderR;
        imgCornerUL.setIsSmoothing(false);
        imgCornerUR.setIsSmoothing(false);
        imgCornerDL.setIsSmoothing(false);
        imgCornerDR.setIsSmoothing(false);
        imgBorderU.setIsSmoothing(false);
        imgBorderD.setIsSmoothing(false);
        imgBorderL.setIsSmoothing(false);
        imgBorderR.setIsSmoothing(false);
        borderLayer.addUiChild(imgBorderU);
        borderLayer.addUiChild(imgBorderD);
        borderLayer.addUiChild(imgBorderL);
        borderLayer.addUiChild(imgBorderR);
        borderLayer.addUiChild(imgCornerUL);
        borderLayer.addUiChild(imgCornerUR);
        borderLayer.addUiChild(imgCornerDL);
        borderLayer.addUiChild(imgCornerDR);
        this.addUiChild(borderLayer);
    }

    private _updateBorderLayer(tileDataArray: SerialTile[]): void {
        const mapSize           = AuxiliaryTypesMapSize.MapSize.createWithTileArray(tileDataArray);
        const horizontalPixels  = mapSize.getWidth() * getGridWidth();
        const verticalPixels    = mapSize.getHeight() * getGridHeight();
        const layer             = this._borderLayer;
        if ((horizontalPixels <= 0) || (verticalPixels <= 0)) {
            layer.setIsVisible(false);
            return;
        }

        layer.setIsVisible(true);

        {
            const imgCornerUL   = this._imgCornerUL;
            imgCornerUL.setX(-4);
            imgCornerUL.setY(-4);
        }

        {
            const imgCornerUR   = this._imgCornerUR;
            imgCornerUR.setX(horizontalPixels);
            imgCornerUR.setY(-4);
        }

        {
            const imgCornerDR   = this._imgCornerDR;
            imgCornerDR.setX(horizontalPixels);
            imgCornerDR.setY(verticalPixels);
        }

        {
            const imgCornerDL   = this._imgCornerDL;
            imgCornerDL.setX(-4);
            imgCornerDL.setY(verticalPixels);
        }

        {
            const imgBorderU    = this._imgBorderU;
            imgBorderU.setX(-1);
            imgBorderU.setY(-4);
            imgBorderU.setUnscaledManualWidth(horizontalPixels + 2);
        }

        {
            const imgBorderR    = this._imgBorderR;
            imgBorderR.setX(horizontalPixels);
            imgBorderR.setY(-1);
            imgBorderR.setUnscaledManualHeight(verticalPixels + 2);
        }

        {
            const imgBorderD    = this._imgBorderD;
            imgBorderD.setX(-1);
            imgBorderD.setY(verticalPixels);
            imgBorderD.setUnscaledManualWidth(horizontalPixels + 2);
        }

        {
            const imgBorderL    = this._imgBorderL;
            imgBorderL.setX(-4);
            imgBorderL.setY(-1);
            imgBorderL.setUnscaledManualHeight(verticalPixels + 2);
        }
    }
}

abstract class TileLayerBase extends UiComponentsUiContainer.UiContainer {
    private _gameConfig             : GameConfigGcData.GcData | null = null;
    private readonly _tileDataMap   : AuxiliaryTypesAuxiliaryTypes.WarMapTileViewData[][] = [];
    private readonly _imageMap      : UiInterfacesIUiImage.IUiImage[][] = [];

    public updateWithTileDataList(gameConfig: GameConfigGcData.GcData, tileDataArray: SerialTile[], players?: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>): void {
        const mapSize       = AuxiliaryTypesMapSize.MapSize.createWithTileArray(tileDataArray);
        this._gameConfig    = gameConfig;
        this._resetTileDataMap(mapSize, tileDataArray, players);
        this._resetImageMap(mapSize);

        this.updateViewOnTick();
    }

    public updateViewOnTick(): void {
        const gameConfig = this._gameConfig;
        if (gameConfig == null) {
            return;
        }

        const imageMap      = this._imageMap;
        const tileDataMap   = this._tileDataMap;
        const width         = tileDataMap.length;
        const height        = width > 0 ? tileDataMap[0].length : 0;
        const tickCount     = CommonModelCommonModel.getTileAnimationTickCount();
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                imageMap[x][y].loadSource(this._getImageSource(gameConfig, tileDataMap[x][y], tickCount));
            }
        }
    }

    public clear(): void {
        const mapSize       = new AuxiliaryTypesMapSize.MapSize(0, 0);
        this._gameConfig    = null;
        this._resetTileDataMap(mapSize, [], []);
        this._resetImageMap(mapSize);
    }

    private _resetTileDataMap(mapSize: AuxiliaryTypesMapSize.MapSize, tileDataArray: SerialTile[], players?: AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>): void {
        const map       = this._tileDataMap;
        const width     = mapSize.getWidth();
        const height    = mapSize.getHeight();
        map.length      = width;
        for (let x = 0; x < width; ++x) {
            if (map[x] == null) {
                map[x] = [];
            }

            const column    = map[x];
            column.length   = height;
        }

        for (const rawTileData of tileDataArray) {
            const tileData                          = rawTileData.clone() as AuxiliaryTypesAuxiliaryTypes.WarMapTileViewData;
            const gridIndex                         = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()));
            const player                            = players?.find(v => v.getPlayerIndex() === tileData.getPlayerIndex());
            tileData.skinId                         = player ? player.getUnitAndTileSkinId() : null;
            map[gridIndex.getX()][gridIndex.getY()] = tileData;
        }
    }
    private _resetImageMap(mapSize: AuxiliaryTypesMapSize.MapSize): void {
        const map       = this._imageMap;
        const width     = mapSize.getWidth();
        const height    = mapSize.getHeight();
        for (let x = width; x < map.length; ++x) {
            for (const img of map[x] || []) {
                img?.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject);
            }
        }
        map.length = width;

        for (let x = 0; x < width; ++x) {
            if (map[x] == null) {
                map[x] = [];
            }

            const column = map[x];
            for (let y = height; y < column.length; ++y) {
                const img = column[y];
                img?.getParent()?.removeChild(img as unknown as VendorEgretEgret.DisplayObject);
            }
            column.length = height;

            for (let y = 0; y < height; ++y) {
                if (column[y] == null) {
                    const img = new (UiUtilsUiFactory.getUiImageClass())();
                    img.setIsSmoothing(false);
                    img.setX(getGridWidth() * x);
                    img.setY(this._getImageY(y));
                    column[y] = img;
                    this.addUiChild(img);
                }
            }
        }
    }

    protected abstract _getImageSource(gameConfig: GameConfigGcData.GcData, tileData: AuxiliaryTypesAuxiliaryTypes.WarMapTileViewData, tickCount: number): string;
    protected abstract _getImageY(gridY: number): number;
}

class TileBaseLayer extends TileLayerBase {
    protected _getImageSource(gameConfig: GameConfigGcData.GcData, tileData: SerialTile, tickCount: number): string {
        return tileData == null
            ? ``
            : CommonModelCommonModel.getCachedTileBaseImageSource({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                themeType   : TilesConstantsCommon.ThemeTypeId.Normal,
                baseType    : tileData.getBaseType() ?? 0,
                shapeId     : tileData.getBaseShapeId() ?? 0,
                isDark      : false,
                skinId      : ForceSkinsConstants.SkinId.Neutral,
                tickCount,
            });
    }

    protected _getImageY(gridY: number): number {
        return getGridHeight() * gridY;
    }
}

class TileDecorationLayer extends TileLayerBase {
    protected _getImageSource(gameConfig: GameConfigGcData.GcData, tileData: SerialTile, tickCount: number): string {
        return tileData == null
            ? ``
            : CommonModelCommonModel.getCachedTileDecorationImageSource({
                version             : UsersModel.getSelfSettingsTextureVersion(),
                themeType           : TilesConstantsCommon.ThemeTypeId.Normal,
                tileDecorationType  : tileData.getDecorationType() ?? 0,
                shapeId             : tileData.getDecorationShapeId() ?? 0,
                isDark              : false,
                skinId              : ForceSkinsConstants.SkinId.Neutral,
                tickCount,
            });
    }

    protected _getImageY(gridY: number): number {
        return getGridHeight() * gridY;
    }
}

class TileObjectLayer extends TileLayerBase {
    protected _getImageSource(gameConfig: GameConfigGcData.GcData, tileData: AuxiliaryTypesAuxiliaryTypes.WarMapTileViewData, tickCount: number): string {
        return tileData == null
            ? ``
            : CommonModelCommonModel.getCachedTileObjectImageSource({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                themeType   : TilesConstantsCommon.ThemeTypeId.Normal,
                objectType  : tileData.getObjectType() ?? 0,
                shapeId     : tileData.getObjectShapeId() ?? 0,
                isDark      : false,
                skinId      : HelpersMisc.getExisted(tileData.skinId || tileData.getPlayerIndex()),
                tickCount,
            });
    }

    protected _getImageY(gridY: number): number {
        return getGridHeight() * (gridY - 1);
    }
}

class WarMapUnitMapView extends UiComponentsUiContainer.UiContainer {
    private readonly _unitViews             : UiInterfacesIUiUnitView.IUiUnitView[] = [];
    private readonly _airLayer              = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _groundLayer           = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _seaLayer              = new (UiUtilsUiFactory.getUiContainerClass())();
    private readonly _notifyListenerArray   : NotificationsTypes.Listener[] = [
        { type: NotificationsTypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
        { type: NotificationsTypeId.TypeId.StateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
    ];

    public constructor() {
        super();

        this.addUiChild(this._seaLayer);
        this.addUiChild(this._groundLayer);
        this.addUiChild(this._airLayer);

        {
            const agent = this.getEventAgent();
            agent.addUiCommonEventListener(UiTypesUiCommonEventType.UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            agent.addUiCommonEventListener(UiTypesUiCommonEventType.UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
    }

    public showUnitMap({ unitDataArray, players, gameConfig }: {
        unitDataArray   : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[];
        players         : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>;
        gameConfig      : GameConfigGcData.GcData;
    }): void {
        this._initWithDataList(_createUnitViewDataList({ unitDataArray, players, gameConfig }));
    }
    private _initWithDataList(dataList: UiTypesUiUnitViewData.UiUnitViewData[]): void {
        this.clear();

        const tickCount = CommonModelCommonModel.getUnitAnimationTickCount();
        for (const data of dataList) {
            this._addUnit(data, tickCount);
        }
        this._reviseZOrderForAllUnits();
    }
    public clear(): void {
        for (const view of this._unitViews) {
            view.getParent()?.removeChild(view as unknown as VendorEgretEgret.DisplayObject);
        }
        this._unitViews.length = 0;
    }

    private _onAddedToStage(): void {
        NotificationsDispatcher.addEventListeners(this._notifyListenerArray, this);
    }
    private _onRemovedFromStage(): void {
        NotificationsDispatcher.removeEventListeners(this._notifyListenerArray, this);
    }
    private _onNotifyUnitAnimationTick(): void {
        const tickCount = CommonModelCommonModel.getUnitAnimationTickCount();
        for (const view of this._unitViews) {
            view.updateOnAnimationTick(tickCount);
        }
    }
    private _onNotifyUnitStateIndicatorTick(): void {
        for (const view of this._unitViews) {
            view.updateOnStateIndicatorTick();
        }
    }

    private _reviseZOrderForAllUnits(): void {
        this._reviseZOrderForSingleLayer(this._airLayer);
        this._reviseZOrderForSingleLayer(this._groundLayer);
        this._reviseZOrderForSingleLayer(this._seaLayer);
    }
    private _reviseZOrderForSingleLayer(layer: UiInterfacesIUiContainer.IUiContainer): void {
        const unitsCount    = layer.getUiChildren().length;
        const unitViews     : UiInterfacesIUiUnitView.IUiUnitView[] = [];
        for (let i = 0; i < unitsCount; ++i) {
            unitViews.push(layer.getUiChildAt(i) as UiInterfacesIUiUnitView.IUiUnitView);
        }
        unitViews.sort((v1, v2): number => {
            const g1 = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v1.getViewData()?.unitData.getGridIndex()));
            const g2 = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v2.getViewData()?.unitData.getGridIndex()));
            const y1 = g1.getY();
            const y2 = g2.getY();
            return y1 !== y2 ? y1 - y2 : g1.getX() - g2.getX();
        });

        for (let i = 0; i < unitsCount; ++i) {
            layer.addUiChildAt(unitViews[i], i);
        }
    }

    private _addUnit(data: UiTypesUiUnitViewData.UiUnitViewData, tickCount: number): void {
        const view = new (UiUtilsUiFactory.getUiUnitViewClass())(data, tickCount);
        this._unitViews.push(view);

        switch (data.gameConfig.getUnitTemplateCfg(data.unitData.getUnitType())?.getLayer()) {
            case UnitsConstants.DisplayLayerId.Air     : this._airLayer.addUiChild(view);                                                    break;
            case UnitsConstants.DisplayLayerId.Ground  : this._groundLayer.addUiChild(view);                                                 break;
            case UnitsConstants.DisplayLayerId.Sea     : this._seaLayer.addUiChild(view);                                                    break;
            default                         : throw HelpersMisc.newError(`Invalid layer`, UtilsClientErrorCode.ClientErrorCode.WarMapView_AddUnit_00);
        }
    }
}

function _createUnitViewDataList({ unitDataArray, players, gameConfig }: {
    unitDataArray   : ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit[];
    players         : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>;
    gameConfig      : GameConfigGcData.GcData;
}): UiTypesUiUnitViewData.UiUnitViewData[] {
    const dataArray: UiTypesUiUnitViewData.UiUnitViewData[] = [];
    if (unitDataArray) {
        const loaderUnitIdSet = new Set<number>();
        for (const unitData of unitDataArray) {
            const loaderUnitId = unitData.getLoaderUnitId();
            if (loaderUnitId == null) {
                dataArray.push(new UiTypesUiUnitViewData.UiUnitViewData({
                    gameConfig          : gameConfig,
                    skinId              : ForceSkinsUtils.getDefaultSkinId(HelpersMisc.getExisted(unitData.getPlayerIndex())),
                    overridingSkinId    : undefined,
                    unitData            : unitData.clone(),
                }));
            } else {
                loaderUnitIdSet.add(loaderUnitId);
            }
        }

        for (const unitData of dataArray) {
            if (loaderUnitIdSet.has(unitData.unitData.getUnitId())) {
                unitData.hasLoadedUnit = true;
            }

            const playerData = players ? players.find(v => v.getPlayerIndex() === unitData.unitData.getPlayerIndex()) : null;
            if (playerData) {
                unitData.coUsingSkillType   = playerData.getCoUsingSkillType() ?? 0;
                unitData.skinId             = playerData.getUnitAndTileSkinId() ?? 0;
            }
        }
    }

    return dataArray;
}
