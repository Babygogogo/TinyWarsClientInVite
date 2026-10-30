import type {
    Undefinable,
    PlayerInfo,
} from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import type { RoomFilter } from "../../auxiliaryTypes/RoomFilter.ts";
import { TimerTypeId } from "../../bootTimers/Constants.ts";
import type { OpenData as CommonWarAdvancedSettingsPageOpenData } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type { OpenData as CommonWarBasicSettingsPageOpenData } from "../../common/view/CommonWarBasicSettingsPage.ts";
import type { OpenData as CommonWarPlayerInfoPageOpenData } from "../../common/view/CommonWarPlayerInfoPage.ts";
import { CoId } from "../../cos/Constants.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import { getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import {
    getExisted,
    newError,
} from "../../helpers/Misc.ts";
import { StoreMcrRoomStaticInfo } from "../../localData/Storage.ts";
import {
    reqMcrGetRoomStaticInfo,
    reqMcrGetRoomPlayerInfo,
    reqMcrGetJoinableRoomIdArray,
    reqMcrGetJoinedRoomIdArray,
    reqMcrExitRoom,
    reqMcrDeletePlayer,
    reqMcrAddDummy,
    reqMcrSetDummySettings,
} from "./McrProxy.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { getFinalMcwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { McrRoomPlayerInfo } from "../../proto/schema/CommonProto/MultiCustomRoom/McrRoomPlayerInfo.ts";
import type { McrRoomStaticInfo } from "../../proto/schema/CommonProto/MultiCustomRoom/McrRoomStaticInfo.ts";
import type { S as McrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type { S as McrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { checkIsDummy } from "../../users/Utils.ts";
import {
    getPlayersCountUnneutral,
    getPlayerRule,
} from "../../warRules/utils/CommonData.ts";
import { BasicSettingsTypeId } from "../../wars/Constants.ts";

const _roomStaticInfoAccessor = new CachedDataAccessor<number, McrRoomStaticInfo>({
    reqData : (roomId: number) => reqMcrGetRoomStaticInfo(roomId),
});
const _roomPlayerInfoAccessor = new CachedDataAccessor<number, McrRoomPlayerInfo>({
    // dataExpireTime  : 30,
    reqData         : (roomId: number) => reqMcrGetRoomPlayerInfo(roomId),
});
const _joinableRoomIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqMcrGetJoinableRoomIdArray(),
});
const _joinedRoomIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqMcrGetJoinedRoomIdArray(),
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for rooms.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function getRoomStaticInfo(roomId: number): Promise<Undefinable<McrRoomStaticInfo>> {
    return (await StoreMcrRoomStaticInfo.getData(roomId)) ?? (_roomStaticInfoAccessor.getData(roomId));
}
function setRoomStaticInfo(roomId: number, info: Undefinable<McrRoomStaticInfo>): Promise<void> {
    _roomStaticInfoAccessor.setData(roomId, info);
    return StoreMcrRoomStaticInfo.setData(roomId, info);
}

