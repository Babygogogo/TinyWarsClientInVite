import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Broadcasts_Provider,
    Notifications_TypeId,
    type Egret_Egret,
} from "../internal.ts";
import type { S as BroadcastAddMessageResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastAddMessage/S.ts";
import type { S as BroadcastDeleteMessageResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastDeleteMessage/S.ts";
import type { S as BroadcastDoBroadcastResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastDoBroadcast/S.ts";
import type { S as BroadcastGetAllMessageIdArrayResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastGetAllMessageIdArray/S.ts";
import type { S as BroadcastGetMessageDataResponse } from "../proto/schema/CommonProto/NetMessage/MsgBroadcastGetMessageData/S.ts";
import type { LanguageText } from "../proto/schema/CommonProto/Structure/LanguageText.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode: Networks_MessageCodes.MessageCodes.MsgBroadcastAddMessage,              callback: _onMsgBroadcastAddMessage },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgBroadcastDeleteMessage,           callback: _onMsgBroadcastDeleteMessage, },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgBroadcastDoBroadcast,             callback: _onMsgBroadcastDoBroadcast },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgBroadcastGetAllMessageIdArray,    callback: _onMsgBroadcastGetAllMessageIdArray, },
        { msgCode: Networks_MessageCodes.MessageCodes.MsgBroadcastGetMessageData,          callback: _onMsgBroadcastGetMessageData },
    ], null);
}

export function reqBroadcastAddMessage(textList: LanguageText[], startTime: number, endTime: number): void {
    Networks_Manager.send({
        MsgBroadcastAddMessage: { c: {
            textList    : textList.map(v => v.toJson()),
            startTime   : startTime,
            endTime     : endTime,
        } },
    });
}
function _onMsgBroadcastAddMessage(e: Egret_Egret.Event): void {
    const data = e.data as BroadcastAddMessageResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgBroadcastAddMessage, data);
    }
}

export function reqBroadcastDeleteMessage(messageId: number): void {
    Networks_Manager.send({
        MsgBroadcastDeleteMessage: { c: {
            messageId,
        } },
    });
}
function _onMsgBroadcastDeleteMessage(e: Egret_Egret.Event): void {
    const data = e.data as BroadcastDeleteMessageResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgBroadcastDeleteMessage, data);
    }
}

export function reqBroadcastDoBroadcast(): void {
    Networks_Manager.send({
        MsgBroadcastDoBroadcast: { c: {
        } },
    });
}
function _onMsgBroadcastDoBroadcast(e: Egret_Egret.Event): void {
    const data = e.data as BroadcastDoBroadcastResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgBroadcastDoBroadcast, data);
    }
}

export function reqBroadcastGetAllMessageIdArray(): void {
    Networks_Manager.send({ MsgBroadcastGetAllMessageIdArray: { c: {
    } }, });
}
function _onMsgBroadcastGetAllMessageIdArray(e: Egret_Egret.Event): void {
    const data = e.data as BroadcastGetAllMessageIdArrayResponse;
    if (!data.getErrorCode()) {
        Broadcasts_Provider.setAllMessageIdArray(data.getMessageIdArray());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgBroadcastGetAllMessageIdArray, data);
    }
}

export function reqBroadcastGetMessageData(messageId: number): void {
    Networks_Manager.send({ MsgBroadcastGetMessageData: { c: {
        messageId,
    } } });
}
function _onMsgBroadcastGetMessageData(e: Egret_Egret.Event): void {
    const data = e.data as BroadcastGetMessageDataResponse;
    if (data.getErrorCode()) {
        Broadcasts_Provider.updateOnFailedMsgBroadcastGetMessageData(data);
    } else {
        Broadcasts_Provider.updateOnMsgBroadcastGetMessageData(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgBroadcastGetMessageData, data);
    }
}
