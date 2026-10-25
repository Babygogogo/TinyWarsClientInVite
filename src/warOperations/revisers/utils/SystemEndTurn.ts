import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError } from "../../../helpers/Misc.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemEndTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function revise(war: IBwWar, rawAction: WoSystemEndTurn, requesterUserId: Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw newError(`Invalid requesterUserId.`, ClientErrorCode.WarOperationReviser_ReviseSystemEndTurn_00);
    }

    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseSystemEndTurn_01);
    }

    if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(war.getPlayerIndexInTurn())) {
        throw newError(`Need vote for draw.`, ClientErrorCode.WarOperationReviser_ReviseSystemEndTurn_02);
    }

    return WoContainer.fromJson({
        WoSystemEndTurn: {
        },
    });
}
