import { getExisted } from "../../helpers/Misc.ts";
import {
    setMaxConcurrentCount,
    updateOnMsgMmrGetBootTimerDaysRange,
    updateOnMsgMmrSetBootTimerDaysRange,
    updateOnFailedMsgMmrGetRoomPublicInfo,
    updateOnMsgMmrGetRoomPublicInfo,
    setJoinedRoomIdArray,
    updateOnMsgMmrSetBannedCoIdArray,
    updateOnMsgMmrGetBannedNormalMapIdArray,
    updateOnMsgMmrSetBannedNormalMapIdArray,
    updateOnMsgMmrSetSelfSettings,
    updateOnMsgMmrDeleteRoomByServer,
} from "./MmrModel.ts";
import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMmrDeleteRoomByServer/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrGetBannedNormalMapIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetBannedNormalMapIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrGetBootTimerDaysRangeS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetBootTimerDaysRange/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrGetJoinedRoomIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetJoinedRoomIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrGetMaxConcurrentCountS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetMaxConcurrentCount/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetRoomPublicInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedCoIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedNormalMapIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedNormalMapIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrSetBootTimerDaysRangeS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBootTimerDaysRange/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrSetMaxConcurrentCountS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetMaxConcurrentCount/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetSelfSettings/S.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgMmrGetMaxConcurrentCount,         callback: _onMsgMmrGetMaxConcurrentCount },
        { msgCode: MessageCodes.MsgMmrGetRoomPublicInfo,             callback: _onMsgMmrGetRoomPublicInfo },
        { msgCode: MessageCodes.MsgMmrGetJoinedRoomIdArray,          callback: _onMsgMmrGetJoinedRoomIdArray },
        { msgCode: MessageCodes.MsgMmrSetBannedCoIdArray,            callback: _onMsgMmrSetBannedCoIdArray },
        { msgCode: MessageCodes.MsgMmrSetMaxConcurrentCount,         callback: _onMsgMmrSetMaxConcurrentCount },
        { msgCode: MessageCodes.MsgMmrGetBannedNormalMapIdArray,     callback: _onMsgMmrGetBannedNormalMapIdArray },
        { msgCode: MessageCodes.MsgMmrSetBannedNormalMapIdArray,     callback: _onMsgMmrSetBannedNormalMapIdArray },
        { msgCode: MessageCodes.MsgMmrGetBootTimerDaysRange,         callback: _onMsgMmrGetBootTimerDaysRange },
        { msgCode: MessageCodes.MsgMmrSetBootTimerDaysRange,         callback: _onMsgMmrSetBootTimerDaysRange },
        { msgCode: MessageCodes.MsgMmrSetSelfSettings,               callback: _onMsgMmrSetSelfSettings },
        { msgCode: MessageCodes.MsgMmrDeleteRoomByServer,            callback: _onMsgMmrDeleteRoomByServer },
    ]);
}

export function reqMmrGetMaxConcurrentCount(): void {
    send({ MsgMmrGetMaxConcurrentCount: { c: {} } });
}
function _onMsgMmrGetMaxConcurrentCount(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetMaxConcurrentCountS;
    if (!data.getErrorCode()) {
        setMaxConcurrentCount(false, getExisted(data.getMaxCountForStd()));
        setMaxConcurrentCount(true, getExisted(data.getMaxCountForFog()));
        dispatch(TypeId.MsgMmrGetMaxConcurrentCount, data);
    }
}

export function reqMmrGetBootTimerDaysRange(): void {
    send({ MsgMmrGetBootTimerDaysRange: { c: {} } });
}
function _onMsgMmrGetBootTimerDaysRange(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetBootTimerDaysRangeS;
    if (!data.getErrorCode()) {
        updateOnMsgMmrGetBootTimerDaysRange(data);
        dispatch(TypeId.MsgMmrGetBootTimerDaysRange, data);
    }
}

