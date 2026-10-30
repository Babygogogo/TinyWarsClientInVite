import {
    Timer_TimerModel,
    Utils_ClientErrorCode,
    Helpers_Collection,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    type Bots_CommonParams,
    type Units_IUnit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitLaunchSilo(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

    const war       = commonParams.getWar();
    const tile      = war.getTileMap().getTile(gridIndex);
    if (!unit.checkCanLaunchSiloOnTile(tile)) {
        return null;
    }

    const { width: mapWidth, height: mapHeight }    = commonParams.getMapSize().getWH();
    const unitValueMap                              = Helpers_Collection.createEmptyMap<number>(mapWidth, mapHeight);
    const teamIndex                                 = unit.getTeamIndex();
    const unitMap                                   = war.getUnitMap();
    const launchSiloParams                          = tile.getTemplateCfg().getLaunchSiloParams();
    const siloDamage                                = Helpers_Misc.getExisted(launchSiloParams[3], Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchSilo_01);
        for (let x = 0; x < mapWidth; ++x) {
        for (let y = 0; y < mapHeight; ++y) {
            const targetUnit = unitMap.getUnitOnMap(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
            if ((!targetUnit) || (targetUnit === unit)) {
                unitValueMap[x][y] = 0;
            } else {
                const value         = Math.min(siloDamage, targetUnit.getCurrentHp() - 1) * targetUnit.getProductionCfgCost();
                unitValueMap[x][y]  = targetUnit.getTeamIndex() === teamIndex ? -value : value;
            }
        }
    }
    unitValueMap[gridIndex.getX()][gridIndex.getY()] = -Math.min(siloDamage, unit.getCurrentHp() - 1) * unit.getProductionCfgCost();

    let scoreAndGridIndex: { score: number, gridIndex: AuxiliaryTypes_GridIndex.GridIndex } | null = null;
    for (let x = 0; x < mapWidth; ++x) {
        for (let y = 0; y < mapHeight; ++y) {
            const newTargetGridIndex    = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
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

async function getScoreForActionUnitLaunchSilo(commonParams: Bots_CommonParams.CommonParams, unitValueMap: number[][], targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex, siloRadius: number): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

    let score = 9999;
    for (const gridIndex of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: siloRadius, mapSize: commonParams.getMapSize() })) {
        score += unitValueMap[gridIndex.getX()][gridIndex.getY()] ?? 0;
    }

    return score;
}
