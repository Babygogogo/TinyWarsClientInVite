import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import { ActionStateId } from "../../units/Constants.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export async function getScoreAndActionUnitJoin(commonParams: CommonParams, unit: IUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
    await checkAndCallLater();

    const unitGridIndex = unit.getGridIndex();
    if (gridIndex.checkIsEqual(unitGridIndex)) {
        return null;
    }

    const existingUnit = commonParams.getWar().getUnitMap().getUnitOnMap(gridIndex);
    if ((!existingUnit) || (!unit.checkCanJoinUnit(existingUnit))) {
        return null;
    }

    const score = await getScoreForActionUnitJoin(commonParams, unit, gridIndex);
    return {
        score,
        action  : WoContainer.fromJson({ WoUnitJoinUnit: {
            path        : {
                nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                isBlocked       : false,
            },
            launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
        } }),
    };
}

async function getScoreForActionUnitJoin(commonParams: CommonParams, unit: IUnit, gridIndex: GridIndex): Promise<number> {
    await checkAndCallLater();

    const war           = commonParams.getWar();
    const targetUnit    = getExisted(war.getUnitMap().getUnitOnMap(gridIndex), ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_00);
    if (targetUnit.getActionState() === ActionStateId.Idle) {
        return -9999;
    }

    const normalizedMaxHp       = unit.getNormalizedMaxHp();
    const rawNormalizedNewHp    = unit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp();
    const tile                  = war.getTileMap().getTile(gridIndex);
    const captureAmount         = targetUnit.getFinalCaptureAmount(gridIndex);
    const remainingCapturePoint = tile.getRemainingCapturePoint();

    if ((remainingCapturePoint == null)         ||
        (captureAmount == null)                 ||
        (captureAmount >= remainingCapturePoint)
    ) {
        return rawNormalizedNewHp > normalizedMaxHp
            ? ((rawNormalizedNewHp - normalizedMaxHp) * (-20))
            : 0;
    }

    return (Math.min(normalizedMaxHp, rawNormalizedNewHp) >= remainingCapturePoint)
        ? (tile.getTemplateCfg().getAiScoreForCapture())
        : 0;
}
