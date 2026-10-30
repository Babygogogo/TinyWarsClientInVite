import {
    Players_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    WarOperations_Revisers_Utils_Common,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitBeLoaded } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBeLoaded.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitBeLoaded, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBeLoaded_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBeLoaded_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperations_Revisers_Utils_Common.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const unitMap       = war.getUnitMap();
    const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBeLoaded_02);
    const rawPathNodes  = rawPath?.getNodes()?.map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    const destination   = rawPathNodes[rawPathNodes.length - 1];
    const loaderUnit    = unitMap.getUnitOnMap(destination);
    if ((rawPathNodes.length <= 1)              ||
        (!loaderUnit)                           ||
        (!loaderUnit.checkCanLoadUnit(focusUnit))
    ) {
        throw Helpers_Misc.newError(`Invalid loaderUnit.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBeLoaded_03);
    }

    return WoContainer.fromJson({
        WoUnitBeLoaded: {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
