import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    AutoTourneys_Rooms_Provider,
    Notifications_TypeId,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as AtrDeleteRoomByServerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrDeleteRoomByServer/S.ts";
import type { S as AtrGetJoinedRoomIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetJoinedRoomIdArray/S.ts";
import type { S as AtrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetRoomPublicInfo/S.ts";
import type { S as AtrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetBannedCoIdArray/S.ts";
import type { S as AtrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetSelfSettings/S.ts";

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
async function _onMsgAtrGetRoomPublicInfo(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as AtrGetRoomPublicInfoResponse;
    if (data.getErrorCode()) {
        AutoTourneys_Rooms_Provider.updateOnFailedMsgAtrGetRoomPublicInfo(data);
    } else {
        await AutoTourneys_Rooms_Provider.updateOnMsgAtrGetRoomPublicInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgAtrGetRoomPublicInfo, data);
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
function _onMsgAtrGetJoinedRoomIdArray(e: Egret_Egret.Event): void {
    const data = e.data as AtrGetJoinedRoomIdArrayResponse;
    AutoTourneys_Rooms_Provider.setJoinedRoomIdArray(data.getRoomIdArray());
    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgAtrGetJoinedRoomIdArray, data);
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
async function _onMsgAtrSetBannedCoIdArray(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as AtrSetBannedCoIdArrayResponse;
    if (!data.getErrorCode()) {
        await AutoTourneys_Rooms_Provider.updateOnMsgAtrSetBannedCoIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgAtrSetBannedCoIdArray, data);
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
async function _onMsgAtrSetSelfSettings(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as AtrSetSelfSettingsResponse;
    if (!data.getErrorCode()) {
        await AutoTourneys_Rooms_Provider.updateOnMsgAtrSetSelfSettings(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgAtrSetSelfSettings, data);
    }
}

function _onMsgAtrDeleteRoomByServer(e: Egret_Egret.Event): void {
    const data = e.data as AtrDeleteRoomByServerResponse;
    AutoTourneys_Rooms_Provider.updateOnMsgAtrDeleteRoomByServer(data);
    Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgAtrDeleteRoomByServer, data);
}
