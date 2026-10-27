import { AttackableArea } from "../auxiliaryTypes/AttackableArea.ts";
import type { Undefinable, RepairHpAndCost } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { GridIndexAndWeight } from "../auxiliaryTypes/GridIndexAndWeight.ts";
import { MovableArea } from "../auxiliaryTypes/MovableArea.ts";
import { UnitVisionInfo } from "../auxiliaryTypes/UnitVisionInfo.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { CoId, EnergyTypeId } from "../cos/Constants.ts";
import { SkillTypeId } from "../coSkills/Constants.ts";
import { getPowerSkillTargetsCount } from "../coSkills/utils/Common.ts";
import { checkCanCoBoard } from "../coSkills/utils/persistent/SelfCanCoBoard.ts";
import { getTotalUpperOffset } from "../coSkills/utils/persistent/SelfUnitAttackRange.ts";
import { getTotalOffsetPct } from "../coSkills/utils/persistent/SelfUnitCaptureAmount.ts";
import {
    getTotalDefensePercentOffset as CoSkillsUtilsPersistentSelfUnitDefenseGetTotalOffsetPct,
} from "../coSkills/utils/persistent/SelfUnitDefense.ts";
import { getTotalOffset } from "../coSkills/utils/persistent/SelfUnitFuelConsumption.ts";
import {
    getTotalOffset as CoSkillsUtilsPersistentSelfUnitLuckRangeGetTotalOffset,
} from "../coSkills/utils/persistent/SelfUnitLuckRange.ts";
import {
    getTotalOffset as CoSkillsUtilsPersistentSelfUnitMoveRangeGetTotalOffset,
} from "../coSkills/utils/persistent/SelfUnitMoveRange.ts";
import {
    getTotalOffsetPct as CoSkillsUtilsPersistentSelfUnitOffenseGetTotalOffsetPct,
} from "../coSkills/utils/persistent/SelfUnitOffense.ts";
import { getTotalRangeOffset, checkCanSeeThrough } from "../coSkills/utils/persistent/SelfUnitVision.ts";
import type { GameConfig } from "../gameConfigs/GameConfig.ts";
import { getUnitViewClass, getUnitClass } from "../gameHelpers/GhFactory.ts";
import { deleteElementFromList } from "../helpers/Collection.ts";
import { newError, getExisted, createLazyFunc, createLazyFunc2 } from "../helpers/Misc.ts";
import { getCurrentLanguageType, getLanguageText } from "../lang/Utils.ts";
import { decode } from "../locations/Utils.ts";
import type { BwUnitBuffChanged } from "../notifications/DataTypes.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { MaxInt32 } from "../numbers/Constants.ts";
import { getValueInRange, getValueInInt32 } from "../numbers/Utils.ts";
import type { IPlayer } from "../players/IPlayer.ts";
import type { BuildableTileCfg } from "../proto/schema/CommonProto/Config/BuildableTileCfg.ts";
import type { DamageChartCfg } from "../proto/schema/CommonProto/Config/DamageChartCfg.ts";
import type { UnitTemplateCfg } from "../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";
import type { VisionBonusCfg } from "../proto/schema/CommonProto/Config/VisionBonusCfg.ts";
import type { UnitBuff } from "../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type { WeightedGridIndex } from "../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import type { ITile } from "../tiles/ITile.ts";
import { checkCanCoBoard as TilesUtilsCommonCheckCanCoBoard } from "../tiles/utils/Common.ts";
import { BuffTypeId } from "../unitBuffs/Constants.ts";
import { checkIsValid, checkIsExpired } from "../unitBuffs/utils/Common.ts";
import { ActionStateId, WeaponTypeId, Hp, TagId, AiModeId } from "./Constants.ts";
import type { IUnit } from "./IUnit.ts";
import type { IUnitView } from "./IUnitView.ts";
import {
    getNormalizedHp,
    checkIsValidPrimaryAmmo,
    getValidPrimaryAmmo,
    checkIsValidProduceMaterial,
    getValidProduceMaterial,
    checkIsMeetLoadedStateId,
    checkIsValidEncodedTagId,
    checkIsValidAiModeId,
} from "./utils/Common.ts";
import { checkIsValidCustomNameId } from "./utils/CustomName.ts";
import { getErrorCodeForUnitDataIgnoringUnitId, create } from "./utils/Serialization.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { toGridIndexAndWeight } from "../weightedGridIndexes/Utils.ts";

type IBwTile                = ITile;

export class Unit implements IUnit {
    private _gameConfig?                        : GameConfig;
    private _templateCfg?                       : UnitTemplateCfg;
    private _playerIndex                        = 0;
    private _gridX                              = 0;
    private _gridY                              = 0;
    private _unitId                             = 0;

    private _actionState                        = 0;
    private _currentHp                          = 0;
    private _currentFuel                        = 0;
    private _currentPromotion                   = 0;
    private _currentBuildMaterial               = 0;
    private _currentProduceMaterial             = 0;
    private _flareCurrentAmmo                   = 0;
    private _isDiving                           = false;
    private _isCoOnboard                        = false;
    private _loaderUnitId                       : Undefinable<number>;
    private _primaryWeaponCurrentAmmo           = 0;
    private _aiMode                             = 0;
    private _encodedTagIds                      = 0;
    private _forbiddenGroupedLocationIdArray    : number[] = [];
    private _aiWeightedDestination?             : GridIndexAndWeight | null;
    private _buffArray                          : UnitBuff[] = [];
    private _customNameId                       : Undefinable<number>;

    private readonly _view              = new (getUnitViewClass())();
    private _war?                       : IBwWar;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initializers and serializers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public init(unitData: SerialUnit, gameConfig: GameConfig): void {
        const validationError = getErrorCodeForUnitDataIgnoringUnitId({
            unitData              : unitData,
            gameConfig            : gameConfig,
            mapSize               : null,
            playersCountUnneutral : null,
        });
        if (validationError) {
            throw newError(`ValidationError: ${validationError}`, validationError);
        }

        const unitTemplateCfg = getExisted(gameConfig.getUnitTemplateCfg(unitData.getUnitType()));
        this.setGridIndex(getExisted(GridIndex.convertGridIndex(unitData.getGridIndex())));
        this.setUnitId(unitData.getUnitId());
        this._setGameConfig(gameConfig);
        this._setTemplateCfg(unitTemplateCfg);
        this.setPlayerIndex(unitData.getPlayerIndex());

        this.setLoaderUnitId(unitData.getLoaderUnitId());
        this.setIsCoOnboard(unitData.getIsCoOnboard());
        this.setCurrentPromotion(unitData.getCurrentPromotion());
        this.setActionState(unitData.getActionState());
        this.setIsDiving(unitData.getIsDiving());
        this.setCurrentHp(unitData.getCurrentHp());
        this._setPrimaryWeaponCurrentAmmo(unitData.getPrimaryWeaponCurrentAmmo());
        this.setCurrentFuel(unitData.getCurrentFuel());
        this.setFlareCurrentAmmo(unitData.getFlareCurrentAmmo());
        this._setCurrentProduceMaterial(unitData.getCurrentProduceMaterial());
        this.setCurrentBuildMaterial(unitData.getCurrentBuildMaterial());
        this.setAiMode(unitData.getAiMode());
        this.setGroupedTagId(unitData.getGroupedTagId());
        this.setForbiddenGroupedLocationIdArray(unitData.getForbiddenGroupedLocationIdArray());
        this.setAiWeightedDestinationWithProto(unitData.getAiWeightedDestination());
        this.setBuffList(unitData.getBuffArray());
        this.setCustomNameId(unitData.getCustomNameId());

        this.getView().init(this);
    }

    public startRunning(war: IBwWar): void {
        if (war.getGcData() !== this.getGcData()) {
            throw newError(`IUnit.startRunning() invalid gameConfig.`);
        }

        this._setWar(war);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
    }
    public stopRunning(): void {
        this.getView().stopRunningView();
    }

    public clone(): IUnit {
        const unit = new (getUnitClass())();
        unit.init(this.serialize(), this.getGcData());
        unit.startRunning(this.getWar());

        return unit;
    }

    public serialize(): SerialUnit {
        return create({
            gridIndex   : this.getGridIndex().toProto().toJson(),
            playerIndex : this.getPlayerIndex(),
            unitType    : this.getUnitType(),
            unitId      : this.getUnitId(),

            actionState  : this.getActionState(),
            currentHp    : this.getCurrentHp(),
            aiMode       : this.getAiMode(),
            groupedTagId : this.getGroupedTagId(),
            customNameId : this.getCustomNameId() ?? null,

            currentPromotion     : this.getCurrentPromotion(),
            isDiving             : this.getIsDiving(),
            isCoOnboard          : this.getIsCoOnboard(),
            currentBuildMaterial : this.getCurrentBuildMaterial(),

            aiWeightedDestination           : this.getAiWeightedDestination()?.toProto().toJson() ?? null,
            forbiddenGroupedLocationIdArray : this.getForbiddenGroupedLocationIdArray(),
            buffArray                       : this.getBuffList().map(v => v.toJson()),

            primaryWeaponCurrentAmmo : this.getPrimaryWeaponCurrentAmmo(),
            currentFuel              : this.getCurrentFuel(),
            flareCurrentAmmo         : this.getFlareCurrentAmmo(),
            currentProduceMaterial   : this.getCurrentProduceMaterial(),
            loaderUnitId             : this.getLoaderUnitId() ?? null,
        });
    }
    public serializeForCreateSfw(): SerialUnit {
        return this.serialize();
    }
    public serializeForCreateMfr(): SerialUnit {
        return this.serializeForCreateSfw();
    }

    private _setWar(war: IBwWar): void {
        this._war = war;
    }
    public getWar(): IBwWar {
        return getExisted(this._war);
    }

    public getGcData(): GameConfig {
        return getExisted(this._gameConfig);
    }
    private _setGameConfig(config: GameConfig): void {
        this._gameConfig = config;
    }

    private _setTemplateCfg(cfg: UnitTemplateCfg): void {
        this._templateCfg = cfg;
    }
    public getTemplateCfg(): UnitTemplateCfg {
        return getExisted(this._templateCfg);
    }

    public getUnitType(): number {
        return getExisted(this.getTemplateCfg().getUnitTypeId());
    }
    private _getDamageChartCfg(): { [armorType: number]: { [weaponType: number]: DamageChartCfg } } {
        return getExisted(this.getGcData().getDamageChartCfgs(this.getUnitType()));
    }
    private _getBuildableTileCfg(): { [srcBaseType: number]: { [srcObjectType: number]: BuildableTileCfg } } | null {
        return this.getGcData().getBuildableTileCfgs(this.getUnitType());
    }
    private _getVisionBonusCfg(): { [tileType: number]: VisionBonusCfg } | null {
        return this.getGcData().getVisionBonusCfg(this.getUnitType());
    }

