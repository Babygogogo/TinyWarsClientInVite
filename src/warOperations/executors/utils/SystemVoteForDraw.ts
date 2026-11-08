import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import type { WoSystemVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoSystemVoteForDraw, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemVoteForDraw(war, action);
    } else {
        await normalExeSystemVoteForDraw(war, action);
    }
}

function fastExeSystemVoteForDraw(war: BaseWar_Model_War.War, action: WoSystemVoteForDraw): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemVoteForDraw_00),
            isFastExecute   : true,
        });
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree()),
    );
}

async function normalExeSystemVoteForDraw(war: BaseWar_Model_War.War, action: WoSystemVoteForDraw): Promise<void> {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemVoteForDraw_00);
        await war.showTempUnitMoveAnimation({
            movingUnitAndPath : commonExtraData.getMovingUnitAndPath(),
            aiming            : null,
            callback          : undefined,
        });

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute : false,
        });
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree()),
    );
}
