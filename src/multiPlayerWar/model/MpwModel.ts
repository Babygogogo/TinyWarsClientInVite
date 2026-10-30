import {
    AuxiliaryTypes_CachedDataAccessor,
    CoopCustomWar_Model_CcwWar,
    BootTimers_Constants,
    GameConfigs_Provider,
    MultiCustomWar_Model_McwWar,
    MultiFreeWar_Model_MfwWar,
    MultiMatchWar_Model_MmwWar,
    MultiRankWar_Model_MrwWar,
    FloatText,
    AutoTourneys_Wars_War,
    type Common_View_CommonWarAdvancedSettingsPage,
    type Common_View_CommonWarBasicSettingsPage,
    type Common_View_CommonWarPlayerInfoPage,
    type AuxiliaryTypes_AuxiliaryTypes,
    Notifications_Dispatcher,
    Players_Constants,
    Wars_Constants,
    WarOperations_Executors_Executor,
    Helpers_Misc,
    GamePanels_Manager,
    HalfwayReplayWar_Model_HrwModel,
    GamePanels_Dict,
    Lang_Utils,
    GameModes_Utils,
    NormalMap_Model_NormalMapModel,
    WarRules_Utils_CommonData,
    Users_Model,
    WarSettings_Utils_MpwWarSettings,
    Helpers_GameFlow,
    MultiPlayerWar_Model_MpwModel,
    MultiPlayerWar_Model_MpwProxy,
    LocalData_Storage,
    Lang_Constants,
    Notifications_TypeId,
    Logger,
    WarTypes_Constants,
    type Egret_Egret,
    type Notifications_DataTypes,
    type MultiPlayerWar_Interface_IMpwWar,
    type Notifications_Types,
} from "../../internal.ts";

