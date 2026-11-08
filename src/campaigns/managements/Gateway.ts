import {
    Helpers_Misc,
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Campaigns_Managements_Provider,
    Campaigns_Mains_Provider,
    type Egret_Egret,
} from "../../internal.ts";
import type { MapExtraTextJson } from "../../proto/schema/CommonProto/Map/MapExtraText.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";

export function init(): void {
    Networks_Manager.addListeners([
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmCreateCampaign,                 callback : _onMsgCmCreateCampaign },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmCreateCampaignMap,              callback : _onMsgCmCreateCampaignMap },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmGetAllCampaignIdArray,          callback : _onMsgCmGetAllCampaignIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmGetDesigningCampaignIdArray,    callback : _onMsgCmGetDesigningCampaignIdArray },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmSetCampaignDesc,                callback : _onMsgCmSetCampaignDesc },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmSetCampaignName,                callback : _onMsgCmSetCampaignName },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmSetCampaignEnabled,             callback : _onMsgCmSetCampaignEnabled },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmSetCampaignMapEnabled,          callback : _onMsgCmSetCampaignMapEnabled },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmSetCampaignMapRawData,          callback : _onMsgCmSetCampaignMapRawData },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmSetCampaignMapExtraText,        callback : _onMsgCmSetCampaignMapExtraText },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmSetCampaignMapName,             callback : _onMsgCmSetCampaignMapName },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmSetCampaignMapWarEventAction,   callback : _onMsgCmSetCampaignMapWarEventAction },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmUpdateCampaignDesigners,        callback : _onMsgCmUpdateCampaignDesigners },
        { msgCode : Networks_MessageCodes.MessageCodes.MsgCmSetExtraLink,                   callback : _onMsgCmSetExtraLink },
    ]);
}

export function reqCmCreateCampaign(): void {
    Networks_Manager.send({
        MsgCmCreateCampaign : { c : {} },
    });
}
async function _onMsgCmCreateCampaign(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmCreateCampaign"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Managements_Provider.updateOnMsgCmCreateCampaign(data);
        Notifications_Dispatcher.dispatch("MsgCmCreateCampaign", { msg: data });
    }
}

export function reqCmCreateCampaignMap(campaignId: number): void {
    Networks_Manager.send({
        MsgCmCreateCampaignMap : {
            c : {
                campaignId : campaignId,
            }, 
        },
    });
}
async function _onMsgCmCreateCampaignMap(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmCreateCampaignMap"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmCreateCampaignMap(data);
        Notifications_Dispatcher.dispatch("MsgCmCreateCampaignMap", { msg: data });
    }
}

export function reqCmGetAllCampaignIdArray(): void {
    Networks_Manager.send({
        MsgCmGetAllCampaignIdArray : { c : {} },
    });
}
function _onMsgCmGetAllCampaignIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmGetAllCampaignIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        Campaigns_Managements_Provider.updateOnFailedMsgCmGetAllCampaignIdArray(data);
    } else {
        Campaigns_Managements_Provider.updateOnMsgCmGetAllCampaignIdArray(data);
        Notifications_Dispatcher.dispatch("MsgCmGetAllCampaignIdArray", { msg: data });
    }
}

export function reqCmGetDesigningCampaignIdArray(): void {
    Networks_Manager.send({
        MsgCmGetDesigningCampaignIdArray : { c : {} },
    });
}
function _onMsgCmGetDesigningCampaignIdArray(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmGetDesigningCampaignIdArray"]>): void {
    const data = Helpers_Misc.getExisted(e.data);
    if (data.getErrorCode()) {
        Campaigns_Managements_Provider.updateOnFailedMsgCmGetDesigningCampaignIdArray(data);
    } else {
        Campaigns_Managements_Provider.updateOnMsgCmGetDesigningCampaignIdArray(data);
        Notifications_Dispatcher.dispatch("MsgCmGetDesigningCampaignIdArray", { msg: data });
    }
}

export function reqCmSetCampaignDesc(campaignId: number, descArray: LanguageText[]): void {
    Networks_Manager.send({
        MsgCmSetCampaignDesc : {
            c : {
                campaignId : campaignId,
                descArray  : descArray.map(v => v.toJson()),
            }, 
        },
    });
}
async function _onMsgCmSetCampaignDesc(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmSetCampaignDesc"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignDesc(data);
        Notifications_Dispatcher.dispatch("MsgCmSetCampaignDesc", { msg: data });
    }
}

export function reqCmSetCampaignName(campaignId: number, nameArray: LanguageText[]): void {
    Networks_Manager.send({
        MsgCmSetCampaignName : {
            c : {
                campaignId : campaignId,
                nameArray  : nameArray.map(v => v.toJson()),
            }, 
        },
    });
}
async function _onMsgCmSetCampaignName(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmSetCampaignName"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignName(data);
        Notifications_Dispatcher.dispatch("MsgCmSetCampaignName", { msg: data });
    }
}

