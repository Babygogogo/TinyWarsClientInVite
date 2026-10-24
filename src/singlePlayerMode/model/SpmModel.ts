import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import * as CampaignsMainsProvider from "../../campaigns/mains/Provider.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as FogMapsConstants from "../../fogMaps/Constants.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as HelpersGzip from "../../helpers/Gzip.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignCreateWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCampaignSaveWarS from "../../proto/schema/CommonProto/NetMessage/MsgCampaignSaveWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSfw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetAllWarSaveSlotTimestamps/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetRankList/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListSpmRankInfoForRule from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetRankList/SpmRankInfoForRule.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetReplayData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataArrayS from "../../proto/schema/CommonProto/NetMessage/MsgSpmGetWarSaveSlotFullDataArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmSaveScwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveScw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSfwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSfw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmSaveSrwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmSaveSrw/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgSpmValidateSrwS from "../../proto/schema/CommonProto/NetMessage/MsgSpmValidateSrw/S.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as SinglePlayerModeModelSpmProxy from "./SpmProxy.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarRulesUtilsInstance from "../../warRules/utils/Instance.ts";

type Undefinable<T>                 = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

// 多人模式战局当前数据（需要把后端warID改为数据库自增，下同）
// 多人模式半路回放

const _allSlotTimestampsAccessor    = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, Map<number, number>>({
    reqData : () => SinglePlayerModeModelSpmProxy.reqSpmGetAllWarSaveSlotTimestamps(),
});
/** 只用于保证收到过消息 */
const _dataArrayAccessor            = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, boolean>({
    reqData : () => { /** nothing to do */},
});
const _slotFullDataAccessor         = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, AuxiliaryTypesAuxiliaryTypes.DecodedSpmWarSaveSlotData>({
    reqData : (slotIndex) => SinglePlayerModeModelSpmProxy.reqSpmGetWarSaveSlotFullData(slotIndex),
});

export function init(): void {
    NotificationsDispatcher.addEventListeners([
        { type: NotificationsTypeId.TypeId.MsgSpmValidateSrw,   callback: _onNotifyMsgSpmValidateSrw, },
    ], null);
}

function _onNotifyMsgSpmValidateSrw(e: VendorEgretEgret.Event): void {
    const data      = e.data as ProtoSchemaCommonProtoNetMessageMsgSpmValidateSrwS.S;
    const status    = data.getStatus();
    if (status === GameConfigGcWar.SingleRankedWar.ValidateStatus.ConfigVersionNotLatest) {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0278));
    } else if (status === GameConfigGcWar.SingleRankedWar.ValidateStatus.ScoreNotHighest) {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0279));
    } else if (status === GameConfigGcWar.SingleRankedWar.ValidateStatus.ScoreTooLow) {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0281));
    } else {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0280));
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

export async function getSlotFullData(slotIndex: number): Promise<Undefinable<AuxiliaryTypesAuxiliaryTypes.DecodedSpmWarSaveSlotData>> {
    const timestamp = (await getAllSlotTimestamps())?.get(slotIndex);
    if (timestamp == null) {
        return null;
    }

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalDataStorage2.StoreSpmWarSaveSlotFullData.getData(userId, slotIndex);
        if (cachedData != null) {
            if ((cachedData.extraData.getTimestamp() ?? 0) === timestamp) {
                return cachedData;
            }
            return _slotFullDataAccessor.getData(slotIndex, true);
        }
    }

    return _slotFullDataAccessor.getData(slotIndex);
}
async function setSlotFullData(slotIndex: number, fullData: AuxiliaryTypesAuxiliaryTypes.DecodedSpmWarSaveSlotData | null): Promise<void> {
    _slotFullDataAccessor.setData(slotIndex, fullData);

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        await LocalDataStorage2.StoreSpmWarSaveSlotFullData.setData(userId, slotIndex, fullData);
    }
}

export async function updateOnMsgSpmGetAllWarSaveSlotTimestamps(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS.S): Promise<void> {
    const selfUserId            = UsersModel.getSelfUserId();
    const existingDataDict      = selfUserId == null ? null : await LocalDataStorage2.StoreSpmWarSaveSlotFullData.getAllDataDictForKey1(selfUserId);
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

    SinglePlayerModeModelSpmProxy.reqSpmGetWarSaveSlotFullDataArray([...neededSlotIndexSet]);
    await _dataArrayAccessor.getData(null);

    setAllSlotTimestamps(resultDict);
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function updateOnFailedMsgSpmGetAllWarSaveSlotTimestamps(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetAllWarSaveSlotTimestampsS.S): void {
    _allSlotTimestampsAccessor.updateOnRequestFailed(null);
}

export async function updateOnMsgSpmGetWarSaveSlotFullDataArray(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataArrayS.S): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const d of data.getSlotDataArray()) {
        const slotIndex = d.getSlotIndex() ?? 0;
        promiseArray.push(setSlotFullData(slotIndex, {
            slotIndex   : slotIndex,
            warData     : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(HelpersMisc.getExisted(d.getCompressedWarData()))),
            extraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.decode(HelpersMisc.getExisted(d.getEncodedExtraData())),
        }));
    }
    await Promise.all(promiseArray);

    _dataArrayAccessor.setData(null, true);
}