export function getRoomPlayerInfo(roomId: number): Promise<Undefinable<McrRoomPlayerInfo>> {
    return _roomPlayerInfoAccessor.getData(roomId);
}
function setRoomPlayerInfo(roomId: number, info: Undefinable<McrRoomPlayerInfo>): void {
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

export async function getJoinableRoomIdSetWithFilter(filter: Undefinable<RoomFilter>): Promise<Set<number>> {
    const selfUserId = getSelfUserId();
    if (selfUserId == null) {
        return new Set();
    }

    const joinableRoomIdArray = await getJoinableRoomIdArray(false);
    return ((filter == null) || (!joinableRoomIdArray?.length))
        ? new Set(joinableRoomIdArray)
        : getFilteredRoomIdSet(joinableRoomIdArray, filter);
}
export async function getJoinedRoomIdSetWithFilter(filter: Undefinable<RoomFilter>): Promise<Set<number>> {
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
    if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
        return false;
    }

    const selfUserId        = getSelfUserId();
    const playerDataList    = roomPlayerInfo.getPlayerDataList();
    const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
    if ((selfPlayerData) && (!selfPlayerData.getIsReady())) {
        return true;
    }

    const warRuleCommonData = getExisted(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    if ((playerDataList.length === getPlayersCountUnneutral(warRuleCommonData))   &&
        (playerDataList.every(v => (v.getIsReady()) && (v.getUserId() != null)))                                                &&
        (selfPlayerData)                                                                                                        &&
        (roomPlayerInfo.getOwnerPlayerIndex() === selfPlayerData.getPlayerIndex())
    ) {
        return true;
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
    const warRuleCommonData = getExisted(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    return (selfPlayerData != null)
        && (selfPlayerData.getPlayerIndex() === roomPlayerInfo.getOwnerPlayerIndex())
        && (playerDataList.length == getPlayersCountUnneutral(warRuleCommonData))
        && (playerDataList.every(v => (v.getIsReady()) && (v.getUserId() != null)));
}

export function updateOnMsgMcrGetRoomStaticInfo(data: McrGetRoomStaticInfoResponse): Promise<void> {
    return setRoomStaticInfo(data.getRoomId() ?? 0, data.getRoomStaticInfo() ?? null);
}
export function updateOnFailedMsgMcrGetRoomStaticInfo(data: McrGetRoomStaticInfoResponse): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomStaticInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export function updateOnMsgMcrGetRoomPlayerInfo(data: McrGetRoomPlayerInfoResponse): void {
    setRoomPlayerInfo(data.getRoomId() ?? 0, data.getRoomPlayerInfo() ?? null);
}
export function updateOnFailedMsgMcrGetRoomPlayerInfo(data: McrGetRoomPlayerInfoResponse): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomPlayerInfoAccessor.updateOnRequestFailed(roomId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDataForCommonWarPlayerInfoPage(roomId: Undefinable<number>): Promise<CommonWarPlayerInfoPageOpenData> {
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

    const settingsForCommon     = getExisted(roomStaticInfo.getSettingsForCommon());
    const warRuleCommonData     = getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const playersCountUnneutral = getPlayersCountUnneutral(warRuleCommonData);
    const playerDataList        = roomPlayerInfo.getPlayerDataList();
    const playerInfoArray       : PlayerInfo[] = [];
    for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        const playerData = playerDataList.find(v => v.getPlayerIndex() === playerIndex);
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi                : false,
            userId              : playerData?.getUserId() ?? null,
            coId                : playerData ? playerData.getCoId() : null,
            unitAndTileSkinId   : playerData?.getUnitAndTileSkinId() ?? null,
            isReady             : playerData?.getIsReady() ?? null,
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
        callbackOnExitRoom      : () => reqMcrExitRoom(roomId),
        callbackOnDeletePlayer  : (playerIndex, forbidReentrance) => reqMcrDeletePlayer(roomId, playerIndex, forbidReentrance),
        callbackOnAddDummy      : (playerDataList.filter(v => (v.getUserId() == null) || (checkIsDummy(v.getUserId()))).length >= playersCountUnneutral - 2)
            ? null
            : playerIndex => {
                const availableCoIdArray = [...getFinalMcwHumanCoIdSet({
                    playerRule          : getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfiguration   : gcData,
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
                    callback                : (coId, skinId) => reqMcrAddDummy(roomId, playerIndex, coId, skinId),
                });
            },
        callbackOnChangeDummy   : playerIndex => {
            const playerInfo        = playerInfoArray.find(v => v.playerIndex === playerIndex);
            const currentCoId       = playerInfo?.coId ?? CoId.Empty;
            const currentSkinId     = playerInfo?.unitAndTileSkinId ?? SkinId.First;
            const usedSkinIdArray   = getNonNullElements(playerInfoArray.filter(v => v.playerIndex !== playerIndex).map(v => v.unitAndTileSkinId));

            openPanel(getDict().CommonChooseCoAndColorPanel, {
                gcData                  : gcData,
                availableCoIdArray      : [...getFinalMcwHumanCoIdSet({
                    playerRule          : getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfiguration   : gcData,
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
                        reqMcrSetDummySettings(roomId, playerIndex, coId, skinId);
                    }
                }
            });
        },
        playerInfoArray         : playerInfoArray,
        enterTurnTime           : null,
        isReplay                : false,
    };
}

export async function createDataForCommonWarBasicSettingsPage(roomId: Undefinable<number>, showPassword: boolean): Promise<CommonWarBasicSettingsPageOpenData> {
    if (roomId == null) {
        return null;
    }

    const roomInfo = await getRoomStaticInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings: [] };
    }

    const settingsForCommon = getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
    const settingsForMcw    = getExisted(roomInfo.getSettingsForMcw());
    const bootTimerParams   = settingsForMcw.getBootTimerParams();
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const normalMapId       = settingsForMcw.getNormalMapId();
    const warEventFullData  = (await getRawData(normalMapId))?.getWarEventFullData() ?? null;
    const warPassword       = settingsForMcw.getWarPassword();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const openData          : CommonWarBasicSettingsPageOpenData = {
        dataArrayForListSettings    : [
            {
                settingsType    : BasicSettingsTypeId.NormalMapId,
                currentValue    : settingsForMcw.getNormalMapId(),
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsTypeId.WarName,
                currentValue    : settingsForMcw.getWarName() ?? null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsTypeId.WarPassword,
                currentValue    : warPassword == null ? null : (showPassword ? warPassword : `****`),
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : BasicSettingsTypeId.WarComment,
                currentValue    : settingsForMcw.getWarComment() ?? null,
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
        throw newError(`McrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: Undefinable<number>): Promise<CommonWarAdvancedSettingsPageOpenData> {
    if (roomId == null) {
        return null;
    }

    const roomInfo = await getRoomStaticInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
    return {
        canModify       : false,
        gcData          : await getGameConfig(getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : instanceWarRule,
        gameModeId      : ModeId.Versus,
    };
}

async function checkIsMeetFilter({ roomId, roomPlayerInfo, roomStaticInfo, filter }: {
    roomId          : number;
    roomPlayerInfo  : Undefinable<McrRoomPlayerInfo>;
    roomStaticInfo  : Undefinable<McrRoomStaticInfo>;
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

    const instanceWarRule = roomStaticInfo?.getSettingsForCommon()?.getInstanceWarRule();
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
            const configVersion = roomStaticInfo?.getSettingsForCommon()?.getConfigVersion();
            if (configVersion == null) {
                return false;
            }

            const gameConfig = await getGameConfig(configVersion);
            if (gameConfig == null) {
                return false;
            }

            if (!playerDataList.some(v => gameConfig.getCoBasicCfg(v.getCoId())?.getCoCategoryId() === filterCoCategoryId)) {
                return false;
            }
        }
    }

    {
        const filterMapName = filter.mapName?.trim();
        if (filterMapName) {
            const normalMapId = roomStaticInfo ? (roomStaticInfo.getSettingsForMcw()?.getNormalMapId() ?? 0) : null;
            if (normalMapId == null) {
                return false;
            }

            const mapRawData    = await getRawData(normalMapId);
            const lowerCaseName = filterMapName.toLocaleLowerCase();
            if (!(mapRawData?.getMapNameArray() ?? []).some(v => {
                const name = v.getText();
                return (!!name) && (name.toLocaleLowerCase().includes(lowerCaseName));
            })) {
                return false;
            }
        }
    }

    return true;
}
