import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import {
    getIsUnitFlashVisible,
    getCachedUnitFlashImageSource,
    getCachedUnitImageSource,
    getUnitAnimationTickCount,
    getStateIndicatorTickCount,
} from "../common/model/CommonModel.ts";
import { SkillTypeId } from "../coSkills/Constants.ts";
import { getFinalSkinId } from "../forceSkins/Utils.ts";
import { getRwWarBaseClass } from "../gameHelpers/GhFactory.ts";
import { getCurrentTextureResolutionConfig } from "../graphics/Utils.ts";
import { getUnitHp, getUnitCornerStateIcon, getUnitPromotion, getUnitBuff } from "../helpers/ImageSource.ts";
import { createLazyFunc, getExisted, newError } from "../helpers/Misc.ts";
import { removeEventListeners, addEventListeners } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { Listener } from "../notifications/Types.ts";
import { MaxValue } from "../numbers/Constants.ts";
import type { GridIndexAndPathInfo } from "../proto/schema/CommonProto/Structure/GridIndexAndPathInfo.ts";
import { ShortSfxCode } from "../sounds/Constants.ts";
import { playLongSfxForMoveUnit, playShortSfx, fadeoutLongSfxForMoveUnit } from "../sounds/SoundPlayer.ts";
import { getBgmSfxCfg } from "../sounds/Utils.ts";
import { Executor } from "../tween/Executor.ts";
import { UiContainer } from "../ui/components/UiContainer.ts";
import { getUiImageClass } from "../ui/utils/UiFactory.ts";
import { AnimationTypeId, ActionStateId, CornerStateIconTypeId } from "./Constants.ts";
import type { IUnit } from "./IUnit.ts";
import type { IUnitView } from "./IUnitView.ts";
import {
    getSelfSettingsIsUnitFlickeringOnFullEnergy,
    getSelfSettingsTextureVersion,
    getSelfSettingsUnitMoveAniSpeedMultiplierPct,
} from "../users/Model.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { checkIsUnitOnMapVisibleToTeams } from "../visibilities/Utils.ts";

const getResolutionConfig           = createLazyFunc(() =>  getCurrentTextureResolutionConfig());
const getGridWidth                  = createLazyFunc(() =>  getResolutionConfig().gridWidth);
const getGridHeight                 = createLazyFunc(() =>  getResolutionConfig().gridHeight);
const getImgUnitStateWidth          = createLazyFunc(() =>  getResolutionConfig().imgUnitStateWidth);
const getImgUnitStateHeight         = createLazyFunc(() =>  getResolutionConfig().imgUnitStateHeight);

const getImgUnitStandAnchorOffsetX  = createLazyFunc(() => getGridWidth() * 3 / 4);
const getImgUnitStandAnchorOffsetY  = createLazyFunc(() => getGridHeight() / 2);
const getImgUnitStandX              = createLazyFunc(() => getGridWidth() * 2 / 4);
const AIMING_TIME_MS                = 500;

export class UnitView extends UiContainer implements IUnitView {
    private _imgHp      = new (getUiImageClass())();
    private _imgState   = new (getUiImageClass())();
    private _imgUnit    = new (getUiImageClass())();
    private _imgFlash   = new (getUiImageClass())();

    private _unit                       : IUnit | null = null;
    private _animationType              = AnimationTypeId.Stand;
    private _isDark                     = false;
    private _framesForStateAnimation    : string[]  = [];

    private _notifyListeners: Listener[] = [
        { type: TypeId.UnitAnimationTick,            callback: this._onNotifyUnitAnimationTick },
        { type: TypeId.StateIndicatorTick,           callback: this._onNotifyUnitStateIndicatorTick },
        { type: TypeId.UnitFlashTick,                callback: this._onNotifyUnitFlashTick },
        { type: TypeId.BwOverridingSkinIdChanged,    callback: this._onNotifyBwOverridingSkinIdChanged },
    ];

