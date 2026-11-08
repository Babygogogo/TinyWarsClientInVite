import {
    Helpers_Misc,
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Timer_TimerModel,
    type Egret_Egret,
} from "../internal.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCommonHeartbeat,              callback : _onMsgCommonHeartbeat },
    ], null);
}

export function reqCommonHeartbeat(counter: number): void {
    Networks_Manager.send({
        MsgCommonHeartbeat : {
            c : {
                counter,
            }, 
        },
    });
}
function _onMsgCommonHeartbeat(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCommonHeartbeat"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Timer_TimerModel.updateOnMsgCommonHeartbeat(data);
        Notifications_Dispatcher.dispatch("MsgCommonHeartbeat", { msg: data });
    }
}
