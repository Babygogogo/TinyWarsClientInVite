import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as ForceSkinsConstants from "../../forceSkins/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GraphicsUtils from "../../graphics/Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
import type * as UiInterfacesIUiImage from "../interfaces/IUiImage.ts";
import type * as UiInterfacesIUiTileView from "../interfaces/IUiTileView.ts";
import type * as UiTypesUiTileViewData from "../types/UiTileViewData.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";
import * as UsersModel from "../../users/Model.ts";

const getGridHeight = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig().gridHeight);

export class UiTileView implements UiInterfacesIUiTileView.IUiTileView {
    private readonly _imgBase       = new (UiUtilsUiFactory.getUiImageClass())();
    private readonly _imgDecoration = new (UiUtilsUiFactory.getUiImageClass())();
    private readonly _imgObject     = new (UiUtilsUiFactory.getUiImageClass())();

    private _gameConfig         : GameConfigGcData.GcData | null = null;
    private _baseType           : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    private _baseShapeId        : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    private _decorationType     : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    private _decorationShapeId  : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    private _objectType         : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    private _objectShapeId      : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    private _skinId             : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    private _overridingSkinId   : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;

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

    public init(data: UiTypesUiTileViewData.UiTileViewData): UiInterfacesIUiTileView.IUiTileView {
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

    public getImgObject(): UiInterfacesIUiImage.IUiImage {
        return this._imgObject;
    }
    public getImgBase(): UiInterfacesIUiImage.IUiImage {
        return this._imgBase;
    }
    public getImgDecoration(): UiInterfacesIUiImage.IUiImage {
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

        const version   = UsersModel.getSelfSettingsTextureVersion();
        const tickCount = CommonModelCommonModel.getTileAnimationTickCount();
        {
            const objectType    = this._objectType;
            const imgObject     = this.getImgObject();
            if (objectType == null) {
                imgObject.setIsVisible(false);
            } else {
                imgObject.setIsVisible(true);

                const overridingSkinId = this._overridingSkinId ?? -1;
                imgObject.loadSource(CommonModelCommonModel.getCachedTileObjectImageSource({
                    version     : version,
                    themeType   : TilesConstantsCommon.ThemeTypeId.Normal,
                    skinId      : overridingSkinId > 0 ? overridingSkinId : HelpersMisc.getExisted(this._skinId),
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
                imgBase.loadSource(CommonModelCommonModel.getCachedTileBaseImageSource({
                    version,
                    themeType   : TilesConstantsCommon.ThemeTypeId.Normal,
                    skinId      : ForceSkinsConstants.SkinId.Neutral,
                    baseType,
                    isDark      : false,
                    shapeId     : HelpersMisc.getExisted(this._baseShapeId),
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
                imgDecoration.loadSource(CommonModelCommonModel.getCachedTileDecorationImageSource({
                    version,
                    themeType   : TilesConstantsCommon.ThemeTypeId.Normal,
                    skinId      : ForceSkinsConstants.SkinId.Neutral,
                    tileDecorationType: decorationType,
                    isDark      : false,
                    shapeId     : HelpersMisc.getExisted(this._decorationShapeId),
                    tickCount,
                }));
            }
        }
    }
}