    public constructor() {
        super();

        {
            const imgUnit = this._imgUnit;
            imgUnit.setIsSmoothing(false);
            imgUnit.setAnchorOffsetX(getImgUnitStandAnchorOffsetX());
            imgUnit.setAnchorOffsetY(getImgUnitStandAnchorOffsetY());
            imgUnit.setX(getImgUnitStandX());
            this.addUiChild(imgUnit);
        }

        {
            const imgFlash = this._imgFlash;
            imgFlash.setIsSmoothing(false);
            imgFlash.setAnchorOffsetX(getImgUnitStandAnchorOffsetX());
            imgFlash.setAnchorOffsetY(getImgUnitStandAnchorOffsetY());
            imgFlash.setX(getImgUnitStandX());
            imgFlash.setAlpha(0.3);
            imgFlash.setIsVisible(false);
            this.addUiChild(imgFlash);
        }

        {
            const imgState = this._imgState;
            imgState.setIsSmoothing(false);
            imgState.setX(0);
            imgState.setY(getGridHeight() - getImgUnitStateHeight());
            this.addUiChild(imgState);
        }

        {
            const imgHp = this._imgHp;
            imgHp.setIsSmoothing(false);
            imgHp.setX(getGridWidth() - getImgUnitStateWidth() - 1);
            imgHp.setY(getGridHeight() - getImgUnitStateHeight());
            this.addUiChild(imgHp);
        }
    }

    public init(unit: IUnit): IUnitView {
        this._setUnit(unit);

        return this;
    }

    public startRunningView(): IUnitView {
        removeEventListeners(this._notifyListeners, this);
        addEventListeners(this._notifyListeners, this);

        this.resetAllViews();

        return this;
    }
    public stopRunningView(): void {
        removeEventListeners(this._notifyListeners, this);
    }

    private _onNotifyUnitAnimationTick(): void {
        const war = this.getUnit()?.getWar();
        if ((war instanceof getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
            return;
        }

        this._tickUnitAnimationFrame();
    }
    private _onNotifyUnitStateIndicatorTick(): void {
        const war = this.getUnit()?.getWar();
        if ((war instanceof getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
            return;
        }

        this._tickStateAnimationFrame();
    }
    private _onNotifyUnitFlashTick(): void {
        const unit = this.getUnit();
        if (unit == null) {
            return;
        }

        const war = unit.getWar();
        if ((war instanceof getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
            return;
        }

        const img = this._imgFlash;
        if ((this._animationType !== AnimationTypeId.Stand)               ||
            (!getIsUnitFlashVisible())                   ||
            (!getSelfSettingsIsUnitFlickeringOnFullEnergy())
        ) {
            img.setIsVisible(false);
            return;
        }

        const player            = unit.getPlayer();
        const powerEnergy       = player.getCoPowerEnergy();
        const superPowerEnergy  = player.getCoSuperPowerEnergy();
        if ((powerEnergy == null) && (superPowerEnergy == null)) {
            img.setIsVisible(false);
            return;
        }

        if (player.getCoCurrentEnergy() < Math.min(powerEnergy ?? MaxValue, superPowerEnergy ?? MaxValue)) {
            img.setIsVisible(false);
            return;
        }

        img.setIsVisible(true);
        img.loadSource(getCachedUnitFlashImageSource({
            version     : getSelfSettingsTextureVersion(),
            skinId      : getFinalSkinId(war, player.getPlayerIndex()),
            unitType    : unit.getUnitType(),
        }));
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._resetStateAnimationFrames();
    }

    private _setUnit(unit: IUnit): void {
        this._unit = unit;
    }
    public getUnit(): IUnit | null {
        return this._unit;
    }

    public resetAllViews(): void {
        this._isDark = getExisted(this.getUnit()).getActionState() === ActionStateId.Acted;
        this._resetImgUnitFlippedX();
        this._resetStateAnimationFrames();
        this.showUnitAnimation(AnimationTypeId.Stand);
        this.updateImageHp();
    }

    public showUnitAnimation(type: AnimationTypeId): void {
        this._animationType = type;
        this._tickUnitAnimationFrame();
    }
    private _tickUnitAnimationFrame(): void {
        const unit = getExisted(this.getUnit());
        this._imgUnit.loadSource(getCachedUnitImageSource({
            gcData      : unit.getGcData(),
            version         : getSelfSettingsTextureVersion(),
            isDark          : this._isDark,
            animationType   : this._animationType,
            tickCount       : getUnitAnimationTickCount(),
            skinId          : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            unitType        : unit.getUnitType(),
        }));
    }

    public updateImageHp(): void {
        const unit          = getExisted(this.getUnit());
        const normalizedHp  = unit.getNormalizedCurrentHp();
        const img           = this._imgHp;
        if (normalizedHp >= unit.getNormalizedMaxHp()) {
            img.setIsVisible(false);
        } else {
            img.setIsVisible(true);
            img.loadSource(getUnitHp({
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
        const framesCount = this._framesForStateAnimation.length;
        this._imgState.loadSource(framesCount <= 0
            ? ``
            : this._framesForStateAnimation[getStateIndicatorTickCount() % framesCount]
        );
    }

    protected _getIsDark(): boolean {
        return this._isDark;
    }
    protected _getFramesForStateAnimation(): string[] {
        return this._framesForStateAnimation;
    }

    public moveAlongPath({ path, isDiving, isBlocked, aiming, updateViewAfterMove }: {
        path                : GridIndex[];
        isDiving            : boolean;
        isBlocked           : boolean;
        aiming              : GridIndex | null;
        updateViewAfterMove : boolean;
    }): Promise<void> {
        this.showUnitAnimation(AnimationTypeId.MoveHorizontal);

        const startingPoint = path[0].createPointByGridIndex();
        this.setX(startingPoint.x);
        this.setY(startingPoint.y);

        const unit                  = getExisted(this.getUnit());
        const war                   = unit.getWar();
        const playerIndex           = unit.getPlayerIndex();
        const unitType              = unit.getUnitType();
        const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const gameConfig            = war.getGcData();
        const isAlwaysVisible       = watcherTeamIndexes.has(unit.getTeamIndex());
        const tween                 = Executor.get(this as IUnitView);
        if (isAlwaysVisible) {
            this.setIsVisible(true);
        }

        const moveSfxCfg = getExisted(getBgmSfxCfg(getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveSfx())));
        if ((path.length > 0) || (aiming)) {
            playLongSfxForMoveUnit(moveSfxCfg);
        }

        for (let i = 1; i < path.length; ++i) {
            const gridIndex     = path[i];
            const prevGridIndex = path[i - 1];
            const currentX      = gridIndex.getX();
            const previousX     = prevGridIndex.getX();
            if (currentX < previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(true);
                    this.showUnitAnimation(AnimationTypeId.MoveHorizontal);
                });
            } else if (currentX > previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(false);
                    this.showUnitAnimation(AnimationTypeId.MoveHorizontal);
                });
            } else {
                const currentY  = gridIndex.getY();
                const previousY = prevGridIndex.getY();
                if (currentY < previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(AnimationTypeId.MoveUp);
                    });
                } else if (currentY > previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(AnimationTypeId.MoveDown);
                    });
                } else {
                    throw newError(`Invalid move path.`);
                }
            }

