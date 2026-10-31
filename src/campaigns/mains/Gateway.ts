import {
    Helpers_Misc,
    Networks_Manager,
    Helpers_Gzip,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Campaigns_Mains_Provider,
    SinglePlayerMode_Model_SpmModel,
    Users_Model,
    type Egret_Egret,
    type SinglePlayerWar_Interface_ISpwWar,
    type Campaigns_Wars_IWar,
} from "../../internal.ts";
import type { PlayerCoInfo } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/PlayerCoInfo.ts";
import type { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignCreateWar,                    callback : _onMsgCampaignCreateWar },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignSaveWar,                      callback : _onMsgCampaignSaveWar },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignValidateWar,                  callback : _onMsgCampaignValidateWar },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignGetCampaignInfo,              callback : _onMsgCampaignGetCampaignInfo },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignGetEnabledCampaignIdArray,    callback : _onMsgCampaignGetEnabledCampaignIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignGetMapRawData,                callback : _onMsgCampaignGetMapRawData },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignGetMapRawDataArray,           callback : _onMsgCampaignGetMapRawDataArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignGetMapTimestamp,              callback : _onMsgCampaignGetMapTimestamp },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignGetAllMapTimestampArray,      callback : _onMsgCampaignGetAllMapTimestampArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignGetCampaignLeaderboard,       callback : _onMsgCampaignGetCampaignLeaderboard },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignGetCampaignMapLeaderboard,    callback : _onMsgCampaignGetCampaignMapLeaderboard },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCampaignGetScore,                     callback : _onMsgCampaignGetScore },
    ]);
}

export function reqCampaignCreateWar({ slotIndex, slotExtraData, campaignId, campaignMapId, playerCoInfoArray }: {
    slotIndex           : number;
    slotExtraData       : SpmWarSaveSlotExtraData;
    campaignId          : number;
    campaignMapId       : number;
    playerCoInfoArray   : PlayerCoInfo[];
}): void {
    Networks_Manager.send({
        MsgCampaignCreateWar : {
            c : {
                slotIndex         : slotIndex,
                slotExtraData     : slotExtraData.toJson(),
                campaignId        : campaignId,
                campaignMapId     : campaignMapId,
                playerCoInfoArray : playerCoInfoArray.map(v => v.toJson()),
            }, 
        }, 
    });
}
async function _onMsgCampaignCreateWar(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignCreateWar"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        Notifications_Dispatcher.dispatch("MsgCampaignCreateWarFailed", { msg: data });
    } else {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgCampaignCreateWar(data);
        Notifications_Dispatcher.dispatch("MsgCampaignCreateWar", { msg: data });
    }
}

export function reqCampaignSaveWar(war: SinglePlayerWar_Interface_ISpwWar.ISpwWar): void {
    Networks_Manager.send({
        MsgCampaignSaveWar : {
            c : {
                slotIndex         : war.getSaveSlotIndex(),
                slotExtraData     : war.getSaveSlotExtraData()?.toJson(),
                compressedWarData : Helpers_Gzip.compress(war.serialize().encode()),
            }, 
        }, 
    });
}
async function _onMsgCampaignSaveWar(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignSaveWar"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await SinglePlayerMode_Model_SpmModel.updateOnMsgCampaignSaveWar(data);
        Notifications_Dispatcher.dispatch("MsgCampaignSaveWar", { msg: data });
    }
}

export function reqCampaignValidateWar(war: Campaigns_Wars_IWar.IWar): void {
    Networks_Manager.send({
        MsgCampaignValidateWar : {
            c : {
                warData : war.serializeForValidation().toJson(),
            }, 
        }, 
    });
}
function _onMsgCampaignValidateWar(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignValidateWar"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgCampaignValidateWar(data);
        Notifications_Dispatcher.dispatch("MsgCampaignValidateWar", { msg: data });
    }
}

export function reqCampaignGetCampaignInfo(campaignId: number): void {
    Networks_Manager.send({
        MsgCampaignGetCampaignInfo : {
            c : {
                campaignId : campaignId,
            }, 
        }, 
    });
}
function _onMsgCampaignGetCampaignInfo(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignGetCampaignInfo"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        Campaigns_Mains_Provider.updateOnFailedMsgCampaignGetCampaignInfo(data);
    } else {
        Campaigns_Mains_Provider.updateOnMsgCampaignGetCampaignInfo(data);
        Notifications_Dispatcher.dispatch("MsgCampaignGetCampaignInfo", { msg: data });
    }
}

