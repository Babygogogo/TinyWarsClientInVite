import * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import * as CommonModelCommonModel from "../common/model/CommonModel.ts";
import * as CoSkillsConstants from "../coSkills/Constants.ts";
import * as ForceSkinsUtils from "../forceSkins/Utils.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as GraphicsUtils from "../graphics/Utils.ts";
import * as HelpersImageSource from "../helpers/ImageSource.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as NotificationsTypes from "../notifications/Types.ts";
import * as NumbersConstants from "../numbers/Constants.ts";
import type * as ProtoSchemaCommonProtoStructureGridIndexAndPathInfo from "../proto/schema/CommonProto/Structure/GridIndexAndPathInfo.ts";
import * as SoundsConstants from "../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../sounds/SoundPlayer.ts";
import * as SoundsUtils from "../sounds/Utils.ts";
import * as TweenExecutor from "../tween/Executor.ts";
import * as UiComponentsUiContainer from "../ui/components/UiContainer.ts";
import * as UiUtilsUiFactory from "../ui/utils/UiFactory.ts";
import * as UnitsConstants from "./Constants.ts";
import type * as UnitsIUnit from "./IUnit.ts";
import type * as UnitsIUnitView from "./IUnitView.ts";
import * as UsersModel from "../users/Model.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../visibilities/Utils.ts";

const getResolutionConfig           = HelpersMisc.createLazyFunc(() =>  GraphicsUtils.getCurrentTextureResolutionConfig());
const getGridWidth                  = HelpersMisc.createLazyFunc(() =>  getResolutionConfig().gridWidth);
const getGridHeight                 = HelpersMisc.createLazyFunc(() =>  getResolutionConfig().gridHeight);
const getImgUnitStateWidth          = HelpersMisc.createLazyFunc(() =>  getResolutionConfig().imgUnitStateWidth);
const getImgUnitStateHeight         = HelpersMisc.createLazyFunc(() =>  getResolutionConfig().imgUnitStateHeight);

const getImgUnitStandAnchorOffsetX  = HelpersMisc.createLazyFunc(() => getGridWidth() * 3 / 4);
const getImgUnitStandAnchorOffsetY  = HelpersMisc.createLazyFunc(() => getGridHeight() / 2);
const getImgUnitStandX              = HelpersMisc.createLazyFunc(() => getGridWidth() * 2 / 4);
const AIMING_TIME_MS                = 500;

export class UnitView extends UiComponentsUiContainer.UiContainer implements UnitsIUnitView.IUnitView {
    private _imgHp      = new (UiUtilsUiFactory.getUiImageClass())();
    private _imgState   = new (UiUtilsUiFactory.getUiImageClass())();
    private _imgUnit    = new (UiUtilsUiFactory.getUiImageClass())();
    private _imgFlash   = new (UiUtilsUiFactory.getUiImageClass())();

    private _unit                       : UnitsIUnit.IUnit | null = null;
    private _animationType              = UnitsConstants.AnimationTypeId.Stand;
    private _isDark                     = false;
    private _framesForStateAnimation    : string[]  = [];