    public getPlayer(): IPlayer {
        return this.getWar().getPlayer(this.getPlayerIndex());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////
    public getView(): IUnitView {
        return this._view;
    }

    public updateView(): void {
        this.getView().resetAllViews();
    }
    public setViewVisible(visible: boolean): void {
        this.getView().setIsVisible(visible);
    }

    public moveViewAlongPath({ pathNodes, isDiving, isBlocked, aiming, updateViewAfterMove }: {
        pathNodes           : GridIndex[];
        isDiving            : boolean;
        isBlocked           : boolean;
        aiming              : GridIndex | null;
        updateViewAfterMove : boolean;
    }): Promise<void> {
        return this.getView().moveAlongPath({
            path : pathNodes, isDiving, isBlocked, aiming, updateViewAfterMove
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for unit id.
    ////////////////////////////////////////////////////////////////////////////////
    public getUnitId(): number {
        return this._unitId;
    }
    public setUnitId(id: number): void {
        this._unitId = id;
    }

    public getSkinId(): number {
        const player = this.getPlayer();
        return player.getUnitAndTileSkinId();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for state.
    ////////////////////////////////////////////////////////////////////////////////
    public getActionState(): ActionStateId {
        return this._actionState;
    }
    public setActionState(state: ActionStateId): void {
        this._actionState = state;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for player index and team index.
    ////////////////////////////////////////////////////////////////////////////////
    public setPlayerIndex(index: number): void {
        this._playerIndex = index;
    }
    public getPlayerIndex(): number {
        return this._playerIndex;
    }

    public getTeamIndex(): number {
        return this.getPlayer().getTeamIndex();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for hp and armor.
    ////////////////////////////////////////////////////////////////////////////////
    public getMaxHp(): number {
        return this.getTemplateCfg().getMaxHp();
    }
    public getNormalizedMaxHp(): number {
        return getNormalizedHp(this.getMaxHp());
    }

    public getNormalizedCurrentHp(): number {
        return getNormalizedHp(this.getCurrentHp());
    }
    public getCurrentHp(): number {
        return this._currentHp;
    }
    public setCurrentHp(hp: number): void {
        const maxHp = this.getMaxHp();
        if (((maxHp == null) && (hp != null))               ||
            ((maxHp != null) && ((hp < 0) || (hp > maxHp)))
        ) {
            throw newError(`IUnit.setCurrentHp() invalid hp: ${hp}, maxHp: ${maxHp}`);
        }
        this._currentHp = hp;
    }
    public addCurrentHp(offsetHp: number): void {
        this.setCurrentHp(this.getCurrentHp() + offsetHp);
    }

    public checkIsFullHp(): boolean {
        const currentHp = this.getCurrentHp();
        return (currentHp != null) && (currentHp == this.getMaxHp());
    }

    public getArmorType(): number {
        return getExisted(this.getTemplateCfg()?.getArmorTypeId());
    }

    public checkIsArmorAffectByLuck(): boolean {
        return !!this.getTemplateCfg()?.getIsAffectedByLuck();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for weapon.
    ////////////////////////////////////////////////////////////////////////////////
    public checkHasWeapon(): boolean {
        return this.checkHasPrimaryWeapon() || this.checkHasSecondaryWeapon();
    }

    public checkHasPrimaryWeapon(): boolean {
        return this.getPrimaryWeaponMaxAmmo() != null;
    }

    public getPrimaryWeaponMaxAmmo(): number | null {
        return this.getTemplateCfg().getPrimaryWeaponMaxAmmo() ?? null;
    }

    public getPrimaryWeaponCurrentAmmo(): number {
        return this._primaryWeaponCurrentAmmo;
    }
    private _setPrimaryWeaponCurrentAmmo(ammo: number): void {
        if (!checkIsValidPrimaryAmmo(ammo)) {
            throw newError(`Invalid primary weapon ammo: ${ammo}`);
        }
        this._primaryWeaponCurrentAmmo = ammo;
    }
    public setAndValidatePrimaryWeaponCurrentAmmo(ammo: number): void {
        this._setPrimaryWeaponCurrentAmmo(getValidPrimaryAmmo(ammo));
    }
    public addAndValidatePrimaryWeaponCurrentAmmo(offset: number): void {
        if (offset === 0) {
            return;
        }

        const minAmmo       = 0;
        const maxAmmo       = this.getPrimaryWeaponMaxAmmo() ?? 0;
        const currentAmmo   = this.getPrimaryWeaponCurrentAmmo();
        if (((offset > 0) && (currentAmmo < maxAmmo)) ||
            ((offset < 0) && (currentAmmo > minAmmo))
        ) {
            this.setAndValidatePrimaryWeaponCurrentAmmo(getValueInRange({
                minValue : minAmmo,
                maxValue : maxAmmo,
                rawValue : currentAmmo + offset,
            }));
        }
    }

    public getPrimaryWeaponUsedAmmo(): number | null {
        const maxAmmo = this.getPrimaryWeaponMaxAmmo();
        if (maxAmmo == null) {
            return null;
        } else {
            const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
            if (currentAmmo == null) {
                throw newError(`Empty currentAmmo.`);
            } else {
                return maxAmmo - currentAmmo;
            }
        }
    }

    public checkIsPrimaryWeaponAmmoInShort(): boolean {
        const maxAmmo       = this.getPrimaryWeaponMaxAmmo();
        const currentAmmo   = this.getPrimaryWeaponCurrentAmmo();
        return (maxAmmo != null)
            && (currentAmmo != null)
            && (currentAmmo <= maxAmmo * 0.4);
    }

    public getPrimaryWeaponBaseDamage(armorType: number): number | null {
        return (this.getPrimaryWeaponCurrentAmmo() > 0)
            ? this.getCfgBaseDamage(armorType, WeaponTypeId.Primary)
            : null;
    }

    public getAttackModifierByCo({ selfGridIndex, isCounter, observerTeamIndexSet, useDamagePreviewSettings }: {
        selfGridIndex               : GridIndex;
        isCounter                   : boolean;
        observerTeamIndexSet        : Set<number> | null;
        useDamagePreviewSettings    : boolean;
    }): number {
        const player = this.getPlayer();
        if (player.getCoId() === CoId.Empty) {
            return 0;
        }

        const war                       = this.getWar();
        const gameConfig                = this.getGcData();
        const unitTypeId                = this.getUnitType();
        const coZoneRadius              = player.getCoZoneRadius();
        const fund                      = player.getFund();
        const tileMap                   = war.getTileMap();
        const selfTile                  = tileMap.getTile(selfGridIndex);
        const selfTileTypeId            = selfTile.getTileTypeId();
        const selfPlayerIndex           = this.getPlayerIndex();
        const promotion                 = this.getCurrentPromotion();
        const isCoOnboard               = this.getIsCoOnboard();
        const selfHp                    = this.getCurrentHp();
        const selfTileDefenseAmount     = selfTile.getDefenseAmount();
        const canSelfTileDefendUnit     = selfTile.checkCanDefendUnit(this);
        const damagePreviewSettings     = war.getDamagePreviewSettings();
        const isInCozByPreviewSettings  = ((useDamagePreviewSettings) && (damagePreviewSettings.isEnabled))
            ? damagePreviewSettings.settings.find(v => v.playerIndex === selfPlayerIndex)?.isForcedInCoZone ?? false
            : false;
        const weatherTypeId             = war.getWeatherManager().getCurrentWeatherType();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() =>
            observerTeamIndexSet == null
                ? player.getCoGridIndexListOnMap()
                : player.getVisibleCoGridIndexArrayOnMap(observerTeamIndexSet)
        );
        const getOwnTilesCount          = createLazyFunc2((tileCategoryId: number): number => {
            let count = 0;
            for (const column of tileMap.getMap()) {
                for (const tile of column) {
                    if ((tile.getPlayerIndex() === selfPlayerIndex) && (gameConfig.checkIsTileTypeInCategory(tile.getTileTypeId(), tileCategoryId))) {
                        ++count;
                    }
                }
            }
            return count;
        });

        let modifier = 0;
        for (const skillId of player.getCoCurrentSkills()) {
            modifier += CoSkillsUtilsPersistentSelfUnitOffenseGetTotalOffsetPct({
                cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitCommonAttributes(),
                gameConfig               : gameConfig,
                unitTypeId               : unitTypeId,
                tileTypeId               : selfTileTypeId,
                weatherTypeId            : weatherTypeId,
                isCoOnboard              : isCoOnboard,
                isInCozByPreviewSettings : isInCozByPreviewSettings,
                gridIndex                : selfGridIndex,
                coZoneRadius             : coZoneRadius,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                fund                     : fund,
                promotion                : promotion,
                hp                       : selfHp,
                isCounter                : isCounter,
                tileDefenseAmount        : selfTileDefenseAmount,
                canTileDefendUnit        : canSelfTileDefendUnit,
                getOwnTilesCount         : getOwnTilesCount,
            });
        }

        return modifier;
    }
    public getAttackModifierByWeather(selfGridIndex: GridIndex, observerTeamIndexSet: Set<number> | null, useDamagePreviewSettings: boolean): number {
        const war               = this.getWar();
        const weatherManager    = war.getWeatherManager();
        const offenseBonusCfg   = weatherManager.getCurrentWeatherCfg().getOffenseBonus();
        if (offenseBonusCfg == null) {
            return 0;
        }

        const gameConfig    = war.getGcData();
        const unitType      = this.getUnitType();
        const selfTileType  = war.getTileMap().getTile(selfGridIndex).getTileTypeId();
        const modifier      = offenseBonusCfg[2];
        if ((!modifier)                                                                 ||
            (!gameConfig.checkIsUnitTypeInCategory(unitType, offenseBonusCfg[0]))       ||
            (!gameConfig.checkIsTileTypeInCategory(selfTileType, offenseBonusCfg[1]))
        ) {
            return 0;
        }

        const weatherType               = weatherManager.getCurrentWeatherType();
        const isCoOnboard               = this.getIsCoOnboard();
        const player                    = this.getPlayer();
        const coZoneRadius              = player.getCoZoneRadius();
        const selfPlayerIndex           = player.getPlayerIndex();
        const damagePreviewSettings     = war.getDamagePreviewSettings();
        const isInCozByPreviewSettings  = ((useDamagePreviewSettings) && (damagePreviewSettings.isEnabled))
            ? damagePreviewSettings.settings.find(v => v.playerIndex === selfPlayerIndex)?.isForcedInCoZone ?? false
            : false;
        const getCoGridIndexArrayOnMap  = createLazyFunc(() =>
            observerTeamIndexSet == null
                ? player.getCoGridIndexListOnMap()
                : player.getVisibleCoGridIndexArrayOnMap(observerTeamIndexSet)
        );

        for (const skillId of this.getPlayer().getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitIgnoreWeather();
            if ((cfg)                                                                               &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))             &&
                (gameConfig.checkIsTileTypeInCategory(selfTileType, cfg.getTileCategoryId() ?? 0))         &&
                (gameConfig.checkIsWeatherTypeInCategory(weatherType, cfg.getWeatherCategoryId() ?? 0))    &&
                ((isCoOnboard) || (isInCozByPreviewSettings) || (selfGridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                    coZoneRadius             : coZoneRadius,
                    getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                })))
            ) {
                return 0;
            }
        }

        return modifier;
    }
    public getEffectiveOffensePierce(selfGridIndex: GridIndex): number[] {
        const result    = new Array<number>(6).fill(0);
        const player    = this.getPlayer();
        if (player.getCoId() == CoId.Empty) {
            return result;
        }

        const gameConfig                = this.getGcData();
        const unitType                  = this.getUnitType();
        const coZoneRadius              = player.getCoZoneRadius();
        const isCoOnboard               = this.getIsCoOnboard();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        for (const skillId of player.getCoCurrentSkills()) {
            const skillCfg = gameConfig.getCoSkillCfg(skillId);
            if (skillCfg == null) {
                continue;
            }

            {
                const cfg = skillCfg.getPersistent()?.getSelfOffensePierce();
                if ((cfg)                                                                           &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))  &&
                    ((isCoOnboard) || (selfGridIndex.checkIsInsideCoSkillArea({
                        coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                        coZoneRadius             : coZoneRadius,
                        getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                    })))
                ) {
                    result[0] += cfg.getPierceTilePct() ?? 0;
                    result[1] += cfg.getPiercePromotionPct() ?? 0;
                    result[2] += cfg.getPierceCoPct() ?? 0;
                    result[3] += cfg.getPierceGlobalTilePct() ?? 0;
                    result[4] += cfg.getPierceRulePct() ?? 0;
                    result[5] += cfg.getPierceWarEventPct() ?? 0;
                }
            }
        }

        return result;
    }
    public getDefenseModifierByCo({ selfGridIndex, attackerUnitTypeId, observerTeamIndexSet, useDamagePreviewSettings }: {
        selfGridIndex               : GridIndex;
        attackerUnitTypeId          : number | null;
        observerTeamIndexSet        : Set<number> | null;
        useDamagePreviewSettings    : boolean;
    }): number {
        const player = this.getPlayer();
        if (!player.getCoId()) {
            return 0;
        }

        const war                       = this.getWar();
        const gameConfig                = this.getGcData();
        const selfUnitTypeId            = this.getUnitType();
        const coZoneRadius              = player.getCoZoneRadius();
        const fund                      = player.getFund();
        const tileMap                   = war.getTileMap();
        const selfTile                  = tileMap.getTile(selfGridIndex);
        const selfTileTypeId            = selfTile.getTileTypeId();
        const selfPlayerIndex           = player.getPlayerIndex();
        const weatherTypeId             = war.getWeatherManager().getCurrentWeatherType();
        const promotion                 = this.getCurrentPromotion();
        const isCoOnboard               = this.getIsCoOnboard();
        const selfHp                    = this.getCurrentHp();
        const selfTileDefenseAmount     = selfTile.getDefenseAmount();
        const canSelfTileDefendUnit     = selfTile.checkCanDefendUnit(this);
        const damagePreviewSettings     = war.getDamagePreviewSettings();
        const isInCozByPreviewSettings  = ((useDamagePreviewSettings) && (damagePreviewSettings.isEnabled))
            ? damagePreviewSettings.settings.find(v => v.playerIndex === selfPlayerIndex)?.isForcedInCoZone ?? false
            : false;
        const getCoGridIndexArrayOnMap  = createLazyFunc(() =>
            observerTeamIndexSet == null
                ? player.getCoGridIndexListOnMap()
                : player.getVisibleCoGridIndexArrayOnMap(observerTeamIndexSet)
        );
        const getOwnTilesCount          = createLazyFunc2((tileCategoryId: number): number => {
            let count = 0;
            for (const column of tileMap.getMap()) {
                for (const tile of column) {
                    if ((tile.getPlayerIndex() === selfPlayerIndex) && (gameConfig.checkIsTileTypeInCategory(tile.getTileTypeId(), tileCategoryId))) {
                        ++count;
                    }
                }
            }
            return count;
        });

        let modifier = 0;
        for (const skillId of player.getCoCurrentSkills()) {
            modifier += CoSkillsUtilsPersistentSelfUnitDefenseGetTotalOffsetPct({
                cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitCommonAttributes(),
                gameConfig               : gameConfig,
                unitTypeId1              : attackerUnitTypeId,
                unitTypeId2              : selfUnitTypeId,
                tileTypeId2              : selfTileTypeId,
                weatherTypeId            : weatherTypeId,
                isCoOnboard              : isCoOnboard,
                isInCozByPreviewSettings : isInCozByPreviewSettings,
                gridIndex                : selfGridIndex,
                coZoneRadius             : coZoneRadius,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                getOwnTilesCount         : getOwnTilesCount,
                fund                     : fund,
                promotion                : promotion,
                hp                       : selfHp,
                tileDefenseAmount        : selfTileDefenseAmount,
                canTileDefendUnit        : canSelfTileDefendUnit,
            });
        }

        return modifier;
    }

    public checkCanBeCounterAttackedByCo(selfGridIndex: GridIndex): boolean {
        const player = this.getPlayer();
        if (player.getCoId() === CoId.Empty) {
            return true;
        }

        const gameConfig                = this.getGcData();
        const unitType                  = this.getUnitType();
        const tileType                  = this.getWar().getTileMap().getTile(selfGridIndex).getTileTypeId();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        const isCoOnboard               = this.getIsCoOnboard();
        for (const skillId of player.getCoCurrentSkills()) {
            const skillCfg = getExisted(gameConfig.getCoSkillCfg(skillId));

            {
                const cfg = skillCfg.getPersistent()?.getSelfCannotBeCounterAttacked();
                if ((cfg)                                                                       &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))   &&
                    (gameConfig.checkIsTileTypeInCategory(tileType, cfg.getTileCategoryId() ?? 0))   &&
                    ((isCoOnboard) || (selfGridIndex.checkIsInsideCoSkillArea({
                        coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                        coZoneRadius             : coZoneRadius,
                        getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                    })))
                ) {
                    return false;
                }
            }
        }

