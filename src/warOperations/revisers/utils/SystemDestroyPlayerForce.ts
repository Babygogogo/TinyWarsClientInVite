import {
    Players_Constants,
    Utils_ClientErrorCode,
    Turns_Constants,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemDestroyPlayerForce } from "../../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoSystemDestroyPlayerForce, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (requesterUserId != null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_00);
    }

    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_01);
    }

    const targetPlayerIndex = rawAction.getTargetPlayerIndex();
    if ((targetPlayerIndex == null) || (targetPlayerIndex === Players_Constants.PlayerIndex.Neutral)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_02);
    }

    const player = war.getPlayer(targetPlayerIndex);
    if ((player == null) || (player.getAliveState() !== Players_Constants.AliveStateId.Dying)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_03);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoSystemDestroyPlayerForce : {
            targetPlayerIndex,
        },
    }));
}
