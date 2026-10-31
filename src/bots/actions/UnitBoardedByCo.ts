import {
    Timer_TimerModel,
    type Units_Unit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitBoardedByCo(unit: Units_Unit.Unit, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

    if (!unit.checkCanCoBoardAfterMovePath(pathNodes.map(v => v.getGridIndex()))) {
        return null;
    }

    return {
        score  : await getScoreForActionUnitBoardedByCo(unit),
        action : WoContainer.fromJson({
            WoUnitBoardedByCo : {
                path : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            }, 
        }),
    };
}

async function getScoreForActionUnitBoardedByCo(unit: Units_Unit.Unit): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

    let totalScore      = unit.getCurrentHp() * 100;
    const scoreArray    = unit.getGcData().getCoBasicCfg(unit.getPlayer().getCoId())?.getAiBoardUnitTypeAndScore();
    if (scoreArray == null) {
        totalScore += -20000;
    } else {
        const unitType  = unit.getUnitType();
        let hasFound    = false;
        for (let i = 0; i < scoreArray.length; i += 2) {
            if (scoreArray[i] === unitType) {
                hasFound    = true;
                totalScore  += scoreArray[i + 1] ?? -20000;
                break;
            }
        }

        if (!hasFound) {
            totalScore += -20000;
        }
    }

    return totalScore;
}
