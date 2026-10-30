import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    Mail_Model_MailModel,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as MailDeleteMailResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMailDeleteMail/S.ts";
import type { S as MailGetAllMailArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMailGetAllMailArray/S.ts";
import type { S as MailGetMailResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMailGetMail/S.ts";
import type { S as MailSetIsNewResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMailSetIsNew/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMailGetAllMailArray,  callback : _onMsgMailGetAllMailArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMailGetMail,          callback : _onMsgMailGetMail },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMailDeleteMail,       callback : _onMsgMailDeleteMail },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMailSetIsNew,         callback : _onMsgMailSetIsNew },
    ], null);
}

function _onMsgMailGetAllMailArray(e: Egret_Egret.Event): void {
    const data = e.data as MailGetAllMailArrayResponse;
    Mail_Model_MailModel.resetAllMailDataArray(data.getMailFullDataArray());
    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMailGetAllMailArray, data);
}

function _onMsgMailGetMail(e: Egret_Egret.Event): void {
    const data = e.data as MailGetMailResponse;
    Mail_Model_MailModel.updateOnMsgMailGetMail(Helpers_Misc.getExisted(data.getMailFullData()));
    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMailGetMail, data);
}

export function reqMailDeleteMail(mailId: number): void {
    Networks_Manager.send({
        MsgMailDeleteMail : {
            c : {
                mailId : mailId,
            }, 
        }, 
    });
}
function _onMsgMailDeleteMail(e: Egret_Egret.Event): void {
    const data = e.data as MailDeleteMailResponse;
    if (!data.getErrorCode()) {
        Mail_Model_MailModel.updateOnMsgMailDeleteMail(Helpers_Misc.getExisted(data.getMailId()));
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMailDeleteMail, data);
    }
}

export function reqMailSetIsNew(mailId: number, isNew: boolean): void {
    Networks_Manager.send({
        MsgMailSetIsNew : {
            c : {
                mailId : mailId,
                isNew  : isNew,
            }, 
        }, 
    });
}
function _onMsgMailSetIsNew(e: Egret_Egret.Event): void {
    const data = e.data as MailSetIsNewResponse;
    if (!data.getErrorCode()) {
        Mail_Model_MailModel.updateOnMsgMailSetIsNew(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgMailSetIsNew, data);
    }
}