export function updateOnMsgSpmGetWarSaveSlotFullData(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS.S): Promise<void> {
    const slotIndex = data.getSlotIndex() ?? 0;
    const slotData  = data.getSlotData();
    if (slotData == null) {
        return setSlotFullData(slotIndex, null);
    } else {
        return setSlotFullData(slotIndex, {
            slotIndex   : slotIndex,
            warData     : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(HelpersMisc.getExisted(slotData.getCompressedWarData()))),
            extraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.decode(HelpersMisc.getExisted(slotData.getEncodedExtraData())),
        });
    }
}
export function updateOnFailedMsgSpmGetWarSaveSlotFullData(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetWarSaveSlotFullDataS.S): void {
    const slotIndex = data.getSlotIndex();
    if (slotIndex != null) {
        _slotFullDataAccessor.updateOnRequestFailed(slotIndex);
    }
}

export function updateOnMsgSpmCreateScw(data: ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwS.S): Promise<void> {
    return updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, HelpersMisc.getExisted(data.getExtraData()), HelpersMisc.getExisted(data.getWarData()));
}
export async function updateOnMsgSpmCreateSfw(data: ProtoSchemaCommonProtoNetMessageMsgSpmCreateSfwS.S): Promise<void> {
    await updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, HelpersMisc.getExisted(data.getExtraData()), HelpersMisc.getExisted(data.getWarData()));

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
export function updateOnMsgSpmCreateSrw(data: ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwS.S): Promise<void> {
    return updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, HelpersMisc.getExisted(data.getExtraData()), HelpersMisc.getExisted(data.getWarData()));
}
export function updateOnMsgCampaignCreateWar(data: ProtoSchemaCommonProtoNetMessageMsgCampaignCreateWarS.S): Promise<void> {
    return updateTimestampAndSlotFullData(data.getSlotIndex() ?? 0, HelpersMisc.getExisted(data.getSlotExtraData()), HelpersMisc.getExisted(data.getWarData()));
}
export function updateOnMsgSpmSaveScw(data: ProtoSchemaCommonProtoNetMessageMsgSpmSaveScwS.S): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        HelpersMisc.getExisted(data.getSlotExtraData()),
        ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(HelpersMisc.getExisted(data.getCompressedWarData())))
    );
}
export function updateOnMsgSpmSaveSfw(data: ProtoSchemaCommonProtoNetMessageMsgSpmSaveSfwS.S): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        HelpersMisc.getExisted(data.getSlotExtraData()),
        ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(HelpersMisc.getExisted(data.getCompressedWarData())))
    );
}
export function updateOnMsgSpmSaveSrw(data: ProtoSchemaCommonProtoNetMessageMsgSpmSaveSrwS.S): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        HelpersMisc.getExisted(data.getSlotExtraData()),
        ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(HelpersMisc.getExisted(data.getCompressedWarData())))
    );
}
export function updateOnMsgCampaignSaveWar(data: ProtoSchemaCommonProtoNetMessageMsgCampaignSaveWarS.S): Promise<void> {
    return updateTimestampAndSlotFullData(
        data.getSlotIndex() ?? 0,
        HelpersMisc.getExisted(data.getSlotExtraData()),
        ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(HelpersMisc.getExisted(data.getCompressedWarData())))
    );
}
export async function updateOnMsgSpmDeleteWarSaveSlot(slotIndex: number): Promise<void> {
    (await getAllSlotTimestamps())?.delete(slotIndex);
    await setSlotFullData(slotIndex, null);
}

