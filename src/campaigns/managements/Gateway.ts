import {
    Networks_Manager,
    Notifications_Dispatcher,
    Networks_MessageCodes,
    Notifications_TypeId,
    Campaigns_Managements_Provider,
    Campaigns_Mains_Provider,
    type Egret_Egret,
} from "../../internal.ts";
import type { MapExtraTextJson } from "../../proto/schema/CommonProto/Map/MapExtraText.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { S as CmCreateCampaignResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaign/S.ts";
import type { S as CmCreateCampaignMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaignMap/S.ts";
import type { S as CmGetAllCampaignIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmGetAllCampaignIdArray/S.ts";
import type { S as CmGetDesigningCampaignIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmGetDesigningCampaignIdArray/S.ts";
import type { S as CmSetCampaignDescResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignDesc/S.ts";
import type { S as CmSetCampaignEnabledResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignEnabled/S.ts";
import type { S as CmSetCampaignMapEnabledResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapEnabled/S.ts";
import type { S as CmSetCampaignMapExtraTextResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapExtraText/S.ts";
import type { S as CmSetCampaignMapNameResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapName/S.ts";
import type { S as CmSetCampaignMapRawDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapRawData/S.ts";
import type { S as CmSetCampaignMapWarEventActionResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapWarEventAction/S.ts";
import type { S as CmSetCampaignNameResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignName/S.ts";
import type { S as CmSetExtraLinkResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmSetExtraLink/S.ts";
import type { S as CmUpdateCampaignDesignersResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmUpdateCampaignDesigners/S.ts";
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
async function _onMsgCmCreateCampaign(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmCreateCampaignResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Managements_Provider.updateOnMsgCmCreateCampaign(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmCreateCampaign, data);
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
async function _onMsgCmCreateCampaignMap(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmCreateCampaignMapResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmCreateCampaignMap(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmCreateCampaignMap, data);
    }
}

export function reqCmGetAllCampaignIdArray(): void {
    Networks_Manager.send({
        MsgCmGetAllCampaignIdArray : { c : {} },
    });
}
function _onMsgCmGetAllCampaignIdArray(e: Egret_Egret.Event): void {
    const data = e.data as CmGetAllCampaignIdArrayResponse;
    if (data.getErrorCode()) {
        Campaigns_Managements_Provider.updateOnFailedMsgCmGetAllCampaignIdArray(data);
    } else {
        Campaigns_Managements_Provider.updateOnMsgCmGetAllCampaignIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmGetAllCampaignIdArray, data);
    }
}

export function reqCmGetDesigningCampaignIdArray(): void {
    Networks_Manager.send({
        MsgCmGetDesigningCampaignIdArray : { c : {} },
    });
}
function _onMsgCmGetDesigningCampaignIdArray(e: Egret_Egret.Event): void {
    const data = e.data as CmGetDesigningCampaignIdArrayResponse;
    if (data.getErrorCode()) {
        Campaigns_Managements_Provider.updateOnFailedMsgCmGetDesigningCampaignIdArray(data);
    } else {
        Campaigns_Managements_Provider.updateOnMsgCmGetDesigningCampaignIdArray(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmGetDesigningCampaignIdArray, data);
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
async function _onMsgCmSetCampaignDesc(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmSetCampaignDescResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignDesc(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmSetCampaignDesc, data);
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
async function _onMsgCmSetCampaignName(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmSetCampaignNameResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignName(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmSetCampaignName, data);
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
async function _onMsgCmSetCampaignEnabled(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmSetCampaignEnabledResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignEnabled(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmSetCampaignEnabled, data);
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
async function _onMsgCmSetCampaignMapEnabled(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmSetCampaignMapEnabledResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapEnabled(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmSetCampaignMapEnabled, data);
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
async function _onMsgCmSetCampaignMapRawData(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmSetCampaignMapRawDataResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapRawData(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmSetCampaignMapRawData, data);
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
async function _onMsgCmSetCampaignMapExtraText(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmSetCampaignMapExtraTextResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapExtraText(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmSetCampaignMapExtraText, data);
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
async function _onMsgCmSetCampaignMapName(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmSetCampaignMapNameResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapName(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmSetCampaignMapName, data);
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
async function _onMsgCmSetCampaignMapWarEventAction(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmSetCampaignMapWarEventActionResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetCampaignMapWarEventAction(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmSetCampaignMapWarEventAction, data);
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
async function _onMsgCmUpdateCampaignDesigners(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmUpdateCampaignDesignersResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmUpdateCampaignDesigners(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmUpdateCampaignDesigners, data);
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
async function _onMsgCmSetExtraLink(e: Egret_Egret.Event): Promise<void> {
    const data = e.data as CmSetExtraLinkResponse;
    if (!data.getErrorCode()) {
        await Campaigns_Mains_Provider.updateOnMsgCmSetExtraLink(data);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.MsgCmSetExtraLink, data);
    }
}
