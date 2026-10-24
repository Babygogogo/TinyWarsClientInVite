import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import * as CampaignsManagementsGateway from "./Gateway.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmCreateCampaignS from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaign/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgCmGetAllCampaignIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgCmGetDesigningCampaignIdArray/S.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

const _allCampaignIdArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => CampaignsManagementsGateway.reqCmGetAllCampaignIdArray(),
});
const _designingCampaignIdArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => CampaignsManagementsGateway.reqCmGetDesigningCampaignIdArray(),
});

export function getAllCampaignIdArray(): Promise<Undefinable<number[]>> {
    return _allCampaignIdArrayAccessor.getData(null);
}
function setAllCampaignIdArray(campaignIdArray: number[]): void {
    _allCampaignIdArrayAccessor.setData(null, campaignIdArray.concat());
}

export function getDesigningCampaignIdArray(): Promise<Undefinable<number[]>> {
    return _designingCampaignIdArrayAccessor.getData(null);
}
function setDesigningCampaignIdArray(campaignIdArray: number[]): void {
    _designingCampaignIdArrayAccessor.setData(null, campaignIdArray.concat());
}

export async function updateOnMsgCmCreateCampaign(data: ProtoSchemaCommonProtoNetMessageMsgCmCreateCampaignS.S): Promise<void> {
    const campaignId        = data.getCampaignId() ?? 0;
    const campaignIdArray   = await getAllCampaignIdArray();
    if ((campaignIdArray) && (campaignIdArray.indexOf(campaignId) < 0)) {
        campaignIdArray.push(campaignId);
    }
}

export function updateOnMsgCmGetAllCampaignIdArray(data: ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS.S): void {
    setAllCampaignIdArray(data.getCampaignIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgCmGetAllCampaignIdArray(data: ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS.S): void {
    _allCampaignIdArrayAccessor.updateOnRequestFailed(null);
}

export function updateOnMsgCmGetDesigningCampaignIdArray(data: ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS.S): void {
    setDesigningCampaignIdArray(data.getCampaignIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgCmGetDesigningCampaignIdArray(data: ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS.S): void {
    _designingCampaignIdArrayAccessor.updateOnRequestFailed(null);
}
