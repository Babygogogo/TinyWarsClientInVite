import type {
    Undefinable,
    PlayerInfo,
} from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import {
    TimerTypeId,
    DefaultParams,
} from "../../bootTimers/Constants.ts";
import type { OpenData as CommonWarAdvancedSettingsPageOpenData } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type { OpenData as CommonWarBasicSettingsPageOpenData } from "../../common/view/CommonWarBasicSettingsPage.ts";
import type { OpenData as CommonWarPlayerInfoPageOpenData } from "../../common/view/CommonWarPlayerInfoPage.ts";
import { showLang } from "../../FloatText.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import {
    getMcwWarClass,
    getMrwWarClass,
    getMfwWarClass,
    getCcwWarClass,
    getMmwWarClass,
    getAtwWarClass,
} from "../../gameHelpers/GhFactory.ts";
import { getGameModeIdByMpwWarSettings } from "../../gameModes/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import {
    openPanel,
    closePanel,
} from "../../gamePanels/Manager.ts";
import { generateExecutedActions } from "../../halfwayReplayWar/model/HrwModel.ts";
import {
    gotoMultiPlayerWar,
    gotoMyWarListPanel,
    gotoLobby,
    gotoRwReplayListPanel,
} from "../../helpers/GameFlow.ts";
import {
    getExisted,
    checkIsAnyPromiseTrue,
    newError,
} from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getFormattedText,
} from "../../lang/Utils.ts";
import {
    StoreMpwWarProgressInfo,
    StoreMpwOngoingWarData,
    StoreMpwHalfwayReplayData,
    StoreMpwUnitStatistics,
    StoreMpwWarSettings,
} from "../../localData/Storage.ts";
import { warn } from "../../Logger.ts";
import type { IMpwWar } from "../interface/IMpwWar.ts";
import * as MultiPlayerWarModelMpwModel from "./MpwModel.ts";
import {
    reqMpwCommonGetJoinedMpwIdArray,
    reqMpwCommonGetWarTimestamp,
    reqMpwCommonGetWarProgressInfo,
    reqMpwCommonContinueWar,
    reqMpwCommonGetHalfwayReplayData,
    reqMpwCommonGetUnitStatistics,
    reqMpwCommonGetWarSettings,
    reqMpwCommonSyncWar,
} from "./MpwProxy.ts";
import {
    getRawData,
    getMapNameInCurrentLanguage,
} from "../../normalMap/model/NormalMapModel.ts";
import type { GridMarkListChanged } from "../../notifications/DataTypes.ts";
import {
    addEventListeners,
    dispatch,
} from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { Listener } from "../../notifications/Types.ts";
import {
    AliveStateId,
    PlayerIndex,
} from "../../players/Constants.ts";
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
import {
    getSelfUserId,
    getUserNickname,
} from "../../users/Model.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { checkAndExecute } from "../../warOperations/executors/Executor.ts";
import {
    getPlayerRule,
    getPlayersCountUnneutral,
} from "../../warRules/utils/CommonData.ts";
import { getWarTypeByMpwWarSettings } from "../../warSettings/utils/MpwWarSettings.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";
import {
    BasicSettingsTypeId,
    SyncRequestTypeId,
    SyncStatusId,
} from "../../wars/Constants.ts";

const _NOTIFY_LISTENERS     : Listener[] = [
    { type: TypeId.MsgMpwWatchGetIncomingInfo,      callback: _onNotifyMsgMpwWatchGetIncomingInfo },
    { type: TypeId.MsgMpwWatchGetOutgoingInfo,      callback: _onNotifyMsgMpwWatchGetOutgoingInfo },
];

