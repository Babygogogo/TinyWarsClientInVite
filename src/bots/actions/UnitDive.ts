import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsTypes from "../Types.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitDive(unit: IBwUnit, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

    if (!unit.checkCanDive()) {
        return null;
    } else {
        const score = await getScoreForActionUnitDive(unit);
        return {
            score,
            action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitDive: {
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

async function getScoreForActionUnitDive(unit: IBwUnit): Promise<number> {
    await TimerTimerModel.checkAndCallLater();

    return unit.checkIsFuelInShort() ? -10 : 10;
}
