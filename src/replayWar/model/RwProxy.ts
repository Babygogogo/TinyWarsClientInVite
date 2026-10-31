import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    ReplayWar_Model_RwModel,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as ReplayGetAllInfoVersionsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetAllInfoVersions/S.ts";
import type { S as ReplayGetDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetData/S.ts";
import type { S as ReplayGetInfoVersionResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetInfoVersion/S.ts";
import type { S as ReplayGetReplayInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfo/S.ts";
import type { S as ReplayGetReplayInfoArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfoArray/S.ts";
import type { S as ReplayGetSelfRatingResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetSelfRating/S.ts";
import type { S as ReplaySetSelfRatingResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplaySetSelfRating/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        // { msgCode: NetMessageCodes.MsgReplayGetReplayIdArray,   callback: _onMsgReplayGetReplayIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgReplayGetData,            callback : _onMsgReplayGetData },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgReplayGetReplayInfo,      callback : _onMsgReplayGetReplayInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgReplayGetReplayInfoArray, callback : _onMsgReplayGetReplayInfoArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgReplayGetSelfRating,      callback : _onMsgReplayGetSelfRating },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgReplaySetSelfRating,      callback : _onMsgReplaySetSelfRating },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgReplayGetAllInfoVersions, callback : _onMsgReplayGetAllInfoVersions },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgReplayGetInfoVersion,     callback : _onMsgReplayGetInfoVersion },
    ], null);
}

export function reqReplayGetData(replayId: number): void {
    Networks_Manager.send({
        MsgReplayGetData : {
            c : {
                replayId,
            }, 
        },
    });
}
async function _onMsgReplayGetData(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgReplayGetData"]>): Promise<void> {
    const data = e.data as ReplayGetDataResponse;
    if (data.getErrorCode()) {
        ReplayWar_Model_RwModel.updateOnFailedMsgReplayGetData(data);
    } else {
        await ReplayWar_Model_RwModel.updateOnMsgReplayGetData(data);
        Notifications_Dispatcher.dispatch("MsgReplayGetData", { msg: data });
    }
}

export function reqReplayGetReplayInfo(replayId: number): void {
    Networks_Manager.send({
        MsgReplayGetReplayInfo : {
            c : {
                replayId,
            }, 
        },
    });
}
async function _onMsgReplayGetReplayInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgReplayGetReplayInfo"]>): Promise<void> {
    const data = e.data as ReplayGetReplayInfoResponse;
    if (data.getErrorCode()) {
        ReplayWar_Model_RwModel.updateOnFailedMsgReplayGetReplayInfo(data);
    } else {
        await ReplayWar_Model_RwModel.updateOnMsgReplayGetReplayInfo(data);
        Notifications_Dispatcher.dispatch("MsgReplayGetReplayInfo", { msg: data });
    }
}

export function reqReplayGetReplayInfoArray(replayIdArray: number[]): void {
    Networks_Manager.send({
        MsgReplayGetReplayInfoArray : {
            c : {
                replayIdArray : replayIdArray,
            }, 
        }, 
    });
}
async function _onMsgReplayGetReplayInfoArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgReplayGetReplayInfoArray"]>): Promise<void> {
    const data = e.data as ReplayGetReplayInfoArrayResponse;
    if (!data.getErrorCode()) {
        await ReplayWar_Model_RwModel.updateOnMsgReplayGetReplayInfoArray(data);
        Notifications_Dispatcher.dispatch("MsgReplayGetReplayInfoArray", { msg: data });
    }
}

export function reqReplayGetSelfRating(replayId: number): void {
    Networks_Manager.send({
        MsgReplayGetSelfRating : {
            c : {
                replayId,
            }, 
        },
    });
}
function _onMsgReplayGetSelfRating(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgReplayGetSelfRating"]>): void {
    const data = e.data as ReplayGetSelfRatingResponse;
    if (data.getErrorCode()) {
        ReplayWar_Model_RwModel.updateOnFailedMsgReplayGetSelfRating(data);
    } else {
        ReplayWar_Model_RwModel.updateOnMsgReplayGetSelfRating(data);
        Notifications_Dispatcher.dispatch("MsgReplayGetSelfRating", { msg: data });
    }
}

export function reqReplaySetSelfRating(replayId: number, rating: number): void {
    Networks_Manager.send({
        MsgReplaySetSelfRating : {
            c : {
                replayId,
                rating,
            }, 
        },
    });
}
function _onMsgReplaySetSelfRating(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgReplaySetSelfRating"]>): void {
    const data = e.data as ReplaySetSelfRatingResponse;
    if (!data.getErrorCode()) {
        ReplayWar_Model_RwModel.updateOnMsgReplaySetSelfRating(data);
        Notifications_Dispatcher.dispatch("MsgReplaySetSelfRating", { msg: data });
    }
}

export function reqReplayGetAllInfoVersions(): void {
    Networks_Manager.send({
        MsgReplayGetAllInfoVersions : {
            c : {
            }, 
        }, 
    });
}
async function _onMsgReplayGetAllInfoVersions(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgReplayGetAllInfoVersions"]>): Promise<void> {
    const data = e.data as ReplayGetAllInfoVersionsResponse;
    if (!data.getErrorCode()) {
        await ReplayWar_Model_RwModel.updateOnMsgReplayGetAllInfoVersions(data);
        Notifications_Dispatcher.dispatch("MsgReplayGetAllInfoVersions", { msg: data });
    }
}

export function reqMsgReplayGetInfoVersion(replayId: number): void {
    Networks_Manager.send({
        MsgReplayGetInfoVersion : {
            c : {
                replayId : replayId,
            }, 
        }, 
    });
}
async function _onMsgReplayGetInfoVersion(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgReplayGetInfoVersion"]>): Promise<void> {
    const data = e.data as ReplayGetInfoVersionResponse;
    if (data.getErrorCode()) {
        ReplayWar_Model_RwModel.updateOnFailedMsgReplayGetInfoVersion(data);
    } else {
        await ReplayWar_Model_RwModel.updateOnMsgReplayGetInfoVersion(data);
        Notifications_Dispatcher.dispatch("MsgReplayGetInfoVersion", { msg: data });
    }
}
