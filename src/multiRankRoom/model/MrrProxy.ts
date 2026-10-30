import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    MultiRankRoom_Model_MrrModel,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
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

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrGetMaxConcurrentCount,         callback: _onMsgMrrGetMaxConcurrentCount },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrGetRoomPublicInfo,             callback: _onMsgMrrGetRoomPublicInfo },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrGetJoinedRoomIdArray,          callback: _onMsgMrrGetJoinedRoomIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrSetBannedCoIdArray,            callback: _onMsgMrrSetBannedCoIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrSetMaxConcurrentCount,         callback: _onMsgMrrSetMaxConcurrentCount },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrGetBannedNormalMapIdArray,     callback: _onMsgMrrGetBannedNormalMapIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrSetBannedNormalMapIdArray,     callback: _onMsgMrrSetBannedNormalMapIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrGetBootTimerDaysRange,         callback: _onMsgMrrGetBootTimerDaysRange },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrSetBootTimerDaysRange,         callback: _onMsgMrrSetBootTimerDaysRange },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrSetSelfSettings,               callback: _onMsgMrrSetSelfSettings },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMrrDeleteRoomByServer,            callback: _onMsgMrrDeleteRoomByServer },
    ]);
}

export function reqMrrGetMaxConcurrentCount(): void {
    Networks_Manager.send({ MsgMrrGetMaxConcurrentCount: { c: {} } });
}
function _onMsgMrrGetMaxConcurrentCount(e: Egret_Egret.Event): void {
    const data = e.data as MrrGetMaxConcurrentCountResponse;
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.setMaxConcurrentCount(false, Helpers_Misc.getExisted(data.getMaxCountForStd()));
        MultiRankRoom_Model_MrrModel.setMaxConcurrentCount(true, Helpers_Misc.getExisted(data.getMaxCountForFog()));
        MultiRankRoom_Model_MrrModel.setAdditionalMaxDifferenceInScore(false, data.getAdditionalMaxDifferenceInScoreForStd() ?? 0);
        MultiRankRoom_Model_MrrModel.setAdditionalMaxDifferenceInScore(true, data.getAdditionalMaxDifferenceInScoreForFog() ?? 0);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrGetMaxConcurrentCount, data);
    }
}

export function reqMrrGetBootTimerDaysRange(): void {
    Networks_Manager.send({ MsgMrrGetBootTimerDaysRange: { c: {} } });
}
function _onMsgMrrGetBootTimerDaysRange(e: Egret_Egret.Event): void {
    const data = e.data as MrrGetBootTimerDaysRangeResponse;
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnMsgMrrGetBootTimerDaysRange(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrGetBootTimerDaysRange, data);
    }
}

export function reqMrrSetBootTimerDaysRange(rangeForStd: number[], rangeForFog: number[]): void {
    Networks_Manager.send({ MsgMrrSetBootTimerDaysRange: { c: {
        rangeForStd : rangeForStd,
        rangeForFog : rangeForFog,
    } } });
}
function _onMsgMrrSetBootTimerDaysRange(e: Egret_Egret.Event): void {
    const data = e.data as MrrSetBootTimerDaysRangeResponse;
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnMsgMrrSetBootTimerDaysRange(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrSetBootTimerDaysRange, data);
    }
}

export function reqMrrGetRoomPublicInfo(roomId: number): void {
    Networks_Manager.send({ MsgMrrGetRoomPublicInfo: { c: {
        roomId,
    } }, });
}
async function _onMsgMrrGetRoomPublicInfo(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MrrGetRoomPublicInfoResponse;
    if (data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnFailedMsgMrrGetRoomPublicInfo(data);
    } else {
        await MultiRankRoom_Model_MrrModel.updateOnMsgMrrGetRoomPublicInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrGetRoomPublicInfo, data);
    }
}

export function reqMrrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({ MsgMrrGetJoinedRoomIdArray: { c: {
    }, }, });
}
function _onMsgMrrGetJoinedRoomIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MrrGetJoinedRoomIdArrayResponse;
    MultiRankRoom_Model_MrrModel.setJoinedRoomIdArray(data.getRoomIdArray());
    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrGetJoinedRoomIdArray, data);
}

