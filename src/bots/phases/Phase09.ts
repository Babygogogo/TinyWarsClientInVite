import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovableArea from "../../auxiliaryTypes/MovableArea.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as BotsUtils from "../Utils.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as NumbersConstants from "../../numbers/Constants.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfTileEnabledForUnitProduction from "../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfTileEnabledForUnitProduction.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TileBuffsConstants from "../../tileBuffs/Constants.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UnitsUtilsCommon from "../../units/utils/Common.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

interface ProduceUnitInfo {
    gridIndex           : AuxiliaryTypesGridIndex.GridIndex;
    unitTypeArray       : number[];
    effectiveCoSkill    : Undefinable<ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfTileEnabledForUnitProduction.SelfTileEnabledForUnitProduction>;
}

export async function getActionForPhase09(commonParams: BotsCommonParams.CommonParams): Promise<ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer | null> {
    await TimerTimerModel.checkAndCallLater();

    return await getBestActionPlayerProduceUnit(commonParams);
}

async function getBestActionPlayerProduceUnit(commonParams: BotsCommonParams.CommonParams): Promise<ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer | null> {
    await TimerTimerModel.checkAndCallLater();

    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    if (playerIndexInTurn === PlayersConstants.PlayerIndex.Neutral) {
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
            (tile.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === TileBuffsConstants.BuffTypeId.NoProduction))
        ) {
            continue;
        }

        const effectiveSkill  = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndexInTurn);
        const unitTypeList    = (effectiveSkill ? gameConfig.getUnitCategoryCfg(effectiveSkill.getUnitCategoryId() ?? UnitsConstants.CategoryId.All)?.getUnitTypeIds() : tile.getRegularProducibleUnitTypeArray())
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
    const movableAreaDict               = new Map<IBwUnit, AuxiliaryTypesMovableArea.MovableArea>();
    const rawGetMinTurnsCountForAttack  = async (attackerUnit: IBwUnit, targetGridIndex: AuxiliaryTypesGridIndex.GridIndex) => {
        if (!maxAttackRangeDict.has(attackerUnit)) {
            maxAttackRangeDict.set(attackerUnit, attackerUnit.getCfgMaxAttackRange());
        }

        const maxAttackRange = maxAttackRangeDict.get(attackerUnit);
        if (maxAttackRange == null) {
            return null;
        }

        if (!movableAreaDict.has(attackerUnit)) {
            await TimerTimerModel.checkAndCallLater();
            movableAreaDict.set(attackerUnit, AuxiliaryTypesMovableArea.MovableArea.create({
                maxMoveCost     : Number.MAX_SAFE_INTEGER,
                gridIndex       : attackerUnit.getGridIndex(),
                mapSize         : mapSize,
                moveCostGetter  : g => {
                    return commonParams.getMoveCost(attackerUnit, tileMap.getTile(g));
                },
            }));
        }

        const movableArea   = HelpersMisc.getExisted(movableAreaDict.get(attackerUnit), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_00).getArea();
        const minDistance   = HelpersCollection.getNonNullElements(targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: maxAttackRange, mapSize }).map(g => {
            const column = movableArea[g.getX()];
            return (column ? column[g.getY()] : null)?.totalMoveCost;
        })).sort((d1, d2) => d1 - d2)[0];
        if (minDistance == null) {
            return null;
        } else {
            if (!moveRangeDict.has(attackerUnit)) {
                moveRangeDict.set(attackerUnit, attackerUnit.getFinalMoveRange());
            }

            const moveRange = HelpersMisc.getExisted(moveRangeDict.get(attackerUnit), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_01);
            return (moveRange <= 0)
                ? (minDistance <= 0 ? 1 : null)
                : Math.max(
                    1,
                    Math.ceil(minDistance / moveRange) + (commonParams.getCanAttackAfterMoving(attackerUnit) ? 0 : 1)
                );
        }
    };
    const minTurnsCountDict         = new Map<IBwUnit, Map<number, number | null>>();
    const getMinTurnsCountForAttack = async (attackerUnit: IBwUnit, targetGridIndex: AuxiliaryTypesGridIndex.GridIndex) => {
        const gridId = targetGridIndex.getGridId(mapSize);
        if (!minTurnsCountDict.has(attackerUnit)) {
            minTurnsCountDict.set(attackerUnit, new Map([[gridId, await rawGetMinTurnsCountForAttack(attackerUnit, targetGridIndex)]]));
        } else {
            const dict = HelpersMisc.getExisted(minTurnsCountDict.get(attackerUnit), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetBestActionPlayerProduceUnit_02);
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

    return BotsUtils.getBestScoreAndAction(await Promise.all(promiseArray), commonParams)?.action ?? null;
}

async function getBestScoreAndActionPlayerProduceUnitWithGridIndex({ commonParams, produceUnitInfo, getMinTurnsCountForAttack }: {
    commonParams                : BotsCommonParams.CommonParams;
    produceUnitInfo             : ProduceUnitInfo;
    getMinTurnsCountForAttack   : (attackerUnit: IBwUnit, targetGridIndex: AuxiliaryTypesGridIndex.GridIndex) => Promise<number | null>;
}): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

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
            action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoPlayerProduceUnit: {
                unitType    : bestScoreAndUnitType.unitType,
                unitHp      : effectiveCoSkill?.getHpUpperLimit() ?? UnitsConstants.Hp.MaxHp,
                gridIndex   : gridIndex.toProto().toJson(),
            } }),
        };
    }
}

