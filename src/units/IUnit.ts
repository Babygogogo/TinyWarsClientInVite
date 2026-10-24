import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesGridIndexAndWeight from "../auxiliaryTypes/GridIndexAndWeight.ts";
import type * as AuxiliaryTypesUnitVisionInfo from "../auxiliaryTypes/UnitVisionInfo.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as CoSkillsConstants from "../coSkills/Constants.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import type * as LangConstants from "../lang/Constants.ts";
import type * as PlayersIPlayer from "../players/IPlayer.ts";
import type * as ProtoSchemaCommonProtoConfigBuildableTileCfg from "../proto/schema/CommonProto/Config/BuildableTileCfg.ts";
import type * as ProtoSchemaCommonProtoConfigUnitTemplateCfg from "../proto/schema/CommonProto/Config/UnitTemplateCfg.ts";
import type * as ProtoSchemaCommonProtoStructureUnitBuff from "../proto/schema/CommonProto/Structure/UnitBuff.ts";
import type * as ProtoSchemaCommonProtoStructureWeightedGridIndex from "../proto/schema/CommonProto/Structure/WeightedGridIndex.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialUnit from "../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import type * as TilesITile from "../tiles/ITile.ts";
import type * as UnitsConstants from "./Constants.ts";
import type * as UnitsIUnitView from "./IUnitView.ts";

type GridIndex          = AuxiliaryTypesGridIndex.GridIndex;
type GridIndexAndWeight = AuxiliaryTypesGridIndexAndWeight.GridIndexAndWeight;
type UnitActionState    = UnitsConstants.ActionStateId;
type UnitAiMode         = UnitsConstants.AiModeId;
type UnitWeaponType     = UnitsConstants.WeaponTypeId;
type CoSkillType        = CoSkillsConstants.SkillTypeId;
type GameConfiguration  = GameConfigGcData.GcData;
type UnitBuff           = ProtoSchemaCommonProtoStructureUnitBuff.UnitBuff;
type SerialUnit         = ProtoSchemaCommonProtoWarSerializationSerialUnit.SerialUnit;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type IPlayer            = PlayersIPlayer.IPlayer;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;
type IBwTile            = TilesITile.ITile;

export interface IUnit {
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Initializers and serializers.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    init(unitData: SerialUnit, gameConfig: GameConfiguration): void;

