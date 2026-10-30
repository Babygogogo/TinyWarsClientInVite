import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Timer_TimerModel,
    Networks_MessageCodes,
    Chat_Model,
    Notifications_TypeId,
    type Egret_Egret,
    type Chat_Constants,
} from "../internal.ts";
import type { S as ChatAddMessageResponse } from "../proto/schema/CommonProto/NetMessage/MsgChatAddMessage/S.ts";
import type { S as ChatDeleteMessageResponse } from "../proto/schema/CommonProto/NetMessage/MsgChatDeleteMessage/S.ts";
import type { S as ChatGetAllMessagesResponse } from "../proto/schema/CommonProto/NetMessage/MsgChatGetAllMessages/S.ts";
import type { S as ChatGetAllReadProgressListResponse } from "../proto/schema/CommonProto/NetMessage/MsgChatGetAllReadProgressList/S.ts";
import type { S as ChatUpdateReadProgressResponse } from "../proto/schema/CommonProto/NetMessage/MsgChatUpdateReadProgress/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChatAddMessage,               callback : _onMsgChatAddMessage },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChatGetAllMessages,           callback : _onMsgChatGetAllMessages },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChatUpdateReadProgress,       callback : _onMsgChatUpdateReadProgress },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChatGetAllReadProgressList,   callback : _onMsgChatGetAllReadProgressList },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChatDeleteMessage,            callback : _onMsgChatDeleteMessage },
    ], null);
}

export function reqChatAddMessage(
    content     : string,
    toCategory  : Chat_Constants.ToCategoryId,
    toTarget    : number,
): void {
    Networks_Manager.send({
        MsgChatAddMessage : {
            c : {
                toCategory,
                toTarget,
                content,
            }, 
        }, 
    });
}
function _onMsgChatAddMessage(e: Egret_Egret.Event): void {
    const data = e.data as ChatAddMessageResponse;
    if (!data.getErrorCode()) {
        Chat_Model.updateOnAddMessage(Helpers_Misc.getExisted(data.getMessage()), true);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgChatAddMessage, data);
    }
}

export function reqGetAllMessages(): void {
    Networks_Manager.send({ MsgChatGetAllMessages : { c : {} } });
}
function _onMsgChatGetAllMessages(e: Egret_Egret.Event): void {
    const data = e.data as ChatGetAllMessagesResponse;
    if (!data.getErrorCode()) {
        Chat_Model.setAllMessages(data.getMessageList());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgChatGetAllMessages, data);
    }
}

export function reqUpdateReadProgress(
    toCategory  : Chat_Constants.ToCategoryId,
    toTarget    : number,
    timestamp   = Timer_TimerModel.getServerTimestamp(),
): void {
    Networks_Manager.send({
        MsgChatUpdateReadProgress : {
            c : {
                progress : {
                    toCategory,
                    toTarget,
                    timestamp,
                }, 
            },
        }, 
    });
}
function _onMsgChatUpdateReadProgress(e: Egret_Egret.Event): void {
    const data = e.data as ChatUpdateReadProgressResponse;
    if (!data.getErrorCode()) {
        Chat_Model.setReadProgress(Helpers_Misc.getExisted(data.getProgress()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgChatUpdateReadProgress, data);
    }
}

export function reqGetAllReadProgressList(): void {
    Networks_Manager.send({ MsgChatGetAllReadProgressList : { c : {} } });
}
function _onMsgChatGetAllReadProgressList(e: Egret_Egret.Event): void {
    const data = e.data as ChatGetAllReadProgressListResponse;
    if (!data.getErrorCode()) {
        Chat_Model.resetAllReadProgress(data.getList());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgChatGetAllReadProgressList, data);
    }
}

export function reqChatDeleteMessage(messageId: number): void {
    Networks_Manager.send({ MsgChatDeleteMessage : { c : { messageId } } });
}
function _onMsgChatDeleteMessage(e: Egret_Egret.Event): void {
    const data = e.data as ChatDeleteMessageResponse;
    if (!data.getErrorCode()) {
        Chat_Model.updateOnDeleteMessage(Helpers_Misc.getExisted(data.getMessageId()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgChatDeleteMessage, data);
    }
}
