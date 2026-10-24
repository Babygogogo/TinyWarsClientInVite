import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import type * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as Logger2 from "../../Logger.ts";
import * as MultiMatchRoomModelMmrProxy from "./MmrProxy.ts";
import * as MultiPlayerRoomsSelfSettings from "../../multiPlayerRooms/SelfSettings.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import type * as ProtoSchemaCommonProtoMultiMatchRoomMmrRoomInfo from "../../proto/schema/CommonProto/MultiMatchRoom/MmrRoomInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrDeleteRoomByServerS from "../../proto/schema/CommonProto/NetMessage/MsgMmrDeleteRoomByServer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetBannedNormalMapIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetBannedNormalMapIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetBootTimerDaysRangeS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetBootTimerDaysRange/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMmrGetRoomPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedCoIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedNormalMapIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBannedNormalMapIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetBootTimerDaysRangeS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetBootTimerDaysRange/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgMmrSetSelfSettings/S.ts";
import * as ProtoSchemaCommonProtoStructureDataForPlayerBanCo from "../../proto/schema/CommonProto/Structure/DataForPlayerBanCo.ts";
import * as ProtoSchemaCommonProtoStructureDataForPlayerInRoom from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

type Undefinable<T>                             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

let _maxConcurrentCountForStd       = 0;
let _maxConcurrentCountForFog       = 0;
let _bannedNormalMapIdArrayForStd   : number[] = [];
let _bannedNormalMapIdArrayForFog   : number[] = [];
let _bootTimerDaysRangeForStd       = [GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays, GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays];
let _bootTimerDaysRangeForFog       = [GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays, GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays];
const _selfSettingsDict             = new Map<number, MultiPlayerRoomsSelfSettings.SelfSettings>();
const _roomInfoAccessor             = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoMultiMatchRoomMmrRoomInfo.MmrRoomInfo>({
    reqData : (roomId: number) => MultiMatchRoomModelMmrProxy.reqMmrGetRoomPublicInfo(roomId),
});
const _joinedRoomIdArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => MultiMatchRoomModelMmrProxy.reqMmrGetJoinedRoomIdArray(),
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

export function getBannedNormalMapIdArray(hasFog: boolean): number[] {
    return hasFog ? _bannedNormalMapIdArrayForFog : _bannedNormalMapIdArrayForStd;
}

export function getBootTimerDaysRange(hasFog: boolean): number[] {
    return hasFog ? _bootTimerDaysRangeForFog : _bootTimerDaysRangeForStd;
}

function setRoomInfo(roomId: number, roomInfo: ProtoSchemaCommonProtoMultiMatchRoomMmrRoomInfo.MmrRoomInfo | null): void {
    _roomInfoAccessor.setData(roomId, roomInfo);
}
export function getRoomInfo(roomId: number): Promise<Undefinable<ProtoSchemaCommonProtoMultiMatchRoomMmrRoomInfo.MmrRoomInfo>> {
    return _roomInfoAccessor.getData(roomId);
}

export function setJoinedRoomIdArray(roomIdArray: number[]): void {
    _joinedRoomIdArrayAccessor.setData(null, roomIdArray);
}
export function getJoinedRoomIdArray(): Promise<Undefinable<number[]>> {
    return _joinedRoomIdArrayAccessor.getData(null);
}

export async function getSelfSettings(roomId: number): Promise<Undefinable<MultiPlayerRoomsSelfSettings.SelfSettings>> {
    const roomInfo = await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const existingData = _selfSettingsDict.get(roomId);
    if (existingData != null) {
        return existingData;
    } else {
        const newData = new MultiPlayerRoomsSelfSettings.SelfSettings(
            roomInfo,
            await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(roomInfo.getSettingsForCommon()?.getConfigVersion()))
        );
        _selfSettingsDict.set(roomId, newData);
        return newData;
    }
}

