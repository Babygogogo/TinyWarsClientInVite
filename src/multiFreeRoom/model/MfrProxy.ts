import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    MultiFreeRoom_Model_MfrModel,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as MfrAddDummyResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrAddDummy/S.ts";
import type { C as MfrCreateRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMfrCreateRoom/C.ts";
import type { S as MfrCreateRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrCreateRoom/S.ts";
import type { S as MfrDeletePlayerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrDeletePlayer/S.ts";
import type { S as MfrDeleteRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrDeleteRoom/S.ts";
import type { S as MfrExitRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrExitRoom/S.ts";
import type { S as MfrGetJoinableRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetJoinableRoomIdArray/S.ts";
import type { S as MfrGetJoinedRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetJoinedRoomIdArray/S.ts";
import type { S as MfrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type { S as MfrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import type { S as MfrInviteResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrInvite/S.ts";
import type { S as MfrJoinRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrJoinRoom/S.ts";
import type { S as MfrSetDummySettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetDummySettings/S.ts";
import type { S as MfrSetReadyResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetReady/S.ts";
import type { C as MfrSetSelfSettingsRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetSelfSettings/C.ts";
import type { S as MfrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetSelfSettings/S.ts";
import type { S as MfrStartWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMfrStartWar/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrCreateRoom,                callback: _onMsgMfrCreateRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrJoinRoom,                  callback: _onMsgMfrJoinRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrDeleteRoom,                callback: _onMsgMfrDeleteRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrExitRoom,                  callback: _onMsgMfrExitRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrDeletePlayer,              callback: _onMsgMfrDeletePlayer },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrAddDummy,                  callback: _onMsgMfrAddDummy },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrSetDummySettings,          callback: _onMsgMfrSetDummySettings },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrInvite,                    callback: _onMsgMfrInvite },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrSetReady,                  callback: _onMsgMfrSetReady },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrSetSelfSettings,           callback: _onMsgMfrSetSelfSettings },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrGetRoomStaticInfo,         callback: _onMsgMfrGetRoomStaticInfo },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrGetRoomPlayerInfo,         callback: _onMsgMfrGetRoomPlayerInfo },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrGetJoinableRoomIdArray,    callback: _onMsgMfrGetJoinableRoomIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrGetJoinedRoomIdArray,      callback: _onMsgMfrGetJoinedRoomIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMfrStartWar,                  callback: _onMsgMfrStartWar },
    ], null);
}

export function reqCreateRoom(param: MfrCreateRoomRequest): void {
    Networks_Manager.send({
        MsgMfrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgMfrCreateRoom(e: Egret_Egret.Event): void {
    const data = e.data as MfrCreateRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrCreateRoom, data);
    }
}

export function reqMfrJoinRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMfrJoinRoom: { c: {
            roomId  : roomId,
        } },
    });
}
async function _onMsgMfrJoinRoom(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MfrJoinRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrJoinRoom, data);
    }
}

export function reqMfrDeleteRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMfrDeleteRoom: { c: {
            roomId,
        } },
    });
}
function _onMsgMfrDeleteRoom(e: Egret_Egret.Event): void {
    const data = e.data as MfrDeleteRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrDeleteRoom, data);
    }
}

export function reqMfrExitRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMfrExitRoom: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMfrExitRoom(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MfrExitRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrExitRoom, data);
    }
}

export function reqMfrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    Networks_Manager.send({
        MsgMfrDeletePlayer: { c: {
            roomId,
            playerIndex,
            forbidReentrance
        }, },
    });
}
async function _onMsgMfrDeletePlayer(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MfrDeletePlayerResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrDeletePlayer, data);
    }
}

export function reqMfrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMfrAddDummy: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMfrAddDummy(e: Egret_Egret.Event): void {
    const data = e.data as MfrAddDummyResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrAddDummy, data);
    }
}

export function reqMfrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMfrSetDummySettings: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMfrSetDummySettings(e: Egret_Egret.Event): void {
    const data = e.data as MfrSetDummySettingsResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrSetDummySettings, data);
    }
}

export function reqMfrInvite(roomId: number, userIdArray: number[]): void {
    Networks_Manager.send({
        MsgMfrInvite: { c: {
            roomId      : roomId,
            userIdArray : userIdArray,
        }}
    });
}
function _onMsgMfrInvite(e: Egret_Egret.Event): void {
    const data = e.data as MfrInviteResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrInvite, data);
    }
}

export function reqMfrSetReady(roomId: number, isReady: boolean): void {
    Networks_Manager.send({
        MsgMfrSetReady: { c: {
            roomId,
            isReady,
        }, },
    });
}
async function _onMsgMfrSetReady(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MfrSetReadyResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrSetReady, data);
    }
}

export function reqMfrSetSelfSettings(data: MfrSetSelfSettingsRequest): void {
    Networks_Manager.send({
        MsgMfrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgMfrSetSelfSettings(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MfrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrSetSelfSettings, data);
    }
}

export function reqMfrGetRoomStaticInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMfrGetRoomStaticInfo: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMfrGetRoomStaticInfo(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as MfrGetRoomStaticInfoResponse;
    if (data.getErrorCode()) {
        MultiFreeRoom_Model_MfrModel.updateOnFailedMsgMfrGetRoomStaticInfo(data);
    } else {
        await MultiFreeRoom_Model_MfrModel.updateOnMsgMfrGetRoomStaticInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrGetRoomStaticInfo, data);
    }
}

export function reqMfrGetRoomPlayerInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMfrGetRoomPlayerInfo: { c: {
            roomId,
        }, },
    });
}
function _onMsgMfrGetRoomPlayerInfo(e: Egret_Egret.Event): void {
    const data = e.data as MfrGetRoomPlayerInfoResponse;
    if (data.getErrorCode()) {
        MultiFreeRoom_Model_MfrModel.updateOnFailedMsgMfrGetRoomPlayerInfo(data);
    } else {
        MultiFreeRoom_Model_MfrModel.updateOnMsgMfrGetRoomPlayerInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrGetRoomPlayerInfo, data);
    }
}

export function reqMfrGetJoinableRoomIdArray(): void {
    Networks_Manager.send({
        MsgMfrGetJoinableRoomIdArray: { c: {
        } }
    });
}
function _onMsgMfrGetJoinableRoomIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MfrGetJoinableRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        MultiFreeRoom_Model_MfrModel.setJoinableRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrGetJoinableRoomIdArray, data);
    }
}

export function reqMfrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({
        MsgMfrGetJoinedRoomIdArray: { c: {
        } }
    });
}
function _onMsgMfrGetJoinedRoomIdArray(e: Egret_Egret.Event): void {
    const data = e.data as MfrGetJoinedRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        MultiFreeRoom_Model_MfrModel.setJoinedRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrGetJoinedRoomIdArray, data);
    }
}

export function reqMfrStartWar(roomId: number): void {
    Networks_Manager.send({
        MsgMfrStartWar: { c: {
            roomId,
        }, },
    });
}
function _onMsgMfrStartWar(e: Egret_Egret.Event): void {
    const data = e.data as MfrStartWarResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMfrStartWar, data);
    }
}
