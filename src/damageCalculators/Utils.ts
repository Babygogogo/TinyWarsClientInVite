import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import { BattleInfo } from "../auxiliaryTypes/BattleInfo.ts";
import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { CoId, EnergyTypeId } from "../cos/Constants.ts";
import { getTotalOffset } from "../coSkills/utils/instantMisc/SelfFundAfterBattle.ts";
import {
    getTotalOffset as CoSkillsUtilsInstantMiscSelfUnitPromotionAfterBattleGetTotalOffset,
} from "../coSkills/utils/instantMisc/SelfUnitPromotionAfterBattle.ts";
import { destroyUnitOnMapForWarDamageCalculator } from "../destructions/Utils.ts";
import type { GameConfig } from "../gameConfigs/GameConfig.ts";
import { DamageFormulaTypeId } from "./Constants.ts";
import { newError, getExisted } from "../helpers/Misc.ts";
import { encodeTeamIndex } from "../helpers/Team.ts";
import { MaxInt32 } from "../numbers/Constants.ts";
import { getValueInRange } from "../numbers/Utils.ts";
import { AliveStateId, Fund } from "../players/Constants.ts";
import type { IPlayer } from "../players/IPlayer.ts";
import { BattleDamageInfo } from "../proto/schema/CommonProto/Structure/BattleDamageInfo.ts";
import { WsUnitStatistics } from "../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { ITile } from "../tiles/ITile.ts";
import { WeaponTypeId } from "../units/Constants.ts";
import type { IUnit } from "../units/IUnit.ts";
import type { IUnitMap } from "../units/IUnitMap.ts";
import { getNormalizedHp } from "../units/utils/Common.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../visibilities/Utils.ts";

type IBwUnit                = IUnit;
type IBwPlayer              = IPlayer;
type IBwUnitMap             = IUnitMap;
type IBwTile                = ITile;

function checkIsInAttackRange({ gridIndex1, gridIndex2, minAttackRange1, maxAttackRange1 }: {
    gridIndex1      : GridIndex;
    gridIndex2      : GridIndex;
    minAttackRange1  : number | null;
    maxAttackRange1  : number | null;
}): boolean {
    if ((minAttackRange1 == null) || (maxAttackRange1 == null)) {
        return false;
    } else {
        const distance = gridIndex1.getDistance(gridIndex2);
        return (distance >= minAttackRange1) && (distance <= maxAttackRange1);
    }
}

function getLuckValue(war: IBwWar, attackerUnit: IBwUnit, attackerGridIndex: GridIndex, isEstimated: boolean): number {
    const playerIndex               = attackerUnit.getPlayerIndex();
    const playerRule                = war.getCommonSettingManager().getPlayerRule(playerIndex);
    const lowerLimitForSettings     = playerRule.getLuckLowerLimit();
    const upperLimitForSettings     = playerRule.getLuckUpperLimit();
    const lowerLimitModifierByOpa   = war.getWarEventManager().getOpaLuckLowerLimitModifier(attackerUnit, attackerGridIndex);
    const upperLimitModifierByOpa   = war.getWarEventManager().getOpaLuckUpperLimitModifier(attackerUnit, attackerGridIndex);
    const modifierByCo              = attackerUnit.getLuckLimitModifierByCo(attackerGridIndex);
    let lowerLimit                  = lowerLimitForSettings + modifierByCo.lower + lowerLimitModifierByOpa;
    let upperLimit                  = upperLimitForSettings + modifierByCo.upper + upperLimitModifierByOpa;
    if (lowerLimit > upperLimit) {
        [lowerLimit, upperLimit] = [upperLimit, lowerLimit];
    }
    lowerLimit = Math.ceil(lowerLimit);
    upperLimit = Math.floor(upperLimit);

    if (isEstimated) {
        return Math.min(lowerLimit, upperLimit);
    } else {
        const randomNumber = war.getRandomNumberManager().getAndTickNextNumber();
        return Math.floor(randomNumber * (Math.abs(upperLimit - lowerLimit) + 1)) + Math.min(lowerLimit, upperLimit);
    }
}

export function getDamageMultiplierForDefenseBonus(gcData: GameConfig, bonus: number): number {    // DONE
    const formulaTypeId = gcData.getSystemCfg().getDamageFormulaTypeId();
    if (formulaTypeId === DamageFormulaTypeId.Dor) {
        return (bonus >= 0)
            ? 1 / (1 + bonus / 100)
            : 1 - bonus / 100;

    } else if (formulaTypeId === DamageFormulaTypeId.Trilogy) {
        return Math.max(0, 1 - bonus / 100);

    } else {
        throw newError(`Invalid formula type: ${formulaTypeId}`);
    }
}

function getAttackBonusMultiplier({ war, attacker, attackerGridIndex, isCounter, observerTeamIndexSet, useDamagePreviewSettings }: {
    war                         : IBwWar;
    attacker                    : IBwUnit;
    attackerGridIndex           : GridIndex;
    targetUnit                  : IBwUnit | null;
    targetGridIndex             : GridIndex;
    isCounter                   : boolean;
    observerTeamIndexSet        : Set<number> | null;
    useDamagePreviewSettings    : boolean;
}): number {
    const attackerPlayerIndex       = attacker.getPlayerIndex();
    const amountFromCommonSettings  = war.getCommonSettingManager().getPlayerRule(attackerPlayerIndex).getAttackPowerModifier();
    const amountFromGlobalTiles     = war.getTileMap().getTotalGlobalAttackBonus(attackerPlayerIndex, observerTeamIndexSet, useDamagePreviewSettings);
    const amountFromPromotion       = attacker.getPromotionAttackBonus();
    const amountFromOpa             = war.getWarEventManager().getOpaAttackPowerModifier(attacker, attackerGridIndex);
    const amountFromWeather         = attacker.getAttackModifierByWeather(attackerGridIndex, observerTeamIndexSet, useDamagePreviewSettings);
    const amountFromCo              = attacker.getAttackModifierByCo({
        selfGridIndex               : attackerGridIndex,
        isCounter                   : isCounter,
        observerTeamIndexSet        : observerTeamIndexSet,
        useDamagePreviewSettings    : useDamagePreviewSettings,
    });

    const totalAmount = amountFromCommonSettings
        + amountFromGlobalTiles
        + amountFromPromotion
        + amountFromOpa
        + amountFromWeather
        + amountFromCo;
    return Math.max(1 + totalAmount / 100, 0);
}

