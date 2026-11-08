import {
    Networks_Manager,
    Notifications_Dispatcher,
    Helpers_Misc,
    Networks_MessageCodes,
    MultiRankRoom_Model_MrrModel,
    type Egret_Egret,
} from "../../internal.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrGetMaxConcurrentCount,         callback : _onMsgMrrGetMaxConcurrentCount },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrGetRoomPublicInfo,             callback : _onMsgMrrGetRoomPublicInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrGetJoinedRoomIdArray,          callback : _onMsgMrrGetJoinedRoomIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrSetBannedCoIdArray,            callback : _onMsgMrrSetBannedCoIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrSetMaxConcurrentCount,         callback : _onMsgMrrSetMaxConcurrentCount },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrGetBannedNormalMapIdArray,     callback : _onMsgMrrGetBannedNormalMapIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrSetBannedNormalMapIdArray,     callback : _onMsgMrrSetBannedNormalMapIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrGetBootTimerDaysRange,         callback : _onMsgMrrGetBootTimerDaysRange },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrSetBootTimerDaysRange,         callback : _onMsgMrrSetBootTimerDaysRange },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrSetSelfSettings,               callback : _onMsgMrrSetSelfSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMrrDeleteRoomByServer,            callback : _onMsgMrrDeleteRoomByServer },
    ]);
}

export function reqMrrGetMaxConcurrentCount(): void {
    Networks_Manager.send({ MsgMrrGetMaxConcurrentCount : { c : {} } });
}
function _onMsgMrrGetMaxConcurrentCount(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrGetMaxConcurrentCount"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.setMaxConcurrentCount(false, Helpers_Misc.getExisted(data.getMaxCountForStd()));
        MultiRankRoom_Model_MrrModel.setMaxConcurrentCount(true, Helpers_Misc.getExisted(data.getMaxCountForFog()));
        MultiRankRoom_Model_MrrModel.setAdditionalMaxDifferenceInScore(false, data.getAdditionalMaxDifferenceInScoreForStd() ?? 0);
        MultiRankRoom_Model_MrrModel.setAdditionalMaxDifferenceInScore(true, data.getAdditionalMaxDifferenceInScoreForFog() ?? 0);
        Notifications_Dispatcher.dispatch("MsgMrrGetMaxConcurrentCount", { msg: data });
    }
}

export function reqMrrGetBootTimerDaysRange(): void {
    Networks_Manager.send({ MsgMrrGetBootTimerDaysRange : { c : {} } });
}
function _onMsgMrrGetBootTimerDaysRange(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrGetBootTimerDaysRange"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnMsgMrrGetBootTimerDaysRange(data);
        Notifications_Dispatcher.dispatch("MsgMrrGetBootTimerDaysRange", { msg: data });
    }
}

export function reqMrrSetBootTimerDaysRange(rangeForStd: number[], rangeForFog: number[]): void {
    Networks_Manager.send({
        MsgMrrSetBootTimerDaysRange : {
            c : {
                rangeForStd : rangeForStd,
                rangeForFog : rangeForFog,
            }, 
        }, 
    });
}
function _onMsgMrrSetBootTimerDaysRange(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrSetBootTimerDaysRange"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnMsgMrrSetBootTimerDaysRange(data);
        Notifications_Dispatcher.dispatch("MsgMrrSetBootTimerDaysRange", { msg: data });
    }
}

export function reqMrrGetRoomPublicInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMrrGetRoomPublicInfo : {
            c : {
                roomId,
            }, 
        }, 
    });
}
async function _onMsgMrrGetRoomPublicInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrGetRoomPublicInfo"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnFailedMsgMrrGetRoomPublicInfo(data);
    } else {
        await MultiRankRoom_Model_MrrModel.updateOnMsgMrrGetRoomPublicInfo(data);
        Notifications_Dispatcher.dispatch("MsgMrrGetRoomPublicInfo", { msg: data });
    }
}

export function reqMrrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({
        MsgMrrGetJoinedRoomIdArray : {
            c : {
            }, 
        }, 
    });
}
function _onMsgMrrGetJoinedRoomIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrGetJoinedRoomIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    MultiRankRoom_Model_MrrModel.setJoinedRoomIdArray(data.getRoomIdArray());
    Notifications_Dispatcher.dispatch("MsgMrrGetJoinedRoomIdArray", { msg: data });
}

