import {
    updateOnMsgCmCreateCampaignMap,
    updateOnMsgCmSetCampaignDesc,
    updateOnMsgCmSetCampaignName,
    updateOnMsgCmSetCampaignEnabled,
    updateOnMsgCmSetCampaignMapEnabled,
    updateOnMsgCmSetCampaignMapRawData,
    updateOnMsgCmSetCampaignMapExtraText,
    updateOnMsgCmSetCampaignMapName,
    updateOnMsgCmSetCampaignMapWarEventAction,
    updateOnMsgCmUpdateCampaignDesigners,
    updateOnMsgCmSetExtraLink,
} from "../mains/Provider.ts";
import {
    updateOnMsgCmCreateCampaign,
    updateOnFailedMsgCmGetAllCampaignIdArray,
    updateOnMsgCmGetAllCampaignIdArray,
    updateOnFailedMsgCmGetDesigningCampaignIdArray,
    updateOnMsgCmGetDesigningCampaignIdArray,
} from "./Provider.ts";
import { addListeners, send } from "../../networks/Manager.ts";
import { MessageCodes } from "../../networks/MessageCodes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { MapExtraTextJson } from "../../proto/schema/CommonProto/Map/MapExtraText.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaign/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmCreateCampaignMapS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaignMap/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmGetAllCampaignIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmGetDesigningCampaignIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignDescS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignDesc/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignEnabledS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignEnabled/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapEnabledS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapEnabled/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapExtraTextS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapExtraText/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapNameS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapName/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapRawDataS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapRawData/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapWarEventActionS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignMapWarEventAction/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignNameS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmSetCampaignName/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmSetExtraLinkS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmSetExtraLink/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmUpdateCampaignDesignersS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmUpdateCampaignDesigners/S.ts";
import type { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import type { WarEventAction } from "../../proto/schema/CommonProto/WarEvent/WarEventAction.ts";
import type { Event } from "../../vendor/egret/Egret.ts";

export function init(): void {
    addListeners([
        { msgCode: MessageCodes.MsgCmCreateCampaign,                 callback: _onMsgCmCreateCampaign },
        { msgCode: MessageCodes.MsgCmCreateCampaignMap,              callback: _onMsgCmCreateCampaignMap },
        { msgCode: MessageCodes.MsgCmGetAllCampaignIdArray,          callback: _onMsgCmGetAllCampaignIdArray },
        { msgCode: MessageCodes.MsgCmGetDesigningCampaignIdArray,    callback: _onMsgCmGetDesigningCampaignIdArray },
        { msgCode: MessageCodes.MsgCmSetCampaignDesc,                callback: _onMsgCmSetCampaignDesc },
        { msgCode: MessageCodes.MsgCmSetCampaignName,                callback: _onMsgCmSetCampaignName },
        { msgCode: MessageCodes.MsgCmSetCampaignEnabled,             callback: _onMsgCmSetCampaignEnabled },
        { msgCode: MessageCodes.MsgCmSetCampaignMapEnabled,          callback: _onMsgCmSetCampaignMapEnabled },
        { msgCode: MessageCodes.MsgCmSetCampaignMapRawData,          callback: _onMsgCmSetCampaignMapRawData },
        { msgCode: MessageCodes.MsgCmSetCampaignMapExtraText,        callback: _onMsgCmSetCampaignMapExtraText },
        { msgCode: MessageCodes.MsgCmSetCampaignMapName,             callback: _onMsgCmSetCampaignMapName },
        { msgCode: MessageCodes.MsgCmSetCampaignMapWarEventAction,   callback: _onMsgCmSetCampaignMapWarEventAction },
        { msgCode: MessageCodes.MsgCmUpdateCampaignDesigners,        callback: _onMsgCmUpdateCampaignDesigners },
        { msgCode: MessageCodes.MsgCmSetExtraLink,                   callback: _onMsgCmSetExtraLink },
    ]);
}

export function reqCmCreateCampaign(): void {
    send({
        MsgCmCreateCampaign: { c: {} }
    });
}
async function _onMsgCmCreateCampaign(e: Event): Promise<void> {
    const data = e.data as S;
    if (!data.getErrorCode()) {
        await updateOnMsgCmCreateCampaign(data);
        dispatch(TypeId.MsgCmCreateCampaign, data);
    }
}

export function reqCmCreateCampaignMap(campaignId: number): void {
    send({
        MsgCmCreateCampaignMap: { c: {
            campaignId  : campaignId,
        } },
    });
}
async function _onMsgCmCreateCampaignMap(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmCreateCampaignMapS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmCreateCampaignMap(data);
        dispatch(TypeId.MsgCmCreateCampaignMap, data);
    }
}

export function reqCmGetAllCampaignIdArray(): void {
    send({
        MsgCmGetAllCampaignIdArray: { c: {} }
    });
}
function _onMsgCmGetAllCampaignIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS;
    if (data.getErrorCode()) {
        updateOnFailedMsgCmGetAllCampaignIdArray(data);
    } else {
        updateOnMsgCmGetAllCampaignIdArray(data);
        dispatch(TypeId.MsgCmGetAllCampaignIdArray, data);
    }
}

