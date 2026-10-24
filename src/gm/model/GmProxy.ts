import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgGmAddUserMedalS from "../../proto/schema/CommonProto/NetMessage/MsgGmAddUserMedal/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgGmDeleteSpmAllScoreAndReplayS from "../../proto/schema/CommonProto/NetMessage/MsgGmDeleteSpmAllScoreAndReplay/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgGmSetUserPrivilegeS from "../../proto/schema/CommonProto/NetMessage/MsgGmSetUserPrivilege/S.ts";
import type * as ProtoSchemaCommonProtoUserUserPrivilege from "../../proto/schema/CommonProto/User/UserPrivilege.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgGmSetUserPrivilege,               callback: _onMsgGmSetUserPrivilege, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgGmDeleteSpmAllScoreAndReplay,     callback: _onMsgGmDeleteSpmAllScoreAndReplay },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgGmAddUserMedal,                   callback: _onMsgGmAddUserMedal },
    ]);
}

export function reqGmDeleteMcrRoom(roomId: number): void {
    NetworksManager.send({ MsgGmDeleteMcrRoom: { c: {
        roomId  : roomId,
    }}});
}
export function reqGmDeleteMfrRoom(roomId: number): void {
    NetworksManager.send({ MsgGmDeleteMfrRoom: { c: {
        roomId  : roomId,
    }}});
}
export function reqGmDeleteMmrRoom(roomId: number): void {
    NetworksManager.send({ MsgGmDeleteMmrRoom: { c: {
        roomId  : roomId,
    }}});
}
export function reqGmDeleteMrrRoom(roomId: number): void {
    NetworksManager.send({ MsgGmDeleteMrrRoom: { c: {
        roomId  : roomId,
    }}});
}
export function reqGmDeleteCcrRoom(roomId: number): void {
    NetworksManager.send({ MsgGmDeleteCcrRoom: { c: {
        roomId  : roomId,
    }}});
}

export function reqGmSetUserPrivilege(userId: number, userPrivilege: ProtoSchemaCommonProtoUserUserPrivilege.UserPrivilege): void {
    NetworksManager.send({ MsgGmSetUserPrivilege: { c: {
        userId        : userId,
        userPrivilege : userPrivilege.toJson(),
    } } });
}
async function _onMsgGmSetUserPrivilege(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgGmSetUserPrivilegeS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgGmSetUserPrivilege(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgGmSetUserPrivilege, data);
    }
}

export function reqGmDeleteSpmAllScoreAndReplay(): void {
    NetworksManager.send({
        MsgGmDeleteSpmAllScoreAndReplay: { c: {
        } },
    });
}
function _onMsgGmDeleteSpmAllScoreAndReplay(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgGmDeleteSpmAllScoreAndReplayS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgGmDeleteSpmAllScoreAndReplay, data);
    }
}

export function reqGmAddUserMedal(userId: number, medalId: number, expireTimestamp: number): void {
    NetworksManager.send({
        MsgGmAddUserMedal: { c: {
            userId          : userId,
            medalId         : medalId,
            expireTimestamp : expireTimestamp,
        } },
    });
}
function _onMsgGmAddUserMedal(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgGmAddUserMedalS.S;
    if (!data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgGmAddUserMedal, data);
    }
}

export function reqGmUpdateReplayInfo(minReplayId: number, maxReplayId: number): void {
    NetworksManager.send({
        MsgGmUpdateReplayInfo: { c: {
            minReplayId : minReplayId,
            maxReplayId : maxReplayId,
        } },
    });
}
