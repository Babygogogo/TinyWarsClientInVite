import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    Mail_Model_MailModel,
    type Egret_Egret,
} from "../../internal.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMailGetAllMailArray,  callback : _onMsgMailGetAllMailArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMailGetMail,          callback : _onMsgMailGetMail },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMailDeleteMail,       callback : _onMsgMailDeleteMail },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMailSetIsNew,         callback : _onMsgMailSetIsNew },
    ], null);
}

function _onMsgMailGetAllMailArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMailGetAllMailArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    Mail_Model_MailModel.resetAllMailDataArray(data.getMailFullDataArray());
    Notifications_Dispatcher.dispatch("MsgMailGetAllMailArray", { msg: data });
}

function _onMsgMailGetMail(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMailGetMail"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    Mail_Model_MailModel.updateOnMsgMailGetMail(Helpers_Misc.getExisted(data.getMailFullData()));
    Notifications_Dispatcher.dispatch("MsgMailGetMail", { msg: data });
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
function _onMsgMailDeleteMail(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMailDeleteMail"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Mail_Model_MailModel.updateOnMsgMailDeleteMail(Helpers_Misc.getExisted(data.getMailId()));
        Notifications_Dispatcher.dispatch("MsgMailDeleteMail", { msg: data });
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
function _onMsgMailSetIsNew(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMailSetIsNew"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Mail_Model_MailModel.updateOnMsgMailSetIsNew(data);
        Notifications_Dispatcher.dispatch("MsgMailSetIsNew", { msg: data });
    }
}
