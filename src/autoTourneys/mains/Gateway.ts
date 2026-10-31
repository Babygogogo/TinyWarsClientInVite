import {
    Helpers_Misc,
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    AutoTourneys_Mains_Provider,
    type Egret_Egret,
} from "../../internal.ts";
import type { InitialBracket } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetInitialBrackets/InitialBracket.ts";
import type { SimpleMapInfo } from "../../proto/schema/CommonProto/NetMessage/MsgAtSetMapPool/SimpleMapInfo.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtGetGlobalSettings,          callback : _onMsgAtGetGlobalSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtSetGlobalSettings,          callback : _onMsgAtSetGlobalSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtCreateTourney,              callback : _onMsgAtCreateTourney },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtDeleteLastTourney,          callback : _onMsgAtDeleteLastTourney },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtSetRegistrationDuration,    callback : _onMsgAtSetRegistrationDuration },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtSetAdjustmentDuration,      callback : _onMsgAtSetAdjustmentDuration },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtSetInitialBrackets,         callback : _onMsgAtSetInitialBrackets },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtDeleteUser,                 callback : _onMsgAtDeleteUser },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtSetMapPool,                 callback : _onMsgAtSetMapPool },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtSetName,                    callback : _onMsgAtSetName },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtSetBootTimer,               callback : _onMsgAtSetBootTimer },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtGetPhaseInfo,               callback : _onMsgAtGetPhaseInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtGetRegistrationInfo,        callback : _onMsgAtGetRegistrationInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtGetTourneyInfo,             callback : _onMsgAtGetTourneyInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtGetFullMapInfo,             callback : _onMsgAtGetFullMapInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtGetFullBracketInfo,         callback : _onMsgAtGetFullBracketInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtGetUserArray,               callback : _onMsgAtGetUserArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtRegister,                   callback : _onMsgAtRegister },
    ]);
}

export function reqAtGetGlobalSettings(): void {
    Networks_Manager.send({
        MsgAtGetGlobalSettings : {
            c : {
            }, 
        },
    });
}
function _onMsgAtGetGlobalSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtGetGlobalSettings"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        AutoTourneys_Mains_Provider.updateOnMsgAtGetGlobalSettings(data);
        Notifications_Dispatcher.dispatch("MsgAtGetGlobalSettings", { msg: data });
    }
}

export function reqAtSetGlobalSettings(isEnabled: boolean, interval: number): void {
    Networks_Manager.send({
        MsgAtSetGlobalSettings : {
            c : {
                globalSettings : {
                    isEnabled : isEnabled,
                    interval  : interval,
                },
            }, 
        },
    });
}
function _onMsgAtSetGlobalSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtSetGlobalSettings"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgAtSetGlobalSettings", { msg: data });
    }
}

export function reqAtCreateTourney(): void {
    Networks_Manager.send({
        MsgAtCreateTourney : {
            c : {
            }, 
        },
    });
}
function _onMsgAtCreateTourney(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtCreateTourney"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgAtCreateTourney", { msg: data });
    }
}

export function reqAtDeleteLastTourney(): void {
    Networks_Manager.send({
        MsgAtDeleteLastTourney : {
            c : {
            }, 
        },
    });
}
function _onMsgAtDeleteLastTourney(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtDeleteLastTourney"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgAtDeleteLastTourney", { msg: data });
    }
}

export function reqAtSetRegistrationDuration(tourneyId: number, duration: number): void {
    Networks_Manager.send({
        MsgAtSetRegistrationDuration : {
            c : {
                tourneyId : tourneyId,
                duration  : duration,
            }, 
        },
    });
}
function _onMsgAtSetRegistrationDuration(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtSetRegistrationDuration"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgAtSetRegistrationDuration", { msg: data });
    }
}

export function reqAtSetAdjustmentDuration(tourneyId: number, duration: number): void {
    Networks_Manager.send({
        MsgAtSetAdjustmentDuration : {
            c : {
                tourneyId : tourneyId,
                duration  : duration,
            }, 
        },
    });
}
function _onMsgAtSetAdjustmentDuration(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtSetAdjustmentDuration"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgAtSetAdjustmentDuration", { msg: data });
    }
}

export function reqAtSetInitialBrackets(tourneyId: number, bracketArray: InitialBracket[]): void {
    Networks_Manager.send({
        MsgAtSetInitialBrackets : {
            c : {
                tourneyId           : tourneyId,
                initialBracketArray : bracketArray.map(v => v.toJson()),
            }, 
        },
    });
}
function _onMsgAtSetInitialBrackets(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtSetInitialBrackets"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgAtSetInitialBrackets", { msg: data });
    }
}

export function reqAtDeleteUser(tourneyId: number, userIdArray: number[]): void {
    Networks_Manager.send({
        MsgAtDeleteUser : {
            c : {
                tourneyId   : tourneyId,
                userIdArray : userIdArray,
            }, 
        },
    });
}
function _onMsgAtDeleteUser(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtDeleteUser"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgAtDeleteUser", { msg: data });
    }
}

