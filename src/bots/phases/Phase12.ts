import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";

export async function getActionForPhase12(): Promise<ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer> {
    await TimerTimerModel.checkAndCallLater();

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoPlayerEndTurn: {},
    });
}
