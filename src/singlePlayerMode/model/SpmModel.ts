import type {
    Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable,
    DecodedSpmWarSaveSlotData,
} from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import { getCampaignMapRawData } from "../../campaigns/mains/Provider.ts";
import { show } from "../../FloatText.ts";
import { ForcedFogCode } from "../../fogMaps/Constants.ts";
import { SingleRankedWar, SinglePlayerWar } from "../../gameConfig/GcWar.ts";
import { decompress } from "../../helpers/Gzip.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getNormalMapId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText } from "../../lang/Utils.ts";
import { StoreSpmWarSaveSlotFullData, StoreSpmReplayData } from "../../localData/Storage.ts";
import { getMapNameInCurrentLanguage, getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { addEventListeners } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCampaignSaveWarS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCampaignSaveWar/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSfw/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetAllWarSaveSlotTimestamps/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetRankList/S.ts";
import type { SpmRankInfoForRule } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetRankList/SpmRankInfoForRule.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetReplayData/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullData/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullDataArray/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmSaveScwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveScw/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSfwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSfw/S.ts";
import type { S as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSrwS } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSrw/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgSpmValidateSrwS,
} from "../../proto/schema/CommonProto/NetMessage/MsgSpmValidateSrw/S.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import {
    reqSpmGetAllWarSaveSlotTimestamps,
    reqSpmGetWarSaveSlotFullData,
    reqSpmGetWarSaveSlotFullDataArray,
    reqSpmGetRankList,
    reqSpmGetReplayData,
} from "./SpmProxy.ts";
import { TurnIndex, PhaseCode } from "../../turns/Constants.ts";
import { getSelfUserId } from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { create } from "../../warRules/utils/Instance.ts";

type Undefinable<T>                 = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

// 多人模式战局当前数据（需要把后端warID改为数据库自增，下同）
// 多人模式半路回放

const _allSlotTimestampsAccessor    = new CachedDataAccessor<null, Map<number, number>>({
    reqData : () => reqSpmGetAllWarSaveSlotTimestamps(),
});
/** 只用于保证收到过消息 */
const _dataArrayAccessor            = new CachedDataAccessor<null, boolean>({
    reqData : () => { /** nothing to do */},
});
const _slotFullDataAccessor         = new CachedDataAccessor<number, DecodedSpmWarSaveSlotData>({
    reqData : (slotIndex) => reqSpmGetWarSaveSlotFullData(slotIndex),
});

export function init(): void {
    addEventListeners([
        { type: TypeId.MsgSpmValidateSrw,   callback: _onNotifyMsgSpmValidateSrw, },
    ], null);
}

