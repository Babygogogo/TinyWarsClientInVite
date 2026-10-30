import type {
    Undefinable,
    MapSorter,
} from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import type { MapFilter } from "../../auxiliaryTypes/MapFilter.ts";
import { SortType } from "../../maps/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getLanguageText } from "../../lang/Utils.ts";
import {
    StoreNormalMapBriefData,
    StoreNormalMapRawData,
} from "../../localData/Storage.ts";
import {
    reqMapGetMapTag,
    reqMmGetReviewingMaps,
    reqNormalMapGetAllEnabledBriefDataVersions,
    reqNormalMapGetBriefDataVersion,
    reqNormalMapGetBriefData,
    reqGetMapRawData,
    reqNormalMapGetBriefDataArray,
} from "./NormalMapProxy.ts";
import type { MapEditorData } from "../../proto/schema/CommonProto/Map/MapEditorData.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { MapTag } from "../../proto/schema/CommonProto/Map/MapTag.ts";
import { NormalMapBriefData } from "../../proto/schema/CommonProto/Map/NormalMapBriefData.ts";
import type { S as MapGetRawDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMapGetRawData/S.ts";
import type { S as MmAddWarRuleResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmAddWarRule/S.ts";
import type { S as MmDeleteWarRuleResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmDeleteWarRule/S.ts";
import type { S as MmSetMapNameResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapName/S.ts";
import type { S as MmSetMapTagIdFlagsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapTagIdFlags/S.ts";
import type { S as MmSetWarRuleAvailabilityResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleAvailability/S.ts";
import type { S as MmSetWarRuleFixedTileThemeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleFixedTileTheme/S.ts";
import type { S as MmSetWarRuleNameResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleName/S.ts";
import type { S as NormalMapGetAllEnabledBriefDataVersionsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetAllEnabledBriefDataVersions/S.ts";
import type { S as NormalMapGetBriefDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefData/S.ts";
import type { S as NormalMapGetBriefDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefDataArray/S.ts";
import type { S as NormalMapGetBriefDataVersionResponse } from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefDataVersion/S.ts";
import {
    getMapRating,
    getIsSelfMapCommittee,
} from "../../users/Model.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

const _mapTagAccessor   = new CachedDataAccessor<null, MapTag>({
    reqData : () => reqMapGetMapTag(),
});
const _reviewingMapsAccessor = new CachedDataAccessor<null, MapEditorData[]>({
    reqData         : () => reqMmGetReviewingMaps(),
    dataExpireTime  : 60,
});
const _enabledNormalMapIdSetAccessor = new CachedDataAccessor<null, Set<number>>({
    reqData : () => reqNormalMapGetAllEnabledBriefDataVersions(),
});
const _briefDataVersionAccessor = new CachedDataAccessor<number, number>({
    reqData : (normalMapId: number) => reqNormalMapGetBriefDataVersion(normalMapId),
});
/** 只用于保证收到过消息 */
const _briefDataArrayAccessor = new CachedDataAccessor<null, boolean>({
    reqData : () => { /** nothing to do */ },
});
const _briefDataAccessor = new CachedDataAccessor<number, NormalMapBriefData>({
    reqData : (normalMapId: number) => reqNormalMapGetBriefData(normalMapId),
});
const _rawDataAccessor = new CachedDataAccessor<number, MapRawData>({
    reqData : (normalMapId: number) => reqGetMapRawData(normalMapId),
});

export function init(): void {
    // nothing to do.
}

export async function getEnabledNormalMapIdSet(): Promise<Set<number>> {
    return getExisted(await _enabledNormalMapIdSetAccessor.getData(null));
}
export async function getNormalMapIdArrayForRankedMatch(hasFog: boolean): Promise<number[]> {
    const normalMapIdArray  : number[] = [];
    const promiseArray      : Promise<void>[] = [];
    for (const normalMapId of await getEnabledNormalMapIdSet()) {
        promiseArray.push((async () => {
            const mapBriefData = await getBriefData(normalMapId);
            if ((mapBriefData == null)                                  ||
                (!mapBriefData.getNormalMapExtraData()?.getIsEnabled()) ||
                (!mapBriefData.getRuleAvailability()?.getCanMrw())
            ) {
                return;
            }

            const mapRawData = await getRawData(normalMapId);
            if ((mapRawData != null) &&
                (mapRawData.getTemplateWarRuleArray().some(v => (v.getRuleAvailability()?.getCanMrw()) && (hasFog === !!v.getWarRuleCommonData()?.getHasFogByDefault())))
            ) {
                normalMapIdArray.push(normalMapId);
            }
        })());
    }

    await Promise.all(promiseArray);
    return normalMapIdArray;
}

export async function getBriefDataVersion(normalMapId: number): Promise<Undefinable<number>> {
    await getEnabledNormalMapIdSet();

    return _briefDataVersionAccessor.getData(normalMapId);
}
function setBriefDataVersion(normalMapId: number, dataVersion: number): void {
    _briefDataVersionAccessor.setData(normalMapId, dataVersion);
}

export async function getBriefData(normalMapId: number): Promise<Undefinable<NormalMapBriefData>> {
    const dataVersion = await getBriefDataVersion(normalMapId);
    if (dataVersion == null) {
        return null;
    }

    const cachedData = await StoreNormalMapBriefData.getData(normalMapId);
    if (cachedData != null) {
        if ((cachedData.getDataVersion()) === dataVersion) {
            return cachedData;
        }
        return _briefDataAccessor.getData(normalMapId, true);
    }

    return _briefDataAccessor.getData(normalMapId);
}
function setBriefData(normalMapId: number, data: NormalMapBriefData | null): Promise<void> {
    _briefDataAccessor.setData(normalMapId, data);
    return StoreNormalMapBriefData.setData(normalMapId, data);
}

export async function getRawData(normalMapId: number): Promise<Undefinable<MapRawData>> {
    const mapBriefData = await getBriefData(normalMapId);
    if (mapBriefData == null) {
        return null;
    }

    const cachedData = await StoreNormalMapRawData.getData(normalMapId);
    if (cachedData != null) {
        if ((cachedData.getModifiedTime()) === (mapBriefData.getMapModifiedTime())) {
            return cachedData;
        }
        return _rawDataAccessor.getData(normalMapId, true);
    }

    return _rawDataAccessor.getData(normalMapId);
}
function setRawData(normalMapId: number, mapRawData: MapRawData | null): Promise<void> {
    _rawDataAccessor.setData(normalMapId, mapRawData);
    return StoreNormalMapRawData.setData(normalMapId, mapRawData);
}

export async function updateOnMsgNormalMapGetAllEnabledBriefDataVersions(data: NormalMapGetAllEnabledBriefDataVersionsResponse): Promise<void> {
    const existingDataDict      = await StoreNormalMapBriefData.getAllDataDict();
    const neededNormalMapIdSet  = new Set<number>();
    const infoArray             = data.getInfoArray();
    for (const info of infoArray) {
        const normalMapId   = info.getNormalMapId() ?? 0;
        const dataVersion   = info.getDataVersion() ?? 0;
        setBriefDataVersion(normalMapId, dataVersion);

        if ((!existingDataDict.has(normalMapId))                                     ||
            ((existingDataDict.get(normalMapId)?.getDataVersion() ?? 0) !== dataVersion)
        ) {
            neededNormalMapIdSet.add(normalMapId);
        }
    }

    reqNormalMapGetBriefDataArray([...neededNormalMapIdSet]);
    await _briefDataArrayAccessor.getData(null);

    _enabledNormalMapIdSetAccessor.setData(null, new Set(infoArray.map(v => v.getNormalMapId() ?? 0)));
}

export async function updateOnMsgNormalMapGetBriefDataArray(data: NormalMapGetBriefDataArrayResponse): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const encodedData of data.getEncodedBriefDataArray()) {
        const briefData = NormalMapBriefData.decode(encodedData);
        promiseArray.push(setBriefData(briefData.getNormalMapExtraData()?.getNormalMapId() ?? 0, briefData));
    }
    await Promise.all(promiseArray);

    _briefDataArrayAccessor.setData(null, true);
}

export async function updateOnMsgNormalMapGetBriefDataVersion(data: NormalMapGetBriefDataVersionResponse): Promise<void> {
    const normalMapId = data.getNormalMapId() ?? 0;
    setBriefDataVersion(normalMapId, data.getDataVersion() ?? 0);

    if (data.getIsEnabled()) {
        (await getEnabledNormalMapIdSet()).add(normalMapId);
    } else {
        (await getEnabledNormalMapIdSet()).delete(normalMapId);
    }
}
export function updateOnFailedMsgNormalMapGetBriefDataVersion(data: NormalMapGetBriefDataVersionResponse): void {
    const normalMapId = data.getNormalMapId();
    if (normalMapId != null) {
        _briefDataVersionAccessor.updateOnRequestFailed(normalMapId);
    }
}

export function updateOnMsgNormalMapGetBriefData(data: NormalMapGetBriefDataResponse): Promise<void> {
    const normalMapId           = data.getNormalMapId() ?? 0;
    const normalMapBriefData    = data.getNormalMapBriefData() ?? null;
    // if (normalMapBriefData?.normalMapExtraData?.isEnabled) {
    //     addEnabledNormalMapId(normalMapId);
    // } else {
    //     deleteEnabledNormalMapId(normalMapId);
    // }

    return setBriefData(normalMapId, normalMapBriefData);
}
export function updateOnFailedMsgNormalMapGetBriefData(data: NormalMapGetBriefDataResponse): void {
    const normalMapId = data.getNormalMapId();
    if (normalMapId != null) {
        _briefDataAccessor.updateOnRequestFailed(normalMapId);
    }
}

export function updateOnMsgMapGetRawData(data: MapGetRawDataResponse): Promise<void> {
    return setRawData(data.getNormalMapId() ?? 0, data.getMapRawData() ?? null);
}
export function updateOnFailedMsgMapGetRawData(data: MapGetRawDataResponse): void {
    const normalMapId = data.getNormalMapId();
    if (normalMapId != null) {
        _rawDataAccessor.updateOnRequestFailed(normalMapId);
    }
}

export async function updateOnMsgMmSetMapName(data: MmSetMapNameResponse): Promise<void> {
    const normalMapId   = getExisted(data.getNormalMapId(), ClientErrorCode.WarMapModel_UpdateOnSetMapName_00);
    const mapNameArray  = data.getMapNameArray();
    const mapBriefData  = await getBriefData(normalMapId);
    (mapBriefData) && (mapBriefData.setMapNameArray(mapNameArray));

    const mapRawData = await getRawData(normalMapId);
    (mapRawData) && (mapRawData.setMapNameArray(mapNameArray));
}
export async function updateOnMsgMmAddWarRule(data: MmAddWarRuleResponse): Promise<void> {
    const normalMapId       = getExisted(data.getNormalMapId());
    const templateWarRule   = getExisted(data.getTemplateWarRule());
    getExisted((await getRawData(normalMapId))?.getTemplateWarRuleArray()).push(templateWarRule);
}
export async function updateOnMsgMmDeleteWarRule(data: MmDeleteWarRuleResponse): Promise<void> {
    const normalMapId           = getExisted(data.getNormalMapId());
    const ruleId                = getExisted(data.getRuleId());
    const templateWarRuleArray  = getExisted((await getRawData(normalMapId))?.getTemplateWarRuleArray());
    const index                 = templateWarRuleArray.findIndex(v => v.getRuleId() === ruleId);
    (index >= 0) && (templateWarRuleArray.splice(index, 1));
}
export async function updateOnMsgMmSetWarRuleName(data: MmSetWarRuleNameResponse): Promise<void> {
    const ruleId            = data.getRuleId() ?? 0;
    const templateWarRule   = (await getRawData(data.getNormalMapId() ?? 0))?.getTemplateWarRuleArray()?.find(v => (v.getRuleId()) === ruleId);
    (templateWarRule) && (templateWarRule.setRuleNameArray(data.getRuleNameArray()));
}
export async function updateOnMsgMmSetWarRuleFixedTileTheme(data: MmSetWarRuleFixedTileThemeResponse): Promise<void> {
    const ruleId            = data.getRuleId() ?? 0;
    const templateWarRule   = (await getRawData(data.getNormalMapId() ?? 0))?.getTemplateWarRuleArray().find(v => (v.getRuleId()) === ruleId);
    (templateWarRule) && (templateWarRule.createIfNotExistsWarRuleCommonData().setFixedTileTheme(data.getTileTheme()));
}
export async function updateOnMsgMmSetWarRuleAvailability(data: MmSetWarRuleAvailabilityResponse): Promise<void> {
    const templateWarRule = getExisted((await getRawData(getExisted(data.getNormalMapId())))?.getTemplateWarRuleArray()?.find(v => v.getRuleId() === data.getRuleId()));
    templateWarRule.setRuleAvailability(data.getAvailability());
}
export async function updateOnMsgMmSetMapTagIdFlags(data: MmSetMapTagIdFlagsResponse): Promise<void> {
    getExisted(await getRawData(getExisted(data.getNormalMapId()))).setMapTagIdFlags(data.getMapTagIdFlags());
}

export async function getMapNameInCurrentLanguage(normalMapId: number): Promise<string | null> {
    const mapBriefData = await getBriefData(normalMapId);
    if (!mapBriefData) {
        return null;
    } else {
        return getLanguageText({ textArray: mapBriefData.getMapNameArray() });
    }
}
export async function getDesignerName(normalMapId: number): Promise<Undefinable<string>> {
    return (await getRawData(normalMapId))?.getDesignerName();
}
export async function getTotalPlayedTimes(normalMapId: number): Promise<number> {
    const mapBriefData  = getExisted(await getBriefData(normalMapId));
    let totalTimes      = 0;
    for (const statisticsForRule of mapBriefData.getNormalMapExtraData()?.getMapWarStatistics()?.getStatisticsForRuleArray() ?? []) {
        for (const info of statisticsForRule.getStatisticsForTurnArray()) {
            totalTimes += info.getTotalGames();
        }
    }

    return totalTimes;
}
export async function getAverageRating(normalMapId: number): Promise<number | null> {
    const normalMapBriefData    = await getBriefData(normalMapId);
    const normalMapExtraData    = normalMapBriefData ? normalMapBriefData.getNormalMapExtraData() : null;
    const totalRaters           = normalMapExtraData ? normalMapExtraData.getTotalRaters() : null;
    return totalRaters
        ? ((normalMapExtraData?.getTotalRating() ?? 0) / totalRaters)
        : null;
}
export async function getTotalRatersCount(normalMapId: number): Promise<number | null> {
    const mapBriefData = await getBriefData(normalMapId);
    return mapBriefData ? mapBriefData.getNormalMapExtraData()?.getTotalRaters() ?? 0 : null;
}

export function setMapTag(mapTag: MapTag): void {
    _mapTagAccessor.setData(null, mapTag);
}
export function getMapTag(): Promise<Undefinable<MapTag>> {
    return _mapTagAccessor.getData(null);
}

export async function sortMapArray<T>(dataArray: { normalMapId: number, extraData: T }[], sorter: MapSorter | null): Promise<{ normalMapId: number, extraData: T }[]> {
    if (dataArray.length <= 1) {
        return dataArray.concat();
    }

    const sortType      = sorter?.sortType ?? SortType.MapName;
    const isAscending   = sorter?.isAscending ?? true;
    if (sortType === SortType.MapName) {
        const tempArray: { normalMapId: number, extraData: T, name: string }[] = [];
        for (const data of dataArray) {
            tempArray.push({
                normalMapId       : data.normalMapId,
                extraData   : data.extraData,
                name        : await getMapNameInCurrentLanguage(data.normalMapId) ?? ``,
            });
        }
        const result = tempArray.sort((v1, v2) => (v1.name.localeCompare(v2.name)) || (v1.normalMapId - v2.normalMapId)).map(v => ({ normalMapId: v.normalMapId, extraData: v.extraData }));
        return isAscending ? result : result.reverse();

    } else if (sortType === SortType.NormalMapId) {
        return isAscending
            ? dataArray.concat().sort((v1, v2) => v1.normalMapId - v2.normalMapId)
            : dataArray.concat().sort((v1, v2) => v2.normalMapId - v1.normalMapId);

    } else if (sortType === SortType.DesignerName) {
        const tempArray: { normalMapId: number, extraData: T, name: string }[] = [];
        for (const data of dataArray) {
            tempArray.push({
                normalMapId       : data.normalMapId,
                extraData   : data.extraData,
                name        : (await getBriefData(data.normalMapId))?.getDesignerName()?.toLocaleLowerCase() ?? ``,
            });
        }
        const result = tempArray.sort((v1, v2) => (v1.name.localeCompare(v2.name)) || (v1.normalMapId - v2.normalMapId)).map(v => ({ normalMapId: v.normalMapId, extraData: v.extraData }));
        return isAscending ? result : result.reverse();

    } else if (sortType === SortType.Popularity) {
        const tempArray: { normalMapId: number, extraData: T, num: number }[] = [];
        for (const data of dataArray) {
            tempArray.push({
                normalMapId       : data.normalMapId,
                extraData   : data.extraData,
                num         : (await getTotalPlayedTimes(data.normalMapId)),
            });
        }
        const result = tempArray.sort((v1, v2) => (v1.num - v2.num) || (v1.normalMapId - v2.normalMapId));
        return isAscending ? result : result.reverse();

    } else if (sortType === SortType.GlobalRating) {
        const tempArray: { normalMapId: number, extraData: T, num: number }[] = [];
        for (const data of dataArray) {
            tempArray.push({
                normalMapId       : data.normalMapId,
                extraData   : data.extraData,
                num         : await getAverageRating(data.normalMapId) ?? 0,
            });
        }
        const result = tempArray.sort((v1, v2) => (v1.num - v2.num) || (v1.normalMapId - v2.normalMapId));
        return isAscending ? result : result.reverse();

    } else if (sortType === SortType.MyRating) {
        const tempArray: { normalMapId: number, extraData: T, num: number }[] = [];
        for (const data of dataArray) {
            tempArray.push({
                normalMapId       : data.normalMapId,
                extraData   : data.extraData,
                num         : getMapRating(data.normalMapId) ?? 0,
            });
        }
        const result = tempArray.sort((v1, v2) => (v1.num - v2.num) || (v1.normalMapId - v2.normalMapId));
        return isAscending ? result : result.reverse();

    } else if (sortType === SortType.PlayersCountUnneutral) {
        const tempArray: { normalMapId: number, extraData: T, num: number }[] = [];
        for (const data of dataArray) {
            tempArray.push({
                normalMapId       : data.normalMapId,
                extraData   : data.extraData,
                num         : (await getBriefData(data.normalMapId))?.getPlayersCountUnneutral() ?? 0,
            });
        }
        const result = tempArray.sort((v1, v2) => (v1.num - v2.num) || (v1.normalMapId - v2.normalMapId));
        return isAscending ? result : result.reverse();

    } else if (sortType === SortType.GridsCount) {
        const tempArray: { normalMapId: number, extraData: T, num: number }[] = [];
        for (const data of dataArray) {
            const info = await getBriefData(data.normalMapId);
            tempArray.push({
                normalMapId : data.normalMapId,
                extraData   : data.extraData,
                num         : (info?.getMapWidth() ?? 0) * (info?.getMapHeight() ?? 0),
            });
        }
        const result = tempArray.sort((v1, v2) => (v1.num - v2.num) || (v1.normalMapId - v2.normalMapId));
        return isAscending ? result : result.reverse();

    } else {
        return dataArray.concat();
    }
}

export async function checkIsMeetFilter(normalMapId: number, filter: Undefinable<MapFilter>): Promise<boolean> {
    const mapBriefData = await getBriefData(normalMapId);
    if (mapBriefData == null) {
        return false;
    }
    if (filter == null) {
        return true;
    }

    {
        const filterMapDesigner = filter.mapDesigner?.trim().toLocaleLowerCase();
        if ((filterMapDesigner) && (!mapBriefData.getDesignerName()?.toLocaleLowerCase().includes(filterMapDesigner))) {
            return false;
        }
    }

    {
        const playersCountRange = filter.playersCountRange;
        if (playersCountRange) {
            const playersCount = mapBriefData.getPlayersCountUnneutral();
            if ((playersCount < playersCountRange[0]) || (playersCount > playersCountRange[1])) {
                return false;
            }
        }
    }

    {
        const minMapWidth = filter.minMapWidth;
        if ((minMapWidth != null) && ((mapBriefData.getMapWidth()) < minMapWidth)) {
            return false;
        }
    }

    {
        const maxMapWidth = filter.maxMapWidth;
        if ((maxMapWidth != null) && ((mapBriefData.getMapWidth()) > maxMapWidth)) {
            return false;
        }
    }

    {
        const minMapHeight = filter.minMapHeight;
        if ((minMapHeight != null) && ((mapBriefData.getMapHeight()) < minMapHeight)) {
            return false;
        }
    }

    {
        const maxMapHeight = filter.maxMapHeight;
        if ((maxMapHeight != null) && ((mapBriefData.getMapHeight()) > maxMapHeight)) {
            return false;
        }
    }

    {
        const filterPlayedTimes = filter.playedTimes;
        if ((filterPlayedTimes != null) && (await getTotalPlayedTimes(normalMapId) < filterPlayedTimes)) {
            return false;
        }
    }

    {
        const filterMapName = filter.mapName?.trim().toLocaleLowerCase();
        if (filterMapName) {
            const realMapName = getExisted(await getMapNameInCurrentLanguage(normalMapId)).toLocaleLowerCase();
            if (realMapName.indexOf(filterMapName) < 0) {
                return false;
            }
        }
    }

    {
        const ratingRange = filter.globalRatingRange;
        if (ratingRange) {
            const rating = await getAverageRating(normalMapId);
            if ((rating == null) || (rating < ratingRange[0]) || (rating > ratingRange[1])) {
                return false;
            }
        }
    }

    {
        const filterMapTagIdFlags   = filter.mapTagIdFlags;
        const mapTagIdFlags         = mapBriefData.getMapTagIdFlags();
        if ((filterMapTagIdFlags)                                                                       &&
            ((mapTagIdFlags == null) || ((filterMapTagIdFlags & mapTagIdFlags) !== filterMapTagIdFlags))
        ) {
            return false;
        }
    }

    return true;
}

export async function getMmReviewingMaps(): Promise<MapEditorData[]> {
    if (!getIsSelfMapCommittee()) {
        return [];
    } else {
        return await _reviewingMapsAccessor.getData(null) ?? [];
    }
}
export function updateOnMsgMmGetReviewingMaps(maps: MapEditorData[]): void {
    _reviewingMapsAccessor.setData(null, maps);
}

export function checkIsRedForMapManagement(): Promise<boolean> {
    return checkIsRedForMmReviewingMaps();
}
export async function checkIsRedForMmReviewingMaps(): Promise<boolean> {
    return (await getMmReviewingMaps()).length > 0;
}
