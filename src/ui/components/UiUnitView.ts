import {
    Helpers_Misc,
    Common_Model_CommonModel,
    Graphics_Utils,
    ForceSkins_Utils,
    Helpers_ImageSource,
    AuxiliaryTypes_GridIndex,
    CoSkills_Constants,
    Ui_Components_UiContainerBase,
    Ui_Components_UiImage,
    type Ui_Interfaces_IUiUnitView,
    type Ui_Types_UiUnitViewData,
    Units_Constants,
    Units_Utils_Common,
    Users_Model,
    type Egret_Egret,
} from "../../internal.ts";
import type { UnitTemplateCfg } from "../../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";

const getResolutionConfig           = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig());
const getGridWidth                  = Helpers_Misc.createLazyFunc(() => getResolutionConfig().gridWidth);
const getGridHeight                 = Helpers_Misc.createLazyFunc(() => getResolutionConfig().gridHeight);
const getImgUnitStateWidth          = Helpers_Misc.createLazyFunc(() => getResolutionConfig().imgUnitStateWidth);
const getImgUnitStateHeight         = Helpers_Misc.createLazyFunc(() => getResolutionConfig().imgUnitStateHeight);

const getImgUnitStandX              = Helpers_Misc.createLazyFunc(() => getGridWidth() * 3 / 4);
const getImgUnitStandAnchorOffsetX  = Helpers_Misc.createLazyFunc(() => getGridWidth() * 3 / 4);

export class UiUnitView extends Ui_Components_UiContainerBase.UiContainerBase implements Ui_Interfaces_IUiUnitView.IUiUnitView {
    private readonly _imgUnit                   = new Ui_Components_UiImage.UiImage();
    private readonly _imgHp                     = new Ui_Components_UiImage.UiImage();
    private readonly _imgState                  = new Ui_Components_UiImage.UiImage();
    private readonly _framesForStateAnimation   : string[] = [];

    private _viewData                           : Ui_Types_UiUnitViewData.UiUnitViewData | null = null;
    private _isDark                             = false;

    public constructor(data?: Ui_Types_UiUnitViewData.UiUnitViewData, tickCount?: number) {
        super();

        {
            const imgUnit = this._imgUnit;
            imgUnit.setIsSmoothing(false);
            imgUnit.setAnchorOffsetX(getImgUnitStandAnchorOffsetX());
            imgUnit.setX(getImgUnitStandX());
            // imgUnit.setY(GRID_HEIGHT);
            this.addChild(imgUnit as unknown as Egret_Egret.DisplayObject);
        }

        {
            const imgHp = this._imgHp;
            imgHp.setIsSmoothing(false);
            imgHp.setX(getGridWidth() - getImgUnitStateWidth() - 1 + getGridWidth() / 4);
            imgHp.setY(getGridHeight() - getImgUnitStateHeight() + getGridHeight() / 2);
            this.addChild(imgHp as unknown as Egret_Egret.DisplayObject);
        }

        {
            const imgState = this._imgState;
            imgState.setIsSmoothing(false);
            imgState.setX(0 + getGridWidth() / 4);
            imgState.setY(getGridHeight() - getImgUnitStateHeight() + getGridHeight() / 2);
            this.addChild(imgState as unknown as Egret_Egret.DisplayObject);
        }

        (data) && (this.update(data, tickCount));
    }

    public update(viewData: Ui_Types_UiUnitViewData.UiUnitViewData, tickCount?: number): void {
        this._setViewData(viewData);

        const data      = viewData.unitData;
        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(data.getGridIndex()));
        this._isDark    = data.getActionState() === Units_Constants.ActionStateId.Acted;
        this.setX(gridIndex.getX() * getGridWidth() - getGridWidth() / 4);
        this.setY(gridIndex.getY() * getGridHeight() - getGridHeight() / 2);
        this._imgUnit.setScaleX((data.getPlayerIndex()) % 2 == 0 ? -1 : 1);
        this.updateOnAnimationTick(tickCount || Common_Model_CommonModel.getUnitAnimationTickCount());

