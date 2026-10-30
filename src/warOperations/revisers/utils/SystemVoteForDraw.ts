import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoSystemVoteForDraw, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw Helpers_Misc.newError(`Invalid requesterUserId.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_00);
    }

    const playerIndex = rawAction.getPlayerIndex();
    if (playerIndex == null) {
        throw Helpers_Misc.newError(`Empty playerIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_01);
    }
    if (!war.getPlayerManager().checkHasPlayer(playerIndex)) {
        throw Helpers_Misc.newError(`Invalid playerIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_02);
    }

    const isAgree = rawAction.getIsAgree();
    if (isAgree == null) {
        throw Helpers_Misc.newError(`Invalid isAgree.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_03);
    }
    if (!war.getDrawVoteManager().checkCanVote(playerIndex, isAgree)) {
        throw Helpers_Misc.newError(`Cannot vote.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_04);
    }

    return WoContainer.fromJson({
        WoSystemVoteForDraw: {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    });
}
