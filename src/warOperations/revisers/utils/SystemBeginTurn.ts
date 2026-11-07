import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Turns_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemBeginTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";

 
export function revise(war: BaseWar_Model_War.War, rawAction: WoSystemBeginTurn, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw Helpers_Misc.newError(`Invalid requesterUserId.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemBeginTurn_00);
    }

    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemBeginTurn_01);
    }

    return WoContainer.fromJson({
        WoSystemBeginTurn : {
        },
    });
}
