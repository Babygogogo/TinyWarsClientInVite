import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import {
    IsNeedVisibility,
    getBestScoreAndAction,
} from "../Utils.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export async function getScoreAndActionUnitLaunchFlare(commonParams: CommonParams, unit: IUnit, destination: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
    await checkAndCallLater();

    const war = commonParams.getWar();
    if ((!IsNeedVisibility)               ||
        (!war.getFogMap().checkHasFogCurrently())   ||
        (!unit.getFlareCurrentAmmo())               ||
        (pathNodes.length !== 1)
    ) {
        return null;
    }

    const flareMaxRange     = getExisted(unit.getFlareMaxRange(destination), ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchFlare_00);
    const promiseArray      : Promise<ScoreAndAction | null>[] = [];
    for (const targetGridIndex of destination.getGridsWithinDistance({ minDistance: 0, maxDistance: flareMaxRange, mapSize: commonParams.getMapSize() })) {
        promiseArray.push((async () => {
            return {
                score   : await getScoreForActionUnitLaunchFlare(commonParams, unit, destination, targetGridIndex),
                action  : WoContainer.fromJson({ WoUnitLaunchFlare: {
                    path        : {
                        nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                        fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                        isBlocked       : false,
                    },
                    launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
                    targetGridIndex : targetGridIndex.toProto().toJson(),
                } }),
            };
        })());
    }

    return getBestScoreAndAction(await Promise.all(promiseArray), commonParams);
}

async function getScoreForActionUnitLaunchFlare(commonParams: CommonParams, unit: IUnit, destination: GridIndex, targetGridIndex: GridIndex): Promise<number> {
    await checkAndCallLater();

    const flareRadius   = getExisted(unit.getFlareRadius(destination), ClientErrorCode.SpwRobot_GetScoreForUnitLaunchFlare_00);
    const visibleUnits  = commonParams.getVisibleUnits();
    const war           = commonParams.getWar();
    const unitMap       = war.getUnitMap();
    let score           = 0;
    for (const gridIndex of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: flareRadius, mapSize: commonParams.getMapSize() })) {
        const u = unitMap.getUnitOnMap(gridIndex);
        if ((u)                                 &&
            (!u.getIsDiving())                  &&
            (!visibleUnits.has(u))              &&
            (!u.checkIsInvisible(gridIndex))
        ) {
            score += 3 + u.getCurrentHp() / u.getMaxHp() * u.getProductionCfgCost() / 1000 * (u.getIsCoOnboard() ? 2 : 1) * 2;
        }
    }

    return score;
}
