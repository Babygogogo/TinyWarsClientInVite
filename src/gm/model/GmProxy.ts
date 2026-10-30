import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as GmAddUserMedalResponse } from "../../proto/schema/CommonProto/NetMessage/MsgGmAddUserMedal/S.ts";
import type { S as GmDeleteSpmAllScoreAndReplayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgGmDeleteSpmAllScoreAndReplay/S.ts";
import type { S as GmSetUserPrivilegeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgGmSetUserPrivilege/S.ts";
import type { UserPrivilege } from "../../proto/schema/CommonProto/User/UserPrivilege.ts";
import { updateOnMsgGmSetUserPrivilege } from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgGmSetUserPrivilege,               callback: _onMsgGmSetUserPrivilege, },
        { msgCode: MessageCodes.MsgGmDeleteSpmAllScoreAndReplay,     callback: _onMsgGmDeleteSpmAllScoreAndReplay },
        { msgCode: MessageCodes.MsgGmAddUserMedal,                   callback: _onMsgGmAddUserMedal },
    ]);
}

export function reqGmDeleteMcrRoom(roomId: number): void {
    send({ MsgGmDeleteMcrRoom: { c: {
        roomId  : roomId,
    }}});
}
export function reqGmDeleteMfrRoom(roomId: number): void {
    send({ MsgGmDeleteMfrRoom: { c: {
        roomId  : roomId,
    }}});
}
export function reqGmDeleteMmrRoom(roomId: number): void {
    send({ MsgGmDeleteMmrRoom: { c: {
        roomId  : roomId,
    }}});
}
export function reqGmDeleteMrrRoom(roomId: number): void {
    send({ MsgGmDeleteMrrRoom: { c: {
        roomId  : roomId,
    }}});
}
export function reqGmDeleteCcrRoom(roomId: number): void {
    send({ MsgGmDeleteCcrRoom: { c: {
        roomId  : roomId,
    }}});
}

export function reqGmSetUserPrivilege(userId: number, userPrivilege: UserPrivilege): void {
    send({ MsgGmSetUserPrivilege: { c: {
        userId        : userId,
        userPrivilege : userPrivilege.toJson(),
    } } });
}
async function _onMsgGmSetUserPrivilege(e: Event): Promise<void> {
    const data = e.data as GmSetUserPrivilegeResponse;
    if (!data.getErrorCode()) {
        updateOnMsgGmSetUserPrivilege(data);
        dispatch(TypeId.MsgGmSetUserPrivilege, data);
    }
}

export function reqGmDeleteSpmAllScoreAndReplay(): void {
    send({
        MsgGmDeleteSpmAllScoreAndReplay: { c: {
        } },
    });
}
function _onMsgGmDeleteSpmAllScoreAndReplay(e: Event): void {
    const data = e.data as GmDeleteSpmAllScoreAndReplayResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgGmDeleteSpmAllScoreAndReplay, data);
    }
}

export function reqGmAddUserMedal(userId: number, medalId: number, expireTimestamp: number): void {
    send({
        MsgGmAddUserMedal: { c: {
            userId          : userId,
            medalId         : medalId,
            expireTimestamp : expireTimestamp,
        } },
    });
}
function _onMsgGmAddUserMedal(e: Event): void {
    const data = e.data as GmAddUserMedalResponse;
    if (!data.getErrorCode()) {
        dispatch(TypeId.MsgGmAddUserMedal, data);
    }
}

export function reqGmUpdateReplayInfo(minReplayId: number, maxReplayId: number): void {
    send({
        MsgGmUpdateReplayInfo: { c: {
            minReplayId : minReplayId,
            maxReplayId : maxReplayId,
        } },
    });
}
