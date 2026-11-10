import {
    Utils_ClientErrorCode,
    Turns_Constants,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemBeginTurn } from "../../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";

 
export function revise(war: BaseWar_Model_War.War, rawAction: WoSystemBeginTurn, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (requesterUserId != null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemBeginTurn_00);
    }

    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemBeginTurn_01);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoSystemBeginTurn : {
        },
    }));
}
