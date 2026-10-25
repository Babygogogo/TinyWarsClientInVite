import type {
    DecodedMapEditorData as AuxiliaryTypesAuxiliaryTypesDecodedMapEditorData,
    Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable,
} from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import { ReviewStatus } from "../../gameConfig/GcMap.ts";
import { SlotConstants } from "../../gameConfig/GcMapEditor.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getMeWarClass } from "../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getCurrentLanguageType, getSecondaryLanguageType, getText } from "../../lang/Utils.ts";
import { StoreMeFullData } from "../../localData/Storage.ts";
import { warn } from "../../Logger.ts";
import type { IMeWar } from "../interface/IMeWar.ts";
import { createDefaultMapRawData, createDefaultTileDataArray } from "./MeHelpers.ts";
import { reqMeGetAllMapDataTimestamps, reqMeGetMapData, reqMeGetMapDataArray } from "./MeProxy.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import type { MapEditorData } from "../../proto/schema/CommonProto/Map/MapEditorData.ts";
import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMeDeleteSlot/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMeGetAllMapDataTimestampsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMeGetAllMapDataTimestamps/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataS } from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapData/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapDataArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataTimestampS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMeGetMapDataTimestamp/S.ts";
import type { GridMarkData as ProtoSchemaCommonProtoStructureGridMarkData } from "../../proto/schema/CommonProto/Structure/GridMarkData.ts";
import { LanguageText } from "../../proto/schema/CommonProto/Structure/LanguageText.ts";
import { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { getSelfUserId, getIsSelfMapCommittee, getSelfNickname } from "../../users/Model.ts";

type DecodedMapEditorData   = AuxiliaryTypesAuxiliaryTypesDecodedMapEditorData;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;
type GridMarkData           = ProtoSchemaCommonProtoStructureGridMarkData;

const _allDataTimestampsAccessor    = new CachedDataAccessor<null, Map<number, number | null>>({
    reqData : () => reqMeGetAllMapDataTimestamps(),
});
/** 只用于保证收到过消息 */
const _dataArrayAccessor            = new CachedDataAccessor<null, boolean>({
    reqData : () => { /** nothing to do */},
});
const _mapEditorDataAccessor        = new CachedDataAccessor<number, DecodedMapEditorData | null>({
    reqData : slotIndex => reqMeGetMapData(slotIndex),
});
let _war                        : IMeWar | null = null;

export function init(): void {
    // nothing to do.
}

export function getAllDataTimestamps(): Promise<Undefinable<Map<number, Undefinable<number>>>> {
    return _allDataTimestampsAccessor.getData(null);
}
function setAllDataTimestamps(dict: Map<number, number>): void {
    _allDataTimestampsAccessor.setData(null, dict);
}

export async function getMapEditorData(slotIndex: number): Promise<Undefinable<DecodedMapEditorData>> {
    const timestamp = (await getAllDataTimestamps())?.get(slotIndex);
    if (timestamp == null) {
        return null;
    }

    const accessor  = _mapEditorDataAccessor;
    const userId    = getSelfUserId();
    if (userId != null) {
        const cachedData = await StoreMeFullData.getData(userId, slotIndex);
        if (cachedData != null) {
            if ((cachedData.dataTimestamp ?? 0) === timestamp) {
                return cachedData;
            }
            return accessor.getData(slotIndex, true);
        }
    }

    // 取巧处理地图删除后重新创建的情况下，地图仍然显示为no data的问题
    return (await accessor.getData(slotIndex)) ?? (await accessor.getData(slotIndex, true));
}
async function setMapEditorData(slotIndex: number, data: DecodedMapEditorData | null): Promise<void> {
    _mapEditorDataAccessor.setData(slotIndex, data);

    const userId = getSelfUserId();
    if (userId != null) {
        await StoreMeFullData.setData(userId, slotIndex, data);
    }
}

export async function updateOnMsgMeGetAllMapDataTimestamps(data: ProtoSchemaCommonProtoNetMessageMsgMeGetAllMapDataTimestampsS): Promise<void> {
    const selfUserId            = getSelfUserId();
    const existingDataDict      = selfUserId == null ? null : await StoreMeFullData.getAllDataDictForKey1(selfUserId);
    const infoArray             = data.getInfoArray();
    const neededSlotIndexSet    = new Set<number>();
    const resultDict            = new Map<number, number>();
    for (const info of infoArray) {
        const slotIndex     = info.getSlotIndex() ?? 0;
        const dataTimestamp = info.getDataTimestamp() ?? 0;
        resultDict.set(slotIndex, dataTimestamp);

        if (existingDataDict != null) {
            if ((!existingDataDict.has(slotIndex))  ||
                ((existingDataDict.get(slotIndex)?.dataTimestamp ?? 0) !== dataTimestamp)
            ) {
                neededSlotIndexSet.add(slotIndex);
            }
        }
    }

    reqMeGetMapDataArray([...neededSlotIndexSet]);
    await _dataArrayAccessor.getData(null);

    setAllDataTimestamps(resultDict);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgMeGetAllMapDataTimestamps(data: ProtoSchemaCommonProtoNetMessageMsgMeGetAllMapDataTimestampsS): void {
    _allDataTimestampsAccessor.updateOnRequestFailed(null);
}

export async function updateOnMsgMeGetMapDataArray(data: ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataArrayS): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const d of data.getDataArray()) {
        promiseArray.push(setMapEditorData(d.getSlotIndex() ?? 0, await convertMapEditorData(d)));
    }
    await Promise.all(promiseArray);

    _dataArrayAccessor.setData(null, true);
}

