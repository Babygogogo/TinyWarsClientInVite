import {
    Wars_Constants,
    MultiRankedWars_Constants,
    AuxiliaryTypes_CachedDataAccessor,
    Helpers_Misc,
    Utils_ClientErrorCode,
    GameConfigs_Provider,
    WarRules_Utils_CommonData,
    NormalMap_Model_NormalMapModel,
    Users_Model,
    GameModes_Constants,
    MultiRankRoom_Model_MrrProxy,
    MultiPlayerRooms_SelfSettings,
    BootTimers_Constants,
    Logger,
    type Common_View_CommonWarAdvancedSettingsPage,
    type Common_View_CommonWarBasicSettingsPage,
    type Common_View_CommonWarPlayerInfoPage,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MrrRoomInfo } from "../../proto/schema/CommonProto/MultiRankRoom/MrrRoomInfo.ts";
import type { S as MrrDeleteRoomByServerResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrDeleteRoomByServer/S.ts";
import type { S as MrrGetBannedNormalMapIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetBannedNormalMapIdArray/S.ts";
import type { S as MrrGetBootTimerDaysRangeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetBootTimerDaysRange/S.ts";
import type { S as MrrGetRoomPublicInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetRoomPublicInfo/S.ts";
import type { S as MrrSetBannedCoIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedCoIdArray/S.ts";
import type { S as MrrSetBannedNormalMapIdArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedNormalMapIdArray/S.ts";
import type { S as MrrSetBootTimerDaysRangeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBootTimerDaysRange/S.ts";
import type { S as MrrSetSelfSettingsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetSelfSettings/S.ts";
import { DataForPlayerBanCo } from "../../proto/schema/CommonProto/Structure/DataForPlayerBanCo.ts";
import { DataForPlayerInRoom } from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";

let _maxConcurrentCountForStd               = 0;
let _maxConcurrentCountForFog               = 0;
let _additionalMaxDifferenceInScoreForStd   = 0;
let _additionalMaxDifferenceInScoreForFog   = 0;
let _bannedNormalMapIdArrayForStd           : number[] = [];
let _bannedNormalMapIdArrayForFog           : number[] = [];
let _bootTimerDaysRangeForStd               = [MultiRankedWars_Constants.BootTimer.DefaultDays, MultiRankedWars_Constants.BootTimer.DefaultDays];
let _bootTimerDaysRangeForFog               = [MultiRankedWars_Constants.BootTimer.DefaultDays, MultiRankedWars_Constants.BootTimer.DefaultDays];
const _selfSettingsDict                     = new Map<number, MultiPlayerRooms_SelfSettings.SelfSettings>();
const _roomInfoAccessor                     = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, MrrRoomInfo>({
    reqData : (roomId: number) => MultiRankRoom_Model_MrrProxy.reqMrrGetRoomPublicInfo(roomId),
});
const _joinedRoomIdArrayAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => MultiRankRoom_Model_MrrProxy.reqMrrGetJoinedRoomIdArray(),
});

export function setMaxConcurrentCount(hasFog: boolean, count: number): void {
    if (hasFog) {
        _maxConcurrentCountForFog = count;
    } else {
        _maxConcurrentCountForStd = count;
    }
}
export function getMaxConcurrentCount(hasFog: boolean): number {
    return hasFog ? _maxConcurrentCountForFog : _maxConcurrentCountForStd;
}

export function setAdditionalMaxDifferenceInScore(hasFog: boolean, score: number): void {
    if (hasFog) {
        _additionalMaxDifferenceInScoreForFog = score;
    } else {
        _additionalMaxDifferenceInScoreForStd = score;
    }
}
export function getAdditionalMaxDifferenceInScore(hasFog: boolean): number {
    return hasFog ? _additionalMaxDifferenceInScoreForFog : _additionalMaxDifferenceInScoreForStd;
}

export function getBannedNormalMapIdArray(hasFog: boolean): number[] {
    return hasFog ? _bannedNormalMapIdArrayForFog : _bannedNormalMapIdArrayForStd;
}

export function getBootTimerDaysRange(hasFog: boolean): number[] {
    return hasFog ? _bootTimerDaysRangeForFog : _bootTimerDaysRangeForStd;
}

function setRoomInfo(roomId: number, roomInfo: MrrRoomInfo | null): void {
    _roomInfoAccessor.setData(roomId, roomInfo);
}
export function getRoomInfo(roomId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<MrrRoomInfo>> {
    return _roomInfoAccessor.getData(roomId);
}

export function setJoinedRoomIdArray(roomIdArray: number[]): void {
    _joinedRoomIdArrayAccessor.setData(null, roomIdArray);
}
export function getJoinedRoomIdArray(): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>> {
    return _joinedRoomIdArrayAccessor.getData(null);
}

export async function getSelfSettings(roomId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<MultiPlayerRooms_SelfSettings.SelfSettings>> {
    const roomInfo = await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const existingData = _selfSettingsDict.get(roomId);
    if (existingData != null) {
        return existingData;
    } else {
        const newData = new MultiPlayerRooms_SelfSettings.SelfSettings(
            roomInfo,
            await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(roomInfo.getSettingsForCommon()?.getConfigVersion())),
        );
        _selfSettingsDict.set(roomId, newData);
        return newData;
    }
}

export function updateOnMsgMrrGetBannedNormalMapIdArray(data: MrrGetBannedNormalMapIdArrayResponse): void {
    _bannedNormalMapIdArrayForStd = data.getBannedNormalMapIdArrayForStd();
    _bannedNormalMapIdArrayForFog = data.getBannedNormalMapIdArrayForFog();
}
export function updateOnMsgMrrSetBannedNormalMapIdArray(data: MrrSetBannedNormalMapIdArrayResponse): void {
    _bannedNormalMapIdArrayForStd = data.getBannedNormalMapIdArrayForStd();
    _bannedNormalMapIdArrayForFog = data.getBannedNormalMapIdArrayForFog();
}

export function updateOnMsgMrrGetBootTimerDaysRange(data: MrrGetBootTimerDaysRangeResponse): void {
    {
        const range = data.getRangeForStd();
        if (range.length === 2) {
            _bootTimerDaysRangeForStd = range;
        } else {
            _bootTimerDaysRangeForStd = [MultiRankedWars_Constants.BootTimer.DefaultDays, MultiRankedWars_Constants.BootTimer.DefaultDays];
        }
    }
    {
        const range = data.getRangeForFog();
        if (range.length === 2) {
            _bootTimerDaysRangeForFog = range;
        } else {
            _bootTimerDaysRangeForFog = [MultiRankedWars_Constants.BootTimer.DefaultDays, MultiRankedWars_Constants.BootTimer.DefaultDays];
        }
    }
}
export function updateOnMsgMrrSetBootTimerDaysRange(data: MrrSetBootTimerDaysRangeResponse): void {
    {
        const range = data.getRangeForStd();
        if (range.length === 2) {
            _bootTimerDaysRangeForStd = range;
        } else {
            _bootTimerDaysRangeForStd = [MultiRankedWars_Constants.BootTimer.DefaultDays, MultiRankedWars_Constants.BootTimer.DefaultDays];
        }
    }
    {
        const range = data.getRangeForFog();
        if (range.length === 2) {
            _bootTimerDaysRangeForFog = range;
        } else {
            _bootTimerDaysRangeForFog = [MultiRankedWars_Constants.BootTimer.DefaultDays, MultiRankedWars_Constants.BootTimer.DefaultDays];
        }
    }
}

export async function updateOnMsgMrrGetRoomPublicInfo(data: MrrGetRoomPublicInfoResponse): Promise<void> {
    const roomId    = data.getRoomId() ?? 0;
    const roomInfo  = data.getRoomInfo() ?? null;
    setRoomInfo(roomId, roomInfo);

    if (roomInfo != null) {
        (await getSelfSettings(roomId))?.resetData(roomInfo);
    }
}
export function updateOnFailedMsgMrrGetRoomPublicInfo(data: MrrGetRoomPublicInfoResponse): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export async function updateOnMsgMrrSetBannedCoIdArray(data: MrrSetBannedCoIdArrayResponse): Promise<void> {
    const roomId    = Helpers_Misc.getExisted(data.getRoomId());
    const roomInfo  = await getRoomInfo(roomId);
    if (!roomInfo) {
        return;
    }

    const settingsForMrw    = Helpers_Misc.getExisted(roomInfo.getSettingsForMrw());
    const srcPlayerIndex    = data.getPlayerIndex();
    const bannedCoIdArray   = data.getBannedCoIdArray();
    const dataArray         = settingsForMrw.getDataArrayForBanCo();
    const playerData        = dataArray.find(v => v.getSrcPlayerIndex() === srcPlayerIndex);
    if (playerData) {
        playerData.setBannedCoIdArray(bannedCoIdArray);
    } else {
        dataArray.push(DataForPlayerBanCo.fromJson({
            srcPlayerIndex  : srcPlayerIndex,
            bannedCoIdArray : bannedCoIdArray,
        }));
    }
}
export async function updateOnMsgMrrSetSelfSettings(data: MrrSetSelfSettingsResponse): Promise<void> {
    const roomInfo = await getRoomInfo(Helpers_Misc.getExisted(data.getRoomId()));
    if (!roomInfo) {
        return;
    }

    const playerIndex       = data.getPlayerIndex();
    const coId              = data.getCoId();
    const unitAndTileSkinId = data.getUnitAndTileSkinId();
    const dataArray         = roomInfo.getPlayerDataList();
    const playerData        = dataArray.find(v => v.getPlayerIndex() === playerIndex);
    if (playerData) {
        playerData.setCoId(coId);
        playerData.setIsReady(true);
        playerData.setUnitAndTileSkinId(unitAndTileSkinId);
    } else {
        Logger.warn(`MrrModel.updateOnMsgMrrSetSelfSettings() playerData == null.`);
        dataArray.push(DataForPlayerInRoom.fromJson({
            playerIndex       : playerIndex,
            userId            : null,
            coId              : coId,
            unitAndTileSkinId : unitAndTileSkinId,
            isReady           : true,
        }));
    }
}
export function updateOnMsgMrrDeleteRoomByServer(data: MrrDeleteRoomByServerResponse): void {
    setRoomInfo(Helpers_Misc.getExisted(data.getRoomId()), null);
}

export async function checkIsRed(): Promise<boolean> {
    const promiseArray: Promise<boolean>[] = [];
    for (const roomId of await getJoinedRoomIdArray() ?? []) {
        promiseArray.push(checkIsRedForRoom(roomId));
    }
    return Helpers_Misc.checkIsAnyPromiseTrue(promiseArray);
}
export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
    const roomInfo = await getRoomInfo(roomId);
    if (roomInfo == null) {
        return false;
    }

    const selfUserId = Users_Model.getSelfUserId();
    const playerData = roomInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId);
    if (playerData == null) {
        return false;
    }

    if (roomInfo.getTimeForStartSetSelfSettings() != null) {
        return !playerData.getIsReady();
    } else {
        const arr = roomInfo.getSettingsForMrw()?.getDataArrayForBanCo();
        if ((arr == null) || (arr.every(v => v.getSrcPlayerIndex() !== playerData.getPlayerIndex()))) {
            return true;
        }
    }

    return false;
}

export async function createDataForCommonWarPlayerInfoPage(roomId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = Helpers_Misc.getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
    const warRuleCommonData = Helpers_Misc.getExisted(instanceWarRule.getWarRuleCommonData());
    const playerInfoArray   : AuxiliaryTypes_AuxiliaryTypes.PlayerInfo[] = [];
    for (const playerInfo of (roomInfo.getPlayerDataList())) {
        const playerIndex = playerInfo.getPlayerIndex();
        playerInfoArray.push({
            playerIndex       : playerIndex,
            teamIndex         : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi              : false,
            userId            : playerInfo.getUserId() ?? null,
            coId              : playerInfo.getCoId(),
            unitAndTileSkinId : playerInfo.getUnitAndTileSkinId(),
            isReady           : playerInfo.getIsReady(),
            isInTurn          : null,
            isDefeat          : null,
            restTimeToBoot    : null,
        });
    }

    return {
        gameConfig             : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())),
        playersCountUnneutral  : WarRules_Utils_CommonData.getPlayersCountUnneutral(warRuleCommonData),
        roomOwnerPlayerIndex   : null,
        callbackOnExitRoom     : null,
        callbackOnDeletePlayer : null,
        callbackOnAddDummy     : null,
        callbackOnChangeDummy  : null,
        playerInfoArray        : playerInfoArray,
        enterTurnTime          : null,
        isReplay               : false,
    };
}

export async function createDataForCommonWarBasicSettingsPage(roomId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings : [] };
    }

    const settingsForCommon = Helpers_Misc.getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
    const settingsForMrw    = Helpers_Misc.getExisted(roomInfo.getSettingsForMrw());
    const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
    const normalMapId       = settingsForMrw.getNormalMapId();
    const warEventFullData  = (await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getWarEventFullData() ?? null;
    const bootTimerParams   = settingsForMrw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
    const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings : [
            {
                settingsType     : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                currentValue     : normalMapId,
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
        throw Helpers_Misc.newError(`MrrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}`, Utils_ClientErrorCode.ClientErrorCode.MrrModel_CreateDataForCommonWarBasicSettingsPage_00);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = Helpers_Misc.getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
    return {
        canModify       : false,
        gcData          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : instanceWarRule,
        gameModeId      : GameModes_Constants.ModeId.RankedMatch,
    };
}
