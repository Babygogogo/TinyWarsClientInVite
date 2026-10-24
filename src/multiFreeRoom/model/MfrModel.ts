import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import type * as AuxiliaryTypesRoomFilter from "../../auxiliaryTypes/RoomFilter.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as CommonViewCommonWarAdvancedSettingsPage from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type * as CommonViewCommonWarBasicSettingsPage from "../../common/view/CommonWarBasicSettingsPage.ts";
import type * as CommonViewCommonWarPlayerInfoPage from "../../common/view/CommonWarPlayerInfoPage.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as ForceSkinsConstants from "../../forceSkins/Constants.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as MultiFreeRoomModelMfrProxy from "./MfrProxy.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoMultiFreeRoomMfrRoomPlayerInfo from "../../proto/schema/CommonProto/MultiFreeRoom/MfrRoomPlayerInfo.ts";
import type * as ProtoSchemaCommonProtoMultiFreeRoomMfrRoomStaticInfo from "../../proto/schema/CommonProto/MultiFreeRoom/MfrRoomStaticInfo.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UsersUtils from "../../users/Utils.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";

type Undefinable<T>                             = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

const _roomStaticInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoMultiFreeRoomMfrRoomStaticInfo.MfrRoomStaticInfo>({
    reqData : (roomId: number) => MultiFreeRoomModelMfrProxy.reqMfrGetRoomStaticInfo(roomId),
});
const _roomPlayerInfoAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoMultiFreeRoomMfrRoomPlayerInfo.MfrRoomPlayerInfo>({
    reqData : (roomId: number) => MultiFreeRoomModelMfrProxy.reqMfrGetRoomPlayerInfo(roomId),
});
const _joinableRoomIdArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => MultiFreeRoomModelMfrProxy.reqMfrGetJoinableRoomIdArray(),
});
const _joinedRoomIdArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => MultiFreeRoomModelMfrProxy.reqMfrGetJoinedRoomIdArray(),
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for rooms.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function getRoomStaticInfo(roomId: number): Promise<Undefinable<ProtoSchemaCommonProtoMultiFreeRoomMfrRoomStaticInfo.MfrRoomStaticInfo>> {
    return (await LocalDataStorage2.StoreMfrRoomStaticInfo.getData(roomId)) ?? _roomStaticInfoAccessor.getData(roomId);
}
function setRoomStaticInfo(roomId: number, info: Undefinable<ProtoSchemaCommonProtoMultiFreeRoomMfrRoomStaticInfo.MfrRoomStaticInfo>): Promise<void> {
    _roomStaticInfoAccessor.setData(roomId, info);
    return LocalDataStorage2.StoreMfrRoomStaticInfo.setData(roomId, info);
}

export function getRoomPlayerInfo(roomId: number): Promise<Undefinable<ProtoSchemaCommonProtoMultiFreeRoomMfrRoomPlayerInfo.MfrRoomPlayerInfo>> {
    return _roomPlayerInfoAccessor.getData(roomId);
}
function setRoomPlayerInfo(roomId: number, info: Undefinable<ProtoSchemaCommonProtoMultiFreeRoomMfrRoomPlayerInfo.MfrRoomPlayerInfo>): void {
    _roomPlayerInfoAccessor.setData(roomId, info);
}

export function getJoinableRoomIdArray(forceNew: boolean): Promise<Undefinable<number[]>> {
    return _joinableRoomIdArrayAccessor.getData(null, forceNew);
}
export function setJoinableRoomIdArray(roomIdArray: Undefinable<number[]>): void {
    _joinableRoomIdArrayAccessor.setData(null, roomIdArray);
}

export function getJoinedRoomIdArray(forceNew: boolean): Promise<Undefinable<number[]>> {
    return _joinedRoomIdArrayAccessor.getData(null, forceNew);
}
export function setJoinedRoomIdArray(roomIdArray: Undefinable<number[]>): void {
    _joinedRoomIdArrayAccessor.setData(null, roomIdArray);
}