import type { MpwWarProgressInfo } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarProgressInfo.ts";
import type { MpwWarSettings } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";
import type { S as MpwCommonBroadcastGameStartResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonBroadcastGameStart/S.ts";
import type { S as MpwCommonContinueWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonContinueWar/S.ts";
import type { S as MpwCommonGetHalfwayReplayDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetHalfwayReplayData/S.ts";
import type { S as MpwCommonGetJoinedMpwIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetJoinedMpwIdArray/S.ts";
import type { S as MpwCommonGetUnitStatisticsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/S.ts";
import type { S as MpwCommonGetWarProgressInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarProgressInfo/S.ts";
import type { S as MpwCommonGetWarSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarSettings/S.ts";
import type { S as MpwCommonGetWarTimestampResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarTimestamp/S.ts";
import type { S as MpwCommonMarkGridResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonMarkGrid/S.ts";
import type { S as MpwCommonSetGridMarkListResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetGridMarkList/S.ts";
import type { S as MpwCommonSetHiddenGridMarkTypeIdListResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetHiddenGridMarkTypeIdList/S.ts";
import type { S as MpwCommonSyncWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSyncWar/S.ts";
import type { S as MpwWatchGetIncomingInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetIncomingInfo/S.ts";
import type { S as MpwWatchGetOutgoingInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOutgoingInfo/S.ts";
import type { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForAtw } from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";
import type { SettingsForCcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import type { SettingsForCommon } from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import type { SettingsForMcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import type { SettingsForMfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";
import type { SettingsForMmw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";
import type { SettingsForMrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";

const _NOTIFY_LISTENERS     : Notifications_Types.Listener[] = [
    { type : Notifications_TypeId.TypeId.MsgMpwWatchGetIncomingInfo,      callback : _onNotifyMsgMpwWatchGetIncomingInfo },
    { type : Notifications_TypeId.TypeId.MsgMpwWatchGetOutgoingInfo,      callback : _onNotifyMsgMpwWatchGetOutgoingInfo },
];

const _joinedMpwIdArrayAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => MultiPlayerWar_Model_MpwProxy.reqMpwCommonGetJoinedMpwIdArray(),
});
const _warTimestampAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, number>({
    reqData        : warId => MultiPlayerWar_Model_MpwProxy.reqMpwCommonGetWarTimestamp(warId),
    dataExpireTime : 30,
});
const _warProgressInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, MpwWarProgressInfo>({
    reqData : (warId: number) => MultiPlayerWar_Model_MpwProxy.reqMpwCommonGetWarProgressInfo(warId),
});
const _ongoingWarDataAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, SerialWar>({
    reqData : warId => MultiPlayerWar_Model_MpwProxy.reqMpwCommonContinueWar(warId),
});
const _halfwayReplayDataAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, SerialWar>({
    reqData : warId => MultiPlayerWar_Model_MpwProxy.reqMpwCommonGetHalfwayReplayData(warId),
});
const _unitStatisticsAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, MpwCommonGetUnitStatisticsResponse>({
    reqData : warId => MultiPlayerWar_Model_MpwProxy.reqMpwCommonGetUnitStatistics(warId),
});

const _cachedActions        : WoContainer[] = [];
let _war                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MultiPlayerWar_Interface_IMpwWar.IMpwWar>;
let _cachedSyncWarData      : AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwCommonSyncWarResponse>;

export function init(): void {
    Notifications_Dispatcher.addEventListeners(_NOTIFY_LISTENERS, MultiPlayerWar_Model_MpwModel);
}

export function getJoinedMpwIdArray(forceNew = false): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>> {
    return _joinedMpwIdArrayAccessor.getData(null, forceNew);
}
function setJoinedMpwIdArray(mpwIdArray: number[]): void {
    _joinedMpwIdArrayAccessor.setData(null, mpwIdArray);
}

export function getWarTimestamp(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>> {
    return _warTimestampAccessor.getData(warId);
}
function setWarTimestamp(warId: number, timestamp: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void {
    _warTimestampAccessor.setData(warId, timestamp);
}

export async function getWarProgressInfo(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwWarProgressInfo>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const cachedData = await LocalData_Storage.StoreMpwWarProgressInfo.getData(warId);
    if (cachedData != null) {
        if ((cachedData.getModifiedTime() ?? 0) >= timestamp) {
            return cachedData;
        }
        return _warProgressInfoAccessor.getData(warId, true);
    }

    return _warProgressInfoAccessor.getData(warId);
}
function setWarProgressInfo(warId: number, data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwWarProgressInfo>): Promise<void> {
    _warProgressInfoAccessor.setData(warId, data);
    return LocalData_Storage.StoreMpwWarProgressInfo.setData(warId, data);
}

export async function getOngoingWarData(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWar>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalData_Storage.StoreMpwOngoingWarData.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getModifiedTime()) >= timestamp) {
                return cachedData;
            }
            return _ongoingWarDataAccessor.getData(warId, true);
        }
    }

    return _ongoingWarDataAccessor.getData(warId);
}
async function setOngoingWarData(warId: number, data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWar>): Promise<void> {
    _ongoingWarDataAccessor.setData(warId, data);

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        await LocalData_Storage.StoreMpwOngoingWarData.setData(userId, warId, data);
    }
}

export async function getHalfwayReplayData(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWar>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalData_Storage.StoreMpwHalfwayReplayData.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getModifiedTime()) >= timestamp) {
                return cachedData;
            }
            return _halfwayReplayDataAccessor.getData(warId, true);
        }
    }

    return _halfwayReplayDataAccessor.getData(warId);
}
async function setHalfwayReplayData(warId: number, data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWar>): Promise<void> {
    _halfwayReplayDataAccessor.setData(warId, data);

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        await LocalData_Storage.StoreMpwHalfwayReplayData.setData(userId, warId, data);
    }
}

export async function getUnitStatistics(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwCommonGetUnitStatisticsResponse>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalData_Storage.StoreMpwUnitStatistics.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getTimestamp() ?? 0) >= timestamp) {
                return cachedData;
            }
            return _unitStatisticsAccessor.getData(warId, true);
        }
    }

    return _unitStatisticsAccessor.getData(warId);
}
async function setUnitStatistics(warId: number, data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwCommonGetUnitStatisticsResponse>): Promise<void> {
    _unitStatisticsAccessor.setData(warId, data);

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        await LocalData_Storage.StoreMpwUnitStatistics.setData(userId, warId, data);
    }
}

export function updateOnMsgMpwCommonGetJoinedMpwIdArray(data: MpwCommonGetJoinedMpwIdArrayResponse): void {
    setJoinedMpwIdArray(data.getWarIdArray());
}

export function updateOnMsgMpwCommonGetWarTimestamp(data: MpwCommonGetWarTimestampResponse): void {
    setWarTimestamp(data.getWarId() ?? 0, data.getTimestamp());
}
export function updateOnFailedMsgMpwCommonGetWarTimestamp(data: MpwCommonGetWarTimestampResponse): void {
    const warId = data.getWarId();
    if (warId != null) {
        _warTimestampAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonGetWarProgressInfo(data: MpwCommonGetWarProgressInfoResponse): Promise<void> {
    return setWarProgressInfo(data.getWarId() ?? 0, data.getWarProgressInfo());
}
export function updateOnFailedMsgMpwCommonGetWarProgressInfo(data: MpwCommonGetWarProgressInfoResponse): void {
    const warId = data.getWarId();
    if (warId != null) {
        _warProgressInfoAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonContinueWar(data: MpwCommonContinueWarResponse): Promise<void> {
    return setOngoingWarData(data.getWarId() ?? 0, data.getWar());
}
export function updateOnFailedMsgMpwCommonContinueWar(data: MpwCommonContinueWarResponse): void {
    const warId = data.getWarId();
    if (warId != null) {
        _ongoingWarDataAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonGetHalfwayReplayData(data: MpwCommonGetHalfwayReplayDataResponse): Promise<void> {
    const warData = data.getWarData()?.clone();
    if (warData) {
        Helpers_Misc.getExisted(warData.getExecutedOperationManager()).setExecutedOperationArray(HalfwayReplayWar_Model_HrwModel.generateExecutedActions(warData));
    }
    return setHalfwayReplayData(data.getWarId() ?? 0, warData);
}
export function updateOnFailedMsgMpwCommonGetHalfwayReplayData(data: MpwCommonGetHalfwayReplayDataResponse): void {
    const warId = data.getWarId();
    if (warId != null) {
        _halfwayReplayDataAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonGetUnitStatistics(data: MpwCommonGetUnitStatisticsResponse): Promise<void> {
    return setUnitStatistics(data.getWarId() ?? 0, data);
}
export function updateOnFailedMsgMpwCommonGetUnitStatistics(data: MpwCommonGetUnitStatisticsResponse): void {
    const warId = data.getWarId();
    if (warId != null) {
        _halfwayReplayDataAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonMarkGrid(data: MpwCommonMarkGridResponse): void {
    const war = getWar();
    if (war?.getWarId() === data.getWarId()) {
        war.getPlayerLoggedIn()?.updateGridMarkList(data.getGridIdArrayForAddMark(), data.getGridIdArrayForDeleteMark(), data.getMarkTypeId());
    }
}

export function updateOnMsgMpwCommonSetHiddenGridMarkTypeIdList(data: MpwCommonSetHiddenGridMarkTypeIdListResponse): void {
    const war = getWar();
    if (war?.getWarId() === data.getWarId()) {
        war.getPlayerLoggedIn()?.updateHiddenGridMarkTypeIdList(data.getHiddenGridMarkTypeIdList());
    }
}

export function updateOnMsgMpwCommonSetGridMarkList(data: MpwCommonSetGridMarkListResponse): void {
    const war = getWar();
    if (war?.getWarId() === data.getWarId()) {
        war.getPlayerLoggedIn()?.setGridMarkList(data.getGridMarkList());

        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.GridMarkListChanged, {
            war : war,
        } as Notifications_DataTypes.GridMarkListChanged);
    }
}

export async function updateOnMsgMpwCommonBroadcastGameStart(data: MpwCommonBroadcastGameStartResponse): Promise<void> {
    const desc = await getGameStartDesc(data);
    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
        getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0392),
        getContent : () => desc,
        callback   : async () => {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonBlockPanel, {
                title   : Lang_Utils.getText(Lang_Constants.TextType.B0088),
                content : Lang_Utils.getText(Lang_Constants.TextType.A0040),
            });

            const warData = await getOngoingWarData(data.getWarId() ?? 0);
            if (warData) {
                Helpers_GameFlow.gotoMultiPlayerWar(warData);
            } else {
                FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            }

            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonBlockPanel);
        },
    });
}

export async function checkIsRedForMyMcwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypes_Constants.WarTypeId.McwFog, WarTypes_Constants.WarTypeId.McwStd]);
}
export async function checkIsRedForMyMrwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypes_Constants.WarTypeId.MrwFog, WarTypes_Constants.WarTypeId.MrwStd]);
}
export async function checkIsRedForMyMmwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypes_Constants.WarTypeId.MmwFog, WarTypes_Constants.WarTypeId.MmwStd]);
}
export async function checkIsRedForMyAtwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypes_Constants.WarTypeId.AtwFog, WarTypes_Constants.WarTypeId.AtwStd]);
}
export async function checkIsRedForMyMfwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypes_Constants.WarTypeId.MfwFog, WarTypes_Constants.WarTypeId.MfwStd]);
}
export async function checkIsRedForMyCcwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypes_Constants.WarTypeId.CcwFog, WarTypes_Constants.WarTypeId.CcwStd]);
}
export async function checkIsRedForMyWar(progressInfo: AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwWarProgressInfo>): Promise<boolean> {
    if (progressInfo == null) {
        return false;
    }

    const warSettings = await getWarSettings(progressInfo.getWarId() ?? 0);
    if (warSettings == null) {
        return false;
    }

    const selfUserId        = Users_Model.getSelfUserId();
    const playerIndexInTurn = progressInfo.getPlayerIndexInTurn() ?? 0;
    return warSettings.getPlayerInfoArray().some(v => (v.getPlayerIndex() === playerIndexInTurn) && (v.getUserId() === selfUserId));
}
export async function checkIsRedForAllMyWars(ignoreWarIdArray?: number[]): Promise<boolean> {
    const warIdSet = new Set(await getJoinedMpwIdArray());
    for (const warId of ignoreWarIdArray ?? []) {
        warIdSet.delete(warId);
    }

    return checkIsRedForMyWars([...warIdSet], [
        WarTypes_Constants.WarTypeId.McwFog, WarTypes_Constants.WarTypeId.McwStd,
        WarTypes_Constants.WarTypeId.MrwFog, WarTypes_Constants.WarTypeId.MrwStd,
        WarTypes_Constants.WarTypeId.MmwFog, WarTypes_Constants.WarTypeId.MmwStd,
        WarTypes_Constants.WarTypeId.AtwFog, WarTypes_Constants.WarTypeId.AtwStd,
        WarTypes_Constants.WarTypeId.MfwFog, WarTypes_Constants.WarTypeId.MfwStd,
        WarTypes_Constants.WarTypeId.CcwFog, WarTypes_Constants.WarTypeId.CcwStd,
    ]);
}
async function checkIsRedForMyWars(warIdArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>, warTypeArray: WarTypes_Constants.WarTypeId[]): Promise<boolean> {
    if (!warIdArray?.length) {
        return false;
    }
    return Helpers_Misc.checkIsAnyPromiseTrue(warIdArray.map(async v => {
        const warType = await getWarType(v);
        return (warType != null)
            && (warTypeArray.indexOf(warType) >= 0)
            && (await checkIsRedForMyWar(await getWarProgressInfo(v)));
    }));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for war settings.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _warSettingsAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, MpwWarSettings>({
    reqData : (warId: number) => MultiPlayerWar_Model_MpwProxy.reqMpwCommonGetWarSettings(warId),
});

export async function getWarSettings(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwWarSettings>> {
    return (await LocalData_Storage.StoreMpwWarSettings.getData(warId)) ?? (_warSettingsAccessor.getData(warId));
}
function setWarSettings(warId: number, data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwWarSettings>): Promise<void> {
    _warSettingsAccessor.setData(warId, data);
    return LocalData_Storage.StoreMpwWarSettings.setData(warId, data);
}

export async function getWarType(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<WarTypes_Constants.WarTypeId>> {
    const warSettings = await getWarSettings(warId);
    return (warSettings == null)
        ? null
        : WarSettings_Utils_MpwWarSettings.getWarTypeByMpwWarSettings(warSettings);
}

export function updateOnMsgMpwCommonGetWarSettings(data: MpwCommonGetWarSettingsResponse): Promise<void> {
    return setWarSettings(data.getWarId() ?? 0, data.getWarSettings());
}
export function updateOnFailedMsgMpwCommonGetWarSettings(data: MpwCommonGetWarSettingsResponse): void {
    const warId = data.getWarId();
    if (warId != null) {
        _warSettingsAccessor.updateOnRequestFailed(warId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDataForCommonWarBasicSettingsPage(warId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    const warInfo = warId == null ? null : await getWarSettings(warId);
    if (warInfo == null) {
        return null;
    }

    const settingsForCommon = Helpers_Misc.getExisted(warInfo.getSettingsForCommon());
    const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
    const settingsForCcw    = warInfo.getSettingsForCcw();
    const settingsForMcw    = warInfo.getSettingsForMcw();
    const settingsForMfw    = warInfo.getSettingsForMfw();
    const settingsForMrw    = warInfo.getSettingsForMrw();
    const settingsForMmw    = warInfo.getSettingsForMmw();
    const settingsForAtw    = warInfo.getSettingsForAtw();
    if (settingsForMcw) {
        return await createDataForCommonWarBasicSettingsPageForMcw(instanceWarRule, settingsForCommon, settingsForMcw);
    } else if (settingsForCcw) {
        return await createDataForCommonWarBasicSettingsPageForCcw(instanceWarRule, settingsForCommon, settingsForCcw);
    } else if (settingsForMrw) {
        return await createDataForCommonWarBasicSettingsPageForMrw(instanceWarRule, settingsForCommon, settingsForMrw);
    } else if (settingsForMfw) {
        return await createDataForCommonWarBasicSettingsPageForMfw(instanceWarRule, settingsForCommon, settingsForMfw);
    } else if (settingsForMmw) {
        return await createDataForCommonWarBasicSettingsPageForMmw(instanceWarRule, settingsForCommon, settingsForMmw);
    } else if (settingsForAtw) {
        return await createDataForCommonWarBasicSettingsPageForAtw(instanceWarRule, settingsForCommon, settingsForAtw);
    } else {
        throw Helpers_Misc.newError(`Invalid warInfo.`);
    }
}
async function createDataForCommonWarBasicSettingsPageForMcw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMcw      : SettingsForMcw,
): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams   = settingsForMcw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
    const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMap_Model_NormalMapModel.getRawData(settingsForMcw.getNormalMapId()))?.getWarEventFullData();
    const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings : [
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                currentValue     : settingsForMcw.getNormalMapId(),
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarName,
                currentValue     : settingsForMcw.getWarName() ?? null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarPassword,
                currentValue     : settingsForMcw.getWarPassword() ?? null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarComment,
                currentValue     : settingsForMcw.getWarComment() ?? null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TileTheme,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarEvent,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue     : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerType,
                currentValue     : timerType,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
        ],
    };
    if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType     : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
            currentValue     : bootTimerParams[1],
            instanceWarRule  : instanceWarRule,
            gameConfig       : gameConfig,
            warEventFullData : warEventFullData,
            callbackOnModify : null,
        });
    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
                currentValue     : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
        );
    } else {
        throw Helpers_Misc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMcw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForCcw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForCcw      : SettingsForCcw,
): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams   = settingsForCcw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
    const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMap_Model_NormalMapModel.getRawData(settingsForCcw.getNormalMapId()))?.getWarEventFullData();
    const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings : [
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                currentValue     : settingsForCcw.getNormalMapId(),
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarName,
                currentValue     : settingsForCcw.getWarName() ?? null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarPassword,
                currentValue     : settingsForCcw.getWarPassword() ?? null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarComment,
                currentValue     : settingsForCcw.getWarComment() ?? null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TileTheme,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarEvent,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue     : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerType,
                currentValue     : timerType,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
        ],
    };
    if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType     : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
            currentValue     : bootTimerParams[1],
            instanceWarRule  : instanceWarRule,
            gameConfig       : gameConfig,
            warEventFullData : warEventFullData,
            callbackOnModify : null,
        });
    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
                currentValue     : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
        );
    } else {
        throw Helpers_Misc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForCcw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForMrw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMrw      : SettingsForMrw,
): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams = settingsForMrw.getBootTimerParams().concat();
    if (!bootTimerParams.length) {
        bootTimerParams.push(...BootTimers_Constants.DefaultParams);
    }

    const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
    const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMap_Model_NormalMapModel.getRawData(settingsForMrw.getNormalMapId()))?.getWarEventFullData();
    const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings : [
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                currentValue     : settingsForMrw.getNormalMapId(),
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TileTheme,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarEvent,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue     : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerType,
                currentValue     : timerType,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
        ],
    };
    if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType     : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
            currentValue     : bootTimerParams[1],
            instanceWarRule  : instanceWarRule,
            gameConfig       : gameConfig,
            warEventFullData : warEventFullData,
            callbackOnModify : null,
        });
    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push({
            settingsType     : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
            currentValue     : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
            instanceWarRule  : instanceWarRule,
            gameConfig       : gameConfig,
            warEventFullData : warEventFullData,
            callbackOnModify : null,
        });
    } else {
        throw Helpers_Misc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMrw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForMmw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMmw      : SettingsForMmw,
): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams = settingsForMmw.getBootTimerParams().concat();
    if (!bootTimerParams.length) {
        bootTimerParams.push(...BootTimers_Constants.DefaultParams);
    }

    const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
    const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMap_Model_NormalMapModel.getRawData(settingsForMmw.getNormalMapId()))?.getWarEventFullData();
    const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings : [
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                currentValue     : settingsForMmw.getNormalMapId(),
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TileTheme,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarEvent,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue     : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerType,
                currentValue     : timerType,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
        ],
    };
    if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType     : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
            currentValue     : bootTimerParams[1],
            instanceWarRule  : instanceWarRule,
            gameConfig       : gameConfig,
            warEventFullData : warEventFullData,
            callbackOnModify : null,
        });
    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
                currentValue     : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
        );
    } else {
        throw Helpers_Misc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMmw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForAtw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForAtw      : SettingsForAtw,
): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams   = BootTimers_Constants.DefaultParams.concat();
    const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
    const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMap_Model_NormalMapModel.getRawData(settingsForAtw.getNormalMapId()))?.getWarEventFullData();
    const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings : [
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                currentValue     : settingsForAtw.getNormalMapId(),
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TileTheme,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarEvent,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue     : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerType,
                currentValue     : timerType,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
        ],
    };
    if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType     : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
            currentValue     : bootTimerParams[1],
            instanceWarRule  : instanceWarRule,
            gameConfig       : gameConfig,
            warEventFullData : warEventFullData,
            callbackOnModify : null,
        });
    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push({
            settingsType     : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
            currentValue     : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
            instanceWarRule  : instanceWarRule,
            gameConfig       : gameConfig,
            warEventFullData : warEventFullData,
            callbackOnModify : null,
        });
    } else {
        throw Helpers_Misc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForAtw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForMfw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMfw      : SettingsForMfw,
): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams   = settingsForMfw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
    const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = instanceWarRule.getWarEventFullData();
    const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings : [
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarName,
                currentValue     : settingsForMfw.getWarName() ?? null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarPassword,
                currentValue     : settingsForMfw.getWarPassword() ?? null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarComment,
                currentValue     : settingsForMfw.getWarComment() ?? null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.HasFog,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.Weather,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TileTheme,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.WarEvent,
                currentValue     : null,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue     : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.TimerType,
                currentValue     : timerType,
                instanceWarRule  : instanceWarRule,
                gameConfig       : gameConfig,
                warEventFullData : warEventFullData,
                callbackOnModify : null,
            },
        ],
    };
    if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType     : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
            currentValue     : bootTimerParams[1],
            instanceWarRule  : instanceWarRule,
            gameConfig       : gameConfig,
            warEventFullData : warEventFullData,
            callbackOnModify : null,
        });
    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push({
            settingsType     : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
            currentValue     : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
            instanceWarRule  : instanceWarRule,
            gameConfig       : gameConfig,
            warEventFullData : warEventFullData,
            callbackOnModify : null,
        });
    } else {
        throw Helpers_Misc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMfw() invalid timerType.`);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(warId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
    const mpwWarSettings = warId == null ? null : await getWarSettings(warId);
    if (mpwWarSettings == null) {
        return null;
    }

    const settingsForCommon = Helpers_Misc.getExisted(mpwWarSettings.getSettingsForCommon());
    return {
        canModify       : false,
        gcData          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule()),
        gameModeId      : Helpers_Misc.getExisted(GameModes_Utils.getGameModeIdByMpwWarSettings(mpwWarSettings)),
    };
}

export async function createDataForCommonWarPlayerInfoPage(warId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
    const warSettings = warId == null ? null : await getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const warProgressInfo = warId == null ? null : await getWarProgressInfo(warId);
    if (warProgressInfo == null) {
        return null;
    }

    const settingsForCommon     = Helpers_Misc.getExisted(warSettings.getSettingsForCommon());
    const instanceWarRule       = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
    const playerStaticInfoArray = warSettings.getPlayerInfoArray();
    const warRuleCommonData     = Helpers_Misc.getExisted(instanceWarRule.getWarRuleCommonData());
    const playerInfoArray       : AuxiliaryTypes_AuxiliaryTypes.PlayerInfo[] = [];
    for (const playerProgressInfo of warProgressInfo.getPlayerInfoList()) {
        const playerIndex       = Helpers_Misc.getExisted(playerProgressInfo.getPlayerIndex());
        const playerStaticInfo  = Helpers_Misc.getExisted(playerStaticInfoArray.find(v => v.getPlayerIndex() === playerIndex));
        const userId            = playerStaticInfo.getUserId() ?? null;
        playerInfoArray.push({
            playerIndex       : playerIndex,
            teamIndex         : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi              : userId == null,
            userId            : userId,
            coId              : playerStaticInfo.getCoId() ?? 0,
            unitAndTileSkinId : playerStaticInfo.getUnitAndTileSkinId() ?? 0,
            isReady           : null,
            isInTurn          : playerIndex === warProgressInfo.getPlayerIndexInTurn(),
            isDefeat          : !playerProgressInfo.getIsAlive(),
            restTimeToBoot    : playerProgressInfo.getRestTimeToBoot() ?? null,
        });
    }

    return {
        gameConfig             : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())),
        playersCountUnneutral  : WarRules_Utils_CommonData.getPlayersCountUnneutral(warRuleCommonData),
        roomOwnerPlayerIndex   : null,
        callbackOnDeletePlayer : null,
        callbackOnExitRoom     : null,
        callbackOnAddDummy     : null,
        callbackOnChangeDummy  : null,
        playerInfoArray        : playerInfoArray,
        enterTurnTime          : warProgressInfo.getEnterTurnTime() ?? null,
        isReplay               : false,
    };
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for managing war.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function loadWar(data: SerialWar): Promise<MultiPlayerWar_Interface_IMpwWar.IMpwWar> {
    if (getWar()) {
        Logger.warn(`MpwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const war = createWarByWarData(data);
    war.init(data, await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(data.getSettingsForCommon()?.getConfigVersion())));
    war.startRunning().startRunningView();
    _setWar(war);

    return war;
}
export function unloadWar(): void {
    const war = getWar();
    if (war) {
        war.stopRunning();
        _setWar(null);
        _cachedActions.length = 0;
    }
}

