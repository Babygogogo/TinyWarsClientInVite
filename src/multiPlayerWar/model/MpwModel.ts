import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import type * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GameModesUtils from "../../gameModes/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HalfwayReplayWarModelHrwModel from "../../halfwayReplayWar/model/HrwModel.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as Logger2 from "../../Logger.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../interface/IMpwWar.ts";
import * as MultiPlayerWarModelMpwModel from "./MpwModel.ts";
import * as MultiPlayerWarModelMpwProxy from "./MpwProxy.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as NotificationsTypes from "../../notifications/Types.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoMultiPlayerWarMpwWarProgressInfo from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarProgressInfo.ts";
import type * as ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettings from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonBroadcastGameStartS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonBroadcastGameStart/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonContinueWarS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonContinueWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetHalfwayReplayDataS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetHalfwayReplayData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetJoinedMpwIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetJoinedMpwIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarProgressInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarProgressInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarSettings/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarTimestampS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetWarTimestamp/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonMarkGridS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonMarkGrid/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetGridMarkListS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetGridMarkList/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetHiddenGridMarkTypeIdListS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSetHiddenGridMarkTypeIdList/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonSyncWarS from "../../proto/schema/CommonProto/NetMessage/MsgMpwCommonSyncWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetIncomingInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetIncomingInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOutgoingInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOutgoingInfo/S.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForAtw from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForCcw from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForCommon from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMcw from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMfw from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMmw from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMrw from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";
import * as UsersModel from "../../users/Model.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";
import * as WarOperationsExecutorsExecutor from "../../warOperations/executors/Executor.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarSettingsUtilsMpwWarSettings from "../../warSettings/utils/MpwWarSettings.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

type Undefinable<T>                             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type WoContainer                                = ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer;
type InstanceWarRule                            = ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule;
type SerialWar                                  = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type MpwWarSettings                             = ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettings.MpwWarSettings;
type MpwWarProgressInfo                         = ProtoSchemaCommonProtoMultiPlayerWarMpwWarProgressInfo.MpwWarProgressInfo;
type SettingsForCommon                          = ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon;
type SettingsForMcw                             = ProtoSchemaCommonProtoWarSettingsSettingsForMcw.SettingsForMcw;
type SettingsForCcw                             = ProtoSchemaCommonProtoWarSettingsSettingsForCcw.SettingsForCcw;
type SettingsForMrw                             = ProtoSchemaCommonProtoWarSettingsSettingsForMrw.SettingsForMrw;
type SettingsForMmw                             = ProtoSchemaCommonProtoWarSettingsSettingsForMmw.SettingsForMmw;
type SettingsForAtw                             = ProtoSchemaCommonProtoWarSettingsSettingsForAtw.SettingsForAtw;
type SettingsForMfw                             = ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw;

const _NOTIFY_LISTENERS     : NotificationsTypes.Listener[] = [
    { type: NotificationsTypeId.TypeId.MsgMpwWatchGetIncomingInfo,      callback: _onNotifyMsgMpwWatchGetIncomingInfo },
    { type: NotificationsTypeId.TypeId.MsgMpwWatchGetOutgoingInfo,      callback: _onNotifyMsgMpwWatchGetOutgoingInfo },
];

const _joinedMpwIdArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData         : () => MultiPlayerWarModelMpwProxy.reqMpwCommonGetJoinedMpwIdArray(),
});
const _warTimestampAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, number>({
    reqData         : warId => MultiPlayerWarModelMpwProxy.reqMpwCommonGetWarTimestamp(warId),
    dataExpireTime  : 30,
});
const _warProgressInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, MpwWarProgressInfo>({
    reqData         : (warId: number) => MultiPlayerWarModelMpwProxy.reqMpwCommonGetWarProgressInfo(warId),
});
const _ongoingWarDataAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, SerialWar>({
    reqData         : warId => MultiPlayerWarModelMpwProxy.reqMpwCommonContinueWar(warId),
});
const _halfwayReplayDataAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, SerialWar>({
    reqData         : warId => MultiPlayerWarModelMpwProxy.reqMpwCommonGetHalfwayReplayData(warId),
});
const _unitStatisticsAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS.S>({
    reqData         : warId => MultiPlayerWarModelMpwProxy.reqMpwCommonGetUnitStatistics(warId),
});

