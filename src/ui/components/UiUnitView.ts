import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import {
    getUnitAnimationTickCount,
    getCachedUnitImageSource,
    getStateIndicatorTickCount,
} from "../../common/model/CommonModel.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { getFinalSkinId2 } from "../../forceSkins/Utils.ts";
import { getCurrentTextureResolutionConfig } from "../../graphics/Utils.ts";
import {
    getUnitHp,
    getUnitCornerStateIcon,
    getUnitPromotion,
    getUnitBuff,
} from "../../helpers/ImageSource.ts";
import {
    createLazyFunc,
    getExisted,
} from "../../helpers/Misc.ts";
import type { UnitTemplateCfg } from "../../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";
import { UiContainerBase } from "./UiContainerBase.ts";
import type { IUiUnitView } from "../interfaces/IUiUnitView.ts";
import type { UiUnitViewData } from "../types/UiUnitViewData.ts";
import { getUiImageClass } from "../utils/UiFactory.ts";
import {
    ActionStateId,
    AnimationTypeId,
    CornerStateIconTypeId,
} from "../../units/Constants.ts";
import { getNormalizedHp } from "../../units/utils/Common.ts";
import { getSelfSettingsTextureVersion } from "../../users/Model.ts";
import type { DisplayObject } from "../../egret/Egret.ts";

const getResolutionConfig           = createLazyFunc(() => getCurrentTextureResolutionConfig());
const getGridWidth                  = createLazyFunc(() => getResolutionConfig().gridWidth);
const getGridHeight                 = createLazyFunc(() => getResolutionConfig().gridHeight);
const getImgUnitStateWidth          = createLazyFunc(() => getResolutionConfig().imgUnitStateWidth);
const getImgUnitStateHeight         = createLazyFunc(() => getResolutionConfig().imgUnitStateHeight);

const getImgUnitStandX              = createLazyFunc(() => getGridWidth() * 3 / 4);
const getImgUnitStandAnchorOffsetX  = createLazyFunc(() => getGridWidth() * 3 / 4);

export class UiUnitView extends UiContainerBase implements IUiUnitView {
    private readonly _imgUnit                   = new (getUiImageClass())();
    private readonly _imgHp                     = new (getUiImageClass())();
    private readonly _imgState                  = new (getUiImageClass())();
    private readonly _framesForStateAnimation   : string[] = [];

    private _viewData                           : UiUnitViewData | null = null;
    private _isDark                             = false;

    public constructor(data?: UiUnitViewData, tickCount?: number) {
        super();

        {
            const imgUnit = this._imgUnit;
            imgUnit.setIsSmoothing(false);
            imgUnit.setAnchorOffsetX(getImgUnitStandAnchorOffsetX());
            imgUnit.setX(getImgUnitStandX());
            // imgUnit.setY(GRID_HEIGHT);
            this.addChild(imgUnit as unknown as DisplayObject);
        }

        {
            const imgHp = this._imgHp;
            imgHp.setIsSmoothing(false);
            imgHp.setX(getGridWidth() - getImgUnitStateWidth() - 1 + getGridWidth() / 4);
            imgHp.setY(getGridHeight() - getImgUnitStateHeight() + getGridHeight() / 2);
            this.addChild(imgHp as unknown as DisplayObject);
        }

        {
            const imgState = this._imgState;
            imgState.setIsSmoothing(false);
            imgState.setX(0 + getGridWidth() / 4);
            imgState.setY(getGridHeight() - getImgUnitStateHeight() + getGridHeight() / 2);
            this.addChild(imgState as unknown as DisplayObject);
        }

        (data) && (this.update(data, tickCount));
    }

    public update(viewData: UiUnitViewData, tickCount?: number): void {
        this._setViewData(viewData);

        const data      = viewData.unitData;
        const gridIndex = getExisted(GridIndex.convertGridIndex(data.getGridIndex()));
        this._isDark    = data.getActionState() === ActionStateId.Acted;
        this.setX(gridIndex.getX() * getGridWidth() - getGridWidth() / 4);
        this.setY(gridIndex.getY() * getGridHeight() - getGridHeight() / 2);
        this._imgUnit.setScaleX((data.getPlayerIndex()) % 2 == 0 ? -1 : 1);
        this.updateOnAnimationTick(tickCount || getUnitAnimationTickCount());

        this._updateImageHp();
        this._resetStateAnimationFrames();
    }