export async function getJoinableRoomIdSetWithFilter(filter: AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesRoomFilter.RoomFilter>): Promise<Set<number>> {
    const selfUserId = UsersModel.getSelfUserId();
    if (selfUserId == null) {
        return new Set();
    }

    const unjoinedRoomIdArray = await getJoinableRoomIdArray(false);
    return ((filter == null) || (!unjoinedRoomIdArray?.length))
        ? new Set(unjoinedRoomIdArray)
        : getFilteredRoomIdSet(unjoinedRoomIdArray, filter);
}
export async function getJoinedRoomIdSetWithFilter(filter: AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesRoomFilter.RoomFilter>): Promise<Set<number>> {
    const selfUserId = UsersModel.getSelfUserId();
    if (selfUserId == null) {
        return new Set();
    }

    const joinedRoomIdArray = await getJoinedRoomIdArray(false);
    return ((filter == null) || (!joinedRoomIdArray?.length))
        ? new Set(joinedRoomIdArray)
        : getFilteredRoomIdSet(joinedRoomIdArray, filter);
}
async function getFilteredRoomIdSet(roomIdArray: number[], filter: AuxiliaryTypesRoomFilter.RoomFilter): Promise<Set<number>> {
    if (filter.mapName) {
        return new Set();
    }

    const [roomStaticInfoArray, roomPlayerInfoArray] = await Promise.all([
        await Promise.all(roomIdArray.map(v => getRoomStaticInfo(v))),
        await Promise.all(roomIdArray.map(v => getRoomPlayerInfo(v))),
    ]);
    const filteredRoomIdSet = new Set<number>();
    for (let i = 0; i < roomIdArray.length; ++i) {
        const roomId = roomIdArray[i];
        if (await checkIsMeetFilter({
            roomId,
            roomStaticInfo  : roomStaticInfoArray[i],
            roomPlayerInfo  : roomPlayerInfoArray[i],
            filter,
        })) {
            filteredRoomIdSet.add(roomId);
        }
    }

    return filteredRoomIdSet;
}

export async function checkIsRed(): Promise<boolean> {
    for (const roomId of await getJoinedRoomIdSetWithFilter(null)) {
        if (await checkIsRedForRoom(roomId)) {
            return true;
        }
    }
    return false;
}
export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
    const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
        getRoomStaticInfo(roomId),
        getRoomPlayerInfo(roomId),
    ]);
    if ((roomPlayerInfo) && (roomStaticInfo)) {
        const selfUserId        = UsersModel.getSelfUserId();
        const playerDataList    = roomPlayerInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if ((selfPlayerData) && (!selfPlayerData.getIsReady())) {
            return true;
        }

        const warRuleCommonData = HelpersMisc.getExisted(roomStaticInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
        if ((playerDataList.length === WarRulesUtilsCommonData.getPlayersCountUnneutral(warRuleCommonData))  &&
            (playerDataList.every(v => v.getIsReady()))                                                                            &&
            (selfPlayerData)                                                                                                       &&
            (roomPlayerInfo.getOwnerPlayerIndex() === selfPlayerData.getPlayerIndex())
        ) {
            return true;
        }
    }
    return false;
}
export async function checkCanStartGame(roomId: number): Promise<boolean> {
    const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
        getRoomStaticInfo(roomId),
        getRoomPlayerInfo(roomId),
    ]);
    if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
        return false;
    }

    const selfUserId        = UsersModel.getSelfUserId();
    const playerDataList    = roomPlayerInfo.getPlayerDataList();
    const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
    const warRuleCommonData = HelpersMisc.getExisted(roomStaticInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    return (selfPlayerData != null)
        && (selfPlayerData.getPlayerIndex() === roomPlayerInfo.getOwnerPlayerIndex())
        && (playerDataList.length === WarRulesUtilsCommonData.getPlayersCountUnneutral(warRuleCommonData))
        && (playerDataList.every(v => v.getIsReady()));
}

