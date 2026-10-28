import { reqAtrGetRoomPublicInfo, reqAtrGetJoinedRoomIdArray } from "./Gateway.ts";
import type { Undefinable, PlayerInfo } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import { TimerTypeId } from "../../bootTimers/Constants.ts";
import type { OpenData } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type { OpenData as CommonViewCommonWarBasicSettingsPageOpenData } from "../../common/view/CommonWarBasicSettingsPage.ts";
import type { OpenData as CommonViewCommonWarPlayerInfoPageOpenData } from "../../common/view/CommonWarPlayerInfoPage.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getExisted, checkIsAnyPromiseTrue, newError } from "../../helpers/Misc.ts";
import { warn } from "../../Logger.ts";
import { SelfSettings } from "../../multiPlayerRooms/SelfSettings.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import type { AtrRoomInfo } from "../../proto/schema/CommonProto/AutoTourneyRoom/AtrRoomInfo.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgAtrDeleteRoomByServer/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetRoomPublicInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetBannedCoIdArray/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS,
} from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetSelfSettings/S.ts";
import { DataForPlayerBanCo } from "../../proto/schema/CommonProto/Structure/DataForPlayerBanCo.ts";
import { DataForPlayerInRoom } from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { getPlayerRule, getPlayersCountUnneutral } from "../../warRules/utils/CommonData.ts";
import {BasicSettingsTypeId} from "../../wars/Constants.ts";

type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPageOpenData;
type OpenDataForCommonWarAdvancedSettingsPage   = OpenData;
type OpenDataForCommonWarPlayerInfoPage         = CommonViewCommonWarPlayerInfoPageOpenData;
const _selfSettingsDict         = new Map<number, SelfSettings>();
const _roomInfoAccessor         = new CachedDataAccessor<number, AtrRoomInfo>({
    reqData : (roomId: number) => reqAtrGetRoomPublicInfo(roomId),
});
const _joinedRoomIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqAtrGetJoinedRoomIdArray(),
});

function setRoomInfo(roomId: number, roomInfo: Undefinable<AtrRoomInfo>): void {
    _roomInfoAccessor.setData(roomId, roomInfo);
}
export function getRoomInfo(roomId: number): Promise<Undefinable<AtrRoomInfo>> {
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

export async function updateOnMsgAtrGetRoomPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS): Promise<void> {
    const roomId    = data.getRoomId() ?? 0;
    const roomInfo  = data.getRoomInfo();
    setRoomInfo(roomId, roomInfo);

    if (roomInfo != null) {
        (await getSelfSettings(roomId))?.resetData(roomInfo);
    }
}
export function updateOnFailedMsgAtrGetRoomPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export async function updateOnMsgAtrSetBannedCoIdArray(data: ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS): Promise<void> {
    const roomId    = getExisted(data.getRoomId());
    const roomInfo  = await getRoomInfo(roomId);
    if (!roomInfo) {
        return;
    }

    const settingsForAtw    = getExisted(roomInfo.getSettingsForAtw());
    const srcPlayerIndex    = data.getPlayerIndex();
    const bannedCoIdArray   = data.getBannedCoIdArray();
    const dataArray         = settingsForAtw.getDataArrayForBanCo();
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
export async function updateOnMsgAtrSetSelfSettings(data: ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS): Promise<void> {
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
        warn(`AtrModel.updateOnMsgAtrSetSelfSettings() playerData == null.`);
        dataArray.push(DataForPlayerInRoom.fromJson({
            playerIndex         : playerIndex,
            userId              : null,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
            isReady             : true,
        }));
    }
}
export function updateOnMsgAtrDeleteRoomByServer(data: S): void {
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
        const arr = roomInfo.getSettingsForAtw()?.getDataArrayForBanCo();
        if ((arr == null) || (arr.every(v => v.getSrcPlayerIndex() !== playerData.getPlayerIndex()))) {
            return true;
        }
    }

    return false;
}

export async function createDataForCommonWarPlayerInfoPage(roomId: Undefinable<number>): Promise<OpenDataForCommonWarPlayerInfoPage> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = getExisted(roomInfo.getSettingsForCommon());
    const warRuleCommonData = getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const playerInfoArray   : PlayerInfo[] = [];
    for (const playerInfo of roomInfo.getPlayerDataList()) {
        const playerIndex = playerInfo.getPlayerIndex();
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi                : false,
            userId              : playerInfo.getUserId() ?? null,
            coId                : playerInfo.getCoId(),
            unitAndTileSkinId   : playerInfo.getUnitAndTileSkinId(),
            isReady             : playerInfo.getIsReady(),
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

export async function createDataForCommonWarBasicSettingsPage(roomId: Undefinable<number>): Promise<OpenDataForCommonWarBasicSettingsPage> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings: [] };
    }

    const settingsForCommon = getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
    const settingsForAtw    = getExisted(roomInfo.getSettingsForAtw());
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const normalMapId       = settingsForAtw.getNormalMapId();
    const warEventFullData  = (await getRawData(normalMapId))?.getWarEventFullData();
    const bootTimerParams   = settingsForAtw.getBootTimerParams();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const openData          : OpenDataForCommonWarBasicSettingsPage = {
        dataArrayForListSettings    : [
            {
                settingsType    : BasicSettingsTypeId.NormalMapId,
                currentValue    : normalMapId,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsTypeId.WarRuleTitle,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsTypeId.HasFog,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsTypeId.Weather,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
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
                settingsType    : BasicSettingsTypeId.WarEvent,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue    : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsTypeId.TimerType,
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
            settingsType    : BasicSettingsTypeId.TimerRegularParam,
            currentValue    : bootTimerParams[1],
            instanceWarRule : instanceWarRule,
            gameConfig      : gameConfig,
            warEventFullData: warEventFullData,
            callbackOnModify: null,
        });
    } else if (timerType === TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType    : BasicSettingsTypeId.TimerIncrementalParams,
                currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
        );
    } else {
        throw newError(`AtrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}`, ClientErrorCode.AtrModel_CreateDataForCommonWarBasicSettingsPage_00);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: Undefinable<number>): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
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
        gameModeId      : ModeId.AutoTourney,
    };
}
