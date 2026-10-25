import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import { getBestScoreAndAction } from "../Utils.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import type { IUnit } from "../../units/IUnit.ts";

type IBwUnit            = IUnit;
type GrScoreAndAction   = ScoreAndAction;

export async function getScoreAndActionUnitCrushUnit(
    commonParams    : CommonParams,
    focusUnit       : IBwUnit,
    destination     : GridIndex,
    pathNodes       : MovePathNode[]
): Promise<GrScoreAndAction | null> {
    await checkAndCallLater();
    if ((pathNodes.length !== 1)                                        ||
        (!focusUnit.getTemplateCfg().getCanCrushAdjacentTargetUnit())
    ) {
        return null;
    }

    const war           = commonParams.getWar();
    const tileMap       = war.getTileMap();
    const unitMap       = war.getUnitMap();
    const moveType      = focusUnit.getMoveTypeId();
    const teamIndex     = focusUnit.getTeamIndex();
    const candidates    : GrScoreAndAction[] = [];
    for (const targetGridIndex of destination.getAdjacentGrids(commonParams.getMapSize())) {
        const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
        if ((tileMap.getTile(targetGridIndex).getMoveCostByMoveType(moveType) == null)  ||
            (targetUnit == null)                                                        ||
            (targetUnit.getTeamIndex() == teamIndex)
        ) {
            continue;
        }

        candidates.push({
            score   : targetUnit.getCurrentHp() * targetUnit.getProductionCfgCost(),
            action  : WoContainer.fromJson({ WoUnitCrushUnit: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                targetGridIndex : targetGridIndex.toProto().toJson(),
                launchUnitId    : focusUnit.getLoaderUnitId() == null ? null : focusUnit.getUnitId(),
            } }),
        });
    }

    return getBestScoreAndAction(candidates, commonParams);
}
