import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiRankRoomModelMrrModel from "./MrrModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrDeleteRoomByServerS from "../../proto/schema/CommonProto/NetMessage/MsgMrrDeleteRoomByServer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrGetBannedNormalMapIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetBannedNormalMapIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrGetBootTimerDaysRangeS from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetBootTimerDaysRange/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrGetJoinedRoomIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetJoinedRoomIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrGetMaxConcurrentCountS from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetMaxConcurrentCount/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrGetRoomPublicInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetRoomPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedCoIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedCoIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedNormalMapIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedNormalMapIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrSetBootTimerDaysRangeS from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBootTimerDaysRange/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrSetMaxConcurrentCountS from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetMaxConcurrentCount/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMrrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetSelfSettings/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrGetMaxConcurrentCount,         callback: _onMsgMrrGetMaxConcurrentCount },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrGetRoomPublicInfo,             callback: _onMsgMrrGetRoomPublicInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrGetJoinedRoomIdArray,          callback: _onMsgMrrGetJoinedRoomIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrSetBannedCoIdArray,            callback: _onMsgMrrSetBannedCoIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrSetMaxConcurrentCount,         callback: _onMsgMrrSetMaxConcurrentCount },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrGetBannedNormalMapIdArray,     callback: _onMsgMrrGetBannedNormalMapIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrSetBannedNormalMapIdArray,     callback: _onMsgMrrSetBannedNormalMapIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrGetBootTimerDaysRange,         callback: _onMsgMrrGetBootTimerDaysRange },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrSetBootTimerDaysRange,         callback: _onMsgMrrSetBootTimerDaysRange },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrSetSelfSettings,               callback: _onMsgMrrSetSelfSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMrrDeleteRoomByServer,            callback: _onMsgMrrDeleteRoomByServer },
    ]);
}

export function reqMrrGetMaxConcurrentCount(): void {
    NetworksManager.send({ MsgMrrGetMaxConcurrentCount: { c: {} } });
}
function _onMsgMrrGetMaxConcurrentCount(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrGetMaxConcurrentCountS.S;
    if (!data.getErrorCode()) {
        MultiRankRoomModelMrrModel.setMaxConcurrentCount(false, HelpersMisc.getExisted(data.getMaxCountForStd()));
        MultiRankRoomModelMrrModel.setMaxConcurrentCount(true, HelpersMisc.getExisted(data.getMaxCountForFog()));
        MultiRankRoomModelMrrModel.setAdditionalMaxDifferenceInScore(false, data.getAdditionalMaxDifferenceInScoreForStd() ?? 0);
        MultiRankRoomModelMrrModel.setAdditionalMaxDifferenceInScore(true, data.getAdditionalMaxDifferenceInScoreForFog() ?? 0);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrGetMaxConcurrentCount, data);
    }
}

export function reqMrrGetBootTimerDaysRange(): void {
    NetworksManager.send({ MsgMrrGetBootTimerDaysRange: { c: {} } });
}
function _onMsgMrrGetBootTimerDaysRange(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrGetBootTimerDaysRangeS.S;
    if (!data.getErrorCode()) {
        MultiRankRoomModelMrrModel.updateOnMsgMrrGetBootTimerDaysRange(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrGetBootTimerDaysRange, data);
    }
}

export function reqMrrSetBootTimerDaysRange(rangeForStd: number[], rangeForFog: number[]): void {
    NetworksManager.send({ MsgMrrSetBootTimerDaysRange: { c: {
        rangeForStd : rangeForStd,
        rangeForFog : rangeForFog,
    } } });
}
function _onMsgMrrSetBootTimerDaysRange(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrSetBootTimerDaysRangeS.S;
    if (!data.getErrorCode()) {
        MultiRankRoomModelMrrModel.updateOnMsgMrrSetBootTimerDaysRange(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrSetBootTimerDaysRange, data);
    }
}

export function reqMrrGetRoomPublicInfo(roomId: number): void {
    NetworksManager.send({ MsgMrrGetRoomPublicInfo: { c: {
        roomId,
    } }, });
}
async function _onMsgMrrGetRoomPublicInfo(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrGetRoomPublicInfoS.S;
    if (data.getErrorCode()) {
        MultiRankRoomModelMrrModel.updateOnFailedMsgMrrGetRoomPublicInfo(data);
    } else {
        await MultiRankRoomModelMrrModel.updateOnMsgMrrGetRoomPublicInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrGetRoomPublicInfo, data);
    }
}

