import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable, PlayerInfo } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import type { RoomFilter } from "../../auxiliaryTypes/RoomFilter.ts";
import { TimerTypeId } from "../../bootTimers/Constants.ts";
import type { OpenData } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type { OpenData as CommonViewCommonWarBasicSettingsPageOpenData } from "../../common/view/CommonWarBasicSettingsPage.ts";
import type { OpenData as CommonViewCommonWarPlayerInfoPageOpenData } from "../../common/view/CommonWarPlayerInfoPage.ts";
import { CoId } from "../../cos/Constants.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import { getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import { getGameConfig } from "../../gameConfig/GcModel.ts";
import { BasicSettingsType } from "../../gameConfig/GcWar.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { StoreMfrRoomStaticInfo } from "../../localData/Storage.ts";
import {
    reqMfrGetRoomStaticInfo,
    reqMfrGetRoomPlayerInfo,
    reqMfrGetJoinableRoomIdArray,
    reqMfrGetJoinedRoomIdArray,
    reqMfrExitRoom,
    reqMfrDeletePlayer,
    reqMfrAddDummy,
    reqMfrSetDummySettings,
} from "./MfrProxy.ts";
import { getFinalMfwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { MfrRoomPlayerInfo } from "../../proto/schema/CommonProto/MultiFreeRoom/MfrRoomPlayerInfo.ts";
import type { MfrRoomStaticInfo } from "../../proto/schema/CommonProto/MultiFreeRoom/MfrRoomStaticInfo.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgMfrGetRoomStaticInfo/S.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { checkIsDummy } from "../../users/Utils.ts";
import { getPlayersCountUnneutral, getPlayerRule } from "../../warRules/utils/CommonData.ts";

type Undefinable<T>                             = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

const _roomStaticInfoAccessor = new CachedDataAccessor<number, MfrRoomStaticInfo>({
    reqData : (roomId: number) => reqMfrGetRoomStaticInfo(roomId),
});
const _roomPlayerInfoAccessor = new CachedDataAccessor<number, MfrRoomPlayerInfo>({
    reqData : (roomId: number) => reqMfrGetRoomPlayerInfo(roomId),
});
const _joinableRoomIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqMfrGetJoinableRoomIdArray(),
});
const _joinedRoomIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqMfrGetJoinedRoomIdArray(),
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for rooms.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function getRoomStaticInfo(roomId: number): Promise<Undefinable<MfrRoomStaticInfo>> {
    return (await StoreMfrRoomStaticInfo.getData(roomId)) ?? _roomStaticInfoAccessor.getData(roomId);
}
function setRoomStaticInfo(roomId: number, info: Undefinable<MfrRoomStaticInfo>): Promise<void> {
    _roomStaticInfoAccessor.setData(roomId, info);
    return StoreMfrRoomStaticInfo.setData(roomId, info);
}

