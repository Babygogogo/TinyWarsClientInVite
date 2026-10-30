import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import {
    reqCampaignGetCampaignInfo,
    reqCampaignGetEnabledCampaignIdArray,
    reqCampaignGetCampaignLeaderboard,
    reqCampaignGetAllMapTimestampArray,
    reqCampaignGetMapRawDataArray,
    reqCampaignGetCampaignMapLeaderboard,
    reqCampaignGetMapRawData,
} from "./Gateway.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import { StoreCampaignMapRawData } from "../../localData/Storage.ts";
import type { CampaignInfo } from "../../proto/schema/CommonProto/Campaign/CampaignInfo.ts";
import type { SingleData as LeaderboardLbCampaignSingleData } from "../../proto/schema/CommonProto/Leaderboard/LbCampaign/SingleData.ts";
import type { SingleData as LeaderboardLbCampaignMapSingleData } from "../../proto/schema/CommonProto/Leaderboard/LbCampaignMap/SingleData.ts";
import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { S as CampaignGetAllMapTimestampArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetAllMapTimestampArray/S.ts";
import type { S as CampaignGetCampaignInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetCampaignInfo/S.ts";
import type { S as CampaignGetCampaignLeaderboardResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetCampaignLeaderboard/S.ts";
import type { S as CampaignGetCampaignMapLeaderboardResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetCampaignMapLeaderboard/S.ts";
import type { S as CampaignGetEnabledCampaignIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetEnabledCampaignIdArray/S.ts";
import type { S as CampaignGetMapRawDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetMapRawData/S.ts";
import type { S as CampaignGetMapRawDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetMapRawDataArray/S.ts";
import type { S as CampaignGetMapTimestampResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignGetMapTimestamp/S.ts";
import type { S as CmCreateCampaignMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCmCreateCampaignMap/S.ts";
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
import { getSelfUserId } from "../../users/Model.ts";

const _campaignInfoAccessor = new CachedDataAccessor<number, CampaignInfo>({
    reqData : (campaignId: number) => reqCampaignGetCampaignInfo(campaignId),
});
const _enabledCampaignIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqCampaignGetEnabledCampaignIdArray(),
});
const _campaignLeaderboardAccessor = new CachedDataAccessor<number, LeaderboardLbCampaignSingleData[]>({
    reqData : (campaignId: number) => reqCampaignGetCampaignLeaderboard(campaignId),
});
const _campaignMapLeaderboardAccessorArray = [
    createCampaignMapLeaderboardAccessor(0),
];
const _campaignMapTimestampDictAccessor = new CachedDataAccessor<number, Map<number, Undefinable<number>>>({
    reqData : (campaignId: number) => reqCampaignGetAllMapTimestampArray(campaignId),
});
/** 只用于保证收到过消息 */
const _campaignMapRawDataArrayAccessor  = new CachedDataAccessor<number, boolean>({
    reqData : () => { /** nothing to do */},
});
const _campaignMapRawDataAccessorArray = [
    createCampaignMapRawDataAccessor(0),
];

function setCampaignInfo(campaignId: number, campaignInfo: Undefinable<CampaignInfo>): void {
    _campaignInfoAccessor.setData(campaignId, campaignInfo);
}
export function getCampaignInfo(campaignId: number): Promise<Undefinable<CampaignInfo>> {
    return _campaignInfoAccessor.getData(campaignId);
}

function setEnabledCampaignIdArray(campaignIdArray: number[]): void {
    _enabledCampaignIdArrayAccessor.setData(null, campaignIdArray.concat().sort((v1, v2) => v1 - v2));
}
export function getEnabledCampaignIdArray(): Promise<Undefinable<number[]>> {
    return _enabledCampaignIdArrayAccessor.getData(null);
}

function setCampaignLeaderboard(campaignId: number, dataArray: Undefinable<LeaderboardLbCampaignSingleData[]>): void {
    _campaignLeaderboardAccessor.setData(campaignId, dataArray);
}
export function getCampaignLeaderboard(campaignId: number): Promise<Undefinable<LeaderboardLbCampaignSingleData[]>> {
    return _campaignLeaderboardAccessor.getData(campaignId);
}

export function getCampaignMapLeaderboard(campaignId: number, campaignMapId: number): Promise<Undefinable<LeaderboardLbCampaignMapSingleData[]>> {
    return getCampaignMapLeaderboardAccessor(campaignId).getData(campaignMapId);
}
function setCampaignMapLeaderboard(campaignId: number, campaignMapId: number, dataArray: LeaderboardLbCampaignMapSingleData[]): void {
    getCampaignMapLeaderboardAccessor(campaignId).setData(campaignMapId, dataArray);
}

export function getAllMapTimestampDict(campaignId: number): Promise<Undefinable<Map<number, Undefinable<number>>>> {
    return _campaignMapTimestampDictAccessor.getData(campaignId);
}
function setAllMapTimestampDict(campaignId: number, dict: Map<number, Undefinable<number>>): void {
    _campaignMapTimestampDictAccessor.setData(campaignId, dict);
}

export async function getCampaignMapRawData(campaignId: number, campaignMapId: number): Promise<Undefinable<MapRawData>> {
    const timestamp = (await getAllMapTimestampDict(campaignId))?.get(campaignMapId);
    if (timestamp == null) {
        return null;
    }

    const cachedData = await StoreCampaignMapRawData.getData(campaignId, campaignMapId);
    if (cachedData != null) {
        if ((cachedData.getModifiedTime()) === timestamp) {
            return cachedData;
        }
        return getCampaignMapRawDataAccessor(campaignId).getData(campaignMapId, true);
    }

    return getCampaignMapRawDataAccessor(campaignId).getData(campaignMapId);
}
function setCampaignMapRawData(campaignId: number, campaignMapId: number, mapRawData: MapRawData): Promise<void> {
    getCampaignMapRawDataAccessor(campaignId).setData(campaignMapId, mapRawData);

    return StoreCampaignMapRawData.setData(campaignId, campaignMapId, mapRawData);
}

export async function checkIsSelfDesigner(campaignId: number): Promise<boolean> {
    const userId = getSelfUserId();
    if (userId == null) {
        return false;
    } else {
        return !!((await getCampaignInfo(campaignId))?.getDesignerUserIdArray().includes(userId));
    }
}

export async function updateOnMsgCampaignGetAllMapTimestampArray(data: CampaignGetAllMapTimestampArrayResponse): Promise<void> {
    const campaignId            = data.getCampaignId() ?? 0;
    const existingDataDict      = await StoreCampaignMapRawData.getAllDataDictForKey1(campaignId);
    const infoArray             = data.getInfoArray();
    const neededSlotIndexSet    = new Set<number>();
    const resultDict            = new Map<number, number>();
    for (const info of infoArray) {
        const campaignMapId = info.getCampaignMapId() ?? 0;
        const timestamp     = info.getTimestamp() ?? 0;
        resultDict.set(campaignMapId, timestamp);

        if (existingDataDict != null) {
            if ((!existingDataDict.has(campaignMapId))                                      ||
                ((existingDataDict.get(campaignMapId)?.getModifiedTime() ?? 0) !== timestamp)
            ) {
                neededSlotIndexSet.add(campaignMapId);
            }
        }
    }

    reqCampaignGetMapRawDataArray(campaignId, [...neededSlotIndexSet]);
    await _campaignMapRawDataArrayAccessor.getData(campaignId);

    setAllMapTimestampDict(campaignId, resultDict);
}
export function updateOnFailedMsgCampaignGetAllMapTimestampArray(data: CampaignGetAllMapTimestampArrayResponse): void {
    const campaignId = data.getCampaignId();
    if (campaignId != null) {
        _campaignMapRawDataArrayAccessor.updateOnRequestFailed(campaignId);
    }
}

export async function updateOnMsgCampaignGetMapRawDataArray(data: CampaignGetMapRawDataArrayResponse): Promise<void> {
    const campaignId    = data.getCampaignId() ?? 0;
    const promiseArray  : Promise<void>[] = [];
    for (const d of data.getMapRawDataArray()) {
        promiseArray.push(setCampaignMapRawData(campaignId, d.getCampaignMapData()?.getCampaignMapId() ?? 0, d));
    }
    await Promise.all(promiseArray);

    _campaignMapRawDataArrayAccessor.setData(campaignId, true);
}

export async function updateOnMsgCampaignGetMapTimestamp(data: CampaignGetMapTimestampResponse): Promise<void> {
    (await getAllMapTimestampDict(data.getCampaignId() ?? 0))?.set(data.getCampaignMapId() ?? 0, data.getTimestamp() ?? null);
}

export async function updateOnMsgCmCreateCampaignMap(data: CmCreateCampaignMapResponse): Promise<void> {
    const campaignInfo = await getCampaignInfo(data.getCampaignId() ?? 0);
    if (campaignInfo) {
        const campaignMapId         = data.getCampaignMapId() ?? 0;
        const allCampaignMapIdArray = campaignInfo.getAllCampaignMapIdArray();
        if (allCampaignMapIdArray.indexOf(campaignMapId) < 0) {
            allCampaignMapIdArray.push(campaignMapId);
        }

        campaignInfo.setNextCampaignMapId(Math.max(campaignInfo.getNextCampaignMapId(), campaignMapId + 1));
    }
}

export function updateOnMsgCampaignGetCampaignInfo(data: CampaignGetCampaignInfoResponse): void {
    setCampaignInfo(data.getCampaignId() ?? 0, data.getCampaignInfo() ?? null);
}
export function updateOnFailedMsgCampaignGetCampaignInfo(data: CampaignGetCampaignInfoResponse): void {
    _campaignInfoAccessor.updateOnRequestFailed(data.getCampaignId() ?? 0);
}

export function updateOnMsgCampaignGetMapRawData(data: CampaignGetMapRawDataResponse): Promise<void> {
    return setCampaignMapRawData(data.getCampaignId() ?? 0, data.getCampaignMapId() ?? 0, data.getMapRawData() ?? new MapRawData());
}
export function updateOnFailedMsgCampaignGetMapRawData(data: CampaignGetMapRawDataResponse): void {
    getCampaignMapRawDataAccessor(data.getCampaignId() ?? 0).updateOnRequestFailed(data.getCampaignMapId() ?? 0);
}

export function updateOnMsgCampaignGetCampaignLeaderboard(data: CampaignGetCampaignLeaderboardResponse): void {
    setCampaignLeaderboard(data.getCampaignId() ?? 0, data.getDataArray());
}
export function updateOnFailedMsgCampaignGetCampaignLeaderboard(data: CampaignGetCampaignLeaderboardResponse): void {
    _campaignLeaderboardAccessor.updateOnRequestFailed(data.getCampaignId() ?? 0);
}

export function updateOnMsgCampaignGetCampaignMapLeaderboard(data: CampaignGetCampaignMapLeaderboardResponse): void {
    setCampaignMapLeaderboard(data.getCampaignId() ?? 0, data.getCampaignMapId() ?? 0, data.getDataArray());
}
export function updateOnFailedMsgCampaignGetCampaignMapLeaderboard(data: CampaignGetCampaignMapLeaderboardResponse): void {
    getCampaignMapLeaderboardAccessor(data.getCampaignId() ?? 0).updateOnRequestFailed(data.getCampaignMapId() ?? 0);
}

export function updateOnMsgCampaignGetEnabledCampaignIdArray(data: CampaignGetEnabledCampaignIdArrayResponse): void {
    setEnabledCampaignIdArray(data.getCampaignIdArray());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgCampaignGetEnabledCampaignIdArray(data: CampaignGetEnabledCampaignIdArrayResponse): void {
    _enabledCampaignIdArrayAccessor.updateOnRequestFailed(null);
}

export async function updateOnMsgCmSetCampaignDesc(data: CmSetCampaignDescResponse): Promise<void> {
    const info = await getCampaignInfo(data.getCampaignId() ?? 0);
    if (info) {
        info.setDescArray(data.getDescArray().concat());
    }
}

export async function updateOnMsgCmSetCampaignEnabled(data: CmSetCampaignEnabledResponse): Promise<void> {
    const campaignId    = data.getCampaignId() ?? 0;
    const isEnabled     = !!data.getIsEnabled();
    const campaignInfo  = await getCampaignInfo(campaignId);
    if (campaignInfo) {
        campaignInfo.setIsEnabled(isEnabled);
    }

    const campaignIdArray = await getEnabledCampaignIdArray();
    if (campaignIdArray == null) {
        if (isEnabled) {
            setEnabledCampaignIdArray([campaignId]);
        }
    } else {
        if (isEnabled) {
            if (campaignIdArray.indexOf(campaignId) < 0) {
                campaignIdArray.push(campaignId);
                campaignIdArray.sort((v1, v2) => v1 - v2);
            }
        } else {
            deleteElementFromList(campaignIdArray, campaignId);
        }
    }
}

export async function updateOnMsgCmSetCampaignMapEnabled(data: CmSetCampaignMapEnabledResponse): Promise<void> {
    const campaignInfo = await getCampaignInfo(data.getCampaignId() ?? 0);
    if (campaignInfo) {
        const campaignMapId             = data.getCampaignMapId() ?? 0;
        const enabledCampaignMapIdArray = campaignInfo.getEnabledCampaignMapIdArray();
        if (data.getIsEnabled()) {
            if (enabledCampaignMapIdArray.indexOf(campaignMapId) < 0) {
                enabledCampaignMapIdArray.push(campaignMapId);
            }
        } else {
            deleteElementFromList(enabledCampaignMapIdArray, campaignMapId);
        }
    }
}

export async function updateOnMsgCmSetCampaignMapRawData(data: CmSetCampaignMapRawDataResponse): Promise<void> {
    const mapRawData = data.getMapRawData();
    if (mapRawData == null) {
        return;
    }

    const campaignMapData   = mapRawData.getCampaignMapData();
    const campaignId        = campaignMapData?.getCampaignId() ?? 0;
    const campaignMapId     = campaignMapData?.getCampaignMapId() ?? 0;
    const campaignInfo      = await getCampaignInfo(campaignId);
    if (campaignInfo) {
        deleteElementFromList(campaignInfo.getEnabledCampaignMapIdArray(), campaignMapId);
    }

    await setCampaignMapRawData(campaignId, campaignMapId, mapRawData);
}

export async function updateOnMsgCmSetCampaignMapExtraText(data: CmSetCampaignMapExtraTextResponse): Promise<void> {
    const mapRawData = await getCampaignMapRawData(data.getCampaignId() ?? 0, data.getCampaignMapId() ?? 0);
    if (mapRawData) {
        mapRawData.setMapExtraText(data.getMapExtraText());
    }
}

export async function updateOnMsgCmSetCampaignMapName(data: CmSetCampaignMapNameResponse): Promise<void> {
    const mapRawData = await getCampaignMapRawData(data.getCampaignId() ?? 0, data.getCampaignMapId() ?? 0);
    if (mapRawData) {
        mapRawData.setMapNameArray(data.getNameArray());
    }
}

export async function updateOnMsgCmSetCampaignMapWarEventAction(data: CmSetCampaignMapWarEventActionResponse): Promise<void> {
    const action = data.getWarEventAction()?.clone();
    if (action == null) {
        return;
    }

    const mapRawData = await getCampaignMapRawData(data.getCampaignId() ?? 0, data.getCampaignMapId() ?? 0);
    if (mapRawData) {
        const actionArray   = mapRawData.createIfNotExistsWarEventFullData().getActionArray();
        const actionId      = action?.getWeaCommonData()?.getActionId() ?? 0;
        const index         = actionArray.findIndex(v => (v.getWeaCommonData()?.getActionId() ?? 0) == actionId);
        if (index >= 0) {
            actionArray[index] = action;
        } else {
            actionArray.push(action);
        }
    }
}

export async function updateOnMsgCmSetCampaignName(data: CmSetCampaignNameResponse): Promise<void> {
    const info = await getCampaignInfo(data.getCampaignId() ?? 0);
    if (info) {
        info.setNameArray(data.getNameArray().concat());
    }
}

export async function updateOnMsgCmUpdateCampaignDesigners(data: CmUpdateCampaignDesignersResponse): Promise<void> {
    const campaignInfo = await getCampaignInfo(data.getCampaignId() ?? 0);
    if (campaignInfo != null) {
        const userIdSet = new Set(campaignInfo.getDesignerUserIdArray());
        for (const userId of data.getAddUserIdArray()) {
            userIdSet.add(userId);
        }
        for (const userId of data.getDeleteUserIdArray()) {
            userIdSet.delete(userId);
        }
        campaignInfo.setDesignerUserIdArray([...userIdSet]);
    }
}

export async function updateOnMsgCmSetExtraLink(data: CmSetExtraLinkResponse): Promise<void> {
    (await getCampaignInfo(data.getCampaignId() ?? 0))?.setExtraLink(data.getExtraLink());
}

function createCampaignMapLeaderboardAccessor(campaignId: number) {
    return new CachedDataAccessor<number, LeaderboardLbCampaignMapSingleData[]>({
        reqData : campaignMapId => reqCampaignGetCampaignMapLeaderboard(campaignId, campaignMapId),
    });
}
function getCampaignMapLeaderboardAccessor(campaignId: number) {
    return _campaignMapLeaderboardAccessorArray[campaignId] ??= createCampaignMapLeaderboardAccessor(campaignId);
}

function createCampaignMapRawDataAccessor(campaignId: number) {
    return new CachedDataAccessor<number, MapRawData>({
        reqData : campaignMapId => reqCampaignGetMapRawData(campaignId, campaignMapId),
    });
}
function getCampaignMapRawDataAccessor(campaignId: number) {
    return _campaignMapRawDataAccessorArray[campaignId] ??= createCampaignMapRawDataAccessor(campaignId);
}
