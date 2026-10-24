import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetAllInfoVersionsS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetAllInfoVersions/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetDataS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetInfoVersionS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetInfoVersion/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoArrayS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfoArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetSelfRatingS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetSelfRating/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplaySetSelfRatingS from "../../proto/schema/CommonProto/NetMessage/MsgReplaySetSelfRating/S.ts";
import * as ReplayWarModelRwModel from "./RwModel.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        // { msgCode: NetMessageCodes.MsgReplayGetReplayIdArray,   callback: _onMsgReplayGetReplayIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgReplayGetData,            callback: _onMsgReplayGetData },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgReplayGetReplayInfo,      callback: _onMsgReplayGetReplayInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgReplayGetReplayInfoArray, callback: _onMsgReplayGetReplayInfoArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgReplayGetSelfRating,      callback: _onMsgReplayGetSelfRating },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgReplaySetSelfRating,      callback: _onMsgReplaySetSelfRating },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgReplayGetAllInfoVersions, callback: _onMsgReplayGetAllInfoVersions },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgReplayGetInfoVersion,     callback: _onMsgReplayGetInfoVersion },
    ], null);
}

export function reqReplayGetData(replayId: number): void {
    NetworksManager.send({
        MsgReplayGetData: { c: {
            replayId,
        }, },
    });
}
async function _onMsgReplayGetData(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgReplayGetDataS.S;
    if (data.getErrorCode()) {
        ReplayWarModelRwModel.updateOnFailedMsgReplayGetData(data);
    } else {
        await ReplayWarModelRwModel.updateOnMsgReplayGetData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgReplayGetData, data);
    }
}

export function reqReplayGetReplayInfo(replayId: number): void {
    NetworksManager.send({
        MsgReplayGetReplayInfo: { c: {
            replayId,
        }, },
    });
}
async function _onMsgReplayGetReplayInfo(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoS.S;
    if (data.getErrorCode()) {
        ReplayWarModelRwModel.updateOnFailedMsgReplayGetReplayInfo(data);
    } else {
        await ReplayWarModelRwModel.updateOnMsgReplayGetReplayInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgReplayGetReplayInfo, data);
    }
}

export function reqReplayGetReplayInfoArray(replayIdArray: number[]): void {
    NetworksManager.send({ MsgReplayGetReplayInfoArray: { c: {
        replayIdArray: replayIdArray,
    }, }, });
}
async function _onMsgReplayGetReplayInfoArray(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoArrayS.S;
    if (!data.getErrorCode()) {
        await ReplayWarModelRwModel.updateOnMsgReplayGetReplayInfoArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgReplayGetReplayInfoArray, data);
    }
}

export function reqReplayGetSelfRating(replayId: number): void {
    NetworksManager.send({
        MsgReplayGetSelfRating: { c: {
            replayId,
        }, },
    });
}
function _onMsgReplayGetSelfRating(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgReplayGetSelfRatingS.S;
    if (data.getErrorCode()) {
        ReplayWarModelRwModel.updateOnFailedMsgReplayGetSelfRating(data);
    } else {
        ReplayWarModelRwModel.updateOnMsgReplayGetSelfRating(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgReplayGetSelfRating, data);
    }
}

export function reqReplaySetSelfRating(replayId: number, rating: number): void {
    NetworksManager.send({
        MsgReplaySetSelfRating: { c: {
            replayId,
            rating,
        }, },
    });
}
function _onMsgReplaySetSelfRating(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgReplaySetSelfRatingS.S;
    if (!data.getErrorCode()) {
        ReplayWarModelRwModel.updateOnMsgReplaySetSelfRating(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgReplaySetSelfRating, data);
    }
}

export function reqReplayGetAllInfoVersions(): void {
    NetworksManager.send({ MsgReplayGetAllInfoVersions: { c: {
    }, }, });
}
async function _onMsgReplayGetAllInfoVersions(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgReplayGetAllInfoVersionsS.S;
    if (!data.getErrorCode()) {
        await ReplayWarModelRwModel.updateOnMsgReplayGetAllInfoVersions(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgReplayGetAllInfoVersions, data);
    }
}

export function reqMsgReplayGetInfoVersion(replayId: number): void {
    NetworksManager.send({ MsgReplayGetInfoVersion: { c: {
        replayId    : replayId,
    } } });
}
async function _onMsgReplayGetInfoVersion(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgReplayGetInfoVersionS.S;
    if (data.getErrorCode()) {
        ReplayWarModelRwModel.updateOnFailedMsgReplayGetInfoVersion(data);
    } else {
        await ReplayWarModelRwModel.updateOnMsgReplayGetInfoVersion(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgReplayGetInfoVersion, data);
    }
}
