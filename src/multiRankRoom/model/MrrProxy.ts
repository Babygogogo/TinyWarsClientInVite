import { getExisted } from "../../helpers/Misc.ts";
import {
    setMaxConcurrentCount,
    setAdditionalMaxDifferenceInScore,
    updateOnMsgMrrGetBootTimerDaysRange,
    updateOnMsgMrrSetBootTimerDaysRange,
    updateOnFailedMsgMrrGetRoomPublicInfo,
    updateOnMsgMrrGetRoomPublicInfo,
    setJoinedRoomIdArray,
    updateOnMsgMrrSetBannedCoIdArray,
    updateOnMsgMrrGetBannedNormalMapIdArray,
    updateOnMsgMrrSetBannedNormalMapIdArray,
    updateOnMsgMrrSetSelfSettings,
    updateOnMsgMrrDeleteRoomByServer,
} from "./MrrModel.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as MrrDeleteRoomByServerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrDeleteRoomByServer/S.ts";
import type { S as MrrGetBannedNormalMapIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetBannedNormalMapIdArray/S.ts";
import type { S as MrrGetBootTimerDaysRangeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetBootTimerDaysRange/S.ts";
import type { S as MrrGetJoinedRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetJoinedRoomIdArray/S.ts";
import type { S as MrrGetMaxConcurrentCountResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetMaxConcurrentCount/S.ts";
import type { S as MrrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetRoomPublicInfo/S.ts";
import type { S as MrrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedCoIdArray/S.ts";
import type { S as MrrSetBannedNormalMapIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedNormalMapIdArray/S.ts";
import type { S as MrrSetBootTimerDaysRangeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBootTimerDaysRange/S.ts";
import type { S as MrrSetMaxConcurrentCountResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetMaxConcurrentCount/S.ts";
import type { S as MrrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetSelfSettings/S.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgMrrGetMaxConcurrentCount,         callback: _onMsgMrrGetMaxConcurrentCount },
        { msgCode: MessageCodes.MsgMrrGetRoomPublicInfo,             callback: _onMsgMrrGetRoomPublicInfo },
        { msgCode: MessageCodes.MsgMrrGetJoinedRoomIdArray,          callback: _onMsgMrrGetJoinedRoomIdArray },
        { msgCode: MessageCodes.MsgMrrSetBannedCoIdArray,            callback: _onMsgMrrSetBannedCoIdArray },
        { msgCode: MessageCodes.MsgMrrSetMaxConcurrentCount,         callback: _onMsgMrrSetMaxConcurrentCount },
        { msgCode: MessageCodes.MsgMrrGetBannedNormalMapIdArray,     callback: _onMsgMrrGetBannedNormalMapIdArray },
        { msgCode: MessageCodes.MsgMrrSetBannedNormalMapIdArray,     callback: _onMsgMrrSetBannedNormalMapIdArray },
        { msgCode: MessageCodes.MsgMrrGetBootTimerDaysRange,         callback: _onMsgMrrGetBootTimerDaysRange },
        { msgCode: MessageCodes.MsgMrrSetBootTimerDaysRange,         callback: _onMsgMrrSetBootTimerDaysRange },
        { msgCode: MessageCodes.MsgMrrSetSelfSettings,               callback: _onMsgMrrSetSelfSettings },
        { msgCode: MessageCodes.MsgMrrDeleteRoomByServer,            callback: _onMsgMrrDeleteRoomByServer },
    ]);
}

export function reqMrrGetMaxConcurrentCount(): void {
    send({ MsgMrrGetMaxConcurrentCount: { c: {} } });
}
function _onMsgMrrGetMaxConcurrentCount(e: Event): void {
    const data = e.data as MrrGetMaxConcurrentCountResponse;
    if (!data.getErrorCode()) {
        setMaxConcurrentCount(false, getExisted(data.getMaxCountForStd()));
        setMaxConcurrentCount(true, getExisted(data.getMaxCountForFog()));
        setAdditionalMaxDifferenceInScore(false, data.getAdditionalMaxDifferenceInScoreForStd() ?? 0);
        setAdditionalMaxDifferenceInScore(true, data.getAdditionalMaxDifferenceInScoreForFog() ?? 0);
        dispatch(TypeId.MsgMrrGetMaxConcurrentCount, data);
    }
}

export function reqMrrGetBootTimerDaysRange(): void {
    send({ MsgMrrGetBootTimerDaysRange: { c: {} } });
}
function _onMsgMrrGetBootTimerDaysRange(e: Event): void {
    const data = e.data as MrrGetBootTimerDaysRangeResponse;
    if (!data.getErrorCode()) {
        updateOnMsgMrrGetBootTimerDaysRange(data);
        dispatch(TypeId.MsgMrrGetBootTimerDaysRange, data);
    }
}

export function reqMrrSetBootTimerDaysRange(rangeForStd: number[], rangeForFog: number[]): void {
    send({ MsgMrrSetBootTimerDaysRange: { c: {
        rangeForStd : rangeForStd,
        rangeForFog : rangeForFog,
    } } });
}
function _onMsgMrrSetBootTimerDaysRange(e: Event): void {
    const data = e.data as MrrSetBootTimerDaysRangeResponse;
    if (!data.getErrorCode()) {
        updateOnMsgMrrSetBootTimerDaysRange(data);
        dispatch(TypeId.MsgMrrSetBootTimerDaysRange, data);
    }
}

export function reqMrrGetRoomPublicInfo(roomId: number): void {
    send({ MsgMrrGetRoomPublicInfo: { c: {
        roomId,
    } }, });
}
async function _onMsgMrrGetRoomPublicInfo(e: Event): Promise<void> {
    const data = e.data as MrrGetRoomPublicInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgMrrGetRoomPublicInfo(data);
    } else {
        await updateOnMsgMrrGetRoomPublicInfo(data);
        dispatch(TypeId.MsgMrrGetRoomPublicInfo, data);
    }
}

export function reqMrrGetJoinedRoomIdArray(): void {
    send({ MsgMrrGetJoinedRoomIdArray: { c: {
    }, }, });
}
function _onMsgMrrGetJoinedRoomIdArray(e: Event): void {
    const data = e.data as MrrGetJoinedRoomIdArrayResponse;
    setJoinedRoomIdArray(data.getRoomIdArray());
    dispatch(TypeId.MsgMrrGetJoinedRoomIdArray, data);
}

export function reqMrrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    send({ MsgMrrSetBannedCoIdArray: { c: {
        roomId          : roomId,
        bannedCoIdArray : bannedCoIdArray,
    } }, });
}
async function _onMsgMrrSetBannedCoIdArray(e: Event): Promise<void> {
    const data = e.data as MrrSetBannedCoIdArrayResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMrrSetBannedCoIdArray(data);
        dispatch(TypeId.MsgMrrSetBannedCoIdArray, data);
    }
}

export function reqMrrSetMaxConcurrentCount({ maxCountForStd, maxCountForFog, additionalMaxDifferenceInScoreForStd, additionalMaxDifferenceInScoreForFog }: {
    maxCountForStd                          : number;
    maxCountForFog                          : number;
    additionalMaxDifferenceInScoreForStd    : number;
    additionalMaxDifferenceInScoreForFog    : number;
}): void {
    send({ MsgMrrSetMaxConcurrentCount: { c: {
        maxCountForStd                          : maxCountForStd,
        maxCountForFog                          : maxCountForFog,
        additionalMaxDifferenceInScoreForStd    : additionalMaxDifferenceInScoreForStd,
        additionalMaxDifferenceInScoreForFog    : additionalMaxDifferenceInScoreForFog,
    } }, });
}
function _onMsgMrrSetMaxConcurrentCount(e: Event): void {
    const data = e.data as MrrSetMaxConcurrentCountResponse;
    if (!data.getErrorCode()) {
        setMaxConcurrentCount(false, getExisted(data.getMaxCountForStd()));
        setMaxConcurrentCount(true, getExisted(data.getMaxCountForFog()));
        setAdditionalMaxDifferenceInScore(false, data.getAdditionalMaxDifferenceInScoreForStd() ?? 0);
        setAdditionalMaxDifferenceInScore(true, data.getAdditionalMaxDifferenceInScoreForFog() ?? 0);
        dispatch(TypeId.MsgMrrSetMaxConcurrentCount, data);
    }
}

export function reqMrrGetBannedNormalMapIdArray(): void {
    send({ MsgMrrGetBannedNormalMapIdArray: { c: {
    } } });
}
function _onMsgMrrGetBannedNormalMapIdArray(e: Event): void {
    const data = e.data as MrrGetBannedNormalMapIdArrayResponse;
    if (!data.getErrorCode()) {
        updateOnMsgMrrGetBannedNormalMapIdArray(data);
        dispatch(TypeId.MsgMrrGetBannedNormalMapIdArray, data);
    }
}

export function reqMrrSetBannedNormalMapIdArray(normalMapIdArrayForStd: number[], normalMapIdArrayForFog: number[]): void {
    send({ MsgMrrSetBannedNormalMapIdArray: { c: {
        bannedNormalMapIdArrayForStd  : normalMapIdArrayForStd,
        bannedNormalMapIdArrayForFog  : normalMapIdArrayForFog,
    } } });
}
function _onMsgMrrSetBannedNormalMapIdArray(e: Event): void {
    const data = e.data as MrrSetBannedNormalMapIdArrayResponse;
    if (!data.getErrorCode()) {
        updateOnMsgMrrSetBannedNormalMapIdArray(data);
        dispatch(TypeId.MsgMrrSetBannedNormalMapIdArray, data);
    }
}

export function reqMrrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    send({ MsgMrrSetSelfSettings: { c: {
        roomId,
        coId,
        unitAndTileSkinId,
    }, }, });
}
async function _onMsgMrrSetSelfSettings(e: Event): Promise<void> {
    const data = e.data as MrrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgMrrSetSelfSettings(data);
        dispatch(TypeId.MsgMrrSetSelfSettings, data);
    }
}

function _onMsgMrrDeleteRoomByServer(e: Event): void {
    const data = e.data as MrrDeleteRoomByServerResponse;
    updateOnMsgMrrDeleteRoomByServer(data);
    dispatch(TypeId.MsgMrrDeleteRoomByServer, data);
}
