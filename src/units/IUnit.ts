import {
    type Units_Constants,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    type AuxiliaryTypes_GridIndexAndWeight,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Tiles_ITile,
    type Units_IUnitView,
    type Lang_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    type CoSkills_Constants,
    type AuxiliaryTypes_UnitVisionInfo,
} from "../internal.ts";
import type { BuildableTileCfg } from "../proto/schema/CommonProto/Config/BuildableTileCfg.ts";
import type { UnitTemplateCfg } from "../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";
import type { UnitBuff } from "../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type { WeightedGridIndex } from "../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type { SerialUnit } from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";

export interface IUnit {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initializers and serializers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    init(unitData: SerialUnit, gameConfig: GameConfigs_GameConfig.GameConfig): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    clone(): IUnit;

    serialize(): SerialUnit;
    serializeForCreateSfw(): SerialUnit;
    serializeForCreateMfr(): SerialUnit;

    getWar(): BaseWar_Interface_IBwWar.IBwWar;

    getGcData(): GameConfigs_GameConfig.GameConfig;

    getTemplateCfg(): UnitTemplateCfg;

    getUnitType(): number;

    getPlayer(): Players_IPlayer.IPlayer;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////
    getView(): Units_IUnitView.IUnitView;

    updateView(): void;
    setViewVisible(visible: boolean): void;

    moveViewAlongPath({ pathNodes, isDiving, isBlocked, aiming, updateViewAfterMove }: {
        pathNodes           : AuxiliaryTypes_GridIndex.GridIndex[];
        isDiving            : boolean;
        isBlocked           : boolean;
        aiming              : AuxiliaryTypes_GridIndex.GridIndex | null;
        updateViewAfterMove : boolean;
    }): Promise<void>;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for unit id.
    ////////////////////////////////////////////////////////////////////////////////
    getUnitId(): number;
    setUnitId(id: number): void;

    getSkinId(): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for state.
    ////////////////////////////////////////////////////////////////////////////////
    getActionState(): Units_Constants.ActionStateId;
    setActionState(state: Units_Constants.ActionStateId): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for player index and team index.
    ////////////////////////////////////////////////////////////////////////////////
    setPlayerIndex(index: number): void;
    getPlayerIndex(): number;

    getTeamIndex(): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for hp and armor.
    ////////////////////////////////////////////////////////////////////////////////
    getMaxHp(): number;
    getNormalizedMaxHp(): number;

    getNormalizedCurrentHp(): number;
    getCurrentHp(): number;
    setCurrentHp(hp: number): void;
    addCurrentHp(offsetHp: number): void;

    checkIsFullHp(): boolean;

    getArmorType(): number;

