import {
    Helpers_Misc,
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    AutoTourneys_Rooms_Provider,
    type Egret_Egret,
} from "../../internal.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtrGetRoomPublicInfo,             callback : _onMsgAtrGetRoomPublicInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtrGetJoinedRoomIdArray,          callback : _onMsgAtrGetJoinedRoomIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtrSetBannedCoIdArray,            callback : _onMsgAtrSetBannedCoIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtrSetSelfSettings,               callback : _onMsgAtrSetSelfSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgAtrDeleteRoomByServer,            callback : _onMsgAtrDeleteRoomByServer },
    ]);
}

export function reqAtrGetRoomPublicInfo(roomId: number): void {
    Networks_Manager.send({
        MsgAtrGetRoomPublicInfo : {
            c : {
                roomId,
            }, 
        }, 
    });
}
async function _onMsgAtrGetRoomPublicInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtrGetRoomPublicInfo"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        AutoTourneys_Rooms_Provider.updateOnFailedMsgAtrGetRoomPublicInfo(data);
    } else {
        await AutoTourneys_Rooms_Provider.updateOnMsgAtrGetRoomPublicInfo(data);
        Notifications_Dispatcher.dispatch("MsgAtrGetRoomPublicInfo", { msg: data });
    }
}

export function reqAtrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({
        MsgAtrGetJoinedRoomIdArray : {
            c : {
            }, 
        }, 
    });
}
function _onMsgAtrGetJoinedRoomIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtrGetJoinedRoomIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    AutoTourneys_Rooms_Provider.setJoinedRoomIdArray(data.getRoomIdArray());
    Notifications_Dispatcher.dispatch("MsgAtrGetJoinedRoomIdArray", { msg: data });
}

export function reqAtrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    Networks_Manager.send({
        MsgAtrSetBannedCoIdArray : {
            c : {
                roomId          : roomId,
                bannedCoIdArray : bannedCoIdArray,
            }, 
        }, 
    });
}
async function _onMsgAtrSetBannedCoIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtrSetBannedCoIdArray"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await AutoTourneys_Rooms_Provider.updateOnMsgAtrSetBannedCoIdArray(data);
        Notifications_Dispatcher.dispatch("MsgAtrSetBannedCoIdArray", { msg: data });
    }
}

export function reqAtrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgAtrSetSelfSettings : {
            c : {
                roomId,
                coId,
                unitAndTileSkinId,
            }, 
        }, 
    });
}
async function _onMsgAtrSetSelfSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtrSetSelfSettings"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await AutoTourneys_Rooms_Provider.updateOnMsgAtrSetSelfSettings(data);
        Notifications_Dispatcher.dispatch("MsgAtrSetSelfSettings", { msg: data });
    }
}

function _onMsgAtrDeleteRoomByServer(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgAtrDeleteRoomByServer"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    AutoTourneys_Rooms_Provider.updateOnMsgAtrDeleteRoomByServer(data);
    Notifications_Dispatcher.dispatch("MsgAtrDeleteRoomByServer", { msg: data });
}
