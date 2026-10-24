import * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as BotsUtils from "../Utils.ts";
import * as DamageCalculatorsUtils from "../../damageCalculators/Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoStructureBattleDamageInfo from "../../proto/schema/CommonProto/Structure/BattleDamageInfo.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type IBwTile            = TilesITile.ITile;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitAttack(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

    const minRange = unit.getMinAttackRange();
    if (minRange == null) {
        return null;
    }

    const pathLength        = pathNodes.length;
    const destinationNode   = pathNodes[pathLength - 1];
    const destination       = destinationNode.getGridIndex();
    const maxRange          = unit.getFinalMaxAttackRange();
    if ((maxRange == null) || (maxRange < minRange)) {
        return null;
    }

    const visibleUnits          = commonParams.getVisibleUnits();
    const launchUnitId          = unit.getLoaderUnitId() == null ? null : unit.getUnitId();
    const war                   = commonParams.getWar();
    const unitMap               = war.getUnitMap();
    const teamIndex             = unit.getTeamIndex();
    const canAttackAfterMoving  = commonParams.getCanAttackAfterMoving(unit);
    {
        if (((!canAttackAfterMoving) && (pathLength > 1))                               ||
            ((unit.getLoaderUnitId() != null) && (pathLength <= 1))                     ||
            ((!unit.getPrimaryWeaponCurrentAmmo()) && (!unit.checkHasSecondaryWeapon()))
        ) {
            return null;
        }

        const unitOnDestination = unitMap.getUnitOnMap(destination);
        if ((pathLength > 1) && (unitOnDestination)) {
            if (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeam({
                war                 : war,
                observerTeamIndex   : teamIndex,
                gridIndex           : destination,
                unitType            : unitOnDestination.getUnitType(),
                unitPlayerIndex     : unitOnDestination.getPlayerIndex(),
                isDiving            : unitOnDestination.getIsDiving(),
                isInvisible         : unitOnDestination.checkIsInvisible(destination),
            })) {
                return null;
            }
        }
    }

    const totalMoveCost = destinationNode.getTotalMoveCost();
    const promiseArray  : Promise<GrScoreAndAction>[] = [];
    for (const targetGridIndex of destination.getGridsWithinDistance({ minDistance: minRange, maxDistance: maxRange, mapSize: commonParams.getMapSize() })) {
        const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
        if ((BotsUtils.IsNeedVisibility) && (targetUnit != null) && (!visibleUnits.has(targetUnit))) {
            continue;
        }

        let isAttackUnit: boolean | null = null;
        if ((targetUnit) && (visibleUnits.has(targetUnit))) {
            if ((targetUnit.getTeamIndex() === teamIndex)                           ||
                (unit.getBaseDamage(targetUnit.getArmorType()) == null)
            ) {
                continue;
            }
            if ((targetUnit.getIsDiving())                                                                                  &&
                (!targetUnit.getTemplateCfg().getDiveCfg()?.getCanBeAttackedByUnitTypeArray().includes(unit.getUnitType()))
            ) {
                continue;
            }
            isAttackUnit = true;

        } else {
            const targetTile    = war.getTileMap().getTile(targetGridIndex);
            const armorType     = targetTile.getArmorType();
            if ((armorType == null)                         ||
                (targetTile.getTeamIndex() === teamIndex)   ||
                (unit.getBaseDamage(armorType) == null)
            ) {
                continue;
            }

            isAttackUnit = false;
        }

        promiseArray.push((async () => {
            await TimerTimerModel.checkAndCallLater();

            const battleInfo = DamageCalculatorsUtils.getEstimatedBattleInfo({
                war                         : war,
                movePath1                   : pathNodes.map(v => v.getGridIndex()),
                launchUnitId1               : launchUnitId,
                gridIndex2                  : targetGridIndex,
                observerTeamIndexSet        : null,
                useDamagePreviewSettings    : false,
                fuelConsumption             : totalMoveCost,
                isAttackUnit                : isAttackUnit,
            });
            return {
                score   : await getScoreForActionUnitAttack({
                    commonParams,
                    focusUnit               : unit,
                    focusUnitGridIndex      : destination,
                    battleDamageInfoArray   : battleInfo.damageInfoArray,
                }),
                action  : unitMap.getUnitOnMap(targetGridIndex) != null
                    ? ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitAttackUnit: {
                        path        : {
                            nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                            fuelConsumption : totalMoveCost,
                            isBlocked       : false,
                        },
                        targetGridIndex     : targetGridIndex.toProto().toJson(),
                        launchUnitId        : launchUnitId,
                    } })
                    : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitAttackTile: {
                        path        : {
                            nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                            fuelConsumption : totalMoveCost,
                            isBlocked       : false,
                        },
                        targetGridIndex     : targetGridIndex.toProto().toJson(),
                        launchUnitId        : launchUnitId,
                    }, }),
            };
        })());
    }

    return BotsUtils.getBestScoreAndAction(await Promise.all(promiseArray), commonParams);
}

