import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError } from "../../../helpers/Misc.ts";
import { PlayerIndex, AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerVoteForDraw.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

export function revise(war: IBwWar, rawAction: WoPlayerVoteForDraw, requesterUserId: Undefinable<number>): WoContainer {
    const playerIndex = rawAction.getPlayerIndex();
    if (playerIndex == null) {
        throw newError(`Empty playerIndex.`, ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_00);
    }
    if (!war.getPlayerManager().checkHasPlayer(playerIndex)) {
        throw newError(`Invalid playerIndex.`, ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_01);
    }
    if (playerIndex === PlayerIndex.Neutral) {
        throw newError(`Invalid neutral playerIndex.`, ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_02);
    }

    const player = war.getPlayer(playerIndex);
    if ((player.getAliveState() !== AliveStateId.Alive)   ||
        (player.getUserId() != requesterUserId)
    ) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_03);
    }

    const isAgree = rawAction.getIsAgree();
    if (isAgree == null) {
        throw newError(`Invalid isAgree: ${isAgree}`, ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_04);
    }
    if (!war.getDrawVoteManager().checkCanVote(playerIndex, isAgree)) {
        throw newError(`Cannot vote currently: ${isAgree}`, ClientErrorCode.WarOperationReviser_RevisePlayerVoteForDraw_05);
    }

    return WoContainer.fromJson({
        WoPlayerVoteForDraw: {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    });
}
