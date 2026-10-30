import type {
    Undefinable,
    PlayerInfo,
} from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import {
    DefaultParams,
    TimerTypeId,
} from "../../bootTimers/Constants.ts";
import type { OpenData as CommonWarAdvancedSettingsPageOpenData } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type { OpenData as CommonWarBasicSettingsPageOpenData } from "../../common/view/CommonWarBasicSettingsPage.ts";
import type { OpenData as CommonWarMapInfoPageOpenData } from "../../common/view/CommonWarMapInfoPage.ts";
import type { OpenData as CommonWarPlayerInfoPageOpenData } from "../../common/view/CommonWarPlayerInfoPage.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getGameModeIdByMpwWarSettings } from "../../gameModes/Utils.ts";
import {
    checkIsAnyPromiseTrue,
    getExisted,
    newError,
} from "../../helpers/Misc.ts";
import { StoreMpwWatchWarData } from "../../localData/Storage.ts";
import {
    getWarTimestamp,
    getWarProgressInfo,
    getWarSettings,
} from "../../multiPlayerWar/model/MpwModel.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { MpwWatchIncomingInfo } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWatchIncomingInfo.ts";
import type { MpwWatchOutgoingInfo } from "../../proto/schema/CommonProto/MultiPlayerWar/MpwWatchOutgoingInfo.ts";
import type { S as MpwWatchContinueWarResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchContinueWar/S.ts";
import type { S as MpwWatchGetIncomingInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetIncomingInfo/S.ts";
import type { S as MpwWatchGetOutgoingInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMpwWatchGetOutgoingInfo/S.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import {
    getPlayersCountUnneutral,
    getPlayerRule,
} from "../../warRules/utils/CommonData.ts";
import { getNormalMapIdForMpwWarSettings } from "../../warSettings/utils/MpwWarSettings.ts";
import {
    reqWatchContinueWar,
    reqMpwWatchGetIncomingInfo,
    reqMpwWatchGetOutgoingInfo,
} from "./WwProxy.ts";
import { BasicSettingsTypeId } from "../../wars/Constants.ts";

let _requestableWarIdArray  : number[] | null = null;
let _ongoingWarIdArray      : number[] | null = null;
let _requestedWarIdArray    : number[] | null = null;
let _watchedWarIdArray      : number[] | null = null;
const _watchWarDataAccessor = new CachedDataAccessor<number, SerialWar>({
    reqData : warId => reqWatchContinueWar(warId),
});

export async function getWatchWarData(warId: number): Promise<Undefinable<SerialWar>> {
    const timestamp = await getWarTimestamp(warId);
    if (timestamp == null) {
        return null;
    }

    const userId = getSelfUserId();
    if (userId != null) {
        const cachedData = await StoreMpwWatchWarData.getData(userId, warId);
        if (cachedData != null) {
            if ((cachedData.getModifiedTime()) >= timestamp) {
                return cachedData;
            }
            return _watchWarDataAccessor.getData(warId, true);
        }
    }

    return _watchWarDataAccessor.getData(warId);
}
async function setWatchWarData(warId: number, data: Undefinable<SerialWar>): Promise<void> {
    _watchWarDataAccessor.setData(warId, data);

    const userId = getSelfUserId();
    if (userId != null) {
        await StoreMpwWatchWarData.setData(userId, warId, data);
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

    return checkIsAnyPromiseTrue(warIdArray.map(async v => (await getWarProgressInfo(v))?.getIsEnded() == false));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for incoming info.
////////////////////////////////////////////////////////////////////////////////////////////////////
const _watchIncomingInfoAccessor = new CachedDataAccessor<number, MpwWatchIncomingInfo>({
    reqData : (warId: number) => reqMpwWatchGetIncomingInfo(warId),
});

export function getWatchIncomingInfo(warId: number): Promise<Undefinable<MpwWatchIncomingInfo>> {
    return _watchIncomingInfoAccessor.getData(warId);
}
function setWatchIncomingInfo(warId: number, data: Undefinable<MpwWatchIncomingInfo>): void {
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
const _watchOutgoingInfoAccessor = new CachedDataAccessor<number, MpwWatchOutgoingInfo>({
    reqData : (warId: number) => reqMpwWatchGetOutgoingInfo(warId),
});

export function getWatchOutgoingInfo(warId: number): Promise<Undefinable<MpwWatchOutgoingInfo>> {
    return _watchOutgoingInfoAccessor.getData(warId);
}
function setWatchOutgoingInfo(warId: number, data: Undefinable<MpwWatchOutgoingInfo>): void {
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
export async function createDataForCommonWarMapInfoPage(warId: number | null): Promise<CommonWarMapInfoPageOpenData> {
    if (warId == null) {
        return null;
    }

    const warSettings = await getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const normalMapId = getNormalMapIdForMpwWarSettings(warSettings);
    if (normalMapId != null) {
        return {
            mapInfo : {
                hasFog              : !!warSettings.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault(),
                mapRawData          : getExisted(await getRawData(normalMapId)),
                gameConfig          : await getGameConfig(getExisted(warSettings.getSettingsForCommon()?.getConfigVersion())),
                overridingPlayers   : null,
            },
        };
    } else {
        return {
            warInfo : {
                warData             : getExisted(warSettings.getSettingsForMfw()?.getInitialWarData()),
                showInitialWarData  : false,
                overridingPlayers   : null,
            },
        };
    }
}

export async function createDataForCommonWarPlayerInfoPage(warId: number | null): Promise<CommonWarPlayerInfoPageOpenData> {
    if (warId == null) {
        return null;
    }

    const warSettings = await getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const warProgressInfo = await getWarProgressInfo(warId);
    if (warProgressInfo == null) {
        return null;
    }

    const settingsForCommon         = getExisted(warSettings.getSettingsForCommon(), ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_01);
    const instanceWarRule           = getExisted(settingsForCommon.getInstanceWarRule(), ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_02);
    const playerProgressInfoArray   = warProgressInfo.getPlayerInfoList();
    const playerStaticInfoArray     = warSettings.getPlayerInfoArray();
    const warRuleCommonData         = getExisted(instanceWarRule.getWarRuleCommonData());
    const playersCountUnneutral     = getPlayersCountUnneutral(warRuleCommonData);
    const playerInfoArray           : PlayerInfo[] = [];
    for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        const playerStaticInfo      = getExisted(playerStaticInfoArray.find(v => v.getPlayerIndex() === playerIndex));
        const playerProgressInfo    = getExisted(playerProgressInfoArray.find(v => v.getPlayerIndex() === playerIndex), ClientErrorCode.WwModel_CreateDataForCommonWarPlayerInfoPage_04);
        const userId                = playerStaticInfo.getUserId();
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
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
        gameConfig              : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
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

export async function createDataForCommonWarBasicSettingsPage(warId: number | null): Promise<CommonWarBasicSettingsPageOpenData> {
    if (warId == null) {
        return null;
    }

    const warSettings = await getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const settingsForCommon = getExisted(warSettings.getSettingsForCommon(), ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_01);
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule(), ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_02);
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const settingsForMcw    = warSettings.getSettingsForMcw();
    const settingsForMfw    = warSettings.getSettingsForMfw();
    const settingsForCcw    = warSettings.getSettingsForCcw();
    const bootTimerParams   = settingsForMcw?.getBootTimerParams()
        ?? settingsForMfw?.getBootTimerParams()
        ?? settingsForCcw?.getBootTimerParams()
        ?? warSettings.getSettingsForMrw()?.getBootTimerParams()
        ?? warSettings.getSettingsForMmw()?.getBootTimerParams()
        ?? DefaultParams.concat();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const normalMapId       = getNormalMapIdForMpwWarSettings(warSettings);
    const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
    const openData          : CommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings: [
            {
                settingsType        : BasicSettingsTypeId.NormalMapId,
                currentValue        : normalMapId,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarName,
                currentValue        : settingsForMcw?.getWarName() ?? settingsForMfw?.getWarName() ?? settingsForCcw?.getWarName() ?? `----`,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType        : BasicSettingsTypeId.WarComment,
                currentValue        : settingsForMcw?.getWarComment() ?? settingsForMfw?.getWarComment() ?? settingsForCcw?.getWarComment() ?? `----`,
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
        throw newError(`Invalid timerType.`, ClientErrorCode.WwModel_CreateDataForCommonWarBasicSettingsPage_04);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(warId: number | null): Promise<CommonWarAdvancedSettingsPageOpenData> {
    const warSettings = warId == null ? null : await getWarSettings(warId);
    if (warSettings == null) {
        return null;
    }

    const settingsForCommon = getExisted(warSettings.getSettingsForCommon(), ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_01);
    return {
        canModify       : false,
        gcData          : await getGameConfig(getExisted(settingsForCommon.getConfigVersion(), ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_02)),
        instanceWarRule : getExisted(settingsForCommon.getInstanceWarRule(), ClientErrorCode.WwModel_CreateDataForCommonWarAdvancedSettingsPage_03),
        gameModeId      : getExisted(getGameModeIdByMpwWarSettings(warSettings)),
    };
}
