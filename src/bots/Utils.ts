import {
    Units_Constants,
    AuxiliaryTypes_AttackableArea,
    Timer_TimerModel,
    Utils_ClientErrorCode,
    Bots_CommonParams,
    Helpers_Collection,
    Bots_Phases_Phase01,
    Bots_Phases_Phase08,
    Bots_Phases_Phase09,
    Bots_Phases_Phase11,
    Bots_Phases_Phase12,
    DamageCalculators_Utils,
    Visibilities_Utils,
    Helpers_Misc,
    Units_Utils_Common,
    CoSkills_Utils_Common,
    Bots_Actions_UnitAttack,
    Bots_Actions_UnitBeLoaded,
    Bots_Actions_UnitBoardedByCo,
    Bots_Actions_UnitCaptureTile,
    Bots_Actions_UnitCrushUnit,
    Bots_Actions_UnitDive,
    Bots_Actions_UnitDropUnit,
    Bots_Actions_UnitJoin,
    Bots_Actions_UnitLaunchFlare,
    Bots_Actions_UnitLaunchSilo,
    Bots_Actions_UnitProduceUnit,
    Bots_Actions_UnitRepairUnit,
    Bots_Actions_UnitSelfDetonate,
    Bots_Actions_UnitSurface,
    Bots_Actions_UnitUseCoSkill,
    Bots_Actions_UnitWait,
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MovableArea,
    Players_Constants,
    Teams_Constants,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Units_IUnit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
    type CoSkills_Constants,
} from "../internal.ts";
import type { WoContainer } from "../proto/schema/CommonProto/WarOperation/WoContainer.ts";

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
async function checkCanUnitWaitOnGrid(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Promise<boolean> {
    await Timer_TimerModel.checkAndCallLater();

    const unitGridIndex = unit.getGridIndex();
    return (unitGridIndex.checkIsEqual(gridIndex))
        ? (unit.getLoaderUnitId() == null)
        : (!commonParams.getWar().getUnitMap().getUnitOnMap(gridIndex));
}

export function getBetterScoreAndAction(data1: Bots_Types.ScoreAndAction | null | undefined, data2: Bots_Types.ScoreAndAction, commonParams: Bots_CommonParams.CommonParams): Bots_Types.ScoreAndAction {
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
export function getBestScoreAndAction(dataArray: (Bots_Types.ScoreAndAction | null)[], commonParams: Bots_CommonParams.CommonParams): Bots_Types.ScoreAndAction | null {
    let bestData: Bots_Types.ScoreAndAction | null = null;
    for (const newData of dataArray) {
        if (newData != null) {
            bestData = getBetterScoreAndAction(bestData, newData, commonParams);
        }
    }
    return bestData;
}

async function getReachableArea({ commonParams, unit, passableGridIndex, blockedGridIndex }: {
    commonParams        : Bots_CommonParams.CommonParams;
    unit                : Units_IUnit.IUnit;
    passableGridIndex   : AuxiliaryTypes_GridIndex.GridIndex | null;
    blockedGridIndex    : AuxiliaryTypes_GridIndex.GridIndex | null;
}): Promise<AuxiliaryTypes_MovableArea.MovableArea> {
    await Timer_TimerModel.checkAndCallLater();

    const moveRange         = unit.getFinalMoveRange();
    const currentFuel       = unit.getCurrentFuel();
    const unitGridIndex     = unit.getGridIndex();
    const war               = commonParams.getWar();
    const mapSize           = commonParams.getMapSize();
    const unitMap           = war.getUnitMap();
    const tileMap           = war.getTileMap();
    return AuxiliaryTypes_MovableArea.MovableArea.create({
        gridIndex      : unitGridIndex,
        maxMoveCost    : Math.min(moveRange, currentFuel),
        mapSize        : mapSize,
        moveCostGetter : gridIndex => {
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
        },
    });
}

export function getUnitTypeSetForCoSkillSetUnitIdle(player: Players_IPlayer.IPlayer, coSkillType: CoSkills_Constants.SkillTypeId, gameConfig: GameConfigs_GameConfig.GameConfig): Set<number> {
    const unitTypeSet = new Set<number>();
    for (const skillId of player.getCoSkills(coSkillType)) {
        const cfg = gameConfig.getCoSkillCfg(skillId)?.getInstantManual()?.getSelfUnitActionState();
        if ((cfg) && (cfg.getUnitActionStateId() === Units_Constants.ActionStateId.Idle)) {
            for (const unitType of gameConfig.getUnitTypesByCategory(cfg.getUnitCategoryId()) ?? []) {
                unitTypeSet.add(unitType);
            }
        }
    }

    return unitTypeSet;
}

export function getCoPowerSkillTargetGridIndexArray(commonParams: Bots_CommonParams.CommonParams, player: Players_IPlayer.IPlayer, coSkillType: CoSkills_Constants.SkillTypeId): AuxiliaryTypes_GridIndex.GridIndex[] | null {
    const count = CoSkills_Utils_Common.getPowerSkillTargetsCount(player.getCoBasicCfg(), coSkillType);
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
        const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.getGridIndexByGridId(gridId++, mapSize);
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
async function getAttackInfo(commonParams: Bots_CommonParams.CommonParams, attacker: Units_IUnit.IUnit, targetUnit: Units_IUnit.IUnit): Promise<AttackInfo> {
    await Timer_TimerModel.checkAndCallLater();

    const attackerGridIndex             = attacker.getGridIndex();
    const attackerPlayerIndex           = attacker.getPlayerIndex();
    const settingsLuckValue             = Helpers_Misc.getExisted(commonParams.getSettingsLuckValueDict().get(attackerPlayerIndex), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetAttackInfo_00);
    const targetArmorType               = targetUnit.getArmorType();
    const attackerCurrentHp             = attacker.getCurrentHp();
    const attackerMaxFuel               = attacker.getMaxFuel();
    const attackerCurrentFuel           = attacker.getCurrentFuel();
    const mapSize                       = commonParams.getMapSize();
    const war                           = commonParams.getWar();
    const unitMap                       = war.getUnitMap();
    const attackerNormalizedCurrentHp   = Units_Utils_Common.getNormalizedHp(attackerCurrentHp);
    const baseDamageWithAmmo            = attacker.getCfgBaseDamage(targetArmorType, attacker.checkHasPrimaryWeapon() ? Units_Constants.WeaponTypeId.Primary : Units_Constants.WeaponTypeId.Secondary);
    const baseDamageForCurrentAmmo      = attacker.getBaseDamage(targetArmorType);
    const loaderUnitId                  = attacker.getLoaderUnitId();

    if (loaderUnitId == null) {
        const tile          = war.getTileMap().getTile(attackerGridIndex);
        const repairInfo    = tile.getRepairHpAndCostForUnit(attacker);
        if (repairInfo) {
            return {
                baseDamage        : baseDamageWithAmmo,
                normalizedHp      : Units_Utils_Common.getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                fuel              : attackerMaxFuel,
                settingsLuckValue : settingsLuckValue,
            };
        } else {
            if (attackerGridIndex.getAdjacentGrids(mapSize).some(g => unitMap.getUnitOnMap(g)?.checkCanSupplyAdjacentUnit(attacker))) {
                return {
                    baseDamage        : baseDamageWithAmmo,
                    normalizedHp      : attackerNormalizedCurrentHp,
                    fuel              : attackerMaxFuel,
                    settingsLuckValue : settingsLuckValue,
                };
            } else {
                return {
                    baseDamage        : baseDamageForCurrentAmmo,
                    normalizedHp      : attackerNormalizedCurrentHp,
                    fuel              : attackerCurrentFuel,
                    settingsLuckValue : settingsLuckValue,
                };
            }
        }

    } else {
        const loaderUnit = unitMap.getUnitOnMap(attackerGridIndex);
        if ((loaderUnit == null) || (loaderUnit === attacker)) {
            throw Helpers_Misc.newError(`Invalid loaderUnit.`, Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetAttackInfo_01);
        }

        if ((!commonParams.getCanAttackAfterMoving(attacker))   ||
            (loaderUnit.getUnitId() !== loaderUnitId)           ||
            (!loaderUnit.checkCanLaunchLoadedUnit())
        ) {
            return {
                baseDamage        : null,
                normalizedHp      : attackerNormalizedCurrentHp,
                fuel              : attackerCurrentFuel,
                settingsLuckValue : settingsLuckValue,
            };
        } else {
            const repairInfo = loaderUnit.getRepairHpAndCostForLoadedUnit(attacker);
            if (repairInfo) {
                return {
                    baseDamage        : baseDamageWithAmmo,
                    normalizedHp      : Units_Utils_Common.getNormalizedHp(attackerCurrentHp + repairInfo.hp),
                    fuel              : attackerMaxFuel,
                    settingsLuckValue : settingsLuckValue,
                };
            } else {
                if (loaderUnit.checkCanSupplyLoadedUnit()) {
                    return {
                        baseDamage        : baseDamageWithAmmo,
                        normalizedHp      : attackerNormalizedCurrentHp,
                        fuel              : attackerMaxFuel,
                        settingsLuckValue : settingsLuckValue,
                    };
                } else {
                    return {
                        baseDamage        : baseDamageForCurrentAmmo,
                        normalizedHp      : attackerNormalizedCurrentHp,
                        fuel              : attackerCurrentFuel,
                        settingsLuckValue : settingsLuckValue,
                    };
                }
            }
        }
    }
}

async function createDamageMap(commonParams: Bots_CommonParams.CommonParams, targetUnit: Units_IUnit.IUnit, isDiving: boolean, targetUnitMovableArea: AuxiliaryTypes_MovableArea.MovableArea): Promise<DamageMapData[][]> {
    await Timer_TimerModel.checkAndCallLater();

    const targetPlayerIndex                                 = targetUnit.getPlayerIndex();
    const globalDefenseBonus                                = Helpers_Misc.getExisted(commonParams.getGlobalDefenseBonuses().get(targetPlayerIndex), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_CreateDamageMap_00);
    const globalOffenseBonuses                              = commonParams.getGlobalOffenseBonuses();
    const mapSize                                           = commonParams.getMapSize();
    const { width: mapWidth, height: mapHeight }            = mapSize.getWH();
    const war                                               = commonParams.getWar();
    const gcData                                            = war.getGcData();
    const unitMap                                           = war.getUnitMap();
    const tileMap                                           = war.getTileMap();
    const damageMap                                         = Helpers_Collection.createEmptyMap<DamageMapData>(mapWidth);
    const targetTeamIndex                                   = targetUnit.getTeamIndex();
    const targetUnitCanBeAttackedByUnitTypeArrayWhenDived   = targetUnit.getTemplateCfg().getDiveCfg()?.getCanBeAttackedByUnitTypeArray() ?? [];

    for (const attacker of unitMap.getAllUnits()) {
        await Timer_TimerModel.checkAndCallLater();

        const beginningGridIndex        = attacker.getGridIndex();
        const attackerPlayerIndex       = attacker.getPlayerIndex();
        const globalOffenseBonus        = Helpers_Misc.getExisted(globalOffenseBonuses.get(attackerPlayerIndex), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_CreateDamageMap_01);
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

        await Timer_TimerModel.checkAndCallLater();
        const movableArea = AuxiliaryTypes_MovableArea.MovableArea.create({
            gridIndex      : beginningGridIndex,
            maxMoveCost    : Math.min(attackerFinalMoveRange, fuel),
            mapSize        : mapSize,
            moveCostGetter : gridIndex => {
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

        await Timer_TimerModel.checkAndCallLater();
        const attackableArea = AuxiliaryTypes_AttackableArea.AttackableArea.create({
            movableArea    : movableArea,
            mapSize        : mapSize,
            minAttackRange : minAttackRange,
            maxAttackRange : maxAttackRange,
            checkCanAttack : (moveGridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean => {
                const hasMoved = !moveGridIndex.checkIsEqual(beginningGridIndex);
                return ((attacker.getLoaderUnitId() == null) || (hasMoved))
                    && ((canAttackAfterMoving) || (!hasMoved));
            },
        }).getArea();

        await Timer_TimerModel.checkAndCallLater();
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

                const targetGridIndex   = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
                const isDirect          = attackableGridData.movePathDestination.getDistance(targetGridIndex) <= 1;
                const damage            = Math.floor(
                    (baseDamage * Math.max(0, 1 + attackBonus / 100) + settingsLuckValue)
                    * normalizedHp
                    * DamageCalculators_Utils.getDamageMultiplierForDefenseBonus(
                        gcData,
                        globalDefenseBonus + tileMap.getTile(targetGridIndex).getDefenseAmountForUnit(targetUnit, null, false) + targetUnit.getPromotionDefenseBonus(),
                    )
                    / Units_Constants.Hp.Normalizer,
                );
                if (!damageMap[x][y]) {
                    damageMap[x][y] = {
                        max           : damage,
                        directTotal   : isDirect ? damage : 0,
                        indirectTotal : isDirect ? 0 : damage,
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
async function getScoreForBeThreatened(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, damageMap: DamageMapData[][] | null | undefined): Promise<number> {
    // const hp            = unit.getCurrentHp();
    // const data          = damageMap[gridIndex.x][gridIndex.y];
    // const maxDamage     = Math.min(data ? data.max : 0, hp);
    // // const totalDamage   = Math.min(data ? data.total : 0, hp);
    // return - (maxDamage * (maxDamage / 100) + (maxDamage >= hp ? 30 : 0))
    //     * (unit.getProductionFinalCost() / 6000 / Math.max(1, _unitValueRatio))
    //     * (unit.getHasLoadedCo() ? 2 : 1);

    await Timer_TimerModel.checkAndCallLater();

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

async function getScoreForThreatEnemies(commonParams: Bots_CommonParams.CommonParams, attackerUnit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, scoreDictForThreatEnemy: Map<Units_IUnit.IUnit, number>): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

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

    await Timer_TimerModel.checkAndCallLater();
    const movableArea = AuxiliaryTypes_MovableArea.MovableArea.create({
        gridIndex      : gridIndex,
        maxMoveCost    : attackerUnit.getFinalMoveRange(),
        mapSize        : mapSize,
        moveCostGetter : g => {
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

    await Timer_TimerModel.checkAndCallLater();
    const attackableArea = AuxiliaryTypes_AttackableArea.AttackableArea.create({
        movableArea    : movableArea,
        mapSize        : mapSize,
        minAttackRange : attackerUnit.getMinAttackRange(),
        maxAttackRange : attackerUnit.getFinalMaxAttackRange(),
        checkCanAttack : (moveGridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean => {
            const hasMoved = !moveGridIndex.checkIsEqual(gridIndex);
            return ((canAttackAfterMoving) || (!hasMoved));
        },
    }).getArea();

    await Timer_TimerModel.checkAndCallLater();
    const scalerForUnitValueRatio   = Math.pow(Math.max(1, commonParams.getUnitValueRatio()), 1);
    const mapWidth                  = mapSize.getWidth();
    const mapHeight                 = mapSize.getHeight();
    const normalizedHp              = attackerUnit.getNormalizedCurrentHp();
    const attackerPlayerIndex       = attackerUnit.getPlayerIndex();
    const gcData                    = war.getGcData();
    const settingsLuckValue         = Helpers_Misc.getExisted(commonParams.getSettingsLuckValueDict().get(attackerPlayerIndex), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_00);
    const globalOffenseBonus        = Helpers_Misc.getExisted(commonParams.getGlobalOffenseBonuses().get(attackerPlayerIndex), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_01);
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

            const targetGridIndex   = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
            const targetUnit        = unitMap.getUnitOnMap(targetGridIndex);
            if (targetUnit == null) {
                continue;
            }

            if (scoreDictForThreatEnemy.has(targetUnit)) {
                totalScore += Helpers_Misc.getExisted(scoreDictForThreatEnemy.get(targetUnit), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_02);
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

            const globalDefenseBonus    = Helpers_Misc.getExisted(globalDefenseBonuses.get(targetUnit.getPlayerIndex()), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForThreatEnemies_03);
            const damage                = Math.floor(
                (baseDamage * Math.max(0, 1 + attackBonus / 100) + settingsLuckValue)
                * normalizedHp
                * DamageCalculators_Utils.getDamageMultiplierForDefenseBonus(
                    gcData,
                    globalDefenseBonus + tileMap.getTile(targetGridIndex).getDefenseAmountForUnit(targetUnit, null, false) + targetUnit.getPromotionDefenseBonus(),
                )
                / Units_Constants.Hp.Normalizer,
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

async function getScoreForDistanceToCapturableBuildings(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, movableArea: AuxiliaryTypes_MovableArea.MovableArea): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

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
            const gridIndex     = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
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

async function getScoreForAiWeightedDestination(unit: Units_IUnit.IUnit, movableArea: AuxiliaryTypes_MovableArea.MovableArea): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

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
    commonParams            : Bots_CommonParams.CommonParams;
    unit                    : Units_IUnit.IUnit;
    gridIndex               : AuxiliaryTypes_GridIndex.GridIndex;
    damageMap               : DamageMapData[][] | null | undefined;
    scoreDictForThreatEnemy : Map<Units_IUnit.IUnit, number>;
}): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

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
                const currentAmmo   = unit.getPrimaryWeaponCurrentAmmo();
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
                const currentAmmo   = unit.getFlareCurrentAmmo();
                totalScore          += ((maxAmmo - currentAmmo) / maxAmmo * 10 + (currentAmmo <= 0 ? 40 : 0)) * passiveScaler;
            }
        }
    }

    const aiScoreArrayForStay   = tile.getTemplateCfg().getAiScoreForStay();
    if (aiScoreArrayForStay) {
        if (tileTeamIndex === unitTeamIndex) {
            totalScore += aiScoreArrayForStay[0] ?? 0;
        } else if (tileTeamIndex !== Teams_Constants.TeamIndex.Neutral) {
            totalScore += aiScoreArrayForStay[1] ?? 0;
        }
    }

    await Timer_TimerModel.checkAndCallLater();

    const movableArea   = AuxiliaryTypes_MovableArea.MovableArea.create({
        gridIndex      : gridIndex,
        maxMoveCost    : Number.MAX_SAFE_INTEGER,
        mapSize        : commonParams.getMapSize(),
        moveCostGetter : g => commonParams.getMoveCost(unit, tileMap.getTile(g)),
    });

    totalScore += await getScoreForDistanceToCapturableBuildings(commonParams, unit, movableArea);
    totalScore += await getScoreForAiWeightedDestination(unit, movableArea);
    // totalScore += await getScoreForDistanceToOtherUnits(commonParams, unit, movableArea);

    return totalScore;
}

async function getScoreForMovePath(commonParams: Bots_CommonParams.CommonParams, movingUnit: Units_IUnit.IUnit, movePath: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

    if (!IsNeedVisibility) {
        return 0;
    }

    const discoveredUnits = Visibilities_Utils.getDiscoveredUnitsByPath({
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
async function getBestScoreAndActionForUnitAndPath(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, destination: AuxiliaryTypes_GridIndex.GridIndex, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

    const scoreAndActionForUnitBeLoaded = await Bots_Actions_UnitBeLoaded.getScoreAndActionUnitBeLoaded(commonParams, unit, destination, pathNodes);
    if (scoreAndActionForUnitBeLoaded) {
        return scoreAndActionForUnitBeLoaded;
    }

    const scoreAndActionForUnitJoin = await Bots_Actions_UnitJoin.getScoreAndActionUnitJoin(commonParams, unit, destination, pathNodes);
    if (scoreAndActionForUnitJoin) {
        return scoreAndActionForUnitJoin;
    }

    if (!await checkCanUnitWaitOnGrid(commonParams, unit, destination)) {
        return null;
    }

    return getBestScoreAndAction(await Promise.all([
        Bots_Actions_UnitAttack.getScoreAndActionUnitAttack(commonParams, unit, pathNodes),
        Bots_Actions_UnitCaptureTile.getScoreAndActionUnitCaptureTile(commonParams, unit, destination, pathNodes),
        Bots_Actions_UnitCrushUnit.getScoreAndActionUnitCrushUnit(commonParams, unit, destination, pathNodes),
        Bots_Actions_UnitDive.getScoreAndActionUnitDive(unit, pathNodes),
        Bots_Actions_UnitDropUnit.getScoreAndActionUnitDropUnit({
            commonParams, unit, gridIndex : destination, pathNodes, 
        }),
        Bots_Actions_UnitLaunchSilo.getScoreAndActionUnitLaunchSilo(commonParams, unit, destination, pathNodes),
        Bots_Actions_UnitLaunchFlare.getScoreAndActionUnitLaunchFlare(commonParams, unit, destination, pathNodes),
        Bots_Actions_UnitProduceUnit.getScoreAndActionUnitProduceUnit(commonParams, unit, pathNodes),
        Bots_Actions_UnitRepairUnit.getScoreAndActionUnitRepairUnit(commonParams, unit, destination, pathNodes),
        Bots_Actions_UnitSelfDetonate.getScoreAndActionUnitSelfDetonate(commonParams, unit, destination, pathNodes),
        Bots_Actions_UnitSurface.getScoreAndActionUnitSurface(unit, pathNodes),
        Bots_Actions_UnitWait.getScoreAndActionUnitWait(unit, pathNodes),
        Bots_Actions_UnitBoardedByCo.getScoreAndActionUnitBoardedByCo(unit, pathNodes),
        Bots_Actions_UnitUseCoSkill.getScoreAndActionUnitUseCoSkill(commonParams, unit, pathNodes),
    ]), commonParams);
}

export async function getBestScoreAndActionForCandidateUnit(commonParams: Bots_CommonParams.CommonParams, candidateUnit: Units_IUnit.IUnit): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

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

    const reachableArea             = await getReachableArea({
        commonParams, unit : candidateUnit, passableGridIndex : null, blockedGridIndex : null, 
    });
    const damageMapForSurface       = await createDamageMap(commonParams, candidateUnit, false, reachableArea);
    const damageMapForDive          = candidateUnit.checkIsDiver() ? await createDamageMap(commonParams, candidateUnit, true, reachableArea) : null;
    const originGridIndex           = candidateUnit.getGridIndex();
    const scoreDictForThreatEnemy   = new Map<Units_IUnit.IUnit, number>();
    const canLaunchUnit             = (candidateUnit.checkCanLaunchLoadedUnit()) && (candidateUnit.getLoadedUnits().some(v => ((v.getActionState() === Units_Constants.ActionStateId.Idle) && (v.checkCanAiDoAction()) && (v.getFinalMoveRange() > 0))));
    // const scoreMapForDistance       = await _createScoreMapForDistance(candidateUnit);
    const { width: mapWidth, height: mapHeight }    = commonParams.getMapSize().getWH();
    const promiseArray                              : Promise<Bots_Types.ScoreAndAction | null>[] = [];
    for (let x = 0; x < mapWidth; ++x) {
        const column = reachableArea.getColumn(x);
        if (!column) {
            continue;
        }

        for (let y = 0; y < mapHeight; ++y) {
            if (!column[y]) {
                continue;
            }

            const destination = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
            promiseArray.push((async (): Promise<Bots_Types.ScoreAndAction | null> => {
                if (destination.checkIsEqual(originGridIndex)) {
                    if (candidateUnit.getLoaderUnitId() != null) {
                        return null;
                    }
                } else {
                    const aiMode = candidateUnit.getAiMode();
                    if (aiMode === Units_Constants.AiModeId.NoMove) {
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
                    unit      : candidateUnit,
                    gridIndex : destination,
                    damageMap : ((action.getWoUnitDive()) || ((candidateUnit.getIsDiving()) && (!action.getWoUnitSurface()))) ? damageMapForDive : damageMapForSurface,
                    scoreDictForThreatEnemy,
                });
                return {
                    score : scoreAndAction.score + scoreForLaunchUnit + scoreForMovePath + scoreForPosition,
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
export function candidateUnitSorter(v1: Units_IUnit.IUnit, v2: Units_IUnit.IUnit): number {
    {
        const isLoaded1 = v1.checkIsMeetLoadedState(Units_Constants.LoadedStateId.IsLoaded);
        if (isLoaded1 != v2.checkIsMeetLoadedState(Units_Constants.LoadedStateId.IsLoaded)) {
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
    Bots_Phases_Phase01.getActionForPhase01,
    Bots_Phases_Phase08.getActionForPhase08,
    Bots_Phases_Phase09.getActionForPhase09,
    Bots_Phases_Phase11.getActionForPhase11,
    Bots_Phases_Phase12.getActionForPhase12,
];
export async function doGetNextOperation(war: BaseWar_Interface_IBwWar.IBwWar): Promise<WoContainer> {
    if (war.getPlayerIndexInTurn() === Players_Constants.PlayerIndex.Neutral) {
        throw Helpers_Misc.newError(`Invalid playerIndexInTurn.`, Utils_ClientErrorCode.ClientErrorCode.SpwRobot_DoGetNextAction_00);
    }

    const commonParams = await Bots_CommonParams.CommonParams.create(war);
    for (const func of funcArray) {
        const actionForPhase = await func(commonParams);
        if (actionForPhase) {
            return actionForPhase;
        }
    }

    throw Helpers_Misc.newError(`No available action?!`, Utils_ClientErrorCode.ClientErrorCode.SpwRobot_DoGetNextAction_01);
}
