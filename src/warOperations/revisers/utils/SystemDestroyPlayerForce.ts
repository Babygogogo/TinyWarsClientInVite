import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError } from "../../../helpers/Misc.ts";
import {
    PlayerIndex,
    AliveStateId,
} from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemDestroyPlayerForce } from "../../../proto/schema/CommonProto/WarOperation/WoSystemDestroyPlayerForce.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

export function revise(war: IBwWar, rawAction: WoSystemDestroyPlayerForce, requesterUserId: Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw newError(`Invalid requesterUserId.`, ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_00);
    }

    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_01);
    }

    const targetPlayerIndex = rawAction.getTargetPlayerIndex();
    if ((targetPlayerIndex == null) || (targetPlayerIndex === PlayerIndex.Neutral)) {
        throw newError(`Invalid targetPlayerIndex: ${targetPlayerIndex}`, ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_02);
    }

    const player = war.getPlayer(targetPlayerIndex);
    if ((player == null) || (player.getAliveState() !== AliveStateId.Dying)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseSystemDestroyPlayerForce_03);
    }

    return WoContainer.fromJson({
        WoSystemDestroyPlayerForce: {
            targetPlayerIndex,
        },
    });
}