        this._updateImageHp();
        this._resetStateAnimationFrames();
    }

    public getViewData(): Ui_Types_UiUnitViewData.UiUnitViewData | null {
        return this._viewData;
    }
    private _setViewData(data: Ui_Types_UiUnitViewData.UiUnitViewData): void {
        this._viewData = data;
    }

    public updateOnAnimationTick(tickCount: number): void {
        const data = this.getViewData();
        if (data == null) {
            return;
        }

        this._imgUnit.loadSource(Common_Model_CommonModel.getCachedUnitImageSource({
            gcData      : data.gameConfig,
            version         : Users_Model.getSelfSettingsTextureVersion(),
            skinId          : ForceSkins_Utils.getFinalSkinId2(data.skinId, data.overridingSkinId),
            unitType        : data.unitData.getUnitType(),
            animationType   : Units_Constants.AnimationTypeId.Stand,
            isDark          : this._isDark,
            tickCount       : tickCount,
        }));
    }

    public updateOnStateIndicatorTick(): void {
        if (this.getViewData() != null) {
            this._tickStateAnimationFrame();
        }
    }

    private _updateImageHp(): void {
        const unitData = this.getViewData()?.unitData;
        if (unitData == null) {
            return;
        }

        const hp            = unitData.getCurrentHp();
        const normalizedHp  = hp == null ? null : Units_Utils_Common.getNormalizedHp(hp);
        const imgHp         = this._imgHp;
        if ((normalizedHp == null)                                                                      ||
            (normalizedHp >= Units_Utils_Common.getNormalizedHp(this._getUnitTemplateCfg().getMaxHp()))
        ) {
            imgHp.setIsVisible(false);
        } else {
            imgHp.setIsVisible(true);
            imgHp.loadSource(Helpers_ImageSource.getUnitHp({
                version : Users_Model.getSelfSettingsTextureVersion(),
                hp      : normalizedHp,
                isDark  : this._isDark,
            }));
        }
    }
    private _resetStateAnimationFrames(): void {
        const frames    = this._framesForStateAnimation;
        frames.length   = 0;
        this._addFrameForCoSkill();
        this._addFrameForPromotion();
        this._addFrameForFuel();
        this._addFrameForAmmo();
        this._addFrameForDive();
        this._addFrameForCapture();
        this._addFrameForBuild();
        this._addFrameForLoader();
        this._addFrameForMaterial();
        this._addFrameForBuff();

        this._tickStateAnimationFrame();
    }
    private _tickStateAnimationFrame(): void {
        const frames        = this._framesForStateAnimation;
        const framesCount   = frames.length;
        this._imgState.loadSource(framesCount <= 0
            ? ``
            : frames[Common_Model_CommonModel.getStateIndicatorTickCount() % framesCount]
        );
    }

    private _addFrameForCoSkill(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        const skillType = viewData.coUsingSkillType;
        if (skillType === CoSkills_Constants.SkillTypeId.Power) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version     : Users_Model.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : Units_Constants.CornerStateIconTypeId.ActivatingCoPower,
                skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        } else if (skillType === CoSkills_Constants.SkillTypeId.SuperPower) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version     : Users_Model.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : Units_Constants.CornerStateIconTypeId.ActivatingCoSuperPower,
                skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForPromotion(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        const unitData = viewData.unitData;
        if (unitData.getIsCoOnboard()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version     : Users_Model.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : Units_Constants.CornerStateIconTypeId.CoOnboard,
                skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        } else {
            const promotion = unitData.getCurrentPromotion();
            if (promotion > 0) {
                this._framesForStateAnimation.push(Helpers_ImageSource.getUnitPromotion({
                    version     : Users_Model.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    promotion   : promotion,
                    skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }
    }
    private _addFrameForFuel(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        const fuel = viewData.unitData.getCurrentFuel();
        if ((fuel != null) && (fuel <= this._getUnitTemplateCfg().getMaxFuel() * 0.4)) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version     : Users_Model.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : Units_Constants.CornerStateIconTypeId.LowFuel,
                skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForAmmo(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        const unitData  = viewData.unitData;
        const cfg       = this._getUnitTemplateCfg();

        {
            const primaryWeaponMaxAmmo      = cfg.getPrimaryWeaponMaxAmmo();
            const primaryWeaponCurrentAmmo  = unitData.getPrimaryWeaponCurrentAmmo();
            if ((primaryWeaponMaxAmmo != null) && (primaryWeaponCurrentAmmo != null) && (primaryWeaponCurrentAmmo <= primaryWeaponMaxAmmo * 0.4)) {
                this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                    version     : Users_Model.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : Units_Constants.CornerStateIconTypeId.LowPrimaryAmmo,
                    skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }

        {
            const flareMaxAmmo      = cfg.getFlareMaxAmmo();
            const flareCurrentAmmo  = unitData.getFlareCurrentAmmo();
            if ((flareMaxAmmo != null) && (flareCurrentAmmo != null) && (flareCurrentAmmo <= flareMaxAmmo * 0.4)) {
                this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                    version     : Users_Model.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : Units_Constants.CornerStateIconTypeId.LowFlareAmmo,
                    skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }
    }
    private _addFrameForDive(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.unitData.getIsDiving()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version     : Users_Model.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : Units_Constants.CornerStateIconTypeId.Diving,
                skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForCapture(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.isCapturingTile) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version     : Users_Model.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : Units_Constants.CornerStateIconTypeId.CapturingTile,
                skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForBuild(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.isBuildingTile) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version     : Users_Model.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : Units_Constants.CornerStateIconTypeId.BuildingTile,
                skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForLoader(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.hasLoadedUnit) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version     : Users_Model.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : Units_Constants.CornerStateIconTypeId.LoadingUnits,
                skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForMaterial(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        const unitData  = viewData.unitData;
        const cfg       = this._getUnitTemplateCfg();
        {
            const maxBuildMaterial          = cfg.getMaxBuildMaterial();
            const currentBuildMaterial      = unitData.getCurrentBuildMaterial();
            if ((maxBuildMaterial != null) && (currentBuildMaterial != null) && (currentBuildMaterial <= maxBuildMaterial * 0.4)) {
                this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                    version     : Users_Model.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : Units_Constants.CornerStateIconTypeId.LowBuildMaterial,
                    skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }

        {
            const maxProduceMaterial        = cfg.getMaxProduceMaterial();
            const currentProduceMaterial    = unitData.getCurrentProduceMaterial();
            if ((maxProduceMaterial != null) && (currentProduceMaterial != null) && (currentProduceMaterial <= maxProduceMaterial * 0.4)) {
                this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                    version     : Users_Model.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : Units_Constants.CornerStateIconTypeId.LowProduceMaterial,
                    skinId      : ForceSkins_Utils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }
    }
    private _addFrameForBuff(): void {
        const arr = this._framesForStateAnimation;
        for (const buff of this.getViewData()?.unitData?.getBuffArray() ?? []) {
            arr.push(Helpers_ImageSource.getUnitBuff({
                version     : Users_Model.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                buffTypeId  : buff.getBuffTypeId(),
            }));
        }
    }

    private _getUnitTemplateCfg(): UnitTemplateCfg {
        const data = Helpers_Misc.getExisted(this.getViewData());
        return Helpers_Misc.getExisted(data.gameConfig.getUnitTemplateCfg(data.unitData.getUnitType()));
    }
}
