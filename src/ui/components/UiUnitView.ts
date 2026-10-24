import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as CommonModelCommonModel from "../../common/model/CommonModel.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GraphicsUtils from "../../graphics/Utils.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoConfigUnitTemplateCfg from "../../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";
import * as UiComponentsUiContainerBase from "./UiContainerBase.ts";
import type * as UiInterfacesIUiUnitView from "../interfaces/IUiUnitView.ts";
import type * as UiTypesUiUnitViewData from "../types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import * as UnitsUtilsCommon from "../../units/utils/Common.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

const getResolutionConfig           = HelpersMisc.createLazyFunc(() => GraphicsUtils.getCurrentTextureResolutionConfig());
const getGridWidth                  = HelpersMisc.createLazyFunc(() => getResolutionConfig().gridWidth);
const getGridHeight                 = HelpersMisc.createLazyFunc(() => getResolutionConfig().gridHeight);
const getImgUnitStateWidth          = HelpersMisc.createLazyFunc(() => getResolutionConfig().imgUnitStateWidth);
const getImgUnitStateHeight         = HelpersMisc.createLazyFunc(() => getResolutionConfig().imgUnitStateHeight);

const getImgUnitStandX              = HelpersMisc.createLazyFunc(() => getGridWidth() * 3 / 4);
const getImgUnitStandAnchorOffsetX  = HelpersMisc.createLazyFunc(() => getGridWidth() * 3 / 4);

export class UiUnitView extends UiComponentsUiContainerBase.UiContainerBase implements UiInterfacesIUiUnitView.IUiUnitView {
    private readonly _imgUnit                   = new (UiUtilsUiFactory.getUiImageClass())();
    private readonly _imgHp                     = new (UiUtilsUiFactory.getUiImageClass())();
    private readonly _imgState                  = new (UiUtilsUiFactory.getUiImageClass())();
    private readonly _framesForStateAnimation   : string[] = [];

    private _viewData                           : UiTypesUiUnitViewData.UiUnitViewData | null = null;
    private _isDark                             = false;

    public constructor(data?: UiTypesUiUnitViewData.UiUnitViewData, tickCount?: number) {
        super();

        {
            const imgUnit = this._imgUnit;
            imgUnit.setIsSmoothing(false);
            imgUnit.setAnchorOffsetX(getImgUnitStandAnchorOffsetX());
            imgUnit.setX(getImgUnitStandX());
            // imgUnit.setY(GRID_HEIGHT);
            this.addChild(imgUnit as unknown as VendorEgretEgret.DisplayObject);
        }

        {
            const imgHp = this._imgHp;
            imgHp.setIsSmoothing(false);
            imgHp.setX(getGridWidth() - getImgUnitStateWidth() - 1 + getGridWidth() / 4);
            imgHp.setY(getGridHeight() - getImgUnitStateHeight() + getGridHeight() / 2);
            this.addChild(imgHp as unknown as VendorEgretEgret.DisplayObject);
        }

        {
            const imgState = this._imgState;
            imgState.setIsSmoothing(false);
            imgState.setX(0 + getGridWidth() / 4);
            imgState.setY(getGridHeight() - getImgUnitStateHeight() + getGridHeight() / 2);
            this.addChild(imgState as unknown as VendorEgretEgret.DisplayObject);
        }

        (data) && (this.update(data, tickCount));
    }

    public update(viewData: UiTypesUiUnitViewData.UiUnitViewData, tickCount?: number): void {
        this._setViewData(viewData);

        const data      = viewData.unitData;
        const gridIndex = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(data.getGridIndex()));
        this._isDark    = data.getActionState() === UnitsConstants.ActionStateId.Acted;
        this.setX(gridIndex.getX() * getGridWidth() - getGridWidth() / 4);
        this.setY(gridIndex.getY() * getGridHeight() - getGridHeight() / 2);
        this._imgUnit.setScaleX((data.getPlayerIndex() ?? 0) % 2 == 0 ? -1 : 1);
        this.updateOnAnimationTick(tickCount || CommonModelCommonModel.getUnitAnimationTickCount());

