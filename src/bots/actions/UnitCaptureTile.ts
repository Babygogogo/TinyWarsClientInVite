import {
    Timer_TimerModel,
    Utils_ClientErrorCode,
    Helpers_Misc,
    type Bots_CommonParams,
    type AuxiliaryTypes_GridIndex,
    type Units_IUnit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitCaptureTile(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

    const tile = commonParams.getWar().getTileMap().getTile(gridIndex);
    if (!unit.checkCanCaptureTile(tile)) {
        return null;
    } else {
        const score = await getScoreForActionUnitCaptureTile(commonParams, unit, gridIndex);
        return {
            score  : score,
            action : WoContainer.fromJson({
                WoUnitCaptureTile : {
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
}

async function getScoreForActionUnitCaptureTile(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, destination: AuxiliaryTypes_GridIndex.GridIndex): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

    const tile                  = commonParams.getWar().getTileMap().getTile(destination);
    const remainingCapturePoint = Helpers_Misc.getExisted(tile.getRemainingCapturePoint(), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitCaptureTile_00);
    const captureAmount         = Helpers_Misc.getExisted(unit.getFinalCaptureAmount(destination), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreAndActionUnitCaptureTile_01);
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
