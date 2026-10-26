import type { Undefinable, RepairHpAndCost } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { GcData } from "../gameConfigs/GcData.ts";
import type { LanguageType } from "../lang/Constants.ts";
import type { IPlayer } from "../players/IPlayer.ts";
import type {
    SelfTileEnabledForUnitProduction,
} from "../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";
import type { TileTemplateCfg } from "../proto/schema/CommonProto/Config/TileTemplateCfg.ts";
import type { TileBuff } from "../proto/schema/CommonProto/Structure/TileBuff.ts";
import type { SerialTile } from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { TileCustomBuildingData } from "../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import type { TileCustomCannonData } from "../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import type { TileCustomCrystalData } from "../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import type { TileCustomLaserTurretData } from "../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";
import type { ITileView } from "./ITileView.ts";
import type { IUnit } from "../units/IUnit.ts";
import type { ClientErrorCode } from "../utils/ClientErrorCode.ts";

type GameConfiguration      = GcData;
export interface ITile {
    init(data: SerialTile, gameConfig: GameConfiguration): void;
    fastInit(data: SerialTile, gameConfig: GameConfiguration): void;

    startRunning(war: IBwWar): void;
    startRunningView(): void;

    getErrorCodeForTileData(data: SerialTile, playersCountUnneutral: number, gameConfig: GameConfiguration): ClientErrorCode;
    deserialize(data: SerialTile, gameConfig: GameConfiguration): void;
    serialize(): SerialTile;
    serializeForCreateSfw(): SerialTile;
    serializeForCreateMfr(): SerialTile;
    serializeForTeamIndexes(teamIndexes: Set<number>): SerialTile;

    getWar(): IBwWar;

    getGameConfig(): GameConfiguration;

    getTemplateCfg(): TileTemplateCfg;

    updateOnUnitLeave(): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////
    getView(): ITileView;
    flushDataToView(): void;

    setBaseType(baseType: number): void;
    getBaseType(): number;

    setObjectType(objectType: number): void;
    getObjectType(): number;

    setDecorationType(decorationType: number): void;
    getDecorationType(): number;

    setBaseShapeId(id: number): void;
    getBaseShapeId(): number;

    setObjectShapeId(id: number): void;
    getObjectShapeId(): number;

    setDecorationShapeId(id: number): void;
    getDecorationShapeId(): number;

    getSkinId(): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for hp and armor.
    ////////////////////////////////////////////////////////////////////////////////
    getMaxHp(): Undefinable<number>;

    getCurrentHp(): number;
    setCurrentHp(hp: number): void;

    getArmorType(): Undefinable<number>;