function getDefenseBonusMultiplierForUnit({ war, attacker, attackerGridIndex, target, targetGridIndex, observerTeamIndexSet, useDamagePreviewSettings }: {
    war                         : IBwWar;
    attacker                    : IBwUnit;
    attackerGridIndex           : GridIndex;
    target                      : IBwUnit;
    targetGridIndex             : GridIndex;
    isCounter                   : boolean;
    observerTeamIndexSet        : Set<number> | null;
    useDamagePreviewSettings    : boolean;
}): number {
    const tileMap               = war.getTileMap();
    const targetPlayerIndex     = target.getPlayerIndex();
    const amountFromTile        = tileMap.getTile(targetGridIndex).getDefenseAmountForUnit(target, observerTeamIndexSet, useDamagePreviewSettings);
    const amountFromPromotion   = target.getPromotionDefenseBonus();
    const amountFromRule        = war.getCommonSettingManager().getPlayerRule(targetPlayerIndex).getDefenseModifier();
    const amountFromOpa         = war.getWarEventManager().getOpaDefenseModifier(target, targetGridIndex);
    const amountFromGlobalTiles = tileMap.getTotalGlobalDefenseBonus(targetPlayerIndex, observerTeamIndexSet, useDamagePreviewSettings);
    const amountFromCo          = target.getDefenseModifierByCo({
        selfGridIndex               : targetGridIndex,
        attackerUnitTypeId          : attacker.getUnitType(),
        observerTeamIndexSet        : observerTeamIndexSet,
        useDamagePreviewSettings    : useDamagePreviewSettings,
    });

    const attackerOffensePierce = attacker.getEffectiveOffensePierce(attackerGridIndex);
    return getDamageMultiplierForDefenseBonus(
        war.getGcData(),
        amountFromTile          * (100 - attackerOffensePierce[0]) / 100 +
        amountFromPromotion     * (100 - attackerOffensePierce[1]) / 100 +
        amountFromCo            * (100 - attackerOffensePierce[2]) / 100 +
        amountFromGlobalTiles   * (100 - attackerOffensePierce[3]) / 100 +
        amountFromRule          * (100 - attackerOffensePierce[4]) / 100 +
        amountFromOpa           * (100 - attackerOffensePierce[5]) / 100
    );
}
function getDefenseBonusMultiplierForTile(): number {
    return 1;
}

function checkCanAttackTile({ unit1, movePath1, maxAttackRange1, canAttackAfterMoving1, tile2 }: {
    unit1                   : IBwUnit;
    movePath1               : GridIndex[];
    maxAttackRange1         : number | null;
    canAttackAfterMoving1   : boolean;
    tile2                   : IBwTile;
}): boolean {
    if (unit1.getTeamIndex() === tile2.getTeamIndex()) {
        return false;
    }

    const armorType = tile2.getArmorType();
    if (armorType == null) {
        return false;
    }

    if ((!canAttackAfterMoving1) && (movePath1.length > 1)) {
        return false;
    }

    if (!checkIsInAttackRange({
        gridIndex1      : unit1.getGridIndex(),
        gridIndex2      : tile2.getGridIndex(),
        minAttackRange1 : unit1.getMinAttackRange(),
        maxAttackRange1 : maxAttackRange1
    })) {
        return false;
    }

    return unit1.getBaseDamage(armorType) != null;
}
function checkCanAttackUnit({ unit1, movePath1, maxAttackRange1, canAttackAfterMoving1, unit2, isCounter }: {
    unit1                   : IBwUnit;
    movePath1               : GridIndex[] | null;
    maxAttackRange1         : number | null;
    canAttackAfterMoving1   : boolean;
    unit2                   : IBwUnit;
    isCounter               : boolean;
}): boolean {
    if (unit1.getTeamIndex() === unit2.getTeamIndex()) {
        return false;
    }
    if ((!canAttackAfterMoving1) && ((movePath1?.length ?? 0) > 1)) {
        return false;
    }
    if ((unit2.getIsDiving())                                                                                   &&
        (!unit2.getTemplateCfg().getDiveCfg()?.getCanBeAttackedByUnitTypeArray().includes(unit1.getUnitType()))
    ) {
        return false;
    }

    const gridIndex1 = unit1.getGridIndex();
    if ((isCounter) && (!unit1.checkCanCounterAttackByCo(gridIndex1))) {
        return false;
    }

    const gridIndex2 = unit2.getGridIndex();
    if ((isCounter) && (!unit2.checkCanBeCounterAttackedByCo(gridIndex2))) {
        return false;
    }

    if (!checkIsInAttackRange({
        gridIndex1      : gridIndex1,
        gridIndex2      : gridIndex2,
        minAttackRange1 : unit1.getMinAttackRange(),
        maxAttackRange1 : maxAttackRange1,
    })) {
        return false;
    }

    return unit1.getBaseDamage(unit2.getArmorType()) != null;
}

function getAttackDamageForAttackUnit({ war, unit1, unit2, isCounter, isEstimated, observerTeamIndexSet, useDamagePreviewSettings }: {
    war                         : IBwWar;
    unit1                       : IBwUnit;
    unit2                       : IBwUnit;
    isCounter                   : boolean;
    isEstimated                 : boolean;
    observerTeamIndexSet        : Set<number> | null;
    useDamagePreviewSettings    : boolean;
}): number {
    const unitHp1 = unit1.getCurrentHp();
    if (unitHp1 <= 0) {
        return 0;
    }

    const baseAttackDamage  = getExisted(unit1.getBaseDamage(unit2.getArmorType()));
    const gridIndex1        = unit1.getGridIndex();
    const gridIndex2        = unit2.getGridIndex();
    const attackBonusMultiplier     = getAttackBonusMultiplier({
        war                         : war,
        attacker                    : unit1,
        attackerGridIndex           : gridIndex1,
        targetUnit                  : unit2,
        targetGridIndex             : gridIndex2,
        isCounter                   : isCounter,
        observerTeamIndexSet        : observerTeamIndexSet,
        useDamagePreviewSettings    : useDamagePreviewSettings,
    });
    const defenseBonusMultiplier    = getDefenseBonusMultiplierForUnit({
        war                         : war,
        attacker                    : unit1,
        attackerGridIndex           : gridIndex1,
        target                      : unit2,
        targetGridIndex             : gridIndex2,
        isCounter                   : isCounter,
        observerTeamIndexSet        : observerTeamIndexSet,
        useDamagePreviewSettings    : useDamagePreviewSettings,
    });
    const luckValue                 = unit2.checkIsArmorAffectByLuck()
        ? getLuckValue(war, unit1, gridIndex1, isEstimated)
        : 0;
    return getValueInRange({
        minValue    : 0,
        maxValue    : MaxInt32,
        rawValue    : Math.floor(0.000001 +
            (baseAttackDamage * attackBonusMultiplier + luckValue)      *
            (getNormalizedHp(unitHp1) / 10) *
            defenseBonusMultiplier
        ),
    });
}
function getAttackDamageForAttackTile({ war, unit1, tile2, isCounter, isEstimated, observerTeamIndexSet, useDamagePreviewSettings }: {
    war                         : IBwWar;
    unit1                       : IBwUnit;
    tile2                       : IBwTile;
    isCounter                   : boolean;
    isEstimated                 : boolean;
    observerTeamIndexSet        : Set<number> | null;
    useDamagePreviewSettings    : boolean;
}): number {
    const unitHp1 = unit1.getCurrentHp();
    if (unitHp1 <= 0) {
        return 0;
    }

    const baseAttackDamage      = getExisted(unit1.getBaseDamage(getExisted(tile2.getArmorType())));
    const gridIndex1            = unit1.getGridIndex();
    const gridIndex2            = tile2.getGridIndex();
    const attackBonusMultiplier = getAttackBonusMultiplier({
        war                         : war,
        attacker                    : unit1,
        attackerGridIndex           : gridIndex1,
        targetUnit                  : null,
        targetGridIndex             : gridIndex2,
        isCounter                   : isCounter,
        observerTeamIndexSet        : observerTeamIndexSet,
        useDamagePreviewSettings    : useDamagePreviewSettings,
    });
    const defenseBonusMultiplier    = getDefenseBonusMultiplierForTile();
    const luckValue                 = tile2.checkIsArmorAffectByLuck()
        ? getLuckValue(war, unit1, gridIndex1, isEstimated)
        : 0;
    return getValueInRange({
        minValue    : 0,
        maxValue    : MaxInt32,
        rawValue    : Math.floor(0.000001 +
            (baseAttackDamage * attackBonusMultiplier + luckValue)      *
            (getNormalizedHp(unitHp1) / 10) *
            defenseBonusMultiplier
        ),
    });
}

