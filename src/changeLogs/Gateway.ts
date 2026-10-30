import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    ChangeLogs_Provider,
    Notifications_TypeId,
    type Egret_Egret,
} from "../internal.ts";
import type { S as ChangeLogAddMessageResponse } from "../proto/schema/CommonProto/NetMessage/MsgChangeLogAddMessage/S.ts";
import type { S as ChangeLogGetMessageListResponse } from "../proto/schema/CommonProto/NetMessage/MsgChangeLogGetMessageList/S.ts";
import type { S as ChangeLogModifyMessageResponse } from "../proto/schema/CommonProto/NetMessage/MsgChangeLogModifyMessage/S.ts";
import type { LanguageText } from "../proto/schema/CommonProto/Structure/LanguageText.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChangeLogAddMessage,         callback : _onMsgChangeLogAddMessage },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChangeLogModifyMessage,      callback : _onMsgChangeLogModifyMessage },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChangeLogGetMessageList,     callback : _onMsgChangeLogGetMessageList, },
    ], null);
}

export function reqChangeLogAddMessage(textList: LanguageText[]): void {
    Networks_Manager.send({
        MsgChangeLogAddMessage : {
            c : {
                textList : textList.map(v => v.toJson()),
            }
        },
    });
}
function _onMsgChangeLogAddMessage(e: Egret_Egret.Event): void {
    const data = e.data as ChangeLogAddMessageResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgChangeLogAddMessage, data);
    }
}

export function reqChangeLogModifyMessage(messageId: number, textList: LanguageText[]): void {
    Networks_Manager.send({
        MsgChangeLogModifyMessage : {
            c : {
                messageId : messageId,
                textList  : textList.map(v => v.toJson()),
            }
        },
    });
}
function _onMsgChangeLogModifyMessage(e: Egret_Egret.Event): void {
    const data = e.data as ChangeLogModifyMessageResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgChangeLogModifyMessage, data);
    }
}

export function reqChangeLogGetMessageList(): void {
    Networks_Manager.send({
        MsgChangeLogGetMessageList : {
            c : {
            }
        },
    });
}
function _onMsgChangeLogGetMessageList(e: Egret_Egret.Event): void {
    const data = e.data as ChangeLogGetMessageListResponse;
    if (!data.getErrorCode()) {
        ChangeLogs_Provider.setAllMessageList(data.getMessageList());
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgChangeLogGetMessageList, data);
    }
}