export function updateOnMsgMfrGetRoomStaticInfo(data: ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS.S): Promise<void> {
    return setRoomStaticInfo(data.getRoomId() ?? 0, data.getRoomStaticInfo() ?? null);
}
export function updateOnFailedMsgMfrGetRoomStaticInfo(data: ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS.S): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomStaticInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export function updateOnMsgMfrGetRoomPlayerInfo(data: ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS.S): void {
    setRoomPlayerInfo(data.getRoomId() ?? 0, data.getRoomPlayerInfo() ?? null);
}
export function updateOnFailedMsgMfrGetRoomPlayerInfo(data: ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomPlayerInfoS.S): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomPlayerInfoAccessor.updateOnRequestFailed(roomId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDataForCommonWarPlayerInfoPage(roomId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<CommonViewCommonWarPlayerInfoPage.OpenData> {
    if (roomId == null) {
        return null;
    }

    const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
        getRoomStaticInfo(roomId),
        getRoomPlayerInfo(roomId),
    ]);
    if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
        return null;
    }

    const settingsForCommon     = HelpersMisc.getExisted(roomStaticInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon());
    const warRuleCommonData     = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const playersCountUnneutral = WarRulesUtilsCommonData.getPlayersCountUnneutral(warRuleCommonData);
    const playerDataList        = roomPlayerInfo.getPlayerDataList();
    const playerInfoArray       : AuxiliaryTypesAuxiliaryTypes.PlayerInfo[] = [];
    for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        const playerData    = playerDataList.find(v => v.getPlayerIndex() === playerIndex);
        const userId        = playerData?.getUserId() ?? null;
        const isReady       = playerData?.getIsReady() ?? null;
        playerInfoArray.push({
            playerIndex,
            teamIndex           : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi                : (userId == null) && (!!isReady),
            userId              : userId,
            coId                : playerData ? playerData.getCoId() ?? 0 : null,
            unitAndTileSkinId   : playerData?.getUnitAndTileSkinId() ?? null,
            isReady             : isReady,
            isInTurn            : null,
            isDefeat            : null,
            restTimeToBoot      : null,
        });
    }

    const gcData = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion()));
    return {
        gameConfig              : gcData,
        playersCountUnneutral   : playersCountUnneutral,
        roomOwnerPlayerIndex    : roomPlayerInfo.getOwnerPlayerIndex() ?? null,
        callbackOnExitRoom      : () => MultiFreeRoomModelMfrProxy.reqMfrExitRoom(roomId),
        callbackOnDeletePlayer  : (playerIndex, forbidReentrance) => MultiFreeRoomModelMfrProxy.reqMfrDeletePlayer(roomId, playerIndex, forbidReentrance),
        callbackOnAddDummy      : (playerDataList.filter(v => (v.getUserId() == null) || (UsersUtils.checkIsDummy(v.getUserId()))).length >= playersCountUnneutral - 2)
            ? null
            : playerIndex => {
                const availableCoIdArray = [...PlayerRulesUtils.getFinalMfwHumanCoIdSet({
                    playerRule          : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfig          : gcData,
                    hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                    includeRandom       : true,
                })];
                const usedSkinIdArray       = HelpersCollection.getNonNullElements(playerInfoArray.map(v => v.unitAndTileSkinId));
                const availableSkinIdArray  = ForceSkinsUtils.getAllSkinIdArray(false).filter(v => !usedSkinIdArray.includes(v));

                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseCoAndColorPanel, {
                    gcData                  : gcData,
                    availableCoIdArray      : availableCoIdArray,
                    availableSkinIdArray    : availableSkinIdArray,
                    currentCoId             : availableCoIdArray[0],
                    currentSkinId           : availableSkinIdArray[0],
                    callback                : (coId, skinId) => MultiFreeRoomModelMfrProxy.reqMfrAddDummy(roomId, playerIndex, coId, skinId),
                });
            },
        callbackOnChangeDummy   : playerIndex => {
            const playerInfo        = playerInfoArray.find(v => v.playerIndex === playerIndex);
            const currentCoId       = playerInfo?.coId ?? CosConstants.CoId.Empty;
            const currentSkinId     = playerInfo?.unitAndTileSkinId ?? ForceSkinsConstants.SkinId.First;
            const usedSkinIdArray   = HelpersCollection.getNonNullElements(playerInfoArray.filter(v => v.playerIndex !== playerIndex).map(v => v.unitAndTileSkinId));

            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseCoAndColorPanel, {
                gcData                  : gcData,
                availableCoIdArray      : [...PlayerRulesUtils.getFinalMfwHumanCoIdSet({
                    playerRule          : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfig          : gcData,
                    hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                    includeRandom       : true,
                })],
                availableSkinIdArray    : ForceSkinsUtils.getAllSkinIdArray(false).filter(v => !usedSkinIdArray.includes(v)),
                currentCoId             : currentCoId,
                currentSkinId           : currentSkinId,
                callback                : (coId, skinId) => {
                    if ((coId !== currentCoId)  ||
                        (skinId !== currentSkinId)
                    ) {
                        MultiFreeRoomModelMfrProxy.reqMfrSetDummySettings(roomId, playerIndex, coId, skinId);
                    }
                }
            });
        },
        playerInfoArray         : playerInfoArray,
        enterTurnTime           : null,
        isReplay                : false,
    };
}

export async function createDataForCommonWarBasicSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>, showPassword: boolean): Promise<CommonViewCommonWarBasicSettingsPage.OpenData> {
    if (roomId == null) {
        return null;
    }

    const roomInfo = await getRoomStaticInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings: [] };
    }

    const settingsForMfw    = HelpersMisc.getExisted(roomInfo.getSettingsForMfw());
    const settingsForCommon = HelpersMisc.getExisted(settingsForMfw.getInitialWarData()?.getSettingsForCommon());
    const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
    const bootTimerParams   = HelpersMisc.getExisted(settingsForMfw.getBootTimerParams());
    const gameConfig        = HelpersMisc.getExisted(await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())));
    const warPassword       = settingsForMfw.getWarPassword();
    const timerType         = bootTimerParams[0] as BootTimersConstants.TimerTypeId;
    const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
    const openData          : CommonViewCommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings    : [
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.WarName,
                currentValue    : settingsForMfw.getWarName() ?? null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.WarPassword,
                currentValue    : warPassword == null ? null : (showPassword ? warPassword : `****`),
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : GameConfigGcWar.BasicSettingsType.WarComment,
                currentValue    : settingsForMfw.getWarComment() ?? null,
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
        throw HelpersMisc.newError(`MfrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}.`);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypes.Undefinable<number>): Promise<CommonViewCommonWarAdvancedSettingsPage.OpenData> {
    if (roomId == null) {
        return null;
    }

    const roomInfo = await getRoomStaticInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = HelpersMisc.getExisted(roomInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon());
    const instanceWarRule   = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule());
    return {
        canModify       : false,
        gcData          : await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : instanceWarRule,
        gameModeId      : GameModesConstants.ModeId.Free,
    };
}

async function checkIsMeetFilter({ roomId, roomPlayerInfo, roomStaticInfo, filter }: {
    roomId          : number;
    roomPlayerInfo  : Undefinable<ProtoSchemaCommonProtoMultiFreeRoomMfrRoomPlayerInfo.MfrRoomPlayerInfo>;
    roomStaticInfo  : Undefinable<ProtoSchemaCommonProtoMultiFreeRoomMfrRoomStaticInfo.MfrRoomStaticInfo>;
    filter          : AuxiliaryTypesRoomFilter.RoomFilter | null;
}): Promise<boolean> {
    if (roomPlayerInfo == null) {
        return false;
    }

    if (filter == null) {
        return true;
    }

    {
        const filterRoomId = filter.roomId;
        if ((filterRoomId != null) && (roomId !== filterRoomId)) {
            return false;
        }
    }

    const instanceWarRule = roomStaticInfo?.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule();
    {
        const filterHasFog = filter.hasFog;
        if ((filterHasFog != null) && ((!!instanceWarRule?.getWarRuleCommonData()?.getHasFogByDefault()) !== filterHasFog)) {
            return false;
        }
    }

    const playerDataList = roomPlayerInfo.getPlayerDataList();
    {
        const filterUserIdInRoom = filter.userIdInRoom;
        if ((filterUserIdInRoom != null) && (!playerDataList.some(v => v.getUserId() === filterUserIdInRoom))) {
            return false;
        }
    }

    {
        const filterUserIdNotInRoom = filter.userIdNotInRoom;
        if ((filterUserIdNotInRoom != null) && (playerDataList.some(v => v.getUserId() === filterUserIdNotInRoom))) {
            return false;
        }
    }

    {
        const filterCoCategoryId = filter.coCategoryId;
        if (filterCoCategoryId != null) {
            const configVersion = roomStaticInfo?.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getConfigVersion();
            if (configVersion == null) {
                return false;
            }

            const gameConfig = await GameConfigGcModel.getGameConfig(configVersion);
            if (gameConfig == null) {
                return false;
            }

            if (!playerDataList.some(v => gameConfig.getCoBasicCfg(v.getCoId() ?? 0)?.getCoCategoryId() === filterCoCategoryId)) {
                return false;
            }
        }
    }

    return true;
}
