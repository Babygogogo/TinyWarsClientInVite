import {
    Helpers_Misc,
    Common_Model_CommonModel,
    Graphics_Utils,
    ForceSkins_Constants,
    Tiles_Constants_Common,
    Ui_Components_UiImage,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiTileView,
    type Ui_Types_UiTileViewData,
    type AuxiliaryTypes_AuxiliaryTypes,
    Users_Model,
} from "../../internal.ts";

const getGridHeight = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig().gridHeight);

export class UiTileView implements Ui_Interfaces_IUiTileView.IUiTileView {
    private readonly _imgBase       = new Ui_Components_UiImage.UiImage();
    private readonly _imgDecoration = new Ui_Components_UiImage.UiImage();
    private readonly _imgObject     = new Ui_Components_UiImage.UiImage();

    private _gameConfig         : GameConfigs_GameConfig.GameConfig | null = null;
    private _baseType           : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private _baseShapeId        : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private _decorationType     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private _decorationShapeId  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private _objectType         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private _objectShapeId      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private _skinId             : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    private _overridingSkinId   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

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

    public init(data: Ui_Types_UiTileViewData.UiTileViewData): Ui_Interfaces_IUiTileView.IUiTileView {
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

    public getImgObject(): Ui_Interfaces_IUiImage.IUiImage {
        return this._imgObject;
    }
    public getImgBase(): Ui_Interfaces_IUiImage.IUiImage {
        return this._imgBase;
    }
    public getImgDecoration(): Ui_Interfaces_IUiImage.IUiImage {
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

        const version   = Users_Model.getSelfSettingsTextureVersion();
        const tickCount = Common_Model_CommonModel.getTileAnimationTickCount();
        {
            const objectType    = this._objectType;
            const imgObject     = this.getImgObject();
            if (objectType == null) {
                imgObject.setIsVisible(false);
            } else {
                imgObject.setIsVisible(true);

                const overridingSkinId = this._overridingSkinId ?? -1;
                imgObject.loadSource(Common_Model_CommonModel.getCachedTileObjectImageSource({
                    version     : version,
                    themeType   : Tiles_Constants_Common.ThemeTypeId.Normal,
                    skinId      : overridingSkinId > 0 ? overridingSkinId : Helpers_Misc.getExisted(this._skinId),
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
                imgBase.loadSource(Common_Model_CommonModel.getCachedTileBaseImageSource({
                    version,
                    themeType   : Tiles_Constants_Common.ThemeTypeId.Normal,
                    skinId      : ForceSkins_Constants.SkinId.Neutral,
                    baseType,
                    isDark      : false,
                    shapeId     : Helpers_Misc.getExisted(this._baseShapeId),
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
                imgDecoration.loadSource(Common_Model_CommonModel.getCachedTileDecorationImageSource({
                    version,
                    themeType   : Tiles_Constants_Common.ThemeTypeId.Normal,
                    skinId      : ForceSkins_Constants.SkinId.Neutral,
                    tileDecorationType: decorationType,
                    isDark      : false,
                    shapeId     : Helpers_Misc.getExisted(this._decorationShapeId),
                    tickCount,
                }));
            }
        }
    }
}
