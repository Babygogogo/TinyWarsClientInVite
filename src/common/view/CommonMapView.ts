import {
    Notifications_Dispatcher,
    Helpers_Misc,
    Common_Model_CommonModel,
    Campaigns_Mains_Provider,
    Graphics_Utils,
    ForceSkins_Utils,
    GameConfigs_Provider,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    NormalMap_Model_NormalMapModel,
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MapSize,
    ForceSkins_Constants,
    Tiles_Constants_Common,
    Ui_Types_UiCommonEventType,
    Ui_Components_UiContainer,
    Ui_Components_UiContainerBase,
    Ui_Components_UiImage,
    Ui_Components_UiUnitView,
    Ui_Types_UiUnitViewData,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiUnitView,
    type Notifications_Types,
    type AuxiliaryTypes_AuxiliaryTypes,
    Utils_ClientErrorCode,
    Units_Constants,
    Users_Model,
    type Egret_Egret,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

const getGridWidth  = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export class CommonMapView extends Ui_Components_UiContainerBase.UiContainerBase {
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
        gameConfig          : GameConfigs_GameConfig.GameConfig;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
    }): void {
        this.setUnscaledManualWidth(getGridWidth()  * mapRawData.getMapWidth());
        this.setUnscaledManualHeight(getGridHeight() * mapRawData.getMapHeight());
        this._tileMapView.showTileMap(gameConfig, mapRawData.getTileDataArray(), overridingPlayers);
        this._unitMapView.showUnitMap({
            unitDataArray : mapRawData.getUnitDataArray(),
            players       : overridingPlayers,
            gameConfig    : gameConfig,
        });
    }
    public async showMapByWarData({ warData, showInitialWarData, overridingPlayers }: {
        warData             : SerialWar;
        showInitialWarData  : boolean;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
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

        const gameConfig = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(warData.getSettingsForCommon()?.getConfigVersion()));
        {
            const settingsForCaw = warData.getSettingsForCaw();
            if (settingsForCaw) {
                const mapRawData = Helpers_Misc.getExisted(await Campaigns_Mains_Provider.getCampaignMapRawData(settingsForCaw.getCampaignId(), settingsForCaw.getCampaignMapId()));
                if ((mapRawData.getCampaignMapData()?.getRevision() ?? 0) === (settingsForCaw.getCampaignMapRevision())) {
                    this.showMapByMapData({
                        mapRawData        : mapRawData,
                        gameConfig        : gameConfig,
                        overridingPlayers : overridingPlayers,
                    });
                } else {
                    this.clear();
                }

                return;
            }
        }

        {
            const normalMapId = Helpers_ProtoSchema_WarSerialization_SerialWar.getNormalMapId(warData);
            if (normalMapId != null) {
                this.showMapByMapData({
                    mapRawData        : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                    gameConfig        : gameConfig,
                    overridingPlayers : overridingPlayers,
                });
                return;
            }
        }

        await this._showMapByWarData(warData, overridingPlayers);
    }
    private async _showMapByWarData(warData: SerialWar, overridingPlayers: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>): Promise<void> {
        const gameConfig    = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(warData.getSettingsForCommon()?.getConfigVersion()));
        const field         = Helpers_Misc.getExisted(warData.getField());
        const tileMap       = Helpers_Misc.getExisted(field.getTileMap());
        const mapSize       = AuxiliaryTypes_MapSize.MapSize.createWithSerialTileMap(tileMap);
        this.setUnscaledManualWidth(getGridWidth() * mapSize.getWidth());
        this.setUnscaledManualHeight(getGridHeight() * mapSize.getHeight());

        overridingPlayers ??= Helpers_Misc.getExisted(warData.getPlayerManager()?.getPlayers());
        this._tileMapView.showTileMap(gameConfig, tileMap.getTiles(), overridingPlayers);
        this._unitMapView.showUnitMap({
            unitDataArray : field.getUnitMap()?.getUnits() ?? [],
            players       : overridingPlayers,
            gameConfig    : gameConfig,
        });
    }

    public clear(): void {
        this._tileMapView.clear();
        this._unitMapView.clear();
    }
}

