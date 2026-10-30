import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    MultiCustomRoom_Model_McrModel,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as McrAddDummyResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrAddDummy/S.ts";
import type { C as McrCreateRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/C.ts";
import type { S as McrCreateRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/S.ts";
import type { S as McrDeletePlayerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrDeletePlayer/S.ts";
import type { S as McrDeleteRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrDeleteRoom/S.ts";
import type { S as McrExitRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrExitRoom/S.ts";
import type { S as McrGetJoinableRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetJoinableRoomIdArray/S.ts";
import type { S as McrGetJoinedRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetJoinedRoomIdArray/S.ts";
import type { S as McrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type { S as McrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import type { S as McrInviteResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrInvite/S.ts";
import type { S as McrJoinRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrJoinRoom/S.ts";
import type { S as McrSetDummySettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetDummySettings/S.ts";
import type { S as McrSetReadyResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetReady/S.ts";
import type { C as McrSetSelfSettingsRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetSelfSettings/C.ts";
import type { S as McrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetSelfSettings/S.ts";
import type { S as McrStartWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrStartWar/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrCreateRoom,                callback: _onMsgMcrCreateRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrJoinRoom,                  callback: _onMsgMcrJoinRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrDeleteRoom,                callback: _onMsgMcrDeleteRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrExitRoom,                  callback: _onMsgMcrExitRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrDeletePlayer,              callback: _onMsgMcrDeletePlayer },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrAddDummy,                  callback: _onMsgMcrAddDummy },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrSetDummySettings,          callback: _onMsgMcrSetDummySettings },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrInvite,                    callback: _onMsgMcrInvite },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrSetReady,                  callback: _onMsgMcrSetReady },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrSetSelfSettings,           callback: _onMsgMcrSetSelfSettings },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrGetRoomStaticInfo,         callback: _onMsgMcrGetRoomStaticInfo },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrGetRoomPlayerInfo,         callback: _onMsgMcrGetRoomPlayerInfo },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrGetJoinableRoomIdArray,    callback: _onMsgMcrGetJoinableRoomIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrGetJoinedRoomIdArray,      callback: _onMsgMcrGetJoinedRoomIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgMcrStartWar,                  callback: _onMsgMcrStartWar },
    ], null);
}

export function reqCreateRoom(param: McrCreateRoomRequest): void {
    Networks_Manager.send({
        MsgMcrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgMcrCreateRoom(e: Egret_Egret.Event): void {
    const data = e.data as McrCreateRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrCreateRoom, data);
    } else {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrCreateRoomFailed, data);
    }
}

export function reqMcrJoinRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMcrJoinRoom: { c: {
            roomId  : roomId,
        } },
    });
}
async function _onMsgMcrJoinRoom(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as McrJoinRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrJoinRoom, data);
    }
}

export function reqMcrDeleteRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMcrDeleteRoom: { c: {
            roomId,
        } },
    });
}
function _onMsgMcrDeleteRoom(e: Egret_Egret.Event): void {
    const data = e.data as McrDeleteRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrDeleteRoom, data);
    }
}

export function reqMcrExitRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMcrExitRoom: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMcrExitRoom(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as McrExitRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrExitRoom, data);
    }
}

export function reqMcrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    Networks_Manager.send({
        MsgMcrDeletePlayer: { c: {
            roomId,
            playerIndex,
            forbidReentrance
        }, },
    });
}
async function _onMsgMcrDeletePlayer(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as McrDeletePlayerResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrDeletePlayer, data);
    }
}

export function reqMcrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMcrAddDummy: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMcrAddDummy(e: Egret_Egret.Event): void {
    const data = e.data as McrAddDummyResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrAddDummy, data);
    }
}

export function reqMcrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMcrSetDummySettings: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMcrSetDummySettings(e: Egret_Egret.Event): void {
    const data = e.data as McrSetDummySettingsResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrSetDummySettings, data);
    }
}

export function reqMcrInvite(roomId: number, userIdArray: number[]): void {
    Networks_Manager.send({
        MsgMcrInvite: { c: {
            roomId      : roomId,
            userIdArray : userIdArray,
        }}
    });
}
function _onMsgMcrInvite(e: Egret_Egret.Event): void {
    const data = e.data as McrInviteResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrInvite, data);
    }
}

export function reqMcrSetReady(roomId: number, isReady: boolean): void {
    Networks_Manager.send({
        MsgMcrSetReady: { c: {
            roomId,
            isReady,
        }, },
    });
}
async function _onMsgMcrSetReady(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as McrSetReadyResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrSetReady, data);
    }
}

export function reqMcrSetSelfSettings(data: McrSetSelfSettingsRequest): void {
    Networks_Manager.send({
        MsgMcrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgMcrSetSelfSettings(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as McrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrSetSelfSettings, data);
    }
}

export function reqMcrGetRoomStaticInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMcrGetRoomStaticInfo: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMcrGetRoomStaticInfo(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as McrGetRoomStaticInfoResponse;
    if (data.getErrorCode()) {
        MultiCustomRoom_Model_McrModel.updateOnFailedMsgMcrGetRoomStaticInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrGetRoomStaticInfoFailed, data);
    } else {
        await MultiCustomRoom_Model_McrModel.updateOnMsgMcrGetRoomStaticInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrGetRoomStaticInfo, data);
    }
}

export function reqMcrGetRoomPlayerInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMcrGetRoomPlayerInfo: { c: {
            roomId,
        }, },
    });
}
function _onMsgMcrGetRoomPlayerInfo(e: Egret_Egret.Event): void {
    const data = e.data as McrGetRoomPlayerInfoResponse;
    if (data.getErrorCode()) {
        MultiCustomRoom_Model_McrModel.updateOnFailedMsgMcrGetRoomPlayerInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrGetRoomPlayerInfoFailed, data);
    } else {
        MultiCustomRoom_Model_McrModel.updateOnMsgMcrGetRoomPlayerInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrGetRoomPlayerInfo, data);
    }
}

export function reqMcrGetJoinableRoomIdArray(): void {
    Networks_Manager.send({
        MsgMcrGetJoinableRoomIdArray: { c: {
        } }
    });
}
function _onMsgMcrGetJoinableRoomIdArray(e: Egret_Egret.Event): void {
    const data = e.data as McrGetJoinableRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        MultiCustomRoom_Model_McrModel.setJoinableRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrGetJoinableRoomIdArray, data);
    }
}

export function reqMcrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({
        MsgMcrGetJoinedRoomIdArray: { c: {
        } }
    });
}
function _onMsgMcrGetJoinedRoomIdArray(e: Egret_Egret.Event): void {
    const data = e.data as McrGetJoinedRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        MultiCustomRoom_Model_McrModel.setJoinedRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrGetJoinedRoomIdArray, data);
    }
}

export function reqMcrStartWar(roomId: number): void {
    Networks_Manager.send({
        MsgMcrStartWar: { c: {
            roomId,
        }, },
    });
}
function _onMsgMcrStartWar(e: Egret_Egret.Event): void {
    const data = e.data as McrStartWarResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMcrStartWar, data);
    }
}
