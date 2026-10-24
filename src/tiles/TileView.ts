import type * as BaseWarModelBwTypes from "../baseWar/model/BwTypes.ts";
import * as CommonModelCommonModel from "../common/model/CommonModel.ts";
import * as ForceSkinsConstants from "../forceSkins/Constants.ts";
import * as GraphicsUtils from "../graphics/Utils.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as PlayersConstants from "../players/Constants.ts";
import type * as TilesITileView from "./ITileView.ts";
import type * as UiInterfacesIUiImage from "../ui/interfaces/IUiImage.ts";
import * as UiUtilsUiFactory from "../ui/utils/UiFactory.ts";
import * as UsersModel from "../users/Model.ts";

type DataForTileView = BaseWarModelBwTypes.DataForTileView;

const getGridWidth  = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);

export class TileView implements TilesITileView.ITileView {
    private readonly _imgBase       = new (UiUtilsUiFactory.getUiImageClass())();
    private readonly _imgDecoration = new (UiUtilsUiFactory.getUiImageClass())();
    private readonly _imgObject     = new (UiUtilsUiFactory.getUiImageClass())();
    private readonly _imgBuff       = new (UiUtilsUiFactory.getUiImageClass())();
    private readonly _imgHighlight  = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000` });

    private _data           : DataForTileView | null = null;
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

    public setData(data: DataForTileView): void {
        this._data = data;

        this._resetFramesForBuff();
    }
    public getData(): DataForTileView | null {
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
            const version       = UsersModel.getSelfSettingsTextureVersion();
            const hasFog        = data.hasFog;
            this._framesForBuff = buffTypeArray.map(v => CommonModelCommonModel.getCachedTileBuffImageSource({
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
        const version       = UsersModel.getSelfSettingsTextureVersion();
        const tickCount     = CommonModelCommonModel.getTileAnimationTickCount();
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
                imgObject.loadSource(CommonModelCommonModel.getCachedTileObjectImageSource({
                    version     : version,
                    themeType   : themeType,
                    skinId      : ((hasFog) && (!data.isFullReplay) && (!gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseType, objectType)?.getIsAlwaysShowOwner()))
                        ? ForceSkinsConstants.SkinId.Neutral
                        : (overridingSkinId >= PlayersConstants.PlayerIndex.First ? overridingSkinId : skinId),
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
                imgBase.loadSource(CommonModelCommonModel.getCachedTileBaseImageSource({
                    version,
                    themeType,
                    skinId      : ForceSkinsConstants.SkinId.Neutral,
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
                imgDecoration.loadSource(CommonModelCommonModel.getCachedTileDecorationImageSource({
                    version,
                    themeType,
                    skinId              : ForceSkinsConstants.SkinId.Neutral,
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
            img.loadSource(framesForBuff[CommonModelCommonModel.getStateIndicatorTickCount() % length]);
        }
    }

    public getImgHighlight(): UiInterfacesIUiImage.IUiImage {
        return this._imgHighlight;
    }
    public getImgObject(): UiInterfacesIUiImage.IUiImage {
        return this._imgObject;
    }
    public getImgBuff(): UiInterfacesIUiImage.IUiImage {
        return this._imgBuff;
    }
    public getImgDecoration(): UiInterfacesIUiImage.IUiImage {
        return this._imgDecoration;
    }
    public getImgBase(): UiInterfacesIUiImage.IUiImage {
        return this._imgBase;
    }
}