export function getRoomPlayerInfo(roomId: number): Promise<Undefinable<MfrRoomPlayerInfo>> {
    return _roomPlayerInfoAccessor.getData(roomId);
}
function setRoomPlayerInfo(roomId: number, info: Undefinable<MfrRoomPlayerInfo>): void {
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

export async function getJoinableRoomIdSetWithFilter(filter: AuxiliaryTypesAuxiliaryTypesUndefinable<RoomFilter>): Promise<Set<number>> {
    const selfUserId = getSelfUserId();
    if (selfUserId == null) {
        return new Set();
    }

    const unjoinedRoomIdArray = await getJoinableRoomIdArray(false);
    return ((filter == null) || (!unjoinedRoomIdArray?.length))
        ? new Set(unjoinedRoomIdArray)
        : getFilteredRoomIdSet(unjoinedRoomIdArray, filter);
}
export async function getJoinedRoomIdSetWithFilter(filter: AuxiliaryTypesAuxiliaryTypesUndefinable<RoomFilter>): Promise<Set<number>> {
    const selfUserId = getSelfUserId();
    if (selfUserId == null) {
        return new Set();
    }

    const joinedRoomIdArray = await getJoinedRoomIdArray(false);
    return ((filter == null) || (!joinedRoomIdArray?.length))
        ? new Set(joinedRoomIdArray)
        : getFilteredRoomIdSet(joinedRoomIdArray, filter);
}
async function getFilteredRoomIdSet(roomIdArray: number[], filter: RoomFilter): Promise<Set<number>> {
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
        const selfUserId        = getSelfUserId();
        const playerDataList    = roomPlayerInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if ((selfPlayerData) && (!selfPlayerData.getIsReady())) {
            return true;
        }

        const warRuleCommonData = getExisted(roomStaticInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
        if ((playerDataList.length === getPlayersCountUnneutral(warRuleCommonData))  &&
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

    const selfUserId        = getSelfUserId();
    const playerDataList    = roomPlayerInfo.getPlayerDataList();
    const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
    const warRuleCommonData = getExisted(roomStaticInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    return (selfPlayerData != null)
        && (selfPlayerData.getPlayerIndex() === roomPlayerInfo.getOwnerPlayerIndex())
        && (playerDataList.length === getPlayersCountUnneutral(warRuleCommonData))
        && (playerDataList.every(v => v.getIsReady()));
}

export function updateOnMsgMfrGetRoomStaticInfo(data: ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS): Promise<void> {
    return setRoomStaticInfo(data.getRoomId() ?? 0, data.getRoomStaticInfo() ?? null);
}
export function updateOnFailedMsgMfrGetRoomStaticInfo(data: ProtoSchemaCommonProtoNetMessageMsgMfrGetRoomStaticInfoS): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomStaticInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export function updateOnMsgMfrGetRoomPlayerInfo(data: S): void {
    setRoomPlayerInfo(data.getRoomId() ?? 0, data.getRoomPlayerInfo() ?? null);
}
export function updateOnFailedMsgMfrGetRoomPlayerInfo(data: S): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomPlayerInfoAccessor.updateOnRequestFailed(roomId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDataForCommonWarPlayerInfoPage(roomId: AuxiliaryTypesAuxiliaryTypesUndefinable<number>): Promise<CommonViewCommonWarPlayerInfoPageOpenData> {
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

    const settingsForCommon     = getExisted(roomStaticInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon());
    const warRuleCommonData     = getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const playersCountUnneutral = getPlayersCountUnneutral(warRuleCommonData);
    const playerDataList        = roomPlayerInfo.getPlayerDataList();
    const playerInfoArray       : PlayerInfo[] = [];
    for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        const playerData    = playerDataList.find(v => v.getPlayerIndex() === playerIndex);
        const userId        = playerData?.getUserId() ?? null;
        const isReady       = playerData?.getIsReady() ?? null;
        playerInfoArray.push({
            playerIndex,
            teamIndex           : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
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

    const gcData = await getGameConfig(getExisted(settingsForCommon.getConfigVersion()));
    return {
        gameConfig              : gcData,
        playersCountUnneutral   : playersCountUnneutral,
        roomOwnerPlayerIndex    : roomPlayerInfo.getOwnerPlayerIndex() ?? null,
        callbackOnExitRoom      : () => reqMfrExitRoom(roomId),
        callbackOnDeletePlayer  : (playerIndex, forbidReentrance) => reqMfrDeletePlayer(roomId, playerIndex, forbidReentrance),
        callbackOnAddDummy      : (playerDataList.filter(v => (v.getUserId() == null) || (checkIsDummy(v.getUserId()))).length >= playersCountUnneutral - 2)
            ? null
            : playerIndex => {
                const availableCoIdArray = [...getFinalMfwHumanCoIdSet({
                    playerRule          : getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfig          : gcData,
                    hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                    includeRandom       : true,
                })];
                const usedSkinIdArray       = getNonNullElements(playerInfoArray.map(v => v.unitAndTileSkinId));
                const availableSkinIdArray  = getAllSkinIdArray(false).filter(v => !usedSkinIdArray.includes(v));

                openPanel(getDict().CommonChooseCoAndColorPanel, {
                    gcData                  : gcData,
                    availableCoIdArray      : availableCoIdArray,
                    availableSkinIdArray    : availableSkinIdArray,
                    currentCoId             : availableCoIdArray[0],
                    currentSkinId           : availableSkinIdArray[0],
                    callback                : (coId, skinId) => reqMfrAddDummy(roomId, playerIndex, coId, skinId),
                });
            },
        callbackOnChangeDummy   : playerIndex => {
            const playerInfo        = playerInfoArray.find(v => v.playerIndex === playerIndex);
            const currentCoId       = playerInfo?.coId ?? CoId.Empty;
            const currentSkinId     = playerInfo?.unitAndTileSkinId ?? SkinId.First;
            const usedSkinIdArray   = getNonNullElements(playerInfoArray.filter(v => v.playerIndex !== playerIndex).map(v => v.unitAndTileSkinId));

            openPanel(getDict().CommonChooseCoAndColorPanel, {
                gcData                  : gcData,
                availableCoIdArray      : [...getFinalMfwHumanCoIdSet({
                    playerRule          : getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfig          : gcData,
                    hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                    includeRandom       : true,
                })],
                availableSkinIdArray    : getAllSkinIdArray(false).filter(v => !usedSkinIdArray.includes(v)),
                currentCoId             : currentCoId,
                currentSkinId           : currentSkinId,
                callback                : (coId, skinId) => {
                    if ((coId !== currentCoId)  ||
                        (skinId !== currentSkinId)
                    ) {
                        reqMfrSetDummySettings(roomId, playerIndex, coId, skinId);
                    }
                }
            });
        },
        playerInfoArray         : playerInfoArray,
        enterTurnTime           : null,
        isReplay                : false,
    };
}

export async function createDataForCommonWarBasicSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypesUndefinable<number>, showPassword: boolean): Promise<CommonViewCommonWarBasicSettingsPageOpenData> {
    if (roomId == null) {
        return null;
    }

    const roomInfo = await getRoomStaticInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings: [] };
    }

    const settingsForMfw    = getExisted(roomInfo.getSettingsForMfw());
    const settingsForCommon = getExisted(settingsForMfw.getInitialWarData()?.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
    const bootTimerParams   = getExisted(settingsForMfw.getBootTimerParams());
    const gameConfig        = getExisted(await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const warPassword       = settingsForMfw.getWarPassword();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const warEventFullData  = instanceWarRule.getWarEventFullData() ?? null;
    const openData          : CommonViewCommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings    : [
            {
                settingsType    : BasicSettingsType.WarName,
                currentValue    : settingsForMfw.getWarName() ?? null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsType.WarPassword,
                currentValue    : warPassword == null ? null : (showPassword ? warPassword : `****`),
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsType.WarComment,
                currentValue    : settingsForMfw.getWarComment() ?? null,
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
        throw newError(`MfrModel.createDataForCommonWarBasicSettingsPage() invalid timerType: ${timerType}.`);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: AuxiliaryTypesAuxiliaryTypesUndefinable<number>): Promise<OpenData> {
    if (roomId == null) {
        return null;
    }

    const roomInfo = await getRoomStaticInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = getExisted(roomInfo.getSettingsForMfw()?.getInitialWarData()?.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
    return {
        canModify       : false,
        gcData          : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : instanceWarRule,
        gameModeId      : ModeId.Free,
    };
}

async function checkIsMeetFilter({ roomId, roomPlayerInfo, roomStaticInfo, filter }: {
    roomId          : number;
    roomPlayerInfo  : Undefinable<MfrRoomPlayerInfo>;
    roomStaticInfo  : Undefinable<MfrRoomStaticInfo>;
    filter          : RoomFilter | null;
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

            const gameConfig = await getGameConfig(configVersion);
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
