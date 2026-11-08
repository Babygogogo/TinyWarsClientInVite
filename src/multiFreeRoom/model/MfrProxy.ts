import {
    Helpers_Misc,
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    MultiFreeRoom_Model_MfrModel,
    type Egret_Egret,
} from "../../internal.ts";
import type { C as MfrCreateRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMfrCreateRoom/C.ts";
import type { C as MfrSetSelfSettingsRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMfrSetSelfSettings/C.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrCreateRoom,                callback : _onMsgMfrCreateRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrJoinRoom,                  callback : _onMsgMfrJoinRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrDeleteRoom,                callback : _onMsgMfrDeleteRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrExitRoom,                  callback : _onMsgMfrExitRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrDeletePlayer,              callback : _onMsgMfrDeletePlayer },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrAddDummy,                  callback : _onMsgMfrAddDummy },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrSetDummySettings,          callback : _onMsgMfrSetDummySettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrInvite,                    callback : _onMsgMfrInvite },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrSetReady,                  callback : _onMsgMfrSetReady },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrSetSelfSettings,           callback : _onMsgMfrSetSelfSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrGetRoomStaticInfo,         callback : _onMsgMfrGetRoomStaticInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrGetRoomPlayerInfo,         callback : _onMsgMfrGetRoomPlayerInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrGetJoinableRoomIdArray,    callback : _onMsgMfrGetJoinableRoomIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrGetJoinedRoomIdArray,      callback : _onMsgMfrGetJoinedRoomIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMfrStartWar,                  callback : _onMsgMfrStartWar },
    ], null);
}

export function reqCreateRoom(param: MfrCreateRoomRequest): void {
    Networks_Manager.send({
        MsgMfrCreateRoom : { c : param.toJson() },
    });
}
function _onMsgMfrCreateRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrCreateRoom"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrCreateRoom", { msg: data });
    }
}

export function reqMfrJoinRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMfrJoinRoom : {
            c : {
                roomId : roomId,
            }, 
        },
    });
}
async function _onMsgMfrJoinRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrJoinRoom"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrJoinRoom", { msg: data });
    }
}

export function reqMfrDeleteRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMfrDeleteRoom : {
            c : {
                roomId,
            }, 
        },
    });
}
function _onMsgMfrDeleteRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrDeleteRoom"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrDeleteRoom", { msg: data });
    }
}

export function reqMfrExitRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMfrExitRoom : {
            c : {
                roomId,
            }, 
        },
    });
}
async function _onMsgMfrExitRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrExitRoom"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrExitRoom", { msg: data });
    }
}

export function reqMfrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    Networks_Manager.send({
        MsgMfrDeletePlayer : {
            c : {
                roomId,
                playerIndex,
                forbidReentrance,
            }, 
        },
    });
}
async function _onMsgMfrDeletePlayer(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrDeletePlayer"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrDeletePlayer", { msg: data });
    }
}

export function reqMfrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMfrAddDummy : {
            c : {
                roomId            : roomId,
                playerIndex       : playerIndex,
                coId              : coId,
                unitAndTileSkinId : unitAndTileSkinId,
            }, 
        },
    });
}
function _onMsgMfrAddDummy(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrAddDummy"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrAddDummy", { msg: data });
    }
}

export function reqMfrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMfrSetDummySettings : {
            c : {
                roomId            : roomId,
                playerIndex       : playerIndex,
                coId              : coId,
                unitAndTileSkinId : unitAndTileSkinId,
            }, 
        },
    });
}
function _onMsgMfrSetDummySettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrSetDummySettings"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrSetDummySettings", { msg: data });
    }
}

export function reqMfrInvite(roomId: number, userIdArray: number[]): void {
    Networks_Manager.send({
        MsgMfrInvite : {
            c : {
                roomId      : roomId,
                userIdArray : userIdArray,
            }, 
        },
    });
}
function _onMsgMfrInvite(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrInvite"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrInvite", { msg: data });
    }
}

export function reqMfrSetReady(roomId: number, isReady: boolean): void {
    Networks_Manager.send({
        MsgMfrSetReady : {
            c : {
                roomId,
                isReady,
            }, 
        },
    });
}
async function _onMsgMfrSetReady(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrSetReady"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrSetReady", { msg: data });
    }
}

export function reqMfrSetSelfSettings(data: MfrSetSelfSettingsRequest): void {
    Networks_Manager.send({
        MsgMfrSetSelfSettings : { c : data.toJson() },
    });
}
async function _onMsgMfrSetSelfSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrSetSelfSettings"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrSetSelfSettings", { msg: data });
    }
}

export function reqMfrGetRoomStaticInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMfrGetRoomStaticInfo : {
            c : {
                roomId,
            }, 
        },
    });
}
async function _onMsgMfrGetRoomStaticInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrGetRoomStaticInfo"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        MultiFreeRoom_Model_MfrModel.updateOnFailedMsgMfrGetRoomStaticInfo(data);
    } else {
        await MultiFreeRoom_Model_MfrModel.updateOnMsgMfrGetRoomStaticInfo(data);
        Notifications_Dispatcher.dispatch("MsgMfrGetRoomStaticInfo", { msg: data });
    }
}

export function reqMfrGetRoomPlayerInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMfrGetRoomPlayerInfo : {
            c : {
                roomId,
            }, 
        },
    });
}
function _onMsgMfrGetRoomPlayerInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrGetRoomPlayerInfo"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        MultiFreeRoom_Model_MfrModel.updateOnFailedMsgMfrGetRoomPlayerInfo(data);
    } else {
        MultiFreeRoom_Model_MfrModel.updateOnMsgMfrGetRoomPlayerInfo(data);
        Notifications_Dispatcher.dispatch("MsgMfrGetRoomPlayerInfo", { msg: data });
    }
}

export function reqMfrGetJoinableRoomIdArray(): void {
    Networks_Manager.send({
        MsgMfrGetJoinableRoomIdArray : {
            c : {
            }, 
        },
    });
}
function _onMsgMfrGetJoinableRoomIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrGetJoinableRoomIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiFreeRoom_Model_MfrModel.setJoinableRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch("MsgMfrGetJoinableRoomIdArray", { msg: data });
    }
}

export function reqMfrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({
        MsgMfrGetJoinedRoomIdArray : {
            c : {
            }, 
        },
    });
}
function _onMsgMfrGetJoinedRoomIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrGetJoinedRoomIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiFreeRoom_Model_MfrModel.setJoinedRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch("MsgMfrGetJoinedRoomIdArray", { msg: data });
    }
}

export function reqMfrStartWar(roomId: number): void {
    Networks_Manager.send({
        MsgMfrStartWar : {
            c : {
                roomId,
            }, 
        },
    });
}
function _onMsgMfrStartWar(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMfrStartWar"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMfrStartWar", { msg: data });
    }
}
