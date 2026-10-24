import * as LeaderboardModelLeaderboardModel from "./LeaderboardModel.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgLbMrwGetRankIndexS from "../../proto/schema/CommonProto/NetMessage/MsgLbMrwGetRankIndex/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetRankInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetTopDataArrayS from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetTopDataArray/S.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import type * as WarTypesConstants from "../../warTypes/Constants.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgLbSpmOverallGetTopDataArray,  callback: _onMsgLbSpmOverallGetTopDataArray, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgLbSpmOverallGetRankInfo,      callback: _onMsgLbSpmOverallGetRankInfo, },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgLbMrwGetRankIndex,            callback: _onMsgLbMrwGetRankIndex },
    ]);
}

export function reqLbSpmOverallGetTopDataArray(configVersion: string): void {
    NetworksManager.send({ MsgLbSpmOverallGetTopDataArray: { c: {
        configVersion   : configVersion,
    } } });
}
function _onMsgLbSpmOverallGetTopDataArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetTopDataArrayS.S;
    if (!data.getErrorCode()) {
        LeaderboardModelLeaderboardModel.updateOnMsgLbSpmOverallGetTopDataArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgLbSpmOverallGetTopDataArray, data);
    }
}

export function reqLbSpmOverallGetRankInfo(userId: number): void {
    NetworksManager.send({ MsgLbSpmOverallGetRankInfo: { c: {
        userId,
    } } });
}
function _onMsgLbSpmOverallGetRankInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS.S;
    if (data.getErrorCode()) {
        LeaderboardModelLeaderboardModel.updateOnFailedMsgLbSpmOverallGetRankInfo(data);
    } else {
        LeaderboardModelLeaderboardModel.updateOnMsgLbSpmOverallGetRankInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgLbSpmOverallGetRankInfo, data);
    }
}

export function reqLbMrwGetRankIndex(warType: WarTypesConstants.WarTypeId, playersCountUnneutral: number, userId: number): void {
    NetworksManager.send({ MsgLbMrwGetRankIndex: { c: {
        warType,
        playersCountUnneutral,
        userId,
    } } });
}
function _onMsgLbMrwGetRankIndex(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgLbMrwGetRankIndexS.S;
    if (data.getErrorCode()) {
        LeaderboardModelLeaderboardModel.updateOnFailedMsgLbMrwGetRankIndex(data);
    } else {
        LeaderboardModelLeaderboardModel.updateOnMsgLbMrwGetRankIndex(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgLbMrwGetRankIndex, data);
    }
}
