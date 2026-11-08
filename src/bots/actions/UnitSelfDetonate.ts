import {
    Timer_TimerModel,
    type Bots_CommonParams,
    type AuxiliaryTypes_GridIndex,
    type Units_Unit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitSelfDetonate(
    commonParams    : Bots_CommonParams.CommonParams,
    focusUnit       : Units_Unit.Unit,
    destination     : AuxiliaryTypes_GridIndex.GridIndex,
    pathNodes       : AuxiliaryTypes_MovePathNode.MovePathNode[],
): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

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
        score  : totalScore,
        action : WoContainer.fromJson({
            WoUnitSelfDetonate : {
                path : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId : focusUnit.getLoaderUnitId() == null ? null : focusUnit.getUnitId(),
            },
        }),
    };
}
