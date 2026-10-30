import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    CoopCustomRoom_Model_CcrModel,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as CcrAddDummyResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrAddDummy/S.ts";
import type { C as CcrCreateRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/C.ts";
import type { S as CcrCreateRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/S.ts";
import type { S as CcrDeletePlayerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrDeletePlayer/S.ts";
import type { S as CcrDeleteRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrDeleteRoom/S.ts";
import type { S as CcrExitRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrExitRoom/S.ts";
import type { S as CcrGetJoinableRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetJoinableRoomIdArray/S.ts";
import type { S as CcrGetJoinedRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetJoinedRoomIdArray/S.ts";
import type { S as CcrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type { S as CcrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import type { S as CcrInviteResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrInvite/S.ts";
import type { S as CcrJoinRoomResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrJoinRoom/S.ts";
import type { S as CcrSetDummySettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetDummySettings/S.ts";
import type { S as CcrSetReadyResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetReady/S.ts";
import type { C as CcrSetSelfSettingsRequest } from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetSelfSettings/C.ts";
import type { S as CcrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetSelfSettings/S.ts";
import type { S as CcrStartWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCcrStartWar/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrCreateRoom,                callback: _onMsgCcrCreateRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrJoinRoom,                  callback: _onMsgCcrJoinRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrDeleteRoom,                callback: _onMsgCcrDeleteRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrExitRoom,                  callback: _onMsgCcrExitRoom },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrDeletePlayer,              callback: _onMsgCcrDeletePlayer },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrAddDummy,                  callback: _onMsgCcrAddDummy },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrSetDummySettings,          callback: _onMsgCcrSetDummySettings },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrInvite,                    callback: _onMsgCcrInvite },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrSetReady,                  callback: _onMsgCcrSetReady },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrSetSelfSettings,           callback: _onMsgCcrSetSelfSettings },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrGetRoomStaticInfo,         callback: _onMsgCcrGetRoomStaticInfo },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrGetRoomPlayerInfo,         callback: _onMsgCcrGetRoomPlayerInfo },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrGetJoinableRoomIdArray,    callback: _onMsgCcrGetJoinableRoomIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrGetJoinedRoomIdArray,      callback: _onMsgCcrGetJoinedRoomIdArray },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgCcrStartWar,                  callback: _onMsgCcrStartWar },
    ], null);
}

export function reqCreateRoom(param: CcrCreateRoomRequest): void {
    Networks_Manager.send({
        MsgCcrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgCcrCreateRoom(e: Egret_Egret.Event): void {
    const data = e.data as CcrCreateRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrCreateRoom, data);
    }
}

export function reqCcrJoinRoom(roomId: number): void {
    Networks_Manager.send({
        MsgCcrJoinRoom: { c: {
            roomId  : roomId,
        } },
    });
}
async function _onMsgCcrJoinRoom(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CcrJoinRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrJoinRoom, data);
    }
}

export function reqCcrDeleteRoom(roomId: number): void {
    Networks_Manager.send({
        MsgCcrDeleteRoom: { c: {
            roomId,
        } },
    });
}
function _onMsgCcrDeleteRoom(e: Egret_Egret.Event): void {
    const data = e.data as CcrDeleteRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrDeleteRoom, data);
    }
}

export function reqCcrExitRoom(roomId: number): void {
    Networks_Manager.send({
        MsgCcrExitRoom: { c: {
            roomId,
        }, },
    });
}
async function _onMsgCcrExitRoom(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CcrExitRoomResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrExitRoom, data);
    }
}

export function reqCcrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    Networks_Manager.send({
        MsgCcrDeletePlayer: { c: {
            roomId,
            playerIndex,
            forbidReentrance
        }, },
    });
}
async function _onMsgCcrDeletePlayer(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CcrDeletePlayerResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrDeletePlayer, data);
    }
}

export function reqCcrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgCcrAddDummy: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgCcrAddDummy(e: Egret_Egret.Event): void {
    const data = e.data as CcrAddDummyResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrAddDummy, data);
    }
}

export function reqCcrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgCcrSetDummySettings: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgCcrSetDummySettings(e: Egret_Egret.Event): void {
    const data = e.data as CcrSetDummySettingsResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrSetDummySettings, data);
    }
}

export function reqCcrInvite(roomId: number, userIdArray: number[]): void {
    Networks_Manager.send({
        MsgCcrInvite: { c: {
            roomId      : roomId,
            userIdArray : userIdArray,
        }}
    });
}
function _onMsgCcrInvite(e: Egret_Egret.Event): void {
    const data = e.data as CcrInviteResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrInvite, data);
    }
}

export function reqCcrSetReady(roomId: number, isReady: boolean): void {
    Networks_Manager.send({
        MsgCcrSetReady: { c: {
            roomId,
            isReady,
        }, },
    });
}
async function _onMsgCcrSetReady(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CcrSetReadyResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrSetReady, data);
    }
}

export function reqCcrSetSelfSettings(data: CcrSetSelfSettingsRequest): void {
    Networks_Manager.send({
        MsgCcrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgCcrSetSelfSettings(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CcrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrSetSelfSettings, data);
    }
}

export function reqCcrGetRoomStaticInfo(roomId: number): void {
    Networks_Manager.send({
        MsgCcrGetRoomStaticInfo: { c: {
            roomId,
        }, },
    });
}
async function _onMsgCcrGetRoomStaticInfo(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CcrGetRoomStaticInfoResponse;
    if (data.getErrorCode()) {
        CoopCustomRoom_Model_CcrModel.updateOnFailedMsgCcrGetRoomStaticInfo(data);
    } else {
        await CoopCustomRoom_Model_CcrModel.updateOnMsgCcrGetRoomStaticInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrGetRoomStaticInfo, data);
    }
}

export function reqCcrGetRoomPlayerInfo(roomId: number): void {
    Networks_Manager.send({
        MsgCcrGetRoomPlayerInfo: { c: {
            roomId,
        }, },
    });
}
function _onMsgCcrGetRoomPlayerInfo(e: Egret_Egret.Event): void {
    const data = e.data as CcrGetRoomPlayerInfoResponse;
    if (data.getErrorCode()) {
        CoopCustomRoom_Model_CcrModel.updateOnFailedMsgCcrGetRoomPlayerInfo(data);
    } else {
        CoopCustomRoom_Model_CcrModel.updateOnMsgCcrGetRoomPlayerInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrGetRoomPlayerInfo, data);
    }
}

export function reqCcrGetJoinableRoomIdArray(): void {
    Networks_Manager.send({
        MsgCcrGetJoinableRoomIdArray: { c: {
        } }
    });
}
function _onMsgCcrGetJoinableRoomIdArray(e: Egret_Egret.Event): void {
    const data = e.data as CcrGetJoinableRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        CoopCustomRoom_Model_CcrModel.setJoinableRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrGetJoinableRoomIdArray, data);
    }
}

export function reqCcrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({
        MsgCcrGetJoinedRoomIdArray: { c: {
        } }
    });
}
function _onMsgCcrGetJoinedRoomIdArray(e: Egret_Egret.Event): void {
    const data = e.data as CcrGetJoinedRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        CoopCustomRoom_Model_CcrModel.setJoinedRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrGetJoinedRoomIdArray, data);
    }
}

export function reqCcrStartWar(roomId: number): void {
    Networks_Manager.send({
        MsgCcrStartWar: { c: {
            roomId,
        }, },
    });
}
function _onMsgCcrStartWar(e: Egret_Egret.Event): void {
    const data = e.data as CcrStartWarResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCcrStartWar, data);
    }
}
