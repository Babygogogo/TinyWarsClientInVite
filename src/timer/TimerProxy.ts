import * as NetworksManager from "../networks/Manager.ts";
import * as NetworksMessageCodes from "../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCommonHeartbeatS from "../proto/schema/CommonProto/NetMessage/MsgCommonHeartbeat/S.ts";
import * as TimerTimerModel from "./TimerModel.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCommonHeartbeat,              callback: _onMsgCommonHeartbeat },
    ], null);
}

export function reqCommonHeartbeat(counter: number): void {
    NetworksManager.send({
        MsgCommonHeartbeat: { c: {
            counter,
        } },
    });
}
function _onMsgCommonHeartbeat(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCommonHeartbeatS.S;
    if (!data.getErrorCode()) {
        TimerTimerModel.updateOnMsgCommonHeartbeat(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCommonHeartbeat, data);
    }
}
