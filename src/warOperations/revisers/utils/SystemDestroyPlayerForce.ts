import {
    Players_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemDestroyPlayerForce } from "../../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoSystemDestroyPlayerForce, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw Helpers_Misc.newError(`Invalid requesterUserId.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_00);
    }

    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_01);
    }

    const targetPlayerIndex = rawAction.getTargetPlayerIndex();
    if ((targetPlayerIndex == null) || (targetPlayerIndex === Players_Constants.PlayerIndex.Neutral)) {
        throw Helpers_Misc.newError(`Invalid targetPlayerIndex: ${targetPlayerIndex}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_02);
    }

    const player = war.getPlayer(targetPlayerIndex);
    if ((player == null) || (player.getAliveState() !== Players_Constants.AliveStateId.Dying)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_03);
    }

    return WoContainer.fromJson({
        WoSystemDestroyPlayerForce: {
            targetPlayerIndex,
        },
    });
}
