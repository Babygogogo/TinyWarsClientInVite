import {
    Common_Model_CommonModel,
    ForceSkins_Utils,
    AuxiliaryTypes_GridIndex,
    ReplayWar_Model_RwWarBase,
    CoSkills_Constants,
    Ui_Components_UiImage,
    Notifications_Dispatcher,
    Helpers_Misc,
    Tween_Executor,
    Sounds_SoundPlayer,
    Sounds_Utils,
    Graphics_Utils,
    Helpers_ImageSource,
    Numbers_Constants,
    Sounds_Constants,
    Notifications_TypeId,
    Ui_Components_UiContainer,
    type Notifications_Types,
    Units_Constants,
    Visibilities_Utils,
    Utils_ClientErrorCode,
    Users_Model,
    type Units_IUnit,
    type Units_IUnitView,
} from "../internal.ts";

import type { GridIndexAndPathInfo } from "../proto/schema/CommonProto/Structure/GridIndexAndPathInfo.ts";

const getResolutionConfig           = Helpers_Misc.createLazyFunc(() =>  Graphics_Utils.getCurrentTextureResolutionConfig());
const getGridWidth                  = Helpers_Misc.createLazyFunc(() =>  getResolutionConfig().gridWidth);
const getGridHeight                 = Helpers_Misc.createLazyFunc(() =>  getResolutionConfig().gridHeight);
const getImgUnitStateWidth          = Helpers_Misc.createLazyFunc(() =>  getResolutionConfig().imgUnitStateWidth);
const getImgUnitStateHeight         = Helpers_Misc.createLazyFunc(() =>  getResolutionConfig().imgUnitStateHeight);

const getImgUnitStandAnchorOffsetX  = Helpers_Misc.createLazyFunc(() => getGridWidth() * 3 / 4);
const getImgUnitStandAnchorOffsetY  = Helpers_Misc.createLazyFunc(() => getGridHeight() / 2);
const getImgUnitStandX              = Helpers_Misc.createLazyFunc(() => getGridWidth() * 2 / 4);
const AIMING_TIME_MS                = 500;

export class UnitView extends Ui_Components_UiContainer.UiContainer implements Units_IUnitView.IUnitView {
    private _imgHp      = new Ui_Components_UiImage.UiImage();
    private _imgState   = new Ui_Components_UiImage.UiImage();
    private _imgUnit    = new Ui_Components_UiImage.UiImage();
    private _imgFlash   = new Ui_Components_UiImage.UiImage();

    private _unit                       : Units_IUnit.IUnit | null = null;
    private _animationType              = Units_Constants.AnimationTypeId.Stand;
    private _isDark                     = false;
    private _framesForStateAnimation    : string[]  = [];

    private _notifyListeners: Notifications_Types.Listener[] = [
        { type : Notifications_TypeId.TypeId.UnitAnimationTick,            callback : this._onNotifyUnitAnimationTick },
        { type : Notifications_TypeId.TypeId.StateIndicatorTick,           callback : this._onNotifyUnitStateIndicatorTick },
        { type : Notifications_TypeId.TypeId.UnitFlashTick,                callback : this._onNotifyUnitFlashTick },
        { type : Notifications_TypeId.TypeId.BwOverridingSkinIdChanged,    callback : this._onNotifyBwOverridingSkinIdChanged },
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

    public init(unit: Units_IUnit.IUnit): Units_IUnitView.IUnitView {
        this._setUnit(unit);

        return this;
    }

    public startRunningView(): Units_IUnitView.IUnitView {
        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);
        Notifications_Dispatcher.addEventListeners(this._notifyListeners, this);

        this.resetAllViews();

        return this;
    }
    public stopRunningView(): void {
        Notifications_Dispatcher.removeEventListeners(this._notifyListeners, this);
    }

