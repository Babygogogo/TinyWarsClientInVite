import * as BroadcastsProvider from "./Provider.ts";
import * as NetworksManager from "../networks/Manager.ts";
import * as NetworksMessageCodes from "../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgBroadcastAddMessageS from "../proto/schema/CommonProto/NetMessage/MsgBroadcastAddMessage/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgBroadcastDeleteMessageS from "../proto/schema/CommonProto/NetMessage/MsgBroadcastDeleteMessage/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgBroadcastDoBroadcastS from "../proto/schema/CommonProto/NetMessage/MsgBroadcastDoBroadcast/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgBroadcastGetAllMessageIdArrayS from "../proto/schema/CommonProto/NetMessage/MsgBroadcastGetAllMessageIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgBroadcastGetMessageDataS from "../proto/schema/CommonProto/NetMessage/MsgBroadcastGetMessageData/S.ts";
import type * as ProtoSchemaCommonProtoStructureLanguageText from "../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgBroadcastAddMessage,              callback: _onMsgBroadcastAddMessage },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgBroadcastDeleteMessage,           callback: _onMsgBroadcastDeleteMessage, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgBroadcastDoBroadcast,             callback: _onMsgBroadcastDoBroadcast },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgBroadcastGetAllMessageIdArray,    callback: _onMsgBroadcastGetAllMessageIdArray, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgBroadcastGetMessageData,          callback: _onMsgBroadcastGetMessageData },
    ], null);
}

export function reqBroadcastAddMessage(textList: ProtoSchemaCommonProtoStructureLanguageText.LanguageText[], startTime: number, endTime: number): void {
    NetworksManager.send({
        MsgBroadcastAddMessage: { c: {
            textList    : textList.map(v => v.toJson()),
            startTime   : startTime,
            endTime     : endTime,
        } },
    });
}
function _onMsgBroadcastAddMessage(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgBroadcastAddMessageS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgBroadcastAddMessage, data);
    }
}

export function reqBroadcastDeleteMessage(messageId: number): void {
    NetworksManager.send({
        MsgBroadcastDeleteMessage: { c: {
            messageId,
        } },
    });
}
function _onMsgBroadcastDeleteMessage(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgBroadcastDeleteMessageS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgBroadcastDeleteMessage, data);
    }
}

export function reqBroadcastDoBroadcast(): void {
    NetworksManager.send({
        MsgBroadcastDoBroadcast: { c: {
        } },
    });
}
function _onMsgBroadcastDoBroadcast(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgBroadcastDoBroadcastS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgBroadcastDoBroadcast, data);
    }
}

export function reqBroadcastGetAllMessageIdArray(): void {
    NetworksManager.send({ MsgBroadcastGetAllMessageIdArray: { c: {
    } }, });
}
function _onMsgBroadcastGetAllMessageIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgBroadcastGetAllMessageIdArrayS.S;
    if (!data.getErrorCode()) {
        BroadcastsProvider.setAllMessageIdArray(data.getMessageIdArray());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgBroadcastGetAllMessageIdArray, data);
    }
}

export function reqBroadcastGetMessageData(messageId: number): void {
    NetworksManager.send({ MsgBroadcastGetMessageData: { c: {
        messageId,
    } } });
}
function _onMsgBroadcastGetMessageData(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgBroadcastGetMessageDataS.S;
    if (data.getErrorCode()) {
        BroadcastsProvider.updateOnFailedMsgBroadcastGetMessageData(data);
    } else {
        BroadcastsProvider.updateOnMsgBroadcastGetMessageData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgBroadcastGetMessageData, data);
    }
}