    checkIsArmorAffectByLuck(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for weapon.
    ////////////////////////////////////////////////////////////////////////////////
    checkHasWeapon(): boolean;

    checkHasPrimaryWeapon(): boolean;

    getPrimaryWeaponMaxAmmo(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    getPrimaryWeaponCurrentAmmo(): number;
    setAndValidatePrimaryWeaponCurrentAmmo(ammo: number): void;
    addAndValidatePrimaryWeaponCurrentAmmo(offsetAmmo: number): void;

    getPrimaryWeaponUsedAmmo(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    checkIsPrimaryWeaponAmmoInShort(): boolean;

    getPrimaryWeaponBaseDamage(armorType: number): number | null;

    getAttackModifierByCo({ selfGridIndex, isCounter, observerTeamIndexSet, useDamagePreviewSettings }: {
        selfGridIndex               : AuxiliaryTypes_GridIndex.GridIndex;
        isCounter                   : boolean;
        observerTeamIndexSet        : Set<number> | null;
        useDamagePreviewSettings    : boolean;
    }): number;
    getAttackModifierByWeather(selfGridIndex: AuxiliaryTypes_GridIndex.GridIndex, observerTeamIndexSet: Set<number> | null, useDamagePreviewSettings: boolean): number;
    getEffectiveOffensePierce(selfGridIndex: AuxiliaryTypes_GridIndex.GridIndex): number[];
    getDefenseModifierByCo({ selfGridIndex, attackerUnitTypeId, observerTeamIndexSet, useDamagePreviewSettings }: {
        selfGridIndex               : AuxiliaryTypes_GridIndex.GridIndex;
        attackerUnitTypeId          : number | null;
        observerTeamIndexSet        : Set<number> | null;
        useDamagePreviewSettings    : boolean;
    }): number;

    checkCanBeCounterAttackedByCo(selfGridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean;
    checkCanCounterAttackByCo(selfGridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean;

    getLuckLimitModifierByCo(selfGridIndex: AuxiliaryTypes_GridIndex.GridIndex): { lower: number, upper: number };

    checkHasSecondaryWeapon(): boolean;

    getCfgSecondaryWeaponBaseDamage(armorType: number): number | null;
    getSecondaryWeaponBaseDamage(armorType: number): number | null;

    getCfgBaseDamage(targetArmorType: number, weaponType: Units_Constants.WeaponTypeId): number | null;
    getBaseDamage(armorType: number): number | null;

    getMinAttackRange(): number | null;
    getCfgMaxAttackRange(): number | null;
    /** 以移动前的状况计算，攻击范围在移动和战斗过程中维持不变 */
    getFinalMaxAttackRange(): number | null;

    getCfgCanAttackAfterMoving(): boolean;
    getFinalCanAttackAfterMoving(): boolean;

    /** 此函数不考虑指定的移动路径是否合法。也就是说，如果移动路径上存在隐藏的敌军，也会返回true */
    checkCanAttackTargetAfterMovePath(movePath: AuxiliaryTypes_GridIndex.GridIndex[], targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean;

    /** 此函数不考虑指定的移动路径是否合法。也就是说，如果移动路径上存在隐藏的敌军，也会返回true */
    checkCanAttackUnitAfterMovePath(movePath: AuxiliaryTypes_GridIndex.GridIndex[], targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean;

    /** 此函数不考虑指定的移动路径是否合法。也就是说，如果移动路径上存在隐藏的敌军，也会返回true */
    checkCanAttackTileAfterMovePath(movePath: AuxiliaryTypes_GridIndex.GridIndex[], targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for capture.
    ////////////////////////////////////////////////////////////////////////////////
    checkIsCapturingTile(): boolean;

    checkIsCapturer(): boolean;
    checkCanCaptureTile(tile: Tiles_ITile.ITile): boolean;

    getFinalCaptureAmount(selfGridIndex: AuxiliaryTypes_GridIndex.GridIndex): number | null;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for dive.
    ////////////////////////////////////////////////////////////////////////////////
    getIsDiving(): boolean;
    setIsDiving(isDiving: boolean): void;

    checkIsDiver(): boolean;
    checkCanDive(): boolean;
    checkCanSurface(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for invisible.
    ////////////////////////////////////////////////////////////////////////////////
    checkIsInvisible(selfGridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for fuel.
    ////////////////////////////////////////////////////////////////////////////////
    getCurrentFuel(): number;
    setCurrentFuel(fuel: number): void;
    addCurrentFuel(offsetFuel: number): void;

    getMaxFuel(): number;

    getUsedFuel(): number;

    getFuelConsumptionPerTurn(): number;

    checkIsDestroyedOnOutOfFuel(): boolean;

    checkIsFuelInShort(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for flare.
    ////////////////////////////////////////////////////////////////////////////////
    getFlareRadius(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number | null;

    getFlareMaxRange(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number | null;

    getFlareMaxAmmo(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    getFlareCurrentAmmo(): number;
    setFlareCurrentAmmo(ammo: number): void;
    addFlareCurrentAmmo(offsetAmmo: number): void;

    getFlareUsedAmmo(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    checkIsFlareAmmoInShort(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for grid position.
    ////////////////////////////////////////////////////////////////////////////////
    getGridX(): number;
    setGridX(x: number): void;

    getGridY(): number;
    setGridY(y: number): void;

    getGridIndex(): AuxiliaryTypes_GridIndex.GridIndex;
    setGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for produce unit.
    ////////////////////////////////////////////////////////////////////////////////
    getProduceUnitTypeId(): number | null;

    getProduceUnitCost(): number;

    getMaxProduceMaterial(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    getCurrentProduceMaterial(): number;
    setAndValidateCurrentProduceMaterial(material: number): void;
    addAndValidateCurrentProduceMaterial(offset: number): void;

    checkIsProduceMaterialInShort(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for move.
    ////////////////////////////////////////////////////////////////////////////////
    getCfgMoveRange(): number;
    getFinalMoveRange(): number;

    getMoveTypeId(): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for produce self.
    ////////////////////////////////////////////////////////////////////////////////
    getProductionCfgCost(): number;
    getProductionFinalCost(extraMultiplier?: number): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for promotion.
    ////////////////////////////////////////////////////////////////////////////////
    getMaxPromotion(): number;

    getCurrentPromotion(): number;
    setCurrentPromotion(promotion: number): void;
    addAndReviseCurrentPromotion(offset: number): void;

    getPromotionAttackBonus(): number;

    getPromotionDefenseBonus(): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for launch silo.
    ////////////////////////////////////////////////////////////////////////////////
    checkCanLaunchSiloOnTile(tile: Tiles_ITile.ITile): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for build tile.
    ////////////////////////////////////////////////////////////////////////////////
    checkIsBuildingTile(): boolean;

    checkIsTileBuilder(): boolean;
    checkCanBuildOnTile(tile: Tiles_ITile.ITile): boolean;

    getBuildTargetTileCfg(baseType: number, objectType: number): BuildableTileCfg | null;

    getBuildAmount(): number | null;

    getMaxBuildMaterial(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;

    getCurrentBuildMaterial(): number;
    setCurrentBuildMaterial(material: number): void;

    checkIsBuildMaterialInShort(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for load unit.
    ////////////////////////////////////////////////////////////////////////////////
    getMaxLoadUnitsCount(): number | null;
    getLoadedUnitsCount(): number;
    getLoadedUnits(): IUnit[];

    getLoadUnitCategoryId(): number | null;

    checkHasLoadUnitId(id: number): boolean;

    checkCanLoadUnit(unit: IUnit): boolean;

    checkCanDropLoadedUnit(tileType: number): boolean;
    getCfgCanDropLoadedUnit(): boolean;

    checkCanLaunchLoadedUnit(): boolean;
    checkCanSupplyLoadedUnit(): boolean;
    getNormalizedRepairHpForLoadedUnit(): number | null;

    getNormalizedRepairAmountAndCostModifier(): { amountModifier: number, costMultiplierPct: number };

    setLoaderUnitId(loaderUnitId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void;
    getLoaderUnitId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    getLoaderUnit(): IUnit | null;
    checkIsMeetLoadedState(state: number): boolean;

    getRepairHpAndCostForLoadedUnit(unit: IUnit): AuxiliaryTypes_AuxiliaryTypes.RepairHpAndCost | null;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for supply unit.
    ////////////////////////////////////////////////////////////////////////////////
    checkIsAdjacentUnitSupplier(): boolean;
    checkCanSupplyAdjacentUnit(unit: IUnit): boolean;

    checkCanBeSuppliedWithFuel(): boolean;
    checkCanBeSuppliedWithPrimaryWeaponAmmo(): boolean;
    checkCanBeSuppliedWithFlareAmmo(): boolean;
    checkCanBeSupplied(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for vision.
    ////////////////////////////////////////////////////////////////////////////////
    getCfgVisionRange(): number;
    getVisionRangeBonusOnTile(tileType: number): number;

    getVisionInfo(): AuxiliaryTypes_UnitVisionInfo.UnitVisionInfo;
    getFinalVisionRange(visionInfo: AuxiliaryTypes_UnitVisionInfo.UnitVisionInfo, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for join.
    ////////////////////////////////////////////////////////////////////////////////
    checkCanJoinUnit(unit: IUnit): boolean;

    getJoinIncome(unit: IUnit): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for co.
    ////////////////////////////////////////////////////////////////////////////////
    setIsCoOnboard(isCoOnBoard: boolean): void;
    getIsCoOnboard(): boolean;

    checkCanCoBoardAfterMovePath(movePath: AuxiliaryTypes_GridIndex.GridIndex[]): boolean;

    checkCanUseCoSkill(skillType: CoSkills_Constants.SkillTypeId): boolean;

    getCoBoardCost(): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for tag.
    ////////////////////////////////////////////////////////////////////////////////
    setGroupedTagId(encodedTagIds: number): void;
    getGroupedTagId(): number;

    getHasTagId(tagId: number): boolean;

    getTagIdArray(hasTag: boolean): number[];

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for forbidden locations.
    ////////////////////////////////////////////////////////////////////////////////
    setForbiddenGroupedLocationIdArray(forbiddenGroupedLocationIdArray: number[]): void;
    getForbiddenGroupedLocationIdArray(): number[];
    getForbiddenLocationIdArray(): number[];

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for weighted destination.
    ////////////////////////////////////////////////////////////////////////////////
    setAiWeightedDestinationWithProto(proto: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeightedGridIndex>): void;
    getAiWeightedDestination(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_GridIndexAndWeight.GridIndexAndWeight>;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for ai mode.
    ////////////////////////////////////////////////////////////////////////////////
    setAiMode(aiMode: Units_Constants.AiModeId): void;
    getAiMode(): Units_Constants.AiModeId;

    /**
     * @returns indicates the ai mode is modified or not
     */
    checkAndUpdateAiMode(): boolean;

    checkCanAiDoAction(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for buff.
    ////////////////////////////////////////////////////////////////////////////////
    getBuffList(): UnitBuff[];
    setBuffList(buffArray: UnitBuff[]): void;

    updateBuffArrayOnPlayerTurnSwitched(updateView: boolean): boolean;
    addBuff(buff: UnitBuff, updateView: boolean, needNotify: boolean): void;
    deleteBuff(buff: UnitBuff, updateView: boolean): boolean;

    checkHasBuff(buffTypeId: number): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // custom name
    ////////////////////////////////////////////////////////////////////////////////
    getCustomNameId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    setCustomNameId(nameId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void;

    getCustomName(languageType?: Lang_Constants.LanguageType): AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;
}