export function reqCmSetCampaignEnabled(campaignId: number, isEnabled: boolean): void {
    Networks_Manager.send({
        MsgCmSetCampaignEnabled : {
            c : {
                campaignId : campaignId,
                isEnabled  : isEnabled,
            }, 
        },
    });
}
async function _onMsgCmSetCampaignEnabled(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmSetCampaignEnabled"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignEnabled(data);
        Notifications_Dispatcher.dispatch("MsgCmSetCampaignEnabled", { msg: data });
    }
}

export function reqCmSetCampaignMapEnabled(campaignId: number, campaignMapId: number, isEnabled: boolean): void {
    Networks_Manager.send({
        MsgCmSetCampaignMapEnabled : {
            c : {
                campaignId    : campaignId,
                campaignMapId : campaignMapId,
                isEnabled     : isEnabled,
            }, 
        },
    });
}
async function _onMsgCmSetCampaignMapEnabled(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmSetCampaignMapEnabled"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapEnabled(data);
        Notifications_Dispatcher.dispatch("MsgCmSetCampaignMapEnabled", { msg: data });
    }
}

export function reqCmSetCampaignMapRawData(mapRawData: MapRawData): void {
    Networks_Manager.send({
        MsgCmSetCampaignMapRawData : {
            c : {
                mapRawData : mapRawData.toJson(),
            }, 
        },
    });
}
async function _onMsgCmSetCampaignMapRawData(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmSetCampaignMapRawData"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapRawData(data);
        Notifications_Dispatcher.dispatch("MsgCmSetCampaignMapRawData", { msg: data });
    }
}

export function reqCmSetCampaignMapExtraText(campaignId: number, campaignMapId: number, mapExtraText: MapExtraTextJson): void {
    Networks_Manager.send({
        MsgCmSetCampaignMapExtraText : {
            c : {
                campaignId    : campaignId,
                campaignMapId : campaignMapId,
                mapExtraText  : mapExtraText,
            }, 
        },
    });
}
async function _onMsgCmSetCampaignMapExtraText(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmSetCampaignMapExtraText"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapExtraText(data);
        Notifications_Dispatcher.dispatch("MsgCmSetCampaignMapExtraText", { msg: data });
    }
}

export function reqCmSetCampaignMapName(campaignId: number, campaignMapId: number, mapNameArray: LanguageText[]): void {
    Networks_Manager.send({
        MsgCmSetCampaignMapName : {
            c : {
                campaignId    : campaignId,
                campaignMapId : campaignMapId,
                nameArray     : mapNameArray.map(v => v.toJson()),
            }, 
        },
    });
}
async function _onMsgCmSetCampaignMapName(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmSetCampaignMapName"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapName(data);
        Notifications_Dispatcher.dispatch("MsgCmSetCampaignMapName", { msg: data });
    }
}

export function reqCmSetCampaignMapWarEventAction(campaignId: number, campaignMapId: number, action: WarEventAction): void {
    Networks_Manager.send({
        MsgCmSetCampaignMapWarEventAction : {
            c : {
                campaignId     : campaignId,
                campaignMapId  : campaignMapId,
                warEventAction : action.toJson(),
            }, 
        }, 
    });
}
async function _onMsgCmSetCampaignMapWarEventAction(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmSetCampaignMapWarEventAction"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapWarEventAction(data);
        Notifications_Dispatcher.dispatch("MsgCmSetCampaignMapWarEventAction", { msg: data });
    }
}

export function reqCmUpdateCampaignDesigners(campaignId: number, addUserIdArray: number[], deleteUserIdArray: number[]): void {
    Networks_Manager.send({
        MsgCmUpdateCampaignDesigners : {
            c : {
                campaignId        : campaignId,
                addUserIdArray    : addUserIdArray,
                deleteUserIdArray : deleteUserIdArray,
            }, 
        },
    });
}
async function _onMsgCmUpdateCampaignDesigners(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmUpdateCampaignDesigners"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmUpdateCampaignDesigners(data);
        Notifications_Dispatcher.dispatch("MsgCmUpdateCampaignDesigners", { msg: data });
    }
}

export function reqCmSetExtraLink(campaignId: number, extraLink: string): void {
    Networks_Manager.send({
        MsgCmSetExtraLink : {
            c : {
                campaignId : campaignId,
                extraLink  : extraLink,
            }, 
        },
    });
}
async function _onMsgCmSetExtraLink(e: Egret_Egret.Event<Networks_Manager.ResponseMapping["MsgCmSetExtraLink"]>): Promise<void> {
    const data = Helpers_Misc.getExisted(e.data);
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetExtraLink(data);
        Notifications_Dispatcher.dispatch("MsgCmSetExtraLink", { msg: data });
    }
}