export function reqCmGetDesigningCampaignIdArray(): void {
    send({
        MsgCmGetDesigningCampaignIdArray: { c: {} }
    });
}
function _onMsgCmGetDesigningCampaignIdArray(e: Event): void {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS;
    if (data.getErrorCode()) {
        updateOnFailedMsgCmGetDesigningCampaignIdArray(data);
    } else {
        updateOnMsgCmGetDesigningCampaignIdArray(data);
        dispatch(TypeId.MsgCmGetDesigningCampaignIdArray, data);
    }
}

export function reqCmSetCampaignDesc(campaignId: number, descArray: LanguageText[]): void {
    send({
        MsgCmSetCampaignDesc: { c: {
            campaignId  : campaignId,
            descArray   : descArray.map(v => v.toJson()),
        }}
    });
}
async function _onMsgCmSetCampaignDesc(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignDescS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmSetCampaignDesc(data);
        dispatch(TypeId.MsgCmSetCampaignDesc, data);
    }
}

export function reqCmSetCampaignName(campaignId: number, nameArray: LanguageText[]): void {
    send({
        MsgCmSetCampaignName: { c: {
            campaignId  : campaignId,
            nameArray   : nameArray.map(v => v.toJson()),
        }}
    });
}
async function _onMsgCmSetCampaignName(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignNameS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmSetCampaignName(data);
        dispatch(TypeId.MsgCmSetCampaignName, data);
    }
}

export function reqCmSetCampaignEnabled(campaignId: number, isEnabled: boolean): void {
    send({
        MsgCmSetCampaignEnabled: { c: {
            campaignId  : campaignId,
            isEnabled   : isEnabled,
        }}
    });
}
async function _onMsgCmSetCampaignEnabled(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignEnabledS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmSetCampaignEnabled(data);
        dispatch(TypeId.MsgCmSetCampaignEnabled, data);
    }
}

export function reqCmSetCampaignMapEnabled(campaignId: number, campaignMapId: number, isEnabled: boolean): void {
    send({
        MsgCmSetCampaignMapEnabled: { c: {
            campaignId      : campaignId,
            campaignMapId   : campaignMapId,
            isEnabled       : isEnabled,
        }}
    });
}
async function _onMsgCmSetCampaignMapEnabled(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapEnabledS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmSetCampaignMapEnabled(data);
        dispatch(TypeId.MsgCmSetCampaignMapEnabled, data);
    }
}

export function reqCmSetCampaignMapRawData(mapRawData: MapRawData): void {
    send({
        MsgCmSetCampaignMapRawData: { c: {
            mapRawData  : mapRawData.toJson(),
        }}
    });
}
async function _onMsgCmSetCampaignMapRawData(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapRawDataS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmSetCampaignMapRawData(data);
        dispatch(TypeId.MsgCmSetCampaignMapRawData, data);
    }
}

export function reqCmSetCampaignMapExtraText(campaignId: number, campaignMapId: number, mapExtraText: MapExtraTextJson): void {
    send({
        MsgCmSetCampaignMapExtraText: { c: {
            campaignId      : campaignId,
            campaignMapId   : campaignMapId,
            mapExtraText    : mapExtraText,
        }}
    });
}
async function _onMsgCmSetCampaignMapExtraText(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapExtraTextS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmSetCampaignMapExtraText(data);
        dispatch(TypeId.MsgCmSetCampaignMapExtraText, data);
    }
}

export function reqCmSetCampaignMapName(campaignId: number, campaignMapId: number, mapNameArray: LanguageText[]): void {
    send({
        MsgCmSetCampaignMapName: { c: {
            campaignId      : campaignId,
            campaignMapId   : campaignMapId,
            nameArray       : mapNameArray.map(v => v.toJson()),
        }}
    });
}
async function _onMsgCmSetCampaignMapName(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapNameS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmSetCampaignMapName(data);
        dispatch(TypeId.MsgCmSetCampaignMapName, data);
    }
}

export function reqCmSetCampaignMapWarEventAction(campaignId: number, campaignMapId: number, action: WarEventAction): void {
    send({ MsgCmSetCampaignMapWarEventAction: { c: {
        campaignId      : campaignId,
        campaignMapId   : campaignMapId,
        warEventAction  : action.toJson(),
    } } });
}
async function _onMsgCmSetCampaignMapWarEventAction(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetCampaignMapWarEventActionS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmSetCampaignMapWarEventAction(data);
        dispatch(TypeId.MsgCmSetCampaignMapWarEventAction, data);
    }
}

export function reqCmUpdateCampaignDesigners(campaignId: number, addUserIdArray: number[], deleteUserIdArray: number[]): void {
    send({
        MsgCmUpdateCampaignDesigners: { c: {
            campaignId          : campaignId,
            addUserIdArray      : addUserIdArray,
            deleteUserIdArray   : deleteUserIdArray,
        } },
    });
}
async function _onMsgCmUpdateCampaignDesigners(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmUpdateCampaignDesignersS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmUpdateCampaignDesigners(data);
        dispatch(TypeId.MsgCmUpdateCampaignDesigners, data);
    }
}

export function reqCmSetExtraLink(campaignId: number, extraLink: string): void {
    send({
        MsgCmSetExtraLink: { c: {
            campaignId  : campaignId,
            extraLink   : extraLink,
        }}
    });
}
async function _onMsgCmSetExtraLink(e: Event): Promise<void> {
    const data = e.data as ProtoSchemaCommonProtoNetMessageMsgCmSetExtraLinkS;
    if (!data.getErrorCode()) {
        await updateOnMsgCmSetExtraLink(data);
        dispatch(TypeId.MsgCmSetExtraLink, data);
    }
}
