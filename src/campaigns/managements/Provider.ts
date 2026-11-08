import {
    AuxiliaryTypes_CachedDataAccessor,
    Campaigns_Managements_Gateway,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { S as CmCreateCampaignResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaign/S.ts";
import type { S as CmGetAllCampaignIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmGetAllCampaignIdArray/S.ts";
import type { S as CmGetDesigningCampaignIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmGetDesigningCampaignIdArray/S.ts";

const _allCampaignIdArrayAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => Campaigns_Managements_Gateway.reqCmGetAllCampaignIdArray(),
});
const _designingCampaignIdArrayAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => Campaigns_Managements_Gateway.reqCmGetDesigningCampaignIdArray(),
});

export function getAllCampaignIdArray(): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>> {
    return _allCampaignIdArrayAccessor.getData(null);
}
function setAllCampaignIdArray(campaignIdArray: number[]): void {
    _allCampaignIdArrayAccessor.setData(null, campaignIdArray.concat());
}

export function getDesigningCampaignIdArray(): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>> {
    return _designingCampaignIdArrayAccessor.getData(null);
}
function setDesigningCampaignIdArray(campaignIdArray: number[]): void {
    _designingCampaignIdArrayAccessor.setData(null, campaignIdArray.concat());
}

export async function updateOnMsgCmCreateCampaign(data: CmCreateCampaignResponse): Promise<void> {
    const campaignId        = data.getCampaignId() ?? 0;
    const campaignIdArray   = await getAllCampaignIdArray();
    if ((campaignIdArray) && (campaignIdArray.indexOf(campaignId) < 0)) {
        campaignIdArray.push(campaignId);
    }
}

export function updateOnMsgCmGetAllCampaignIdArray(data: CmGetAllCampaignIdArrayResponse): void {
    setAllCampaignIdArray(data.getCampaignIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgCmGetAllCampaignIdArray(data: CmGetAllCampaignIdArrayResponse): void {
    _allCampaignIdArrayAccessor.updateOnRequestFailed(null);
}

export function updateOnMsgCmGetDesigningCampaignIdArray(data: CmGetDesigningCampaignIdArrayResponse): void {
    setDesigningCampaignIdArray(data.getCampaignIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgCmGetDesigningCampaignIdArray(data: CmGetDesigningCampaignIdArrayResponse): void {
    _designingCampaignIdArrayAccessor.updateOnRequestFailed(null);
}
