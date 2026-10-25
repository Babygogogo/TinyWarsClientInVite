import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { ScoreAndAction } from "../Types.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import type { IUnit } from "../../units/IUnit.ts";

type IBwUnit            = IUnit;
type GrScoreAndAction   = ScoreAndAction;

export async function getScoreAndActionUnitSurface(unit: IBwUnit, pathNodes: MovePathNode[]): Promise<GrScoreAndAction | null> {
    await checkAndCallLater();

    if (!unit.checkCanSurface()) {
        return null;
    } else {
        const score = await getScoreForActionUnitSurface(unit);
        return {
            score,
            action  : WoContainer.fromJson({ WoUnitSurface: {
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

async function getScoreForActionUnitSurface(unit: IBwUnit): Promise<number> {
    await checkAndCallLater();

    return unit.checkIsFuelInShort() ? 10 : -10;
}
