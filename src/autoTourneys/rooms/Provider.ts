import * as AutoTourneysRoomsGateway from "./Gateway.ts";
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
import * as MultiPlayerRoomsSelfSettings from "../../multiPlayerRooms/SelfSettings.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import type * as ProtoSchemaCommonProtoAutoTourneyRoomAtrRoomInfo from "../../proto/schema/CommonProto/AutoTourneyRoom/AtrRoomInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrDeleteRoomByServerS from "../../proto/schema/CommonProto/NetMessage/MsgAtrDeleteRoomByServer/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS from "../../proto/schema/CommonProto/NetMessage/MsgAtrGetRoomPublicInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetBannedCoIdArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS from "../../proto/schema/CommonProto/NetMessage/MsgAtrSetSelfSettings/S.ts";
import * as ProtoSchemaCommonProtoStructureDataForPlayerBanCo from "../../proto/schema/CommonProto/Structure/DataForPlayerBanCo.ts";
import * as ProtoSchemaCommonProtoStructureDataForPlayerInRoom from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

type OpenDataForCommonWarBasicSettingsPage      = CommonViewCommonWarBasicSettingsPage.OpenData;
type OpenDataForCommonWarAdvancedSettingsPage   = CommonViewCommonWarAdvancedSettingsPage.OpenData;
type OpenDataForCommonWarPlayerInfoPage         = CommonViewCommonWarPlayerInfoPage.OpenData;
type AtrRoomInfo                                = ProtoSchemaCommonProtoAutoTourneyRoomAtrRoomInfo.AtrRoomInfo;
type Undefinable<T>                             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

const _selfSettingsDict         = new Map<number, MultiPlayerRoomsSelfSettings.SelfSettings>();
const _roomInfoAccessor         = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, AtrRoomInfo>({
    reqData : (roomId: number) => AutoTourneysRoomsGateway.reqAtrGetRoomPublicInfo(roomId),
});
const _joinedRoomIdArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => AutoTourneysRoomsGateway.reqAtrGetJoinedRoomIdArray(),
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

export async function updateOnMsgAtrGetRoomPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS.S): Promise<void> {
    const roomId    = data.getRoomId() ?? 0;
    const roomInfo  = data.getRoomInfo();
    setRoomInfo(roomId, roomInfo);

    if (roomInfo != null) {
        (await getSelfSettings(roomId))?.resetData(roomInfo);
    }
}
export function updateOnFailedMsgAtrGetRoomPublicInfo(data: ProtoSchemaCommonProtoNetMessageMsgAtrGetRoomPublicInfoS.S): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export async function updateOnMsgAtrSetBannedCoIdArray(data: ProtoSchemaCommonProtoNetMessageMsgAtrSetBannedCoIdArrayS.S): Promise<void> {
    const roomId    = HelpersMisc.getExisted(data.getRoomId());
    const roomInfo  = await getRoomInfo(roomId);
    if (!roomInfo) {
        return;
    }

    const settingsForAtw    = HelpersMisc.getExisted(roomInfo.getSettingsForAtw());
    const srcPlayerIndex    = data.getPlayerIndex();
    const bannedCoIdArray   = data.getBannedCoIdArray();
    const dataArray         = settingsForAtw.getDataArrayForBanCo();
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
export async function updateOnMsgAtrSetSelfSettings(data: ProtoSchemaCommonProtoNetMessageMsgAtrSetSelfSettingsS.S): Promise<void> {
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
        Logger2.warn(`AtrModel.updateOnMsgAtrSetSelfSettings() playerData == null.`);
        dataArray.push(ProtoSchemaCommonProtoStructureDataForPlayerInRoom.DataForPlayerInRoom.fromJson({
            playerIndex         : playerIndex,
            userId              : null,
            coId                : coId,
            unitAndTileSkinId   : unitAndTileSkinId,
            isReady             : true,
        }));
    }
}
export function updateOnMsgAtrDeleteRoomByServer(data: ProtoSchemaCommonProtoNetMessageMsgAtrDeleteRoomByServerS.S): void {
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
        const arr = roomInfo.getSettingsForAtw()?.getDataArrayForBanCo();
        if ((arr == null) || (arr.every(v => v.getSrcPlayerIndex() !== playerData.getPlayerIndex()))) {
            return true;
        }
    }

    return false;
}

export async function createDataForCommonWarPlayerInfoPage(roomId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<OpenDataForCommonWarPlayerInfoPage> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = HelpersMisc.getExisted(roomInfo.getSettingsForCommon());
    const warRuleCommonData = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const playerInfoArray   : AuxiliaryTypesAuxiliaryTypes.PlayerInfo[] = [];
    for (const playerInfo of roomInfo.getPlayerDataList()) {
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

export async function createDataForCommonWarBasicSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<OpenDataForCommonWarBasicSettingsPage> {
    const roomInfo = roomId == null ? null : await getRoomInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings: [] };
    }

    const settingsForCommon = HelpersMisc.getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
    const settingsForAtw    = HelpersMisc.getExisted(roomInfo.getSettingsForAtw());
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const normalMapId       = settingsForAtw.getNormalMapId() ?? 0;
    const warEventFullData  = (await NormalMapModelNormalMapModel.getRawData(normalMapId))?.getWarEventFullData();
    const bootTimerParams   = settingsForAtw.getBootTimerParams() ?? BootTimersConstants.DefaultParams.concat();
    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const openData          : OpenDataForCommonWarBasicSettingsPage = {
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
        throw HelpersMisc.newError(`AtrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}`, UtilsClientErrorCode.ClientErrorCode.AtrModel_CreateDataForCommonWarBasicSettingsPage_00);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<OpenDataForCommonWarAdvancedSettingsPage> {
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
        gameModeId      : GameModesConstants.ModeId.AutoTourney,
    };
}
