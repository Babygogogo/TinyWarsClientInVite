import * as CommonModelCommonModel from "./CommonModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCommonGetCoStatisticsS from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetCoStatistics/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCommonGetRankListS from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetRankList/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCommonGetServerStatusS from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetServerStatus/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCommonError,                  callback: _onMsgCommonError, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCommonGetServerStatus,        callback: _onMsgCommonGetServerStatus, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCommonGetRankList,            callback: _onMsgCommonGetRankList },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCommonGetCoStatistics,        callback: _onMsgCommonGetCoStatistics },
    ], null);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _onMsgCommonError(e: VendorEgretEgret.Event): void {
    // TODO: Handle common error message.
}

export function reqCommonGetServerStatus(): void {
    NetworksManager.send({ MsgCommonGetServerStatus: { c: {} }, });
}
function _onMsgCommonGetServerStatus(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCommonGetServerStatusS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCommonGetServerStatus, data);
    }
}

export function reqGetRankList(): void {
    NetworksManager.send({ MsgCommonGetRankList: { c: {} } });
}
function _onMsgCommonGetRankList(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCommonGetRankListS.S;
    if (!data.getErrorCode()) {
        CommonModelCommonModel.setMrwRankArray(data.getMrwRankDataArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCommonGetRankList, data);
    }
}

export function reqCommonGetCoStatistics(): void {
    NetworksManager.send({ MsgCommonGetCoStatistics: { c: {} } });
}
function _onMsgCommonGetCoStatistics(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCommonGetCoStatisticsS.S;
    if (!data.getErrorCode()) {
        CommonModelCommonModel.setCoStatistics(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCommonGetCoStatistics, data);
    }
}
