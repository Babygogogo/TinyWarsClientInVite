import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as BotsUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitLaunchFlare(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, destination: AuxiliaryTypesGridIndex.GridIndex, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

    const war = commonParams.getWar();
    if ((!BotsUtils.IsNeedVisibility)               ||
        (!war.getFogMap().checkHasFogCurrently())   ||
        (!unit.getFlareCurrentAmmo())               ||
        (pathNodes.length !== 1)
    ) {
        return null;
    }

    const flareMaxRange     = HelpersMisc.getExisted(unit.getFlareMaxRange(destination), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreAndActionUnitLaunchFlare_00);
    const promiseArray      : Promise<GrScoreAndAction | null>[] = [];
    for (const targetGridIndex of destination.getGridsWithinDistance({ minDistance: 0, maxDistance: flareMaxRange, mapSize: commonParams.getMapSize() })) {
        promiseArray.push((async () => {
            return {
                score   : await getScoreForActionUnitLaunchFlare(commonParams, unit, destination, targetGridIndex),
                action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitLaunchFlare: {
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

    return BotsUtils.getBestScoreAndAction(await Promise.all(promiseArray), commonParams);
}

async function getScoreForActionUnitLaunchFlare(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, destination: AuxiliaryTypesGridIndex.GridIndex, targetGridIndex: AuxiliaryTypesGridIndex.GridIndex): Promise<number> {
    await TimerTimerModel.checkAndCallLater();

    const flareRadius   = HelpersMisc.getExisted(unit.getFlareRadius(destination), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForUnitLaunchFlare_00);
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
