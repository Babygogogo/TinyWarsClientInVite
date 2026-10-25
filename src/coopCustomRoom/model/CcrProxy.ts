import {
    updateOnFailedMsgCcrGetRoomStaticInfo,
    updateOnMsgCcrGetRoomStaticInfo,
    updateOnFailedMsgCcrGetRoomPlayerInfo,
    updateOnMsgCcrGetRoomPlayerInfo,
    setJoinableRoomIdArray,
    setJoinedRoomIdArray,
} from "./CcrModel.ts";
import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgCcrAddDummy/S.ts";
import type { C } from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/C.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrDeletePlayerS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrDeletePlayer/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrDeleteRoomS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrDeleteRoom/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgCcrExitRoomS } from "../../proto/schema/CommonProto/NetMessage/MsgCcrExitRoom/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrGetJoinableRoomIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetJoinableRoomIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrGetJoinedRoomIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetJoinedRoomIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgCcrInviteS } from "../../proto/schema/CommonProto/NetMessage/MsgCcrInvite/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS } from "../../proto/schema/CommonProto/NetMessage/MsgCcrJoinRoom/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrSetDummySettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetDummySettings/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgCcrSetReadyS } from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetReady/S.ts";
import type {
    C as ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsC,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetSelfSettings/C.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetSelfSettings/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgCcrStartWarS } from "../../proto/schema/CommonProto/NetMessage/MsgCcrStartWar/S.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

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

export function reqCreateRoom(param: C): void {
    send({
        MsgCcrCreateRoom: { c: param.toJson() },
    });
}
function _onMsgCcrCreateRoom(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrDeleteRoomS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrExitRoomS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrDeletePlayerS;
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
    const data = e.data as S;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrSetDummySettingsS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrInviteS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrSetReadyS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrSetReady, data);
    }
}

export function reqCcrSetSelfSettings(data: ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsC): void {
    send({
        MsgCcrSetSelfSettings: { c: data.toJson() },
    });
}
async function _onMsgCcrSetSelfSettings(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrSetSelfSettingsS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomPlayerInfoS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetJoinableRoomIdArrayS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrGetJoinedRoomIdArrayS;
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
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCcrStartWarS;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgCcrStartWar, data);
    }
}
