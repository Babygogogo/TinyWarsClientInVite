import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsTypes from "../Types.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitBoardedByCo(unit: IBwUnit, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

    if (!unit.checkCanCoBoardAfterMovePath(pathNodes.map(v => v.getGridIndex()))) {
        return null;
    }

    return {
        score   : await getScoreForActionUnitBoardedByCo(unit),
        action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitBoardedByCo: {
            path        : {
                nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                isBlocked       : false,
            },
            launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
        } }),
    };
}

async function getScoreForActionUnitBoardedByCo(unit: IBwUnit): Promise<number> {
    await TimerTimerModel.checkAndCallLater();

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
