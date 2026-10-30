import {
    Timer_TimerModel,
    type Bots_CommonParams,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getActionForPhase11(commonParams: Bots_CommonParams.CommonParams): Promise<WoContainer | null> {
    await Timer_TimerModel.checkAndCallLater();

    const war           = commonParams.getWar();
    const playerIndex   = commonParams.getPlayerIndexInTurn();
    if (!war.getDrawVoteManager().checkNeedVoteBeforeEndTurn(playerIndex)) {
        return null;
    } else {
        return WoContainer.fromJson({
            WoPlayerVoteForDraw : {
                playerIndex : playerIndex,
                isAgree     : true,
            },
        });
    }
}