const _joinedMpwIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData         : () => reqMpwCommonGetJoinedMpwIdArray(),
});
const _warTimestampAccessor = new CachedDataAccessor<number, number>({
    reqData         : warId => reqMpwCommonGetWarTimestamp(warId),
    dataExpireTime  : 30,
});
const _warProgressInfoAccessor = new CachedDataAccessor<number, MpwWarProgressInfo>({
    reqData         : (warId: number) => reqMpwCommonGetWarProgressInfo(warId),
});
const _ongoingWarDataAccessor = new CachedDataAccessor<number, SerialWar>({
    reqData         : warId => reqMpwCommonContinueWar(warId),
});
const _halfwayReplayDataAccessor = new CachedDataAccessor<number, SerialWar>({
    reqData         : warId => reqMpwCommonGetHalfwayReplayData(warId),
});
const _unitStatisticsAccessor = new CachedDataAccessor<number, MpwCommonGetUnitStatisticsResponse>({
    reqData         : warId => reqMpwCommonGetUnitStatistics(warId),
});

const _cachedActions        : WoContainer[] = [];
let _war                    : Undefinable<IMpwWar>;
let _cachedSyncWarData      : Undefinable<MpwCommonSyncWarResponse>;

export function init(): void {
    addEventListeners(_NOTIFY_LISTENERS, MultiPlayerWarModelMpwModel);
}

export function getJoinedMpwIdArray(forceNew = false): Promise<Undefinable<number[]>> {
    return _joinedMpwIdArrayAccessor.getData(null, forceNew);
}
function setJoinedMpwIdArray(mpwIdArray: number[]): void {
    _joinedMpwIdArrayAccessor.setData(null, mpwIdArray);
}

export function getWarTimestamp(warId: number): Promise<Undefinable<number>> {
    return _warTimestampAccessor.getData(warId);
}
function setWarTimestamp(warId: number, timestamp: Undefinable<number>): void {
    _warTimestampAccessor.setData(warId, timestamp);
}

export async function getWarProgressInfo(warId: number): Promise<Undefinable<MpwWarProgressInfo>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const cachedData = await StoreMpwWarProgressInfo.getData(warId);
    if (cachedData != null) {
        if ((cachedData.getModifiedTime() ?? 0) >= timestamp) {
            return cachedData;
        }
        return _warProgressInfoAccessor.getData(warId, true);
    }

    return _warProgressInfoAccessor.getData(warId);
}
function setWarProgressInfo(warId: number, data: Undefinable<MpwWarProgressInfo>): Promise<void> {
    _warProgressInfoAccessor.setData(warId, data);
    return StoreMpwWarProgressInfo.setData(warId, data);
}

export async function getOngoingWarData(warId: number): Promise<Undefinable<SerialWar>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = getSelfUserId();
    if (userId != null) {
        const cachedData = await StoreMpwOngoingWarData.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getModifiedTime()) >= timestamp) {
                return cachedData;
            }
            return _ongoingWarDataAccessor.getData(warId, true);
        }
    }

    return _ongoingWarDataAccessor.getData(warId);
}
async function setOngoingWarData(warId: number, data: Undefinable<SerialWar>): Promise<void> {
    _ongoingWarDataAccessor.setData(warId, data);

    const userId = getSelfUserId();
    if (userId != null) {
        await StoreMpwOngoingWarData.setData(userId, warId, data);
    }
}

export async function getHalfwayReplayData(warId: number): Promise<Undefinable<SerialWar>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = getSelfUserId();
    if (userId != null) {
        const cachedData = await StoreMpwHalfwayReplayData.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getModifiedTime()) >= timestamp) {
                return cachedData;
            }
            return _halfwayReplayDataAccessor.getData(warId, true);
        }
    }

    return _halfwayReplayDataAccessor.getData(warId);
}
async function setHalfwayReplayData(warId: number, data: Undefinable<SerialWar>): Promise<void> {
    _halfwayReplayDataAccessor.setData(warId, data);

    const userId = getSelfUserId();
    if (userId != null) {
        await StoreMpwHalfwayReplayData.setData(userId, warId, data);
    }
}

