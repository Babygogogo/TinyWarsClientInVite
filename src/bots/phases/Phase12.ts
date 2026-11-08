import {
    Timer_TimerModel,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getActionForPhase12(): Promise<WoContainer> {
    await Timer_TimerModel.checkAndCallLater();

    return WoContainer.fromJson({
        WoPlayerEndTurn : {},
    });
}
