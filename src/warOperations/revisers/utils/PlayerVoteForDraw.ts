import {
    Players_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoPlayerVoteForDraw, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    const playerIndex = rawAction.getPlayerIndex();
    if (playerIndex == null) {
        throw Helpers_Misc.newError(`Empty playerIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_00);
    }
    if (!war.getPlayerManager().checkHasPlayer(playerIndex)) {
        throw Helpers_Misc.newError(`Invalid playerIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_01);
    }
    if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
        throw Helpers_Misc.newError(`Invalid neutral playerIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_02);
    }

    const player = war.getPlayer(playerIndex);
    if ((player.getAliveState() !== Players_Constants.AliveStateId.Alive)   ||
        (player.getUserId() != requesterUserId)
    ) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_03);
    }

    const isAgree = rawAction.getIsAgree();
    if (isAgree == null) {
        throw Helpers_Misc.newError(`Invalid isAgree: ${isAgree}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_04);
    }
    if (!war.getDrawVoteManager().checkCanVote(playerIndex, isAgree)) {
        throw Helpers_Misc.newError(`Cannot vote currently: ${isAgree}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_05);
    }

    return WoContainer.fromJson({
        WoPlayerVoteForDraw: {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    });
}
