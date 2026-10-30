import {
    Players_Constants,
    WarOperations_Revisers_Utils_Common,
    Utils_ClientErrorCode,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitBoardedByCo } from "../../../proto/schema/CommonProto/WarOperation/WoUnitBoardedByCo.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitBoardedByCo, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBoardedByCo_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBoardedByCo_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperations_Revisers_Utils_Common.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBoardedByCo_02);
    }

    const focusUnit = war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId);
    if ((focusUnit == null) || (!focusUnit.checkCanCoBoardAfterMovePath(rawPathNodes))) {
        throw Helpers_Misc.newError(`Can not load co.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitBoardedByCo_03);
    }

    return WoContainer.fromJson({
        WoUnitBoardedByCo : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
