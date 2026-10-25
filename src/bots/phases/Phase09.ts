import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import { MovableArea } from "../../auxiliaryTypes/MovableArea.ts";
import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import { getBestScoreAndAction } from "../Utils.ts";
import { getUnitClass } from "../../gameHelpers/GhFactory.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted, createLazyFunc } from "../../helpers/Misc.ts";
import { MinValue, MaxValue } from "../../numbers/Constants.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type {
    SelfTileEnabledForUnitProduction,
} from "../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { BuffTypeId } from "../../tileBuffs/Constants.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import { CategoryId, Hp } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { getNormalizedHp } from "../../units/utils/Common.ts";
import { create } from "../../units/utils/Serialization.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

type IBwUnit            = IUnit;
type GrScoreAndAction   = ScoreAndAction;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

interface ProduceUnitInfo {
    gridIndex           : GridIndex;
    unitTypeArray       : number[];
    effectiveCoSkill    : Undefinable<SelfTileEnabledForUnitProduction>;
}

export async function getActionForPhase09(commonParams: CommonParams): Promise<WoContainer | null> {
    await checkAndCallLater();

    return await getBestActionPlayerProduceUnit(commonParams);
}

async function getBestActionPlayerProduceUnit(commonParams: CommonParams): Promise<WoContainer | null> {
    await checkAndCallLater();

    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    if (playerIndexInTurn === PlayerIndex.Neutral) {
        return null;
    }

    const war       = commonParams.getWar();
    const unitMap   = war.getUnitMap();
    {
        const maxUnitsCount = war.getCommonSettingManager()
            .getInstanceWarRule()
            .getWarRuleCommonData()
            ?.getPlayerRuleList()
            .find(v => v.getPlayerIndex() === playerIndexInTurn)
            ?.getMaxUnitsCount();
        if ((maxUnitsCount != null) && (unitMap.countAllUnitsForPlayer(playerIndexInTurn) >= maxUnitsCount)) {
            return null;
        }
    }

    const produceUnitInfoArray  : ProduceUnitInfo[] = [];
    const producibleUnitDict    = new Map<number, boolean>();
    const gameConfig            = war.getGcData();
    const tileMap               = war.getTileMap();
    for (const tile of war.getTileMap().getAllTiles()) {
        const gridIndex = tile.getGridIndex();
        if ((unitMap.getUnitOnMap(gridIndex))                                                                                   ||
            (tile.getPlayerIndex() !== playerIndexInTurn)                                                                       ||
            (tile.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === BuffTypeId.NoProduction))
        ) {
            continue;
        }

        const effectiveSkill  = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndexInTurn);
        const unitTypeList    = (effectiveSkill ? gameConfig.getUnitCategoryCfg(effectiveSkill.getUnitCategoryId() ?? CategoryId.All)?.getUnitTypeIds() : tile.getRegularProducibleUnitTypeArray())
            ?.filter(unitType => {
                if (!producibleUnitDict.has(unitType)) {
                    producibleUnitDict.set(unitType, war.checkCanProduceUnitByOpaAndRule(playerIndexInTurn, unitType));
                }
                return producibleUnitDict.get(unitType);
            });
        if (unitTypeList?.length) {
            produceUnitInfoArray.push({
                gridIndex           : gridIndex,
                unitTypeArray       : unitTypeList,
                effectiveCoSkill    : effectiveSkill,
            });
        }
    }

    const mapSize                       = commonParams.getMapSize();
    const maxAttackRangeDict            = new Map<IBwUnit, number | null>();
    const moveRangeDict                 = new Map<IBwUnit, number>();
    const movableAreaDict               = new Map<IBwUnit, MovableArea>();
    const rawGetMinTurnsCountForAttack  = async (attackerUnit: IBwUnit, targetGridIndex: GridIndex) => {
        if (!maxAttackRangeDict.has(attackerUnit)) {
            maxAttackRangeDict.set(attackerUnit, attackerUnit.getCfgMaxAttackRange());
        }

        const maxAttackRange = maxAttackRangeDict.get(attackerUnit);
        if (maxAttackRange == null) {
            return null;
        }

        if (!movableAreaDict.has(attackerUnit)) {
            await checkAndCallLater();
            movableAreaDict.set(attackerUnit, MovableArea.create({
                maxMoveCost     : Number.MAX_SAFE_INTEGER,
                gridIndex       : attackerUnit.getGridIndex(),
                mapSize         : mapSize,
                moveCostGetter  : g => {
                    return commonParams.getMoveCost(attackerUnit, tileMap.getTile(g));
                },
            }));
        }

        const movableArea   = getExisted(movableAreaDict.get(attackerUnit), ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_00).getArea();
        const minDistance   = getNonNullElements(targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: maxAttackRange, mapSize }).map(g => {
            const column = movableArea[g.getX()];
            return (column ? column[g.getY()] : null)?.totalMoveCost;
        })).sort((d1, d2) => d1 - d2)[0];
        if (minDistance == null) {
            return null;
        } else {
            if (!moveRangeDict.has(attackerUnit)) {
                moveRangeDict.set(attackerUnit, attackerUnit.getFinalMoveRange());
            }

            const moveRange = getExisted(moveRangeDict.get(attackerUnit), ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_01);
            return (moveRange <= 0)
                ? (minDistance <= 0 ? 1 : null)
                : Math.max(
                    1,
                    Math.ceil(minDistance / moveRange) + (commonParams.getCanAttackAfterMoving(attackerUnit) ? 0 : 1)
                );
        }
    };
    const minTurnsCountDict         = new Map<IBwUnit, Map<number, number | null>>();
    const getMinTurnsCountForAttack = async (attackerUnit: IBwUnit, targetGridIndex: GridIndex) => {
        const gridId = targetGridIndex.getGridId(mapSize);
        if (!minTurnsCountDict.has(attackerUnit)) {
            minTurnsCountDict.set(attackerUnit, new Map([[gridId, await rawGetMinTurnsCountForAttack(attackerUnit, targetGridIndex)]]));
        } else {
            const dict = getExisted(minTurnsCountDict.get(attackerUnit), ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_02);
            if (!dict.has(gridId)) {
                dict.set(gridId, await rawGetMinTurnsCountForAttack(attackerUnit, targetGridIndex));
            }
        }

        return minTurnsCountDict.get(attackerUnit)?.get(gridId) ?? null;
    };

    const promiseArray: Promise<GrScoreAndAction | null>[] = [];
    for (const produceUnitInfo of produceUnitInfoArray) {
        promiseArray.push(getBestScoreAndActionPlayerProduceUnitWithGridIndex({
            commonParams                : commonParams,
            produceUnitInfo             : produceUnitInfo,
            getMinTurnsCountForAttack   : getMinTurnsCountForAttack,
        }));
    }

    return getBestScoreAndAction(await Promise.all(promiseArray), commonParams)?.action ?? null;
}