export function updateOnMsgMmrGetBannedNormalMapIdArray(data: ProtoSchemaCommonProtoNetMessageMsgMmrGetBannedNormalMapIdArrayS.S): void {
    _bannedNormalMapIdArrayForStd = data.getBannedNormalMapIdArrayForStd();
    _bannedNormalMapIdArrayForFog = data.getBannedNormalMapIdArrayForFog();
}
export function updateOnMsgMmrSetBannedNormalMapIdArray(data: ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedNormalMapIdArrayS.S): void {
    _bannedNormalMapIdArrayForStd = data.getBannedNormalMapIdArrayForStd();
    _bannedNormalMapIdArrayForFog = data.getBannedNormalMapIdArrayForFog();
}

export function updateOnMsgMmrGetBootTimerDaysRange(data: ProtoSchemaCommonProtoNetMessageMsgMmrGetBootTimerDaysRangeS.S): void {
    {
        const range = data.getRangeForStd();
        if (range.length === 2) {
            _bootTimerDaysRangeForStd = range;
        } else {
            _bootTimerDaysRangeForStd = [GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays, GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays];
        }
    }
    {
        const range = data.getRangeForFog();
        if (range.length === 2) {
            _bootTimerDaysRangeForFog = range;
        } else {
            _bootTimerDaysRangeForFog = [GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays, GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays];
        }
    }
}
export function updateOnMsgMmrSetBootTimerDaysRange(data: ProtoSchemaCommonProtoNetMessageMsgMmrSetBootTimerDaysRangeS.S): void {
    {
        const range = data.getRangeForStd();
        if (range.length === 2) {
            _bootTimerDaysRangeForStd = range;
        } else {
            _bootTimerDaysRangeForStd = [GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays, GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays];
        }
    }
    {
        const range = data.getRangeForFog();
        if (range.length === 2) {
            _bootTimerDaysRangeForFog = range;
        } else {
            _bootTimerDaysRangeForFog = [GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays, GameConfigGcWar.MultiMatchWar.BootTimer.DefaultDays];
        }
    }
}

export async function updateOnMsgMmrGetRoomPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS.S): Promise<void> {
    const roomId    = data.getRoomId() ?? 0;
    const roomInfo  = data.getRoomInfo() ?? null;
    setRoomInfo(roomId, roomInfo);

    if (roomInfo != null) {
        (await getSelfSettings(roomId))?.resetData(roomInfo);
    }
}
export function updateOnFailedMsgMmrGetRoomPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgMmrGetRoomPublicInfoS.S): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export async function updateOnMsgMmrSetBannedCoIdArray(data: ProtoSchemaCommonProtoNetMessageMsgMmrSetBannedCoIdArrayS.S): Promise<void> {
    const roomId    = HelpersMisc.getExisted(data.getRoomId());
    const roomInfo  = await getRoomInfo(roomId);
    if (!roomInfo) {
        return;
    }

    const settingsForMmw    = HelpersMisc.getExisted(roomInfo.getSettingsForMmw());
    const srcPlayerIndex    = data.getPlayerIndex();
    const bannedCoIdArray   = data.getBannedCoIdArray();
    const dataArray         = settingsForMmw.getDataArrayForBanCo();
    const playerData        = dataArray.find(v => v.getSrcPlayerIndex() === srcPlayerIndex);
    if (playerData) {
        playerData.setBannedCoIdArray(bannedCoIdArray);
    } else {
        dataArray.push(ProtoSchemaCommonProtoStructureDataForPlayerBanCo.DataForPlayerBanCo.fromJson({
            srcPlayerIndex  : srcPlayerIndex,
            bannedCoIdArray : bannedCoIdArray,
        }));
    }
}
export async function updateOnMsgMmrSetSelfSettings(data: ProtoSchemaCommonProtoNetMessageMsgMmrSetSelfSettingsS.S): Promise<void> {
    const roomInfo = await getRoomInfo(HelpersMisc.getExisted(data.getRoomId()));
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
        Logger2.warn(`MmrModel.updateOnMsgMmrSetSelfSettings() playerData == null.`);
        dataArray.push(ProtoSchemaCommonProtoStructureDataForPlayerInRoom.DataForPlayerInRoom.fromJson({
            playerIndex         : playerIndex,
            userId              : null,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
            isReady             : true,
        }));
    }
}
export function updateOnMsgMmrDeleteRoomByServer(data: ProtoSchemaCommonProtoNetMessageMsgMmrDeleteRoomByServerS.S): void {
    setRoomInfo(HelpersMisc.getExisted(data.getRoomId()), null);
}

