import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Notifications_TypeId,
    Users_Model,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as GmAddUserMedalResponse } from "../../proto/schema/CommonProto/NetMessage/MsgGmAddUserMedal/S.ts";
import type { S as GmDeleteSpmAllScoreAndReplayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgGmDeleteSpmAllScoreAndReplay/S.ts";
import type { S as GmSetUserPrivilegeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgGmSetUserPrivilege/S.ts";
import type { UserPrivilege } from "../../proto/schema/CommonProto/User/UserPrivilege.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgGmSetUserPrivilege,               callback : _onMsgGmSetUserPrivilege },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgGmDeleteSpmAllScoreAndReplay,     callback : _onMsgGmDeleteSpmAllScoreAndReplay },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgGmAddUserMedal,                   callback : _onMsgGmAddUserMedal },
    ]);
}

export function reqGmDeleteMcrRoom(roomId: number): void {
    Networks_Manager.send({
        MsgGmDeleteMcrRoom : {
            c : {
                roomId : roomId,
            }, 
        }, 
    });
}
export function reqGmDeleteMfrRoom(roomId: number): void {
    Networks_Manager.send({
        MsgGmDeleteMfrRoom : {
            c : {
                roomId : roomId,
            }, 
        }, 
    });
}
export function reqGmDeleteMmrRoom(roomId: number): void {
    Networks_Manager.send({
        MsgGmDeleteMmrRoom : {
            c : {
                roomId : roomId,
            }, 
        }, 
    });
}
export function reqGmDeleteMrrRoom(roomId: number): void {
    Networks_Manager.send({
        MsgGmDeleteMrrRoom : {
            c : {
                roomId : roomId,
            }, 
        }, 
    });
}
export function reqGmDeleteCcrRoom(roomId: number): void {
    Networks_Manager.send({
        MsgGmDeleteCcrRoom : {
            c : {
                roomId : roomId,
            }, 
        }, 
    });
}

export function reqGmSetUserPrivilege(userId: number, userPrivilege: UserPrivilege): void {
    Networks_Manager.send({
        MsgGmSetUserPrivilege : {
            c : {
                userId        : userId,
                userPrivilege : userPrivilege.toJson(),
            }, 
        }, 
    });
}
async function _onMsgGmSetUserPrivilege(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as GmSetUserPrivilegeResponse;
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgGmSetUserPrivilege(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgGmSetUserPrivilege, data);
    }
}

export function reqGmDeleteSpmAllScoreAndReplay(): void {
    Networks_Manager.send({
        MsgGmDeleteSpmAllScoreAndReplay : {
            c : {
            }, 
        },
    });
}
function _onMsgGmDeleteSpmAllScoreAndReplay(e: Egret_Egret.Event): void {
    const data = e.data as GmDeleteSpmAllScoreAndReplayResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgGmDeleteSpmAllScoreAndReplay, data);
    }
}

export function reqGmAddUserMedal(userId: number, medalId: number, expireTimestamp: number): void {
    Networks_Manager.send({
        MsgGmAddUserMedal : {
            c : {
                userId          : userId,
                medalId         : medalId,
                expireTimestamp : expireTimestamp,
            }, 
        },
    });
}
function _onMsgGmAddUserMedal(e: Egret_Egret.Event): void {
    const data = e.data as GmAddUserMedalResponse;
    if (!data.getErrorCode()) {
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgGmAddUserMedal, data);
    }
}

export function reqGmUpdateReplayInfo(minReplayId: number, maxReplayId: number): void {
    Networks_Manager.send({
        MsgGmUpdateReplayInfo : {
            c : {
                minReplayId : minReplayId,
                maxReplayId : maxReplayId,
            }, 
        },
    });
}
