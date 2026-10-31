import {
    Helpers_Misc,
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    MultiCustomRoom_Model_McrModel,
    type Egret_Egret,
} from "../../internal.ts";
import type { C as McrCreateRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/C.ts";
import type { C as McrSetSelfSettingsRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMcrSetSelfSettings/C.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrCreateRoom,                callback : _onMsgMcrCreateRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrJoinRoom,                  callback : _onMsgMcrJoinRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrDeleteRoom,                callback : _onMsgMcrDeleteRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrExitRoom,                  callback : _onMsgMcrExitRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrDeletePlayer,              callback : _onMsgMcrDeletePlayer },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrAddDummy,                  callback : _onMsgMcrAddDummy },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrSetDummySettings,          callback : _onMsgMcrSetDummySettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrInvite,                    callback : _onMsgMcrInvite },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrSetReady,                  callback : _onMsgMcrSetReady },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrSetSelfSettings,           callback : _onMsgMcrSetSelfSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrGetRoomStaticInfo,         callback : _onMsgMcrGetRoomStaticInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrGetRoomPlayerInfo,         callback : _onMsgMcrGetRoomPlayerInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrGetJoinableRoomIdArray,    callback : _onMsgMcrGetJoinableRoomIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrGetJoinedRoomIdArray,      callback : _onMsgMcrGetJoinedRoomIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgMcrStartWar,                  callback : _onMsgMcrStartWar },
    ], null);
}

export function reqCreateRoom(param: McrCreateRoomRequest): void {
    Networks_Manager.send({
        MsgMcrCreateRoom : { c : param.toJson() },
    });
}
function _onMsgMcrCreateRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrCreateRoom"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrCreateRoom", { msg: data });
    } else {
        Notifications_Dispatcher.dispatch("MsgMcrCreateRoomFailed", { msg: data });
    }
}

export function reqMcrJoinRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMcrJoinRoom : {
            c : {
                roomId : roomId,
            }, 
        },
    });
}
async function _onMsgMcrJoinRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrJoinRoom"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrJoinRoom", { msg: data });
    }
}

export function reqMcrDeleteRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMcrDeleteRoom : {
            c : {
                roomId,
            }, 
        },
    });
}
function _onMsgMcrDeleteRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrDeleteRoom"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrDeleteRoom", { msg: data });
    }
}

export function reqMcrExitRoom(roomId: number): void {
    Networks_Manager.send({
        MsgMcrExitRoom : {
            c : {
                roomId,
            }, 
        },
    });
}
async function _onMsgMcrExitRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrExitRoom"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrExitRoom", { msg: data });
    }
}

export function reqMcrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    Networks_Manager.send({
        MsgMcrDeletePlayer : {
            c : {
                roomId,
                playerIndex,
                forbidReentrance,
            }, 
        },
    });
}
async function _onMsgMcrDeletePlayer(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrDeletePlayer"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrDeletePlayer", { msg: data });
    }
}

export function reqMcrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMcrAddDummy : {
            c : {
                roomId            : roomId,
                playerIndex       : playerIndex,
                coId              : coId,
                unitAndTileSkinId : unitAndTileSkinId,
            }, 
        },
    });
}
function _onMsgMcrAddDummy(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrAddDummy"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrAddDummy", { msg: data });
    }
}

export function reqMcrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgMcrSetDummySettings : {
            c : {
                roomId            : roomId,
                playerIndex       : playerIndex,
                coId              : coId,
                unitAndTileSkinId : unitAndTileSkinId,
            }, 
        },
    });
}
function _onMsgMcrSetDummySettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrSetDummySettings"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrSetDummySettings", { msg: data });
    }
}

export function reqMcrInvite(roomId: number, userIdArray: number[]): void {
    Networks_Manager.send({
        MsgMcrInvite : {
            c : {
                roomId      : roomId,
                userIdArray : userIdArray,
            }, 
        },
    });
}
function _onMsgMcrInvite(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrInvite"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrInvite", { msg: data });
    }
}

export function reqMcrSetReady(roomId: number, isReady: boolean): void {
    Networks_Manager.send({
        MsgMcrSetReady : {
            c : {
                roomId,
                isReady,
            }, 
        },
    });
}
async function _onMsgMcrSetReady(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrSetReady"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrSetReady", { msg: data });
    }
}

export function reqMcrSetSelfSettings(data: McrSetSelfSettingsRequest): void {
    Networks_Manager.send({
        MsgMcrSetSelfSettings : { c : data.toJson() },
    });
}
async function _onMsgMcrSetSelfSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrSetSelfSettings"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrSetSelfSettings", { msg: data });
    }
}

export function reqMcrGetRoomStaticInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMcrGetRoomStaticInfo : {
            c : {
                roomId,
            }, 
        },
    });
}
async function _onMsgMcrGetRoomStaticInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrGetRoomStaticInfo"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        MultiCustomRoom_Model_McrModel.updateOnFailedMsgMcrGetRoomStaticInfo(data);
        Notifications_Dispatcher.dispatch("MsgMcrGetRoomStaticInfoFailed", { msg: data });
    } else {
        await MultiCustomRoom_Model_McrModel.updateOnMsgMcrGetRoomStaticInfo(data);
        Notifications_Dispatcher.dispatch("MsgMcrGetRoomStaticInfo", { msg: data });
    }
}

export function reqMcrGetRoomPlayerInfo(roomId: number): void {
    Networks_Manager.send({
        MsgMcrGetRoomPlayerInfo : {
            c : {
                roomId,
            }, 
        },
    });
}
function _onMsgMcrGetRoomPlayerInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrGetRoomPlayerInfo"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        MultiCustomRoom_Model_McrModel.updateOnFailedMsgMcrGetRoomPlayerInfo(data);
        Notifications_Dispatcher.dispatch("MsgMcrGetRoomPlayerInfoFailed", { msg: data });
    } else {
        MultiCustomRoom_Model_McrModel.updateOnMsgMcrGetRoomPlayerInfo(data);
        Notifications_Dispatcher.dispatch("MsgMcrGetRoomPlayerInfo", { msg: data });
    }
}

export function reqMcrGetJoinableRoomIdArray(): void {
    Networks_Manager.send({
        MsgMcrGetJoinableRoomIdArray : {
            c : {
            }, 
        },
    });
}
function _onMsgMcrGetJoinableRoomIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrGetJoinableRoomIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiCustomRoom_Model_McrModel.setJoinableRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch("MsgMcrGetJoinableRoomIdArray", { msg: data });
    }
}

export function reqMcrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({
        MsgMcrGetJoinedRoomIdArray : {
            c : {
            }, 
        },
    });
}
function _onMsgMcrGetJoinedRoomIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrGetJoinedRoomIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        MultiCustomRoom_Model_McrModel.setJoinedRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch("MsgMcrGetJoinedRoomIdArray", { msg: data });
    }
}

export function reqMcrStartWar(roomId: number): void {
    Networks_Manager.send({
        MsgMcrStartWar : {
            c : {
                roomId,
            }, 
        },
    });
}
function _onMsgMcrStartWar(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgMcrStartWar"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgMcrStartWar", { msg: data });
    }
}