/// <summary>
/// 此函数会把战斗产生的影响直接写入战局（部分数据除外，参看下文）。因此，对于伤害预览，调用者必须把战局还原到调用此函数之前的状态。<para />
/// 调用本函数前，部队必须已经移动到位，因移动而发生的变动（比如建筑点数、视野）也要预先计算及应用。不过在伤害预览中，视野可以不预先更新，因为持续性属性修改与视野无关，且与视野有关的部队统计在预览中也是不用更新的。<para />
/// 某些数据（如部队统计）虽然严格来说要在战斗过程中就计算并更新，但由于持续性属性修改与这些数据无关，所以可以不在战斗中更新。为了方便，直接做成实战时自动更新，预览时不更新。<para />
/// 总而言之，在目前的战斗过程实现中：<para />
/// - 无论是否预览，视野都不会被计算和应用（因为战斗过程中视野本来就不会变动）<para />
/// - 部队统计在预览模式下不会计算和应用，在实战模式下会自动计算和应用<para />
/// - 其余所有数据，包括弹药、HP、晋升、资金、能量、击杀、玩家存活状态，都会被自动计算和应用<para />
/// </summary>
function doRunBattleForAttackUnit({ battleInfo, war, movePath1, launchUnitId1, maxAttackRange1, canAttackAfterMoving1, gridIndex2, maxAttackRange2, canAttackAfterMoving2, isEstimated, observerTeamIndexSet, useDamagePreviewSettings }: {
    battleInfo                  : BattleInfo;
    war                         : IBwWar;
    movePath1                   : GridIndex[];
    launchUnitId1               : Undefinable<number>;
    maxAttackRange1             : number | null;
    canAttackAfterMoving1       : boolean;
    gridIndex2                  : GridIndex;
    maxAttackRange2             : number | null;
    canAttackAfterMoving2       : boolean;
    isEstimated                 : boolean;
    observerTeamIndexSet        : Set<number> | null;
    useDamagePreviewSettings    : boolean;
}): void {
    const unitMap     = war.getUnitMap();
    const gridIndex1  = movePath1[movePath1.length - 1];
    const unit1       = getExisted(unitMap.getUnit(gridIndex1, launchUnitId1));
    const unitId1     = unit1.getUnitId();
    const unit2       = getExisted(unitMap.getUnitOnMap(gridIndex2));
    const unitId2     = unit2.getUnitId();
    if (!checkCanAttackUnit({
        unit1                   : unit1,
        movePath1               : movePath1,
        maxAttackRange1         : maxAttackRange1,
        canAttackAfterMoving1   : canAttackAfterMoving1,
        unit2                   : unit2,
        isCounter               : false,
    })) {
        return;
    }

    const attackDamage = getAttackDamageForAttackUnit({
        war                         : war,
        unit1                       : unit1,
        unit2                       : unit2,
        isEstimated                 : isEstimated,
        isCounter                   : false,
        observerTeamIndexSet        : observerTeamIndexSet,
        useDamagePreviewSettings    : useDamagePreviewSettings,
    });
    battleInfo.damageInfoArray.push(BattleDamageInfo.fromJson({
        attackerUnitId      : unitId1,
        targetUnitId        : unitId2,
        damage              : attackDamage,
        targetTileGridIndex : null
    }));
    handleAttackUnit({
        battleInfo  : battleInfo,
        war         : war,
        unit1       : unit1,
        unit2       : unit2,
        damage      : attackDamage,
        isEstimated : isEstimated
    });

    if ((gridIndex1.getDistance(gridIndex2) <= 1)   &&
        (unit2.getCurrentHp() > 0)                  &&
        (checkCanAttackUnit({
            unit1                   : unit2,
            movePath1               : null,
            maxAttackRange1         : maxAttackRange2,
            canAttackAfterMoving1   : canAttackAfterMoving2,
            unit2                   : unit1,
            isCounter               : true,
        }))
    ) {
        const counterDamage = getAttackDamageForAttackUnit({
            war                         : war,
            unit1                       : unit2,
            unit2                       : unit1,
            isEstimated                 : isEstimated,
            isCounter                   : true,
            observerTeamIndexSet        : observerTeamIndexSet,
            useDamagePreviewSettings    : useDamagePreviewSettings,
        });
        battleInfo.damageInfoArray.push(BattleDamageInfo.fromJson({
            attackerUnitId      : unitId2,
            targetUnitId        : unitId1,
            damage              : counterDamage,
            targetTileGridIndex : null
        }));
        handleAttackUnit({
            battleInfo  : battleInfo,
            war         : war,
            unit1       : unit2,
            unit2       : unit1,
            damage      : counterDamage,
            isEstimated : isEstimated
        });
    }

    for (const player of battleInfo.playersForDestroyedUnits) {
        const playerIndex = player.getPlayerIndex();
        if ((!player.checkIsNeutral())                                          &&
            (player.getAliveState() != AliveStateId.Dead)  &&
            (!unitMap.checkHasUnitForPlayer(playerIndex))
        ) {
            if (!isEstimated) {
                // battleInfo.affectedThings.add(player);
            } else {
                if (!battleInfo.oldPlayers.has(playerIndex)) {
                    battleInfo.oldPlayers.set(playerIndex, player.serialize());
                }
            }

            player.setAliveState(AliveStateId.Dying);
        }
    }
}
function handleAttackUnit({ battleInfo, war, unit1, unit2, damage, isEstimated }: {
    battleInfo  : BattleInfo;
    war         : IBwWar;
    unit1       : IBwUnit;
    unit2       : IBwUnit;
    damage      : number;
    isEstimated : boolean;
}): void {
    const warStatisticsManager    = war.getWarStatisticsManager();
    const unitOldHp2              = unit2.getCurrentHp();
    const player1                 = unit1.getPlayer();
    const player2                 = unit2.getPlayer();
    const unitGridIndex1          = unit1.getGridIndex();
    const unitGridIndex2          = unit2.getGridIndex();
    const coGridIndexArray1       = player1.getCoGridIndexListOnMap();
    const coGridIndexArray2       = player2.getCoGridIndexListOnMap();
    const unitNewHp2              = Math.max(0, unitOldHp2 - damage);
    const isUnitDestroyed2        = unitNewHp2 <= 0;
    const unitLostNormalizedHp2   = getNormalizedHp(unitOldHp2) - getNormalizedHp(unitNewHp2);
    const isInCoZone1             = (unit1.getIsCoOnboard()) || (player1.checkIsInCoZone(unitGridIndex1, coGridIndexArray1));
    if ((!isEstimated) && (unitLostNormalizedHp2 != 0)) {
        const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({
            war         : war,
            gridIndex   : unitGridIndex2,
        });
        if (observerTeamIndexes != null) {
            warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                unitType                    : unit2.getUnitType(),
                dstPlayerIndex              : unit2.getPlayerIndex(),
                normalizedHpGain            : 0,
                normalizedHpLoss            : unitLostNormalizedHp2,
                unitGain                    : 0,
                unitLoss                    : 0,
                groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
            }));
        }
    }
    handlePrimaryWeaponAmmoForAttackUnit({
        battleInfo      : battleInfo,
        isEstimated     : isEstimated,
        unit1           : unit1,
        targetUnit      : unit2
    });
    handleHpForAttackUnit({
        battleInfo      : battleInfo,
        isEstimated     : isEstimated,
        unit            : unit2,
        unitNewHp       : unitNewHp2
    });
    handlePromotionForAttackUnit({
        battleInfo                  : battleInfo,
        isEstimated                 : isEstimated,
        player1                     : player1,
        unit1                       : unit1,
        targetLostNormalizedHp      : unitLostNormalizedHp2,
        attackerCoGridIndexListOnMap: coGridIndexArray1,
        isTargetDestroyed           : isUnitDestroyed2
    });
    handleFundForAttackUnit({
        battleInfo                  : battleInfo,
        isEstimated                 : isEstimated,
        attackerPlayer              : player1,
        attackerUnit                : unit1,
        targetUnit                  : unit2,
        targetLostNormalizedHp      : unitLostNormalizedHp2,
        isAttackerInAttackerCoZone  : isInCoZone1
    });
    handleEnergyForAttackUnit({
        battleInfo                  : battleInfo,
        isEstimated                 : isEstimated,
        war                         : war,
        attackerPlayer              : player1,
        targetPlayer                : player2,
        targetLostNormalizedHp      : unitLostNormalizedHp2,
        targetCfgEnergyValue        : unit2.getTemplateCfg().getEnergyPerNormalizedHp(),
        isAttackerInAttackerCoZone  : isInCoZone1,
        isTargetInTargetCoZone      : (unit2.getIsCoOnboard()) || (player2.checkIsInCoZone(unitGridIndex2, coGridIndexArray2))
    });
    handleDestructionForAttackUnit({
        battleInfo      : battleInfo,
        war             : war,
        unit            : unit2,
        isUnitDestroyed : isUnitDestroyed2,
        isEstimated     : isEstimated
    });

    if (isUnitDestroyed2) {
        battleInfo.playersForDestroyedUnits.add(player2);
    }
}
function handlePrimaryWeaponAmmoForAttackUnit({ battleInfo, isEstimated, unit1, targetUnit }: {
    battleInfo  : BattleInfo;
    isEstimated : boolean;
    unit1       : IBwUnit;
    targetUnit  : IBwUnit;
}): void {
    const attackerAmmo = unit1.getPrimaryWeaponCurrentAmmo();
    if ((attackerAmmo != null)                                                                                  &&
        (attackerAmmo > 0)                                                                                      &&
        (unit1.getCfgBaseDamage(targetUnit.getArmorType(), WeaponTypeId.Primary) != null)
    ) {
        if (!isEstimated) {
            // battleInfo.affectedThings.add(unit1);
        } else {
            const unitId1 = unit1.getUnitId();
            if (!battleInfo.oldUnits.has(unitId1)) {
                battleInfo.oldUnits.set(unitId1, unit1.serialize());
            }
        }

        unit1.addAndValidatePrimaryWeaponCurrentAmmo(-1);
    }
}
function handleHpForAttackUnit({ battleInfo, isEstimated, unit, unitNewHp }: {
    battleInfo  : BattleInfo;
    isEstimated : boolean;
    unit        : IBwUnit;
    unitNewHp   : number;
}): void {
    const unitId = unit.getUnitId();
    battleInfo.damagedUnits.set(unitId, unit);

    if (unit.getCurrentHp() != unitNewHp) {
        if (!isEstimated) {
            // battleInfo.affectedThings.add(unit);
        } else {
            if (!battleInfo.oldUnits.has(unitId)) {
                battleInfo.oldUnits.set(unitId, unit.serialize());
            }
        }

        unit.setCurrentHp(unitNewHp);
    }
}
function handlePromotionForAttackUnit({ battleInfo, isEstimated, player1, unit1, targetLostNormalizedHp, attackerCoGridIndexListOnMap, isTargetDestroyed }: {
    battleInfo                      : BattleInfo;
    isEstimated                     : boolean;
    player1                         : IBwPlayer;
    unit1                           : IBwUnit;
    targetLostNormalizedHp          : number;
    attackerCoGridIndexListOnMap    : GridIndex[];
    isTargetDestroyed               : boolean;
}): void {
    const gcData                = unit1.getGcData();
    const attackerUnitTypeId    = unit1.getUnitType();
    const attackerGridIndex     = unit1.getGridIndex();
    const unitId1               = unit1.getUnitId();
    if (isTargetDestroyed) {
        if (!isEstimated) {
            // battleInfo.affectedThings.add(unit1);
        } else {
            if (!battleInfo.oldUnits.has(unitId1)) {
                battleInfo.oldUnits.set(unitId1, unit1.serialize());
            }
        }

        if (gcData.getSystemCfg().getCanUnitGetPromotionAfterDestroyingUnit()) {
            unit1.addAndReviseCurrentPromotion(1);
        }
    }

    if (player1.getCoId() !== CoId.Empty) {
        const attackerCoZoneRadius      = player1.getCoZoneRadius();
        const isAttackerCoOnBoard       = unit1.getIsCoOnboard();
        const getCoGridIndexArrayOnMap  = () => attackerCoGridIndexListOnMap;
        let offset                      = 0;
        for (const skillId of player1.getCoCurrentSkills()) {
            offset += CoSkillsUtilsInstantMiscSelfUnitPromotionAfterBattleGetTotalOffset({
                cfg                         : gcData.getCoSkillCfg(skillId)?.getInstantMisc()?.getSelfUnitPromotionAfterBattle(),
                gameConfig                  : gcData,
                unitTypeId                  : attackerUnitTypeId,
                coZoneRadius                : attackerCoZoneRadius,
                gridIndex                   : attackerGridIndex,
                isCoOnboard                 : isAttackerCoOnBoard,
                getCoGridIndexArrayOnMap    : getCoGridIndexArrayOnMap,
                targetLostNormalizedHp      : targetLostNormalizedHp,
                isTargetKilled              : isTargetDestroyed,
            });
        }

        if (offset !== 0) {
            if (!isEstimated) {
                // battleInfo.affectedThings.add(unit1);
            } else {
                if (!battleInfo.oldUnits.has(unitId1)) {
                    battleInfo.oldUnits.set(unitId1, unit1.serialize());
                }
            }

            unit1.addAndReviseCurrentPromotion(offset);
        }
    }
}
function handleFundForAttackUnit({ battleInfo, isEstimated, attackerPlayer, attackerUnit, targetUnit, targetLostNormalizedHp, isAttackerInAttackerCoZone }: {
    battleInfo                  : BattleInfo;
    isEstimated                 : boolean;
    attackerPlayer              : IBwPlayer;
    attackerUnit                : IBwUnit;
    targetUnit                  : IBwUnit;
    targetLostNormalizedHp      : number;
    isAttackerInAttackerCoZone  : boolean;
}): void {
    if ((targetLostNormalizedHp == 0) || (attackerPlayer.getCoId() == CoId.Empty)) {
        return;
    }

    const gameConfig            = attackerUnit.getGcData();
    const attackerUnitTypeId    = attackerUnit.getUnitType();
    const targetUnitTypeId      = targetUnit.getUnitType();
    const targetUnitCost        = targetUnit.getProductionFinalCost();
    const targetNormalizedMaxHp = targetUnit.getNormalizedMaxHp();
    let addFund                 = 0;
    for (const skillId of attackerPlayer.getCoCurrentSkills()) {
        addFund += getTotalOffset({
            cfg                         : gameConfig.getCoSkillCfg(skillId)?.getInstantMisc()?.getSelfFundAfterBattle(),
            gameConfig                  : gameConfig,
            selfUnitTypeId              : attackerUnitTypeId,
            isSelfInCoZone              : isAttackerInAttackerCoZone,
            enemyUnitTypeId             : targetUnitTypeId,
            enemyFinalProductionCost    : targetUnitCost,
            enemyNormalizedLostHp       : targetLostNormalizedHp,
            enemyNormalizedMaxHp        : targetNormalizedMaxHp,
        });
    }

    if (addFund !== 0) {
        const playerIndex = attackerPlayer.getPlayerIndex();
        if (!isEstimated) {
            // battleInfo.affectedThings.add(attackerPlayer);
        } else {
            if (!battleInfo.oldPlayers.has(playerIndex)) {
                battleInfo.oldPlayers.set(playerIndex, attackerPlayer.serialize());
            }
        }

        attackerPlayer.setFund(getValueInRange({
            maxValue    : Fund.MaxFund,
            minValue    : Fund.MinFund,
            rawValue    : attackerPlayer.getFund() + addFund
        }));
    }
}
function handleEnergyForAttackUnit({ battleInfo, isEstimated, war, attackerPlayer, targetPlayer, targetLostNormalizedHp, targetCfgEnergyValue, isAttackerInAttackerCoZone, isTargetInTargetCoZone}: {
    battleInfo                  : BattleInfo;
    isEstimated                 : boolean;
    war                         : IBwWar;
    attackerPlayer              : IBwPlayer;
    targetPlayer                : IBwPlayer;
    targetLostNormalizedHp      : number;
    targetCfgEnergyValue        : number;
    isAttackerInAttackerCoZone  : boolean;
    isTargetInTargetCoZone      : boolean;
}): void {
    if (targetLostNormalizedHp <= 0) {
        return;
    }

    const commonSettingManager    = war.getCommonSettingManager();
    const gameConfig              = war.getGcData();
    const warEventManager         = war.getWarEventManager();
    if (attackerPlayer.checkCanGetEnergyWithBattle()) {
        const coEnergyType1   = attackerPlayer.getCoEnergyType();
        const playerIndex1    = attackerPlayer.getPlayerIndex();
        if (coEnergyType1 == EnergyTypeId.Trilogy) {
            if (!isEstimated) {
                // battleInfo.affectedThings.add(attackerPlayer);
            } else {
                if (!battleInfo.oldPlayers.has(playerIndex1)) {
                    battleInfo.oldPlayers.set(playerIndex1, attackerPlayer.serialize());
                }
            }

            const energyParameters1 = gameConfig.getTrilogyEnergyGainRateForAttacker();
            const multiplier1       = commonSettingManager.getPlayerRule(playerIndex1).getEnergyGrowthMultiplier()
                + warEventManager.getOpaEnergyGrowthMultiplierModifier(playerIndex1);
            attackerPlayer.addAndValidateCoCurrentEnergy(targetLostNormalizedHp * targetCfgEnergyValue * multiplier1 * energyParameters1 / 100 / 100);

        } else if (coEnergyType1 == EnergyTypeId.Dor) {
            if (isAttackerInAttackerCoZone) {
                if (!isEstimated) {
                    // battleInfo.affectedThings.add(attackerPlayer);
                } else {
                    if (!battleInfo.oldPlayers.has(playerIndex1)) {
                        battleInfo.oldPlayers.set(playerIndex1, attackerPlayer.serialize());
                    }
                }

                const multiplier1 = commonSettingManager.getPlayerRule(playerIndex1).getEnergyGrowthMultiplier()
                    + warEventManager.getOpaEnergyGrowthMultiplierModifier(playerIndex1);
                attackerPlayer.addAndValidateCoCurrentEnergy(targetLostNormalizedHp * multiplier1 * gameConfig.getDorEnergyGainRateForAttacker() / 100);
            }

        } else {
            throw newError(`Invalid coEnergyType1: ${coEnergyType1}`);
        }
    }

    if (targetPlayer.checkCanGetEnergyWithBattle()) {
        const coEnergyType2   = targetPlayer.getCoEnergyType();
        const playerIndex2    = targetPlayer.getPlayerIndex();
        if (coEnergyType2 == EnergyTypeId.Trilogy) {
            if (!isEstimated) {
                // battleInfo.affectedThings.add(targetPlayer);
            } else {
                if (!battleInfo.oldPlayers.has(playerIndex2)) {
                    battleInfo.oldPlayers.set(playerIndex2, targetPlayer.serialize());
                }
            }

            const energyParameters2 = gameConfig.getTrilogyEnergyGainRateForDefender();
            const multiplier2       = commonSettingManager.getPlayerRule(playerIndex2).getEnergyGrowthMultiplier()
                + warEventManager.getOpaEnergyGrowthMultiplierModifier(playerIndex2);
            targetPlayer.addAndValidateCoCurrentEnergy(targetLostNormalizedHp * targetCfgEnergyValue * multiplier2 * energyParameters2 / 100 / 100);

        } else if (coEnergyType2 == EnergyTypeId.Dor) {
            if (isTargetInTargetCoZone) {
                if (!isEstimated) {
                    // battleInfo.affectedThings.add(targetPlayer);
                } else {
                    if (!battleInfo.oldPlayers.has(playerIndex2)) {
                        battleInfo.oldPlayers.set(playerIndex2, targetPlayer.serialize());
                    }
                }

                const multiplier2 = commonSettingManager.getPlayerRule(playerIndex2).getEnergyGrowthMultiplier()
                    + warEventManager.getOpaEnergyGrowthMultiplierModifier(playerIndex2);
                targetPlayer.addAndValidateCoCurrentEnergy(targetLostNormalizedHp * multiplier2 * gameConfig.getDorEnergyGainRateForDefender() / 100);
            }

        } else {
            throw newError(`Invalid coEnergyType2: ${coEnergyType2}`);
        }
    }
}
function handleDestructionForAttackUnit({ battleInfo, war, unit, isUnitDestroyed, isEstimated }: {
    battleInfo      : BattleInfo;
    war             : IBwWar;
    unit            : IBwUnit;
    isUnitDestroyed : boolean;
    isEstimated     : boolean;
}): void {
    if (isUnitDestroyed) {
        destroyUnitOnMapForWarDamageCalculator({
            battleInfo          : battleInfo,
            war                 : war,
            gridIndex           : unit.getGridIndex(),
            isEstimated         : isEstimated,
        });
    }
}