export function reqMrrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    Networks_Manager.send({ MsgMrrSetBannedCoIdArray: { c: {
        roomId          : roomId,
        bannedCoIdArray : bannedCoIdArray,
    } }, });
}
async function _onMsgMrrSetBannedCoIdArray(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MrrSetBannedCoIdArrayResponse;
    if (!data.getErrorCode()) {
        await MultiRankRoom_Model_MrrModel.updateOnMsgMrrSetBannedCoIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrSetBannedCoIdArray, data);
    }
}

export function reqMrrSetMaxConcurrentCount({ maxCountForStd, maxCountForFog, additionalMaxDifferenceInScoreForStd, additionalMaxDifferenceInScoreForFog }: {
    maxCountForStd                          : number;
    maxCountForFog                          : number;
    additionalMaxDifferenceInScoreForStd    : number;
    additionalMaxDifferenceInScoreForFog    : number;
}): void {
    Networks_Manager.send({ MsgMrrSetMaxConcurrentCount: { c: {
        maxCountForStd                          : maxCountForStd,
        maxCountForFog                          : maxCountForFog,
        additionalMaxDifferenceInScoreForStd    : additionalMaxDifferenceInScoreForStd,
        additionalMaxDifferenceInScoreForFog    : additionalMaxDifferenceInScoreForFog,
    } }, });
}
function _onMsgMrrSetMaxConcurrentCount(e: Egret_Egret.Event): void {
    const data = e.data as MrrSetMaxConcurrentCountResponse;
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.setMaxConcurrentCount(false, Helpers_Misc.getExisted(data.getMaxCountForStd()));
        MultiRankRoom_Model_MrrModel.setMaxConcurrentCount(true, Helpers_Misc.getExisted(data.getMaxCountForFog()));
        MultiRankRoom_Model_MrrModel.setAdditionalMaxDifferenceInScore(false, data.getAdditionalMaxDifferenceInScoreForStd() ?? 0);
        MultiRankRoom_Model_MrrModel.setAdditionalMaxDifferenceInScore(true, data.getAdditionalMaxDifferenceInScoreForFog() ?? 0);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrSetMaxConcurrentCount, data);
    }
}

export function reqMrrGetBannedNormalMapIdArray(): void {
    Networks_Manager.send({ MsgMrrGetBannedNormalMapIdArray: { c: {
    } } });
}
function _onMsgMrrGetBannedNormalMapIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MrrGetBannedNormalMapIdArrayResponse;
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnMsgMrrGetBannedNormalMapIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrGetBannedNormalMapIdArray, data);
    }
}

export function reqMrrSetBannedNormalMapIdArray(normalMapIdArrayForStd: number[], normalMapIdArrayForFog: number[]): void {
    Networks_Manager.send({ MsgMrrSetBannedNormalMapIdArray: { c: {
        bannedNormalMapIdArrayForStd  : normalMapIdArrayForStd,
        bannedNormalMapIdArrayForFog  : normalMapIdArrayForFog,
    } } });
}
function _onMsgMrrSetBannedNormalMapIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MrrSetBannedNormalMapIdArrayResponse;
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnMsgMrrSetBannedNormalMapIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrSetBannedNormalMapIdArray, data);
    }
}

export function reqMrrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({ MsgMrrSetSelfSettings: { c: {
        roomId,
        coId,
        unitAndTileSkinId,
    }, }, });
}
async function _onMsgMrrSetSelfSettings(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MrrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        await MultiRankRoom_Model_MrrModel.updateOnMsgMrrSetSelfSettings(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrSetSelfSettings, data);
    }
}

function _onMsgMrrDeleteRoomByServer(e: Egret_Egret.Event): void {
    const data = e.data as MrrDeleteRoomByServerResponse;
    MultiRankRoom_Model_MrrModel.updateOnMsgMrrDeleteRoomByServer(data);
    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMrrDeleteRoomByServer, data);
}