export async function getUnitStatistics(warId: number): Promise<Undefinable<MpwCommonGetUnitStatisticsResponse>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = getSelfUserId();
    if (userId != null) {
        const cachedData = await StoreMpwUnitStatistics.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getTimestamp() ?? 0) >= timestamp) {
                return cachedData;
            }
            return _unitStatisticsAccessor.getData(warId, true);
        }
    }

    return _unitStatisticsAccessor.getData(warId);
}
async function setUnitStatistics(warId: number, data: Undefinable<MpwCommonGetUnitStatisticsResponse>): Promise<void> {
    _unitStatisticsAccessor.setData(warId, data);

    const userId = getSelfUserId();
    if (userId != null) {
        await StoreMpwUnitStatistics.setData(userId, warId, data);
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
        getExisted(warData.getExecutedOperationManager()).setExecutedOperationArray(generateExecutedActions(warData));
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

        dispatch(TypeId.GridMarkListChanged, {
            war : war,
        } as GridMarkListChanged);
    }
}

export async function updateOnMsgMpwCommonBroadcastGameStart(data: MpwCommonBroadcastGameStartResponse): Promise<void> {
    const desc = await getGameStartDesc(data);
    openPanel(getDict().CommonConfirmPanel, {
        getTitle    : () => getText(TextType.B0392),
        getContent  : () => desc,
        callback    : async () => {
            openPanel(getDict().CommonBlockPanel, {
                title   : getText(TextType.B0088),
                content : getText(TextType.A0040),
            });

            const warData = await getOngoingWarData(data.getWarId() ?? 0);
            if (warData) {
                gotoMultiPlayerWar(warData);
            } else {
                showLang(TextType.YouCanNotDoThisRightNow);
            }

            closePanel(getDict().CommonBlockPanel);
        },
    });
}

