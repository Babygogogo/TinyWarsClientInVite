import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as UnitsConstants from "../../units/Constants.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitJoin(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

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
        action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitJoinUnit: {
            path        : {
                nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                isBlocked       : false,
            },
            launchUnitId: unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
        } }),
    };
}

async function getScoreForActionUnitJoin(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex): Promise<number> {
    await TimerTimerModel.checkAndCallLater();

    const war           = commonParams.getWar();
    const targetUnit    = HelpersMisc.getExisted(war.getUnitMap().getUnitOnMap(gridIndex), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitJoin_00);
    if (targetUnit.getActionState() === UnitsConstants.ActionStateId.Idle) {
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
        ? (tile.getTemplateCfg().getAiScoreForCapture() ?? 0)
        : 0;
}