async function getScoreForActionPlayerProduceUnit({ commonParams, producingGridIndex, producingUnitType, effectiveCoSkill, getMinTurnsCountForAttack }: {
    commonParams                : BotsCommonParams.CommonParams;
    producingGridIndex          : AuxiliaryTypesGridIndex.GridIndex;
    producingUnitType           : number;
    effectiveCoSkill            : Undefinable<ProtoSchemaCommonProtoConfigCoSkillCfgPersistentSelfTileEnabledForUnitProduction.SelfTileEnabledForUnitProduction>;
    getMinTurnsCountForAttack   : (attackerUnit: IBwUnit, targetGridIndex: AuxiliaryTypesGridIndex.GridIndex) => Promise<number | null>;
}): Promise<number | null> {
    await TimerTimerModel.checkAndCallLater();

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
    let score               = NumbersUtils.getValueInRange({
        minValue    : NumbersConstants.MinValue,
        maxValue    : NumbersConstants.MaxValue,
        rawValue    : (
            ((war.getFogMap().checkHasFogCurrently() ? aiProductionScoreCfg.getBaseFog() : aiProductionScoreCfg.getBaseStd()) ?? 0)       +
            war.getWarEventManager().getOpaAiUnitProductionBonusScore(playerIndexInTurn, producingUnitType, producingGridIndex)
        ) || 0,
    });
    if (score <= -999999) {
        return null;
    }

    const player            = war.getPlayerManager().getPlayer(playerIndexInTurn);
    const producingUnitHp   = effectiveCoSkill?.getHpUpperLimit() ?? UnitsConstants.Hp.MaxHp;
    const producingUnit     = new (GameHelpersGhFactory.getUnitClass())();
    producingUnit.init(UnitsUtilsSerialization.create({
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
        UnitsUtilsCommon.getNormalizedHp(producingUnitHp)                                                 /
        UnitsUtilsCommon.getNormalizedHp(UnitsConstants.Hp.MaxHp)
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
    const getProducingUnitMovableArea   = HelpersMisc.createLazyFunc(() => {
        return AuxiliaryTypesMovableArea.MovableArea.create({
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
                const minDistance = HelpersCollection.getNonNullElements(unitGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: producingUnitMaxAttackRange, mapSize }).map(g => {
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
                    const damage    = Math.min(baseDamage * UnitsUtilsCommon.getNormalizedHp(unitCurrentHp) / unit.getNormalizedMaxHp(), producingUnitCurrentHp);
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