export function reqMmrSetBootTimerDaysRange(rangeForStd: number[], rangeForFog: number[]): void {
    send({ MsgMmrSetBootTimerDaysRange: { c: {
        rangeForStd : rangeForStd,
        rangeForFog : rangeForFog,
    } } });
}
function _onMsgMmrSetBootTimerDaysRange(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetBootTimerDaysRangeS;
    if (!data.getErrorCode()) {
        updateOnMsgMmrSetBootTimerDaysRange(data);
        dispatch(TypeId.MsgMmrSetBootTimerDaysRange, data);
    }
}

export function reqMmrGetRoomPublicInfo(roomId: number): void {
    send({ MsgMmrGetRoomPublicInfo: { c: {
        roomId,
    } }, });
}
async function _onMsgMmrGetRoomPublicInfo(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS;
    if (data.getErrorCode()) {
        updateOnFailedMsgMmrGetRoomPublicInfo(data);
    } else {
        await updateOnMsgMmrGetRoomPublicInfo(data);
        dispatch(TypeId.MsgMmrGetRoomPublicInfo, data);
    }
}

export function reqMmrGetJoinedRoomIdArray(): void {
    send({ MsgMmrGetJoinedRoomIdArray: { c: {
    }, }, });
}
function _onMsgMmrGetJoinedRoomIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetJoinedRoomIdArrayS;
    setJoinedRoomIdArray(data.getRoomIdArray());
    dispatch(TypeId.MsgMmrGetJoinedRoomIdArray, data);
}

export function reqMmrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    send({ MsgMmrSetBannedCoIdArray: { c: {
        roomId          : roomId,
        bannedCoIdArray : bannedCoIdArray,
    } }, });
}
async function _onMsgMmrSetBannedCoIdArray(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS;
    if (!data.getErrorCode()) {
        await updateOnMsgMmrSetBannedCoIdArray(data);
        dispatch(TypeId.MsgMmrSetBannedCoIdArray, data);
    }
}

export function reqMmrSetMaxConcurrentCount(maxCountForStd: number, maxCountForFog: number): void {
    send({ MsgMmrSetMaxConcurrentCount: { c: {
        maxCountForStd,
        maxCountForFog,
    } }, });
}
function _onMsgMmrSetMaxConcurrentCount(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetMaxConcurrentCountS;
    if (!data.getErrorCode()) {
        setMaxConcurrentCount(false, getExisted(data.getMaxCountForStd()));
        setMaxConcurrentCount(true, getExisted(data.getMaxCountForFog()));
        dispatch(TypeId.MsgMmrSetMaxConcurrentCount, data);
    }
}

export function reqMmrGetBannedNormalMapIdArray(): void {
    send({ MsgMmrGetBannedNormalMapIdArray: { c: {
    } } });
}
function _onMsgMmrGetBannedNormalMapIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetBannedNormalMapIdArrayS;
    if (!data.getErrorCode()) {
        updateOnMsgMmrGetBannedNormalMapIdArray(data);
        dispatch(TypeId.MsgMmrGetBannedNormalMapIdArray, data);
    }
}

export function reqMmrSetBannedNormalMapIdArray(normalMapIdArrayForStd: number[], normalMapIdArrayForFog: number[]): void {
    send({ MsgMmrSetBannedNormalMapIdArray: { c: {
        bannedNormalMapIdArrayForStd  : normalMapIdArrayForStd,
        bannedNormalMapIdArrayForFog  : normalMapIdArrayForFog,
    } } });
}
function _onMsgMmrSetBannedNormalMapIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedNormalMapIdArrayS;
    if (!data.getErrorCode()) {
        updateOnMsgMmrSetBannedNormalMapIdArray(data);
        dispatch(TypeId.MsgMmrSetBannedNormalMapIdArray, data);
    }
}

export function reqMmrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    send({ MsgMmrSetSelfSettings: { c: {
        roomId,
        coId,
        unitAndTileSkinId,
    }, }, });
}
async function _onMsgMmrSetSelfSettings(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS;
    if (!data.getErrorCode()) {
        await updateOnMsgMmrSetSelfSettings(data);
        dispatch(TypeId.MsgMmrSetSelfSettings, data);
    }
}

function _onMsgMmrDeleteRoomByServer(e: Event): void {
    const data = e.data as S;
    updateOnMsgMmrDeleteRoomByServer(data);
    dispatch(TypeId.MsgMmrDeleteRoomByServer, data);
}
