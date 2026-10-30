import {
    Timer_TimerModel,
    Bots_Utils,
    type Bots_CommonParams,
    type AuxiliaryTypes_GridIndex,
    type Units_IUnit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitCrushUnit(
    commonParams    : Bots_CommonParams.CommonParams,
    focusUnit       : Units_IUnit.IUnit,
    destination     : AuxiliaryTypes_GridIndex.GridIndex,
    pathNodes       : AuxiliaryTypes_MovePathNode.MovePathNode[]
): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();
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
    const candidates    : Bots_Types.ScoreAndAction[] = [];
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

    return Bots_Utils.getBestScoreAndAction(candidates, commonParams);
}