export function reqMrrGetJoinedRoomIdArray(): void {
    NetworksManager.send({ MsgMrrGetJoinedRoomIdArray: { c: {
    }, }, });
}
function _onMsgMrrGetJoinedRoomIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrGetJoinedRoomIdArrayS.S;
    MultiRankRoomModelMrrModel.setJoinedRoomIdArray(data.getRoomIdArray());
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrGetJoinedRoomIdArray, data);
}

export function reqMrrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    NetworksManager.send({ MsgMrrSetBannedCoIdArray: { c: {
        roomId          : roomId,
        bannedCoIdArray : bannedCoIdArray,
    } }, });
}
async function _onMsgMrrSetBannedCoIdArray(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedCoIdArrayS.S;
    if (!data.getErrorCode()) {
        await MultiRankRoomModelMrrModel.updateOnMsgMrrSetBannedCoIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrSetBannedCoIdArray, data);
    }
}

export function reqMrrSetMaxConcurrentCount({ maxCountForStd, maxCountForFog, additionalMaxDifferenceInScoreForStd, additionalMaxDifferenceInScoreForFog }: {
    maxCountForStd                          : number;
    maxCountForFog                          : number;
    additionalMaxDifferenceInScoreForStd    : number;
    additionalMaxDifferenceInScoreForFog    : number;
}): void {
    NetworksManager.send({ MsgMrrSetMaxConcurrentCount: { c: {
        maxCountForStd                          : maxCountForStd,
        maxCountForFog                          : maxCountForFog,
        additionalMaxDifferenceInScoreForStd    : additionalMaxDifferenceInScoreForStd,
        additionalMaxDifferenceInScoreForFog    : additionalMaxDifferenceInScoreForFog,
    } }, });
}
function _onMsgMrrSetMaxConcurrentCount(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrSetMaxConcurrentCountS.S;
    if (!data.getErrorCode()) {
        MultiRankRoomModelMrrModel.setMaxConcurrentCount(false, HelpersMisc.getExisted(data.getMaxCountForStd()));
        MultiRankRoomModelMrrModel.setMaxConcurrentCount(true, HelpersMisc.getExisted(data.getMaxCountForFog()));
        MultiRankRoomModelMrrModel.setAdditionalMaxDifferenceInScore(false, data.getAdditionalMaxDifferenceInScoreForStd() ?? 0);
        MultiRankRoomModelMrrModel.setAdditionalMaxDifferenceInScore(true, data.getAdditionalMaxDifferenceInScoreForFog() ?? 0);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrSetMaxConcurrentCount, data);
    }
}

export function reqMrrGetBannedNormalMapIdArray(): void {
    NetworksManager.send({ MsgMrrGetBannedNormalMapIdArray: { c: {
    } } });
}
function _onMsgMrrGetBannedNormalMapIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrGetBannedNormalMapIdArrayS.S;
    if (!data.getErrorCode()) {
        MultiRankRoomModelMrrModel.updateOnMsgMrrGetBannedNormalMapIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrGetBannedNormalMapIdArray, data);
    }
}

export function reqMrrSetBannedNormalMapIdArray(normalMapIdArrayForStd: number[], normalMapIdArrayForFog: number[]): void {
    NetworksManager.send({ MsgMrrSetBannedNormalMapIdArray: { c: {
        bannedNormalMapIdArrayForStd  : normalMapIdArrayForStd,
        bannedNormalMapIdArrayForFog  : normalMapIdArrayForFog,
    } } });
}
function _onMsgMrrSetBannedNormalMapIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedNormalMapIdArrayS.S;
    if (!data.getErrorCode()) {
        MultiRankRoomModelMrrModel.updateOnMsgMrrSetBannedNormalMapIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrSetBannedNormalMapIdArray, data);
    }
}

export function reqMrrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    NetworksManager.send({ MsgMrrSetSelfSettings: { c: {
        roomId,
        coId,
        unitAndTileSkinId,
    }, }, });
}
async function _onMsgMrrSetSelfSettings(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrSetSelfSettingsS.S;
    if (!data.getErrorCode()) {
        await MultiRankRoomModelMrrModel.updateOnMsgMrrSetSelfSettings(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrSetSelfSettings, data);
    }
}

function _onMsgMrrDeleteRoomByServer(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMrrDeleteRoomByServerS.S;
    MultiRankRoomModelMrrModel.updateOnMsgMrrDeleteRoomByServer(data);
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMrrDeleteRoomByServer, data);
}