async function updateTimestampAndSlotFullData(slotIndex: number, slotExtraData: ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData, warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar): Promise<void> {
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
    for (let slotIndex = 0; slotIndex < GameConfigGcWar.SinglePlayerWar.MaxSaveSlotCount; ++slotIndex) {
        promiseArray.push(checkIsEmpty(slotIndex));
    }

    const emptyResultArray      = await Promise.all(promiseArray);
    const emptySlotIndexArray   : number[] = [];
    for (let slotIndex = 0; slotIndex < GameConfigGcWar.SinglePlayerWar.MaxSaveSlotCount; ++slotIndex) {
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
        return `${LangUtils.getText(LangConstants.TextType.B0226)}: ${mpwWarId}`;
    }

    const warData       = slotData.warData;
    const normalMapId   = HelpersProtoSchemaWarSerializationSerialWar.getNormalMapId(warData);
    if (normalMapId != null) {
        return (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) || LangConstants.UndefinedError;
    }

    const settingsForCaw = warData.getSettingsForCaw();
    if (settingsForCaw != null) {
        const mapRawData = await CampaignsMainsProvider.getCampaignMapRawData(settingsForCaw.getCampaignId() ?? 0, settingsForCaw.getCampaignMapId() ?? 0);
        return LangUtils.getLanguageText({ textArray: mapRawData?.getMapNameArray() }) ?? LangConstants.UndefinedError;
    }

    return `(${LangUtils.getText(LangConstants.TextType.B0321)})`;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for rank list.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _rankDataGetter = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListSpmRankInfoForRule.SpmRankInfoForRule[]>({
    reqData : (normalMapId: number) => SinglePlayerModeModelSpmProxy.reqSpmGetRankList(normalMapId),
});

export function getRankData(normalMapId: number): Promise<Undefinable<ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListSpmRankInfoForRule.SpmRankInfoForRule[]>> {
    return _rankDataGetter.getData(normalMapId);
}

export function updateOnMsgSpmGetRankList(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetRankListS.S): void {
    _rankDataGetter.setData(HelpersMisc.getExisted(data.getNormalMapId()), data.getInfoArray());
}

export async function getRankIndex(normalMapId: number, ruleId: number, score: number): Promise<number | null> {
    const rankDataArray = (await getRankData(normalMapId))?.find(v => v.getRuleId() === ruleId)?.getInfoArray().concat().sort((v1, v2) => HelpersMisc.getExisted(v2.getScore()) - HelpersMisc.getExisted(v1.getScore()));
    if (rankDataArray == null) {
        return null;
    }

    const index = rankDataArray.findIndex(v => v.getScore() === score);
    return index < 0 ? null : index + 1;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for replay data.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _replayDataAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar>({
    reqData : (rankId: number) => SinglePlayerModeModelSpmProxy.reqSpmGetReplayData(rankId),
});

export async function getReplayData(rankId: number): Promise<Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar>> {
    return (await LocalDataStorage2.StoreSpmReplayData.getData(rankId)) ?? _replayDataAccessor.getData(rankId);
}
function setReplayData(rankId: number, data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar | null): Promise<void> {
    _replayDataAccessor.setData(rankId, data);
    return LocalDataStorage2.StoreSpmReplayData.setData(rankId, data);
}
async function decodeAndReviseReplayData(encodedWar: AuxiliaryTypesAuxiliaryTypes.Undefinable<Uint8Array>): Promise<ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar | null> {
    if (encodedWar == null) {
        return null;
    }

    const warData               = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(encodedWar);
    const settingsForCommon     = HelpersMisc.getExisted(warData.getSettingsForCommon());
    const srcInstanceWarRule    = settingsForCommon.getInstanceWarRule();
    if (srcInstanceWarRule == null) {
        return null;
    }

    const mapRawData = await NormalMapModelNormalMapModel.getRawData(HelpersMisc.getExisted(warData.getSettingsForSrw()?.getNormalMapId()));
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

    settingsForCommon.setInstanceWarRule(WarRulesUtilsInstance.create({
        templateWarRule             : templateWarRule,
        warEventFullData            : mapRawData.getWarEventFullData(),
        allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
        taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
    }));

    if (!warData.checkHasField()) {
        warData.createIfNotExistsField().loadJson({
            fogMap  : {
                forceFogCode    : FogMapsConstants.ForcedFogCode.None,
                mapsFromPath    : [],
            },
        });
    }

    if (!warData.checkHasTurnManager()) {
        warData.createIfNotExistsTurnManager().loadJson({
            turnIndex       : TurnsConstants.TurnIndex.FirstIndex,
            turnPhaseCode   : TurnsConstants.PhaseCode.WaitBeginTurn,
            playerIndex     : PlayersConstants.PlayerIndex.Neutral,
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

export async function updateOnMsgSpmGetReplayData(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS.S): Promise<void> {
    await setReplayData(data.getRankId() ?? 0, await decodeAndReviseReplayData(data.getEncodedWar()));
}
export function updateOnFailedMsgSpmGetReplayData(data: ProtoSchemaCommonProtoNetMessageMsgSpmGetReplayDataS.S): void {
    const rankId = data.getRankId();
    if (rankId != null) {
        _replayDataAccessor.updateOnRequestFailed(rankId);
    }
}