export async function updateOnMsgMeGetMapDataTimestamp(data: ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataTimestampS): Promise<void> {
    (await getAllDataTimestamps())?.set(data.getSlotIndex() ?? 0, data.getDataTimestamp() ?? null);
}

export async function updateOnMsgMeGetMapData(msg: ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataS): Promise<void> {
    await setMapEditorData(msg.getSlotIndex() ?? 0, await convertMapEditorData(msg.getData() ?? null));
}
export function updateOnFailedMsgMeGetMapData(data: ProtoSchemaCommonProtoNetMessageMsgMeGetMapDataS): void {
    const slotIndex = data.getSlotIndex();
    if (slotIndex != null) {
        _mapEditorDataAccessor.updateOnRequestFailed(slotIndex);
    }
}

export async function updateOnMsgMeDeleteSlot(data: S): Promise<void> {
    const slotIndex = data.getSlotIndex() ?? 0;
    (await getAllDataTimestamps())?.delete(slotIndex);
    return setMapEditorData(slotIndex, null);   // 会导致地图删除再创建时，仍会错误显示no data；正确做法是直接删掉缓存的key，但是担心引起各种异步问题，所以暂时不搞
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function getReviewingMapSlotIndex(): Promise<number | null> {
    const maxSlotsCount = getMaxSlotsCount();
    for (let slotIndex = 0; slotIndex < maxSlotsCount; ++slotIndex) {
        if ((await getMapEditorData(slotIndex))?.reviewStatus === ReviewStatus.Reviewing) {
            return slotIndex;
        }
    }

    return null;
}

export function getMaxSlotsCount(): number {
    return getIsSelfMapCommittee() ? SlotConstants.MaxSlotCountForCommittee : SlotConstants.MaxSlotCountForNormal;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for managing war.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function loadWar({ mapRawData, slotIndex, isReview, srcNormalMapIdForAddEvent, gridMarkData }: {
    mapRawData                  : Undefinable<MapRawData>;
    slotIndex                   : number;
    isReview                    : boolean;
    srcNormalMapIdForAddEvent   : number | null;
    gridMarkData                : Undefinable<GridMarkData>;
}): Promise<IMeWar> {
    if (_war) {
        warn(`MeManager.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const gameConfig    = await getLatestGameConfig();
    _war                = new (getMeWarClass())();
    await _war.initWithMapRawData({
        mapRawData                  : mapRawData ?? await createDefaultMapRawData(slotIndex, gameConfig),
        slotIndex                   : slotIndex,
        gameConfig                  : gameConfig,
        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
        gridMarkData                : gridMarkData,
    });
    _war.setIsMapModified(false);
    _war.setIsReviewingMap(isReview);
    _war.startRunning()
        .startRunningView();

    return _war;
}

export function unloadWar(): void {
    if (_war) {
        _war.stopRunning();
        _war = null;
    }
}

export function getWar(): IMeWar | null {
    return _war;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Helpers.
////////////////////////////////////////////////////////////////////////////////////////////////////
async function convertMapEditorData(data: MapEditorData | null): Promise<DecodedMapEditorData | null> {
    if (data == null) {
        return null;
    }

    const encodedMapRawData         = data.getEncodedMapRawData();
    const reviewStatus              = data.getReviewStatus() ?? ReviewStatus.None;
    const srcNormalMapIdForAddEvent = data.getSrcNormalMapIdForAddEvent() ?? null;
    const slotIndex                 = data.getSlotIndex() ?? 0;
    if (srcNormalMapIdForAddEvent == null) {
        return {
            slotIndex                   : slotIndex,
            reviewStatus                : reviewStatus,
            reviewComment               : data.getReviewComment() ?? null,
            mapRawData                  : await handleDeprecatedData(encodedMapRawData),
            srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
            dataTimestamp               : data.getDataTimestamp() ?? 0,
            gridMarkData                : data.getGridMarkData(),
        };
    } else {
        const srcMapRawData = getExisted(await getRawData(srcNormalMapIdForAddEvent)).clone();
        const mapRawData    = MapRawData.decode(getExisted(encodedMapRawData));
        mapRawData.setDesignerName(srcMapRawData.getDesignerName());
        mapRawData.setDesignerUserId(srcMapRawData.getDesignerUserId());
        mapRawData.setMapExtraText(srcMapRawData.getMapExtraText());
        mapRawData.setMapHeight(srcMapRawData.getMapHeight());
        mapRawData.setNormalMapId(srcMapRawData.getNormalMapId());
        mapRawData.setMapNameArray(srcMapRawData.getMapNameArray());
        mapRawData.setMapTagIdFlags(srcMapRawData.getMapTagIdFlags());
        mapRawData.setMapWidth(srcMapRawData.getMapWidth());
        mapRawData.setModifiedTime(srcMapRawData.getModifiedTime());
        mapRawData.setPlayersCountUnneutral(srcMapRawData.getPlayersCountUnneutral());
        mapRawData.setTileDataArray(srcMapRawData.getTileDataArray());
        mapRawData.setUnitDataArray(srcMapRawData.getUnitDataArray());
        mapRawData.setTileCustomNameArray(srcMapRawData.getTileCustomNameArray());
        mapRawData.setUnitCustomNameArray(srcMapRawData.getUnitCustomNameArray());

        {
            const newRuleArray = srcMapRawData.getTemplateWarRuleArray() ?? [];
            for (const newRule of newRuleArray) {
                newRule.createIfNotExistsRuleAvailability().setCanMcw(true);

                const ruleId        = newRule.getRuleId() ?? 0;
                const existingRule  = mapRawData.getTemplateWarRuleArray().find(v => (v.getRuleId() ?? 0) === ruleId);
                if (existingRule) {
                    newRule.setMapSimpleDialogueIdArray(existingRule.getMapSimpleDialogueIdArray());
                }
            }
            mapRawData.setTemplateWarRuleArray(newRuleArray);
        }

        const srcWarEventFullData   = srcMapRawData.getWarEventFullData() ?? new WarEventFullData();
        const newWarEventFullData   = mapRawData.getWarEventFullData();
        if (newWarEventFullData) {
            {
                const srcEventArray = srcWarEventFullData.getEventArray();
                for (const event of newWarEventFullData.getEventArray()) {
                    if (srcEventArray.every(v => v.getEventId() != event.getEventId())) {
                        srcEventArray.push(event);
                    }
                }
            }
            {
                const srcActionArray = srcWarEventFullData.getActionArray();
                for (const action of newWarEventFullData.getActionArray()) {
                    if (srcActionArray.every(v => v.getWeaCommonData()?.getActionId() != action.getWeaCommonData()?.getActionId())) {
                        srcActionArray.push(action);
                    }
                }
            }
            {
                const srcNodeArray = srcWarEventFullData.getConditionNodeArray();
                for (const node of newWarEventFullData.getConditionNodeArray()) {
                    if (srcNodeArray.every(v => v.getNodeId() != node.getNodeId())) {
                        srcNodeArray.push(node);
                    }
                }
            }
            {
                const srcConditionArray = srcWarEventFullData.getConditionArray();
                for (const condition of newWarEventFullData.getConditionArray()) {
                    if (srcConditionArray.every(v => v.getWecCommonData()?.getConditionId() != condition.getWecCommonData()?.getConditionId())) {
                        srcConditionArray.push(condition);
                    }
                }
            }
        }
        mapRawData.setWarEventFullData(srcWarEventFullData);

        return {
            slotIndex                   : slotIndex,
            reviewStatus                : reviewStatus,
            reviewComment               : data.getReviewComment() ?? null,
            mapRawData                  : mapRawData,
            srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
            dataTimestamp               : data.getDataTimestamp() ?? 0,
            gridMarkData                : data.getGridMarkData(),
        };
    }
}
async function handleDeprecatedData(encodedMapRawData: Undefinable<Uint8Array>): Promise<MapRawData | null> {
    const mapRawData = encodedMapRawData ? MapRawData.decode(encodedMapRawData) : null;
    if (mapRawData == null) {
        return null;
    }

    if ((!mapRawData.getMapWidth()) && (mapRawData.getCampaignMapData())) {
        const mapWidth          = 20;
        const mapHeight         = 15;
        const campaignMapData   = mapRawData.getCampaignMapData();
        const languageType1     = getCurrentLanguageType();
        const languageType2     = getSecondaryLanguageType();
        const gameConfig        = await getLatestGameConfig();

        mapRawData.setDesignerName(mapRawData.getDesignerName() ?? getSelfNickname());
        mapRawData.setDesignerUserId(mapRawData.getDesignerUserId() ?? getSelfUserId());
        mapRawData.setMapWidth(mapRawData.getMapWidth() ?? mapWidth);
        mapRawData.setMapHeight(mapRawData.getMapHeight() ?? mapHeight);
        mapRawData.setPlayersCountUnneutral(mapRawData.getPlayersCountUnneutral() ?? 2);
        mapRawData.setModifiedTime(mapRawData.getModifiedTime() ?? getServerTimestamp());
        mapRawData.setMapNameArray(mapRawData.getMapNameArray() ?? [
            LanguageText.fromJson({
                languageType: languageType1,
                text        : `${getText(TextType.B1135, languageType1)} ${campaignMapData?.getCampaignId() ?? 0}-${campaignMapData?.getCampaignMapId() ?? 0}`,
            }),
            LanguageText.fromJson({
                languageType: languageType2,
                text        : `${getText(TextType.B1135, languageType2)} ${campaignMapData?.getCampaignId() ?? 0}-${campaignMapData?.getCampaignMapId() ?? 0}`,
            }),
        ]);
        mapRawData.setTileDataArray(
            mapRawData.getTileDataArray() ??
            createDefaultTileDataArray(mapWidth, mapHeight, gameConfig.getDefaultTileBaseType(), gameConfig)
        );
        mapRawData.setWarEventFullData(mapRawData.getWarEventFullData() ?? new WarEventFullData());
    }

    return mapRawData;
}