class TileMapView extends Ui_Components_UiContainer.UiContainer {
    private readonly _borderLayer           = new Ui_Components_UiContainer.UiContainer();
    private readonly _imgCornerUL           = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedCorner0000` });
    private readonly _imgCornerUR           = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedCorner0001` });
    private readonly _imgCornerDR           = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedCorner0002` });
    private readonly _imgCornerDL           = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedCorner0003` });
    private readonly _imgBorderU            = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedBorder0000` });
    private readonly _imgBorderR            = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedBorder0001` });
    private readonly _imgBorderD            = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedBorder0002` });
    private readonly _imgBorderL            = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedBorder0003` });

    private readonly _baseLayer             = new TileBaseLayer();
    private readonly _decorationLayer       = new TileDecorationLayer();
    private readonly _gridBorderLayer       = new Ui_Components_UiContainer.UiContainer();
    private readonly _objectLayer           = new TileObjectLayer();

    private readonly _notifyListenerArray   : Notifications_Types.Listener[] = [
        { type : "TileAnimationTick",                   callback : this._onNotifyTileAnimationTick },
        { type : "UserSettingsIsShowGridBorderChanged", callback : this._onNotifyIsShowGridBorderChanged },
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
            agent.addUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            agent.addUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
    }

    public showTileMap(gameConfig: GameConfigs_GameConfig.GameConfig, dataList: SerialTile[], players?: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>): void {
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
        Notifications_Dispatcher.addEventListeners(this._notifyListenerArray, this);
    }
    private _onRemovedFromStage(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListenerArray, this);
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
        const { width: mapWidth, height: mapHeight }    = AuxiliaryTypes_MapSize.MapSize.createWithTileArray(tileDataArray).getWH();
        const borderWidth                               = mapWidth * getGridWidth();
        const borderHeight                              = mapHeight * getGridHeight();
        const gridBorderLayer                           = this._gridBorderLayer;
        gridBorderLayer.removeUiChildren();
        for (let x = 1; x < mapWidth; ++x) {
            const img = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedColorBlack0000` });
            img.setIsSmoothing(false);
            img.setUnscaledManualWidth(1);
            img.setUnscaledManualHeight(borderHeight);
            img.setX((x * getGridWidth()) - 0.5);
            gridBorderLayer.addUiChild(img);
        }
        for (let y = 1; y < mapHeight; ++y) {
            const img = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedColorBlack0000` });
            img.setIsSmoothing(false);
            img.setUnscaledManualWidth(borderWidth);
            img.setUnscaledManualHeight(1);
            img.setY((y * getGridHeight()) - 0.5);
            gridBorderLayer.addUiChild(img);
        }
        this._updateGridBorderLayerVisible();
    }
    private _updateGridBorderLayerVisible(): void {
        this._gridBorderLayer.setIsVisible(Users_Model.getSelfSettingsIsShowGridBorder());
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
        const mapSize           = AuxiliaryTypes_MapSize.MapSize.createWithTileArray(tileDataArray);
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

abstract class TileLayerBase extends Ui_Components_UiContainer.UiContainer {
    private _gameConfig             : GameConfigs_GameConfig.GameConfig | null = null;
    private readonly _tileDataMap   : AuxiliaryTypes_AuxiliaryTypes.WarMapTileViewData[][] = [];
    private readonly _imageMap      : Ui_Interfaces_IUiImage.IUiImage[][] = [];

    public updateWithTileDataList(gameConfig: GameConfigs_GameConfig.GameConfig, tileDataArray: SerialTile[], players?: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>): void {
        const mapSize       = AuxiliaryTypes_MapSize.MapSize.createWithTileArray(tileDataArray);
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
        const tickCount     = Common_Model_CommonModel.getTileAnimationTickCount();
        for (let x = 0; x < width; ++x) {
            for (let y = 0; y < height; ++y) {
                imageMap[x][y].loadSource(this._getImageSource(gameConfig, tileDataMap[x][y], tickCount));
            }
        }
    }

    public clear(): void {
        const mapSize       = new AuxiliaryTypes_MapSize.MapSize(0, 0);
        this._gameConfig    = null;
        this._resetTileDataMap(mapSize, [], []);
        this._resetImageMap(mapSize);
    }

    private _resetTileDataMap(mapSize: AuxiliaryTypes_MapSize.MapSize, tileDataArray: SerialTile[], players?: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>): void {
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
            const tileData                          = rawTileData.clone() as AuxiliaryTypes_AuxiliaryTypes.WarMapTileViewData;
            const gridIndex                         = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()));
            const player                            = players?.find(v => v.getPlayerIndex() === tileData.getPlayerIndex());
            tileData.skinId                         = player ? player.getUnitAndTileSkinId() : null;
            map[gridIndex.getX()][gridIndex.getY()] = tileData;
        }
    }
    private _resetImageMap(mapSize: AuxiliaryTypes_MapSize.MapSize): void {
        const map       = this._imageMap;
        const width     = mapSize.getWidth();
        const height    = mapSize.getHeight();
        for (let x = width; x < map.length; ++x) {
            for (const img of map[x] || []) {
                img?.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject);
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
                img?.getParent()?.removeChild(img as unknown as Egret_Egret.DisplayObject);
            }
            column.length = height;

            for (let y = 0; y < height; ++y) {
                if (column[y] == null) {
                    const img = new Ui_Components_UiImage.UiImage();
                    img.setIsSmoothing(false);
                    img.setX(getGridWidth() * x);
                    img.setY(this._getImageY(y));
                    column[y] = img;
                    this.addUiChild(img);
                }
            }
        }
    }

    protected abstract _getImageSource(gameConfig: GameConfigs_GameConfig.GameConfig, tileData: AuxiliaryTypes_AuxiliaryTypes.WarMapTileViewData, tickCount: number): string;
    protected abstract _getImageY(gridY: number): number;
}