        return true;
    }
    public checkCanCounterAttackByCo(selfGridIndex: GridIndex): boolean {
        const player = this.getPlayer();
        if (player.getCoId() === CoId.Empty) {
            return true;
        }

        const gameConfig                = this.getGcData();
        const unitType                  = this.getUnitType();
        const tileType                  = this.getWar().getTileMap().getTile(selfGridIndex).getTileTypeId();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        const isCoOnboard               = this.getIsCoOnboard();
        for (const skillId of player.getCoCurrentSkills()) {
            const skillCfg = getExisted(gameConfig.getCoSkillCfg(skillId));

            {
                const cfg = skillCfg.getPersistent()?.getSelfCannotCounterAttack();
                if ((cfg)                                                                       &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))   &&
                    (gameConfig.checkIsTileTypeInCategory(tileType, cfg.getTileCategoryId() ?? 0))   &&
                    ((isCoOnboard) || (selfGridIndex.checkIsInsideCoSkillArea({
                        coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                        coZoneRadius             : coZoneRadius,
                        getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                    })))
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    public getLuckLimitModifierByCo(selfGridIndex: GridIndex): { lower: number, upper: number } {
        const player                    = this.getPlayer();
        const gameConfig                = this.getGcData();
        const selfUnitType                  = this.getUnitType();
        const coZoneRadius              = player.getCoZoneRadius();
        const isCoOnboard               = this.getIsCoOnboard();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        let lowerModifier               = 0;
        let upperModifier               = 0;
        for (const skillId of player.getCoCurrentSkills()) {
            const offset = CoSkillsUtilsPersistentSelfUnitLuckRangeGetTotalOffset({
                cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitLuckRange(),
                gameConfig               : gameConfig,
                unitTypeId               : selfUnitType,
                gridIndex                : selfGridIndex,
                coZoneRadius             : coZoneRadius,
                isCoOnboard              : isCoOnboard,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            });
            lowerModifier += offset.lower;
            upperModifier += offset.upper;
        }

        return {
            lower : lowerModifier,
            upper : upperModifier,
        };
    }

    public checkHasSecondaryWeapon(): boolean {
        return this.getGcData().checkHasSecondaryWeapon(this.getUnitType());
    }

    public getCfgSecondaryWeaponBaseDamage(armorType: number): number | null {
        return this.getCfgBaseDamage(armorType, WeaponTypeId.Secondary);
    }
    public getSecondaryWeaponBaseDamage(armorType: number): number | null {
        return this.checkHasSecondaryWeapon()
            ? this.getCfgSecondaryWeaponBaseDamage(armorType)
            : null;
    }

    public getCfgBaseDamage(targetArmorType: number, weaponType: WeaponTypeId): number | null {
        const cfgs  = this._getDamageChartCfg();
        const cfg   = cfgs ? cfgs[targetArmorType] : null;
        return cfg ? (cfg[weaponType]?.getDamage() ?? null) : null;
    }
    public getBaseDamage(armorType: number): number | null {
        return this.getPrimaryWeaponBaseDamage(armorType) ?? this.getSecondaryWeaponBaseDamage(armorType);
    }

    public getMinAttackRange(): number | null {
        return this.getTemplateCfg().getMinAttackRange() ?? null;
    }
    public getCfgMaxAttackRange(): number | null {
        return this.getTemplateCfg().getMaxAttackRange() ?? null;
    }
    /** 以移动前的状况计算，攻击范围在移动和战斗过程中维持不变 */
    public getFinalMaxAttackRange(): number | null {
        const cfgRange = this.getCfgMaxAttackRange();
        if (cfgRange == null) {
            return null;
        }

        return getValueInInt32(cfgRange
            + this._getMaxAttackRangeModifierByCo()
            + this.getWar().getWarEventManager().getOpaMaxAttackRangeModifier(this)
        );
    }
    private _getMaxAttackRangeModifierByCo(): number {
        const player = this.getPlayer();
        if (player.getCoId() === CoId.Empty) {
            return 0;
        }

        const gameConfig                = this.getGcData();
        const selfUnitTypeId            = this.getUnitType();
        const isCoOnboard               = this.getIsCoOnboard();
        const selfOldGridIndex          = this.getGridIndex();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        let modifier                    = 0;
        for (const skillId of player.getCoCurrentSkills() || []) {
            modifier += getTotalUpperOffset({
                cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitAttackRange(),
                gameConfig               : gameConfig,
                unitTypeId               : selfUnitTypeId,
                isCoOnboard              : isCoOnboard,
                coZoneRadius             : coZoneRadius,
                gridIndex                : selfOldGridIndex,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            });
        }

        return modifier;
    }

    public getCfgCanAttackAfterMoving(): boolean {
        return !!this.getTemplateCfg()?.getCanAttackAfterMove();
    }
    public getFinalCanAttackAfterMoving(): boolean {
        return this.getWar().getWarEventManager().getOpaCanAttackAfterMoving(this) ?? this.getCfgCanAttackAfterMoving();
    }


    /** 此函数不考虑指定的移动路径是否合法。也就是说，如果移动路径上存在隐藏的敌军，也会返回true */
    public checkCanAttackTargetAfterMovePath(movePath: GridIndex[], targetGridIndex: GridIndex): boolean {
        const war           = this.getWar();
        const unitMap       = war.getUnitMap();
        const pathLength    = movePath.length;
        const destination   = movePath[pathLength - 1];
        if (((!this.getFinalCanAttackAfterMoving()) && (pathLength > 1))                    ||
            ((this.getLoaderUnitId() != null) && (pathLength <= 1))                         ||
            ((!this.getPrimaryWeaponCurrentAmmo()) && (!this.checkHasSecondaryWeapon()))    ||
            ((pathLength > 1) && (unitMap.getVisibleUnitOnMap(destination)))
        ) {
            return false;
        }

        const targetUnit = unitMap.getVisibleUnitOnMap(targetGridIndex);
        if (targetUnit) {
            if ((targetUnit.getTeamIndex() == this.getTeamIndex())      ||
                (this.getBaseDamage(targetUnit.getArmorType()) == null)
            ) {
                return false;
            }
            if ((targetUnit.getIsDiving())                                                                                  &&
                (!targetUnit.getTemplateCfg().getDiveCfg()?.getCanBeAttackedByUnitTypeArray().includes(this.getUnitType()))
            ) {
                return false;
            }
        } else {
            const targetTile    = war.getTileMap().getTile(targetGridIndex);
            const armorType     = targetTile.getArmorType();
            if ((targetTile.getTeamIndex() === this.getTeamIndex())     ||
                (armorType == null)                                     ||
                (this.getBaseDamage(armorType) == null)
            ) {
                return false;
            }
        }

        const maxAttackRange = this.getFinalMaxAttackRange();
        if (maxAttackRange == null) {
            return false;
        }

        const minAttackRange = this.getMinAttackRange();
        if (minAttackRange == null) {
            return false;
        }

        const distance = destination.getDistance(targetGridIndex);
        if ((distance > maxAttackRange) || (distance < minAttackRange)) {
            return false;
        }

        return true;
    }

    /** 此函数不考虑指定的移动路径是否合法。也就是说，如果移动路径上存在隐藏的敌军，也会返回true */
    public checkCanAttackUnitAfterMovePath(movePath: GridIndex[], targetGridIndex: GridIndex): boolean {
        const war           = this.getWar();
        const unitMap       = war.getUnitMap();
        const pathLength    = movePath.length;
        const destination   = movePath[pathLength - 1];
        const primaryAmmo   = this.getPrimaryWeaponCurrentAmmo();
        if (((!this.getFinalCanAttackAfterMoving()) && (pathLength > 1))        ||
            ((this.getLoaderUnitId() != null) && (pathLength <= 1))             ||
            ((!primaryAmmo) && (!this.checkHasSecondaryWeapon()))               ||
            ((pathLength > 1) && (unitMap.getVisibleUnitOnMap(destination)))
        ) {
            return false;
        }

        const targetUnit = unitMap.getVisibleUnitOnMap(targetGridIndex);
        if ((targetUnit == null)                                    ||
            (targetUnit.getTeamIndex() == this.getTeamIndex())      ||
            (this.getBaseDamage(targetUnit.getArmorType()) == null)
        ) {
            return false;
        }
        if ((targetUnit.getIsDiving())                                                                                  &&
            (!targetUnit.getTemplateCfg().getDiveCfg()?.getCanBeAttackedByUnitTypeArray().includes(this.getUnitType()))
        ) {
            return false;
        }

        const maxAttackRange = this.getFinalMaxAttackRange();
        if (maxAttackRange == null) {
            return false;
        }

        const minAttackRange = this.getMinAttackRange();
        if (minAttackRange == null) {
            return false;
        }

        const distance = destination.getDistance(targetGridIndex);
        if ((distance > maxAttackRange) || (distance < minAttackRange)) {
            return false;
        }

        return true;
    }

    /** 此函数不考虑指定的移动路径是否合法。也就是说，如果移动路径上存在隐藏的敌军，也会返回true */
    public checkCanAttackTileAfterMovePath(movePath: GridIndex[], targetGridIndex: GridIndex): boolean {
        const war           = this.getWar();
        const unitMap       = war.getUnitMap();
        const pathLength    = movePath.length;
        const destination   = movePath[pathLength - 1];
        const targetTile    = war.getTileMap().getTile(targetGridIndex);
        const armorType     = targetTile.getArmorType();
        if (((!this.getFinalCanAttackAfterMoving()) && (pathLength > 1))                    ||
            ((this.getLoaderUnitId() != null) && (pathLength <= 1))                         ||
            ((!this.getPrimaryWeaponCurrentAmmo()) && (!this.checkHasSecondaryWeapon()))    ||
            (targetTile.getTeamIndex() === this.getTeamIndex())                             ||
            (armorType == null)                                                             ||
            (this.getBaseDamage(armorType) == null)                                         ||
            (unitMap.getVisibleUnitOnMap(targetGridIndex))                                  ||
            ((pathLength > 1) && (unitMap.getVisibleUnitOnMap(destination)))
        ) {
            return false;
        }

        const maxAttackRange = this.getFinalMaxAttackRange();
        if (maxAttackRange == null) {
            return false;
        }

        const minAttackRange = this.getMinAttackRange();
        if (minAttackRange == null) {
            return false;
        }

        const distance = destination.getDistance(targetGridIndex);
        if ((distance > maxAttackRange) || (distance < minAttackRange)) {
            return false;
        }

        return true;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for capture.
    ////////////////////////////////////////////////////////////////////////////////
    public checkIsCapturingTile(): boolean {
        if ((!this.checkIsCapturer()) || (this.getLoaderUnitId() != null)) {
            return false;
        }

        const tile = this.getWar().getTileMap().getTile(this.getGridIndex());
        return (tile.getMaxCapturePoint() != null)
            && ((tile.getCurrentCapturePoint() ?? 0) > 0);
    }

    public checkIsCapturer(): boolean {
        return !!this.getTemplateCfg()?.getCanCaptureTile();
    }
    public checkCanCaptureTile(tile: IBwTile): boolean {
        return (this.checkIsCapturer())
            && (this.getTeamIndex() !== tile.getTeamIndex())
            && (tile.getMaxCapturePoint() != null);
    }

    public getFinalCaptureAmount(selfGridIndex: GridIndex): number | null {
        const cfgAmount = this._getCfgCaptureAmount();
        if (cfgAmount == null) {
            return null;
        }

        const player = this.getPlayer();
        if (player.getCoId() === CoId.Empty) {
            return cfgAmount;
        }

        const gameConfig                = this.getGcData();
        const selfUnitTypeId            = this.getUnitType();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        const isCoOnboard               = this.getIsCoOnboard();
        let modifier                    = 100;
        for (const skillId of player.getCoCurrentSkills()) {
            modifier += getTotalOffsetPct({
                cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitCaptureAmount(),
                unitTypeId               : selfUnitTypeId,
                gridIndex                : selfGridIndex,
                gameConfig               : gameConfig,
                coZoneRadius             : coZoneRadius,
                isCoOnboard              : isCoOnboard,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            });
        }

        return Math.floor(cfgAmount * modifier / 100);
    }
    private _getCfgCaptureAmount(): number | null {
        return this.checkIsCapturer() ? this.getNormalizedCurrentHp() : null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for dive.
    ////////////////////////////////////////////////////////////////////////////////
    public getIsDiving(): boolean {
        return this._isDiving;
    }
    public setIsDiving(isDiving: boolean): void {
        this._isDiving = isDiving;
    }

    public checkIsDiver(): boolean {
        return this.getTemplateCfg().getDiveCfg() != null;
    }
    public checkCanDive(): boolean {
        return (this.checkIsDiver()) && (!this.getIsDiving());
    }
    public checkCanSurface(): boolean {
        return (this.checkIsDiver()) && (this.getIsDiving());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for invisible.
    ////////////////////////////////////////////////////////////////////////////////
    public checkIsInvisible(selfGridIndex: GridIndex): boolean {
        const player                    = this.getPlayer();
        const gameConfig                = this.getGcData();
        const unitType                  = this.getUnitType();
        const tileType                  = this.getWar().getTileMap().getTile(selfGridIndex).getTileTypeId();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        const isCoOnboard               = this.getIsCoOnboard();
        for (const skillId of player.getCoCurrentSkills()) {
            const skillCfg = gameConfig.getCoSkillCfg(skillId);
            if (skillCfg == null) {
                continue;
            }

            {
                const cfg = skillCfg.getPersistent()?.getSelfInvisible();
                if ((cfg)                                                                       &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))   &&
                    (gameConfig.checkIsTileTypeInCategory(tileType, cfg.getTileCategoryId() ?? 0))   &&
                    ((isCoOnboard) || (selfGridIndex.checkIsInsideCoSkillArea({
                        coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                        getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                        coZoneRadius             : coZoneRadius
                    })))
                ) {
                    return true;
                }
            }
        }

        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for fuel.
    ////////////////////////////////////////////////////////////////////////////////
    public getCurrentFuel(): number {
        return this._currentFuel;
    }
    public setCurrentFuel(fuel: number): void {
        if ((fuel < 0) || (fuel > this.getMaxFuel())) {
            throw newError(`Invalid fuel: ${fuel}`);
        }

        this._currentFuel = fuel;
    }
    public addCurrentFuel(offsetFuel: number): void {
        this.setCurrentFuel(this.getCurrentFuel() + offsetFuel);
    }

    public getMaxFuel(): number {
        return this.getTemplateCfg().getMaxFuel();
    }

    public getUsedFuel(): number {
        return this.getMaxFuel() - this.getCurrentFuel();
    }

    public getFuelConsumptionPerTurn(): number {
        return this._getCfgFuelConsumptionPerTurn() + this._getFuelConsumptionModifierByCo();
    }
    private _getCfgFuelConsumptionPerTurn(): number {
        const templateCfg = this.getTemplateCfg();
        if (!this.getIsDiving()) {
            return templateCfg.getFuelConsumptionPerTurn();
        } else {
            return templateCfg.getDiveCfg()?.getDivedFuelConsumption() ?? 0;
        }
    }
    private _getFuelConsumptionModifierByCo(): number {
        const player                    = this.getPlayer();
        const gameConfig                = this.getGcData();
        const selfUnitTypeId            = this.getUnitType();
        const selfGridIndex             = this.getGridIndex();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        const isCoOnboard               = this.getIsCoOnboard();
        let modifier                    = 0;
        for (const skillId of player.getCoCurrentSkills()) {
            modifier += getTotalOffset({
                cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitFuelConsumption(),
                gameConfig               : gameConfig,
                unitTypeId               : selfUnitTypeId,
                gridIndex                : selfGridIndex,
                isCoOnboard              : isCoOnboard,
                coZoneRadius             : coZoneRadius,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            });
        }
        return modifier;
    }

    public checkIsDestroyedOnOutOfFuel(): boolean {
        return !!this.getTemplateCfg()?.getIsDestroyedOnOutOfFuel();
    }

    public checkIsFuelInShort(): boolean {
        const currentFuel   = this.getCurrentFuel();
        const maxFuel       = this.getMaxFuel();
        return (currentFuel != null)
            && (maxFuel != null)
            && (currentFuel <= maxFuel * 0.4);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for flare.
    ////////////////////////////////////////////////////////////////////////////////
    public getFlareRadius(gridIndex: GridIndex): number | null {
        const cfgRadius = this.getTemplateCfg().getFlareRadius();
        return cfgRadius == null
            ? null
            : getValueInRange({
                minValue : 0,
                maxValue : MaxInt32,
                rawValue : Math.floor(cfgRadius + this.getWar().getWarEventManager().getOpaFlareRadiusModifier(this, gridIndex))
            });
    }

    public getFlareMaxRange(gridIndex: GridIndex): number | null {
        const cfgMaxRange = this.getTemplateCfg().getFlareMaxRange();
        return cfgMaxRange == null
            ? null
            : getValueInRange({
                minValue : 0,
                maxValue : MaxInt32,
                rawValue : Math.floor(cfgMaxRange + this.getWar().getWarEventManager().getOpaFlareRangeModifier(this, gridIndex))
            });
    }

    public getFlareMaxAmmo(): number | null {
        return this.getTemplateCfg().getFlareMaxAmmo() ?? null;
    }

    public getFlareCurrentAmmo(): number {
        return this._flareCurrentAmmo;
    }
    public setFlareCurrentAmmo(ammo: number): void {
        if ((ammo < 0) || (ammo > (this.getFlareMaxAmmo() ?? 0))) {
            throw newError(`Invalid flare ammo: ${ammo}`);
        }

        this._flareCurrentAmmo = ammo;
    }
    public addFlareCurrentAmmo(offsetAmmo: number): void {
        if (offsetAmmo !== 0) {
            this.setFlareCurrentAmmo(getExisted(this.getFlareCurrentAmmo()) + offsetAmmo);
        }
    }

    public getFlareUsedAmmo(): number | null {
        const maxAmmo = this.getFlareMaxAmmo();
        if (maxAmmo == null) {
            return null;
        } else {
            const currentAmmo = this.getFlareCurrentAmmo();
            if (currentAmmo == null) {
                throw newError(`Empty currentAmmo.`);
            } else {
                return maxAmmo - currentAmmo;
            }
        }
    }

    public checkIsFlareAmmoInShort(): boolean {
        const maxAmmo = this.getFlareMaxAmmo();
        if (maxAmmo == null) {
            return false;
        } else {
            const currentAmmo = this.getFlareCurrentAmmo();
            if (currentAmmo == null) {
                throw newError(`Empty currentAmmo.`);
            }

            return currentAmmo <= maxAmmo * 0.4;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for grid position.
    ////////////////////////////////////////////////////////////////////////////////
    public getGridX(): number {
        return this._gridX;
    }
    public setGridX(x: number): void {
        this._gridX = x;
    }

    public getGridY(): number {
        return this._gridY;
    }
    public setGridY(y: number): void {
        this._gridY = y;
    }

    public getGridIndex(): GridIndex {
        return new GridIndex(
            this.getGridX(),
            this.getGridY(),
        );
    }
    public setGridIndex(gridIndex: GridIndex): void {
        this.setGridX(gridIndex.getX());
        this.setGridY(gridIndex.getY());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for produce unit.
    ////////////////////////////////////////////////////////////////////////////////
    public getProduceUnitTypeId(): number | null {
        return this.getTemplateCfg().getProduceUnitTypeId() ?? null;
    }

    public getProduceUnitCost(): number {
        const produceUnitType = this.getProduceUnitTypeId();
        if (produceUnitType == null) {
            throw newError(`Empty produceUnitType.`);
        }

        const cfgCost   = getExisted(this.getGcData().getUnitTemplateCfg(produceUnitType)?.getProductionCost());
        const modifier  = this.getPlayer().getUnitCostModifier(produceUnitType);
        return Math.floor(cfgCost * modifier);
    }

    public getMaxProduceMaterial(): number | null {
        return this.getTemplateCfg().getMaxProduceMaterial() ?? null;
    }

    public getCurrentProduceMaterial(): number {
        return this._currentProduceMaterial;
    }
    private _setCurrentProduceMaterial(material: number): void {
        if (!checkIsValidProduceMaterial(material)) {
            throw newError(`Invalid material: ${material}`);
        }
        this._currentProduceMaterial = material;
    }
    public setAndValidateCurrentProduceMaterial(material: number): void {
        this._setCurrentProduceMaterial(getValidProduceMaterial(material));
    }
    public addAndValidateCurrentProduceMaterial(offset: number): void {
        if (offset == 0) {
            return;
        }

        const minMaterial       = 0;
        const maxMaterial       = this.getMaxProduceMaterial() ?? 0;
        const currentMaterial   = this.getCurrentProduceMaterial();
        if (((offset > 0) && (currentMaterial < maxMaterial)) ||
            ((offset < 0) && (currentMaterial > minMaterial))
        ) {
            this.setAndValidateCurrentProduceMaterial(getValueInRange({
                minValue : minMaterial,
                maxValue : maxMaterial,
                rawValue : currentMaterial + offset,
            }));
        }
    }

    public checkIsProduceMaterialInShort(): boolean {
        const maxMaterial = this.getMaxProduceMaterial();
        if (maxMaterial == null) {
            return false;
        } else {
            const currentMaterial = this.getCurrentProduceMaterial();
            if (currentMaterial == null) {
                throw newError(`IUnit.checkIsProduceMaterialInShort() empty currentMaterial.`);
            }

            return currentMaterial / maxMaterial <= 0.4;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for move.
    ////////////////////////////////////////////////////////////////////////////////
    public getCfgMoveRange(): number {
        return this.getTemplateCfg().getMoveRange();
    }
    public getFinalMoveRange(): number {
        const currentFuel = this.getCurrentFuel();
        if (currentFuel <= 0) {
            return 0;
        } else {
            const war = this.getWar();
            return getValueInRange({
                minValue : 0,
                maxValue : currentFuel,
                rawValue : Math.floor(this.getCfgMoveRange()
                    + war.getCommonSettingManager().getPlayerRule(this.getPlayerIndex()).getMoveRangeModifier()
                    + war.getWarEventManager().getOpaMoveRangeModifier(this)
                    + this._getMoveRangeModifierByCo()
                    + this._getMoveRangeModifierByWeather()
                ),
            });
        }
    }
    private _getMoveRangeModifierByCo(): number {
        const player = this.getPlayer();
        if (player.getCoId() === CoId.Empty) {
            return 0;
        }

        const war                       = this.getWar();
        const gameConfig                = this.getGcData();
        const selfUnitTypeId            = this.getUnitType();
        const selfGridIndex             = this.getGridIndex();
        const coZoneRadius              = player.getCoZoneRadius();
        const selfTileTypeId            = war.getTileMap().getTile(selfGridIndex).getTileTypeId();
        const weatherTypeId             = war.getWeatherManager().getCurrentWeatherType();
        const isCoOnboard               = this.getIsCoOnboard();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        let modifier                    = 0;
        for (const skillId of player.getCoCurrentSkills()) {
            modifier += CoSkillsUtilsPersistentSelfUnitMoveRangeGetTotalOffset({
                cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitCommonAttributes(),
                gameConfig               : gameConfig,
                unitTypeId               : selfUnitTypeId,
                tileTypeId               : selfTileTypeId,
                weatherTypeId            : weatherTypeId,
                isCoOnboard              : isCoOnboard,
                gridIndex                : selfGridIndex,
                coZoneRadius             : coZoneRadius,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            });
        }

        return modifier;
    }
    private _getMoveRangeModifierByWeather(): number {
        const war               = this.getWar();
        const weatherManager    = war.getWeatherManager();
        const moveRangeBonus    = weatherManager.getCurrentWeatherCfg().getMovementBonus();
        if (moveRangeBonus == null) {
            return 0;
        }

        const gameConfig    = war.getGcData();
        const selfGridIndex = this.getGridIndex();
        const unitType      = this.getUnitType();
        const selfTileType  = war.getTileMap().getTile(selfGridIndex).getTileTypeId();
        const modifier      = moveRangeBonus[2];
        if ((!modifier)                                                                 ||
            (!gameConfig.checkIsUnitTypeInCategory(unitType, moveRangeBonus[0]))        ||
            (!gameConfig.checkIsTileTypeInCategory(selfTileType, moveRangeBonus[1]))
        ) {
            return 0;
        }

        const weatherType               = weatherManager.getCurrentWeatherType();
        const isCoOnboard               = this.getIsCoOnboard();
        const player                    = this.getPlayer();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        for (const skillId of this.getPlayer().getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitIgnoreWeather();
            if ((cfg)                                                                               &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, cfg.getUnitCategoryId() ?? 0))             &&
                (gameConfig.checkIsTileTypeInCategory(selfTileType, cfg.getTileCategoryId() ?? 0))         &&
                (gameConfig.checkIsWeatherTypeInCategory(weatherType, cfg.getWeatherCategoryId() ?? 0))    &&
                ((isCoOnboard) || (selfGridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                    coZoneRadius             : coZoneRadius,
                    getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                })))
            ) {
                return 0;
            }
        }

        return modifier;
    }

    public getMoveTypeId(): number {
        return this.getTemplateCfg().getMoveTypeId();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for produce self.
    ////////////////////////////////////////////////////////////////////////////////
    public getProductionCfgCost(): number {
        return this.getTemplateCfg().getProductionCost();
    }
    public getProductionFinalCost(extraMultiplier = 1): number {
        return Math.floor(
            this.getProductionCfgCost()                                 *
            this.getPlayer().getUnitCostModifier(this.getUnitType())    *
            extraMultiplier
        );
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for promotion.
    ////////////////////////////////////////////////////////////////////////////////
    public getMaxPromotion(): number {
        return this.getGcData().getUnitMaxPromotion();
    }

    public getCurrentPromotion(): number {
        return this._currentPromotion;
    }
    public setCurrentPromotion(promotion: number): void {
        const maxPromotion = this.getMaxPromotion();
        if ((maxPromotion == null) || (promotion < 0) || (promotion > maxPromotion)) {
            throw newError(`IUnit.setCurrentPromotion() invalid promotion: ${promotion}, maxPromotion: ${maxPromotion}`);
        }
        this._currentPromotion = promotion;
    }
    public addAndReviseCurrentPromotion(offset: number): void {
        this.setCurrentPromotion(getValueInRange({
            minValue : 0,
            maxValue : this.getMaxPromotion(),
            rawValue : this.getCurrentPromotion() + offset,
        }));
    }

    public getPromotionAttackBonus(): number {
        return this.getGcData().getUnitPromotionAttackBonus(this.getCurrentPromotion());
    }

    public getPromotionDefenseBonus(): number {
        return this.getGcData().getUnitPromotionDefenseBonus(this.getCurrentPromotion());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for launch silo.
    ////////////////////////////////////////////////////////////////////////////////
    public checkCanLaunchSiloOnTile(tile: IBwTile): boolean {
        const launchSiloParams = tile.getTemplateCfg().getLaunchSiloParams();
        return (!!launchSiloParams?.length)
            && (this.getGcData().checkIsUnitTypeInCategory(this.getUnitType(), launchSiloParams[0]));
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for build tile.
    ////////////////////////////////////////////////////////////////////////////////
    public checkIsBuildingTile(): boolean {
        if ((!this.checkIsTileBuilder()) || (this.getLoaderUnitId() != null)) {
            return false;
        }

        const tile = this.getWar().getTileMap().getTile(this.getGridIndex());
        return (tile.getMaxBuildPoint() != null)
            && ((tile.getCurrentBuildPoint() ?? 0) > 0);
    }

    public checkIsTileBuilder(): boolean {
        return this._getBuildableTileCfg() != null;
    }
    public checkCanBuildOnTile(tile: IBwTile): boolean {
        const tileObjectType = tile.getObjectType();
        if (tileObjectType == null) {
            throw newError(`IUnit.checkCanBuildOnTile() tileObjectType is empty.`);
        }

        const tileBaseType = tile.getBaseType();
        if (tileBaseType == null) {
            throw newError(`IUnit.checkCanBuildOnTile() empty tileBaseType.`);
        }

        const material = this.getCurrentBuildMaterial();
        return (material != null)
            && (material > 0)
            && (this.getBuildTargetTileCfg(tileBaseType, tileObjectType) != null);
    }

    public getBuildTargetTileCfg(baseType: number, objectType: number): BuildableTileCfg | null {
        const buildableCfgs = this._getBuildableTileCfg();
        const cfgs          = buildableCfgs ? buildableCfgs[baseType] : null;
        return cfgs ? (cfgs[objectType] ?? null) : null;
    }

    public getBuildAmount(): number | null {
        return this.checkIsTileBuilder() ? this.getNormalizedCurrentHp() : null;
    }

    public getMaxBuildMaterial(): number | null {
        return this.getTemplateCfg().getMaxBuildMaterial() ?? null;
    }

    public getCurrentBuildMaterial(): number {
        return this._currentBuildMaterial;
    }
    public setCurrentBuildMaterial(material: number): void {
        if ((material < 0) || (material > (this.getMaxBuildMaterial() ?? 0))) {
            throw newError(`Invalid material: ${material}`);
        }

        this._currentBuildMaterial = material;
    }

    public checkIsBuildMaterialInShort(): boolean {
        const maxMaterial = this.getMaxBuildMaterial();
        if (maxMaterial == null) {
            return false;
        } else {
            const currentMaterial = this.getCurrentBuildMaterial();
            if (currentMaterial == null) {
                throw newError(`IUnit.checkIsBuildMaterialInShort() empty currentMaterial.`);
                return false;
            }

            return currentMaterial / maxMaterial <= 0.4;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for load unit.
    ////////////////////////////////////////////////////////////////////////////////
    public getMaxLoadUnitsCount(): number | null {
        return this.getTemplateCfg().getMaxLoadUnitsCount() ?? null;
    }
    public getLoadedUnitsCount(): number {
        return this.getLoadedUnits().length;
    }
    public getLoadedUnits(): IUnit[] {
        return this.getWar()?.getUnitMap()?.getUnitsLoadedByLoader(this, false) || [];
    }

    public getLoadUnitCategoryId(): number | null {
        return this.getTemplateCfg().getLoadUnitCategoryId() ?? null;
    }

    public checkHasLoadUnitId(id: number): boolean {
        for (const unit of this.getLoadedUnits()) {
            if (unit.getUnitId() === id) {
                return true;
            }
        }
        return false;
    }

    public checkCanLoadUnit(unit: IUnit): boolean {
        const cfg                       = this.getTemplateCfg();
        const gameConfig                = this.getGcData();
        const maxLoadUnitsCount         = this.getMaxLoadUnitsCount();
        const loadableTileCategoryId    = cfg.getLoadableTileCategoryId();
        const loadUnitCategoryId        = cfg.getLoadUnitCategoryId();
        return (maxLoadUnitsCount != null)
            && (loadableTileCategoryId != null)
            && (loadUnitCategoryId != null)
            && (gameConfig.checkIsTileTypeInCategory(this.getWar().getTileMap().getTile(this.getGridIndex()).getTileTypeId(), loadableTileCategoryId))
            && (gameConfig.checkIsUnitTypeInCategory(unit.getUnitType(), loadUnitCategoryId))
            && (this.getPlayerIndex() === unit.getPlayerIndex())
            && (this.getLoadedUnitsCount() < maxLoadUnitsCount);
    }

    public checkCanDropLoadedUnit(tileType: number): boolean {
        const cfg                       = this.getTemplateCfg();
        const loadableTileCategoryId    = cfg.getLoadableTileCategoryId();
        return (!!cfg.getCanDropLoadedUnits())
            && (loadableTileCategoryId != null)
            && (this.getGcData().checkIsTileTypeInCategory(tileType, loadableTileCategoryId));
    }
    public getCfgCanDropLoadedUnit(): boolean {
        return this.getTemplateCfg().getLoadableTileCategoryId() != null;
    }

    public checkCanLaunchLoadedUnit(): boolean {
        return !!this.getTemplateCfg()?.getCanLaunchLoadedUnits();
    }
    public checkCanSupplyLoadedUnit(): boolean {
        return !!this.getTemplateCfg()?.getCanSupplyLoadedUnits();
    }
    private _checkCanRepairLoadedUnit(unit: IUnit): boolean {
        return (this.getNormalizedRepairHpForLoadedUnit() != null)
            && (unit.getLoaderUnitId() === this.getUnitId())
            && ((!unit.checkIsFullHp()) || (unit.checkCanBeSupplied()));
    }
    public getNormalizedRepairHpForLoadedUnit(): number | null {
        return this.getTemplateCfg().getRepairAmountForLoadedUnits() ?? null;
    }

    public getNormalizedRepairAmountAndCostModifier(): { amountModifier: number, costMultiplierPct: number } {
        const player                    = this.getPlayer();
        const gameConfig                = this.getGcData();
        const gridIndex                 = this.getGridIndex();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        let amountModifier              = 0;
        let costMultiplierPct           = 100;
        for (const skillId of player.getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfRepairAmountBonus();
            if ((cfg)                                               &&
                (gridIndex.checkIsInsideCoSkillArea({
                    coSkillAreaType          : cfg.getCoSkillAreaTypeId() ?? 0,
                    coZoneRadius             : coZoneRadius,
                    getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                }))
            ) {
                amountModifier      += cfg.getRepairOffsetFromUnit() ?? 0;
                costMultiplierPct   = costMultiplierPct * (cfg.getCostMultiplierPct() ?? 0) / 100;
            }
        }

        return { amountModifier, costMultiplierPct };
    }

    public setLoaderUnitId(loaderUnitId: Undefinable<number>): void {
        this._loaderUnitId = loaderUnitId;
    }
    public getLoaderUnitId(): Undefinable<number> {
        return this._loaderUnitId;
    }
    public getLoaderUnit(): IUnit | null {
        const unitId = this.getLoaderUnitId();
        if (unitId == null) {
            return null;
        } else {
            const unitMap = this.getWar().getUnitMap();
            return (unitMap.getUnitLoadedById(unitId)) || (unitMap.getUnitOnMap(this.getGridIndex()));
        }
    }
    public checkIsMeetLoadedState(state: number): boolean {
        return checkIsMeetLoadedStateId(state, this.getLoaderUnitId() != null);
    }

    public getRepairHpAndCostForLoadedUnit(unit: IUnit): RepairHpAndCost | null {
        if (!this._checkCanRepairLoadedUnit(unit)) {
            return null;
        }

        const repairAmount = this.getNormalizedRepairHpForLoadedUnit();
        if (repairAmount == null) {
            return null;
        } else {
            const normalizedMaxHp       = unit.getNormalizedMaxHp();
            const modifier              = this.getNormalizedRepairAmountAndCostModifier();
            const productionCost        = Math.floor(unit.getProductionFinalCost() * modifier.costMultiplierPct / 100);
            const normalizedCurrentHp   = unit.getNormalizedCurrentHp();
            const normalizedRepairHp    = Math.min(
                normalizedMaxHp - normalizedCurrentHp,
                repairAmount + modifier.amountModifier,
                productionCost > 0
                    ? Math.floor(Math.max(0, unit.getPlayer().getFund()) * normalizedMaxHp / productionCost)
                    : Number.MAX_SAFE_INTEGER,
            );
            return {
                hp   : (normalizedRepairHp + normalizedCurrentHp) * Hp.Normalizer - unit.getCurrentHp(),
                cost : Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp),
            };
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for supply unit.
    ////////////////////////////////////////////////////////////////////////////////
    public checkIsAdjacentUnitSupplier(): boolean {
        return !!this.getTemplateCfg()?.getCanSupplyAdjacentUnits();
    }
    public checkCanSupplyAdjacentUnit(unit: IUnit): boolean {
        return (this.checkIsAdjacentUnitSupplier())
            && (this.getLoaderUnitId() == null)
            && (unit.getLoaderUnitId() == null)
            && (this.getPlayerIndex() === unit.getPlayerIndex())
            && (this.getGridIndex().getDistance(unit.getGridIndex()) === 1)
            && (unit.checkCanBeSupplied());
    }

    public checkCanBeSuppliedWithFuel(): boolean {
        const maxFuel = this.getMaxFuel();
        if (maxFuel == null) {
            throw newError(`IUnit.checkCanBeSuppliedWithFuel() empty maxFuel.`);
            return false;
        }

        const currentFuel = this.getCurrentFuel();
        if (currentFuel == null) {
            throw newError(`IUnit.checkCanBeSuppliedWithFuel() empty currentFuel.`);
            return false;
        }

        return currentFuel < maxFuel;
    }
    public checkCanBeSuppliedWithPrimaryWeaponAmmo(): boolean {
        const maxAmmo = this.getPrimaryWeaponMaxAmmo();
        if (maxAmmo == null) {
            return false;
        } else {
            const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
            if (currentAmmo == null) {
                throw newError(`IUnit.checkCanBeSuppliedWithPrimaryWeaponAmmo() empty currentAmmo.`);
                return false;
            }

            return currentAmmo < maxAmmo;
        }
    }
    public checkCanBeSuppliedWithFlareAmmo(): boolean {
        const maxAmmo = this.getFlareMaxAmmo();
        if (maxAmmo == null) {
            return false;
        } else {
            const currentAmmo = this.getFlareCurrentAmmo();
            if (currentAmmo == null) {
                throw newError(`IUnit.checkCanBeSuppliedWithFlareAmmo() empty currentAmmo.`);
                return false;
            }

            return currentAmmo < maxAmmo;
        }
    }
    public checkCanBeSupplied(): boolean {
        return (this.checkCanBeSuppliedWithFuel())
            || (this.checkCanBeSuppliedWithPrimaryWeaponAmmo())
            || (this.checkCanBeSuppliedWithFlareAmmo());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for vision.
    ////////////////////////////////////////////////////////////////////////////////
    public getCfgVisionRange(): number {
        return this.getTemplateCfg().getVisionRange();
    }
    public getVisionRangeBonusOnTile(tileType: number): number {
        const cfgs  = this._getVisionBonusCfg();
        const cfg   = cfgs ? cfgs[tileType] : null;
        return cfg ? cfg.getVisionBonus() || 0 : 0;
    }

    public getVisionInfo(): UnitVisionInfo {
        const war                   = this.getWar();
        const gridIndex             = this.getGridIndex();
        const tileType              = war.getTileMap().getTile(gridIndex).getTileTypeId();
        const weatherManager        = war.getWeatherManager();
        const unitVisionFixedCfg    = weatherManager.getCurrentWeatherCfg().getUnitVisionFixed();
        const modifierByCo          = this._getVisionRangeModifierByCo(gridIndex);
        if (unitVisionFixedCfg != null) {
            const gameConfig    = war.getGcData();
            const unitType      = this.getUnitType();
            const weatherType   = weatherManager.getCurrentWeatherType();
            if ((gameConfig.checkIsUnitTypeInCategory(unitType, unitVisionFixedCfg[0])) &&
                (gameConfig.checkIsTileTypeInCategory(tileType, unitVisionFixedCfg[1]))
            ) {
                const player                    = this.getPlayer();
                const coZoneRadius              = player.getCoZoneRadius();
                const isCoOnboard               = this.getIsCoOnboard();
                const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
                if (!player.getCoCurrentSkills().some(skillId => {
                    const skillCfg = gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitIgnoreWeather();
                    return (skillCfg != null)
                        && (gameConfig.checkIsUnitTypeInCategory(unitType, skillCfg.getUnitCategoryId() ?? 0))
                        && (gameConfig.checkIsTileTypeInCategory(tileType, skillCfg.getTileCategoryId() ?? 0))
                        && (gameConfig.checkIsWeatherTypeInCategory(weatherType, skillCfg.getWeatherCategoryId() ?? 0))
                        && ((isCoOnboard) || (gridIndex.checkIsInsideCoSkillArea({
                            coSkillAreaType          : skillCfg.getCoSkillAreaTypeId() ?? 0,
                            coZoneRadius             : coZoneRadius,
                            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
                        })));
                })) {
                    return new UnitVisionInfo({
                        baseRange     : unitVisionFixedCfg[2] + modifierByCo,
                        isFixed       : true,
                        isPenetrating : this._checkVisionCanSeeThrough(),
                    });
                }
            }
        }

        const modifierBySettings    = war.getCommonSettingManager().getPlayerRule(this.getPlayerIndex()).getUnitVisionRangeModifier();
        const modifierByOpa         = war.getWarEventManager().getOpaUnitVisionRangeModifier(this, gridIndex);
        return new UnitVisionInfo({
            baseRange     : this.getCfgVisionRange() + modifierByCo + modifierBySettings + modifierByOpa,
            isFixed       : false,
            isPenetrating : this._checkVisionCanSeeThrough(),
        });
    }
    public getFinalVisionRange(visionInfo: UnitVisionInfo, gridIndex: GridIndex): number {
        const baseRange = visionInfo.baseRange;
        const tileMap   = this.getWar().getTileMap();
        const mapSize   = tileMap.getMapSize();
        return getValueInRange({
            minValue : 1,
            maxValue : mapSize.getWidth() + mapSize.getHeight(),
            rawValue : Math.floor(visionInfo.isFixed
                ? baseRange
                : baseRange + this.getVisionRangeBonusOnTile(tileMap.getTile(gridIndex).getTileTypeId())
            ),
        });
    }

    private _getVisionRangeModifierByCo(selfGridIndex: GridIndex): number {
        const player = this.getPlayer();
        if (player.getCoId() === CoId.Empty) {
            return 0;
        }

        const gameConfig                = this.getGcData();
        const selfUnitTypeId            = this.getUnitType();
        const coZoneRadius              = player.getCoZoneRadius();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        const isCoOnboard               = this.getIsCoOnboard();
        let modifier                    = 0;
        for (const skillId of player.getCoCurrentSkills() || []) {
            modifier += getTotalRangeOffset({
                cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitVision(),
                gameConfig               : gameConfig,
                gridIndex                : selfGridIndex,
                unitTypeId               : selfUnitTypeId,
                coZoneRadius             : coZoneRadius,
                isCoOnboard              : isCoOnboard,
                getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
            });
        }

        return modifier;
    }

    private _checkVisionCanSeeThrough(): boolean {
        {
            const isPenetrating = this.getWar().getWarEventManager().getOpaIsPenetratingVision(this);
            if (isPenetrating != null) {
                return isPenetrating;
            }
        }

        const player = this.getPlayer();
        if (!player.getCoId()) {
            return false;
        }

        const gameConfig                = this.getGcData();
        const selfUnitTypeId            = this.getUnitType();
        const getCoGridIndexArrayOnMap  = createLazyFunc(() => player.getCoGridIndexListOnMap());
        const coZoneRadius              = player.getCoZoneRadius();
        const isCoOnboard               = this.getIsCoOnboard();
        const selfGridIndex             = this.getGridIndex();
        return player.getCoCurrentSkills().some(skillId => checkCanSeeThrough({
            cfg                      : gameConfig.getCoSkillCfg(skillId)?.getPersistent()?.getSelfUnitVision(),
            gameConfig               : gameConfig,
            gridIndex                : selfGridIndex,
            unitTypeId               : selfUnitTypeId,
            coZoneRadius             : coZoneRadius,
            isCoOnboard              : isCoOnboard,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }));
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for join.
    ////////////////////////////////////////////////////////////////////////////////
    public checkCanJoinUnit(unit: IUnit): boolean {
        const playerIndex = this.getPlayerIndex();
        return (this !== unit)
            && (this.getUnitType() === unit.getUnitType())
            && (playerIndex === unit.getPlayerIndex())
            && (this.getWar().getCommonSettingManager().getPlayerRule(playerIndex).getCanUnitJoin())
            && (unit.getNormalizedCurrentHp() < unit.getNormalizedMaxHp())
            && (this.getLoadedUnitsCount() === 0)
            && (unit.getLoadedUnitsCount() === 0)
            && (!this.checkHasBuff(BuffTypeId.Disease))
            && (!unit.checkHasBuff(BuffTypeId.Disease));
    }

    public getJoinIncome(unit: IUnit): number {
        if (!this.checkCanJoinUnit(unit)) {
            throw newError(`Can not join.`);
        }

        const maxHp         = this.getNormalizedMaxHp();
        const normalizedHp1 = this.getNormalizedCurrentHp();
        const normalizedHp2 = unit.getNormalizedCurrentHp();
        const cost          = this.getProductionFinalCost();
        const joinedHp      = normalizedHp1 + normalizedHp2;
        return joinedHp <= maxHp
            ? 0
            : Math.floor((joinedHp - maxHp) * cost / 10);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for co.
    ////////////////////////////////////////////////////////////////////////////////
    public setIsCoOnboard(isCoOnBoard: boolean): void {
        this._isCoOnboard = isCoOnBoard;
    }
    public getIsCoOnboard(): boolean {
        return this._isCoOnboard;
    }

    public checkCanCoBoardAfterMovePath(movePath: GridIndex[]): boolean {
        const war           = this.getWar();
        const playerIndex   = this.getPlayerIndex();
        const player        = war.getPlayer(playerIndex);
        const maxBoardCount = player.getCoMaxBoardCount();
        if ((maxBoardCount <= 0)                                                                            ||
            (movePath.length !== 1)                                                                         ||
            (this.getLoaderUnitId() != null)                                                                ||
            (player.getCoId() == CoId.Empty)                                                ||
            (!war.getCommonSettingManager().getPlayerRule(playerIndex).getCanCoBoard())                     ||
            (war.getUnitMap().getAllCoUnits(playerIndex).length >= maxBoardCount)                           ||
            (player.getCoIsDestroyedInTurn())                                                               ||
            (this.getIsCoOnboard())                                                                         ||
            (this.getCoBoardCost() > player.getFund())
        ) {
            return false;
        }

        const tile          = war.getTileMap().getTile(movePath[0]);
        const isOwnTile     = tile.getPlayerIndex() == playerIndex;
        const gameConfig    = this.getGcData();
        const unitTypeId    = this.getUnitType();
        const tileTypeId    = tile.getTileTypeId();
        for (const skillId of player.getCoCurrentSkills()) {
            const skillCfg = gameConfig.getCoSkillCfg(skillId);
            if (skillCfg == null) {
                continue;
            }

            {
                const cfg = skillCfg.getPersistent()?.getSelfCanCoBoard();
                if (cfg != null) {
                    const canCoBoard = checkCanCoBoard({
                        cfg        : cfg,
                        gameConfig : gameConfig,
                        unitTypeId : unitTypeId,
                        tileTypeId : tileTypeId,
                        isOwnTile  : isOwnTile,
                    });
                    if (canCoBoard != null) {
                        return canCoBoard;
                    }
                }
            }
        }

        if (!isOwnTile) {
            return false;
        }

        return TilesUtilsCommonCheckCanCoBoard({
            gameConfig         : gameConfig,
            templateCfg        : tile.getTemplateCfg(),
            customBuildingData : tile.getCustomBuildingData(),
            unitType           : unitTypeId,
        });
    }

    public checkCanUseCoSkill(skillType: SkillTypeId): boolean {
        const player        = this.getPlayer();
        const war           = this.getWar();
        const playerIndex   = this.getPlayerIndex();
        if ((!this.getIsCoOnboard())                                                                                                                    ||
            (player.checkCoIsUsingActiveSkill())                                                                                                        ||
            (!player.getCoSkills(skillType))                                                                                                            ||
            (player.getCoEnergyType() !== EnergyTypeId.Dor)                                                                             ||
            (getPowerSkillTargetsCount(player.getCoBasicCfg(), skillType) > war.getTileMap().getMapSize().getGridsCount())
        ) {
            return false;
        }

        {
            const canActivateByOpa = war.getWarEventManager().checkOpaCanActivateCoSkill(playerIndex);
            if (canActivateByOpa === false) {
                return false;
            } else if (canActivateByOpa == null) {
                if (!war.getCommonSettingManager().getPlayerRule(playerIndex).getCanActivateCoSkill()) {
                    return false;
                }
            }
        }

        const energy = player.getCoCurrentEnergy();
        if (skillType === SkillTypeId.Power) {
            const powerEnergy = player.getCoPowerEnergy();
            return (powerEnergy != null) && (energy >= powerEnergy);

        } else if (skillType === SkillTypeId.SuperPower) {
            const superPowerEnergy = player.getCoSuperPowerEnergy();
            return (superPowerEnergy != null) && (energy >= superPowerEnergy);

        } else {
            return false;
        }
    }

    public getCoBoardCost(): number {
        const player        = this.getPlayer();
        const gameConfig    = this.getGcData();
        let percentage      = player.getCoBasicCfg().getBoardCostPercentage() ?? 0;
        for (const skillId of player.getCoCurrentSkills()) {
            const skillCfg = gameConfig.getCoSkillCfg(skillId);
            if (skillCfg == null) {
                continue;
            }

            {
                const cfg = skillCfg.getPersistent()?.getSelfCoBoardingCost();
                if (cfg) {
                    percentage *= (cfg.getMultiplierPct() ?? 0) / 100;
                }
            }
        }

        return getValueInInt32(percentage * this.getProductionCfgCost() / 100);
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for tag.
    ////////////////////////////////////////////////////////////////////////////////
    public setGroupedTagId(encodedTagIds: number): void {
        if (!checkIsValidEncodedTagId(encodedTagIds)) {
            throw newError(`Invalid encodedTagIds: ${encodedTagIds}`);
        }

        this._encodedTagIds = encodedTagIds;
    }
    public getGroupedTagId(): number {
        return this._encodedTagIds;
    }

    public getHasTagId(tagId: number): boolean {
        return !!((this.getGroupedTagId() >>> (tagId - 1)) & 1);
    }

    public getTagIdArray(hasTag: boolean): number[] {
        const tagIdArray: number[] = [];
        for (let tagId = TagId.MinTagId; tagId <= TagId.MaxTagId; ++tagId) {
            if (hasTag === this.getHasTagId(tagId)) {
                tagIdArray.push(tagId);
            }
        }
        return tagIdArray;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for forbidden locations.
    ////////////////////////////////////////////////////////////////////////////////
    public setForbiddenGroupedLocationIdArray(forbiddenGroupedLocationIdArray: number[]): void {
        this._forbiddenGroupedLocationIdArray = forbiddenGroupedLocationIdArray.concat();
    }
    public getForbiddenGroupedLocationIdArray(): number[] {
        return this._forbiddenGroupedLocationIdArray;
    }
    public getForbiddenLocationIdArray(): number[] {
        return decode(this.getForbiddenGroupedLocationIdArray());
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for weighted destination.
    ////////////////////////////////////////////////////////////////////////////////
    public setAiWeightedDestinationWithProto(proto: Undefinable<WeightedGridIndex>): void {
        this._aiWeightedDestination = proto == null
            ? null
            : getExisted(toGridIndexAndWeight(proto));
    }
    public getAiWeightedDestination(): Undefinable<GridIndexAndWeight> {
        return this._aiWeightedDestination;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for ai mode.
    ////////////////////////////////////////////////////////////////////////////////
    public setAiMode(aiMode: AiModeId): void {
        if (!checkIsValidAiModeId(aiMode)) {
            throw newError(`Invalid aiMode: ${aiMode}`, ClientErrorCode.BwUnit_SetAiMode_00);
        }

        this._aiMode = aiMode;
    }
    public getAiMode(): AiModeId {
        return this._aiMode;
    }

    /**
     * @returns indicates the ai mode is modified or not
     */
    public checkAndUpdateAiMode(): boolean {
        if (this.getPlayer().getUserId() != null) {
            return false;
        }

        const currentMode = this.getAiMode();
        if (currentMode === AiModeId.Normal) {
            // nothing to do
            return false;

        } else if (currentMode === AiModeId.WaitUntilCanAttack) {
            const selfGridIndex     = this.getGridIndex();
            const minAttackRange    = this.getMinAttackRange();
            const maxAttackRange    = this.getFinalMaxAttackRange();
            if ((minAttackRange == null) || (maxAttackRange == null) || (maxAttackRange < minAttackRange)) {
                return false;
            }

            const war                   = this.getWar();
            const unitMap               = war.getUnitMap();
            const tileMap               = war.getTileMap();
            const mapSize               = unitMap.getMapSize();
            const selfTeamIndex         = this.getTeamIndex();
            const canAttackAfterMoving  = this.getFinalCanAttackAfterMoving();
            const movableArea           = MovableArea.create({
                gridIndex      : selfGridIndex,
                maxMoveCost    : this.getFinalMoveRange(),
                mapSize        : mapSize,
                moveCostGetter : gridIndex => {
                    if (!gridIndex.checkIsInsideMap(mapSize)) {
                        return null;
                    } else {
                        const existingUnit = unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() != selfTeamIndex)) {
                            return null;
                        } else {
                            return tileMap.getTile(gridIndex).getMoveCostByUnit(this);
                        }
                    }
                },
            });
            const attackableArea = AttackableArea.create({
                movableArea    : movableArea,
                mapSize        : mapSize,
                minAttackRange : minAttackRange,
                maxAttackRange : maxAttackRange,
                checkCanAttack : (moveGridIndex: GridIndex, targetGridIndex: GridIndex): boolean => {
                    const hasMoved = !moveGridIndex.checkIsEqual(selfGridIndex);
                    if (((this.getLoaderUnitId() == null) || (hasMoved))    &&
                        ((canAttackAfterMoving) || (!hasMoved))
                    ) {
                        const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                        if (targetUnit == null) {
                            return false;
                        } else {
                            if ((targetUnit.getTeamIndex() == selfTeamIndex)            ||
                                (this.getBaseDamage(targetUnit.getArmorType()) == null)
                            ) {
                                return false;
                            } else {
                                if (!targetUnit.getIsDiving()) {
                                    return true;
                                } else {
                                    return targetUnit.getTemplateCfg().getDiveCfg()?.getCanBeAttackedByUnitTypeArray().includes(this.getUnitType()) ?? false;
                                }
                            }
                        }
                    } else {
                        return false;
                    }
                }
            }).getArea();

            if (!attackableArea.length) {
                return false;
            } else {
                this.setAiMode(AiModeId.Normal);
                return true;
            }

        } else if (currentMode === AiModeId.NoMove) {
            // nothing to do
            return false;

        } else {
            throw newError(`Invalid currentMode: ${currentMode}`, ClientErrorCode.BwUnit_CheckAndUpdateAiMode_00);
        }
    }

    public checkCanAiDoAction(): boolean {
        return this.getAiMode() !== AiModeId.WaitUntilCanAttack;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for buff.
    ////////////////////////////////////////////////////////////////////////////////
    public getBuffList(): UnitBuff[] {
        return this._buffArray;
    }
    public setBuffList(buffArray: UnitBuff[]): void {
        if (buffArray.some(buff => !checkIsValid(buff))) {
            throw newError(`Invalid buffArray: ${buffArray}`);
        }

        this._buffArray = buffArray;
    }

    public updateBuffArrayOnPlayerTurnSwitched(updateView: boolean): boolean {
        const buffArray = this.getBuffList();
        if (!buffArray?.length) {
            return false;
        }

        const turnManager   = this.getWar().getTurnManager();
        const turnIndex     = turnManager.getTurnIndex();
        const playerIndex   = turnManager.getPlayerIndexInTurn();
        let isUpdated       = false;
        for (let i = 0; i < buffArray.length; ++i) {
            if (checkIsExpired(buffArray[i], turnIndex, playerIndex)) {
                isUpdated = true;
                buffArray.splice(i--, 1);
            }
        }

        if (isUpdated) {
            if (updateView) {
                this.updateView();
            }
            dispatch(TypeId.BwUnitBuffChanged, {
                unit : this,
            } as BwUnitBuffChanged);
        }

        return isUpdated;
    }
    public addBuff(buff: UnitBuff, updateView: boolean, needNotify: boolean): void {
        const buffList = this.getBuffList();
        if (buffList) {
            buffList.push(buff);
        } else {
            this.setBuffList([buff]);
        }

        if (updateView) {
            this.updateView();
        }
        if (needNotify) {
            dispatch(TypeId.BwUnitBuffChanged, {
                unit : this,
            } as BwUnitBuffChanged);
        }
    }
    public deleteBuff(buff: UnitBuff, updateView: boolean): boolean {
        const buffArray = this.getBuffList();
        if (buffArray == null) {
            return false;
        }

        if (!deleteElementFromList(buffArray, buff)) {
            return false;
        }

        if (updateView) {
            this.updateView();
        }
        dispatch(TypeId.BwUnitBuffChanged, {
            unit : this,
        } as BwUnitBuffChanged);

        return true;
    }

    public checkHasBuff(buffTypeId: number): boolean {
        return this.getBuffList()?.some(buff => buff.getBuffTypeId() === buffTypeId) ?? false;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // custom name
    ////////////////////////////////////////////////////////////////////////////////
    public getCustomNameId(): Undefinable<number> {
        return this._customNameId;
    }
    public setCustomNameId(nameId: Undefinable<number>): void {
        if ((nameId != null)                                        &&
            ((!checkIsValidCustomNameId(nameId)))
        ) {
            throw newError(`Invalid nameId: ${nameId}`);
        }

        if (this.getCustomNameId() != nameId) {
            this._customNameId = nameId;
            dispatch(TypeId.BwUnitCustomNameIdChanged);
        }
    }

    public getCustomName(languageType = getCurrentLanguageType()): Undefinable<string> {
        const nameId = this.getCustomNameId();
        return getLanguageText({
            textArray    : this.getWar().getUnitMap().getUnitCustomNameArray()?.find(v => (v.getNameId() ?? 0) === nameId)?.getNameTextArray(),
            languageType : languageType,
            useAlternate : false,
        });
    }
}
