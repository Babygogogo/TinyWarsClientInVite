import type * as ChatConstants from "./Constants.ts";
import * as ChatModel from "./Model.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NetworksManager from "../networks/Manager.ts";
import * as NetworksMessageCodes from "../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChatAddMessageS from "../proto/schema/CommonProto/NetMessage/MsgChatAddMessage/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChatDeleteMessageS from "../proto/schema/CommonProto/NetMessage/MsgChatDeleteMessage/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChatGetAllMessagesS from "../proto/schema/CommonProto/NetMessage/MsgChatGetAllMessages/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChatGetAllReadProgressListS from "../proto/schema/CommonProto/NetMessage/MsgChatGetAllReadProgressList/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgChatUpdateReadProgressS from "../proto/schema/CommonProto/NetMessage/MsgChatUpdateReadProgress/S.ts";
import * as TimerTimerModel from "../timer/TimerModel.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgChatAddMessage,               callback: _onMsgChatAddMessage },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgChatGetAllMessages,           callback: _onMsgChatGetAllMessages },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgChatUpdateReadProgress,       callback: _onMsgChatUpdateReadProgress },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgChatGetAllReadProgressList,   callback: _onMsgChatGetAllReadProgressList },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgChatDeleteMessage,            callback: _onMsgChatDeleteMessage },
    ], null);
}

export function reqChatAddMessage(
    content     : string,
    toCategory  : ChatConstants.ToCategoryId,
    toTarget    : number,
): void {
    NetworksManager.send({ MsgChatAddMessage: { c: {
        toCategory,
        toTarget,
        content,
    }, } });
}
function _onMsgChatAddMessage(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChatAddMessageS.S;
    if (!data.getErrorCode()) {
        ChatModel.updateOnAddMessage(HelpersMisc.getExisted(data.getMessage()), true);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgChatAddMessage, data);
    }
}

export function reqGetAllMessages(): void {
    NetworksManager.send({ MsgChatGetAllMessages: { c: {} } });
}
function _onMsgChatGetAllMessages(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChatGetAllMessagesS.S;
    if (!data.getErrorCode()) {
        ChatModel.setAllMessages(data.getMessageList());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgChatGetAllMessages, data);
    }
}

export function reqUpdateReadProgress(
    toCategory  : ChatConstants.ToCategoryId,
    toTarget    : number,
    timestamp   = TimerTimerModel.getServerTimestamp(),
): void {
    NetworksManager.send({ MsgChatUpdateReadProgress: { c: {
        progress: {
            toCategory,
            toTarget,
            timestamp,
        }, }
    } });
}
function _onMsgChatUpdateReadProgress(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChatUpdateReadProgressS.S;
    if (!data.getErrorCode()) {
        ChatModel.setReadProgress(HelpersMisc.getExisted(data.getProgress()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgChatUpdateReadProgress, data);
    }
}

export function reqGetAllReadProgressList(): void {
    NetworksManager.send({ MsgChatGetAllReadProgressList: { c: {} } });
}
function _onMsgChatGetAllReadProgressList(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChatGetAllReadProgressListS.S;
    if (!data.getErrorCode()) {
        ChatModel.resetAllReadProgress(data.getList());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgChatGetAllReadProgressList, data);
    }
}

export function reqChatDeleteMessage(messageId: number): void {
    NetworksManager.send({ MsgChatDeleteMessage: { c: { messageId } } });
}
function _onMsgChatDeleteMessage(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgChatDeleteMessageS.S;
    if (!data.getErrorCode()) {
        ChatModel.updateOnDeleteMessage(HelpersMisc.getExisted(data.getMessageId()));
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgChatDeleteMessage, data);
    }
}
