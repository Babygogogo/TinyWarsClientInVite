import * as CampaignsMainsProvider from "./Provider.ts";
import type * as CampaignsWarsIWar from "../wars/IWar.ts";
import * as HelpersGzip from "../../helpers/Gzip.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarPlayerCoInfo from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/PlayerCoInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetAllMapTimestampArrayS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetAllMapTimestampArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetCampaignInfoS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetCampaignInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetCampaignLeaderboardS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetCampaignLeaderboard/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetCampaignMapLeaderboardS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetCampaignMapLeaderboard/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetEnabledCampaignIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetEnabledCampaignIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetMapRawDataS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetMapRawData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetMapRawDataArrayS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetMapRawDataArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetMapTimestampS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetMapTimestamp/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignGetScoreS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetScore/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignSaveWarS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignSaveWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignValidateWarS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignValidateWar/S.ts";
import type * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as SinglePlayerModeModelSpmModel from "../../singlePlayerMode/model/SpmModel.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../singlePlayerWar/interface/ISpwWar.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignCreateWar,                    callback: _onMsgCampaignCreateWar },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignSaveWar,                      callback: _onMsgCampaignSaveWar },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignValidateWar,                  callback: _onMsgCampaignValidateWar },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignGetCampaignInfo,              callback: _onMsgCampaignGetCampaignInfo },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignGetEnabledCampaignIdArray,    callback: _onMsgCampaignGetEnabledCampaignIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignGetMapRawData,                callback: _onMsgCampaignGetMapRawData },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignGetMapRawDataArray,           callback: _onMsgCampaignGetMapRawDataArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignGetMapTimestamp,              callback: _onMsgCampaignGetMapTimestamp },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignGetAllMapTimestampArray,      callback: _onMsgCampaignGetAllMapTimestampArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignGetCampaignLeaderboard,       callback: _onMsgCampaignGetCampaignLeaderboard },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignGetCampaignMapLeaderboard,    callback: _onMsgCampaignGetCampaignMapLeaderboard },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCampaignGetScore,                     callback: _onMsgCampaignGetScore },
    ]);
}

export function reqCampaignCreateWar({ slotIndex, slotExtraData, campaignId, campaignMapId, playerCoInfoArray }: {
    slotIndex           : number;
    slotExtraData       : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData;
    campaignId          : number;
    campaignMapId       : number;
    playerCoInfoArray   : ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarPlayerCoInfo.PlayerCoInfo[];
}): void {
    NetworksManager.send({ MsgCampaignCreateWar: { c: {
        slotIndex           : slotIndex,
        slotExtraData       : slotExtraData.toJson(),
        campaignId          : campaignId,
        campaignMapId       : campaignMapId,
        playerCoInfoArray   : playerCoInfoArray.map(v => v.toJson()),
    } } });
}
async function _onMsgCampaignCreateWar(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarS.S;
    if (data.getErrorCode()) {
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignCreateWarFailed, data);
    } else {
        await SinglePlayerModeModelSpmModel.updateOnMsgCampaignCreateWar(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignCreateWar, data);
    }
}

export function reqCampaignSaveWar(war: SinglePlayerWarInterfaceISpwWar.ISpwWar): void {
    NetworksManager.send({ MsgCampaignSaveWar: { c: {
        slotIndex           : war.getSaveSlotIndex(),
        slotExtraData       : war.getSaveSlotExtraData()?.toJson(),
        compressedWarData   : HelpersGzip.compress(war.serialize().encode()),
    }, }, });
}
async function _onMsgCampaignSaveWar(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignSaveWarS.S;
    if (!data.getErrorCode()) {
        await SinglePlayerModeModelSpmModel.updateOnMsgCampaignSaveWar(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignSaveWar, data);
    }
}

export function reqCampaignValidateWar(war: CampaignsWarsIWar.IWar): void {
    NetworksManager.send({ MsgCampaignValidateWar: { c: {
        warData     : war.serializeForValidation().toJson(),
    } }, });
}
function _onMsgCampaignValidateWar(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignValidateWarS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgCampaignValidateWar(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignValidateWar, data);
    }
}

export function reqCampaignGetCampaignInfo(campaignId: number): void {
    NetworksManager.send({ MsgCampaignGetCampaignInfo: { c: {
        campaignId  : campaignId,
    } }, });
}
function _onMsgCampaignGetCampaignInfo(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignGetCampaignInfoS.S;
    if (data.getErrorCode()) {
        CampaignsMainsProvider.updateOnFailedMsgCampaignGetCampaignInfo(data);
    } else {
        CampaignsMainsProvider.updateOnMsgCampaignGetCampaignInfo(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignGetCampaignInfo, data);
    }
}