    public getViewData(): UiUnitViewData | null {
        return this._viewData;
    }
    private _setViewData(data: UiUnitViewData): void {
        this._viewData = data;
    }

    public updateOnAnimationTick(tickCount: number): void {
        const data = this.getViewData();
        if (data == null) {
            return;
        }

        this._imgUnit.loadSource(getCachedUnitImageSource({
            gcData      : data.gameConfig,
            version         : getSelfSettingsTextureVersion(),
            skinId          : getFinalSkinId2(data.skinId, data.overridingSkinId),
            unitType        : data.unitData.getUnitType(),
            animationType   : AnimationTypeId.Stand,
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
        const normalizedHp  = hp == null ? null : getNormalizedHp(hp);
        const imgHp         = this._imgHp;
        if ((normalizedHp == null)                                                                      ||
            (normalizedHp >= getNormalizedHp(this._getUnitTemplateCfg().getMaxHp()))
        ) {
            imgHp.setIsVisible(false);
        } else {
            imgHp.setIsVisible(true);
            imgHp.loadSource(getUnitHp({
                version : getSelfSettingsTextureVersion(),
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
            : frames[getStateIndicatorTickCount() % framesCount]
        );
    }

    private _addFrameForCoSkill(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        const skillType = viewData.coUsingSkillType;
        if (skillType === SkillTypeId.Power) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.ActivatingCoPower,
                skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        } else if (skillType === SkillTypeId.SuperPower) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.ActivatingCoSuperPower,
                skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.CoOnboard,
                skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        } else {
            const promotion = unitData.getCurrentPromotion();
            if (promotion > 0) {
                this._framesForStateAnimation.push(getUnitPromotion({
                    version     : getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    promotion   : promotion,
                    skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.LowFuel,
                skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
                this._framesForStateAnimation.push(getUnitCornerStateIcon({
                    version     : getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : CornerStateIconTypeId.LowPrimaryAmmo,
                    skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }

        {
            const flareMaxAmmo      = cfg.getFlareMaxAmmo();
            const flareCurrentAmmo  = unitData.getFlareCurrentAmmo();
            if ((flareMaxAmmo != null) && (flareCurrentAmmo != null) && (flareCurrentAmmo <= flareMaxAmmo * 0.4)) {
                this._framesForStateAnimation.push(getUnitCornerStateIcon({
                    version     : getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : CornerStateIconTypeId.LowFlareAmmo,
                    skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.Diving,
                skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForCapture(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.isCapturingTile) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.CapturingTile,
                skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForBuild(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.isBuildingTile) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.BuildingTile,
                skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
            }));
        }
    }
    private _addFrameForLoader(): void {
        const viewData = this.getViewData();
        if (viewData == null) {
            return;
        }

        if (viewData.hasLoadedUnit) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.LoadingUnits,
                skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
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
                this._framesForStateAnimation.push(getUnitCornerStateIcon({
                    version     : getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : CornerStateIconTypeId.LowBuildMaterial,
                    skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }

        {
            const maxProduceMaterial        = cfg.getMaxProduceMaterial();
            const currentProduceMaterial    = unitData.getCurrentProduceMaterial();
            if ((maxProduceMaterial != null) && (currentProduceMaterial != null) && (currentProduceMaterial <= maxProduceMaterial * 0.4)) {
                this._framesForStateAnimation.push(getUnitCornerStateIcon({
                    version     : getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : CornerStateIconTypeId.LowProduceMaterial,
                    skinId      : getFinalSkinId2(viewData.skinId, viewData.overridingSkinId),
                }));
            }
        }
    }
    private _addFrameForBuff(): void {
        const arr = this._framesForStateAnimation;
        for (const buff of this.getViewData()?.unitData?.getBuffArray() ?? []) {
            arr.push(getUnitBuff({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                buffTypeId  : buff.getBuffTypeId(),
            }));
        }
    }

    private _getUnitTemplateCfg(): UnitTemplateCfg {
        const data = getExisted(this.getViewData());
        return getExisted(data.gameConfig.getUnitTemplateCfg(data.unitData.getUnitType()));
    }
}
