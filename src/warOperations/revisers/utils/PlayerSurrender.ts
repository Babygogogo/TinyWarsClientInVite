import {
    Players_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerSurrender } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerSurrender.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoPlayerSurrender, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    const playerIndex   = Helpers_Misc.getExisted(rawAction.getPlayerIndex(), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerSurrender_00);
    const player        = war.getPlayer(playerIndex);
    if ((player.getUserId() == null)                            ||
        (player.checkIsNeutral())                               ||
        (player.getAliveState() !== Players_Constants.AliveStateId.Alive)   ||
        (player.getUserId() != requesterUserId)
    ) {
        throw Helpers_Misc.newError(`Invalid playerIndex or aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerSurrender_01);
    }

    return WoContainer.fromJson({
        WoPlayerSurrender: {
            playerIndex : playerIndex,
        },
    });
}
