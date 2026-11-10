import {
    Utils_ClientErrorCode,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemHandleBootPlayer } from "../../../proto/schema/CommonProto/WarOperation/WoSystemHandleBootPlayer.ts";

 
export function revise(war: BaseWar_Model_War.War, rawAction: WoSystemHandleBootPlayer, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (requesterUserId != null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_00);
    }

    if (!war.checkIsBoot()) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemHandleBootPlayer_01);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoSystemHandleBootPlayer : {
        },
    }));
}
