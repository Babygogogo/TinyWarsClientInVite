import * as CampaignsMainsProvider from "../mains/Provider.ts";
import * as CampaignsManagementsProvider from "./Provider.ts";
import * as NetworksManager from "../../networks/Manager.ts";
import * as NetworksMessageCodes from "../../networks/MessageCodes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapExtraText from "../../proto/schema/CommonProto/Map/MapExtraText.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmCreateCampaignS from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaign/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmCreateCampaignMapS from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaignMap/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgCmGetAllCampaignIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgCmGetDesigningCampaignIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignDescS from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignDesc/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignEnabledS from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignEnabled/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapEnabledS from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapEnabled/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapExtraTextS from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapExtraText/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapNameS from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapName/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapRawDataS from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapRawData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapWarEventActionS from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapWarEventAction/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignNameS from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignName/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmSetExtraLinkS from "../../proto/schema/CommonProto/NetMessage/MsgCmSetExtraLink/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmUpdateCampaignDesignersS from "../../proto/schema/CommonProto/NetMessage/MsgCmUpdateCampaignDesigners/S.ts";
import type * as ProtoSchemaCommonProtoStructureLanguageText from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventAction from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

export function init(): void {
    NetworksManager.addListeners([
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmCreateCampaign,                 callback: _onMsgCmCreateCampaign },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmCreateCampaignMap,              callback: _onMsgCmCreateCampaignMap },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmGetAllCampaignIdArray,          callback: _onMsgCmGetAllCampaignIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmGetDesigningCampaignIdArray,    callback: _onMsgCmGetDesigningCampaignIdArray },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmSetCampaignDesc,                callback: _onMsgCmSetCampaignDesc },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmSetCampaignName,                callback: _onMsgCmSetCampaignName },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmSetCampaignEnabled,             callback: _onMsgCmSetCampaignEnabled },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmSetCampaignMapEnabled,          callback: _onMsgCmSetCampaignMapEnabled },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmSetCampaignMapRawData,          callback: _onMsgCmSetCampaignMapRawData },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmSetCampaignMapExtraText,        callback: _onMsgCmSetCampaignMapExtraText },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmSetCampaignMapName,             callback: _onMsgCmSetCampaignMapName },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmSetCampaignMapWarEventAction,   callback: _onMsgCmSetCampaignMapWarEventAction },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmUpdateCampaignDesigners,        callback: _onMsgCmUpdateCampaignDesigners },
        { msgCode: NetworksMessageCodes.MessageCodes.MsgCmSetExtraLink,                   callback: _onMsgCmSetExtraLink },
    ]);
}

export function reqCmCreateCampaign(): void {
    NetworksManager.send({
        MsgCmCreateCampaign: { c: {} }
    });
}
async function _onMsgCmCreateCampaign(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmCreateCampaignS.S;
    if (!data.getErrorCode()) {
        await CampaignsManagementsProvider.updateOnMsgCmCreateCampaign(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmCreateCampaign, data);
    }
}

export function reqCmCreateCampaignMap(campaignId: number): void {
    NetworksManager.send({
        MsgCmCreateCampaignMap: { c: {
            campaignId  : campaignId,
        } },
    });
}
async function _onMsgCmCreateCampaignMap(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmCreateCampaignMapS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmCreateCampaignMap(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmCreateCampaignMap, data);
    }
}

export function reqCmGetAllCampaignIdArray(): void {
    NetworksManager.send({
        MsgCmGetAllCampaignIdArray: { c: {} }
    });
}
function _onMsgCmGetAllCampaignIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS.S;
    if (data.getErrorCode()) {
        CampaignsManagementsProvider.updateOnFailedMsgCmGetAllCampaignIdArray(data);
    } else {
        CampaignsManagementsProvider.updateOnMsgCmGetAllCampaignIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmGetAllCampaignIdArray, data);
    }
}

export function reqCmGetDesigningCampaignIdArray(): void {
    NetworksManager.send({
        MsgCmGetDesigningCampaignIdArray: { c: {} }
    });
}
function _onMsgCmGetDesigningCampaignIdArray(e: VendorEgretEgret.Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS.S;
    if (data.getErrorCode()) {
        CampaignsManagementsProvider.updateOnFailedMsgCmGetDesigningCampaignIdArray(data);
    } else {
        CampaignsManagementsProvider.updateOnMsgCmGetDesigningCampaignIdArray(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmGetDesigningCampaignIdArray, data);
    }
}

export function reqCmSetCampaignDesc(campaignId: number, descArray: ProtoSchemaCommonProtoStructureLanguageText.LanguageText[]): void {
    NetworksManager.send({
        MsgCmSetCampaignDesc: { c: {
            campaignId  : campaignId,
            descArray   : descArray.map(v => v.toJson()),
        }}
    });
}
async function _onMsgCmSetCampaignDesc(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignDescS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmSetCampaignDesc(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmSetCampaignDesc, data);
    }
}

