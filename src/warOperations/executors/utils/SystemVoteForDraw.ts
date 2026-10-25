import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import type { WoSystemVoteForDraw } from "../../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { handleCommonExtraData } from "./Common.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoSystemVoteForDraw, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemVoteForDraw(war, action);
    } else {
        await normalExeSystemVoteForDraw(war, action);
    }
}

function fastExeSystemVoteForDraw(war: IBwWar, action: WoSystemVoteForDraw): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeSystemVoteForDraw_00),
            isFastExecute   : true,
        });
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree())
    );
}

async function normalExeSystemVoteForDraw(war: IBwWar, action: WoSystemVoteForDraw): Promise<void> {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeSystemVoteForDraw_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });
    }

    war.getDrawVoteManager().handleVote(
        (actionExtraData ? actionExtraData.getPlayerIndex() : action.getPlayerIndex()) ?? war.getPlayerIndexInTurn(),
        !!(actionExtraData ? actionExtraData.getIsAgree() : action.getIsAgree())
    );
}