export function getWar(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<MultiPlayerWar_Interface_IMpwWar.IMpwWar> {
    return _war;
}
function _setWar(war: AuxiliaryTypes_AuxiliaryTypes.Undefinable<MultiPlayerWar_Interface_IMpwWar.IMpwWar>): void {
    _war = war;
}

function _onNotifyMsgMpwWatchGetIncomingInfo(e: Egret_Egret.Event): void {
    const data  = e.data as MpwWatchGetIncomingInfoResponse;
    const war   = getWar();
    if (war?.getWarId() !== Helpers_Misc.getExisted(data.getWarId())) {
        return;
    }

    const player = war.getPlayerLoggedIn();
    if (player == null) {
        return;
    }

    const info = data.getIncomingInfo();
    player.setWatchOngoingSrcUserIds(info?.getOngoingSrcUserIdArray() ?? []);
    player.setWatchRequestSrcUserIds(info?.getRequestSrcUserIdArray() ?? []);
}
function _onNotifyMsgMpwWatchGetOutgoingInfo(e: Egret_Egret.Event): void {
    const data  = e.data as MpwWatchGetOutgoingInfoResponse;
    const war   = getWar();
    if (war?.getWarId() !== Helpers_Misc.getExisted(data.getWarId())) {
        return;
    }

    const info = data.getOutgoingInfo();
    if (info == null) {
        return;
    }

    const selfUserId            = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
    const ongoingDstUserIdArray = info.getOngoingDstUserIdArray();
    const requestDstUserIdArray = info.getRequestDstUserIdArray();
    for (const [, player] of war.getPlayerManager().getAllPlayersDict()) {
        const userId = player.getUserId();
        if (userId == null) {
            continue;
        }

        if (ongoingDstUserIdArray.indexOf(userId) >= 0) {
            player.addWatchOngoingSrcUserId(selfUserId);
        } else {
            player.removeWatchOngoingSrcUserId(selfUserId);
        }

        if (requestDstUserIdArray.indexOf(userId) >= 0) {
            player.addWatchRequestSrcUserId(selfUserId);
        } else {
            player.removeWatchRequestSrcUserId(selfUserId);
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Handlers for war actions that McwProxy receives.
////////////////////////////////////////////////////////////////////////////////////////////////////
export function updateOnPlayerSyncWar(data: MpwCommonSyncWarResponse): void {
    const war = getWar();
    if ((war) && (war.getWarId() === data.getWarId())) {
        _cachedSyncWarData = data;
        checkAndSyncWarOrRunCachedAction(war, _cachedActions);
    }
}

export function updateOnMsgMpwExecuteWarOperation(container: WoContainer, warId: number): void {
    const war = getWar();
    if ((war) && (war.getWarId() === warId)) {
        if (container.getOperationId() !== war.getExecutedOperationManager().getExecutedOperationsCount() + _cachedActions.length + (war.getIsExecutingAction() ? 1 : 0)) {
            MultiPlayerWar_Model_MpwProxy.reqMpwCommonSyncWar(war, Wars_Constants.SyncRequestTypeId.ReconnectionRequest);
        } else {
            _cachedActions.push(container);
            checkAndSyncWarOrRunCachedAction(war, _cachedActions);
        }
    }
}

async function checkAndSyncWarOrRunCachedAction(war: MultiPlayerWar_Interface_IMpwWar.IMpwWar, actionList: WoContainer[]): Promise<void> {
    if ((!war.getIsRunning()) || (war.getIsEnded()) || (war.getIsExecutingAction())) {
        return;
    }

    for (;;) {
        const syncWarData = _cachedSyncWarData;
        if (syncWarData == null) {
            break;
        }

        const cachedActionsCount    = _cachedActions.length;
        const executedActionsCount  = war.getExecutedOperationManager().getExecutedOperationsCount();
        if ((war.getWarId() !== syncWarData.getWarId())                                                                                          ||
            ((syncWarData.getExecutedActionsCount() != null) && ((syncWarData.getExecutedActionsCount() ?? 0) < executedActionsCount + cachedActionsCount))
        ) {
            _cachedSyncWarData = null;
            break;
        }

        const status    = syncWarData.getStatus() as Wars_Constants.SyncStatusId;
        const warData   = syncWarData.getWar();
        if (status === Wars_Constants.SyncStatusId.EndedOrNotExists) {
            war.setIsEnded(true);
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0035),
                callback   : () => {
                    Helpers_GameFlow.gotoMyWarListPanel(war.getWarType());
                },
            });
            return;

        } else if (status === Wars_Constants.SyncStatusId.NotJoined) {
            war.setIsEnded(true);
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0037),
                callback   : () => {
                    Helpers_GameFlow.gotoMyWarListPanel(war.getWarType());
                },
            });
            return;

        } else if (status === Wars_Constants.SyncStatusId.NoError) {
            const requestType = syncWarData.getRequestType() as Wars_Constants.SyncRequestTypeId;
            if (requestType === Wars_Constants.SyncRequestTypeId.PlayerForce) {
                war.setIsEnded(true);
                if (warData == null) {
                    throw Helpers_Misc.newError(`MpwModel.updateOnPlayerSyncWar() empty warData 1.`);
                } else {
                    await Helpers_GameFlow.gotoMultiPlayerWar(warData);
                    FloatText.showLang(Lang_Constants.TextType.A0038);
                }
                return;

            } else {
                if (syncWarData.getExecutedActionsCount() !== executedActionsCount + cachedActionsCount) {
                    war.setIsEnded(true);
                    if (warData == null) {
                        throw Helpers_Misc.newError(`MpwModel.updateOnPlayerSyncWar() empty warData 2.`);
                    } else {
                        await Helpers_GameFlow.gotoMultiPlayerWar(warData);
                        FloatText.showLang(Lang_Constants.TextType.A0036);
                    }
                    return;

                } else {
                    if (requestType === Wars_Constants.SyncRequestTypeId.PlayerRequest) {
                        FloatText.showLang(Lang_Constants.TextType.A0038);
                    } else {
                        // Nothing to do.
                    }
                    break;
                }
            }

        } else if (status === Wars_Constants.SyncStatusId.Synchronized) {
            const requestType = syncWarData.getRequestType() as Wars_Constants.SyncRequestTypeId;
            if (requestType === Wars_Constants.SyncRequestTypeId.PlayerRequest) {
                FloatText.showLang(Lang_Constants.TextType.A0038);
            } else {
                // Nothing to do.
            }
            break;

        } else {
            // Something wrong!!
            war.setIsEnded(true);
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonAlertPanel, {
                getTitle   : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0037),
                callback   : () => Helpers_GameFlow.gotoLobby(),
            });
            return;
        }
    }

    const container = actionList.shift();
    if (container == null) {
        return;
    }

    await WarOperations_Executors_Executor.checkAndExecute(war, container, false);

    if (!war.getIsEnded()) {
        if (war.getIsRunning()) {
            checkAndSyncWarOrRunCachedAction(war, actionList);
        }
    } else {
        const callbackForGoBack = () => Helpers_GameFlow.gotoMyWarListPanel(war.getWarType());
        const callbackForReplay = () => Helpers_GameFlow.gotoRwReplayListPanel();
        if (war.getDrawVoteManager().checkIsDraw()) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getTitle          : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0030),
                getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0588),
                callback          : callbackForGoBack,
                getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0092),
                callbackOnCancel  : callbackForReplay,
            });
        } else {
            const selfUserId = Helpers_Misc.getExisted(Users_Model.getSelfUserId());
            const selfPlayer = war.getPlayerManager().getPlayerByUserId(selfUserId);
            if (selfPlayer == null) {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getTitle          : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                    getContent        : () => Lang_Utils.getText(Lang_Constants.TextType.A0035),
                    getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0588),
                    callback          : callbackForGoBack,
                    getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0092),
                    callbackOnCancel  : callbackForReplay,
                });
            } else {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getTitle          : () => Lang_Utils.getText(Lang_Constants.TextType.B0088),
                    getContent        : () => selfPlayer.getAliveState() === Players_Constants.AliveStateId.Dead ? Lang_Utils.getText(Lang_Constants.TextType.A0023) : Lang_Utils.getText(Lang_Constants.TextType.A0022),
                    getTextForConfirm : () => Lang_Utils.getText(Lang_Constants.TextType.B0588),
                    callback          : callbackForGoBack,
                    getTextForCancel  : () => Lang_Utils.getText(Lang_Constants.TextType.B0092),
                    callbackOnCancel  : callbackForReplay,
                });
            }
        }
    }
}

