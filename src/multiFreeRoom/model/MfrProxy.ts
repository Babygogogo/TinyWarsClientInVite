import * as MultiFreeRoomModelMfrModel from "./MfrModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrAddDummyS from "../../proto/schema/CommonProto/NetMessage/MsgMfrAddDummy/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrCreateRoomC from "../../proto/schema/CommonProto/NetMessage/MsgMfrCreateRoom/C.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrCreateRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMfrCreateRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrDeletePlayerS from "../../proto/schema/CommonProto/NetMessage/MsgMfrDeletePlayer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrDeleteRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMfrDeleteRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrExitRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMfrExitRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetJoinableRoomIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetJoinableRoomIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetJoinedRoomIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetJoinedRoomIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrInviteS from "../../proto/schema/CommonProto/NetMessage/MsgMfrInvite/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrSetDummySettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetDummySettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrSetReadyS from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetReady/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrSetSelfSettingsC from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetSelfSettings/C.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetSelfSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrStartWarS from "../../proto/schema/CommonProto/NetMessage/MsgMfrStartWar/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrCreateRoom,                callback: _onMsgMfrCreateRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrJoinRoom,                  callback: _onMsgMfrJoinRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrDeleteRoom,                callback: _onMsgMfrDeleteRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrExitRoom,                  callback: _onMsgMfrExitRoom },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrDeletePlayer,              callback: _onMsgMfrDeletePlayer },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrAddDummy,                  callback: _onMsgMfrAddDummy },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrSetDummySettings,          callback: _onMsgMfrSetDummySettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrInvite,                    callback: _onMsgMfrInvite },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrSetReady,                  callback: _onMsgMfrSetReady },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrSetSelfSettings,           callback: _onMsgMfrSetSelfSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrGetRoomStaticInfo,         callback: _onMsgMfrGetRoomStaticInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrGetRoomPlayerInfo,         callback: _onMsgMfrGetRoomPlayerInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrGetJoinableRoomIdArray,    callback: _onMsgMfrGetJoinableRoomIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrGetJoinedRoomIdArray,      callback: _onMsgMfrGetJoinedRoomIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgMfrStartWar,                  callback: _onMsgMfrStartWar },
    ], null);
}

export function reqCreateRoom(param: ProtoSchemaCommonProtoNetMessageMsgMfrCreateRoomC.C): void {
    NetworksManager.send({
        MsgMfrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgMfrCreateRoom(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrCreateRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrCreateRoom, data);
    }
}

export function reqMfrJoinRoom(roomId: number): void {
    NetworksManager.send({
        MsgMfrJoinRoom: { c: {
            roomId  : roomId,
        } },
    });
}
async function _onMsgMfrJoinRoom(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrJoinRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrJoinRoom, data);
    }
}

export function reqMfrDeleteRoom(roomId: number): void {
    NetworksManager.send({
        MsgMfrDeleteRoom: { c: {
            roomId,
        } },
    });
}
function _onMsgMfrDeleteRoom(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrDeleteRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrDeleteRoom, data);
    }
}

export function reqMfrExitRoom(roomId: number): void {
    NetworksManager.send({
        MsgMfrExitRoom: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMfrExitRoom(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrExitRoomS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrExitRoom, data);
    }
}

export function reqMfrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    NetworksManager.send({
        MsgMfrDeletePlayer: { c: {
            roomId,
            playerIndex,
            forbidReentrance
        }, },
    });
}
async function _onMsgMfrDeletePlayer(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrDeletePlayerS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrDeletePlayer, data);
    }
}

export function reqMfrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    NetworksManager.send({
        MsgMfrAddDummy: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMfrAddDummy(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrAddDummyS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrAddDummy, data);
    }
}

export function reqMfrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    NetworksManager.send({
        MsgMfrSetDummySettings: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMfrSetDummySettings(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrSetDummySettingsS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrSetDummySettings, data);
    }
}

export function reqMfrInvite(roomId: number, userIdArray: number[]): void {
    NetworksManager.send({
        MsgMfrInvite: { c: {
            roomId      : roomId,
            userIdArray : userIdArray,
        }}
    });
}
function _onMsgMfrInvite(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrInviteS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrInvite, data);
    }
}

export function reqMfrSetReady(roomId: number, isReady: boolean): void {
    NetworksManager.send({
        MsgMfrSetReady: { c: {
            roomId,
            isReady,
        }, },
    });
}
async function _onMsgMfrSetReady(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrSetReadyS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrSetReady, data);
    }
}

export function reqMfrSetSelfSettings(data: ProtoSchemaCommonProtoNetMessageMsgMfrSetSelfSettingsC.C): void {
    NetworksManager.send({
        MsgMfrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgMfrSetSelfSettings(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrSetSelfSettingsS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrSetSelfSettings, data);
    }
}

export function reqMfrGetRoomStaticInfo(roomId: number): void {
    NetworksManager.send({
        MsgMfrGetRoomStaticInfo: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMfrGetRoomStaticInfo(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS.S;
    if (data.getErrorCode()) {
        MultiFreeRoomModelMfrModel.updateOnFailedMsgMfrGetRoomStaticInfo(data);
    } else {
        await MultiFreeRoomModelMfrModel.updateOnMsgMfrGetRoomStaticInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrGetRoomStaticInfo, data);
    }
}

export function reqMfrGetRoomPlayerInfo(roomId: number): void {
    NetworksManager.send({
        MsgMfrGetRoomPlayerInfo: { c: {
            roomId,
        }, },
    });
}
function _onMsgMfrGetRoomPlayerInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS.S;
    if (data.getErrorCode()) {
        MultiFreeRoomModelMfrModel.updateOnFailedMsgMfrGetRoomPlayerInfo(data);
    } else {
        MultiFreeRoomModelMfrModel.updateOnMsgMfrGetRoomPlayerInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrGetRoomPlayerInfo, data);
    }
}

export function reqMfrGetJoinableRoomIdArray(): void {
    NetworksManager.send({
        MsgMfrGetJoinableRoomIdArray: { c: {
        } }
    });
}
function _onMsgMfrGetJoinableRoomIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetJoinableRoomIdArrayS.S;
    if (!data.getErrorCode()) {
        MultiFreeRoomModelMfrModel.setJoinableRoomIdArray(data.getRoomIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrGetJoinableRoomIdArray, data);
    }
}

export function reqMfrGetJoinedRoomIdArray(): void {
    NetworksManager.send({
        MsgMfrGetJoinedRoomIdArray: { c: {
        } }
    });
}
function _onMsgMfrGetJoinedRoomIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrGetJoinedRoomIdArrayS.S;
    if (!data.getErrorCode()) {
        MultiFreeRoomModelMfrModel.setJoinedRoomIdArray(data.getRoomIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrGetJoinedRoomIdArray, data);
    }
}

export function reqMfrStartWar(roomId: number): void {
    NetworksManager.send({
        MsgMfrStartWar: { c: {
            roomId,
        }, },
    });
}
function _onMsgMfrStartWar(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMfrStartWarS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgMfrStartWar, data);
    }
}