    checkIsArmorAffectByLuck(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for build.
    ////////////////////////////////////////////////////////////////////////////////
    getMaxBuildPoint(): Undefinable<number>;

    getCurrentBuildPoint(): number;
    setCurrentBuildPoint(point: number): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for capture.
    ////////////////////////////////////////////////////////////////////////////////
    getMaxCapturePoint(): Undefinable<number>;

    getCurrentCapturePoint(): number;
    setCurrentCapturePoint(point: number): void;

    getRemainingCapturePoint(): Undefinable<number>;

    getIsDefeatedOnCapture(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for location flags.
    ////////////////////////////////////////////////////////////////////////////////
    setGroupedLocationIdArray(groupedLocationIdArray: number[]): void;
    getGroupedLocationIdArray(): number[];

    checkHasAnyLocationIdByGroupedLocationIdArray(groupedLocationIdArray: number[]): boolean;

    getHasLocationId(locationId: number): boolean;
    setHasLocationId(locationId: number, hasId: boolean): void;
    setHasLocationIdWithLocationIdArray(locationIdArray: number[], hasId: boolean): void;
    getLocationIdList(hasId: boolean): number[];

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for highlight.
    ////////////////////////////////////////////////////////////////////////////////
    getIsHighlighted(): boolean;
    setIsHighlighted(isHighlighted: boolean): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for buff.
    ////////////////////////////////////////////////////////////////////////////////
    getAllBuffTypeIdSet(): Set<number>;

    getUnfixedBuffList(): TileBuff[];
    setUnfixedBuffList(buffArray: TileBuff[]): void;

    updateUnfixedBuffArrayOnPlayerTurnSwitched(updateView: boolean): boolean;
    addUnfixedBuff(buff: TileBuff, updateView: boolean): void;
    deleteUnfixedBuff(buff: TileBuff, updateView: boolean): boolean;

    checkHasUnfixedBuff(buffTypeId: number): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for defense amount for units.
    ////////////////////////////////////////////////////////////////////////////////
    getDefenseAmount(): number;
    getDefenseAmountForUnit(unit: IUnit, observerTeamIndexSet: Undefinable<Set<number>>, useDamagePreviewSettings: boolean): number;

    getDefenseUnitTypeArray(): Undefinable<number[]>;
    checkCanDefendUnit(unit: IUnit): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for grid position.
    ////////////////////////////////////////////////////////////////////////////////
    getGridX(): number;

    getGridY(): number;

    getGridIndex(): GridIndex;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for type.
    ////////////////////////////////////////////////////////////////////////////////
    getTileTypeId(): number;

    resetByTypeAndPlayerIndex({ baseType, objectType, playerIndex }: {
        baseType        : number;
        objectType      : number;
        playerIndex     : number;
    }): void;

    resetOnTileObjectDestroyed(): void;

    deleteTileDecoration(): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for income.
    ////////////////////////////////////////////////////////////////////////////////
    getIncomePerTurn(): number;
    getIncomeForPlayer(playerIndex: number): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for player index.
    ////////////////////////////////////////////////////////////////////////////////
    setPlayerIndex(index: number): void;
    getPlayerIndex(): number;

    getPlayer(): IPlayer;

    getTeamIndex(): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for move cost.
    ////////////////////////////////////////////////////////////////////////////////
    checkCanBlockEnemyUnitType(unitType: number): boolean;
    getBlockEnemyUnitTypeArray(): Undefinable<number[]>;

    getMoveCostByMoveType(moveType: number): Undefinable<number>;
    getMoveCostByUnit(unit: IUnit): Undefinable<number>;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for repair/supply unit.
    ////////////////////////////////////////////////////////////////////////////////
    getRepairNormalizedHp(): Undefinable<number>;

    getNormalizedRepairAmountAndCostModifier(): { amountModifier: number, costMultiplierPct: number };

    checkCanRepairOrSupplyUnitType(unitType: number): boolean;
    getRepairUnitTypeArray(): Undefinable<number[]>;

    getRepairHpAndCostForUnit(unit: IUnit): Undefinable<RepairHpAndCost>;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for hide unit.
    ////////////////////////////////////////////////////////////////////////////////
    checkCanHideUnitType(unitType: number): boolean;
    checkIsUnitHider(): boolean;
    getHideUnitTypeArray(): Undefinable<number[]>;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for produce unit.
    ////////////////////////////////////////////////////////////////////////////////
    getEffectiveSelfUnitProductionSkillCfg(playerIndex: number): Undefinable<SelfTileEnabledForUnitProduction>;

    /** 把co技能，事件，规则，buff全都考虑了进去 */
    checkIsUnitProducerForPlayer(playerIndex: number): boolean;

    /** 把co技能，事件，规则，buff全都考虑了进去 */
    getProducibleUnitTypeArrayForPlayer(playerIndex: number): Undefinable<number[]>;

    /** 只考虑地形本身属性，不考虑co技能、事件、规则、buff */
    getRegularProducibleUnitTypeArray(): Undefinable<number[]>;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for vision.
    ////////////////////////////////////////////////////////////////////////////////
    getCfgVisionRange(): number;
    getIsVisionEnabledForAllPlayers(): boolean;

    getFinalVisionRange(): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for global attack/defense bonus.
    ////////////////////////////////////////////////////////////////////////////////
    getGlobalAttackBonus(): number;
    getGlobalDefenseBonus(): number;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for load co.
    ////////////////////////////////////////////////////////////////////////////////
    getCoBoardUnitTypeArray(): Undefinable<number[]>;

    ////////////////////////////////////////////////////////////////////////////////
    // custom name
    ////////////////////////////////////////////////////////////////////////////////
    getCustomNameId(): Undefinable<number>;
    setCustomNameId(nameId: Undefinable<number>): void;

    getCustomName(languageType?: LanguageType): Undefinable<string>;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for map weapon.
    ////////////////////////////////////////////////////////////////////////////////
    getMapWeaponType(): Undefinable<number>;
    checkIsMapWeapon(): boolean;
    checkIsCustomMapWeapon(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for crystal data.
    ////////////////////////////////////////////////////////////////////////////////
    getFinalCrystalData(): Undefinable<TileCustomCrystalData>;
    getCustomCrystalData(): Undefinable<TileCustomCrystalData>;

    checkIsNormalCrystal(): boolean;
    setCustomCrystalRadius(radius: number): void;
    setCustomCrystalPriority(priority: number): void;
    setCustomCrystalCanAffectSelf(canAffect: boolean): void;
    setCustomCrystalCanAffectAlly(canAffect: boolean): void;
    setCustomCrystalCanAffectEnemy(canAffect: boolean): void;
    setCustomCrystalDeltaFund(deltaFund: number): void;
    setCustomCrystalDeltaEnergyPercentage(percentage: number): void;
    setCustomCrystalOffsetHp(deltaHp: number): void;
    setCustomCrystalCanBeFatal(value: boolean): void;
    setCustomCrystalDeltaPrimaryAmmoPercentage(percentage: number): void;
    setCustomCrystalDeltaFuelPercentage(percentage: number): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for cannon data.
    ////////////////////////////////////////////////////////////////////////////////
    getFinalCannonData(): Undefinable<TileCustomCannonData>;
    getCustomCannonData(): Undefinable<TileCustomCannonData>;

    checkIsNormalCannon(): boolean;

    setCustomCannonRangeForUp(rangeForUp: number): void;
    setCustomCannonRangeForDown(rangeForDown: number): void;
    setCustomCannonRangeForLeft(rangeForLeft: number): void;
    setCustomCannonRangeForRight(rangeForRight: number): void;

    setCustomCannonPriority(priority: number): void;
    setCustomCannonMaxTargetCount(count: number): void;

    setCustomCannonCanAffectSelf(canAffect: boolean): void;
    setCustomCannonCanAffectAlly(canAffect: boolean): void;
    setCustomCannonCanAffectEnemy(canAffect: boolean): void;

    setCustomCannonOffsetHp(deltaHp: number): void;
    setCustomCannonCanBeFatal(value: boolean): void;
    setCustomCannonDeltaPrimaryAmmoPercentage(percentage: number): void;
    setCustomCannonDeltaFuelPercentage(percentage: number): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for cannon data.
    ////////////////////////////////////////////////////////////////////////////////
    getFinalLaserTurretData(): Undefinable<TileCustomLaserTurretData>;
    getCustomLaserTurretData(): Undefinable<TileCustomLaserTurretData>;

    checkIsNormalLaserTurret(): boolean;

    setCustomLaserTurretRangeForUp(rangeForUp: number): void;
    setCustomLaserTurretRangeForDown(rangeForDown: number): void;
    setCustomLaserTurretRangeForLeft(rangeForLeft: number): void;
    setCustomLaserTurretRangeForRight(rangeForRight: number): void;

    setCustomLaserTurretPriority(priority: number): void;

    setCustomLaserTurretCanAffectSelf(canAffect: boolean): void;
    setCustomLaserTurretCanAffectAlly(canAffect: boolean): void;
    setCustomLaserTurretCanAffectEnemy(canAffect: boolean): void;

    setCustomLaserTurretOffsetHp(deltaHp: number): void;
    setCustomLaserTurretCanBeFatal(value: boolean): void;
    setCustomLaserTurretDeltaPrimaryAmmoPercentage(percentage: number): void;
    setCustomLaserTurretDeltaFuelPercentage(percentage: number): void;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for custom building data.
    ////////////////////////////////////////////////////////////////////////////////
    setCustomBuildingData(data: Undefinable<TileCustomBuildingData>): void;
    getCustomBuildingData(): Undefinable<TileCustomBuildingData>;

    getIsCustomizableBuilding(): boolean;

    ////////////////////////////////////////////////////////////////////////////////
    // Functions for fog.
    ////////////////////////////////////////////////////////////////////////////////
    setHasFog(hasFog: boolean): void;
    getHasFog(): boolean;

    resetTileDataAsHasFog(): void;

    getTileThemeType(): number;
}
