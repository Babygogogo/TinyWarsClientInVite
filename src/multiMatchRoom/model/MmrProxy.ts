import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    MultiMatchRoom_Model_MmrModel,
    type Egret_Egret,
} from "../../internal.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrGetMaxConcurrentCount,         callback : _onMsgMmrGetMaxConcurrentCount },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrGetRoomPublicInfo,             callback : _onMsgMmrGetRoomPublicInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrGetJoinedRoomIdArray,          callback : _onMsgMmrGetJoinedRoomIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrSetBannedCoIdArray,            callback : _onMsgMmrSetBannedCoIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrSetMaxConcurrentCount,         callback : _onMsgMmrSetMaxConcurrentCount },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrGetBannedNormalMapIdArray,     callback : _onMsgMmrGetBannedNormalMapIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrSetBannedNormalMapIdArray,     callback : _onMsgMmrSetBannedNormalMapIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrGetBootTimerDaysRange,         callback : _onMsgMmrGetBootTimerDaysRange },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrSetBootTimerDaysRange,         callback : _onMsgMmrSetBootTimerDaysRange },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrSetSelfSettings,               callback : _onMsgMmrSetSelfSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMmrDeleteRoomByServer,            callback : _onMsgMmrDeleteRoomByServer },
    ]);
}

export function reqMmrGetMaxConcurrentCount(): void {
    Networks_Manager.send({ MsgMmrGetMaxConcurrentCount : { c : {} } });
}
function _onMsgMmrGetMaxConcurrentCount(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrGetMaxConcurrentCount"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.setMaxConcurrentCount(false, Helpers_Misc.getExisted(data.getMaxCountForStd()));
        MultiMatchRoom_Model_MmrModel.setMaxConcurrentCount(true, Helpers_Misc.getExisted(data.getMaxCountForFog()));
        Notifications_Dispatcher.dispatch("MsgMmrGetMaxConcurrentCount", { msg: data });
    }
}

export function reqMmrGetBootTimerDaysRange(): void {
    Networks_Manager.send({ MsgMmrGetBootTimerDaysRange : { c : {} } });
}
function _onMsgMmrGetBootTimerDaysRange(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrGetBootTimerDaysRange"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnMsgMmrGetBootTimerDaysRange(data);
        Notifications_Dispatcher.dispatch("MsgMmrGetBootTimerDaysRange", { msg: data });
    }
}

export function reqMmrSetBootTimerDaysRange(rangeForStd: number[], rangeForFog: number[]): void {
    Networks_Manager.send({
        MsgMmrSetBootTimerDaysRange : {
            c : {
                rangeForStd : rangeForStd,
                rangeForFog : rangeForFog,
            }, 
        }, 
    });
}
function _onMsgMmrSetBootTimerDaysRange(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrSetBootTimerDaysRange"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnMsgMmrSetBootTimerDaysRange(data);
        Notifications_Dispatcher.dispatch("MsgMmrSetBootTimerDaysRange", { msg: data });
    }
}

export function reqMmrGetRoomPublicInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMmrGetRoomPublicInfo : {
            c : {
                roomId,
            }, 
        }, 
    });
}
async function _onMsgMmrGetRoomPublicInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrGetRoomPublicInfo"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnFailedMsgMmrGetRoomPublicInfo(data);
    } else {
        await MultiMatchRoom_Model_MmrModel.updateOnMsgMmrGetRoomPublicInfo(data);
        Notifications_Dispatcher.dispatch("MsgMmrGetRoomPublicInfo", { msg: data });
    }
}

export function reqMmrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({
        MsgMmrGetJoinedRoomIdArray : {
            c : {
            }, 
        }, 
    });
}
function _onMsgMmrGetJoinedRoomIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrGetJoinedRoomIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    MultiMatchRoom_Model_MmrModel.setJoinedRoomIdArray(data.getRoomIdArray());
    Notifications_Dispatcher.dispatch("MsgMmrGetJoinedRoomIdArray", { msg: data });
}

export function reqMmrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    Networks_Manager.send({
        MsgMmrSetBannedCoIdArray : {
            c : {
                roomId          : roomId,
                bannedCoIdArray : bannedCoIdArray,
            }, 
        }, 
    });
}
async function _onMsgMmrSetBannedCoIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrSetBannedCoIdArray"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await MultiMatchRoom_Model_MmrModel.updateOnMsgMmrSetBannedCoIdArray(data);
        Notifications_Dispatcher.dispatch("MsgMmrSetBannedCoIdArray", { msg: data });
    }
}

export function reqMmrSetMaxConcurrentCount(maxCountForStd: number, maxCountForFog: number): void {
    Networks_Manager.send({
        MsgMmrSetMaxConcurrentCount : {
            c : {
                maxCountForStd,
                maxCountForFog,
            }, 
        }, 
    });
}
function _onMsgMmrSetMaxConcurrentCount(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrSetMaxConcurrentCount"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.setMaxConcurrentCount(false, Helpers_Misc.getExisted(data.getMaxCountForStd()));
        MultiMatchRoom_Model_MmrModel.setMaxConcurrentCount(true, Helpers_Misc.getExisted(data.getMaxCountForFog()));
        Notifications_Dispatcher.dispatch("MsgMmrSetMaxConcurrentCount", { msg: data });
    }
}

export function reqMmrGetBannedNormalMapIdArray(): void {
    Networks_Manager.send({
        MsgMmrGetBannedNormalMapIdArray : {
            c : {
            }, 
        }, 
    });
}
function _onMsgMmrGetBannedNormalMapIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrGetBannedNormalMapIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnMsgMmrGetBannedNormalMapIdArray(data);
        Notifications_Dispatcher.dispatch("MsgMmrGetBannedNormalMapIdArray", { msg: data });
    }
}

export function reqMmrSetBannedNormalMapIdArray(normalMapIdArrayForStd: number[], normalMapIdArrayForFog: number[]): void {
    Networks_Manager.send({
        MsgMmrSetBannedNormalMapIdArray : {
            c : {
                bannedNormalMapIdArrayForStd : normalMapIdArrayForStd,
                bannedNormalMapIdArrayForFog : normalMapIdArrayForFog,
            }, 
        }, 
    });
}
function _onMsgMmrSetBannedNormalMapIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrSetBannedNormalMapIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiMatchRoom_Model_MmrModel.updateOnMsgMmrSetBannedNormalMapIdArray(data);
        Notifications_Dispatcher.dispatch("MsgMmrSetBannedNormalMapIdArray", { msg: data });
    }
}

export function reqMmrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMmrSetSelfSettings : {
            c : {
                roomId,
                coId,
                unitAndTileSkinId,
            }, 
        }, 
    });
}
async function _onMsgMmrSetSelfSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrSetSelfSettings"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await MultiMatchRoom_Model_MmrModel.updateOnMsgMmrSetSelfSettings(data);
        Notifications_Dispatcher.dispatch("MsgMmrSetSelfSettings", { msg: data });
    }
}

function _onMsgMmrDeleteRoomByServer(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMmrDeleteRoomByServer"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    MultiMatchRoom_Model_MmrModel.updateOnMsgMmrDeleteRoomByServer(data);
    Notifications_Dispatcher.dispatch("MsgMmrDeleteRoomByServer", { msg: data });
}