    private _onNotifyUnitAnimationTick(): void {
        const war = this.getUnit()?.getWar();
        if ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction())){
            return;
        }

        this._tickUnitAnimationFrame();
    }
    private _onNotifyUnitStateIndicatorTick(): void {
        const war = this.getUnit()?.getWar();
        if ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction())){
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
        if ((war instanceof ReplayWar_Model_RwWarBase.RwWarBase) && (war.getIsBatchExecuteAction())){
            return;
        }

        const img = this._imgFlash;
        if ((this._animationType !== Units_Constants.AnimationTypeId.Stand)               ||
            (!Common_Model_CommonModel.getIsUnitFlashVisible())                   ||
            (!Users_Model.getSelfSettingsIsUnitFlickeringOnFullEnergy())
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

        if (player.getCoCurrentEnergy() < Math.min(powerEnergy ?? Numbers_Constants.MaxValue, superPowerEnergy ?? Numbers_Constants.MaxValue)) {
            img.setIsVisible(false);
            return;
        }

        img.setIsVisible(true);
        img.loadSource(Common_Model_CommonModel.getCachedUnitFlashImageSource({
            version  : Users_Model.getSelfSettingsTextureVersion(),
            skinId   : ForceSkins_Utils.getFinalSkinId(war, player.getPlayerIndex()),
            unitType : unit.getUnitType(),
        }));
    }
    private _onNotifyBwOverridingSkinIdChanged(): void {
        this._resetStateAnimationFrames();
    }

    private _setUnit(unit: Units_IUnit.IUnit): void {
        this._unit = unit;
    }
    public getUnit(): Units_IUnit.IUnit | null {
        return this._unit;
    }

    public resetAllViews(): void {
        this._isDark = Helpers_Misc.getExisted(this.getUnit()).getActionState() === Units_Constants.ActionStateId.Acted;
        this._resetImgUnitFlippedX();
        this._resetStateAnimationFrames();
        this.showUnitAnimation(Units_Constants.AnimationTypeId.Stand);
        this.updateImageHp();
    }

    public showUnitAnimation(type: Units_Constants.AnimationTypeId): void {
        this._animationType = type;
        this._tickUnitAnimationFrame();
    }
    private _tickUnitAnimationFrame(): void {
        const unit = Helpers_Misc.getExisted(this.getUnit());
        this._imgUnit.loadSource(Common_Model_CommonModel.getCachedUnitImageSource({
            gcData        : unit.getGcData(),
            version       : Users_Model.getSelfSettingsTextureVersion(),
            isDark        : this._isDark,
            animationType : this._animationType,
            tickCount     : Common_Model_CommonModel.getUnitAnimationTickCount(),
            skinId        : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            unitType      : unit.getUnitType(),
        }));
    }

    public updateImageHp(): void {
        const unit          = Helpers_Misc.getExisted(this.getUnit());
        const normalizedHp  = unit.getNormalizedCurrentHp();
        const img           = this._imgHp;
        if (normalizedHp >= unit.getNormalizedMaxHp()) {
            img.setIsVisible(false);
        } else {
            img.setIsVisible(true);
            img.loadSource(Helpers_ImageSource.getUnitHp({
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
        const framesCount = this._framesForStateAnimation.length;
        this._imgState.loadSource(framesCount <= 0
            ? ``
            : this._framesForStateAnimation[Common_Model_CommonModel.getStateIndicatorTickCount() % framesCount],
        );
    }

    protected _getIsDark(): boolean {
        return this._isDark;
    }
    protected _getFramesForStateAnimation(): string[] {
        return this._framesForStateAnimation;
    }

    public moveAlongPath({ path, isDiving, isBlocked, aiming, updateViewAfterMove }: {
        path                : AuxiliaryTypes_GridIndex.GridIndex[];
        isDiving            : boolean;
        isBlocked           : boolean;
        aiming              : AuxiliaryTypes_GridIndex.GridIndex | null;
        updateViewAfterMove : boolean;
    }): Promise<void> {
        this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);

        const startingPoint = path[0].createPointByGridIndex();
        this.setX(startingPoint.x);
        this.setY(startingPoint.y);

        const unit                  = Helpers_Misc.getExisted(this.getUnit());
        const war                   = unit.getWar();
        const playerIndex           = unit.getPlayerIndex();
        const unitType              = unit.getUnitType();
        const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const gameConfig            = war.getGcData();
        const isAlwaysVisible       = watcherTeamIndexes.has(unit.getTeamIndex());
        const tween                 = Tween_Executor.Executor.get(this as Units_IUnitView.IUnitView);
        if (isAlwaysVisible) {
            this.setIsVisible(true);
        }

        const moveSfxCfg = Helpers_Misc.getExisted(Sounds_Utils.getBgmSfxCfg(Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveSfx())));
        if ((path.length > 0) || (aiming)) {
            Sounds_SoundPlayer.playLongSfxForMoveUnit(moveSfxCfg);
        }

        for (let i = 1; i < path.length; ++i) {
            const gridIndex     = path[i];
            const prevGridIndex = path[i - 1];
            const currentX      = gridIndex.getX();
            const previousX     = prevGridIndex.getX();
            if (currentX < previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(true);
                    this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);
                });
            } else if (currentX > previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(false);
                    this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);
                });
            } else {
                const currentY  = gridIndex.getY();
                const previousY = prevGridIndex.getY();
                if (currentY < previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveUp);
                    });
                } else if (currentY > previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveDown);
                    });
                } else {
                    throw Helpers_Misc.newError(`Invalid move path.`);
                }
            }

            if (!isAlwaysVisible) {
                if (isDiving) {
                    tween.call(() => {
                        this.setIsVisible(
                            (i === path.length - 1 )                                    &&
                            (Visibilities_Utils.checkIsUnitOnMapVisibleToTeams({
                                war                 : war,
                                gridIndex           : gridIndex,
                                unitType            : unitType,
                                isDiving            : isDiving,
                                isInvisible         : unit.checkIsInvisible(gridIndex),
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            })),
                        );
                    });
                } else {
                    tween.call(() => {
                        this.setIsVisible(
                            (Visibilities_Utils.checkIsUnitOnMapVisibleToTeams({
                                war                 : war,
                                gridIndex           : path[i - 1],
                                unitType            : unitType,
                                isDiving            : isDiving,
                                isInvisible         : unit.checkIsInvisible(path[i - 1]),
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            }))                                                             ||
                            (Visibilities_Utils.checkIsUnitOnMapVisibleToTeams({
                                war                 : war,
                                gridIndex           : gridIndex,
                                unitType            : unitType,
                                isDiving            : isDiving,
                                isInvisible         : unit.checkIsInvisible(gridIndex),
                                unitPlayerIndex     : playerIndex,
                                observerTeamIndexes : watcherTeamIndexes,
                            })),
                        );
                    });
                }
            }

            const point = gridIndex.createPointByGridIndex();
            tween.to(
                { customX : point.x, customY : point.y },
                20000 / Math.max(100, Users_Model.getSelfSettingsUnitMoveAniSpeedMultiplierPct()),
            );
        }

        const endingGridIndex = path[path.length - 1];
        return new Promise<void>(resolve => {
            if (!aiming) {
                tween.call(() => {
                    this._resetImgUnitFlippedX();
                    if ((isBlocked)                                         &&
                        (Visibilities_Utils.checkIsUnitOnMapVisibleToTeams({
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
                        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Block);
                    }
                    Sounds_SoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

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
                        (Visibilities_Utils.checkIsUnitOnMapVisibleToTeams({
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
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Block);
                        }
                        Sounds_SoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

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
        aiming                  : AuxiliaryTypes_GridIndex.GridIndex | null;
        deleteViewAfterMoving   : boolean;
    }): Promise<void> {
        this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);

        const startingPoint = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(path[0].getGridIndex())).createPointByGridIndex();
        this.setX(startingPoint.x);
        this.setY(startingPoint.y);

        const unit          = Helpers_Misc.getExisted(this.getUnit());
        const war           = unit.getWar();
        const unitType      = unit.getUnitType();
        const tween         = Tween_Executor.Executor.get(this as Units_IUnitView.IUnitView);
        const gameConfig    = war.getGcData();
        const moveSfxCfg    = Helpers_Misc.getExisted(Sounds_Utils.getBgmSfxCfg(Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveSfx())));
        if ((path.length > 0) || (aiming)) {
            Sounds_SoundPlayer.playLongSfxForMoveUnit(moveSfxCfg);
        }

        for (let i = 1; i < path.length; ++i) {
            const node          = path[i];
            const gridIndex     = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(node.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_01);
            const currentX      = gridIndex.getX();
            const previousNode  = path[i - 1];
            const prevGridIndex = Helpers_Misc.getExisted(previousNode.getGridIndex(),  Utils_ClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_02);
            const previousX     = Helpers_Misc.getExisted(prevGridIndex.getX(), Utils_ClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_03);
            if (currentX < previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(true);
                    this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);
                });
            } else if (currentX > previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(false);
                    this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);
                });
            } else {
                const currentY  = gridIndex.getY();
                const previousY = Helpers_Misc.getExisted(prevGridIndex.getY(),  Utils_ClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_04);
                if (currentY < previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveUp);
                    });
                } else if (currentY > previousY) {
                    tween.call(() => {
                        this._resetImgUnitFlippedX();
                        this.showUnitAnimation(Units_Constants.AnimationTypeId.MoveDown);
                    });
                } else {
                    throw Helpers_Misc.newError(`Invalid move path.`);
                }
            }

            tween.call(() => {
                this.setIsVisible((!!previousNode.getIsVisible()) || (!!node.getIsVisible()));
            });

            const point = gridIndex.createPointByGridIndex();
            tween.to(
                { customX : point.x, customY : point.y },
                20000 / Math.max(100, Users_Model.getSelfSettingsUnitMoveAniSpeedMultiplierPct()),
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

        const endingGridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(endingNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_03);
        return new Promise<void>(resolve => {
            if (!aiming) {
                tween.call(() => {
                    this._resetImgUnitFlippedX();
                    if ((isBlockedInEnd) && (isVisibleInEnd)) {
                        war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Block);
                    }
                    (deleteViewAfterMoving) && (unitMapView.removeUnit(this));

                    Sounds_SoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

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
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Block);
                        }
                        (deleteViewAfterMoving) && (unitMapView.removeUnit(this));

                        Sounds_SoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

                        resolve();
                    });
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _addFrameForCoSkill(): void {
        const unit      = Helpers_Misc.getExisted(this.getUnit());
        const skillType = unit.getPlayer().getCoUsingSkillType();
        if (skillType === CoSkills_Constants.SkillTypeId.Power) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.ActivatingCoPower,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        } else if (skillType === CoSkills_Constants.SkillTypeId.SuperPower) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.ActivatingCoSuperPower,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForPromotion(): void {
        const unit = Helpers_Misc.getExisted(this.getUnit());
        if (unit.getIsCoOnboard()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.CoOnboard,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        } else {
            const promotion = unit.getCurrentPromotion();
            if (promotion > 0) {
                this._framesForStateAnimation.push(Helpers_ImageSource.getUnitPromotion({
                    version   : Users_Model.getSelfSettingsTextureVersion(),
                    isDark    : this._isDark,
                    promotion : promotion,
                    skinId    : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
                }));
            }
        }
    }
    private _addFrameForFuel(): void {
        const unit = Helpers_Misc.getExisted(this.getUnit());
        if (unit.checkIsFuelInShort()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.LowFuel,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForAmmo(): void {
        const unit = Helpers_Misc.getExisted(this.getUnit());
        if (unit.checkIsPrimaryWeaponAmmoInShort()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.LowPrimaryAmmo,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
        if (unit.checkIsFlareAmmoInShort()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.LowFlareAmmo,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForDive(): void {
        const unit = Helpers_Misc.getExisted(this.getUnit());
        if (unit.getIsDiving()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.Diving,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForCapture(): void {
        const unit = Helpers_Misc.getExisted(this.getUnit());
        if (unit.checkIsCapturingTile()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.CapturingTile,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForBuild(): void {
        const unit = Helpers_Misc.getExisted(this.getUnit());
        if (unit.checkIsBuildingTile()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.BuildingTile,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForLoader(): void {
        const unit  = Helpers_Misc.getExisted(this.getUnit());
        const war   = unit.getWar();
        if ((war) && (unit.getMaxLoadUnitsCount())) {
            if (unit.getLoadedUnitsCount() > 0) {
                this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                    version    : Users_Model.getSelfSettingsTextureVersion(),
                    isDark     : this._isDark,
                    iconTypeId : Units_Constants.CornerStateIconTypeId.LoadingUnits,
                    skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
                }));
            }
        }
    }
    private _addFrameForMaterial(): void {
        const unit = Helpers_Misc.getExisted(this.getUnit());
        if (unit.checkIsBuildMaterialInShort()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.LowBuildMaterial,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
        if (unit.checkIsProduceMaterialInShort()) {
            this._framesForStateAnimation.push(Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.LowProduceMaterial,
                skinId     : ForceSkins_Utils.getFinalSkinId(unit.getWar(), unit.getPlayerIndex()),
            }));
        }
    }
    private _addFrameForBuff(): void {
        const arr = this._framesForStateAnimation;
        for (const buff of Helpers_Misc.getExisted(this.getUnit()).getBuffList()) {
            arr.push(Helpers_ImageSource.getUnitBuff({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : this._isDark,
                buffTypeId : buff.getBuffTypeId(),
            }));
        }
    }

    private _setImgUnitFlippedX(isFlipped: boolean): void {
        const scaleX = isFlipped ? -1 : 1;
        this._imgUnit.setScaleX(scaleX);
        this._imgFlash.setScaleX(scaleX);
    }
    private _resetImgUnitFlippedX(): void {
        this._setImgUnitFlippedX(Helpers_Misc.getExisted(this.getUnit()?.getPlayerIndex()) % 2 === 0);
    }
}
