import {
    updateOnFailedMsgMcrGetRoomStaticInfo,
    updateOnMsgMcrGetRoomStaticInfo,
    updateOnFailedMsgMcrGetRoomPlayerInfo,
    updateOnMsgMcrGetRoomPlayerInfo,
    setJoinableRoomIdArray,
    setJoinedRoomIdArray,
} from "./McrModel.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
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
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgMcrCreateRoom,                callback: _onMsgMcrCreateRoom },
        { msgCode: MessageCodes.MsgMcrJoinRoom,                  callback: _onMsgMcrJoinRoom },
        { msgCode: MessageCodes.MsgMcrDeleteRoom,                callback: _onMsgMcrDeleteRoom },
        { msgCode: MessageCodes.MsgMcrExitRoom,                  callback: _onMsgMcrExitRoom },
        { msgCode: MessageCodes.MsgMcrDeletePlayer,              callback: _onMsgMcrDeletePlayer },
        { msgCode: MessageCodes.MsgMcrAddDummy,                  callback: _onMsgMcrAddDummy },
        { msgCode: MessageCodes.MsgMcrSetDummySettings,          callback: _onMsgMcrSetDummySettings },
        { msgCode: MessageCodes.MsgMcrInvite,                    callback: _onMsgMcrInvite },
        { msgCode: MessageCodes.MsgMcrSetReady,                  callback: _onMsgMcrSetReady },
        { msgCode: MessageCodes.MsgMcrSetSelfSettings,           callback: _onMsgMcrSetSelfSettings },
        { msgCode: MessageCodes.MsgMcrGetRoomStaticInfo,         callback: _onMsgMcrGetRoomStaticInfo },
        { msgCode: MessageCodes.MsgMcrGetRoomPlayerInfo,         callback: _onMsgMcrGetRoomPlayerInfo },
        { msgCode: MessageCodes.MsgMcrGetJoinableRoomIdArray,    callback: _onMsgMcrGetJoinableRoomIdArray },
        { msgCode: MessageCodes.MsgMcrGetJoinedRoomIdArray,      callback: _onMsgMcrGetJoinedRoomIdArray },
        { msgCode: MessageCodes.MsgMcrStartWar,                  callback: _onMsgMcrStartWar },
    ], null);
}

export function reqCreateRoom(param: McrCreateRoomRequest): void {
    send({
        MsgMcrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgMcrCreateRoom(e: Event): void {
    const data = e.data as McrCreateRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrCreateRoom, data);
    } else {
        dispatch(TypeId.MsgMcrCreateRoomFailed, data);
    }
}

export function reqMcrJoinRoom(roomId: number): void {
    send({
        MsgMcrJoinRoom: { c: {
            roomId  : roomId,
        } },
    });
}
async function _onMsgMcrJoinRoom(e: Event): Promise<void> {
    const data = e.data as McrJoinRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrJoinRoom, data);
    }
}

export function reqMcrDeleteRoom(roomId: number): void {
    send({
        MsgMcrDeleteRoom: { c: {
            roomId,
        } },
    });
}
function _onMsgMcrDeleteRoom(e: Event): void {
    const data = e.data as McrDeleteRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrDeleteRoom, data);
    }
}

export function reqMcrExitRoom(roomId: number): void {
    send({
        MsgMcrExitRoom: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMcrExitRoom(e: Event): Promise<void> {
    const data = e.data as McrExitRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrExitRoom, data);
    }
}

export function reqMcrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    send({
        MsgMcrDeletePlayer: { c: {
            roomId,
            playerIndex,
            forbidReentrance
        }, },
    });
}
async function _onMsgMcrDeletePlayer(e: Event): Promise<void> {
    const data = e.data as McrDeletePlayerResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrDeletePlayer, data);
    }
}

export function reqMcrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    send({
        MsgMcrAddDummy: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMcrAddDummy(e: Event): void {
    const data = e.data as McrAddDummyResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrAddDummy, data);
    }
}

export function reqMcrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    send({
        MsgMcrSetDummySettings: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMcrSetDummySettings(e: Event): void {
    const data = e.data as McrSetDummySettingsResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrSetDummySettings, data);
    }
}

export function reqMcrInvite(roomId: number, userIdArray: number[]): void {
    send({
        MsgMcrInvite: { c: {
            roomId      : roomId,
            userIdArray : userIdArray,
        }}
    });
}
function _onMsgMcrInvite(e: Event): void {
    const data = e.data as McrInviteResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrInvite, data);
    }
}

export function reqMcrSetReady(roomId: number, isReady: boolean): void {
    send({
        MsgMcrSetReady: { c: {
            roomId,
            isReady,
        }, },
    });
}
async function _onMsgMcrSetReady(e: Event): Promise<void> {
    const data = e.data as McrSetReadyResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrSetReady, data);
    }
}

export function reqMcrSetSelfSettings(data: McrSetSelfSettingsRequest): void {
    send({
        MsgMcrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgMcrSetSelfSettings(e: Event): Promise<void> {
    const data = e.data as McrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrSetSelfSettings, data);
    }
}

export function reqMcrGetRoomStaticInfo(roomId: number): void {
    send({
        MsgMcrGetRoomStaticInfo: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMcrGetRoomStaticInfo(e: Event): Promise<void> {
    const data = e.data as McrGetRoomStaticInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgMcrGetRoomStaticInfo(data);
        dispatch(TypeId.MsgMcrGetRoomStaticInfoFailed, data);
    } else {
        await updateOnMsgMcrGetRoomStaticInfo(data);
        dispatch(TypeId.MsgMcrGetRoomStaticInfo, data);
    }
}

export function reqMcrGetRoomPlayerInfo(roomId: number): void {
    send({
        MsgMcrGetRoomPlayerInfo: { c: {
            roomId,
        }, },
    });
}
function _onMsgMcrGetRoomPlayerInfo(e: Event): void {
    const data = e.data as McrGetRoomPlayerInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgMcrGetRoomPlayerInfo(data);
        dispatch(TypeId.MsgMcrGetRoomPlayerInfoFailed, data);
    } else {
        updateOnMsgMcrGetRoomPlayerInfo(data);
        dispatch(TypeId.MsgMcrGetRoomPlayerInfo, data);
    }
}

export function reqMcrGetJoinableRoomIdArray(): void {
    send({
        MsgMcrGetJoinableRoomIdArray: { c: {
        } }
    });
}
function _onMsgMcrGetJoinableRoomIdArray(e: Event): void {
    const data = e.data as McrGetJoinableRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        setJoinableRoomIdArray(data.getRoomIdArray());
        dispatch(TypeId.MsgMcrGetJoinableRoomIdArray, data);
    }
}

export function reqMcrGetJoinedRoomIdArray(): void {
    send({
        MsgMcrGetJoinedRoomIdArray: { c: {
        } }
    });
}
function _onMsgMcrGetJoinedRoomIdArray(e: Event): void {
    const data = e.data as McrGetJoinedRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        setJoinedRoomIdArray(data.getRoomIdArray());
        dispatch(TypeId.MsgMcrGetJoinedRoomIdArray, data);
    }
}

export function reqMcrStartWar(roomId: number): void {
    send({
        MsgMcrStartWar: { c: {
            roomId,
        }, },
    });
}
function _onMsgMcrStartWar(e: Event): void {
    const data = e.data as McrStartWarResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrStartWar, data);
    }
}
