import {
    updateOnFailedMsgAtrGetRoomPublicInfo,
    updateOnMsgAtrGetRoomPublicInfo,
    setJoinedRoomIdArray,
    updateOnMsgAtrSetBannedCoIdArray,
    updateOnMsgAtrSetSelfSettings,
    updateOnMsgAtrDeleteRoomByServer,
} from "./Provider.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as AtrDeleteRoomByServerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrDeleteRoomByServer/S.ts";
import type { S as AtrGetJoinedRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetJoinedRoomIdArray/S.ts";
import type { S as AtrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetRoomPublicInfo/S.ts";
import type { S as AtrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetBannedCoIdArray/S.ts";
import type { S as AtrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetSelfSettings/S.ts";
import type { Event } from "../../egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgAtrGetRoomPublicInfo,             callback: _onMsgAtrGetRoomPublicInfo },
        { msgCode: MessageCodes.MsgAtrGetJoinedRoomIdArray,          callback: _onMsgAtrGetJoinedRoomIdArray },
        { msgCode: MessageCodes.MsgAtrSetBannedCoIdArray,            callback: _onMsgAtrSetBannedCoIdArray },
        { msgCode: MessageCodes.MsgAtrSetSelfSettings,               callback: _onMsgAtrSetSelfSettings },
        { msgCode: MessageCodes.MsgAtrDeleteRoomByServer,            callback: _onMsgAtrDeleteRoomByServer },
    ]);
}

export function reqAtrGetRoomPublicInfo(roomId: number): void {
    send({ MsgAtrGetRoomPublicInfo: { c: {
        roomId,
    } }, });
}
async function _onMsgAtrGetRoomPublicInfo(e: Event): Promise<void> {
    const data = e.data as AtrGetRoomPublicInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgAtrGetRoomPublicInfo(data);
    } else {
        await updateOnMsgAtrGetRoomPublicInfo(data);
        dispatch(TypeId.MsgAtrGetRoomPublicInfo, data);
    }
}

export function reqAtrGetJoinedRoomIdArray(): void {
    send({ MsgAtrGetJoinedRoomIdArray: { c: {
    }, }, });
}
function _onMsgAtrGetJoinedRoomIdArray(e: Event): void {
    const data = e.data as AtrGetJoinedRoomIdArrayResponse;
    setJoinedRoomIdArray(data.getRoomIdArray());
    dispatch(TypeId.MsgAtrGetJoinedRoomIdArray, data);
}

export function reqAtrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    send({ MsgAtrSetBannedCoIdArray: { c: {
        roomId          : roomId,
        bannedCoIdArray : bannedCoIdArray,
    } }, });
}
async function _onMsgAtrSetBannedCoIdArray(e: Event): Promise<void> {
    const data = e.data as AtrSetBannedCoIdArrayResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgAtrSetBannedCoIdArray(data);
        dispatch(TypeId.MsgAtrSetBannedCoIdArray, data);
    }
}

export function reqAtrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    send({ MsgAtrSetSelfSettings: { c: {
        roomId,
        coId,
        unitAndTileSkinId,
    }, }, });
}
async function _onMsgAtrSetSelfSettings(e: Event): Promise<void> {
    const data = e.data as AtrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgAtrSetSelfSettings(data);
        dispatch(TypeId.MsgAtrSetSelfSettings, data);
    }
}

function _onMsgAtrDeleteRoomByServer(e: Event): void {
    const data = e.data as AtrDeleteRoomByServerResponse;
    updateOnMsgAtrDeleteRoomByServer(data);
    dispatch(TypeId.MsgAtrDeleteRoomByServer, data);
}