export async function checkIsRed(): Promise<boolean> {
    const promiseArray: Promise<boolean>[] = [];
    for (const roomId of await getJoinedRoomIdArray() ?? []) {
        promiseArray.push(checkIsRedForRoom(roomId));
    }
    return HelpersMisc.checkIsAnyPromiseTrue(promiseArray);
}
export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
    const roomInfo = await getRoomInfo(roomId);
    if (roomInfo == null) {
        return false;
    }

    const selfUserId = UsersModel.getSelfUserId();
    const playerData = roomInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId);
    if (playerData == null) {
        return false;
    }

    if (roomInfo.getTimeForStartSetSelfSettings() != null) {
        return !playerData.getIsReady();
    } else {
        const arr = roomInfo.getSettingsForMmw()?.getDataArrayForBanCo();
        if ((arr == null) || (arr.every(v => v.getSrcPlayerIndex() !== playerData.getPlayerIndex()))) {
            return true;
        }
    }

    return false;
}

export async function createDataForCommonWarPlayerInfoPage(roomId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = HelpersMisc.getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
    const warRuleCommonData = HelpersMisc.getExisted(instanceWarRule.getWarRuleCommonData());
    const playerInfoArray   : AuxiliaryTypesAuxiliaryTypes.PlayerInfo[] = [];
    for (const playerInfo of (roomInfo.getPlayerDataList() ?? [])) {
        const playerIndex = HelpersMisc.getExisted(playerInfo.getPlayerIndex());
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
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
        gameConfig              : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())),
        playersCountUnneutral   : WarRulesUtilsCommonData.getPlayersCountUnneutral(warRuleCommonData),
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

export async function createDataForCommonWarBasicSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings: [] };
    }

    const settingsForCommon = HelpersMisc.getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
    const settingsForMmw    = HelpersMisc.getExisted(roomInfo.getSettingsForMmw());
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const normalMapId       = settingsForMmw.getNormalMapId() ?? 0;
    const warEventFullData  = (await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getWarEventFullData() ?? null;
    const bootTimerParams   = settingsForMmw.getBootTimerParams() ?? BootTimersConstants.DefaultParams.concat();
    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const openData          : CommonViewCommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings    : [
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.NormalMapId,
                currentValue    : normalMapId,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.WarRuleTitle,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.HasFog,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.Weather,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
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
                settingsType    : GameConfigGcWar.BasicSettingsType.WarEvent,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.TurnsAndWarOperationsLimit,
                currentValue    : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.TimerType,
                currentValue    : timerType,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
        ],
    };
    if (timerType === BootTimersConstants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType    : GameConfigGcWar.BasicSettingsType.TimerRegularParam,
            currentValue    : bootTimerParams[1],
            instanceWarRule : instanceWarRule,
            gameConfig      : gameConfig,
            warEventFullData: warEventFullData,
            callbackOnModify: null,
        });
    } else if (timerType === BootTimersConstants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.TimerIncrementalParams,
                currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
        );
    } else {
        throw HelpersMisc.newError(`MmrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}`, UtilsClientErrorCode.ClientErrorCode.MmrModel_CreateDataForCommonWarBasicSettingsPage_00);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = HelpersMisc.getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
    return {
        canModify       : false,
        gcData          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : instanceWarRule,
        gameModeId      : GameModesConstants.ModeId.UnrankedMatch,
    };
}
