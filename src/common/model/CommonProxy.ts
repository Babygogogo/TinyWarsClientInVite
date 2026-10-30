import {
    setMrwRankArray,
    setCoStatistics,
} from "./CommonModel.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as CommonGetCoStatisticsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetCoStatistics/S.ts";
import type { S as CommonGetRankListResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetRankList/S.ts";
import type { S as CommonGetServerStatusResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCommonGetServerStatus/S.ts";
import type { Event } from "../../egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgCommonError,                  callback: _onMsgCommonError, },
        { msgCode: MessageCodes.MsgCommonGetServerStatus,        callback: _onMsgCommonGetServerStatus, },
        { msgCode: MessageCodes.MsgCommonGetRankList,            callback: _onMsgCommonGetRankList },
        { msgCode: MessageCodes.MsgCommonGetCoStatistics,        callback: _onMsgCommonGetCoStatistics },
    ], null);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _onMsgCommonError(e: Event): void {
    // TODO: Handle common error message.
}

export function reqCommonGetServerStatus(): void {
    send({ MsgCommonGetServerStatus: { c: {} }, });
}
function _onMsgCommonGetServerStatus(e: Event): void {
    const data = e.data as CommonGetServerStatusResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCommonGetServerStatus, data);
    }
}

export function reqGetRankList(): void {
    send({ MsgCommonGetRankList: { c: {} } });
}
function _onMsgCommonGetRankList(e: Event): void {
    const data = e.data as CommonGetRankListResponse;
    if (!data.getErrorCode()) {
        setMrwRankArray(data.getMrwRankDataArray());
        dispatch(TypeId.MsgCommonGetRankList, data);
    }
}

export function reqCommonGetCoStatistics(): void {
    send({ MsgCommonGetCoStatistics: { c: {} } });
}
function _onMsgCommonGetCoStatistics(e: Event): void {
    const data = e.data as CommonGetCoStatisticsResponse;
    if (!data.getErrorCode()) {
        setCoStatistics(data);
        dispatch(TypeId.MsgCommonGetCoStatistics, data);
    }
}
