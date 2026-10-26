import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import {
    getTileAnimationTickCount,
    getCachedTileObjectImageSource,
    getCachedTileBaseImageSource,
    getCachedTileDecorationImageSource,
} from "../../common/model/CommonModel.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getCurrentTextureResolutionConfig } from "../../graphics/Utils.ts";
import { createLazyFunc, getExisted } from "../../helpers/Misc.ts";
import { ThemeTypeId } from "../../tiles/constants/Common.ts";
import type { IUiImage } from "../interfaces/IUiImage.ts";
import type { IUiTileView } from "../interfaces/IUiTileView.ts";
import type { UiTileViewData } from "../types/UiTileViewData.ts";
import { getUiImageClass } from "../utils/UiFactory.ts";
import { getSelfSettingsTextureVersion } from "../../users/Model.ts";

const getGridHeight = createLazyFunc(() => getCurrentTextureResolutionConfig().gridHeight);

export class UiTileView implements IUiTileView {
    private readonly _imgBase       = new (getUiImageClass())();
    private readonly _imgDecoration = new (getUiImageClass())();
    private readonly _imgObject     = new (getUiImageClass())();

    private _gameConfig         : GcData | null = null;
    private _baseType           : Undefinable<number>;
    private _baseShapeId        : Undefinable<number>;
    private _decorationType     : Undefinable<number>;
    private _decorationShapeId  : Undefinable<number>;
    private _objectType         : Undefinable<number>;
    private _objectShapeId      : Undefinable<number>;
    private _skinId             : Undefinable<number>;
    private _overridingSkinId   : Undefinable<number>;

    public constructor() {
        {
            const img = this.getImgBase();
            img.setIsSmoothing(false);
            img.setAnchorOffsetY(getGridHeight());
        }

        {
            const img = this.getImgDecoration();
            img.setIsSmoothing(false);
            img.setAnchorOffsetY(getGridHeight());
        }

        {
            const img = this.getImgObject();
            img.setIsSmoothing(false);
            img.setAnchorOffsetY(getGridHeight() * 2);
        }
    }

    public init(data: UiTileViewData): IUiTileView {
        this._gameConfig        = data.gameConfig;
        this._baseType          = data.tileBaseType;
        this._baseShapeId       = data.tileBaseShapeId;
        this._decorationType    = data.tileDecorationType;
        this._decorationShapeId = data.tileDecorationShapeId;
        this._objectType        = data.tileObjectType;
        this._objectShapeId     = data.tileObjectShapeId;
        this._skinId            = data.skinId;
        this._overridingSkinId  = data.overridingSkinId;

        return this;
    }

    public startRunningView(): void {
        this.updateView();
    }

    public updateView(): void {
        this._updateImages();
    }

    public getImgObject(): IUiImage {
        return this._imgObject;
    }
    public getImgBase(): IUiImage {
        return this._imgBase;
    }
    public getImgDecoration(): IUiImage {
        return this._imgDecoration;
    }

    public updateOnAnimationTick(): void {
        this._updateImages();
    }

    protected _updateImages(): void {
        const gameConfig = this._gameConfig;
        if (gameConfig == null) {
            return;
        }

        const version   = getSelfSettingsTextureVersion();
        const tickCount = getTileAnimationTickCount();
        {
            const objectType    = this._objectType;
            const imgObject     = this.getImgObject();
            if (objectType == null) {
                imgObject.setIsVisible(false);
            } else {
                imgObject.setIsVisible(true);

                const overridingSkinId = this._overridingSkinId ?? -1;
                imgObject.loadSource(getCachedTileObjectImageSource({
                    version     : version,
                    themeType   : ThemeTypeId.Normal,
                    skinId      : overridingSkinId > 0 ? overridingSkinId : getExisted(this._skinId),
                    objectType  : objectType,
                    isDark      : false,
                    shapeId     : this._objectShapeId ?? 0,
                    tickCount   : tickCount,
                }));
            }
        }

        {
            const baseType  = this._baseType;
            const imgBase   = this.getImgBase();
            if (baseType == null) {
                imgBase.setIsVisible(false);
            } else {
                imgBase.setIsVisible(true);
                imgBase.loadSource(getCachedTileBaseImageSource({
                    version,
                    themeType   : ThemeTypeId.Normal,
                    skinId      : SkinId.Neutral,
                    baseType,
                    isDark      : false,
                    shapeId     : getExisted(this._baseShapeId),
                    tickCount,
                }));
            }
        }

        {
            const decorationType = this._decorationType;
            const imgDecoration  = this.getImgDecoration();
            if (decorationType == null) {
                imgDecoration.setIsVisible(false);
            } else {
                imgDecoration.setIsVisible(true);
                imgDecoration.loadSource(getCachedTileDecorationImageSource({
                    version,
                    themeType   : ThemeTypeId.Normal,
                    skinId      : SkinId.Neutral,
                    tileDecorationType: decorationType,
                    isDark      : false,
                    shapeId     : getExisted(this._decorationShapeId),
                    tickCount,
                }));
            }
        }
    }
}
