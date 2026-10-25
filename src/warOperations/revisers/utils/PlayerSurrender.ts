import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getExisted, newError } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerSurrender } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerSurrender.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

export function revise(war: IBwWar, rawAction: WoPlayerSurrender, requesterUserId: Undefinable<number>): WoContainer {
    const playerIndex   = getExisted(rawAction.getPlayerIndex(), ClientErrorCode.WarOperationReviser_RevisePlayerSurrender_00);
    const player        = war.getPlayer(playerIndex);
    if ((player.getUserId() == null)                            ||
        (player.checkIsNeutral())                               ||
        (player.getAliveState() !== AliveStateId.Alive)   ||
        (player.getUserId() != requesterUserId)
    ) {
        throw newError(`Invalid playerIndex or aliveState.`, ClientErrorCode.WarOperationReviser_RevisePlayerSurrender_01);
    }

    return WoContainer.fromJson({
        WoPlayerSurrender: {
            playerIndex : playerIndex,
        },
    });
}
