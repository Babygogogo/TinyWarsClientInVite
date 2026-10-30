import {
    Players_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerEndTurn } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoPlayerEndTurn, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerEndTurn_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerEndTurn_01);
    }

    if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(playerInTurn.getPlayerIndex())) {
        throw Helpers_Misc.newError(`The player hasn't voted for draw.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerEndTurn_02);
    }

    return WoContainer.fromJson({
        WoPlayerEndTurn  : {},
    });
}
