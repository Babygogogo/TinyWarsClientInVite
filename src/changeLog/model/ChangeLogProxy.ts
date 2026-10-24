import * as ChangeLogModelChangeLogModel from "./ChangeLogModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChangeLogAddMessageS from "../../proto/schema/CommonProto/NetMessage/MsgChangeLogAddMessage/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChangeLogGetMessageListS from "../../proto/schema/CommonProto/NetMessage/MsgChangeLogGetMessageList/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChangeLogModifyMessageS from "../../proto/schema/CommonProto/NetMessage/MsgChangeLogModifyMessage/S.ts";
import type * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type LanguageText       = ProtoSchemaCommonProtoStructureLanguageText.LanguageText;

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgChangeLogAddMessage,         callback: _onMsgChangeLogAddMessage },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgChangeLogModifyMessage,      callback: _onMsgChangeLogModifyMessage },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgChangeLogGetMessageList,     callback: _onMsgChangeLogGetMessageList, },
    ], null);
}

export function reqChangeLogAddMessage(textList: LanguageText[]): void {
    NetworksManager.send({
        MsgChangeLogAddMessage: { c: {
            textList: textList.map(v => v.toJson()),
        } },
    });
}
function _onMsgChangeLogAddMessage(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChangeLogAddMessageS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgChangeLogAddMessage, data);
    }
}

export function reqChangeLogModifyMessage(messageId: number, textList: LanguageText[]): void {
    NetworksManager.send({
        MsgChangeLogModifyMessage: { c: {
            messageId   : messageId,
            textList    : textList.map(v => v.toJson()),
        } },
    });
}
function _onMsgChangeLogModifyMessage(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChangeLogModifyMessageS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgChangeLogModifyMessage, data);
    }
}

export function reqChangeLogGetMessageList(): void {
    NetworksManager.send({ MsgChangeLogGetMessageList: { c: {
    } }, });
}
function _onMsgChangeLogGetMessageList(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChangeLogGetMessageListS.S;
    if (!data.getErrorCode()) {
        ChangeLogModelChangeLogModel.setAllMessageList(data.getMessageList());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgChangeLogGetMessageList, data);
    }
}
