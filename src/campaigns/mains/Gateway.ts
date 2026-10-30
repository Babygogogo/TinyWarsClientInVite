import {
    updateOnFailedMsgCampaignGetCampaignInfo,
    updateOnMsgCampaignGetCampaignInfo,
    updateOnFailedMsgCampaignGetEnabledCampaignIdArray,
    updateOnMsgCampaignGetEnabledCampaignIdArray,
    updateOnFailedMsgCampaignGetMapRawData,
    updateOnMsgCampaignGetMapRawData,
    updateOnMsgCampaignGetMapRawDataArray,
    updateOnMsgCampaignGetMapTimestamp,
    updateOnFailedMsgCampaignGetAllMapTimestampArray,
    updateOnMsgCampaignGetAllMapTimestampArray,
    updateOnFailedMsgCampaignGetCampaignLeaderboard,
    updateOnMsgCampaignGetCampaignLeaderboard,
    updateOnFailedMsgCampaignGetCampaignMapLeaderboard,
    updateOnMsgCampaignGetCampaignMapLeaderboard,
} from "./Provider.ts";
import type { IWar } from "../wars/IWar.ts";
import { compress } from "../../helpers/Gzip.ts";
import {
    addListeners,
    send,
} from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { PlayerCoInfo } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/PlayerCoInfo.ts";
import type { S as CampaignCreateWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/S.ts";
import type { S as CampaignGetAllMapTimestampArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetAllMapTimestampArray/S.ts";
import type { S as CampaignGetCampaignInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetCampaignInfo/S.ts";
import type { S as CampaignGetCampaignLeaderboardResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetCampaignLeaderboard/S.ts";
import type { S as CampaignGetCampaignMapLeaderboardResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetCampaignMapLeaderboard/S.ts";
import type { S as CampaignGetEnabledCampaignIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetEnabledCampaignIdArray/S.ts";
import type { S as CampaignGetMapRawDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetMapRawData/S.ts";
import type { S as CampaignGetMapRawDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetMapRawDataArray/S.ts";
import type { S as CampaignGetMapTimestampResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetMapTimestamp/S.ts";
import type { S as CampaignGetScoreResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetScore/S.ts";
import type { S as CampaignSaveWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignSaveWar/S.ts";
import type { S as CampaignValidateWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignValidateWar/S.ts";
import type { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import {
    updateOnMsgCampaignCreateWar,
    updateOnMsgCampaignSaveWar,
} from "../../singlePlayerMode/model/SpmModel.ts";
import type { ISpwWar } from "../../singlePlayerWar/interface/ISpwWar.ts";
import {
    updateOnMsgCampaignValidateWar,
    updateOnMsgCampaignGetScore,
} from "../../users/Model.ts";
import type { Event } from "../../egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgCampaignCreateWar,                    callback: _onMsgCampaignCreateWar },
        { msgCode: MessageCodes.MsgCampaignSaveWar,                      callback: _onMsgCampaignSaveWar },
        { msgCode: MessageCodes.MsgCampaignValidateWar,                  callback: _onMsgCampaignValidateWar },
        { msgCode: MessageCodes.MsgCampaignGetCampaignInfo,              callback: _onMsgCampaignGetCampaignInfo },
        { msgCode: MessageCodes.MsgCampaignGetEnabledCampaignIdArray,    callback: _onMsgCampaignGetEnabledCampaignIdArray },
        { msgCode: MessageCodes.MsgCampaignGetMapRawData,                callback: _onMsgCampaignGetMapRawData },
        { msgCode: MessageCodes.MsgCampaignGetMapRawDataArray,           callback: _onMsgCampaignGetMapRawDataArray },
        { msgCode: MessageCodes.MsgCampaignGetMapTimestamp,              callback: _onMsgCampaignGetMapTimestamp },
        { msgCode: MessageCodes.MsgCampaignGetAllMapTimestampArray,      callback: _onMsgCampaignGetAllMapTimestampArray },
        { msgCode: MessageCodes.MsgCampaignGetCampaignLeaderboard,       callback: _onMsgCampaignGetCampaignLeaderboard },
        { msgCode: MessageCodes.MsgCampaignGetCampaignMapLeaderboard,    callback: _onMsgCampaignGetCampaignMapLeaderboard },
        { msgCode: MessageCodes.MsgCampaignGetScore,                     callback: _onMsgCampaignGetScore },
    ]);
}

export function reqCampaignCreateWar({ slotIndex, slotExtraData, campaignId, campaignMapId, playerCoInfoArray }: {
    slotIndex           : number;
    slotExtraData       : SpmWarSaveSlotExtraData;
    campaignId          : number;
    campaignMapId       : number;
    playerCoInfoArray   : PlayerCoInfo[];
}): void {
    send({ MsgCampaignCreateWar: { c: {
        slotIndex           : slotIndex,
        slotExtraData       : slotExtraData.toJson(),
        campaignId          : campaignId,
        campaignMapId       : campaignMapId,
        playerCoInfoArray   : playerCoInfoArray.map(v => v.toJson()),
    } } });
}
async function _onMsgCampaignCreateWar(e: Event): Promise<void> {
    const data = e.data as CampaignCreateWarResponse;
    if (data.getErrorCode()) {
        dispatch(TypeId.MsgCampaignCreateWarFailed, data);
    } else {
        await updateOnMsgCampaignCreateWar(data);
        dispatch(TypeId.MsgCampaignCreateWar, data);
    }
}

export function reqCampaignSaveWar(war: ISpwWar): void {
    send({ MsgCampaignSaveWar: { c: {
        slotIndex           : war.getSaveSlotIndex(),
        slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
        compressedWarData   : compress(war.serialize().encode()),
    }, }, });
}
async function _onMsgCampaignSaveWar(e: Event): Promise<void> {
    const data = e.data as CampaignSaveWarResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgCampaignSaveWar(data);
        dispatch(TypeId.MsgCampaignSaveWar, data);
    }
}

export function reqCampaignValidateWar(war: IWar): void {
    send({ MsgCampaignValidateWar: { c: {
        warData     : war.serializeForValidation().toJson(),
    } }, });
}
function _onMsgCampaignValidateWar(e: Event): void {
    const data = e.data as CampaignValidateWarResponse;
    if (!data.getErrorCode()) {
        updateOnMsgCampaignValidateWar(data);
        dispatch(TypeId.MsgCampaignValidateWar, data);
    }
}

export function reqCampaignGetCampaignInfo(campaignId: number): void {
    send({ MsgCampaignGetCampaignInfo: { c: {
        campaignId  : campaignId,
    } }, });
}
function _onMsgCampaignGetCampaignInfo(e: Event): void {
    const data = e.data as CampaignGetCampaignInfoResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgCampaignGetCampaignInfo(data);
    } else {
        updateOnMsgCampaignGetCampaignInfo(data);
        dispatch(TypeId.MsgCampaignGetCampaignInfo, data);
    }
}

export function reqCampaignGetEnabledCampaignIdArray(): void {
    send({
        MsgCampaignGetEnabledCampaignIdArray: { c: {} },
    });
}
function _onMsgCampaignGetEnabledCampaignIdArray(e: Event): void {
    const data = e.data as CampaignGetEnabledCampaignIdArrayResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgCampaignGetEnabledCampaignIdArray(data);
    } else {
        updateOnMsgCampaignGetEnabledCampaignIdArray(data);
        dispatch(TypeId.MsgCampaignGetEnabledCampaignIdArray, data);
    }
}

export function reqCampaignGetMapRawData(campaignId: number, campaignMapId: number): void {
    send({
        MsgCampaignGetMapRawData: { c: {
            campaignId      : campaignId,
            campaignMapId   : campaignMapId,
        } },
    });
}
async function _onMsgCampaignGetMapRawData(e: Event): Promise<void> {
    const data = e.data as CampaignGetMapRawDataResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgCampaignGetMapRawData(data);
    } else {
        await updateOnMsgCampaignGetMapRawData(data);
        dispatch(TypeId.MsgCampaignGetMapRawData, data);
    }
}

export function reqCampaignGetMapRawDataArray(campaignId: number, campaignMapIdArray: number[]): void {
    send({ MsgCampaignGetMapRawDataArray: { c: {
        campaignId          : campaignId,
        campaignMapIdArray  : campaignMapIdArray,
    } }, });
}
async function _onMsgCampaignGetMapRawDataArray(e: Event): Promise<void> {
    const data = e.data as CampaignGetMapRawDataArrayResponse;
    if (data.getErrorCode()) {
        // CampaignModel.updateOnFailedMsgCampaignGetMapRawDataArray(data);
    } else {
        await updateOnMsgCampaignGetMapRawDataArray(data);
        dispatch(TypeId.MsgCampaignGetMapRawDataArray, data);
    }
}

export function reqCampaignGetMapTimestamp(campaignId: number, campaignMapId: number): void {
    send({ MsgCampaignGetMapTimestamp: { c: {
        campaignId      : campaignId,
        campaignMapId   : campaignMapId,
    } }, });
}
async function _onMsgCampaignGetMapTimestamp(e: Event): Promise<void> {
    const data = e.data as CampaignGetMapTimestampResponse;
    if (!data.getErrorCode()) {
        await updateOnMsgCampaignGetMapTimestamp(data);
        dispatch(TypeId.MsgCampaignGetMapTimestamp, data);
    }
}

export function reqCampaignGetAllMapTimestampArray(campaignId: number): void {
    send({ MsgCampaignGetAllMapTimestampArray: { c: {
        campaignId      : campaignId,
    } }, });
}
async function _onMsgCampaignGetAllMapTimestampArray(e: Event): Promise<void> {
    const data = e.data as CampaignGetAllMapTimestampArrayResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgCampaignGetAllMapTimestampArray(data);
    } else {
        await updateOnMsgCampaignGetAllMapTimestampArray(data);
        dispatch(TypeId.MsgCampaignGetAllMapTimestampArray, data);
    }
}

export function reqCampaignGetCampaignLeaderboard(campaignId: number): void {
    send({ MsgCampaignGetCampaignLeaderboard: { c: {
        campaignId  : campaignId,
    } } });
}
function _onMsgCampaignGetCampaignLeaderboard(e: Event): void {
    const data = e.data as CampaignGetCampaignLeaderboardResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgCampaignGetCampaignLeaderboard(data);
    } else {
        updateOnMsgCampaignGetCampaignLeaderboard(data);
        dispatch(TypeId.MsgCampaignGetCampaignLeaderboard, data);
    }
}

export function reqCampaignGetCampaignMapLeaderboard(campaignId: number, campaignMapId: number): void {
    send({ MsgCampaignGetCampaignMapLeaderboard: { c: {
        campaignId      : campaignId,
        campaignMapId   : campaignMapId,
    } } });
}
function _onMsgCampaignGetCampaignMapLeaderboard(e: Event): void {
    const data = e.data as CampaignGetCampaignMapLeaderboardResponse;
    if (data.getErrorCode()) {
        updateOnFailedMsgCampaignGetCampaignMapLeaderboard(data);
    } else {
        updateOnMsgCampaignGetCampaignMapLeaderboard(data);
        dispatch(TypeId.MsgCampaignGetCampaignMapLeaderboard, data);
    }
}

function _onMsgCampaignGetScore(e: Event): void {
    const data = e.data as CampaignGetScoreResponse;
    if (!data.getErrorCode()) {
        updateOnMsgCampaignGetScore(data);
        dispatch(TypeId.MsgCampaignGetScore, data);
    }
}
