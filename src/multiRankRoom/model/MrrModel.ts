import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable, PlayerInfo } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import { DefaultParams, TimerTypeId } from "../../bootTimers/Constants.ts";
import type { OpenData } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type { OpenData as CommonViewCommonWarBasicSettingsPageOpenData } from "../../common/view/CommonWarBasicSettingsPage.ts";
import type { OpenData as CommonViewCommonWarPlayerInfoPageOpenData } from "../../common/view/CommonWarPlayerInfoPage.ts";
import { getGameConfig } from "../../gameConfig/GcModel.ts";
import { MultiRankedWar, BasicSettingsType } from "../../gameConfig/GcWar.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getExisted, checkIsAnyPromiseTrue, newError } from "../../helpers/Misc.ts";
import { warn } from "../../Logger.ts";
import { SelfSettings } from "../../multiPlayerRooms/SelfSettings.ts";
import { reqMrrGetRoomPublicInfo, reqMrrGetJoinedRoomIdArray } from "./MrrProxy.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import type { MrrRoomInfo } from "../../proto/schema/CommonProto/MultiRankRoom/MrrRoomInfo.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMrrDeleteRoomByServer/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrGetBannedNormalMapIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetBannedNormalMapIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrGetBootTimerDaysRangeS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetBootTimerDaysRange/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrGetRoomPublicInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrGetRoomPublicInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedCoIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedCoIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedNormalMapIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBannedNormalMapIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrSetBootTimerDaysRangeS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetBootTimerDaysRange/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMrrSetSelfSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMrrSetSelfSettings/S.ts";
import { DataForPlayerBanCo } from "../../proto/schema/CommonProto/Structure/DataForPlayerBanCo.ts";
import { DataForPlayerInRoom } from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { getPlayerRule, getPlayersCountUnneutral } from "../../warRules/utils/CommonData.ts";

type Undefinable<T>                             = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

let _maxConcurrentCountForStd               = 0;
let _maxConcurrentCountForFog               = 0;
let _additionalMaxDifferenceInScoreForStd   = 0;
let _additionalMaxDifferenceInScoreForFog   = 0;
let _bannedNormalMapIdArrayForStd           : number[] = [];
let _bannedNormalMapIdArrayForFog           : number[] = [];
let _bootTimerDaysRangeForStd               = [MultiRankedWar.BootTimer.DefaultDays, MultiRankedWar.BootTimer.DefaultDays];
let _bootTimerDaysRangeForFog               = [MultiRankedWar.BootTimer.DefaultDays, MultiRankedWar.BootTimer.DefaultDays];
const _selfSettingsDict                     = new Map<number, SelfSettings>();
const _roomInfoAccessor                     = new CachedDataAccessor<number, MrrRoomInfo>({
    reqData : (roomId: number) => reqMrrGetRoomPublicInfo(roomId),
});
const _joinedRoomIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqMrrGetJoinedRoomIdArray(),
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
export function getRoomInfo(roomId: number): Promise<Undefinable<MrrRoomInfo>> {
    return _roomInfoAccessor.getData(roomId);
}

export function setJoinedRoomIdArray(roomIdArray: number[]): void {
    _joinedRoomIdArrayAccessor.setData(null, roomIdArray);
}
export function getJoinedRoomIdArray(): Promise<Undefinable<number[]>> {
    return _joinedRoomIdArrayAccessor.getData(null);
}

export async function getSelfSettings(roomId: number): Promise<Undefinable<SelfSettings>> {
    const roomInfo = await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const existingData = _selfSettingsDict.get(roomId);
    if (existingData != null) {
        return existingData;
    } else {
        const newData = new SelfSettings(
            roomInfo,
            await getGameConfig(getExisted(roomInfo.getSettingsForCommon()?.getConfigVersion()))
        );
        _selfSettingsDict.set(roomId, newData);
        return newData;
    }
}

export function updateOnMsgMrrGetBannedNormalMapIdArray(data: ProtoSchemaCommonProtoNetMessageMsgMrrGetBannedNormalMapIdArrayS): void {
    _bannedNormalMapIdArrayForStd = data.getBannedNormalMapIdArrayForStd();
    _bannedNormalMapIdArrayForFog = data.getBannedNormalMapIdArrayForFog();
}
export function updateOnMsgMrrSetBannedNormalMapIdArray(data: ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedNormalMapIdArrayS): void {
    _bannedNormalMapIdArrayForStd = data.getBannedNormalMapIdArrayForStd();
    _bannedNormalMapIdArrayForFog = data.getBannedNormalMapIdArrayForFog();
}

export function updateOnMsgMrrGetBootTimerDaysRange(data: ProtoSchemaCommonProtoNetMessageMsgMrrGetBootTimerDaysRangeS): void {
    {
        const range = data.getRangeForStd();
        if (range.length === 2) {
            _bootTimerDaysRangeForStd = range;
        } else {
            _bootTimerDaysRangeForStd = [MultiRankedWar.BootTimer.DefaultDays, MultiRankedWar.BootTimer.DefaultDays];
        }
    }
    {
        const range = data.getRangeForFog();
        if (range.length === 2) {
            _bootTimerDaysRangeForFog = range;
        } else {
            _bootTimerDaysRangeForFog = [MultiRankedWar.BootTimer.DefaultDays, MultiRankedWar.BootTimer.DefaultDays];
        }
    }
}
export function updateOnMsgMrrSetBootTimerDaysRange(data: ProtoSchemaCommonProtoNetMessageMsgMrrSetBootTimerDaysRangeS): void {
    {
        const range = data.getRangeForStd();
        if (range.length === 2) {
            _bootTimerDaysRangeForStd = range;
        } else {
            _bootTimerDaysRangeForStd = [MultiRankedWar.BootTimer.DefaultDays, MultiRankedWar.BootTimer.DefaultDays];
        }
    }
    {
        const range = data.getRangeForFog();
        if (range.length === 2) {
            _bootTimerDaysRangeForFog = range;
        } else {
            _bootTimerDaysRangeForFog = [MultiRankedWar.BootTimer.DefaultDays, MultiRankedWar.BootTimer.DefaultDays];
        }
    }
}

export async function updateOnMsgMrrGetRoomPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgMrrGetRoomPublicInfoS): Promise<void> {
    const roomId    = data.getRoomId() ?? 0;
    const roomInfo  = data.getRoomInfo() ?? null;
    setRoomInfo(roomId, roomInfo);

    if (roomInfo != null) {
        (await getSelfSettings(roomId))?.resetData(roomInfo);
    }
}
export function updateOnFailedMsgMrrGetRoomPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgMrrGetRoomPublicInfoS): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export async function updateOnMsgMrrSetBannedCoIdArray(data: ProtoSchemaCommonProtoNetMessageMsgMrrSetBannedCoIdArrayS): Promise<void> {
    const roomId    = getExisted(data.getRoomId());
    const roomInfo  = await getRoomInfo(roomId);
    if (!roomInfo) {
        return;
    }

    const settingsForMrw    = getExisted(roomInfo.getSettingsForMrw());
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
export async function updateOnMsgMrrSetSelfSettings(data: ProtoSchemaCommonProtoNetMessageMsgMrrSetSelfSettingsS): Promise<void> {
    const roomInfo = await getRoomInfo(getExisted(data.getRoomId()));
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
        warn(`MrrModel.updateOnMsgMrrSetSelfSettings() playerData == null.`);
        dataArray.push(DataForPlayerInRoom.fromJson({
            playerIndex         : playerIndex,
            userId              : null,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
            isReady             : true,
        }));
    }
}
export function updateOnMsgMrrDeleteRoomByServer(data: S): void {
    setRoomInfo(getExisted(data.getRoomId()), null);
}

export async function checkIsRed(): Promise<boolean> {
    const promiseArray: Promise<boolean>[] = [];
    for (const roomId of await getJoinedRoomIdArray() ?? []) {
        promiseArray.push(checkIsRedForRoom(roomId));
    }
    return checkIsAnyPromiseTrue(promiseArray);
}
export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
    const roomInfo = await getRoomInfo(roomId);
    if (roomInfo == null) {
        return false;
    }

    const selfUserId = getSelfUserId();
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

export async function createDataForCommonWarPlayerInfoPage(roomId: AuxiliaryTypesAuxiliaryTypesUndefinable<number>): Promise<CommonViewCommonWarPlayerInfoPageOpenData> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
    const warRuleCommonData = getExisted(instanceWarRule.getWarRuleCommonData());
    const playerInfoArray   : PlayerInfo[] = [];
    for (const playerInfo of (roomInfo.getPlayerDataList())) {
        const playerIndex = getExisted(playerInfo.getPlayerIndex());
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi                : false,
            userId              : playerInfo.getUserId() ?? null,
            coId                : playerInfo.getCoId() ?? null,
            unitAndTileSkinId   : playerInfo.getUnitAndTileSkinId() ?? null,
            isReady             : playerInfo.getIsReady() ?? false,
            isInTurn            : null,
            isDefeat            : null,
            restTimeToBoot      : null,
        });
    }

    return {
        gameConfig              : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
        playersCountUnneutral   : getPlayersCountUnneutral(warRuleCommonData),
        roomOwnerPlayerIndex    : null,
        callbackOnExitRoom      : null,
        callbackOnDeletePlayer  : null,
        callbackOnAddDummy      : null,
        callbackOnChangeDummy   : null,
        playerInfoArray         : playerInfoArray,
        enterTurnTime           : null,
        isReplay                : false,
    };
}

export async function createDataForCommonWarBasicSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypesUndefinable<number>): Promise<CommonViewCommonWarBasicSettingsPageOpenData> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings: [] };
    }

    const settingsForCommon = getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
    const settingsForMrw    = getExisted(roomInfo.getSettingsForMrw());
    const gameConfig        = getExisted(await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const normalMapId       = settingsForMrw.getNormalMapId() ?? 0;
    const warEventFullData  = (await getRawData(normalMapId))?.getWarEventFullData() ?? null;
    const bootTimerParams   = settingsForMrw.getBootTimerParams() ?? DefaultParams.concat();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const openData          : CommonViewCommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings    : [
            {
                settingsType    : BasicSettingsType.NormalMapId,
                currentValue    : normalMapId,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsType.WarRuleTitle,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsType.HasFog,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsType.Weather,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType        : BasicSettingsType.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType    : BasicSettingsType.WarEvent,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsType.TurnsAndWarOperationsLimit,
                currentValue    : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsType.TimerType,
                currentValue    : timerType,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
        ],
    };
    if (timerType === TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType    : BasicSettingsType.TimerRegularParam,
            currentValue    : bootTimerParams[1],
            instanceWarRule : instanceWarRule,
            gameConfig      : gameConfig,
            warEventFullData: warEventFullData,
            callbackOnModify: null,
        });
    } else if (timerType === TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType    : BasicSettingsType.TimerIncrementalParams,
                currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
        );
    } else {
        throw newError(`MrrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}`, ClientErrorCode.MrrModel_CreateDataForCommonWarBasicSettingsPage_00);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypesUndefinable<number>): Promise<OpenData> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
    return {
        canModify       : false,
        gcData          : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : instanceWarRule,
        gameModeId      : ModeId.RankedMatch,
    };
}