function _onNotifyMsgSpmValidateSrw(e: Event): void {
    const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmValidateSrwS;
    const status    = data.getStatus();
    if (status === SingleRankedWar.ValidateStatus.ConfigVersionNotLatest) {
        show(getText(TextType.A0278));
    } else if (status === SingleRankedWar.ValidateStatus.ScoreNotHighest) {
        show(getText(TextType.A0279));
    } else if (status === SingleRankedWar.ValidateStatus.ScoreTooLow) {
        show(getText(TextType.A0281));
    } else {
        show(getText(TextType.A0280));
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for save slots.
////////////////////////////////////////////////////////////////////////////////////////////////////
export function getAllSlotTimestamps(): Promise<Undefinable<Map<number, number>>> {
    return _allSlotTimestampsAccessor.getData(null);
}
function setAllSlotTimestamps(dict: Map<number, number>): void {
    _allSlotTimestampsAccessor.setData(null, dict);
}

export async function getSlotFullData(slotIndex: number): Promise<Undefinable<DecodedSpmWarSaveSlotData>> {
    const timestamp = (await getAllSlotTimestamps())?.get(slotIndex);
    if (timestamp == null) {
        return null;
    }

    const userId = getSelfUserId();
    if (userId != null) {
        const cachedData = await StoreSpmWarSaveSlotFullData.getData(userId, slotIndex);
        if (cachedData != null) {
            if ((cachedData.extraData.getTimestamp() ?? 0) === timestamp) {
                return cachedData;
            }
            return _slotFullDataAccessor.getData(slotIndex, true);
        }
    }

    return _slotFullDataAccessor.getData(slotIndex);
}
async function setSlotFullData(slotIndex: number, fullData: DecodedSpmWarSaveSlotData | null): Promise<void> {
    _slotFullDataAccessor.setData(slotIndex, fullData);

    const userId = getSelfUserId();
    if (userId != null) {
        await StoreSpmWarSaveSlotFullData.setData(userId, slotIndex, fullData);
    }
}

export async function updateOnMsgSpmGetAllWarSaveSlotTimestamps(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS): Promise<void> {
    const selfUserId            = getSelfUserId();
    const existingDataDict      = selfUserId == null ? null : await StoreSpmWarSaveSlotFullData.getAllDataDictForKey1(selfUserId);
    const infoArray             = data.getInfoArray();
    const neededSlotIndexSet    = new Set<number>();
    const resultDict            = new Map<number, number>();
    for (const info of infoArray) {
        const slotIndex = info.getSlotIndex() ?? 0;
        const timestamp = info.getTimestamp() ?? 0;
        resultDict.set(slotIndex, timestamp);

        if (existingDataDict != null) {
            if ((!existingDataDict.has(slotIndex))                                          ||
                ((existingDataDict.get(slotIndex)?.extraData.getTimestamp() ?? 0) !== timestamp)
            ) {
                neededSlotIndexSet.add(slotIndex);
            }
        }
    }

    reqSpmGetWarSaveSlotFullDataArray([...neededSlotIndexSet]);
    await _dataArrayAccessor.getData(null);

    setAllSlotTimestamps(resultDict);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgSpmGetAllWarSaveSlotTimestamps(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS): void {
    _allSlotTimestampsAccessor.updateOnRequestFailed(null);
}

export async function updateOnMsgSpmGetWarSaveSlotFullDataArray(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataArrayS): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const d of data.getSlotDataArray()) {
        const slotIndex = d.getSlotIndex() ?? 0;
        promiseArray.push(setSlotFullData(slotIndex, {
            slotIndex   : slotIndex,
            warData     : SerialWar.decode(decompress(getExisted(d.getCompressedWarData()))),
            extraData   : SpmWarSaveSlotExtraData.decode(getExisted(d.getEncodedExtraData())),
        }));
    }
    await Promise.all(promiseArray);

    _dataArrayAccessor.setData(null, true);
}

export function updateOnMsgSpmGetWarSaveSlotFullData(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS): Promise<void> {
    const slotIndex = data.getSlotIndex() ?? 0;
    const slotData  = data.getSlotData();
    if (slotData == null) {
        return setSlotFullData(slotIndex, null);
    } else {
        return setSlotFullData(slotIndex, {
            slotIndex   : slotIndex,
            warData     : SerialWar.decode(decompress(getExisted(slotData.getCompressedWarData()))),
            extraData   : SpmWarSaveSlotExtraData.decode(getExisted(slotData.getEncodedExtraData())),
        });
    }
}
export function updateOnFailedMsgSpmGetWarSaveSlotFullData(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS): void {
    const slotIndex = data.getSlotIndex();
    if (slotIndex != null) {
        _slotFullDataAccessor.updateOnRequestFailed(slotIndex);
    }
}

export function updateOnMsgSpmCreateScw(data: ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwS): Promise<void> {
    return updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, getExisted(data.getExtraData()), getExisted(data.getWarData()));
}
export async function updateOnMsgSpmCreateSfw(data: ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS): Promise<void> {
    await updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, getExisted(data.getExtraData()), getExisted(data.getWarData()));

    // PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
    //     content : Lang.getText(LangTextType.A0107),
    //     callback: () => {
    //         FlowManager.gotoSinglePlayerWar({
    //             slotIndex       : Helpers.getExisted(data.slotIndex),
    //             slotExtraData   : Helpers.getExisted(data.extraData),
    //             warData         : Helpers.getExisted(data.warData),
    //         });
    //     },
    // });
}
export function updateOnMsgSpmCreateSrw(data: ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwS): Promise<void> {
    return updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, getExisted(data.getExtraData()), getExisted(data.getWarData()));
}
export function updateOnMsgCampaignCreateWar(data: S): Promise<void> {
    return updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, getExisted(data.getSlotExtraData()), getExisted(data.getWarData()));
}
export function updateOnMsgSpmSaveScw(data: ProtoSchemaCommonProtoNetMessageMsgSpmSaveScwS): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        getExisted(data.getSlotExtraData()),
        SerialWar.decode(decompress(getExisted(data.getCompressedWarData())))
    );
}
export function updateOnMsgSpmSaveSfw(data: ProtoSchemaCommonProtoNetMessageMsgSpmSaveSfwS): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        getExisted(data.getSlotExtraData()),
        SerialWar.decode(decompress(getExisted(data.getCompressedWarData())))
    );
}
export function updateOnMsgSpmSaveSrw(data: ProtoSchemaCommonProtoNetMessageMsgSpmSaveSrwS): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        getExisted(data.getSlotExtraData()),
        SerialWar.decode(decompress(getExisted(data.getCompressedWarData())))
    );
}
export function updateOnMsgCampaignSaveWar(data: ProtoSchemaCommonProtoNetMessageMsgCampaignSaveWarS): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        getExisted(data.getSlotExtraData()),
        SerialWar.decode(decompress(getExisted(data.getCompressedWarData())))
    );
}
export async function updateOnMsgSpmDeleteWarSaveSlot(slotIndex: number): Promise<void> {
    (await getAllSlotTimestamps())?.delete(slotIndex);
    await setSlotFullData(slotIndex, null);
}