async function getScoreForActionUnitAttack({ commonParams, focusUnit, focusUnitGridIndex, battleDamageInfoArray }: {
    commonParams            : BotsCommonParams.CommonParams;
    focusUnit               : IBwUnit;
    focusUnitGridIndex      : AuxiliaryTypesGridIndex.GridIndex;
    battleDamageInfoArray   : ProtoSchemaCommonProtoStructureBattleDamageInfo.BattleDamageInfo[];
}): Promise<number> {
    await TimerTimerModel.checkAndCallLater();

    const focusTeamIndex            = focusUnit.getTeamIndex();
    const unitValueRatio            = commonParams.getUnitValueRatio();
    const war                       = commonParams.getWar();
    const unitMap                   = war.getUnitMap();
    const tileMap                   = war.getTileMap();
    const unitHpDict                = new Map<IBwUnit, number>();
    const tileHpDict                = new Map<IBwTile, number>();
    // const scalerForSelfDamage       = Math.pow(1 / Math.max(1, unitValueRatio), 1) * 9999;
    // const scalerForEnemyDamage      = Math.pow(Math.max(1, unitValueRatio), 1) * 9999;
    const scalerForSelfDamage       = Math.pow(1 / Math.max(1, unitValueRatio), 1) * 5;
    const scalerForEnemyDamage      = Math.pow(Math.max(1, unitValueRatio), 1) * 5;

    let totalScore = 0;
    for (const battleDamageInfo of battleDamageInfoArray) {
        const damage        = HelpersMisc.getExisted(battleDamageInfo.getDamage(), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_00);
        const tileGridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(battleDamageInfo.getTargetTileGridIndex());
        if (tileGridIndex != null) {
            const tile2 = tileMap.getTile(tileGridIndex);
            if (!tileHpDict.has(tile2)) {
                tileHpDict.set(tile2, tile2.getCurrentHp());
            }

            const tileHp2           = HelpersMisc.getExisted(tileHpDict.get(tile2), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_02);
            const tileTeamIndex2    = tile2.getTeamIndex();
            const actualDamage      = Math.min(tileHp2, damage);
            tileHpDict.set(tile2, tileHp2 - actualDamage);

            totalScore += actualDamage * (tileTeamIndex2 === focusTeamIndex ? -1 : 1);
            continue;
        }

        const unitId2 = battleDamageInfo.getTargetUnitId();
        if (unitId2 != null) {
            const unit2 = HelpersMisc.getExisted(unitMap.getUnitById(unitId2), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_03);
            if (!unitHpDict.has(unit2)) {
                unitHpDict.set(unit2, unit2.getCurrentHp());
            }

            const unitHp2               = HelpersMisc.getExisted(unitHpDict.get(unit2), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_04);
            const unitTeamIndex2        = unit2.getTeamIndex();
            const unitProductionCost2   = unit2.getProductionCfgCost();
            const actualDamage          = Math.min(unitHp2, damage);
            unitHpDict.set(unit2, unitHp2 - actualDamage);

            const isUnitDestroyed   = (actualDamage >= unitHp2) && (actualDamage > 0);
            const isSelfDamaged     = unitTeamIndex2 === focusTeamIndex;
            let score               = (actualDamage + (isUnitDestroyed ? 30 : 0))
                * unitProductionCost2 / 1000
                * (isSelfDamaged ? scalerForSelfDamage : scalerForEnemyDamage)
                * (unit2.getIsCoOnboard() ? 2 : 1);

            {
                const unitOriginGridIndex2  = unit2.getGridIndex();
                const gridIndex2            = (unit2 === focusUnit) ? focusUnitGridIndex : unitOriginGridIndex2;
                if (gridIndex2.checkIsEqual(unitOriginGridIndex2)) {
                    const tile2 = tileMap.getTile(gridIndex2);
                    if (tile2.getTeamIndex() !== unitTeamIndex2) {
                        const captureAmount         = unit2.getFinalCaptureAmount(gridIndex2);
                        const remainingCapturePoint = tile2.getRemainingCapturePoint();
                        if ((captureAmount != null)         &&
                            (remainingCapturePoint != null)
                        ) {
                            score *= (captureAmount >= remainingCapturePoint) ? 2 : 1.1;

                            if (tile2.getIsDefeatedOnCapture()) {
                                score *= 10000;
                            }
                            if (tile2.getRegularProducibleUnitTypeArray()?.length) {
                                score *= 5;
                            }
                        }
                    }
                }
            }

            if (isUnitDestroyed) {
                for (const loadedUnit of unitMap.getUnitsLoadedByLoader(unit2, true)) {
                    score += (loadedUnit.getCurrentHp() + 30)
                        * loadedUnit.getProductionCfgCost() / 1000
                        * (isSelfDamaged ? scalerForSelfDamage : scalerForEnemyDamage)
                        * (loadedUnit.getIsCoOnboard() ? 2 : 1);
                }
            }

            totalScore += score * (isSelfDamaged ? -1 : 1);
            continue;
        }

        throw HelpersMisc.newError(`Invalid battleDamageInfo.`, UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitAttack_09);
    }

    return totalScore;
}
