import {
    updateOnMsgLbSpmOverallGetTopDataArray,
    updateOnFailedMsgLbSpmOverallGetRankInfo,
    updateOnMsgLbSpmOverallGetRankInfo,
    updateOnFailedMsgLbMrwGetRankIndex,
    updateOnMsgLbMrwGetRankIndex,
} from "./LeaderboardModel.ts";
import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgLbMrwGetRankIndex/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetRankInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetTopDataArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgLbSpmOverallGetTopDataArray/S.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import type { WarTypeId } from "../../warTypes/Constants.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgLbSpmOverallGetTopDataArray,  callback: _onMsgLbSpmOverallGetTopDataArray, },
        { msgCode: MessageCodes.MsgLbSpmOverallGetRankInfo,      callback: _onMsgLbSpmOverallGetRankInfo, },
        { msgCode: MessageCodes.MsgLbMrwGetRankIndex,            callback: _onMsgLbMrwGetRankIndex },
    ]);
}

export function reqLbSpmOverallGetTopDataArray(configVersion: string): void {
    send({ MsgLbSpmOverallGetTopDataArray: { c: {
        configVersion   : configVersion,
    } } });
}
function _onMsgLbSpmOverallGetTopDataArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetTopDataArrayS;
    if (!data.getErrorCode()) {
        updateOnMsgLbSpmOverallGetTopDataArray(data);
        dispatch(TypeId.MsgLbSpmOverallGetTopDataArray, data);
    }
}

export function reqLbSpmOverallGetRankInfo(userId: number): void {
    send({ MsgLbSpmOverallGetRankInfo: { c: {
        userId,
    } } });
}
function _onMsgLbSpmOverallGetRankInfo(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgLbSpmOverallGetRankInfoS;
    if (data.getErrorCode()) {
        updateOnFailedMsgLbSpmOverallGetRankInfo(data);
    } else {
        updateOnMsgLbSpmOverallGetRankInfo(data);
        dispatch(TypeId.MsgLbSpmOverallGetRankInfo, data);
    }
}

export function reqLbMrwGetRankIndex(warType: WarTypeId, playersCountUnneutral: number, userId: number): void {
    send({ MsgLbMrwGetRankIndex: { c: {
        warType,
        playersCountUnneutral,
        userId,
    } } });
}
function _onMsgLbMrwGetRankIndex(e: Event): void {
    const data = e.data as S;
    if (data.getErrorCode()) {
        updateOnFailedMsgLbMrwGetRankIndex(data);
    } else {
        updateOnMsgLbMrwGetRankIndex(data);
        dispatch(TypeId.MsgLbMrwGetRankIndex, data);
    }
}