export function reqCampaignGetEnabledCampaignIdArray(): void {
    NetworksManager.send({
        MsgCampaignGetEnabledCampaignIdArray: { c: {} },
    });
}
function _onMsgCampaignGetEnabledCampaignIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignGetEnabledCampaignIdArrayS.S;
    if (data.getErrorCode()) {
        CampaignsMainsProvider.updateOnFailedMsgCampaignGetEnabledCampaignIdArray(data);
    } else {
        CampaignsMainsProvider.updateOnMsgCampaignGetEnabledCampaignIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignGetEnabledCampaignIdArray, data);
    }
}

export function reqCampaignGetMapRawData(campaignId: number, campaignMapId: number): void {
    NetworksManager.send({
        MsgCampaignGetMapRawData: { c: {
            campaignId      : campaignId,
            campaignMapId   : campaignMapId,
        } },
    });
}
async function _onMsgCampaignGetMapRawData(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignGetMapRawDataS.S;
    if (data.getErrorCode()) {
        CampaignsMainsProvider.updateOnFailedMsgCampaignGetMapRawData(data);
    } else {
        await CampaignsMainsProvider.updateOnMsgCampaignGetMapRawData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignGetMapRawData, data);
    }
}

export function reqCampaignGetMapRawDataArray(campaignId: number, campaignMapIdArray: number[]): void {
    NetworksManager.send({ MsgCampaignGetMapRawDataArray: { c: {
        campaignId          : campaignId,
        campaignMapIdArray  : campaignMapIdArray,
    } }, });
}
async function _onMsgCampaignGetMapRawDataArray(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignGetMapRawDataArrayS.S;
    if (data.getErrorCode()) {
        // CampaignModel.updateOnFailedMsgCampaignGetMapRawDataArray(data);
    } else {
        await CampaignsMainsProvider.updateOnMsgCampaignGetMapRawDataArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignGetMapRawDataArray, data);
    }
}

export function reqCampaignGetMapTimestamp(campaignId: number, campaignMapId: number): void {
    NetworksManager.send({ MsgCampaignGetMapTimestamp: { c: {
        campaignId      : campaignId,
        campaignMapId   : campaignMapId,
    } }, });
}
async function _onMsgCampaignGetMapTimestamp(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignGetMapTimestampS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCampaignGetMapTimestamp(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignGetMapTimestamp, data);
    }
}

export function reqCampaignGetAllMapTimestampArray(campaignId: number): void {
    NetworksManager.send({ MsgCampaignGetAllMapTimestampArray: { c: {
        campaignId      : campaignId,
    } }, });
}
async function _onMsgCampaignGetAllMapTimestampArray(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignGetAllMapTimestampArrayS.S;
    if (data.getErrorCode()) {
        CampaignsMainsProvider.updateOnFailedMsgCampaignGetAllMapTimestampArray(data);
    } else {
        await CampaignsMainsProvider.updateOnMsgCampaignGetAllMapTimestampArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignGetAllMapTimestampArray, data);
    }
}

export function reqCampaignGetCampaignLeaderboard(campaignId: number): void {
    NetworksManager.send({ MsgCampaignGetCampaignLeaderboard: { c: {
        campaignId  : campaignId,
    } } });
}
function _onMsgCampaignGetCampaignLeaderboard(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignGetCampaignLeaderboardS.S;
    if (data.getErrorCode()) {
        CampaignsMainsProvider.updateOnFailedMsgCampaignGetCampaignLeaderboard(data);
    } else {
        CampaignsMainsProvider.updateOnMsgCampaignGetCampaignLeaderboard(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignGetCampaignLeaderboard, data);
    }
}

export function reqCampaignGetCampaignMapLeaderboard(campaignId: number, campaignMapId: number): void {
    NetworksManager.send({ MsgCampaignGetCampaignMapLeaderboard: { c: {
        campaignId      : campaignId,
        campaignMapId   : campaignMapId,
    } } });
}
function _onMsgCampaignGetCampaignMapLeaderboard(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignGetCampaignMapLeaderboardS.S;
    if (data.getErrorCode()) {
        CampaignsMainsProvider.updateOnFailedMsgCampaignGetCampaignMapLeaderboard(data);
    } else {
        CampaignsMainsProvider.updateOnMsgCampaignGetCampaignMapLeaderboard(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignGetCampaignMapLeaderboard, data);
    }
}

function _onMsgCampaignGetScore(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCampaignGetScoreS.S;
    if (!data.getErrorCode()) {
        UsersModel.updateOnMsgCampaignGetScore(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCampaignGetScore, data);
    }
}