class TileBaseLayer extends TileLayerBase {
    protected _getImageSource(gameConfig: GameConfigs_GameConfig.GameConfig, tileData: SerialTile, tickCount: number): string {
        return tileData == null
            ? ``
            : Common_Model_CommonModel.getCachedTileBaseImageSource({
                version   : Users_Model.getSelfSettingsTextureVersion(),
                themeType : Tiles_Constants_Common.ThemeTypeId.Normal,
                baseType  : tileData.getBaseType(),
                shapeId   : tileData.getBaseShapeId(),
                isDark    : false,
                skinId    : ForceSkins_Constants.SkinId.Neutral,
                tickCount,
            });
    }

    protected _getImageY(gridY: number): number {
        return getGridHeight() * gridY;
    }
}

class TileDecorationLayer extends TileLayerBase {
    protected _getImageSource(gameConfig: GameConfigs_GameConfig.GameConfig, tileData: SerialTile, tickCount: number): string {
        return tileData == null
            ? ``
            : Common_Model_CommonModel.getCachedTileDecorationImageSource({
                version            : Users_Model.getSelfSettingsTextureVersion(),
                themeType          : Tiles_Constants_Common.ThemeTypeId.Normal,
                tileDecorationType : tileData.getDecorationType(),
                shapeId            : tileData.getDecorationShapeId(),
                isDark             : false,
                skinId             : ForceSkins_Constants.SkinId.Neutral,
                tickCount,
            });
    }

    protected _getImageY(gridY: number): number {
        return getGridHeight() * gridY;
    }
}

class TileObjectLayer extends TileLayerBase {
    protected _getImageSource(gameConfig: GameConfigs_GameConfig.GameConfig, tileData: AuxiliaryTypes_AuxiliaryTypes.WarMapTileViewData, tickCount: number): string {
        return tileData == null
            ? ``
            : Common_Model_CommonModel.getCachedTileObjectImageSource({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                themeType  : Tiles_Constants_Common.ThemeTypeId.Normal,
                objectType : tileData.getObjectType(),
                shapeId    : tileData.getObjectShapeId(),
                isDark     : false,
                skinId     : (tileData.skinId || tileData.getPlayerIndex()),
                tickCount,
            });
    }

    protected _getImageY(gridY: number): number {
        return getGridHeight() * (gridY - 1);
    }
}

class WarMapUnitMapView extends Ui_Components_UiContainer.UiContainer {
    private readonly _unitViews             : Ui_Interfaces_IUiUnitView.IUiUnitView[] = [];
    private readonly _airLayer              = new Ui_Components_UiContainer.UiContainer();
    private readonly _groundLayer           = new Ui_Components_UiContainer.UiContainer();
    private readonly _seaLayer              = new Ui_Components_UiContainer.UiContainer();
    private readonly _notifyListenerArray   : Notifications_Types.Listener[] = [
        { type : "UnitAnimationTick",   callback : this._onNotifyUnitAnimationTick },
        { type : "StateIndicatorTick",  callback : this._onNotifyUnitStateIndicatorTick },
    ];

