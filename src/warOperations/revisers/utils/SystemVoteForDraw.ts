import {
    Utils_ClientErrorCode,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoSystemVoteForDraw, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (requesterUserId != null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_00);
    }

    const playerIndex = rawAction.getPlayerIndex();
    if (playerIndex == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_01);
    }
    if (!war.getPlayerManager().checkHasPlayer(playerIndex)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_02);
    }

    const isAgree = rawAction.getIsAgree();
    if (isAgree == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_03);
    }
    if (!war.getDrawVoteManager().checkCanVote(playerIndex, isAgree)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseSystemVoteForDraw_04);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoSystemVoteForDraw : {
            playerIndex : playerIndex,
            isAgree     : isAgree,
        },
    }));
}
