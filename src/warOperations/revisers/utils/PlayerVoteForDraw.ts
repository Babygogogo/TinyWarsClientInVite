import {
    Players_Constants,
    Utils_ClientErrorCode,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoPlayerVoteForDraw, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    const playerIndex = rawAction.getPlayerIndex();
    if (playerIndex == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_00);
    }
    if (!war.getPlayerManager().checkHasPlayer(playerIndex)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_01);
    }
    if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_02);
    }

    const player = war.getPlayer(playerIndex);
    if ((player.getAliveState() !== Players_Constants.AliveStateId.Alive)   ||
        (player.getUserId() != requesterUserId)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_03);
    }

    const isAgree = rawAction.getIsAgree();
    if (isAgree == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_04);
    }
    if (!war.getDrawVoteManager().checkCanVote(playerIndex, isAgree)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_05);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoPlayerVoteForDraw : {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    }));
}
