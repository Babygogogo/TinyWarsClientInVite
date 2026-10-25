import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import { reqCmGetAllCampaignIdArray, reqCmGetDesigningCampaignIdArray } from "./Gateway.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaign/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmGetAllCampaignIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCmGetDesigningCampaignIdArray/S.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

const _allCampaignIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqCmGetAllCampaignIdArray(),
});
const _designingCampaignIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqCmGetDesigningCampaignIdArray(),
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

export async function updateOnMsgCmCreateCampaign(data: S): Promise<void> {
    const campaignId        = data.getCampaignId() ?? 0;
    const campaignIdArray   = await getAllCampaignIdArray();
    if ((campaignIdArray) && (campaignIdArray.indexOf(campaignId) < 0)) {
        campaignIdArray.push(campaignId);
    }
}

export function updateOnMsgCmGetAllCampaignIdArray(data: ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS): void {
    setAllCampaignIdArray(data.getCampaignIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgCmGetAllCampaignIdArray(data: ProtoSchemaCommonProtoNetMessageMsgCmGetAllCampaignIdArrayS): void {
    _allCampaignIdArrayAccessor.updateOnRequestFailed(null);
}

export function updateOnMsgCmGetDesigningCampaignIdArray(data: ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS): void {
    setDesigningCampaignIdArray(data.getCampaignIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgCmGetDesigningCampaignIdArray(data: ProtoSchemaCommonProtoNetMessageMsgCmGetDesigningCampaignIdArrayS): void {
    _designingCampaignIdArrayAccessor.updateOnRequestFailed(null);
}
