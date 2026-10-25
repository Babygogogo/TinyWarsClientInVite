import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../baseWar/interface/IBwWar.ts";
import { getFinalSkinId } from "../forceSkins/Utils.ts";
import { getRwWarClass, getRwWarBaseClass, getMpwWarClass, getMeWarClass, getSpwWarClass } from "../gameHelpers/GhFactory.ts";
import { getCurrentTextureResolutionConfig } from "../graphics/Utils.ts";
import { getGridMark } from "../helpers/ImageSource.ts";
import { createLazyFunc, getExisted } from "../helpers/Misc.ts";
import { getNumText } from "../helpers/Text.ts";
import { MinId, MaxId } from "../locations/Constants.ts";
import type {
    BwTileHasLocationIdSet,
    GridMarkAdded,
    GridMarkDeleted,
    HiddenGridMarkTypeIdListChanged,
    GridMarkListChanged,
    BwPlayerPlayerIndexArrayForShowMarkedGridUpdated,
} from "../notifications/DataTypes.ts";
import { addEventListeners, removeEventListeners } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { Listener } from "../notifications/Types.ts";
import { PlayerIndex } from "../players/Constants.ts";
import type {
    GridIdAndMarkTypeId as ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId,
} from "../proto/schema/CommonProto/Structure/GridIdAndMarkTypeId.ts";
import type { ITileMap } from "./ITileMap.ts";
import type { ITileMapView } from "./ITileMapView.ts";
import type { ITileView } from "./ITileView.ts";
import { Executor } from "../tween/Executor.ts";
import { UiContainer } from "../ui/components/UiContainer.ts";
import type { IUiImage } from "../ui/interfaces/IUiImage.ts";
import { getUiContainerClass, getUiImageClass } from "../ui/utils/UiFactory.ts";
import { getSelfSettingsIsShowGridBorder, getSelfSettingsOpacitySettings } from "../users/Model.ts";
import type { DisplayObject, Event } from "../vendor/egret/Egret.ts";
import { checkIsUnitOnMapVisibleToTeams } from "../visibilities/Utils.ts";

type IBwWar                 = BaseWarInterfaceIBwWar;
type GridIdAndMarkTypeId    = ProtoSchemaCommonProtoStructureGridIdAndMarkTypeId;

const getGridWidth  = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);

export class TileMapView extends UiContainer implements ITileMapView {
    private readonly _borderLayer               = new (getUiContainerClass())();
    private readonly _imgCornerUL               = new (getUiImageClass())({ textureSourceName: `uncompressedCorner0000` });
    private readonly _imgCornerUR               = new (getUiImageClass())({ textureSourceName: `uncompressedCorner0001` });
    private readonly _imgCornerDR               = new (getUiImageClass())({ textureSourceName: `uncompressedCorner0002` });
    private readonly _imgCornerDL               = new (getUiImageClass())({ textureSourceName: `uncompressedCorner0003` });
    private readonly _imgBorderU                = new (getUiImageClass())({ textureSourceName: `uncompressedBorder0000` });
    private readonly _imgBorderR                = new (getUiImageClass())({ textureSourceName: `uncompressedBorder0001` });
    private readonly _imgBorderD                = new (getUiImageClass())({ textureSourceName: `uncompressedBorder0002` });
    private readonly _imgBorderL                = new (getUiImageClass())({ textureSourceName: `uncompressedBorder0003` });

    private readonly _tileViewArray             : ITileView[] = [];
    private readonly _baseLayer                 = new (getUiContainerClass())();
    private readonly _decorationLayer           = new (getUiContainerClass())();
    private readonly _gridBorderLayer           = new (getUiContainerClass())();
    private readonly _objectLayer               = new (getUiContainerClass())();
    private readonly _buffLayer                 = new (getUiContainerClass())();
    private readonly _highlightLayer            = new (getUiContainerClass())();
    private readonly _locationLayer             = new (getUiContainerClass())();
    private readonly _coZoneContainer           = new (getUiContainerClass())();
    private readonly _coZoneAreaImageDict       = new Map<number, IUiImage[][]>();
    private readonly _coZoneBorderImageArray    : IUiImage[] = [];
    private readonly _markLayer                 = new (getUiContainerClass())();