export function reqMrrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    Networks_Manager.send({
        MsgMrrSetBannedCoIdArray : {
            c : {
                roomId          : roomId,
                bannedCoIdArray : bannedCoIdArray,
            }, 
        }, 
    });
}
async function _onMsgMrrSetBannedCoIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrSetBannedCoIdArray"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await MultiRankRoom_Model_MrrModel.updateOnMsgMrrSetBannedCoIdArray(data);
        Notifications_Dispatcher.dispatch("MsgMrrSetBannedCoIdArray", { msg: data });
    }
}

export function reqMrrSetMaxConcurrentCount({ maxCountForStd, maxCountForFog, additionalMaxDifferenceInScoreForStd, additionalMaxDifferenceInScoreForFog }: {
    maxCountForStd                          : number;
    maxCountForFog                          : number;
    additionalMaxDifferenceInScoreForStd    : number;
    additionalMaxDifferenceInScoreForFog    : number;
}): void {
    Networks_Manager.send({
        MsgMrrSetMaxConcurrentCount : {
            c : {
                maxCountForStd                       : maxCountForStd,
                maxCountForFog                       : maxCountForFog,
                additionalMaxDifferenceInScoreForStd : additionalMaxDifferenceInScoreForStd,
                additionalMaxDifferenceInScoreForFog : additionalMaxDifferenceInScoreForFog,
            }, 
        }, 
    });
}
function _onMsgMrrSetMaxConcurrentCount(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrSetMaxConcurrentCount"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.setMaxConcurrentCount(false, Helpers_Misc.getExisted(data.getMaxCountForStd()));
        MultiRankRoom_Model_MrrModel.setMaxConcurrentCount(true, Helpers_Misc.getExisted(data.getMaxCountForFog()));
        MultiRankRoom_Model_MrrModel.setAdditionalMaxDifferenceInScore(false, data.getAdditionalMaxDifferenceInScoreForStd() ?? 0);
        MultiRankRoom_Model_MrrModel.setAdditionalMaxDifferenceInScore(true, data.getAdditionalMaxDifferenceInScoreForFog() ?? 0);
        Notifications_Dispatcher.dispatch("MsgMrrSetMaxConcurrentCount", { msg: data });
    }
}

export function reqMrrGetBannedNormalMapIdArray(): void {
    Networks_Manager.send({
        MsgMrrGetBannedNormalMapIdArray : {
            c : {
            }, 
        }, 
    });
}
function _onMsgMrrGetBannedNormalMapIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrGetBannedNormalMapIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnMsgMrrGetBannedNormalMapIdArray(data);
        Notifications_Dispatcher.dispatch("MsgMrrGetBannedNormalMapIdArray", { msg: data });
    }
}

export function reqMrrSetBannedNormalMapIdArray(normalMapIdArrayForStd: number[], normalMapIdArrayForFog: number[]): void {
    Networks_Manager.send({
        MsgMrrSetBannedNormalMapIdArray : {
            c : {
                bannedNormalMapIdArrayForStd : normalMapIdArrayForStd,
                bannedNormalMapIdArrayForFog : normalMapIdArrayForFog,
            }, 
        }, 
    });
}
function _onMsgMrrSetBannedNormalMapIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrSetBannedNormalMapIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiRankRoom_Model_MrrModel.updateOnMsgMrrSetBannedNormalMapIdArray(data);
        Notifications_Dispatcher.dispatch("MsgMrrSetBannedNormalMapIdArray", { msg: data });
    }
}

export function reqMrrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMrrSetSelfSettings : {
            c : {
                roomId,
                coId,
                unitAndTileSkinId,
            }, 
        }, 
    });
}
async function _onMsgMrrSetSelfSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrSetSelfSettings"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await MultiRankRoom_Model_MrrModel.updateOnMsgMrrSetSelfSettings(data);
        Notifications_Dispatcher.dispatch("MsgMrrSetSelfSettings", { msg: data });
    }
}

function _onMsgMrrDeleteRoomByServer(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMrrDeleteRoomByServer"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    MultiRankRoom_Model_MrrModel.updateOnMsgMrrDeleteRoomByServer(data);
    Notifications_Dispatcher.dispatch("MsgMrrDeleteRoomByServer", { msg: data });
}
