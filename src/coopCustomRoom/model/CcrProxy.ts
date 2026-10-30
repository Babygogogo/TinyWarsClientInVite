import {
    updateOnFailedMsgCcrGetRoomStaticInfo,
    updateOnMsgCcrGetRoomStaticInfo,
    updateOnFailedMsgCcrGetRoomPlayerInfo,
    updateOnMsgCcrGetRoomPlayerInfo,
    setJoinableRoomIdArray,
    setJoinedRoomIdArray,
} from "./CcrModel.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
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
import type { Event } from "../../egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgCcrCreateRoom,                callback: _onMsgCcrCreateRoom },
        { msgCode: MessageCodes.MsgCcrJoinRoom,                  callback: _onMsgCcrJoinRoom },
        { msgCode: MessageCodes.MsgCcrDeleteRoom,                callback: _onMsgCcrDeleteRoom },
        { msgCode: MessageCodes.MsgCcrExitRoom,                  callback: _onMsgCcrExitRoom },
        { msgCode: MessageCodes.MsgCcrDeletePlayer,              callback: _onMsgCcrDeletePlayer },
        { msgCode: MessageCodes.MsgCcrAddDummy,                  callback: _onMsgCcrAddDummy },
        { msgCode: MessageCodes.MsgCcrSetDummySettings,          callback: _onMsgCcrSetDummySettings },
        { msgCode: MessageCodes.MsgCcrInvite,                    callback: _onMsgCcrInvite },
        { msgCode: MessageCodes.MsgCcrSetReady,                  callback: _onMsgCcrSetReady },
        { msgCode: MessageCodes.MsgCcrSetSelfSettings,           callback: _onMsgCcrSetSelfSettings },
        { msgCode: MessageCodes.MsgCcrGetRoomStaticInfo,         callback: _onMsgCcrGetRoomStaticInfo },
        { msgCode: MessageCodes.MsgCcrGetRoomPlayerInfo,         callback: _onMsgCcrGetRoomPlayerInfo },
        { msgCode: MessageCodes.MsgCcrGetJoinableRoomIdArray,    callback: _onMsgCcrGetJoinableRoomIdArray },
        { msgCode: MessageCodes.MsgCcrGetJoinedRoomIdArray,      callback: _onMsgCcrGetJoinedRoomIdArray },
        { msgCode: MessageCodes.MsgCcrStartWar,                  callback: _onMsgCcrStartWar },
    ], null);
}

export function reqCreateRoom(param: CcrCreateRoomRequest): void {
    send({
        MsgCcrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgCcrCreateRoom(e: Event): void {
    const data = e.data as CcrCreateRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrCreateRoom, data);
    }
}

export function reqCcrJoinRoom(roomId: number): void {
    send({
        MsgCcrJoinRoom: { c: {
            roomId  : roomId,
        } },
    });
}
async function _onMsgCcrJoinRoom(e: Event): Promise<void> {
    const data = e.data as CcrJoinRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrJoinRoom, data);
    }
}

export function reqCcrDeleteRoom(roomId: number): void {
    send({
        MsgCcrDeleteRoom: { c: {
            roomId,
        } },
    });
}
function _onMsgCcrDeleteRoom(e: Event): void {
    const data = e.data as CcrDeleteRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrDeleteRoom, data);
    }
}

export function reqCcrExitRoom(roomId: number): void {
    send({
        MsgCcrExitRoom: { c: {
            roomId,
        }, },
    });
}
async function _onMsgCcrExitRoom(e: Event): Promise<void> {
    const data = e.data as CcrExitRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrExitRoom, data);
    }
}

export function reqCcrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    send({
        MsgCcrDeletePlayer: { c: {
            roomId,
            playerIndex,
            forbidReentrance
        }, },
    });
}
async function _onMsgCcrDeletePlayer(e: Event): Promise<void> {
    const data = e.data as CcrDeletePlayerResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrDeletePlayer, data);
    }
}

export function reqCcrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    send({
        MsgCcrAddDummy: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgCcrAddDummy(e: Event): void {
    const data = e.data as CcrAddDummyResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrAddDummy, data);
    }
}

export function reqCcrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    send({
        MsgCcrSetDummySettings: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgCcrSetDummySettings(e: Event): void {
    const data = e.data as CcrSetDummySettingsResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrSetDummySettings, data);
    }
}

export function reqCcrInvite(roomId: number, userIdArray: number[]): void {
    send({
        MsgCcrInvite: { c: {
            roomId      : roomId,
            userIdArray : userIdArray,
        }}
    });
}
function _onMsgCcrInvite(e: Event): void {
    const data = e.data as CcrInviteResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrInvite, data);
    }
}

export function reqCcrSetReady(roomId: number, isReady: boolean): void {
    send({
        MsgCcrSetReady: { c: {
            roomId,
            isReady,
        }, },
    });
}
async function _onMsgCcrSetReady(e: Event): Promise<void> {
    const data = e.data as CcrSetReadyResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrSetReady, data);
    }
}

export function reqCcrSetSelfSettings(data: CcrSetSelfSettingsRequest): void {
    send({
        MsgCcrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgCcrSetSelfSettings(e: Event): Promise<void> {
    const data = e.data as CcrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrSetSelfSettings, data);
    }
}

export function reqCcrGetRoomStaticInfo(roomId: number): void {
    send({
        MsgCcrGetRoomStaticInfo: { c: {
            roomId,
        }, },
    });
}
async function _onMsgCcrGetRoomStaticInfo(e: Event): Promise<void> {
    const data = e.data as CcrGetRoomStaticInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgCcrGetRoomStaticInfo(data);
    } else {
        await updateOnMsgCcrGetRoomStaticInfo(data);
        dispatch(TypeId.MsgCcrGetRoomStaticInfo, data);
    }
}

export function reqCcrGetRoomPlayerInfo(roomId: number): void {
    send({
        MsgCcrGetRoomPlayerInfo: { c: {
            roomId,
        }, },
    });
}
function _onMsgCcrGetRoomPlayerInfo(e: Event): void {
    const data = e.data as CcrGetRoomPlayerInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgCcrGetRoomPlayerInfo(data);
    } else {
        updateOnMsgCcrGetRoomPlayerInfo(data);
        dispatch(TypeId.MsgCcrGetRoomPlayerInfo, data);
    }
}

export function reqCcrGetJoinableRoomIdArray(): void {
    send({
        MsgCcrGetJoinableRoomIdArray: { c: {
        } }
    });
}
function _onMsgCcrGetJoinableRoomIdArray(e: Event): void {
    const data = e.data as CcrGetJoinableRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        setJoinableRoomIdArray(data.getRoomIdArray());
        dispatch(TypeId.MsgCcrGetJoinableRoomIdArray, data);
    }
}

export function reqCcrGetJoinedRoomIdArray(): void {
    send({
        MsgCcrGetJoinedRoomIdArray: { c: {
        } }
    });
}
function _onMsgCcrGetJoinedRoomIdArray(e: Event): void {
    const data = e.data as CcrGetJoinedRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        setJoinedRoomIdArray(data.getRoomIdArray());
        dispatch(TypeId.MsgCcrGetJoinedRoomIdArray, data);
    }
}

export function reqCcrStartWar(roomId: number): void {
    send({
        MsgCcrStartWar: { c: {
            roomId,
        }, },
    });
}
function _onMsgCcrStartWar(e: Event): void {
    const data = e.data as CcrStartWarResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrStartWar, data);
    }
}
