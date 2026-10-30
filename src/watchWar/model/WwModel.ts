import {
    Wars_Constants,
    AuxiliaryTypes_CachedDataAccessor,
    Helpers_Misc,
    Utils_ClientErrorCode,
    BootTimers_Constants,
    GameConfigs_Provider,
    GameModes_Utils,
    WarSettings_Utils_MpwWarSettings,
    WarRules_Utils_CommonData,
    NormalMap_Model_NormalMapModel,
    Users_Model,
    MultiPlayerWar_Model_MpwModel,
    Players_Constants,
    WatchWar_Model_WwProxy,
    LocalData_Storage,
    type Common_View_CommonWarAdvancedSettingsPage,
    type Common_View_CommonWarBasicSettingsPage,
    type Common_View_CommonWarMapInfoPage,
    type Common_View_CommonWarPlayerInfoPage,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MpwWatchIncomingInfo } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWatchIncomingInfo.ts";
import type { MpwWatchOutgoingInfo } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWatchOutgoingInfo.ts";
import type { S as MpwWatchContinueWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchContinueWar/S.ts";
import type { S as MpwWatchGetIncomingInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetIncomingInfo/S.ts";
import type { S as MpwWatchGetOutgoingInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOutgoingInfo/S.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

let _requestableWarIdArray  : number[] | null = null;
let _ongoingWarIdArray      : number[] | null = null;
let _requestedWarIdArray    : number[] | null = null;
let _watchedWarIdArray      : number[] | null = null;
const _watchWarDataAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, SerialWar>({
    reqData : warId => WatchWar_Model_WwProxy.reqWatchContinueWar(warId),
});

export async function getWatchWarData(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWar>> {
    const timestamp = await MultiPlayerWar_Model_MpwModel.getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        const cachedData = await LocalData_Storage.StoreMpwWatchWarData.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getModifiedTime()) >= timestamp) {
                return cachedData;
            }
            return _watchWarDataAccessor.getData(warId, true);
        }
    }

    return _watchWarDataAccessor.getData(warId);
}
async function setWatchWarData(warId: number, data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWar>): Promise<void> {
    _watchWarDataAccessor.setData(warId, data);

    const userId = Users_Model.getSelfUserId();
    if (userId != null) {
        await LocalData_Storage.StoreMpwWatchWarData.setData(userId, warId, data);
    }
}

