import {
    Timer_TimerModel,
    type Units_IUnit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitWait(unit: Units_IUnit.IUnit, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction> {
    await Timer_TimerModel.checkAndCallLater();

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
    await Timer_TimerModel.checkAndCallLater();

    // const tile = war.getTileMap().getTile(gridIndex);
    // if ((tile.getMaxCapturePoint()) && (tile.getTeamIndex() !== unit.getTeamIndex())) {
    //     return -20;
    // } else {
    //     return 0;
    // }
    return 0;
}
