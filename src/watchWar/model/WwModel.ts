import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import type * as CommonViewCommonWarMapInfoPage from "../../common/view/CommonWarMapInfoPage.ts";
import type * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameModesUtils from "../../gameModes/Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as MultiPlayerWarModelMpwModel from "../../multiPlayerWar/model/MpwModel.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoMultiPlayerWarMpwWatchIncomingInfo from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWatchIncomingInfo.ts";
import type * as ProtoSchemaCommonProtoMultiPlayerWarMpwWatchOutgoingInfo from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWatchOutgoingInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchContinueWarS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchContinueWar/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetIncomingInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetIncomingInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOutgoingInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOutgoingInfo/S.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarSettingsUtilsMpwWarSettings from "../../warSettings/utils/MpwWarSettings.ts";
import * as WatchWarModelWwProxy from "./WwProxy.ts";

type Undefinable<T>                             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;
type OpenDataForCommonWarMapInfoPage            = CommonViewCommonWarMapInfoPage.OpenData;
type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPage.OpenData;
type OpenDataForCommonWarAdvancedSettingsPage   = CommonViewCommonWarAdvancedSettingsPage.OpenData;
type OpenDataForCommonWarPlayerInfoPage         = CommonViewCommonWarPlayerInfoPage.OpenData;

let _requestableWarIdArray  : number[] | null = null;
let _ongoingWarIdArray      : number[] | null = null;
let _requestedWarIdArray    : number[] | null = null;
let _watchedWarIdArray      : number[] | null = null;
const _watchWarDataAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar>({
    reqData : warId => WatchWarModelWwProxy.reqWatchContinueWar(warId),
});

export async function getWatchWarData(warId: number): Promise<Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar>> {
    const timestamp = await MultiPlayerWarModelMpwModel.getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalDataStorage2.StoreMpwWatchWarData.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getModifiedTime() ?? 0) >= timestamp) {
                return cachedData;
            }
            return _watchWarDataAccessor.getData(warId, true);
        }
    }

    return _watchWarDataAccessor.getData(warId);
}
async function setWatchWarData(warId: number, data: Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar>): Promise<void> {
    _watchWarDataAccessor.setData(warId, data);

    const userId = UsersModel.getSelfUserId();
    if (userId != null) {
        await LocalDataStorage2.StoreMpwWatchWarData.setData(userId, warId, data);
    }
}

