import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Notifications_TypeId,
    Timer_TimerModel,
    type Egret_Egret,
} from "../internal.ts";
import type { S as CommonHeartbeatResponse } from "../proto/schema/CommonProto/NetMessage/MsgCommonHeartbeat/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCommonHeartbeat,              callback: _onMsgCommonHeartbeat },
    ], null);
}

export function reqCommonHeartbeat(counter: number): void {
    Networks_Manager.send({
        MsgCommonHeartbeat: { c: {
            counter,
        } },
    });
}
function _onMsgCommonHeartbeat(e: Egret_Egret.Event): void {
    const data = e.data as CommonHeartbeatResponse;
    if (!data.getErrorCode()) {
        Timer_TimerModel.updateOnMsgCommonHeartbeat(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCommonHeartbeat, data);
    }
}
