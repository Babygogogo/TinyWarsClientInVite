import * as CoopCustomRoomModelCcrModel from "./CcrModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrAddDummyS from "../../proto/schema/CommonProto/NetMessage/MsgCcrAddDummy/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomC from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/C.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomS from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrDeletePlayerS from "../../proto/schema/CommonProto/NetMessage/MsgCcrDeletePlayer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrDeleteRoomS from "../../proto/schema/CommonProto/NetMessage/MsgCcrDeleteRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrExitRoomS from "../../proto/schema/CommonProto/NetMessage/MsgCcrExitRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetJoinableRoomIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetJoinableRoomIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetJoinedRoomIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetJoinedRoomIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrInviteS from "../../proto/schema/CommonProto/NetMessage/MsgCcrInvite/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS from "../../proto/schema/CommonProto/NetMessage/MsgCcrJoinRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrSetDummySettingsS from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetDummySettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrSetReadyS from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetReady/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsC from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetSelfSettings/C.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetSelfSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCcrStartWarS from "../../proto/schema/CommonProto/NetMessage/MsgCcrStartWar/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrCreateRoom,                callback: _onMsgCcrCreateRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrJoinRoom,                  callback: _onMsgCcrJoinRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrDeleteRoom,                callback: _onMsgCcrDeleteRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrExitRoom,                  callback: _onMsgCcrExitRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrDeletePlayer,              callback: _onMsgCcrDeletePlayer },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrAddDummy,                  callback: _onMsgCcrAddDummy },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrSetDummySettings,          callback: _onMsgCcrSetDummySettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrInvite,                    callback: _onMsgCcrInvite },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrSetReady,                  callback: _onMsgCcrSetReady },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrSetSelfSettings,           callback: _onMsgCcrSetSelfSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrGetRoomStaticInfo,         callback: _onMsgCcrGetRoomStaticInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrGetRoomPlayerInfo,         callback: _onMsgCcrGetRoomPlayerInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrGetJoinableRoomIdArray,    callback: _onMsgCcrGetJoinableRoomIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrGetJoinedRoomIdArray,      callback: _onMsgCcrGetJoinedRoomIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCcrStartWar,                  callback: _onMsgCcrStartWar },
    ], null);
}

export function reqCreateRoom(param: ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomC.C): void {
    NetworksManager.send({
        MsgCcrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgCcrCreateRoom(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrCreateRoom, data);
    }
}

export function reqCcrJoinRoom(roomId: number): void {
    NetworksManager.send({
        MsgCcrJoinRoom: { c: {
            roomId  : roomId,
        } },
    });
}
async function _onMsgCcrJoinRoom(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrJoinRoom, data);
    }
}

export function reqCcrDeleteRoom(roomId: number): void {
    NetworksManager.send({
        MsgCcrDeleteRoom: { c: {
            roomId,
        } },
    });
}
function _onMsgCcrDeleteRoom(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrDeleteRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrDeleteRoom, data);
    }
}

export function reqCcrExitRoom(roomId: number): void {
    NetworksManager.send({
        MsgCcrExitRoom: { c: {
            roomId,
        }, },
    });
}
async function _onMsgCcrExitRoom(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrExitRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrExitRoom, data);
    }
}

export function reqCcrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    NetworksManager.send({
        MsgCcrDeletePlayer: { c: {
            roomId,
            playerIndex,
            forbidReentrance
        }, },
    });
}
async function _onMsgCcrDeletePlayer(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrDeletePlayerS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrDeletePlayer, data);
    }
}

export function reqCcrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    NetworksManager.send({
        MsgCcrAddDummy: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgCcrAddDummy(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrAddDummyS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrAddDummy, data);
    }
}

export function reqCcrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    NetworksManager.send({
        MsgCcrSetDummySettings: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgCcrSetDummySettings(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrSetDummySettingsS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrSetDummySettings, data);
    }
}

export function reqCcrInvite(roomId: number, userIdArray: number[]): void {
    NetworksManager.send({
        MsgCcrInvite: { c: {
            roomId      : roomId,
            userIdArray : userIdArray,
        }}
    });
}
function _onMsgCcrInvite(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrInviteS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrInvite, data);
    }
}

export function reqCcrSetReady(roomId: number, isReady: boolean): void {
    NetworksManager.send({
        MsgCcrSetReady: { c: {
            roomId,
            isReady,
        }, },
    });
}
async function _onMsgCcrSetReady(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrSetReadyS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrSetReady, data);
    }
}

export function reqCcrSetSelfSettings(data: ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsC.C): void {
    NetworksManager.send({
        MsgCcrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgCcrSetSelfSettings(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrSetSelfSettings, data);
    }
}

export function reqCcrGetRoomStaticInfo(roomId: number): void {
    NetworksManager.send({
        MsgCcrGetRoomStaticInfo: { c: {
            roomId,
        }, },
    });
}
async function _onMsgCcrGetRoomStaticInfo(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS.S;
    if (data.getErrorCode()) {
        CoopCustomRoomModelCcrModel.updateOnFailedMsgCcrGetRoomStaticInfo(data);
    } else {
        await CoopCustomRoomModelCcrModel.updateOnMsgCcrGetRoomStaticInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrGetRoomStaticInfo, data);
    }
}

export function reqCcrGetRoomPlayerInfo(roomId: number): void {
    NetworksManager.send({
        MsgCcrGetRoomPlayerInfo: { c: {
            roomId,
        }, },
    });
}
function _onMsgCcrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS.S;
    if (data.getErrorCode()) {
        CoopCustomRoomModelCcrModel.updateOnFailedMsgCcrGetRoomPlayerInfo(data);
    } else {
        CoopCustomRoomModelCcrModel.updateOnMsgCcrGetRoomPlayerInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrGetRoomPlayerInfo, data);
    }
}

export function reqCcrGetJoinableRoomIdArray(): void {
    NetworksManager.send({
        MsgCcrGetJoinableRoomIdArray: { c: {
        } }
    });
}
function _onMsgCcrGetJoinableRoomIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetJoinableRoomIdArrayS.S;
    if (!data.getErrorCode()) {
        CoopCustomRoomModelCcrModel.setJoinableRoomIdArray(data.getRoomIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrGetJoinableRoomIdArray, data);
    }
}

export function reqCcrGetJoinedRoomIdArray(): void {
    NetworksManager.send({
        MsgCcrGetJoinedRoomIdArray: { c: {
        } }
    });
}
function _onMsgCcrGetJoinedRoomIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetJoinedRoomIdArrayS.S;
    if (!data.getErrorCode()) {
        CoopCustomRoomModelCcrModel.setJoinedRoomIdArray(data.getRoomIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrGetJoinedRoomIdArray, data);
    }
}

export function reqCcrStartWar(roomId: number): void {
    NetworksManager.send({
        MsgCcrStartWar: { c: {
            roomId,
        }, },
    });
}
function _onMsgCcrStartWar(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrStartWarS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCcrStartWar, data);
    }
}
