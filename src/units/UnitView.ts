import {
    AuxiliaryTypes_GridIndex,
    BaseWar_Interface_IBwWar,
    Common_Model_CommonModel,
    CoSkills_Constants,
    ForceSkins_Utils,
    Graphics_Utils,
    Helpers_Collection,
    Helpers_ImageSource,
    Helpers_Misc,
    Sounds_Constants,
    Sounds_SoundPlayer,
    Sounds_Utils,
    Tween_Executor,
    Ui_Components_UiContainer,
    Ui_Components_UiImage,
    Units_Constants,
    Units_UnitViewData,
    Users_Model,
    Utils_ClientErrorCode,
    Visibilities_Utils,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Units_Unit,
} from "../internal.ts";

import type { GridIndexAndPathInfo } from "../proto/schema/CommonProto/Structure/GridIndexAndPathInfo.ts";

const getResolutionConfig           = Helpers_Misc.createLazyFunc(() => Graphics_Utils.getCurrentTextureResolutionConfig());
const getGridWidth                  = Helpers_Misc.createLazyFunc(() => getResolutionConfig().gridWidth);
const getGridHeight                 = Helpers_Misc.createLazyFunc(() => getResolutionConfig().gridHeight);
const getImgUnitStateWidth          = Helpers_Misc.createLazyFunc(() => getResolutionConfig().imgUnitStateWidth);
const getImgUnitStateHeight         = Helpers_Misc.createLazyFunc(() => getResolutionConfig().imgUnitStateHeight);

const getImgUnitStandAnchorOffsetX  = Helpers_Misc.createLazyFunc(() => getGridWidth() * 3 / 4);
const getImgUnitStandAnchorOffsetY  = Helpers_Misc.createLazyFunc(() => getGridHeight() / 2);
const getImgUnitStandX              = Helpers_Misc.createLazyFunc(() => getGridWidth() * 2 / 4);
const AIMING_TIME_MS                = 500;

export class UnitView extends Ui_Components_UiContainer.UiContainer {
    private readonly _imgHp         = new Ui_Components_UiImage.UiImage();
    private readonly _imgCornerIcon = new Ui_Components_UiImage.UiImage();
    private readonly _imgUnit       = new Ui_Components_UiImage.UiImage();
    private readonly _imgFlash      = new Ui_Components_UiImage.UiImage();

    private readonly _cornerIconSources : string[]  = [];
    private readonly _viewData          = new Units_UnitViewData.UnitViewData();

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
            const imgState = this._imgCornerIcon;
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

