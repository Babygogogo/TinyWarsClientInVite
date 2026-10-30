import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import {
    newError,
    getExisted,
} from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitBeLoaded } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBeLoaded.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getRevisedPath } from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitBeLoaded, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitBeLoaded_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitBeLoaded_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const unitMap       = war.getUnitMap();
    const focusUnit     = getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarOperationReviser_ReviseUnitBeLoaded_02);
    const rawPathNodes  = rawPath?.getNodes()?.map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    const destination   = rawPathNodes[rawPathNodes.length - 1];
    const loaderUnit    = unitMap.getUnitOnMap(destination);
    if ((rawPathNodes.length <= 1)              ||
        (!loaderUnit)                           ||
        (!loaderUnit.checkCanLoadUnit(focusUnit))
    ) {
        throw newError(`Invalid loaderUnit.`, ClientErrorCode.WarOperationReviser_ReviseUnitBeLoaded_03);
    }

    return WoContainer.fromJson({
        WoUnitBeLoaded: {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
