import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { CommonParams } from "../CommonParams.ts";
import type { ScoreAndAction } from "../Types.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import type { IUnit } from "../../units/IUnit.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export async function getScoreAndActionUnitCaptureTile(commonParams: CommonParams, unit: IUnit, gridIndex: GridIndex, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
    await checkAndCallLater();

    const tile = commonParams.getWar().getTileMap().getTile(gridIndex);
    if (!unit.checkCanCaptureTile(tile)) {
        return null;
    } else {
        const score = await getScoreForActionUnitCaptureTile(commonParams, unit, gridIndex);
        return {
            score   : score,
            action  : WoContainer.fromJson({ WoUnitCaptureTile: {
                path        : {
                    nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                    fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                    isBlocked       : false,
                },
                launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
            } }),
        };
    }
}

async function getScoreForActionUnitCaptureTile(commonParams: CommonParams, unit: IUnit, destination: GridIndex): Promise<number> {
    await checkAndCallLater();

    const tile                  = commonParams.getWar().getTileMap().getTile(destination);
    const remainingCapturePoint = getExisted(tile.getRemainingCapturePoint(), ClientErrorCode.SpwRobot_GetScoreForActionUnitCaptureTile_00);
    const captureAmount         = getExisted(unit.getFinalCaptureAmount(destination), ClientErrorCode.SpwRobot_GetScoreAndActionUnitCaptureTile_01);
    if (captureAmount >= remainingCapturePoint) {
        return 99999999;
    }
    if (captureAmount <= 0) {
        return -99999999;
    }

    const turnsCount = Math.ceil(remainingCapturePoint / captureAmount);
    return turnsCount > 2
        ? 1
        : (tile.getTemplateCfg().getAiScoreForCapture()) / turnsCount;
}
