import type * as BotsCommonParams from "../CommonParams.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";

export async function getActionForPhase11(commonParams: BotsCommonParams.CommonParams): Promise<ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer | null> {
    await TimerTimerModel.checkAndCallLater();

    const war           = commonParams.getWar();
    const playerIndex   = commonParams.getPlayerIndexInTurn();
    if (!war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(playerIndex)) {
        return null;
    } else {
        return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
            WoPlayerVoteForDraw: {
                playerIndex : playerIndex,
                isAgree     : true,
            },
        });
    }
}