async function getBestScoreAndActionPlayerProduceUnitWithGridIndex({ commonParams, produceUnitInfo, getMinTurnsCountForAttack }: {
    commonParams                : CommonParams;
    produceUnitInfo             : ProduceUnitInfo;
    getMinTurnsCountForAttack   : (attackerUnit: IBwUnit, targetGridIndex: GridIndex) => Promise<number | null>;
}): Promise<GrScoreAndAction | null> {
    await checkAndCallLater();

    const gridIndex             = produceUnitInfo.gridIndex;
    const effectiveCoSkill      = produceUnitInfo.effectiveCoSkill;
    let bestScoreAndUnitType    : { score: number, unitType: number } | null = null;
    for (const unitType of produceUnitInfo.unitTypeArray) {
        const score = await getScoreForActionPlayerProduceUnit({
            commonParams                : commonParams,
            producingGridIndex          : gridIndex,
            producingUnitType           : unitType,
            effectiveCoSkill            : effectiveCoSkill,
            getMinTurnsCountForAttack   : getMinTurnsCountForAttack,
        });
        if (score == null) {
            continue;
        }

        if (bestScoreAndUnitType == null) {
            bestScoreAndUnitType = {
                score,
                unitType,
            };
        } else if (score > bestScoreAndUnitType.score) {
            bestScoreAndUnitType.score       = score;
            bestScoreAndUnitType.unitType    = unitType;
        }
    }

    if (bestScoreAndUnitType == null) {
        return null;
    } else {
        return {
            score   : bestScoreAndUnitType.score,
            action  : WoContainer.fromJson({ WoPlayerProduceUnit: {
                unitType    : bestScoreAndUnitType.unitType,
                unitHp      : effectiveCoSkill?.getHpUpperLimit() ?? Hp.MaxHp,
                gridIndex   : gridIndex.toProto().toJson(),
            } }),
        };
    }
}

