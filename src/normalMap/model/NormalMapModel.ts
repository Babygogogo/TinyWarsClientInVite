import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import type * as AuxiliaryTypesMapFilter from "../../auxiliaryTypes/MapFilter.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as NormalMapModelNormalMapProxy from "./NormalMapProxy.ts";
import type * as ProtoSchemaCommonProtoMapMapEditorData from "../../proto/schema/CommonProto/Map/MapEditorData.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoMapMapTag from "../../proto/schema/CommonProto/Map/MapTag.ts";
import * as ProtoSchemaCommonProtoMapNormalMapBriefData from "../../proto/schema/CommonProto/Map/NormalMapBriefData.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMapGetRawDataS from "../../proto/schema/CommonProto/NetMessage/MsgMapGetRawData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmAddWarRuleS from "../../proto/schema/CommonProto/NetMessage/MsgMmAddWarRule/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmDeleteWarRuleS from "../../proto/schema/CommonProto/NetMessage/MsgMmDeleteWarRule/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetMapNameS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapName/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetMapTagIdFlagsS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetMapTagIdFlags/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleAvailabilityS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleAvailability/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleFixedTileThemeS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleFixedTileTheme/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleNameS from "../../proto/schema/CommonProto/NetMessage/MsgMmSetWarRuleName/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetAllEnabledBriefDataVersionsS from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetAllEnabledBriefDataVersions/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataS from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataArrayS from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefDataArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataVersionS from "../../proto/schema/CommonProto/NetMessage/MsgNormalMapGetBriefDataVersion/S.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

const _mapTagAccessor   = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, ProtoSchemaCommonProtoMapMapTag.MapTag>({
    reqData : () => NormalMapModelNormalMapProxy.reqMapGetMapTag(),
});
const _reviewingMapsAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, ProtoSchemaCommonProtoMapMapEditorData.MapEditorData[]>({
    reqData         : () => NormalMapModelNormalMapProxy.reqMmGetReviewingMaps(),
    dataExpireTime  : 60,
});
const _enabledNormalMapIdSetAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, Set<number>>({
    reqData : () => NormalMapModelNormalMapProxy.reqNormalMapGetAllEnabledBriefDataVersions(),
});
const _briefDataVersionAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, number>({
    reqData : (normalMapId: number) => NormalMapModelNormalMapProxy.reqNormalMapGetBriefDataVersion(normalMapId),
});
/** 只用于保证收到过消息 */
const _briefDataArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, boolean>({
    reqData : () => { /** nothing to do */ },
});
const _briefDataAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoMapNormalMapBriefData.NormalMapBriefData>({
    reqData : (normalMapId: number) => NormalMapModelNormalMapProxy.reqNormalMapGetBriefData(normalMapId),
});
const _rawDataAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoMapMapRawData.MapRawData>({
    reqData : (normalMapId: number) => NormalMapModelNormalMapProxy.reqGetMapRawData(normalMapId),
});

export function init(): void {
    // nothing to do.
}

export async function getEnabledNormalMapIdSet(): Promise<Set<number>> {
    return HelpersMisc.getExisted(await _enabledNormalMapIdSetAccessor.getData(null));
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

export async function getBriefData(normalMapId: number): Promise<Undefinable<ProtoSchemaCommonProtoMapNormalMapBriefData.NormalMapBriefData>> {
    const dataVersion = await getBriefDataVersion(normalMapId);
    if (dataVersion == null) {
        return null;
    }

    const cachedData = await LocalDataStorage2.StoreNormalMapBriefData.getData(normalMapId);
    if (cachedData != null) {
        if ((cachedData.getDataVersion() ?? 0) === dataVersion) {
            return cachedData;
        }
        return _briefDataAccessor.getData(normalMapId, true);
    }

    return _briefDataAccessor.getData(normalMapId);
}
function setBriefData(normalMapId: number, data: ProtoSchemaCommonProtoMapNormalMapBriefData.NormalMapBriefData | null): Promise<void> {
    _briefDataAccessor.setData(normalMapId, data);
    return LocalDataStorage2.StoreNormalMapBriefData.setData(normalMapId, data);
}

export async function getRawData(normalMapId: number): Promise<Undefinable<ProtoSchemaCommonProtoMapMapRawData.MapRawData>> {
    const mapBriefData = await getBriefData(normalMapId);
    if (mapBriefData == null) {
        return null;
    }

    const cachedData = await LocalDataStorage2.StoreNormalMapRawData.getData(normalMapId);
    if (cachedData != null) {
        if ((cachedData.getModifiedTime() ?? 0) === (mapBriefData.getMapModifiedTime() ?? 0)) {
            return cachedData;
        }
        return _rawDataAccessor.getData(normalMapId, true);
    }

    return _rawDataAccessor.getData(normalMapId);
}
function setRawData(normalMapId: number, mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData | null): Promise<void> {
    _rawDataAccessor.setData(normalMapId, mapRawData);
    return LocalDataStorage2.StoreNormalMapRawData.setData(normalMapId, mapRawData);
}

export async function updateOnMsgNormalMapGetAllEnabledBriefDataVersions(data: ProtoSchemaCommonProtoNetMessageMsgNormalMapGetAllEnabledBriefDataVersionsS.S): Promise<void> {
    const existingDataDict      = await LocalDataStorage2.StoreNormalMapBriefData.getAllDataDict();
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

    NormalMapModelNormalMapProxy.reqNormalMapGetBriefDataArray([...neededNormalMapIdSet]);
    await _briefDataArrayAccessor.getData(null);

    _enabledNormalMapIdSetAccessor.setData(null, new Set(infoArray.map(v => v.getNormalMapId() ?? 0)));
}

export async function updateOnMsgNormalMapGetBriefDataArray(data: ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataArrayS.S): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const encodedData of data.getEncodedBriefDataArray()) {
        const briefData = ProtoSchemaCommonProtoMapNormalMapBriefData.NormalMapBriefData.decode(encodedData);
        promiseArray.push(setBriefData(briefData.getNormalMapExtraData()?.getNormalMapId() ?? 0, briefData));
    }
    await Promise.all(promiseArray);

    _briefDataArrayAccessor.setData(null, true);
}

