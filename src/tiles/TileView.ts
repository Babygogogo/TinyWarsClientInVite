import {
    BaseWar_Interface_IBwWar,
    Common_Model_CommonModel,
    ForceSkins_Constants,
    Graphics_Utils,
    Helpers_Misc,
    Tiles_Tile,
    Tiles_TileViewData,
    Ui_Components_UiImage,
    Users_Model,
    type Ui_Interfaces_IUiImage,
} from "../internal.ts";

const getGridWidth  = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export class TileView {
    private readonly _imgBase       = new Ui_Components_UiImage.UiImage();
    private readonly _imgDecoration = new Ui_Components_UiImage.UiImage();
    private readonly _imgObject     = new Ui_Components_UiImage.UiImage();
    private readonly _imgBuff       = new Ui_Components_UiImage.UiImage();
    private readonly _imgHighlight  = new Ui_Components_UiImage.UiImage({ textureSourceName : `uncompressedColorWhite0000` });

    private readonly _viewData          = new Tiles_TileViewData.TileViewData();
    private readonly _buffIconSources   = new Array<string>();

    public constructor() {
        {
            const imgBase = this.getImgBase();
            imgBase.setIsSmoothing(false);
            // imgBase.setAnchorOffsetY(getGridHeight());
        }

        {
            const imgDecoration = this.getImgDecoration();
            imgDecoration.setIsSmoothing(false);
            // imgDecoration.setAnchorOffsetY(getGridHeight());
        }

        {
            const imgObject = this.getImgObject();
            imgObject.setIsSmoothing(false);
            // imgObject.setAnchorOffsetY(getGridHeight() * 2);
            imgObject.setAnchorOffsetY(getGridHeight());
        }

        {
            const imgBuff = this.getImgBuff();
            imgBuff.setIsSmoothing(false);
            // imgBuff.setAnchorOffsetY(getGridHeight());
        }

        {
            const imgHighlight = this.getImgHighlight();
            imgHighlight.setIsSmoothing(false);
            imgHighlight.setUnscaledManualWidth(getGridWidth());
            imgHighlight.setUnscaledManualHeight(getGridHeight());
            imgHighlight.setAlpha(0.6);
            // imgHighlight.setAnchorOffsetY(getGridHeight());
        }
    }

    public dispose(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public updateOnNotifyTileAnimationTick(): void {
        this._refreshAnimation();
    }
    public updateOnNotifyStateIndicatorTick(): void {
        this._refreshImgBuff();
    }
    public updateOnNotifyBwOverridingSkinIdChanged(war: BaseWar_Interface_IBwWar.IBwWar): void {
        const viewData = this.getViewData();
        if (this.loadViewData({
            skinId : Tiles_TileViewData.TileViewData.getNewSkinId({
                war          : war,
                playerIndex  : viewData.playerIndex,
                baseTypeId   : viewData.baseTypeId,
                objectTypeId : viewData.objectTypeId,
                hasFog       : viewData.hasFog,
                skinId       : viewData.skinId,
            }),
        })) {
            this._refreshAnimation();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getViewData(): Tiles_TileViewData.TileViewData {
        return this._viewData;
    }
    public loadViewData(viewData: Partial<Tiles_TileViewData.ITileViewData>, useDefaultValues = false): boolean {
        if (useDefaultValues) {
            const defaultData = new Tiles_TileViewData.TileViewData();
            defaultData.mergeFrom(viewData);
            return this.getViewData().mergeFrom(defaultData);
        } else {
            return this.getViewData().mergeFrom(viewData);
        }
    }
    public loadViewDataFromTile(tile: Tiles_Tile.Tile, war: BaseWar_Interface_IBwWar.IBwWar, ignorePosition = false): boolean {
        return this.loadViewData(Tiles_TileViewData.TileViewData.generateFromTile(tile, war, ignorePosition));
    }

    private _getBuffIconSources(): string[] {
        return this._buffIconSources;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public refreshAllViews(): void {
        this._refreshBuffIconSources();
        this._refreshPosition();
        this._refreshAnimation();
        this._refreshImgBuff();
        this._refreshImgHighlight();
    }

    private _refreshAnimation(): void {
        const viewData      = this.getViewData();
        const hasFog        = viewData.hasFog;
        const themeTypeId   = viewData.themeTypeId;
        const version       = Users_Model.getSelfSettingsTextureVersion();
        const tickCount     = Common_Model_CommonModel.getTileAnimationTickCount();

        {
            const objectTypeId  = viewData.objectTypeId;
            const objectShapeId = viewData.objectShapeId;
            const imgObject     = this.getImgObject();
            if ((objectTypeId < 0)                          ||
                (objectShapeId < 0)                         ||
                ((objectTypeId == 0) && (objectShapeId == 0))
            ) {
                imgObject.setIsVisible(false);
            } else {
                imgObject.setIsVisible(true);
                imgObject.loadSource(Common_Model_CommonModel.getCachedTileObjectImageSource({
                    version    : version,
                    themeType  : themeTypeId,
                    skinId     : viewData.skinId,
                    shapeId    : objectShapeId,
                    objectType : objectTypeId,
                    isDark     : hasFog,
                    tickCount  : tickCount,
                }));
            }
        }

        {
            const baseTypeId    = viewData.baseTypeId;
            const baseShapeId   = viewData.baseShapeId;
            const imgBase       = this.getImgBase();
            if ((baseTypeId <= 0) || (baseShapeId < 0)) {
                imgBase.setIsVisible(false);
            } else {
                imgBase.setIsVisible(true);
                imgBase.loadSource(Common_Model_CommonModel.getCachedTileBaseImageSource({
                    version   : version,
                    themeType : themeTypeId,
                    skinId    : ForceSkins_Constants.SkinId.Neutral,
                    shapeId   : baseShapeId,
                    baseType  : baseTypeId,
                    isDark    : hasFog,
                    tickCount : tickCount,
                }));
            }
        }

        {
            const decorationTypeId  = viewData.decorationTypeId;
            const decorationShapeId = viewData.decorationShapeId;
            const imgDecoration     = this.getImgDecoration();
            if ((decorationTypeId <= 0) || (decorationShapeId < 0)) {
                imgDecoration.setIsVisible(false);
            } else {
                imgDecoration.setIsVisible(true);
                imgDecoration.loadSource(Common_Model_CommonModel.getCachedTileDecorationImageSource({
                    version            : version,
                    themeType          : themeTypeId,
                    skinId             : ForceSkins_Constants.SkinId.Neutral,
                    tileDecorationType : decorationTypeId,
                    shapeId            : decorationShapeId,
                    isDark             : hasFog,
                    tickCount          : tickCount,
                }));
            }
        }

    }

    private _refreshImgBuff(): void {
        const img               = this.getImgBuff();
        const buffIconSources   = this._getBuffIconSources();
        const length            = buffIconSources.length;
        if (!length) {
            img.setIsVisible(false);
        } else {
            img.setIsVisible(true);
            img.loadSource(buffIconSources[Common_Model_CommonModel.getStateIndicatorTickCount() % length]);
        }
    }

    private _refreshImgHighlight(): void {
        this.getImgHighlight().setIsVisible(this.getViewData().isHighlighted);
    }

    private _refreshBuffIconSources(): void {
        const buffIconSources   = this._getBuffIconSources();
        buffIconSources.length  = 0;

        const viewData          = this.getViewData();
        const buffTypeIdList    = viewData.buffTypeIdList;
        if (buffTypeIdList.length) {
            const version   = Users_Model.getSelfSettingsTextureVersion();
            const hasFog    = viewData.hasFog;
            buffIconSources.push(...buffTypeIdList.map(v => Common_Model_CommonModel.getCachedTileBuffImageSource({
                version  : version,
                buffType : v,
                isDark   : hasFog,
            })));
        }
    }

    private _refreshPosition(): void {
        const viewData  = this.getViewData();
        const x         = getGridWidth() * viewData.gridX;
        const y         = getGridHeight() * viewData.gridY;
        setXy(this.getImgBase(), x, y);
        setXy(this.getImgObject(), x, y);
        setXy(this.getImgDecoration(), x, y);
        setXy(this.getImgBuff(), x, y);
        setXy(this.getImgHighlight(), x, y);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getImgHighlight(): Ui_Interfaces_IUiImage.IUiImage {
        return this._imgHighlight;
    }
    public getImgObject(): Ui_Interfaces_IUiImage.IUiImage {
        return this._imgObject;
    }
    public getImgBuff(): Ui_Interfaces_IUiImage.IUiImage {
        return this._imgBuff;
    }
    public getImgDecoration(): Ui_Interfaces_IUiImage.IUiImage {
        return this._imgDecoration;
    }
    public getImgBase(): Ui_Interfaces_IUiImage.IUiImage {
        return this._imgBase;
    }
}

function setXy(img: Ui_Interfaces_IUiImage.IUiImage, x: number, y: number): void {
    img.setX(x);
    img.setY(y);
}