export async function checkIsRedForMyMcwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypeId.McwFog, WarTypeId.McwStd]);
}
export async function checkIsRedForMyMrwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypeId.MrwFog, WarTypeId.MrwStd]);
}
export async function checkIsRedForMyMmwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypeId.MmwFog, WarTypeId.MmwStd]);
}
export async function checkIsRedForMyAtwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypeId.AtwFog, WarTypeId.AtwStd]);
}
export async function checkIsRedForMyMfwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypeId.MfwFog, WarTypeId.MfwStd]);
}
export async function checkIsRedForMyCcwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypeId.CcwFog, WarTypeId.CcwStd]);
}
export async function checkIsRedForMyWar(progressInfo: Undefinable<MpwWarProgressInfo>): Promise<boolean> {
    if (progressInfo == null) {
        return false;
    }

    const warSettings = await getWarSettings(progressInfo.getWarId() ?? 0);
    if (warSettings == null) {
        return false;
    }

    const selfUserId        = getSelfUserId();
    const playerIndexInTurn = progressInfo.getPlayerIndexInTurn() ?? 0;
    return warSettings.getPlayerInfoArray().some(v => (v.getPlayerIndex() === playerIndexInTurn) && (v.getUserId() === selfUserId));
}
export async function checkIsRedForAllMyWars(ignoreWarIdArray?: number[]): Promise<boolean> {
    const warIdSet = new Set(await getJoinedMpwIdArray());
    for (const warId of ignoreWarIdArray ?? []) {
        warIdSet.delete(warId);
    }

    return checkIsRedForMyWars([...warIdSet], [
        WarTypeId.McwFog, WarTypeId.McwStd,
        WarTypeId.MrwFog, WarTypeId.MrwStd,
        WarTypeId.MmwFog, WarTypeId.MmwStd,
        WarTypeId.AtwFog, WarTypeId.AtwStd,
        WarTypeId.MfwFog, WarTypeId.MfwStd,
        WarTypeId.CcwFog, WarTypeId.CcwStd,
    ]);
}
async function checkIsRedForMyWars(warIdArray: Undefinable<number[]>, warTypeArray: WarTypeId[]): Promise<boolean> {
    if (!warIdArray?.length) {
        return false;
    }
    return checkIsAnyPromiseTrue(warIdArray.map(async v => {
        const warType = await getWarType(v);
        return (warType != null)
            && (warTypeArray.indexOf(warType) >= 0)
            && (await checkIsRedForMyWar(await getWarProgressInfo(v)));
    }));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for war settings.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _warSettingsAccessor = new CachedDataAccessor<number, MpwWarSettings>({
    reqData : (warId: number) => reqMpwCommonGetWarSettings(warId),
});

export async function getWarSettings(warId: number): Promise<Undefinable<MpwWarSettings>> {
    return (await StoreMpwWarSettings.getData(warId)) ?? (_warSettingsAccessor.getData(warId));
}
function setWarSettings(warId: number, data: Undefinable<MpwWarSettings>): Promise<void> {
    _warSettingsAccessor.setData(warId, data);
    return StoreMpwWarSettings.setData(warId, data);
}

export async function getWarType(warId: number): Promise<Undefinable<WarTypeId>> {
    const warSettings = await getWarSettings(warId);
    return (warSettings == null)
        ? null
        : getWarTypeByMpwWarSettings(warSettings);
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
export async function createDataForCommonWarBasicSettingsPage(warId: Undefinable<number>): Promise<CommonWarBasicSettingsPageOpenData> {
    const warInfo = warId == null ? null : await getWarSettings(warId);
    if (warInfo == null) {
        return null;
    }

    const settingsForCommon = getExisted(warInfo.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
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
        throw newError(`Invalid warInfo.`);
    }
}
async function createDataForCommonWarBasicSettingsPageForMcw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMcw      : SettingsForMcw
): Promise<CommonWarBasicSettingsPageOpenData> {
    const bootTimerParams   = settingsForMcw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await getRawData(settingsForMcw.getNormalMapId()))?.getWarEventFullData();
    const openData          : CommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : BasicSettingsTypeId.NormalMapId,
                currentValue        : settingsForMcw.getNormalMapId(),
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarName,
                currentValue        : settingsForMcw.getWarName() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarPassword,
                currentValue        : settingsForMcw.getWarPassword() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarComment,
                currentValue        : settingsForMcw.getWarComment() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : BasicSettingsTypeId.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType        : BasicSettingsTypeId.TimerIncrementalParams,
                currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        );
    } else {
        throw newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMcw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForCcw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForCcw      : SettingsForCcw
): Promise<CommonWarBasicSettingsPageOpenData> {
    const bootTimerParams   = settingsForCcw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await getRawData(settingsForCcw.getNormalMapId()))?.getWarEventFullData();
    const openData          : CommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : BasicSettingsTypeId.NormalMapId,
                currentValue        : settingsForCcw.getNormalMapId(),
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarName,
                currentValue        : settingsForCcw.getWarName() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarPassword,
                currentValue        : settingsForCcw.getWarPassword() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarComment,
                currentValue        : settingsForCcw.getWarComment() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : BasicSettingsTypeId.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType        : BasicSettingsTypeId.TimerIncrementalParams,
                currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        );
    } else {
        throw newError(`MpwModel.createDataForCommonWarBasicSettingsPageForCcw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForMrw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMrw      : SettingsForMrw
): Promise<CommonWarBasicSettingsPageOpenData> {
    const bootTimerParams = settingsForMrw.getBootTimerParams().concat();
    if (!bootTimerParams.length) {
        bootTimerParams.push(...DefaultParams);
    }

    const timerType         = bootTimerParams[0] as TimerTypeId;
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await getRawData(settingsForMrw.getNormalMapId()))?.getWarEventFullData();
    const openData          : CommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : BasicSettingsTypeId.NormalMapId,
                currentValue        : settingsForMrw.getNormalMapId(),
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : BasicSettingsTypeId.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push({
            settingsType        : BasicSettingsTypeId.TimerIncrementalParams,
            currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else {
        throw newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMrw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForMmw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMmw      : SettingsForMmw
): Promise<CommonWarBasicSettingsPageOpenData> {
    const bootTimerParams = settingsForMmw.getBootTimerParams().concat();
    if (!bootTimerParams.length) {
        bootTimerParams.push(...DefaultParams);
    }

    const timerType         = bootTimerParams[0] as TimerTypeId;
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await getRawData(settingsForMmw.getNormalMapId()))?.getWarEventFullData();
    const openData          : CommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : BasicSettingsTypeId.NormalMapId,
                currentValue        : settingsForMmw.getNormalMapId(),
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType    : BasicSettingsTypeId.TimerType,
                currentValue    : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : BasicSettingsTypeId.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType        : BasicSettingsTypeId.TimerIncrementalParams,
                currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        );
    } else {
        throw newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMmw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForAtw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForAtw      : SettingsForAtw
): Promise<CommonWarBasicSettingsPageOpenData> {
    const bootTimerParams   = DefaultParams.concat();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await getRawData(settingsForAtw.getNormalMapId()))?.getWarEventFullData();
    const openData          : CommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : BasicSettingsTypeId.NormalMapId,
                currentValue        : settingsForAtw.getNormalMapId(),
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : BasicSettingsTypeId.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push({
            settingsType        : BasicSettingsTypeId.TimerIncrementalParams,
            currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else {
        throw newError(`MpwModel.createDataForCommonWarBasicSettingsPageForAtw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForMfw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMfw      : SettingsForMfw
): Promise<CommonWarBasicSettingsPageOpenData> {
    const bootTimerParams   = settingsForMfw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = instanceWarRule.getWarEventFullData();
    const openData          : CommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : BasicSettingsTypeId.WarName,
                currentValue        : settingsForMfw.getWarName() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarPassword,
                currentValue        : settingsForMfw.getWarPassword() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarComment,
                currentValue        : settingsForMfw.getWarComment() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : BasicSettingsTypeId.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push({
            settingsType        : BasicSettingsTypeId.TimerIncrementalParams,
            currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else {
        throw newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMfw() invalid timerType.`);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(warId: Undefinable<number>): Promise<CommonWarAdvancedSettingsPageOpenData> {
    const mpwWarSettings = warId == null ? null : await getWarSettings(warId);
    if (mpwWarSettings == null) {
        return null;
    }

    const settingsForCommon = getExisted(mpwWarSettings.getSettingsForCommon());
    return {
        canModify       : false,
        gcData          : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : getExisted(settingsForCommon.getInstanceWarRule()),
        gameModeId      : getExisted(getGameModeIdByMpwWarSettings(mpwWarSettings)),
    };
}

export async function createDataForCommonWarPlayerInfoPage(warId: Undefinable<number>): Promise<CommonWarPlayerInfoPageOpenData> {
    const warSettings = warId == null ? null : await getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const warProgressInfo = warId == null ? null : await getWarProgressInfo(warId);
    if (warProgressInfo == null) {
        return null;
    }

    const settingsForCommon     = getExisted(warSettings.getSettingsForCommon());
    const instanceWarRule       = getExisted(settingsForCommon.getInstanceWarRule());
    const playerStaticInfoArray = warSettings.getPlayerInfoArray();
    const warRuleCommonData     = getExisted(instanceWarRule.getWarRuleCommonData());
    const playerInfoArray       : PlayerInfo[] = [];
    for (const playerProgressInfo of warProgressInfo.getPlayerInfoList()) {
        const playerIndex       = getExisted(playerProgressInfo.getPlayerIndex());
        const playerStaticInfo  = getExisted(playerStaticInfoArray.find(v => v.getPlayerIndex() === playerIndex));
        const userId            = playerStaticInfo.getUserId() ?? null;
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi                : userId == null,
            userId              : userId,
            coId                : playerStaticInfo.getCoId() ?? 0,
            unitAndTileSkinId   : playerStaticInfo.getUnitAndTileSkinId() ?? 0,
            isReady             : null,
            isInTurn            : playerIndex === warProgressInfo.getPlayerIndexInTurn(),
            isDefeat            : !playerProgressInfo.getIsAlive(),
            restTimeToBoot      : playerProgressInfo.getRestTimeToBoot() ?? null,
        });
    }

    return {
        gameConfig              : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
        playersCountUnneutral   : getPlayersCountUnneutral(warRuleCommonData),
        roomOwnerPlayerIndex    : null,
        callbackOnDeletePlayer  : null,
        callbackOnExitRoom      : null,
        callbackOnAddDummy      : null,
        callbackOnChangeDummy   : null,
        playerInfoArray         : playerInfoArray,
        enterTurnTime           : warProgressInfo.getEnterTurnTime() ?? null,
        isReplay                : false,
    };
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for managing war.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function loadWar(data: SerialWar): Promise<IMpwWar> {
    if (getWar()) {
        warn(`MpwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const war = createWarByWarData(data);
    war.init(data, await getGameConfig(getExisted(data.getSettingsForCommon()?.getConfigVersion())));
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

export function getWar(): Undefinable<IMpwWar> {
    return _war;
}
function _setWar(war: Undefinable<IMpwWar>): void {
    _war = war;
}

function _onNotifyMsgMpwWatchGetIncomingInfo(e: Event): void {
    const data  = e.data as MpwWatchGetIncomingInfoResponse;
    const war   = getWar();
    if (war?.getWarId() !== getExisted(data.getWarId())) {
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
function _onNotifyMsgMpwWatchGetOutgoingInfo(e: Event): void {
    const data  = e.data as MpwWatchGetOutgoingInfoResponse;
    const war   = getWar();
    if (war?.getWarId() !== getExisted(data.getWarId())) {
        return;
    }

    const info = data.getOutgoingInfo();
    if (info == null) {
        return;
    }

    const selfUserId            = getExisted(getSelfUserId());
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
            reqMpwCommonSyncWar(war, SyncRequestTypeId.ReconnectionRequest);
        } else {
            _cachedActions.push(container);
            checkAndSyncWarOrRunCachedAction(war, _cachedActions);
        }
    }
}

async function checkAndSyncWarOrRunCachedAction(war: IMpwWar, actionList: WoContainer[]): Promise<void> {
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

        const status    = syncWarData.getStatus() as SyncStatusId;
        const warData   = syncWarData.getWar();
        if (status === SyncStatusId.EndedOrNotExists) {
            war.setIsEnded(true);
            openPanel(getDict().CommonAlertPanel, {
                getTitle   : () => getText(TextType.B0088),
                getContent : () => getText(TextType.A0035),
                callback: () => {
                    gotoMyWarListPanel(war.getWarType());
                },
            });
            return;

        } else if (status === SyncStatusId.NotJoined) {
            war.setIsEnded(true);
            openPanel(getDict().CommonAlertPanel, {
                getTitle   : () => getText(TextType.B0088),
                getContent : () => getText(TextType.A0037),
                callback: () => {
                    gotoMyWarListPanel(war.getWarType());
                },
            });
            return;

        } else if (status === SyncStatusId.NoError) {
            const requestType = syncWarData.getRequestType() as SyncRequestTypeId;
            if (requestType === SyncRequestTypeId.PlayerForce) {
                war.setIsEnded(true);
                if (warData == null) {
                    throw newError(`MpwModel.updateOnPlayerSyncWar() empty warData 1.`);
                } else {
                    await gotoMultiPlayerWar(warData);
                    showLang(TextType.A0038);
                }
                return;

            } else {
                if (syncWarData.getExecutedActionsCount() !== executedActionsCount + cachedActionsCount) {
                    war.setIsEnded(true);
                    if (warData == null) {
                        throw newError(`MpwModel.updateOnPlayerSyncWar() empty warData 2.`);
                    } else {
                        await gotoMultiPlayerWar(warData);
                        showLang(TextType.A0036);
                    }
                    return;

                } else {
                    if (requestType === SyncRequestTypeId.PlayerRequest) {
                        showLang(TextType.A0038);
                    } else {
                        // Nothing to do.
                    }
                    break;
                }
            }

        } else if (status === SyncStatusId.Synchronized) {
            const requestType = syncWarData.getRequestType() as SyncRequestTypeId;
            if (requestType === SyncRequestTypeId.PlayerRequest) {
                showLang(TextType.A0038);
            } else {
                // Nothing to do.
            }
            break;

        } else {
            // Something wrong!!
            war.setIsEnded(true);
            openPanel(getDict().CommonAlertPanel, {
                getTitle   : () => getText(TextType.B0088),
                getContent : () => getText(TextType.A0037),
                callback: () => gotoLobby(),
            });
            return;
        }
    }

    const container = actionList.shift();
    if (container == null) {
        return;
    }

    await checkAndExecute(war, container, false);

    if (!war.getIsEnded()) {
        if (war.getIsRunning()) {
            checkAndSyncWarOrRunCachedAction(war, actionList);
        }
    } else {
        const callbackForGoBack = () => gotoMyWarListPanel(war.getWarType());
        const callbackForReplay = () => gotoRwReplayListPanel();
        if (war.getDrawVoteManager().checkIsDraw()) {
            openPanel(getDict().CommonConfirmPanel, {
                getTitle            : () => getText(TextType.B0088),
                getContent          : () => getText(TextType.A0030),
                getTextForConfirm   : () => getText(TextType.B0588),
                callback            : callbackForGoBack,
                getTextForCancel    : () => getText(TextType.B0092),
                callbackOnCancel    : callbackForReplay,
            });
        } else {
            const selfUserId = getExisted(getSelfUserId());
            const selfPlayer = war.getPlayerManager().getPlayerByUserId(selfUserId);
            if (selfPlayer == null) {
                openPanel(getDict().CommonConfirmPanel, {
                    getTitle            : () => getText(TextType.B0088),
                    getContent          : () => getText(TextType.A0035),
                    getTextForConfirm   : () => getText(TextType.B0588),
                    callback            : callbackForGoBack,
                    getTextForCancel    : () => getText(TextType.B0092),
                    callbackOnCancel    : callbackForReplay,
                });
            } else {
                openPanel(getDict().CommonConfirmPanel, {
                    getTitle            : () => getText(TextType.B0088),
                    getContent          : () => selfPlayer.getAliveState() === AliveStateId.Dead ? getText(TextType.A0023) : getText(TextType.A0022),
                    getTextForConfirm   : () => getText(TextType.B0588),
                    callback            : callbackForGoBack,
                    getTextForCancel    : () => getText(TextType.B0092),
                    callbackOnCancel    : callbackForReplay,
                });
            }
        }
    }
}

function createWarByWarData(data: SerialWar): IMpwWar {
    if (data.getSettingsForMcw()) {
        return new (getMcwWarClass())();
    } else if (data.getSettingsForMrw()) {
        return new (getMrwWarClass())();
    } else if (data.getSettingsForMfw()) {
        return new (getMfwWarClass())();
    } else if (data.getSettingsForCcw()) {
        return new (getCcwWarClass())();
    } else if (data.getSettingsForMmw()) {
        return new (getMmwWarClass())();
    } else if (data.getSettingsForAtw()) {
        return new (getAtwWarClass())();
    } else {
        throw newError(`Invalid data.`);
    }
}

async function getGameStartDesc(data: MpwCommonBroadcastGameStartResponse): Promise<string> {
    const playerArray   : string[] = [];
    let playerIndex     = PlayerIndex.First;
    for (const playerInfo of data.getPlayerInfoList()) {
        const userId = playerInfo.getUserId();
        playerArray.push(`P${playerIndex}: ${userId != null ? await getUserNickname(userId) : `----`}`);
        ++playerIndex;
    }

    const normalMapId = data.getNormalMapId();
    return [
        getFormattedText(TextType.F0027, normalMapId != null
            ? await getMapNameInCurrentLanguage(normalMapId)
            : getText(TextType.B0557)),
        ...playerArray,
        getText(TextType.A0125)
    ].join("\n");
}
