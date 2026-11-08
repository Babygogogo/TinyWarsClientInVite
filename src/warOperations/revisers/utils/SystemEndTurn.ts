import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Turns_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemEndTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndTurn.ts";

 
export function revise(war: BaseWar_Model_War.War, rawAction: WoSystemEndTurn, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw Helpers_Misc.newError(`Invalid requesterUserId.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemEndTurn_00);
    }

    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemEndTurn_01);
    }

    if (war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(war.getPlayerIndexInTurn())) {
        throw Helpers_Misc.newError(`Need vote for draw.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemEndTurn_02);
    }

    return WoContainer.fromJson({
        WoSystemEndTurn : {
        },
    });
}