const _cachedActions        : WoContainer[] = [];
let _war                    : Undefinable<MultiPlayerWarInterfaceIMpwWar.IMpwWar>;
let _cachedSyncWarData      : Undefinable<ProtoSchemaCommonProtoNetMessageMsgMpwCommonSyncWarS.S>;

export function init(): void {
    NotificationsDispatcher.addEventListeners(_NOTIFY_LISTENERS, MultiPlayerWarModelMpwModel);
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

    const cachedData = await LocalDataStorage2.StoreMpwWarProgressInfo.getData(warId);
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
    return LocalDataStorage2.StoreMpwWarProgressInfo.setData(warId, data);
}

export async function getOngoingWarData(warId: number): Promise<Undefinable<SerialWar>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalDataStorage2.StoreMpwOngoingWarData.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getModifiedTime() ?? 0) >= timestamp) {
                return cachedData;
            }
            return _ongoingWarDataAccessor.getData(warId, true);
        }
    }

    return _ongoingWarDataAccessor.getData(warId);
}
async function setOngoingWarData(warId: number, data: Undefinable<SerialWar>): Promise<void> {
    _ongoingWarDataAccessor.setData(warId, data);

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        await LocalDataStorage2.StoreMpwOngoingWarData.setData(userId, warId, data);
    }
}

export async function getHalfwayReplayData(warId: number): Promise<Undefinable<SerialWar>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalDataStorage2.StoreMpwHalfwayReplayData.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getModifiedTime() ?? 0) >= timestamp) {
                return cachedData;
            }
            return _halfwayReplayDataAccessor.getData(warId, true);
        }
    }

    return _halfwayReplayDataAccessor.getData(warId);
}
async function setHalfwayReplayData(warId: number, data: Undefinable<SerialWar>): Promise<void> {
    _halfwayReplayDataAccessor.setData(warId, data);

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        await LocalDataStorage2.StoreMpwHalfwayReplayData.setData(userId, warId, data);
    }
}

export async function getUnitStatistics(warId: number): Promise<Undefinable<ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS.S>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalDataStorage2.StoreMpwUnitStatistics.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getTimestamp() ?? 0) >= timestamp) {
                return cachedData;
            }
            return _unitStatisticsAccessor.getData(warId, true);
        }
    }

    return _unitStatisticsAccessor.getData(warId);
}
async function setUnitStatistics(warId: number, data: Undefinable<ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS.S>): Promise<void> {
    _unitStatisticsAccessor.setData(warId, data);

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        await LocalDataStorage2.StoreMpwUnitStatistics.setData(userId, warId, data);
    }
}

export function updateOnMsgMpwCommonGetJoinedMpwIdArray(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetJoinedMpwIdArrayS.S): void {
    setJoinedMpwIdArray(data.getWarIdArray());
}

