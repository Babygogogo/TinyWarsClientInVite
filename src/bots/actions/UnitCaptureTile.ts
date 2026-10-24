import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitCaptureTile(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, gridIndex: AuxiliaryTypesGridIndex.GridIndex, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

    const tile = commonParams.getWar().getTileMap().getTile(gridIndex);
    if (!unit.checkCanCaptureTile(tile)) {
        return null;
    } else {
        const score = await getScoreForActionUnitCaptureTile(commonParams, unit, gridIndex);
        return {
            score   : score,
            action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitCaptureTile: {
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

async function getScoreForActionUnitCaptureTile(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, destination: AuxiliaryTypesGridIndex.GridIndex): Promise<number> {
    await TimerTimerModel.checkAndCallLater();

    const tile                  = commonParams.getWar().getTileMap().getTile(destination);
    const remainingCapturePoint = HelpersMisc.getExisted(tile.getRemainingCapturePoint(), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreForActionUnitCaptureTile_00);
    const captureAmount         = HelpersMisc.getExisted(unit.getFinalCaptureAmount(destination), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetScoreAndActionUnitCaptureTile_01);
    if (captureAmount >= remainingCapturePoint) {
        return 99999999;
    }
    if (captureAmount <= 0) {
        return -99999999;
    }

    const turnsCount = Math.ceil(remainingCapturePoint / captureAmount);
    return turnsCount > 2
        ? 1
        : (tile.getTemplateCfg().getAiScoreForCapture() ?? 0) / turnsCount;
}