export function updateOnMsgMpwWatchContinueWar(data: ProtoSchemaCommonProtoNetMessageMsgMpwWatchContinueWarS.S): Promise<void> {
    return setWatchWarData(data.getWarId() ?? 0, data.getWar());
}
export function updateOnFailedMsgMpwWatchContinueWar(data: ProtoSchemaCommonProtoNetMessageMsgMpwWatchContinueWarS.S): void {
    const warId = data.getWarId();
    if (warId != null) {
        _watchWarDataAccessor.updateOnRequestFailed(warId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function setRequestableWarIdArray(warIdArray: number[]): void {
    _requestableWarIdArray = warIdArray;
}
export function getRequestableWarIdArray(): number[] | null {
    return _requestableWarIdArray;
}

export function setOngoingWarIdArray(warIdArray: number[]): void {
    _ongoingWarIdArray = warIdArray;
}
export function getOngoingWarIdArray(): number[] | null {
    return _ongoingWarIdArray;
}

export function setRequestedWarIdArray(warIdArray: number[]): void {
    _requestedWarIdArray = warIdArray;
}
export function getRequestedWarIdArray(): number[] | null {
    return _requestedWarIdArray;
}

export function setWatchedWarIdArray(warIdArray: number[]): void {
    _watchedWarIdArray = warIdArray;
}
export function getWatchedWarIdArray(): number[] | null {
    return _watchedWarIdArray;
}

export async function checkIsRed(): Promise<boolean> {
    const warIdArray = getRequestedWarIdArray();
    if (!warIdArray?.length) {
        return false;
    }

    return HelpersMisc.checkIsAnyPromiseTrue(warIdArray.map(async v => (await MultiPlayerWarModelMpwModel.getWarProgressInfo(v))?.getIsEnded() == false));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for incoming info.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _watchIncomingInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoMultiPlayerWarMpwWatchIncomingInfo.MpwWatchIncomingInfo>({
    reqData : (warId: number) => WatchWarModelWwProxy.reqMpwWatchGetIncomingInfo(warId),
});

export function getWatchIncomingInfo(warId: number): Promise<Undefinable<ProtoSchemaCommonProtoMultiPlayerWarMpwWatchIncomingInfo.MpwWatchIncomingInfo>> {
    return _watchIncomingInfoAccessor.getData(warId);
}
function setWatchIncomingInfo(warId: number, data: Undefinable<ProtoSchemaCommonProtoMultiPlayerWarMpwWatchIncomingInfo.MpwWatchIncomingInfo>): void {
    _watchIncomingInfoAccessor.setData(warId, data);
}

export function updateOnMsgMpwWatchGetIncomingInfo(data: ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetIncomingInfoS.S): void {
    setWatchIncomingInfo(data.getWarId() ?? 0, data.getIncomingInfo());
}
export function updateOnFailedMpwWatchGetIncomingInfo(data: ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetIncomingInfoS.S): void {
    const warId = data.getWarId();
    if (warId != null) {
        _watchIncomingInfoAccessor.updateOnRequestFailed(warId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for outgoing info.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _watchOutgoingInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoMultiPlayerWarMpwWatchOutgoingInfo.MpwWatchOutgoingInfo>({
    reqData : (warId: number) => WatchWarModelWwProxy.reqMpwWatchGetOutgoingInfo(warId),
});

export function getWatchOutgoingInfo(warId: number): Promise<Undefinable<ProtoSchemaCommonProtoMultiPlayerWarMpwWatchOutgoingInfo.MpwWatchOutgoingInfo>> {
    return _watchOutgoingInfoAccessor.getData(warId);
}
function setWatchOutgoingInfo(warId: number, data: Undefinable<ProtoSchemaCommonProtoMultiPlayerWarMpwWatchOutgoingInfo.MpwWatchOutgoingInfo>): void {
    _watchOutgoingInfoAccessor.setData(warId, data);
}

export function updateOnMsgMpwWatchGetOutgoingInfo(data: ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOutgoingInfoS.S): void {
    setWatchOutgoingInfo(data.getWarId() ?? 0, data.getOutgoingInfo());
}
export function updateOnFailedMpwWatchGetOutgoingInfo(data: ProtoSchemaCommonProtoNetMessageMsgMpwWatchGetOutgoingInfoS.S): void {
    const warId = data.getWarId();
    if (warId != null) {
        _watchOutgoingInfoAccessor.updateOnRequestFailed(warId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDataForCommonWarMapInfoPage(warId: number | null): Promise<OpenDataForCommonWarMapInfoPage> {
    if (warId == null) {
        return null;
    }

    const warSettings = await MultiPlayerWarModelMpwModel.getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const normalMapId = WarSettingsUtilsMpwWarSettings.getNormalMapIdForMpwWarSettings(warSettings);
    if (normalMapId != null) {
        return {
            mapInfo : {
                hasFog              : !!warSettings.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                mapRawData          : HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId)),
                gameConfig          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(warSettings.getSettingsForCommon()?.getConfigVersion())),
                overridingPlayers   : null,
            },
        };
    } else {
        return {
            warInfo : {
                warData             : HelpersMisc.getExisted(warSettings.getSettingsForMfw()?.getInitialWarData()),
                showInitialWarData  : false,
                overridingPlayers   : null,
            },
        };
    }
}

export async function createDataForCommonWarPlayerInfoPage(warId: number | null): Promise<OpenDataForCommonWarPlayerInfoPage> {
    if (warId == null) {
        return null;
    }

    const warSettings = await MultiPlayerWarModelMpwModel.getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const warProgressInfo = await MultiPlayerWarModelMpwModel.getWarProgressInfo(warId);
    if (warProgressInfo == null) {
        return null;
    }

    const settingsForCommon         = HelpersMisc.getExisted(warSettings.getSettingsForCommon(), UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_01);
    const instanceWarRule           = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule(), UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_02);
    const playerProgressInfoArray   = HelpersMisc.getExisted(warProgressInfo.getPlayerInfoList(), UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_03);
    const playerStaticInfoArray     = HelpersMisc.getExisted(warSettings.getPlayerInfoArray());
    const warRuleCommonData         = HelpersMisc.getExisted(instanceWarRule.getWarRuleCommonData());
    const playersCountUnneutral     = WarRulesUtilsCommonData.getPlayersCountUnneutral(warRuleCommonData);
    const playerInfoArray           : AuxiliaryTypesAuxiliaryTypes.PlayerInfo[] = [];
    for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        const playerStaticInfo      = HelpersMisc.getExisted(playerStaticInfoArray.find(v => v.getPlayerIndex() === playerIndex));
        const playerProgressInfo    = HelpersMisc.getExisted(playerProgressInfoArray.find(v => v.getPlayerIndex() === playerIndex), UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_04);
        const userId                = playerStaticInfo.getUserId();
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi                : userId == null,
            userId              : userId ?? null,
            coId                : playerStaticInfo.getCoId() ?? null,
            unitAndTileSkinId   : playerStaticInfo.getUnitAndTileSkinId() ?? null,
            isReady             : null,
            isInTurn            : warProgressInfo.getPlayerIndexInTurn() === playerIndex,
            isDefeat            : !playerProgressInfo.getIsAlive(),
            restTimeToBoot      : playerProgressInfo.getRestTimeToBoot() ?? null,
        });
    }

    return {
        gameConfig              : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())),
        playersCountUnneutral   : playersCountUnneutral,
        roomOwnerPlayerIndex    : null,
        callbackOnExitRoom      : null,
        callbackOnDeletePlayer  : null,
        callbackOnAddDummy      : null,
        callbackOnChangeDummy   : null,
        playerInfoArray         : playerInfoArray,
        enterTurnTime           : warProgressInfo.getEnterTurnTime() ?? null,
        isReplay                : false,
    };
}

export async function createDataForCommonWarBasicSettingsPage(warId: number | null): Promise<OpenDataForCommonWarBasicSettingsPage> {
    if (warId == null) {
        return null;
    }

    const warSettings = await MultiPlayerWarModelMpwModel.getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const settingsForCommon = HelpersMisc.getExisted(warSettings.getSettingsForCommon(), UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_01);
    const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule(), UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_02);
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const settingsForMcw    = warSettings.getSettingsForMcw();
    const settingsForMfw    = warSettings.getSettingsForMfw();
    const settingsForCcw    = warSettings.getSettingsForCcw();
    const bootTimerParams   = settingsForMcw?.getBootTimerParams()
        ?? settingsForMfw?.getBootTimerParams()
        ?? settingsForCcw?.getBootTimerParams()
        ?? warSettings.getSettingsForMrw()?.getBootTimerParams()
        ?? warSettings.getSettingsForMmw()?.getBootTimerParams()
        ?? BootTimersConstants.DefaultParams.concat();
    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const normalMapId       = WarSettingsUtilsMpwWarSettings.getNormalMapIdForMpwWarSettings(warSettings);
    const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
    const openData          : OpenDataForCommonWarBasicSettingsPage = {
        dataArrayForListSettings: [
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.NormalMapId,
                currentValue        : normalMapId,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarName,
                currentValue        : settingsForMcw?.getWarName() ?? settingsForMfw?.getWarName() ?? settingsForCcw?.getWarName() ?? `----`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : GameConfigGcWar.BasicSettingsType.WarComment,
                currentValue        : settingsForMcw?.getWarComment() ?? settingsForMfw?.getWarComment() ?? settingsForCcw?.getWarComment() ?? `----`,
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
        throw HelpersMisc.newError(`Invalid timerType.`, UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_04);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(warId: number | null): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
    const warSettings = warId == null ? null : await MultiPlayerWarModelMpwModel.getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const settingsForCommon = HelpersMisc.getExisted(warSettings.getSettingsForCommon(), UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_01);
    return {
        canModify       : false,
        gcData          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion(), UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_02)),
        instanceWarRule : HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule(), UtilsClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_03),
        gameModeId      : HelpersMisc.getExisted(GameModesUtils.getGameModeIdByMpwWarSettings(warSettings)),
    };
}
