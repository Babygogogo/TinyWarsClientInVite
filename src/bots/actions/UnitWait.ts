import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { ScoreAndAction } from "../Types.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import type { IUnit } from "../../units/IUnit.ts";

type IBwUnit            = IUnit;
type GrScoreAndAction   = ScoreAndAction;

export async function getScoreAndActionUnitWait(unit: IBwUnit, pathNodes: MovePathNode[]): Promise<GrScoreAndAction> {
    await checkAndCallLater();

    const score = await getScoreForActionUnitWait();
    return {
        score   : score,
        action  : WoContainer.fromJson({ WoUnitWait: {
            path        : {
                nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                isBlocked       : false,
            },
            launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
        } }),
    };
}

async function getScoreForActionUnitWait(): Promise<number> {
    await checkAndCallLater();

    // const tile = war.getTileMap().getTile(gridIndex);
    // if ((tile.getMaxCapturePoint()) && (tile.getTeamIndex() !== unit.getTeamIndex())) {
    //     return -20;
    // } else {
    //     return 0;
    // }
    return 0;
}