function createWarByWarData(data: SerialWar): MultiPlayerWar_Interface_IMpwWar.IMpwWar {
    if (data.getSettingsForMcw()) {
        return new MultiCustomWar_Model_McwWar.McwWar();
    } else if (data.getSettingsForMrw()) {
        return new MultiRankWar_Model_MrwWar.MrwWar();
    } else if (data.getSettingsForMfw()) {
        return new MultiFreeWar_Model_MfwWar.MfwWar();
    } else if (data.getSettingsForCcw()) {
        return new CoopCustomWar_Model_CcwWar.CcwWar();
    } else if (data.getSettingsForMmw()) {
        return new MultiMatchWar_Model_MmwWar.MmwWar();
    } else if (data.getSettingsForAtw()) {
        return new AutoTourneys_Wars_War.War();
    } else {
        throw Helpers_Misc.newError(`Invalid data.`);
    }
}

async function getGameStartDesc(data: MpwCommonBroadcastGameStartResponse): Promise<string> {
    const playerArray   : string[] = [];
    let playerIndex     = Players_Constants.PlayerIndex.First;
    for (const playerInfo of data.getPlayerInfoList()) {
        const userId = playerInfo.getUserId();
        playerArray.push(`P${playerIndex}: ${userId != null ? await Users_Model.getUserNickname(userId) : `----`}`);
        ++playerIndex;
    }

    const normalMapId = data.getNormalMapId();
    return [
        Lang_Utils.getFormattedText(Lang_Constants.TextType.F0027, normalMapId != null
            ? await NormalMap_Model_NormalMapModel.getMapNameInCurrentLanguage(normalMapId)
            : Lang_Utils.getText(Lang_Constants.TextType.B0557)),
        ...playerArray,
        Lang_Utils.getText(Lang_Constants.TextType.A0125),
    ].join("\n");
}