export function updateOnMsgMpwWatchContinueWar(data: MpwWatchContinueWarResponse): Promise<void> {
    return setWatchWarData(data.getWarId() ?? 0, data.getWar());
}
export function updateOnFailedMsgMpwWatchContinueWar(data: MpwWatchContinueWarResponse): void {
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

    return Helpers_Misc.checkIsAnyPromiseTrue(warIdArray.map(async v => (await MultiPlayerWar_Model_MpwModel.getWarProgressInfo(v))?.getIsEnded() == false));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for incoming info.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _watchIncomingInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, MpwWatchIncomingInfo>({
    reqData : (warId: number) => WatchWar_Model_WwProxy.reqMpwWatchGetIncomingInfo(warId),
});

export function getWatchIncomingInfo(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwWatchIncomingInfo>> {
    return _watchIncomingInfoAccessor.getData(warId);
}
function setWatchIncomingInfo(warId: number, data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwWatchIncomingInfo>): void {
    _watchIncomingInfoAccessor.setData(warId, data);
}

export function updateOnMsgMpwWatchGetIncomingInfo(data: MpwWatchGetIncomingInfoResponse): void {
    setWatchIncomingInfo(data.getWarId() ?? 0, data.getIncomingInfo());
}
export function updateOnFailedMpwWatchGetIncomingInfo(data: MpwWatchGetIncomingInfoResponse): void {
    const warId = data.getWarId();
    if (warId != null) {
        _watchIncomingInfoAccessor.updateOnRequestFailed(warId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for outgoing info.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _watchOutgoingInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, MpwWatchOutgoingInfo>({
    reqData : (warId: number) => WatchWar_Model_WwProxy.reqMpwWatchGetOutgoingInfo(warId),
});

export function getWatchOutgoingInfo(warId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwWatchOutgoingInfo>> {
    return _watchOutgoingInfoAccessor.getData(warId);
}
function setWatchOutgoingInfo(warId: number, data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<MpwWatchOutgoingInfo>): void {
    _watchOutgoingInfoAccessor.setData(warId, data);
}

export function updateOnMsgMpwWatchGetOutgoingInfo(data: MpwWatchGetOutgoingInfoResponse): void {
    setWatchOutgoingInfo(data.getWarId() ?? 0, data.getOutgoingInfo());
}
export function updateOnFailedMpwWatchGetOutgoingInfo(data: MpwWatchGetOutgoingInfoResponse): void {
    const warId = data.getWarId();
    if (warId != null) {
        _watchOutgoingInfoAccessor.updateOnRequestFailed(warId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDataForCommonWarMapInfoPage(warId: number | null): Promise<Common_View_CommonWarMapInfoPage.OpenData> {
    if (warId == null) {
        return null;
    }

    const warSettings = await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const normalMapId = WarSettings_Utils_MpwWarSettings.getNormalMapIdForMpwWarSettings(warSettings);
    if (normalMapId != null) {
        return {
            mapInfo : {
                hasFog              : !!warSettings.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                mapRawData          : Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId)),
                gameConfig          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(warSettings.getSettingsForCommon()?.getConfigVersion())),
                overridingPlayers   : null,
            },
        };
    } else {
        return {
            warInfo : {
                warData             : Helpers_Misc.getExisted(warSettings.getSettingsForMfw()?.getInitialWarData()),
                showInitialWarData  : false,
                overridingPlayers   : null,
            },
        };
    }
}

export async function createDataForCommonWarPlayerInfoPage(warId: number | null): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
    if (warId == null) {
        return null;
    }

    const warSettings = await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const warProgressInfo = await MultiPlayerWar_Model_MpwModel.getWarProgressInfo(warId);
    if (warProgressInfo == null) {
        return null;
    }

    const settingsForCommon         = Helpers_Misc.getExisted(warSettings.getSettingsForCommon(), Utils_ClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_01);
    const instanceWarRule           = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule(), Utils_ClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_02);
    const playerProgressInfoArray   = warProgressInfo.getPlayerInfoList();
    const playerStaticInfoArray     = warSettings.getPlayerInfoArray();
    const warRuleCommonData         = Helpers_Misc.getExisted(instanceWarRule.getWarRuleCommonData());
    const playersCountUnneutral     = WarRules_Utils_CommonData.getPlayersCountUnneutral(warRuleCommonData);
    const playerInfoArray           : AuxiliaryTypes_AuxiliaryTypes.PlayerInfo[] = [];
    for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        const playerStaticInfo      = Helpers_Misc.getExisted(playerStaticInfoArray.find(v => v.getPlayerIndex() === playerIndex));
        const playerProgressInfo    = Helpers_Misc.getExisted(playerProgressInfoArray.find(v => v.getPlayerIndex() === playerIndex), Utils_ClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_04);
        const userId                = playerStaticInfo.getUserId();
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
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
        gameConfig              : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())),
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

export async function createDataForCommonWarBasicSettingsPage(warId: number | null): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    if (warId == null) {
        return null;
    }

    const warSettings = await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const settingsForCommon = Helpers_Misc.getExisted(warSettings.getSettingsForCommon(), Utils_ClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_01);
    const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule(), Utils_ClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_02);
    const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
    const settingsForMcw    = warSettings.getSettingsForMcw();
    const settingsForMfw    = warSettings.getSettingsForMfw();
    const settingsForCcw    = warSettings.getSettingsForCcw();
    const bootTimerParams   = settingsForMcw?.getBootTimerParams()
        ?? settingsForMfw?.getBootTimerParams()
        ?? settingsForCcw?.getBootTimerParams()
        ?? warSettings.getSettingsForMrw()?.getBootTimerParams()
        ?? warSettings.getSettingsForMmw()?.getBootTimerParams()
        ?? BootTimers_Constants.DefaultParams.concat();
    const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
    const normalMapId       = WarSettings_Utils_MpwWarSettings.getNormalMapIdForMpwWarSettings(warSettings);
    const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
    const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings: [
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                currentValue        : normalMapId,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.WarName,
                currentValue        : settingsForMcw?.getWarName() ?? settingsForMfw?.getWarName() ?? settingsForCcw?.getWarName() ?? `----`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.WarComment,
                currentValue        : settingsForMcw?.getWarComment() ?? settingsForMfw?.getWarComment() ?? settingsForCcw?.getWarComment() ?? `----`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.HasFog,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.Weather,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.WarEvent,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue        : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.TimerType,
                currentValue        : timerType,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        ],
    };
    if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType        : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
            currentValue        : bootTimerParams[1],
            instanceWarRule     : instanceWarRule,
            gameConfig          : gameConfig,
            warEventFullData    : warEventFullData,
            callbackOnModify    : null,
        });
    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
                currentValue        : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
        );
    } else {
        throw Helpers_Misc.newError(`Invalid timerType.`, Utils_ClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_04);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(warId: number | null): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
    const warSettings = warId == null ? null : await MultiPlayerWar_Model_MpwModel.getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const settingsForCommon = Helpers_Misc.getExisted(warSettings.getSettingsForCommon(), Utils_ClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_01);
    return {
        canModify       : false,
        gcData          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion(), Utils_ClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_02)),
        instanceWarRule : Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule(), Utils_ClientErrorCode.ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_03),
        gameModeId      : Helpers_Misc.getExisted(GameModes_Utils.getGameModeIdByMpwWarSettings(warSettings)),
    };
}