export async function updateOnMsgNormalMapGetBriefDataVersion(data: ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataVersionS.S): Promise<void> {
    const normalMapId = data.getNormalMapId() ?? 0;
    setBriefDataVersion(normalMapId, data.getDataVersion() ?? 0);

    if (data.getIsEnabled()) {
        (await getEnabledNormalMapIdSet()).add(normalMapId);
    } else {
        (await getEnabledNormalMapIdSet()).delete(normalMapId);
    }
}
export function updateOnFailedMsgNormalMapGetBriefDataVersion(data: ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataVersionS.S): void {
    const normalMapId = data.getNormalMapId();
    if (normalMapId != null) {
        _briefDataVersionAccessor.updateOnRequestFailed(normalMapId);
    }
}

export function updateOnMsgNormalMapGetBriefData(data: ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataS.S): Promise<void> {
    const normalMapId           = data.getNormalMapId() ?? 0;
    const normalMapBriefData    = data.getNormalMapBriefData() ?? null;
    // if (normalMapBriefData?.normalMapExtraData?.isEnabled) {
    //     addEnabledNormalMapId(normalMapId);
    // } else {
    //     deleteEnabledNormalMapId(normalMapId);
    // }

    return setBriefData(normalMapId, normalMapBriefData);
}
export function updateOnFailedMsgNormalMapGetBriefData(data: ProtoSchemaCommonProtoNetMessageMsgNormalMapGetBriefDataS.S): void {
    const normalMapId = data.getNormalMapId();
    if (normalMapId != null) {
        _briefDataAccessor.updateOnRequestFailed(normalMapId);
    }
}

export function updateOnMsgMapGetRawData(data: ProtoSchemaCommonProtoNetMessageMsgMapGetRawDataS.S): Promise<void> {
    return setRawData(data.getNormalMapId() ?? 0, data.getMapRawData() ?? null);
}
export function updateOnFailedMsgMapGetRawData(data: ProtoSchemaCommonProtoNetMessageMsgMapGetRawDataS.S): void {
    const normalMapId = data.getNormalMapId();
    if (normalMapId != null) {
        _rawDataAccessor.updateOnRequestFailed(normalMapId);
    }
}

