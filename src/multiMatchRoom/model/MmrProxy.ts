import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiMatchRoomModelMmrModel from "./MmrModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrDeleteRoomByServerS from "../../proto/schema/CommonProto/NetMessage/MsgMmrDeleteRoomByServer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetBannedNormalMapIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetBannedNormalMapIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetBootTimerDaysRangeS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetBootTimerDaysRange/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetJoinedRoomIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetJoinedRoomIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetMaxConcurrentCountS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetMaxConcurrentCount/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetRoomPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedCoIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedNormalMapIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedNormalMapIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetBootTimerDaysRangeS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBootTimerDaysRange/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetMaxConcurrentCountS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetMaxConcurrentCount/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetSelfSettings/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrGetMaxConcurrentCount,         callback: _onMsgMmrGetMaxConcurrentCount },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrGetRoomPublicInfo,             callback: _onMsgMmrGetRoomPublicInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrGetJoinedRoomIdArray,          callback: _onMsgMmrGetJoinedRoomIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrSetBannedCoIdArray,            callback: _onMsgMmrSetBannedCoIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrSetMaxConcurrentCount,         callback: _onMsgMmrSetMaxConcurrentCount },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrGetBannedNormalMapIdArray,     callback: _onMsgMmrGetBannedNormalMapIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrSetBannedNormalMapIdArray,     callback: _onMsgMmrSetBannedNormalMapIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrGetBootTimerDaysRange,         callback: _onMsgMmrGetBootTimerDaysRange },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrSetBootTimerDaysRange,         callback: _onMsgMmrSetBootTimerDaysRange },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrSetSelfSettings,               callback: _onMsgMmrSetSelfSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMmrDeleteRoomByServer,            callback: _onMsgMmrDeleteRoomByServer },
    ]);
}

export function reqMmrGetMaxConcurrentCount(): void {
    NetworksManager.send({ MsgMmrGetMaxConcurrentCount: { c: {} } });
}
function _onMsgMmrGetMaxConcurrentCount(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetMaxConcurrentCountS.S;
    if (!data.getErrorCode()) {
        MultiMatchRoomModelMmrModel.setMaxConcurrentCount(false, HelpersMisc.getExisted(data.getMaxCountForStd()));
        MultiMatchRoomModelMmrModel.setMaxConcurrentCount(true, HelpersMisc.getExisted(data.getMaxCountForFog()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrGetMaxConcurrentCount, data);
    }
}

export function reqMmrGetBootTimerDaysRange(): void {
    NetworksManager.send({ MsgMmrGetBootTimerDaysRange: { c: {} } });
}
function _onMsgMmrGetBootTimerDaysRange(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetBootTimerDaysRangeS.S;
    if (!data.getErrorCode()) {
        MultiMatchRoomModelMmrModel.updateOnMsgMmrGetBootTimerDaysRange(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrGetBootTimerDaysRange, data);
    }
}

export function reqMmrSetBootTimerDaysRange(rangeForStd: number[], rangeForFog: number[]): void {
    NetworksManager.send({ MsgMmrSetBootTimerDaysRange: { c: {
        rangeForStd : rangeForStd,
        rangeForFog : rangeForFog,
    } } });
}
function _onMsgMmrSetBootTimerDaysRange(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetBootTimerDaysRangeS.S;
    if (!data.getErrorCode()) {
        MultiMatchRoomModelMmrModel.updateOnMsgMmrSetBootTimerDaysRange(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrSetBootTimerDaysRange, data);
    }
}

export function reqMmrGetRoomPublicInfo(roomId: number): void {
    NetworksManager.send({ MsgMmrGetRoomPublicInfo: { c: {
        roomId,
    } }, });
}
async function _onMsgMmrGetRoomPublicInfo(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS.S;
    if (data.getErrorCode()) {
        MultiMatchRoomModelMmrModel.updateOnFailedMsgMmrGetRoomPublicInfo(data);
    } else {
        await MultiMatchRoomModelMmrModel.updateOnMsgMmrGetRoomPublicInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrGetRoomPublicInfo, data);
    }
}

export function reqMmrGetJoinedRoomIdArray(): void {
    NetworksManager.send({ MsgMmrGetJoinedRoomIdArray: { c: {
    }, }, });
}
function _onMsgMmrGetJoinedRoomIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetJoinedRoomIdArrayS.S;
    MultiMatchRoomModelMmrModel.setJoinedRoomIdArray(data.getRoomIdArray());
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrGetJoinedRoomIdArray, data);
}

export function reqMmrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    NetworksManager.send({ MsgMmrSetBannedCoIdArray: { c: {
        roomId          : roomId,
        bannedCoIdArray : bannedCoIdArray,
    } }, });
}
async function _onMsgMmrSetBannedCoIdArray(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS.S;
    if (!data.getErrorCode()) {
        await MultiMatchRoomModelMmrModel.updateOnMsgMmrSetBannedCoIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrSetBannedCoIdArray, data);
    }
}

export function reqMmrSetMaxConcurrentCount(maxCountForStd: number, maxCountForFog: number): void {
    NetworksManager.send({ MsgMmrSetMaxConcurrentCount: { c: {
        maxCountForStd,
        maxCountForFog,
    } }, });
}
function _onMsgMmrSetMaxConcurrentCount(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetMaxConcurrentCountS.S;
    if (!data.getErrorCode()) {
        MultiMatchRoomModelMmrModel.setMaxConcurrentCount(false, HelpersMisc.getExisted(data.getMaxCountForStd()));
        MultiMatchRoomModelMmrModel.setMaxConcurrentCount(true, HelpersMisc.getExisted(data.getMaxCountForFog()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrSetMaxConcurrentCount, data);
    }
}

export function reqMmrGetBannedNormalMapIdArray(): void {
    NetworksManager.send({ MsgMmrGetBannedNormalMapIdArray: { c: {
    } } });
}
function _onMsgMmrGetBannedNormalMapIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrGetBannedNormalMapIdArrayS.S;
    if (!data.getErrorCode()) {
        MultiMatchRoomModelMmrModel.updateOnMsgMmrGetBannedNormalMapIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrGetBannedNormalMapIdArray, data);
    }
}

export function reqMmrSetBannedNormalMapIdArray(normalMapIdArrayForStd: number[], normalMapIdArrayForFog: number[]): void {
    NetworksManager.send({ MsgMmrSetBannedNormalMapIdArray: { c: {
        bannedNormalMapIdArrayForStd  : normalMapIdArrayForStd,
        bannedNormalMapIdArrayForFog  : normalMapIdArrayForFog,
    } } });
}
function _onMsgMmrSetBannedNormalMapIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedNormalMapIdArrayS.S;
    if (!data.getErrorCode()) {
        MultiMatchRoomModelMmrModel.updateOnMsgMmrSetBannedNormalMapIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrSetBannedNormalMapIdArray, data);
    }
}

export function reqMmrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    NetworksManager.send({ MsgMmrSetSelfSettings: { c: {
        roomId,
        coId,
        unitAndTileSkinId,
    }, }, });
}
async function _onMsgMmrSetSelfSettings(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS.S;
    if (!data.getErrorCode()) {
        await MultiMatchRoomModelMmrModel.updateOnMsgMmrSetSelfSettings(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrSetSelfSettings, data);
    }
}

function _onMsgMmrDeleteRoomByServer(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMmrDeleteRoomByServerS.S;
    MultiMatchRoomModelMmrModel.updateOnMsgMmrDeleteRoomByServer(data);
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMmrDeleteRoomByServer, data);
}