    public dispose(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public updateOnNotifyUnitAnimationTick(): void {
        this._tickUnitAnimationFrame();
    }
    public updateOnNotifyUnitStateIndicatorTick(): void {
        this._refreshCornerIcon();
    }
    public updateOnNotifyUnitFlashTick(): void {
        const unit = this.getViewData();
        if (unit == null) {
            return;
        }

        const viewData  = this.getViewData();
        const img       = this._imgFlash;
        if ((viewData.animationTypeId !== Units_Constants.AnimationTypeId.Stand)    ||
            (!viewData.isActiveCoSkillReady)                                        ||
            (!Common_Model_CommonModel.getIsUnitFlashVisible())                     ||
            (!Users_Model.getSelfSettingsIsUnitFlickeringOnFullEnergy())
        ) {
            img.setIsVisible(false);
            return;
        }

        img.setIsVisible(true);
        img.loadSource(Common_Model_CommonModel.getCachedUnitFlashImageSource({
            version  : Users_Model.getSelfSettingsTextureVersion(),
            skinId   : viewData.skinId,
            unitType : viewData.unitTypeId,
        }));
    }
    public updateOnNotifyBwOverridingSkinIdChanged(war: BaseWar_Interface_IBwWar.IBwWar): void {
        if (this.loadViewData({
            skinId : ForceSkins_Utils.getFinalSkinId(war, this.getViewData().playerIndex),
        })) {
            this._refreshCornerIconSources();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getViewData(): Units_UnitViewData.UnitViewData {
        return this._viewData;
    }
    public loadViewData(viewData: Partial<Units_UnitViewData.IUnitViewData>, useDefaultValues = false): boolean {
        if (useDefaultValues) {
            const defaultData = new Units_UnitViewData.UnitViewData();
            defaultData.mergeFrom(viewData);
            return this.getViewData().mergeFrom(defaultData);
        } else {
            return this.getViewData().mergeFrom(viewData);
        }
    }
    public loadViewDataFromUnit(unit: Units_Unit.Unit, war: BaseWar_Interface_IBwWar.IBwWar, ignorePosition = false): boolean {
        return this.loadViewData(Units_UnitViewData.UnitViewData.generateFromUnit(unit, war, ignorePosition));
    }

    public refreshAllViews(): void {
        // this.showUnitAnimation(Units_Constants.AnimationTypeId.Stand);
        this.showAnimation(this.getViewData().animationTypeId);
        this._refreshPosition();
        this._refreshImgUnitFlippedX();
        this._refreshCornerIconSources();
        this._refreshImageHp();
    }

    public showAnimation(typeId: Units_Constants.AnimationTypeId): void {
        this.loadViewData({ animationTypeId : typeId });
        this._tickUnitAnimationFrame();
    }
    private _tickUnitAnimationFrame(): void {
        const viewData = this.getViewData();
        this._imgUnit.loadSource(Common_Model_CommonModel.getCachedUnitImageSource({
            version       : Users_Model.getSelfSettingsTextureVersion(),
            tickCount     : Common_Model_CommonModel.getUnitAnimationTickCount(),
            isDark        : viewData.isDark,
            animationType : viewData.animationTypeId,
            skinId        : viewData.skinId,
            unitType      : viewData.unitTypeId,
        }));
    }

    private _refreshImageHp(): void {
        const viewData  = this.getViewData();
        const hp        = viewData.normalizedHp;
        const img       = this._imgHp;
        if (hp >= 10) {
            img.setIsVisible(false);
        } else {
            img.setIsVisible(true);
            img.loadSource(Helpers_ImageSource.getUnitHp({
                version : Users_Model.getSelfSettingsTextureVersion(),
                hp      : hp,
                isDark  : viewData.isDark,
            }));
        }
    }

    private _refreshCornerIconSources(): void {
        const newFrames: (string | undefined)[] = [];
        newFrames.push(this._getCornerIconSourceForCoSkill());
        newFrames.push(this._getCornerIconSourceForPromotion());
        newFrames.push(this._getCornerIconSourceForFuel());
        newFrames.push(this._getCornerIconSourceForAmmo());
        newFrames.push(this._getCornerIconSourceForDive());
        newFrames.push(this._getCornerIconSourceForCapture());
        newFrames.push(this._getCornerIconSourceForBuild());
        newFrames.push(this._getCornerIconSourceForLoader());
        newFrames.push(this._getCornerIconSourceForMaterial());
        newFrames.push(...this._getCornerIconSourceForBuff());

        const frames    = this._getCornerIconSources();
        frames.length   = 0;
        frames.push(...Helpers_Collection.getNonNullElements(newFrames));

        this._refreshCornerIcon();
    }
    private _refreshCornerIcon(): void {
        const frames        = this._getCornerIconSources();
        const framesCount   = frames.length;
        this._imgCornerIcon.loadSource(framesCount <= 0
            ? ``
            : frames[Common_Model_CommonModel.getStateIndicatorTickCount() % framesCount],
        );
    }

    private _getCornerIconSources(): string[] {
        return this._cornerIconSources;
    }

    public moveAlongPath({ unit, path, isDiving, isBlocked, aiming, updateViewAfterMove }: {
        unit                : Units_Unit.Unit;
        path                : AuxiliaryTypes_GridIndex.GridIndex[];
        isDiving            : boolean;
        isBlocked           : boolean;
        aiming              : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex[]>;
        updateViewAfterMove : boolean;
    }): Promise<void> {
        this.showAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);

        const startingPoint = path[0].createPointByGridIndex();
        this.setX(startingPoint.x);
        this.setY(startingPoint.y);

        const viewData              = this.getViewData();
        const playerIndex           = viewData.playerIndex;
        const unitType              = viewData.unitTypeId;
        const war                   = unit.getWar();
        const watcherTeamIndexes    = war.getPlayerManager().getWatcherTeamIndexesForSelf();
        const gameConfig            = war.getGcData();
        const isAlwaysVisible       = watcherTeamIndexes.has(unit.getTeamIndex());
        const tween                 = Tween_Executor.Executor.get<UnitView>(this);
        if (isAlwaysVisible) {
            this.setIsVisible(true);
        }

        const moveSfxCfg = Helpers_Misc.getExisted(Sounds_Utils.getBgmSfxCfg(Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveSfx())));
        if ((path.length > 0) || (aiming?.length)) {
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
                    this.showAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);
                });
            } else if (currentX > previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(false);
                    this.showAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);
                });
            } else {
                const currentY  = gridIndex.getY();
                const previousY = prevGridIndex.getY();
                if (currentY < previousY) {
                    tween.call(() => {
                        this._refreshImgUnitFlippedX();
                        this.showAnimation(Units_Constants.AnimationTypeId.MoveUp);
                    });
                } else if (currentY > previousY) {
                    tween.call(() => {
                        this._refreshImgUnitFlippedX();
                        this.showAnimation(Units_Constants.AnimationTypeId.MoveDown);
                    });
                } else {
                    throw Helpers_Misc.newError(`Invalid move path.`);
                }
            }

            if (!isAlwaysVisible) {
                if (isDiving) {
                    tween.call(() => {
                        this.setIsVisible(
                            (i === path.length - 1)                                     &&
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
            if (!aiming?.length) {
                tween.call(() => {
                    this._refreshImgUnitFlippedX();
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
                        this.loadViewData({
                            animationTypeId : Units_Constants.AnimationTypeId.Stand,
                            gridX           : endingGridIndex.getX(),
                            gridY           : endingGridIndex.getY(),
                        });
                        this.refreshAllViews();
                    }

                    resolve();
                });
            } else {
                const cursor = war.getCursor();
                tween.call(() => {
                    cursor.setIsMovableByTouches(false);
                    cursor.setIsVisible(false);
                    for (const g of aiming) {
                        war.getGridVisualEffect().showEffectAiming(g, AIMING_TIME_MS);
                    }
                })
                    .wait(AIMING_TIME_MS)
                    .call(() => {
                        cursor.setIsMovableByTouches(true);
                        cursor.setIsVisible(true);
                        this._refreshImgUnitFlippedX();
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
                            this.loadViewData({
                                animationTypeId : Units_Constants.AnimationTypeId.Stand,
                                gridX           : endingGridIndex.getX(),
                                gridY           : endingGridIndex.getY(),
                            });
                            this.refreshAllViews();
                        }

                        resolve();
                    });
            }
        });
    }
    public moveAlongExtraPath({ war, path, aiming }: {
        war     : BaseWar_Interface_IBwWar.IBwWar;
        path    : GridIndexAndPathInfo[];
        aiming  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndex.GridIndex[]>;
    }): Promise<void> {
        this.showAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);

        const startingPoint = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(path[0].getGridIndex())).createPointByGridIndex();
        this.setX(startingPoint.x);
        this.setY(startingPoint.y);

        const viewData      = this.getViewData();
        const unitType      = viewData.unitTypeId;
        const tween         = Tween_Executor.Executor.get<UnitView>(this);
        const gameConfig    = war.getGcData();
        const moveSfxCfg    = Helpers_Misc.getExisted(Sounds_Utils.getBgmSfxCfg(Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getMoveSfx())));
        if ((path.length > 0) || (aiming?.length)) {
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
                    this.showAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);
                });
            } else if (currentX > previousX) {
                tween.call(() => {
                    this._setImgUnitFlippedX(false);
                    this.showAnimation(Units_Constants.AnimationTypeId.MoveHorizontal);
                });
            } else {
                const currentY  = gridIndex.getY();
                const previousY = Helpers_Misc.getExisted(prevGridIndex.getY(),  Utils_ClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_04);
                if (currentY < previousY) {
                    tween.call(() => {
                        this._refreshImgUnitFlippedX();
                        this.showAnimation(Units_Constants.AnimationTypeId.MoveUp);
                    });
                } else if (currentY > previousY) {
                    tween.call(() => {
                        this._refreshImgUnitFlippedX();
                        this.showAnimation(Units_Constants.AnimationTypeId.MoveDown);
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
        const isVisibleInEnd    = !!endingNode.getIsVisible();
        if (!isVisibleInEnd) {
            tween.call(() => {
                this.setIsVisible(false);
            });
        }

        const isBlockedInEnd    = !!endingNode.getIsBlocked();
        const endingGridIndex   = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(endingNode.getGridIndex()), Utils_ClientErrorCode.ClientErrorCode.BwUnitView_MoveAlongExtraPath_03);
        return new Promise<void>(resolve => {
            if (!aiming?.length) {
                tween.call(() => {
                    this._refreshImgUnitFlippedX();
                    if ((isBlockedInEnd) && (isVisibleInEnd)) {
                        war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Block);
                    }

                    Sounds_SoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

                    resolve();
                });
            } else {
                const cursor = war.getCursor();
                tween
                    .call(() => {
                        cursor.setIsMovableByTouches(false);
                        cursor.setIsVisible(false);
                        for (const g of aiming) {
                            war.getGridVisualEffect().showEffectAiming(g, AIMING_TIME_MS);
                        }
                    })
                    .wait(AIMING_TIME_MS)
                    .call(() => {
                        cursor.setIsMovableByTouches(true);
                        cursor.setIsVisible(true);

                        this._refreshImgUnitFlippedX();
                        if ((isBlockedInEnd) && (isVisibleInEnd)) {
                            war.getGridVisualEffect().showEffectBlock(endingGridIndex);
                            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Block);
                        }

                        Sounds_SoundPlayer.fadeoutLongSfxForMoveUnit(moveSfxCfg);

                        resolve();
                    });
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _getCornerIconSourceForCoSkill(): string | undefined {
        const viewData      = this.getViewData();
        const skillTypeId   = viewData.coSkillTypeIdInUse;
        if (skillTypeId === CoSkills_Constants.SkillTypeId.Power) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.ActivatingCoPower,
                skinId     : viewData.skinId,
            });
        } else if (skillTypeId === CoSkills_Constants.SkillTypeId.SuperPower) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.ActivatingCoSuperPower,
                skinId     : viewData.skinId,
            });
        }
        return undefined;
    }
    private _getCornerIconSourceForPromotion(): string | undefined {
        const viewData = this.getViewData();
        if (viewData.isCoOnboard) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.CoOnboard,
                skinId     : viewData.skinId,
            });
        } else {
            const promotion = viewData.promotion;
            if (promotion > 0) {
                return Helpers_ImageSource.getUnitPromotion({
                    version   : Users_Model.getSelfSettingsTextureVersion(),
                    isDark    : viewData.isDark,
                    promotion : promotion,
                    skinId    : viewData.skinId,
                });
            }
        }
        return undefined;
    }
    private _getCornerIconSourceForFuel(): string | undefined {
        const viewData = this.getViewData();
        if (viewData.isFuelInShort) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.LowFuel,
                skinId     : viewData.skinId,
            });
        }
        return undefined;
    }
    private _getCornerIconSourceForAmmo(): string | undefined {
        const viewData = this.getViewData();
        if (viewData.isAmmoInShort) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.LowPrimaryAmmo,
                skinId     : viewData.skinId,
            });
        }
        return undefined;
    }
    private _getCornerIconSourceForDive(): string | undefined {
        const viewData = this.getViewData();
        if (viewData.isDived) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.Diving,
                skinId     : viewData.skinId,
            });
        }
        return undefined;
    }
    private _getCornerIconSourceForCapture(): string | undefined {
        const viewData = this.getViewData();
        if (viewData.isCapturingTile) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.CapturingTile,
                skinId     : viewData.skinId,
            });
        }
        return undefined;
    }
    private _getCornerIconSourceForBuild(): string | undefined {
        const viewData = this.getViewData();
        if (viewData.isBuildingTile) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.BuildingTile,
                skinId     : viewData.skinId,
            });
        }
        return undefined;
    }
    private _getCornerIconSourceForLoader(): string | undefined {
        const viewData = this.getViewData();
        if (viewData.hasLoadedUnits) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.LoadingUnits,
                skinId     : viewData.skinId,
            });
        }
        return undefined;
    }
    private _getCornerIconSourceForMaterial(): string | undefined {
        const viewData = this.getViewData();
        if (viewData.isMaterialInShort) {
            return Helpers_ImageSource.getUnitCornerStateIcon({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                iconTypeId : Units_Constants.CornerStateIconTypeId.LowBuildMaterial,
                skinId     : viewData.skinId,
            });
        }
        return undefined;
    }
    private _getCornerIconSourceForBuff(): string[] {
        const viewData = this.getViewData();
        const arr      : string[] = [];
        for (const buff of viewData.buffTypeIdList) {
            arr.push(Helpers_ImageSource.getUnitBuff({
                version    : Users_Model.getSelfSettingsTextureVersion(),
                isDark     : viewData.isDark,
                buffTypeId : buff,
            }));
        }
        return arr;
    }

    private _refreshPosition(): void {
        const viewData = this.getViewData();
        this.setX(getGridWidth() * viewData.gridX);
        this.setY(getGridHeight() * viewData.gridY);
    }

    private _setImgUnitFlippedX(isFlipped: boolean): void {
        const scaleX = isFlipped ? -1 : 1;
        this._imgUnit.setScaleX(scaleX);
        this._imgFlash.setScaleX(scaleX);
    }
    private _refreshImgUnitFlippedX(): void {
        this._setImgUnitFlippedX(this.getViewData().playerIndex % 2 === 0);
    }
}
