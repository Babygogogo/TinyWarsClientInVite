import { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import { createEmptyMap } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

type IBwUnit            = IUnit;
type GrScoreAndAction   = ScoreAndAction;

export async function getScoreAndActionUnitLaunchSilo(commonParams: CommonParams, unit: IBwUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<GrScoreAndAction | null> {
    await checkAndCallLater();

    const war       = commonParams.getWar();
    const tile      = war.getTileMap().getTile(gridIndex);
    if (!unit.checkCanLaunchSiloOnTile(tile)) {
        return null;
    }

    const { width: mapWidth, height: mapHeight }    = commonParams.getMapSize().getWH();
    const unitValueMap                              = createEmptyMap<number>(mapWidth, mapHeight);
    const teamIndex                                 = unit.getTeamIndex();
    const unitMap                                   = war.getUnitMap();
    const launchSiloParams                          = tile.getTemplateCfg().getLaunchSiloParams();
    const siloDamage                                = getExisted(launchSiloParams[3], ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_01);
        for (let x = 0; x < mapWidth; ++x) {
        for (let y = 0; y < mapHeight; ++y) {
            const targetUnit = unitMap.getUnitOnMap(new GridIndex(x, y));
            if ((!targetUnit) || (targetUnit === unit)) {
                unitValueMap[x][y] = 0;
            } else {
                const value         = Math.min(siloDamage, targetUnit.getCurrentHp() - 1) * targetUnit.getProductionCfgCost();
                unitValueMap[x][y]  = targetUnit.getTeamIndex() === teamIndex ? -value : value;
            }
        }
    }
    unitValueMap[gridIndex.getX()][gridIndex.getY()] = -Math.min(siloDamage, unit.getCurrentHp() - 1) * unit.getProductionCfgCost();

    let scoreAndGridIndex: { score: number, gridIndex: GridIndex } | null = null;
    for (let x = 0; x < mapWidth; ++x) {
        for (let y = 0; y < mapHeight; ++y) {
            const newTargetGridIndex    = new GridIndex(x, y);
            const newMaxScore           = await getScoreForActionUnitLaunchSilo(commonParams, unitValueMap, newTargetGridIndex, launchSiloParams[2]);
            if (scoreAndGridIndex == null) {
                scoreAndGridIndex = {
                    score       : newMaxScore,
                    gridIndex   : newTargetGridIndex,
                };
            } else if (newMaxScore > scoreAndGridIndex.score) {
                scoreAndGridIndex.score     = newMaxScore;
                scoreAndGridIndex.gridIndex = newTargetGridIndex;
            }
        }
    }

    return scoreAndGridIndex
        ? {
            score   : scoreAndGridIndex.score,
            action  : WoContainer.fromJson({
                WoUnitLaunchSilo: {
                    path        : {
                        nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                        fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                    targetGridIndex : scoreAndGridIndex.gridIndex.toProto().toJson(),
                }
            }),
        }
        : null;
}

async function getScoreForActionUnitLaunchSilo(commonParams: CommonParams, unitValueMap: number[][], targetGridIndex: GridIndex, siloRadius: number): Promise<number> {
    await checkAndCallLater();

    let score = 9999;
    for (const gridIndex of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: siloRadius, mapSize: commonParams.getMapSize() })) {
        score += unitValueMap[gridIndex.getX()][gridIndex.getY()] ?? 0;
    }

    return score;
}
