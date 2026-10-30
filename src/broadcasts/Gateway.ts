import {
    setAllMessageIdArray,
    updateOnFailedMsgBroadcastGetMessageData,
    updateOnMsgBroadcastGetMessageData,
} from "./Provider.ts";
import {
    addListeners,
    send,
} from "../networks/Manager.ts";
import { MessageCodes } from "../networks/MessageCodes.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { S as BroadcastAddMessageResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastAddMessage/S.ts";
import type { S as BroadcastDeleteMessageResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastDeleteMessage/S.ts";
import type { S as BroadcastDoBroadcastResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastDoBroadcast/S.ts";
import type { S as BroadcastGetAllMessageIdArrayResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastGetAllMessageIdArray/S.ts";
import type { S as BroadcastGetMessageDataResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastGetMessageData/S.ts";
import type { LanguageText } from "../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { Event } from "../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgBroadcastAddMessage,              callback: _onMsgBroadcastAddMessage },
        { msgCode: MessageCodes.MsgBroadcastDeleteMessage,           callback: _onMsgBroadcastDeleteMessage, },
        { msgCode: MessageCodes.MsgBroadcastDoBroadcast,             callback: _onMsgBroadcastDoBroadcast },
        { msgCode: MessageCodes.MsgBroadcastGetAllMessageIdArray,    callback: _onMsgBroadcastGetAllMessageIdArray, },
        { msgCode: MessageCodes.MsgBroadcastGetMessageData,          callback: _onMsgBroadcastGetMessageData },
    ], null);
}

export function reqBroadcastAddMessage(textList: LanguageText[], startTime: number, endTime: number): void {
    send({
        MsgBroadcastAddMessage: { c: {
            textList    : textList.map(v => v.toJson()),
            startTime   : startTime,
            endTime     : endTime,
        } },
    });
}
function _onMsgBroadcastAddMessage(e: Event): void {
    const data = e.data as BroadcastAddMessageResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgBroadcastAddMessage, data);
    }
}

export function reqBroadcastDeleteMessage(messageId: number): void {
    send({
        MsgBroadcastDeleteMessage: { c: {
            messageId,
        } },
    });
}
function _onMsgBroadcastDeleteMessage(e: Event): void {
    const data = e.data as BroadcastDeleteMessageResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgBroadcastDeleteMessage, data);
    }
}

export function reqBroadcastDoBroadcast(): void {
    send({
        MsgBroadcastDoBroadcast: { c: {
        } },
    });
}
function _onMsgBroadcastDoBroadcast(e: Event): void {
    const data = e.data as BroadcastDoBroadcastResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgBroadcastDoBroadcast, data);
    }
}

export function reqBroadcastGetAllMessageIdArray(): void {
    send({ MsgBroadcastGetAllMessageIdArray: { c: {
    } }, });
}
function _onMsgBroadcastGetAllMessageIdArray(e: Event): void {
    const data = e.data as BroadcastGetAllMessageIdArrayResponse;
    if (!data.getErrorCode()) {
        setAllMessageIdArray(data.getMessageIdArray());
        dispatch(TypeId.MsgBroadcastGetAllMessageIdArray, data);
    }
}

export function reqBroadcastGetMessageData(messageId: number): void {
    send({ MsgBroadcastGetMessageData: { c: {
        messageId,
    } } });
}
function _onMsgBroadcastGetMessageData(e: Event): void {
    const data = e.data as BroadcastGetMessageDataResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgBroadcastGetMessageData(data);
    } else {
        updateOnMsgBroadcastGetMessageData(data);
        dispatch(TypeId.MsgBroadcastGetMessageData, data);
    }
}
