import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import type { IUnit } from "../../units/IUnit.ts";

type IBwUnit            = IUnit;
type GrScoreAndAction   = ScoreAndAction;

export async function getScoreAndActionUnitSelfDetonate(
    commonParams    : CommonParams,
    focusUnit       : IBwUnit,
    destination     : GridIndex,
    pathNodes       : MovePathNode[]
): Promise<GrScoreAndAction | null> {
    await checkAndCallLater();

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
        action  : WoContainer.fromJson({
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