/// <summary>
/// 此函数会把战斗产生的影响直接写入战局（部分数据除外，参看下文）。因此，对于伤害预览，调用者必须把战局还原到调用此函数之前的状态。<para />
/// 调用本函数前，部队必须已经移动到位，因移动而发生的变动（比如建筑点数、视野）也要预先计算及应用。不过在伤害预览中，视野可以不预先更新，因为持续性属性修改与视野无关，且与视野有关的部队统计在预览中也是不用更新的。<para />
/// 某些数据（如部队统计）虽然严格来说要在战斗过程中就计算并更新，但由于持续性属性修改与这些数据无关，所以可以不在战斗中更新。为了方便，直接做成实战时自动更新，预览时不更新。<para />
/// 总而言之，在目前的战斗过程实现中：<para />
/// - 无论是否预览，视野都不会被计算和应用（因为战斗过程中视野本来就不会变动）<para />
/// - 部队统计在预览模式下不会计算和应用，在实战模式下会自动计算和应用<para />
/// - 其余所有数据，包括弹药、HP、晋升、资金、能量、击杀、玩家存活状态，都会被自动计算和应用<para />
/// </summary>
function doRunBattleForAttackTile({ battleInfo, war, movePath1, launchUnitId1, maxAttackRange1, canAttackAfterMoving1, gridIndex2, isEstimated, observerTeamIndexSet, useDamagePreviewSettings }: {
    battleInfo                  : BattleInfo;
    war                         : IBwWar;
    movePath1                   : GridIndex[];
    launchUnitId1               : Undefinable<number>;
    maxAttackRange1             : number | null;
    canAttackAfterMoving1       : boolean;
    gridIndex2                  : GridIndex;
    isEstimated                 : boolean;
    observerTeamIndexSet        : Set<number> | null;
    useDamagePreviewSettings    : boolean;
}): void {
    const unitMap     = war.getUnitMap();
    const gridIndex1  = movePath1[movePath1.length - 1];
    const unit1       = getExisted(unitMap.getUnit(gridIndex1, launchUnitId1));
    const tile2       = war.getTileMap().getTile(gridIndex2);
    if (!checkCanAttackTile({
        unit1                   : unit1,
        movePath1               : movePath1,
        maxAttackRange1         : maxAttackRange1,
        canAttackAfterMoving1   : canAttackAfterMoving1,
        tile2                   : tile2,
    })) {
        return;
    }

    const attackDamage = getAttackDamageForAttackTile({
        war                         : war,
        unit1                       : unit1,
        tile2                       : tile2,
        isEstimated                 : isEstimated,
        isCounter                   : false,
        observerTeamIndexSet        : observerTeamIndexSet,
        useDamagePreviewSettings    : useDamagePreviewSettings,
    });
    battleInfo.damageInfoArray.push(BattleDamageInfo.fromJson({
        attackerUnitId      : unit1.getUnitId(),
        targetUnitId        : null,
        targetTileGridIndex : gridIndex2.toProto().toJson(),
        damage              : attackDamage
    }));
    handleAttackTile({
        battleInfo      : battleInfo,
        war             : war,
        unit1           : unit1,
        tile2           : tile2,
        damage          : attackDamage,
        isEstimated     : isEstimated
    });

    for (const player of battleInfo.playersForDestroyedUnits) {
        const playerIndex = player.getPlayerIndex();
        if ((!player.checkIsNeutral())                                          &&
            (player.getAliveState() != AliveStateId.Dead)  &&
            (!unitMap.checkHasUnitForPlayer(playerIndex))
        ) {
            if (!isEstimated) {
                // battleInfo.affectedThings.add(player);
            } else {
                if (!battleInfo.oldPlayers.has(playerIndex)) {
                    battleInfo.oldPlayers.set(playerIndex, player.serialize());
                }
            }

            player.setAliveState(AliveStateId.Dying);
        }
    }
}
function handleAttackTile({ battleInfo, war, unit1, tile2, damage, isEstimated }: {
    battleInfo  : BattleInfo;
    war         : IBwWar;
    unit1       : IBwUnit;
    tile2       : IBwTile;
    damage      : number;
    isEstimated : boolean;
}): void {
    const tileOldHp2 = tile2.getCurrentHp();
    handlePrimaryWeaponAmmoForAttackTile({
        battleInfo  : battleInfo,
        isEstimated : isEstimated,
        unit1       : unit1,
        tile2       : tile2
    });
    handleHpForAttackTile({
        battleInfo  : battleInfo,
        isEstimated : isEstimated,
        tile2       : tile2,
        tileNewHp2  : Math.max(0, tileOldHp2 - damage)
    });
    handleDestructionForAttackTile({
        battleInfo  : battleInfo,
        isEstimated : isEstimated,
        war         : war,
        tile2       : tile2
    });
}
function handlePrimaryWeaponAmmoForAttackTile({ battleInfo, isEstimated, unit1, tile2 }: {
    battleInfo  : BattleInfo;
    isEstimated : boolean;
    unit1       : IBwUnit;
    tile2       : IBwTile;
}): void {
    const armorType2 = getExisted(tile2.getArmorType());
    const attackerAmmo = unit1.getPrimaryWeaponCurrentAmmo();
    if ((attackerAmmo != null)                                                                  &&
        (attackerAmmo > 0)                                                                      &&
        (unit1.getCfgBaseDamage(armorType2, WeaponTypeId.Primary) != null)
    ) {
        if (!isEstimated) {
            // battleInfo.affectedThings.add(unit1);
        } else {
            const unitId1 = unit1.getUnitId();
            if (!battleInfo.oldUnits.has(unitId1)) {
                battleInfo.oldUnits.set(unitId1, unit1.serialize());
            }
        }

        unit1.addAndValidatePrimaryWeaponCurrentAmmo(-1);
    }
}
function handleHpForAttackTile({ battleInfo, isEstimated, tile2, tileNewHp2 }: {
    battleInfo  : BattleInfo;
    isEstimated : boolean;
    tile2       : IBwTile;
    tileNewHp2  : number;
}): void {
    const gridId2 = tile2.getGridIndex().getGridId(tile2.getWar().getTileMap().getMapSize());
    battleInfo.damagedTiles.set(gridId2, tile2);

    if (tile2.getCurrentHp() != tileNewHp2) {
        if (!isEstimated) {
            // battleInfo.affectedThings.add(tile2);
        } else {
            if (!battleInfo.oldTiles.has(gridId2)) {
                battleInfo.oldTiles.set(gridId2, tile2.serialize());
            }
        }

        tile2.setCurrentHp(tileNewHp2);
    }
}
function handleDestructionForAttackTile({ battleInfo, isEstimated, war, tile2 }: {
    battleInfo  : BattleInfo;
    isEstimated : boolean;
    war         : IBwWar;
    tile2       : IBwTile;
}): void {
    const hp = tile2.getCurrentHp();
    if (hp <= 0) {
        const gridIndex2  = tile2.getGridIndex();
        const tileMap     = war.getTileMap();
        const mapSize     = tileMap.getMapSize();
        const destroyConnectedTileType = tile2.getTemplateCfg().getDestroyConnectedTypeIdWhenDestroyed();
        if (destroyConnectedTileType != null) {
            for (const connectedGridIndex of tileMap.getConnectedGridIndexArrayWithTileType(gridIndex2, destroyConnectedTileType)) {
                const connectedTile     = tileMap.getTile(connectedGridIndex);
                const connectedGridId   = connectedGridIndex.getGridId(mapSize);
                battleInfo.destroyedTiles.set(connectedGridId, connectedTile);

                if (!isEstimated) {
                    // battleInfo.affectedThings.add(connectedTile);
                } else {
                    if (!battleInfo.oldTiles.has(connectedGridId)) {
                        battleInfo.oldTiles.set(connectedGridId, connectedTile.serialize());
                    }
                }

                connectedTile.resetOnTileObjectDestroyed();
            }
        }

        const gridId2 = gridIndex2.getGridId(mapSize);
        battleInfo.destroyedTiles.set(gridId2, tile2);
        if (!isEstimated) {
            // battleInfo.affectedThings.add(tile2);
        } else {
            if (!battleInfo.oldTiles.has(gridId2)) {
                battleInfo.oldTiles.set(gridId2, tile2.serialize());
            }
        }

        tile2.resetOnTileObjectDestroyed();
    }
}

