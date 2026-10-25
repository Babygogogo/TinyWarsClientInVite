import type { DataForTileView } from "../baseWar/model/BwTypes.ts";
import {
    getCachedTileBuffImageSource,
    getTileAnimationTickCount,
    getCachedTileObjectImageSource,
    getCachedTileBaseImageSource,
    getCachedTileDecorationImageSource,
    getStateIndicatorTickCount,
} from "../common/model/CommonModel.ts";
import { SkinId } from "../forceSkins/Constants.ts";
import { getCurrentTextureResolutionConfig } from "../graphics/Utils.ts";
import { createLazyFunc } from "../helpers/Misc.ts";
import { PlayerIndex } from "../players/Constants.ts";
import type { ITileView } from "./ITileView.ts";
import type { IUiImage } from "../ui/interfaces/IUiImage.ts";
import { getUiImageClass } from "../ui/utils/UiFactory.ts";
import { getSelfSettingsTextureVersion } from "../users/Model.ts";

const getGridWidth  = createLazyFunc(() => getCurrentTextureResolutionConfig().gridWidth);
const getGridHeight = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);

export class TileView implements ITileView {
    private readonly _imgBase       = new (getUiImageClass())();
    private readonly _imgDecoration = new (getUiImageClass())();
    private readonly _imgObject     = new (getUiImageClass())();
    private readonly _imgBuff       = new (getUiImageClass())();
    private readonly _imgHighlight  = new (getUiImageClass())({ textureSourceName: `uncompressedColorWhite0000` });

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
            const version       = getSelfSettingsTextureVersion();
            const hasFog        = data.hasFog;
            this._framesForBuff = buffTypeArray.map(v => getCachedTileBuffImageSource({
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
        const version       = getSelfSettingsTextureVersion();
        const tickCount     = getTileAnimationTickCount();
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
                imgObject.loadSource(getCachedTileObjectImageSource({
                    version     : version,
                    themeType   : themeType,
                    skinId      : ((hasFog) && (!data.isFullReplay) && (!gameConfig.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseType, objectType)?.getIsAlwaysShowOwner()))
                        ? SkinId.Neutral
                        : (overridingSkinId >= PlayerIndex.First ? overridingSkinId : skinId),
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
                imgBase.loadSource(getCachedTileBaseImageSource({
                    version,
                    themeType,
                    skinId      : SkinId.Neutral,
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
                imgDecoration.loadSource(getCachedTileDecorationImageSource({
                    version,
                    themeType,
                    skinId              : SkinId.Neutral,
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
            img.loadSource(framesForBuff[getStateIndicatorTickCount() % length]);
        }
    }

    public getImgHighlight(): IUiImage {
        return this._imgHighlight;
    }
    public getImgObject(): IUiImage {
        return this._imgObject;
    }
    public getImgBuff(): IUiImage {
        return this._imgBuff;
    }
    public getImgDecoration(): IUiImage {
        return this._imgDecoration;
    }
    public getImgBase(): IUiImage {
        return this._imgBase;
    }
}
