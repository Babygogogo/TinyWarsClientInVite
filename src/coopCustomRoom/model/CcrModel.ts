import type { Undefinable, PlayerInfo } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import type { RoomFilter } from "../../auxiliaryTypes/RoomFilter.ts";
import { TimerTypeId } from "../../bootTimers/Constants.ts";
import type { OpenData } from "../../common/view/CommonWarAdvancedSettingsPage.ts";
import type { OpenData as CommonViewCommonWarBasicSettingsPageOpenData } from "../../common/view/CommonWarBasicSettingsPage.ts";
import type { OpenData as CommonViewCommonWarPlayerInfoPageOpenData } from "../../common/view/CommonWarPlayerInfoPage.ts";
import {
    reqCcrGetRoomStaticInfo,
    reqCcrGetRoomPlayerInfo,
    reqCcrGetJoinableRoomIdArray,
    reqCcrGetJoinedRoomIdArray,
    reqCcrExitRoom,
    reqCcrDeletePlayer,
    reqCcrAddDummy,
    reqCcrSetDummySettings,
} from "./CcrProxy.ts";
import { CoId } from "../../cos/Constants.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import { getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { StoreCcrRoomStaticInfo } from "../../localData/Storage.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { getFinalCcwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { CcrRoomPlayerInfo } from "../../proto/schema/CommonProto/CoopCustomRoom/CcrRoomPlayerInfo.ts";
import type { CcrRoomStaticInfo } from "../../proto/schema/CommonProto/CoopCustomRoom/CcrRoomStaticInfo.ts";
import type { C } from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/C.ts";
import type { S } from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomPlayerInfo/S.ts";
import type {
    S as ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS,
} from "../../proto/schema/CommonProto/NetMessage/MsgCcrGetRoomStaticInfo/S.ts";
import type { C as ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomC } from "../../proto/schema/CommonProto/NetMessage/MsgCcrJoinRoom/C.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { checkIsDummy } from "../../users/Utils.ts";
import { getPlayersCountUnneutral, getPlayerRule } from "../../warRules/utils/CommonData.ts";
import {BasicSettingsTypeId} from "../../wars/Constants.ts";

export type DataForCreateRoom   = C;
export type DataForJoinRoom     = ProtoSchemaCommonProtoNetMessageMsgCcrJoinRoomC;

const _roomStaticInfoAccessor = new CachedDataAccessor<number, CcrRoomStaticInfo>({
    reqData : (roomId: number) => reqCcrGetRoomStaticInfo(roomId),
});
const _roomPlayerInfoAccessor = new CachedDataAccessor<number, CcrRoomPlayerInfo>({
    reqData : (roomId: number) => reqCcrGetRoomPlayerInfo(roomId),
});
const _joinableRoomIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqCcrGetJoinableRoomIdArray(),
});
const _joinedRoomIdArrayAccessor = new CachedDataAccessor<null, number[]>({
    reqData : () => reqCcrGetJoinedRoomIdArray(),
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for rooms.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function getRoomStaticInfo(roomId: number): Promise<Undefinable<CcrRoomStaticInfo>> {
    return (await StoreCcrRoomStaticInfo.getData(roomId)) ?? (_roomStaticInfoAccessor.getData(roomId));
}
function setRoomStaticInfo(roomId: number, info: Undefinable<CcrRoomStaticInfo>): Promise<void> {
    _roomStaticInfoAccessor.setData(roomId, info);
    return StoreCcrRoomStaticInfo.setData(roomId, info);
}

export function getRoomPlayerInfo(roomId: number): Promise<Undefinable<CcrRoomPlayerInfo>> {
    return _roomPlayerInfoAccessor.getData(roomId);
}
function setRoomPlayerInfo(roomId: number, info: Undefinable<CcrRoomPlayerInfo>): void {
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

    const unjoinedRoomIdArray = await getJoinableRoomIdArray(false);
    return ((filter == null) || (!unjoinedRoomIdArray?.length))
        ? new Set(unjoinedRoomIdArray)
        : getFilteredRoomIdSet(unjoinedRoomIdArray, filter);
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
            roomId          : roomId,
            roomStaticInfo  : roomStaticInfoArray[i],
            roomPlayerInfo  : roomPlayerInfoArray[i],
            filter          : filter,
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
    if ((roomStaticInfo) && (roomPlayerInfo)) {
        const selfUserId        = getSelfUserId();
        const playerDataList    = roomPlayerInfo.getPlayerDataList();
        const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
        if ((selfPlayerData) && (!selfPlayerData.getIsReady())) {
            return true;
        }

        const warRuleCommonData = getExisted(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
        if ((playerDataList.length === getPlayersCountUnneutral(warRuleCommonData))   &&
            (playerDataList.every(v => v.getIsReady()))                                                                             &&
            (selfPlayerData)                                                                                                        &&
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
    const warRuleCommonData = getExisted(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    return (selfPlayerData != null)
        && (selfPlayerData.getPlayerIndex() === roomPlayerInfo.getOwnerPlayerIndex())
        && (playerDataList.length == getPlayersCountUnneutral(warRuleCommonData))
        && (playerDataList.every(v => v.getIsReady()));
}

export function updateOnMsgCcrGetRoomStaticInfo(data: ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS): Promise<void> {
    return setRoomStaticInfo(data.getRoomId() ?? 0, data.getRoomStaticInfo() ?? null);
}
export function updateOnFailedMsgCcrGetRoomStaticInfo(data: ProtoSchemaCommonProtoNetMessageMsgCcrGetRoomStaticInfoS): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomStaticInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export function updateOnMsgCcrGetRoomPlayerInfo(data: S): void {
    setRoomPlayerInfo(data.getRoomId() ?? 0, data.getRoomPlayerInfo() ?? null);
}
export function updateOnFailedMsgCcrGetRoomPlayerInfo(data: S): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomPlayerInfoAccessor.updateOnRequestFailed(roomId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDataForCommonWarPlayerInfoPage(roomId: Undefinable<number>): Promise<CommonViewCommonWarPlayerInfoPageOpenData> {
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
        const playerData    = playerDataList.find(v => v.getPlayerIndex() === playerIndex);
        const userId        = playerData?.getUserId() ?? null;
        const isReady       = playerData?.getIsReady() ?? null;

        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi                : (userId == null) && (!!isReady),
            userId              : userId,
            coId                : playerData ? playerData.getCoId() : null,
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
        callbackOnExitRoom      : () => reqCcrExitRoom(roomId),
        callbackOnDeletePlayer  : (playerIndex, forbidReentrance) => reqCcrDeletePlayer(roomId, playerIndex, forbidReentrance),
        callbackOnAddDummy      : (playerDataList.filter(v => (v.getUserId() == null) || (checkIsDummy(v.getUserId()))).length >= playersCountUnneutral - 2)
            ? null
            : playerIndex => {
                const availableCoIdArray = [...getFinalCcwHumanCoIdSet({
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
                    callback                : (coId, skinId) => reqCcrAddDummy(roomId, playerIndex, coId, skinId),
                });
            },
        callbackOnChangeDummy   : playerIndex => {
            const playerInfo        = playerInfoArray.find(v => v.playerIndex === playerIndex);
            const currentCoId       = playerInfo?.coId ?? CoId.Empty;
            const currentSkinId     = playerInfo?.unitAndTileSkinId ?? SkinId.First;
            const usedSkinIdArray   = getNonNullElements(playerInfoArray.filter(v => v.playerIndex !== playerIndex).map(v => v.unitAndTileSkinId));

            openPanel(getDict().CommonChooseCoAndColorPanel, {
                gcData                  : gcData,
                availableCoIdArray      : [...getFinalCcwHumanCoIdSet({
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
                        reqCcrSetDummySettings(roomId, playerIndex, coId, skinId);
                    }
                }
            });
        },
        playerInfoArray         : playerInfoArray,
        enterTurnTime           : null,
        isReplay                : false,
    };
}

export async function createDataForCommonWarBasicSettingsPage(roomId: Undefinable<number>, showPassword: boolean): Promise<CommonViewCommonWarBasicSettingsPageOpenData> {
    if (roomId == null) {
        return null;
    }

    const roomInfo = await getRoomStaticInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings: [] };
    }

    const settingsForCommon = getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = getExisted(settingsForCommon.getInstanceWarRule());
    const settingsForCcw    = getExisted(roomInfo.getSettingsForCcw());
    const bootTimerParams   = settingsForCcw.getBootTimerParams();
    const normalMapId       = settingsForCcw.getNormalMapId();
    const gameConfig        = (await getGameConfig(getExisted(settingsForCommon.getConfigVersion())));
    const warEventFullData  = (await getRawData(normalMapId))?.getWarEventFullData() ?? null;
    const warPassword       = settingsForCcw.getWarPassword();
    const timerType         = bootTimerParams[0] as TimerTypeId;
    const openData          : CommonViewCommonWarBasicSettingsPageOpenData = {
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
                settingsType    : BasicSettingsTypeId.WarName,
                currentValue    : settingsForCcw.getWarName() ?? null,
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
                currentValue    : settingsForCcw.getWarComment() ?? null,
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
        throw newError(`CcrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: Undefinable<number>): Promise<OpenData> {
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
        gameModeId      : ModeId.Coop,
    };
}

async function checkIsMeetFilter({ roomId, roomPlayerInfo, roomStaticInfo, filter }: {
    roomId          : number;
    roomPlayerInfo  : Undefinable<CcrRoomPlayerInfo>;
    roomStaticInfo  : Undefinable<CcrRoomStaticInfo>;
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
            const normalMapId = roomStaticInfo ? (roomStaticInfo.getSettingsForCcw()?.getNormalMapId() ?? 0) : null;
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
