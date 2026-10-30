import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as ReplayGetAllInfoVersionsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetAllInfoVersions/S.ts";
import type { S as ReplayGetDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetData/S.ts";
import type { S as ReplayGetInfoVersionResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetInfoVersion/S.ts";
import type { S as ReplayGetReplayInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfo/S.ts";
import type { S as ReplayGetReplayInfoArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfoArray/S.ts";
import type { S as ReplayGetSelfRatingResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetSelfRating/S.ts";
import type { S as ReplaySetSelfRatingResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplaySetSelfRating/S.ts";
import {
    updateOnFailedMsgReplayGetData,
    updateOnMsgReplayGetData,
    updateOnFailedMsgReplayGetReplayInfo,
    updateOnMsgReplayGetReplayInfo,
    updateOnMsgReplayGetReplayInfoArray,
    updateOnFailedMsgReplayGetSelfRating,
    updateOnMsgReplayGetSelfRating,
    updateOnMsgReplaySetSelfRating,
    updateOnMsgReplayGetAllInfoVersions,
    updateOnFailedMsgReplayGetInfoVersion,
    updateOnMsgReplayGetInfoVersion,
} from "./RwModel.ts";
import type { Event } from "../../egret/Egret.ts";

export function init(): void {
    addListeners([
        // { msgCode: NetMessageCodes.MsgReplayGetReplayIdArray,   callback: _onMsgReplayGetReplayIdArray },
        { msgCode: MessageCodes.MsgReplayGetData,            callback: _onMsgReplayGetData },
        { msgCode: MessageCodes.MsgReplayGetReplayInfo,      callback: _onMsgReplayGetReplayInfo },
        { msgCode: MessageCodes.MsgReplayGetReplayInfoArray, callback: _onMsgReplayGetReplayInfoArray },
        { msgCode: MessageCodes.MsgReplayGetSelfRating,      callback: _onMsgReplayGetSelfRating },
        { msgCode: MessageCodes.MsgReplaySetSelfRating,      callback: _onMsgReplaySetSelfRating },
        { msgCode: MessageCodes.MsgReplayGetAllInfoVersions, callback: _onMsgReplayGetAllInfoVersions },
        { msgCode: MessageCodes.MsgReplayGetInfoVersion,     callback: _onMsgReplayGetInfoVersion },
    ], null);
}

export function reqReplayGetData(replayId: number): void {
    send({
        MsgReplayGetData: { c: {
            replayId,
        }, },
    });
}
async function _onMsgReplayGetData(e: Event): Promise<void> {
    const data = e.data as ReplayGetDataResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgReplayGetData(data);
    } else {
        await updateOnMsgReplayGetData(data);
        dispatch(TypeId.MsgReplayGetData, data);
    }
}

export function reqReplayGetReplayInfo(replayId: number): void {
    send({
        MsgReplayGetReplayInfo: { c: {
            replayId,
        }, },
    });
}
async function _onMsgReplayGetReplayInfo(e: Event): Promise<void> {
    const data = e.data as ReplayGetReplayInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgReplayGetReplayInfo(data);
    } else {
        await updateOnMsgReplayGetReplayInfo(data);
        dispatch(TypeId.MsgReplayGetReplayInfo, data);
    }
}

export function reqReplayGetReplayInfoArray(replayIdArray: number[]): void {
    send({ MsgReplayGetReplayInfoArray: { c: {
        replayIdArray: replayIdArray,
    }, }, });
}
async function _onMsgReplayGetReplayInfoArray(e: Event): Promise<void> {
    const data = e.data as ReplayGetReplayInfoArrayResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgReplayGetReplayInfoArray(data);
        dispatch(TypeId.MsgReplayGetReplayInfoArray, data);
    }
}

export function reqReplayGetSelfRating(replayId: number): void {
    send({
        MsgReplayGetSelfRating: { c: {
            replayId,
        }, },
    });
}
function _onMsgReplayGetSelfRating(e: Event): void {
    const data = e.data as ReplayGetSelfRatingResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgReplayGetSelfRating(data);
    } else {
        updateOnMsgReplayGetSelfRating(data);
        dispatch(TypeId.MsgReplayGetSelfRating, data);
    }
}

export function reqReplaySetSelfRating(replayId: number, rating: number): void {
    send({
        MsgReplaySetSelfRating: { c: {
            replayId,
            rating,
        }, },
    });
}
function _onMsgReplaySetSelfRating(e: Event): void {
    const data = e.data as ReplaySetSelfRatingResponse;
    if (!data.getErrorCode()) {
        updateOnMsgReplaySetSelfRating(data);
        dispatch(TypeId.MsgReplaySetSelfRating, data);
    }
}

export function reqReplayGetAllInfoVersions(): void {
    send({ MsgReplayGetAllInfoVersions: { c: {
    }, }, });
}
async function _onMsgReplayGetAllInfoVersions(e: Event): Promise<void> {
    const data = e.data as ReplayGetAllInfoVersionsResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgReplayGetAllInfoVersions(data);
        dispatch(TypeId.MsgReplayGetAllInfoVersions, data);
    }
}

export function reqMsgReplayGetInfoVersion(replayId: number): void {
    send({ MsgReplayGetInfoVersion: { c: {
        replayId    : replayId,
    } } });
}
async function _onMsgReplayGetInfoVersion(e: Event): Promise<void> {
    const data = e.data as ReplayGetInfoVersionResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgReplayGetInfoVersion(data);
    } else {
        await updateOnMsgReplayGetInfoVersion(data);
        dispatch(TypeId.MsgReplayGetInfoVersion, data);
    }
}