async function updateTimestampAndSlotFullData(slotIndex: number, slotExtraData: SpmWarSaveSlotExtraData, warData: SerialWar): Promise<void> {
    (await getAllSlotTimestamps())?.set(slotIndex, slotExtraData.getTimestamp() ?? 0);
    await setSlotFullData(slotIndex, {
        slotIndex       : slotIndex,
        extraData       : slotExtraData,
        warData         : warData,
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function checkIsEmpty(slotIndex: number): Promise<boolean> {
    return await getSlotFullData(slotIndex) == null;
}
export async function getEmptySlotIndexArray(): Promise<number[]> {
    const promiseArray: Promise<boolean>[] = [];
    for (let slotIndex = 0; slotIndex < SinglePlayerWar.MaxSaveSlotCount; ++slotIndex) {
        promiseArray.push(checkIsEmpty(slotIndex));
    }

    const emptyResultArray      = await Promise.all(promiseArray);
    const emptySlotIndexArray   : number[] = [];
    for (let slotIndex = 0; slotIndex < SinglePlayerWar.MaxSaveSlotCount; ++slotIndex) {
        if (emptyResultArray[slotIndex]) {
            emptySlotIndexArray.push(slotIndex);
        }
    }

    return emptySlotIndexArray;
}
export async function getAvailableSlotIndex(): Promise<number> {
    return (await getEmptySlotIndexArray())[0] ?? 0;
}

export async function getSlotName(slotIndex: number): Promise<string> {
    const slotData = await getSlotFullData(slotIndex);
    if (slotData == null) {
        return `----`;
    }

    const slotExtraData = slotData.extraData;
    const slotComment   = slotExtraData.getSlotComment();
    if (slotComment) {
        return slotComment;
    }

    const mpwWarId = slotExtraData.getMpwWarId();
    if (mpwWarId != null) {
        return `${getText(TextType.B0226)}: ${mpwWarId}`;
    }

    const warData       = slotData.warData;
    const normalMapId   = getNormalMapId(warData);
    if (normalMapId != null) {
        return (await getMapNameInCurrentLanguage(normalMapId)) || UndefinedError;
    }

    const settingsForCaw = warData.getSettingsForCaw();
    if (settingsForCaw != null) {
        const mapRawData = await getCampaignMapRawData(settingsForCaw.getCampaignId() ?? 0, settingsForCaw.getCampaignMapId() ?? 0);
        return getLanguageText({ textArray: mapRawData?.getMapNameArray() }) ?? UndefinedError;
    }

    return `(${getText(TextType.B0321)})`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for rank list.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _rankDataGetter = new CachedDataAccessor<number, SpmRankInfoForRule[]>({
    reqData : (normalMapId: number) => reqSpmGetRankList(normalMapId),
});

export function getRankData(normalMapId: number): Promise<Undefinable<SpmRankInfoForRule[]>> {
    return _rankDataGetter.getData(normalMapId);
}

export function updateOnMsgSpmGetRankList(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListS): void {
    _rankDataGetter.setData(getExisted(data.getNormalMapId()), data.getInfoArray());
}

export async function getRankIndex(normalMapId: number, ruleId: number, score: number): Promise<number | null> {
    const rankDataArray = (await getRankData(normalMapId))?.find(v => v.getRuleId() === ruleId)?.getInfoArray().concat().sort((v1, v2) => getExisted(v2.getScore()) - getExisted(v1.getScore()));
    if (rankDataArray == null) {
        return null;
    }

    const index = rankDataArray.findIndex(v => v.getScore() === score);
    return index < 0 ? null : index + 1;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for replay data.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _replayDataAccessor = new CachedDataAccessor<number, SerialWar>({
    reqData : (rankId: number) => reqSpmGetReplayData(rankId),
});

export async function getReplayData(rankId: number): Promise<Undefinable<SerialWar>> {
    return (await StoreSpmReplayData.getData(rankId)) ?? _replayDataAccessor.getData(rankId);
}
function setReplayData(rankId: number, data: SerialWar | null): Promise<void> {
    _replayDataAccessor.setData(rankId, data);
    return StoreSpmReplayData.setData(rankId, data);
}
async function decodeAndReviseReplayData(encodedWar: AuxiliaryTypesAuxiliaryTypesUndefinable<Uint8Array>): Promise<SerialWar | null> {
    if (encodedWar == null) {
        return null;
    }

    const warData               = SerialWar.decode(encodedWar);
    const settingsForCommon     = getExisted(warData.getSettingsForCommon());
    const srcInstanceWarRule    = settingsForCommon.getInstanceWarRule();
    if (srcInstanceWarRule == null) {
        return null;
    }

    const mapRawData = await getRawData(getExisted(warData.getSettingsForSrw()?.getNormalMapId()));
    if (mapRawData == null) {
        return null;
    }

    const templateWarRuleId = srcInstanceWarRule.getTemplateWarRuleId();
    if (templateWarRuleId == null) {
        return null;
    }

    const templateWarRule = mapRawData.getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId);
    if (templateWarRule == null) {
        return null;
    }

    settingsForCommon.setInstanceWarRule(create({
        templateWarRule             : templateWarRule,
        warEventFullData            : mapRawData.getWarEventFullData(),
        allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
        taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
    }));

    if (!warData.checkHasField()) {
        warData.createIfNotExistsField().loadJson({
            fogMap  : {
                forceFogCode    : ForcedFogCode.None,
                mapsFromPath    : [],
            },
        });
    }

    if (!warData.checkHasTurnManager()) {
        warData.createIfNotExistsTurnManager().loadJson({
            turnIndex       : TurnIndex.FirstIndex,
            turnPhaseCode   : PhaseCode.WaitBeginTurn,
            playerIndex     : PlayerIndex.Neutral,
            enterTurnTime   : 0,
        });
    }

    warData.createIfNotExistsWarEventManager();

    // for (const playerData of warData.playerManager?.players ?? []) {
    //     playerData.fund                 ??= 0;
    //     playerData.hasVotedForDraw      ??= false;
    //     playerData.aliveState           ??= Types.PlayerAliveState.Alive;
    //     playerData.restTimeToBoot       ??= 0;
    //     playerData.coIsDestroyedInTurn  ??= false;
    //     playerData.coUsingSkillType     ??= Types.CoSkillType.Passive;
    // }

    return warData;
}

export async function updateOnMsgSpmGetReplayData(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS): Promise<void> {
    await setReplayData(data.getRankId() ?? 0, await decodeAndReviseReplayData(data.getEncodedWar()));
}
export function updateOnFailedMsgSpmGetReplayData(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS): void {
    const rankId = data.getRankId();
    if (rankId != null) {
        _replayDataAccessor.updateOnRequestFailed(rankId);
    }
}