    private readonly _notifyListeners: Listener[] = [
        { type: TypeId.TileAnimationTick,                                   callback: this._onNotifyTileAnimationTick },
        { type: TypeId.StateIndicatorTick,                                  callback: this._onNotifyStateIndicatorTick },
        { type: TypeId.UserSettingsIsShowGridBorderChanged,                 callback: this._onNotifyIsShowGridBorderChanged },
        { type: TypeId.BwTileHasLocationIdSet,                              callback: this._onNotifyBwTileHasLocationIdSet },
        { type: TypeId.BwOverridingSkinIdChanged,                           callback: this._onNotifyBwOverridingSkinIdChanged },
        { type: TypeId.GridMarkAdded,                                       callback: this._onNotifyGridMarkAdded },
        { type: TypeId.GridMarkDeleted,                                     callback: this._onNotifyGridMarkDeleted },
        { type: TypeId.GridMarkListChanged,                                 callback: this._onNotifyGridMarkListChanged },
        { type: TypeId.HiddenGridMarkTypeIdListChanged,                     callback: this._onNotifyHiddenGridMarkTypeIdListChanged },
        { type: TypeId.BwPlayerPlayerIndexArrayForShowMarkedGridUpdated,    callback: this._onNotifyBwPlayerPlayerIndexArrayForShowMarkedGridUpdated },
        { type: TypeId.UserSettingsOpacitySettingsChanged,                  callback: this._onNotifyUserSettingsOpacitySettingsChanged },
    ];

    private _tileMap?: ITileMap;

    public constructor() {
        super();

        this._initBorderLayer();
        this.addUiChild(this._baseLayer);
        this.addUiChild(this._decorationLayer);
        this.addUiChild(this._gridBorderLayer);
        this.addUiChild(this._objectLayer);
        this.addUiChild(this._buffLayer);
        this.addUiChild(this._highlightLayer);
        this.addUiChild(this._locationLayer);
        this.addUiChild(this._coZoneContainer);
        this.addUiChild(this._markLayer);
        this._locationLayer.setAlpha(0.6);
        this._gridBorderLayer.setAlpha(0.3);

        this._updateOpacityForTileLayers();

        this.setIsTouchChildrenEnabled(false);
    }