export function reqCampaignGetEnabledCampaignIdArray(): void {
    Networks_Manager.send({
        MsgCampaignGetEnabledCampaignIdArray : { c : {} },
    });
}
function _onMsgCampaignGetEnabledCampaignIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignGetEnabledCampaignIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        Campaigns_Mains_Provider.updateOnFailedMsgCampaignGetEnabledCampaignIdArray(data);
    } else {
        Campaigns_Mains_Provider.updateOnMsgCampaignGetEnabledCampaignIdArray(data);
        Notifications_Dispatcher.dispatch("MsgCampaignGetEnabledCampaignIdArray", { msg: data });
    }
}

export function reqCampaignGetMapRawData(campaignId: number, campaignMapId: number): void {
    Networks_Manager.send({
        MsgCampaignGetMapRawData : {
            c : {
                campaignId    : campaignId,
                campaignMapId : campaignMapId,
            }, 
        },
    });
}
async function _onMsgCampaignGetMapRawData(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignGetMapRawData"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        Campaigns_Mains_Provider.updateOnFailedMsgCampaignGetMapRawData(data);
    } else {
        await Campaigns_Mains_Provider.updateOnMsgCampaignGetMapRawData(data);
        Notifications_Dispatcher.dispatch("MsgCampaignGetMapRawData", { msg: data });
    }
}

export function reqCampaignGetMapRawDataArray(campaignId: number, campaignMapIdArray: number[]): void {
    Networks_Manager.send({
        MsgCampaignGetMapRawDataArray : {
            c : {
                campaignId         : campaignId,
                campaignMapIdArray : campaignMapIdArray,
            }, 
        }, 
    });
}
async function _onMsgCampaignGetMapRawDataArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignGetMapRawDataArray"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        // CampaignModel.updateOnFailedMsgCampaignGetMapRawDataArray(data);
    } else {
        await Campaigns_Mains_Provider.updateOnMsgCampaignGetMapRawDataArray(data);
        Notifications_Dispatcher.dispatch("MsgCampaignGetMapRawDataArray", { msg: data });
    }
}

export function reqCampaignGetMapTimestamp(campaignId: number, campaignMapId: number): void {
    Networks_Manager.send({
        MsgCampaignGetMapTimestamp : {
            c : {
                campaignId    : campaignId,
                campaignMapId : campaignMapId,
            }, 
        }, 
    });
}
async function _onMsgCampaignGetMapTimestamp(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignGetMapTimestamp"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCampaignGetMapTimestamp(data);
        Notifications_Dispatcher.dispatch("MsgCampaignGetMapTimestamp", { msg: data });
    }
}

export function reqCampaignGetAllMapTimestampArray(campaignId: number): void {
    Networks_Manager.send({
        MsgCampaignGetAllMapTimestampArray : {
            c : {
                campaignId : campaignId,
            }, 
        }, 
    });
}
async function _onMsgCampaignGetAllMapTimestampArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignGetAllMapTimestampArray"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        Campaigns_Mains_Provider.updateOnFailedMsgCampaignGetAllMapTimestampArray(data);
    } else {
        await Campaigns_Mains_Provider.updateOnMsgCampaignGetAllMapTimestampArray(data);
        Notifications_Dispatcher.dispatch("MsgCampaignGetAllMapTimestampArray", { msg: data });
    }
}

export function reqCampaignGetCampaignLeaderboard(campaignId: number): void {
    Networks_Manager.send({
        MsgCampaignGetCampaignLeaderboard : {
            c : {
                campaignId : campaignId,
            }, 
        }, 
    });
}
function _onMsgCampaignGetCampaignLeaderboard(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignGetCampaignLeaderboard"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        Campaigns_Mains_Provider.updateOnFailedMsgCampaignGetCampaignLeaderboard(data);
    } else {
        Campaigns_Mains_Provider.updateOnMsgCampaignGetCampaignLeaderboard(data);
        Notifications_Dispatcher.dispatch("MsgCampaignGetCampaignLeaderboard", { msg: data });
    }
}

export function reqCampaignGetCampaignMapLeaderboard(campaignId: number, campaignMapId: number): void {
    Networks_Manager.send({
        MsgCampaignGetCampaignMapLeaderboard : {
            c : {
                campaignId    : campaignId,
                campaignMapId : campaignMapId,
            }, 
        }, 
    });
}
function _onMsgCampaignGetCampaignMapLeaderboard(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignGetCampaignMapLeaderboard"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        Campaigns_Mains_Provider.updateOnFailedMsgCampaignGetCampaignMapLeaderboard(data);
    } else {
        Campaigns_Mains_Provider.updateOnMsgCampaignGetCampaignMapLeaderboard(data);
        Notifications_Dispatcher.dispatch("MsgCampaignGetCampaignMapLeaderboard", { msg: data });
    }
}

function _onMsgCampaignGetScore(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCampaignGetScore"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        Users_Model.updateOnMsgCampaignGetScore(data);
        Notifications_Dispatcher.dispatch("MsgCampaignGetScore", { msg: data });
    }
}
