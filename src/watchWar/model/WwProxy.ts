import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchContinueWarS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchContinueWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchDeleteWatcherS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchDeleteWatcher/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetIncomingInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetIncomingInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOngoingWarIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOngoingWarIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOutgoingInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOutgoingInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetRequestableWarIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetRequestableWarIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetRequestedWarIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetRequestedWarIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetWatchedWarIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetWatchedWarIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchHandleRequestS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchHandleRequest/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchMakeRequestS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchMakeRequest/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WatchWarModelWwModel from "./WwModel.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchGetRequestableWarIdArray,     callback: _onMsgMpwWatchGetRequestableWarIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchGetOngoingWarIdArray,         callback: _onMsgMpwWatchGetOngoingWarIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchGetRequestedWarIdArray,       callback: _onMsgMpwWatchGetRequestedWarIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchGetWatchedWarIdArray,         callback: _onMsgMpwWatchGetWatchedWarIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchMakeRequest,                  callback: _onMsgMpwWatchMakeRequest },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchHandleRequest,                callback: _onMsgMpwWatchHandleRequest },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchDeleteWatcher,                callback: _onMsgMpwWatchDeleteWatcher },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchContinueWar,                  callback: _onMsgMpwWatchContinueWar },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchGetIncomingInfo,              callback: _onMsgMpwWatchGetIncomingInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMpwWatchGetOutgoingInfo,              callback: _onMsgMpwWatchGetOutgoingInfo },
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
    NetworksManager.send({
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
function _onMsgMpwWatchGetRequestableWarIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetRequestableWarIdArrayS.S;
    if (!data.getErrorCode()) {
        WatchWarModelWwModel.setRequestableWarIdArray(data.getWarIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchGetRequestableWarIdArray, data);
    }
}

export function reqMpwWatchGetOngoingWarIdArray(): void {
    NetworksManager.send({
        MsgMpwWatchGetOngoingWarIdArray: { c: {
        } },
    });
}
function _onMsgMpwWatchGetOngoingWarIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOngoingWarIdArrayS.S;
    if (!data.getErrorCode()) {
        WatchWarModelWwModel.setOngoingWarIdArray(data.getWarIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchGetOngoingWarInfos, data);
    }
}

export function reqMpwWatchRequestedWarIdArray(): void {
    NetworksManager.send({
        MsgMpwWatchGetRequestedWarIdArray: { c: {
        }, }
    });
}
function _onMsgMpwWatchGetRequestedWarIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetRequestedWarIdArrayS.S;
    if (!data.getErrorCode()) {
        WatchWarModelWwModel.setRequestedWarIdArray(data.getWarIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchGetRequestedWarIdArray, data);
    }
}

export function reqMpwWatchWatchedWarIdArray(): void {
    NetworksManager.send({
        MsgMpwWatchGetWatchedWarIdArray: { c: {
        }, }
    });
}
function _onMsgMpwWatchGetWatchedWarIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetWatchedWarIdArrayS.S;
    if (!data.getErrorCode()) {
        WatchWarModelWwModel.setWatchedWarIdArray(data.getWarIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchGetWatchedWarInfos, data);
    }
}

export function reqWatchMakeRequest(warId: number, dstUserIds: number[]): void {
    NetworksManager.send({
        MsgMpwWatchMakeRequest: { c: {
            warId,
            dstUserIds,
        }, }
    });
}
function _onMsgMpwWatchMakeRequest(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchMakeRequestS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchMakeRequest, data);
    }
}

export function reqWatchHandleRequest(warId: number, acceptSrcUserIds: number[], declineSrcUserIds: number[]): void {
    NetworksManager.send({
        MsgMpwWatchHandleRequest: { c: {
            warId,
            acceptSrcUserIds,
            declineSrcUserIds,
        }, }
    });
}
function _onMsgMpwWatchHandleRequest(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchHandleRequestS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchHandleRequest, data);
    }
}

export function reqWatchDeleteWatcher(warId: number, watcherUserIds: number[]): void {
    NetworksManager.send({
        MsgMpwWatchDeleteWatcher: { c: {
            warId,
            watcherUserIds,
        }, }
    });
}
function _onMsgMpwWatchDeleteWatcher(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchDeleteWatcherS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchDeleteWatcher, data);
    }
}

export function reqWatchContinueWar(warId: number): void {
    NetworksManager.send({
        MsgMpwWatchContinueWar: { c: {
            warId,
        }, }
    });
}
async function _onMsgMpwWatchContinueWar(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchContinueWarS.S;
    if (data.getErrorCode()) {
        WatchWarModelWwModel.updateOnFailedMsgMpwWatchContinueWar(data);
    } else {
        await WatchWarModelWwModel.updateOnMsgMpwWatchContinueWar(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchContinueWar, data);
    }
}

export function reqMpwWatchGetIncomingInfo(warId: number): void {
    NetworksManager.send({
        MsgMpwWatchGetIncomingInfo: { c: {
            warId,
        } },
    });
}
function _onMsgMpwWatchGetIncomingInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetIncomingInfoS.S;
    if (data.getErrorCode()) {
        WatchWarModelWwModel.updateOnFailedMpwWatchGetIncomingInfo(data);
    } else {
        WatchWarModelWwModel.updateOnMsgMpwWatchGetIncomingInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchGetIncomingInfo, data);
    }
}

export function reqMpwWatchGetOutgoingInfo(warId: number): void {
    NetworksManager.send({
        MsgMpwWatchGetOutgoingInfo: { c: {
            warId,
        } },
    });
}
function _onMsgMpwWatchGetOutgoingInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOutgoingInfoS.S;
    if (data.getErrorCode()) {
        WatchWarModelWwModel.updateOnFailedMpwWatchGetOutgoingInfo(data);
    } else {
        WatchWarModelWwModel.updateOnMsgMpwWatchGetOutgoingInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMpwWatchGetOutgoingInfo, data);
    }
}
