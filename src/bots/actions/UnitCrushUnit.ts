import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as BotsUtils from "../Utils.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitCrushUnit(
    commonParams    : BotsCommonParams.CommonParams,
    focusUnit       : IBwUnit,
    destination     : AuxiliaryTypesGridIndex.GridIndex,
    pathNodes       : AuxiliaryTypesMovePathNode.MovePathNode[]
): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();
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
            action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitCrushUnit: {
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

    return BotsUtils.getBestScoreAndAction(candidates, commonParams);
}