export function updateOnMsgMpwCommonGetWarTimestamp(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarTimestampS.S): void {
    setWarTimestamp(data.getWarId() ?? 0, data.getTimestamp());
}
export function updateOnFailedMsgMpwCommonGetWarTimestamp(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarTimestampS.S): void {
    const warId = data.getWarId();
    if (warId != null) {
        _warTimestampAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonGetWarProgressInfo(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarProgressInfoS.S): Promise<void> {
    return setWarProgressInfo(data.getWarId() ?? 0, data.getWarProgressInfo());
}
export function updateOnFailedMsgMpwCommonGetWarProgressInfo(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarProgressInfoS.S): void {
    const warId = data.getWarId();
    if (warId != null) {
        _warProgressInfoAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonContinueWar(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonContinueWarS.S): Promise<void> {
    return setOngoingWarData(data.getWarId() ?? 0, data.getWar());
}
export function updateOnFailedMsgMpwCommonContinueWar(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonContinueWarS.S): void {
    const warId = data.getWarId();
    if (warId != null) {
        _ongoingWarDataAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonGetHalfwayReplayData(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetHalfwayReplayDataS.S): Promise<void> {
    const warData = data.getWarData()?.clone();
    if (warData) {
        HelpersMisc.getExisted(warData.getExecutedOperationManager()).setExecutedOperationArray(HalfwayReplayWarModelHrwModel.generateExecutedActions(warData));
    }
    return setHalfwayReplayData(data.getWarId() ?? 0, warData);
}
export function updateOnFailedMsgMpwCommonGetHalfwayReplayData(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetHalfwayReplayDataS.S): void {
    const warId = data.getWarId();
    if (warId != null) {
        _halfwayReplayDataAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonGetUnitStatistics(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS.S): Promise<void> {
    return setUnitStatistics(data.getWarId() ?? 0, data);
}
export function updateOnFailedMsgMpwCommonGetUnitStatistics(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS.S): void {
    const warId = data.getWarId();
    if (warId != null) {
        _halfwayReplayDataAccessor.updateOnRequestFailed(warId);
    }
}

export function updateOnMsgMpwCommonMarkGrid(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonMarkGridS.S): void {
    const war = getWar();
    if (war?.getWarId() === data.getWarId()) {
        war.getPlayerLoggedIn()?.updateGridMarkList(data.getGridIdArrayForAddMark(), data.getGridIdArrayForDeleteMark(), data.getMarkTypeId());
    }
}

export function updateOnMsgMpwCommonSetHiddenGridMarkTypeIdList(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetHiddenGridMarkTypeIdListS.S): void {
    const war = getWar();
    if (war?.getWarId() === data.getWarId()) {
        war.getPlayerLoggedIn()?.updateHiddenGridMarkTypeIdList(data.getHiddenGridMarkTypeIdList());
    }
}

export function updateOnMsgMpwCommonSetGridMarkList(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonSetGridMarkListS.S): void {
    const war = getWar();
    if (war?.getWarId() === data.getWarId()) {
        war.getPlayerLoggedIn()?.setGridMarkList(data.getGridMarkList());

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.GridMarkListChanged, {
            war : war,
        } as NotificationsDataTypes.GridMarkListChanged);
    }
}

export async function updateOnMsgMpwCommonBroadcastGameStart(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonBroadcastGameStartS.S): Promise<void> {
    const desc = await getGameStartDesc(data);
    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
        getTitle    : () => LangUtils.getText(LangConstants.TextType.B0392),
        getContent  : () => desc,
        callback    : async () => {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonBlockPanel, {
                title   : LangUtils.getText(LangConstants.TextType.B0088),
                content : LangUtils.getText(LangConstants.TextType.A0040),
            });

            const warData = await getOngoingWarData(data.getWarId() ?? 0);
            if (warData) {
                HelpersGameFlow.gotoMultiPlayerWar(warData);
            } else {
                FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            }

            GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonBlockPanel);
        },
    });
}

export async function checkIsRedForMyMcwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypesConstants.WarTypeId.McwFog, WarTypesConstants.WarTypeId.McwStd]);
}
export async function checkIsRedForMyMrwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypesConstants.WarTypeId.MrwFog, WarTypesConstants.WarTypeId.MrwStd]);
}
export async function checkIsRedForMyMmwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypesConstants.WarTypeId.MmwFog, WarTypesConstants.WarTypeId.MmwStd]);
}
export async function checkIsRedForMyAtwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypesConstants.WarTypeId.AtwFog, WarTypesConstants.WarTypeId.AtwStd]);
}
export async function checkIsRedForMyMfwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypesConstants.WarTypeId.MfwFog, WarTypesConstants.WarTypeId.MfwStd]);
}
export async function checkIsRedForMyCcwWars(): Promise<boolean> {
    return checkIsRedForMyWars(await getJoinedMpwIdArray(), [WarTypesConstants.WarTypeId.CcwFog, WarTypesConstants.WarTypeId.CcwStd]);
}
export async function checkIsRedForMyWar(progressInfo: Undefinable<MpwWarProgressInfo>): Promise<boolean> {
    if (progressInfo == null) {
        return false;
    }

    const warSettings = await getWarSettings(progressInfo.getWarId() ?? 0);
    if (warSettings == null) {
        return false;
    }

    const selfUserId        = UsersModel.getSelfUserId();
    const playerIndexInTurn = progressInfo.getPlayerIndexInTurn() ?? 0;
    return warSettings.getPlayerInfoArray().some(v => (v.getPlayerIndex() === playerIndexInTurn) && (v.getUserId() === selfUserId)) ?? false;
}
export async function checkIsRedForAllMyWars(ignoreWarIdArray?: number[]): Promise<boolean> {
    const warIdSet = new Set(await getJoinedMpwIdArray());
    for (const warId of ignoreWarIdArray ?? []) {
        warIdSet.delete(warId);
    }

    return checkIsRedForMyWars([...warIdSet], [
        WarTypesConstants.WarTypeId.McwFog, WarTypesConstants.WarTypeId.McwStd,
        WarTypesConstants.WarTypeId.MrwFog, WarTypesConstants.WarTypeId.MrwStd,
        WarTypesConstants.WarTypeId.MmwFog, WarTypesConstants.WarTypeId.MmwStd,
        WarTypesConstants.WarTypeId.AtwFog, WarTypesConstants.WarTypeId.AtwStd,
        WarTypesConstants.WarTypeId.MfwFog, WarTypesConstants.WarTypeId.MfwStd,
        WarTypesConstants.WarTypeId.CcwFog, WarTypesConstants.WarTypeId.CcwStd,
    ]);
}
async function checkIsRedForMyWars(warIdArray: Undefinable<number[]>, warTypeArray: WarTypesConstants.WarTypeId[]): Promise<boolean> {
    if (!warIdArray?.length) {
        return false;
    }
    return HelpersMisc.checkIsAnyPromiseTrue(warIdArray.map(async v => {
        const warType = await getWarType(v);
        return (warType != null)
            && (warTypeArray.indexOf(warType) >= 0)
            && (await checkIsRedForMyWar(await getWarProgressInfo(v)));
    }));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for war settings.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _warSettingsAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, MpwWarSettings>({
    reqData : (warId: number) => MultiPlayerWarModelMpwProxy.reqMpwCommonGetWarSettings(warId),
});

export async function getWarSettings(warId: number): Promise<Undefinable<MpwWarSettings>> {
    return (await LocalDataStorage2.StoreMpwWarSettings.getData(warId)) ?? (_warSettingsAccessor.getData(warId));
}
function setWarSettings(warId: number, data: Undefinable<MpwWarSettings>): Promise<void> {
    _warSettingsAccessor.setData(warId, data);
    return LocalDataStorage2.StoreMpwWarSettings.setData(warId, data);
}

export async function getWarType(warId: number): Promise<Undefinable<WarTypesConstants.WarTypeId>> {
    const warSettings = await getWarSettings(warId);
    return (warSettings == null)
        ? null
        : WarSettingsUtilsMpwWarSettings.getWarTypeByMpwWarSettings(warSettings);
}

export function updateOnMsgMpwCommonGetWarSettings(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarSettingsS.S): Promise<void> {
    return setWarSettings(data.getWarId() ?? 0, data.getWarSettings());
}
export function updateOnFailedMsgMpwCommonGetWarSettings(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetWarSettingsS.S): void {
    const warId = data.getWarId();
    if (warId != null) {
        _warSettingsAccessor.updateOnRequestFailed(warId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDataForCommonWarBasicSettingsPage(warId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
    const warInfo = warId == null ? null : await getWarSettings(warId);
    if (warInfo == null) {
        return null;
    }

    const settingsForCommon = HelpersMisc.getExisted(warInfo.getSettingsForCommon());
    const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
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
        throw HelpersMisc.newError(`Invalid warInfo.`);
    }
}
async function createDataForCommonWarBasicSettingsPageForMcw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMcw      : SettingsForMcw
): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams   = settingsForMcw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMapModelNormalMapModel.getRawData(settingsForMcw.getNormalMapId() ?? 0))?.getWarEventFullData();
    const openData          : CommonViewCommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.NormalMapId,
                currentValue        : settingsForMcw.getNormalMapId() ?? 0,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarName,
                currentValue        : settingsForMcw.getWarName() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarPassword,
                currentValue        : settingsForMcw.getWarPassword() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarComment,
                currentValue        : settingsForMcw.getWarComment() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === BootTimersConstants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : GameConfigGcWar.BasicSettingsType.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TimerIncrementalParams,
                currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        );
    } else {
        throw HelpersMisc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMcw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForCcw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForCcw      : SettingsForCcw
): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams   = settingsForCcw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMapModelNormalMapModel.getRawData(settingsForCcw.getNormalMapId() ?? 0))?.getWarEventFullData();
    const openData          : CommonViewCommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.NormalMapId,
                currentValue        : settingsForCcw.getNormalMapId() ?? 0,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarName,
                currentValue        : settingsForCcw.getWarName() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarPassword,
                currentValue        : settingsForCcw.getWarPassword() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarComment,
                currentValue        : settingsForCcw.getWarComment() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === BootTimersConstants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : GameConfigGcWar.BasicSettingsType.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TimerIncrementalParams,
                currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        );
    } else {
        throw HelpersMisc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForCcw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForMrw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMrw      : SettingsForMrw
): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams = settingsForMrw.getBootTimerParams().concat();
    if (!bootTimerParams.length) {
        bootTimerParams.push(...BootTimersConstants.DefaultParams);
    }

    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMapModelNormalMapModel.getRawData(settingsForMrw.getNormalMapId() ?? 0))?.getWarEventFullData();
    const openData          : CommonViewCommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.NormalMapId,
                currentValue        : settingsForMrw.getNormalMapId() ?? 0,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === BootTimersConstants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : GameConfigGcWar.BasicSettingsType.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push({
            settingsType        : GameConfigGcWar.BasicSettingsType.TimerIncrementalParams,
            currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else {
        throw HelpersMisc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMrw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForMmw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMmw      : SettingsForMmw
): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams = settingsForMmw.getBootTimerParams().concat();
    if (!bootTimerParams.length) {
        bootTimerParams.push(...BootTimersConstants.DefaultParams);
    }

    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMapModelNormalMapModel.getRawData(settingsForMmw.getNormalMapId() ?? 0))?.getWarEventFullData();
    const openData          : CommonViewCommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.NormalMapId,
                currentValue        : settingsForMmw.getNormalMapId() ?? 0,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.TimerType,
                currentValue    : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === BootTimersConstants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : GameConfigGcWar.BasicSettingsType.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TimerIncrementalParams,
                currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        );
    } else {
        throw HelpersMisc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMmw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForAtw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForAtw      : SettingsForAtw
): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams   = BootTimersConstants.DefaultParams.concat();
    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await NormalMapModelNormalMapModel.getRawData(settingsForAtw.getNormalMapId() ?? 0))?.getWarEventFullData();
    const openData          : CommonViewCommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.NormalMapId,
                currentValue        : settingsForAtw.getNormalMapId() ?? 0,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === BootTimersConstants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : GameConfigGcWar.BasicSettingsType.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push({
            settingsType        : GameConfigGcWar.BasicSettingsType.TimerIncrementalParams,
            currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else {
        throw HelpersMisc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForAtw() invalid timerType.`);
    }

    return openData;
}
async function createDataForCommonWarBasicSettingsPageForMfw(
    instanceWarRule     : InstanceWarRule,
    settingsForCommon   : SettingsForCommon,
    settingsForMfw      : SettingsForMfw
): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
    const bootTimerParams   = settingsForMfw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = instanceWarRule.getWarEventFullData();
    const openData          : CommonViewCommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings    : [
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarName,
                currentValue        : settingsForMfw.getWarName() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarPassword,
                currentValue        : settingsForMfw.getWarPassword() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarComment,
                currentValue        : settingsForMfw.getWarComment() ?? null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === BootTimersConstants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : GameConfigGcWar.BasicSettingsType.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push({
            settingsType        : GameConfigGcWar.BasicSettingsType.TimerIncrementalParams,
            currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else {
        throw HelpersMisc.newError(`MpwModel.createDataForCommonWarBasicSettingsPageForMfw() invalid timerType.`);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(warId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
    const mpwWarSettings = warId == null ? null : await getWarSettings(warId);
    if (mpwWarSettings == null) {
        return null;
    }

    const settingsForCommon = HelpersMisc.getExisted(mpwWarSettings.getSettingsForCommon());
    return {
        canModify       : false,
        gcData          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule()),
        gameModeId      : HelpersMisc.getExisted(GameModesUtils.getGameModeIdByMpwWarSettings(mpwWarSettings)),
    };
}

export async function createDataForCommonWarPlayerInfoPage(warId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
    const warSettings = warId == null ? null : await getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const warProgressInfo = warId == null ? null : await getWarProgressInfo(warId);
    if (warProgressInfo == null) {
        return null;
    }

    const settingsForCommon     = HelpersMisc.getExisted(warSettings.getSettingsForCommon());
    const instanceWarRule       = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
    const playerStaticInfoArray = HelpersMisc.getExisted(warSettings.getPlayerInfoArray());
    const warRuleCommonData     = HelpersMisc.getExisted(instanceWarRule.getWarRuleCommonData());
    const playerInfoArray       : AuxiliaryTypesAuxiliaryTypes.PlayerInfo[] = [];
    for (const playerProgressInfo of warProgressInfo.getPlayerInfoList()) {
        const playerIndex       = HelpersMisc.getExisted(playerProgressInfo.getPlayerIndex());
        const playerStaticInfo  = HelpersMisc.getExisted(playerStaticInfoArray.find(v => v.getPlayerIndex() === playerIndex));
        const userId            = playerStaticInfo.getUserId() ?? null;
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
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
        gameConfig              : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())),
        playersCountUnneutral   : WarRulesUtilsCommonData.getPlayersCountUnneutral(warRuleCommonData),
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
export async function loadWar(data: SerialWar): Promise<MultiPlayerWarInterfaceIMpwWar.IMpwWar> {
    if (getWar()) {
        Logger2.warn(`MpwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const war = createWarByWarData(data);
    war.init(data, await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(data.getSettingsForCommon()?.getConfigVersion())));
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

export function getWar(): Undefinable<MultiPlayerWarInterfaceIMpwWar.IMpwWar> {
    return _war;
}
function _setWar(war: Undefinable<MultiPlayerWarInterfaceIMpwWar.IMpwWar>): void {
    _war = war;
}

function _onNotifyMsgMpwWatchGetIncomingInfo(e: VendorEgretEgret.Event): void {
    const data  = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetIncomingInfoS.S;
    const war   = getWar();
    if (war?.getWarId() !== HelpersMisc.getExisted(data.getWarId())) {
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
function _onNotifyMsgMpwWatchGetOutgoingInfo(e: VendorEgretEgret.Event): void {
    const data  = e.data as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOutgoingInfoS.S;
    const war   = getWar();
    if (war?.getWarId() !== HelpersMisc.getExisted(data.getWarId())) {
        return;
    }

    const info = data.getOutgoingInfo();
    if (info == null) {
        return;
    }

    const selfUserId            = HelpersMisc.getExisted(UsersModel.getSelfUserId());
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
export function updateOnPlayerSyncWar(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonSyncWarS.S): void {
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
            MultiPlayerWarModelMpwProxy.reqMpwCommonSyncWar(war, GameConfigGcWar.SyncRequestType.ReconnectionRequest);
        } else {
            _cachedActions.push(container);
            checkAndSyncWarOrRunCachedAction(war, _cachedActions);
        }
    }
}

async function checkAndSyncWarOrRunCachedAction(war: MultiPlayerWarInterfaceIMpwWar.IMpwWar, actionList: WoContainer[]): Promise<void> {
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

        const status    = syncWarData.getStatus() as GameConfigGcWar.SyncStatus;
        const warData   = syncWarData.getWar();
        if (status === GameConfigGcWar.SyncStatus.EndedOrNotExists) {
            war.setIsEnded(true);
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                getTitle   : () => LangUtils.getText(LangConstants.TextType.B0088),
                getContent : () => LangUtils.getText(LangConstants.TextType.A0035),
                callback: () => {
                    HelpersGameFlow.gotoMyWarListPanel(war.getWarType());
                },
            });
            return;

        } else if (status === GameConfigGcWar.SyncStatus.NotJoined) {
            war.setIsEnded(true);
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                getTitle   : () => LangUtils.getText(LangConstants.TextType.B0088),
                getContent : () => LangUtils.getText(LangConstants.TextType.A0037),
                callback: () => {
                    HelpersGameFlow.gotoMyWarListPanel(war.getWarType());
                },
            });
            return;

        } else if (status === GameConfigGcWar.SyncStatus.NoError) {
            const requestType = syncWarData.getRequestType() as GameConfigGcWar.SyncRequestType;
            if (requestType === GameConfigGcWar.SyncRequestType.PlayerForce) {
                war.setIsEnded(true);
                if (warData == null) {
                    throw HelpersMisc.newError(`MpwModel.updateOnPlayerSyncWar() empty warData 1.`);
                } else {
                    await HelpersGameFlow.gotoMultiPlayerWar(warData);
                    FloatText2.showLang(LangConstants.TextType.A0038);
                }
                return;

            } else {
                if (syncWarData.getExecutedActionsCount() !== executedActionsCount + cachedActionsCount) {
                    war.setIsEnded(true);
                    if (warData == null) {
                        throw HelpersMisc.newError(`MpwModel.updateOnPlayerSyncWar() empty warData 2.`);
                    } else {
                        await HelpersGameFlow.gotoMultiPlayerWar(warData);
                        FloatText2.showLang(LangConstants.TextType.A0036);
                    }
                    return;

                } else {
                    if (requestType === GameConfigGcWar.SyncRequestType.PlayerRequest) {
                        FloatText2.showLang(LangConstants.TextType.A0038);
                    } else {
                        // Nothing to do.
                    }
                    break;
                }
            }

        } else if (status === GameConfigGcWar.SyncStatus.Synchronized) {
            const requestType = syncWarData.getRequestType() as GameConfigGcWar.SyncRequestType;
            if (requestType === GameConfigGcWar.SyncRequestType.PlayerRequest) {
                FloatText2.showLang(LangConstants.TextType.A0038);
            } else {
                // Nothing to do.
            }
            break;

        } else {
            // Something wrong!!
            war.setIsEnded(true);
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonAlertPanel, {
                getTitle   : () => LangUtils.getText(LangConstants.TextType.B0088),
                getContent : () => LangUtils.getText(LangConstants.TextType.A0037),
                callback: () => HelpersGameFlow.gotoLobby(),
            });
            return;
        }
    }

    const container = actionList.shift();
    if (container == null) {
        return;
    }

    await WarOperationsExecutorsExecutor.checkAndExecute(war, container, false);

    if (!war.getIsEnded()) {
        if (war.getIsRunning()) {
            checkAndSyncWarOrRunCachedAction(war, actionList);
        }
    } else {
        const callbackForGoBack = () => HelpersGameFlow.gotoMyWarListPanel(war.getWarType());
        const callbackForReplay = () => HelpersGameFlow.gotoRwReplayListPanel();
        if (war.getDrawVoteManager().checkIsDraw()) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getTitle            : () => LangUtils.getText(LangConstants.TextType.B0088),
                getContent          : () => LangUtils.getText(LangConstants.TextType.A0030),
                getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0588),
                callback            : callbackForGoBack,
                getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0092),
                callbackOnCancel    : callbackForReplay,
            });
        } else {
            const selfUserId = HelpersMisc.getExisted(UsersModel.getSelfUserId());
            const selfPlayer = war.getPlayerManager().getPlayerByUserId(selfUserId);
            if (selfPlayer == null) {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getTitle            : () => LangUtils.getText(LangConstants.TextType.B0088),
                    getContent          : () => LangUtils.getText(LangConstants.TextType.A0035),
                    getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0588),
                    callback            : callbackForGoBack,
                    getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0092),
                    callbackOnCancel    : callbackForReplay,
                });
            } else {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getTitle            : () => LangUtils.getText(LangConstants.TextType.B0088),
                    getContent          : () => selfPlayer.getAliveState() === PlayersConstants.AliveStateId.Dead ? LangUtils.getText(LangConstants.TextType.A0023) : LangUtils.getText(LangConstants.TextType.A0022),
                    getTextForConfirm   : () => LangUtils.getText(LangConstants.TextType.B0588),
                    callback            : callbackForGoBack,
                    getTextForCancel    : () => LangUtils.getText(LangConstants.TextType.B0092),
                    callbackOnCancel    : callbackForReplay,
                });
            }
        }
    }
}

