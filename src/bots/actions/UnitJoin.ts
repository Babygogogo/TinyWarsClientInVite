import {
    Units_Constants,
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

export async function getScoreAndActionUnitJoin(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

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

async function getScoreForActionUnitJoin(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

    const war           = commonParams.getWar();
    const targetUnit    = Helpers_Misc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex), Utils_ClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_00);
    if (targetUnit.getActionState() === Units_Constants.ActionStateId.Idle) {
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
