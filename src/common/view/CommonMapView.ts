import {
    AuxiliaryTypes_MapSize,
    Campaigns_Mains_Provider,
    ForceSkins_Utils,
    GameConfigs_Provider,
    Graphics_Utils,
    Helpers_Collection,
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    NormalMap_Model_NormalMapModel,
    Notifications_Dispatcher,
    Tiles_TileView,
    Tiles_TileViewPool,
    Ui_Components_UiContainer,
    Ui_Components_UiContainerBase,
    Ui_Components_UiImage,
    Ui_Types_UiCommonEventType,
    Units_Constants,
    Units_UnitView,
    Units_UnitViewData,
    Units_UnitViewPool,
    Users_Model,
    Utils_ClientErrorCode,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Egret_Egret,
    type GameConfigs_GameConfig,
    type Notifications_Types,
    type Ui_Interfaces_IUiContainer,
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
        this._tileMapView.showTileMap(mapRawData.getTileDataArray(), overridingPlayers);
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
        this._tileMapView.showTileMap(tileMap.getTiles(), overridingPlayers);
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

    private readonly _baseLayer             = new Ui_Components_UiContainer.UiContainer();
    private readonly _decorationLayer       = new Ui_Components_UiContainer.UiContainer();
    private readonly _gridBorderLayer       = new Ui_Components_UiContainer.UiContainer();
    private readonly _objectLayer           = new Ui_Components_UiContainer.UiContainer();

    private readonly _tileViewList          = new Array<Tiles_TileView.TileView>();

    private readonly _notifyListenerArray   : Notifications_Types.Listener[] = [
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

    public showTileMap(tileDataList: SerialTile[], players?: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>): void {
        this._resetTileViews(tileDataList, players);
        this._resetGridBorderLayer(tileDataList);
        this._updateBorderLayer(tileDataList);
    }
    public clear(): void {
        this._resetTileViews([], undefined);
        this._resetGridBorderLayer([]);
        this._updateBorderLayer([]);
    }

    private _onAddedToStage(): void {
        Notifications_Dispatcher.addEventListeners(this._notifyListenerArray, this);
    }
    private _onRemovedFromStage(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListenerArray, this);
    }

    private _onNotifyIsShowGridBorderChanged(): void {
        this._updateGridBorderLayerVisible();
    }

    private _resetTileViews(tileDataArray: SerialTile[], players: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>): void {
        const tileViewList = this._tileViewList;
        const tileViewPool = Tiles_TileViewPool.TileViewPool.getInstance();
        for (const tileView of tileViewList) {
            tileView.dispose();
            tileViewPool.release(tileView);
        }
        tileViewList.length = 0;

        const baseLayer         = this._baseLayer;
        const decorationLayer   = this._decorationLayer;
        const objectLayer       = this._objectLayer;
        baseLayer.removeUiChildren();
        decorationLayer.removeUiChildren();
        objectLayer.removeUiChildren();

        for (const tileData of tileDataArray) {
            const tileView      = tileViewPool.acquire();
            const gridIndex     = tileData.getGridIndex();
            const playerIndex   = tileData.getPlayerIndex();
            tileView.loadViewData({
                baseTypeId        : tileData.getBaseType(),
                baseShapeId       : tileData.getBaseShapeId(),
                decorationTypeId  : tileData.getDecorationType(),
                decorationShapeId : tileData.getDecorationShapeId(),
                objectTypeId      : tileData.getObjectType(),
                objectShapeId     : tileData.getObjectShapeId(),
                gridX             : gridIndex?.getX() ?? 0,
                gridY             : gridIndex?.getY() ?? 0,

                playerIndex : playerIndex,
                skinId      : players?.find(v => v.getPlayerIndex() === playerIndex)?.getUnitAndTileSkinId() ?? ForceSkins_Utils.getDefaultSkinId(playerIndex),
            });
            tileView.refreshAllViews();

            baseLayer.addUiChild(tileView.getImgBase());
            decorationLayer.addUiChild(tileView.getImgDecoration());
            objectLayer.addUiChild(tileView.getImgObject());

            tileViewList.push(tileView);
        }
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

class WarMapUnitMapView extends Ui_Components_UiContainer.UiContainer {
    private readonly _unitViews     : Units_UnitView.UnitView[] = [];
    private readonly _airLayer      = new Ui_Components_UiContainer.UiContainer();
    private readonly _groundLayer   = new Ui_Components_UiContainer.UiContainer();
    private readonly _seaLayer      = new Ui_Components_UiContainer.UiContainer();

    public constructor() {
        super();

        this.addUiChild(this._seaLayer);
        this.addUiChild(this._groundLayer);
        this.addUiChild(this._airLayer);
    }

    public showUnitMap({ unitDataArray, players, gameConfig }: {
        unitDataArray   : SerialUnit[];
        players         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
        gameConfig      : GameConfigs_GameConfig.GameConfig;
    }): void {
        this._initWithDataList(_createUnitViewDataList({ unitDataArray, players, gameConfig }), gameConfig);
    }
    private _initWithDataList(dataList: Units_UnitViewData.UnitViewData[], gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this.clear();

        for (const data of dataList) {
            this._addUnit(data, gameConfig);
        }
        this._reviseZOrderForAllUnits();
    }
    public clear(): void {
        const pool = Units_UnitViewPool.UnitViewPool.getInstance();
        for (const view of this._unitViews) {
            view.getParent()?.removeChild(view as unknown as Egret_Egret.DisplayObject);
            pool.release(view);
        }
        this._unitViews.length = 0;
    }

    private _reviseZOrderForAllUnits(): void {
        this._reviseZOrderForSingleLayer(this._airLayer);
        this._reviseZOrderForSingleLayer(this._groundLayer);
        this._reviseZOrderForSingleLayer(this._seaLayer);
    }
    private _reviseZOrderForSingleLayer(layer: Ui_Interfaces_IUiContainer.IUiContainer): void {
        const unitsCount    = layer.getUiChildren().length;
        const unitViews     : Units_UnitView.UnitView[] = [];
        for (let i = 0; i < unitsCount; ++i) {
            unitViews.push(layer.getUiChildAt(i) as Units_UnitView.UnitView);
        }
        unitViews.sort((v1, v2): number => {
            const d1 = v1.getViewData();
            const d2 = v2.getViewData();
            const y1 = d1.gridY;
            const y2 = d2.gridY;
            return (y1 !== y2)
                ? (y1 - y2)
                : (d1.gridX - d2.gridX);
        });

        for (let i = 0; i < unitsCount; ++i) {
            layer.addUiChildAt(unitViews[i], i);
        }
    }

    private _addUnit(viewData: Units_UnitViewData.UnitViewData, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        const view = Units_UnitViewPool.UnitViewPool.getInstance().acquire();
        view.loadViewData(viewData);
        view.refreshAllViews();
        this._unitViews.push(view);

        switch (gameConfig.getUnitTemplateCfg(viewData.unitTypeId)?.getLayer()) {
            case Units_Constants.DisplayLayerId.Air     : this._airLayer.addUiChild(view);                                                    break;
            case Units_Constants.DisplayLayerId.Ground  : this._groundLayer.addUiChild(view);                                                 break;
            case Units_Constants.DisplayLayerId.Sea     : this._seaLayer.addUiChild(view);                                                    break;
            default                                     : throw Helpers_Misc.newError(`Invalid layer`, Utils_ClientErrorCode.ClientErrorCode.WarMapView_AddUnit_00);
        }
    }
}

function _createUnitViewDataList({ unitDataArray, players, gameConfig }: {
    unitDataArray   : SerialUnit[];
    players         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
    gameConfig      : GameConfigs_GameConfig.GameConfig;
}): Units_UnitViewData.UnitViewData[] {
    const viewDataArray: Units_UnitViewData.UnitViewData[] = [];
    if (unitDataArray) {
        const loaderUnitIdSet = new Set(Helpers_Collection.getNonNullElements(unitDataArray.map(v => v.getLoaderUnitId())));
        for (const unitData of unitDataArray) {
            const unitViewData          = Units_UnitViewData.UnitViewData.generateFromSerialUnit(unitData, gameConfig, players?.find(v => v.getPlayerIndex() === unitData.getPlayerIndex()));
            unitViewData.hasLoadedUnits = loaderUnitIdSet.has(unitData.getUnitId());
            viewDataArray.push(unitViewData);
        }
    }

    return viewDataArray;
}
