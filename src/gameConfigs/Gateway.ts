import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    GameConfigs_Provider,
    type Egret_Egret,
} from "../internal.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCommonLatestConfigVersion,    callback : _onMsgCommonLatestConfigVersion },
    ], null);
}

export function reqCommonLatestConfigVersion(): void {
    Networks_Manager.send({
        MsgCommonLatestConfigVersion : { c : {} },
    });
}
function _onMsgCommonLatestConfigVersion(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCommonLatestConfigVersion"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        GameConfigs_Provider.setLatestConfigVersion(Helpers_Misc.getExisted(data.getVersion()));
        Notifications_Dispatcher.dispatch("MsgCommonLatestConfigVersion", { msg: data });
    }
}
