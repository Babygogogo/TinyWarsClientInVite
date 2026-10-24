import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitSelfDetonate(
    commonParams    : BotsCommonParams.CommonParams,
    focusUnit       : IBwUnit,
    destination     : AuxiliaryTypesGridIndex.GridIndex,
    pathNodes       : AuxiliaryTypesMovePathNode.MovePathNode[]
): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

    const selfDetonateCfg = focusUnit.getTemplateCfg().getSelfDetonateCfg();
    if (selfDetonateCfg == null) {
        return null;
    }

    const teamIndex     = focusUnit.getTeamIndex();
    const unitMap       = commonParams.getWar().getUnitMap();
    const damage        = selfDetonateCfg.getDamage();
    let totalScore      = -focusUnit.getCurrentHp() * focusUnit.getProductionCfgCost() / 4;
    for (const targetGridIndex of destination.getGridsWithinDistance({
        minDistance : 1,
        maxDistance : selfDetonateCfg.getRadius(),
        mapSize     : commonParams.getMapSize(),
    })) {
        const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
        if ((targetUnit) && (targetUnit !== focusUnit)) {
            const value = Math.min(damage, targetUnit.getCurrentHp() - 1) * targetUnit.getProductionCfgCost();
            totalScore  += targetUnit.getTeamIndex() === teamIndex ? -value : value;
        }
    }

    return {
        score   : totalScore,
        action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
            WoUnitSelfDetonate: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId    : focusUnit.getLoaderUnitId() == null ? null : focusUnit.getUnitId(),
            }
        }),
    };
}
