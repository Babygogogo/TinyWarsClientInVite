import { AttackableArea } from "../auxiliaryTypes/AttackableArea.ts";
import { GridIndex } from "../auxiliaryTypes/GridIndex.ts";
import { MovableArea } from "../auxiliaryTypes/MovableArea.ts";
import type { MovePathNode } from "../auxiliaryTypes/MovePathNode.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import { getScoreAndActionUnitAttack } from "./actions/UnitAttack.ts";
import { getScoreAndActionUnitBeLoaded } from "./actions/UnitBeLoaded.ts";
import { getScoreAndActionUnitBoardedByCo } from "./actions/UnitBoardedByCo.ts";
import { getScoreAndActionUnitCaptureTile } from "./actions/UnitCaptureTile.ts";
import { getScoreAndActionUnitCrushUnit } from "./actions/UnitCrushUnit.ts";
import { getScoreAndActionUnitDive } from "./actions/UnitDive.ts";
import { getScoreAndActionUnitDropUnit } from "./actions/UnitDropUnit.ts";
import { getScoreAndActionUnitJoin } from "./actions/UnitJoin.ts";
import { getScoreAndActionUnitLaunchFlare } from "./actions/UnitLaunchFlare.ts";
import { getScoreAndActionUnitLaunchSilo } from "./actions/UnitLaunchSilo.ts";
import { getScoreAndActionUnitProduceUnit } from "./actions/UnitProduceUnit.ts";
import { getScoreAndActionUnitRepairUnit } from "./actions/UnitRepairUnit.ts";
import { getScoreAndActionUnitSelfDetonate } from "./actions/UnitSelfDetonate.ts";
import { getScoreAndActionUnitSurface } from "./actions/UnitSurface.ts";
import { getScoreAndActionUnitUseCoSkill } from "./actions/UnitUseCoSkill.ts";
import { getScoreAndActionUnitWait } from "./actions/UnitWait.ts";
import { CommonParams } from "./CommonParams.ts";
import { getActionForPhase01 } from "./phases/Phase01.ts";
import { getActionForPhase08 } from "./phases/Phase08.ts";
import { getActionForPhase09 } from "./phases/Phase09.ts";
import { getActionForPhase11 } from "./phases/Phase11.ts";
import { getActionForPhase12 } from "./phases/Phase12.ts";
import type { ScoreAndAction } from "./Types.ts";
import type { SkillTypeId } from "../coSkills/Constants.ts";
import { getPowerSkillTargetsCount } from "../coSkills/utils/Common.ts";
import { getDamageMultiplierForDefenseBonus } from "../damageCalculators/Utils.ts";
import type { GcData } from "../gameConfig/GcData.ts";
import { createEmptyMap } from "../helpers/Collection.ts";
import { getExisted, newError } from "../helpers/Misc.ts";
import { PlayerIndex } from "../players/Constants.ts";
import type { IPlayer } from "../players/IPlayer.ts";
import type { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { TeamIndex } from "../teams/Constants.ts";
import { checkAndCallLater } from "../timer/TimerModel.ts";
import { ActionStateId, WeaponTypeId, Hp, AiModeId, LoadedStateId } from "../units/Constants.ts";
import type { IUnit } from "../units/IUnit.ts";
import { getNormalizedHp } from "../units/utils/Common.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { getDiscoveredUnitsByPath } from "../visibilities/Utils.ts";

type IBwUnit                = IUnit;
type GrScoreAndAction       = ScoreAndAction;
interface AttackInfo {
    baseDamage          : number | null | undefined;
    normalizedHp        : number;
    fuel                : number;
    settingsLuckValue   : number;
}

interface DamageMapData {
    max             : number;
    directTotal     : number;
    indirectTotal   : number;
}

export const IsNeedVisibility = true;

////////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers.
////////////////////////////////////////////////////////////////////////////////////////////////////
async function checkCanUnitWaitOnGrid(commonParams: CommonParams, unit: IBwUnit, gridIndex: GridIndex): Promise<boolean> {
    await checkAndCallLater();

    const unitGridIndex = unit.getGridIndex();
    return (unitGridIndex.checkIsEqual(gridIndex))
        ? (unit.getLoaderUnitId() == null)
        : (!commonParams.getWar().getUnitMap().getUnitOnMap(gridIndex));
}

export function getBetterScoreAndAction(data1: GrScoreAndAction | null | undefined, data2: GrScoreAndAction, commonParams: CommonParams): GrScoreAndAction {
    if (data1 == null) {
        return data2;
    } else {
        const score1 = data1.score;
        const score2 = data2.score;
        if (score1 !== score2) {
            return score1 > score2 ? data1 : data2;
        } else {
            // return commonParams.getAndTickRandomInteger() % 2 === 0 ? data1 : data2;
            return commonParams.getWar().getExecutedOperationManager().getExecutedOperationsCount() % 2 === 0 ? data1 : data2;
        }
    }
}
export function getBestScoreAndAction(dataArray: (GrScoreAndAction | null)[], commonParams: CommonParams): GrScoreAndAction | null {
    let bestData: GrScoreAndAction | null = null;
    for (const newData of dataArray) {
        if (newData != null) {
            bestData = getBetterScoreAndAction(bestData, newData, commonParams);
        }
    }
    return bestData;
}

async function getReachableArea({ commonParams, unit, passableGridIndex, blockedGridIndex }: {
    commonParams        : CommonParams;
    unit                : IBwUnit;
    passableGridIndex   : GridIndex | null;
    blockedGridIndex    : GridIndex | null;
}): Promise<MovableArea> {
    await checkAndCallLater();

    const moveRange         = unit.getFinalMoveRange();
    const currentFuel       = unit.getCurrentFuel();
    const unitGridIndex     = unit.getGridIndex();
    const war               = commonParams.getWar();
    const mapSize           = commonParams.getMapSize();
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    return MovableArea.create({
        gridIndex       : unitGridIndex,
        maxMoveCost     : Math.min(moveRange, currentFuel),
        mapSize         : mapSize,
        moveCostGetter  : gridIndex => {
            const tile = tileMap.getTile(gridIndex);
            if ((!gridIndex.checkIsInsideMap(mapSize))                              ||
                ((blockedGridIndex) && (gridIndex.checkIsEqual(blockedGridIndex)))
            ) {
                return null;
            } else {
                if ((passableGridIndex) && (gridIndex.checkIsEqual(passableGridIndex))) {
                    return commonParams.getMoveCost(unit, tile);
                } else {
                    const existingUnit = unitMap.getUnitOnMap(gridIndex);
                    if ((existingUnit) && (existingUnit.getTeamIndex() != unit.getTeamIndex())) {
                        return null;
                    } else {
                        return commonParams.getMoveCost(unit, tile);
                    }
                }
            }
        }
    });
}

export function getUnitTypeSetForCoSkillSetUnitIdle(player: IPlayer, coSkillType: SkillTypeId, gameConfig: GcData): Set<number> {
    const unitTypeSet = new Set<number>();
    for (const skillId of player.getCoSkills(coSkillType)) {
        const cfg = gameConfig.getCoSkillCfg(skillId)?.getInstantManual()?.getSelfUnitActionState();
        if ((cfg) && (cfg.getUnitActionStateId() === ActionStateId.Idle)) {
            for (const unitType of gameConfig.getUnitTypesByCategory(cfg.getUnitCategoryId() ?? 0) ?? []) {
                unitTypeSet.add(unitType);
            }
        }
    }

    return unitTypeSet;
}

export function getCoPowerSkillTargetGridIndexArray(commonParams: CommonParams, player: IPlayer, coSkillType: SkillTypeId): GridIndex[] | null {
    const count = getPowerSkillTargetsCount(player.getCoBasicCfg(), coSkillType);
    if (count <= 0) {
        return null;
    }

    // TODO 计算合适的位置
    const teamIndex         = player.getTeamIndex();
    const unitMap           = player.getWar().getUnitMap();
    const gridIndexArray    = unitMap.getAllUnitsOnMap(u => u.getTeamIndex() !== teamIndex)
        .sort((v1, v2) => {
            const cost1 = v1.getProductionCfgCost() * v1.getCurrentHp() / v1.getMaxHp() * (v1.getIsCoOnboard() ? 2 : 1);
            const cost2 = v2.getProductionCfgCost() * v2.getCurrentHp() / v2.getMaxHp() * (v2.getIsCoOnboard() ? 2 : 1);
            if (cost1 !== cost2) {
                return cost2 - cost1;
            } else {
                return v1.getUnitId() - v2.getUnitId();
            }
        })
        .map(v => v.getGridIndex());

    let gridId      = 0;
    const mapSize   = commonParams.getMapSize();
    while (gridIndexArray.length < count) {
        const gridIndex = GridIndex.getGridIndexByGridId(gridId++, mapSize);
        if (!gridIndexArray.some(v => v.checkIsEqual(gridIndex))) {
            gridIndexArray.push(gridIndex);
        }
    }

    return gridIndexArray.slice(0, count);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Generators for score map for distance to the nearest capturable tile.
////////////////////////////////////////////////////////////////////////////////////////////////////
// async function _createScoreMapForDistance(unit: IBwUnit): Promise<number[][] | null> {
//     await _checkAndCallLater();

//     const tileMap = war.getTileMap();
//     const nearestCapturableTile = BwHelpers.findNearestCapturableTile(tileMap, war.getUnitMap(), unit);
//     if (!nearestCapturableTile) {
//         return null;
//     }

//     const { distanceMap, maxDistance }  = BwHelpers.createDistanceMap(tileMap, unit, nearestCapturableTile.getGridIndex());
//     const mapSize                       = tileMap.getMapSize();
//     const scoreForUnmovableGrid         = -10 * (maxDistance + 1);
//     for (let x = 0; x < mapSize.width; ++x) {
//         for (let y = 0; y < mapSize.height; ++y) {
//             distanceMap[x][y] = distanceMap[x][y] != null ? distanceMap[x][y] * -10 : scoreForUnmovableGrid;
//         }
//     }

//     return distanceMap;
// }

////////////////////////////////////////////////////////////////////////////////////////////////////
// Damage map generators.
////////////////////////////////////////////////////////////////////////////////////////////////////
async function getAttackInfo(commonParams: CommonParams, attacker: IBwUnit, targetUnit: IBwUnit): Promise<AttackInfo> {
    await checkAndCallLater();

    const attackerGridIndex             = attacker.getGridIndex();
    const attackerPlayerIndex           = attacker.getPlayerIndex();
    const settingsLuckValue             = getExisted(commonParams.getSettingsLuckValueDict().get(attackerPlayerIndex), ClientErrorCode.SpwRobot_GetAttackInfo_00);
    const targetArmorType               = targetUnit.getArmorType();
    const attackerCurrentHp             = attacker.getCurrentHp();
    const attackerMaxFuel               = attacker.getMaxFuel();
    const attackerCurrentFuel           = attacker.getCurrentFuel();
    const mapSize                       = commonParams.getMapSize();
    const war                           = commonParams.getWar();
    const unitMap                       = war.getUnitMap();
    const attackerNormalizedCurrentHp   = getNormalizedHp(attackerCurrentHp);
    const baseDamageWithAmmo            = attacker.getCfgBaseDamage(targetArmorType, attacker.checkHasPrimaryWeapon() ? WeaponTypeId.Primary : WeaponTypeId.Secondary);
    const baseDamageForCurrentAmmo      = attacker.getBaseDamage(targetArmorType);
    const loaderUnitId                  = attacker.getLoaderUnitId();

    if (loaderUnitId == null) {
        const tile          = war.getTileMap().getTile(attackerGridIndex);
        const repairInfo    = tile.getRepairHpAndCostForUnit(attacker);
        if (repairInfo) {
            return {
                baseDamage          : baseDamageWithAmmo,
                normalizedHp        : getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                fuel                : attackerMaxFuel,
                settingsLuckValue   : settingsLuckValue,
            };
        } else {
            if (attackerGridIndex.getAdjacentGrids(mapSize).some(g => unitMap.getUnitOnMap(g)?.checkCanSupplyAdjacentUnit(attacker))) {
                return {
                    baseDamage          : baseDamageWithAmmo,
                    normalizedHp        : attackerNormalizedCurrentHp,
                    fuel                : attackerMaxFuel,
                    settingsLuckValue   : settingsLuckValue,
                };
            } else {
                return {
                    baseDamage          : baseDamageForCurrentAmmo,
                    normalizedHp        : attackerNormalizedCurrentHp,
                    fuel                : attackerCurrentFuel,
                    settingsLuckValue   : settingsLuckValue,
                };
            }
        }

    } else {
        const loaderUnit = unitMap.getUnitOnMap(attackerGridIndex);
        if ((loaderUnit == null) || (loaderUnit === attacker)) {
            throw newError(`Invalid loaderUnit.`, ClientErrorCode.SpwRobot_GetAttackInfo_01);
        }

        if ((!commonParams.getCanAttackAfterMoving(attacker))   ||
            (loaderUnit.getUnitId() !== loaderUnitId)           ||
            (!loaderUnit.checkCanLaunchLoadedUnit())
        ) {
            return {
                baseDamage          : null,
                normalizedHp        : attackerNormalizedCurrentHp,
                fuel                : attackerCurrentFuel,
                settingsLuckValue   : settingsLuckValue,
            };
        } else {
            const repairInfo = loaderUnit.getRepairHpAndCostForLoadedUnit(attacker);
            if (repairInfo) {
                return {
                    baseDamage          : baseDamageWithAmmo,
                    normalizedHp        : getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                    fuel                : attackerMaxFuel,
                    settingsLuckValue   : settingsLuckValue,
                };
            } else {
                if (loaderUnit.checkCanSupplyLoadedUnit()) {
                    return {
                        baseDamage          : baseDamageWithAmmo,
                        normalizedHp        : attackerNormalizedCurrentHp,
                        fuel                : attackerMaxFuel,
                        settingsLuckValue   : settingsLuckValue,
                    };
                } else {
                    return {
                        baseDamage          : baseDamageForCurrentAmmo,
                        normalizedHp        : attackerNormalizedCurrentHp,
                        fuel                : attackerCurrentFuel,
                        settingsLuckValue   : settingsLuckValue,
                    };
                }
            }
        }
    }
}

async function createDamageMap(commonParams: CommonParams, targetUnit: IBwUnit, isDiving: boolean, targetUnitMovableArea: MovableArea): Promise<DamageMapData[][]> {
    await checkAndCallLater();

    const targetPlayerIndex                                 = targetUnit.getPlayerIndex();
    const globalDefenseBonus                                = getExisted(commonParams.getGlobalDefenseBonuses().get(targetPlayerIndex), ClientErrorCode.SpwRobot_CreateDamageMap_00);
    const globalOffenseBonuses                              = commonParams.getGlobalOffenseBonuses();
    const mapSize                                           = commonParams.getMapSize();
    const { width: mapWidth, height: mapHeight }            = mapSize.getWH();
    const war                                               = commonParams.getWar();
    const gcData                                            = war.getGcData();
    const unitMap                                           = war.getUnitMap();
    const tileMap                                           = war.getTileMap();
    const damageMap                                         = createEmptyMap<DamageMapData>(mapWidth);
    const targetTeamIndex                                   = targetUnit.getTeamIndex();
    const targetUnitCanBeAttackedByUnitTypeArrayWhenDived   = targetUnit.getTemplateCfg().getDiveCfg()?.getCanBeAttackedByUnitTypeArray() ?? [];

    for (const attacker of unitMap.getAllUnits()) {
        await checkAndCallLater();

        const beginningGridIndex        = attacker.getGridIndex();
        const attackerPlayerIndex       = attacker.getPlayerIndex();
        const globalOffenseBonus        = getExisted(globalOffenseBonuses.get(attackerPlayerIndex), ClientErrorCode.SpwRobot_CreateDamageMap_01);
        const promotionAttackBonus      = attacker.getPromotionAttackBonus();
        const attackerFinalMoveRange    = attacker.getFinalMoveRange();
        const minAttackRange            = attacker.getMinAttackRange();
        const maxAttackRange            = attacker.getFinalMaxAttackRange();
        const attackerTeamIndex         = attacker.getTeamIndex();
        const canAttackAfterMoving      = commonParams.getCanAttackAfterMoving(attacker);
        if ((minAttackRange == null)                                                                            ||
            (maxAttackRange == null)                                                                            ||
            (maxAttackRange < minAttackRange)                                                                   ||
            (attackerTeamIndex === targetTeamIndex)                                                             ||
            ((isDiving) && (!targetUnitCanBeAttackedByUnitTypeArrayWhenDived.includes(attacker.getUnitType())))
        ) {
            continue;
        }

        const { baseDamage, fuel, normalizedHp, settingsLuckValue } = await getAttackInfo(commonParams, attacker, targetUnit);
        if (baseDamage == null) {
            continue;
        }

        await checkAndCallLater();
        const movableArea = MovableArea.create({
            gridIndex       : beginningGridIndex,
            maxMoveCost     : Math.min(attackerFinalMoveRange, fuel),
            mapSize         : mapSize,
            moveCostGetter  : gridIndex => {
                if (!gridIndex.checkIsInsideMap(mapSize)) {
                    return null;
                } else {
                    const existingUnit = unitMap.getUnitOnMap(gridIndex);
                    if ((existingUnit) && (existingUnit !== targetUnit) && (existingUnit.getTeamIndex() != attackerTeamIndex)) {
                        return null;
                    } else {
                        return commonParams.getMoveCost(attacker, tileMap.getTile(gridIndex));
                    }
                }
            },
        });

        await checkAndCallLater();
        const attackableArea = AttackableArea.create({
            movableArea         : movableArea,
            mapSize             : mapSize,
            minAttackRange      : minAttackRange,
            maxAttackRange      : maxAttackRange,
            checkCanAttack      : (moveGridIndex: GridIndex): boolean => {
                const hasMoved = !moveGridIndex.checkIsEqual(beginningGridIndex);
                return ((attacker.getLoaderUnitId() == null) || (hasMoved))
                    && ((canAttackAfterMoving) || (!hasMoved));
            }
        }).getArea();

        await checkAndCallLater();
        const attackBonus = globalOffenseBonus + promotionAttackBonus;
        for (let x = 0; x < mapWidth; ++x) {
            const movableColumn = targetUnitMovableArea.getColumn(x);
            if (movableColumn == null) {
                continue;
            }

            const attackableColumn = attackableArea[x];
            if (attackableColumn == null) {
                continue;
            }

            for (let y = 0; y < mapHeight; ++y) {
                if (movableColumn[y] == null) {
                    continue;
                }

                const attackableGridData = attackableColumn[y];
                if (attackableGridData == null) {
                    continue;
                }

                const targetGridIndex   = new GridIndex(x, y);
                const isDirect          = attackableGridData.movePathDestination.getDistance(targetGridIndex) <= 1;
                const damage            = Math.floor(
                    (baseDamage * Math.max(0, 1 + attackBonus / 100) + settingsLuckValue)
                    * normalizedHp
                    * getDamageMultiplierForDefenseBonus(
                        gcData,
                        globalDefenseBonus + tileMap.getTile(targetGridIndex).getDefenseAmountForUnit(targetUnit, null, false) + targetUnit.getPromotionDefenseBonus()
                    )
                    / Hp.Normalizer
                );
                if (!damageMap[x][y]) {
                    damageMap[x][y] = {
                        max             : damage,
                        directTotal     : isDirect ? damage : 0,
                        indirectTotal   : isDirect ? 0 : damage,
                    };
                } else {
                    const damageGridData    = damageMap[x][y];
                    damageGridData.max      = Math.max(damageGridData.max, damage);
                    if (isDirect) {
                        damageGridData.directTotal += damage;
                    } else {
                        damageGridData.indirectTotal += damage;
                    }
                }
            }
        }
    }

    return damageMap;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Score calculators.
////////////////////////////////////////////////////////////////////////////////////////////////////
async function getScoreForBeThreatened(commonParams: CommonParams, unit: IBwUnit, gridIndex: GridIndex, damageMap: DamageMapData[][] | null | undefined): Promise<number> {
    // const hp            = unit.getCurrentHp();
    // const data          = damageMap[gridIndex.x][gridIndex.y];
    // const maxDamage     = Math.min(data ? data.max : 0, hp);
    // // const totalDamage   = Math.min(data ? data.total : 0, hp);
    // return - (maxDamage * (maxDamage / 100) + (maxDamage >= hp ? 30 : 0))
    //     * (unit.getProductionFinalCost() / 6000 / Math.max(1, _unitValueRatio))
    //     * (unit.getHasLoadedCo() ? 2 : 1);

    await checkAndCallLater();

    const data = damageMap ? damageMap[gridIndex.getX()][gridIndex.getY()] : null;
    if (data == null) {
        return 0;
    }

    const scalerForUnitValueRatio   = Math.pow(1 / Math.max(1, commonParams.getUnitValueRatio()), 1);
    const currentHp                 = unit.getCurrentHp();
    const directDamage              = data.directTotal;
    const indirectDamage            = data.indirectTotal;
    const totalDamage               = directDamage + indirectDamage;
    const canBeDestroyed            = totalDamage >= currentHp;
    // let score                       = -(totalDamage + (canBeDestroyed ? 30 : 0)) * unit.getProductionCfgCost() / 1000 * scalerForUnitValueRatio * (unit.getHasLoadedCo() ? 2 : 1);
    let score                       = -((data.max >= 10 ? totalDamage : 0) + (canBeDestroyed ? 30 : 0)) * unit.getProductionCfgCost() / 1000 * scalerForUnitValueRatio * (unit.getIsCoOnboard() ? 2 : 1);
    if (canBeDestroyed) {
        for (const loadedUnit of commonParams.getWar().getUnitMap().getUnitsLoadedByLoader(unit, true)) {
            score += -(loadedUnit.getCurrentHp() + 30) * loadedUnit.getProductionCfgCost() / 1000 * scalerForUnitValueRatio * (loadedUnit.getIsCoOnboard() ? 2 : 1);
        }
    }

    return score;
}

async function getScoreForThreatEnemies(commonParams: CommonParams, attackerUnit: IBwUnit, gridIndex: GridIndex, scoreDictForThreatEnemy: Map<IBwUnit, number>): Promise<number> {
    await checkAndCallLater();

    const war           = commonParams.getWar();
    const unitMap       = war.getUnitMap();
    const loaderUnit    = unitMap.getUnitOnMap(gridIndex);
    if ((loaderUnit)                                                &&
        (loaderUnit.getUnitType() !== attackerUnit.getUnitType())   &&
        (!loaderUnit.checkCanLaunchLoadedUnit())
    ) {
        return 0;
    }

    const mapSize               = commonParams.getMapSize();
    const tileMap               = war.getTileMap();
    const attackerTeamIndex     = attackerUnit.getTeamIndex();
    const canAttackAfterMoving  = commonParams.getCanAttackAfterMoving(attackerUnit);

    await checkAndCallLater();
    const movableArea = MovableArea.create({
        gridIndex       : gridIndex,
        maxMoveCost     : attackerUnit.getFinalMoveRange(),
        mapSize         : mapSize,
        moveCostGetter  : g => {
            if (!g.checkIsInsideMap(mapSize)) {
                return null;
            } else {
                // const existingUnit = unitMap.getUnitOnMap(g);
                // if ((existingUnit) && (existingUnit.getTeamIndex() != attackerTeamIndex)) {
                //     return null;
                // } else {
                //     return commonParams.getCachedMoveCost(attackerUnit, tileMap.getTile(g));
                // }
                return commonParams.getMoveCost(attackerUnit, tileMap.getTile(g));
            }
        },
    });

    await checkAndCallLater();
    const attackableArea = AttackableArea.create({
        movableArea         : movableArea,
        mapSize             : mapSize,
        minAttackRange      : attackerUnit.getMinAttackRange(),
        maxAttackRange      : attackerUnit.getFinalMaxAttackRange(),
        checkCanAttack      : (moveGridIndex: GridIndex): boolean => {
            const hasMoved = !moveGridIndex.checkIsEqual(gridIndex);
            return ((canAttackAfterMoving) || (!hasMoved));
        }
    }).getArea();

    await checkAndCallLater();
    const scalerForUnitValueRatio   = Math.pow(Math.max(1, commonParams.getUnitValueRatio()), 1);
    const mapWidth                  = mapSize.getWidth();
    const mapHeight                 = mapSize.getHeight();
    const normalizedHp              = attackerUnit.getNormalizedCurrentHp();
    const attackerPlayerIndex       = attackerUnit.getPlayerIndex();
    const gcData                    = war.getGcData();
    const settingsLuckValue         = getExisted(commonParams.getSettingsLuckValueDict().get(attackerPlayerIndex), ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_00);
    const globalOffenseBonus        = getExisted(commonParams.getGlobalOffenseBonuses().get(attackerPlayerIndex), ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_01);
    const globalDefenseBonuses      = commonParams.getGlobalDefenseBonuses();
    const attackBonus               = globalOffenseBonus + attackerUnit.getPromotionAttackBonus();
    let totalScore                  = 0;
    for (let x = 0; x < mapWidth; ++x) {
        const column = attackableArea[x];
        if (column == null) {
            continue;
        }

        for (let y = 0; y < mapHeight; ++y) {
            const attackableGridData = column[y];
            if (attackableGridData == null) {
                continue;
            }

            const targetGridIndex   = new GridIndex(x, y);
            const targetUnit        = unitMap.getUnitOnMap(targetGridIndex);
            if (targetUnit == null) {
                continue;
            }

            if (scoreDictForThreatEnemy.has(targetUnit)) {
                totalScore += getExisted(scoreDictForThreatEnemy.get(targetUnit), ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_02);
                continue;
            }

            if (targetUnit.getTeamIndex() === attackerTeamIndex) {
                scoreDictForThreatEnemy.set(targetUnit, 0);
                continue;
            }

            const baseDamage = attackerUnit.getBaseDamage(targetUnit.getArmorType());
            if (baseDamage == null) {
                scoreDictForThreatEnemy.set(targetUnit, 0);
                continue;
            }

            const globalDefenseBonus    = getExisted(globalDefenseBonuses.get(targetUnit.getPlayerIndex()), ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_03);
            const damage                = Math.floor(
                (baseDamage * Math.max(0, 1 + attackBonus / 100) + settingsLuckValue)
                * normalizedHp
                * getDamageMultiplierForDefenseBonus(
                    gcData,
                    globalDefenseBonus + tileMap.getTile(targetGridIndex).getDefenseAmountForUnit(targetUnit, null, false) + targetUnit.getPromotionDefenseBonus()
                )
                / Hp.Normalizer
            );
            const canDestroy    = damage >= targetUnit.getCurrentHp();
            let score           = (damage + (canDestroy ? 30 : 0)) * targetUnit.getProductionCfgCost() / 1000 * scalerForUnitValueRatio * (targetUnit.getIsCoOnboard() ? 2 : 1);
            if (canDestroy) {
                for (const loadedUnit of unitMap.getUnitsLoadedByLoader(targetUnit, true)) {
                    score += -(loadedUnit.getCurrentHp() + 30) * loadedUnit.getProductionCfgCost() / 1000 * scalerForUnitValueRatio * (loadedUnit.getIsCoOnboard() ? 2 : 1);
                }
            }

            scoreDictForThreatEnemy.set(targetUnit, score);
            totalScore += score;
        }
    }

    return totalScore;
}

async function getScoreForDistanceToCapturableBuildings(commonParams: CommonParams, unit: IBwUnit, movableArea: MovableArea): Promise<number> {
    await checkAndCallLater();

    const war                                       = commonParams.getWar();
    const { width: mapWidth, height: mapHeight }    = commonParams.getMapSize().getWH();
    const tileMap                                   = war.getTileMap();
    const unitMap                                   = war.getUnitMap();
    const teamIndex                                 = unit.getTeamIndex();
    const distanceArray                             : number[] = [];
    for (let x = 0; x < mapWidth; ++x) {
        const column = movableArea.getColumn(x);
        if (column == null) {
            continue;
        }

        for (let y = 0; y < mapHeight; ++y) {
            const info = column[y];
            if (info == null) {
                continue;
            }

            const distance      = info.totalMoveCost;
            const gridIndex     = new GridIndex(x, y);
            const tile          = tileMap.getTile(gridIndex);
            const existingUnit  = unitMap.getUnitOnMap(gridIndex);
            if (((tile.getMaxCapturePoint() != null) && (tile.getTeamIndex() !== teamIndex))    ||
                ((existingUnit != null) && (existingUnit.getTeamIndex() !== teamIndex))
            ) {
                distanceArray.push(distance);
            }
        }
    }
    distanceArray.sort((v1, v2) => v1 - v2);

    const moveRange = unit.getFinalMoveRange();
    const scaler    = unit.getCurrentHp() * unit.getProductionCfgCost() / 1000 / Math.max(1, commonParams.getUnitValueRatio()) * (unit.getIsCoOnboard() ? 2 : 1);
    let score       = 0;
    for (let i = Math.min(1, distanceArray.length - 1); i >= 0; --i) {
        const distance = distanceArray[i];
        if (distance > 0) {
            score += -(distance + Math.ceil(distance / Math.max(1, moveRange)) * scaler) / (i === 0 ? 1 : 100);
        } else {
            score += unit.checkIsCapturer() ? 0 : ((-scaler - 10) / (i === 0 ? 1 : 100));
        }
    }
    return score;

    // method 2
    // const { war, mapSize }                          = commonParams;
    // const { width: mapWidth, height: mapHeight }    = mapSize;
    // const tileMap                                   = war.getTileMap();
    // const teamIndex                                 = unit.getTeamIndex();
    // const distanceInfoArray                         : { distance: number, scaler: number }[] = [];
    // for (let x = 0; x < mapWidth; ++x) {
    //     if (movableArea[x] == null) {
    //         continue;
    //     }

    //     for (let y = 0; y < mapHeight; ++y) {
    //         const info = movableArea[x][y];
    //         if (info == null) {
    //             continue;
    //         }

    //         const tile          = tileMap.getTile({ x, y });
    //         const tileType      = tile.getType();
    //         const tileTeamIndex = tile.getTeamIndex();
    //         if ((tile.getMaxCapturePoint() != null) &&
    //             (tileTeamIndex !== teamIndex)
    //         ) {
    //             distanceInfoArray.push({
    //                 distance: info.totalMoveCost,
    //                 scaler  : (_DISTANCE_SCORE_SCALERS[tileType] || 1) * (tileTeamIndex === GameConfig.WarNeutralTeamIndex ? 1.2 : 1),
    //             });
    //         }
    //     }
    // }

    // const tilesCount = distanceInfoArray.length;
    // if (tilesCount <= 0) {
    //     return 0;
    // } else {
    //     const currentHp         = unit.getCurrentHp();
    //     const maxHp             = unit.getMaxHp();
    //     let score               = 0;
    //     let maxDistance         = 0;
    //     for (const distanceInfo of distanceInfoArray) {
    //         const distance  = distanceInfo.distance;
    //         maxDistance     = Math.max(maxDistance, distance);
    //         score           += - Math.pow(distance, 2) * distanceInfo.scaler;
    //     }
    //     return score / tilesCount / (maxDistance || 1) * 2 * unit.getProductionCfgCost() / 1000 / maxHp * currentHp;
    // }


    // method 1
    // const tileMap                                   = war.getTileMap();
    // const { width: mapWidth, height: mapHeight }    = tileMap.getMapSize();
    // const teamIndex                                 = unit.getTeamIndex();
    // let maxScore                                    = Number.MIN_VALUE;
    // for (let x = 0; x < mapWidth; ++x) {
    //     if (movableArea[x]) {
    //         for (let y = 0; y < mapHeight; ++y) {
    //             const info = movableArea[x][y];
    //             if (info) {
    //                 const tile = tileMap.getTile({ x, y });
    //                 if ((tile.getMaxCapturePoint() != null) && (tile.getTeamIndex() !== teamIndex)) {
    //                     maxScore = Math.max(maxScore, - info.totalMoveCost * (_DISTANCE_SCORE_SCALERS[tile.getType()] || 1) * 10);
    //                 }
    //             }
    //         }
    //     }
    // }
    // return maxScore > Number.MIN_VALUE ? maxScore : 0;
}

async function getScoreForAiWeightedDestination(unit: IBwUnit, movableArea: MovableArea): Promise<number> {
    await checkAndCallLater();

    const aiWeightedDestination = unit.getAiWeightedDestination();
    if (aiWeightedDestination == null) {
        return 0;
    }

    const weight = aiWeightedDestination.weight;
    if (weight == 0) {
        return 0;
    }

    const gridIndex = aiWeightedDestination.gridIndex;
    const column    = movableArea.getColumn(gridIndex.getX());
    const info      = column ? column[gridIndex.getY()] : null;
    return info == null
        ? 0
        : -info.totalMoveCost * weight / 100;
}

async function getScoreForPosition({ commonParams, unit, gridIndex, damageMap, scoreDictForThreatEnemy }: {
    commonParams            : CommonParams;
    unit                    : IBwUnit;
    gridIndex               : GridIndex;
    damageMap               : DamageMapData[][] | null | undefined;
    scoreDictForThreatEnemy : Map<IBwUnit, number>;
}): Promise<number> {
    await checkAndCallLater();

    const [scoreForBeThreatened, scoreForThreatEnemies] = await Promise.all([
        getScoreForBeThreatened(commonParams, unit, gridIndex, damageMap),
        getScoreForThreatEnemies(commonParams, unit, gridIndex, scoreDictForThreatEnemy),
    ]);
    let totalScore          = scoreForBeThreatened + scoreForThreatEnemies;
    const war               = commonParams.getWar();
    const tileMap           = war.getTileMap();
    const tile              = tileMap.getTile(gridIndex);
    const tileTeamIndex     = tile.getTeamIndex();
    const unitTeamIndex     = unit.getTeamIndex();
    const passiveScaler     = unit.getProductionCfgCost() / 1000 / Math.max(1, commonParams.getUnitValueRatio()) * (unit.getIsCoOnboard() ? 2 : 1);

    if ((tileTeamIndex === unitTeamIndex) && (tile.checkCanRepairOrSupplyUnitType(unit.getUnitType()))) {
        totalScore += (unit.getMaxHp() - unit.getCurrentHp()) * 1 * passiveScaler;

        {
            const maxAmmo = unit.getPrimaryWeaponMaxAmmo();
            if ((maxAmmo) && (unit.checkIsPrimaryWeaponAmmoInShort())) {
                const currentAmmo   = getExisted(unit.getPrimaryWeaponCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForPosition_00);
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }

        if (unit.checkIsFuelInShort()) {
            const maxFuel   = unit.getMaxFuel();
            totalScore      += (maxFuel - unit.getCurrentFuel()) / maxFuel * 10 * (unit.checkIsDestroyedOnOutOfFuel() ? 5 : 1) * passiveScaler;
        }

        if (IsNeedVisibility) {
            const maxAmmo = unit.getFlareMaxAmmo();
            if ((maxAmmo) && (war.getFogMap().checkHasFogCurrently())) {
                const currentAmmo   = getExisted(unit.getFlareCurrentAmmo(), ClientErrorCode.SpwRobot_GetScoreForPosition_01);
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }
    }

    const aiScoreArrayForStay   = tile.getTemplateCfg().getAiScoreForStay();
    if (aiScoreArrayForStay) {
        if (tileTeamIndex === unitTeamIndex) {
            totalScore += aiScoreArrayForStay[0] ?? 0;
        } else if (tileTeamIndex !== TeamIndex.Neutral) {
            totalScore += aiScoreArrayForStay[1] ?? 0;
        }
    }

    await checkAndCallLater();

    const movableArea   = MovableArea.create({
        gridIndex       : gridIndex,
        maxMoveCost     : Number.MAX_SAFE_INTEGER,
        mapSize         : commonParams.getMapSize(),
        moveCostGetter  : g => commonParams.getMoveCost(unit, tileMap.getTile(g)),
    });

    totalScore += await getScoreForDistanceToCapturableBuildings(commonParams, unit, movableArea);
    totalScore += await getScoreForAiWeightedDestination(unit, movableArea);
    // totalScore += await getScoreForDistanceToOtherUnits(commonParams, unit, movableArea);

    return totalScore;
}

async function getScoreForMovePath(commonParams: CommonParams, movingUnit: IBwUnit, movePath: MovePathNode[]): Promise<number> {
    await checkAndCallLater();

    if (!IsNeedVisibility) {
        return 0;
    }

    const discoveredUnits = getDiscoveredUnitsByPath({
        war             : commonParams.getWar(),
        path            : movePath.map(v => v.getGridIndex()),
        movingUnit      : movingUnit,
        isUnitDestroyed : false,
        visibleUnits    : commonParams.getVisibleUnits(),
        unitVisionInfo  : commonParams.getUnitVisionInfo(movingUnit),
    });
    let scoreForMovePath = 0;
    for (const unit of discoveredUnits) {
        scoreForMovePath += 1 + unit.getCurrentHp() / unit.getMaxHp() * unit.getProductionCfgCost() / 1000 * (unit.getIsCoOnboard() ? 2 : 1) * 1;
    }

    return scoreForMovePath;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// The available action generators for units.
////////////////////////////////////////////////////////////////////////////////////////////////////
async function getBestScoreAndActionForUnitAndPath(commonParams: CommonParams, unit: IBwUnit, destination: GridIndex, pathNodes: MovePathNode[]): Promise<GrScoreAndAction | null> {
    await checkAndCallLater();

    const scoreAndActionForUnitBeLoaded = await getScoreAndActionUnitBeLoaded(commonParams, unit, destination, pathNodes);
    if (scoreAndActionForUnitBeLoaded) {
        return scoreAndActionForUnitBeLoaded;
    }

    const scoreAndActionForUnitJoin = await getScoreAndActionUnitJoin(commonParams, unit, destination, pathNodes);
    if (scoreAndActionForUnitJoin) {
        return scoreAndActionForUnitJoin;
    }

    if (!await checkCanUnitWaitOnGrid(commonParams, unit, destination)) {
        return null;
    }

    return getBestScoreAndAction(await Promise.all([
        getScoreAndActionUnitAttack(commonParams, unit, pathNodes),
        getScoreAndActionUnitCaptureTile(commonParams, unit, destination, pathNodes),
        getScoreAndActionUnitCrushUnit(commonParams, unit, destination, pathNodes),
        getScoreAndActionUnitDive(unit, pathNodes),
        getScoreAndActionUnitDropUnit({ commonParams, unit, gridIndex: destination, pathNodes }),
        getScoreAndActionUnitLaunchSilo(commonParams, unit, destination, pathNodes),
        getScoreAndActionUnitLaunchFlare(commonParams, unit, destination, pathNodes),
        getScoreAndActionUnitProduceUnit(commonParams, unit, pathNodes),
        getScoreAndActionUnitRepairUnit(commonParams, unit, destination, pathNodes),
        getScoreAndActionUnitSelfDetonate(commonParams, unit, destination, pathNodes),
        getScoreAndActionUnitSurface(unit, pathNodes),
        getScoreAndActionUnitWait(unit, pathNodes),
        getScoreAndActionUnitBoardedByCo(unit, pathNodes),
        getScoreAndActionUnitUseCoSkill(commonParams, unit, pathNodes),
    ]), commonParams);
}

export async function getBestScoreAndActionForCandidateUnit(commonParams: CommonParams, candidateUnit: IBwUnit): Promise<GrScoreAndAction | null> {
    await checkAndCallLater();

    if (!candidateUnit.checkCanAiDoAction()) {
        return null;
    }

    const bestScoreAndActionDict = commonParams.getBestScoreAndActionDict();
    {
        const bestScoreAndAction = bestScoreAndActionDict.get(candidateUnit);
        if (bestScoreAndAction) {
            return bestScoreAndAction;
        }
    }

    const reachableArea             = await getReachableArea({ commonParams, unit: candidateUnit, passableGridIndex: null, blockedGridIndex: null });
    const damageMapForSurface       = await createDamageMap(commonParams, candidateUnit, false, reachableArea);
    const damageMapForDive          = candidateUnit.checkIsDiver() ? await createDamageMap(commonParams, candidateUnit, true, reachableArea) : null;
    const originGridIndex           = candidateUnit.getGridIndex();
    const scoreDictForThreatEnemy   = new Map<IBwUnit, number>();
    const canLaunchUnit             = (candidateUnit.checkCanLaunchLoadedUnit()) && (candidateUnit.getLoadedUnits().some(v => ((v.getActionState() === ActionStateId.Idle) && (v.checkCanAiDoAction()) && (v.getFinalMoveRange() > 0))));
    // const scoreMapForDistance       = await _createScoreMapForDistance(candidateUnit);
    const { width: mapWidth, height: mapHeight }    = commonParams.getMapSize().getWH();
    const promiseArray                              : Promise<GrScoreAndAction | null>[] = [];
    for (let x = 0; x < mapWidth; ++x) {
        const column = reachableArea.getColumn(x);
        if (!column) {
            continue;
        }

        for (let y = 0; y < mapHeight; ++y) {
            if (!column[y]) {
                continue;
            }

            const destination = new GridIndex(x, y);
            promiseArray.push((async (): Promise<GrScoreAndAction | null> => {
                if (destination.checkIsEqual(originGridIndex)) {
                    if (candidateUnit.getLoaderUnitId() != null) {
                        return null;
                    }
                } else {
                    const aiMode = candidateUnit.getAiMode();
                    if (aiMode === AiModeId.NoMove) {
                        return null;
                    }
                }

                const pathNodes         = reachableArea.createShortestMovePath(destination);
                const scoreAndAction    = await getBestScoreAndActionForUnitAndPath(commonParams, candidateUnit, destination, pathNodes);
                if (scoreAndAction == null) {
                    return null;
                }

                const action                = scoreAndAction.action;
                const scoreForLaunchUnit    = ((pathNodes.length === 1) && (canLaunchUnit)) ? -999 : 1;
                const scoreForMovePath      = await getScoreForMovePath(commonParams, candidateUnit, pathNodes);
                const scoreForPosition      = await getScoreForPosition({
                    commonParams,
                    unit                    : candidateUnit,
                    gridIndex: destination,
                    damageMap               : ((action.getWoUnitDive()) || ((candidateUnit.getIsDiving()) && (!action.getWoUnitSurface()))) ? damageMapForDive : damageMapForSurface,
                    scoreDictForThreatEnemy,
                });
                return {
                    score   : scoreAndAction.score + scoreForLaunchUnit + scoreForMovePath + scoreForPosition,
                    action,
                };
            })());
        }
    }

    const bestScoreAndAction = getBestScoreAndAction(await Promise.all(promiseArray), commonParams);
    if (bestScoreAndAction) {
        bestScoreAndActionDict.set(candidateUnit, bestScoreAndAction);
    }
    return bestScoreAndAction;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Phases.
////////////////////////////////////////////////////////////////////////////////////////////////////
export function candidateUnitSorter(v1: IBwUnit, v2: IBwUnit): number {
    {
        const isLoaded1 = v1.checkIsMeetLoadedState(LoadedStateId.IsLoaded);
        if (isLoaded1 != v2.checkIsMeetLoadedState(LoadedStateId.IsLoaded)) {
            return isLoaded1 ? -1 : 1;
        }
    }

    {
        const hasLoadedCo1 = v1.getIsCoOnboard();
        if (hasLoadedCo1 !== v2.getIsCoOnboard()) {
            return hasLoadedCo1 ? -1 : 1;
        }
    }

    {
        const isCapturer1 = v1.checkIsCapturer();
        if (isCapturer1 != v2.checkIsCapturer()) {
            return isCapturer1 ? -1 : 1;
        }
    }

    const cost1 = v1.getProductionCfgCost() * v1.getCurrentHp();
    const cost2 = v2.getProductionCfgCost() * v2.getCurrentHp();
    if (cost1 !== cost2) {
        return cost1 - cost2;
    }

    return v1.getUnitId() - v2.getUnitId();
}

const funcArray = [
    getActionForPhase01,
    getActionForPhase08,
    getActionForPhase09,
    getActionForPhase11,
    getActionForPhase12,
];
export async function doGetNextOperation(war: IBwWar): Promise<WoContainer> {
    if (war.getPlayerIndexInTurn() === PlayerIndex.Neutral) {
        throw newError(`Invalid playerIndexInTurn.`, ClientErrorCode.SpwRobot_DoGetNextAction_00);
    }

    const commonParams = await CommonParams.create(war);
    for (const func of funcArray) {
        const actionForPhase = await func(commonParams);
        if (actionForPhase) {
            return actionForPhase;
        }
    }

    throw newError(`No available action?!`, ClientErrorCode.SpwRobot_DoGetNextAction_01);
}
