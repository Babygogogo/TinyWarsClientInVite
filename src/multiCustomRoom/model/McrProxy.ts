import {
    updateOnFailedMsgMcrGetRoomStaticInfo,
    updateOnMsgMcrGetRoomStaticInfo,
    updateOnFailedMsgMcrGetRoomPlayerInfo,
    updateOnMsgMcrGetRoomPlayerInfo,
    setJoinableRoomIdArray,
    setJoinedRoomIdArray,
} from "./McrModel.ts";
import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMcrAddDummy/S.ts";
import type { C } from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/C.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrCreateRoomS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrDeletePlayerS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrDeletePlayer/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrDeleteRoomS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrDeleteRoom/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMcrExitRoomS } from "../../proto/schema/CommonProto/NetMessage/MsgMcrExitRoom/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrGetJoinableRoomIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetJoinableRoomIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrGetJoinedRoomIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetJoinedRoomIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMcrInviteS } from "../../proto/schema/CommonProto/NetMessage/MsgMcrInvite/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS } from "../../proto/schema/CommonProto/NetMessage/MsgMcrJoinRoom/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrSetDummySettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetDummySettings/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMcrSetReadyS } from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetReady/S.ts";
import type {
    C as ProtoSchemaCommonProtoNetMessageMsgMcrSetSelfSettingsC,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetSelfSettings/C.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMcrSetSelfSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetSelfSettings/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMcrStartWarS } from "../../proto/schema/CommonProto/NetMessage/MsgMcrStartWar/S.ts";
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

export function reqCreateRoom(param: C): void {
    send({
        MsgMcrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgMcrCreateRoom(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrCreateRoomS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrJoinRoomS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrDeleteRoomS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrExitRoomS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrDeletePlayerS;
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
    const data = e.data as S;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrSetDummySettingsS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrInviteS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrSetReadyS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrSetReady, data);
    }
}

export function reqMcrSetSelfSettings(data: ProtoSchemaCommonProtoNetMessageMsgMcrSetSelfSettingsC): void {
    send({
        MsgMcrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgMcrSetSelfSettings(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrSetSelfSettingsS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomStaticInfoS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetRoomPlayerInfoS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetJoinableRoomIdArrayS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrGetJoinedRoomIdArrayS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgMcrStartWarS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgMcrStartWar, data);
    }
}
