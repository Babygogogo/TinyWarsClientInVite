import {
    Players_Constants,
    Utils_ClientErrorCode,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerSurrender } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerSurrender.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoPlayerSurrender, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    const playerIndex   = rawAction.getPlayerIndex();
    if (playerIndex == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerSurrender_00);
    }

    const player        = war.getPlayer(playerIndex);
    if ((player.getUserId() == null)                            ||
        (player.checkIsNeutral())                               ||
        (player.getAliveState() !== Players_Constants.AliveStateId.Alive)   ||
        (player.getUserId() != requesterUserId)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerSurrender_01);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoPlayerSurrender : {
            playerIndex : playerIndex,
        },
    }));
}
