import type { MovePathNode } from "../../auxiliaryTypes/MovePathNode.ts";
import type { ScoreAndAction } from "../Types.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";
import type { IUnit } from "../../units/IUnit.ts";

export async function getScoreAndActionUnitSurface(unit: IUnit, pathNodes: MovePathNode[]): Promise<ScoreAndAction | null> {
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

async function getScoreForActionUnitSurface(unit: IUnit): Promise<number> {
    await checkAndCallLater();

    return unit.checkIsFuelInShort() ? 10 : -10;
}
