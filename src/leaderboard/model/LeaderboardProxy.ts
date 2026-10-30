import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Notifications_TypeId,
    Leaderboard_Model_LeaderboardModel,
    type Egret_Egret,
    type WarTypes_Constants,
} from "../../internal.ts";
import type { S as LbMrwGetRankIndexResponse } from "../../proto/schema/CommonProto/NetMessage/MsgLbMrwGetRankIndex/S.ts";
import type { S as LbSpmOverallGetRankInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetRankInfo/S.ts";
import type { S as LbSpmOverallGetTopDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetTopDataArray/S.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgLbSpmOverallGetTopDataArray,  callback : _onMsgLbSpmOverallGetTopDataArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgLbSpmOverallGetRankInfo,      callback : _onMsgLbSpmOverallGetRankInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgLbMrwGetRankIndex,            callback : _onMsgLbMrwGetRankIndex },
    ]);
}

export function reqLbSpmOverallGetTopDataArray(configVersion: string): void {
    Networks_Manager.send({
        MsgLbSpmOverallGetTopDataArray : {
            c : {
                configVersion : configVersion,
            }, 
        }, 
    });
}
function _onMsgLbSpmOverallGetTopDataArray(e: Egret_Egret.Event): void {
    const data = e.data as LbSpmOverallGetTopDataArrayResponse;
    if (!data.getErrorCode()) {
        Leaderboard_Model_LeaderboardModel.updateOnMsgLbSpmOverallGetTopDataArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgLbSpmOverallGetTopDataArray, data);
    }
}

export function reqLbSpmOverallGetRankInfo(userId: number): void {
    Networks_Manager.send({
        MsgLbSpmOverallGetRankInfo : {
            c : {
                userId,
            }, 
        }, 
    });
}
function _onMsgLbSpmOverallGetRankInfo(e: Egret_Egret.Event): void {
    const data = e.data as LbSpmOverallGetRankInfoResponse;
    if (data.getErrorCode()) {
        Leaderboard_Model_LeaderboardModel.updateOnFailedMsgLbSpmOverallGetRankInfo(data);
    } else {
        Leaderboard_Model_LeaderboardModel.updateOnMsgLbSpmOverallGetRankInfo(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgLbSpmOverallGetRankInfo, data);
    }
}

export function reqLbMrwGetRankIndex(warType: WarTypes_Constants.WarTypeId, playersCountUnneutral: number, userId: number): void {
    Networks_Manager.send({
        MsgLbMrwGetRankIndex : {
            c : {
                warType,
                playersCountUnneutral,
                userId,
            }, 
        }, 
    });
}
function _onMsgLbMrwGetRankIndex(e: Egret_Egret.Event): void {
    const data = e.data as LbMrwGetRankIndexResponse;
    if (data.getErrorCode()) {
        Leaderboard_Model_LeaderboardModel.updateOnFailedMsgLbMrwGetRankIndex(data);
    } else {
        Leaderboard_Model_LeaderboardModel.updateOnMsgLbMrwGetRankIndex(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgLbMrwGetRankIndex, data);
    }
}