    private _notifyListeners: NotificationsTypes.Listener[] = [
        { type: NotificationsTypeId.TypeId.UnitAnimationTick,            callback: this._onNotifyUnitAnimationTick },
        { type: NotificationsTypeId.TypeId.StateIndicatorTick,           callback: this._onNotifyUnitStateIndicatorTick },
        { type: NotificationsTypeId.TypeId.UnitFlashTick,                callback: this._onNotifyUnitFlashTick },
        { type: NotificationsTypeId.TypeId.BwOverridingSkinIdChanged,    callback: this._onNotifyBwOverridingSkinIdChanged },
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

    public init(unit: UnitsIUnit.IUnit): UnitsIUnitView.IUnitView {
        this._setUnit(unit);

        return this;
    }

    public startRunningView(): UnitsIUnitView.IUnitView {
        NotificationsDispatcher.removeEventListeners(this._notifyListeners, this);
        NotificationsDispatcher.addEventListeners(this._notifyListeners, this);

        this.resetAllViews();

        return this;
    }
    public stopRunningView(): void {
        NotificationsDispatcher.removeEventListeners(this._notifyListeners, this);
    }

    private _onNotifyUnitAnimationTick(): void {
        const war = this.getUnit()?.getWar();
        if ((war instanceof GameHelpersGhFactory.getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
            return;
        }

        this._tickUnitAnimationFrame();
    }
    private _onNotifyUnitStateIndicatorTick(): void {
        const war = this.getUnit()?.getWar();
        if ((war instanceof GameHelpersGhFactory.getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
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
        if ((war instanceof GameHelpersGhFactory.getRwWarBaseClass()) && (war.getIsBatchExecuteAction())){
            return;
        }

        const img = this._imgFlash;
        if ((this._animationType !== UnitsConstants.AnimationTypeId.Stand)               ||
            (!CommonModelCommonModel.getIsUnitFlashVisible())                   ||
            (!UsersModel.getSelfSettingsIsUnitFlickeringOnFullEnergy())
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

        if (player.getCoCurrentEnergy() < Math.min(powerEnergy ?? NumbersConstants.MaxValue, superPowerEnergy ?? NumbersConstants.MaxValue)) {
            img.setIsVisible(false);
            return;
        }

        img.setIsVisible(true);
        img.loadSource(CommonModelCommonModel.getCachedUnitFlashImageSource({
            version     : UsersModel.getSelfSettingsTextureVersion(),
            skinId      : ForceSkinsUtils.getFinalSkinId(war, player.getPlayerIndex()),
            unitType    : unit.getUnitType(),
        }));
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._resetStateAnimationFrames();
    }

    private _setUnit(unit: UnitsIUnit.IUnit): void {
        this._unit = unit;
    }
    public getUnit(): UnitsIUnit.IUnit | null {
        return this._unit;
    }

    public resetAllViews(): void {
        this._isDark = HelpersMisc.getExisted(this.getUnit()).getActionState() === UnitsConstants.ActionStateId.Acted;
        this._resetImgUnitFlippedX();
        this._resetStateAnimationFrames();
        this.showUnitAnimation(UnitsConstants.AnimationTypeId.Stand);
        this.updateImageHp();
    }

    public showUnitAnimation(type: UnitsConstants.AnimationTypeId): void {
        this._animationType = type;
        this._tickUnitAnimationFrame();
    }
    private _tickUnitAnimationFrame(): void {
        const unit = HelpersMisc.getExisted(this.getUnit());
        this._imgUnit.loadSource(CommonModelCommonModel.getCachedUnitImageSource({
            gcData      : unit.getGcData(),
            version         : UsersModel.getSelfSettingsTextureVersion(),
            isDark          : this._isDark,
            animationType   : this._animationType,
            tickCount       : CommonModelCommonModel.getUnitAnimationTickCount(),
            skinId          : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            unitType        : unit.getUnitType(),
        }));
    }

    public updateImageHp(): void {
        const unit          = HelpersMisc.getExisted(this.getUnit());
        const normalizedHp  = unit.getNormalizedCurrentHp();
        const img           = this._imgHp;
        if (normalizedHp >= unit.getNormalizedMaxHp()) {
            img.setIsVisible(false);
        } else {
            img.setIsVisible(true);
            img.loadSource(HelpersImageSource.getUnitHp({
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
        const framesCount = this._framesForStateAnimation.length;
        this._imgState.loadSource(framesCount <= 0
            ? ``
            : this._framesForStateAnimation[CommonModelCommonModel.getStateIndicatorTickCount() % framesCount]
        );
    }

    protected _getIsDark(): boolean {
        return this._isDark;
    }
    protected _getFramesForStateAnimation(): string[] {
        return this._framesForStateAnimation;
    }

    public moveAlongPath({ path, isDiving, isBlocked, aiming, updateViewAfterMove }: {
        path                : AuxiliaryTypesGridIndex.GridIndex[];
        isDiving            : boolean;
        isBlocked           : boolean;
        aiming              : AuxiliaryTypesGridIndex.GridIndex | null;
        updateViewAfterMove : boolean;
    }): Promise<void> {
        this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveHorizontal);

        const startingPoint = path[0].createPointByGridIndex();
        this.setX(startingPoint.x);
        this.setY(startingPoint.y);

        const unit                  = HelpersMisc.getExisted(this.getUnit());
        const war                   = unit.getWar();
        const playerIndex           = unit.getPlayerIndex();
        const unitType              = unit.getUnitType();
        const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const gameConfig            = war.getGcData();
        const isAlwaysVisible       = watcherTeamIndexes.has(unit.getTeamIndex());
        const tween                 = TweenExecutor.Executor.get(this as UnitsIUnitView.IUnitView);
        if (isAlwaysVisible) {
            this.setIsVisible(true);
        }

        const moveSfxCfg = HelpersMisc.getExisted(SoundsUtils.getBgmSfxCfg(HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveSfx())));
        if ((path.length > 0) || (aiming)) {
            SoundsSoundPlayer.playLongSfxForMoveUnit(moveSfxCfg);
        }

        for (let i = 1; i < path.length; ++i) {
            const gridIndex     = path[i];
            const prevGridIndex = path[i - 1];
            const currentX      = gridIndex.getX();
            const previousX     = prevGridIndex.getX();
            if (currentX < previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(true);
                    this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveHorizontal);
                });
            } else if (currentX > previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(false);
                    this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveHorizontal);
                });
            } else {
                const currentY  = gridIndex.getY();
                const previousY = prevGridIndex.getY();
                if (currentY < previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveUp);
                    });
                } else if (currentY > previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveDown);
                    });
                } else {
                    throw HelpersMisc.newError(`Invalid move path.`);
                }
            }

            if (!isAlwaysVisible) {
                if (isDiving) {
                    tween.call(() => {
                        this.setIsVisible(
                            (i === path.length - 1 )                                    &&
                            (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeams({
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
                            (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeams({
                                war                 : war,
                                gridIndex           : path[i - 1],
                                unitType            : unitType,
                                isDiving            : isDiving,
                                isInvisible         : unit.checkIsInvisible(path[i - 1]),
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }))                                                             ||
                            (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeams({
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
                20000 / Math.max(100, UsersModel.getSelfSettingsUnitMoveAniSpeedMultiplierPct())
            );
        }

        const endingGridIndex = path[path.length - 1];
        return new Promise<void>(resolve => {
            if (!aiming) {
                tween.call(() => {
                    this._resetImgUnitFlippedX();
                    if ((isBlocked)                                         &&
                        (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeams({
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
                        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Block);
                    }
                    SoundsSoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

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
                        (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeams({
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
                        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Block);
                    }
                    SoundsSoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

                    if (updateViewAfterMove) {
                        unit.updateView();
                    }

                    resolve();
                });
            }
        });
    }
    public moveAlongExtraPath({ path, aiming, deleteViewAfterMoving }: {
        path                    : ProtoSchemaCommonProtoStructureGridIndexAndPathInfo.GridIndexAndPathInfo[];
        aiming                  : AuxiliaryTypesGridIndex.GridIndex | null;
        deleteViewAfterMoving   : boolean;
    }): Promise<void> {
        this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveHorizontal);

        const startingPoint = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(path[0].getGridIndex())).createPointByGridIndex();
        this.setX(startingPoint.x);
        this.setY(startingPoint.y);

        const unit          = HelpersMisc.getExisted(this.getUnit());
        const war           = unit.getWar();
        const unitType      = unit.getUnitType();
        const tween         = TweenExecutor.Executor.get(this as UnitsIUnitView.IUnitView);
        const gameConfig    = war.getGcData();
        const moveSfxCfg    = HelpersMisc.getExisted(SoundsUtils.getBgmSfxCfg(HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveSfx())));
        if ((path.length > 0) || (aiming)) {
            SoundsSoundPlayer.playLongSfxForMoveUnit(moveSfxCfg);
        }

        for (let i = 1; i < path.length; ++i) {
            const node          = path[i];
            const gridIndex     = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(node.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_01);
            const currentX      = gridIndex.getX();
            const previousNode  = path[i - 1];
            const prevGridIndex = HelpersMisc.getExisted(previousNode.getGridIndex(),  UtilsClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_02);
            const previousX     = HelpersMisc.getExisted(prevGridIndex.getX(), UtilsClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_03);
            if (currentX < previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(true);
                    this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveHorizontal);
                });
            } else if (currentX > previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(false);
                    this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveHorizontal);
                });
            } else {
                const currentY  = gridIndex.getY();
                const previousY = HelpersMisc.getExisted(prevGridIndex.getY(),  UtilsClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_04);
                if (currentY < previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveUp);
                    });
                } else if (currentY > previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(UnitsConstants.AnimationTypeId.MoveDown);
                    });
                } else {
                    throw HelpersMisc.newError(`Invalid move path.`);
                }
            }

            tween.call(() => {
                this.setIsVisible((!!previousNode.getIsVisible()) || (!!node.getIsVisible()));
            });

            const point = gridIndex.createPointByGridIndex();
            tween.to(
                { customX: point.x, customY: point.y },
                20000 / Math.max(100, UsersModel.getSelfSettingsUnitMoveAniSpeedMultiplierPct())
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

        const endingGridIndex = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(endingNode.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_03);
        return new Promise<void>(resolve => {
            if (!aiming) {
                tween.call(() => {
                    this._resetImgUnitFlippedX();
                    if ((isBlockedInEnd) && (isVisibleInEnd)) {
                        war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Block);
                    }
                    (deleteViewAfterMoving) && (unitMapView.removeUnit(this));

                    SoundsSoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

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
                        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Block);
                    }
                    (deleteViewAfterMoving) && (unitMapView.removeUnit(this));

                    SoundsSoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

                    resolve();
                });
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _addFrameForCoSkill(): void {
        const unit      = HelpersMisc.getExisted(this.getUnit());
        const skillType = unit.getPlayer().getCoUsingSkillType();
        if (skillType === CoSkillsConstants.SkillTypeId.Power) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.ActivatingCoPower,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        } else if (skillType === CoSkillsConstants.SkillTypeId.SuperPower) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.ActivatingCoSuperPower,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForPromotion(): void {
        const unit = HelpersMisc.getExisted(this.getUnit());
        if (unit.getIsCoOnboard()) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.CoOnboard,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        } else {
            const promotion = unit.getCurrentPromotion();
            if (promotion > 0) {
                this._framesForStateAnimation.push(HelpersImageSource.getUnitPromotion({
                    version     : UsersModel.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    promotion   : promotion,
                    skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
                }));
            }
        }
    }
    private _addFrameForFuel(): void {
        const unit = HelpersMisc.getExisted(this.getUnit());
        if (unit.checkIsFuelInShort()) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowFuel,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForAmmo(): void {
        const unit = HelpersMisc.getExisted(this.getUnit());
        if (unit.checkIsPrimaryWeaponAmmoInShort()) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowPrimaryAmmo,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
        if (unit.checkIsFlareAmmoInShort()) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowFlareAmmo,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForDive(): void {
        const unit = HelpersMisc.getExisted(this.getUnit());
        if (unit.getIsDiving()) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.Diving,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForCapture(): void {
        const unit = HelpersMisc.getExisted(this.getUnit());
        if (unit.checkIsCapturingTile()) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.CapturingTile,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForBuild(): void {
        const unit = HelpersMisc.getExisted(this.getUnit());
        if (unit.checkIsBuildingTile()) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.BuildingTile,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForLoader(): void {
        const unit  = HelpersMisc.getExisted(this.getUnit());
        const war   = unit.getWar();
        if ((war) && (unit.getMaxLoadUnitsCount())) {
            if (unit.getLoadedUnitsCount() > 0) {
                this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                    version     : UsersModel.getSelfSettingsTextureVersion(),
                    isDark      : this._isDark,
                    iconTypeId  : UnitsConstants.CornerStateIconTypeId.LoadingUnits,
                    skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
                }));
            }
        }
    }
    private _addFrameForMaterial(): void {
        const unit = HelpersMisc.getExisted(this.getUnit());
        if (unit.checkIsBuildMaterialInShort()) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowBuildMaterial,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
        if (unit.checkIsProduceMaterialInShort()) {
            this._framesForStateAnimation.push(HelpersImageSource.getUnitCornerStateIcon({
                version     : UsersModel.getSelfSettingsTextureVersion(),
                isDark      : this._isDark,
                iconTypeId  : UnitsConstants.CornerStateIconTypeId.LowProduceMaterial,
                skinId      : ForceSkinsUtils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForBuff(): void {
        const arr = this._framesForStateAnimation;
        for (const buff of HelpersMisc.getExisted(this.getUnit()).getBuffList() ?? []) {
            arr.push(HelpersImageSource.getUnitBuff({
                version     : UsersModel.getSelfSettingsTextureVersion(),
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
        this._setImgUnitFlippedX(HelpersMisc.getExisted(this.getUnit()?.getPlayerIndex()) % 2 === 0);
    }
}