async function getScoreForActionPlayerProduceUnit({ commonParams, producingGridIndex, producingUnitType, effectiveCoSkill, getMinTurnsCountForAttack }: {
    commonParams                : CommonParams;
    producingGridIndex          : GridIndex;
    producingUnitType           : number;
    effectiveCoSkill            : Undefinable<SelfTileEnabledForUnitProduction>;
    getMinTurnsCountForAttack   : (attackerUnit: IBwUnit, targetGridIndex: GridIndex) => Promise<number | null>;
}): Promise<number | null> {
    await checkAndCallLater();

    const war           = commonParams.getWar();
    const gameConfig    = war.getGcData();
    const unitTemplateCfg   = gameConfig.getUnitTemplateCfg(producingUnitType);
    if (unitTemplateCfg == null) {
        return null;
    }

    const aiProductionScoreCfg = unitTemplateCfg.getAiProductionScore();
    if (aiProductionScoreCfg == null) {
        return null;
    }

    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    let score               = getValueInRange({
        minValue    : MinValue,
        maxValue    : MaxValue,
        rawValue    : (
            ((war.getFogMap().checkHasFogCurrently() ? aiProductionScoreCfg.getBaseFog() : aiProductionScoreCfg.getBaseStd()) ?? 0)       +
            war.getWarEventManager().getOpaAiUnitProductionBonusScore(playerIndexInTurn, producingUnitType, producingGridIndex)
        ) || 0,
    });
    if (score <= -999999) {
        return null;
    }

    const player            = war.getPlayerManager().getPlayer(playerIndexInTurn);
    const producingUnitHp   = effectiveCoSkill?.getHpUpperLimit() ?? Hp.MaxHp;
    const producingUnit     = new (getUnitClass())();
    producingUnit.init(create({
        unitType                        : producingUnitType,
        unitId                          : 0,
        playerIndex                     : playerIndexInTurn,
        gridIndex                       : producingGridIndex.toProto().toJson(),

        actionState                     : null,
        currentHp                       : producingUnitHp,
        aiMode                          : null,
        groupedTagId                    : null,
        customNameId                    : null,

        currentPromotion                : null,
        isDiving                        : unitTemplateCfg.getDiveCfg()?.getIsDivedByDefault() ?? null,
        isCoOnboard                     : null,
        currentBuildMaterial            : unitTemplateCfg.getMaxBuildMaterial() ?? null,

        aiWeightedDestination           : null,
        forbiddenGroupedLocationIdArray : [],
        buffArray                       : [],

        primaryWeaponCurrentAmmo        : unitTemplateCfg.getPrimaryWeaponMaxAmmo() ?? null,
        flareCurrentAmmo                : unitTemplateCfg.getFlareMaxAmmo() ?? null,
        currentProduceMaterial          : unitTemplateCfg.getMaxProduceMaterial() ?? null,
        currentFuel                     : unitTemplateCfg.getMaxFuel(),
        loaderUnitId                    : null,
    }), gameConfig);
    producingUnit.startRunning(war);

    const productionCost = producingUnit.getProductionFinalCost(
        (effectiveCoSkill == null ? 1 : ((effectiveCoSkill.getCostMultiplierPct() ?? 0) / 100)) *
        getNormalizedHp(producingUnitHp)                                                 /
        getNormalizedHp(Hp.MaxHp)
    );
    if (player.getFund() < productionCost) {
        return null;
    }

    const tileMap                       = war.getTileMap();
    const producingTeamIndex            = producingUnit.getTeamIndex();
    const producingUnitCurrentHp        = producingUnit.getCurrentHp();
    const producingUnitMaxAttackRange   = producingUnit.getCfgMaxAttackRange();
    const producingUnitMoveRange        = producingUnit.getFinalMoveRange();
    const mapSize                       = commonParams.getMapSize();
    const unitValueRatio                = commonParams.getUnitValueRatio();
    const getProducingUnitMovableArea   = createLazyFunc(() => {
        return MovableArea.create({
            gridIndex       : producingGridIndex,
            maxMoveCost     : Number.MAX_SAFE_INTEGER,
            mapSize         : mapSize,
            moveCostGetter  : g => {
                return commonParams.getMoveCost(producingUnit, tileMap.getTile(g));
            },
        });
    });
    let canAttack       = false;
    let hasEnemyUnit    = false;
    let existingTotalHp = 0;
    for (const unit of war.getUnitMap().getAllUnits()) {
        const unitCurrentHp = unit.getCurrentHp();
        if (unit.getTeamIndex() !== producingTeamIndex) {
            hasEnemyUnit = true;
        } else {
            if (unit.getUnitType() === producingUnitType) {
                score += -unitCurrentHp * productionCost / 1000;

                if (unit.getPlayerIndex() == playerIndexInTurn) {
                    existingTotalHp += unitCurrentHp;
                }
            }

            continue;
        }

        const unitGridIndex = unit.getGridIndex();
        if (producingUnitMaxAttackRange) {
            const baseDamage = producingUnit.getBaseDamage(unit.getArmorType());
            if (baseDamage != null) {
                const movableArea = getProducingUnitMovableArea().getArea();
                const minDistance = getNonNullElements(unitGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: producingUnitMaxAttackRange, mapSize }).map(g => {
                    const column = movableArea[g.getX()];
                    return (column ? column[g.getY()] : null)?.totalMoveCost;
                })).sort((d1, d2) => d1 - d2)[0];
                const turnsCount = minDistance == null
                    ? null
                    : (producingUnitMoveRange <= 0
                        ? (minDistance <= 0 ? 1 : null)
                        : Math.max(
                            1,
                            Math.ceil(minDistance / producingUnitMoveRange) + (producingUnit.getCfgCanAttackAfterMoving() ? 0 : 1)
                        )
                    );

                if (turnsCount != null) {
                    const damage    = Math.min(baseDamage, unitCurrentHp);
                    score           += damage * unit.getProductionCfgCost() / 1000 * Math.max(1, unitValueRatio) / turnsCount;
                }

                canAttack = true;
            }
        }

        if (unit.getCfgMaxAttackRange()) {
            const baseDamage = unit.getBaseDamage(producingUnit.getArmorType());
            if (baseDamage != null) {
                const turnsCount = await getMinTurnsCountForAttack(unit, producingGridIndex);
                if (turnsCount != null) {
                    const damage    = Math.min(baseDamage * getNormalizedHp(unitCurrentHp) / unit.getNormalizedMaxHp(), producingUnitCurrentHp);
                    score           += -damage * productionCost / 1000 / Math.max(1, unitValueRatio) / turnsCount;
                }
            }
        }
    }

    if ((!canAttack) && (hasEnemyUnit)) {
        return null;
    }

    {
        const cfg = aiProductionScoreCfg.getBonusForTooFewHp() ?? [];
        if ((cfg.length === 2) && (existingTotalHp < cfg[1])) {
            score += cfg[0];
        }
    }

    return score;
}
