import * as AutoTourneysRoomsProvider from "./Provider.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrDeleteRoomByServerS from "../../proto/schema/CommonProto/NetMessage/MsgAtrDeleteRoomByServer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrGetJoinedRoomIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetJoinedRoomIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetRoomPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetBannedCoIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetSelfSettings/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtrGetRoomPublicInfo,             callback: _onMsgAtrGetRoomPublicInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtrGetJoinedRoomIdArray,          callback: _onMsgAtrGetJoinedRoomIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtrSetBannedCoIdArray,            callback: _onMsgAtrSetBannedCoIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtrSetSelfSettings,               callback: _onMsgAtrSetSelfSettings },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgAtrDeleteRoomByServer,            callback: _onMsgAtrDeleteRoomByServer },
    ]);
}

export function reqAtrGetRoomPublicInfo(roomId: number): void {
    NetworksManager.send({ MsgAtrGetRoomPublicInfo: { c: {
        roomId,
    } }, });
}
async function _onMsgAtrGetRoomPublicInfo(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS.S;
    if (data.getErrorCode()) {
        AutoTourneysRoomsProvider.updateOnFailedMsgAtrGetRoomPublicInfo(data);
    } else {
        await AutoTourneysRoomsProvider.updateOnMsgAtrGetRoomPublicInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtrGetRoomPublicInfo, data);
    }
}

export function reqAtrGetJoinedRoomIdArray(): void {
    NetworksManager.send({ MsgAtrGetJoinedRoomIdArray: { c: {
    }, }, });
}
function _onMsgAtrGetJoinedRoomIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrGetJoinedRoomIdArrayS.S;
    AutoTourneysRoomsProvider.setJoinedRoomIdArray(data.getRoomIdArray());
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtrGetJoinedRoomIdArray, data);
}

export function reqAtrSetBannedCoIdArray(roomId: number, bannedCoIdArray: number[]): void {
    NetworksManager.send({ MsgAtrSetBannedCoIdArray: { c: {
        roomId          : roomId,
        bannedCoIdArray : bannedCoIdArray,
    } }, });
}
async function _onMsgAtrSetBannedCoIdArray(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS.S;
    if (!data.getErrorCode()) {
        await AutoTourneysRoomsProvider.updateOnMsgAtrSetBannedCoIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtrSetBannedCoIdArray, data);
    }
}

export function reqAtrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
    NetworksManager.send({ MsgAtrSetSelfSettings: { c: {
        roomId,
        coId,
        unitAndTileSkinId,
    }, }, });
}
async function _onMsgAtrSetSelfSettings(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS.S;
    if (!data.getErrorCode()) {
        await AutoTourneysRoomsProvider.updateOnMsgAtrSetSelfSettings(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtrSetSelfSettings, data);
    }
}

function _onMsgAtrDeleteRoomByServer(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgAtrDeleteRoomByServerS.S;
    AutoTourneysRoomsProvider.updateOnMsgAtrDeleteRoomByServer(data);
    NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgAtrDeleteRoomByServer, data);
}
