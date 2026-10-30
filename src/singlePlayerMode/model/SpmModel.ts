import {
    Notifications_Dispatcher,
    AuxiliaryTypes_CachedDataAccessor,
    WarRules_Utils_Instance,
    Helpers_Gzip,
    FogMaps_Constants,
    Campaigns_Mains_Provider,
    Helpers_Misc,
    Lang_Utils,
    NormalMap_Model_NormalMapModel,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    Users_Model,
    Turns_Constants,
    Players_Constants,
    SinglePlayerMode_Model_SpmProxy,
    FloatText,
    SinglePlayerWars_Constants,
    LocalData_Storage,
    Lang_Constants,
    Notifications_TypeId,
    SingleRankedWars_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    type Egret_Egret,
} from "../../internal.ts";
import type { S as CampaignCreateWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/S.ts";
import type { S as CampaignSaveWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgCampaignSaveWar/S.ts";
import type { S as SpmCreateScwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/S.ts";
import type { S as SpmCreateSfwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSfw/S.ts";
import type { S as SpmCreateSrwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/S.ts";
import type { S as SpmGetAllWarSaveSlotTimestampsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetAllWarSaveSlotTimestamps/S.ts";
import type { S as SpmGetRankListResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetRankList/S.ts";
import type { SpmRankInfoForRule } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetRankList/SpmRankInfoForRule.ts";
import type { S as SpmGetReplayDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetReplayData/S.ts";
import type { S as SpmGetWarSaveSlotFullDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullData/S.ts";
import type { S as SpmGetWarSaveSlotFullDataArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullDataArray/S.ts";
import type { S as SpmSaveScwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveScw/S.ts";
import type { S as SpmSaveSfwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSfw/S.ts";
import type { S as SpmSaveSrwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSrw/S.ts";
import type { S as SpmValidateSrwResponse } from "../../proto/schema/CommonProto/NetMessage/MsgSpmValidateSrw/S.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

// 多人模式战局当前数据（需要把后端warID改为数据库自增，下同）
// 多人模式半路回放

const _allSlotTimestampsAccessor    = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, Map<number, number>>({
    reqData : () => SinglePlayerMode_Model_SpmProxy.reqSpmGetAllWarSaveSlotTimestamps(),
});
/** 只用于保证收到过消息 */
const _dataArrayAccessor            = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, boolean>({
    reqData : () => { /** nothing to do */},
});
const _slotFullDataAccessor         = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, AuxiliaryTypes_AuxiliaryTypes.DecodedSpmWarSaveSlotData>({
    reqData : (slotIndex) => SinglePlayerMode_Model_SpmProxy.reqSpmGetWarSaveSlotFullData(slotIndex),
});

export function init(): void {
    Notifications_Dispatcher.addEventListeners([
        { type : Notifications_TypeId.TypeId.MsgSpmValidateSrw,   callback : _onNotifyMsgSpmValidateSrw },
    ], null);
}

function _onNotifyMsgSpmValidateSrw(e: Egret_Egret.Event): void {
    const data      = e.data as SpmValidateSrwResponse;
    const status    = data.getStatus();
    if (status === SingleRankedWars_Constants.ValidateStatusId.ConfigVersionNotLatest) {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0278));
    } else if (status === SingleRankedWars_Constants.ValidateStatusId.ScoreNotHighest) {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0279));
    } else if (status === SingleRankedWars_Constants.ValidateStatusId.ScoreTooLow) {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0281));
    } else {
        FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0280));
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for save slots.
////////////////////////////////////////////////////////////////////////////////////////////////////
export function getAllSlotTimestamps(): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<Map<number, number>>> {
    return _allSlotTimestampsAccessor.getData(null);
}
function setAllSlotTimestamps(dict: Map<number, number>): void {
    _allSlotTimestampsAccessor.setData(null, dict);
}

export async function getSlotFullData(slotIndex: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_AuxiliaryTypes.DecodedSpmWarSaveSlotData>> {
    const timestamp = (await getAllSlotTimestamps())?.get(slotIndex);
    if (timestamp == null) {
        return null;
    }

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalData_Storage.StoreSpmWarSaveSlotFullData.getData(userId, slotIndex);
        if (cachedData != null) {
            if ((cachedData.extraData.getTimestamp() ?? 0) === timestamp) {
                return cachedData;
            }
            return _slotFullDataAccessor.getData(slotIndex, true);
        }
    }

    return _slotFullDataAccessor.getData(slotIndex);
}
async function setSlotFullData(slotIndex: number, fullData: AuxiliaryTypes_AuxiliaryTypes.DecodedSpmWarSaveSlotData | null): Promise<void> {
    _slotFullDataAccessor.setData(slotIndex, fullData);

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        await LocalData_Storage.StoreSpmWarSaveSlotFullData.setData(userId, slotIndex, fullData);
    }
}

export async function updateOnMsgSpmGetAllWarSaveSlotTimestamps(data: SpmGetAllWarSaveSlotTimestampsResponse): Promise<void> {
    const selfUserId            = Users_Model.getSelfUserId();
    const existingDataDict      = selfUserId == null ? null : await LocalData_Storage.StoreSpmWarSaveSlotFullData.getAllDataDictForKey1(selfUserId);
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

    SinglePlayerMode_Model_SpmProxy.reqSpmGetWarSaveSlotFullDataArray([...neededSlotIndexSet]);
    await _dataArrayAccessor.getData(null);

    setAllSlotTimestamps(resultDict);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgSpmGetAllWarSaveSlotTimestamps(data: SpmGetAllWarSaveSlotTimestampsResponse): void {
    _allSlotTimestampsAccessor.updateOnRequestFailed(null);
}

export async function updateOnMsgSpmGetWarSaveSlotFullDataArray(data: SpmGetWarSaveSlotFullDataArrayResponse): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const d of data.getSlotDataArray()) {
        const slotIndex = d.getSlotIndex() ?? 0;
        promiseArray.push(setSlotFullData(slotIndex, {
            slotIndex : slotIndex,
            warData   : SerialWar.decode(Helpers_Gzip.decompress(Helpers_Misc.getExisted(d.getCompressedWarData()))),
            extraData : SpmWarSaveSlotExtraData.decode(Helpers_Misc.getExisted(d.getEncodedExtraData())),
        }));
    }
    await Promise.all(promiseArray);

    _dataArrayAccessor.setData(null, true);
}

export function updateOnMsgSpmGetWarSaveSlotFullData(data: SpmGetWarSaveSlotFullDataResponse): Promise<void> {
    const slotIndex = data.getSlotIndex() ?? 0;
    const slotData  = data.getSlotData();
    if (slotData == null) {
        return setSlotFullData(slotIndex, null);
    } else {
        return setSlotFullData(slotIndex, {
            slotIndex : slotIndex,
            warData   : SerialWar.decode(Helpers_Gzip.decompress(Helpers_Misc.getExisted(slotData.getCompressedWarData()))),
            extraData : SpmWarSaveSlotExtraData.decode(Helpers_Misc.getExisted(slotData.getEncodedExtraData())),
        });
    }
}
export function updateOnFailedMsgSpmGetWarSaveSlotFullData(data: SpmGetWarSaveSlotFullDataResponse): void {
    const slotIndex = data.getSlotIndex();
    if (slotIndex != null) {
        _slotFullDataAccessor.updateOnRequestFailed(slotIndex);
    }
}

export function updateOnMsgSpmCreateScw(data: SpmCreateScwResponse): Promise<void> {
    return updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, Helpers_Misc.getExisted(data.getExtraData()), Helpers_Misc.getExisted(data.getWarData()));
}
export async function updateOnMsgSpmCreateSfw(data: SpmCreateSfwResponse): Promise<void> {
    await updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, Helpers_Misc.getExisted(data.getExtraData()), Helpers_Misc.getExisted(data.getWarData()));

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
export function updateOnMsgSpmCreateSrw(data: SpmCreateSrwResponse): Promise<void> {
    return updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, Helpers_Misc.getExisted(data.getExtraData()), Helpers_Misc.getExisted(data.getWarData()));
}
export function updateOnMsgCampaignCreateWar(data: CampaignCreateWarResponse): Promise<void> {
    return updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, Helpers_Misc.getExisted(data.getSlotExtraData()), Helpers_Misc.getExisted(data.getWarData()));
}
export function updateOnMsgSpmSaveScw(data: SpmSaveScwResponse): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        Helpers_Misc.getExisted(data.getSlotExtraData()),
        SerialWar.decode(Helpers_Gzip.decompress(Helpers_Misc.getExisted(data.getCompressedWarData()))),
    );
}
export function updateOnMsgSpmSaveSfw(data: SpmSaveSfwResponse): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        Helpers_Misc.getExisted(data.getSlotExtraData()),
        SerialWar.decode(Helpers_Gzip.decompress(Helpers_Misc.getExisted(data.getCompressedWarData()))),
    );
}
export function updateOnMsgSpmSaveSrw(data: SpmSaveSrwResponse): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        Helpers_Misc.getExisted(data.getSlotExtraData()),
        SerialWar.decode(Helpers_Gzip.decompress(Helpers_Misc.getExisted(data.getCompressedWarData()))),
    );
}
export function updateOnMsgCampaignSaveWar(data: CampaignSaveWarResponse): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        Helpers_Misc.getExisted(data.getSlotExtraData()),
        SerialWar.decode(Helpers_Gzip.decompress(Helpers_Misc.getExisted(data.getCompressedWarData()))),
    );
}
export async function updateOnMsgSpmDeleteWarSaveSlot(slotIndex: number): Promise<void> {
    (await getAllSlotTimestamps())?.delete(slotIndex);
    await setSlotFullData(slotIndex, null);
}