export function reqAtSetMapPool(tourneyId: number, mapInfoArray: SimpleMapInfo[]): void {
    Networks_Manager.send({
        MsgAtSetMapPool : {
            c : {
                tourneyId          : tourneyId,
                simpleMapInfoArray : mapInfoArray.map(v => v.toJson()),
            }, 
        },
    });
}
function _onMsgAtSetMapPool(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtSetMapPool"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgAtSetMapPool", { msg: data });
    }
}

export function reqAtSetName(tourneyId: number, nameArray: LanguageText[]): void {
    Networks_Manager.send({
        MsgAtSetName : {
            c : {
                tourneyId : tourneyId,
                nameArray : nameArray.map(v => v.toJson()),
            }, 
        }, 
    });
}
async function _onMsgAtSetName(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtSetName"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await AutoTourneys_Mains_Provider.updateOnMsgAtSetName(data);
        Notifications_Dispatcher.dispatch("MsgAtSetName", { msg: data });
    }
}

export function reqAtSetBootTimer(tourneyId: number, bootTimerParams: number[]): void {
    Networks_Manager.send({
        MsgAtSetBootTimer : {
            c : {
                tourneyId       : tourneyId,
                bootTimerParams : bootTimerParams,
            }, 
        }, 
    });
}
async function _onMsgAtSetBootTimer(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtSetBootTimer"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await AutoTourneys_Mains_Provider.updateOnMsgAtSetBootTimer(data);
        Notifications_Dispatcher.dispatch("MsgAtSetBootTimer", { msg: data });
    }
}

export function reqAtGetPhaseInfo(): void {
    Networks_Manager.send({
        MsgAtGetPhaseInfo : {
            c : {
            }, 
        },
    });
}
function _onMsgAtGetPhaseInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtGetPhaseInfo"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        AutoTourneys_Mains_Provider.updateOnMsgAtGetPhaseInfo(data);
        Notifications_Dispatcher.dispatch("MsgAtGetPhaseInfo", { msg: data });
    }
}

export function reqAtGetRegistrationInfo(tourneyId: number): void {
    Networks_Manager.send({
        MsgAtGetRegistrationInfo : {
            c : {
                tourneyId : tourneyId,
            }, 
        },
    });
}
function _onMsgAtGetRegistrationInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtGetRegistrationInfo"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        AutoTourneys_Mains_Provider.updateOnMsgAtGetRegistrationInfo(data);
        Notifications_Dispatcher.dispatch("MsgAtGetRegistrationInfo", { msg: data });
    }
}

export function reqAtGetTourneyInfo(tourneyId: number): void {
    Networks_Manager.send({
        MsgAtGetTourneyInfo : {
            c : {
                tourneyId : tourneyId,
            }, 
        },
    });
}
function _onMsgAtGetTourneyInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtGetTourneyInfo"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        AutoTourneys_Mains_Provider.setAtTourneyInfo(data.getTourneyId() ?? 0, data.getTourneyInfo() ?? null);
        Notifications_Dispatcher.dispatch("MsgAtGetTourneyInfo", { msg: data });
    }
}

export function reqAtGetFullMapInfo(tourneyId: number): void {
    Networks_Manager.send({
        MsgAtGetFullMapInfo : {
            c : {
                tourneyId : tourneyId,
            }, 
        },
    });
}
function _onMsgAtGetFullMapInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtGetFullMapInfo"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        AutoTourneys_Mains_Provider.setAtFullMapInfo(data.getTourneyId() ?? 0, data.getFullMapInfo() ?? null);
        Notifications_Dispatcher.dispatch("MsgAtGetFullMapInfo", { msg: data });
    }
}

export function reqAtGetFullBracketInfo(tourneyId: number): void {
    Networks_Manager.send({
        MsgAtGetFullBracketInfo : {
            c : {
                tourneyId : tourneyId,
            }, 
        },
    });
}
function _onMsgAtGetFullBracketInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtGetFullBracketInfo"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        AutoTourneys_Mains_Provider.setAtFullBracketInfo(data.getTourneyId() ?? 0, data.getFullBracketInfo() ?? null);
        Notifications_Dispatcher.dispatch("MsgAtGetFullBracketInfo", { msg: data });
    }
}

export function reqAtGetUserArray(tourneyId: number): void {
    Networks_Manager.send({
        MsgAtGetUserArray : {
            c : {
                tourneyId : tourneyId,
            }, 
        },
    });
}
function _onMsgAtGetUserArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtGetUserArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        AutoTourneys_Mains_Provider.setAtUserArray(data.getTourneyId() ?? 0, data.getUserIdArray());
        Notifications_Dispatcher.dispatch("MsgAtGetUserArray", { msg: data });
    }
}

export function reqAtRegister(tourneyId: number, isRegister: boolean): void {
    Networks_Manager.send({
        MsgAtRegister : {
            c : {
                tourneyId  : tourneyId,
                isRegister : isRegister,
            }, 
        },
    });
}
function _onMsgAtRegister(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtRegister"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgAtRegister", { msg: data });
    }
}
