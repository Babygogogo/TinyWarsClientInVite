import {
    Helpers_Misc,
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Common_Model_CommonModel,
    type Egret_Egret,
} from "../../internal.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCommonError,                  callback : _onMsgCommonError },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCommonGetServerStatus,        callback : _onMsgCommonGetServerStatus },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCommonGetRankList,            callback : _onMsgCommonGetRankList },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCommonGetCoStatistics,        callback : _onMsgCommonGetCoStatistics },
    ], null);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _onMsgCommonError(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCommonError"]>): void {
    // TODO: Handle common error message.
}

export function reqCommonGetServerStatus(): void {
    Networks_Manager.send({ MsgCommonGetServerStatus : { c : {} } });
}
function _onMsgCommonGetServerStatus(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCommonGetServerStatus"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCommonGetServerStatus", { msg: data });
    }
}

export function reqGetRankList(): void {
    Networks_Manager.send({ MsgCommonGetRankList : { c : {} } });
}
function _onMsgCommonGetRankList(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCommonGetRankList"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Common_Model_CommonModel.setMrwRankArray(data.getMrwRankDataArray());
        Notifications_Dispatcher.dispatch("MsgCommonGetRankList", { msg: data });
    }
}

export function reqCommonGetCoStatistics(): void {
    Networks_Manager.send({ MsgCommonGetCoStatistics : { c : {} } });
}
function _onMsgCommonGetCoStatistics(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCommonGetCoStatistics"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Common_Model_CommonModel.setCoStatistics(data);
        Notifications_Dispatcher.dispatch("MsgCommonGetCoStatistics", { msg: data });
    }
}
