import {
    Utils_ClientErrorCode,
    Bots_Utils,
    Timer_TimerModel,
    Helpers_Misc,
    type Bots_CommonParams,
    type AuxiliaryTypes_GridIndex,
    type Units_IUnit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitLaunchFlare(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, destination: AuxiliaryTypes_GridIndex.GridIndex, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

    const war = commonParams.getWar();
    if ((!Bots_Utils.IsNeedVisibility)               ||
        (!war.getFogMap().checkHasFogCurrently())   ||
        (!unit.getFlareCurrentAmmo())               ||
        (pathNodes.length !== 1)
    ) {
        return null;
    }

    const flareMaxRange     = Helpers_Misc.getExisted(unit.getFlareMaxRange(destination), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchFlare_00);
    const promiseArray      : Promise<Bots_Types.ScoreAndAction | null>[] = [];
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

    return Bots_Utils.getBestScoreAndAction(await Promise.all(promiseArray), commonParams);
}

async function getScoreForActionUnitLaunchFlare(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, destination: AuxiliaryTypes_GridIndex.GridIndex, targetGridIndex: AuxiliaryTypes_GridIndex.GridIndex): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

    const flareRadius   = Helpers_Misc.getExisted(unit.getFlareRadius(destination), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForUnitLaunchFlare_00);
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
