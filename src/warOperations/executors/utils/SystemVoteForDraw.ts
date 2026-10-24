import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoSystemVoteForDraw from "../../../proto/schema/CommonProto/WarOperation/WoSystemVoteForDraw.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoSystemVoteForDraw    = ProtoSchemaCommonProtoWarOperationWoSystemVoteForDraw.WoSystemVoteForDraw;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

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
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeSystemVoteForDraw_00),
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
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeSystemVoteForDraw_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
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
