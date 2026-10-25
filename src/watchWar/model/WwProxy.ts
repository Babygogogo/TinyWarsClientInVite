import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchContinueWar/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwWatchDeleteWatcherS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchDeleteWatcher/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetIncomingInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetIncomingInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOngoingWarIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOngoingWarIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOutgoingInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOutgoingInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetRequestableWarIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetRequestableWarIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetRequestedWarIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetRequestedWarIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetWatchedWarIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetWatchedWarIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwWatchHandleRequestS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchHandleRequest/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMpwWatchMakeRequestS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchMakeRequest/S.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import {
    setRequestableWarIdArray,
    setOngoingWarIdArray,
    setRequestedWarIdArray,
    setWatchedWarIdArray,
    updateOnFailedMsgMpwWatchContinueWar,
    updateOnMsgMpwWatchContinueWar,
    updateOnFailedMpwWatchGetIncomingInfo,
    updateOnMsgMpwWatchGetIncomingInfo,
    updateOnFailedMpwWatchGetOutgoingInfo,
    updateOnMsgMpwWatchGetOutgoingInfo,
} from "./WwModel.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgMpwWatchGetRequestableWarIdArray,     callback: _onMsgMpwWatchGetRequestableWarIdArray },
        { msgCode: MessageCodes.MsgMpwWatchGetOngoingWarIdArray,         callback: _onMsgMpwWatchGetOngoingWarIdArray },
        { msgCode: MessageCodes.MsgMpwWatchGetRequestedWarIdArray,       callback: _onMsgMpwWatchGetRequestedWarIdArray },
        { msgCode: MessageCodes.MsgMpwWatchGetWatchedWarIdArray,         callback: _onMsgMpwWatchGetWatchedWarIdArray },
        { msgCode: MessageCodes.MsgMpwWatchMakeRequest,                  callback: _onMsgMpwWatchMakeRequest },
        { msgCode: MessageCodes.MsgMpwWatchHandleRequest,                callback: _onMsgMpwWatchHandleRequest },
        { msgCode: MessageCodes.MsgMpwWatchDeleteWatcher,                callback: _onMsgMpwWatchDeleteWatcher },
        { msgCode: MessageCodes.MsgMpwWatchContinueWar,                  callback: _onMsgMpwWatchContinueWar },
        { msgCode: MessageCodes.MsgMpwWatchGetIncomingInfo,              callback: _onMsgMpwWatchGetIncomingInfo },
        { msgCode: MessageCodes.MsgMpwWatchGetOutgoingInfo,              callback: _onMsgMpwWatchGetOutgoingInfo },
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
    send({
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
function _onMsgMpwWatchGetRequestableWarIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetRequestableWarIdArrayS;
    if (!data.getErrorCode()) {
        setRequestableWarIdArray(data.getWarIdArray());
        dispatch(TypeId.MsgMpwWatchGetRequestableWarIdArray, data);
    }
}

export function reqMpwWatchGetOngoingWarIdArray(): void {
    send({
        MsgMpwWatchGetOngoingWarIdArray: { c: {
        } },
    });
}
function _onMsgMpwWatchGetOngoingWarIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOngoingWarIdArrayS;
    if (!data.getErrorCode()) {
        setOngoingWarIdArray(data.getWarIdArray());
        dispatch(TypeId.MsgMpwWatchGetOngoingWarInfos, data);
    }
}

export function reqMpwWatchRequestedWarIdArray(): void {
    send({
        MsgMpwWatchGetRequestedWarIdArray: { c: {
        }, }
    });
}
function _onMsgMpwWatchGetRequestedWarIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetRequestedWarIdArrayS;
    if (!data.getErrorCode()) {
        setRequestedWarIdArray(data.getWarIdArray());
        dispatch(TypeId.MsgMpwWatchGetRequestedWarIdArray, data);
    }
}

export function reqMpwWatchWatchedWarIdArray(): void {
    send({
        MsgMpwWatchGetWatchedWarIdArray: { c: {
        }, }
    });
}
function _onMsgMpwWatchGetWatchedWarIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetWatchedWarIdArrayS;
    if (!data.getErrorCode()) {
        setWatchedWarIdArray(data.getWarIdArray());
        dispatch(TypeId.MsgMpwWatchGetWatchedWarInfos, data);
    }
}

export function reqWatchMakeRequest(warId: number, dstUserIds: number[]): void {
    send({
        MsgMpwWatchMakeRequest: { c: {
            warId,
            dstUserIds,
        }, }
    });
}
function _onMsgMpwWatchMakeRequest(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchMakeRequestS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMpwWatchMakeRequest, data);
    }
}

export function reqWatchHandleRequest(warId: number, acceptSrcUserIds: number[], declineSrcUserIds: number[]): void {
    send({
        MsgMpwWatchHandleRequest: { c: {
            warId,
            acceptSrcUserIds,
            declineSrcUserIds,
        }, }
    });
}
function _onMsgMpwWatchHandleRequest(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchHandleRequestS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMpwWatchHandleRequest, data);
    }
}

export function reqWatchDeleteWatcher(warId: number, watcherUserIds: number[]): void {
    send({
        MsgMpwWatchDeleteWatcher: { c: {
            warId,
            watcherUserIds,
        }, }
    });
}
function _onMsgMpwWatchDeleteWatcher(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchDeleteWatcherS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMpwWatchDeleteWatcher, data);
    }
}

export function reqWatchContinueWar(warId: number): void {
    send({
        MsgMpwWatchContinueWar: { c: {
            warId,
        }, }
    });
}
async function _onMsgMpwWatchContinueWar(e: Event): Promise<void> {
    const data = e.data as S;
    if (data.getErrorCode()) {
        updateOnFailedMsgMpwWatchContinueWar(data);
    } else {
        await updateOnMsgMpwWatchContinueWar(data);
        dispatch(TypeId.MsgMpwWatchContinueWar, data);
    }
}

export function reqMpwWatchGetIncomingInfo(warId: number): void {
    send({
        MsgMpwWatchGetIncomingInfo: { c: {
            warId,
        } },
    });
}
function _onMsgMpwWatchGetIncomingInfo(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetIncomingInfoS;
    if (data.getErrorCode()) {
        updateOnFailedMpwWatchGetIncomingInfo(data);
    } else {
        updateOnMsgMpwWatchGetIncomingInfo(data);
        dispatch(TypeId.MsgMpwWatchGetIncomingInfo, data);
    }
}

export function reqMpwWatchGetOutgoingInfo(warId: number): void {
    send({
        MsgMpwWatchGetOutgoingInfo: { c: {
            warId,
        } },
    });
}
function _onMsgMpwWatchGetOutgoingInfo(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOutgoingInfoS;
    if (data.getErrorCode()) {
        updateOnFailedMpwWatchGetOutgoingInfo(data);
    } else {
        updateOnMsgMpwWatchGetOutgoingInfo(data);
        dispatch(TypeId.MsgMpwWatchGetOutgoingInfo, data);
    }
}
