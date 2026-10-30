import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Common_Model_CommonModel,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as CommonGetCoStatisticsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetCoStatistics/S.ts";
import type { S as CommonGetRankListResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetRankList/S.ts";
import type { S as CommonGetServerStatusResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetServerStatus/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCommonError,                  callback: _onMsgCommonError, },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCommonGetServerStatus,        callback: _onMsgCommonGetServerStatus, },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCommonGetRankList,            callback: _onMsgCommonGetRankList },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCommonGetCoStatistics,        callback: _onMsgCommonGetCoStatistics },
    ], null);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _onMsgCommonError(e: Egret_Egret.Event): void {
    // TODO: Handle common error message.
}

export function reqCommonGetServerStatus(): void {
    Networks_Manager.send({ MsgCommonGetServerStatus: { c: {} }, });
}
function _onMsgCommonGetServerStatus(e: Egret_Egret.Event): void {
    const data = e.data as CommonGetServerStatusResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCommonGetServerStatus, data);
    }
}

export function reqGetRankList(): void {
    Networks_Manager.send({ MsgCommonGetRankList: { c: {} } });
}
function _onMsgCommonGetRankList(e: Egret_Egret.Event): void {
    const data = e.data as CommonGetRankListResponse;
    if (!data.getErrorCode()) {
        Common_Model_CommonModel.setMrwRankArray(data.getMrwRankDataArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCommonGetRankList, data);
    }
}

export function reqCommonGetCoStatistics(): void {
    Networks_Manager.send({ MsgCommonGetCoStatistics: { c: {} } });
}
function _onMsgCommonGetCoStatistics(e: Egret_Egret.Event): void {
    const data = e.data as CommonGetCoStatisticsResponse;
    if (!data.getErrorCode()) {
        Common_Model_CommonModel.setCoStatistics(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCommonGetCoStatistics, data);
    }
}
