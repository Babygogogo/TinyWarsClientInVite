import {
    Timer_TimerModel,
    type Units_IUnit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitSurface(unit: Units_IUnit.IUnit, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

    if (!unit.checkCanSurface()) {
        return null;
    } else {
        const score = await getScoreForActionUnitSurface(unit);
        return {
            score,
            action : WoContainer.fromJson({
                WoUnitSurface : {
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

async function getScoreForActionUnitSurface(unit: Units_IUnit.IUnit): Promise<number> {
    await Timer_TimerModel.checkAndCallLater();

    return unit.checkIsFuelInShort() ? 10 : -10;
}