function createWarByWarData(data: SerialWar): MultiPlayerWarInterfaceIMpwWar.IMpwWar {
    if (data.getSettingsForMcw()) {
        return new (GameHelpersGhFactory.getMcwWarClass())();
    } else if (data.getSettingsForMrw()) {
        return new (GameHelpersGhFactory.getMrwWarClass())();
    } else if (data.getSettingsForMfw()) {
        return new (GameHelpersGhFactory.getMfwWarClass())();
    } else if (data.getSettingsForCcw()) {
        return new (GameHelpersGhFactory.getCcwWarClass())();
    } else if (data.getSettingsForMmw()) {
        return new (GameHelpersGhFactory.getMmwWarClass())();
    } else if (data.getSettingsForAtw()) {
        return new (GameHelpersGhFactory.getAtwWarClass())();
    } else {
        throw HelpersMisc.newError(`Invalid data.`);
    }
}

async function getGameStartDesc(data: ProtoSchemaCommonProtoNetMessageMsgMpwCommonBroadcastGameStartS.S): Promise<string> {
    const playerArray   : string[] = [];
    let playerIndex     = PlayersConstants.PlayerIndex.First;
    for (const playerInfo of data.getPlayerInfoList()) {
        const userId = playerInfo.getUserId();
        playerArray.push(`P${playerIndex}: ${userId != null ? await UsersModel.getUserNickname(userId) : `----`}`);
        ++playerIndex;
    }

    const normalMapId = data.getNormalMapId();
    return [
        LangUtils.getFormattedText(LangConstants.TextType.F0027, normalMapId != null
            ? await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)
            : LangUtils.getText(LangConstants.TextType.B0557)),
        ...playerArray,
        LangUtils.getText(LangConstants.TextType.A0125)
    ].join("\n");
}
