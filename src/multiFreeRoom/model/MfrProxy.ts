import {
    updateOnFailedMsgMfrGetRoomStaticInfo,
    updateOnMsgMfrGetRoomStaticInfo,
    updateOnFailedMsgMfrGetRoomPlayerInfo,
    updateOnMsgMfrGetRoomPlayerInfo,
    setJoinableRoomIdArray,
    setJoinedRoomIdArray,
} from "./MfrModel.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
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
import type { Event } from "../../egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgMfrCreateRoom,                callback: _onMsgMfrCreateRoom },
        { msgCode: MessageCodes.MsgMfrJoinRoom,                  callback: _onMsgMfrJoinRoom },
        { msgCode: MessageCodes.MsgMfrDeleteRoom,                callback: _onMsgMfrDeleteRoom },
        { msgCode: MessageCodes.MsgMfrExitRoom,                  callback: _onMsgMfrExitRoom },
        { msgCode: MessageCodes.MsgMfrDeletePlayer,              callback: _onMsgMfrDeletePlayer },
        { msgCode: MessageCodes.MsgMfrAddDummy,                  callback: _onMsgMfrAddDummy },
        { msgCode: MessageCodes.MsgMfrSetDummySettings,          callback: _onMsgMfrSetDummySettings },
        { msgCode: MessageCodes.MsgMfrInvite,                    callback: _onMsgMfrInvite },
        { msgCode: MessageCodes.MsgMfrSetReady,                  callback: _onMsgMfrSetReady },
        { msgCode: MessageCodes.MsgMfrSetSelfSettings,           callback: _onMsgMfrSetSelfSettings },
        { msgCode: MessageCodes.MsgMfrGetRoomStaticInfo,         callback: _onMsgMfrGetRoomStaticInfo },
        { msgCode: MessageCodes.MsgMfrGetRoomPlayerInfo,         callback: _onMsgMfrGetRoomPlayerInfo },
        { msgCode: MessageCodes.MsgMfrGetJoinableRoomIdArray,    callback: _onMsgMfrGetJoinableRoomIdArray },
        { msgCode: MessageCodes.MsgMfrGetJoinedRoomIdArray,      callback: _onMsgMfrGetJoinedRoomIdArray },
        { msgCode: MessageCodes.MsgMfrStartWar,                  callback: _onMsgMfrStartWar },
    ], null);
}

export function reqCreateRoom(param: MfrCreateRoomRequest): void {
    send({
        MsgMfrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgMfrCreateRoom(e: Event): void {
    const data = e.data as MfrCreateRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrCreateRoom, data);
    }
}

export function reqMfrJoinRoom(roomId: number): void {
    send({
        MsgMfrJoinRoom: { c: {
            roomId  : roomId,
        } },
    });
}
async function _onMsgMfrJoinRoom(e: Event): Promise<void> {
    const data = e.data as MfrJoinRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrJoinRoom, data);
    }
}

export function reqMfrDeleteRoom(roomId: number): void {
    send({
        MsgMfrDeleteRoom: { c: {
            roomId,
        } },
    });
}
function _onMsgMfrDeleteRoom(e: Event): void {
    const data = e.data as MfrDeleteRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrDeleteRoom, data);
    }
}

export function reqMfrExitRoom(roomId: number): void {
    send({
        MsgMfrExitRoom: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMfrExitRoom(e: Event): Promise<void> {
    const data = e.data as MfrExitRoomResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrExitRoom, data);
    }
}

export function reqMfrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    send({
        MsgMfrDeletePlayer: { c: {
            roomId,
            playerIndex,
            forbidReentrance
        }, },
    });
}
async function _onMsgMfrDeletePlayer(e: Event): Promise<void> {
    const data = e.data as MfrDeletePlayerResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrDeletePlayer, data);
    }
}

export function reqMfrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    send({
        MsgMfrAddDummy: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMfrAddDummy(e: Event): void {
    const data = e.data as MfrAddDummyResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrAddDummy, data);
    }
}

export function reqMfrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    send({
        MsgMfrSetDummySettings: { c: {
            roomId              : roomId,
            playerIndex         : playerIndex,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
        }, },
    });
}
function _onMsgMfrSetDummySettings(e: Event): void {
    const data = e.data as MfrSetDummySettingsResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrSetDummySettings, data);
    }
}

export function reqMfrInvite(roomId: number, userIdArray: number[]): void {
    send({
        MsgMfrInvite: { c: {
            roomId      : roomId,
            userIdArray : userIdArray,
        }}
    });
}
function _onMsgMfrInvite(e: Event): void {
    const data = e.data as MfrInviteResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrInvite, data);
    }
}

export function reqMfrSetReady(roomId: number, isReady: boolean): void {
    send({
        MsgMfrSetReady: { c: {
            roomId,
            isReady,
        }, },
    });
}
async function _onMsgMfrSetReady(e: Event): Promise<void> {
    const data = e.data as MfrSetReadyResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrSetReady, data);
    }
}

export function reqMfrSetSelfSettings(data: MfrSetSelfSettingsRequest): void {
    send({
        MsgMfrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgMfrSetSelfSettings(e: Event): Promise<void> {
    const data = e.data as MfrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrSetSelfSettings, data);
    }
}

export function reqMfrGetRoomStaticInfo(roomId: number): void {
    send({
        MsgMfrGetRoomStaticInfo: { c: {
            roomId,
        }, },
    });
}
async function _onMsgMfrGetRoomStaticInfo(e: Event): Promise<void> {
    const data = e.data as MfrGetRoomStaticInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgMfrGetRoomStaticInfo(data);
    } else {
        await updateOnMsgMfrGetRoomStaticInfo(data);
        dispatch(TypeId.MsgMfrGetRoomStaticInfo, data);
    }
}

export function reqMfrGetRoomPlayerInfo(roomId: number): void {
    send({
        MsgMfrGetRoomPlayerInfo: { c: {
            roomId,
        }, },
    });
}
function _onMsgMfrGetRoomPlayerInfo(e: Event): void {
    const data = e.data as MfrGetRoomPlayerInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgMfrGetRoomPlayerInfo(data);
    } else {
        updateOnMsgMfrGetRoomPlayerInfo(data);
        dispatch(TypeId.MsgMfrGetRoomPlayerInfo, data);
    }
}

export function reqMfrGetJoinableRoomIdArray(): void {
    send({
        MsgMfrGetJoinableRoomIdArray: { c: {
        } }
    });
}
function _onMsgMfrGetJoinableRoomIdArray(e: Event): void {
    const data = e.data as MfrGetJoinableRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        setJoinableRoomIdArray(data.getRoomIdArray());
        dispatch(TypeId.MsgMfrGetJoinableRoomIdArray, data);
    }
}

export function reqMfrGetJoinedRoomIdArray(): void {
    send({
        MsgMfrGetJoinedRoomIdArray: { c: {
        } }
    });
}
function _onMsgMfrGetJoinedRoomIdArray(e: Event): void {
    const data = e.data as MfrGetJoinedRoomIdArrayResponse;
    if (!data.getErrorCode()) {
        setJoinedRoomIdArray(data.getRoomIdArray());
        dispatch(TypeId.MsgMfrGetJoinedRoomIdArray, data);
    }
}

export function reqMfrStartWar(roomId: number): void {
    send({
        MsgMfrStartWar: { c: {
            roomId,
        }, },
    });
}
function _onMsgMfrStartWar(e: Event): void {
    const data = e.data as MfrStartWarResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMfrStartWar, data);
    }
}
