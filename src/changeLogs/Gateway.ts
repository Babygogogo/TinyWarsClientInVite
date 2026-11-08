import {
    Helpers_Misc,
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    ChangeLogs_Provider,
    type Egret_Egret,
} from "../internal.ts";
import type { LanguageText } from "../proto/schema/CommonProto/Structure/LanguageText.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChangeLogAddMessage,         callback : _onMsgChangeLogAddMessage },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChangeLogModifyMessage,      callback : _onMsgChangeLogModifyMessage },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgChangeLogGetMessageList,     callback : _onMsgChangeLogGetMessageList },
    ], null);
}

export function reqChangeLogAddMessage(textList: LanguageText[]): void {
    Networks_Manager.send({
        MsgChangeLogAddMessage : {
            c : {
                textList : textList.map(v => v.toJson()),
            },
        },
    });
}
function _onMsgChangeLogAddMessage(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgChangeLogAddMessage"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgChangeLogAddMessage", { msg: data });
    }
}

export function reqChangeLogModifyMessage(messageId: number, textList: LanguageText[]): void {
    Networks_Manager.send({
        MsgChangeLogModifyMessage : {
            c : {
                messageId : messageId,
                textList  : textList.map(v => v.toJson()),
            },
        },
    });
}
function _onMsgChangeLogModifyMessage(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgChangeLogModifyMessage"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgChangeLogModifyMessage", { msg: data });
    }
}

export function reqChangeLogGetMessageList(): void {
    Networks_Manager.send({
        MsgChangeLogGetMessageList : {
            c : {
            },
        },
    });
}
function _onMsgChangeLogGetMessageList(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgChangeLogGetMessageList"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        ChangeLogs_Provider.setAllMessageList(data.getMessageList());
        Notifications_Dispatcher.dispatch("MsgChangeLogGetMessageList", { msg: data });
    }
}