    public constructor() {
        super();

        this.addUiChild(this._seaLayer);
        this.addUiChild(this._groundLayer);
        this.addUiChild(this._airLayer);

        {
            const agent = this.getEventAgent();
            agent.addUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.AddedToStage, this._onAddedToStage, this);
            agent.addUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.RemovedFromStage, this._onRemovedFromStage, this);
        }
    }

    public showUnitMap({ unitDataArray, players, gameConfig }: {
        unitDataArray   : SerialUnit[];
        players         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
        gameConfig      : GameConfigs_GameConfig.GameConfig;
    }): void {
        this._initWithDataList(_createUnitViewDataList({ unitDataArray, players, gameConfig }));
    }
    private _initWithDataList(dataList: Ui_Types_UiUnitViewData.UiUnitViewData[]): void {
        this.clear();

        const tickCount = Common_Model_CommonModel.getUnitAnimationTickCount();
        for (const data of dataList) {
            this._addUnit(data, tickCount);
        }
        this._reviseZOrderForAllUnits();
    }
    public clear(): void {
        for (const view of this._unitViews) {
            view.getParent()?.removeChild(view as unknown as Egret_Egret.DisplayObject);
        }
        this._unitViews.length = 0;
    }

    private _onAddedToStage(): void {
        Notifications_Dispatcher.addEventListeners(this._notifyListenerArray, this);
    }
    private _onRemovedFromStage(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListenerArray, this);
    }
    private _onNotifyUnitAnimationTick(): void {
        const tickCount = Common_Model_CommonModel.getUnitAnimationTickCount();
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
    private _reviseZOrderForSingleLayer(layer: Ui_Interfaces_IUiContainer.IUiContainer): void {
        const unitsCount    = layer.getUiChildren().length;
        const unitViews     : Ui_Interfaces_IUiUnitView.IUiUnitView[] = [];
        for (let i = 0; i < unitsCount; ++i) {
            unitViews.push(layer.getUiChildAt(i) as Ui_Interfaces_IUiUnitView.IUiUnitView);
        }
        unitViews.sort((v1, v2): number => {
            const g1 = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v1.getViewData()?.unitData.getGridIndex()));
            const g2 = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v2.getViewData()?.unitData.getGridIndex()));
            const y1 = g1.getY();
            const y2 = g2.getY();
            return y1 !== y2 ? y1 - y2 : g1.getX() - g2.getX();
        });

        for (let i = 0; i < unitsCount; ++i) {
            layer.addUiChildAt(unitViews[i], i);
        }
    }

    private _addUnit(data: Ui_Types_UiUnitViewData.UiUnitViewData, tickCount: number): void {
        const view = new Ui_Components_UiUnitView.UiUnitView(data, tickCount);
        this._unitViews.push(view);

        switch (data.gameConfig.getUnitTemplateCfg(data.unitData.getUnitType())?.getLayer()) {
            case Units_Constants.DisplayLayerId.Air     : this._airLayer.addUiChild(view);                                                    break;
            case Units_Constants.DisplayLayerId.Ground  : this._groundLayer.addUiChild(view);                                                 break;
            case Units_Constants.DisplayLayerId.Sea     : this._seaLayer.addUiChild(view);                                                    break;
            default                         : throw Helpers_Misc.newError(`Invalid layer`, Utils_ClientErrorCode.ClientErrorCode.WarMapView_AddUnit_00);
        }
    }
}

function _createUnitViewDataList({ unitDataArray, players, gameConfig }: {
    unitDataArray   : SerialUnit[];
    players         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
}): Ui_Types_UiUnitViewData.UiUnitViewData[] {
    const dataArray: Ui_Types_UiUnitViewData.UiUnitViewData[] = [];
    if (unitDataArray) {
        const loaderUnitIdSet = new Set<number>();
        for (const unitData of unitDataArray) {
            const loaderUnitId = unitData.getLoaderUnitId();
            if (loaderUnitId == null) {
                dataArray.push(new Ui_Types_UiUnitViewData.UiUnitViewData({
                    gameConfig       : gameConfig,
                    skinId           : ForceSkins_Utils.getDefaultSkinId(unitData.getPlayerIndex()),
                    overridingSkinId : undefined,
                    unitData         : unitData.clone(),
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
                unitData.coUsingSkillType   = playerData.getCoUsingSkillType();
                unitData.skinId             = playerData.getUnitAndTileSkinId();
            }
        }
    }

    return dataArray;
}