    startRunning(war: IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    clone(): IUnit;

    serialize(): SerialUnit;
    serializeForCreateSfw(): SerialUnit;
    serializeForCreateMfr(): SerialUnit;

    getWar(): IBwWar;

    getGcData(): GameConfiguration;

    getTemplateCfg(): ProtoSchemaCommonProtoConfigUnitTemplateCfg.UnitTemplateCfg;

    getUnitType(): number;

    getPlayer(): IPlayer;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////
    getView(): UnitsIUnitView.IUnitView;

    updateView(): void;
    setViewVisible(visible: boolean): void;

    moveViewAlongPath({ pathNodes, isDiving, isBlocked, aiming, updateViewAfterMove }: {
        pathNodes           : GridIndex[];
        isDiving            : boolean;
        isBlocked           : boolean;
        aiming              : GridIndex | null;
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
    getActionState(): UnitActionState;
    setActionState(state: UnitActionState): void;

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

    getPrimaryWeaponMaxAmmo(): Undefinable<number>;

    getPrimaryWeaponCurrentAmmo(): number;
    setAndValidatePrimaryWeaponCurrentAmmo(ammo: number): void;
    addAndValidatePrimaryWeaponCurrentAmmo(offsetAmmo: number): void;

    getPrimaryWeaponUsedAmmo(): Undefinable<number>;

    checkIsPrimaryWeaponAmmoInShort(): boolean;

    getPrimaryWeaponBaseDamage(armorType: number): number | null;

    getAttackModifierByCo({ selfGridIndex, isCounter, observerTeamIndexSet, useDamagePreviewSettings }: {
        selfGridIndex               : GridIndex;
        isCounter                   : boolean;
        observerTeamIndexSet        : Set<number> | null;
        useDamagePreviewSettings    : boolean;
    }): number;
    getAttackModifierByWeather(selfGridIndex: GridIndex, observerTeamIndexSet: Set<number> | null, useDamagePreviewSettings: boolean): number;
    getEffectiveOffensePierce(selfGridIndex: GridIndex): number[];
    getDefenseModifierByCo({ selfGridIndex, attackerUnitTypeId, observerTeamIndexSet, useDamagePreviewSettings }: {
        selfGridIndex               : GridIndex;
        attackerUnitTypeId          : number | null;
        observerTeamIndexSet        : Set<number> | null;
        useDamagePreviewSettings    : boolean;
    }): number;

    checkCanBeCounterAttackedByCo(selfGridIndex: GridIndex): boolean;
    checkCanCounterAttackByCo(selfGridIndex: GridIndex): boolean;

    getLuckLimitModifierByCo(selfGridIndex: GridIndex): { lower: number, upper: number };

    checkHasSecondaryWeapon(): boolean;

    getCfgSecondaryWeaponBaseDamage(armorType: number): number | null;
    getSecondaryWeaponBaseDamage(armorType: number): number | null;

    getCfgBaseDamage(targetArmorType: number, weaponType: UnitWeaponType): number | null;
    getBaseDamage(armorType: number): number | null;

    getMinAttackRange(): number | null;
    getCfgMaxAttackRange(): number | null;
    /** 以移动前的状况计算，攻击范围在移动和战斗过程中维持不变 */
    getFinalMaxAttackRange(): number | null;

    getCfgCanAttackAfterMoving(): boolean;
    getFinalCanAttackAfterMoving(): boolean;

    /** 此函数不考虑指定的移动路径是否合法。也就是说，如果移动路径上存在隐藏的敌军，也会返回true */
    checkCanAttackTargetAfterMovePath(movePath: GridIndex[], targetGridIndex: GridIndex): boolean;

    /** 此函数不考虑指定的移动路径是否合法。也就是说，如果移动路径上存在隐藏的敌军，也会返回true */
    checkCanAttackUnitAfterMovePath(movePath: GridIndex[], targetGridIndex: GridIndex): boolean;

    /** 此函数不考虑指定的移动路径是否合法。也就是说，如果移动路径上存在隐藏的敌军，也会返回true */
    checkCanAttackTileAfterMovePath(movePath: GridIndex[], targetGridIndex: GridIndex): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for capture.
    ////////////////////////////////////////////////////////////////////////////////
    checkIsCapturingTile(): boolean;

    checkIsCapturer(): boolean;
    checkCanCaptureTile(tile: IBwTile): boolean;

    getFinalCaptureAmount(selfGridIndex: GridIndex): number | null;

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
    checkIsInvisible(selfGridIndex: GridIndex): boolean;

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
    getFlareRadius(gridIndex: GridIndex): number | null;

    getFlareMaxRange(gridIndex: GridIndex): number | null;

    getFlareMaxAmmo(): Undefinable<number>;

    getFlareCurrentAmmo(): number;
    setFlareCurrentAmmo(ammo: number): void;
    addFlareCurrentAmmo(offsetAmmo: number): void;

    getFlareUsedAmmo(): Undefinable<number>;

    checkIsFlareAmmoInShort(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for grid position.
    ////////////////////////////////////////////////////////////////////////////////
    getGridX(): number;
    setGridX(x: number): void;

    getGridY(): number;
    setGridY(y: number): void;

    getGridIndex(): GridIndex;
    setGridIndex(gridIndex: GridIndex): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for produce unit.
    ////////////////////////////////////////////////////////////////////////////////
    getProduceUnitTypeId(): number | null;

    getProduceUnitCost(): number;

    getMaxProduceMaterial(): Undefinable<number>;

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
    checkCanLaunchSiloOnTile(tile: IBwTile): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for build tile.
    ////////////////////////////////////////////////////////////////////////////////
    checkIsBuildingTile(): boolean;

    checkIsTileBuilder(): boolean;
    checkCanBuildOnTile(tile: IBwTile): boolean;

    getBuildTargetTileCfg(baseType: number, objectType: number): ProtoSchemaCommonProtoConfigBuildableTileCfg.BuildableTileCfg | null;

    getBuildAmount(): number | null;

    getMaxBuildMaterial(): Undefinable<number>;

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

    setLoaderUnitId(loaderUnitId: Undefinable<number>): void;
    getLoaderUnitId(): Undefinable<number>;
    getLoaderUnit(): IUnit | null;
    checkIsMeetLoadedState(state: number): boolean;

    getRepairHpAndCostForLoadedUnit(unit: IUnit): AuxiliaryTypesAuxiliaryTypes.RepairHpAndCost | null;

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

    getVisionInfo(): AuxiliaryTypesUnitVisionInfo.UnitVisionInfo;
    getFinalVisionRange(visionInfo: AuxiliaryTypesUnitVisionInfo.UnitVisionInfo, gridIndex: GridIndex): number;

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

    checkCanCoBoardAfterMovePath(movePath: GridIndex[]): boolean;

    checkCanUseCoSkill(skillType: CoSkillType): boolean;

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
    setAiWeightedDestinationWithProto(proto: Undefinable<ProtoSchemaCommonProtoStructureWeightedGridIndex.WeightedGridIndex>): void;
    getAiWeightedDestination(): Undefinable<GridIndexAndWeight>;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for ai mode.
    ////////////////////////////////////////////////////////////////////////////////
    setAiMode(aiMode: UnitAiMode): void;
    getAiMode(): UnitAiMode;

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
    getCustomNameId(): Undefinable<number>;
    setCustomNameId(nameId: Undefinable<number>): void;

    getCustomName(languageType?: LangConstants.LanguageType): AuxiliaryTypesAuxiliaryTypes.Undefinable<string>;
}