        this._updateImageHp();
        this._resetStateAnimationFrames();
    }

    public getViewData(): UiTypesUiUnitViewData.UiUnitViewData | null {
        return this._viewData;
    }
    private _setViewData(data: UiTypesUiUnitViewData.UiUnitViewData): void {
        this._viewData = data;
    }

    public updateOnAnimationTick(tickCount: number): void {
        const data = this.getViewData();
        if (data == null) {
            return;
        }

        this._imgUnit.loadSource(CommonModelCommonModel.getCachedUnitImageSource({
            gcData      : data.gameConfig,
            version         : UsersModel.getSelfSettingsTextureVersion(),
            skinId          : ForceSkinsUtils.getFinalSkinId2(data.skinId, data.overridingSkinId),
            unitType        : data.unitData.getUnitType(),
            animationType   : UnitsConstants.AnimationTypeId.Stand,
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
        const normalizedHp  = hp == null ? null : UnitsUtilsCommon.getNormalizedHp(hp);
        const imgHp         = this._imgHp;
        if ((normalizedHp == null)                                                                      ||
            (normalizedHp >= UnitsUtilsCommon.getNormalizedHp(this._getUnitTemplateCfg().getMaxHp()))
        ) {
            imgHp.setIsVisible(false);
        } else {
            imgHp.setIsVisible(true);
            imgHp.loadSource(HelpersImageSource.getUnitHp({
                version : UsersModel.getSelfSettingsTextureVersion(),
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
            : frames[CommonModelCommonModel.getStateIndicatorTickCount() % framesCount]
        );
    }

    private _addFrameForCoSkill(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        const skillType = viewData.coUsingSkillType;
        if (skillType === CoSkillsConstants.SkillTypeId.Power) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.ActivatingCoPower,
                skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        } else if (skillType === CoSkillsConstants.SkillTypeId.SuperPower) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.ActivatingCoSuperPower,
                skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.CoOnboard,
                skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        } else {
            const promotion = unitData.getCurrentPromotion();
            if (promotion > 0) {
                this._framesForStateAnimation.push(HelpersImageSource.getUnitPromotion({
                    version     : UsersModel.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    promotion   : promotion,
                    skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowFuel,
                skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
                this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                    version     : UsersModel.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowPrimaryAmmo,
                    skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }

        {
            const flareMaxAmmo      = cfg.getFlareMaxAmmo();
            const flareCurrentAmmo  = unitData.getFlareCurrentAmmo();
            if ((flareMaxAmmo != null) && (flareCurrentAmmo != null) && (flareCurrentAmmo <= flareMaxAmmo * 0.4)) {
                this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                    version     : UsersModel.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowFlareAmmo,
                    skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.Diving,
                skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForCapture(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.isCapturingTile) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.CapturingTile,
                skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForBuild(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.isBuildingTile) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.BuildingTile,
                skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForLoader(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.hasLoadedUnit) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.LoadingUnits,
                skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
                this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                    version     : UsersModel.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowBuildMaterial,
                    skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }

        {
            const maxProduceMaterial        = cfg.getMaxProduceMaterial();
            const currentProduceMaterial    = unitData.getCurrentProduceMaterial();
            if ((maxProduceMaterial != null) && (currentProduceMaterial != null) && (currentProduceMaterial <= maxProduceMaterial * 0.4)) {
                this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                    version     : UsersModel.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowProduceMaterial,
                    skinId      : ForceSkinsUtils.getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }
    }
    private _addFrameForBuff(): void {
        const arr = this._framesForStateAnimation;
        for (const buff of this.getViewData()?.unitData?.getBuffArray() ?? []) {
            arr.push(HelpersImageSource.getUnitBuff({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                buffTypeId  : buff.getBuffTypeId(),
            }));
        }
    }

    private _getUnitTemplateCfg(): ProtoSchemaCommonProtoConfigUnitTemplateCfg.UnitTemplateCfg {
        const data = HelpersMisc.getExisted(this.getViewData());
        return HelpersMisc.getExisted(data.gameConfig.getUnitTemplateCfg(data.unitData.getUnitType()));
    }
}