/** 调用此函数前，部队必须未移动 */
export function getEstimatedBattleInfo({
    war,
    movePath1,
    launchUnitId1,
    gridIndex2,
    fuelConsumption,
    observerTeamIndexSet,
    useDamagePreviewSettings,
    isAttackUnit,
}: {
    war                         : IBwWar;
    movePath1                   : GridIndex[];
    launchUnitId1               : number | null;
    gridIndex2                  : GridIndex;
    fuelConsumption             : number;
    observerTeamIndexSet        : Set<number> | null;
    useDamagePreviewSettings    : boolean;
    isAttackUnit                : boolean;
}): BattleInfo {
    // 预处理
    const beginningGridIndex    = movePath1[0];
    const battleInfo            = new BattleInfo();
    const unitMap               = war.getUnitMap();
    const tileMap               = war.getTileMap();
    const mapSize               = tileMap.getMapSize();
    const unit1                 = getExisted(unitMap.getUnit(beginningGridIndex, launchUnitId1));
    const unit2                 = unitMap.getUnitOnMap(gridIndex2);
    const maxAttackRange1       = unit1.getFinalMaxAttackRange();                   // 预先计算，不能延后
    const maxAttackRange2       = unit2?.getFinalMaxAttackRange() ?? null;          // 预先计算，不能延后
    const canAttackAfterMoving1 = unit1.getFinalCanAttackAfterMoving();             // 预先计算，不能延后
    const canAttackAfterMoving2 = unit2?.getFinalCanAttackAfterMoving() ?? false;   // 预先计算，不能延后

    if (movePath1.length > 1) {
        const unitId1 = unit1.getUnitId();
        if (!battleInfo.oldUnits.has(unitId1)) {
            battleInfo.oldUnits.set(unitId1, unit1.serialize());
        }

        if (launchUnitId1 != null) {
            unitMap.removeUnitLoaded(launchUnitId1);

        } else {
            unitMap.removeUnitOnMap(beginningGridIndex, false);

            const tile    = tileMap.getTile(beginningGridIndex);
            const gridId  = beginningGridIndex.getGridId(mapSize);
            if (!battleInfo.oldTiles.has(gridId)) {
                battleInfo.oldTiles.set(gridId, tile.serialize());
            }
            tile.updateOnUnitLeave();
        }

        const destination = movePath1[movePath1.length - 1];
        unit1.setCurrentFuel(unit1.getCurrentFuel() - fuelConsumption);
        unit1.setLoaderUnitId(null);
        unit1.setGridIndex(destination);
        unitMap.setUnitOnMap(unit1);

        for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit1, true)) {
            const loadedUnitId = loadedUnit.getUnitId();
            if (!battleInfo.oldUnits.has(loadedUnitId)) {
                battleInfo.oldUnits.set(loadedUnitId, loadedUnit.serialize());
            }

            loadedUnit.setGridIndex(destination);
        }
    }

    // 战斗
    if (isAttackUnit) {
        doRunBattleForAttackUnit({
            battleInfo                  : battleInfo,
            war                         : war,
            movePath1                   : movePath1,
            launchUnitId1               : launchUnitId1,
            maxAttackRange1             : maxAttackRange1,
            canAttackAfterMoving1       : canAttackAfterMoving1,
            gridIndex2                  : gridIndex2,
            maxAttackRange2             : maxAttackRange2,
            canAttackAfterMoving2       : canAttackAfterMoving2,
            isEstimated                 : true,
            observerTeamIndexSet        : observerTeamIndexSet,
            useDamagePreviewSettings    : useDamagePreviewSettings,
        });
    } else {
        doRunBattleForAttackTile({
            battleInfo                  : battleInfo,
            war                         : war,
            movePath1                   : movePath1,
            launchUnitId1               : launchUnitId1,
            maxAttackRange1             : maxAttackRange1,
            canAttackAfterMoving1       : canAttackAfterMoving1,
            gridIndex2                  : gridIndex2,
            isEstimated                 : true,
            observerTeamIndexSet        : observerTeamIndexSet,
            useDamagePreviewSettings    : useDamagePreviewSettings,
        });
    }

    // 还原数据
    const playerManager   = war.getPlayerManager();
    const gameConfig      = war.getGcData();
    for (const [playerIndex, playerData] of battleInfo.oldPlayers) {
        playerManager.getPlayer(playerIndex).init(playerData, gameConfig);
    }
    for (const [gridId, tileData] of battleInfo.oldTiles) {
        tileMap.getTileWithGridId(gridId).init(tileData, gameConfig);
    }
    for (const [unitId, unitData] of battleInfo.oldUnits) {
        if (battleInfo.destroyedUnits.has(unitId)) {
            continue;
        }

        const unit = getExisted(unitMap.getUnitById(unitId));
        if (unit.getLoaderUnitId() == null) {
            unitMap.removeUnitOnMap(unit.getGridIndex(), false);
        } else {
            unitMap.removeUnitLoaded(unitId);
        }

        unit.init(unitData, gameConfig);
        if (unit.getLoaderUnitId() == null) {
            unitMap.setUnitOnMap(unit);
        } else {
            unitMap.setUnitLoaded(unit);
        }
    }
    for (const [unitId, unitData] of battleInfo.oldUnits) {
        const unit = battleInfo.destroyedUnits.get(unitId);
        if (unit == null) {
            continue;
        }

        unit.init(unitData, gameConfig);
        if (unit.getLoaderUnitId() == null) {
            unitMap.setUnitOnMap(unit);
        } else {
            unitMap.setUnitLoaded(unit);
        }
    }

    return battleInfo;
}

