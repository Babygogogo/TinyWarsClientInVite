import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    WatchWar_Model_WwModel,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as MpwWatchContinueWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchContinueWar/S.ts";
import type { S as MpwWatchDeleteWatcherResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchDeleteWatcher/S.ts";
import type { S as MpwWatchGetIncomingInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetIncomingInfo/S.ts";
import type { S as MpwWatchGetOngoingWarIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOngoingWarIdArray/S.ts";
import type { S as MpwWatchGetOutgoingInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOutgoingInfo/S.ts";
import type { S as MpwWatchGetRequestableWarIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetRequestableWarIdArray/S.ts";
import type { S as MpwWatchGetRequestedWarIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetRequestedWarIdArray/S.ts";
import type { S as MpwWatchGetWatchedWarIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetWatchedWarIdArray/S.ts";
import type { S as MpwWatchHandleRequestResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchHandleRequest/S.ts";
import type { S as MpwWatchMakeRequestResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchMakeRequest/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchGetRequestableWarIdArray,     callback: _onMsgMpwWatchGetRequestableWarIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchGetOngoingWarIdArray,         callback: _onMsgMpwWatchGetOngoingWarIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchGetRequestedWarIdArray,       callback: _onMsgMpwWatchGetRequestedWarIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchGetWatchedWarIdArray,         callback: _onMsgMpwWatchGetWatchedWarIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchMakeRequest,                  callback: _onMsgMpwWatchMakeRequest },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchHandleRequest,                callback: _onMsgMpwWatchHandleRequest },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchDeleteWatcher,                callback: _onMsgMpwWatchDeleteWatcher },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchContinueWar,                  callback: _onMsgMpwWatchContinueWar },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchGetIncomingInfo,              callback: _onMsgMpwWatchGetIncomingInfo },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMpwWatchGetOutgoingInfo,              callback: _onMsgMpwWatchGetOutgoingInfo },
    ], null);
}

export function reqMpwWatchGetRequestableWarIdArray({ warId, coCategoryId, normalMapId, userId, playersCountUnneutral, warName }: {
    warId?                  : number | null;
    coCategoryId?           : number | null;
    normalMapId?            : number | null;
    userId?                 : number | null;
    playersCountUnneutral?  : number | null;
    warName?                : string | null;
}): void {
    Networks_Manager.send({
        MsgMpwWatchGetRequestableWarIdArray: { c: {
            warId,
            coCategoryId,
            normalMapId             : normalMapId,
            userId,
            playersCountUnneutral,
            warName,
        } },
    });
}
function _onMsgMpwWatchGetRequestableWarIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MpwWatchGetRequestableWarIdArrayResponse;
    if (!data.getErrorCode()) {
        WatchWar_Model_WwModel.setRequestableWarIdArray(data.getWarIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchGetRequestableWarIdArray, data);
    }
}

export function reqMpwWatchGetOngoingWarIdArray(): void {
    Networks_Manager.send({
        MsgMpwWatchGetOngoingWarIdArray: { c: {
        } },
    });
}
function _onMsgMpwWatchGetOngoingWarIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MpwWatchGetOngoingWarIdArrayResponse;
    if (!data.getErrorCode()) {
        WatchWar_Model_WwModel.setOngoingWarIdArray(data.getWarIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchGetOngoingWarInfos, data);
    }
}

export function reqMpwWatchRequestedWarIdArray(): void {
    Networks_Manager.send({
        MsgMpwWatchGetRequestedWarIdArray: { c: {
        }, }
    });
}
function _onMsgMpwWatchGetRequestedWarIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MpwWatchGetRequestedWarIdArrayResponse;
    if (!data.getErrorCode()) {
        WatchWar_Model_WwModel.setRequestedWarIdArray(data.getWarIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray, data);
    }
}

export function reqMpwWatchWatchedWarIdArray(): void {
    Networks_Manager.send({
        MsgMpwWatchGetWatchedWarIdArray: { c: {
        }, }
    });
}
function _onMsgMpwWatchGetWatchedWarIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MpwWatchGetWatchedWarIdArrayResponse;
    if (!data.getErrorCode()) {
        WatchWar_Model_WwModel.setWatchedWarIdArray(data.getWarIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchGetWatchedWarInfos, data);
    }
}

export function reqWatchMakeRequest(warId: number, dstUserIds: number[]): void {
    Networks_Manager.send({
        MsgMpwWatchMakeRequest: { c: {
            warId,
            dstUserIds,
        }, }
    });
}
function _onMsgMpwWatchMakeRequest(e: Egret_Egret.Event): void {
    const data = e.data as MpwWatchMakeRequestResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchMakeRequest, data);
    }
}

export function reqWatchHandleRequest(warId: number, acceptSrcUserIds: number[], declineSrcUserIds: number[]): void {
    Networks_Manager.send({
        MsgMpwWatchHandleRequest: { c: {
            warId,
            acceptSrcUserIds,
            declineSrcUserIds,
        }, }
    });
}
function _onMsgMpwWatchHandleRequest(e: Egret_Egret.Event): void {
    const data = e.data as MpwWatchHandleRequestResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchHandleRequest, data);
    }
}

export function reqWatchDeleteWatcher(warId: number, watcherUserIds: number[]): void {
    Networks_Manager.send({
        MsgMpwWatchDeleteWatcher: { c: {
            warId,
            watcherUserIds,
        }, }
    });
}
function _onMsgMpwWatchDeleteWatcher(e: Egret_Egret.Event): void {
    const data = e.data as MpwWatchDeleteWatcherResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchDeleteWatcher, data);
    }
}

export function reqWatchContinueWar(warId: number): void {
    Networks_Manager.send({
        MsgMpwWatchContinueWar: { c: {
            warId,
        }, }
    });
}
async function _onMsgMpwWatchContinueWar(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MpwWatchContinueWarResponse;
    if (data.getErrorCode()) {
        WatchWar_Model_WwModel.updateOnFailedMsgMpwWatchContinueWar(data);
    } else {
        await WatchWar_Model_WwModel.updateOnMsgMpwWatchContinueWar(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchContinueWar, data);
    }
}

export function reqMpwWatchGetIncomingInfo(warId: number): void {
    Networks_Manager.send({
        MsgMpwWatchGetIncomingInfo: { c: {
            warId,
        } },
    });
}
function _onMsgMpwWatchGetIncomingInfo(e: Egret_Egret.Event): void {
    const data = e.data as MpwWatchGetIncomingInfoResponse;
    if (data.getErrorCode()) {
        WatchWar_Model_WwModel.updateOnFailedMpwWatchGetIncomingInfo(data);
    } else {
        WatchWar_Model_WwModel.updateOnMsgMpwWatchGetIncomingInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchGetIncomingInfo, data);
    }
}

export function reqMpwWatchGetOutgoingInfo(warId: number): void {
    Networks_Manager.send({
        MsgMpwWatchGetOutgoingInfo: { c: {
            warId,
        } },
    });
}
function _onMsgMpwWatchGetOutgoingInfo(e: Egret_Egret.Event): void {
    const data = e.data as MpwWatchGetOutgoingInfoResponse;
    if (data.getErrorCode()) {
        WatchWar_Model_WwModel.updateOnFailedMpwWatchGetOutgoingInfo(data);
    } else {
        WatchWar_Model_WwModel.updateOnMsgMpwWatchGetOutgoingInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMpwWatchGetOutgoingInfo, data);
    }
}
