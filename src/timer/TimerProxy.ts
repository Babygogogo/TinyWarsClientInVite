import {
    addListeners,
    send,
} from "../networks/Manager.ts";
import { MessageCodes } from "../networks/MessageCodes.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { S as CommonHeartbeatResponse } from "../proto/schema/CommonProto/NetMessage/MsgCommonHeartbeat/S.ts";
import { updateOnMsgCommonHeartbeat } from "./TimerModel.ts";
import type { Event } from "../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgCommonHeartbeat,              callback: _onMsgCommonHeartbeat },
    ], null);
}

export function reqCommonHeartbeat(counter: number): void {
    send({
        MsgCommonHeartbeat: { c: {
            counter,
        } },
    });
}
function _onMsgCommonHeartbeat(e: Event): void {
    const data = e.data as CommonHeartbeatResponse;
    if (!data.getErrorCode()) {
        updateOnMsgCommonHeartbeat(data);
        dispatch(TypeId.MsgCommonHeartbeat, data);
    }
}
