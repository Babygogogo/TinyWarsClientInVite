import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError } from "../../../helpers/Misc.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export function revise(war: IBwWar, rawAction: WoSystemVoteForDraw, requesterUserId: Undefinable<number>): WoContainer {
    if (requesterUserId != null) {
        throw newError(`Invalid requesterUserId.`, ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_00);
    }

    const playerIndex = rawAction.getPlayerIndex();
    if (playerIndex == null) {
        throw newError(`Empty playerIndex.`, ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_01);
    }
    if (!war.getPlayerManager().checkHasPlayer(playerIndex)) {
        throw newError(`Invalid playerIndex.`, ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_02);
    }

    const isAgree = rawAction.getIsAgree();
    if (isAgree == null) {
        throw newError(`Invalid isAgree.`, ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_03);
    }
    if (!war.getDrawVoteManager().checkCanVote(playerIndex, isAgree)) {
        throw newError(`Cannot vote.`, ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_04);
    }

    return WoContainer.fromJson({
        WoSystemVoteForDraw: {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    });
}
