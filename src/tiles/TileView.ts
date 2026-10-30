import {
    Helpers_Misc,
    Common_Model_CommonModel,
    Graphics_Utils,
    Players_Constants,
    ForceSkins_Constants,
    Ui_Components_UiImage,
    type BaseWar_Model_BwTypes,
    type Tiles_ITileView,
    type Ui_Interfaces_IUiImage,
    Users_Model,
} from "../internal.ts";

const getGridWidth  = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export class TileView implements Tiles_ITileView.ITileView {
    private readonly _imgBase       = new Ui_Components_UiImage.UiImage();
    private readonly _imgDecoration = new Ui_Components_UiImage.UiImage();
    private readonly _imgObject     = new Ui_Components_UiImage.UiImage();
    private readonly _imgBuff       = new Ui_Components_UiImage.UiImage();
    private readonly _imgHighlight  = new Ui_Components_UiImage.UiImage({ textureSourceName: `uncompressedColorWhite0000` });

    private _data           : BaseWar_Model_BwTypes.DataForTileView | null = null;
    private _framesForBuff  : string[] | null = null;

    public constructor() {
        {
            const imgBase = this.getImgBase();
            imgBase.setIsSmoothing(false);
            imgBase.setAnchorOffsetY(getGridHeight());
        }

        {
            const imgDecoration = this.getImgDecoration();
            imgDecoration.setIsSmoothing(false);
            imgDecoration.setAnchorOffsetY(getGridHeight());
        }

        {
            const imgObject = this.getImgObject();
            imgObject.setIsSmoothing(false);
            imgObject.setAnchorOffsetY(getGridHeight() * 2);
        }

        {
            const imgBuff = this.getImgBuff();
            imgBuff.setIsSmoothing(false);
            imgBuff.setAnchorOffsetY(getGridHeight());
        }

        {
            const imgHighlight = this.getImgHighlight();
            imgHighlight.setIsSmoothing(false);
            imgHighlight.setUnscaledManualWidth(getGridWidth());
            imgHighlight.setUnscaledManualHeight(getGridHeight());
            imgHighlight.setAlpha(0.6);
            imgHighlight.setAnchorOffsetY(getGridHeight());
        }
    }

    public setData(data: BaseWar_Model_BwTypes.DataForTileView): void {
        this._data = data;

        this._resetFramesForBuff();
    }
    public getData(): BaseWar_Model_BwTypes.DataForTileView | null {
        return this._data;
    }
    private _resetFramesForBuff(): void {
        const data = this.getData();
        if (data == null) {
            this._framesForBuff = null;
            return;
        }

        const buffTypeArray = [...new Set(data.tileData.getUnfixedBuffArray().map(v => v.getBuffTypeId()))];
        if (!buffTypeArray.length) {
            this._framesForBuff = null;
        } else {
            const version       = Users_Model.getSelfSettingsTextureVersion();
            const hasFog        = data.hasFog;
            this._framesForBuff = buffTypeArray.map(v => Common_Model_CommonModel.getCachedTileBuffImageSource({
                version     : version,
                buffType    : v,
                isDark      : hasFog,
            }));
        }
    }

    public updateView(): void {
        this.updateTileAnimation();
        this.updateImgBuff();
    }
    public updateTileAnimation(): void {
        const data = this.getData();
        if (data == null) {
            return;
        }

        const skinId        = data.skinId;
        const hasFog        = data.hasFog;
        const tileData      = data.tileData;
        const themeType     = data.themeType;
        const gameConfig    = data.gameConfig;
        const version       = Users_Model.getSelfSettingsTextureVersion();
        const tickCount     = Common_Model_CommonModel.getTileAnimationTickCount();
        const tileBaseType  = tileData.getBaseType();

        {
            const objectType    = tileData.getObjectType();
            const imgObject     = this.getImgObject();
            const shapeId       = tileData.getObjectShapeId();
            if ((objectType == 0) && (shapeId == 0)) {
                imgObject.setIsVisible(false);
            } else {
                imgObject.setIsVisible(true);

                const overridingSkinId = data.overridingSkinId ?? -1;
                imgObject.loadSource(Common_Model_CommonModel.getCachedTileObjectImageSource({
                    version     : version,
                    themeType   : themeType,
                    skinId      : ((hasFog) && (!data.isFullReplay) && (!gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseType, objectType)?.getIsAlwaysShowOwner()))
                        ? ForceSkins_Constants.SkinId.Neutral
                        : (overridingSkinId >= Players_Constants.PlayerIndex.First ? overridingSkinId : skinId),
                    shapeId     : shapeId,
                    objectType  : objectType,
                    isDark      : hasFog,
                    tickCount   : tickCount,
                }));
            }
        }

        {
            const imgBase   = this.getImgBase();
            if (tileBaseType == 0) {
                imgBase.setIsVisible(false);
            } else {
                imgBase.setIsVisible(true);
                imgBase.loadSource(Common_Model_CommonModel.getCachedTileBaseImageSource({
                    version,
                    themeType,
                    skinId      : ForceSkins_Constants.SkinId.Neutral,
                    shapeId     : tileData.getBaseShapeId(),
                    baseType    : tileBaseType,
                    isDark      : hasFog,
                    tickCount,
                }));
            }
        }

        {
            const decorationType    = tileData.getDecorationType();
            const imgDecoration     = this.getImgDecoration();
            if (decorationType == 0) {
                imgDecoration.setIsVisible(false);
            } else {
                imgDecoration.setIsVisible(true);
                imgDecoration.loadSource(Common_Model_CommonModel.getCachedTileDecorationImageSource({
                    version,
                    themeType,
                    skinId              : ForceSkins_Constants.SkinId.Neutral,
                    tileDecorationType  : decorationType,
                    shapeId             : tileData.getDecorationShapeId(),
                    isDark              : hasFog,
                    tickCount,
                }));
            }
        }

        this.getImgHighlight().setIsVisible(tileData.getIsHighlighted());
    }
    public updateImgBuff(): void {
        const img           = this.getImgBuff();
        const framesForBuff = this._framesForBuff;
        if (framesForBuff == null) {
            img.setIsVisible(false);
            return;
        }

        const length = framesForBuff.length;
        if (!length) {
            img.setIsVisible(false);
        } else {
            img.setIsVisible(true);
            img.loadSource(framesForBuff[Common_Model_CommonModel.getStateIndicatorTickCount() % length]);
        }
    }

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