export async function updateOnMsgMmSetMapName(data: ProtoSchemaCommonProtoNetMessageMsgMmSetMapNameS.S): Promise<void> {
    const normalMapId   = HelpersMisc.getExisted(data.getNormalMapId(), UtilsClientErrorCode.ClientErrorCode.WarMapModel_UpdateOnSetMapName_00);
    const mapNameArray  = HelpersMisc.getExisted(data.getMapNameArray(), UtilsClientErrorCode.ClientErrorCode.WarMapModel_UpdateOnSetMapName_01);
    const mapBriefData  = await getBriefData(normalMapId);
    (mapBriefData) && (mapBriefData.setMapNameArray(mapNameArray));

    const mapRawData = await getRawData(normalMapId);
    (mapRawData) && (mapRawData.setMapNameArray(mapNameArray));
}
export async function updateOnMsgMmAddWarRule(data: ProtoSchemaCommonProtoNetMessageMsgMmAddWarRuleS.S): Promise<void> {
    const normalMapId       = HelpersMisc.getExisted(data.getNormalMapId());
    const templateWarRule   = HelpersMisc.getExisted(data.getTemplateWarRule());
    HelpersMisc.getExisted((await getRawData(normalMapId))?.getTemplateWarRuleArray()).push(templateWarRule);
}
export async function updateOnMsgMmDeleteWarRule(data: ProtoSchemaCommonProtoNetMessageMsgMmDeleteWarRuleS.S): Promise<void> {
    const normalMapId           = HelpersMisc.getExisted(data.getNormalMapId());
    const ruleId                = HelpersMisc.getExisted(data.getRuleId());
    const templateWarRuleArray  = HelpersMisc.getExisted((await getRawData(normalMapId))?.getTemplateWarRuleArray());
    const index                 = templateWarRuleArray.findIndex(v => v.getRuleId() === ruleId);
    (index >= 0) && (templateWarRuleArray.splice(index, 1));
}
export async function updateOnMsgMmSetWarRuleName(data: ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleNameS.S): Promise<void> {
    const ruleId            = data.getRuleId() ?? 0;
    const templateWarRule   = (await getRawData(data.getNormalMapId() ?? 0))?.getTemplateWarRuleArray()?.find(v => (v.getRuleId() ?? 0) === ruleId);
    (templateWarRule) && (templateWarRule.setRuleNameArray(data.getRuleNameArray()));
}
export async function updateOnMsgMmSetWarRuleFixedTileTheme(data: ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleFixedTileThemeS.S): Promise<void> {
    const ruleId            = data.getRuleId() ?? 0;
    const templateWarRule   = (await getRawData(data.getNormalMapId() ?? 0))?.getTemplateWarRuleArray().find(v => (v.getRuleId() ?? 0) === ruleId);
    (templateWarRule) && (templateWarRule.createIfNotExistsWarRuleCommonData().setFixedTileTheme(data.getTileTheme()));
}
export async function updateOnMsgMmSetWarRuleAvailability(data: ProtoSchemaCommonProtoNetMessageMsgMmSetWarRuleAvailabilityS.S): Promise<void> {
    const templateWarRule = HelpersMisc.getExisted((await getRawData(HelpersMisc.getExisted(data.getNormalMapId())))?.getTemplateWarRuleArray()?.find(v => v.getRuleId() === data.getRuleId()));
    templateWarRule.setRuleAvailability(data.getAvailability());
}
export async function updateOnMsgMmSetMapTagIdFlags(data: ProtoSchemaCommonProtoNetMessageMsgMmSetMapTagIdFlagsS.S): Promise<void> {
    HelpersMisc.getExisted(await getRawData(HelpersMisc.getExisted(data.getNormalMapId()))).setMapTagIdFlags(data.getMapTagIdFlags());
}

export async function getMapNameInCurrentLanguage(normalMapId: number): Promise<string | null> {
    const mapBriefData = await getBriefData(normalMapId);
    if (!mapBriefData) {
        return null;
    } else {
        return LangUtils.getLanguageText({ textArray: mapBriefData.getMapNameArray() });
    }
}
export async function getDesignerName(normalMapId: number): Promise<Undefinable<string>> {
    return (await getRawData(normalMapId))?.getDesignerName();
}
export async function getTotalPlayedTimes(normalMapId: number): Promise<number> {
    const mapBriefData  = HelpersMisc.getExisted(await getBriefData(normalMapId));
    let totalTimes      = 0;
    for (const statisticsForRule of mapBriefData.getNormalMapExtraData()?.getMapWarStatistics()?.getStatisticsForRuleArray() ?? []) {
        for (const info of statisticsForRule.getStatisticsForTurnArray()) {
            totalTimes += info.getTotalGames() ?? 0;
        }
    }

    return totalTimes;
}
export async function getAverageRating(normalMapId: number): Promise<number | null> {
    const normalMapBriefData    = await getBriefData(normalMapId);
    const normalMapExtraData    = normalMapBriefData ? normalMapBriefData.getNormalMapExtraData() : null;
    const totalRaters           = normalMapExtraData ? normalMapExtraData.getTotalRaters() ?? 0 : null;
    return totalRaters
        ? ((normalMapExtraData?.getTotalRating() ?? 0) / totalRaters)
        : null;
}
export async function getTotalRatersCount(normalMapId: number): Promise<number | null> {
    const mapBriefData = await getBriefData(normalMapId);
    return mapBriefData ? mapBriefData.getNormalMapExtraData()?.getTotalRaters() ?? 0 : null;
}

