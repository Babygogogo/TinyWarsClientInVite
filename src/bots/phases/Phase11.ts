import type { CommonParams } from "../CommonParams.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";

export async function getActionForPhase11(commonParams: CommonParams): Promise<WoContainer | null> {
    await checkAndCallLater();

    const war           = commonParams.getWar();
    const playerIndex   = commonParams.getPlayerIndexInTurn();
    if (!war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(playerIndex)) {
        return null;
    } else {
        return WoContainer.fromJson({
            WoPlayerVoteForDraw: {
                playerIndex : playerIndex,
                isAgree     : true,
            },
        });
    }
}
