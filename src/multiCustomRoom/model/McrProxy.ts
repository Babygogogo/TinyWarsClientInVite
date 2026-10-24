import * as MultiCustomRoomModelMcrModel from "./McrModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrAddDummyS from "../../proto/schema/CommonProto/NetMessage/MsgMcrAddDummy/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrCreateRoomC from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/C.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrCreateRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrDeletePlayerS from "../../proto/schema/CommonProto/NetMessage/MsgMcrDeletePlayer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrDeleteRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMcrDeleteRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrExitRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMcrExitRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrGetJoinableRoomIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetJoinableRoomIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrGetJoinedRoomIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetJoinedRoomIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrInviteS from "../../proto/schema/CommonProto/NetMessage/MsgMcrInvite/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMcrJoinRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrSetDummySettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetDummySettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrSetReadyS from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetReady/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrSetSelfSettingsC from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetSelfSettings/C.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetSelfSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMcrStartWarS from "../../proto/schema/CommonProto/NetMessage/MsgMcrStartWar/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrCreateRoom,                callback: _onMsgMcrCreateRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrJoinRoom,                  callback: _onMsgMcrJoinRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrDeleteRoom,                callback: _onMsgMcrDeleteRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrExitRoom,                  callback: _onMsgMcrExitRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrDeletePlayer,              callback: _onMsgMcrDeletePlayer },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrAddDummy,                  callback: _onMsgMcrAddDummy },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrSetDummySettings,          callback: _onMsgMcrSetDummySettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrInvite,                    callback: _onMsgMcrInvite },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrSetReady,                  callback: _onMsgMcrSetReady },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrSetSelfSettings,           callback: _onMsgMcrSetSelfSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrGetRoomStaticInfo,         callback: _onMsgMcrGetRoomStaticInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrGetRoomPlayerInfo,         callback: _onMsgMcrGetRoomPlayerInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrGetJoinableRoomIdArray,    callback: _onMsgMcrGetJoinableRoomIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrGetJoinedRoomIdArray,      callback: _onMsgMcrGetJoinedRoomIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMcrStartWar,                  callback: _onMsgMcrStartWar },
    ], null);
}

export function reqCreateRoom(param: ProtoSchemaCommonProtoNetMessageMsgMcrCreateRoomC.C): void {
    NetworksManager.send({
        MsgMcrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgMcrCreateRoom(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrCreateRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrCreateRoom, data);
    } else {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrCreateRoomFailed, data);
    }
}

export function reqMcrJoinRoom(roomId: number): void {
    NetworksManager.send({
        MsgMcrJoinRoom: { c: {
            roomId  : roomId,
        } },
    });
}
async function _onMsgMcrJoinRoom(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrJoinRoom, data);
    }
}

export function reqMcrDeleteRoom(roomId: number): void {
    NetworksManager.send({
        MsgMcrDeleteRoom: { c: {
            roomId,
        } },
    });
}
function _onMsgMcrDeleteRoom(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrDeleteRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrDeleteRoom, data);
    }
}

export function reqMcrExitRoom(roomId: number): void {
    NetworksManager.send({
        MsgMcrExitRoom: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMcrExitRoom(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrExitRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrExitRoom, data);
    }
}

export function reqMcrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    NetworksManager.send({
        MsgMcrDeletePlayer: { c: {
            roomId,
            playerIndex,
            forbidReentrance
        }, },
    });
}
async function _onMsgMcrDeletePlayer(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrDeletePlayerS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrDeletePlayer, data);
    }
}

export function reqMcrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    NetworksManager.send({
        MsgMcrAddDummy: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMcrAddDummy(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrAddDummyS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrAddDummy, data);
    }
}

export function reqMcrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    NetworksManager.send({
        MsgMcrSetDummySettings: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMcrSetDummySettings(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrSetDummySettingsS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrSetDummySettings, data);
    }
}

export function reqMcrInvite(roomId: number, userIdArray: number[]): void {
    NetworksManager.send({
        MsgMcrInvite: { c: {
            roomId      : roomId,
            userIdArray : userIdArray,
        }}
    });
}
function _onMsgMcrInvite(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrInviteS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrInvite, data);
    }
}

export function reqMcrSetReady(roomId: number, isReady: boolean): void {
    NetworksManager.send({
        MsgMcrSetReady: { c: {
            roomId,
            isReady,
        }, },
    });
}
async function _onMsgMcrSetReady(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrSetReadyS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrSetReady, data);
    }
}

export function reqMcrSetSelfSettings(data: ProtoSchemaCommonProtoNetMessageMsgMcrSetSelfSettingsC.C): void {
    NetworksManager.send({
        MsgMcrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgMcrSetSelfSettings(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrSetSelfSettingsS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrSetSelfSettings, data);
    }
}

export function reqMcrGetRoomStaticInfo(roomId: number): void {
    NetworksManager.send({
        MsgMcrGetRoomStaticInfo: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMcrGetRoomStaticInfo(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS.S;
    if (data.getErrorCode()) {
        MultiCustomRoomModelMcrModel.updateOnFailedMsgMcrGetRoomStaticInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrGetRoomStaticInfoFailed, data);
    } else {
        await MultiCustomRoomModelMcrModel.updateOnMsgMcrGetRoomStaticInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrGetRoomStaticInfo, data);
    }
}

export function reqMcrGetRoomPlayerInfo(roomId: number): void {
    NetworksManager.send({
        MsgMcrGetRoomPlayerInfo: { c: {
            roomId,
        }, },
    });
}
function _onMsgMcrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS.S;
    if (data.getErrorCode()) {
        MultiCustomRoomModelMcrModel.updateOnFailedMsgMcrGetRoomPlayerInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrGetRoomPlayerInfoFailed, data);
    } else {
        MultiCustomRoomModelMcrModel.updateOnMsgMcrGetRoomPlayerInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrGetRoomPlayerInfo, data);
    }
}

export function reqMcrGetJoinableRoomIdArray(): void {
    NetworksManager.send({
        MsgMcrGetJoinableRoomIdArray: { c: {
        } }
    });
}
function _onMsgMcrGetJoinableRoomIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetJoinableRoomIdArrayS.S;
    if (!data.getErrorCode()) {
        MultiCustomRoomModelMcrModel.setJoinableRoomIdArray(data.getRoomIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrGetJoinableRoomIdArray, data);
    }
}

export function reqMcrGetJoinedRoomIdArray(): void {
    NetworksManager.send({
        MsgMcrGetJoinedRoomIdArray: { c: {
        } }
    });
}
function _onMsgMcrGetJoinedRoomIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetJoinedRoomIdArrayS.S;
    if (!data.getErrorCode()) {
        MultiCustomRoomModelMcrModel.setJoinedRoomIdArray(data.getRoomIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrGetJoinedRoomIdArray, data);
    }
}

export function reqMcrStartWar(roomId: number): void {
    NetworksManager.send({
        MsgMcrStartWar: { c: {
            roomId,
        }, },
    });
}
function _onMsgMcrStartWar(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrStartWarS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMcrStartWar, data);
    }
}