/** 调用此函数前，部队必须已经移动到位，且maxAttackRange必须在移动前就计算完毕 */
export function runBattleForAttackUnit({
    war,
    movePath1,
    launchUnitId1,
    maxAttackRange1,
    canAttackAfterMoving1,
    gridIndex2,
    maxAttackRange2,
    canAttackAfterMoving2
}: {
    war                     : IBwWar;
    movePath1               : GridIndex[];
    launchUnitId1           : Undefinable<number>;
    maxAttackRange1         : number | null;
    canAttackAfterMoving1   : boolean;
    gridIndex2              : GridIndex;
    maxAttackRange2         : number | null;
    canAttackAfterMoving2   : boolean;
}): BattleInfo {
    const battleInfo = new BattleInfo();
    doRunBattleForAttackUnit({
        battleInfo                  : battleInfo,
        war                         : war,
        movePath1                   : movePath1,
        launchUnitId1               : launchUnitId1,
        maxAttackRange1             : maxAttackRange1,
        canAttackAfterMoving1       : canAttackAfterMoving1,
        gridIndex2                  : gridIndex2,
        maxAttackRange2             : maxAttackRange2,
        canAttackAfterMoving2       : canAttackAfterMoving2,
        isEstimated                 : false,
        observerTeamIndexSet        : null,
        useDamagePreviewSettings    : false,
    });

    return battleInfo;
}
/** 调用此函数前，部队必须已经移动到位，且maxAttackRange必须在移动前就计算完毕 */
export function runBattleForAttackTile({
    war,
    movePath1,
    launchUnitId1,
    maxAttackRange1,
    canAttackAfterMoving1,
    gridIndex2,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    maxAttackRange2,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    canAttackAfterMoving2
}: {
    war                     : IBwWar;
    movePath1               : GridIndex[];
    launchUnitId1           : Undefinable<number>;
    maxAttackRange1         : number | null;
    canAttackAfterMoving1   : boolean;
    gridIndex2              : GridIndex;
    maxAttackRange2         : number | null;
    canAttackAfterMoving2   : boolean;
}): BattleInfo {
    const battleInfo = new BattleInfo();
    doRunBattleForAttackTile({
        battleInfo                  : battleInfo,
        war                         : war,
        movePath1                   : movePath1,
        launchUnitId1               : launchUnitId1,
        maxAttackRange1             : maxAttackRange1,
        canAttackAfterMoving1       : canAttackAfterMoving1,
        gridIndex2                  : gridIndex2,
        isEstimated                 : false,
        observerTeamIndexSet        : null,
        useDamagePreviewSettings    : false,
    });

    return battleInfo;
}

