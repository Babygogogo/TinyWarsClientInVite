import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerEndTurn } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: IBwWar, rawAction: WoPlayerEndTurn, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_RevisePlayerEndTurn_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== AliveStateId.Alive) ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_RevisePlayerEndTurn_01);
    }

    if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(playerInTurn.getPlayerIndex())) {
        throw newError(`The player hasn't voted for draw.`, ClientErrorCode.WarOperationReviser_RevisePlayerEndTurn_02);
    }

    return WoContainer.fromJson({
        WoPlayerEndTurn  : {},
    });
}