    public init(tileMap: ITileMap): void {
        this._tileMap = tileMap;

        {
            const tileViewArray     = this._tileViewArray;
            const baseLayer         = this._baseLayer;
            const decorationLayer   = this._decorationLayer;
            const objectLayer       = this._objectLayer;
            const buffLayer         = this._buffLayer;
            const highlightLayer    = this._highlightLayer;
            tileViewArray.length    = 0;
            baseLayer.removeUiChildren();
            decorationLayer.removeUiChildren();
            objectLayer.removeUiChildren();
            buffLayer.removeUiChildren();
            highlightLayer.removeUiChildren();

            for (const tile of tileMap.getAllTiles()) {
                const view  = tile.getView();
                const x     = getGridWidth() * tile.getGridX();
                const y     = getGridHeight() * (tile.getGridY() + 1);
                tileViewArray.push(view);

                {
                    const imgBase   = view.getImgBase();
                    imgBase.setX(x);
                    imgBase.setY(y);
                    baseLayer.addUiChild(imgBase);
                }

                {
                    const imgDecoration = view.getImgDecoration();
                    imgDecoration.setX(x);
                    imgDecoration.setY(y);
                    decorationLayer.addUiChild(imgDecoration);
                }

                {
                    const imgObject = view.getImgObject();
                    imgObject.setX(x);
                    imgObject.setY(y);
                    objectLayer.addUiChild(imgObject);
                }

                {
                    const img   = view.getImgBuff();
                    img.setX(x);
                    img.setY(y);
                    buffLayer.addUiChild(img);
                }

                {
                    const imgHighlight  = view.getImgHighlight();
                    imgHighlight.setX(x);
                    imgHighlight.setY(y);
                    highlightLayer.addUiChild(imgHighlight);
                }
            }
        }

        const { width: mapWidth, height: mapHeight } = tileMap.getMapSize().getWH();
        {
            const borderWidth       = mapWidth * getGridWidth();
            const borderHeight      = mapHeight * getGridHeight();
            const gridBorderLayer   = this._gridBorderLayer;
            gridBorderLayer.removeUiChildren();
            for (let x = 1; x < mapWidth; ++x) {
                const img       = new (getUiImageClass())({ textureSourceName: `uncompressedColorBlack0000` });
                img.setIsSmoothing(false);
                img.setUnscaledManualWidth(1);
                img.setUnscaledManualHeight(borderHeight);
                img.setX((x * getGridWidth()) - 0.5);
                gridBorderLayer.addUiChild(img);
            }
            for (let y = 1; y < mapHeight; ++y) {
                const img       = new (getUiImageClass())({ textureSourceName: `uncompressedColorBlack0000` });
                img.setIsSmoothing(false);
                img.setUnscaledManualWidth(borderWidth);
                img.setUnscaledManualHeight(1);
                img.setY((y * getGridHeight()) - 0.5);
                gridBorderLayer.addUiChild(img);
            }
            this._updateGridBorderLayerVisible();
        }

        {
            const locationLayer = this._locationLayer;
            locationLayer.removeUiChildren();

            for (let y = 0; y < mapHeight; ++y) {
                for (let x = 0; x < mapWidth; ++x) {
                    const imgLocation       = new (getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000` });
                    imgLocation.setIsSmoothing(false);
                    imgLocation.setX(x * getGridWidth());
                    imgLocation.setY(y * getGridHeight());
                    imgLocation.setUnscaledManualWidth(getGridWidth());
                    imgLocation.setUnscaledManualHeight(getGridHeight());
                    locationLayer.addUiChild(imgLocation);
                }
            }
        }

        {
            const layer = this._markLayer;
            layer.removeUiChildren();

            for (let y = 0; y < mapHeight; ++y) {
                for (let x = 0; x < mapWidth; ++x) {
                    const img = new (getUiImageClass())();
                    img.setIsSmoothing(false);
                    img.setX(x * getGridWidth());
                    img.setY(y * getGridHeight());
                    img.setUnscaledManualWidth(getGridWidth());
                    img.setUnscaledManualHeight(getGridHeight());
                    layer.addUiChild(img);
                }
            }
        }

        this._updateBorderLayer();
    }
    public fastInit(tileMap: ITileMap): void {
        this._tileMap = tileMap;
    }

    public startRunningView(): void {
        addEventListeners(this._notifyListeners, this);

        this.resetLocationLayer();
        this.resetMarkLayer();
        this._initCoZoneContainer();
        this._startCoZoneAnimation();
        this.updateCoZone();
    }
    public stopRunningView(): void {
        removeEventListeners(this._notifyListeners, this);

        this._stopCoZoneAnimation();
    }

    public setBaseLayerVisible(visible: boolean): void {
        this._baseLayer.setIsVisible(visible);
    }
    public getBaseLayerVisible(): boolean {
        return this._baseLayer.getIsVisible();
    }

    public setDecorationLayerVisible(visible: boolean): void {
        this._decorationLayer.setIsVisible(visible);
    }
    public getDecorationLayerVisible(): boolean {
        return this._decorationLayer.getIsVisible();
    }

    public setObjectLayerVisible(visible: boolean): void {
        this._objectLayer.setIsVisible(visible);
    }
    public getObjectLayerVisible(): boolean {
        return this._objectLayer.getIsVisible();
    }

    public resetLocationLayer(): void {
        const locationIdArray   : number[] = [];
        const tileMap           = getExisted(this._tileMap);
        for (let locationId = MinId; locationId <= MaxId; ++locationId) {
            if (tileMap.getIsLocationVisible(locationId)) {
                locationIdArray.push(locationId);
            }
        }

        const mapSize   = tileMap.getMapSize();
        const width     = mapSize.getWidth();
        const height    = mapSize.getHeight();
        const layer     = this._locationLayer;
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                const gridIndex = new GridIndex(x, y);
                const tile      = tileMap.getTile(gridIndex);
                layer.getUiChildAt(gridIndex.getGridId(mapSize))?.setIsVisible(locationIdArray.some(v => tile.getHasLocationId(v)));
            }
        }
    }

    public resetMarkLayer(): void {
        const tileMap       = getExisted(this._tileMap);
        const dataArray     = getGridMarkDataArray(tileMap.getWar());
        const mapSize       = tileMap.getMapSize();
        const width         = mapSize.getWidth();
        const height        = mapSize.getHeight();
        const layer         = this._markLayer;
        for (let y = 0; y < height; ++y) {
            for (let x = 0; x < width; ++x) {
                const gridId    = GridIndex.getGridId(x, y, mapSize);
                const img       = layer.getUiChildAt(gridId) as IUiImage | undefined;
                if (img) {
                    const markTypeId = dataArray.find(v => v.getGridId() === gridId)?.getMarkTypeId();
                    if (markTypeId == null) {
                        img.setIsVisible(false);
                    } else {
                        img.setIsVisible(true);
                        img.loadSource(getGridMark(markTypeId));
                    }
                }
            }
        }
    }
    private _updateMarkGrid(gridId: number): void {
        const img = this._markLayer.getUiChildAt(gridId) as IUiImage | undefined;
        if (img) {
            const markTypeId = getGridMarkDataArray(getExisted(this._tileMap?.getWar())).find(v => v.getGridId() === gridId)?.getMarkTypeId();
            if (markTypeId == null) {
                img.setIsVisible(false);
            } else {
                img.setIsVisible(true);
                img.loadSource(getGridMark(markTypeId));
            }
        }
    }

    private _initCoZoneContainer(): void {
        const container     = this._coZoneContainer;
        const tileMap       = getExisted(this._tileMap);
        const mapSize       = tileMap.getMapSize();
        const mapWidth      = mapSize.getWidth();
        const mapHeight     = mapSize.getHeight();
        const playerManager = tileMap.getWar().getPlayerManager();
        const playersCount  = playerManager.getTotalPlayersCount(false);

        {
            const imageDict = this._coZoneAreaImageDict;
            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                if (!imageDict.has(playerIndex)) {
                    imageDict.set(playerIndex, []);
                }

                const imgSource = `c08_t03_s${getNumText(playerManager.getPlayer(playerIndex).getUnitAndTileSkinId())}_f01`;
                const matrix    = getExisted(imageDict.get(playerIndex));
                for (let x = 0; x < mapWidth; ++x) {
                    if (matrix[x] == null) {
                        matrix[x] = [];
                    }

                    const column = matrix[x];
                    for (let y = 0; y < mapHeight; ++y) {
                        if (column[y] == null) {
                            const img       = new (getUiImageClass())({ textureSourceName: imgSource });
                            img.setIsSmoothing(false);
                            img.setX(getGridWidth() * x);
                            img.setY(getGridHeight() * y);
                            container.addUiChild(img);

                            column[y] = img;
                        }
                        column[y].loadSource(imgSource);
                    }

                    for (let y = mapHeight; y < column.length; ++y) {
                        const img = column[y];
                        img?.getParent()?.removeChild(img as unknown as DisplayObject);
                    }
                    column.length = mapHeight;
                }

                for (let x = mapWidth; x < matrix.length; ++x) {
                    for (const img of matrix[x] || []) {
                        img?.getParent()?.removeChild(img as unknown as DisplayObject);
                    }
                }
                matrix.length = mapWidth;
            }

            for (let playerIndex = playersCount + 1; playerIndex <= PlayerIndex.Max; ++playerIndex) {
                for (const column of imageDict.get(playerIndex) || []) {
                    for (const img of column || []) {
                        img?.getParent()?.removeChild(img as unknown as DisplayObject);
                    }
                }
                imageDict.delete(playerIndex);
            }
        }

        {
            const imgArray  = this._coZoneBorderImageArray;
            const imgsCount = (mapWidth + 1) * mapHeight + (mapHeight + 1) * mapWidth;
            for (let i = imgsCount; i < imgArray.length; ++i) {
                const img = imgArray[i];
                img?.getParent()?.removeChild(img as unknown as DisplayObject);
            }
            imgArray.length = imgsCount;

            let i = 0;
            for (let y = 0; y <= mapHeight; ++y) {
                for (let x = 0; x < mapWidth; ++x) {
                    if (imgArray[i] == null) {
                        const img       = new (getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000` });
                        imgArray[i]     = img;
                        img.setIsSmoothing(false);
                        container.addUiChild(img);
                    }

                    const img = imgArray[i];
                    img.setUnscaledManualWidth(getGridWidth() - 2);
                    img.setUnscaledManualHeight(2);
                    img.setX(x * getGridWidth() + 1);
                    img.setY(y * getGridHeight() - 1);

                    ++i;
                }
            }
            for (let y = 0; y < mapHeight; ++y) {
                for (let x = 0; x <= mapWidth; ++x) {
                    if (imgArray[i] == null) {
                        const img       = new (getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000` });
                        imgArray[i]     = img;
                        img.setIsSmoothing(false);
                        container.addUiChild(img);
                    }

                    const img   = imgArray[i];
                    img.setUnscaledManualWidth(2);
                    img.setUnscaledManualHeight(getGridHeight() - 2);
                    img.setX(x * getGridWidth() - 1);
                    img.setY(y * getGridHeight() + 1);

                    ++i;
                }
            }
        }
    }
    public updateCoZone(): void {
        const tileMap               = getExisted(this._tileMap);
        const war                   = tileMap.getWar();
        const mapSize               = tileMap.getMapSize();
        const mapWidth              = mapSize.getWidth();
        const mapHeight             = mapSize.getHeight();
        const playerManager         = war.getPlayerManager();
        const unitMap               = war.getUnitMap();
        const areaImgDict           = this._coZoneAreaImageDict;
        const borderImgArray        = this._coZoneBorderImageArray;
        const playersCount          = playerManager.getTotalPlayersCount(false);
        const watcherTeamIndexes    = ((war instanceof getRwWarClass()) && (!war.getIsShowAllUnits()))
            ? new Set([war.getVisionTeamIndex() ?? war.getPlayerInTurn().getTeamIndex()])
            : playerManager.getWatcherTeamIndexesForSelf();
        for (const img of borderImgArray) {
            img.setIsVisible(false);
        }

        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const player        = war.getPlayer(playerIndex);
            const radius        = player.getCoZoneRadius();
            const gridIndexList = ((radius == null) || (!player.checkHasZoneSkillForCurrentSkills()))
                ? []
                : player.getCoGridIndexListOnMap().filter(gridIndex => {
                    const unit = unitMap.getUnitOnMap(gridIndex);
                    return (!!unit)
                        && (checkIsUnitOnMapVisibleToTeams({
                            war                 : war,
                            gridIndex           : gridIndex,
                            unitType            : unit.getUnitType(),
                            isDiving            : unit.getIsDiving(),
                            isInvisible         : unit.checkIsInvisible(gridIndex),
                            unitPlayerIndex     : playerIndex,
                            observerTeamIndexes : watcherTeamIndexes,
                        }));
                });

            {
                const matrix    = getExisted(areaImgDict.get(playerIndex));
                const imgSource = `c08_t03_s${getNumText(getFinalSkinId(war, playerIndex))}_f01`;
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        const img = matrix[x][y];
                        if ((gridIndexList.length > 0) && (radius >= new GridIndex(x, y).getMinDistance(gridIndexList))) {
                            img.setIsVisible(true);
                            img.loadSource(imgSource);
                        } else {
                            img.setIsVisible(false);
                        }
                    }
                }
            }

            for (const coGridIndex of gridIndexList) {
                const { x: coX, y: coY } = coGridIndex.getXY();
                for (const gridIndex of coGridIndex.getGridsWithinDistance({ minDistance: radius, maxDistance: radius, mapSize })) {
                    const { x, y }  = gridIndex.getXY();
                    const deltaX    = x - coX;
                    if (deltaX >= 0) {
                        borderImgArray[y * (mapWidth + 1) + x + 1 + (mapHeight + 1) * mapWidth].setIsVisible(true);
                    }
                    if (deltaX <= 0) {
                        borderImgArray[y * (mapWidth + 1) + x + (mapHeight + 1) * mapWidth].setIsVisible(true);
                    }

                    const deltaY = y - coY;
                    if (deltaY >= 0) {
                        borderImgArray[(y + 1) * mapWidth + x].setIsVisible(true);
                    }
                    if (deltaY <= 0) {
                        borderImgArray[y * mapWidth + x].setIsVisible(true);
                    }
                }
            }
        }
    }
    private _startCoZoneAnimation(): void {
        this._stopCoZoneAnimation();

        const coZoneContainer = this._coZoneContainer;
        coZoneContainer.setAlpha(0);
        Executor.get(coZoneContainer, { loop: true })
            .to({ customAlpha: 0.75 }, 1000)
            .to({ customAlpha: 0 }, 1000);
    }
    private _stopCoZoneAnimation(): void {
        Executor.removeTweens(this._coZoneContainer);
    }

    private _onNotifyTileAnimationTick(): void {
        const war = this._tileMap?.getWar();
        if ((war instanceof getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
            return;
        }

        for (const view of this._tileViewArray) {
            view.updateTileAnimation();
        }
    }
    private _onNotifyStateIndicatorTick(): void {
        const war = this._tileMap?.getWar();
        if ((war instanceof getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
            return;
        }

        for (const view of this._tileViewArray) {
            view.updateImgBuff();
        }
    }

    private _onNotifyIsShowGridBorderChanged(): void {
        this._updateGridBorderLayerVisible();
    }

    private _onNotifyBwTileHasLocationIdSet(e: Event): void {
        const tileMap   = getExisted(this._tileMap);
        const tile      = e.data as BwTileHasLocationIdSet;
        const img       = this._locationLayer.getUiChildAt(tile.getGridIndex().getGridId(tileMap.getMapSize()));
        for (let locationId = MinId; locationId <= MaxId; ++locationId) {
            if ((tileMap.getIsLocationVisible(locationId)) && (tile.getHasLocationId(locationId))) {
                img?.setIsVisible(true);
                return;
            }
        }

        img?.setIsVisible(false);
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this.updateCoZone();
    }
    private _onNotifyGridMarkAdded(e: Event): void {
        const data = e.data as GridMarkAdded;
        if (data.war === this._tileMap?.getWar()) {
            this._updateMarkGrid(data.gridId);
        }
    }
    private _onNotifyGridMarkDeleted(e: Event): void {
        const data = e.data as GridMarkDeleted;
        if (data.war === this._tileMap?.getWar()) {
            this._updateMarkGrid(data.gridId);
        }
    }
    private _onNotifyHiddenGridMarkTypeIdListChanged(e: Event): void {
        const data = e.data as HiddenGridMarkTypeIdListChanged;
        if (data.war === this._tileMap?.getWar()) {
            this.resetMarkLayer();
        }
    }
    private _onNotifyGridMarkListChanged(e: Event): void {
        const data = e.data as GridMarkListChanged;
        if (data.war === this._tileMap?.getWar()) {
            this.resetMarkLayer();
        }
    }
    private _onNotifyBwPlayerPlayerIndexArrayForShowMarkedGridUpdated(e: Event): void {
        const data = e.data as BwPlayerPlayerIndexArrayForShowMarkedGridUpdated;
        if (data.player.getWar() === this._tileMap?.getWar()) {
            this.resetMarkLayer();
        }
    }

    private _onNotifyUserSettingsOpacitySettingsChanged(): void {
        this._updateOpacityForTileLayers();
    }

    private _updateGridBorderLayerVisible(): void {
        this._gridBorderLayer.setIsVisible(getSelfSettingsIsShowGridBorder());
    }

    private _updateOpacityForTileLayers(): void {
        const opacitySettings = getSelfSettingsOpacitySettings();
        this._baseLayer.setAlpha((opacitySettings?.getTileBaseOpacity() ?? 100) / 100);
        this._objectLayer.setAlpha((opacitySettings?.getTileObjectOpacity() ?? 100) / 100);
        this._decorationLayer.setAlpha((opacitySettings?.getTileDecorationOpacity() ?? 100) / 100);
    }

    private _initBorderLayer(): void {
        const borderLayer   = this._borderLayer;
        const imgCornerUL   = this._imgCornerUL;
        const imgCornerUR   = this._imgCornerUR;
        const imgCornerDL   = this._imgCornerDL;
        const imgCornerDR   = this._imgCornerDR;
        const imgBorderU    = this._imgBorderU;
        const imgBorderD    = this._imgBorderD;
        const imgBorderL    = this._imgBorderL;
        const imgBorderR    = this._imgBorderR;
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

    private _updateBorderLayer(): void {
        const tileMap = this._tileMap;
        if (tileMap == null) {
            return;
        }

        const mapSize           = tileMap.getMapSize();
        const horizontalPixels  = mapSize.getWidth() * getGridWidth();
        const verticalPixels    = mapSize.getHeight() * getGridHeight();
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
            imgBorderU.setX(-0.5);
            imgBorderU.setY(-4);
            imgBorderU.setUnscaledManualWidth(horizontalPixels + 1);
        }

        {
            const imgBorderR    = this._imgBorderR;
            imgBorderR.setX(horizontalPixels);
            imgBorderR.setY(-0.5);
            imgBorderR.setUnscaledManualHeight(verticalPixels + 1);
        }

        {
            const imgBorderD    = this._imgBorderD;
            imgBorderD.setX(-0.5);
            imgBorderD.setY(verticalPixels);
            imgBorderD.setUnscaledManualWidth(horizontalPixels + 1);
        }

        {
            const imgBorderL    = this._imgBorderL;
            imgBorderL.setX(-4);
            imgBorderL.setY(-0.5);
            imgBorderL.setUnscaledManualHeight(verticalPixels + 1);
        }
    }
}

function getGridMarkDataArray(war: IBwWar): GridIdAndMarkTypeId[] {
    if (war instanceof getMpwWarClass()) {
        const player = war.getPlayerLoggedIn();
        if (player == null) {
            return [];
        }

        const hiddenGridMarkTypeIdList = player.getHiddenGridMarkTypeIdList();
        return player.getGridMarkList().filter(v => !hiddenGridMarkTypeIdList.includes(v.getMarkTypeId()));

    } else if ((war instanceof getMeWarClass()) || (war instanceof getRwWarBaseClass())) {
        const data                      = war.getGridMarkData();
        const hiddenGridMarkTypeIdList  = data.getHiddenMarkTypeIdList();
        return data.getGridIdAndMarkTypeIdList().filter(v => !hiddenGridMarkTypeIdList.includes(v.getMarkTypeId()));

    } else if (war instanceof getSpwWarClass()) {
        const data                      = war.getSaveSlotExtraData().getGridMarkData();
        const hiddenGridMarkTypeIdList  = data?.getHiddenMarkTypeIdList() ?? [];
        return data?.getGridIdAndMarkTypeIdList().filter(v => !hiddenGridMarkTypeIdList.includes(v.getMarkTypeId())) ?? [];

    } else {
        // TODO
        return [];
    }
}