async function updateTimestampAndSlotFullData(slotIndex: number, slotExtraData: SpmWarSaveSlotExtraData, warData: SerialWar): Promise<void> {
    (await getAllSlotTimestamps())?.set(slotIndex, slotExtraData.getTimestamp() ?? 0);
    await setSlotFullData(slotIndex, {
        slotIndex : slotIndex,
        extraData : slotExtraData,
        warData   : warData,
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function checkIsEmpty(slotIndex: number): Promise<boolean> {
    return await getSlotFullData(slotIndex) == null;
}
export async function getEmptySlotIndexArray(): Promise<number[]> {
    const promiseArray: Promise<boolean>[] = [];
    for (let slotIndex = 0; slotIndex < SinglePlayerWars_Constants.Common.MaxSaveSlotCount; ++slotIndex) {
        promiseArray.push(checkIsEmpty(slotIndex));
    }

    const emptyResultArray      = await Promise.all(promiseArray);
    const emptySlotIndexArray   : number[] = [];
    for (let slotIndex = 0; slotIndex < SinglePlayerWars_Constants.Common.MaxSaveSlotCount; ++slotIndex) {
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
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0226)}: ${mpwWarId}`;
    }

    const warData       = slotData.warData;
    const normalMapId   = Helpers_ProtoSchema_WarSerialization_SerialWar.getNormalMapId(warData);
    if (normalMapId != null) {
        return (await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || Lang_Constants.UndefinedError;
    }

    const settingsForCaw = warData.getSettingsForCaw();
    if (settingsForCaw != null) {
        const mapRawData = await Campaigns_Mains_Provider.getCampaignMapRawData(settingsForCaw.getCampaignId(), settingsForCaw.getCampaignMapId());
        return Lang_Utils.getLanguageText({ textArray : mapRawData?.getMapNameArray() }) ?? Lang_Constants.UndefinedError;
    }

    return `(${Lang_Utils.getText(Lang_Constants.TextType.B0321)})`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for rank list.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _rankDataGetter = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, SpmRankInfoForRule[]>({
    reqData : (normalMapId: number) => SinglePlayerMode_Model_SpmProxy.reqSpmGetRankList(normalMapId),
});

export function getRankData(normalMapId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<SpmRankInfoForRule[]>> {
    return _rankDataGetter.getData(normalMapId);
}

export function updateOnMsgSpmGetRankList(data: SpmGetRankListResponse): void {
    _rankDataGetter.setData(Helpers_Misc.getExisted(data.getNormalMapId()), data.getInfoArray());
}

export async function getRankIndex(normalMapId: number, ruleId: number, score: number): Promise<number | null> {
    const rankDataArray = (await getRankData(normalMapId))?.find(v => v.getRuleId() === ruleId)?.getInfoArray().concat().sort((v1, v2) => Helpers_Misc.getExisted(v2.getScore()) - Helpers_Misc.getExisted(v1.getScore()));
    if (rankDataArray == null) {
        return null;
    }

    const index = rankDataArray.findIndex(v => v.getScore() === score);
    return index < 0 ? null : index + 1;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for replay data.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _replayDataAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, SerialWar>({
    reqData : (rankId: number) => SinglePlayerMode_Model_SpmProxy.reqSpmGetReplayData(rankId),
});

export async function getReplayData(rankId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWar>> {
    return (await LocalData_Storage.StoreSpmReplayData.getData(rankId)) ?? _replayDataAccessor.getData(rankId);
}
function setReplayData(rankId: number, data: SerialWar | null): Promise<void> {
    _replayDataAccessor.setData(rankId, data);
    return LocalData_Storage.StoreSpmReplayData.setData(rankId, data);
}
async function decodeAndReviseReplayData(encodedWar: AuxiliaryTypes_AuxiliaryTypes.Undefinable<Uint8Array>): Promise<SerialWar | null> {
    if (encodedWar == null) {
        return null;
    }

    const warData               = SerialWar.decode(encodedWar);
    const settingsForCommon     = Helpers_Misc.getExisted(warData.getSettingsForCommon());
    const srcInstanceWarRule    = settingsForCommon.getInstanceWarRule();
    if (srcInstanceWarRule == null) {
        return null;
    }

    const mapRawData = await NormalMap_Model_NormalMapModel.getRawData(Helpers_Misc.getExisted(warData.getSettingsForSrw()?.getNormalMapId()));
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

    settingsForCommon.setInstanceWarRule(WarRules_Utils_Instance.create({
        templateWarRule           : templateWarRule,
        warEventFullData          : mapRawData.getWarEventFullData(),
        allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
        taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
    }));

    if (!warData.checkHasField()) {
        warData.createIfNotExistsField().loadJson({
            fogMap : {
                forceFogCode : FogMaps_Constants.ForcedFogCode.None,
                mapsFromPath : [],
            },
        });
    }

    if (!warData.checkHasTurnManager()) {
        warData.createIfNotExistsTurnManager().loadJson({
            turnIndex     : Turns_Constants.TurnIndex.FirstIndex,
            turnPhaseCode : Turns_Constants.PhaseCode.WaitBeginTurn,
            playerIndex   : Players_Constants.PlayerIndex.Neutral,
            enterTurnTime : 0,
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

export async function updateOnMsgSpmGetReplayData(data: SpmGetReplayDataResponse): Promise<void> {
    await setReplayData(data.getRankId() ?? 0, await decodeAndReviseReplayData(data.getEncodedWar()));
}
export function updateOnFailedMsgSpmGetReplayData(data: SpmGetReplayDataResponse): void {
    const rankId = data.getRankId();
    if (rankId != null) {
        _replayDataAccessor.updateOnRequestFailed(rankId);
    }
}
