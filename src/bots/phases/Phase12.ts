import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import { checkAndCallLater } from "../../timer/TimerModel.ts";

export async function getActionForPhase12(): Promise<WoContainer> {
    await checkAndCallLater();

    return WoContainer.fromJson({
        WoPlayerEndTurn: {},
    });
}
