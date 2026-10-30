import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    MultiMatchRoom_Model_MmrModel,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as MmrDeleteRoomByServerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrDeleteRoomByServer/S.ts";
import type { S as MmrGetBannedNormalMapIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetBannedNormalMapIdArray/S.ts";
import type { S as MmrGetBootTimerDaysRangeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetBootTimerDaysRange/S.ts";
import type { S as MmrGetJoinedRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetJoinedRoomIdArray/S.ts";
import type { S as MmrGetMaxConcurrentCountResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetMaxConcurrentCount/S.ts";
import type { S as MmrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetRoomPublicInfo/S.ts";
import type { S as MmrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedCoIdArray/S.ts";
import type { S as MmrSetBannedNormalMapIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedNormalMapIdArray/S.ts";
import type { S as MmrSetBootTimerDaysRangeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBootTimerDaysRange/S.ts";
import type { S as MmrSetMaxConcurrentCountResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetMaxConcurrentCount/S.ts";
import type { S as MmrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetSelfSettings/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrGetMaxConcurrentCount,         callback: _onMsgMmrGetMaxConcurrentCount },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrGetRoomPublicInfo,             callback: _onMsgMmrGetRoomPublicInfo },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrGetJoinedRoomIdArray,          callback: _onMsgMmrGetJoinedRoomIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrSetBannedCoIdArray,            callback: _onMsgMmrSetBannedCoIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrSetMaxConcurrentCount,         callback: _onMsgMmrSetMaxConcurrentCount },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrGetBannedNormalMapIdArray,     callback: _onMsgMmrGetBannedNormalMapIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrSetBannedNormalMapIdArray,     callback: _onMsgMmrSetBannedNormalMapIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrGetBootTimerDaysRange,         callback: _onMsgMmrGetBootTimerDaysRange },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrSetBootTimerDaysRange,         callback: _onMsgMmrSetBootTimerDaysRange },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrSetSelfSettings,               callback: _onMsgMmrSetSelfSettings },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMmrDeleteRoomByServer,            callback: _onMsgMmrDeleteRoomByServer },
    ]);
}

export function reqMmrGetMaxConcurrentCount(): void {
    Networks_Manager.send({ MsgMmrGetMaxConcurrentCount: { c: {} } });
}
function _onMsgMmrGetMaxConcurrentCount(e: Egret_Egret.Event): void {
    const data = e.data as MmrGetMaxConcurrentCountResponse;
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.setMaxConcurrentCount(false, Helpers_Misc.getExisted(data.getMaxCountForStd()));
        MultiMatchRoom_Model_MmrModel.setMaxConcurrentCount(true, Helpers_Misc.getExisted(data.getMaxCountForFog()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrGetMaxConcurrentCount, data);
    }
}

export function reqMmrGetBootTimerDaysRange(): void {
    Networks_Manager.send({ MsgMmrGetBootTimerDaysRange: { c: {} } });
}
function _onMsgMmrGetBootTimerDaysRange(e: Egret_Egret.Event): void {
    const data = e.data as MmrGetBootTimerDaysRangeResponse;
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnMsgMmrGetBootTimerDaysRange(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrGetBootTimerDaysRange, data);
    }
}

export function reqMmrSetBootTimerDaysRange(rangeForStd: number[], rangeForFog: number[]): void {
    Networks_Manager.send({ MsgMmrSetBootTimerDaysRange: { c: {
        rangeForStd : rangeForStd,
        rangeForFog : rangeForFog,
    } } });
}
function _onMsgMmrSetBootTimerDaysRange(e: Egret_Egret.Event): void {
    const data = e.data as MmrSetBootTimerDaysRangeResponse;
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnMsgMmrSetBootTimerDaysRange(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrSetBootTimerDaysRange, data);
    }
}

export function reqMmrGetRoomPublicInfo(roomId: number): void {
    Networks_Manager.send({ MsgMmrGetRoomPublicInfo: { c: {
        roomId,
    } }, });
}
async function _onMsgMmrGetRoomPublicInfo(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmrGetRoomPublicInfoResponse;
    if (data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnFailedMsgMmrGetRoomPublicInfo(data);
    } else {
        await MultiMatchRoom_Model_MmrModel.updateOnMsgMmrGetRoomPublicInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrGetRoomPublicInfo, data);
    }
}

export function reqMmrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({ MsgMmrGetJoinedRoomIdArray: { c: {
    }, }, });
}
function _onMsgMmrGetJoinedRoomIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MmrGetJoinedRoomIdArrayResponse;
    MultiMatchRoom_Model_MmrModel.setJoinedRoomIdArray(data.getRoomIdArray());
    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrGetJoinedRoomIdArray, data);
}

export function reqMmrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    Networks_Manager.send({ MsgMmrSetBannedCoIdArray: { c: {
        roomId          : roomId,
        bannedCoIdArray : bannedCoIdArray,
    } }, });
}
async function _onMsgMmrSetBannedCoIdArray(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmrSetBannedCoIdArrayResponse;
    if (!data.getErrorCode()) {
        await MultiMatchRoom_Model_MmrModel.updateOnMsgMmrSetBannedCoIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrSetBannedCoIdArray, data);
    }
}

export function reqMmrSetMaxConcurrentCount(maxCountForStd: number, maxCountForFog: number): void {
    Networks_Manager.send({ MsgMmrSetMaxConcurrentCount: { c: {
        maxCountForStd,
        maxCountForFog,
    } }, });
}
function _onMsgMmrSetMaxConcurrentCount(e: Egret_Egret.Event): void {
    const data = e.data as MmrSetMaxConcurrentCountResponse;
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.setMaxConcurrentCount(false, Helpers_Misc.getExisted(data.getMaxCountForStd()));
        MultiMatchRoom_Model_MmrModel.setMaxConcurrentCount(true, Helpers_Misc.getExisted(data.getMaxCountForFog()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrSetMaxConcurrentCount, data);
    }
}

export function reqMmrGetBannedNormalMapIdArray(): void {
    Networks_Manager.send({ MsgMmrGetBannedNormalMapIdArray: { c: {
    } } });
}
function _onMsgMmrGetBannedNormalMapIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MmrGetBannedNormalMapIdArrayResponse;
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnMsgMmrGetBannedNormalMapIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrGetBannedNormalMapIdArray, data);
    }
}

export function reqMmrSetBannedNormalMapIdArray(normalMapIdArrayForStd: number[], normalMapIdArrayForFog: number[]): void {
    Networks_Manager.send({ MsgMmrSetBannedNormalMapIdArray: { c: {
        bannedNormalMapIdArrayForStd  : normalMapIdArrayForStd,
        bannedNormalMapIdArrayForFog  : normalMapIdArrayForFog,
    } } });
}
function _onMsgMmrSetBannedNormalMapIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MmrSetBannedNormalMapIdArrayResponse;
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnMsgMmrSetBannedNormalMapIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrSetBannedNormalMapIdArray, data);
    }
}

export function reqMmrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({ MsgMmrSetSelfSettings: { c: {
        roomId,
        coId,
        unitAndTileSkinId,
    }, }, });
}
async function _onMsgMmrSetSelfSettings(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MmrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        await MultiMatchRoom_Model_MmrModel.updateOnMsgMmrSetSelfSettings(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrSetSelfSettings, data);
    }
}

function _onMsgMmrDeleteRoomByServer(e: Egret_Egret.Event): void {
    const data = e.data as MmrDeleteRoomByServerResponse;
    MultiMatchRoom_Model_MmrModel.updateOnMsgMmrDeleteRoomByServer(data);
    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMmrDeleteRoomByServer, data);
}