export function reqCmSetCampaignName(campaignId: number, nameArray: ProtoSchemaCommonProtoStructureLanguageText.LanguageText[]): void {
    NetworksManager.send({
        MsgCmSetCampaignName: { c: {
            campaignId  : campaignId,
            nameArray   : nameArray.map(v => v.toJson()),
        }}
    });
}
async function _onMsgCmSetCampaignName(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignNameS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmSetCampaignName(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmSetCampaignName, data);
    }
}

export function reqCmSetCampaignEnabled(campaignId: number, isEnabled: boolean): void {
    NetworksManager.send({
        MsgCmSetCampaignEnabled: { c: {
            campaignId  : campaignId,
            isEnabled   : isEnabled,
        }}
    });
}
async function _onMsgCmSetCampaignEnabled(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignEnabledS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmSetCampaignEnabled(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmSetCampaignEnabled, data);
    }
}

export function reqCmSetCampaignMapEnabled(campaignId: number, campaignMapId: number, isEnabled: boolean): void {
    NetworksManager.send({
        MsgCmSetCampaignMapEnabled: { c: {
            campaignId      : campaignId,
            campaignMapId   : campaignMapId,
            isEnabled       : isEnabled,
        }}
    });
}
async function _onMsgCmSetCampaignMapEnabled(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapEnabledS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmSetCampaignMapEnabled(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmSetCampaignMapEnabled, data);
    }
}

export function reqCmSetCampaignMapRawData(mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData): void {
    NetworksManager.send({
        MsgCmSetCampaignMapRawData: { c: {
            mapRawData  : mapRawData.toJson(),
        }}
    });
}
async function _onMsgCmSetCampaignMapRawData(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapRawDataS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmSetCampaignMapRawData(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmSetCampaignMapRawData, data);
    }
}

export function reqCmSetCampaignMapExtraText(campaignId: number, campaignMapId: number, mapExtraText: ProtoSchemaCommonProtoMapMapExtraText.MapExtraTextJson): void {
    NetworksManager.send({
        MsgCmSetCampaignMapExtraText: { c: {
            campaignId      : campaignId,
            campaignMapId   : campaignMapId,
            mapExtraText    : mapExtraText,
        }}
    });
}
async function _onMsgCmSetCampaignMapExtraText(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapExtraTextS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmSetCampaignMapExtraText(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmSetCampaignMapExtraText, data);
    }
}

export function reqCmSetCampaignMapName(campaignId: number, campaignMapId: number, mapNameArray: ProtoSchemaCommonProtoStructureLanguageText.LanguageText[]): void {
    NetworksManager.send({
        MsgCmSetCampaignMapName: { c: {
            campaignId      : campaignId,
            campaignMapId   : campaignMapId,
            nameArray       : mapNameArray.map(v => v.toJson()),
        }}
    });
}
async function _onMsgCmSetCampaignMapName(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapNameS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmSetCampaignMapName(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmSetCampaignMapName, data);
    }
}

export function reqCmSetCampaignMapWarEventAction(campaignId: number, campaignMapId: number, action: ProtoSchemaCommonProtoWarEventWarEventAction.WarEventAction): void {
    NetworksManager.send({ MsgCmSetCampaignMapWarEventAction: { c: {
        campaignId      : campaignId,
        campaignMapId   : campaignMapId,
        warEventAction  : action.toJson(),
    } } });
}
async function _onMsgCmSetCampaignMapWarEventAction(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapWarEventActionS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmSetCampaignMapWarEventAction(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmSetCampaignMapWarEventAction, data);
    }
}

export function reqCmUpdateCampaignDesigners(campaignId: number, addUserIdArray: number[], deleteUserIdArray: number[]): void {
    NetworksManager.send({
        MsgCmUpdateCampaignDesigners: { c: {
            campaignId          : campaignId,
            addUserIdArray      : addUserIdArray,
            deleteUserIdArray   : deleteUserIdArray,
        } },
    });
}
async function _onMsgCmUpdateCampaignDesigners(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmUpdateCampaignDesignersS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmUpdateCampaignDesigners(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmUpdateCampaignDesigners, data);
    }
}

export function reqCmSetExtraLink(campaignId: number, extraLink: string): void {
    NetworksManager.send({
        MsgCmSetExtraLink: { c: {
            campaignId  : campaignId,
            extraLink   : extraLink,
        }}
    });
}
async function _onMsgCmSetExtraLink(e: VendorEgretEgret.Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetExtraLinkS.S;
    if (!data.getErrorCode()) {
        await CampaignsMainsProvider.updateOnMsgCmSetExtraLink(data);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MsgCmSetExtraLink, data);
    }
}