            if (!isAlwaysVisible) {
                if (isDiving) {
                    tween.call(() => {
                        this.setIsVisible(
                            (i === path.length - 1 )                                    &&
                            (checkIsUnitOnMapVisibleToTeams({
                                war                 : war,
                                gridIndex           : gridIndex,
                                unitType            : unitType,
                                isDiving            : isDiving,
                                isInvisible         : unit.checkIsInvisible(gridIndex),
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }))
                        );
                    });
                } else {
                    tween.call(() => {
                        this.setIsVisible(
                            (checkIsUnitOnMapVisibleToTeams({
                                war                 : war,
                                gridIndex           : path[i - 1],
                                unitType            : unitType,
                                isDiving            : isDiving,
                                isInvisible         : unit.checkIsInvisible(path[i - 1]),
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }))                                                             ||
                            (checkIsUnitOnMapVisibleToTeams({
                                war                 : war,
                                gridIndex           : gridIndex,
                                unitType            : unitType,
                                isDiving            : isDiving,
                                isInvisible         : unit.checkIsInvisible(gridIndex),
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }))
                        );
                    });
                }
            }

            const point = gridIndex.createPointByGridIndex();
            tween.to(
                { customX: point.x, customY: point.y },
                20000 / Math.max(100, getSelfSettingsUnitMoveAniSpeedMultiplierPct())
            );
        }

        const endingGridIndex = path[path.length - 1];
        return new Promise<void>(resolve => {
            if (!aiming) {
                tween.call(() => {
                    this._resetImgUnitFlippedX();
                    if ((isBlocked)                                         &&
                        (checkIsUnitOnMapVisibleToTeams({
                            war                 : war,
                            unitType            : unitType,
                            isDiving            : isDiving,
                            isInvisible         : unit.checkIsInvisible(endingGridIndex),
                            gridIndex           : endingGridIndex,
                            unitPlayerIndex     : playerIndex,
                            observerTeamIndexes : watcherTeamIndexes,
                        }))
                    ) {
                        war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        playShortSfx(ShortSfxCode.Block);
                    }
                    fadeoutLongSfxForMoveUnit(moveSfxCfg);

                    if (updateViewAfterMove) {
                        unit.updateView();
                    }

                    resolve();
                });
            } else {
                const cursor = war.getCursor();
                tween.call(() => {
                    cursor.setIsMovableByTouches(false);
                    cursor.setIsVisible(false);
                    war.getGridVisualEffect().showEffectAiming(aiming, AIMING_TIME_MS);
                })
                .wait(AIMING_TIME_MS)
                .call(() => {
                    cursor.setIsMovableByTouches(true);
                    cursor.setIsVisible(true);
                    this._resetImgUnitFlippedX();
                    if ((isBlocked)                                         &&
                        (checkIsUnitOnMapVisibleToTeams({
                            war                 : war,
                            unitType            : unitType,
                            isDiving            : isDiving,
                            isInvisible         : unit.checkIsInvisible(endingGridIndex),
                            gridIndex           : endingGridIndex,
                            unitPlayerIndex     : playerIndex,
                            observerTeamIndexes : watcherTeamIndexes,
                        }))
                    ) {
                        war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        playShortSfx(ShortSfxCode.Block);
                    }
                    fadeoutLongSfxForMoveUnit(moveSfxCfg);

                    if (updateViewAfterMove) {
                        unit.updateView();
                    }

                    resolve();
                });
            }
        });
    }
    public moveAlongExtraPath({ path, aiming, deleteViewAfterMoving }: {
        path                    : GridIndexAndPathInfo[];
        aiming                  : GridIndex | null;
        deleteViewAfterMoving   : boolean;
    }): Promise<void> {
        this.showUnitAnimation(AnimationTypeId.MoveHorizontal);

        const startingPoint = getExisted(GridIndex.convertGridIndex(path[0].getGridIndex())).createPointByGridIndex();
        this.setX(startingPoint.x);
        this.setY(startingPoint.y);

        const unit          = getExisted(this.getUnit());
        const war           = unit.getWar();
        const unitType      = unit.getUnitType();
        const tween         = Executor.get(this as IUnitView);
        const gameConfig    = war.getGcData();
        const moveSfxCfg    = getExisted(getBgmSfxCfg(getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveSfx())));
        if ((path.length > 0) || (aiming)) {
            playLongSfxForMoveUnit(moveSfxCfg);
        }

        for (let i = 1; i < path.length; ++i) {
            const node          = path[i];
            const gridIndex     = getExisted(GridIndex.convertGridIndex(node.getGridIndex()), ClientErrorCode.BwUnitView_MoveAlongExtraPath_01);
            const currentX      = gridIndex.getX();
            const previousNode  = path[i - 1];
            const prevGridIndex = getExisted(previousNode.getGridIndex(),  ClientErrorCode.BwUnitView_MoveAlongExtraPath_02);
            const previousX     = getExisted(prevGridIndex.getX(), ClientErrorCode.BwUnitView_MoveAlongExtraPath_03);
            if (currentX < previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(true);
                    this.showUnitAnimation(AnimationTypeId.MoveHorizontal);
                });
            } else if (currentX > previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(false);
                    this.showUnitAnimation(AnimationTypeId.MoveHorizontal);
                });
            } else {
                const currentY  = gridIndex.getY();
                const previousY = getExisted(prevGridIndex.getY(),  ClientErrorCode.BwUnitView_MoveAlongExtraPath_04);
                if (currentY < previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(AnimationTypeId.MoveUp);
                    });
                } else if (currentY > previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(AnimationTypeId.MoveDown);
                    });
                } else {
                    throw newError(`Invalid move path.`);
                }
            }

            tween.call(() => {
                this.setIsVisible((!!previousNode.getIsVisible()) || (!!node.getIsVisible()));
            });

            const point = gridIndex.createPointByGridIndex();
            tween.to(
                { customX: point.x, customY: point.y },
                20000 / Math.max(100, getSelfSettingsUnitMoveAniSpeedMultiplierPct())
            );
        }

        const endingNode        = path[path.length - 1];
        const isBlockedInEnd    = !!endingNode.getIsBlocked();
        const isVisibleInEnd    = !!endingNode.getIsVisible();
        const unitMapView       = war.getUnitMap().getView();
        if ((deleteViewAfterMoving) && (!isVisibleInEnd)) {
            tween.call(() => {
                unitMapView.removeUnit(this);
            });
        }

        const endingGridIndex = getExisted(GridIndex.convertGridIndex(endingNode.getGridIndex()), ClientErrorCode.BwUnitView_MoveAlongExtraPath_03);
        return new Promise<void>(resolve => {
            if (!aiming) {
                tween.call(() => {
                    this._resetImgUnitFlippedX();
                    if ((isBlockedInEnd) && (isVisibleInEnd)) {
                        war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        playShortSfx(ShortSfxCode.Block);
                    }
                    (deleteViewAfterMoving) && (unitMapView.removeUnit(this));

                    fadeoutLongSfxForMoveUnit(moveSfxCfg);

                    resolve();
                });
            } else {
                const cursor = war.getCursor();
                tween.call(() => {
                    cursor.setIsMovableByTouches(false);
                    cursor.setIsVisible(false);
                    war.getGridVisualEffect().showEffectAiming(aiming, AIMING_TIME_MS);
                })
                .wait(AIMING_TIME_MS)
                .call(() => {
                    cursor.setIsMovableByTouches(true);
                    cursor.setIsVisible(true);

                    this._resetImgUnitFlippedX();
                    if ((isBlockedInEnd) && (isVisibleInEnd)) {
                        war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        playShortSfx(ShortSfxCode.Block);
                    }
                    (deleteViewAfterMoving) && (unitMapView.removeUnit(this));

                    fadeoutLongSfxForMoveUnit(moveSfxCfg);

                    resolve();
                });
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _addFrameForCoSkill(): void {
        const unit      = getExisted(this.getUnit());
        const skillType = unit.getPlayer().getCoUsingSkillType();
        if (skillType === SkillTypeId.Power) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.ActivatingCoPower,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        } else if (skillType === SkillTypeId.SuperPower) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.ActivatingCoSuperPower,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForPromotion(): void {
        const unit = getExisted(this.getUnit());
        if (unit.getIsCoOnboard()) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.CoOnboard,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        } else {
            const promotion = unit.getCurrentPromotion();
            if (promotion > 0) {
                this._framesForStateAnimation.push(getUnitPromotion({
                    version     : getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    promotion   : promotion,
                    skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
                }));
            }
        }
    }
    private _addFrameForFuel(): void {
        const unit = getExisted(this.getUnit());
        if (unit.checkIsFuelInShort()) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.LowFuel,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForAmmo(): void {
        const unit = getExisted(this.getUnit());
        if (unit.checkIsPrimaryWeaponAmmoInShort()) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.LowPrimaryAmmo,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
        if (unit.checkIsFlareAmmoInShort()) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.LowFlareAmmo,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForDive(): void {
        const unit = getExisted(this.getUnit());
        if (unit.getIsDiving()) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.Diving,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForCapture(): void {
        const unit = getExisted(this.getUnit());
        if (unit.checkIsCapturingTile()) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.CapturingTile,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForBuild(): void {
        const unit = getExisted(this.getUnit());
        if (unit.checkIsBuildingTile()) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.BuildingTile,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForLoader(): void {
        const unit  = getExisted(this.getUnit());
        const war   = unit.getWar();
        if ((war) && (unit.getMaxLoadUnitsCount())) {
            if (unit.getLoadedUnitsCount() > 0) {
                this._framesForStateAnimation.push(getUnitCornerStateIcon({
                    version     : getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : CornerStateIconTypeId.LoadingUnits,
                    skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
                }));
            }
        }
    }
    private _addFrameForMaterial(): void {
        const unit = getExisted(this.getUnit());
        if (unit.checkIsBuildMaterialInShort()) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.LowBuildMaterial,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
        if (unit.checkIsProduceMaterialInShort()) {
            this._framesForStateAnimation.push(getUnitCornerStateIcon({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : CornerStateIconTypeId.LowProduceMaterial,
                skinId      : getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForBuff(): void {
        const arr = this._framesForStateAnimation;
        for (const buff of getExisted(this.getUnit()).getBuffList()) {
            arr.push(getUnitBuff({
                version     : getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                buffTypeId  : buff.getBuffTypeId(),
            }));
        }
    }

    private _setImgUnitFlippedX(isFlipped: boolean): void {
        const scaleX = isFlipped ? -1 : 1;
        this._imgUnit.setScaleX(scaleX);
        this._imgFlash.setScaleX(scaleX);
    }
    private _resetImgUnitFlippedX(): void {
        this._setImgUnitFlippedX(getExisted(this.getUnit()?.getPlayerIndex()) % 2 === 0);
    }
}