type AttackAndCounterDamage = {
    attackDamage    : number | null;
    counterDamage   : number | null;
};
export function getAttackAndCounterDamage({ battleDamageInfoArray, attackerUnitId, targetGridIndex, unitMap }: {
    battleDamageInfoArray   : BattleDamageInfo[];
    attackerUnitId          : number;
    targetGridIndex         : GridIndex;
    unitMap                 : IBwUnitMap;
}): AttackAndCounterDamage {
    let attackDamage    : number | null = null;
    let counterDamage   : number | null = null;
    for (const info of battleDamageInfoArray) {
        const damage                = getExisted(info.getDamage(), ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_00);
        const infoAttackerUnitId    = getExisted(info.getAttackerUnitId(), ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_01);
        const infoTargetUnitId      = info.getTargetUnitId();
        const targetTileGridIndex   = GridIndex.convertGridIndex(info.getTargetTileGridIndex());
        if (attackerUnitId === infoAttackerUnitId) {
            if (targetTileGridIndex != null) {
                if (targetGridIndex.checkIsEqual(targetTileGridIndex)) {
                    attackDamage = (attackDamage || 0) + damage;
                }
            } else {
                if (infoTargetUnitId == null) {
                    throw newError(`Empty infoTargetUnitId.`, ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_02);
                }

                const unit = getExisted(unitMap.getUnitById(infoTargetUnitId), ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_03);
                if (unitMap.getUnitOnMap(targetGridIndex) === unit) {
                    attackDamage = (attackDamage || 0) + damage;
                }
            }

        } else if (attackerUnitId === infoTargetUnitId) {
            const unit = getExisted(unitMap.getUnitById(infoAttackerUnitId), ClientErrorCode.DamageCalculator_GetAttackAndCounterDamage_04);
            if (unitMap.getUnitOnMap(targetGridIndex) === unit) {
                counterDamage = (counterDamage || 0) + damage;
            }
        }
    }

    return { attackDamage, counterDamage };
}