export function setMapTag(mapTag: ProtoSchemaCommonProtoMapMapTag.MapTag): void {
    _mapTagAccessor.setData(null, mapTag);
}
export function getMapTag(): Promise<Undefinable<ProtoSchemaCommonProtoMapMapTag.MapTag>> {
    return _mapTagAccessor.getData(null);
}

export async function sortMapArray<T>(dataArray: { normalMapId: number, extraData: T }[], sorter: AuxiliaryTypesAuxiliaryTypes.MapSorter | null): Promise<{ normalMapId: number, extraData: T }[]> {
    if (dataArray.length <= 1) {
        return dataArray.concat();
    }

    const sortType      = sorter?.sortType ?? GameConfigGcMap.SortType.MapName;
    const isAscending   = sorter?.isAscending ?? true;
    if (sortType === GameConfigGcMap.SortType.MapName) {
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

    } else if (sortType === GameConfigGcMap.SortType.NormalMapId) {
        return isAscending
            ? dataArray.concat().sort((v1, v2) => v1.normalMapId - v2.normalMapId)
            : dataArray.concat().sort((v1, v2) => v2.normalMapId - v1.normalMapId);

    } else if (sortType === GameConfigGcMap.SortType.DesignerName) {
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

    } else if (sortType === GameConfigGcMap.SortType.Popularity) {
        const tempArray: { normalMapId: number, extraData: T, num: number }[] = [];
        for (const data of dataArray) {
            tempArray.push({
                normalMapId       : data.normalMapId,
                extraData   : data.extraData,
                num         : (await getTotalPlayedTimes(data.normalMapId)) ?? 0,
            });
        }
        const result = tempArray.sort((v1, v2) => (v1.num - v2.num) || (v1.normalMapId - v2.normalMapId));
        return isAscending ? result : result.reverse();

    } else if (sortType === GameConfigGcMap.SortType.GlobalRating) {
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

    } else if (sortType === GameConfigGcMap.SortType.MyRating) {
        const tempArray: { normalMapId: number, extraData: T, num: number }[] = [];
        for (const data of dataArray) {
            tempArray.push({
                normalMapId       : data.normalMapId,
                extraData   : data.extraData,
                num         : UsersModel.getMapRating(data.normalMapId) ?? 0,
            });
        }
        const result = tempArray.sort((v1, v2) => (v1.num - v2.num) || (v1.normalMapId - v2.normalMapId));
        return isAscending ? result : result.reverse();

    } else if (sortType === GameConfigGcMap.SortType.PlayersCountUnneutral) {
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

    } else if (sortType === GameConfigGcMap.SortType.GridsCount) {
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

export async function checkIsMeetFilter(normalMapId: number, filter: AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesMapFilter.MapFilter>): Promise<boolean> {
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
            const playersCount = mapBriefData.getPlayersCountUnneutral() ?? 0;
            if ((playersCount < playersCountRange[0]) || (playersCount > playersCountRange[1])) {
                return false;
            }
        }
    }

    {
        const minMapWidth = filter.minMapWidth;
        if ((minMapWidth != null) && ((mapBriefData.getMapWidth() ?? 0) < minMapWidth)) {
            return false;
        }
    }

    {
        const maxMapWidth = filter.maxMapWidth;
        if ((maxMapWidth != null) && ((mapBriefData.getMapWidth() ?? 0) > maxMapWidth)) {
            return false;
        }
    }

    {
        const minMapHeight = filter.minMapHeight;
        if ((minMapHeight != null) && ((mapBriefData.getMapHeight() ?? 0) < minMapHeight)) {
            return false;
        }
    }

    {
        const maxMapHeight = filter.maxMapHeight;
        if ((maxMapHeight != null) && ((mapBriefData.getMapHeight() ?? 0) > maxMapHeight)) {
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
            const realMapName = HelpersMisc.getExisted(await getMapNameInCurrentLanguage(normalMapId)).toLocaleLowerCase();
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

export async function getMmReviewingMaps(): Promise<ProtoSchemaCommonProtoMapMapEditorData.MapEditorData[]> {
    if (!UsersModel.getIsSelfMapCommittee()) {
        return [];
    } else {
        return await _reviewingMapsAccessor.getData(null) ?? [];
    }
}
export function updateOnMsgMmGetReviewingMaps(maps: ProtoSchemaCommonProtoMapMapEditorData.MapEditorData[]): void {
    _reviewingMapsAccessor.setData(null, maps);
}

export function checkIsRedForMapManagement(): Promise<boolean> {
    return checkIsRedForMmReviewingMaps();
}
export async function checkIsRedForMmReviewingMaps(): Promise<boolean> {
    return (await getMmReviewingMaps()).length > 0;
}
