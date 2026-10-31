import {
    Helpers_Misc,
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    CoopCustomRoom_Model_CcrModel,
    type Egret_Egret,
} from "../../internal.ts";
import type { C as CcrCreateRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/C.ts";
import type { C as CcrSetSelfSettingsRequest } from "../../proto/schema/CommonProto/NetMessage/MsgCcrSetSelfSettings/C.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrCreateRoom,                callback : _onMsgCcrCreateRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrJoinRoom,                  callback : _onMsgCcrJoinRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrDeleteRoom,                callback : _onMsgCcrDeleteRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrExitRoom,                  callback : _onMsgCcrExitRoom },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrDeletePlayer,              callback : _onMsgCcrDeletePlayer },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrAddDummy,                  callback : _onMsgCcrAddDummy },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrSetDummySettings,          callback : _onMsgCcrSetDummySettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrInvite,                    callback : _onMsgCcrInvite },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrSetReady,                  callback : _onMsgCcrSetReady },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrSetSelfSettings,           callback : _onMsgCcrSetSelfSettings },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrGetRoomStaticInfo,         callback : _onMsgCcrGetRoomStaticInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrGetRoomPlayerInfo,         callback : _onMsgCcrGetRoomPlayerInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrGetJoinableRoomIdArray,    callback : _onMsgCcrGetJoinableRoomIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrGetJoinedRoomIdArray,      callback : _onMsgCcrGetJoinedRoomIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCcrStartWar,                  callback : _onMsgCcrStartWar },
    ], null);
}

export function reqCreateRoom(param: CcrCreateRoomRequest): void {
    Networks_Manager.send({
        MsgCcrCreateRoom : { c : param.toJson() },
    });
}
function _onMsgCcrCreateRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrCreateRoom"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrCreateRoom", { msg: data });
    }
}

export function reqCcrJoinRoom(roomId: number): void {
    Networks_Manager.send({
        MsgCcrJoinRoom : {
            c : {
                roomId : roomId,
            }, 
        },
    });
}
async function _onMsgCcrJoinRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrJoinRoom"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrJoinRoom", { msg: data });
    }
}

export function reqCcrDeleteRoom(roomId: number): void {
    Networks_Manager.send({
        MsgCcrDeleteRoom : {
            c : {
                roomId,
            }, 
        },
    });
}
function _onMsgCcrDeleteRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrDeleteRoom"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrDeleteRoom", { msg: data });
    }
}

export function reqCcrExitRoom(roomId: number): void {
    Networks_Manager.send({
        MsgCcrExitRoom : {
            c : {
                roomId,
            }, 
        },
    });
}
async function _onMsgCcrExitRoom(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrExitRoom"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrExitRoom", { msg: data });
    }
}

export function reqCcrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
    Networks_Manager.send({
        MsgCcrDeletePlayer : {
            c : {
                roomId,
                playerIndex,
                forbidReentrance,
            }, 
        },
    });
}
async function _onMsgCcrDeletePlayer(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrDeletePlayer"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrDeletePlayer", { msg: data });
    }
}

export function reqCcrAddDummy(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgCcrAddDummy : {
            c : {
                roomId            : roomId,
                playerIndex       : playerIndex,
                coId              : coId,
                unitAndTileSkinId : unitAndTileSkinId,
            }, 
        },
    });
}
function _onMsgCcrAddDummy(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrAddDummy"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrAddDummy", { msg: data });
    }
}

export function reqCcrSetDummySettings(roomId: number, playerIndex: number, coId: number, unitAndTileSkinId: number): void {
    Networks_Manager.send({
        MsgCcrSetDummySettings : {
            c : {
                roomId            : roomId,
                playerIndex       : playerIndex,
                coId              : coId,
                unitAndTileSkinId : unitAndTileSkinId,
            }, 
        },
    });
}
function _onMsgCcrSetDummySettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrSetDummySettings"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrSetDummySettings", { msg: data });
    }
}

export function reqCcrInvite(roomId: number, userIdArray: number[]): void {
    Networks_Manager.send({
        MsgCcrInvite : {
            c : {
                roomId      : roomId,
                userIdArray : userIdArray,
            }, 
        },
    });
}
function _onMsgCcrInvite(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrInvite"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrInvite", { msg: data });
    }
}

export function reqCcrSetReady(roomId: number, isReady: boolean): void {
    Networks_Manager.send({
        MsgCcrSetReady : {
            c : {
                roomId,
                isReady,
            }, 
        },
    });
}
async function _onMsgCcrSetReady(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrSetReady"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrSetReady", { msg: data });
    }
}

export function reqCcrSetSelfSettings(data: CcrSetSelfSettingsRequest): void {
    Networks_Manager.send({
        MsgCcrSetSelfSettings : { c : data.toJson() },
    });
}
async function _onMsgCcrSetSelfSettings(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrSetSelfSettings"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrSetSelfSettings", { msg: data });
    }
}

export function reqCcrGetRoomStaticInfo(roomId: number): void {
    Networks_Manager.send({
        MsgCcrGetRoomStaticInfo : {
            c : {
                roomId,
            }, 
        },
    });
}
async function _onMsgCcrGetRoomStaticInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrGetRoomStaticInfo"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        CoopCustomRoom_Model_CcrModel.updateOnFailedMsgCcrGetRoomStaticInfo(data);
    } else {
        await CoopCustomRoom_Model_CcrModel.updateOnMsgCcrGetRoomStaticInfo(data);
        Notifications_Dispatcher.dispatch("MsgCcrGetRoomStaticInfo", { msg: data });
    }
}

export function reqCcrGetRoomPlayerInfo(roomId: number): void {
    Networks_Manager.send({
        MsgCcrGetRoomPlayerInfo : {
            c : {
                roomId,
            }, 
        },
    });
}
function _onMsgCcrGetRoomPlayerInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrGetRoomPlayerInfo"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        CoopCustomRoom_Model_CcrModel.updateOnFailedMsgCcrGetRoomPlayerInfo(data);
    } else {
        CoopCustomRoom_Model_CcrModel.updateOnMsgCcrGetRoomPlayerInfo(data);
        Notifications_Dispatcher.dispatch("MsgCcrGetRoomPlayerInfo", { msg: data });
    }
}

export function reqCcrGetJoinableRoomIdArray(): void {
    Networks_Manager.send({
        MsgCcrGetJoinableRoomIdArray : {
            c : {
            }, 
        },
    });
}
function _onMsgCcrGetJoinableRoomIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrGetJoinableRoomIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        CoopCustomRoom_Model_CcrModel.setJoinableRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch("MsgCcrGetJoinableRoomIdArray", { msg: data });
    }
}

export function reqCcrGetJoinedRoomIdArray(): void {
    Networks_Manager.send({
        MsgCcrGetJoinedRoomIdArray : {
            c : {
            }, 
        },
    });
}
function _onMsgCcrGetJoinedRoomIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrGetJoinedRoomIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        CoopCustomRoom_Model_CcrModel.setJoinedRoomIdArray(data.getRoomIdArray());
        Notifications_Dispatcher.dispatch("MsgCcrGetJoinedRoomIdArray", { msg: data });
    }
}

export function reqCcrStartWar(roomId: number): void {
    Networks_Manager.send({
        MsgCcrStartWar : {
            c : {
                roomId,
            }, 
        },
    });
}
function _onMsgCcrStartWar(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCcrStartWar"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCcrStartWar", { msg: data });
    }
}
